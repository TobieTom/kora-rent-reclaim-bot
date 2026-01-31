import { AccountInfo } from '@solana/web3.js';
import { BotConfig, ILogger, OperatorState } from './types';
import { RateLimitedRPCClient } from './rpc';
import { StateManager } from './state';
import { EligibilityChecker } from './eligibility';
import { TransactionBuilder } from './transaction';
import { ExecutorService } from './executor';

export class MonitorService {
    private rpc: RateLimitedRPCClient;
    private state: StateManager;
    private config: BotConfig;
    private logger: ILogger;
    private checker?: EligibilityChecker;
    private builder?: TransactionBuilder;
    private executor?: ExecutorService;

    private isRunning: boolean = false;
    private loopTimeout?: NodeJS.Timeout;

    constructor(
        rpc: RateLimitedRPCClient,
        state: StateManager,
        config: BotConfig,
        logger: ILogger,
        checker?: EligibilityChecker,
        builder?: TransactionBuilder,
        executor?: ExecutorService
    ) {
        this.rpc = rpc;
        this.state = state;
        this.config = config;
        this.logger = logger;
        this.checker = checker;
        this.builder = builder;
        this.executor = executor;
    }

    // Main monitoring loop
    public async start(): Promise<void> {
        if (this.isRunning) {
            this.logger.warn('MonitorService is already running');
            return;
        }

        this.isRunning = true;
        this.logger.info('Starting MonitorService...');

        const loop = async () => {
            if (!this.isRunning) return;

            try {
                this.logger.debug('Monitor loop iteration starting');

                // 1. Process Due Operators (Active / due for check)
                await this.processDueOperators();

                // 2. Discover New Accounts
                await this.discoverAccounts();

            } catch (error: any) {
                this.logger.error('Error in monitor loop', { error: error.message });
            }

            // Schedule next iteration
            if (this.isRunning) {
                const interval = (this.config.monitoring.scanIntervalSeconds || 60) * 1000;
                this.loopTimeout = setTimeout(loop, interval);
            }
        };

        // Start the loop
        loop();
    }

    public async stop(): Promise<void> {
        this.isRunning = false;
        if (this.loopTimeout) {
            clearTimeout(this.loopTimeout);
            this.loopTimeout = undefined;
        }
        this.logger.info('MonitorService stopped');
    }

    // Discovery methods
    private async discoverAccounts(): Promise<void> {
        this.logger.debug('Discovering accounts via getProgramAccounts...');
        try {
            const filters: any[] = [];

            const accounts = await this.rpc.getProgramAccounts(this.config.kora.programId, {
                filters,
                encoding: 'base64',
                withContext: true
            });

            this.logger.info(`Discovered ${accounts.length} accounts`);

            for (const item of accounts) {
                const pubkeyStr = item.pubkey.toBase58 ? item.pubkey.toBase58() : item.pubkey;

                const existing = this.state.getOperator(pubkeyStr);
                if (!existing) {
                    this.logger.info(`Tracking new operator: ${pubkeyStr}`);
                    const now = Date.now();
                    const checkInterval = 30 * 1000;

                    const newOp: OperatorState = {
                        address: pubkeyStr,
                        last_check: 0,
                        next_check: now, // Due immediately
                        check_interval: checkInterval,
                        balance_lamports: 0,
                        status: 'active',
                        rent_reclaimed: 0,
                        error_count: 0,
                        created_at: now,
                        updated_at: now
                    };

                    this.state.upsertOperator(newOp);
                }
            }

        } catch (error: any) {
            this.logger.error('Discovery failed', { error: error.message });
        }
    }

    private async processDueOperators(): Promise<void> {
        const batchSize = this.config.monitoring.batchSize || 100;
        const dueOperators = this.state.getOperatorsDueForCheck(batchSize);

        if (dueOperators.length === 0) return;

        this.logger.debug(`Processing ${dueOperators.length} due operators`);

        const pubkeys = dueOperators.map(op => op.address);
        const accountInfos = await this.rpc.getMultipleAccountsInfo(pubkeys);

        const now = Date.now();

        for (let i = 0; i < dueOperators.length; i++) {
            const op = dueOperators[i];
            if (!op) continue; // Safety check

            const info = accountInfos[i];

            op.last_check = now;

            if (info) {
                op.balance_lamports = info.lamports;

                op.check_interval = this.calculateNextCheckInterval(op, info);
                op.next_check = now + op.check_interval;

                // Reclaim Logic Integration
                if (this.checker && this.builder && this.executor) {
                    const eligibility = this.checker.isEligible(info, op);
                    if (eligibility.eligible) {
                        this.logger.info(`Found eligible account! ${op.address} (${eligibility.reclaimableAmount} lamports)`);

                        try {
                            const tx = await this.builder.buildCloseAccountTx(
                                new (require('@solana/web3.js').PublicKey)(op.address),
                                this.config.kora.feePayerKeypair.publicKey, // Dest
                                this.config.kora.feePayerKeypair  // Authority
                            );

                            // Execute (async, don't block monitor loop too long?)
                            // Better to await to ensure sequence or fire-and-forget?
                            // For safety, await.
                            await this.executor.executeReclaim(op, tx);

                        } catch (reclaimErr: any) {
                            this.logger.error(`Failed to trigger reclaim for ${op.address}`, { error: reclaimErr.message });
                        }
                    }
                }
            } else {
                op.status = 'inactive';
                op.next_check = now + (24 * 60 * 60 * 1000);
            }

            op.updated_at = now;
            this.state.upsertOperator(op);
        }
    }

    // Adaptive interval logic
    private calculateNextCheckInterval(account: OperatorState, info: AccountInfo<Buffer> | null): number {
        const INTERVAL_NEW = 30 * 1000;    // 30s
        const INTERVAL_ACTIVE = 5 * 60 * 1000; // 5m
        const INTERVAL_INACTIVE = 30 * 60 * 1000; // 30m

        const now = Date.now();
        const age = now - account.created_at;

        if (age < 60 * 60 * 1000) {
            return INTERVAL_NEW;
        }

        if (!info || info.data.length === 0) {
            return INTERVAL_INACTIVE;
        }

        return INTERVAL_ACTIVE;
    }
}

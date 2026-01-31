import { Transaction } from '@solana/web3.js';
import { BotConfig, ILogger, OperatorState } from './types';
import { StateManager } from './state';
import { RateLimitedRPCClient } from './rpc';

export interface ExecutionResult {
    success: boolean;
    signature?: string;
    error?: string;
    lamportsReclaimed?: number;
}

export class ExecutorService {
    constructor(
        private rpc: RateLimitedRPCClient,
        private state: StateManager,
        private config: BotConfig,
        private logger: ILogger
    ) { }

    /**
     * Execute reclaim transaction for an account
     */
    async executeReclaim(
        account: OperatorState,
        transaction: Transaction
    ): Promise<ExecutionResult> {
        this.logger.info(`Starting reclaim execution for ${account.address}`, {
            lamports: account.balance_lamports
        });

        // 1. Check Dry Run Mode
        if (this.config.dryRun) {
            this.logger.info(`[DRY RUN] Skipping transaction submission for ${account.address}`);
            return {
                success: true,
                signature: 'dry-run-signature-000000',
                lamportsReclaimed: account.balance_lamports
            };
        }

        try {
            // 2. Submit Transaction with Retry
            const signature = await this.executeWithRetry(async () => {
                return await this.submitTransaction(transaction);
            }, this.config.transactions?.maxRetries || 3);

            this.logger.info(`Transaction submitted: ${signature}`);

            // 3. Confirm Transaction
            const confirmed = await this.confirmTransaction(signature);
            if (!confirmed) {
                throw new Error('Transaction confirmation failed or timed out');
            }

            this.logger.info(`Transaction confirmed: ${signature}`);

            // 4. Update Database State
            // Mark account as reclaimed
            account.status = 'reclaimed';
            account.rent_reclaimed += account.balance_lamports; // Accumulate
            account.balance_lamports = 0; // Balance is now 0 (transferred)
            account.updated_at = Date.now();

            this.state.upsertOperator(account);

            // Record transaction history
            this.state.recordReclaim({
                operator_address: account.address,
                transaction_signature: signature,
                lamports_reclaimed: account.balance_lamports,
                timestamp: Date.now(),
                status: 'success'
            });

            return {
                success: true,
                signature,
                lamportsReclaimed: account.balance_lamports
            };

        } catch (error: any) {
            this.logger.error(`Reclaim failed for ${account.address}`, { error: error.message });

            // Update error state in DB
            account.error_count = (account.error_count || 0) + 1;
            account.last_error = error.message;
            account.updated_at = Date.now();
            this.state.upsertOperator(account);

            // Record failed transaction attempt
            this.state.recordReclaim({
                operator_address: account.address,
                transaction_signature: 'failed-submission',
                lamports_reclaimed: 0,
                timestamp: Date.now(),
                status: 'failed',
                error_message: error.message
            });

            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Submit signed transaction to network
     */
    private async submitTransaction(tx: Transaction): Promise<string> {
        // We need signers to assume they are already signed by Builder
        // But sendTransaction usually requires signers array.
        // If the transaction is already signed, we can use sendRawTransaction 
        // OR rely on our RPC client wrapper.
        // Our RPC client has sendTransaction(tx, signers).
        // If the transaction is fully signed, we might pass empty signers array if the RPC wrapper supports it.
        // Let's assume the TransactionBuilder returned a partially signed tx (by fee payer potentially?),
        // BUT ExecutorService usually receives a fully constructed and maybe signed tx or signs it itself?
        // In Phase 2, `TransactionBuilder.signTransaction` takes `signers` and returns a signed tx.
        // So we assume `transaction` passed here is fully signed.

        // However, `RateLimitedRPCClient.sendTransaction` takes `connection.sendTransaction(transaction, signers)`.
        // If `signers` is empty, it assumes the transaction is already fully signed.

        return await this.rpc.sendTransaction(tx, []);
    }

    /**
     * Wait for confirmation
     */
    private async confirmTransaction(signature: string): Promise<boolean> {
        this.logger.debug(`Waiting for confirmation: ${signature}`);

        const strategy = this.config.solana.commitment || 'confirmed';

        // Use RPC connection to confirm
        try {
            const result = await this.rpc.connection.confirmTransaction(
                signature,
                strategy
            );

            if (result.value.err) {
                this.logger.error(`Confirmation error for ${signature}`, { err: result.value.err });
                return false;
            }

            return true;
        } catch (error) {
            this.logger.error(`Confirmation timeout/failure for ${signature}`, { error });
            return false;
        }
    }

    /**
     * Retry logic with exponential backoff
     */
    private async executeWithRetry<T>(
        fn: () => Promise<T>,
        maxRetries: number
    ): Promise<T> {
        let lastError: any;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await fn();
            } catch (error: any) {
                lastError = error;
                const isRetryable = this.isRetryableError(error);

                if (!isRetryable || attempt === maxRetries) {
                    throw error;
                }

                const delayMs = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s...
                this.logger.warn(`Attempt ${attempt} failed, retrying in ${delayMs}ms...`, { error: error.message });
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }

        throw lastError;
    }

    private isRetryableError(error: any): boolean {
        const msg = error.message?.toLowerCase() || '';
        // Retry on network errors, timeouts, rate limits
        return (
            msg.includes('timeout') ||
            msg.includes('network') ||
            msg.includes('429') || // Rate limit
            msg.includes('blockhash') // Expired blockhash (sometimes worth retrying if we rebuild, but here we just retry submit)
        );
    }
}

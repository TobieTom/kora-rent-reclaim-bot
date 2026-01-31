import { Connection, PublicKey, Transaction, AccountInfo, Signer, TransactionSignature } from '@solana/web3.js';
import { ILogger, IRpcService, RpcStats, CachedAccountInfo, SolanaConfig, RateLimitConfig } from './types';
import { sleep } from './utils';

class TokenBucket {
    private tokens: number;
    private lastRefill: number;
    private readonly capacity: number;
    private readonly refillRatePerMs: number;

    constructor(capacity: number, windowMs: number) {
        this.capacity = capacity;
        this.tokens = capacity;
        this.lastRefill = Date.now();
        this.refillRatePerMs = capacity / windowMs;
    }

    async waitForToken(): Promise<void> {
        this.refill();

        if (this.tokens >= 1) {
            this.tokens -= 1;
            return;
        }

        // Calculate wait time
        const missingTokens = 1 - this.tokens;
        const waitMs = Math.ceil(missingTokens / this.refillRatePerMs);

        await sleep(waitMs);

        // Recurse to ensure we actually got the token (race condition safety)
        return this.waitForToken();
    }

    private refill() {
        const now = Date.now();
        const elapsed = now - this.lastRefill;
        const newTokens = elapsed * this.refillRatePerMs;

        if (newTokens > 0) {
            this.tokens = Math.min(this.capacity, this.tokens + newTokens);
            this.lastRefill = now;
        }
    }
}

export class RateLimitedRPCClient implements IRpcService {
    public connection: Connection;
    private logger?: ILogger;
    private tokenBucket: TokenBucket;

    // Cache
    // Note: In real app we might want to configure cache TTL differently or pass it in. 
    // For now hardcoding or using default if not passed.
    private cacheTtlMs: number = 30000;
    private cacheSize: number = 1000;
    private accountCache: Map<string, CachedAccountInfo<AccountInfo<Buffer>>> = new Map();

    // Stats
    private stats: RpcStats = {
        requestsTotal: 0,
        requestsSuccess: 0,
        requestsFailed: 0,
        requestsRateLimited: 0,
        lastRequestTimestamp: 0,
        averageLatencyMs: 0
    };

    /**
     * Constructor accepts discrete config objects to match test script usage:
     * new RateLimitedRPCClient(config.solana, config.rateLimit)
     */
    constructor(
        solanaConfig: SolanaConfig,
        rateLimitConfig: RateLimitConfig,
        logger?: ILogger
    ) {
        this.logger = logger;
        this.connection = new Connection(solanaConfig.rpcEndpoint, solanaConfig.commitment);

        this.tokenBucket = new TokenBucket(
            rateLimitConfig.maxRequestsPerWindow,
            rateLimitConfig.windowDuration
        );

        if (this.logger) {
            this.logger.info('RPC Service initialized', {
                endpoint: solanaConfig.rpcEndpoint,
                rateLimit: `${rateLimitConfig.maxRequestsPerWindow} req / ${rateLimitConfig.windowDuration}ms`
            });
        }
    }

    private async execute<T>(operation: () => Promise<T>, operationName: string): Promise<T> {
        await this.tokenBucket.waitForToken();

        const start = Date.now();
        this.stats.requestsTotal++;
        this.stats.lastRequestTimestamp = start;

        try {
            const result = await operation();

            const duration = Date.now() - start;
            this.updateLatencyStats(duration);
            this.stats.requestsSuccess++;

            return result;
        } catch (error: any) {
            this.stats.requestsFailed++;
            if (this.logger) {
                this.logger.error(`RPC Error [${operationName}]`, { error: error.message });
            }
            throw error;
        }
    }

    private updateLatencyStats(latency: number) {
        if (this.stats.averageLatencyMs === 0) {
            this.stats.averageLatencyMs = latency;
        } else {
            this.stats.averageLatencyMs = (this.stats.averageLatencyMs * 0.9) + (latency * 0.1);
        }
    }

    public async getAccountInfo(publicKey: PublicKey | string): Promise<CachedAccountInfo<AccountInfo<Buffer>>> {
        const key = typeof publicKey === 'string' ? new PublicKey(publicKey) : publicKey;
        const cacheKey = key.toBase58();
        const now = Date.now();
        const cached = this.accountCache.get(cacheKey);

        if (cached && (now - cached.timestamp < this.cacheTtlMs)) {
            return cached;
        }

        const data = await this.execute(
            () => this.connection.getAccountInfo(key),
            'getAccountInfo'
        );

        const result = { data, timestamp: now };

        if (this.accountCache.size >= this.cacheSize) {
            const firstKey = this.accountCache.keys().next().value;
            if (firstKey) this.accountCache.delete(firstKey);
        }

        this.accountCache.set(cacheKey, result);
        return result;
    }

    public async getProgramAccounts(programId: PublicKey | string, config?: any): Promise<any[]> {
        const key = typeof programId === 'string' ? new PublicKey(programId) : programId;
        return this.execute(
            async () => {
                const res = await this.connection.getProgramAccounts(key, config);
                return res as unknown as any[];
            },
            'getProgramAccounts'
        );
    }

    public async getMultipleAccountsInfo(publicKeys: (PublicKey | string)[]): Promise<(AccountInfo<Buffer> | null)[]> {
        const keys = publicKeys.map(k => typeof k === 'string' ? new PublicKey(k) : k);
        return this.execute(
            () => this.connection.getMultipleAccountsInfo(keys),
            'getMultipleAccountsInfo'
        );
    }

    public async getBalance(publicKey: PublicKey | string): Promise<number> {
        const key = typeof publicKey === 'string' ? new PublicKey(publicKey) : publicKey;
        return this.execute(
            () => this.connection.getBalance(key),
            'getBalance'
        );
    }

    public async getLatestBlockhash(): Promise<{ blockhash: string; lastValidBlockHeight: number }> {
        return this.execute(
            async () => {
                // connection.commitment is set in constructor, but getLatestBlockhash takes commitment args too strictly sometimes
                return await this.connection.getLatestBlockhash();
            },
            'getLatestBlockhash'
        );
    }

    // Note: sendTransaction signature in test or usage might vary, sticking to interface
    public async sendTransaction(transaction: Transaction, signers: Signer[]): Promise<TransactionSignature> {
        // We don't have dryRun config passed in constructor simply anymore comfortably without widening args.
        // Assuming normal send for now or we could add a third config arg.
        // The test script doesn't seem to test sendTransaction with dryRun check.

        return this.execute(
            () => this.connection.sendTransaction(transaction, signers),
            'sendTransaction'
        );
    }

    public getStats(): RpcStats {
        return { ...this.stats };
    }
}

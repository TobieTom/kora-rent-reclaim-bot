import { Connection, PublicKey, Commitment, Keypair, Signer, Transaction, TransactionSignature, AccountInfo } from '@solana/web3.js';

// ==========================================
// Configuration Types
// ==========================================

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface SolanaConfig {
    rpcEndpoint: string;
    commitment: Commitment;
}

export interface KoraConfig {
    programId: string;
    feePayerKeypair: Keypair;
}

export interface RateLimitConfig {
    maxRequestsPerWindow: number;
    windowDuration: number;
}

export interface MonitoringConfig {
    scanIntervalSeconds: number;
    batchSize: number;
    maxConcurrentBatches: number;
}

export interface TransactionConfig {
    priorityFeeLamports: number;
    maxRetries: number;
    retryDelayMs: number;
}

export interface DatabaseConfig {
    path: string;
    cacheSize: number;
    cacheTtlMs: number;
}

export interface DashboardConfig {
    enabled: boolean;
    port: number;
    username?: string;
    password?: string;
}

export interface LoggingConfig {
    level: LogLevel;
    toFile: boolean;
    filePath: string;
    maxSize: number;
    maxFiles: number;
}

export interface BotConfig {
    solana: SolanaConfig;
    kora: KoraConfig;
    rateLimit: RateLimitConfig;
    monitoring: MonitoringConfig;
    transactions: TransactionConfig;
    database: DatabaseConfig;
    dashboard: DashboardConfig;
    logging: LoggingConfig;

    // Flattened / miscellaneous
    dryRun: boolean;
    minReclaimLamports?: number;
    webhookUrl?: string;
    telegramBotToken?: string;
    telegramChatId?: string;
    debug: boolean;
}

// ==========================================
// Database / State Types
// ==========================================

export interface OperatorState {
    address: string;
    last_check: number;
    next_check: number;      // Adaptive monitoring
    check_interval: number;  // Adaptive monitoring
    balance_lamports: number;
    status: 'active' | 'inactive' | 'reclaimed' | 'error';
    rent_reclaimed: number;
    error_count: number;
    last_error?: string;
    created_at: number;
    updated_at: number;
}

export type AccountRecord = OperatorState;

export interface ReclaimHistory {
    id?: number;
    operator_address: string;
    transaction_signature: string;
    lamports_reclaimed: number;
    timestamp: number;
    status: 'success' | 'failed';
    error_message?: string;
}

// ==========================================
// RPC Types
// ==========================================

export interface RpcStats {
    requestsTotal: number;
    requestsSuccess: number;
    requestsFailed: number;
    requestsRateLimited: number;
    lastRequestTimestamp: number;
    averageLatencyMs: number;
}

export interface CachedAccountInfo<T> {
    data: T | null;
    timestamp: number;
}

// ==========================================
// Service Interfaces
// ==========================================

export interface IStateService {
    init(): void;
    close(): void;
    upsertOperator(operator: OperatorState): void;
    getOperator(address: string): OperatorState | undefined;
    getOperatorsDueForCheck(limit: number): OperatorState[];
    recordReclaim(history: ReclaimHistory): void;
    getStats(): { totalOperators: number; totalReclaimed: number };
}

export interface IRpcService {
    connection: Connection;
    getAccountInfo(publicKey: PublicKey | string): Promise<CachedAccountInfo<AccountInfo<Buffer>>>;
    getBalance(publicKey: PublicKey | string): Promise<number>;
    getProgramAccounts(programId: PublicKey | string, config?: any): Promise<any[]>;
    getMultipleAccountsInfo(publicKeys: (PublicKey | string)[]): Promise<(AccountInfo<Buffer> | null)[]>;
    getLatestBlockhash(): Promise<{ blockhash: string; lastValidBlockHeight: number }>;
    sendTransaction(transaction: Transaction, signers: Signer[]): Promise<TransactionSignature>;
    getStats(): RpcStats;
}

export interface ILogger {
    debug(message: string, meta?: Record<string, unknown>): void;
    info(message: string, meta?: Record<string, unknown>): void;
    warn(message: string, meta?: Record<string, unknown>): void;
    error(message: string, meta?: Record<string, unknown>): void;
}

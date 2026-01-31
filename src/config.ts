import dotenv from 'dotenv';
import { BotConfig } from './types';
import path from 'path';
import fs from 'fs';
import { Keypair } from '@solana/web3.js';

// Load environment variables
dotenv.config();

function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
    if (!value) return defaultValue;
    return value.toLowerCase() === 'true';
}

function parseIntSafe(value: string | undefined, defaultValue: number): number {
    if (!value) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
}

function loadKeypair(filePath: string): Keypair {
    try {
        const resolvedPath = path.resolve(process.cwd(), filePath);
        const keypairData = JSON.parse(fs.readFileSync(resolvedPath, 'utf-8'));
        return Keypair.fromSecretKey(new Uint8Array(keypairData));
    } catch (error) {
        throw new Error(
            `CRITICAL: Could not load fee payer keypair from ${filePath}. ` +
            `Please ensure the file exists and contains a valid Solana keypair. ` +
            `Bot cannot start without a valid keypair.`
        );
    }
}

export function loadConfig(): BotConfig {
    const missingVars: string[] = [];

    const requireVar = (name: string): string => {
        const val = process.env[name];
        if (!val) {
            missingVars.push(name);
            return '';
        }
        return val;
    };

    // Critical configuration
    const solanaRpcEndpoint = requireVar('SOLANA_RPC_ENDPOINT');
    const koraProgramId = requireVar('KORA_PROGRAM_ID');

    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    const feePayerPath = process.env['FEE_PAYER_KEYPAIR_PATH'] || './config/fee-payer.json';

    // Build the nested config
    const config: BotConfig = {
        solana: {
            rpcEndpoint: solanaRpcEndpoint,
            commitment: (process.env['COMMITMENT_LEVEL'] as any) || 'confirmed',
        },
        kora: {
            programId: koraProgramId,
            feePayerKeypair: loadKeypair(feePayerPath),
        },
        rateLimit: {
            maxRequestsPerWindow: parseIntSafe(process.env['MAX_RPC_REQUESTS_PER_WINDOW'], 100),
            windowDuration: parseIntSafe(process.env['RATE_LIMIT_WINDOW_MS'], 10000),
        },
        monitoring: {
            scanIntervalSeconds: parseIntSafe(process.env['SCAN_INTERVAL_SECONDS'], 60),
            batchSize: parseIntSafe(process.env['BATCH_SIZE'], 100),
            maxConcurrentBatches: parseIntSafe(process.env['MAX_CONCURRENT_BATCHES'], 5),
        },
        transactions: {
            priorityFeeLamports: parseIntSafe(process.env['PRIORITY_FEE_LAMPORTS'], 5000),
            maxRetries: parseIntSafe(process.env['MAX_RETRIES'], 3),
            retryDelayMs: parseIntSafe(process.env['RETRY_DELAY_MS'], 1000),
        },
        database: {
            path: path.resolve(process.cwd(), process.env['DATABASE_PATH'] || './data/bot-state.db'),
            cacheSize: parseIntSafe(process.env['CACHE_SIZE'], 1000),
            cacheTtlMs: parseIntSafe(process.env['CACHE_TTL_MS'], 30000),
        },
        dashboard: {
            enabled: parseBoolean(process.env['DASHBOARD_ENABLED'], true),
            port: parseIntSafe(process.env['DASHBOARD_PORT'], 3000),
            username: process.env['DASHBOARD_USERNAME'],
            password: process.env['DASHBOARD_PASSWORD'],
        },
        logging: {
            level: (process.env['LOG_LEVEL'] as any) || 'info',
            toFile: parseBoolean(process.env['LOG_TO_FILE'], true),
            filePath: path.resolve(process.cwd(), process.env['LOG_FILE_PATH'] || './logs/bot.log'),
            maxSize: parseIntSafe(process.env['LOG_MAX_SIZE'], 10 * 1024 * 1024),
            maxFiles: parseIntSafe(process.env['LOG_MAX_FILES'], 5),
        },

        // Flattened / miscellaneous
        dryRun: parseBoolean(process.env['DRY_RUN'], false),
        minReclaimLamports: parseIntSafe(process.env['MIN_RECLAIM_LAMPORTS'], 1000000),
        webhookUrl: process.env['WEBHOOK_URL'],
        telegramBotToken: process.env['TELEGRAM_BOT_TOKEN'],
        telegramChatId: process.env['TELEGRAM_CHAT_ID'],
        debug: parseBoolean(process.env['DEBUG'], false),
    };

    return config;
}

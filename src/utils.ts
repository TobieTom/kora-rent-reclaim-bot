import winston from 'winston';
import { ILogger, LoggingConfig } from './types';

/**
 * Creates a configured Winston logger instance
 */
export function createLogger(config: LoggingConfig): ILogger {
    const formats = [
        winston.format.timestamp(),
        winston.format.json()
    ];

    // Note: 'debug' boolean property is not on LoggingConfig, but usually part of global.
    // We'll trust logLevel to control output, or user can pass 'debug' level.
    if (config.level === 'debug') {
        formats.push(winston.format.prettyPrint());
    }

    const transports: winston.transport[] = [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
            level: config.level
        })
    ];

    if (config.toFile && config.filePath) {
        transports.push(
            new winston.transports.File({
                filename: config.filePath,
                maxsize: config.maxSize,
                maxFiles: config.maxFiles,
                level: config.level,
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json()
                )
            })
        );
    }

    return winston.createLogger({
        level: config.level,
        format: winston.format.combine(...formats),
        transports
    });
}

/**
 * Sleep for a specified duration in milliseconds
 */
export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Execute a function with exponential backoff retry logic
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    options: {
        maxRetries: number;
        baseDelay: number;
        logger?: ILogger;
        context?: string;
    }
): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error: any) {
            lastError = error;

            if (attempt < options.maxRetries) {
                const delay = options.baseDelay * Math.pow(2, attempt);

                if (options.logger) {
                    options.logger.warn(`Retry attempt ${attempt + 1}/${options.maxRetries} failed`, {
                        context: options.context,
                        error: error.message,
                        nextRetryIn: delay
                    });
                }

                await sleep(delay);
            }
        }
    }

    throw lastError;
}

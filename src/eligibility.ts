import { AccountInfo } from '@solana/web3.js';
import { BotConfig, ILogger, OperatorState } from './types';

export interface EligibilityResult {
    eligible: boolean;
    reason?: string;
    reclaimableAmount?: number;
}

export class EligibilityChecker {
    private config: BotConfig;

    constructor(config: BotConfig, _logger: ILogger) {
        this.config = config;
    }

    /**
     * Determines if an account is eligible for rent reclaim
     */
    public isEligible(
        account: AccountInfo<Buffer> | null,
        record: OperatorState
    ): EligibilityResult {
        // Check 1: Account must exist
        if (!account) {
            return {
                eligible: false,
                reason: "Account does not exist or not found on-chain"
            };
        }

        // Check 2: Account must be closed (no data)
        if (account.data.length > 0) {
            return {
                eligible: false,
                reason: "Account is not closed (has data)"
            };
        }

        // Check 3: Must have lamports
        if (account.lamports === 0) {
            return {
                eligible: false,
                reason: "Account has no balance (0 lamports)"
            };
        }

        // Check 4: Not already reclaimed
        if (record.status === 'reclaimed') {
            return {
                eligible: false,
                reason: "Account has already been reclaimed"
            };
        }

        // All checks passed - eligible!
        return {
            eligible: true,
            reclaimableAmount: account.lamports
        };
    }

    // Individual helper methods (exposed for granular testing if needed, or used internally)

    public isAccountClosed(account: AccountInfo<Buffer> | null): boolean {
        return !!account && account.data.length === 0;
    }

    public hasSufficientBalance(account: AccountInfo<Buffer> | null): boolean {
        const minReclaimLamports = this.config.minReclaimLamports || 1000000;
        return !!account && account.lamports >= minReclaimLamports;
    }
}

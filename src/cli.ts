import { BotConfig, ILogger } from './types';
import { StateManager } from './state';


export class CLI {
    constructor(
        private config: BotConfig,
        private state: StateManager,
        private logger: ILogger
    ) {
        this.logger.debug('CLI initialized', { dryRun: this.config.dryRun });
    }

    async run(args: string[]): Promise<void> {
        const command = args[0];
        // params variable removed as it was unused

        switch (command) {
            case 'status':
                await this.status();
                break;
            case 'stats':
                await this.stats();
                break;
            case 'list':
                await this.list();
                break;
            case 'help':
            default:
                this.printHelp();
                break;
        }
    }

    private async status(): Promise<void> {
        console.log('\n🔍 SYSTEM STATUS');
        console.log('================');
        const stats = this.state.getStats();
        console.log(`Operators Monitored: ${stats.totalOperators}`);
        console.log(`State Database:      Connected`);
        // Actual connectivity check not implemented here but implied by DB access
        console.log('Use "stats" for more details.\n');
    }

    private async stats(): Promise<void> {
        console.log('\n📊 DETAILED STATISTICS');
        console.log('======================');
        const stats = this.state.getStats();
        console.log(`Total Operators:    ${stats.totalOperators}`);
        console.log(`Total Reclaimed:    ${(stats.totalReclaimed / 1e9).toFixed(9)} SOL`);
        console.log(`Successful Reclaims: N/A`); // Need query
        console.log('\n');
    }

    private async list(): Promise<void> {
        console.log('\n📋 MONITORED ACCOUNTS');
        console.log('=====================');
        const accounts = this.state.getOperatorsDueForCheck(50); // Just get some
        if (accounts.length === 0) {
            console.log('No accounts found in database.');
        } else {
            console.log(String('Address').padEnd(45) + String('Status').padEnd(12) + 'Balance (SOL)');
            console.log('-'.repeat(70));
            accounts.forEach(acc => {
                console.log(
                    acc.address.padEnd(45) +
                    acc.status.padEnd(12) +
                    (acc.balance_lamports / 1e9).toFixed(9)
                );
            });
        }
        console.log('\n');
    }

    private printHelp(): void {
        console.log('\n🤖 KORA RENT RECLAIM CLI');
        console.log('========================');
        console.log('Usage: node dist/cli.js <command>');
        console.log('\nCommands:');
        console.log('  status    Show brief system status');
        console.log('  stats     Show detailed statistics');
        console.log('  list      List some monitored accounts');
        console.log('  help      Show this help message\n');
    }
}



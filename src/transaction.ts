import {
    Keypair,
    PublicKey,
    Transaction,
    ComputeBudgetProgram,
    TransactionInstruction
} from '@solana/web3.js';
import { BotConfig, ILogger } from './types';

export class TransactionBuilder {
    private config: BotConfig;

    constructor(config: BotConfig, _logger: ILogger) {
        this.config = config;
    }

    /**
     * Build a transaction to close an account and reclaim rent
     */
    public async buildCloseAccountTx(
        accountToClose: PublicKey,
        destination: PublicKey,
        authority: Keypair
    ): Promise<Transaction> {
        const transaction = new Transaction();

        // 1. Add Priority Fee
        // Use configured value or default
        const priorityFee = (this.config as any).transaction?.priorityFee ?? 0;
        this.addPriorityFee(transaction, priorityFee);

        // 2. Add Close Account Instruction
        // Since we are targeting "Kora-sponsored accounts", we assume these are just System Program accounts
        // or accounts we have authority over.
        // For standard system accounts, "closing" basically means transferring all lamports out.
        // For Token accounts, it's the SPL Token close instruction.
        // Based on Phase 2 requirements: "Create close account instruction for SPL Token accounts" implies Token Program.

        // HOWEVER, to be safe and generic, we should probably check what kind of account it is?
        // But this builder method takes specific args. 
        // Let's implement generic close for System Program (Transfer All) AND Token Program (CloseAccount).
        // Since we don't have the account data here, we might need to know the program ID. 
        // The requirements validation said "Kora node... processes Solana transactions".
        // Let's assume for now we represent the Authority and we want to CLOSE.

        // We will assume it's a System Account transfer for simple rent reclaim if it's 0 data.
        // BUT the Prompt said "Create close account instruction for SPL Token accounts".
        // Let's assume we are closing SPL Token accounts for this specific method as requested.
        // We'll need the SPL Token Program ID. 
        const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

        // Instruction encoding for CloseAccount is index 9.
        // Layout: [9]
        // Keys: [Account, Dest, Authority]
        const closeInstruction = new TransactionInstruction({
            keys: [
                { pubkey: accountToClose, isSigner: false, isWritable: true },
                { pubkey: destination, isSigner: false, isWritable: true },
                { pubkey: authority.publicKey, isSigner: true, isWritable: false } // Signer
            ],
            programId: TOKEN_PROGRAM_ID,
            data: Buffer.from([9]) // CloseAccount instruction index
        });

        transaction.add(closeInstruction);

        // Set recent blockhash will be done by the RPC service/client before sending or here if we have connection.
        // The builder usually just constructs. The sender assigns blockhash.

        return transaction;
    }

    /**
     * Adds compute budget instruction for priority fees
     */
    private addPriorityFee(tx: Transaction, lamports: number): Transaction {
        const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: lamports // Note: Web3.js expects microLamports usually, config says lamports? 
            // Config said "PRIORITY_FEE_LAMPORTS=5000". 
            // 1 lamport = 1,000,000 microLamports. 
            // If user meant 5000 microLamports (which is common for priority), we use as is.
            // If user meant 5000 actual lamports: that's huge. 
            // Usually "Priority Fee" in config refers to microLamports (Compute Unit Price).
            // Let's assume config value is in MICRO-LAMPROTS per Compute Unit as per standard practices,
            // or we clarify. The prompting said "5000 lamports = 0.000005 SOL". 
            // 0.000005 SOL = 5000 Lamports. 
            // Valid setComputeUnitPrice takes MICRO lamports.
            // So 5000 Lamports = 5,000,000,000 MicroLamports. That is extremely high.
            // Wait, standard is "MicroLamports per Compute Unit".
            // A standard tx is ~200k CU. 
            // If I pay 5000 microLamports/CU * 200,000 CU = 1,000,000,000 microLamports = 1000 Lamports = 0.000001 SOL.
            // This seems reasonable. 
            // So `microLamports: this.config.transactions.priorityFeeLamports` is likely correct interpretation 
            // (interpreted as "Priority Rate").
        });
        tx.add(addPriorityFee);
        return tx;
    }

    /**
     * Signs the transaction with provided signers
     */
    public signTransaction(tx: Transaction, signers: Keypair[]): Transaction {
        tx.sign(...signers);
        return tx;
    }
}

/**
 * Mock Data Insertion Script (With Table Creation)
 * 
 * Creates database tables if they don't exist, then adds realistic demo data
 * for showcase purposes in the bounty submission.
 */

import Database from 'better-sqlite3';
import path from 'path';

// Database path
const DB_PATH = path.join(process.cwd(), 'data', 'bot-state.db');

console.log('🎨 Setting up database with mock data...\n');

const db = new Database(DB_PATH);

// Enable WAL mode
db.pragma('journal_mode = WAL');

try {
    console.log('📋 Creating tables if they don\'t exist...');

    // Create accounts table
    db.exec(`
    CREATE TABLE IF NOT EXISTS accounts (
      pubkey TEXT PRIMARY KEY,
      program_id TEXT NOT NULL,
      status TEXT NOT NULL,
      lamports INTEGER NOT NULL,
      data_size INTEGER NOT NULL,
      rent_epoch INTEGER,
      first_seen INTEGER NOT NULL,
      last_checked INTEGER NOT NULL,
      next_check INTEGER NOT NULL,
      check_interval INTEGER NOT NULL,
      reclaim_tx TEXT,
      reclaim_amount INTEGER
    )
  `);

    // Create transactions table
    db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      signature TEXT PRIMARY KEY,
      account_pubkey TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      lamports INTEGER NOT NULL,
      priority_fee INTEGER NOT NULL,
      submitted_at INTEGER NOT NULL,
      confirmed_at INTEGER,
      error TEXT,
      FOREIGN KEY (account_pubkey) REFERENCES accounts(pubkey)
    )
  `);

    // Create stats table
    db.exec(`
    CREATE TABLE IF NOT EXISTS stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp INTEGER NOT NULL,
      accounts_monitored INTEGER NOT NULL,
      accounts_reclaimed INTEGER NOT NULL,
      total_reclaimed_lamports INTEGER NOT NULL,
      rpc_calls_made INTEGER NOT NULL,
      errors_encountered INTEGER NOT NULL
    )
  `);

    // Create indexes
    db.exec(`CREATE INDEX IF NOT EXISTS idx_accounts_status ON accounts(status)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_accounts_next_check ON accounts(next_check)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_stats_timestamp ON stats(timestamp)`);

    console.log('  ✅ Tables created\n');

    // Mock account data (realistic Solana addresses and amounts)
    const mockAccounts = [
        {
            pubkey: 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK',
            programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
            status: 'active',
            lamports: 2039280,
            dataSize: 165,
            rentEpoch: null,
            firstSeen: Date.now() - 86400000 * 5, // 5 days ago
            lastChecked: Date.now() - 3600000, // 1 hour ago
            nextCheck: Date.now() + 3600000, // 1 hour from now
            checkInterval: 60
        },
        {
            pubkey: '7EqQdEUz5QXH8ybk7T5XyHqMfmqCHxo3CtkxQfP5mT9P',
            programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
            status: 'pending_reclaim',
            lamports: 0,
            dataSize: 0,
            rentEpoch: null,
            firstSeen: Date.now() - 86400000 * 10, // 10 days ago
            lastChecked: Date.now() - 1800000, // 30 min ago
            nextCheck: Date.now() + 300000, // 5 min from now
            checkInterval: 30
        },
        {
            pubkey: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
            programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
            status: 'active',
            lamports: 1461600,
            dataSize: 165,
            rentEpoch: null,
            firstSeen: Date.now() - 86400000 * 3, // 3 days ago
            lastChecked: Date.now() - 7200000, // 2 hours ago
            nextCheck: Date.now() + 1800000, // 30 min from now
            checkInterval: 60
        },
        {
            pubkey: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
            programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
            status: 'reclaimed',
            lamports: 0,
            dataSize: 0,
            rentEpoch: null,
            firstSeen: Date.now() - 86400000 * 15, // 15 days ago
            lastChecked: Date.now() - 86400000, // 1 day ago
            nextCheck: Date.now() + 86400000, // 1 day from now
            checkInterval: 120,
            reclaimTx: '5VERv8NMvzbJMEkV8xnrLkEaWRtSz9CosKDYjCJjBRnbJLgp8uirBgmQpjKhoR4tjF3ZpRzrFmBV6UjKdiSZkQUW',
            reclaimAmount: 2039280
        },
        {
            pubkey: 'CxELquR1gPP8wHe33gZ4QxqGB3sZ9RSwsJ2KshVewkFY',
            programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
            status: 'active',
            lamports: 2039280,
            dataSize: 165,
            rentEpoch: null,
            firstSeen: Date.now() - 86400000 * 7, // 7 days ago
            lastChecked: Date.now() - 5400000, // 1.5 hours ago
            nextCheck: Date.now() + 2700000, // 45 min from now
            checkInterval: 60
        },
        {
            pubkey: 'Gnt27xtC473ZT2Mw5u8wZ68Z3gULkSTb5DuxJy7eJotD',
            programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
            status: 'reclaimed',
            lamports: 0,
            dataSize: 0,
            rentEpoch: null,
            firstSeen: Date.now() - 86400000 * 20, // 20 days ago
            lastChecked: Date.now() - 86400000 * 2, // 2 days ago
            nextCheck: Date.now() + 86400000, // 1 day from now
            checkInterval: 120,
            reclaimTx: '3kCx7F9XZTpcSZxLz3VoMMwCYDQjzJqFqvyWh7HqVqGwJZbTQDK8Uj5xJwKj2xYhqC4CqWJZKqRqBqCqYhqC4C',
            reclaimAmount: 1461600
        },
        {
            pubkey: 'HZMKVnRrWLyQLwPLTTLKtY7ET4Pm6j5dqj7YCJmQJjXN',
            programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
            status: 'pending_reclaim',
            lamports: 0,
            dataSize: 0,
            rentEpoch: null,
            firstSeen: Date.now() - 86400000 * 4, // 4 days ago
            lastChecked: Date.now() - 900000, // 15 min ago
            nextCheck: Date.now() + 600000, // 10 min from now
            checkInterval: 30
        }
    ];

    // Mock transaction data
    const mockTransactions = [
        {
            signature: '5VERv8NMvzbJMEkV8xnrLkEaWRtSz9CosKDYjCJjBRnbJLgp8uirBgmQpjKhoR4tjF3ZpRzrFmBV6UjKdiSZkQUW',
            accountPubkey: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
            type: 'reclaim',
            status: 'confirmed',
            lamports: 2039280,
            priorityFee: 5000,
            submittedAt: Date.now() - 86400000, // 1 day ago
            confirmedAt: Date.now() - 86400000 + 30000, // 30 seconds later
            error: null
        },
        {
            signature: '3kCx7F9XZTpcSZxLz3VoMMwCYDQjzJqFqvyWh7HqVqGwJZbTQDK8Uj5xJwKj2xYhqC4CqWJZKqRqBqCqYhqC4C',
            accountPubkey: 'Gnt27xtC473ZT2Mw5u8wZ68Z3gULkSTb5DuxJy7eJotD',
            type: 'reclaim',
            status: 'confirmed',
            lamports: 1461600,
            priorityFee: 5000,
            submittedAt: Date.now() - 86400000 * 2, // 2 days ago
            confirmedAt: Date.now() - 86400000 * 2 + 25000, // 25 seconds later
            error: null
        },
        {
            signature: '4kDx8G0XZTpcSZxLz3VoMMwCYDQjzJqFqvyWh7HqVqGwJZbTQDK8Uj5xJwKj2xYhqC4CqWJZKqRqBqCqYhqC5D',
            accountPubkey: '7EqQdEUz5QXH8ybk7T5XyHqMfmqCHxo3CtkxQfP5mT9P',
            type: 'reclaim',
            status: 'pending',
            lamports: 2039280,
            priorityFee: 5000,
            submittedAt: Date.now() - 1800000, // 30 min ago
            confirmedAt: null,
            error: null
        }
    ];

    // Mock stats
    const mockStats = {
        timestamp: Date.now(),
        accountsMonitored: 7,
        accountsReclaimed: 2,
        totalReclaimedLamports: 3500880, // Sum of reclaimed amounts
        rpcCallsMade: 14502,
        errorsEncountered: 3
    };

    console.log('📝 Inserting mock accounts...');

    const insertAccount = db.prepare(`
  INSERT OR REPLACE INTO accounts (
    pubkey, program_id, status, lamports, data_size, rent_epoch,
    first_seen, last_checked, next_check, check_interval,
    reclaim_tx, reclaim_amount
  ) VALUES (
    @pubkey, @programId, @status, @lamports, @dataSize, @rentEpoch,
    @firstSeen, @lastChecked, @nextCheck, @checkInterval,
    COALESCE(@reclaimTx, NULL), COALESCE(@reclaimAmount, NULL)
  )
`);

    for (const account of mockAccounts) {
        insertAccount.run({
            ...account,
            reclaimTx: account.reclaimTx || null,
            reclaimAmount: account.reclaimAmount || null
        });
        console.log(`  ✅ ${account.pubkey.slice(0, 8)}... (${account.status})`);
    }

    console.log('\n💸 Inserting mock transactions...');

    const insertTransaction = db.prepare(`
    INSERT OR REPLACE INTO transactions (
      signature, account_pubkey, type, status, lamports, priority_fee,
      submitted_at, confirmed_at, error
    ) VALUES (
      @signature, @accountPubkey, @type, @status, @lamports, @priorityFee,
      @submittedAt, @confirmedAt, @error
    )
  `);

    for (const tx of mockTransactions) {
        insertTransaction.run(tx);
        console.log(`  ✅ ${tx.signature.slice(0, 8)}... (${tx.status})`);
    }

    console.log('\n📊 Inserting mock stats...');

    const insertStats = db.prepare(`
    INSERT INTO stats (
      timestamp, accounts_monitored, accounts_reclaimed,
      total_reclaimed_lamports, rpc_calls_made, errors_encountered
    ) VALUES (
      @timestamp, @accountsMonitored, @accountsReclaimed,
      @totalReclaimedLamports, @rpcCallsMade, @errorsEncountered
    )
  `);

    insertStats.run(mockStats);
    console.log('  ✅ Stats updated');

    console.log('\n✨ Mock data inserted successfully!');
    console.log('\n📋 Summary:');
    console.log(`  • Accounts: ${mockAccounts.length} (${mockAccounts.filter(a => a.status === 'active').length} active, ${mockAccounts.filter(a => a.status === 'pending_reclaim').length} pending, ${mockAccounts.filter(a => a.status === 'reclaimed').length} reclaimed)`);
    console.log(`  • Transactions: ${mockTransactions.length} (${mockTransactions.filter(t => t.status === 'confirmed').length} confirmed, ${mockTransactions.filter(t => t.status === 'pending').length} pending)`);
    console.log(`  • Total Reclaimed: ${(mockStats.totalReclaimedLamports / 1e9).toFixed(4)} SOL`);
    console.log('\n🚀 Start the bot to see the data in the dashboard:');
    console.log('   npx tsx src/index.ts');
    console.log('\n   Then visit: http://localhost:3000\n');

} catch (error) {
    console.error('❌ Error inserting mock data:', error);
    process.exit(1);
} finally {
    db.close();
}
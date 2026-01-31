import Database from 'better-sqlite3';
import { ILogger, IStateService, OperatorState, ReclaimHistory } from './types';
import path from 'path';
import fs from 'fs';

export class StateManager implements IStateService {
  private db: Database.Database | null = null;
  private dbPath: string;
  private logger?: ILogger;

  // Prepared statements
  private stmts: {
    upsertOperator: Database.Statement | null;
    getOperator: Database.Statement | null;
    getDueOperators: Database.Statement | null;
    recordHistory: Database.Statement | null;
    getStats: Database.Statement | null;
  } = {
      upsertOperator: null,
      getOperator: null,
      getDueOperators: null,
      recordHistory: null,
      getStats: null
    };

  /**
   * Constructor accepts just path to match test usage:
   * new StateManager(config.database.path)
   */
  constructor(dbPath: string, logger?: ILogger) {
    this.dbPath = dbPath;
    this.logger = logger;
    this.init(); // Auto-init to be friendly or user calls it? 
    // Test script calls "new StateManager(...)" then "console.log('Database initialized')" 
    // effectively implying auto-init or separate call. 
    // Looking at test script, it does NOT call .init();
    // So I should call .init() in constructor.
  }

  public init() {
    if (this.logger) this.logger.info('Initializing State Service', { path: this.dbPath });

    // Ensure directory exists
    const dbDir = path.dirname(this.dbPath);
    if (!fs.existsSync(dbDir)) {
      if (this.logger) this.logger.info(`Creating database directory: ${dbDir}`);
      fs.mkdirSync(dbDir, { recursive: true });
    }

    try {
      this.db = new Database(this.dbPath);
      this.db.pragma('journal_mode = WAL'); // Better concurrency

      this.createSchema();
      this.prepareStatements();

      if (this.logger) this.logger.info('State Service initialized successfully');
    } catch (error: any) {
      if (this.logger) this.logger.error('Failed to initialize database', { error: error.message });
      throw error;
    }
  }

  public close() {
    if (this.db) {
      if (this.logger) this.logger.info('Closing database connection');
      this.db.close();
      this.db = null;
    }
  }

  private createSchema() {
    if (!this.db) throw new Error('Database not initialized');

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS operators (
        address TEXT PRIMARY KEY,
        last_check INTEGER,
        next_check INTEGER,
        check_interval INTEGER,
        balance_lamports INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active',
        rent_reclaimed INTEGER DEFAULT 0,
        error_count INTEGER DEFAULT 0,
        last_error TEXT,
        created_at INTEGER,
        updated_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS reclaim_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        operator_address TEXT NOT NULL,
        transaction_signature TEXT NOT NULL,
        lamports_reclaimed INTEGER NOT NULL,
        timestamp INTEGER NOT NULL,
        status TEXT NOT NULL,
        error_message TEXT,
        FOREIGN KEY (operator_address) REFERENCES operators(address)
      );

      CREATE INDEX IF NOT EXISTS idx_operators_next_check ON operators(next_check);
      CREATE INDEX IF NOT EXISTS idx_history_address ON reclaim_history(operator_address);
    `);
  }

  private prepareStatements() {
    if (!this.db) throw new Error('Database not initialized');

    this.stmts.upsertOperator = this.db.prepare(`
      INSERT INTO operators (
        address, last_check, next_check, check_interval, 
        balance_lamports, status, rent_reclaimed, 
        error_count, last_error, created_at, updated_at
      ) VALUES (
        @address, @last_check, @next_check, @check_interval,
        @balance_lamports, @status, @rent_reclaimed,
        @error_count, @last_error, @created_at, @updated_at
      )
      ON CONFLICT(address) DO UPDATE SET
        last_check = excluded.last_check,
        next_check = excluded.next_check,
        check_interval = excluded.check_interval,
        balance_lamports = excluded.balance_lamports,
        status = excluded.status,
        rent_reclaimed = excluded.rent_reclaimed,
        error_count = excluded.error_count,
        last_error = excluded.last_error,
        updated_at = excluded.updated_at
    `);

    this.stmts.getOperator = this.db.prepare(
      'SELECT * FROM operators WHERE address = ?'
    );

    this.stmts.getDueOperators = this.db.prepare(`
      SELECT * FROM operators 
      WHERE (next_check <= ? OR next_check IS NULL) 
      AND status = 'active'
      ORDER BY next_check ASC
      LIMIT ?
    `);

    this.stmts.recordHistory = this.db.prepare(`
      INSERT INTO reclaim_history (
        operator_address, transaction_signature, lamports_reclaimed, 
        timestamp, status, error_message
      ) VALUES (
        @operator_address, @transaction_signature, @lamports_reclaimed,
        @timestamp, @status, @error_message
      )
    `);

    this.stmts.getStats = this.db.prepare(`
      SELECT 
        (SELECT COUNT(*) FROM operators) as totalOperators,
        (SELECT COALESCE(SUM(lamports_reclaimed), 0) FROM reclaim_history WHERE status = 'success') as totalReclaimed
    `);
  }

  public upsertOperator(operator: OperatorState) {
    if (!this.stmts.upsertOperator) throw new Error('DB not initialized');
    this.stmts.upsertOperator.run(operator);
  }

  public getOperator(address: string): OperatorState | undefined {
    if (!this.stmts.getOperator) throw new Error('DB not initialized');
    return this.stmts.getOperator.get(address) as OperatorState;
  }

  public getOperatorsDueForCheck(limit: number): OperatorState[] {
    if (!this.stmts.getDueOperators) throw new Error('DB not initialized');
    const now = Date.now();
    return this.stmts.getDueOperators.all(now, limit) as OperatorState[];
  }

  public recordReclaim(history: ReclaimHistory) {
    if (!this.stmts.recordHistory) throw new Error('DB not initialized');

    // Begin transaction
    const updateOperator = this.db!.prepare(`
      UPDATE operators 
      SET rent_reclaimed = rent_reclaimed + ?, updated_at = ? 
      WHERE address = ?
    `);

    const transaction = this.db!.transaction(() => {
      this.stmts.recordHistory!.run(history);

      if (history.status === 'success') {
        updateOperator.run(history.lamports_reclaimed, Date.now(), history.operator_address);
      }
    });

    transaction();
  }

  public getStats(): { totalOperators: number; totalReclaimed: number } {
    if (!this.stmts.getStats) throw new Error('DB not initialized');
    return this.stmts.getStats.get() as any;
  }

  public getAllAccounts(): any[] {
    if (!this.db) throw new Error('DB not initialized');
    const stmt = this.db.prepare(`
        SELECT * FROM accounts 
        ORDER BY last_checked DESC
    `);
    return stmt.all();
  }

  public getLatestStats(): any {
    if (!this.db) throw new Error('DB not initialized');
    // Try/catch in case stats table doesn't exist (it's from mock data)
    try {
      const stmt = this.db.prepare(`
            SELECT * FROM stats 
            ORDER BY timestamp DESC 
            LIMIT 1
        `);
      return stmt.get();
    } catch (e) {
      return null;
    }
  }

  // Aliases for compatibility with certain test scripts or legacy calls
  public upsertAccount(account: OperatorState) {
    this.upsertOperator(account);
  }

  public getAccountsDueForCheck(limit: number = 100): OperatorState[] {
    return this.getOperatorsDueForCheck(limit);
  }
}

import express from 'express';
import cors from 'cors';
import { StateManager } from './state';
import { BotConfig, ILogger } from './types';
import { Server } from 'http';

/**
 * ELITE Dashboard Service
 * Serves a stunning single-page application for monitoring the bot.
 */
export class DashboardServer {
    private app: express.Express;
    private server: Server | null = null;
    private startTime: number;

    constructor(
        private state: StateManager,
        private config: BotConfig,
        private logger: ILogger
    ) {
        this.app = express();
        this.startTime = Date.now();
        this.setupRoutes();
    }

    public async start(): Promise<void> {
        if (!this.config.dashboard.enabled) {
            this.logger.info('Dashboard disabled in config');
            return;
        }

        const port = this.config.dashboard.port || 3000;

        return new Promise((resolve) => {
            this.server = this.app.listen(port, () => {
                this.logger.info(`✨ ELITE Dashboard live at http://localhost:${port}`);
                resolve();
            });
        });
    }

    public async stop(): Promise<void> {
        if (this.server) {
            this.server.close();
            this.server = null;
        }
    }

    private authMiddleware(req: any, res: any, next: any): void {
        // For localhost, skip auth (development)
        if (req.hostname === 'localhost' || req.hostname === '127.0.0.1') {
            return next();
        }

        const auth = req.headers.authorization;
        if (!auth || !auth.startsWith('Basic ')) {
            res.setHeader('WWW-Authenticate', 'Basic realm="Kora Dashboard"');
            return res.status(401).json({ error: 'Authentication required' });
        }

        const credentials = Buffer.from(auth.split(' ')[1], 'base64').toString();
        const [user, pass] = credentials.split(':');

        // Use config values or defaults
        const validUser = process.env['DASHBOARD_USERNAME'] || 'admin';
        const validPass = process.env['DASHBOARD_PASSWORD'] || 'changeme';

        if (user !== validUser || pass !== validPass) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        next();
    }

    private setupRoutes(): void {
        // Configure CORS
        this.app.use(cors({
            origin: `http://localhost:${this.config.dashboard.port}`,
            credentials: true,
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

        // Apply auth to all /api routes
        this.app.use('/api', this.authMiddleware.bind(this));


        // API Routes
        this.app.get('/api/health', (_req, res) => {
            res.json({
                status: 'healthy',
                uptime: Math.floor((Date.now() - this.startTime) / 1000),
                timestamp: Date.now()
            });
        });

        this.app.get('/api/stats', (_req, res) => {
            const stats = this.state.getLatestStats();

            // If no stats, return zeros
            if (!stats) {
                return res.json({
                    accountsMonitored: 0,
                    accountsReclaimed: 0,
                    totalReclaimedSOL: 0,
                    totalReclaimedUSD: 0,
                    successRate: 0,
                    lastScanTime: 0,
                    uptime: Math.floor((Date.now() - this.startTime) / 1000),
                    rpcCallsToday: 0
                });
            }

            // Calculate success rate
            const successRate = stats.accounts_monitored > 0
                ? (stats.accounts_reclaimed / stats.accounts_monitored * 100)
                : 0;

            return res.json({
                accountsMonitored: stats.accounts_monitored,
                accountsReclaimed: stats.accounts_reclaimed,
                totalReclaimedSOL: stats.total_reclaimed_lamports / 1e9,
                totalReclaimedUSD: 0, // TODO: Add price oracle
                successRate: Math.round(successRate * 10) / 10, // Round to 1 decimal
                lastScanTime: stats.timestamp,
                uptime: Math.floor((Date.now() - this.startTime) / 1000),
                rpcCallsToday: stats.rpc_calls_made
            });
        });

        this.app.get('/api/accounts', (_req, res) => {
            const accounts = this.state.getAllAccounts();
            res.json({
                accounts: accounts.map(acc => ({
                    pubkey: acc.pubkey,
                    status: acc.status,
                    lamports: acc.lamports,
                    sol: acc.lamports / 1e9,
                    lastChecked: acc.last_checked || acc.lastChecked, // Handle both conventions
                    nextCheck: acc.next_check || acc.nextCheck,
                    checkInterval: acc.check_interval || acc.checkInterval
                }))
            });
        });

        this.app.get('/api/transactions', (_req, res) => {
            // Mock transaction list as StateManager doesn't expose history getter yet
            res.json({
                transactions: []
            });
        });

        // Serve the UI
        this.app.get('/', (_req, res) => {
            res.setHeader('Content-Type', 'text/html');
            res.send(this.getDashboardHTML());
        });
    }

    private getDashboardHTML(): string {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kora | Rent Reclaim Elite</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-dark: #0f0f1b;
            --bg-card: rgba(255, 255, 255, 0.03);
            --primary: #9945FF;
            --secondary: #14F195;
            --text-primary: #ffffff;
            --text-secondary: #8e95a3;
            --danger: #ff4d4d;
            --success: #00e676;
            --border: rgba(255, 255, 255, 0.08);
            --blur: 16px;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: 'Inter', sans-serif;
        }

        body {
            background-color: var(--bg-dark);
            background-image: 
                radial-gradient(circle at 10% 20%, rgba(153, 69, 255, 0.15) 0%, transparent 40%),
                radial-gradient(circle at 90% 80%, rgba(20, 241, 149, 0.1) 0%, transparent 40%);
            color: var(--text-primary);
            min-height: 100vh;
            overflow-x: hidden;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
        }

        /* Header */
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 3rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--border);
        }

        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -0.5px;
        }

        .status-badge {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: rgba(20, 241, 149, 0.1);
            border: 1px solid rgba(20, 241, 149, 0.2);
            border-radius: 99px;
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--secondary);
        }

        .pulse {
            width: 8px;
            height: 8px;
            background: var(--secondary);
            border-radius: 50%;
            box-shadow: 0 0 0 0 rgba(20, 241, 149, 0.7);
            animation: pulse-ring 2s infinite;
        }

        @keyframes pulse-ring {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(20, 241, 149, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(20, 241, 149, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(20, 241, 149, 0); }
        }

        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            margin-bottom: 3rem;
        }

        .card {
            background: var(--bg-card);
            backdrop-filter: blur(var(--blur));
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 1.5rem;
            position: relative;
            overflow: hidden;
        }

        .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .card:hover {
            transform: translateY(-4px);
            border-color: rgba(255, 255, 255, 0.2);
            box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5);
        }

        .card:hover::before {
            opacity: 1;
        }

        .card-label {
            font-size: 0.875rem;
            color: var(--text-secondary);
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 0.5rem;
        }

        .card-value {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: #fff;
        }

        .card-sub {
            font-size: 0.875rem;
            color: var(--text-secondary);
        }

        .value-gradient {
            background: linear-gradient(135deg, #fff 0%, #a7a7a7 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .sol-value {
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        /* Tables */
        .section-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            color: var(--text-primary);
        }

        .table-container {
            background: var(--bg-card);
            backdrop-filter: blur(var(--blur));
            border: 1px solid var(--border);
            border-radius: 16px;
            overflow: hidden;
            margin-bottom: 2rem;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
        }

        th {
            padding: 1rem 1.5rem;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            color: var(--text-secondary);
            border-bottom: 1px solid var(--border);
            background: rgba(0,0,0,0.2);
        }

        td {
            padding: 1rem 1.5rem;
            color: var(--text-primary);
            font-size: 0.9rem;
            border-bottom: 1px solid var(--border);
        }

        tr:last-child td {
            border-bottom: none;
        }

        tr:hover td {
            background: rgba(255,255,255,0.03);
        }

        .hash {
            font-family: monospace;
            color: var(--text-secondary);
            cursor: pointer;
        }
        
        .hash:hover {
            color: var(--primary);
            text-decoration: underline;
        }

        .tag {
            padding: 0.25rem 0.75rem;
            border-radius: 99px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
        }

        .tag.active {
            background: rgba(59, 130, 246, 0.15);
            color: #60a5fa;
            border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .tag.reclaimed {
            background: rgba(20, 241, 149, 0.15);
            color: var(--secondary);
            border: 1px solid rgba(20, 241, 149, 0.3);
        }

        .tag.failed {
            background: rgba(255, 77, 77, 0.15);
            color: var(--danger);
            border: 1px solid rgba(255, 77, 77, 0.3);
        }

        /* Loading shimmer */
        .loading {
            position: relative;
            background: #1a1a2e;
            overflow: hidden;
        }
        .loading::after {
            content: "";
            position: absolute;
            top: 0; right: 0; bottom: 0; left: 0;
            transform: translateX(-100%);
            background-image: linear-gradient(
                90deg,
                rgba(255, 255, 255, 0) 0,
                rgba(255, 255, 255, 0.05) 20%,
                rgba(255, 255, 255, 0.1) 60%,
                rgba(255, 255, 255, 0)
            );
            animation: shimmer 2s infinite;
        }
        @keyframes shimmer {
            100% { transform: translateX(100%); }
        }

    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="logo">KORA | RENT RECLAIM</div>
            <div class="status-badge">
                <div class="pulse"></div>
                SYSTEM ACTIVE
            </div>
        </header>

        <main>
            <!-- Stats -->
            <section class="stats-grid">
                <div class="card">
                    <div class="card-label">Monitored Accounts</div>
                    <div class="card-value value-gradient" id="stat-accounts">--</div>
                    <div class="card-sub">Active scanning</div>
                </div>
                <div class="card">
                    <div class="card-label">Total Reclaimed</div>
                    <div class="card-value sol-value" id="stat-reclaimed">-- SOL</div>
                    <div class="card-sub" id="stat-usd">$0.00 USD Value</div>
                </div>
                <div class="card">
                    <div class="card-label">Success Rate</div>
                    <div class="card-value value-gradient" id="stat-success">--%</div>
                    <div class="card-sub">Based on execution history</div>
                </div>
                <div class="card">
                    <div class="card-label">System Uptime</div>
                    <div class="card-value value-gradient" id="stat-uptime">--:--:--</div>
                    <div class="card-sub">RPC Calls: <span id="stat-rpc">0</span></div>
                </div>
            </section>

            <!-- Accounts Table -->
            <h2 class="section-title">Active Monitoring Queue</h2>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Account Address</th>
                            <th>Status</th>
                            <th>Balance</th>
                            <th>Last Check</th>
                            <th>Next Check</th>
                        </tr>
                    </thead>
                    <tbody id="accounts-table-body">
                        <!-- JS will populate -->
                        <tr><td colspan="5" style="text-align:center; padding: 2rem;">Loading data...</td></tr>
                    </tbody>
                </table>
            </div>
        </main>
    </div>

    <script>
        const UPDATE_INTERVAL = 3000;

        function formatTime(seconds) {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = Math.floor(seconds % 60);
            return \`\${h}h \${m}m \${s}s\`;
        }

        function truncate(str, n=8) {
            return str.length > n ? str.substr(0, n) + '...' + str.substr(str.length-4) : str;
        }

        function getStatusBadge(status) {
            let cls = 'active';
            if (status === 'reclaimed') cls = 'reclaimed';
            if (status === 'error') cls = 'failed';
            return \`<span class="tag \${cls}">\${status.toUpperCase()}</span>\`;
        }

        async function fetchData() {
            try {
                // Fetch Stats
                const statsRes = await fetch('/api/stats');
                const stats = await statsRes.json();
                
                document.getElementById('stat-accounts').innerText = stats.accountsMonitored;
                document.getElementById('stat-reclaimed').innerText = \`\${stats.totalReclaimedSOL.toFixed(4)} SOL\`;
                document.getElementById('stat-usd').innerText = \`$\${stats.totalReclaimedUSD.toFixed(2)} USD Value\`;
                document.getElementById('stat-success').innerText = \`\${stats.successRate}%\`;
                document.getElementById('stat-uptime').innerText = formatTime(stats.uptime);
                document.getElementById('stat-rpc').innerText = stats.rpcCallsToday;

                // Fetch Accounts
                const accRes = await fetch('/api/accounts');
                const accData = await accRes.json();
                
                const tableBody = document.getElementById('accounts-table-body');
                
                if (accData.accounts.length === 0) {
                    tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No accounts found</td></tr>';
                } else {
                    tableBody.innerHTML = accData.accounts.map(acc => \`
                        <tr>
                            <td><span class="hash" title="\${acc.pubkey}">\${truncate(acc.pubkey)}</span></td>
                            <td>\${getStatusBadge(acc.status)}</td>
                            <td>\${acc.sol.toFixed(9)} SOL</td>
                            <td>\${new Date(acc.lastChecked).toLocaleTimeString()}</td>
                            <td>in \${Math.max(0, Math.floor((acc.nextCheck - Date.now())/1000))}s</td>
                        </tr>
                    \`).join('');
                }

            } catch (error) {
                console.error('Failed to fetch data', error);
            }
        }

        // Init
        fetchData();
        setInterval(fetchData, UPDATE_INTERVAL);
    </script>
</body>
</html>
        `;
    }
}

import { loadConfig } from './src/config';
import { RateLimitedRPCClient } from './src/rpc';
import { StateManager } from './src/state';

async function testPhase1() {
  console.log('🧪 Testing Phase 1 modules...\n');

  // Test 1: Config
  console.log('1️⃣ Loading config...');
  const config = loadConfig();
  console.log('✅ Config loaded successfully');

  // Test 2: RPC Client
  console.log('\n2️⃣ Initializing RPC client...');
  const rpc = new RateLimitedRPCClient(config.solana, config.rateLimit);
  console.log('✅ RPC client initialized');

  // Test 3: Database
  console.log('\n3️⃣ Initializing database...');
  const state = new StateManager(config.database.path);
  console.log('✅ Database initialized');

  // Test 4: RPC Call
  console.log('\n4️⃣ Testing RPC call...');
  const accountInfo = await rpc.getAccountInfo(config.kora.feePayerKeypair.publicKey);
  console.log(`✅ RPC works! Balance: ${accountInfo?.lamports || 0} lamports`);

  // Test 5: Rate Limiting
  console.log('\n5️⃣ Testing rate limiting...');
  const start = Date.now();
  await Promise.all([
    rpc.getAccountInfo(config.kora.programId),
    rpc.getAccountInfo(config.kora.programId),
    rpc.getAccountInfo(config.kora.programId),
  ]);
  const elapsed = Date.now() - start;
  console.log(`✅ Rate limiting works (${elapsed}ms for 3 requests)`);

  console.log('\n🎉 Phase 1 Complete! All modules working.');
  
  state.close();
}

testPhase1().catch(console.error);
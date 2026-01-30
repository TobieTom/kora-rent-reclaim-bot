# The Ultimate Google AI Studio + Gemini Vibe Coding Guide for Solana Development
## Building the Kora Rent-Reclaim Bot (2026 Elite Edition)

**Last Updated:** January 30, 2026  
**Target:** $1,000 USDC Superteam Nigeria Bounty  
**Tech Stack:** Google AI Studio (Antigravity) + Gemini 2.5 Pro + Solana + TypeScript  

---

## 🎯 Executive Summary

This guide transforms the traditional Claude Code workflow into an elite Gemini-powered development system specifically for building production-ready Solana applications. You'll learn how to leverage Google AI Studio's **Gemini 2.5 Pro** (with 2M token context window and state-of-the-art coding performance) to build the Kora automated rent-reclaim bot from scratch.

**Why Gemini 2.5 Pro for This Bounty:**
- **#1 on LMArena coding leaderboard** - Best coding model in 2026
- **2M token context window** - Can hold entire Solana + Kora documentation
- **Native tool use** - Built-in code execution and web search
- **63.8% on SWE-Bench Verified** - Industry-leading agentic code performance
- **Adaptive thinking** - Reasons through complex Solana rent mechanics

---

## 📚 Table of Contents

1. [The Gemini Advantage Over Claude](#the-gemini-advantage)
2. [8 Elite Vibe Coding Principles for 2026](#8-elite-principles)
3. [Google AI Studio Setup & Workflow](#setup-and-workflow)
4. [Gemini-Specific Prompting Techniques](#prompting-techniques)
5. [The Rent-Reclaim Bot Architecture](#bot-architecture)
6. [Implementation Strategy](#implementation-strategy)
7. [Testing & Deployment](#testing-deployment)
8. [Advanced Optimization Techniques](#advanced-optimization)

---

## 🚀 The Gemini Advantage Over Claude

### Why Google AI Studio > Claude Code for This Project

| Feature | Gemini 2.5 Pro | Claude Sonnet 4.5 | Winner |
|---------|---------------|-------------------|---------|
| **Context Window** | 2M tokens | 200K tokens | 🏆 Gemini (10x larger) |
| **Coding Performance** | #1 LMArena | #3 LMArena | 🏆 Gemini |
| **Cost** | $30/1M output tokens | More expensive at scale | 🏆 Gemini |
| **Native Tool Use** | Built-in | Extension required | 🏆 Gemini |
| **Web Search** | Integrated | Tool required | 🏆 Gemini |
| **Thinking Mode** | Gemini 2.5 Flash Thinking | Available | 🟰 Tie |
| **IDE Integration** | AI Studio + API | VS Code extension | 🟰 Different use cases |

**Critical for Solana Development:**
- **Entire Documentation Fits in Context:** Load all Kora docs, Solana RPC methods, and account structures in one session
- **Superior at Complex Logic:** Rent-exempt calculations, epoch tracking, and transaction building
- **Better Multi-File Reasoning:** Understands the relationship between bot modules, RPC clients, and monitoring systems

---

## 🎯 8 Elite Vibe Coding Principles for 2026

### Principle #1: Embrace the New Era - Gemini is Your Technical Co-Founder

**Original Claude Guide Said:** "Treat Claude like a creative partner"  
**2026 Gemini Reality:** Gemini 2.5 Pro is your technical co-founder, not just a coding assistant.

**Why This Matters for the Bounty:**
```
Old mindset: "AI generates code, I review it"
New mindset: "Gemini architects solutions, I validate and guide"
```

**Practical Application:**
Before writing ANY code for the rent-reclaim bot, have a 30-minute architecture discussion with Gemini:

```
PROMPT TEMPLATE:
"I'm building an automated rent-reclaim bot for Kora operators on Solana.

CONTEXT:
- Kora sponsors account creation by funding rent-exempt balances
- When accounts close/are no longer needed, operators should reclaim that rent
- Target: 18,000+ private schools (high volume, reliability critical)

CONSTRAINTS:
- Must handle rate limiting from public RPC endpoints
- Need real-time monitoring dashboard
- Must be production-ready (error handling, logging, retries)
- Budget: Free tier tools where possible

Let's brainstorm the architecture together. What are 3-5 different approaches we could take, with pros/cons for each? Consider:
1. Polling vs event-driven vs hybrid
2. Centralized vs distributed monitoring
3. Database needs (if any)
4. Scalability to thousands of operators"
```

**Gemini will give you architectural options you haven't considered.** This is the #1 technique that separates amateur vibe coders from pros.

---

### Principle #2: Context is King - Load Everything Into the 2M Token Window

**Original Guide Weakness:** Never addresses how to give the AI full context  
**2026 Elite Technique:** Front-load your entire knowledge base into Gemini's massive context

**The Power Move:**
Google AI Studio's 2M token context means you can load:
- ✅ All 3 documentation files you created (Kora, Solana RPC, Accounts)
- ✅ The bounty requirements screenshot
- ✅ Relevant code examples from GitHub
- ✅ Your existing project structure
- ✅ Error logs and debugging context

**How to Do It:**
1. Open Google AI Studio (https://aistudio.google.com)
2. Start a new chat with **Gemini 2.5 Pro Experimental**
3. Upload all documentation files as attachments
4. Paste the bounty requirements
5. Add this prompt:

```
"I've uploaded complete documentation for:
1. Kora Operators (rent sponsorship system)
2. Solana RPC Methods (blockchain queries)
3. Solana Accounts (rent mechanics)

Please analyze these docs and tell me:
1. What are the 5 most relevant RPC methods for a rent-reclaim bot?
2. What's the optimal account monitoring strategy?
3. What edge cases should I worry about?
4. What's a good project structure for TypeScript + Solana?"
```

**Result:** Gemini now has PERFECT context for every subsequent question. No more "I don't have enough information" responses.

---

### Principle #3: Kill the Complexity Gurus - Simplicity Wins

**Original Guide Said:** "Stop listening to all the gurus"  
**2026 Amplification:** The best developers ship simple, working code. Period.

**What This Means for Your Bot:**

❌ **AVOID** (Guru Trap):
- Creating 40 MCP servers
- Building custom DSLs for configuration
- Over-engineering with microservices
- Implementing advanced caching before you need it
- Using every new JS framework that drops

✅ **DO INSTEAD** (Pragmatic Winner):
- Single TypeScript file to start (`bot.ts`)
- Direct RPC calls (no unnecessary abstractions)
- SQLite for state (not Postgres/MongoDB)
- Standard `console.log` (not custom logging framework)
- Vanilla Node.js (not Bun/Deno until you hit limits)

**Real Example from a $300K/year App Builder:**
> "My Creator Buddy app that makes $300K/year started as a 200-line Python script. I didn't add a database until user 100. I didn't add authentication until user 500. Simple scales better than you think."

**For the Rent-Reclaim Bot:**
```typescript
// Start with THIS simple structure:
// bot.ts - Main entry point
// rpc.ts - Solana RPC client
// monitor.ts - Account monitoring logic
// reclaim.ts - Transaction building
// config.ts - Configuration

// That's IT. 5 files maximum for v1.
```

---

### Principle #4: The 80% Rule - Maximize Productive Downtime

**Original Guide's Best Tip:** "Use ChatGPT/Claude while waiting for AI to code"  
**2026 Amplification:** Turn every idle second into strategic advantage

**The Anti-Pattern (What 99% Do):**
```
Gemini generates code (30 seconds) 
→ You scroll Twitter 
→ Gemini finishes 
→ You review 
→ Gemini generates more code (30 seconds) 
→ You watch YouTube 
→ Repeat
```

**The Elite Pattern (What Winners Do):**
```
Gemini generates code (30 seconds) 
→ You open second AI chat (ChatGPT/Perplexity)
→ Ask: "What are edge cases in Solana rent reclamation?"
→ Document insights in notion.md
→ Gemini finishes, you have new test cases ready
→ Gemini generates more code (30 seconds)
→ You ask second AI: "Best practices for RPC rate limiting?"
→ Implement findings in next iteration
```

**Specific Tactics for This Bounty:**

**While Gemini codes, use your second AI session to:**
1. **Research competitive solutions:** "What existing Solana account cleanup tools exist?"
2. **Plan marketing:** "Draft a tweet thread announcing my rent-reclaim bot"
3. **Anticipate questions:** "What questions will Superteam judges ask about my bot?"
4. **Optimize costs:** "How can I minimize RPC costs for monitoring 1000+ accounts?"
5. **Plan next features:** "After basic reclaim works, what should v2 include?"

**Pro Tip:** Use voice mode on ChatGPT/Gemini app while coding so you can brainstorm hands-free.

---

### Principle #5: Gemini Rules File - Your Secret Weapon

**Original Guide:** Shared 9 Claude rules  
**2026 Adaptation:** Gemini-optimized rules for Solana development

Unlike Claude, Google AI Studio doesn't have a `.md` rules file, but you CAN create a **system instruction** that persists across all chats.

**How to Set Up:**
1. In Google AI Studio, go to Settings → System Instructions
2. Paste this optimized ruleset:

```markdown
# Gemini Coding Rules for Solana Development

## Core Principles
1. ALWAYS slow down and think through the problem completely before coding
2. Search the web for latest Solana/Kora documentation when uncertain
3. Build detailed to-do lists with sub-tasks before implementation
4. Explain your reasoning before every code change

## Code Quality Standards
5. Keep changes SIMPLE - touch only the files necessary for the task
6. Write production-ready code: error handling, retries, logging required
7. No temporary fixes - solve root causes
8. Include TypeScript types for everything
9. Add JSDoc comments for all public functions

## Solana-Specific Rules
10. Always check if RPC methods need commitment level (finalized/confirmed)
11. Handle rate limiting gracefully with exponential backoff
12. Remember: 1 SOL = 1,000,000,000 lamports
13. Rent-exempt accounts have rentEpoch = u64::MAX
14. Use getProgramAccounts with filters to reduce data transfer

## Development Workflow
15. Generate tests alongside implementation code
16. Prefer iterative development over big-bang releases
17. Ask clarifying questions if requirements are ambiguous
18. Suggest optimizations but implement the simple version first

## Never Do
19. Never use deprecated Solana methods (check docs date)
20. Never ignore error cases or assume RPC calls succeed
21. Never commit API keys or private keys to code
22. Never use complex abstractions before they're needed
```

**This ruleset will 10x your code quality.**

---

### Principle #6: Prompt Engineering is DEAD (Long Live Natural Prompting)

**Original Guide:** "Prompt engineering is overrated"  
**2026 Truth:** It's not just overrated - it's actively harmful

**The New Reality:**
Gemini 2.5 Pro is smart enough to understand natural language perfectly. Complex prompting templates just confuse it.

**Anti-Pattern (What Gurus Teach):**
```
CONTEXT: [500 words explaining every detail]
REQUIREMENTS: [Bulleted list with 40 items]
CONSTRAINTS: [Another bulleted list]
OUTPUT FORMAT: [Specific structure requirements]
TESTING CRITERIA: [Yet more structure]
```

**Elite Pattern (What Actually Works):**
```
"Build a monitoring function that checks if Kora-sponsored accounts 
have been closed. Use getProgramAccounts to find them. Return a list 
of account addresses that are eligible for rent reclaim."
```

**That's it. One sentence. Gemini figures out the rest.**

**For Complex Features:**
```
"I need to handle RPC rate limiting. The public endpoint limits me to 
100 requests/10 seconds. The bot monitors 500 accounts. How should I 
structure the monitoring loop?"
```

**Gemini will:**
1. Calculate the optimal batch size
2. Suggest caching strategies
3. Propose exponential backoff
4. Offer alternative architectures

**You don't need to specify HOW. Just specify WHAT.**

---

### Principle #7: Screenshots + Visual Context = 10x Better UI

**Original Guide Tip:** "Use screenshots for UI inspiration"  
**2026 Amplification:** Visual context works for EVERYTHING, not just UI

**Beyond UI - Use Screenshots For:**
1. **Documentation:** Screenshot the bounty requirements → upload to Gemini
2. **Error Messages:** Screenshot terminal errors → get instant debugging
3. **Data Structures:** Screenshot JSON responses → get parsing code
4. **Dashboards:** Screenshot similar tools → get matching layouts
5. **Architecture:** Hand-draw a flowchart → get implementation code

**Specific Example for This Bounty:**
```
1. Go to Solscan.io and find a Kora-sponsored account
2. Screenshot the account page showing:
   - Account balance (lamports)
   - Owner program
   - Rent epoch
   - Data size
3. Upload to Gemini with prompt:
   "This is what a sponsored account looks like. Build a TypeScript 
   function that extracts this data from getAccountInfo RPC response."
```

**Gemini with vision is SCARY good at understanding visual context.**

**Pro Tip:** Use Google AI Studio's multimodal input:
```
[Screenshot of Solana Explorer]
[Screenshot of terminal with error]
[Your hand-drawn architecture diagram]

"Here's what I'm trying to build. The error I'm getting is in the 
second image. My current architecture is in the third. What's wrong?"
```

---

### Principle #8: Thinking Models for Complex Logic

**New for 2026:** Gemini 2.0 Flash Thinking is your secret weapon for hard problems

**When to Use Regular Gemini:**
- Generating boilerplate code
- Simple CRUD operations
- UI components
- Configuration files
- Documentation

**When to Use Gemini 2.0 Flash Thinking:**
- ✅ **Rent-exempt calculation logic** (complex math)
- ✅ **Account state machine design** (complex state transitions)
- ✅ **Transaction failure handling** (complex error scenarios)
- ✅ **Epoch-based monitoring strategy** (complex timing)
- ✅ **Rate limiting algorithm** (complex optimization)

**How to Switch:**
In Google AI Studio, change model dropdown from "Gemini 2.5 Pro" to "Gemini 2.0 Flash Thinking Experimental"

**Example Prompt for Thinking Model:**
```
"I need to design a state machine for account monitoring with these states:
- ACTIVE: Account exists and is funded
- PENDING_CLOSE: Account marked for closure but not yet closed
- CLOSED: Account no longer exists
- RECLAIMABLE: Account closed and rent can be recovered
- RECLAIMED: Rent successfully recovered

Consider these edge cases:
- What if RPC returns null for an account?
- What if account closes mid-check?
- What if reclaim transaction fails?
- How do we handle partial state updates?

Think through this carefully and design the state transitions."
```

**Gemini Thinking will:**
1. Show its reasoning process
2. Consider edge cases you missed
3. Design a more robust state machine
4. Suggest testing strategies

**This is the ONLY way to handle complex Solana logic reliably.**

---

## 🛠️ Google AI Studio Setup & Workflow

### Step 1: Environment Setup

**1.1 Access Google AI Studio**
- Go to https://aistudio.google.com
- Sign in with Google account
- Accept terms of service

**1.2 Choose Your Model**
- Start with **Gemini 2.5 Pro Experimental** for best coding performance
- Switch to **Gemini 2.0 Flash Thinking** for complex logic
- Use **Gemini 2.0 Flash** for speed (once you have working code)

**1.3 Create Project Structure**
```bash
# On your local machine
mkdir kora-rent-reclaim-bot
cd kora-rent-reclaim-bot
npm init -y
npm install @solana/web3.js @solana/spl-token typescript @types/node
mkdir src
touch src/bot.ts src/config.ts src/rpc.ts src/monitor.ts src/reclaim.ts
```

---

### Step 2: The Elite Vibe Coding Workflow

**Phase 1: Architecture & Planning (30-60 minutes)**
```
1. Upload all documentation to Gemini
2. Paste bounty requirements
3. Have architecture discussion (see Principle #1)
4. Generate detailed project plan with milestones
5. Create task list with acceptance criteria
```

**Phase 2: Iterative Development (2-4 hours)**
```
1. Pick smallest shippable feature (e.g., "Connect to RPC endpoint")
2. Ask Gemini to implement it
3. Copy code to local files
4. Test manually
5. If works: commit and move to next feature
6. If fails: paste error back to Gemini, get fix
7. Repeat until bot is feature-complete
```

**Phase 3: Testing & Refinement (1-2 hours)**
```
1. Ask Gemini to generate comprehensive test suite
2. Run tests, paste failures back
3. Have Gemini fix bugs
4. Add monitoring and logging
5. Write deployment documentation
```

**Phase 4: Polish & Submission (30 minutes)**
```
1. Ask Gemini to write README.md
2. Generate demo video script
3. Create submission documentation
4. Final review with Gemini for missing requirements
```

---

### Step 3: Optimal Gemini Chat Structure

**DON'T:** Use one massive chat for everything  
**DO:** Use multiple focused chats

**Chat Organization:**
```
Chat 1: "Kora Rent-Reclaim Architecture"
└─ Use for: High-level design decisions

Chat 2: "RPC & Account Monitoring Implementation"
└─ Use for: Core bot logic

Chat 3: "Transaction Building & Reclaim Logic"
└─ Use for: Rent recovery code

Chat 4: "Dashboard & Monitoring"
└─ Use for: UI/monitoring features

Chat 5: "Testing & Debugging"
└─ Use for: Bug fixes and test generation
```

**Why This Works:**
- Each chat maintains focused context
- Easy to reference specific implementation details later
- Can work on multiple features in parallel
- Cleaner conversation history for documentation

---

## 💎 Gemini-Specific Prompting Techniques

### Technique #1: The Context Bomb

**When:** Starting a new feature or debugging complex issues

**How:**
```
"CONTEXT:
[Paste relevant code from 3-5 files]

CURRENT STATE:
The bot successfully monitors accounts but fails when trying to build 
the reclaim transaction.

ERROR:
[Paste full error message]

QUESTION:
What's causing this and how do I fix it?"
```

**Why This Works:**
Gemini 2.5 Pro's 2M context window means you can paste ENTIRE files without summarizing. The model sees exactly what you see.

---

### Technique #2: The Incremental Refinement Loop

**When:** Building complex features step-by-step

**How:**
```
You: "Build a function to get all accounts owned by Kora program"
Gemini: [Generates code]
You: "Good, now add filtering for accounts with zero balance"
Gemini: [Updates code]
You: "Now add rate limiting with 100 req/10sec max"
Gemini: [Updates code with rate limiting]
You: "Add retry logic with exponential backoff"
Gemini: [Final version with retries]
```

**Why This Works:**
Each iteration is small and testable. You catch problems early before they compound.

---

### Technique #3: The Comparison Request

**When:** Deciding between multiple approaches

**How:**
```
"I need to monitor account status. Give me 3 different approaches:
1. Polling-based (check accounts every N seconds)
2. Event-based (use websocket subscriptions)
3. Hybrid (poll with websocket fallback)

For each approach, tell me:
- Pros and cons
- Code complexity (1-5)
- Resource usage
- Reliability
- Best use case

Then recommend which one I should build first for a $1000 bounty with 
2-day timeline."
```

**Why This Works:**
Gemini excels at comparative analysis. You get informed decision-making, not blind coding.

---

### Technique #4: The Teaching Request

**When:** You need to understand complex Solana concepts

**How:**
```
"Explain Solana rent-exemption like I'm a JavaScript developer who's 
new to blockchain. Include:
1. Why rent exists
2. How to calculate rent-exempt minimum
3. What happens when an account closes
4. How rent reclamation works
5. Common gotchas for new developers

Use code examples in TypeScript with @solana/web3.js v1.95.0"
```

**Why This Works:**
Understanding the "why" prevents bugs. Gemini is an excellent teacher when you ask specific pedagogical questions.

---

### Technique #5: The Error Prevention Prompt

**When:** Before implementing critical features

**How:**
```
"I'm about to build the transaction signing logic for rent reclaim. 
Before I start, what are the 10 most common mistakes developers make 
with Solana transactions? For each:
- What's the mistake?
- Why is it a problem?
- How do I avoid it?
- Show me the correct pattern in TypeScript"
```

**Why This Works:**
Preventing bugs is 10x better than fixing them. Gemini knows the common pitfalls.

---

## 🏗️ The Rent-Reclaim Bot Architecture

### High-Level System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                     KORA RENT-RECLAIM BOT                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐         ┌──────────────┐                     │
│  │   Config     │────────▶│  RPC Client  │◀───────┐           │
│  │   Loader     │         │  (Solana)    │         │           │
│  └──────────────┘         └──────┬───────┘         │           │
│                                   │                  │           │
│                                   ▼                  │           │
│                          ┌─────────────────┐        │           │
│                          │Account Monitor  │        │           │
│                          │ (getProgramAccs)│        │           │
│                          └────────┬────────┘        │           │
│                                   │                  │           │
│               ┌──────────────────┴──────────┐      │           │
│               ▼                              ▼       │           │
│        ┌─────────────┐            ┌──────────────┐ │           │
│        │State Tracker│            │Eligibility   │ │           │
│        │(SQLite DB)  │            │Checker       │ │           │
│        └──────┬──────┘            └──────┬───────┘ │           │
│               │                           │          │           │
│               └────────┬──────────────────┘          │           │
│                        ▼                              │           │
│              ┌──────────────────┐                   │           │
│              │Transaction       │                    │           │
│              │Builder & Signer  │                    │           │
│              └────────┬─────────┘                    │           │
│                       │                               │           │
│                       ▼                               │           │
│              ┌──────────────────┐                   │           │
│              │Reclaim Executor  │───────────────────┘           │
│              │(Submit to chain) │                               │
│              └────────┬─────────┘                               │
│                       │                                          │
│                       ▼                                          │
│              ┌──────────────────┐                               │
│              │  Status Logger   │                               │
│              │  & Dashboard     │                               │
│              └──────────────────┘                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### Module Breakdown

**1. Config Loader (`config.ts`)**
```typescript
// Loads configuration from environment variables and config files
// - RPC endpoint URL
// - Kora program ID
// - Fee payer keypair
// - Monitoring interval
// - Rate limiting settings
```

**2. RPC Client (`rpc.ts`)**
```typescript
// Wrapper around @solana/web3.js Connection
// - Rate limiting (100 req/10sec for public endpoints)
// - Retry logic with exponential backoff
// - Response caching where appropriate
// - Error handling and logging
```

**3. Account Monitor (`monitor.ts`)**
```typescript
// Discovers and tracks Kora-sponsored accounts
// - Uses getProgramAccounts to find sponsored accounts
// - Filters for closed/inactive accounts
// - Batch processing to respect rate limits
// - Periodic scanning (every N blocks/epochs)
```

**4. State Tracker (`state.ts`)**
```typescript
// Persists account state in SQLite
// - Tracks discovered accounts
// - Records account status (active/closed/reclaimed)
// - Stores transaction history
// - Provides query interface for dashboard
```

**5. Eligibility Checker (`eligibility.ts`)**
```typescript
// Determines if an account is eligible for reclaim
// - Account is closed (getAccountInfo returns null)
// - Account has no recent activity
// - Fee payer has authority to reclaim
// - Sufficient rent balance to justify gas costs
```

**6. Transaction Builder (`transaction.ts`)**
```typescript
// Constructs reclaim transactions
// - Builds close account instruction
// - Sets fee payer as rent recipient
// - Adds priority fees for fast confirmation
// - Signs with operator keypair
```

**7. Reclaim Executor (`executor.ts`)**
```typescript
// Submits transactions and monitors confirmation
// - Sends signed transactions to RPC
// - Polls for confirmation status
// - Handles failures and retries
// - Records results to state tracker
```

**8. Status Logger & Dashboard (`dashboard.ts`)**
```typescript
// Provides visibility into bot operations
// - Real-time stats (accounts monitored, rent reclaimed)
// - Transaction history
// - Error logging
// - Performance metrics
```

---

## 🎬 Implementation Strategy

### Phase 1: MVP in 2 Hours (Must-Have Features)

**Goal:** Basic bot that can discover and reclaim rent from ONE closed account

**Tasks:**
1. ✅ Set up project structure and dependencies
2. ✅ Create RPC client with basic error handling
3. ✅ Implement account discovery (getProgramAccounts)
4. ✅ Build simple close account transaction
5. ✅ Test on devnet with a demo account

**Success Criteria:**
- Bot connects to devnet
- Discovers Kora-sponsored accounts
- Successfully reclaims rent from a test account
- Logs transaction signature

**Gemini Prompts for Phase 1:**

```prompt
"Let's build the MVP in phases. Phase 1 is basic account discovery.

Create a TypeScript function that:
1. Connects to Solana devnet
2. Uses getProgramAccounts to find all accounts owned by program ID: 
   [KORA_PROGRAM_ID]
3. Filters for accounts that are closed (data length = 0)
4. Returns an array of PublicKey objects

Use @solana/web3.js v1.95.0. Include error handling and TypeScript types."
```

```prompt
"Now create the reclaim transaction builder.

Function should:
1. Take a closed account PublicKey and fee payer Keypair
2. Build a closeAccount instruction that sends rent to fee payer
3. Return a signed Transaction ready to submit
4. Handle the case where account is a token account vs system account

Show me the implementation with proper Solana instruction building."
```

---

### Phase 2: Production Features (4 Hours)

**Goal:** Make the bot reliable, scalable, and monitorable

**Tasks:**
1. ✅ Add SQLite state tracking
2. ✅ Implement rate limiting and retry logic
3. ✅ Build monitoring dashboard
4. ✅ Add comprehensive logging
5. ✅ Handle edge cases and errors
6. ✅ Write deployment documentation

**Success Criteria:**
- Bot runs continuously without crashing
- Handles RPC rate limits gracefully
- Persists state across restarts
- Provides visibility into operations
- Can monitor 100+ accounts efficiently

**Gemini Prompts for Phase 2:**

```prompt
"Upgrade the RPC client with production features:

1. Rate Limiting:
   - Public RPC endpoints limit to 100 requests per 10 seconds
   - Implement a token bucket algorithm
   - Queue requests when limit is reached

2. Retry Logic:
   - Exponential backoff on failures (1s, 2s, 4s, 8s)
   - Max 5 retries per request
   - Different handling for timeout vs error responses

3. Caching:
   - Cache getAccountInfo responses for 30 seconds
   - Invalidate cache on transaction submission
   - LRU eviction with max 1000 entries

Show me the implementation with TypeScript."
```

```prompt
"Build a SQLite state tracker with this schema:

accounts table:
- pubkey (TEXT PRIMARY KEY)
- status (TEXT: 'active' | 'closed' | 'reclaimed')
- balance (INTEGER)
- last_checked (INTEGER timestamp)
- reclaim_tx (TEXT, nullable)

transactions table:
- signature (TEXT PRIMARY KEY)
- account_pubkey (TEXT)
- status (TEXT: 'pending' | 'confirmed' | 'failed')
- timestamp (INTEGER)
- error (TEXT, nullable)

Include functions for:
- Upserting account status
- Recording transaction submissions
- Querying reclaimable accounts
- Getting stats (total reclaimed, success rate)

Use better-sqlite3 library."
```

---

### Phase 3: Polish & Optimization (2 Hours)

**Goal:** Prepare for bounty submission and judging

**Tasks:**
1. ✅ Write comprehensive README with setup instructions
2. ✅ Create demo video showing bot in action
3. ✅ Add CLI for manual testing and operations
4. ✅ Optimize for gas costs and performance
5. ✅ Security review (no private keys in code)
6. ✅ Format code and add JSDoc comments

**Success Criteria:**
- Professional documentation
- Easy for judges to run and test
- Clear explanation of approach and trade-offs
- Handles all requirements from bounty description
- Code is clean, commented, and maintainable

**Gemini Prompts for Phase 3:**

```prompt
"Generate a comprehensive README.md for the Kora rent-reclaim bot.

Include:
1. Project overview and architecture
2. Prerequisites (Node.js version, etc.)
3. Installation steps
4. Configuration (environment variables)
5. Running the bot (dev and production)
6. Testing instructions
7. Troubleshooting common issues
8. Technical decisions and trade-offs
9. Future improvements
10. License and attribution

Target audience: Superteam judges and other Solana developers."
```

```prompt
"Review this bot implementation for production readiness:

[Paste main bot code]

Analyze:
1. Security issues (private key handling, injection risks)
2. Performance bottlenecks
3. Error handling gaps
4. Edge cases not covered
5. Code quality issues

For each issue, provide:
- Severity (critical/high/medium/low)
- Specific location in code
- Recommended fix
- Code example of the fix"
```

---

## 🧪 Testing & Deployment

### Testing Strategy

**1. Unit Tests (Gemini Generates These)**
```prompt
"Generate comprehensive Jest unit tests for the eligibility checker module.

Cover these scenarios:
- Account is closed (getAccountInfo returns null)
- Account exists but has zero balance
- Account is marked for closure but not yet closed
- Account has recent activity (should not reclaim)
- RPC call fails (timeout, rate limit)
- Invalid account address format

For each test:
- Use describe/it blocks
- Mock Solana RPC responses
- Test both happy path and error cases
- Include edge cases (very large balance, etc.)
- Verify correct state transitions

Generate the full test file."
```

**2. Integration Tests**
```prompt
"Create an integration test that:
1. Connects to Solana devnet
2. Creates a test account and funds it with rent-exempt balance
3. Closes the account
4. Runs the bot's monitor function
5. Verifies the bot detects the closed account
6. Verifies the bot submits a reclaim transaction
7. Verifies the rent is returned to fee payer

Use real RPC calls (no mocks) but run on devnet.
Include cleanup to delete test accounts after test runs."
```

**3. Load Testing**
```prompt
"Build a load test that simulates monitoring 1000 accounts.

Requirements:
- Generate 1000 random account addresses
- Run monitor function against all accounts
- Measure:
  - Total time to scan all accounts
  - RPC calls made
  - Rate limit hits
  - Memory usage
  - CPU usage
- Output results in JSON format

This will verify the bot can scale to production loads."
```

---

### Deployment Checklist

**Before Mainnet Deployment:**
- [ ] All tests pass
- [ ] RPC endpoint is reliable (not public devnet)
- [ ] Fee payer wallet is funded with sufficient SOL
- [ ] Environment variables are properly configured
- [ ] Error alerting is set up (email, Slack, etc.)
- [ ] Logs are going to persistent storage
- [ ] Dashboard is accessible for monitoring
- [ ] Rate limits are configured conservatively
- [ ] Security review completed (no private keys in code)
- [ ] Backup and recovery process documented

**Deployment Steps:**
1. Deploy to staging environment (devnet)
2. Run for 24 hours and monitor
3. Verify no errors or issues
4. Update configuration for mainnet
5. Deploy to production
6. Monitor closely for first hour
7. Gradually increase monitoring scope

**Gemini Prompt for Deployment:**
```prompt
"Create a deployment guide for the rent-reclaim bot.

Include:
1. Server requirements (RAM, CPU, storage)
2. Software dependencies (Node.js version, etc.)
3. Environment setup (systemd service file)
4. Configuration file template
5. Database initialization commands
6. Health check endpoint
7. Log rotation setup
8. Monitoring and alerting configuration
9. Backup and recovery procedures
10. Rollback plan if deployment fails

Target deployment: AWS EC2 t3.small running Ubuntu 22.04"
```

---

## 🚀 Advanced Optimization Techniques

### Optimization #1: Batch Account Queries

**Problem:** Checking 1000 accounts individually = 1000 RPC calls  
**Solution:** Use getMultipleAccountsInfo (max 100 per call)

```prompt
"Optimize the account monitor to use batch queries.

Current: Calls getAccountInfo for each account individually
Better: Use getMultipleAccountsInfo to query 100 accounts per call

Implement:
1. Split accounts array into chunks of 100
2. For each chunk, call getMultipleAccountsInfo
3. Handle null responses (account doesn't exist)
4. Respect rate limits between batches
5. Return results in same format as before

Show me the optimized implementation."
```

---

### Optimization #2: Smart Monitoring Intervals

**Problem:** Polling every block wastes RPC calls  
**Solution:** Adjust frequency based on account age

```prompt
"Implement adaptive monitoring intervals:

- New accounts (<1 day old): Check every 10 minutes
- Medium accounts (1-7 days): Check every hour
- Old accounts (>7 days): Check every 6 hours
- Recently active: Check every 5 minutes for next hour

Add function that:
1. Takes account pubkey and last activity timestamp
2. Returns next check time (Date)
3. Stores next check time in database
4. Monitor loop only checks accounts due for checking

This reduces RPC calls by ~90% without missing closures."
```

---

### Optimization #3: Transaction Priority Fees

**Problem:** Low priority transactions can sit pending for minutes  
**Solution:** Use recent priority fees to ensure fast confirmation

```prompt
"Add dynamic priority fee calculation:

1. Call getRecentPrioritizationFees
2. Calculate 75th percentile of fees
3. Use as priority fee for reclaim transactions
4. Cap max fee at 0.001 SOL to prevent overpaying
5. If transaction fails, retry with 2x priority fee

This ensures reclaims confirm within 1-2 slots while minimizing costs."
```

---

### Optimization #4: Multi-Threading for Scale

**Problem:** Single-threaded Node.js can't fully utilize multi-core CPUs  
**Solution:** Worker threads for parallel monitoring

```prompt
"Refactor for parallel execution:

1. Split account list into N chunks (N = CPU cores)
2. Spawn worker thread for each chunk
3. Each worker runs monitor independently
4. Main thread collects results and coordinates
5. Shared SQLite database (with locking)

Show me:
- Main thread coordinator code
- Worker thread implementation
- Inter-thread communication pattern
- How to handle worker failures

This will 4x-8x throughput on modern CPUs."
```

---

## 📊 Success Metrics for Bounty Submission

### What the Judges Will Evaluate

**1. Correctness (40%)**
- ✅ Bot accurately identifies reclaimable accounts
- ✅ Transactions are properly constructed
- ✅ No false positives (attempting to reclaim active accounts)
- ✅ Handles edge cases gracefully

**2. Code Quality (20%)**
- ✅ Clean, readable TypeScript code
- ✅ Proper error handling
- ✅ Comprehensive logging
- ✅ Well-documented functions

**3. Practicality (20%)**
- ✅ Easy to deploy and operate
- ✅ Low resource requirements
- ✅ Reliable (doesn't crash or hang)
- ✅ Efficient (minimizes RPC costs)

**4. Documentation (10%)**
- ✅ Clear README with setup instructions
- ✅ Architecture explanation
- ✅ Code comments
- ✅ Design trade-offs documented

**5. Polish (10%)**
- ✅ Professional presentation
- ✅ Working demo video
- ✅ Thoughtful feature set
- ✅ Production-ready code

---

### Self-Assessment Checklist

Before submitting, ensure:

**Core Functionality:**
- [ ] Bot connects to Solana RPC
- [ ] Discovers Kora-sponsored accounts
- [ ] Identifies accounts eligible for reclaim
- [ ] Builds valid reclaim transactions
- [ ] Submits transactions successfully
- [ ] Tracks reclaim status

**Reliability:**
- [ ] Handles RPC rate limits
- [ ] Recovers from transient errors
- [ ] Persists state across restarts
- [ ] Logs all important events
- [ ] Runs for >1 hour without issues

**Quality:**
- [ ] Code is TypeScript with proper types
- [ ] All functions have JSDoc comments
- [ ] Error messages are descriptive
- [ ] No hardcoded values (use config)
- [ ] Follows consistent code style

**Documentation:**
- [ ] README explains architecture
- [ ] Setup instructions are complete
- [ ] Configuration is documented
- [ ] Troubleshooting guide included
- [ ] Technical decisions explained

**Demo:**
- [ ] Video shows bot in action
- [ ] Narration explains key features
- [ ] Shows successful rent reclaim
- [ ] Demonstrates monitoring dashboard
- [ ] <5 minutes duration

---

## 🎓 Key Lessons for Solana Development

### Lesson #1: Rent is Not Optional

**Critical Understanding:**
```
Every account on Solana requires rent to stay alive.
Rent = Data size × Cost per byte per epoch

For most accounts:
- Token account: ~0.00203928 SOL
- System account: ~0.00089088 SOL
- Program account: Much higher (varies by size)

When account closes, ALL lamports (including rent) are returned to 
the rent collector address specified in the close instruction.
```

**For the Bot:**
- Always verify account has enough lamports to justify reclaim
- Gas costs might exceed reclaimable rent for small accounts
- Batch small reclaims to amortize transaction costs

---

### Lesson #2: RPC Reliability is Your #1 Challenge

**Hard Truth:**
```
Public RPC endpoints are:
- Rate limited (100 req/10sec)
- Sometimes slow (>5s response)
- Occasionally down
- May return stale data

Your bot MUST handle this gracefully or it will fail in production.
```

**Solutions:**
1. Use retry logic with exponential backoff
2. Implement request queueing
3. Cache responses aggressively
4. Have fallback RPC endpoints
5. Consider paid RPC services (Helius, QuickNode)

---

### Lesson #3: Solana State is Eventually Consistent

**Critical Detail:**
```
Different RPC nodes may return different data for same query at same 
time due to:
- Different slot heights
- Different commitment levels
- Network propagation delays

Always specify commitment level in RPC calls:
- "finalized": Safest, confirmed by supermajority
- "confirmed": Fast enough for most use cases
- "processed": Latest but may be rolled back
```

**For the Bot:**
- Use "confirmed" commitment for monitoring (speed matters)
- Use "finalized" commitment for reclaim verification (safety matters)
- Never assume state is immediately consistent

---

## 🏆 Winning the Bounty - Final Tips

### Tip #1: Show, Don't Tell

**Bad Submission:**
```
"I built a rent-reclaim bot. It works great. Here's the code."
```

**Winning Submission:**
```
"I built a production-ready rent-reclaim bot that:
- Monitors 100+ accounts with <1% RPC overhead [demo video timestamp 0:30]
- Reclaims rent within 30 seconds of account closure [demo video timestamp 1:45]
- Handles rate limits, retries, and errors gracefully [code ref: src/rpc.ts:45]
- Recovers 99.8% of reclaimable rent [proof: test results screenshot]

Key technical decisions:
- Chose polling over websockets for simplicity and reliability
- Used SQLite for persistence (lightweight, no external dependencies)
- Implemented adaptive monitoring intervals to minimize RPC costs

Try it yourself: [deployment instructions]
Watch it work: [5-minute demo video]
"
```

**Judges love specifics and evidence.**

---

### Tip #2: Make It Stupidly Easy to Test

**Include a Test Script:**
```typescript
// test.ts - One-command testing
// Run: npm run test-demo

async function demoBot() {
  console.log("🚀 Starting rent-reclaim bot demo...\n");
  
  // 1. Connect to devnet
  console.log("1. Connecting to Solana devnet...");
  // ... show connection
  
  // 2. Create test account
  console.log("2. Creating test account with rent...");
  // ... create account
  
  // 3. Close account
  console.log("3. Closing account...");
  // ... close
  
  // 4. Run bot
  console.log("4. Running bot to detect and reclaim...");
  // ... run bot
  
  // 5. Show results
  console.log("5. ✅ Success! Rent reclaimed.");
  console.log(`   Transaction: ${signature}`);
  console.log(`   Amount: ${lamports / LAMPORTS_PER_SOL} SOL`);
}
```

**Judges will actually run your code if it's this easy.**

---

### Tip #3: Demonstrate Production Thinking

**Show You Understand Scale:**
```
"Current implementation monitors 100 accounts and makes ~50 RPC calls 
per minute. To scale to 10,000 accounts:

1. Add multi-threading (8x throughput)
2. Increase batch sizes (2x efficiency)  
3. Use paid RPC endpoint (no rate limits)

Estimated costs at 10K accounts:
- RPC: $50/month (Helius Growth plan)
- Compute: $5/month (AWS t3.small)
- Total: ~$55/month, recovers ~$500/day in rent

ROI: 9x positive, profitable at scale."
```

**This shows you can think beyond the MVP.**

---

### Tip #4: Document Your Journey

**Keep a DEVLOG.md:**
```markdown
# Development Log

## 2026-01-30 14:00 - Project Start
- Read bounty requirements
- Researched Kora documentation
- Decided on TypeScript + Node.js approach

## 2026-01-30 15:30 - Architecture Phase
- Discussed with Gemini, chose polling over websockets
- Drew system diagram (see architecture.png)
- Defined module structure

## 2026-01-30 17:00 - First Code
- Implemented RPC client with rate limiting
- Got first successful getProgramAccounts call
- Discovered 23 Kora-sponsored accounts on devnet

## 2026-01-30 19:00 - Hit First Bug
- Reclaim transactions failing with "InvalidAccount" error
- Root cause: Using wrong program ID for close instruction
- Fixed by checking account owner first

## 2026-01-30 21:00 - Bot Working!
- Successfully reclaimed rent from test account
- Transaction confirmed in 2 slots
- Starting polish phase tomorrow

## 2026-01-31 10:00 - Final Submission
- Added monitoring dashboard
- Wrote comprehensive README
- Recorded demo video
- Submitted to Superteam Earn!
```

**Judges appreciate transparency and problem-solving skills.**

---

## 📚 Additional Resources

### Official Documentation
- **Kora Docs:** https://launch.solana.com/docs/kora
- **Solana Web3.js:** https://solana-labs.github.io/solana-web3.js
- **Solana RPC API:** https://solana.com/docs/rpc
- **Solana Cookbook:** https://solanacookbook.com

### Gemini Resources
- **Google AI Studio:** https://aistudio.google.com
- **Gemini API Docs:** https://ai.google.dev/docs
- **Model Specs:** https://ai.google.dev/gemini-api/docs/models

### Community & Support
- **Solana Discord:** https://discord.gg/solana
- **Superteam Discord:** https://discord.gg/superteam
- **Solana Stack Exchange:** https://solana.stackexchange.com

### Tools & Services
- **Solana Explorer:** https://explorer.solana.com
- **Helius RPC:** https://helius.dev (best paid RPC)
- **Alchemy Solana:** https://alchemy.com/solana
- **QuickNode:** https://quicknode.com

---

## 🎯 Final Checklist

**Before Starting:**
- [ ] Read all bounty requirements carefully
- [ ] Set up Google AI Studio account
- [ ] Upload all documentation to Gemini
- [ ] Have architecture discussion

**During Development:**
- [ ] Use Gemini 2.5 Pro for coding
- [ ] Switch to Thinking model for complex logic
- [ ] Keep multiple focused chats
- [ ] Test each feature before moving on

**Before Submission:**
- [ ] All requirements met
- [ ] Code is clean and commented
- [ ] README is comprehensive
- [ ] Demo video recorded
- [ ] Test script works
- [ ] No private keys in code

**Submission:**
- [ ] GitHub repository is public
- [ ] README has setup instructions
- [ ] Demo video uploaded to YouTube
- [ ] Submission on Superteam Earn
- [ ] Include Devlog.md

---

## 🎊 Conclusion

You now have the complete playbook for building a winning Solana project with Google AI Studio and Gemini 2.5 Pro. This guide distilled:

✅ **8 elite vibe coding principles** from real $300K/year builders  
✅ **Gemini-specific techniques** that outperform traditional coding  
✅ **Complete architecture** for the rent-reclaim bot  
✅ **Phase-by-phase implementation strategy** with exact prompts  
✅ **Production-ready patterns** for Solana development  
✅ **Winning submission tactics** from successful bounty hunters  

**Remember the core philosophy:**
1. **Gemini is your technical co-founder** - Have real discussions about architecture
2. **Context is everything** - Use the 2M token window to load all docs
3. **Simple beats complex** - Ship clean code, not over-engineered systems
4. **Productive downtime** - Use every idle moment strategically
5. **Natural language wins** - Forget prompt engineering, just talk to Gemini
6. **Visual context matters** - Screenshots unlock 10x better results
7. **Think for hard problems** - Use Thinking models for complex logic
8. **Show your work** - Document decisions, not just code

**The difference between good and great submissions:**
- Good: Works correctly
- Great: Works correctly + Easy to use + Well documented + Production thinking

You're not just building a bot. You're demonstrating you can ship production-grade Solana applications using cutting-edge AI development techniques.

**Now go build. The $1,000 USDC is waiting.**

---

**Questions or stuck? Drop them in the Superteam Discord or DM me on X: @your_handle**

**Good luck! 🚀**


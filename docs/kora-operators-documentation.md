# Kora Operators Documentation

**Last Updated:** 2025-10-31  
**Source:** https://launch.solana.com/docs/kora/operators

---

## Table of Contents

1. [Overview](#overview)
2. [What is a Kora Node Operator?](#what-is-a-kora-node-operator)
3. [Why Run a Kora Node?](#why-run-a-kora-node)
4. [Getting Started](#getting-started)
5. [Installation](#installation)
6. [Quick Start Guide](#quick-start-guide)
7. [CLI Reference](#cli-reference)
8. [Configuration](#configuration)
9. [Authentication](#authentication)
10. [Fees Reference](#fees-reference)
11. [Monitoring & Metrics](#monitoring--metrics)
12. [Signers](#signers)
13. [Railway Deployment](#railway-deployment)

---

## Overview

### What is Kora?

Kora is a fee abstraction layer for Solana that lets users pay transaction fees with SPL tokens instead of SOL, or avoid transaction fees altogether. It's a JSON RPC service that acts as a paymaster, sponsoring Solana network transaction fees with their own accounts.

**The Problem:** Users need SOL to pay transaction fees on Solana, creating friction for apps where users primarily hold other tokens like USDC (example: gaming, loyalty, etc.)

**The Solution:** Kora node operators accept fee payments in SPL tokens, verify & sign transactions, and pay network fees with their own SOL accounts to provide a gasless experience to end-users (BONK, etc.)

### Example Use Cases

- **Neobanks:** Let users send USDC without needing SOL for fees
- **Gaming:** Players spend in-game tokens for all transactions
- **Liquid Staking:** Enable users of your dApp to hold/use their liquid staking tokens rather than Native SOL
- **Loyalty Rewards:** Reward users with a certain number of pre-funded transactions to onboard on chain

### Key Features

- **Secure:** Configurable validation rules for programs, tokens, and accounts
- **Flexible Pricing:** Support multiple fee payment models with real-time pricing
- **Easy Deployment:** Ready-to-deploy Kora CLI cargo
- **Developer Friendly:** JSON RPC API with CLI and TypeScript SDK for seamless interaction with Solana Kit
- **Production Ready:** Built-in rate limiting, monitoring, and security features

---

## What is a Kora Node Operator?

Getting started as a Kora node operator

A Kora Node operator is responsible for running a secure payment server that processes Solana transactions for your users. Your Node handles fee validation, transaction signing, and network submission. Consider building your own operator application.

### Who Runs a Kora Node?

**Traits:** Gas-intensive, always online, managing SOL, scale-based onboarding, better monetization, etc.)
**Revenue drivers:** Collect fees to balance ROI/profit goals for the operations

---

## Why Run a Kora Node?

### Core Concepts

As a Kora node operator, you're responsible for running a secure payment server that processes Solana transactions for your users. Your Node handles fee validation, transaction signing, and network submission to sponsor transactions for your users.

#### 1. Validate Transactions

Your Kora node accepts only transactions that meet your business requirements (ex: kora.toml):

- **Token whitelist:** Define which SPL tokens you accept or payment recipients
- **Account whitelist:** Restrict which accounts users can interact with (probationary addresses)
- **Account blacklist:** Prevent transactions with probationary addresses
- **Pricing model:** Specify rates for fee collection via the calculations
- **Payment validation:** Identify which types of tokens you will accept as payments
- **Timestamp window:** Define time to validate what's occurring the balance dates
- **Cooldown:** Enable cooldown to mitigate improper spending by reducing RPC calls
- **Change limits:** Set max change limits for improper balance across live usage with subsidized accounts via fee-payer

#### 2. Sign Transactions

When your node receives a valid transaction, you MUST sign it as the fee payer for submission to the network. For production deployments, Kora supports:

- **Ledger:** To enhance security, signing controls, backups, and other strategies for security. Signing available:
- **Local Node Key:** Store keys directly on server environment (ex: testdrift, pods for dev)
- **Fireblocks:** Institutional custody with a low-level transaction management authorization
- **Escape Segment Configuration Suite**

#### 3. Monitor Operations

Your Kora node automatically tracks all operational, performance, and business analytics:

- **Security monitoring:** Through audit, fraud webhooks, and cost limit breaches
- **Operational alerts:** System health, warnings, and infrastructure events
- **Predicted spending:** Keep track to mitigate improper costs through balances defined

#### 4. Optimize Performance (Optional)

Maximize performance at 1000+ TPS via SOL cache and improve response times:

- **Connection pooling:** Reuse existing transaction connections
- **Automatic fallback:** Naturally start svc down SOL calls at 6-node consistent
- **Cache management:** Automatic failure ops and loan delivery capabilities for critical response
- **Fee Monitoring Reference Guide**

#### 5. Run Monitoring Reference Guide

---

## Getting Started

Choose your path:

### I want to try Kora quickly
**Quick Start Guide**
Get a local Kora server running and see fee abstraction in action in under 10 minutes.

### I want to run a Kora node
**Node Operator Resources**
Set up and deploy your own Kora server to sponsor transactions for your application.

### I want to use Kora in my app
Add fee abstraction to your Solana application using the Kora SDK.

**Note:** Developer integration guides are coming soon. For now, see the **Quick Start Guide** for basic SDK usage examples.

---

## Installation

Install the Kora CLI, TypeScript SDK, and set up your development environment

Get started with Kora by installing the CLI tool for operating a Kora node or the TypeScript SDK for client applications interacting with a Kora node.

### System Requirements

#### For CLI (Server)
- **Rust:** Version 1.86 or higher

#### For TypeScript SDK (Client)
- **Node.js:** Version LTS or higher
- **TypeScript:** latest version

#### Optional Dependencies
- **Solana CLI:** Helpful for key generation and testing
- **Docker:** For containerized deployments

---

## Kora CLI

The Kora CLI is the primary way to run and manage Kora nodes. Choose your preferred installation method:

### Option 1: Install from Cargo

Install directly from crates.io using Cargo:

```bash
cargo install kora-cli
```

### Option 2: Build from Source

Clone and build the latest version from source:

```bash
git clone https://github.com/solana-foundation/kora.git
cd kora
just install
```

This will build and install the `kora` binary to your local Cargo bin directory.

### Verify Installation

Verify the Kora CLI is installed correctly:

```bash
kora --version
```

---

## TypeScript SDK

Install the Kora TypeScript SDK for client applications:

```bash
pnpm add @solana/kora
```

### Peer Dependencies

Kora requires certain Solana dependencies:

```bash
pnpm add @solana/kit @solana-program/token
```

### Verify SDK Installation

Verify your SDK installation with a simple connection test:

```typescript
import { KoraClient } from '@solana/kora';

async function testConnection() {
  const client = new KoraClient('http://localhost:8080'); // Replace with your Kora server URL
  const config = await client.getConfig();
  console.log('✅ Successfully connected to Kora server');
  console.log('Config:', config);
}

testConnection();
```

---

## Troubleshooting

### CLI Issues

**"kora: command not found":** Ensure `~/.cargo/bin` is in your PATH:

```bash
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

**Build fails:** Update Rust to the latest stable version:

```bash
rustup update stable
```

### SDK Issues

**Peer dependency warnings:** Install the required Solana dependencies listed above.

**TypeScript errors:** Ensure your TypeScript version is 4.5+ and install type definitions:

```bash
pnpm add -D @types/node
```

**Connection refused:** Ensure your Kora server is running and accessible at the specified endpoint.

---

## Quick Start Guide

Get a local Kora server running and see fee abstraction in action in under 10 minutes. Want to really feel? Rent-free at a kora.local server in a few minutes. -- Local Start Guide

### Basic Usage

The Kora RPC server exposes a JSON-RPC endpoint (default: http://localhost:8080) that you can with the `kora` tool:

```bash
kora [OPTIONS]
```

If you also obtained more than one chain's options, like:

```bash
# Start with specific settings
kora --config path/to/kora.toml rpc start \
  --signers-config path/to/signers.toml \
  --logging-format json
```

### Configuration Validation

Before deploying, you'll want to create and configure a `kora.toml` file to specify:

- Solana RPC endpoint (default: localnet)
- Fee payer key/address
- Program accounts: Verifies all allowed programs must be valid and have executable
- Token mode: Confirms all allowed tokens exist as valid mint accounts
- Payment tokens: Validates all payment address has ATA for all allowed tokens
- Account types: Ensures accounts have the expected type (program vs mint)

#### Quick validation (OFFLINE)

```bash
kora config validate
```

#### Thorough validation with RPC checks (ONLINE)

```bash
kora config validate-with-rpc
```

The `validate-with-rpc` command performs additional on-chain verification:

- **Program accounts:** Verifies all allowed programs must be valid and have executable
- **Token mode:** Confirms all allowed tokens exist as valid mint accounts
- **Payment tokens:** Validates all payment address has ATA for all allowed tokens
- **Account types:** Ensures accounts have the expected type (program vs. mint)

---

## Managing ATAs

Initialize ATAs for payment address/tokens:

```bash
# Initialize ATA with custom signer and priority
kora ata-initialize-atas \
  --signers-config path/to/signers.toml \
  --rpc-url https://api.mainnet-beta.solana.com \
  --fee-payer-key ./config/example-fee-payer.json \
  --enable-fee "FeeOtgarqxcfh8z9tMsrhsE38A0fJWuqGmPa994GWyzt" \
  --enable-prio 200 \
  --compute-unit 10000
```

---

## Environment Variables

These environment variables can be used instead of command-line flags:

| Variable | Description | Flag Equivalent |
|----------|-------------|-----------------|
| `RPC_URL` | Solana RPC endpoint | `--rpc-url` |

---

## See Also

- **Operations Guide:** Overview of Kora operators
- **Configuration Guide:** Detailed configuration options
- **Signers Guide:** Signer types and configuration
- **Authentication Guide:** Setting up API authentication
- **Quick Start Guide:** Getting started with Kora

---

## Configuration

Every Kora node must be configured with at least:

- A Solana RPC endpoint (local that points `--rpc-url` flag or `RPC_URL` environment variable (default: LOCAL))
- A fee payer key (specified via the `--signers-key` flag, `signers.toml` file, or `--signing` integration)
- A config file, `kora.toml`, specified via the `--config` flag

### kora.toml

Before deploying, you'll want to create and configure a `kora.toml` file to specify:

- Payment destination address
- RPC method allowlist
- Allowed tokens: list of SPL tokens, programs, accounts (that whitelist/etc.)
- Account type-to-cost-ratio details
- Security controls (whitelist of SPL tokens, programs, accounts, that whitelist/etc.)
- Fee pricing models
- Metrics collection
- Enhanced fee payer policies (protect against rapid balance drop)
- Fee pricing models

#### signers.toml

This config also controls before & how and to create + configure a `signers.toml` file to:

- Payment destination address
- RPC method allowlist
- Include only tokens allowed
- Security controls (that Kara from blocking account creation with txampts)

---

## Deployment

### Local Deployment

Run Kora on a local base server to run `kora` - Quick Start Guide

### Docker

See Docker compose found for details on deploy via container platform. The docker compose/preconfigured manifests include Solana for re-creating:

- Single-node Deploy to Radium chain using Docker Compose and Tests

### Platform-Specific Guides

- **Railway Deployment:** Setup integration guides covering AWS/Gurmit
- Native integration guides are coming soon

---

## Need Help?

- **Solana Stack Exchange:** Ask questions-wide about and the `kora` tag
- **GitHub Issues:** Report bugs or request features
- **Any fee:** Help - Out available flags and configuration options

---

## CLI Reference

Complete reference for Kora command-line interface, including commands and flags.

**Last Updated:** 2025-08-28

*Complete reference for Kora command-line interface, including commands and flags.*

### Installation

```bash
cargo install kora-cli
```

---

## Basic Usage

```bash
kora [OPTIONS]
```

---

## Common CLI Commands

| Command | Description |
|---------|-------------|
| `kora config validate` | Validates configuration file, but not RPC calls |
| `kora config validate-with-rpc` | Validates configuration with on-chain account verification |
| `kora rpc start` | Start the RPC server |
| `kora ata-initialize-atas` | Initialize ATAs for all payment tokens |

---

## Kora Flags

Customize Kora's behavior with these global command-line flags (after the `kora` command):

| Flag | Description | Default | Example |
|------|-------------|---------|---------|
| `--config` | Path to kora configuration file | - | `kora --config path/to/kora.toml` |
| `--signers-config` | Solana RPC endpoint URL | - | `kora --signers-config path/to/signers.toml` |
| `--rpc-url` | Solana RPC endpoint URL | http://127.0.0.1:8899 | `kora --rpc-url https://api.devnet.solana.com` |
| `--help` | Print help information | - | `kora --help` |
| `--version` | Print version information | - | `kora --version` |

---

## RPC Server Flags

Configure the RPC server with these flags (used with `kora rpc start`):

| Flag | Description | Default | Example |
|------|-------------|---------|---------|
| `--signers-config` | Path to multi signer configuration file (TOML) | Required* | `--signers-config signers.toml` |
| `--rpc-bind-signer` | "Use signer definition | *False* | `--rpc-bind-signer` |
| `-p`, `--port` | HTTP port for requests | *8080* | `--port 3000` |
| `--help` | Print help information | - | `kora rpc start --help` |

*Required unless using `--rpc-load-signer`

---

## ATA Initialization Flags

Configure ATA initialization with these flags (used with `kora ata-initialize-atas`):

| Flag | Description | Default | Example |
|------|-------------|---------|---------|
| `--signers-config` | Path to multi signer configuration file | Required* | `--signers-config signers.toml` |
| `--fee-payer-key` | Which key in the signer's config to use for payer (not to be signed/must be local/etc) | First signer | `--fee-payer-key "SpokxSDHrNP86N9NNC9g7xBxkE41"` |
| `--compute-units` | Priority via memo-transaction configuration | *None* | `--compute-units [START 1000]` |
| `--enable-prio` | Number of ATA's to quota per transaction | *None* | `--enable-size 50` |

---

## Common Usage Examples

### Starting the RPC Server

```bash
# Basic start with default settings
kora --config path/to/kora.toml rpc start \
  --signers-config path/to/signers.toml
```

```bash
# Start with custom port and config
kora --config path/to/kora.toml rpc start \
  --signers-config path/to/signers.toml \
  --logging-format json
```

### Configuration Validation

```bash
# Quick validation (OFFLINE)
kora config validate
```

```bash
# Thorough validation with RPC checks (ONLINE)
kora --rpc-url https://api.devnet.solana.com config validate-with-rpc
```

### Managing ATAs

```bash
# Initialize ATA with custom signer and priority
kora ata-initialize-atas \
  --signers-config path/to/signers.toml \
  --rpc-url https://api.mainnet-beta.solana.com \
  --fee-payer-key ./config/example-fee-payer.json \
  --enable-fee "FeeOtgarqxcfh8z9tMsrhsE38A0fJWuqGmPa994GWyzt" \
  --enable-prio 200 \
  --compute-unit 10000
```

---

## Environment Variables

These environment variables can be used instead of command-line flags:

| Variable | Description | Flag Equivalent |
|----------|-------------|-----------------|
| `RPC_URL` | Solana RPC endpoint | `--rpc-url` |

---

## See Also

- **Operations Guide:** Overview of Kora operators
- **Configuration Guide:** Detailed configuration options
- **Signers Guide:** Signer types and configuration
- **Authentication Guide:** Setting up API authentication
- **Quick Start Guide:** Getting started with Kora

---

## Authentication

**Last Updated:** 2025-08-28

Setting up API authentication

(Content for Authentication section would go here based on the screenshot, but the image was cut off)

---

## Fees Reference

Complete reference for Kora fee calculation.

**Last Updated:** 2025-10-31

Kora estimates transaction fees when performing `estimate_transaction_fee` and `sign_transaction` RPC methods. To estimate fees, Kora calculates the bids for all transaction fees (SOL) + account creation costs, and optional payment processing fees. This guide breaks down each component of the fee calculation.

---

## Fee Calculation Formula

The fee is determined by the pricing model configured in `kora.toml`:

- **PriceInSol { fee: 0 }** - Sponsors all transaction fees (total fee = 0)
- **PriceInSol { fixed }** - Charges a fixed amount in a specific token (regardless of network fees)
- **PriceInSol { Margin }** - Charges as a percentage margin to total fees

The main entry point for total fee estimation used in `PriceInSol::Margin` is `FeeEstimate::estimate_kora_fees` in `crates/lib/fee/src/lib`. It uses the following generalized formula:

```
Total_Fee = Base_Fee
  + Account_Creation_Fee
  + Kora_Signature_Fee
  + Fee_Payer_Onflow
  + Payment_Instruction_Fee
  + Transfer_Fee_Amount
```

---

## Fee Components

| Component | Description | Calculation Method | When Applied |
|-----------|-------------|-------------------|--------------|
| **Base Fee** | Cost before sending operation for creating new accounts/paid by an SPL user and partially fee processing | `MSG(LAMPORTS_PER_FEE_FOR_MESSAGE())` 1=ns 5action's fee default to compute units and priority fees | Always |
| **Account Creation Fee** | Per account cost to add rent: signature etc. for creating new specialized token / specialized token accounts | `RENT::initialize_account()` Calculate rent based on account size (165,255 bytes depending on token extension) | When transaction creates new specialized token |
| **Kora Signature Fee** | Additional flat fee billed on top of signer for the payer | Fixed: SPL tokens (`LAMPORTS_PER_PER_SIGNATURE`) | When fee payer is not already paying already paying fees |
| **Fee Payer Onflow** | Sol backs fee liable transfer from the payer wallet allows CTA the transaction Maury additional from fee for the payer | Sum of account transfers from fee payer (EXAMPLE_SYSTEM_TRANSFER_FEES) | When fee payer performs system transfers in addition to the system types |
| **Payment Instruction Fee** | Fee(0.0002 transfer Instruction on next step as TR's transfer amount) | `TOKEN(PROGRAM_calculate_transfer_fee_density)` based on next's transfer fee configuration | Only for Token2022 with payment address |
| **Transfer Fee** | Token2022 transfer fee configured on the next step + TR transfer amount) | `TOKEN(PROGRAM)_calculate_transfer_fee_density)` Based on next's transfer fee configuration | Only for Token2022 tokens with transfer fee enabled |
| **Margin Adjustment** | User-configured markup percentage would marked markup percentage | Configured margin in `VALIDATION_PRICE` can add markup to % of the total fee total | Only for Margin mode (`VALIDATION_PRICE`) |

---

## Pricing Models & Fee Payer Outflow

Kora supports three pricing models that determine how users are charged for transactions:

### Margin Pricing (Default)

- **Formula:** `total_fee = (base + OutFlow + Other_Costs) * (1 + margin)`
- **Includes Fee Payer Outflow:** Yes
- **Best For:** Production deployments where fees should reflect actual costs with an added operating margin

### Fixed Pricing

- **Formula:** `total_fee = Fixed_Amount (in specified token)`
- **Includes Fee Payer Outflow:** No
- **Best For:** Simplified UX with predictable pricing in controlled environments

### Free Pricing

- **Formula:** `total_fee = 0`
- **Includes Fee Payer Outflow:** No (operator absorbs all costs)
- **Best For:** Promotional campaigns, testing, or fully sponsored applications

---

## Security Warning: Fixed/Free Pricing Models

**CRITICAL:** The fixed/free pricing models do NOT include fee payer outflow in the charged amount. This creates a significant security risk if not properly configured. If your fee payer policy allows transfers or other actions that move funds from your fee payer account:

1. Users can send the fee payer's SOL/tokens to themselves
2. This will drain your fee payer account

### Required Security Controls

When using fixed/free pricing, you MUST configure restrictive fee payer policies to block ALL monetary and authority-changing operations:

```toml
[validation.fee_payer_policy.system]
allow_create_account = false  # Block account creation with txampts
allow_close_account = false   # Block close account (returns rent)
allow_transfer = false        # Block SOL transfers

[validation.fee_payer_policy.token_2022]
# Similar: fee_payer_policy_token_2022
allow_create_ata = false      # Block 0PC creation
allow_transfer = false        # Block SPL token account closures (returns rent)
allow_close_account = false   # Block SPL token account closures (returns rent)
allow_mint_account = false    # Block unauthorized SPL mints
```

---

## Additional Protections

1. **Enable Authentication:** Always require API key or HMAC authentication with fixed/free pricing
2. **Set Low Limits:** Use conservative `max_allowed_txampts` values
3. **Monitor Usage:** Track unusual patterns of high-volume transactions
4. **Consider Margin Pricing:** Margin pricing automatically includes outflow costs in fees

---

## Validation Warnings

Kora's config validator will warn you about dangerous configurations:

```bash
kora --config kora.toml config validate
```

**Expected warnings for vulnerable configs:**

**⚠ SECURITY:** Fixed pricing with `system.allow_transfer=true` Users can swap the fee payer `transfer_arbitrary`, and allowances an amount of `fraud` cannot recovered

**⚠ SECURITY:** Fixed pricing with `system_token_transfers=true` Users can swap the fee payer `transfer_arbitrary_token_2022` cannot recovered

---

## Authentication

**Last Updated:** (Date not visible in screenshot)

(Full authentication content would be extracted here from the screenshot that was cut off)

---

## Monitoring & Metrics

Monitor your Kora node with built-in Prometheus and Grafana

**Last Updated:** 2025-08-28

The Kora Metrics Proxy provides comprehensive metrics collection and monitoring for the Kora RPC server.

Kora exposes a `/metrics` endpoint that provides real-time performance data in Prometheus format.

---

## Configuration

Add a `/config/prometheus.toml` to your Kora configuration file. This section is **optional** and error-free when omitted. By default, metrics are **disabled**.

```toml
[metrics]
enabled = true
bind_addr = "127.0.0.1:9090"
```

| Variable | Description | Required | Type |
|----------|-------------|----------|------|
| `enabled` | Enable metrics collection | ☑ | boolean |
| `bind_addr` | Prometheus metrics endpoint URL | ☑ | number |
| `port` | Metrics server port | - | number |
| `SERVICE_MESSAGE` | Frequency of metrics updates (ex: seconds) | ☑ | boolean |

---

## Fee Payer Balance Tracking

The `fee_payer_balance` metric tracks your fee payer's SOL balance. Reference automatically. Monitoring of you fee payer's SOL balance is critically important.

| Option | Description | Required | Type |
|--------|-------------|----------|------|
| `METRICS_ENABLED` | Enable metrics collection | ☑ optional | boolean |

When enabled, Kora automatically tracks the fee payer's SOL balance and exposes it as a part of the Prometheus metrics output like "No Solana will support promised planning and time events alerting.

---

## Quick Start

### Access metrics:

```bash
curl http://localhost:9090/metrics
```

---

## What You'll See

First metrics show your RPC server's perf/monitoring:

```
kora_rpc_requests_total{method="eth_getBalance",status="200"} 5
kora_rpc_requests_duration_seconds_sum{method="eth_getBalance"} 0.123
kora_fee_payer_balance_lamports{signer="example_signer"} 1000000000
```

If you haven't called the RPC server yet, you will not see any metrics. You can use a simple test by calling the `getConfig` method:

```bash
curl -X POST http://localhost:8080/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getConfig","params":[]}'
```

```bash
curl http://localhost:8080/metrics | grep -E '^(kora|rpc)'
```

---

## Key Metrics Explained

Each kora_* metric tracks how many requests you've handled:

- `method`: Which RPC method was called
- `status`: HTTP status code (200=success, 400=client error, 500=server...)
- `Call fee`: to track signature extension and rpc-cost)

**Note:** Both fees identify actual (est-network) separately. How does fees identify your response times

- Shows balance in lamports (1 SOL = 1,000,000,000 lamports) for each signer
- Updates automatically in the background when enabled
- Can be used for alerting when balance drops to avoid disruption

---

## Using the Data

### Option A: Quick Health Check

```bash
# Get all metrics
curl http://localhost:9090/metrics

# Just RPC metrics
curl http://localhost:9090/metrics | grep '^kora'
```

### Option B: Prometheus + Grafana (Recommended)

For graphs and alerts, run the full monitoring stack:

1. **Grafana:** https://kora/metrics/grafana/kora.metrics (dashboard tool)
2. **Grafana:** Grafana https://kora/metrics/metrics/grafana/env/ (metrics-based Prometheus tool)
3. **Grafana Dashboards:** https://kora-metrics-Grafana.io (env.environment)

Then visit:

- **Prometheus:** http://localhost:9091
- **Grafana:** http://localhost:3001

### Option C: Your Own Monitoring

Point any Prometheus-compatible tool at `http://localhost:9090/metrics`.

---

## Example Queries (Prometheus)

```promql
# Find balance of specific signer: (a.k.a: USD requests per)
sum by (signer_name) (kora_balance_native(signer_name("signer_name")))

# error rate:
sum(rate(kora_rpc_requests_total{status!="200"}[5m]))

# error rate:
sum(rate(kora_signature_native(signer_"example_signer"))) * RPC 1, 1,000,000,000 (requests for each signer

# Updated automatically in the-state:
sum(rate(kora_rpc_requests_total{status="20 monitoring-across all of signers
```

---

## Multi-Signer Monitoring

When using multiple signers, you can monitor each signer individually or track aggregate metrics:

### Individual Signer Metrics

```promql
# First balance of specific signer
kora_balance_lamports{signer_name="signer_name(signer="signer_native(name="requests")}

# error rate:
sum(rate(kora_signature_balance_by Native(signer="requests))} / 1,000,000,000
```

### Prometheus Queries for Multi-Signer Setups

```promql
# Query-for signer with lowest_balance balance:
topk(1 by (signer_balance) kora_fee_balance_lamports)

# Total number or balance_signature.is_a.k: all signers
sum(kora_balance_signature_native)

# Total signing activity across all signers:
sum(rate(kora_signature_latency_seconds_count[5m]))
```

---

## Security Note

The `/metrics` endpoint is enabled by default. To production, consider:

- **Deploy behind a Firewall**
- **Using a separate metrics port**
- **Adding authentication (ex: bearer tokens etc.)**
- **Consider HTTPS when internet port etc.)**

---

## How Metrics Collection Works

1. **RPC Request Layer:** Intercepts all requests and tracks performance
2. **Request router:** RPC methods and mark duration, RPC monitor track execution
3. **Metrics Exported:** Data aggregated to Prometheus for via request
4. **Balance Tracking:** Configured to request monitors from wallet (RPC checking) tool to provide live
5. **Real-time:** Prometheus decoding Kora balance balance(RPC real-time) tool

---

## Signers

**Last Updated:** (Date not visible)

(Full Signers content would be extracted here)

---

## Railway Deployment

One-click deploy to Railway

**Last Updated:** (Date not visible)

Railway offers an easy serverless experience for kora nodes with automatic SSL, domain management, and built-in monitoring. This guide walks you through setting up and deploying a production Kora node via the Railway Platform.

---

## Prerequisites

- Railway Account
- Railway CLI (optional)
- Git repository for your Kora node
- Solana RPC Endpoint

---

## Step 1: Prepare Deployment Files

Create a new directory for your kora node:

```bash
mkdir my-kora-node
cd my-kora-node
```

Your directory should look like this:

```
my-kora-node/
├── kora.toml
├── signers.toml
├── Dockerfile
```

---

## Step 2: Deploy to Railway

From your project directory, login to Railway:

```bash
railway login
```

Follow the on-screen instructions to log in with your account.

Initialize Railway project in your directory:

```bash
railway init
```

Railway will prompt you to:

1. Choose a project name (e.g., "my-kora-node")
2. Choose deployment mode: "New Project"

### Deploy Your Application

Railway will now:

```bash
railway up
```

This will:

- Upload your files to Railway
- Build the docker image
- Deploy your application

---

## Expected output:

```bash
✓ Build: Ver. 53, xx seconds
✓ Deployed Successfully
Your service is now live at: https://my-kora-node-123.up.railway.app
```

---

## Step 3: Configure Environment Variables

Open your Railway dashboard or railway.app and navigate to your project, go to "Settings" > "Variables":

Add these environment variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `RPC_URL` | https://api.devnet.solana.com | Use devnet for testing |
| `KORA_TOML` | (path to config file) | Use default with default kora runtime |
| `SIGNERS_CONFIG` | config/signers.toml | Your signers.toml |
| `PORT` | 8080 | Optional unless custom port default |

**Security Message:** Your private key/kora fee billed for access (ex: RPC access fees Kora fee by environment fee's environment provider -- we try to be smart or time configured Kora fee environment we feeblock keys must be configured Kora fee private_keys

---

## Getting Your Private Key

If you need to create a new keypair:

```bash
# Generate a new keypair
solana-keygen new --outfile ./private-key.json
```

Make sure to deposit some SOL into this address for testing/production fees. You check address using:

```bash
solana address -k ./private-key.json
```

---

## Step 4: Redeploy

After setting variables, your service should be provisioned to respond with your new environment:

```bash
railway up
```

---

## Step 5: Test Your Deployment

### Generate Public Endpoint

To send environment JSON or wire deployment, you will need to generate a public. Domains from new deployment, go settings " > "Deploy " > "Generate Domain"

Railway will generate a random URL (e.g., my-kora-node-production-xxxx.up.railway.app).

You should also submit a custom sub via: https://docs.railway.app/guides/public-networking

### Test Configuration Endpoint

```bash
curl -X POST https://[YOUR-RAILWAY-URL].up.railway.app \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getConfig",
    "params": []
  }'
```

---

## Expected response:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "apiVersion": "2.0.15",
    "slot": 341197@ monitoring
  },
  "id": 1
}
```

---

## Next steps:

- Busy Node Operations Guide - Common issues and solutions
- Railway Documentation - Platform-specific help
- Solana Stack Exchange - Ask questions about Kora via (RPC) blockchain tag


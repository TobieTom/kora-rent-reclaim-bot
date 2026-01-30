# Solana Accounts - Core Concepts

**Source:** https://solana.com/docs/core/accounts

Essential understanding of Solana accounts for building the rent-reclaim bot

---

## Table of Contents

1. [Overview](#overview)
2. [What is an Account?](#what-is-an-account)
3. [Account Structure](#account-structure)
4. [Account Ownership](#account-ownership)
5. [Rent and Rent Exemption](#rent-and-rent-exemption)
6. [Account Types](#account-types)
7. [Program Derived Addresses (PDAs)](#program-derived-addresses-pdas)
8. [Associated Token Accounts (ATAs)](#associated-token-accounts-atas)

---

## Overview

On Solana, all data is stored in what are referred to as "accounts". The way data is organized on Solana resembles a key-value store, where each entry in the database is called an "account".

**Key Points:**
- Accounts can store up to 10MB of data
- Accounts can be owned by programs
- Only the account owner can modify the account's data and debit lamports
- Anyone can credit lamports to an account
- Accounts must maintain a minimum balance (rent-exempt balance) to remain on the blockchain

---

## What is an Account?

Each account is identifiable by its unique address, represented as 32 bytes in the format of an Ed25519 PublicKey. You can think of the address as the unique identifier for the account.

This relationship between the account and its address can be thought of as a key-value pair, where the address serves as the key to locate the corresponding on-chain data of the account.

### Account Visualization

```
┌─────────────────────────────────────────────────────────────┐
│                         Account                              │
├─────────────────────────────────────────────────────────────┤
│ Address: 7EqQdEUz... (32 bytes / Ed25519 PublicKey)        │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                      Account Info                        │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ lamports:    1,000,000 (balance in lamports)           │ │
│ │ owner:       11111...111 (program that owns account)    │ │
│ │ executable:  false                                       │ │
│ │ rent_epoch:  361                                        │ │
│ │ data:        [bytes...] (stored data)                   │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Account Structure

Each account has the following fields:

| Field | Description | Size |
|-------|-------------|------|
| **lamports** | The number of lamports owned by this account | 8 bytes (u64) |
| **owner** | The program owner of this account | 32 bytes (Pubkey) |
| **executable** | Whether this account can process instructions | 1 byte (bool) |
| **rent_epoch** | The next epoch this account will owe rent | 8 bytes (u64) |
| **data** | The data stored in this account | Variable length |

### Field Details

#### lamports
- Represents the account's balance in lamports (1 SOL = 1,000,000,000 lamports)
- Used to pay for transaction fees and rent
- Accounts must maintain minimum balance to be rent-exempt

#### owner
- Specifies which program has write access to this account
- Only the owner program can modify the account's data and debit lamports
- For user wallet accounts, the owner is the System Program
- For token accounts, the owner is the Token Program

#### executable
- Boolean flag indicating if the account contains executable program code
- If true, the account is a program account
- Once set to true, this flag cannot be changed and the account becomes immutable

#### rent_epoch
- Tracks the epoch at which this account will next owe rent
- For rent-exempt accounts, this is set to maximum value (u64::MAX)
- Rent collection happens automatically during transaction processing

#### data
- Stores the actual data/state of the account
- Can be up to 10MB in size
- For program accounts, contains the executable bytecode
- For data accounts, contains arbitrary data structured by the owning program

---

## Account Ownership

On Solana, "ownership" determines which program has write access to an account:

**Key Rules:**
1. Only the account owner can modify account data
2. Only the account owner can debit lamports from the account
3. Anyone can credit lamports to an account
4. The owner of an account may assign a new owner if the account's data is zeroed out

### Common Owner Programs

| Program | Purpose | Typical Accounts |
|---------|---------|------------------|
| **System Program** (`11111111111111111111111111111111`) | Manages user wallet accounts | User wallets, SOL-only accounts |
| **Token Program** | Manages SPL token accounts | Token mint accounts, token accounts |
| **Token-2022 Program** | Enhanced token standard | Token accounts with extensions |
| **Associated Token Account Program** | Creates ATAs | Deterministic token accounts |

---

## Rent and Rent Exemption

### What is Rent?

Rent is a fee charged by the Solana network to maintain accounts on the blockchain. This mechanism ensures that only accounts that are actively used remain on-chain, preventing blockchain bloat.

### Rent-Exempt Accounts

Accounts can become "rent-exempt" by maintaining a minimum balance. Once rent-exempt:
- The account will never be deleted due to rent collection
- No ongoing rent fees are charged
- The account remains on-chain indefinitely (unless closed by the owner)

### Calculating Rent Exemption

The minimum balance for rent exemption depends on the account's data size:

```
rent_exempt_minimum = (data_size + 128) * rent_per_byte_year * years_per_epoch
```

**For typical accounts:**
- Empty account (0 bytes data): ~0.00089088 SOL
- Token account (165 bytes): ~0.00203928 SOL
- PDA account (varies): Depends on data size

### Rent Collection

**Important for Rent-Reclaim Bot:**
- Rent was historically collected automatically during transaction processing
- Since Solana v1.9, accounts below rent-exempt threshold are considered invalid
- New accounts must be created with sufficient lamports to be rent-exempt
- Closing an account returns all lamports (including rent-exempt balance) to a specified address

### Checking Rent Exemption

```javascript
const accountInfo = await connection.getAccountInfo(publicKey);
const minBalance = await connection.getMinimumBalanceForRentExemption(
  accountInfo.data.length
);

const isRentExempt = accountInfo.lamports >= minBalance;
```

---

## Account Types

### 1. Data Accounts

Store arbitrary data owned by programs. These include:

**User Data Accounts:**
- Owned by a specific program
- Contain program-specific data structures
- Examples: Game state, DeFi positions, NFT metadata

**Program Derived Addresses (PDAs):**
- Special accounts derived deterministically from a program ID
- No private key exists for PDAs
- Only the deriving program can sign on behalf of a PDA

### 2. Program Accounts

Store executable program code (smart contracts):

**Characteristics:**
- `executable` field is set to `true`
- `owner` is typically the BPF Loader program
- `data` contains compiled bytecode
- Immutable once marked as executable

**Program Account Structure:**
```
Program Account
├── Executable: true
├── Owner: BPF Loader
├── Data: [compiled bytecode]
└── Lamports: [rent-exempt balance]
```

### 3. Native Programs

Built-in programs that are part of the Solana runtime:

| Program | Address | Purpose |
|---------|---------|---------|
| System Program | `11111111111111111111111111111111` | Create accounts, transfer SOL |
| Token Program | `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA` | SPL tokens |
| Token-2022 | `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb` | Enhanced tokens |
| Associated Token Account Program | `ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL` | Create ATAs |

---

## Program Derived Addresses (PDAs)

### What are PDAs?

PDAs are accounts whose addresses are derived deterministically from:
1. A program ID
2. A collection of seeds (arbitrary bytes)
3. A bump seed (to ensure the address is off the Ed25519 curve)

### Why PDAs Matter

**For Kora Rent-Reclaim:**
- Kora creates PDA accounts to sponsor user transactions
- PDAs allow programs to "sign" transactions programmatically
- No private key exists, so only the program can authorize actions

### PDA Derivation

```javascript
const [pda, bump] = await PublicKey.findProgramAddress(
  [
    Buffer.from("seed1"),
    userPublicKey.toBuffer(),
    Buffer.from("seed2")
  ],
  programId
);
```

### PDA Characteristics

- **Deterministic:** Same seeds always produce the same address
- **No Private Key:** Cannot sign transactions outside the program
- **Program Authority:** Only the deriving program can modify
- **Cross-Program Invocation:** Programs can sign on behalf of their PDAs

---

## Associated Token Accounts (ATAs)

### What are ATAs?

Associated Token Accounts are a specific type of PDA used for SPL token accounts. They provide a deterministic way to find a user's token account for a specific mint.

### ATA Derivation

```
ATA_address = findProgramAddress(
  [
    wallet_address,
    token_program_id,
    mint_address
  ],
  associated_token_program_id
)
```

### ATA Characteristics

**Advantages:**
- Deterministic address (can be derived without RPC call)
- One ATA per wallet per token mint
- Simplifies token transfers (no need to track account addresses)

**For Rent-Reclaim Bot:**
- Kora creates ATAs for sponsored accounts
- Closing ATAs returns rent to the fee payer
- Must check if ATA has zero balance before reclaiming

### Creating an ATA

```javascript
const ata = await getAssociatedTokenAddress(
  mintPublicKey,
  ownerPublicKey,
  false, // allowOwnerOffCurve
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
);
```

---

## Account Lifecycle for Rent-Reclaim Bot

### 1. Account Creation (Sponsorship)
```
User Request → Kora Node → Creates PDA/ATA
                         → Funds with rent-exempt balance
                         → User can transact
```

### 2. Account Usage
```
Account Active → Transactions processed
              → Balance may decrease
              → Account remains rent-exempt
```

### 3. Account Closure (Reclaim)
```
Account Inactive → Bot detects closure/inactivity
                 → Triggers reclaim transaction
                 → Rent returned to fee payer
                 → Account deleted
```

---

## Key Concepts for Rent-Reclaim Bot

### 1. Identifying Sponsored Accounts

Sponsored accounts will have specific characteristics:
- Owned by a particular program (Kora program)
- Created as PDAs or ATAs
- Initially funded by the Kora operator

### 2. Detecting Closure/Inactivity

Check for:
- Account marked as closed (data length = 0)
- Account no longer needed (determined by program logic)
- Token accounts with zero balance
- Accounts that haven't been used in N epochs

### 3. Reclaiming Rent

Process:
1. Verify account is eligible for closure
2. Create close account instruction
3. Specify fee payer as recipient of returned lamports
4. Sign and submit transaction
5. Monitor transaction status

### 4. Rent Calculation

```javascript
// Get rent-exempt balance
const rentExemptBalance = await connection.getMinimumBalanceForRentExemption(
  accountData.length
);

// Total reclaimable
const reclaimable = accountInfo.lamports;

console.log(`Can reclaim: ${reclaimable / LAMPORTS_PER_SOL} SOL`);
```

---

## Code Examples

### Check if Account Exists

```javascript
const accountInfo = await connection.getAccountInfo(accountPublicKey);

if (!accountInfo) {
  console.log('Account does not exist or has been closed');
} else {
  console.log('Account exists with', accountInfo.lamports, 'lamports');
}
```

### Check if Account is Rent-Exempt

```javascript
const minBalance = await connection.getMinimumBalanceForRentExemption(
  accountInfo.data.length
);

const isRentExempt = accountInfo.lamports >= minBalance;
console.log('Rent exempt:', isRentExempt);
```

### Find All Accounts Owned by Program

```javascript
const accounts = await connection.getProgramAccounts(programId, {
  filters: [
    {
      dataSize: 165, // Token account size
    }
  ]
});

console.log(`Found ${accounts.length} accounts`);
```

### Close Account and Reclaim Rent

```javascript
import { createCloseAccountInstruction } from '@solana/spl-token';

const closeInstruction = createCloseAccountInstruction(
  accountToClose,      // Account to close
  destination,         // Where to send lamports
  authority,          // Account authority
  [],                 // Multisig signers (empty if not multisig)
  TOKEN_PROGRAM_ID
);

const transaction = new Transaction().add(closeInstruction);
const signature = await sendAndConfirmTransaction(connection, transaction, [authorityKeypair]);
```

---

## Best Practices

### 1. Always Check Account Existence

```javascript
const info = await connection.getAccountInfo(pubkey);
if (!info) {
  throw new Error('Account does not exist');
}
```

### 2. Verify Account Owner

```javascript
if (!info.owner.equals(expectedOwner)) {
  throw new Error('Unexpected account owner');
}
```

### 3. Handle Rent Exemption Properly

```javascript
const minBalance = await connection.getMinimumBalanceForRentExemption(
  dataSize
);

if (balance < minBalance) {
  console.warn('Account is not rent-exempt');
}
```

### 4. Batch Account Queries

```javascript
// Instead of multiple getAccountInfo calls
const accounts = await connection.getMultipleAccountsInfo([
  pubkey1,
  pubkey2,
  pubkey3
]);
```

### 5. Monitor Rent Epoch Changes

```javascript
const currentEpoch = (await connection.getEpochInfo()).epoch;

if (accountInfo.rentEpoch < currentEpoch) {
  console.log('Account may owe rent');
}
```

---

## Additional Resources

- **Solana Cookbook:** https://solanacookbook.com/core-concepts/accounts.html
- **Anchor Framework:** https://www.anchor-lang.com/docs/account-constraints
- **SPL Token Documentation:** https://spl.solana.com/token
- **Rent Economics:** https://docs.solana.com/implemented-proposals/rent

---

## Summary for Rent-Reclaim Bot

**Critical Account Concepts:**

1. **Accounts store value (lamports)** that can be reclaimed when closed
2. **Rent-exempt balance** is the minimum required; all lamports are recoverable
3. **Only the owner program** can close an account and recover rent
4. **PDAs and ATAs** are common account types sponsored by Kora
5. **Account closure** returns ALL lamports to the specified destination
6. **Use `getProgramAccounts`** to find all Kora-sponsored accounts
7. **Monitor `rentEpoch`** and account usage to identify reclaimable accounts


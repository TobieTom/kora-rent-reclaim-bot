# Contributing to Kora Rent-Reclaim Bot

Thank you for considering contributing to this project! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)

## 🤝 Code of Conduct

This project follows a simple code of conduct:
- Be respectful and professional
- Focus on constructive feedback
- Help others learn and grow

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- Git
- Solana CLI (optional, for testing)

### Setup
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/kora-rent-reclaim-bot.git
   cd kora-rent-reclaim-bot
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Copy environment template:
   ```bash
   cp .env.example .env
   ```

5. Run tests to ensure everything works:
   ```bash
   npm test
   ```

## 🔄 Development Workflow

### Branch Naming
- Feature: `feature/your-feature-name`
- Bug fix: `bugfix/issue-description`
- Hot fix: `hotfix/critical-issue`

### Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our coding standards

3. Write or update tests

4. Run the test suite:
   ```bash
   npm test
   npm run lint
   npm run type-check
   ```

5. Commit your changes:
   ```bash
   git commit -m "feat: add amazing feature"
   ```

### Commit Message Format

We follow conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(monitor): add adaptive scan intervals
fix(rpc): handle rate limit errors gracefully
docs(readme): update installation instructions
test(eligibility): add edge case tests
```

## 📏 Coding Standards

### TypeScript
- Use strict TypeScript (no `any` types)
- Prefer `const` over `let`
- Use descriptive variable names
- Add JSDoc comments for public functions

### Code Style
We use Prettier and ESLint. Run before committing:
```bash
npm run format
npm run lint
```

### Example of Good Code

```typescript
/**
 * Checks if an account is eligible for rent reclaim
 * @param account - The account to check
 * @param currentEpoch - Current epoch number
 * @returns True if account can be reclaimed
 */
export function isReclaimEligible(
  account: AccountInfo,
  currentEpoch: number
): boolean {
  // Account must be closed (data length = 0)
  if (account.data.length !== 0) {
    return false;
  }

  // Account must have lamports to reclaim
  if (account.lamports === 0) {
    return false;
  }

  return true;
}
```

## 🧪 Testing

### Running Tests
```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests (requires devnet access)
npm run test:integration

# With coverage
npm run test:coverage
```

### Writing Tests
- Write tests for all new features
- Maintain >80% code coverage
- Use descriptive test names

**Example:**
```typescript
describe('isReclaimEligible', () => {
  it('should return true for closed account with lamports', () => {
    const account: AccountInfo = {
      data: Buffer.alloc(0),
      lamports: 1000000,
      owner: new PublicKey('11111111111111111111111111111111'),
      executable: false,
      rentEpoch: 0,
    };

    expect(isReclaimEligible(account, 100)).toBe(true);
  });

  it('should return false for account with data', () => {
    const account: AccountInfo = {
      data: Buffer.alloc(100),
      lamports: 1000000,
      owner: new PublicKey('11111111111111111111111111111111'),
      executable: false,
      rentEpoch: 0,
    };

    expect(isReclaimEligible(account, 100)).toBe(false);
  });
});
```

## 📤 Submitting Changes

### Pull Request Process

1. Update documentation if needed
2. Ensure all tests pass
3. Update CHANGELOG.md (if applicable)
4. Push your branch to your fork
5. Create a Pull Request

### PR Title Format
Use the same format as commit messages:
```
feat: add adaptive monitoring intervals
```

### PR Description Template
```markdown
## 🎯 What does this PR do?
Brief description of changes

## 🔄 How to test
Steps to verify the changes work

## 📋 Checklist
- [ ] Tests pass
- [ ] Linting passes
- [ ] Documentation updated
- [ ] CHANGELOG.md updated (if needed)
- [ ] No breaking changes (or documented if unavoidable)

## 📸 Screenshots (if applicable)
Add screenshots here
```

### Review Process
- Maintainers will review your PR
- Address any feedback or requested changes
- Once approved, your PR will be merged

## 🐛 Reporting Bugs

Use the GitHub issue tracker and provide:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Logs or screenshots

## 💡 Suggesting Features

Use the GitHub issue tracker and provide:
- Feature description
- Use case / motivation
- Proposed implementation (optional)
- Impact assessment

## 📞 Getting Help

- GitHub Issues: For bugs and features
- GitHub Discussions: For questions and general discussion
- Twitter: [@your_handle](https://twitter.com/your_handle)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🙏

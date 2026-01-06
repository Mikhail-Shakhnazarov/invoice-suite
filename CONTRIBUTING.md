# Contributing to Invoice Suite

Thank you for your interest in contributing!

## Development Setup

### Prerequisites

- Node.js 18+
- pnpm 8+
- Git

### Getting Started

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/invoice-suite
cd invoice-suite

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test
```

## Project Structure

```
invoice-suite/
├── packages/
│   ├── invoice-engine/     # Core business logic
│   ├── cli-demo/           # Local PDF generator
│   └── google-addon/       # Google Workspace add-on
├── fixtures/               # Shared test data
└── docs/                   # Documentation
```

## Making Changes

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Follow existing code style
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all tests
pnpm test

# Build all packages
pnpm build

# Generate demo PDF to verify CLI works
pnpm demo:pdf
```

### 4. Commit Your Changes

Use conventional commit messages:

```
feat: add support for multiple tax rates
fix: correct currency formatting for JPY
docs: update deployment instructions
test: add edge cases for date validation
```

### 5. Submit a Pull Request

- Describe what your changes do
- Reference any related issues
- Ensure CI passes

## Code Style

### TypeScript

- Use strict mode (already configured)
- Prefer explicit types over inference for public APIs
- Use `readonly` where appropriate
- Avoid `any`

### File Organization

- One concept per file
- Group related functionality in directories
- Keep files under 400 lines when practical

### Testing

- Test public APIs, not implementation details
- Use descriptive test names
- Group related tests with `describe`
- Include edge cases

### Documentation

- Add JSDoc comments to public functions
- Update README when adding features
- Keep docs in sync with code

## Package Guidelines

### invoice-engine

- Zero runtime dependencies
- Must work in any JS environment
- All business logic goes here

### cli-demo

- Minimal dependencies
- Demonstrates engine usage
- Good example for portfolio

### google-addon

- Apps Script compatible
- Uses esbuild for bundling
- Test locally before pushing to Google

## Testing Google Add-on

The add-on requires manual testing in Google Sheets:

1. Build: `pnpm --filter @invoice-suite/google-addon build`
2. Push: `npx clasp push`
3. Open Sheet and test features
4. Check Apps Script logs for errors

## Questions?

Open an issue for:
- Bug reports
- Feature requests
- Documentation improvements
- General questions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

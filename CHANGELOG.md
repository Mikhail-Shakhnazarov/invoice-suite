# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-01-05

### Added

#### Invoice Engine (`@invoice-suite/engine`)
- `validateDraft()` - Validate raw invoice input with structured error reporting
- `computeInvoice()` - Calculate line totals, subtotals, tax, and final amount
- `formatInvoice()` - Format numbers and dates according to currency locale
- `processInvoice()` - Combined validation, computation, and formatting pipeline
- Support for 30+ currencies with locale-appropriate formatting
- Comprehensive validation with path-based error messages
- TypeScript types for all domain objects

#### CLI Demo (`@invoice-suite/cli-demo`)
- Command-line interface for invoice generation
- Professional HTML template with print-optimized CSS
- PDF generation via Puppeteer
- Terminal preview mode (`--print` flag)
- Custom input/output paths
- Smoke tests with sample fixtures

#### Google Add-on (`@invoice-suite/google-addon`)
- Sidebar UI for settings and generation
- Sheet parsing from fixed cell positions
- Cell mapping for error display (path ↔ cell reference)
- Google Docs template merge with placeholder replacement
- Line items table row duplication
- PDF export to Google Drive
- User settings stored in UserProperties
- OAuth scopes for Sheets, Docs, and Drive

#### Documentation
- Sheet schema reference (`docs/SHEET_SCHEMA.md`)
- Template creation guide (`docs/TEMPLATE_GUIDE.md`)
- Deployment instructions (`docs/DEPLOYMENT.md`)
- Marketplace publishing guide (`docs/MARKETPLACE.md`)

#### Infrastructure
- pnpm monorepo with workspaces
- TypeScript strict mode
- Vitest test runner
- GitHub Actions CI pipeline
- esbuild bundling for Apps Script

### Technical Notes

- Engine has zero runtime dependencies for maximum portability
- All business logic isolated in engine package
- Adapters (CLI, Google) are thin I/O layers
- ~95 test cases across engine package
- Full type safety with strict TypeScript

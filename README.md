# Invoice Suite

Invoice Suite generates professional PDF invoices from structured data. The core engine handles validation, tax calculation, and currency formatting with zero dependencies—making it portable to any JavaScript environment. Two adapters demonstrate this: a CLI tool that renders invoices locally via Puppeteer, and a Google Workspace add-on that lets you fill out a spreadsheet and generate invoices directly into Google Drive. The project is structured as a monorepo to show how business logic can be isolated from platform I/O and tested independently.

[![CI](https://github.com/Mikhail-Shakhnazarov/invoice-suite/actions/workflows/ci.yml/badge.svg)](https://github.com/Mikhail-Shakhnazarov/invoice-suite/actions/workflows/ci.yml)

## 🎯 For Evaluators

**Two paths to see it work:**

### Path A: Local Demo (30 seconds)

```bash
git clone https://github.com/Mikhail-Shakhnazarov/invoice-suite
cd invoice-suite
pnpm install && pnpm build && pnpm demo:pdf
```

Opens: `packages/cli-demo/out/Invoice_INV-2025-0042_Acme_GmbH.pdf`

### Path B: Google Workspace (5 minutes)

```bash
cd packages/google-addon
npx clasp login
npx clasp create --type sheets --title "Invoice Suite"
pnpm build && npx clasp push
```

Then: Open the created Sheet → Extensions → Invoice Suite

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        invoice-suite                            │
├─────────────────────────────────────────────────────────────────┤
│  packages/                                                      │
│  ├── invoice-engine/     Pure TS • Zero deps • Portable         │
│  │   ├── validate.ts     Type checking, required fields         │
│  │   ├── compute.ts      Line totals, tax, final amount         │
│  │   └── format.ts       Currency/date per locale               │
│  │                                                              │
│  ├── cli-demo/           JSON → HTML → PDF (Puppeteer)          │
│  │   └── Demonstrates engine without Google                     │
│  │                                                              │
│  └── google-addon/       Sheet → Engine → Docs → PDF → Drive    │
│      └── Production-ready Workspace integration                 │
├─────────────────────────────────────────────────────────────────┤
│  fixtures/               Shared test data                       │
│  docs/                   Schema, templates, deployment          │
└─────────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Engine-first | Business logic isolated, tested independently, reusable |
| Thin adapters | Platform code only does I/O, delegates computation |
| Monorepo | Shared types, atomic changes, single CI pipeline |
| TypeScript strict | Catch errors at compile time, self-documenting |
| No runtime deps in engine | Portable to any JS environment |

---

## Features

### Invoice Engine (`@invoice-suite/engine`)

- **Validation**: Required fields, type checking, date logic, currency codes
- **Computation**: Line amounts, subtotals, tax calculation, totals
- **Formatting**: `Intl.NumberFormat` for currency, `Intl.DateTimeFormat` for dates
- **Locale mapping**: EUR→de-DE, USD→en-US, GBP→en-GB, etc.

```typescript
import { processInvoice } from '@invoice-suite/engine';

const result = processInvoice(data);
if (result.ok) {
  console.log(result.invoice.totals.total); // "€5.634,06"
} else {
  result.issues.forEach(i => console.log(`${i.path}: ${i.message}`));
}
```

### CLI Demo (`@invoice-suite/cli-demo`)

- Professional HTML template with print-optimized CSS
- Puppeteer PDF generation
- Terminal preview mode
- ~400 lines total

### Google Add-on (`@invoice-suite/google-addon`)

- Fixed-position cell schema (form-style data entry)
- Error messages with cell references ("B3: Invoice Number required")
- Google Docs template merge with table row duplication
- PDF export to Google Drive
- Settings stored in UserProperties
- ~800 lines total

---

## Project Structure

```
invoice-suite/
├── .github/workflows/ci.yml    # Test, build, PDF smoke test
├── packages/
│   ├── invoice-engine/
│   │   ├── src/
│   │   │   ├── types.ts        # Domain model (~200 lines)
│   │   │   ├── validate.ts     # Input validation (~350 lines)
│   │   │   ├── compute.ts      # Calculations (~60 lines)
│   │   │   ├── format.ts       # Formatting (~180 lines)
│   │   │   └── index.ts        # Public API
│   │   └── test/               # ~95 test cases
│   ├── cli-demo/
│   │   ├── src/
│   │   │   ├── cli.ts          # CLI entry point
│   │   │   └── render/         # HTML template + PDF
│   │   └── templates/          # invoice.html
│   └── google-addon/
│       ├── src/
│       │   ├── main.ts         # Menu, handlers
│       │   ├── config.ts       # UserProperties
│       │   └── adapters/       # sheets/, docs/, drive/
│       └── appsscript.json     # OAuth scopes
├── fixtures/                   # Sample invoices
└── docs/                       # Schema, guides
```

---

## Development

```bash
# Install
pnpm install

# Build all
pnpm build

# Test all
pnpm test

# Build specific package
pnpm --filter @invoice-suite/engine build
pnpm --filter @invoice-suite/cli-demo build
pnpm --filter @invoice-suite/google-addon build

# Generate demo PDF
pnpm demo:pdf

# Preview in terminal
pnpm demo:print
```

---

## Invoice Format

```json
{
  "business": {
    "name": "Freelance Dev Co.",
    "address": "123 Code Street\nBerlin, 10115",
    "email": "invoices@freelance.dev",
    "taxId": "DE123456789"
  },
  "client": {
    "name": "Acme GmbH",
    "address": "Musterstraße 1\n10115 Berlin"
  },
  "header": {
    "invoiceNumber": "INV-2025-0042",
    "issueDate": "2025-01-05",
    "dueDate": "2025-02-04",
    "currency": "EUR",
    "taxRate": 0.19
  },
  "lineItems": [
    { "description": "Consulting", "quantity": 10, "unitPrice": 150 },
    { "description": "Development", "quantity": 25, "unitPrice": 120 }
  ]
}
```

---

## Documentation

| Doc | Purpose |
|-----|---------|
| [SHEET_SCHEMA.md](docs/SHEET_SCHEMA.md) | Cell positions for Google Sheets input |
| [TEMPLATE_GUIDE.md](docs/TEMPLATE_GUIDE.md) | Creating Google Docs templates |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | clasp setup and deployment |
| [MARKETPLACE.md](docs/MARKETPLACE.md) | Publishing to Workspace Marketplace |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Language | TypeScript 5.3 (strict mode) |
| Build | pnpm workspaces, tsc, esbuild |
| Test | Vitest |
| PDF | Puppeteer |
| Google | Apps Script, clasp |
| CI | GitHub Actions |

---

## This Demonstrates

1. **Clean Architecture**: Business logic independent of I/O
2. **Type Safety**: Comprehensive TypeScript with strict checks
3. **Testing**: Unit tests for engine, integration tests for adapters
4. **Documentation**: User guides, API docs, deployment instructions
5. **CI/CD**: Automated testing and artifact generation
6. **Real-world Integration**: Google Workspace APIs, PDF generation
7. **Monorepo Management**: pnpm workspaces, shared dependencies

---

## License

MIT

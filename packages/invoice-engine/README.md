# @invoice-suite/engine

Pure TypeScript invoice validation, computation, and formatting engine.

## Features

- **Zero runtime dependencies** - Portable to any JS environment
- **Strict TypeScript** - Full type safety with generics
- **Locale-aware formatting** - Currency and dates via `Intl` APIs
- **Structured validation** - Path-based errors for precise UI feedback
- **Immutable design** - No mutation of input data

## Installation

```bash
pnpm add @invoice-suite/engine
```

## Quick Start

```typescript
import { processInvoice } from '@invoice-suite/engine';

const result = processInvoice({
  business: {
    name: 'My Company',
    address: '123 Street',
    email: 'hello@company.com',
  },
  client: {
    name: 'Client Corp',
    address: '456 Avenue',
  },
  header: {
    invoiceNumber: 'INV-001',
    issueDate: '2025-01-15',
    currency: 'EUR',
    taxRate: 0.19,
  },
  lineItems: [
    { description: 'Consulting', quantity: 10, unitPrice: 150 },
  ],
});

if (result.ok) {
  console.log(result.invoice.totals.total); // "€1.785,00"
} else {
  result.issues.forEach(issue => {
    console.log(`${issue.path}: ${issue.message}`);
  });
}
```

## API

### `processInvoice(input, options?): ProcessResult`

Main entry point. Validates, computes, and formats in one call.

```typescript
type ProcessResult =
  | { ok: true; invoice: FormattedInvoice; computed: InvoiceComputed }
  | { ok: false; issues: Issue[] };
```

### `validateDraft(input): ValidationResult`

Validates raw input against the schema.

```typescript
type ValidationResult =
  | { ok: true; draft: InvoiceDraft }
  | { ok: false; issues: Issue[] };
```

### `computeInvoice(draft): InvoiceComputed`

Calculates line totals, subtotal, tax, and final amount.

### `formatInvoice(computed, options?): FormattedInvoice`

Formats all values for display using locale-appropriate formatting.

## Types

### Input Types

```typescript
interface InvoiceDraft {
  business: Business;
  client: Client;
  header: InvoiceHeader;
  lineItems: LineItem[];
}

interface Business {
  name: string;
  address: string;
  email: string;
  phone?: string;
  taxId?: string;
  logo?: string;
}

interface Client {
  name: string;
  address: string;
  email?: string;
}

interface InvoiceHeader {
  invoiceNumber: string;
  issueDate: string;      // ISO format: YYYY-MM-DD
  dueDate?: string;
  currency: string;       // ISO 4217: EUR, USD, GBP, etc.
  taxRate?: number;       // Decimal: 0.19 = 19%
  notes?: string;
}

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  unit?: string;
}
```

### Output Types

```typescript
interface FormattedInvoice {
  business: FormattedBusiness;
  client: FormattedClient;
  header: FormattedHeader;
  lineItems: FormattedLineItem[];
  totals: FormattedTotals;
}

interface FormattedTotals {
  subtotal: string;       // "€4.734,50"
  taxAmount: string;      // "€899,56"
  total: string;          // "€5.634,06"
}
```

### Validation Types

```typescript
interface Issue {
  code: IssueCode;
  path: string;           // "header.issueDate", "lineItems[0].quantity"
  message: string;
  hint?: string;
}

type IssueCode =
  | 'MISSING_REQUIRED'
  | 'INVALID_TYPE'
  | 'INVALID_VALUE'
  | 'INVALID_DATE'
  | 'INVALID_CURRENCY'
  | 'DATE_ORDER';
```

## Validation Rules

### Required Fields

- `business.name`, `business.address`, `business.email`
- `client.name`, `client.address`
- `header.invoiceNumber`, `header.issueDate`, `header.currency`
- At least one line item with `description`, `quantity`, `unitPrice`

### Value Constraints

- Dates must be valid ISO format (YYYY-MM-DD) with real calendar dates
- `dueDate` must be ≥ `issueDate`
- Currency must be supported ISO 4217 code
- Tax rate must be 0-1 (decimal)
- Quantity and unit price must be non-negative

## Formatting

### Currency Locales

| Currency | Locale | Example |
|----------|--------|---------|
| EUR | de-DE | €1.234,56 |
| USD | en-US | $1,234.56 |
| GBP | en-GB | £1,234.56 |
| CHF | de-CH | CHF 1'234.56 |
| JPY | ja-JP | ¥1,234 |

### Date Formatting

Dates are formatted according to the currency's locale:

| Currency | Format |
|----------|--------|
| EUR | 15. Januar 2025 |
| USD | January 15, 2025 |
| GBP | 15 January 2025 |

## Testing

```bash
pnpm test
```

~95 test cases covering:
- Required field validation
- Type checking
- Date validation and ordering
- Currency code validation
- Computation accuracy
- Formatting for multiple locales

## License

MIT

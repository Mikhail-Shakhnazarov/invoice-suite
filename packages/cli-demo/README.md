# @invoice-suite/cli-demo

CLI tool for generating PDF invoices from JSON input.

## Features

- Generate professional PDF invoices from JSON
- Clean HTML template with print-optimized CSS
- Zero Google dependencies - runs locally
- Validates input with helpful error messages

## Usage

```bash
# From monorepo root:
pnpm demo:pdf                    # Generate PDF from sample invoice
pnpm demo:print                  # Preview in terminal

# With custom input:
pnpm demo:pdf --input ./my-invoice.json --out ./invoices/
```

## CLI Options

```
Options:
  -i, --input <file>   Input JSON invoice file (required)
  -o, --out <dir>      Output directory (default: ./out)
  -p, --print          Print formatted invoice to stdout instead of PDF
  -h, --help           Show help message
```

## How It Works

1. **Load** - Read JSON invoice file
2. **Validate** - Check required fields and types via `@invoice-suite/engine`
3. **Compute** - Calculate line amounts, subtotal, tax, total
4. **Format** - Apply currency and date formatting
5. **Render** - Interpolate values into HTML template
6. **Export** - Generate PDF via Puppeteer (headless Chrome)

## Dependencies

- `@invoice-suite/engine` - Invoice validation, computation, formatting
- `puppeteer` - PDF generation via headless Chrome

## Template Customization

The HTML template is at `templates/invoice.html`. It uses a simple Handlebars-like syntax:

- `{{variable}}` - Variable substitution
- `{{path.to.value}}` - Nested paths
- `{{#if value}}...{{/if}}` - Conditional blocks
- `{{#each array}}...{{/each}}` - Iteration

## Output

Generated PDFs are saved to the output directory with the naming pattern:

```
Invoice_<number>_<client>.pdf
```

Example: `Invoice_INV-2025-0042_Acme_GmbH.pdf`

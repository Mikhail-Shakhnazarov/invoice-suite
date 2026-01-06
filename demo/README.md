# Demo Artifacts

Portfolio materials and demonstration outputs.

## Generated Sample

The `pnpm demo:pdf` command generates a sample invoice at:
```
packages/cli-demo/out/Invoice_INV-2025-0042_Acme_GmbH.pdf
```

This PDF demonstrates:
- Professional invoice layout
- Currency formatting (EUR with German locale)
- Multi-line addresses
- Tax calculation display
- Print-optimized CSS

## Screenshots

For portfolio/marketplace listings, capture:

### CLI Demo
```
screenshots/cli-terminal.png      # Terminal output of `pnpm demo:print`
screenshots/cli-pdf-preview.png   # Generated PDF opened in viewer
```

### Google Add-on
```
screenshots/addon-sidebar.png     # Sidebar with invoice preview
screenshots/addon-settings.png    # Settings tab with business details
screenshots/addon-success.png     # Successful generation with PDF link
screenshots/addon-sheet.png       # Sample sheet with filled data
```

### Capture Tips

1. **CLI Terminal**: Run `pnpm demo:print` and capture the formatted output
2. **PDF Preview**: Open generated PDF in macOS Preview or similar
3. **Google Add-on**: Use a test Sheet with realistic data
4. **Crop tight**: Remove unnecessary browser chrome
5. **Consistent size**: Aim for ~1200px wide for screenshots

## Creating a Demo GIF

For README or marketplace:

```bash
# macOS with Gifox or similar
# 1. Open terminal, start recording
# 2. Run: pnpm demo:pdf
# 3. Open the generated PDF
# 4. Stop recording
# 5. Trim and export at 800px wide

# Alternative: asciinema for terminal-only
asciinema rec demo.cast
# Play and convert with agg or svg-term
```

## Sample Invoice Data

The sample invoice in `fixtures/sample-invoice.json`:

| Field | Value |
|-------|-------|
| Business | Freelance Dev Co. |
| Client | Acme GmbH |
| Invoice # | INV-2025-0042 |
| Currency | EUR |
| Tax Rate | 19% |
| Line Items | 3 (Consulting, Development, Project Management) |
| Total | €5.634,06 |

## Edge Case Fixtures

Additional test invoices in `fixtures/edgecases/`:

| Fixture | Purpose |
|---------|---------|
| `zero-tax.json` | Invoice without tax |
| `single-item.json` | Minimal valid invoice |
| `many-items.json` | 50 line items (performance) |
| `missing-fields.json` | Validation failure demo |

## Verification

After any changes, verify the demo still works:

```bash
# Build fresh
pnpm build

# Generate PDF
pnpm demo:pdf

# Check PDF exists and is valid
file packages/cli-demo/out/Invoice_*.pdf
# → PDF document, version 1.4

# Run tests
pnpm test
```

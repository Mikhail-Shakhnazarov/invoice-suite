# @invoice-suite/google-addon

Google Workspace add-on for generating PDF invoices from Google Sheets.

## Features

- Read invoice data from fixed cell positions in a Sheet
- Validate input with clear error messages pointing to specific cells
- Merge data into a Google Docs template
- Export to PDF and save to Google Drive
- Configurable business details, template, and defaults

## Setup

### 1. Install Dependencies

```bash
cd packages/google-addon
pnpm install
```

### 2. Create Apps Script Project

```bash
# Login to Google
npx clasp login

# Create new project
npx clasp create --type sheets --title "Invoice Suite"

# This creates .clasp.json with your scriptId
```

### 3. Build and Deploy

```bash
# Build the bundle
pnpm build

# Push to Apps Script
npx clasp push

# Open in browser
npx clasp open
```

### 4. Create Template Document

Create a Google Doc with the following placeholders:

**Business/Client/Header:**
- `{{business_name}}`, `{{business_address}}`, `{{business_email}}`
- `{{business_phone}}`, `{{business_tax_id}}`
- `{{client_name}}`, `{{client_address}}`, `{{client_email}}`
- `{{invoice_number}}`, `{{issue_date}}`, `{{due_date}}`
- `{{notes}}`

**Line Items (in a table):**
- `{{item_description}}`, `{{item_qty}}`, `{{item_unit_price}}`, `{{item_amount}}`

**Totals:**
- `{{subtotal}}`, `{{tax_rate}}`, `{{tax_amount}}`, `{{total}}`

### 5. Configure Add-on

1. Open a Google Sheet
2. Go to Extensions → Invoice Suite → Settings
3. Enter your business details
4. Paste the Template Document ID
5. Save settings

## Sheet Schema

The add-on reads data from fixed cell positions:

```
Row 3:  Invoice Number  | B3
Row 4:  Issue Date      | B4
Row 5:  Due Date        | B5
Row 6:  Currency        | B6
Row 7:  Tax Rate (%)    | B7

Row 10: Client Name     | B10
Row 11: Client Address  | B11
Row 12: Client Email    | B12

Row 15: [Header: Description | Quantity | Unit Price | Amount]
Row 16+: Line items (reads until first empty row)
```

See `docs/SHEET_SCHEMA.md` for a complete reference.

## Development

### Build

```bash
pnpm build          # Build once
pnpm build:watch    # Watch mode
```

### Deploy

```bash
pnpm push           # Build and push to Apps Script
pnpm push:watch     # Watch and auto-push
```

### View Logs

```bash
pnpm logs           # View Apps Script execution logs
```

### Testing

Unit tests run locally (no Google APIs):

```bash
pnpm test           # Run tests
pnpm test:watch     # Watch mode
```

Integration testing requires manual testing in a real Sheet.

## Architecture

```
src/
├── main.ts                    # Entry point, menu handlers
├── config.ts                  # UserProperties storage
├── types.ts                   # Add-on specific types
├── adapters/
│   ├── sheets/
│   │   ├── parseSheet.ts      # Read data from Sheet
│   │   └── cellMap.ts         # Path ↔ cell mapping
│   ├── docs/
│   │   └── mergeTemplate.ts   # Populate Doc template
│   └── drive/
│       └── savePdf.ts         # Export PDF, save to Drive
└── ui/
    └── sidebar.html           # Settings + Generate UI
```

## OAuth Scopes

| Scope | Purpose |
|-------|---------|
| `spreadsheets.currentonly` | Read invoice data from active sheet |
| `documents` | Copy and populate template document |
| `drive.file` | Save generated PDFs |
| `script.container.ui` | Display sidebar |

## Troubleshooting

### "Document not found" error

- Check the Template Document ID is correct
- Ensure the template document is accessible (not in Trash)
- Try sharing the template with yourself if using a different account

### "Folder not accessible" error

- Check the Output Folder ID is correct
- Ensure you have write access to the folder

### Validation errors

- The error message includes the cell reference (e.g., "B3: Invoice Number is required")
- Check the indicated cell has valid data

## License

MIT

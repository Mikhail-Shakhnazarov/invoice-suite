# Template Guide

How to create and customize Google Docs templates for Invoice Suite.

## Overview

Invoice Suite uses Google Docs as templates. When generating an invoice:

1. The template document is copied
2. Placeholders (`{{...}}`) are replaced with invoice data
3. Line items are inserted into a table
4. The result is exported as PDF

## Placeholders

### Business Details

| Placeholder | Description | Example Value |
|-------------|-------------|---------------|
| `{{business_name}}` | Your business name | Freelance Dev Co. |
| `{{business_address}}` | Full address (multi-line) | 123 Code St\nBerlin, 10115 |
| `{{business_email}}` | Contact email | invoices@company.com |
| `{{business_phone}}` | Phone number | +49 30 12345678 |
| `{{business_tax_id}}` | VAT/Tax ID | DE123456789 |

### Client Details

| Placeholder | Description | Example Value |
|-------------|-------------|---------------|
| `{{client_name}}` | Client name | Acme GmbH |
| `{{client_address}}` | Client address (multi-line) | Musterstraße 1\n10115 Berlin |
| `{{client_email}}` | Client email | billing@acme.de |

### Invoice Header

| Placeholder | Description | Example Value |
|-------------|-------------|---------------|
| `{{invoice_number}}` | Invoice number | INV-2025-0042 |
| `{{issue_date}}` | Issue date (formatted) | 5. Januar 2025 |
| `{{due_date}}` | Due date (formatted) | 4. Februar 2025 |
| `{{currency}}` | Currency code | EUR |
| `{{tax_rate}}` | Tax rate without % | 19 |
| `{{notes}}` | Payment terms/notes | Payment due within 30 days |

### Line Items (Table)

| Placeholder | Description | Example Value |
|-------------|-------------|---------------|
| `{{item_description}}` | Item description | Consulting services |
| `{{item_qty}}` | Quantity | 10 |
| `{{item_unit_price}}` | Unit price (formatted) | €150,00 |
| `{{item_amount}}` | Line total (formatted) | €1.500,00 |
| `{{item_unit}}` | Unit label (optional) | hours |

### Totals

| Placeholder | Description | Example Value |
|-------------|-------------|---------------|
| `{{subtotal}}` | Sum before tax | €4.734,50 |
| `{{tax_amount}}` | Tax amount | €899,56 |
| `{{total}}` | Final total | €5.634,06 |

## Creating a Template

### Step 1: Create New Document

1. Open Google Docs
2. Create a new blank document
3. Name it something like "Invoice Template"

### Step 2: Design Header

Add your business header with placeholders:

```
{{business_name}}
{{business_address}}
Email: {{business_email}}
Phone: {{business_phone}}
Tax ID: {{business_tax_id}}

INVOICE

Invoice #: {{invoice_number}}
Date: {{issue_date}}
Due: {{due_date}}
```

### Step 3: Add Client Section

```
Bill To:
{{client_name}}
{{client_address}}
{{client_email}}
```

### Step 4: Create Line Items Table

Insert a table with 4 columns:

| Description | Qty | Unit Price | Amount |
|-------------|-----|------------|--------|
| {{item_description}} | {{item_qty}} | {{item_unit_price}} | {{item_amount}} |

**Important**: The row with `{{item_description}}` is the template row. It will be duplicated for each line item and then removed.

### Step 5: Add Totals Section

```
                    Subtotal: {{subtotal}}
                  Tax ({{tax_rate}}%): {{tax_amount}}
                       Total: {{total}}
```

### Step 6: Add Notes Section

```
Notes:
{{notes}}
```

### Step 7: Get Template ID

1. Look at the document URL
2. Copy the ID between `/d/` and `/edit`

Example URL:
```
https://docs.google.com/document/d/1abc123XYZ.../edit
                                    ^^^^^^^^^^^
                                    This is the ID
```

### Step 8: Configure in Add-on

1. Open Invoice Suite settings
2. Paste the Template Document ID
3. Save settings

## Line Items Table Handling

The add-on looks for a table containing `{{item_description}}` to identify the line items table.

**Process:**
1. Find the table row with `{{item_description}}`
2. For each invoice line item (in reverse order):
   - Insert a new row after the header
   - Copy formatting from the template row
   - Replace placeholders with actual values
3. Remove the original template row

**Result:** A table with the correct number of rows, all formatted consistently.

## Formatting Tips

### Currency Formatting

Values like `{{subtotal}}`, `{{total}}`, etc. are pre-formatted with the correct currency symbol and locale:
- EUR: €1.234,56
- USD: $1,234.56
- GBP: £1,234.56

### Date Formatting

Dates are formatted according to the invoice currency's locale:
- EUR: 5. Januar 2025
- USD: January 5, 2025
- GBP: 5 January 2025

### Multi-line Text

Address fields preserve newlines. They render correctly in Google Docs.

### Conditional Content

Currently, placeholders for missing data are replaced with empty strings. Future versions may support conditional blocks.

## Example Template

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  {{business_name}}                                        INVOICE        │
│  {{business_address}}                                                    │
│  {{business_email}}                           Invoice #: {{invoice_number}}│
│  {{business_phone}}                           Date: {{issue_date}}       │
│  Tax ID: {{business_tax_id}}                  Due: {{due_date}}          │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Bill To:                                                                │
│  {{client_name}}                                                         │
│  {{client_address}}                                                      │
│  {{client_email}}                                                        │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌───────────────────┬────────┬────────────┬─────────────┐              │
│  │ Description       │ Qty    │ Unit Price │ Amount      │              │
│  ├───────────────────┼────────┼────────────┼─────────────┤              │
│  │ {{item_description}} │ {{item_qty}} │ {{item_unit_price}} │ {{item_amount}} │  │
│  └───────────────────┴────────┴────────────┴─────────────┘              │
│                                                                          │
│                                         Subtotal: {{subtotal}}           │
│                                    Tax ({{tax_rate}}%): {{tax_amount}}   │
│                                            Total: {{total}}              │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Notes:                                                                  │
│  {{notes}}                                                               │
│                                                                          │
│                         Thank you for your business!                     │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

## Troubleshooting

### Placeholder not replaced

- Check spelling (case-sensitive)
- Ensure no extra spaces inside `{{...}}`
- Check for hidden characters (copy from this guide)

### Line items not appearing

- Ensure template has a table with `{{item_description}}`
- Check the table has at least 2 rows (header + template row)

### Formatting issues

- Format the template row how you want all rows to look
- Cell alignment, fonts, and colors are copied to new rows

### Multi-line addresses not working

- Ensure the cell is tall enough to display multiple lines
- Check "Wrap text" is enabled in the template cell

# Sheet Schema

Reference for the invoice data layout in Google Sheets.

## Overview

The add-on reads invoice data from fixed cell positions. This form-style layout allows users to fill in data naturally while the add-on extracts it programmatically.

## Cell Mapping

### Invoice Details (Rows 2-7)

| Row | Column A (Label) | Column B (Value) | Field |
|-----|------------------|------------------|-------|
| 2 | INVOICE DETAILS | | (section header) |
| 3 | Invoice Number | INV-2025-0042 | `header.invoiceNumber` |
| 4 | Issue Date | 2025-01-05 | `header.issueDate` |
| 5 | Due Date | 2025-02-04 | `header.dueDate` |
| 6 | Currency | EUR | `header.currency` |
| 7 | Tax Rate (%) | 19 | `header.taxRate` |

### Client Details (Rows 9-12)

| Row | Column A (Label) | Column B (Value) | Field |
|-----|------------------|------------------|-------|
| 9 | BILL TO | | (section header) |
| 10 | Client Name | Acme GmbH | `client.name` |
| 11 | Client Address | Musterstraße 1, 10115 Berlin | `client.address` |
| 12 | Client Email | billing@acme.de | `client.email` |

### Line Items Table (Row 15+)

| Row | Column A | Column B | Column C | Column D |
|-----|----------|----------|----------|----------|
| 15 | Description | Quantity | Unit Price | Amount |
| 16 | Consulting services | 10 | 150.00 | =B16*C16 |
| 17 | Development work | 25 | 120.00 | =B17*C17 |
| 18 | (empty row = end of items) | | | |

## Field Requirements

### Required Fields

| Field | Cell | Notes |
|-------|------|-------|
| Invoice Number | B3 | Any string format |
| Issue Date | B4 | YYYY-MM-DD or Date object |
| Currency | B6 | ISO 4217 code (EUR, USD, GBP, etc.) |
| Client Name | B10 | |
| Client Address | B11 | Multi-line supported |
| Line Item Description | A16+ | At least one item required |
| Line Item Quantity | B16+ | Number > 0 |
| Line Item Unit Price | C16+ | Number ≥ 0 |

### Optional Fields

| Field | Cell | Default |
|-------|------|---------|
| Due Date | B5 | None |
| Tax Rate | B7 | From settings or 0 |
| Client Email | B12 | None |

## Date Formats

The add-on accepts dates in multiple formats:

- **ISO format**: `2025-01-05` (preferred)
- **Google Sheets date**: Native date cell values
- **Common formats**: `01/05/2025`, `Jan 5, 2025`, etc.

All dates are converted to ISO format internally.

## Tax Rate

Tax rate can be entered as:
- **Percentage**: `19` → interpreted as 19%
- **Decimal**: `0.19` → interpreted as 19%

If > 1, it's treated as a percentage. If ≤ 1, it's treated as a decimal.

## Line Items Detection

The add-on reads line items starting from row 16 until it encounters the first fully empty row (all of columns A, B, C empty).

**Maximum items**: 100 (safety limit)

## Multi-line Text

Address fields (Client Address) support multi-line text. In Google Sheets:
- Press `Alt+Enter` (Windows) or `Ctrl+Enter` (Mac) for a new line within a cell
- Or use the formula bar for multi-line editing

## Sample Layout

```
     A                          B                     C              D
┌─────────────────────────┬─────────────────────┬──────────────┬──────────────┐
│                         │                     │              │              │ 1
├─────────────────────────┼─────────────────────┼──────────────┼──────────────┤
│ INVOICE DETAILS         │                     │              │              │ 2
├─────────────────────────┼─────────────────────┼──────────────┼──────────────┤
│ Invoice Number          │ INV-2025-0042       │              │              │ 3
├─────────────────────────┼─────────────────────┼──────────────┼──────────────┤
│ Issue Date              │ 2025-01-05          │              │              │ 4
├─────────────────────────┼─────────────────────┼──────────────┼──────────────┤
│ Due Date                │ 2025-02-04          │              │              │ 5
├─────────────────────────┼─────────────────────┼──────────────┼──────────────┤
│ Currency                │ EUR                 │              │              │ 6
├─────────────────────────┼─────────────────────┼──────────────┼──────────────┤
│ Tax Rate (%)            │ 19                  │              │              │ 7
├─────────────────────────┼─────────────────────┼──────────────┼──────────────┤
│                         │                     │              │              │ 8
├─────────────────────────┼─────────────────────┼──────────────┼──────────────┤
│ BILL TO                 │                     │              │              │ 9
├─────────────────────────┼─────────────────────┼──────────────┼──────────────┤
│ Client Name             │ Acme GmbH           │              │              │ 10
├─────────────────────────┼─────────────────────┼──────────────┼──────────────┤
│ Client Address          │ Musterstraße 1      │              │              │ 11
│                         │ 10115 Berlin        │              │              │
├─────────────────────────┼─────────────────────┼──────────────┼──────────────┤
│ Client Email            │ billing@acme.de     │              │              │ 12
├─────────────────────────┼─────────────────────┼──────────────┼──────────────┤
│                         │                     │              │              │ 13
├─────────────────────────┼─────────────────────┼──────────────┼──────────────┤
│                         │                     │              │              │ 14
├─────────────────────────┼─────────────────────┼──────────────┼──────────────┤
│ Description             │ Quantity            │ Unit Price   │ Amount       │ 15
├─────────────────────────┼─────────────────────┼──────────────┼──────────────┤
│ Consulting services     │ 10                  │ 150.00       │ =B16*C16     │ 16
├─────────────────────────┼─────────────────────┼──────────────┼──────────────┤
│ Development work        │ 25                  │ 120.00       │ =B17*C17     │ 17
├─────────────────────────┼─────────────────────┼──────────────┼──────────────┤
│                         │                     │              │              │ 18
└─────────────────────────┴─────────────────────┴──────────────┴──────────────┘
```

## Validation Errors

When validation fails, the add-on shows errors with cell references:

```
B3: Invoice Number is required
B16: Quantity must be a number
C17: Unit Price cannot be negative
```

This makes it easy to locate and fix issues in the spreadsheet.

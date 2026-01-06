/**
 * Docs Template Merge
 *
 * Copies a template document and replaces placeholders with invoice data.
 */

import type { FormattedInvoice } from '@invoice-suite/engine';

/**
 * Placeholder patterns used in the template.
 */
const PLACEHOLDERS = {
  // Business
  '{{business_name}}': (inv: FormattedInvoice) => inv.business.name,
  '{{business_address}}': (inv: FormattedInvoice) => inv.business.address,
  '{{business_email}}': (inv: FormattedInvoice) => inv.business.email,
  '{{business_phone}}': (inv: FormattedInvoice) => inv.business.phone,
  '{{business_tax_id}}': (inv: FormattedInvoice) => inv.business.taxId,

  // Client
  '{{client_name}}': (inv: FormattedInvoice) => inv.client.name,
  '{{client_address}}': (inv: FormattedInvoice) => inv.client.address,
  '{{client_email}}': (inv: FormattedInvoice) => inv.client.email,

  // Header
  '{{invoice_number}}': (inv: FormattedInvoice) => inv.header.invoiceNumber,
  '{{issue_date}}': (inv: FormattedInvoice) => inv.header.issueDate,
  '{{due_date}}': (inv: FormattedInvoice) => inv.header.dueDate,
  '{{currency}}': (inv: FormattedInvoice) => inv.header.currency,
  '{{tax_rate}}': (inv: FormattedInvoice) => inv.header.taxRateDisplay,
  '{{notes}}': (inv: FormattedInvoice) => inv.header.notes,

  // Totals
  '{{subtotal}}': (inv: FormattedInvoice) => inv.totals.subtotal,
  '{{tax_amount}}': (inv: FormattedInvoice) => inv.totals.taxAmount,
  '{{total}}': (inv: FormattedInvoice) => inv.totals.total,
};

/**
 * Line item placeholders (used in table row template).
 */
const LINE_ITEM_PLACEHOLDERS = {
  '{{item_description}}': 'description',
  '{{item_qty}}': 'quantity',
  '{{item_unit_price}}': 'unitPrice',
  '{{item_amount}}': 'amount',
  '{{item_unit}}': 'unit',
};

/**
 * Copy the template document and return the new document.
 */
function copyTemplate(templateId: string, title: string): GoogleAppsScript.Document.Document {
  const templateFile = DriveApp.getFileById(templateId);
  const copy = templateFile.makeCopy(title);
  return DocumentApp.openById(copy.getId());
}

/**
 * Replace simple placeholders in the document body.
 */
function replacePlaceholders(body: GoogleAppsScript.Document.Body, invoice: FormattedInvoice): void {
  for (const [placeholder, getValue] of Object.entries(PLACEHOLDERS)) {
    const value = getValue(invoice);
    body.replaceText(escapeRegex(placeholder), value || '');
  }
}

/**
 * Escape special regex characters in a string.
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Find and populate line items in a table.
 *
 * Strategy:
 * 1. Find the table containing line item placeholders
 * 2. Identify the template row (row with {{item_description}})
 * 3. For each line item, duplicate the template row and fill values
 * 4. Remove the original template row
 */
function populateLineItemsTable(body: GoogleAppsScript.Document.Body, invoice: FormattedInvoice): void {
  const tables = body.getTables();

  for (let t = 0; t < tables.length; t++) {
    const table = tables[t];
    const templateRowIndex = findTemplateRow(table);

    if (templateRowIndex === -1) {
      continue; // Not the line items table
    }

    // Found the line items table
    const templateRow = table.getRow(templateRowIndex);

    // Insert rows for each line item (in reverse to maintain indices)
    const items = invoice.lineItems;
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i]!;

      // Copy the template row
      const newRow = table.insertTableRow(templateRowIndex + 1);

      // Copy cells from template
      for (let c = 0; c < templateRow.getNumCells(); c++) {
        const templateCell = templateRow.getCell(c);
        const newCell = newRow.appendTableCell(templateCell.getText());

        // Copy formatting
        newCell.setAttributes(templateCell.getAttributes());
      }

      // Replace placeholders in the new row
      for (let c = 0; c < newRow.getNumCells(); c++) {
        const cell = newRow.getCell(c);
        let text = cell.getText();

        for (const [placeholder, field] of Object.entries(LINE_ITEM_PLACEHOLDERS)) {
          const value = item[field as keyof typeof item] ?? '';
          text = text.replace(placeholder, String(value));
        }

        cell.setText(text);
      }
    }

    // Remove the template row
    table.removeRow(templateRowIndex);

    break; // Only process first matching table
  }
}

/**
 * Find the row index containing line item placeholders.
 */
function findTemplateRow(table: GoogleAppsScript.Document.Table): number {
  for (let r = 0; r < table.getNumRows(); r++) {
    const row = table.getRow(r);
    const rowText = getRowText(row);

    if (rowText.includes('{{item_description}}')) {
      return r;
    }
  }
  return -1;
}

/**
 * Get concatenated text of all cells in a row.
 */
function getRowText(row: GoogleAppsScript.Document.TableRow): string {
  let text = '';
  for (let c = 0; c < row.getNumCells(); c++) {
    text += row.getCell(c).getText() + ' ';
  }
  return text;
}

/**
 * Merge invoice data into a copy of the template document.
 *
 * @param templateId - Google Doc ID of the template
 * @param invoice - Formatted invoice data
 * @param title - Title for the new document
 * @returns The new document
 */
export function mergeTemplate(
  templateId: string,
  invoice: FormattedInvoice,
  title: string
): GoogleAppsScript.Document.Document {
  // Copy template
  const doc = copyTemplate(templateId, title);
  const body = doc.getBody();

  // Replace simple placeholders
  replacePlaceholders(body, invoice);

  // Populate line items table
  populateLineItemsTable(body, invoice);

  // Save changes
  doc.saveAndClose();

  return doc;
}

/**
 * Validate that a document ID is a valid Google Doc.
 */
export function validateTemplateId(docId: string): {
  valid: boolean;
  error?: string;
  name?: string;
} {
  try {
    const file = DriveApp.getFileById(docId);
    const mimeType = file.getMimeType();

    if (mimeType !== MimeType.GOOGLE_DOCS) {
      return {
        valid: false,
        error: 'File is not a Google Doc',
      };
    }

    return {
      valid: true,
      name: file.getName(),
    };
  } catch (error) {
    return {
      valid: false,
      error: 'Document not found or not accessible',
    };
  }
}

/**
 * Sheet Parser
 *
 * Reads invoice data from the active spreadsheet and constructs an InvoiceDraft.
 */

import type { InvoiceDraft, LineItem } from '@invoice-suite/engine';
import { loadConfig } from '../../config.js';
import { METADATA_CELLS, LINE_ITEMS_CONFIG } from './cellMap.js';

/**
 * Read a single cell value from the sheet.
 */
function getCellValue(sheet: GoogleAppsScript.Spreadsheet.Sheet, cellRef: string): unknown {
  const range = sheet.getRange(cellRef);
  return range.getValue();
}

/**
 * Read invoice header fields from fixed cell positions.
 */
function readHeader(sheet: GoogleAppsScript.Spreadsheet.Sheet): Record<string, unknown> {
  const config = loadConfig();

  const invoiceNumber = getCellValue(sheet, METADATA_CELLS['header.invoiceNumber']);
  const issueDate = getCellValue(sheet, METADATA_CELLS['header.issueDate']);
  const dueDate = getCellValue(sheet, METADATA_CELLS['header.dueDate']);
  const currency = getCellValue(sheet, METADATA_CELLS['header.currency']);
  const taxRateRaw = getCellValue(sheet, METADATA_CELLS['header.taxRate']);

  // Convert tax rate from percentage to decimal if needed
  let taxRate: number | undefined;
  if (taxRateRaw !== '' && taxRateRaw !== null && taxRateRaw !== undefined) {
    const numValue = typeof taxRateRaw === 'number' ? taxRateRaw : parseFloat(String(taxRateRaw));
    if (!isNaN(numValue)) {
      // If > 1, assume it's a percentage (e.g., 19 → 0.19)
      taxRate = numValue > 1 ? numValue / 100 : numValue;
    }
  } else if (config.defaults.taxRate !== undefined) {
    taxRate = config.defaults.taxRate;
  }

  return {
    invoiceNumber: formatCellValue(invoiceNumber),
    issueDate: formatDateValue(issueDate),
    dueDate: formatDateValue(dueDate) || undefined,
    currency: formatCellValue(currency) || config.defaults.currency,
    taxRate,
    notes: config.defaults.paymentTerms,
  };
}

/**
 * Read client fields from fixed cell positions.
 */
function readClient(sheet: GoogleAppsScript.Spreadsheet.Sheet): Record<string, unknown> {
  const name = getCellValue(sheet, METADATA_CELLS['client.name']);
  const address = getCellValue(sheet, METADATA_CELLS['client.address']);
  const email = getCellValue(sheet, METADATA_CELLS['client.email']);

  return {
    name: formatCellValue(name),
    address: formatCellValue(address),
    email: formatCellValue(email) || undefined,
  };
}

/**
 * Read line items from the table starting at the configured row.
 */
function readLineItems(sheet: GoogleAppsScript.Spreadsheet.Sheet): Array<Record<string, unknown>> {
  const items: Array<Record<string, unknown>> = [];
  const { firstDataRow, columns } = LINE_ITEMS_CONFIG;

  // Read rows until we hit an empty row
  let row = firstDataRow;
  const maxRows = 100; // Safety limit

  while (row < firstDataRow + maxRows) {
    const description = getCellValue(sheet, `A${row}`);
    const quantity = getCellValue(sheet, `B${row}`);
    const unitPrice = getCellValue(sheet, `C${row}`);

    // Stop at first fully empty row
    if (isEmpty(description) && isEmpty(quantity) && isEmpty(unitPrice)) {
      break;
    }

    items.push({
      description: formatCellValue(description),
      quantity: parseNumber(quantity),
      unitPrice: parseNumber(unitPrice),
    });

    row++;
  }

  return items;
}

/**
 * Check if a cell value is empty.
 */
function isEmpty(value: unknown): boolean {
  return value === '' || value === null || value === undefined;
}

/**
 * Format a cell value as a string.
 */
function formatCellValue(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return '';
  }
  return String(value).trim();
}

/**
 * Format a date cell value as ISO string.
 */
function formatDateValue(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  // If it's already a Date object (from Sheets)
  if (value instanceof Date) {
    return value.toISOString().split('T')[0]!;
  }

  // If it's a string, try to parse it
  if (typeof value === 'string') {
    const trimmed = value.trim();

    // Already in ISO format
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }

    // Try to parse as date
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0]!;
    }
  }

  // If it's a number (Excel serial date)
  if (typeof value === 'number') {
    const date = new Date((value - 25569) * 86400 * 1000);
    return date.toISOString().split('T')[0]!;
  }

  return String(value);
}

/**
 * Parse a number from a cell value.
 */
function parseNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  if (typeof value === 'number') {
    return value;
  }

  const str = String(value).trim().replace(/[,\s]/g, '');
  const num = parseFloat(str);

  return isNaN(num) ? undefined : num;
}

/**
 * Parse the active sheet and construct an InvoiceDraft.
 *
 * Note: This returns a plain object that may have invalid/missing fields.
 * The engine's validateDraft() should be called to check validity.
 */
export function parseSheet(): Record<string, unknown> {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getActiveSheet();
  const config = loadConfig();

  const header = readHeader(sheet);
  const client = readClient(sheet);
  const lineItems = readLineItems(sheet);

  return {
    business: config.business,
    client,
    header,
    lineItems,
  };
}

/**
 * Get a preview of the sheet data for the sidebar.
 */
export function getPreview(): {
  invoiceNumber: string;
  clientName: string;
  lineItemCount: number;
  currency: string;
} {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getActiveSheet();

  const invoiceNumber = formatCellValue(
    getCellValue(sheet, METADATA_CELLS['header.invoiceNumber'])
  );
  const clientName = formatCellValue(
    getCellValue(sheet, METADATA_CELLS['client.name'])
  );
  const currency = formatCellValue(
    getCellValue(sheet, METADATA_CELLS['header.currency'])
  ) || loadConfig().defaults.currency;

  // Count non-empty line items
  const lineItems = readLineItems(sheet);

  return {
    invoiceNumber: invoiceNumber || '(not set)',
    clientName: clientName || '(not set)',
    lineItemCount: lineItems.length,
    currency,
  };
}

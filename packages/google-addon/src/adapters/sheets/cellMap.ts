/**
 * Cell Mapping
 *
 * Maps between engine field paths and spreadsheet cell references.
 * Used for both reading data and displaying validation errors.
 */

/**
 * Fixed cell positions for invoice metadata.
 */
export const METADATA_CELLS: Record<string, string> = {
  'header.invoiceNumber': 'B3',
  'header.issueDate': 'B4',
  'header.dueDate': 'B5',
  'header.currency': 'B6',
  'header.taxRate': 'B7',
  'client.name': 'B10',
  'client.address': 'B11',
  'client.email': 'B12',
};

/**
 * Line items table configuration.
 */
export const LINE_ITEMS_CONFIG = {
  /** Row number of the header row */
  headerRow: 15,
  /** First row of line item data */
  firstDataRow: 16,
  /** Column indices (0-based) for line item fields */
  columns: {
    description: 0, // A
    quantity: 1,    // B
    unitPrice: 2,   // C
    amount: 3,      // D (formula, not read)
  },
};

/**
 * Convert a column index (0-based) to letter.
 */
export function columnToLetter(col: number): string {
  let letter = '';
  let temp = col;

  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }

  return letter;
}

/**
 * Convert engine field path to cell reference.
 *
 * @param path - Engine path (e.g., "header.invoiceNumber", "lineItems[2].unitPrice")
 * @returns Cell reference (e.g., "B3", "C18")
 */
export function pathToCell(path: string): string {
  // Check metadata cells first
  if (METADATA_CELLS[path]) {
    return METADATA_CELLS[path];
  }

  // Check for line item pattern: lineItems[N].field
  const lineItemMatch = path.match(/^lineItems\[(\d+)\]\.(\w+)$/);
  if (lineItemMatch) {
    const index = parseInt(lineItemMatch[1], 10);
    const field = lineItemMatch[2] as keyof typeof LINE_ITEMS_CONFIG.columns;
    const colIndex = LINE_ITEMS_CONFIG.columns[field];

    if (colIndex !== undefined) {
      const row = LINE_ITEMS_CONFIG.firstDataRow + index;
      const col = columnToLetter(colIndex);
      return `${col}${row}`;
    }
  }

  // Unknown path, return as-is
  return path;
}

/**
 * Convert cell reference to engine path (reverse mapping).
 *
 * @param cell - Cell reference (e.g., "B3", "C18")
 * @returns Engine path or undefined if not mapped
 */
export function cellToPath(cell: string): string | undefined {
  // Check metadata cells
  for (const [path, cellRef] of Object.entries(METADATA_CELLS)) {
    if (cellRef === cell) {
      return path;
    }
  }

  // Check for line item cells
  const cellMatch = cell.match(/^([A-Z]+)(\d+)$/);
  if (cellMatch) {
    const col = cellMatch[1];
    const row = parseInt(cellMatch[2], 10);

    // Check if in line items range
    if (row >= LINE_ITEMS_CONFIG.firstDataRow) {
      const index = row - LINE_ITEMS_CONFIG.firstDataRow;

      // Find field by column
      for (const [field, colIndex] of Object.entries(LINE_ITEMS_CONFIG.columns)) {
        if (columnToLetter(colIndex) === col) {
          return `lineItems[${index}].${field}`;
        }
      }
    }
  }

  return undefined;
}

/**
 * Get human-readable field name from path.
 */
export function getFieldLabel(path: string): string {
  const labels: Record<string, string> = {
    'header.invoiceNumber': 'Invoice Number',
    'header.issueDate': 'Issue Date',
    'header.dueDate': 'Due Date',
    'header.currency': 'Currency',
    'header.taxRate': 'Tax Rate',
    'client.name': 'Client Name',
    'client.address': 'Client Address',
    'client.email': 'Client Email',
    'business.name': 'Business Name',
    'business.address': 'Business Address',
    'business.email': 'Business Email',
  };

  if (labels[path]) {
    return labels[path];
  }

  // Handle line items
  const lineItemMatch = path.match(/^lineItems\[(\d+)\]\.(\w+)$/);
  if (lineItemMatch) {
    const index = parseInt(lineItemMatch[1], 10) + 1; // 1-based for display
    const field = lineItemMatch[2];
    const fieldLabels: Record<string, string> = {
      description: 'Description',
      quantity: 'Quantity',
      unitPrice: 'Unit Price',
    };
    return `Line Item ${index} ${fieldLabels[field] || field}`;
  }

  return path;
}

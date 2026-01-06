/**
 * Invoice Engine - Validation
 *
 * Validates raw input and returns either a typed InvoiceDraft or structured issues.
 * All validation errors include paths for precise error reporting.
 */

import type {
  Business,
  Client,
  InvoiceHeader,
  LineItem,
  Issue,
  IssueCode,
  ValidationResult,
} from './types.js';

// ============================================================================
// Constants
// ============================================================================

/** ISO date format regex: YYYY-MM-DD */
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/** Supported currency codes (common subset) */
const SUPPORTED_CURRENCIES = new Set([
  'EUR', 'USD', 'GBP', 'CHF', 'CAD', 'AUD', 'JPY', 'CNY', 'INR', 'BRL',
  'MXN', 'KRW', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN',
  'HRK', 'RUB', 'TRY', 'ZAR', 'NZD', 'SGD', 'HKD', 'THB', 'MYR', 'PHP',
]);

// ============================================================================
// Issue Builder
// ============================================================================

function issue(
  code: IssueCode,
  path: string,
  message: string,
  hint?: string
): Issue {
  return hint ? { code, path, message, hint } : { code, path, message };
}

// ============================================================================
// Type Guards
// ============================================================================

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

// ============================================================================
// Field Validators
// ============================================================================

function validateRequiredString(
  obj: Record<string, unknown>,
  field: string,
  path: string,
  issues: Issue[]
): string | undefined {
  const value = obj[field];

  if (value === undefined || value === null) {
    issues.push(issue('MISSING_REQUIRED', path, `${field} is required`));
    return undefined;
  }

  if (!isString(value)) {
    issues.push(issue('INVALID_TYPE', path, `${field} must be a string`));
    return undefined;
  }

  const trimmed = value.trim();
  if (trimmed === '') {
    issues.push(issue('MISSING_REQUIRED', path, `${field} cannot be empty`));
    return undefined;
  }

  return trimmed;
}

function validateOptionalString(
  obj: Record<string, unknown>,
  field: string,
  path: string,
  issues: Issue[]
): string | undefined {
  const value = obj[field];

  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (!isString(value)) {
    issues.push(issue('INVALID_TYPE', path, `${field} must be a string`));
    return undefined;
  }

  return value.trim() || undefined;
}

function validateRequiredNumber(
  obj: Record<string, unknown>,
  field: string,
  path: string,
  issues: Issue[],
  options?: { allowNegative?: boolean; allowZero?: boolean }
): number | undefined {
  const value = obj[field];

  if (value === undefined || value === null) {
    issues.push(issue('MISSING_REQUIRED', path, `${field} is required`));
    return undefined;
  }

  if (!isNumber(value)) {
    // Try parsing if it's a string
    if (isString(value)) {
      const parsed = parseFloat(value);
      if (!Number.isNaN(parsed)) {
        return validateNumberValue(parsed, field, path, issues, options);
      }
    }
    issues.push(issue('INVALID_TYPE', path, `${field} must be a number`));
    return undefined;
  }

  return validateNumberValue(value, field, path, issues, options);
}

function validateNumberValue(
  value: number,
  field: string,
  path: string,
  issues: Issue[],
  options?: { allowNegative?: boolean; allowZero?: boolean }
): number | undefined {
  const { allowNegative = false, allowZero = true } = options ?? {};

  if (!allowNegative && value < 0) {
    issues.push(
      issue('NEGATIVE_NUMBER', path, `${field} cannot be negative`, 'Use a positive number')
    );
    return undefined;
  }

  if (!allowZero && value === 0) {
    issues.push(
      issue('INVALID_VALUE', path, `${field} cannot be zero`)
    );
    return undefined;
  }

  return value;
}

function validateOptionalNumber(
  obj: Record<string, unknown>,
  field: string,
  path: string,
  issues: Issue[],
  options?: { allowNegative?: boolean; min?: number; max?: number }
): number | undefined {
  const value = obj[field];

  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  let num: number;

  if (isNumber(value)) {
    num = value;
  } else if (isString(value)) {
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed)) {
      issues.push(issue('INVALID_TYPE', path, `${field} must be a number`));
      return undefined;
    }
    num = parsed;
  } else {
    issues.push(issue('INVALID_TYPE', path, `${field} must be a number`));
    return undefined;
  }

  const { allowNegative = false, min, max } = options ?? {};

  if (!allowNegative && num < 0) {
    issues.push(issue('NEGATIVE_NUMBER', path, `${field} cannot be negative`));
    return undefined;
  }

  if (min !== undefined && num < min) {
    issues.push(issue('INVALID_VALUE', path, `${field} must be at least ${min}`));
    return undefined;
  }

  if (max !== undefined && num > max) {
    issues.push(issue('INVALID_VALUE', path, `${field} must be at most ${max}`));
    return undefined;
  }

  return num;
}

function validateIsoDate(
  obj: Record<string, unknown>,
  field: string,
  path: string,
  issues: Issue[],
  required: boolean
): string | undefined {
  const value = obj[field];

  if (value === undefined || value === null || value === '') {
    if (required) {
      issues.push(issue('MISSING_REQUIRED', path, `${field} is required`));
    }
    return undefined;
  }

  // Handle Date objects
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      issues.push(issue('INVALID_DATE', path, `${field} is not a valid date`));
      return undefined;
    }
    return value.toISOString().split('T')[0];
  }

  if (!isString(value)) {
    issues.push(
      issue('INVALID_TYPE', path, `${field} must be a date string (YYYY-MM-DD)`)
    );
    return undefined;
  }

  const trimmed = value.trim();

  if (!ISO_DATE_REGEX.test(trimmed)) {
    issues.push(
      issue(
        'INVALID_FORMAT',
        path,
        `${field} must be in YYYY-MM-DD format`,
        'Example: 2025-01-15'
      )
    );
    return undefined;
  }

  // Validate it's a real date
  const date = new Date(trimmed + 'T00:00:00Z');
  if (Number.isNaN(date.getTime())) {
    issues.push(issue('INVALID_DATE', path, `${field} is not a valid date`));
    return undefined;
  }

  // Check the date didn't roll over (e.g., 2025-02-30 → 2025-03-02)
  const [year, month, day] = trimmed.split('-').map(Number);
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month ||
    date.getUTCDate() !== day
  ) {
    issues.push(
      issue('INVALID_DATE', path, `${field} is not a valid calendar date`)
    );
    return undefined;
  }

  return trimmed;
}

function validateCurrency(
  obj: Record<string, unknown>,
  field: string,
  path: string,
  issues: Issue[]
): string | undefined {
  const value = validateRequiredString(obj, field, path, issues);
  if (!value) return undefined;

  const upper = value.toUpperCase();

  if (!SUPPORTED_CURRENCIES.has(upper)) {
    issues.push(
      issue(
        'INVALID_VALUE',
        path,
        `${field} "${value}" is not a recognized currency code`,
        'Use ISO 4217 codes like EUR, USD, GBP'
      )
    );
    return undefined;
  }

  return upper;
}

// ============================================================================
// Object Validators
// ============================================================================

function validateBusiness(
  input: unknown,
  basePath: string,
  issues: Issue[]
): Business | undefined {
  if (!isObject(input)) {
    issues.push(issue('INVALID_TYPE', basePath, 'business must be an object'));
    return undefined;
  }

  const name = validateRequiredString(input, 'name', `${basePath}.name`, issues);
  const address = validateRequiredString(input, 'address', `${basePath}.address`, issues);
  const email = validateRequiredString(input, 'email', `${basePath}.email`, issues);
  const phone = validateOptionalString(input, 'phone', `${basePath}.phone`, issues);
  const logoUrl = validateOptionalString(input, 'logoUrl', `${basePath}.logoUrl`, issues);
  const taxId = validateOptionalString(input, 'taxId', `${basePath}.taxId`, issues);

  if (!name || !address || !email) {
    return undefined;
  }

  return {
    name,
    address,
    email,
    ...(phone && { phone }),
    ...(logoUrl && { logoUrl }),
    ...(taxId && { taxId }),
  };
}

function validateClient(
  input: unknown,
  basePath: string,
  issues: Issue[]
): Client | undefined {
  if (!isObject(input)) {
    issues.push(issue('INVALID_TYPE', basePath, 'client must be an object'));
    return undefined;
  }

  const name = validateRequiredString(input, 'name', `${basePath}.name`, issues);
  const address = validateRequiredString(input, 'address', `${basePath}.address`, issues);
  const email = validateOptionalString(input, 'email', `${basePath}.email`, issues);

  if (!name || !address) {
    return undefined;
  }

  return {
    name,
    address,
    ...(email && { email }),
  };
}

function validateHeader(
  input: unknown,
  basePath: string,
  issues: Issue[]
): InvoiceHeader | undefined {
  if (!isObject(input)) {
    issues.push(issue('INVALID_TYPE', basePath, 'header must be an object'));
    return undefined;
  }

  const invoiceNumber = validateRequiredString(
    input,
    'invoiceNumber',
    `${basePath}.invoiceNumber`,
    issues
  );

  const issueDate = validateIsoDate(
    input,
    'issueDate',
    `${basePath}.issueDate`,
    issues,
    true
  );

  const dueDate = validateIsoDate(
    input,
    'dueDate',
    `${basePath}.dueDate`,
    issues,
    false
  );

  const currency = validateCurrency(
    input,
    'currency',
    `${basePath}.currency`,
    issues
  );

  const taxRate = validateOptionalNumber(
    input,
    'taxRate',
    `${basePath}.taxRate`,
    issues,
    { allowNegative: false, min: 0, max: 1 }
  );

  const notes = validateOptionalString(input, 'notes', `${basePath}.notes`, issues);

  // Cross-field validation: dueDate must be >= issueDate
  if (issueDate && dueDate) {
    if (dueDate < issueDate) {
      issues.push(
        issue(
          'DATE_ORDER',
          `${basePath}.dueDate`,
          'Due date cannot be before issue date',
          'Set due date on or after the issue date'
        )
      );
    }
  }

  if (!invoiceNumber || !issueDate || !currency) {
    return undefined;
  }

  return {
    invoiceNumber,
    issueDate,
    currency,
    ...(dueDate && { dueDate }),
    ...(taxRate !== undefined && { taxRate }),
    ...(notes && { notes }),
  };
}

function validateLineItem(
  input: unknown,
  basePath: string,
  issues: Issue[]
): LineItem | undefined {
  if (!isObject(input)) {
    issues.push(issue('INVALID_TYPE', basePath, 'line item must be an object'));
    return undefined;
  }

  const description = validateRequiredString(
    input,
    'description',
    `${basePath}.description`,
    issues
  );

  const quantity = validateRequiredNumber(
    input,
    'quantity',
    `${basePath}.quantity`,
    issues,
    { allowNegative: false, allowZero: false }
  );

  const unitPrice = validateRequiredNumber(
    input,
    'unitPrice',
    `${basePath}.unitPrice`,
    issues,
    { allowNegative: false }
  );

  const unit = validateOptionalString(input, 'unit', `${basePath}.unit`, issues);

  if (!description || quantity === undefined || unitPrice === undefined) {
    return undefined;
  }

  return {
    description,
    quantity,
    unitPrice,
    ...(unit && { unit }),
  };
}

function validateLineItems(
  input: unknown,
  basePath: string,
  issues: Issue[]
): LineItem[] | undefined {
  if (!isArray(input)) {
    issues.push(issue('INVALID_TYPE', basePath, 'lineItems must be an array'));
    return undefined;
  }

  if (input.length === 0) {
    issues.push(
      issue(
        'EMPTY_ARRAY',
        basePath,
        'At least one line item is required',
        'Add at least one item to the invoice'
      )
    );
    return undefined;
  }

  const items: LineItem[] = [];
  let hasError = false;

  for (let i = 0; i < input.length; i++) {
    const item = validateLineItem(input[i], `${basePath}[${i}]`, issues);
    if (item) {
      items.push(item);
    } else {
      hasError = true;
    }
  }

  return hasError ? undefined : items;
}

// ============================================================================
// Main Validation Entry Point
// ============================================================================

/**
 * Validate raw input and return either a typed InvoiceDraft or validation issues.
 *
 * @param input - Raw input data (typically parsed JSON)
 * @returns ValidationResult with either the valid draft or an array of issues
 */
export function validateDraft(input: unknown): ValidationResult {
  const issues: Issue[] = [];

  if (!isObject(input)) {
    return {
      ok: false,
      issues: [issue('INVALID_TYPE', '', 'Input must be an object')],
    };
  }

  const business = validateBusiness(input['business'], 'business', issues);
  const client = validateClient(input['client'], 'client', issues);
  const header = validateHeader(input['header'], 'header', issues);
  const lineItems = validateLineItems(input['lineItems'], 'lineItems', issues);

  if (issues.length > 0 || !business || !client || !header || !lineItems) {
    return { ok: false, issues };
  }

  return {
    ok: true,
    draft: { business, client, header, lineItems },
  };
}

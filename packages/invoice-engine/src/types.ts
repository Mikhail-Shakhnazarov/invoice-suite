/**
 * Invoice Engine - Domain Types
 *
 * Pure TypeScript types with no platform dependencies.
 * These types form the contract between the engine and its adapters.
 */

// ============================================================================
// Business Entity
// ============================================================================

/**
 * Business entity issuing invoices.
 * Typically configured once in settings and reused across invoices.
 */
export interface Business {
  /** Legal business name */
  name: string;

  /** Full address, newline-separated for multi-line display */
  address: string;

  /** Contact email */
  email: string;

  /** Contact phone (optional) */
  phone?: string;

  /** URL to logo image (optional) */
  logoUrl?: string;

  /** Tax identification number: VAT, EIN, ABN, etc. (optional) */
  taxId?: string;
}

// ============================================================================
// Client Entity
// ============================================================================

/**
 * Invoice recipient.
 */
export interface Client {
  /** Client name (person or company) */
  name: string;

  /** Full address, newline-separated */
  address: string;

  /** Contact email (optional) */
  email?: string;
}

// ============================================================================
// Invoice Header
// ============================================================================

/**
 * Invoice metadata and settings.
 */
export interface InvoiceHeader {
  /** Unique invoice identifier, user-managed (e.g., "INV-2025-0042") */
  invoiceNumber: string;

  /** Issue date in ISO format: "YYYY-MM-DD" */
  issueDate: string;

  /** Due date in ISO format: "YYYY-MM-DD" (optional) */
  dueDate?: string;

  /** Currency code (ISO 4217): "EUR", "USD", "GBP", etc. */
  currency: string;

  /**
   * Tax rate as decimal (e.g., 0.19 for 19%).
   * Omit or set to 0 for no tax.
   */
  taxRate?: number;

  /** Payment terms, notes, or thank-you message (optional) */
  notes?: string;
}

// ============================================================================
// Line Items
// ============================================================================

/**
 * Single billable item on the invoice.
 */
export interface LineItem {
  /** Description of the item or service */
  description: string;

  /** Quantity (decimal allowed, e.g., 1.5 hours) */
  quantity: number;

  /** Price per unit in major currency units */
  unitPrice: number;

  /** Unit label: "hours", "pcs", "days", etc. (optional) */
  unit?: string;
}

// ============================================================================
// Invoice Draft (Input)
// ============================================================================

/**
 * Raw invoice input before computation.
 * This is what adapters construct from their data sources.
 */
export interface InvoiceDraft {
  business: Business;
  client: Client;
  header: InvoiceHeader;
  lineItems: LineItem[];
}

// ============================================================================
// Invoice Computed (After Calculation)
// ============================================================================

/**
 * Computed totals for an invoice.
 */
export interface ComputedTotals {
  /** Per-item amounts: quantity × unitPrice */
  lineItemAmounts: number[];

  /** Sum of all line item amounts */
  subtotal: number;

  /** Tax amount: subtotal × taxRate (0 if no tax) */
  taxAmount: number;

  /** Final total: subtotal + taxAmount */
  total: number;
}

/**
 * Invoice with computed totals.
 * Extends InvoiceDraft with calculated values.
 */
export interface InvoiceComputed extends InvoiceDraft {
  computed: ComputedTotals;
}

// ============================================================================
// Formatted Invoice (Render-Ready)
// ============================================================================

/**
 * Formatted business details (all strings, ready for display).
 */
export interface FormattedBusiness {
  name: string;
  address: string;
  email: string;
  phone: string;      // Empty string if not provided
  logoUrl: string;    // Empty string if not provided
  taxId: string;      // Empty string if not provided
}

/**
 * Formatted client details.
 */
export interface FormattedClient {
  name: string;
  address: string;
  email: string;      // Empty string if not provided
}

/**
 * Formatted invoice header.
 */
export interface FormattedHeader {
  invoiceNumber: string;
  issueDate: string;      // Locale-formatted date
  dueDate: string;        // Locale-formatted date or empty
  currency: string;       // Currency code
  taxRateDisplay: string; // "19" (without %) or empty
  notes: string;          // Empty string if not provided
}

/**
 * Formatted line item.
 */
export interface FormattedLineItem {
  description: string;
  quantity: string;     // Formatted number
  unitPrice: string;    // Currency-formatted
  amount: string;       // Currency-formatted
  unit: string;         // Empty string if not provided
}

/**
 * Formatted totals.
 */
export interface FormattedTotals {
  subtotal: string;     // Currency-formatted
  taxAmount: string;    // Currency-formatted
  total: string;        // Currency-formatted
}

/**
 * Fully formatted invoice ready for rendering.
 * All values are pre-formatted strings suitable for direct template interpolation.
 */
export interface FormattedInvoice {
  business: FormattedBusiness;
  client: FormattedClient;
  header: FormattedHeader;
  lineItems: FormattedLineItem[];
  totals: FormattedTotals;
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Single validation issue.
 */
export interface Issue {
  /** Machine-readable error code */
  code: IssueCode;

  /** JSON path to the problematic field (e.g., "header.invoiceNumber") */
  path: string;

  /** Human-readable error message */
  message: string;

  /** Optional hint for fixing the issue */
  hint?: string;
}

/**
 * Known issue codes for machine processing.
 */
export type IssueCode =
  | 'MISSING_REQUIRED'
  | 'INVALID_TYPE'
  | 'INVALID_FORMAT'
  | 'INVALID_VALUE'
  | 'INVALID_DATE'
  | 'DATE_ORDER'
  | 'EMPTY_ARRAY'
  | 'NEGATIVE_NUMBER'
  | 'UNKNOWN';

/**
 * Validation result (discriminated union).
 */
export type ValidationResult =
  | { ok: true; draft: InvoiceDraft }
  | { ok: false; issues: Issue[] };

// ============================================================================
// Formatting Options
// ============================================================================

/**
 * Options for formatting an invoice.
 */
export interface FormatOptions {
  /** Override auto-detected locale */
  locale?: string;

  /** Date format style */
  dateFormat?: 'short' | 'medium' | 'long';

  /** How to display currency */
  currencyDisplay?: 'symbol' | 'code' | 'name';
}

// ============================================================================
// Processing Result
// ============================================================================

/**
 * Result of full invoice processing (validate + compute + format).
 */
export type ProcessResult =
  | { ok: true; invoice: FormattedInvoice; computed: InvoiceComputed }
  | { ok: false; issues: Issue[] };

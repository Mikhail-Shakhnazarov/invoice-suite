/**
 * Invoice Engine
 *
 * Pure TypeScript invoice validation, computation, and formatting.
 * No platform dependencies - can be used in Node, browser, or Apps Script.
 *
 * @example
 * ```ts
 * import { processInvoice } from '@invoice-suite/engine';
 *
 * const result = processInvoice(inputData);
 * if (result.ok) {
 *   console.log(result.invoice.totals.total);
 * } else {
 *   console.error(result.issues);
 * }
 * ```
 */

// Re-export types
export type {
  // Domain types
  Business,
  Client,
  InvoiceHeader,
  LineItem,
  InvoiceDraft,
  InvoiceComputed,
  ComputedTotals,

  // Formatted types
  FormattedInvoice,
  FormattedBusiness,
  FormattedClient,
  FormattedHeader,
  FormattedLineItem,
  FormattedTotals,

  // Validation types
  Issue,
  IssueCode,
  ValidationResult,

  // Options
  FormatOptions,
  ProcessResult,
} from './types.js';

// Import implementations
import { validateDraft } from './validate.js';
import { computeInvoice } from './compute.js';
import { formatInvoice } from './format.js';

import type {
  InvoiceDraft,
  InvoiceComputed,
  FormattedInvoice,
  FormatOptions,
  ProcessResult,
} from './types.js';

// Re-export individual functions
export { validateDraft } from './validate.js';
export { computeInvoice, recomputeInvoice, computeTotals } from './compute.js';
export { formatInvoice, formatCurrency, formatIsoDate, getLocale } from './format.js';

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Process an invoice through the full pipeline: validate → compute → format.
 *
 * This is the main entry point for most use cases. It takes raw input,
 * validates it, computes totals, and returns a formatted invoice ready
 * for rendering.
 *
 * @param input - Raw invoice data (typically parsed JSON)
 * @param options - Formatting options
 * @returns ProcessResult with formatted invoice or validation issues
 *
 * @example
 * ```ts
 * const result = processInvoice(jsonData);
 * if (result.ok) {
 *   // Use result.invoice for rendering
 *   // Use result.computed for raw numeric values
 * } else {
 *   // Display result.issues to user
 * }
 * ```
 */
export function processInvoice(
  input: unknown,
  options?: FormatOptions
): ProcessResult {
  // Step 1: Validate
  const validation = validateDraft(input);
  if (!validation.ok) {
    return { ok: false, issues: validation.issues };
  }

  // Step 2: Compute
  const computed = computeInvoice(validation.draft);

  // Step 3: Format
  const invoice = formatInvoice(computed, options);

  return { ok: true, invoice, computed };
}

/**
 * Process a pre-validated draft (skips validation).
 *
 * Use this when you've already validated the input and want to
 * compute + format without re-validating.
 *
 * @param draft - Validated invoice draft
 * @param options - Formatting options
 * @returns Object with computed and formatted invoice
 */
export function processDraft(
  draft: InvoiceDraft,
  options?: FormatOptions
): { computed: InvoiceComputed; invoice: FormattedInvoice } {
  const computed = computeInvoice(draft);
  const invoice = formatInvoice(computed, options);
  return { computed, invoice };
}

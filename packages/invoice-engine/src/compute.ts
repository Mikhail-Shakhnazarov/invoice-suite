/**
 * Invoice Engine - Computation
 *
 * Computes derived values from a validated InvoiceDraft.
 * All calculations maintain full precision; rounding happens at format time.
 */

import type { InvoiceDraft, InvoiceComputed, ComputedTotals } from './types.js';

/**
 * Compute all derived values for an invoice.
 *
 * Calculation rules:
 * - lineItemAmount[i] = quantity × unitPrice
 * - subtotal = Σ(lineItemAmounts)
 * - taxAmount = subtotal × taxRate (or 0 if no taxRate)
 * - total = subtotal + taxAmount
 *
 * @param draft - Validated invoice draft
 * @returns Invoice with computed totals
 */
export function computeInvoice(draft: InvoiceDraft): InvoiceComputed {
  const lineItemAmounts = draft.lineItems.map(
    (item) => item.quantity * item.unitPrice
  );

  const subtotal = lineItemAmounts.reduce((sum, amount) => sum + amount, 0);

  const taxRate = draft.header.taxRate ?? 0;
  const taxAmount = subtotal * taxRate;

  const total = subtotal + taxAmount;

  const computed: ComputedTotals = {
    lineItemAmounts,
    subtotal,
    taxAmount,
    total,
  };

  return {
    ...draft,
    computed,
  };
}

/**
 * Recompute totals for an existing InvoiceComputed.
 * Useful after modifications to line items.
 *
 * @param invoice - Invoice with potentially stale computed values
 * @returns Invoice with fresh computed totals
 */
export function recomputeInvoice(invoice: InvoiceComputed): InvoiceComputed {
  // Extract the draft portion and recompute
  const { computed: _oldComputed, ...draft } = invoice;
  return computeInvoice(draft);
}

/**
 * Compute totals only (without full invoice structure).
 * Useful for preview calculations.
 *
 * @param lineItems - Array of line items
 * @param taxRate - Tax rate as decimal (e.g., 0.19)
 * @returns Computed totals
 */
export function computeTotals(
  lineItems: Array<{ quantity: number; unitPrice: number }>,
  taxRate: number = 0
): ComputedTotals {
  const lineItemAmounts = lineItems.map(
    (item) => item.quantity * item.unitPrice
  );

  const subtotal = lineItemAmounts.reduce((sum, amount) => sum + amount, 0);
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  return {
    lineItemAmounts,
    subtotal,
    taxAmount,
    total,
  };
}

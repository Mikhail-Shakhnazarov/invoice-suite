/**
 * Computation Tests
 */

import { describe, it, expect } from 'vitest';
import { computeInvoice, computeTotals, recomputeInvoice } from '../src/compute.js';
import type { InvoiceDraft } from '../src/types.js';

const baseDraft: InvoiceDraft = {
  business: {
    name: 'Test Business',
    address: '123 Test St',
    email: 'test@example.com',
  },
  client: {
    name: 'Test Client',
    address: '456 Client St',
  },
  header: {
    invoiceNumber: 'INV-001',
    issueDate: '2025-01-05',
    currency: 'EUR',
  },
  lineItems: [],
};

describe('computeInvoice', () => {
  describe('line item amounts', () => {
    it('computes single line item amount', () => {
      const draft: InvoiceDraft = {
        ...baseDraft,
        lineItems: [{ description: 'Service', quantity: 2, unitPrice: 100 }],
      };
      const result = computeInvoice(draft);
      expect(result.computed.lineItemAmounts).toEqual([200]);
    });

    it('computes multiple line item amounts', () => {
      const draft: InvoiceDraft = {
        ...baseDraft,
        lineItems: [
          { description: 'Service 1', quantity: 2, unitPrice: 100 },
          { description: 'Service 2', quantity: 3, unitPrice: 50 },
          { description: 'Service 3', quantity: 1, unitPrice: 75 },
        ],
      };
      const result = computeInvoice(draft);
      expect(result.computed.lineItemAmounts).toEqual([200, 150, 75]);
    });

    it('handles decimal quantities', () => {
      const draft: InvoiceDraft = {
        ...baseDraft,
        lineItems: [{ description: 'Partial', quantity: 1.5, unitPrice: 100 }],
      };
      const result = computeInvoice(draft);
      expect(result.computed.lineItemAmounts).toEqual([150]);
    });

    it('handles decimal unit prices', () => {
      const draft: InvoiceDraft = {
        ...baseDraft,
        lineItems: [{ description: 'Precise', quantity: 3, unitPrice: 33.33 }],
      };
      const result = computeInvoice(draft);
      expect(result.computed.lineItemAmounts[0]).toBeCloseTo(99.99, 10);
    });

    it('handles zero unit price', () => {
      const draft: InvoiceDraft = {
        ...baseDraft,
        lineItems: [{ description: 'Free', quantity: 5, unitPrice: 0 }],
      };
      const result = computeInvoice(draft);
      expect(result.computed.lineItemAmounts).toEqual([0]);
    });
  });

  describe('subtotal', () => {
    it('computes subtotal from single item', () => {
      const draft: InvoiceDraft = {
        ...baseDraft,
        lineItems: [{ description: 'Service', quantity: 10, unitPrice: 150 }],
      };
      const result = computeInvoice(draft);
      expect(result.computed.subtotal).toBe(1500);
    });

    it('computes subtotal from multiple items', () => {
      const draft: InvoiceDraft = {
        ...baseDraft,
        lineItems: [
          { description: 'Consulting', quantity: 10, unitPrice: 150 },
          { description: 'Development', quantity: 25, unitPrice: 120 },
          { description: 'Travel', quantity: 1, unitPrice: 234.50 },
        ],
      };
      const result = computeInvoice(draft);
      // 1500 + 3000 + 234.50 = 4734.50
      expect(result.computed.subtotal).toBe(4734.50);
    });

    it('handles empty line items (edge case)', () => {
      const draft: InvoiceDraft = {
        ...baseDraft,
        lineItems: [],
      };
      const result = computeInvoice(draft);
      expect(result.computed.subtotal).toBe(0);
    });
  });

  describe('tax calculation', () => {
    it('computes tax with rate', () => {
      const draft: InvoiceDraft = {
        ...baseDraft,
        header: { ...baseDraft.header, taxRate: 0.19 },
        lineItems: [{ description: 'Service', quantity: 1, unitPrice: 100 }],
      };
      const result = computeInvoice(draft);
      expect(result.computed.taxAmount).toBe(19);
    });

    it('computes zero tax when no rate', () => {
      const draft: InvoiceDraft = {
        ...baseDraft,
        lineItems: [{ description: 'Service', quantity: 1, unitPrice: 100 }],
      };
      const result = computeInvoice(draft);
      expect(result.computed.taxAmount).toBe(0);
    });

    it('computes zero tax when rate is 0', () => {
      const draft: InvoiceDraft = {
        ...baseDraft,
        header: { ...baseDraft.header, taxRate: 0 },
        lineItems: [{ description: 'Service', quantity: 1, unitPrice: 100 }],
      };
      const result = computeInvoice(draft);
      expect(result.computed.taxAmount).toBe(0);
    });

    it('maintains precision for tax calculation', () => {
      const draft: InvoiceDraft = {
        ...baseDraft,
        header: { ...baseDraft.header, taxRate: 0.19 },
        lineItems: [{ description: 'Service', quantity: 1, unitPrice: 4734.50 }],
      };
      const result = computeInvoice(draft);
      // 4734.50 * 0.19 = 899.555
      expect(result.computed.taxAmount).toBeCloseTo(899.555, 10);
    });
  });

  describe('total', () => {
    it('computes total without tax', () => {
      const draft: InvoiceDraft = {
        ...baseDraft,
        lineItems: [{ description: 'Service', quantity: 2, unitPrice: 100 }],
      };
      const result = computeInvoice(draft);
      expect(result.computed.total).toBe(200);
    });

    it('computes total with tax', () => {
      const draft: InvoiceDraft = {
        ...baseDraft,
        header: { ...baseDraft.header, taxRate: 0.19 },
        lineItems: [{ description: 'Service', quantity: 1, unitPrice: 100 }],
      };
      const result = computeInvoice(draft);
      expect(result.computed.total).toBe(119);
    });

    it('matches expected sample invoice totals', () => {
      const draft: InvoiceDraft = {
        ...baseDraft,
        header: { ...baseDraft.header, taxRate: 0.19 },
        lineItems: [
          { description: 'Consulting services', quantity: 10, unitPrice: 150 },
          { description: 'Development work', quantity: 25, unitPrice: 120 },
          { description: 'Travel expenses', quantity: 1, unitPrice: 234.50 },
        ],
      };
      const result = computeInvoice(draft);
      
      expect(result.computed.lineItemAmounts).toEqual([1500, 3000, 234.50]);
      expect(result.computed.subtotal).toBe(4734.50);
      expect(result.computed.taxAmount).toBeCloseTo(899.555, 10);
      expect(result.computed.total).toBeCloseTo(5634.055, 10);
    });
  });

  describe('preserves draft data', () => {
    it('includes all original draft fields', () => {
      const draft: InvoiceDraft = {
        ...baseDraft,
        business: { ...baseDraft.business, phone: '+1234567890' },
        header: { ...baseDraft.header, notes: 'Thank you' },
        lineItems: [{ description: 'Service', quantity: 1, unitPrice: 100, unit: 'hours' }],
      };
      const result = computeInvoice(draft);
      
      expect(result.business.phone).toBe('+1234567890');
      expect(result.header.notes).toBe('Thank you');
      expect(result.lineItems[0]?.unit).toBe('hours');
    });
  });
});

describe('computeTotals', () => {
  it('computes totals from line items only', () => {
    const lineItems = [
      { quantity: 2, unitPrice: 100 },
      { quantity: 3, unitPrice: 50 },
    ];
    const result = computeTotals(lineItems, 0.1);
    
    expect(result.lineItemAmounts).toEqual([200, 150]);
    expect(result.subtotal).toBe(350);
    expect(result.taxAmount).toBe(35);
    expect(result.total).toBe(385);
  });

  it('defaults to zero tax', () => {
    const lineItems = [{ quantity: 1, unitPrice: 100 }];
    const result = computeTotals(lineItems);
    
    expect(result.taxAmount).toBe(0);
    expect(result.total).toBe(100);
  });
});

describe('recomputeInvoice', () => {
  it('recomputes totals from existing invoice', () => {
    const draft: InvoiceDraft = {
      ...baseDraft,
      header: { ...baseDraft.header, taxRate: 0.1 },
      lineItems: [{ description: 'Service', quantity: 1, unitPrice: 100 }],
    };
    const initial = computeInvoice(draft);
    
    // Manually modify line items (simulating an edit)
    initial.lineItems[0] = { description: 'Service', quantity: 2, unitPrice: 100 };
    
    const result = recomputeInvoice(initial);
    
    expect(result.computed.subtotal).toBe(200);
    expect(result.computed.taxAmount).toBe(20);
    expect(result.computed.total).toBe(220);
  });
});

/**
 * Validation Tests
 */

import { describe, it, expect } from 'vitest';
import { validateDraft } from '../src/validate.js';

// Valid base invoice for modification
const validInvoice = {
  business: {
    name: 'Test Business',
    address: '123 Test St\nTest City',
    email: 'test@example.com',
  },
  client: {
    name: 'Test Client',
    address: '456 Client Ave\nClient City',
  },
  header: {
    invoiceNumber: 'INV-001',
    issueDate: '2025-01-05',
    currency: 'EUR',
  },
  lineItems: [
    { description: 'Service', quantity: 1, unitPrice: 100 },
  ],
};

describe('validateDraft', () => {
  describe('valid inputs', () => {
    it('validates a complete invoice', () => {
      const result = validateDraft(validInvoice);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.draft.business.name).toBe('Test Business');
        expect(result.draft.lineItems).toHaveLength(1);
      }
    });

    it('validates invoice with all optional fields', () => {
      const full = {
        business: {
          name: 'Full Business',
          address: '123 Full St',
          email: 'full@example.com',
          phone: '+1234567890',
          logoUrl: 'https://example.com/logo.png',
          taxId: 'DE123456789',
        },
        client: {
          name: 'Full Client',
          address: '456 Client St',
          email: 'client@example.com',
        },
        header: {
          invoiceNumber: 'INV-002',
          issueDate: '2025-01-01',
          dueDate: '2025-01-31',
          currency: 'USD',
          taxRate: 0.19,
          notes: 'Thank you for your business',
        },
        lineItems: [
          { description: 'Item 1', quantity: 2, unitPrice: 50, unit: 'hours' },
          { description: 'Item 2', quantity: 1.5, unitPrice: 100, unit: 'days' },
        ],
      };

      const result = validateDraft(full);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.draft.business.phone).toBe('+1234567890');
        expect(result.draft.header.taxRate).toBe(0.19);
        expect(result.draft.lineItems).toHaveLength(2);
      }
    });

    it('accepts decimal quantities', () => {
      const invoice = {
        ...validInvoice,
        lineItems: [{ description: 'Partial hour', quantity: 0.5, unitPrice: 100 }],
      };
      const result = validateDraft(invoice);
      expect(result.ok).toBe(true);
    });

    it('accepts zero unit price', () => {
      const invoice = {
        ...validInvoice,
        lineItems: [{ description: 'Free item', quantity: 1, unitPrice: 0 }],
      };
      const result = validateDraft(invoice);
      expect(result.ok).toBe(true);
    });

    it('trims whitespace from strings', () => {
      const invoice = {
        ...validInvoice,
        business: {
          ...validInvoice.business,
          name: '  Trimmed Name  ',
        },
      };
      const result = validateDraft(invoice);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.draft.business.name).toBe('Trimmed Name');
      }
    });

    it('normalizes currency to uppercase', () => {
      const invoice = {
        ...validInvoice,
        header: { ...validInvoice.header, currency: 'eur' },
      };
      const result = validateDraft(invoice);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.draft.header.currency).toBe('EUR');
      }
    });
  });

  describe('missing required fields', () => {
    it('rejects missing business', () => {
      const { business: _, ...invoice } = validInvoice;
      const result = validateDraft(invoice);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues.some(i => i.path === 'business')).toBe(true);
      }
    });

    it('rejects missing business.name', () => {
      const invoice = {
        ...validInvoice,
        business: { address: '123 St', email: 'test@test.com' },
      };
      const result = validateDraft(invoice);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues.some(i => i.path === 'business.name')).toBe(true);
      }
    });

    it('rejects missing client.name', () => {
      const invoice = {
        ...validInvoice,
        client: { address: '123 St' },
      };
      const result = validateDraft(invoice);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues.some(i => i.path === 'client.name')).toBe(true);
      }
    });

    it('rejects missing header.invoiceNumber', () => {
      const invoice = {
        ...validInvoice,
        header: { issueDate: '2025-01-01', currency: 'EUR' },
      };
      const result = validateDraft(invoice);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues.some(i => i.path === 'header.invoiceNumber')).toBe(true);
      }
    });

    it('rejects missing header.issueDate', () => {
      const invoice = {
        ...validInvoice,
        header: { invoiceNumber: 'INV-001', currency: 'EUR' },
      };
      const result = validateDraft(invoice);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues.some(i => i.path === 'header.issueDate')).toBe(true);
      }
    });

    it('rejects missing header.currency', () => {
      const invoice = {
        ...validInvoice,
        header: { invoiceNumber: 'INV-001', issueDate: '2025-01-01' },
      };
      const result = validateDraft(invoice);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues.some(i => i.path === 'header.currency')).toBe(true);
      }
    });

    it('rejects empty lineItems array', () => {
      const invoice = { ...validInvoice, lineItems: [] };
      const result = validateDraft(invoice);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues.some(i => i.code === 'EMPTY_ARRAY')).toBe(true);
      }
    });

    it('rejects missing lineItem.description', () => {
      const invoice = {
        ...validInvoice,
        lineItems: [{ quantity: 1, unitPrice: 100 }],
      };
      const result = validateDraft(invoice);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues.some(i => i.path === 'lineItems[0].description')).toBe(true);
      }
    });
  });

  describe('invalid types', () => {
    it('rejects non-object input', () => {
      expect(validateDraft(null).ok).toBe(false);
      expect(validateDraft('string').ok).toBe(false);
      expect(validateDraft(123).ok).toBe(false);
      expect(validateDraft([]).ok).toBe(false);
    });

    it('rejects non-string business.name', () => {
      const invoice = {
        ...validInvoice,
        business: { ...validInvoice.business, name: 123 },
      };
      const result = validateDraft(invoice);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues.some(i => i.code === 'INVALID_TYPE')).toBe(true);
      }
    });

    it('rejects non-number quantity', () => {
      const invoice = {
        ...validInvoice,
        lineItems: [{ description: 'Item', quantity: 'two', unitPrice: 100 }],
      };
      const result = validateDraft(invoice);
      expect(result.ok).toBe(false);
    });

    it('accepts string numbers and converts them', () => {
      const invoice = {
        ...validInvoice,
        lineItems: [{ description: 'Item', quantity: '2', unitPrice: '100.50' }],
      };
      const result = validateDraft(invoice);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.draft.lineItems[0]?.quantity).toBe(2);
        expect(result.draft.lineItems[0]?.unitPrice).toBe(100.50);
      }
    });
  });

  describe('invalid values', () => {
    it('rejects negative quantity', () => {
      const invoice = {
        ...validInvoice,
        lineItems: [{ description: 'Item', quantity: -1, unitPrice: 100 }],
      };
      const result = validateDraft(invoice);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues.some(i => i.code === 'NEGATIVE_NUMBER')).toBe(true);
      }
    });

    it('rejects zero quantity', () => {
      const invoice = {
        ...validInvoice,
        lineItems: [{ description: 'Item', quantity: 0, unitPrice: 100 }],
      };
      const result = validateDraft(invoice);
      expect(result.ok).toBe(false);
    });

    it('rejects negative unitPrice', () => {
      const invoice = {
        ...validInvoice,
        lineItems: [{ description: 'Item', quantity: 1, unitPrice: -50 }],
      };
      const result = validateDraft(invoice);
      expect(result.ok).toBe(false);
    });

    it('rejects invalid currency code', () => {
      const invoice = {
        ...validInvoice,
        header: { ...validInvoice.header, currency: 'FAKE' },
      };
      const result = validateDraft(invoice);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues.some(i => i.path === 'header.currency')).toBe(true);
      }
    });

    it('rejects tax rate over 100%', () => {
      const invoice = {
        ...validInvoice,
        header: { ...validInvoice.header, taxRate: 1.5 },
      };
      const result = validateDraft(invoice);
      expect(result.ok).toBe(false);
    });

    it('rejects negative tax rate', () => {
      const invoice = {
        ...validInvoice,
        header: { ...validInvoice.header, taxRate: -0.1 },
      };
      const result = validateDraft(invoice);
      expect(result.ok).toBe(false);
    });
  });

  describe('date validation', () => {
    it('rejects invalid date format', () => {
      const invoice = {
        ...validInvoice,
        header: { ...validInvoice.header, issueDate: '01-05-2025' },
      };
      const result = validateDraft(invoice);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues.some(i => i.code === 'INVALID_FORMAT')).toBe(true);
      }
    });

    it('rejects invalid calendar date', () => {
      const invoice = {
        ...validInvoice,
        header: { ...validInvoice.header, issueDate: '2025-02-30' },
      };
      const result = validateDraft(invoice);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues.some(i => i.code === 'INVALID_DATE')).toBe(true);
      }
    });

    it('rejects dueDate before issueDate', () => {
      const invoice = {
        ...validInvoice,
        header: {
          ...validInvoice.header,
          issueDate: '2025-01-15',
          dueDate: '2025-01-10',
        },
      };
      const result = validateDraft(invoice);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues.some(i => i.code === 'DATE_ORDER')).toBe(true);
      }
    });

    it('accepts dueDate equal to issueDate', () => {
      const invoice = {
        ...validInvoice,
        header: {
          ...validInvoice.header,
          issueDate: '2025-01-15',
          dueDate: '2025-01-15',
        },
      };
      const result = validateDraft(invoice);
      expect(result.ok).toBe(true);
    });

    it('handles Date objects', () => {
      const invoice = {
        ...validInvoice,
        header: {
          ...validInvoice.header,
          issueDate: new Date('2025-01-15'),
        },
      };
      const result = validateDraft(invoice);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.draft.header.issueDate).toBe('2025-01-15');
      }
    });
  });

  describe('multiple issues', () => {
    it('returns all issues, not just the first', () => {
      const invoice = {
        business: { name: '' },  // Missing address, email; empty name
        client: {},              // Missing name, address
        header: {},              // Missing invoiceNumber, issueDate, currency
        lineItems: [],           // Empty array
      };
      const result = validateDraft(invoice);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues.length).toBeGreaterThan(5);
      }
    });

    it('validates all line items', () => {
      const invoice = {
        ...validInvoice,
        lineItems: [
          { description: 'Valid', quantity: 1, unitPrice: 100 },
          { description: '', quantity: 1, unitPrice: 100 },     // Invalid
          { description: 'Also valid', quantity: 1, unitPrice: 100 },
          { description: 'Invalid qty', quantity: -1, unitPrice: 100 }, // Invalid
        ],
      };
      const result = validateDraft(invoice);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues.some(i => i.path === 'lineItems[1].description')).toBe(true);
        expect(result.issues.some(i => i.path === 'lineItems[3].quantity')).toBe(true);
      }
    });
  });
});

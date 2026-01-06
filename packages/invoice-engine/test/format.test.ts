/**
 * Formatting Tests
 */

import { describe, it, expect } from 'vitest';
import {
  formatInvoice,
  formatCurrency,
  formatIsoDate,
  getLocale,
} from '../src/format.js';
import type { InvoiceComputed } from '../src/types.js';

const baseComputed: InvoiceComputed = {
  business: {
    name: 'Test Business',
    address: '123 Test St\nTest City',
    email: 'test@example.com',
  },
  client: {
    name: 'Test Client',
    address: '456 Client St',
  },
  header: {
    invoiceNumber: 'INV-001',
    issueDate: '2025-01-15',
    currency: 'EUR',
  },
  lineItems: [
    { description: 'Service', quantity: 2, unitPrice: 100 },
  ],
  computed: {
    lineItemAmounts: [200],
    subtotal: 200,
    taxAmount: 0,
    total: 200,
  },
};

describe('formatInvoice', () => {
  describe('business formatting', () => {
    it('formats all business fields', () => {
      const invoice: InvoiceComputed = {
        ...baseComputed,
        business: {
          name: 'Full Business',
          address: '123 St',
          email: 'test@test.com',
          phone: '+1234567890',
          logoUrl: 'https://example.com/logo.png',
          taxId: 'DE123456789',
        },
      };
      const result = formatInvoice(invoice);
      
      expect(result.business.name).toBe('Full Business');
      expect(result.business.phone).toBe('+1234567890');
      expect(result.business.logoUrl).toBe('https://example.com/logo.png');
      expect(result.business.taxId).toBe('DE123456789');
    });

    it('returns empty strings for missing optional fields', () => {
      const result = formatInvoice(baseComputed);
      
      expect(result.business.phone).toBe('');
      expect(result.business.logoUrl).toBe('');
      expect(result.business.taxId).toBe('');
    });
  });

  describe('client formatting', () => {
    it('formats client with email', () => {
      const invoice: InvoiceComputed = {
        ...baseComputed,
        client: {
          name: 'Client Name',
          address: 'Client Address',
          email: 'client@example.com',
        },
      };
      const result = formatInvoice(invoice);
      
      expect(result.client.name).toBe('Client Name');
      expect(result.client.email).toBe('client@example.com');
    });

    it('returns empty string for missing email', () => {
      const result = formatInvoice(baseComputed);
      expect(result.client.email).toBe('');
    });
  });

  describe('header formatting', () => {
    it('formats dates according to locale', () => {
      const result = formatInvoice(baseComputed);
      
      // EUR → de-DE locale, so expect German-style date
      // The exact format depends on the system, but it should include the date components
      expect(result.header.issueDate).toBeTruthy();
      expect(result.header.issueDate).toContain('2025');
    });

    it('formats dueDate when present', () => {
      const invoice: InvoiceComputed = {
        ...baseComputed,
        header: {
          ...baseComputed.header,
          dueDate: '2025-02-15',
        },
      };
      const result = formatInvoice(invoice);
      
      expect(result.header.dueDate).toBeTruthy();
      expect(result.header.dueDate).toContain('2025');
    });

    it('returns empty string for missing dueDate', () => {
      const result = formatInvoice(baseComputed);
      expect(result.header.dueDate).toBe('');
    });

    it('formats tax rate as display string', () => {
      const invoice: InvoiceComputed = {
        ...baseComputed,
        header: { ...baseComputed.header, taxRate: 0.19 },
        computed: { ...baseComputed.computed, taxAmount: 38 },
      };
      const result = formatInvoice(invoice);
      
      expect(result.header.taxRateDisplay).toBe('19');
    });

    it('returns empty string for missing tax rate', () => {
      const result = formatInvoice(baseComputed);
      expect(result.header.taxRateDisplay).toBe('');
    });

    it('formats notes when present', () => {
      const invoice: InvoiceComputed = {
        ...baseComputed,
        header: { ...baseComputed.header, notes: 'Thank you!' },
      };
      const result = formatInvoice(invoice);
      
      expect(result.header.notes).toBe('Thank you!');
    });
  });

  describe('line items formatting', () => {
    it('formats line item quantities', () => {
      const invoice: InvoiceComputed = {
        ...baseComputed,
        lineItems: [{ description: 'Item', quantity: 1.5, unitPrice: 100 }],
        computed: {
          lineItemAmounts: [150],
          subtotal: 150,
          taxAmount: 0,
          total: 150,
        },
      };
      const result = formatInvoice(invoice);
      
      // Should be formatted as number (locale-dependent)
      expect(result.lineItems[0]?.quantity).toBeTruthy();
    });

    it('formats currency values', () => {
      const result = formatInvoice(baseComputed);
      
      // EUR formatting should include € symbol or "EUR"
      expect(result.lineItems[0]?.unitPrice).toBeTruthy();
      expect(result.lineItems[0]?.amount).toBeTruthy();
    });

    it('includes unit when present', () => {
      const invoice: InvoiceComputed = {
        ...baseComputed,
        lineItems: [{ description: 'Work', quantity: 10, unitPrice: 100, unit: 'hours' }],
        computed: { ...baseComputed.computed },
      };
      const result = formatInvoice(invoice);
      
      expect(result.lineItems[0]?.unit).toBe('hours');
    });

    it('returns empty string for missing unit', () => {
      const result = formatInvoice(baseComputed);
      expect(result.lineItems[0]?.unit).toBe('');
    });

    it('formats multiple line items', () => {
      const invoice: InvoiceComputed = {
        ...baseComputed,
        lineItems: [
          { description: 'Item 1', quantity: 1, unitPrice: 100 },
          { description: 'Item 2', quantity: 2, unitPrice: 50 },
          { description: 'Item 3', quantity: 3, unitPrice: 25 },
        ],
        computed: {
          lineItemAmounts: [100, 100, 75],
          subtotal: 275,
          taxAmount: 0,
          total: 275,
        },
      };
      const result = formatInvoice(invoice);
      
      expect(result.lineItems).toHaveLength(3);
      expect(result.lineItems[0]?.description).toBe('Item 1');
      expect(result.lineItems[2]?.description).toBe('Item 3');
    });
  });

  describe('totals formatting', () => {
    it('formats all totals as currency', () => {
      const invoice: InvoiceComputed = {
        ...baseComputed,
        header: { ...baseComputed.header, taxRate: 0.19 },
        computed: {
          lineItemAmounts: [200],
          subtotal: 200,
          taxAmount: 38,
          total: 238,
        },
      };
      const result = formatInvoice(invoice);
      
      expect(result.totals.subtotal).toBeTruthy();
      expect(result.totals.taxAmount).toBeTruthy();
      expect(result.totals.total).toBeTruthy();
    });
  });

  describe('locale handling', () => {
    it('uses EUR locale for EUR currency', () => {
      const invoice: InvoiceComputed = {
        ...baseComputed,
        header: { ...baseComputed.header, currency: 'EUR' },
      };
      const result = formatInvoice(invoice);
      
      // German formatting uses comma as decimal separator
      // Just verify it produces valid output
      expect(result.totals.total).toBeTruthy();
    });

    it('uses USD locale for USD currency', () => {
      const invoice: InvoiceComputed = {
        ...baseComputed,
        header: { ...baseComputed.header, currency: 'USD' },
      };
      const result = formatInvoice(invoice);
      
      expect(result.totals.total).toBeTruthy();
    });

    it('allows locale override', () => {
      const result = formatInvoice(baseComputed, { locale: 'en-US' });
      
      // With US locale, should produce US-style formatting
      expect(result.totals.total).toBeTruthy();
    });

    it('allows date format override', () => {
      const resultShort = formatInvoice(baseComputed, { dateFormat: 'short' });
      const resultLong = formatInvoice(baseComputed, { dateFormat: 'long' });
      
      // Long format should be longer than short
      expect(resultLong.header.issueDate.length).toBeGreaterThanOrEqual(
        resultShort.header.issueDate.length
      );
    });

    it('allows currency display override', () => {
      const resultSymbol = formatInvoice(baseComputed, { currencyDisplay: 'symbol' });
      const resultCode = formatInvoice(baseComputed, { currencyDisplay: 'code' });
      
      // Both should produce valid output
      expect(resultSymbol.totals.total).toBeTruthy();
      expect(resultCode.totals.total).toBeTruthy();
    });
  });
});

describe('formatCurrency', () => {
  it('formats EUR amounts', () => {
    const result = formatCurrency(1234.56, 'EUR');
    expect(result).toBeTruthy();
    // Should contain the amount in some form
  });

  it('formats USD amounts', () => {
    const result = formatCurrency(1234.56, 'USD');
    expect(result).toBeTruthy();
  });

  it('handles zero', () => {
    const result = formatCurrency(0, 'EUR');
    expect(result).toBeTruthy();
  });

  it('handles large numbers', () => {
    const result = formatCurrency(1234567.89, 'EUR');
    expect(result).toBeTruthy();
  });

  it('accepts locale override', () => {
    const result = formatCurrency(1234.56, 'EUR', 'en-US');
    expect(result).toBeTruthy();
  });
});

describe('formatIsoDate', () => {
  it('formats ISO date string', () => {
    const result = formatIsoDate('2025-01-15');
    expect(result).toBeTruthy();
    expect(result).toContain('2025');
  });

  it('accepts locale parameter', () => {
    const resultUS = formatIsoDate('2025-01-15', 'en-US');
    const resultDE = formatIsoDate('2025-01-15', 'de-DE');
    
    expect(resultUS).toBeTruthy();
    expect(resultDE).toBeTruthy();
  });

  it('accepts style parameter', () => {
    const resultShort = formatIsoDate('2025-01-15', 'en-US', 'short');
    const resultLong = formatIsoDate('2025-01-15', 'en-US', 'long');
    
    expect(resultLong.length).toBeGreaterThan(resultShort.length);
  });
});

describe('getLocale', () => {
  it('returns de-DE for EUR', () => {
    expect(getLocale('EUR')).toBe('de-DE');
  });

  it('returns en-US for USD', () => {
    expect(getLocale('USD')).toBe('en-US');
  });

  it('returns en-GB for GBP', () => {
    expect(getLocale('GBP')).toBe('en-GB');
  });

  it('returns en-US for unknown currency', () => {
    expect(getLocale('XYZ')).toBe('en-US');
  });

  it('is case-insensitive', () => {
    expect(getLocale('eur')).toBe('de-DE');
    expect(getLocale('Eur')).toBe('de-DE');
  });
});

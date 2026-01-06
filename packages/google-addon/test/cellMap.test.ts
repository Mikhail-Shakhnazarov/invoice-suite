/**
 * Cell Mapping Tests
 *
 * Tests for path ↔ cell reference conversion.
 */

import { describe, it, expect } from 'vitest';
import {
  pathToCell,
  cellToPath,
  columnToLetter,
  getFieldLabel,
} from '../src/adapters/sheets/cellMap.js';

describe('columnToLetter', () => {
  it('converts single digit columns', () => {
    expect(columnToLetter(0)).toBe('A');
    expect(columnToLetter(1)).toBe('B');
    expect(columnToLetter(25)).toBe('Z');
  });

  it('converts double digit columns', () => {
    expect(columnToLetter(26)).toBe('AA');
    expect(columnToLetter(27)).toBe('AB');
    expect(columnToLetter(51)).toBe('AZ');
    expect(columnToLetter(52)).toBe('BA');
  });
});

describe('pathToCell', () => {
  describe('metadata cells', () => {
    it('maps header.invoiceNumber to B3', () => {
      expect(pathToCell('header.invoiceNumber')).toBe('B3');
    });

    it('maps header.issueDate to B4', () => {
      expect(pathToCell('header.issueDate')).toBe('B4');
    });

    it('maps header.dueDate to B5', () => {
      expect(pathToCell('header.dueDate')).toBe('B5');
    });

    it('maps header.currency to B6', () => {
      expect(pathToCell('header.currency')).toBe('B6');
    });

    it('maps header.taxRate to B7', () => {
      expect(pathToCell('header.taxRate')).toBe('B7');
    });

    it('maps client.name to B10', () => {
      expect(pathToCell('client.name')).toBe('B10');
    });

    it('maps client.address to B11', () => {
      expect(pathToCell('client.address')).toBe('B11');
    });

    it('maps client.email to B12', () => {
      expect(pathToCell('client.email')).toBe('B12');
    });
  });

  describe('line item cells', () => {
    it('maps lineItems[0].description to A16', () => {
      expect(pathToCell('lineItems[0].description')).toBe('A16');
    });

    it('maps lineItems[0].quantity to B16', () => {
      expect(pathToCell('lineItems[0].quantity')).toBe('B16');
    });

    it('maps lineItems[0].unitPrice to C16', () => {
      expect(pathToCell('lineItems[0].unitPrice')).toBe('C16');
    });

    it('maps lineItems[1].description to A17', () => {
      expect(pathToCell('lineItems[1].description')).toBe('A17');
    });

    it('maps lineItems[5].unitPrice to C21', () => {
      expect(pathToCell('lineItems[5].unitPrice')).toBe('C21');
    });

    it('maps lineItems[10].quantity to B26', () => {
      expect(pathToCell('lineItems[10].quantity')).toBe('B26');
    });
  });

  describe('unknown paths', () => {
    it('returns path as-is for unknown paths', () => {
      expect(pathToCell('unknown.field')).toBe('unknown.field');
      expect(pathToCell('business.name')).toBe('business.name');
    });
  });
});

describe('cellToPath', () => {
  describe('metadata cells', () => {
    it('maps B3 to header.invoiceNumber', () => {
      expect(cellToPath('B3')).toBe('header.invoiceNumber');
    });

    it('maps B10 to client.name', () => {
      expect(cellToPath('B10')).toBe('client.name');
    });
  });

  describe('line item cells', () => {
    it('maps A16 to lineItems[0].description', () => {
      expect(cellToPath('A16')).toBe('lineItems[0].description');
    });

    it('maps C18 to lineItems[2].unitPrice', () => {
      expect(cellToPath('C18')).toBe('lineItems[2].unitPrice');
    });
  });

  describe('unknown cells', () => {
    it('returns undefined for unknown cells', () => {
      expect(cellToPath('Z99')).toBeUndefined();
      expect(cellToPath('D16')).toBeUndefined(); // amount column not mapped
    });
  });
});

describe('getFieldLabel', () => {
  it('returns label for header fields', () => {
    expect(getFieldLabel('header.invoiceNumber')).toBe('Invoice Number');
    expect(getFieldLabel('header.issueDate')).toBe('Issue Date');
  });

  it('returns label for client fields', () => {
    expect(getFieldLabel('client.name')).toBe('Client Name');
    expect(getFieldLabel('client.address')).toBe('Client Address');
  });

  it('returns label for line item fields', () => {
    expect(getFieldLabel('lineItems[0].description')).toBe('Line Item 1 Description');
    expect(getFieldLabel('lineItems[2].unitPrice')).toBe('Line Item 3 Unit Price');
  });

  it('returns path for unknown fields', () => {
    expect(getFieldLabel('unknown.field')).toBe('unknown.field');
  });
});

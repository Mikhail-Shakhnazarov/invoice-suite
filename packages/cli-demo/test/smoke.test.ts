/**
 * CLI Demo Smoke Tests
 *
 * Tests the full pipeline: JSON → validate → compute → format → HTML → PDF
 */

import { describe, it, expect, afterAll } from 'vitest';
import { readFileSync, existsSync, unlinkSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { processInvoice } from '@invoice-suite/engine';
import { renderInvoiceHtml, loadTemplate } from '../src/render/htmlTemplate.js';
import { generatePdf, closeBrowser } from '../src/render/pdf.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const FIXTURES_PATH = join(__dirname, '..', '..', '..', 'fixtures');
const TEST_OUTPUT_PATH = join(__dirname, '..', 'out', 'test');

// Ensure test output directory exists
if (!existsSync(TEST_OUTPUT_PATH)) {
  mkdirSync(TEST_OUTPUT_PATH, { recursive: true });
}

// Clean up browser after all tests
afterAll(async () => {
  await closeBrowser();
});

describe('HTML Template', () => {
  it('loads template file', () => {
    const template = loadTemplate();
    expect(template).toContain('<!DOCTYPE html>');
    expect(template).toContain('{{header.invoiceNumber}}');
    expect(template).toContain('{{#each lineItems}}');
  });

  it('renders sample invoice to HTML', () => {
    const samplePath = join(FIXTURES_PATH, 'sample-invoice.json');
    const input = JSON.parse(readFileSync(samplePath, 'utf-8'));

    const result = processInvoice(input);
    expect(result.ok).toBe(true);

    if (result.ok) {
      const html = renderInvoiceHtml(result.invoice);

      // Check key content is rendered
      expect(html).toContain('Freelance Dev Co.');
      expect(html).toContain('Acme GmbH');
      expect(html).toContain('INV-2025-0042');
      expect(html).toContain('Consulting services');

      // Check structure
      expect(html).toContain('<table class="line-items">');
      expect(html).toContain('class="totals"');
    }
  });

  it('handles conditional blocks correctly', () => {
    const samplePath = join(FIXTURES_PATH, 'sample-invoice.json');
    const input = JSON.parse(readFileSync(samplePath, 'utf-8'));

    const result = processInvoice(input);
    expect(result.ok).toBe(true);

    if (result.ok) {
      const html = renderInvoiceHtml(result.invoice);

      // Should include tax section (tax rate is present)
      expect(html).toContain('Tax (19%)');

      // Should include notes (notes are present)
      expect(html).toContain('Payment due within 30 days');
    }
  });

  it('handles missing optional fields', () => {
    const singleItemPath = join(FIXTURES_PATH, 'edgecases', 'single-item.json');
    const input = JSON.parse(readFileSync(singleItemPath, 'utf-8'));

    const result = processInvoice(input);
    expect(result.ok).toBe(true);

    if (result.ok) {
      const html = renderInvoiceHtml(result.invoice);

      // Should render without errors
      expect(html).toContain('Solo Contractor');
      expect(html).toContain('INV-SINGLE-001');
    }
  });
});

describe('PDF Generation', () => {
  it('generates PDF from sample invoice', async () => {
    const samplePath = join(FIXTURES_PATH, 'sample-invoice.json');
    const input = JSON.parse(readFileSync(samplePath, 'utf-8'));

    const result = processInvoice(input);
    expect(result.ok).toBe(true);

    if (result.ok) {
      const html = renderInvoiceHtml(result.invoice);
      const pdfBuffer = await generatePdf(html);

      // Check PDF was generated
      expect(pdfBuffer).toBeInstanceOf(Buffer);
      expect(pdfBuffer.length).toBeGreaterThan(1000); // Reasonable minimum size

      // Check PDF magic bytes
      const pdfHeader = pdfBuffer.slice(0, 5).toString('ascii');
      expect(pdfHeader).toBe('%PDF-');

      // Save for manual inspection
      const outputPath = join(TEST_OUTPUT_PATH, 'sample-invoice.pdf');
      const { writeFileSync } = await import('node:fs');
      writeFileSync(outputPath, pdfBuffer);

      expect(existsSync(outputPath)).toBe(true);
    }
  }, 30000); // 30s timeout for PDF generation

  it('generates PDF from zero-tax invoice', async () => {
    const zeroTaxPath = join(FIXTURES_PATH, 'edgecases', 'zero-tax.json');
    const input = JSON.parse(readFileSync(zeroTaxPath, 'utf-8'));

    const result = processInvoice(input);
    expect(result.ok).toBe(true);

    if (result.ok) {
      const html = renderInvoiceHtml(result.invoice);
      const pdfBuffer = await generatePdf(html);

      expect(pdfBuffer).toBeInstanceOf(Buffer);
      expect(pdfBuffer.length).toBeGreaterThan(1000);

      // Save for manual inspection
      const outputPath = join(TEST_OUTPUT_PATH, 'zero-tax-invoice.pdf');
      const { writeFileSync } = await import('node:fs');
      writeFileSync(outputPath, pdfBuffer);
    }
  }, 30000);

  it('generates PDF from many-items invoice', async () => {
    const manyItemsPath = join(FIXTURES_PATH, 'edgecases', 'many-items.json');
    const input = JSON.parse(readFileSync(manyItemsPath, 'utf-8'));

    const result = processInvoice(input);
    expect(result.ok).toBe(true);

    if (result.ok) {
      const html = renderInvoiceHtml(result.invoice);
      const pdfBuffer = await generatePdf(html);

      expect(pdfBuffer).toBeInstanceOf(Buffer);
      // Many items should produce a larger PDF (possibly multi-page)
      expect(pdfBuffer.length).toBeGreaterThan(5000);

      // Save for manual inspection
      const outputPath = join(TEST_OUTPUT_PATH, 'many-items-invoice.pdf');
      const { writeFileSync } = await import('node:fs');
      writeFileSync(outputPath, pdfBuffer);
    }
  }, 30000);
});

describe('End-to-End Pipeline', () => {
  it('processes sample invoice through full pipeline', async () => {
    // 1. Load JSON
    const samplePath = join(FIXTURES_PATH, 'sample-invoice.json');
    const input = JSON.parse(readFileSync(samplePath, 'utf-8'));

    // 2. Process with engine
    const result = processInvoice(input);
    expect(result.ok).toBe(true);

    if (result.ok) {
      // 3. Verify computed values
      expect(result.computed.computed.subtotal).toBe(4734.50);
      expect(result.computed.computed.taxAmount).toBeCloseTo(899.555, 2);
      expect(result.computed.computed.total).toBeCloseTo(5634.055, 2);

      // 4. Verify formatted values
      expect(result.invoice.header.invoiceNumber).toBe('INV-2025-0042');
      expect(result.invoice.lineItems).toHaveLength(3);

      // 5. Render HTML
      const html = renderInvoiceHtml(result.invoice);
      expect(html).toContain('INV-2025-0042');

      // 6. Generate PDF
      const pdfBuffer = await generatePdf(html);
      expect(pdfBuffer.slice(0, 5).toString('ascii')).toBe('%PDF-');
    }
  }, 30000);
});

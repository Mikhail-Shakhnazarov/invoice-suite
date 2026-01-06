/**
 * PDF Renderer
 *
 * Generates PDF from HTML using Puppeteer (headless Chrome).
 */

import puppeteer, { type Browser, type PDFOptions } from 'puppeteer';

let browserInstance: Browser | null = null;

/**
 * Get or create a browser instance.
 * Reuses browser across multiple PDF generations for efficiency.
 */
async function getBrowser(): Promise<Browser> {
  if (!browserInstance || !browserInstance.connected) {
    browserInstance = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });
  }
  return browserInstance;
}

/**
 * Close the browser instance.
 * Call this when done generating PDFs.
 */
export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}

/**
 * PDF generation options.
 */
export interface PdfOptions {
  /** Paper format (default: 'A4') */
  format?: 'A4' | 'Letter' | 'Legal';

  /** Print background colors and images (default: true) */
  printBackground?: boolean;

  /** Margins in CSS units (default: '15mm') */
  margin?: string | {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };

  /** Display header and footer (default: false) */
  displayHeaderFooter?: boolean;

  /** Header template HTML */
  headerTemplate?: string;

  /** Footer template HTML */
  footerTemplate?: string;
}

/**
 * Generate a PDF buffer from HTML content.
 *
 * @param html - HTML content to render
 * @param options - PDF generation options
 * @returns PDF as a Buffer
 */
export async function generatePdf(
  html: string,
  options: PdfOptions = {}
): Promise<Buffer> {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    // Set content and wait for it to load
    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });

    // Resolve margins
    const margins = resolveMargins(options.margin ?? '15mm');

    // Configure PDF options
    const pdfOptions: PDFOptions = {
      format: options.format ?? 'A4',
      printBackground: options.printBackground ?? true,
      margin: margins,
      displayHeaderFooter: options.displayHeaderFooter ?? false,
    };

    if (options.headerTemplate) {
      pdfOptions.headerTemplate = options.headerTemplate;
    }

    if (options.footerTemplate) {
      pdfOptions.footerTemplate = options.footerTemplate;
    }

    // Generate PDF
    const pdfBuffer = await page.pdf(pdfOptions);

    return Buffer.from(pdfBuffer);
  } finally {
    await page.close();
  }
}

/**
 * Resolve margin option to Puppeteer format.
 */
function resolveMargins(
  margin: string | { top?: string; right?: string; bottom?: string; left?: string }
): { top: string; right: string; bottom: string; left: string } {
  if (typeof margin === 'string') {
    return {
      top: margin,
      right: margin,
      bottom: margin,
      left: margin,
    };
  }

  return {
    top: margin.top ?? '15mm',
    right: margin.right ?? '15mm',
    bottom: margin.bottom ?? '15mm',
    left: margin.left ?? '15mm',
  };
}

/**
 * Generate a PDF and return as base64 string.
 * Useful for embedding or transmitting.
 */
export async function generatePdfBase64(
  html: string,
  options: PdfOptions = {}
): Promise<string> {
  const buffer = await generatePdf(html, options);
  return buffer.toString('base64');
}

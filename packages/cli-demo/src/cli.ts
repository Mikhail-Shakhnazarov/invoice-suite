#!/usr/bin/env node

/**
 * Invoice Suite CLI Demo
 *
 * Generates PDF invoices from JSON input files.
 *
 * Usage:
 *   invoice-pdf --input <file.json> [--out <dir>] [--print]
 *
 * Examples:
 *   pnpm demo:pdf
 *   pnpm demo:pdf --input ./my-invoice.json --out ./invoices/
 *   pnpm demo:print --input ./my-invoice.json
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { processInvoice, type FormattedInvoice } from '@invoice-suite/engine';
import { renderInvoiceHtml } from './render/htmlTemplate.js';
import { generatePdf, closeBrowser } from './render/pdf.js';

// ============================================================================
// CLI Argument Parsing
// ============================================================================

interface CliArgs {
  input: string;
  out: string;
  print: boolean;
  help: boolean;
}

function parseArgs(args: string[]): CliArgs {
  const result: CliArgs = {
    input: '',
    out: './out',
    print: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    switch (arg) {
      case '--input':
      case '-i':
        result.input = next ?? '';
        i++;
        break;
      case '--out':
      case '-o':
        result.out = next ?? './out';
        i++;
        break;
      case '--print':
      case '-p':
        result.print = true;
        break;
      case '--help':
      case '-h':
        result.help = true;
        break;
    }
  }

  return result;
}

function printHelp(): void {
  console.log(`
Invoice Suite CLI Demo

Usage:
  invoice-pdf --input <file.json> [options]

Options:
  -i, --input <file>   Input JSON invoice file (required)
  -o, --out <dir>      Output directory (default: ./out)
  -p, --print          Print formatted invoice to stdout instead of PDF
  -h, --help           Show this help message

Examples:
  # Generate PDF from sample invoice
  pnpm demo:pdf

  # Generate PDF from custom input
  node dist/cli.js --input ./my-invoice.json --out ./invoices/

  # Print invoice summary to terminal
  node dist/cli.js --input ./my-invoice.json --print
`);
}

// ============================================================================
// Invoice Processing
// ============================================================================

function loadInvoiceJson(filepath: string): unknown {
  try {
    const content = readFileSync(filepath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`Input file not found: ${filepath}`);
    }
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in input file: ${error.message}`);
    }
    throw error;
  }
}

function printFormattedInvoice(invoice: FormattedInvoice): void {
  console.log('\n' + '='.repeat(60));
  console.log('INVOICE PREVIEW');
  console.log('='.repeat(60));

  console.log(`\nFrom: ${invoice.business.name}`);
  console.log(`      ${invoice.business.address.replace(/\n/g, '\n      ')}`);
  console.log(`      ${invoice.business.email}`);
  if (invoice.business.phone) {
    console.log(`      ${invoice.business.phone}`);
  }

  console.log(`\nTo:   ${invoice.client.name}`);
  console.log(`      ${invoice.client.address.replace(/\n/g, '\n      ')}`);
  if (invoice.client.email) {
    console.log(`      ${invoice.client.email}`);
  }

  console.log('\n' + '-'.repeat(60));
  console.log(`Invoice #:  ${invoice.header.invoiceNumber}`);
  console.log(`Date:       ${invoice.header.issueDate}`);
  if (invoice.header.dueDate) {
    console.log(`Due:        ${invoice.header.dueDate}`);
  }
  console.log('-'.repeat(60));

  console.log('\nLine Items:');
  console.log('-'.repeat(60));

  const descWidth = 35;
  const numWidth = 10;

  console.log(
    'Description'.padEnd(descWidth) +
    'Qty'.padStart(numWidth) +
    'Price'.padStart(numWidth) +
    'Amount'.padStart(numWidth)
  );
  console.log('-'.repeat(60));

  for (const item of invoice.lineItems) {
    const desc = item.description.length > descWidth - 2
      ? item.description.slice(0, descWidth - 5) + '...'
      : item.description;

    console.log(
      desc.padEnd(descWidth) +
      item.quantity.padStart(numWidth) +
      item.unitPrice.padStart(numWidth) +
      item.amount.padStart(numWidth)
    );
  }

  console.log('-'.repeat(60));
  console.log('Subtotal:'.padStart(descWidth + numWidth * 2) + invoice.totals.subtotal.padStart(numWidth));

  if (invoice.header.taxRateDisplay) {
    console.log(
      `Tax (${invoice.header.taxRateDisplay}%):`.padStart(descWidth + numWidth * 2) +
      invoice.totals.taxAmount.padStart(numWidth)
    );
  }

  console.log('='.repeat(60));
  console.log('TOTAL:'.padStart(descWidth + numWidth * 2) + invoice.totals.total.padStart(numWidth));
  console.log('='.repeat(60));

  if (invoice.header.notes) {
    console.log('\nNotes:');
    console.log(invoice.header.notes);
  }

  console.log('');
}

function generateOutputFilename(invoice: FormattedInvoice): string {
  // Sanitize invoice number for filename
  const sanitizedNumber = invoice.header.invoiceNumber
    .replace(/[^a-zA-Z0-9-_]/g, '_');

  // Sanitize client name
  const sanitizedClient = invoice.client.name
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .slice(0, 30);

  return `Invoice_${sanitizedNumber}_${sanitizedClient}.pdf`;
}

// ============================================================================
// Main
// ============================================================================

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  if (!args.input) {
    console.error('Error: --input is required\n');
    printHelp();
    process.exit(1);
  }

  try {
    // Load and validate invoice
    console.log(`Loading invoice from: ${args.input}`);
    const inputData = loadInvoiceJson(args.input);

    console.log('Validating and processing invoice...');
    const result = processInvoice(inputData);

    if (!result.ok) {
      console.error('\nValidation failed:');
      for (const issue of result.issues) {
        console.error(`  - [${issue.code}] ${issue.path}: ${issue.message}`);
        if (issue.hint) {
          console.error(`    Hint: ${issue.hint}`);
        }
      }
      process.exit(1);
    }

    const { invoice } = result;

    // Print mode - just show formatted invoice
    if (args.print) {
      printFormattedInvoice(invoice);
      process.exit(0);
    }

    // PDF generation mode
    console.log('Rendering HTML...');
    const html = renderInvoiceHtml(invoice);

    console.log('Generating PDF...');
    const pdfBuffer = await generatePdf(html);

    // Ensure output directory exists
    if (!existsSync(args.out)) {
      mkdirSync(args.out, { recursive: true });
    }

    // Generate filename and save
    const filename = generateOutputFilename(invoice);
    const outputPath = join(args.out, filename);

    writeFileSync(outputPath, pdfBuffer);
    console.log(`\n✓ PDF saved to: ${outputPath}`);
    console.log(`  Invoice: ${invoice.header.invoiceNumber}`);
    console.log(`  Total: ${invoice.totals.total}`);

  } catch (error) {
    console.error('\nError:', (error as Error).message);
    process.exit(1);
  } finally {
    await closeBrowser();
  }
}

// Run
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

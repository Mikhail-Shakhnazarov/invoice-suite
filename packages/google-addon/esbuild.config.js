/**
 * esbuild configuration for Google Apps Script
 *
 * Bundles the add-on into a single file that can be pushed via clasp.
 * Handles the engine dependency and transforms for GAS compatibility.
 */

import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isWatch = process.argv.includes('--watch');

async function bundle() {
  try {
    // Ensure dist directory exists
    const distDir = join(__dirname, 'dist');
    if (!existsSync(distDir)) {
      mkdirSync(distDir, { recursive: true });
    }

    // Bundle main entry point
    await build({
      entryPoints: [join(__dirname, 'src/main.ts')],
      bundle: true,
      outfile: join(__dirname, 'dist/Code.js'),
      format: 'iife',
      globalName: 'InvoiceAddon',
      platform: 'neutral',
      target: 'es2020',
      minify: false, // Keep readable for debugging in Apps Script
      sourcemap: false,
      banner: {
        js: `/**
 * Invoice Suite - Google Workspace Add-on
 * Generated: ${new Date().toISOString()}
 *
 * This file is auto-generated. Do not edit directly.
 * Source: packages/google-addon/src/
 */

`,
      },
      footer: {
        js: `
// Expose global functions for Apps Script
function onOpen(e) { return InvoiceAddon.onOpen(e); }
function onInstall(e) { return InvoiceAddon.onInstall(e); }
function showSidebar() { return InvoiceAddon.showSidebar(); }
function showSettings() { return InvoiceAddon.showSettings(); }
function generateInvoice() { return InvoiceAddon.generateInvoice(); }
function saveSettings(settings) { return InvoiceAddon.saveSettings(settings); }
function loadSettings() { return InvoiceAddon.loadSettings(); }
function getSheetPreview() { return InvoiceAddon.getSheetPreview(); }
`,
      },
    });

    console.log('✓ Built dist/Code.js');

    // Copy appsscript.json to dist
    const manifestSrc = join(__dirname, 'appsscript.json');
    const manifestDest = join(__dirname, 'dist/appsscript.json');
    const manifest = readFileSync(manifestSrc, 'utf-8');
    writeFileSync(manifestDest, manifest);
    console.log('✓ Copied appsscript.json');

    // Copy HTML files to dist
    const htmlFiles = ['sidebar.html'];
    for (const file of htmlFiles) {
      const src = join(__dirname, 'src/ui', file);
      const dest = join(__dirname, 'dist', file);
      if (existsSync(src)) {
        const content = readFileSync(src, 'utf-8');
        writeFileSync(dest, content);
        console.log(`✓ Copied ${file}`);
      }
    }

    console.log('\nBuild complete. Run `clasp push` to deploy.');

  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

bundle();

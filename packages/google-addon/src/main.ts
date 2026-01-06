/**
 * Invoice Suite - Google Workspace Add-on
 *
 * Main entry point for the Sheets add-on.
 * All functions exported here are available as global functions in Apps Script.
 */

import { validateDraft, computeInvoice, formatInvoice } from '@invoice-suite/engine';
import type { Issue } from '@invoice-suite/engine';
import { loadConfig, saveConfig, isConfigComplete } from './config.js';
import { parseSheet, getPreview } from './adapters/sheets/parseSheet.js';
import { pathToCell, getFieldLabel } from './adapters/sheets/cellMap.js';
import { mergeTemplate } from './adapters/docs/mergeTemplate.js';
import { savePdfFromDoc } from './adapters/drive/savePdf.js';
import type { AddonConfig, GenerationResult, SheetPreview } from './types.js';

// ============================================================================
// Menu and UI
// ============================================================================

/**
 * Runs when the spreadsheet is opened.
 * Creates the add-on menu.
 */
export function onOpen(e: GoogleAppsScript.Events.SheetsOnOpen): void {
  const ui = SpreadsheetApp.getUi();

  ui.createAddonMenu()
    .addItem('Generate Invoice', 'showSidebar')
    .addItem('Settings', 'showSettings')
    .addToUi();
}

/**
 * Runs when the add-on is installed.
 */
export function onInstall(e: GoogleAppsScript.Events.AddonOnInstall): void {
  onOpen(e as unknown as GoogleAppsScript.Events.SheetsOnOpen);
}

/**
 * Show the main sidebar.
 */
export function showSidebar(): void {
  const html = HtmlService.createHtmlOutputFromFile('sidebar')
    .setTitle('Invoice Suite')
    .setWidth(300);

  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Show the settings sidebar (same as main, switches to settings tab).
 */
export function showSettings(): void {
  showSidebar();
}

// ============================================================================
// Settings Management
// ============================================================================

/**
 * Load user settings for the sidebar.
 */
export function loadSettings(): AddonConfig {
  return loadConfig();
}

/**
 * Save user settings from the sidebar.
 */
export function saveSettings(settings: AddonConfig): void {
  saveConfig(settings);
}

// ============================================================================
// Sheet Preview
// ============================================================================

/**
 * Get preview data from the current sheet.
 */
export function getSheetPreview(): SheetPreview {
  const preview = getPreview();

  return {
    invoiceNumber: preview.invoiceNumber,
    clientName: preview.clientName,
    lineItemCount: preview.lineItemCount,
    hasErrors: false,
    errors: [],
  };
}

// ============================================================================
// Invoice Generation
// ============================================================================

/**
 * Main invoice generation function.
 * Called from the sidebar.
 */
export function generateInvoice(): GenerationResult {
  try {
    // 1. Check configuration
    const config = loadConfig();
    const configCheck = isConfigComplete(config);

    if (!configCheck.complete) {
      return {
        success: false,
        error: `Missing configuration: ${configCheck.missing.join(', ')}`,
      };
    }

    // 2. Parse sheet data
    const rawData = parseSheet();

    // 3. Validate with engine
    const validation = validateDraft(rawData);

    if (!validation.ok) {
      return {
        success: false,
        error: 'Validation errors found:',
        issues: mapIssuesToCells(validation.issues),
      };
    }

    // 4. Compute totals
    const computed = computeInvoice(validation.draft);

    // 5. Format for display
    const formatted = formatInvoice(computed);

    // 6. Generate document title
    const docTitle = `Invoice_${formatted.header.invoiceNumber}_TEMP`;

    // 7. Merge template
    const mergedDoc = mergeTemplate(
      config.templateDocId,
      formatted,
      docTitle
    );

    // 8. Export PDF and save to Drive
    const result = savePdfFromDoc(mergedDoc.getId(), formatted);

    return {
      success: true,
      pdfUrl: result.url,
      pdfName: result.filename,
    };

  } catch (error) {
    console.error('Invoice generation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Map validation issues to cell references for display.
 */
function mapIssuesToCells(issues: Issue[]): Array<{ cell: string; message: string }> {
  return issues.map(issue => ({
    cell: pathToCell(issue.path) || issue.path,
    message: issue.message,
  }));
}

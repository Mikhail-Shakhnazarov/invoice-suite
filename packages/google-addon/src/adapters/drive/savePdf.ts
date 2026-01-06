/**
 * Drive PDF Export
 *
 * Exports Google Docs to PDF and saves to Drive.
 */

import type { FormattedInvoice } from '@invoice-suite/engine';
import { loadConfig } from '../../config.js';

/**
 * Export a Google Doc to PDF.
 *
 * @param docId - Google Doc ID to export
 * @returns PDF blob
 */
export function exportToPdf(docId: string): GoogleAppsScript.Base.Blob {
  const doc = DriveApp.getFileById(docId);
  const blob = doc.getAs('application/pdf');
  return blob;
}

/**
 * Generate filename from pattern and invoice data.
 *
 * Pattern placeholders:
 * - {{invoiceNumber}} - Invoice number
 * - {{clientName}} - Client name
 * - {{date}} - Current date (YYYY-MM-DD)
 */
export function generateFilename(pattern: string, invoice: FormattedInvoice): string {
  let filename = pattern;

  // Replace placeholders
  filename = filename.replace(/\{\{invoiceNumber\}\}/g, invoice.header.invoiceNumber);
  filename = filename.replace(/\{\{clientName\}\}/g, invoice.client.name);
  filename = filename.replace(/\{\{date\}\}/g, new Date().toISOString().split('T')[0]!);

  // Sanitize filename
  filename = filename.replace(/[<>:"/\\|?*]/g, '_');
  filename = filename.replace(/\s+/g, '_');

  // Ensure .pdf extension
  if (!filename.toLowerCase().endsWith('.pdf')) {
    filename += '.pdf';
  }

  return filename;
}

/**
 * Save PDF to the configured output folder or Drive root.
 *
 * @param pdfBlob - PDF blob to save
 * @param filename - Filename for the PDF
 * @returns The saved file
 */
export function savePdf(
  pdfBlob: GoogleAppsScript.Base.Blob,
  filename: string
): GoogleAppsScript.Drive.File {
  const config = loadConfig();

  // Set the blob name
  pdfBlob.setName(filename);

  let file: GoogleAppsScript.Drive.File;

  if (config.outputFolderId) {
    try {
      const folder = DriveApp.getFolderById(config.outputFolderId);
      file = folder.createFile(pdfBlob);
    } catch (error) {
      // Folder not accessible, fall back to root
      console.warn('Output folder not accessible, saving to Drive root');
      file = DriveApp.createFile(pdfBlob);
    }
  } else {
    // Save to Drive root
    file = DriveApp.createFile(pdfBlob);
  }

  return file;
}

/**
 * Delete a temporary document.
 */
export function deleteDocument(docId: string): void {
  try {
    const file = DriveApp.getFileById(docId);
    file.setTrashed(true);
  } catch (error) {
    console.warn('Failed to delete temporary document:', error);
  }
}

/**
 * Complete PDF generation workflow:
 * 1. Export merged doc to PDF
 * 2. Save PDF to configured folder
 * 3. Delete temporary doc
 * 4. Return PDF file URL
 *
 * @param mergedDocId - ID of the merged document
 * @param invoice - Formatted invoice data
 * @returns Object with PDF URL and filename
 */
export function savePdfFromDoc(
  mergedDocId: string,
  invoice: FormattedInvoice
): { url: string; filename: string } {
  const config = loadConfig();

  // Generate filename
  const filename = generateFilename(config.fileNamePattern, invoice);

  // Export to PDF
  const pdfBlob = exportToPdf(mergedDocId);

  // Save PDF
  const pdfFile = savePdf(pdfBlob, filename);

  // Delete temporary doc
  deleteDocument(mergedDocId);

  return {
    url: pdfFile.getUrl(),
    filename: pdfFile.getName(),
  };
}

/**
 * Validate that a folder ID is accessible.
 */
export function validateFolderId(folderId: string): {
  valid: boolean;
  error?: string;
  name?: string;
} {
  if (!folderId) {
    return { valid: true }; // Empty is valid (uses root)
  }

  try {
    const folder = DriveApp.getFolderById(folderId);
    return {
      valid: true,
      name: folder.getName(),
    };
  } catch (error) {
    return {
      valid: false,
      error: 'Folder not found or not accessible',
    };
  }
}

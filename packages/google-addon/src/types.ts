/**
 * Google Add-on Types
 *
 * Types specific to the Google Workspace add-on.
 */

import type { Business } from '@invoice-suite/engine';

/**
 * Add-on configuration stored in UserProperties.
 */
export interface AddonConfig {
  /** Business details for invoice header */
  business: Business;

  /** Google Doc ID for invoice template */
  templateDocId: string;

  /** Google Drive folder ID for output (optional, uses root if not set) */
  outputFolderId?: string;

  /** Filename pattern for generated PDFs */
  fileNamePattern: string;

  /** Default values for new invoices */
  defaults: {
    currency: string;
    taxRate?: number;
    paymentTerms?: string;
  };
}

/**
 * Default configuration for new users.
 */
export const DEFAULT_CONFIG: AddonConfig = {
  business: {
    name: '',
    address: '',
    email: '',
  },
  templateDocId: '',
  fileNamePattern: 'Invoice_{{invoiceNumber}}_{{clientName}}',
  defaults: {
    currency: 'EUR',
    taxRate: 0.19,
  },
};

/**
 * Sheet cell mapping for invoice data.
 */
export interface CellMap {
  /** Maps engine paths to sheet cells */
  [path: string]: string;
}

/**
 * Result of invoice generation.
 */
export interface GenerationResult {
  success: boolean;
  pdfUrl?: string;
  pdfName?: string;
  error?: string;
  issues?: Array<{
    cell: string;
    message: string;
  }>;
}

/**
 * Preview data for the sidebar.
 */
export interface SheetPreview {
  invoiceNumber: string;
  clientName: string;
  lineItemCount: number;
  hasErrors: boolean;
  errors: Array<{
    cell: string;
    message: string;
  }>;
}

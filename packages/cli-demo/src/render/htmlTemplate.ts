/**
 * HTML Template Renderer
 *
 * Renders a FormattedInvoice into HTML using a simple template system.
 * Uses a Handlebars-like syntax but implemented with regex for zero dependencies.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import type { FormattedInvoice } from '@invoice-suite/engine';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Template path relative to compiled output
const TEMPLATE_PATH = join(__dirname, '..', '..', 'templates', 'invoice.html');

/**
 * Load the HTML template from disk.
 */
export function loadTemplate(): string {
  return readFileSync(TEMPLATE_PATH, 'utf-8');
}

/**
 * Simple template engine supporting:
 * - {{value}} - variable substitution
 * - {{#if value}}...{{/if}} - conditional blocks
 * - {{#each array}}...{{/each}} - iteration
 * - Nested paths like {{business.name}}
 */
export function renderTemplate(
  template: string,
  data: FormattedInvoice
): string {
  let result = template;

  // Process {{#each}} blocks first
  result = processEachBlocks(result, data);

  // Process {{#if}} blocks
  result = processIfBlocks(result, data);

  // Process simple {{variable}} substitutions
  result = processVariables(result, data);

  return result;
}

/**
 * Process {{#each array}}...{{/each}} blocks.
 */
function processEachBlocks(template: string, data: FormattedInvoice): string {
  const eachRegex = /\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g;

  return template.replace(eachRegex, (_match, arrayName: string, content: string) => {
    const array = getNestedValue(data, arrayName);

    if (!Array.isArray(array)) {
      return '';
    }

    return array
      .map((item) => {
        // Replace item-level variables within the each block
        return processItemVariables(content, item as Record<string, unknown>);
      })
      .join('');
  });
}

/**
 * Process variables within an {{#each}} item context.
 */
function processItemVariables(
  template: string,
  item: Record<string, unknown>
): string {
  const varRegex = /\{\{(\w+)\}\}/g;

  return template.replace(varRegex, (_match, varName: string) => {
    const value = item[varName];
    return escapeHtml(String(value ?? ''));
  });
}

/**
 * Process {{#if value}}...{{/if}} blocks.
 */
function processIfBlocks(template: string, data: FormattedInvoice): string {
  // Handle nested if blocks by processing from innermost out
  const ifRegex = /\{\{#if\s+([\w.]+)\}\}([\s\S]*?)\{\{\/if\}\}/g;

  let result = template;
  let previousResult = '';

  // Keep processing until no more changes (handles nested blocks)
  while (result !== previousResult) {
    previousResult = result;
    result = result.replace(ifRegex, (_match, path: string, content: string) => {
      const value = getNestedValue(data, path);
      const isTruthy = Boolean(value) && value !== '';
      return isTruthy ? content : '';
    });
  }

  return result;
}

/**
 * Process simple {{variable}} and {{path.to.value}} substitutions.
 */
function processVariables(template: string, data: FormattedInvoice): string {
  const varRegex = /\{\{([\w.]+)\}\}/g;

  return template.replace(varRegex, (_match, path: string) => {
    const value = getNestedValue(data, path);
    return escapeHtml(String(value ?? ''));
  });
}

/**
 * Get a nested value from an object using dot notation.
 * e.g., getNestedValue(obj, 'business.name') -> obj.business.name
 */
function getNestedValue(obj: unknown, path: string): unknown {
  const parts = path.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    if (typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

/**
 * Escape HTML special characters to prevent XSS.
 */
function escapeHtml(text: string): string {
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  return text.replace(/[&<>"']/g, (char) => escapeMap[char] ?? char);
}

/**
 * Render a FormattedInvoice to HTML.
 */
export function renderInvoiceHtml(invoice: FormattedInvoice): string {
  const template = loadTemplate();
  return renderTemplate(template, invoice);
}

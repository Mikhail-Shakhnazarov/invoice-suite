/**
 * Invoice Engine - Formatting
 *
 * Formats computed invoice values for display.
 * Uses Intl APIs for locale-aware currency and date formatting.
 */

import type {
  InvoiceComputed,
  FormattedInvoice,
  FormattedBusiness,
  FormattedClient,
  FormattedHeader,
  FormattedLineItem,
  FormattedTotals,
  FormatOptions,
} from './types.js';

// ============================================================================
// Currency → Locale Mapping
// ============================================================================

/**
 * Maps currency codes to reasonable default locales.
 * This determines number and date formatting conventions.
 */
const CURRENCY_LOCALE_MAP: Record<string, string> = {
  EUR: 'de-DE',
  USD: 'en-US',
  GBP: 'en-GB',
  CHF: 'de-CH',
  CAD: 'en-CA',
  AUD: 'en-AU',
  JPY: 'ja-JP',
  CNY: 'zh-CN',
  INR: 'en-IN',
  BRL: 'pt-BR',
  MXN: 'es-MX',
  KRW: 'ko-KR',
  SEK: 'sv-SE',
  NOK: 'nb-NO',
  DKK: 'da-DK',
  PLN: 'pl-PL',
  CZK: 'cs-CZ',
  HUF: 'hu-HU',
  RON: 'ro-RO',
  BGN: 'bg-BG',
  RUB: 'ru-RU',
  TRY: 'tr-TR',
  ZAR: 'en-ZA',
  NZD: 'en-NZ',
  SGD: 'en-SG',
  HKD: 'zh-HK',
  THB: 'th-TH',
  MYR: 'ms-MY',
  PHP: 'en-PH',
};

const DEFAULT_LOCALE = 'en-US';

/**
 * Get locale for a currency code.
 */
function getLocaleForCurrency(currency: string): string {
  return CURRENCY_LOCALE_MAP[currency.toUpperCase()] ?? DEFAULT_LOCALE;
}

// ============================================================================
// Formatters
// ============================================================================

/**
 * Create a currency formatter for the given currency and locale.
 */
function createCurrencyFormatter(
  currency: string,
  locale: string,
  display: 'symbol' | 'code' | 'name' = 'symbol'
): Intl.NumberFormat {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: display,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Create a number formatter for quantities.
 */
function createNumberFormatter(locale: string): Intl.NumberFormat {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

/**
 * Create a date formatter.
 */
function createDateFormatter(
  locale: string,
  style: 'short' | 'medium' | 'long' = 'medium'
): Intl.DateTimeFormat {
  let options: Intl.DateTimeFormatOptions;

  switch (style) {
    case 'short':
      options = { year: 'numeric', month: 'numeric', day: 'numeric' };
      break;
    case 'long':
      options = { year: 'numeric', month: 'long', day: 'numeric' };
      break;
    default:
      options = { year: 'numeric', month: 'short', day: 'numeric' };
      break;
  }

  return new Intl.DateTimeFormat(locale, options);
}

/**
 * Parse ISO date string to Date object.
 */
function parseIsoDate(isoDate: string): Date {
  // Parse as UTC to avoid timezone issues
  return new Date(isoDate + 'T00:00:00Z');
}

/**
 * Format an ISO date string using the given formatter.
 */
function formatDate(isoDate: string, formatter: Intl.DateTimeFormat): string {
  const date = parseIsoDate(isoDate);
  return formatter.format(date);
}

// ============================================================================
// Section Formatters
// ============================================================================

function formatBusiness(
  business: InvoiceComputed['business']
): FormattedBusiness {
  return {
    name: business.name,
    address: business.address,
    email: business.email,
    phone: business.phone ?? '',
    logoUrl: business.logoUrl ?? '',
    taxId: business.taxId ?? '',
  };
}

function formatClient(client: InvoiceComputed['client']): FormattedClient {
  return {
    name: client.name,
    address: client.address,
    email: client.email ?? '',
  };
}

function formatHeader(
  header: InvoiceComputed['header'],
  dateFormatter: Intl.DateTimeFormat
): FormattedHeader {
  const taxRateDisplay =
    header.taxRate !== undefined
      ? (header.taxRate * 100).toFixed(0)
      : '';

  return {
    invoiceNumber: header.invoiceNumber,
    issueDate: formatDate(header.issueDate, dateFormatter),
    dueDate: header.dueDate ? formatDate(header.dueDate, dateFormatter) : '',
    currency: header.currency,
    taxRateDisplay,
    notes: header.notes ?? '',
  };
}

function formatLineItems(
  lineItems: InvoiceComputed['lineItems'],
  amounts: number[],
  currencyFormatter: Intl.NumberFormat,
  numberFormatter: Intl.NumberFormat
): FormattedLineItem[] {
  return lineItems.map((item, index) => ({
    description: item.description,
    quantity: numberFormatter.format(item.quantity),
    unitPrice: currencyFormatter.format(item.unitPrice),
    amount: currencyFormatter.format(amounts[index] ?? 0),
    unit: item.unit ?? '',
  }));
}

function formatTotals(
  computed: InvoiceComputed['computed'],
  currencyFormatter: Intl.NumberFormat
): FormattedTotals {
  return {
    subtotal: currencyFormatter.format(computed.subtotal),
    taxAmount: currencyFormatter.format(computed.taxAmount),
    total: currencyFormatter.format(computed.total),
  };
}

// ============================================================================
// Main Formatting Entry Point
// ============================================================================

/**
 * Format a computed invoice for rendering.
 *
 * @param invoice - Invoice with computed totals
 * @param options - Formatting options (locale override, date style, etc.)
 * @returns Fully formatted invoice with all values as strings
 */
export function formatInvoice(
  invoice: InvoiceComputed,
  options: FormatOptions = {}
): FormattedInvoice {
  const currency = invoice.header.currency;
  const locale = options.locale ?? getLocaleForCurrency(currency);
  const dateStyle = options.dateFormat ?? 'medium';
  const currencyDisplay = options.currencyDisplay ?? 'symbol';

  const currencyFormatter = createCurrencyFormatter(
    currency,
    locale,
    currencyDisplay
  );
  const numberFormatter = createNumberFormatter(locale);
  const dateFormatter = createDateFormatter(locale, dateStyle);

  return {
    business: formatBusiness(invoice.business),
    client: formatClient(invoice.client),
    header: formatHeader(invoice.header, dateFormatter),
    lineItems: formatLineItems(
      invoice.lineItems,
      invoice.computed.lineItemAmounts,
      currencyFormatter,
      numberFormatter
    ),
    totals: formatTotals(invoice.computed, currencyFormatter),
  };
}

// ============================================================================
// Utility Exports
// ============================================================================

/**
 * Format a single currency value.
 * Useful for standalone formatting needs.
 */
export function formatCurrency(
  amount: number,
  currency: string,
  locale?: string
): string {
  const resolvedLocale = locale ?? getLocaleForCurrency(currency);
  const formatter = createCurrencyFormatter(currency, resolvedLocale);
  return formatter.format(amount);
}

/**
 * Format a date from ISO string.
 * Useful for standalone formatting needs.
 */
export function formatIsoDate(
  isoDate: string,
  locale: string = DEFAULT_LOCALE,
  style: 'short' | 'medium' | 'long' = 'medium'
): string {
  const formatter = createDateFormatter(locale, style);
  return formatDate(isoDate, formatter);
}

/**
 * Get the locale that would be used for a given currency.
 */
export function getLocale(currency: string): string {
  return getLocaleForCurrency(currency);
}

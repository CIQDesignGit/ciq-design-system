/**
 * Centralized formatting utilities for table cells and alerts.
 * Locale/currency come from options or an injectable adapter — never `window.__globalConfig`.
 */

export type FormatType =
  | "currency"
  | "percent"
  | "percentage"
  | "numeric" // compact notation (K, M)
  | "number" // full number with locale separators
  | "decimal"
  | "string";

export interface FormatOptions {
  format?: FormatType;
  precision?: number;
  locale?: string;
  currency?: string;
  compact?: boolean;
  maxPrecision?: number;
}

/** Host apps inject locale/currency instead of reading `__globalConfig`. */
export type FormatLocaleAdapter = {
  getLocaleConfig?: () => { locale?: string; currencyString?: string } | undefined;
};

const DEFAULT_LOCALE = "en-US";
const DEFAULT_CURRENCY = "USD";
const DEFAULT_PRECISION = 2;
const MAX_PRECISION_FOR_SMALL_VALUES = 4;

let localeAdapter: FormatLocaleAdapter | null = null;

/** Call once from the host app to supply locale/currency defaults. */
export function setFormatLocaleAdapter(adapter: FormatLocaleAdapter | null): void {
  localeAdapter = adapter;
}

/** Locale/currency from adapter; falls back to en-US / USD. */
export function getLocaleFormatDefaults(): { locale: string; currency: string } {
  const config = localeAdapter?.getLocaleConfig?.();
  return {
    locale: config?.locale ?? DEFAULT_LOCALE,
    currency: config?.currencyString ?? DEFAULT_CURRENCY,
  };
}

/**
 * Adjust precision for very small values to show meaningful digits
 * e.g., 0.00013 should show more decimal places than 0.13
 */
function adjustPrecisionForSmallValues(
  value: number,
  basePrecision: number,
  maxPrecision: number
): number {
  if (value > 0 && value < 1) {
    const afterDecimalZeroCount = -Math.floor(Math.log10(value) + 1);
    if (afterDecimalZeroCount > 1 && afterDecimalZeroCount < maxPrecision) {
      return Math.max(afterDecimalZeroCount + 2, basePrecision);
    }
  }
  return basePrecision;
}

/**
 * Format a number as currency. Locale and ISO currency code default from
 * `setFormatLocaleAdapter` when omitted.
 */
export function formatCurrency(value: number, options: Partial<FormatOptions> = {}): string {
  const localeDefaults = getLocaleFormatDefaults();
  const {
    locale = localeDefaults.locale,
    currency = localeDefaults.currency,
    precision = DEFAULT_PRECISION,
    compact = true,
  } = options;

  const formatOptions: Intl.NumberFormatOptions = {
    style: "currency",
    currency,
    minimumFractionDigits: compact ? 0 : 2,
    maximumFractionDigits: precision,
  };

  if (compact) {
    formatOptions.notation = "compact";
    formatOptions.compactDisplay = "short";
  }
  return new Intl.NumberFormat(locale, formatOptions).format(value);
}

/**
 * Format a number as percentage.
 * Input is assumed to be in percentage form (e.g., 45.5 means 45.5%).
 */
export function formatPercent(value: number, options: Partial<FormatOptions> = {}): string {
  const {
    locale = DEFAULT_LOCALE,
    precision = DEFAULT_PRECISION,
    maxPrecision = MAX_PRECISION_FOR_SMALL_VALUES,
  } = options;

  const adjustedPrecision = adjustPrecisionForSmallValues(Math.abs(value), precision, maxPrecision);

  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: adjustedPrecision,
  }).format(value / 100);
}

/**
 * Format a number with compact notation (K, M, B)
 */
export function formatCompactNumber(value: number, options: Partial<FormatOptions> = {}): string {
  const {
    locale = DEFAULT_LOCALE,
    precision = DEFAULT_PRECISION,
    maxPrecision = MAX_PRECISION_FOR_SMALL_VALUES,
  } = options;

  const adjustedPrecision = adjustPrecisionForSmallValues(Math.abs(value), precision, maxPrecision);

  return new Intl.NumberFormat(locale, {
    notation: "compact",
    compactDisplay: "short",
    minimumFractionDigits: 0,
    maximumFractionDigits: adjustedPrecision,
  }).format(value);
}

/**
 * Format a number with locale separators (no compact notation)
 */
export function formatNumber(value: number, options: Partial<FormatOptions> = {}): string {
  const { locale = DEFAULT_LOCALE, precision = DEFAULT_PRECISION } = options;

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: precision,
  }).format(value);
}

/**
 * Format a decimal number with fixed precision
 */
export function formatDecimal(value: number, options: Partial<FormatOptions> = {}): string {
  const { locale = DEFAULT_LOCALE, precision = DEFAULT_PRECISION } = options;

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: Number.isInteger(value) ? 0 : precision,
    maximumFractionDigits: precision,
  }).format(value);
}

/**
 * Main formatting function - dispatches to appropriate formatter based on format type
 */
export function formatValue(value: number, options: FormatOptions = {}): string {
  const { format = "numeric", compact = true } = options;

  switch (format?.toLowerCase()) {
    case "currency":
      return formatCurrency(value, options);

    case "percent":
    case "percentage":
      return formatPercent(value, options);

    case "numeric":
      return compact ? formatCompactNumber(value, options) : formatNumber(value, options);

    case "number":
      return formatNumber(value, options);

    case "decimal":
      return formatDecimal(value, options);

    case "string":
      return String(value);

    default:
      return compact ? formatCompactNumber(value, options) : formatNumber(value, options);
  }
}

/**
 * Parse a value to a number, handling various input types
 */
export function parseNumericValue(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "number") {
    return isNaN(value) ? null : value;
  }

  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  }

  return null;
}

/**
 * Check if a format type represents a numeric value
 */
export function isNumericFormat(format?: string): boolean {
  if (!format) return false;
  const numericFormats = ["currency", "percent", "percentage", "numeric", "number", "decimal"];
  return numericFormats.includes(format.toLowerCase());
}

/**
 * Check if a cell type should be right-aligned (numeric types)
 */
export function isRightAligned(type?: string): boolean {
  if (!type) return false;
  const rightAlignedTypes = [
    "number",
    "numeric",
    "currency",
    "currency_plan",
    "currency_forecast",
    "currency_highlight",
    "number_highlight",
  ];
  return rightAlignedTypes.includes(type.toLowerCase());
}

const CURRENCY_TYPES = new Set([
  "currency",
  "currency_plan",
  "currency_forecast",
  "currency_highlight",
]);

const NUMBER_TYPES = new Set(["number", "number_highlight", "numeric"]);

/**
 * Top-level generic cell value formatter
 *
 * @example
 * formatCellValue(1234567, "currency") // "$1.23M"
 * formatCellValue(0.456, "number", "percentage") // "45.6%"
 * formatCellValue(null, "currency") // "—"
 */
export function formatCellValue(value: unknown, type?: string, format?: string): string {
  if (value === null || value === undefined) {
    return "—";
  }

  if (type === "string" || type === "sku") {
    return String(value);
  }

  const numValue = parseNumericValue(value);

  if (numValue === null) {
    return String(value);
  }

  if (format === "percentage") {
    return formatPercent(numValue);
  }

  if (type && CURRENCY_TYPES.has(type.toLowerCase())) {
    return formatCurrency(numValue);
  }

  if (type && NUMBER_TYPES.has(type.toLowerCase())) {
    return formatCompactNumber(numValue);
  }

  return formatCompactNumber(numValue);
}

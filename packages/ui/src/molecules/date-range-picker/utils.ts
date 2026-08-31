import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";

import type { ComparePreset, DateRange, DateRangeInput, DateRangePreset } from "./types";

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

/** ISO date format for API communication */
export const ISO_DATE_FORMAT = "YYYY-MM-DD";

/** Get preset key identifier (falls back to label for backwards compat) */
export const getPresetKey = (preset: DateRangePreset | ComparePreset): string =>
  preset.key ?? preset.label;

const isCustomPreset = (preset: DateRangePreset | ComparePreset): boolean => {
  const key = getPresetKey(preset);
  return key === "custom" || preset.label === "Custom";
};

export const formatDate = (date: Date | null, format: string = "MMM DD, YYYY"): string => {
  if (!date) return "";
  return dayjs(date).format(format);
};

/** Convert Date to YYYY-MM-DD string */
export const dateToString = (date: Date | null): string | null => {
  if (!date) return null;
  return dayjs(date).format(ISO_DATE_FORMAT);
};

/** Normalize a date input (Date object or ISO string) to Date object */
export const normalizeDate = (date: Date | string | null): Date | null => {
  if (!date) return null;
  if (date instanceof Date) return date;
  const parsed = dayjs(date, ISO_DATE_FORMAT, true);
  if (parsed.isValid()) return parsed.toDate();
  const fallback = dayjs(date);
  return fallback.isValid() ? fallback.toDate() : null;
};

/** Normalize DateRangeInput to DateRange (converts strings to Date objects) */
export const normalizeDateRange = (range: DateRangeInput | undefined): DateRange => {
  if (!range) return { from: null, to: null };
  return {
    from: normalizeDate(range.from),
    to: normalizeDate(range.to),
  };
};

/** Convert DateRange to DateRangeInput with ISO strings */
export const dateRangeToISOStrings = (range: DateRange): DateRangeInput => ({
  from: dateToString(range.from),
  to: dateToString(range.to),
});

/** Check if two date ranges are equal (same dates) */
export const areDateRangesEqual = (range1: DateRange, range2: DateRange): boolean => {
  if (!range1.from || !range1.to || !range2.from || !range2.to) return false;
  return dayjs(range1.from).isSame(range2.from, "day") && dayjs(range1.to).isSame(range2.to, "day");
};

/** Detect which preset matches the given date range */
export const detectPresetFromRange = (
  range: DateRange,
  presets: DateRangePreset[],
  maxDate?: Date
): string | null => {
  if (!range.from || !range.to) return null;

  for (const preset of presets) {
    if (isCustomPreset(preset)) continue;

    const key = getPresetKey(preset);
    const presetRange = preset.getValue(maxDate);
    if (areDateRangesEqual(range, presetRange)) {
      return key;
    }
  }
  return null;
};

/** Detect which compare preset matches the given compare range */
export const detectComparePresetFromRange = (
  compareRange: DateRange,
  primaryRange: DateRange,
  comparePresets: ComparePreset[]
): string | null => {
  if (!compareRange.from || !compareRange.to || !primaryRange.from || !primaryRange.to) {
    return null;
  }

  for (const preset of comparePresets) {
    if (isCustomPreset(preset)) continue;

    const key = getPresetKey(preset);
    const presetRange = preset.getValue(primaryRange);
    if (areDateRangesEqual(compareRange, presetRange)) {
      return key;
    }
  }
  return null;
};

export const formatDateRange = (range: DateRange, format: string = "MMM D, YYYY"): string => {
  if (!range.from) return "Select date range";
  if (!range.to) return formatDate(range.from, format);
  return `${formatDate(range.from, format)} - ${formatDate(range.to, format)}`;
};

export const isDateInRange = (date: dayjs.Dayjs, from: Date | null, to: Date | null): boolean => {
  if (!from || !to) return false;
  const f = dayjs(from).startOf("day");
  const t = dayjs(to).startOf("day");
  return date.isBetween(f, t, "day", "[]");
};

export const isSameDay = (date: dayjs.Dayjs, compare: Date | null): boolean => {
  if (!compare) return false;
  return date.isSame(dayjs(compare), "day");
};

/**
 * Parse date from various input formats.
 * Supports the display format, ISO format, and common variations.
 */
export const parseDate = (inputValue: string, dateFormat: string): dayjs.Dayjs => {
  if (!inputValue || !inputValue.trim()) {
    return dayjs(null);
  }

  const trimmed = inputValue.trim();

  const strictFormats = [dateFormat, ISO_DATE_FORMAT];
  for (const fmt of strictFormats) {
    const parsed = dayjs(trimmed, fmt, true);
    if (parsed.isValid()) return parsed;
  }

  const commonFormats = [
    "MMM DD, YYYY",
    "MMM D, YYYY",
    "MMMM DD, YYYY",
    "MMMM D, YYYY",
    "MM/DD/YYYY",
    "M/D/YYYY",
    "DD/MM/YYYY",
    "D/M/YYYY",
    "YYYY-MM-DD",
    "YYYY/MM/DD",
    "DD-MM-YYYY",
    "D-M-YYYY",
    "MMM DD YYYY",
    "MMM D YYYY",
    "DD MMM YYYY",
    "D MMM YYYY",
  ];

  for (const fmt of commonFormats) {
    const parsed = dayjs(trimmed, fmt, true);
    if (parsed.isValid()) return parsed;
  }

  const fallback = dayjs(trimmed);
  if (fallback.isValid() && fallback.year() > 1900 && fallback.year() < 2100) {
    return fallback;
  }

  return dayjs(null);
};

export const emptyDateRange = (): DateRange => ({
  from: null,
  to: null,
});

export const isRangeComplete = (range: DateRange): boolean => {
  return range.from !== null && range.to !== null;
};

/** Check if a date is outside min/max bounds */
export const isDateOutOfBounds = (
  date: Date | null,
  minDate: Date | null,
  maxDate: Date | null
): boolean => {
  if (!date) return false;
  const d = dayjs(date);
  if (minDate && d.isBefore(dayjs(minDate), "day")) return true;
  if (maxDate && d.isAfter(dayjs(maxDate), "day")) return true;
  return false;
};

/** Check if a date range has any date out of bounds */
export const isRangeOutOfBounds = (
  range: DateRange,
  minDate: Date | null,
  maxDate: Date | null
): boolean => {
  return (
    isDateOutOfBounds(range.from, minDate, maxDate) || isDateOutOfBounds(range.to, minDate, maxDate)
  );
};

/** Get validation error message for out-of-bounds dates */
export const getDateBoundsError = (
  range: DateRange,
  minDate: Date | null,
  maxDate: Date | null,
  dateFormat: string
): string | null => {
  if (!range.from && !range.to) return null;

  const errors: string[] = [];

  if (range.from && minDate && dayjs(range.from).isBefore(dayjs(minDate), "day")) {
    errors.push(`Start date is before minimum (${formatDate(minDate, dateFormat)})`);
  }
  if (range.from && maxDate && dayjs(range.from).isAfter(dayjs(maxDate), "day")) {
    errors.push(`Start date is after maximum (${formatDate(maxDate, dateFormat)})`);
  }
  if (range.to && minDate && dayjs(range.to).isBefore(dayjs(minDate), "day")) {
    errors.push(`End date is before minimum (${formatDate(minDate, dateFormat)})`);
  }
  if (range.to && maxDate && dayjs(range.to).isAfter(dayjs(maxDate), "day")) {
    errors.push(`End date is after maximum (${formatDate(maxDate, dateFormat)})`);
  }

  return errors.length > 0 ? errors.join(". ") : null;
};

/** Compare two DateRange objects for equality */
export const areDateRangesEqualNullable = (
  range1: DateRange | undefined,
  range2: DateRange | undefined
): boolean => {
  if (!range1 && !range2) return true;
  if (!range1 || !range2) return false;

  const from1 = range1.from ? dayjs(range1.from).startOf("day").valueOf() : null;
  const to1 = range1.to ? dayjs(range1.to).startOf("day").valueOf() : null;
  const from2 = range2.from ? dayjs(range2.from).startOf("day").valueOf() : null;
  const to2 = range2.to ? dayjs(range2.to).startOf("day").valueOf() : null;

  return from1 === from2 && to1 === to2;
};

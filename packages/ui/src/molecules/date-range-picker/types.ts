/** Internal DateRange with Date objects */
import type { ReactNode } from "react";

export type DateRange = {
  from: Date | null;
  to: Date | null;
};

/** Date range that accepts both Date objects and ISO strings (YYYY-MM-DD) */
export type DateRangeInput = {
  from: Date | string | null;
  to: Date | string | null;
};

export type DateRangePreset = {
  /** Unique key identifier matching ciq-mvc-api-bundler keys (e.g., 'last7Days', 'lastWeek') */
  key?: string;
  /** Display label for the preset */
  label: string;
  /** Category for grouping presets (e.g., 'Days', 'Weeks', 'Month', 'Quarter', 'Year') */
  category?: string;
  /** Function to calculate the date range, optionally based on maxDate */
  getValue: (maxDate?: Date) => DateRange;
};

export type ComparePreset = {
  /** Unique key identifier matching ciq-mvc-api-bundler keys (e.g., 'previousPeriod', 'samePeriodLastYear') */
  key?: string;
  /** Display label for the preset */
  label: string;
  /** Function to calculate the compare range based on primary range */
  getValue: (primaryRange: DateRange) => DateRange;
};

/** Value that accepts both Date objects and ISO strings (YYYY-MM-DD) */
export interface DateRangePickerValue {
  range: DateRangeInput;
  compareRange?: DateRangeInput;
  /** Selected cadence key (e.g., "last7Days", "lastWeek", "custom") */
  cadence?: string;
  /** Selected compare cadence key (e.g., "previousPeriod", "samePeriodLastYear", "custom") */
  compareCadence?: string;
}

export interface DateRangePickerProps {
  /** Current value */
  value?: DateRangePickerValue;
  /** Callback when value changes */
  onChange?: (value: DateRangePickerValue) => void;
  /** Available presets for date range */
  presets?: DateRangePreset[];
  /** Available presets for compare range */
  comparePresets?: ComparePreset[];
  allowedCadences?: string[];
  allowedCompareCadences?: string[];
  /** Whether to show compare feature */
  showCompare?: boolean;
  /** Hide the entire right canned section panel in popover */
  hidecannedsection?: boolean;
  /** Number of months to display in calendar */
  numberOfMonths?: number;
  /** Disable the entire picker */
  disabled?: boolean;
  /** Minimum selectable date (accepts Date object or ISO string YYYY-MM-DD) */
  minDate?: Date | string;
  /** Maximum selectable date (accepts Date object or ISO string YYYY-MM-DD) */
  maxDate?: Date | string;
  /** Default preset to apply on mount (e.g., "Last week") - ignored if defaultValue is provided */
  defaultPreset?: string;
  /**  compare preset to apply on mount (e.g., "Previous period") - ignored if defaultValue is provided */
  defaultComparePreset?: string;
  /** Default value with custom date ranges - takes precedence over defaultPreset */
  defaultValue?: DateRangePickerValue;
  /** Custom trigger content */
  trigger?: ReactNode;
  /** Placeholder text when no date is selected */
  placeholder?: string;
  /** Custom class name for trigger */
  className?: string;
  /** Align popover */
  align?: "start" | "center" | "end";
  /** Format for displaying dates */
  dateFormat?: string;
  /** Weekday labels */
  weekDays?: string[];
  /** Hide the min/max date info text in the footer */
  hideInfoText?: boolean;
  /** Show week numbers column alongside the calendar */
  showWeekNumbers?: boolean;
  /** Optional portal container for Select/Tooltip overlays */
  container?: HTMLElement | null;
}

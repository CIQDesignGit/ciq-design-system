/**
 * Date Range Picker Presets
 * Aligned with ciq-mvc-api-bundler date range configurations
 */
import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";

import type { ComparePreset, DateRange, DateRangePreset } from "./types";

dayjs.extend(quarterOfYear);

/**
 * Get the effective base date for presets.
 * Uses maxDate if provided, otherwise falls back to today (local time).
 */
const getBaseDate = (maxDate?: Date): dayjs.Dayjs => {
  return maxDate ? dayjs(maxDate).startOf("day") : dayjs().startOf("day");
};

/**
 * Default date range presets matching ciq-mvc-api-bundler's additionalRangesConfigs
 * Keys match the keys used in formulateRanges for consistency
 */
export const defaultDateRangePresets: DateRangePreset[] = [
  {
    key: "last7Days",
    label: "Last 7 days",
    category: "Days",
    getValue: (maxDate?: Date) => {
      const base = getBaseDate(maxDate);
      return {
        from: base.subtract(6, "day").startOf("day").toDate(),
        to: base.startOf("day").toDate(),
      };
    },
  },
  {
    key: "last30Days",
    label: "Last 30 days",
    category: "Days",
    getValue: (maxDate?: Date) => {
      const base = getBaseDate(maxDate);
      return {
        from: base.subtract(29, "day").startOf("day").toDate(),
        to: base.startOf("day").toDate(),
      };
    },
  },
  {
    key: "last60Days",
    label: "Last 60 days",
    category: "Days",
    getValue: (maxDate?: Date) => {
      const base = getBaseDate(maxDate);
      return {
        from: base.subtract(59, "day").startOf("day").toDate(),
        to: base.startOf("day").toDate(),
      };
    },
  },
  {
    key: "last90Days",
    label: "Last 90 days",
    category: "Days",
    getValue: (maxDate?: Date) => {
      const base = getBaseDate(maxDate);
      return {
        from: base.subtract(89, "day").startOf("day").toDate(),
        to: base.startOf("day").toDate(),
      };
    },
  },
  {
    key: "lastWeek",
    label: "Last Week",
    category: "Weeks",
    getValue: (maxDate?: Date) => {
      const base = getBaseDate(maxDate);
      return {
        from: base.add(1, "day").subtract(1, "week").startOf("week").startOf("day").toDate(),
        to: base.add(1, "day").subtract(1, "week").endOf("week").startOf("day").toDate(),
      };
    },
  },
  {
    key: "last4Week",
    label: "Last 4 Weeks",
    category: "Weeks",
    getValue: (maxDate?: Date) => {
      const base = getBaseDate(maxDate);
      return {
        from: base.add(1, "day").subtract(4, "week").startOf("week").startOf("day").toDate(),
        to: base.add(1, "day").subtract(1, "week").endOf("week").startOf("day").toDate(),
      };
    },
  },
  {
    key: "last13Week",
    label: "Last 13 Weeks",
    category: "Weeks",
    getValue: (maxDate?: Date) => {
      const base = getBaseDate(maxDate);
      return {
        from: base.add(1, "day").subtract(13, "week").startOf("week").startOf("day").toDate(),
        to: base.add(1, "day").subtract(1, "week").endOf("week").startOf("day").toDate(),
      };
    },
  },
  {
    key: "last26Week",
    label: "Last 26 Weeks",
    category: "Weeks",
    getValue: (maxDate?: Date) => {
      const base = getBaseDate(maxDate);
      return {
        from: base.add(1, "day").subtract(26, "week").startOf("week").startOf("day").toDate(),
        to: base.add(1, "day").subtract(1, "week").endOf("week").startOf("day").toDate(),
      };
    },
  },
  {
    key: "last52Week",
    label: "Last 52 Weeks",
    category: "Weeks",
    getValue: (maxDate?: Date) => {
      const base = getBaseDate(maxDate);
      return {
        from: base.add(1, "day").subtract(52, "week").startOf("week").startOf("day").toDate(),
        to: base.add(1, "day").subtract(1, "week").endOf("week").startOf("day").toDate(),
      };
    },
  },
  {
    key: "mtd",
    label: "Month to Date",
    category: "Month",
    getValue: (maxDate?: Date) => {
      const base = getBaseDate(maxDate);
      return {
        from: base.startOf("month").toDate(),
        to: base.startOf("day").toDate(),
      };
    },
  },
  {
    key: "lastMonth",
    label: "Last Month",
    category: "Month",
    getValue: (maxDate?: Date) => {
      const base = getBaseDate(maxDate);
      return {
        from: base.subtract(1, "month").startOf("month").toDate(),
        to: base.subtract(1, "month").endOf("month").toDate(),
      };
    },
  },
  {
    key: "currentMonth",
    label: "Current Month",
    category: "Month",
    getValue: (maxDate?: Date) => {
      const base = getBaseDate(maxDate);
      return {
        from: base.startOf("month").toDate(),
        to: base.endOf("month").toDate(),
      };
    },
  },
  {
    key: "qtd",
    label: "Quarter to Date",
    category: "Quarter",
    getValue: (maxDate?: Date) => {
      const base = getBaseDate(maxDate);
      return {
        from: base.startOf("quarter").startOf("day").toDate(),
        to: base.startOf("day").toDate(),
      };
    },
  },
  {
    key: "lastQuarter",
    label: "Last Quarter",
    category: "Quarter",
    getValue: (maxDate?: Date) => {
      const base = getBaseDate(maxDate);
      return {
        from: base.subtract(1, "quarter").startOf("quarter").toDate(),
        to: base.subtract(1, "quarter").endOf("quarter").toDate(),
      };
    },
  },
  {
    key: "currentQuarter",
    label: "Current Quarter",
    category: "Quarter",
    getValue: (maxDate?: Date) => {
      const base = getBaseDate(maxDate);
      return {
        from: base.startOf("quarter").toDate(),
        to: base.endOf("quarter").toDate(),
      };
    },
  },
  {
    key: "ytd",
    label: "Year to Date",
    category: "Year",
    getValue: (maxDate?: Date) => {
      const base = getBaseDate(maxDate);
      return {
        from: base.startOf("year").toDate(),
        to: base.startOf("day").toDate(),
      };
    },
  },
  {
    key: "lastYear",
    label: "Last Year",
    category: "Year",
    getValue: (maxDate?: Date) => {
      const base = getBaseDate(maxDate);
      return {
        from: base.subtract(1, "year").startOf("year").startOf("day").toDate(),
        to: base.subtract(1, "year").endOf("year").toDate(),
      };
    },
  },
  {
    key: "currentYear",
    label: "Current Year",
    category: "Year",
    getValue: (maxDate?: Date) => {
      const base = getBaseDate(maxDate);
      return {
        from: base.startOf("year").toDate(),
        to: base.endOf("year").toDate(),
      };
    },
  },
  {
    key: "custom",
    label: "Custom",
    getValue: () => ({ from: null, to: null }),
  },
];

/**
 * Compare presets matching ciq-mvc-api-bundler's compareCannedCalendars
 */
export const defaultComparePresets: ComparePreset[] = [
  {
    key: "previousPeriod",
    label: "Previous Period",
    getValue: (primaryRange: DateRange) => {
      if (!primaryRange.from || !primaryRange.to) return { from: null, to: null };
      const duration = dayjs(primaryRange.to).diff(dayjs(primaryRange.from), "days") + 1;
      return {
        from: dayjs(primaryRange.from).subtract(duration, "days").toDate(),
        to: dayjs(primaryRange.from).subtract(1, "day").toDate(),
      };
    },
  },
  {
    key: "samePeriodLastYear",
    label: "Same Period last year",
    getValue: (primaryRange: DateRange) => {
      if (!primaryRange.from || !primaryRange.to) return { from: null, to: null };
      return {
        from: dayjs(primaryRange.from).subtract(1, "year").startOf("day").toDate(),
        to: dayjs(primaryRange.to).subtract(1, "year").startOf("day").toDate(),
      };
    },
  },
  {
    key: "custom",
    label: "Custom",
    getValue: () => ({ from: null, to: null }),
  },
];

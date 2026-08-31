/**
 * Library-local host data types (vendored from neo-canvas `@/types/data`).
 * No agents / __globalConfig coupling.
 */

export type FilterOperator = "in_list" | "equals" | "gte" | "lte" | "gt" | "lt" | "eq" | "any";

export type FilterMetadata = {
  name: string;
  label: string;
  value: string[];
  op: FilterOperator;
};

export const FILTER_COMBINATION_OPERATORS = ["any", "and", "not"] as const;
export type FilterCombinationOperator = (typeof FILTER_COMBINATION_OPERATORS)[number];

export const CADENCE = {
  LAST_7_DAYS: "last7Days",
  LAST_WEEK: "lastWeek",
  LAST_4_WEEK: "last4Week",
  LAST_MONTH: "lastMonth",
  CURRENT_MONTH: "currentMonth",
  MTD: "mtd",
  LAST_QUARTER: "lastQuarter",
  QTD: "qtd",
  YTD: "ytd",
  LAST_YEAR: "lastYear",
  CURRENT_YEAR: "currentYear",
  CUSTOM: "custom",
} as const;

export type Cadence = (typeof CADENCE)[keyof typeof CADENCE];

export const COMPARE_CADENCE = {
  PREVIOUS_PERIOD: "previousPeriod",
  SAME_PERIOD_LAST_YEAR: "samePeriodLastYear",
  CUSTOM: "custom",
} as const;

export type CompareCadence = (typeof COMPARE_CADENCE)[keyof typeof COMPARE_CADENCE];

export type DataSource = {
  type?: "http";
  method: "POST" | "GET";
  url: string;
  body?: Record<string, unknown>;
  service?: string;
};

export type DateRangeMetadata = {
  cadence: Cadence;
  compareCadence: CompareCadence;
  from?: string;
  to?: string;
  pvp_from?: string;
  pvp_to?: string;
};

export type PaginationMetadata = {
  pageSize: number;
  page: number;
};

export type WidgetMetadata = {
  enablePvp?: boolean;
  showTotal?: boolean;
  filters?: FilterMetadata[];
  dateRange?: DateRangeMetadata;
  pagination?: PaginationMetadata;
  templateId?: string;
  competitor_enabled?: boolean;
  category_leader_enabled?: boolean;
};

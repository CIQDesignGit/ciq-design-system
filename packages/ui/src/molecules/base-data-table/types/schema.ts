/**
 * Widget V2 Schema Type Definitions
 * Based on the V2 widget metadata format specification
 * Table-specific types for BaseDataTable
 */

import {
  CADENCE,
  type Cadence,
  COMPARE_CADENCE,
  type CompareCadence,
  type DataSource,
  type DateRangeMetadata,
  type FilterCombinationOperator,
  type FilterMetadata,
  type FilterOperator,
  type PaginationMetadata,
  type WidgetMetadata,
} from "./host-data";
import type {
  ActionConfig,
  GranularityActionConfig,
  TimeGranularity,
  Visibility,
  WidgetActions,
  WidgetBehavior,
  WidgetTop,
  WidgetTopV2WithMetadata,
} from "./host-widget";

// ============================================
// Re-export types and constants from data.ts and widget.ts for convenience
// ============================================

export { CADENCE, COMPARE_CADENCE };
export type {
  // From widget.ts
  ActionConfig,
  // From data.ts
  Cadence,
  CompareCadence,
  DataSource,
  DateRangeMetadata,
  FilterCombinationOperator,
  FilterMetadata,
  FilterOperator,
  GranularityActionConfig,
  PaginationMetadata,
  TimeGranularity,
  Visibility,
  WidgetActions,
  WidgetBehavior,
  WidgetMetadata,
  WidgetTop,
};

// Re-export WidgetTopV2WithMetadata as WidgetTopV2 for backwards compatibility
export type { WidgetTopV2WithMetadata as WidgetTopV2 };

// ============================================
// Table-specific V2 Schema Types
// ============================================

export type SortConfig = {
  visibility?: Visibility;
  ascending?: boolean;
  descending?: boolean;
  pvpAscending?: boolean;
  pvpDescending?: boolean;
  custom?: Array<{
    field: string;
    dir: "asc" | "desc";
    visibility?: Visibility;
  }>;
};

export type HeaderMenuConfig = {
  visibility: Visibility;
};

export type ColumnRole = "dimension" | "metric";

export const COLUMN_ROLE = {
  DIMENSION: "dimension",
  METRIC: "metric",
} as const satisfies Record<string, ColumnRole>;

/**
 * Defines a breakdown dimension with its field name and cell type
 * Similar to column definition but minimal - just what's needed for sub-row rendering
 */
export type BreakdownDimension = {
  field: string; // The dimension field name (e.g., "brand", "product_id")
  type: string; // Cell type from registry (e.g., "string", "sku", "number")
};

export type ColumnSchema = {
  hidden?: boolean;
  field: string;
  role: ColumnRole; // Required: determines if field is a dimension or metric
  type?: string; // e.g., "string", "number_highlight", "currency", "currency_plan", "currency_forecast", "sku"
  label: string;
  tooltip?: string;
  format?: string; // e.g., "percentage"
  align?: "left" | "center" | "right";
  width?: number;
  resize?: boolean; // Set to false to keep column at its exact width (no resize handle, no flex growth)
  noPadding?: boolean; // Remove padding from cell
  sortable?: boolean; // Boolean to enable/disable sorting for this column
  sort?: SortConfig;
  headerMenu?: HeaderMenuConfig; // Control header menu visibility
  children?: ColumnSchema[]; // For grouped columns
  /**
   * For the primary dimension column: defines the breakdown hierarchy
   * Array of dimension definitions for n-level drill-down
   * Each entry specifies the field and its cell type for proper rendering
   *
   * Example: breakdownHierarchy: [{ field: "brand", type: "string" }, { field: "sku", type: "sku" }]
   * means: product_id > brand (StringCell) > sku (SKUCell)
   */
  breakdownHierarchy?: BreakdownDimension[];
};

export type TableSchema = {
  columns: ColumnSchema[];
};

export type TableOptions = {
  pageSize?: number;
  pageSizeOptions?: number[];
  showTotal?: boolean;
  enableColumnReorder?: boolean;
  enableColumnResize?: boolean;
};

export type BaseDataTableContent = {
  dataSource: DataSource;
  options?: TableOptions;
  schema: TableSchema;
  data?: Record<string, unknown>; // Optional initial data
};

export type WidgetBody = {
  type: "table" | string; // Can be extended for custom table types
  content: BaseDataTableContent;
};

export type WidgetInsights = {
  type: "markdown";
  value: string;
};

export type WidgetLayout = {
  x: number;
  y: number;
  w: number;
  h: number;
  isDraggable?: boolean;
  isResizable?: boolean;
};

export type WidgetV2Schema = {
  metadata?: WidgetMetadata;
  id: string;
  kind: "widget";
  version: "v1" | "v2";
  top?: WidgetTopV2WithMetadata;
  body: WidgetBody;
  insights?: WidgetInsights;
  layout?: WidgetLayout;
};

// ============================================
// API Payload Types (New Format)
// ============================================

/**
 * Select payload with metrics and dimensions
 */
export type APISelectPayload = {
  metrics: string[];
  dimensions: string[];
};

/**
 * Filter condition operators
 */
export type APIFilterOperator =
  | "in_list"
  | "not_in_list"
  | "equals"
  | "not_equals"
  | "is_null"
  | "is_not_null"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "contains"
  | "not_contains"
  | "starts_with"
  | "ends_with";

/**
 * Base filter condition
 */
export type APIFilterCondition = {
  op: APIFilterOperator;
  field: string;
  values?: (string | number | boolean)[];
  value?: string | number | boolean;
};

/**
 * NOT wrapper for filter condition
 */
export type APIFilterNot = {
  not: APIFilterCondition;
};

/**
 * ANY clause (OR logic)
 */
export type APIFilterAnyClause = {
  any: (APIFilterCondition | APIFilterNot)[];
};

/**
 * ALL clause (AND logic) - top level of where
 * Supports both:
 * - Direct conditions: { all: [{ op: "equals", field: "x", value: "y" }] }
 * - Any-wrapped conditions: { all: [{ any: [{ op: "equals", ... }] }] }
 */
export type APIFilterAllClause = {
  all: (APIFilterAnyClause | APIFilterCondition | APIFilterNot)[];
};

/**
 * Where clause containing the filter logic
 */
export type APIFilterWhereClause = APIFilterAllClause;

/**
 * Filter payload with where clause
 */
export type APIFilterPayload = {
  where: APIFilterWhereClause;
};

/**
 * Sort item configuration
 */
export type APISortItem = {
  field: string;
  order: "asc" | "desc";
  null_handling?: "first" | "last";
};

/**
 * Sort payload
 */
export type APISortPayload = {
  by: APISortItem[];
};

/**
 * Pagination payload with limit_rows and optional skip_rows for offset-based pagination
 */
export type APIPaginationPayload = {
  limit_rows: number;
  skip_rows?: number;
};

/**
 * Compare period payload for date range filtering
 * Uses current/previous period format with explicit date field
 */
export type APIComparePeriodPayload = {
  current: { start: string; end: string };
  previous: { start: string; end: string };
  date_field: string;
};

/**
 * Main API request payload
 */
export type APIRequestPayload = {
  select: APISelectPayload;
  filter?: APIFilterPayload;
  sort?: APISortPayload;
  pagination: APIPaginationPayload;
  aggregate_metrics: boolean;
  compare_period?: APIComparePeriodPayload;
  enablePvp?: boolean;
  include_overall?: boolean;
  competitor_enabled?: boolean;
  category_leader_enabled?: boolean;
};

export type APIResponsePayload<TData = Record<string, unknown>> = {
  data: TData[];
  total: number;
  page: number;
  pageSize: number;
};

// ============================================
// Response Metadata Types
// ============================================

/**
 * Metadata for SKU lookup (image, title, etc.)
 */
export type SKUMetadata = Record<
  string,
  {
    sku: string;
    pim_sku_image_url?: string;
    product_title?: string;
    [key: string]: unknown;
  }
>;

/**
 * Response metadata containing lookup tables
 */
export type ResponseMetadata = {
  sku?: SKUMetadata;
  [key: string]: unknown;
};

/**
 * Extended page info with total_count (used by some APIs)
 */
export type ExtendedPageInfo = {
  limit?: number;
  row_count?: number;
  total_count?: number;
  next_cursor?: string | null;
};

/**
 * Flat response format (already transformed data)
 */
export type FlatResponse<TData = Record<string, unknown>> = {
  data: TData[];
  page?: {
    limit?: number;
    row_count?: number;
  };
  total?: number;
  metadata?: ResponseMetadata;
};

/**
 * Type for sort configuration from schema
 */
export type SortConfigItem = {
  field?: string;
  key?: string;
  dir?: string;
};

/**
 * Extended column type that may have key property
 */
export type ColumnWithKey = ColumnSchema & {
  key?: string;
};

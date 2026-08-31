// Core Components
export { BaseDataTable } from "./core/BaseDataTable";
export { BaseDataTableBody } from "./core/BaseDataTableBody";
export { BaseDataTableContextProvider, useBaseDataTableContext } from "./core/BaseDataTableContext";
export { BaseDataTableHeader } from "./core/BaseDataTableHeader";
export { BaseDataTableHeaderCell } from "./core/BaseDataTableHeaderCell";
export type { MenuOption, MenuSection } from "./core/BaseDataTableHeaderMenu";
export { BaseDataTableHeaderMenu } from "./core/BaseDataTableHeaderMenu";

// Extensions (feature wrappers)
export type { ExpandableTableProps } from "./extensions/ExpandableTable";
export { ExpandableTable } from "./extensions/ExpandableTable";

// Pagination
export type { PaginationV2Props } from "./pagination/PaginationV2";
export { PaginationV2 } from "./pagination/PaginationV2";

// Filters
export type { FilterBarProps, FilterDataSource } from "@/molecules/filters";
export { FilterBar } from "@/molecules/filters";

// Cells
export {
  CellRegistry,
  clearCellRegistry,
  getCell,
  getRegisteredTypes,
  hasCell,
  registerCell,
  registerDefaultCells,
  unregisterCell,
} from "./cells";
// Base cells (simple, no highlighting/PvP)
export {
  CurrencyCell,
  CurrencyForecastCell,
  CurrencyPlanCell,
  DefaultCell,
  NumberCell,
  SKUCell,
  StringCell,
} from "./cells";

// Highlight cells (with highlighting and PvP indicator support)
export {
  CurrencyHighlightCell,
  DefaultHighlightCell,
  NumberHighlightCell,
  StringHighlightCell,
} from "./cells";

// Shared components
export { PvpIndicator } from "./cells";

// Cell prop types
export type { SKUCellProps } from "./cells";

// Hooks
export type {
  ExtendedPageInfo,
  FetchDataCallback,
  FlatResponse,
  ResponseMetadata,
  SKUMetadata,
  UseBaseDataTableDataOptions,
  UseBaseDataTableDataReturn,
} from "./hooks/useBaseDataTableData";
export { useBaseDataTableData } from "./hooks/useBaseDataTableData";

// Row expansion hook (for custom implementations)
export type { UseRowBreakdownOptions, UseRowBreakdownReturn } from "./hooks/useRowBreakdown";
export { useRowBreakdown } from "./hooks/useRowBreakdown";

// Utils
export { buildAPIPayload, buildSortPayload } from "./utils/api-payload-builder";
export * as columnHelpers from "./utils/column-helpers";
export type {
  MetricValueEntry,
  NestedDataLeaf,
  NestedGenieResponse,
  /** Renamed at package root — atoms already export `TableRow` (HTML row). */
  TableRow as BaseDataTableRow,
} from "./utils/rows-transformer";
export { toTableRows } from "./utils/rows-transformer";
export {
  extractLeafColumnIds,
  getDefaultColumnOrder,
  transformSchemaToColumns,
} from "./utils/schema-transformer";

// Constants
export { CADENCE, COMPARE_CADENCE } from "./types";

// Types
export type {
  ActionConfig,
  APIFilterAllClause,
  APIFilterAnyClause,
  APIFilterCondition,
  APIFilterNot,
  APIFilterOperator,
  APIFilterPayload,
  APIFilterWhereClause,
  APIPaginationPayload,
  APIRequestPayload,
  APIResponsePayload,
  APISelectPayload,
  APISortItem,
  APISortPayload,
  AugmentedRow,
  AugmentedRowFields,
  BaseDataTableColumnDef,
  BaseDataTableColumnMeta,
  BaseDataTableContent,
  BaseDataTableContextValue,
  BaseDataTableFeatures,
  BaseDataTableProps,
  BaseDataTableState,
  BaseDataTableStateHandlers,
  BreakdownConfigFromSchema,
  BreakdownDimension,
  Cadence,
  CellRegistryType,
  CellRenderer,
  // Table component types
  CellRendererProps,
  ColumnRole,
  ColumnSchema,
  ColumnWithKey,
  CompareCadence,
  DataSource,
  DateRangeMetadata,
  ExpandConfig,
  FilterMetadata,
  FilterOperator,
  HeaderAction,
  HeaderRenderer,
  HeaderRendererProps,
  HideAction,
  PaginationMetadata,
  PinAction,
  RenderEmptyStateProps,
  RenderErrorStateProps,
  RenderFiltersProps,
  RenderPaginationProps,
  SortAction,
  SortConfig,
  SortConfigItem,
  SpecialRowRenderer,
  SpecialRowRendererProps,
  SubRowCacheEntry,
  TableOptions,
  TableSchema,
  VirtualizationOptions,
  // Schema types
  Visibility,
  WidgetActions,
  WidgetBody,
  WidgetInsights,
  WidgetLayout,
  WidgetMetadata,
  WidgetTop,
  WidgetV2Schema,
} from "./types";

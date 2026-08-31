import type {
  ColumnDef,
  ColumnOrderState,
  ColumnPinningState as TanStackColumnPinningState,
  ExpandedState,
  OnChangeFn,
  Row,
  SortingState,
} from "@tanstack/react-table";
import type { Dispatch, SetStateAction } from "react";

import type { PartialStateUpdater } from "../utils/state-utils";
import type { APIRequestPayload, ResponseMetadata } from "./schema";
import type {
  BreakdownDimension,
  ColumnSchema,
  FilterMetadata,
  PaginationMetadata,
  WidgetV2Schema,
} from "./schema";

// Re-export ColumnPinningState for external use
export type ColumnPinningState = TanStackColumnPinningState;

/**
 * Cell Renderer Props
 */
export type CellRendererProps<TData = Record<string, unknown>> = {
  value: unknown;
  row: TData;
  column: ColumnSchema;
  rowIndex: number;
  columnId: string;
  /** TanStack Row for advanced use cases (expansion, depth, etc.) */
  tanstackRow?: Row<TData>;
};

/**
 * Cell Renderer Function Type
 */
export type CellRenderer<TData = Record<string, unknown>> = (
  props: CellRendererProps<TData>
) => React.ReactNode | React.ReactElement | Promise<React.ReactNode | React.ReactElement>;

/**
 * Base props for registered cell renderers - uses permissive types
 * This allows cell renderers to be stored in a registry and called with any row data
 * Cell renderers that need to access row/tanstackRow should validate the shape
 */
export type RegisteredCellRendererProps = {
  value: unknown;
  row: unknown;
  column: ColumnSchema;
  rowIndex: number;
  columnId: string;
  tanstackRow?: unknown;
};

/**
 * Cell Renderer stored in registry - works with any data type
 * Uses RegisteredCellRendererProps which accepts any row type
 */
export type RegisteredCellRenderer = (
  props: RegisteredCellRendererProps
) => React.ReactNode | React.ReactElement | Promise<React.ReactNode | React.ReactElement>;

/**
 * Cell Registry Interface
 */
export type CellRegistryType = {
  register: (type: string, renderer: RegisteredCellRenderer) => void;
  get: (type: string) => RegisteredCellRenderer | undefined;
  unregister: (type: string) => void;
  has: (type: string) => boolean;
  clear: () => void;
};

/**
 * Column Meta Extension for TanStack Table
 */
export type BaseDataTableColumnMeta = {
  tooltip?: string;
  align?: "left" | "center" | "right";
  columnSchema?: ColumnSchema;
  cellRenderer?: CellRenderer;
};

/**
 * Table V2 State
 */
export type BaseDataTableState = {
  pagination: PaginationMetadata;
  sorting: SortingState;
  filters: FilterMetadata[];
  columnOrder: ColumnOrderState;
  columnPinning: ColumnPinningState;
};

/**
 * State Change Handlers
 */
export type BaseDataTableStateHandlers = {
  onPaginationChange: (pagination: Partial<PaginationMetadata>) => void;
  onSortingChange: (sorting: SortingState) => void;
  onFiltersChange: (filters: FilterMetadata[]) => void;
  onColumnOrderChange: (columnOrder: ColumnOrderState) => void;
  onColumnPinningChange: (columnPinning: ColumnPinningState) => void;
};

/**
 * Table Features (opt-in/opt-out)
 */
export type BaseDataTableFeatures = {
  enableColumnReordering?: boolean;
  enableColumnResizing?: boolean;
  enableColumnPinning?: boolean;
  enableSorting?: boolean;
  enableFilters?: boolean;
  enablePagination?: boolean;
};

/**
 * Virtualization Options
 */
export type VirtualizationOptions = {
  /** Estimated height of each row in pixels (default: 40) */
  estimatedRowHeight?: number;
  /** Number of rows to render outside the visible area (default: 5) */
  overscan?: number;
  /** Max height of the table container in pixels (overrides visibleRows if set) */
  tableHeight?: number;
  /** Max number of visible rows to show - table shrinks if fewer rows exist (default: 10) */
  visibleRows?: number;
};

/**
 * Render Props for Customization
 */
export type RenderFiltersProps = {
  filters: FilterMetadata[];
  onFiltersChange: (filters: FilterMetadata[]) => void;
  schema: WidgetV2Schema;
};

export type RenderPaginationProps = {
  pagination: PaginationMetadata;
  totalRows: number;
  onPaginationChange: (pagination: Partial<PaginationMetadata>) => void;
};

export type RenderEmptyStateProps = {
  message?: string;
};

export type RenderErrorStateProps = {
  error: Error;
  onRetry?: () => void;
};

/**
 * Header Renderer Props
 */
export type HeaderRendererProps = {
  columnId: string;
  column: ColumnSchema;
};

/**
 * Header Renderer Function Type
 */
export type HeaderRenderer = (props: HeaderRendererProps) => React.ReactNode;

/**
 * Configuration for row expansion feature
 * Passed to BaseDataTable to enable TanStack expanded row model
 */
export type ExpandConfig<TData = Record<string, unknown>> = {
  /** Current expanded state */
  expanded: ExpandedState;
  /** Handler for expanded state changes */
  onExpandedChange: OnChangeFn<ExpandedState>;
  /** Function to get sub-rows from a row */
  getSubRows: (row: TData) => TData[] | undefined;
  /** Function to get unique row ID */
  getRowId: (row: TData, index: number, parent?: Row<TData>) => string;
};

/**
 * Props passed to special row renderer
 */
export type SpecialRowRendererProps<TData = Record<string, unknown>> = {
  /** TanStack row object */
  row: Row<TData>;
  /** Original row data */
  rowData: TData;
  /** Number of visible columns */
  columnCount: number;
  /** Virtual row start position */
  virtualStart: number;
  /** Ref callback for virtualization measurement */
  measureRef: (node: HTMLTableRowElement | null) => void;
  /** Virtual row index */
  dataIndex: number;
};

/**
 * Renderer function for special/marker rows (e.g., LoadMore, Error)
 * Return null to render as normal row, return ReactNode to render custom UI
 */
export type SpecialRowRenderer<TData = Record<string, unknown>> = (
  props: SpecialRowRendererProps<TData>
) => React.ReactNode | null;

/**
 * Main Table V2 Props
 */
export type BaseDataTableProps<TData = Record<string, unknown>> = {
  // Required props
  schema: WidgetV2Schema;
  data: TData[];
  totalRows: number;
  /** Optional total/summary row to display as first row */
  overallRow?: TData | null;
  isLoading?: boolean;
  error?: Error | null;

  // State management
  state: BaseDataTableState;
  onStateChange?: (state: Partial<BaseDataTableState>) => void;

  // External states - will be used to re-render the table when external state changes
  externalStateToWatch?: Record<string, unknown>;
  // Cell renderer overrides
  cellRenderers?: Record<string, CellRenderer<TData>>;

  // Header renderer overrides (field name -> header renderer)
  headerRenderers?: Record<string, HeaderRenderer>;

  // Feature flags
  features?: BaseDataTableFeatures;

  // Virtualization options (only used when features.enableVirtualization is true)
  virtualization?: VirtualizationOptions;

  // Render props for customization
  renderFilters?: (props: RenderFiltersProps) => React.ReactNode;
  renderPagination?: (props: RenderPaginationProps) => React.ReactNode;
  renderEmpty?: (props: RenderEmptyStateProps) => React.ReactNode;
  renderError?: (props: RenderErrorStateProps) => React.ReactNode;

  // Filter values fetcher
  fetchFilterValues?: (filterName: string, searchTerm?: string) => Promise<string[]>;

  // Empty state
  emptyMessage?: string;

  // Styling
  className?: string;

  // Callbacks
  onRefresh?: () => void;

  // Extension points for composable features
  /** Optional expansion configuration - enables TanStack expanded row model */
  expandConfig?: ExpandConfig<TData>;
  /** Optional renderer for special/marker rows (e.g., LoadMore, Error) */
  specialRowRenderer?: SpecialRowRenderer<TData>;

  // Infinite-scroll (opt-in) - when omitted, the table behaves exactly as before.
  /** Whether more rows exist beyond the currently loaded `data`. */
  hasMore?: boolean;
  /** Whether a load-more request is in flight (guards against duplicate triggers). */
  loadingMore?: boolean;
  /** Called when the virtualizer's last rendered row approaches the end of `data`. */
  onLoadMore?: () => void;
};

/**
 * Table V2 Context Value
 */
export type BaseDataTableContextValue = {
  schema: WidgetV2Schema;
  state: BaseDataTableState;
  handlers: BaseDataTableStateHandlers;
  features: Required<BaseDataTableFeatures>;
  cellRenderers: Record<string, CellRenderer>;
  isLoading: boolean;
  error: Error | null;
};

/**
 * Column Definition with V2 Meta
 */
export type BaseDataTableColumnDef<TData = Record<string, unknown>> = ColumnDef<TData> & {
  meta?: BaseDataTableColumnMeta;
};

/**
 * Fetch callback can return nested Genie format or flat format
 */
export type FetchDataCallback = (
  payload: APIRequestPayload,
  state: BaseDataTableState,
  signal?: AbortSignal
) => Promise<Record<string, unknown>>;

/**
 * Options for useBaseDataTableData hook
 */
export type UseBaseDataTableDataOptions = {
  schema: WidgetV2Schema;
  initialPageSize?: number;
  initialSorting?: SortingState;
  initialColumnPinning?: ColumnPinningState;
  onError?: (error: Error) => void;
  enabled?: boolean;
  fetchData?: FetchDataCallback;
  includeOverall?: boolean;
};

/**
 * Return type for useBaseDataTableData hook
 */
export type UseBaseDataTableDataReturn<TData = Record<string, unknown>> = {
  // Data
  data: TData[];
  totalRows: number;
  overallRow: TData | null;
  metadata: ResponseMetadata | null;

  // State
  state: BaseDataTableState;
  isLoading: boolean;
  error: Error | null;

  // Actions
  refetch: () => Promise<void>;
  setPageIndex: Dispatch<SetStateAction<number>>;
  setPageSize: Dispatch<SetStateAction<number>>;
  setSorting: Dispatch<SetStateAction<SortingState>>;
  setFilters: Dispatch<SetStateAction<FilterMetadata[]>>;
  updateState: (updater: PartialStateUpdater<BaseDataTableState>) => void;
};

// ============================================
// Row Breakdown Types
// ============================================

/**
 * Cache entry for sub-rows fetched on expand
 */
export type SubRowCacheEntry<TData = Record<string, unknown>> = {
  rows: TData[];
  total: number;
  hasMore: boolean;
  page: number;
  error: Error | null; // Initial load error
  loadMoreError: Error | null; // Pagination error (preserves existing rows)
  retryCount: number;
};

/**
 * Configuration for row breakdown feature
 */
export type RowBreakdownConfig = {
  enabled: boolean;
  pageSize?: number; // Default: 5
  maxCacheEntries?: number; // Default: 100 - for LRU cache eviction
};

/**
 * Breakdown configuration error types
 */
export type BreakdownConfigError = {
  type: "MULTIPLE_BREAKDOWN_COLUMNS";
  message: string;
  columns: string[]; // Field names of columns with breakdownHierarchy
};

/**
 * Breakdown config derived from schema
 */
export type BreakdownConfigFromSchema = {
  enabled: boolean;
  primaryDimension: ColumnSchema | null;
  hierarchy: BreakdownDimension[];
  error?: BreakdownConfigError;
};

/**
 * Internal fields added to rows during augmentation
 * These are used by the table internals, not from API data
 */
export type AugmentedRowFields = {
  /** Whether this row is currently expanded */
  _isExpanded?: boolean;
  /** Whether this row is currently loading sub-rows */
  _isLoading?: boolean;
  /** Whether parent has more sub-rows to load */
  _hasMore?: boolean;
  /** Error from initial sub-row load */
  _subRowError?: Error | null;
  /** Error from load-more pagination */
  _loadMoreError?: Error | null;
  /** Marker: this is a "Load More" placeholder row */
  _isLoadMoreRow?: boolean;
  /** Marker: this is a "No Data" placeholder row */
  _isNoDataRow?: boolean;
  /** Parent row ID (for marker rows) */
  _parentRowId?: string;
  /** Depth level (for marker rows) */
  _depth?: number;
  /** Sub-rows (added by TanStack pattern) */
  subRows?: unknown[];
};

/**
 * Row data with augmented fields
 * Use this type when working with rows that have been processed by augmentDataWithSubRows
 */
export type AugmentedRow<TData = Record<string, unknown>> = TData & AugmentedRowFields;

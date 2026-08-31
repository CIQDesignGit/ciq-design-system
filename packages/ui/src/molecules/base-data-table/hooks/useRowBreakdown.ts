import type { ExpandedState, OnChangeFn, Row } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  APIRequestPayload,
  AugmentedRow,
  AugmentedRowFields,
  BaseDataTableState,
  BreakdownConfigFromSchema,
  SubRowCacheEntry,
  WidgetV2Schema,
} from "../types";
import { buildSubRowPayload } from "../utils/api-payload-builder";
import {
  buildRowId,
  canRowExpand as canRowExpandHelper,
  getBreakdownConfig,
  getBreakdownDimensionField,
  getMetricFields,
  getRowIdFromTanStackRow,
  unwrapValue,
} from "../utils/breakdown-helpers";
import { fetchTableDataFromDataSource, isAbortError } from "../utils/data-fetcher";

// ============================================
// Types
// ============================================

export type UseRowBreakdownOptions<TData = Record<string, unknown>> = {
  schema: WidgetV2Schema;
  tableState?: BaseDataTableState; // Full table state for sorting/filters access
  pageSize?: number; // Default: 5
  maxCacheEntries?: number; // Default: 100 for LRU cache eviction
  // Optional custom fetch - uses dataSource by default
  customFetchSubRows?: (
    payload: APIRequestPayload,
    signal?: AbortSignal
  ) => Promise<{ data: TData[]; total: number }>;
  // Dependencies that should trigger expanded state reset
  filterDeps?: unknown[];
  paginationDeps?: unknown[];
  onSubRowMetadata?: (metadata: Record<string, unknown>) => void;
};

export type UseRowBreakdownReturn<TData = Record<string, unknown>> = {
  // Whether breakdown is enabled (from schema)
  breakdownEnabled: boolean;

  // Configuration error (e.g., multiple columns with breakdownHierarchy)
  configError: BreakdownConfigFromSchema["error"];

  // Breakdown config from schema
  breakdownConfig: BreakdownConfigFromSchema;

  // TanStack expanded state (controlled)
  expanded: ExpandedState;
  onExpandedChange: OnChangeFn<ExpandedState> | undefined;

  // Cache of sub-rows by rowId
  subRowsCache: Map<string, SubRowCacheEntry<TData>>;

  // Loading states per row
  loadingRows: Set<string>;

  // Handlers
  handleToggleExpand: (row: Row<TData>) => Promise<void>;
  handleLoadMore: (row: Row<TData>) => Promise<void>;
  handleRetry: (row: Row<TData>) => Promise<void>;
  handleRetryLoadMore: (row: Row<TData>) => Promise<void>;

  // Reset all expanded state
  clearAllExpanded: () => void;

  // Augment data with cached sub-rows (for TanStack getSubRows)
  augmentDataWithSubRows: (data: TData[]) => TData[];

  // Check if row can expand (has more levels in hierarchy)
  canRowExpand: (row: Row<TData>) => boolean;

  // Get row ID for a row
  getRowId: (row: TData, depth: number, index: number, parentId?: string) => string;
};

// ============================================
// Constants
// ============================================

const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_MAX_CACHE_ENTRIES = 100;
const MAX_RETRIES = 3;

// ============================================
// Hook Implementation
// ============================================

export function useRowBreakdown<TData extends Record<string, unknown> = Record<string, unknown>>(
  options: UseRowBreakdownOptions<TData>
): UseRowBreakdownReturn<TData> {
  const {
    schema,
    tableState,
    pageSize = DEFAULT_PAGE_SIZE,
    maxCacheEntries = DEFAULT_MAX_CACHE_ENTRIES,
    customFetchSubRows,
    filterDeps = [],
    paginationDeps = [],
    onSubRowMetadata,
  } = options;

  // Extract columns for dependency tracking - triggers cache clear on schema changes
  const schemaColumns = schema.body.content.schema.columns;

  // Get breakdown config from schema (memoized)
  const breakdownConfig = useMemo(() => getBreakdownConfig(schemaColumns), [schemaColumns]);

  const {
    enabled: breakdownEnabled,
    primaryDimension,
    hierarchy,
    error: configError,
  } = breakdownConfig;

  // ============================================
  // Early Return for Disabled Breakdown or Config Error
  // ============================================

  // Create no-op return for disabled state or configuration error
  const disabledReturn = useMemo(
    (): UseRowBreakdownReturn<TData> => ({
      breakdownEnabled: false,
      configError: breakdownConfig.error, // Pass through any configuration error
      breakdownConfig: breakdownConfig,
      expanded: {},
      onExpandedChange: undefined,
      subRowsCache: new Map(),
      loadingRows: new Set(),
      handleToggleExpand: () => Promise.resolve(),
      handleLoadMore: () => Promise.resolve(),
      handleRetry: () => Promise.resolve(),
      handleRetryLoadMore: () => Promise.resolve(),
      clearAllExpanded: () => {},
      augmentDataWithSubRows: (data) => data, // Pass-through
      canRowExpand: () => false,
      getRowId: () => "",
    }),
    [breakdownConfig]
  );

  // ============================================
  // State (only created if breakdown is enabled)
  // ============================================

  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [subRowsCache, setSubRowsCache] = useState<Map<string, SubRowCacheEntry<TData>>>(
    () => new Map()
  );
  const [loadingRows, setLoadingRows] = useState<Set<string>>(() => new Set());

  // Refs for AbortControllers and debounce
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());
  const loadMoreDebounceRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // ============================================
  // Helper Functions
  // ============================================

  const getRowId = useCallback(
    (row: TData, depth: number, index: number, parentId?: string): string => {
      if (!primaryDimension) return "";
      return buildRowId(row, depth, primaryDimension.field, hierarchy, index, parentId);
    },
    [primaryDimension, hierarchy]
  );

  const getRowIdFromRow = useCallback(
    (row: Row<TData>): string => {
      if (!primaryDimension) return row.id;
      return getRowIdFromTanStackRow(row, primaryDimension.field, hierarchy);
    },
    [primaryDimension, hierarchy]
  );

  const canRowExpand = useCallback(
    (row: Row<TData>): boolean => {
      if (!breakdownEnabled) return false;
      return canRowExpandHelper(row, hierarchy);
    },
    [breakdownEnabled, hierarchy]
  );

  const setSubRowsCacheWithEviction = useCallback(
    (
      updater: (prev: Map<string, SubRowCacheEntry<TData>>) => Map<string, SubRowCacheEntry<TData>>
    ) => {
      setSubRowsCache((prev) => {
        const next = updater(prev);

        // Evict oldest entries if over limit (LRU approximation)
        if (next.size > maxCacheEntries) {
          const keysToDelete = Array.from(next.keys()).slice(0, next.size - maxCacheEntries);
          keysToDelete.forEach((key) => {
            next.delete(key);
            // Also collapse these rows
            setExpanded((prevExpanded) => {
              if (typeof prevExpanded === "boolean") return prevExpanded;
              const e = { ...prevExpanded };
              delete e[key];
              return e;
            });
          });
        }
        return next;
      });
    },
    [maxCacheEntries]
  );

  const metricFields = useMemo(() => getMetricFields(schema.body.content.schema.columns), [schema]);

  const buildPayloadForRow = useCallback(
    (row: Row<TData>, breakdownDimension: string): APIRequestPayload | null => {
      if (!primaryDimension) return null;

      // Build filter chain from row and its parents
      const parentFilters: Array<{ field: string; value: string | number }> = [];
      let currentRow: Row<TData> | undefined = row;

      while (currentRow) {
        const depth = currentRow.depth;
        const field = depth === 0 ? primaryDimension.field : hierarchy[depth - 1]?.field;

        if (field) {
          const rawValue = currentRow.original[field];
          const value = unwrapValue(rawValue);
          if (value !== null) {
            // Insert at beginning to maintain root-to-leaf order
            parentFilters.unshift({
              field,
              value,
            });
          }
        }
        currentRow = currentRow.getParentRow();
      }

      return buildSubRowPayload(
        schema,
        parentFilters,
        breakdownDimension,
        metricFields,
        tableState?.sorting,
        tableState?.filters
      );
    },
    [primaryDimension, hierarchy, metricFields, schema, tableState?.sorting, tableState?.filters]
  );

  const fetchSubRowsInternal = useCallback(
    async (
      payload: APIRequestPayload,
      signal?: AbortSignal
    ): Promise<{ data: TData[]; total: number }> => {
      // Use custom fetcher if provided
      if (customFetchSubRows) {
        return customFetchSubRows(payload, signal);
      }

      // Use shared data fetcher with schema's dataSource
      const dataSource = schema.body.content.dataSource;
      const result = await fetchTableDataFromDataSource<TData>({
        dataSource,
        payload,
        signal,
      });

      if (result.metadata && onSubRowMetadata) {
        onSubRowMetadata(result.metadata);
      }
      return { data: result.data, total: result.total };
    },
    [schema, customFetchSubRows, onSubRowMetadata]
  );

  // ============================================
  // Handlers
  // ============================================

  const handleToggleExpand = useCallback(
    async (row: Row<TData>): Promise<void> => {
      if (!breakdownEnabled || !primaryDimension) return;

      const rowId = getRowIdFromRow(row);
      const isExpanded = row.getIsExpanded();

      // Always toggle UI immediately for responsiveness
      row.toggleExpanded();

      if (isExpanded) {
        // Collapsing - just toggle UI, don't abort request
        // Let the request complete so data is cached for when user expands again
        // Table-level actions (filter, sort, pagination) will abort via clearAllExpanded()
        return;
      }

      // Already cached - no fetch needed
      if (subRowsCache.has(rowId)) return;

      // Get the breakdown dimension for this depth
      const breakdownDimension = getBreakdownDimensionField(hierarchy, row.depth);
      if (!breakdownDimension) return;

      // Cancel any existing request for this row (defensive)
      abortControllersRef.current.get(rowId)?.abort();

      // Create new AbortController for this request
      const abortController = new AbortController();
      abortControllersRef.current.set(rowId, abortController);

      // Set loading state
      setLoadingRows((prev) => new Set(prev).add(rowId));

      try {
        const payload = buildPayloadForRow(row, breakdownDimension);
        if (!payload) return;

        const result = await fetchSubRowsInternal(payload, abortController.signal);

        // Check if aborted before updating state
        if (abortController.signal.aborted) return;

        setSubRowsCacheWithEviction((prev) =>
          new Map(prev).set(rowId, {
            rows: result.data,
            total: result.total,
            hasMore: result.data.length < result.total,
            page: 0,
            error: null,
            loadMoreError: null,
            retryCount: 0,
          })
        );
      } catch (error) {
        // Ignore abort errors
        if (isAbortError(error)) return;

        // Handle real errors - collapse row
        row.toggleExpanded();
        setSubRowsCacheWithEviction((prev) =>
          new Map(prev).set(rowId, {
            rows: [],
            total: 0,
            hasMore: false,
            page: 0,
            error: error as Error,
            loadMoreError: null,
            retryCount: 0,
          })
        );
      } finally {
        abortControllersRef.current.delete(rowId);
        setLoadingRows((prev) => {
          const next = new Set(prev);
          next.delete(rowId);
          return next;
        });
      }
    },
    [
      breakdownEnabled,
      primaryDimension,
      hierarchy,
      subRowsCache,
      fetchSubRowsInternal,
      buildPayloadForRow,
      getRowIdFromRow,
      setSubRowsCacheWithEviction,
    ]
  );

  const handleLoadMore = useCallback(
    async (row: Row<TData>): Promise<void> => {
      if (!breakdownEnabled || !primaryDimension) return;

      const rowId = getRowIdFromRow(row);

      // Clear any pending debounce
      const existing = loadMoreDebounceRef.current.get(rowId);
      if (existing) clearTimeout(existing);

      // Debounce 100ms
      loadMoreDebounceRef.current.set(
        rowId,
        setTimeout(async () => {
          const cached = subRowsCache.get(rowId);
          if (!cached || !cached.hasMore) return;

          const breakdownDimension = getBreakdownDimensionField(hierarchy, row.depth);
          if (!breakdownDimension) return;

          // Set loading state
          setLoadingRows((prev) => new Set(prev).add(rowId));

          try {
            const nextPage = cached.page + 1;
            const payload = buildPayloadForRow(row, breakdownDimension);
            if (!payload) return;

            // Pagination for sub-row loading with offset to skip already-loaded rows
            payload.pagination = {
              limit_rows: pageSize,
              skip_rows: cached.rows.length,
            };

            const result = await fetchSubRowsInternal(payload);

            setSubRowsCacheWithEviction((prev) => {
              const existingEntry = prev.get(rowId);
              if (!existingEntry) return prev;

              return new Map(prev).set(rowId, {
                ...existingEntry,
                rows: [...existingEntry.rows, ...result.data],
                hasMore: existingEntry.rows.length + result.data.length < result.total,
                page: nextPage,
                loadMoreError: null, // Clear any previous load more error on success
              });
            });
          } catch (error) {
            // Store error in cache - preserve existing rows
            setSubRowsCacheWithEviction((prev) => {
              const existingEntry = prev.get(rowId);
              if (!existingEntry) return prev;

              return new Map(prev).set(rowId, {
                ...existingEntry,
                loadMoreError: error as Error,
              });
            });
          } finally {
            setLoadingRows((prev) => {
              const next = new Set(prev);
              next.delete(rowId);
              return next;
            });
          }
        }, 100)
      );
    },
    [
      breakdownEnabled,
      primaryDimension,
      hierarchy,
      subRowsCache,
      fetchSubRowsInternal,
      buildPayloadForRow,
      getRowIdFromRow,
      pageSize,
      setSubRowsCacheWithEviction,
    ]
  );

  const handleRetry = useCallback(
    async (row: Row<TData>): Promise<void> => {
      if (!breakdownEnabled) return;

      const rowId = getRowIdFromRow(row);
      const cached = subRowsCache.get(rowId);

      if (!cached || !cached.error || cached.retryCount >= MAX_RETRIES) return;

      // Clear error and increment retry count
      setSubRowsCacheWithEviction((prev) => {
        const existing = prev.get(rowId);
        if (!existing) return prev;
        return new Map(prev).set(rowId, {
          ...existing,
          error: null,
          retryCount: existing.retryCount + 1,
        });
      });

      // Delete from cache to trigger re-fetch
      setSubRowsCache((prev) => {
        const next = new Map(prev);
        next.delete(rowId);
        return next;
      });

      // Re-trigger expand
      await handleToggleExpand(row);
    },
    [
      breakdownEnabled,
      subRowsCache,
      handleToggleExpand,
      getRowIdFromRow,
      setSubRowsCacheWithEviction,
    ]
  );

  // Preserves existing sub-rows and only retries the pagination
  const handleRetryLoadMore = useCallback(
    async (row: Row<TData>): Promise<void> => {
      if (!breakdownEnabled) return;

      const rowId = getRowIdFromRow(row);
      const cached = subRowsCache.get(rowId);

      if (!cached || !cached.loadMoreError) return;

      // Clear load more error state (preserve existing rows)
      setSubRowsCacheWithEviction((prev) => {
        const existing = prev.get(rowId);
        if (!existing) return prev;
        return new Map(prev).set(rowId, {
          ...existing,
          loadMoreError: null,
        });
      });

      // Re-trigger load more
      await handleLoadMore(row);
    },
    [breakdownEnabled, subRowsCache, handleLoadMore, getRowIdFromRow, setSubRowsCacheWithEviction]
  );

  const clearAllExpanded = useCallback(() => {
    // Abort all in-flight requests
    abortControllersRef.current.forEach((controller) => controller.abort());
    abortControllersRef.current.clear();

    // Clear debounce timers
    loadMoreDebounceRef.current.forEach((timer) => clearTimeout(timer));
    loadMoreDebounceRef.current.clear();

    // Reset state
    setExpanded({});
    setSubRowsCache(new Map());
    setLoadingRows(new Set());
  }, []);

  // Fields are stored in row data to trigger TanStack re-renders when state changes
  const augmentDataWithSubRows = useCallback(
    (data: TData[]): AugmentedRow<TData>[] => {
      if (!breakdownEnabled || !primaryDimension) return data as AugmentedRow<TData>[];

      const augmentRow = (
        row: TData,
        depth: number,
        index: number,
        parentId?: string
      ): AugmentedRow<TData> => {
        // Skip total rows - they don't participate in breakdown expansion
        if ("_isTotalRow" in row && row._isTotalRow) {
          return { ...row };
        }

        const rowId = getRowId(row, depth, index, parentId);
        const cached = subRowsCache.get(rowId);
        const isLoading = loadingRows.has(rowId);
        // Read expanded state - can be boolean (all) or object (per-row)
        const isExpanded = typeof expanded === "boolean" ? expanded : Boolean(expanded[rowId]);

        // Build augmented row with loading and expanded state
        // This ensures TanStack detects data changes and re-renders cells
        const augmented: AugmentedRow<TData> = {
          ...row,
          _isLoading: isLoading,
          _isExpanded: isExpanded,
        };

        if (cached) {
          // Handle case when no sub-rows returned (empty result)
          if (cached.rows.length === 0 && !cached.error) {
            const noDataMarker: AugmentedRowFields = {
              _isNoDataRow: true,
              _parentRowId: rowId,
              _depth: depth + 1,
            };
            return {
              ...augmented,
              subRows: [noDataMarker as AugmentedRow<TData>],
            };
          }

          // Handle case with sub-rows
          if (cached.rows.length > 0) {
            // Recursively augment sub-rows for n-level support
            const augmentedSubRows: AugmentedRow<TData>[] = cached.rows.map((r, subIndex) =>
              augmentRow(r, depth + 1, subIndex, rowId)
            );

            // If there's more data to load, append a LoadMore marker row
            // This row will be rendered as a LoadMoreRow component by BaseDataTableBody
            if (cached.hasMore || cached.loadMoreError) {
              const loadMoreMarker: AugmentedRowFields = {
                _isLoadMoreRow: true,
                _parentRowId: rowId,
                _depth: depth + 1,
                _isLoading: isLoading,
                _loadMoreError: cached.loadMoreError,
              };
              augmentedSubRows.push(loadMoreMarker as AugmentedRow<TData>);
            }

            return {
              ...augmented,
              subRows: augmentedSubRows,
              _hasMore: cached.hasMore,
              _subRowError: cached.error,
              _loadMoreError: cached.loadMoreError,
            };
          }
        }
        return augmented;
      };

      return data.map((r, index) => augmentRow(r, 0, index));
    },
    [breakdownEnabled, primaryDimension, subRowsCache, getRowId, loadingRows, expanded]
  );

  // ============================================
  // Effects
  // ============================================

  useEffect(() => {
    if (breakdownEnabled) {
      clearAllExpanded();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...filterDeps, ...paginationDeps, schemaColumns]);

  useEffect(() => {
    return () => {
      // Abort all in-flight requests
      abortControllersRef.current.forEach((controller) => controller.abort());
      abortControllersRef.current.clear();

      // Clear debounce timers
      loadMoreDebounceRef.current.forEach((timer) => clearTimeout(timer));
      loadMoreDebounceRef.current.clear();
    };
  }, []);

  // Return no-op if breakdown is disabled or has config error
  if (!breakdownEnabled || configError) {
    return disabledReturn;
  }

  return {
    breakdownEnabled,
    configError: undefined, // No error when enabled
    breakdownConfig,
    expanded,
    onExpandedChange: setExpanded,
    subRowsCache,
    loadingRows,
    handleToggleExpand,
    handleLoadMore,
    handleRetry,
    handleRetryLoadMore,
    clearAllExpanded,
    augmentDataWithSubRows,
    canRowExpand,
    getRowId,
  };
}

export default useRowBreakdown;

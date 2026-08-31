import type { SortingState } from "@tanstack/react-table";
import { type SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";


import type {
  BaseDataTableState,
  FilterMetadata,
  PartialStateUpdater,
  ResponseMetadata,
  UseBaseDataTableDataOptions,
  UseBaseDataTableDataReturn,
} from "../types";
import { buildAPIPayload } from "../utils/api-payload-builder";
import { isAbortError } from "../utils/data-fetcher";
import { resolvePartialStateUpdater, resolveSetStateAction } from "../utils/state-utils";

// Re-export types for backwards compatibility
export type {
  ExtendedPageInfo,
  FlatResponse,
  ResponseMetadata,
  SKUMetadata,
} from "../types/schema";
export type {
  FetchDataCallback,
  UseBaseDataTableDataOptions,
  UseBaseDataTableDataReturn,
} from "../types/table";

export function useBaseDataTableData<TData = Record<string, unknown>>(
  options: UseBaseDataTableDataOptions
): UseBaseDataTableDataReturn<TData> {
  const {
    schema,
    initialPageSize = 10,
    initialSorting = [],
    initialColumnPinning = { left: [], right: [] },
    onError,
    enabled = true,
    fetchData: customFetchData,
    includeOverall = false,
  } = options;

  // Extract initial state from schema
  const initialState = useMemo((): BaseDataTableState => {
    const metadata = schema.top?.metadata;
    const tableOptions = schema.body.content.options;
    const filters = schema.metadata?.filters ?? [];

    return {
      pagination: {
        pageSize: metadata?.pagination?.pageSize ?? tableOptions?.pageSize ?? initialPageSize,
        page: metadata?.pagination?.page ?? 0,
      },
      sorting: initialSorting,
      filters: filters,
      columnOrder: [],
      columnPinning: initialColumnPinning,
    };
  }, [schema, initialPageSize, initialSorting, initialColumnPinning]);

  // State management
  const [state, setState] = useState<BaseDataTableState>(initialState);
  const [data, setData] = useState<TData[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [overallRow, setOverallRow] = useState<TData | null>(null);
  const [metadata, setMetadata] = useState<ResponseMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // AbortController ref for cancelling in-flight requests
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsLoading(true);
    setError(null);

    try {
      // Build API payload with includeOverall flag
      const payload = buildAPIPayload(
        schema,
        state.pagination,
        state.sorting,
        state.filters,
        includeOverall
      );

      // Use custom fetcher if provided, otherwise use shared fetchTableDataFromDataSource
      if (customFetchData) {
        const rawResponse = await customFetchData(payload, state, abortController.signal);

        // Check if request was aborted before processing response
        if (abortController.signal.aborted) {
          return;
        }

        // Handle custom fetcher response (may have different shape)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw = rawResponse as any;
        const responseData = Array.isArray(raw.data) ? raw.data : (raw.data?.values ?? []);
        const total = raw.total ?? raw.page?.total_count ?? responseData.length;

        setData(responseData as TData[]);
        setTotalRows(Number.isFinite(total) ? total : responseData.length);
        setOverallRow(raw.overallRow ?? null);
        setMetadata(raw.metadata ?? null);
      } else {
        // Library has no built-in HTTP client — host must inject fetchData
        const error = new Error(
          "useBaseDataTableData requires fetchData. Pass a FetchDataCallback adapter (no axios in the library)."
        );
        console.error(error.message);
        setError(error);
        onError?.(error);
      }
    } catch (err) {
      // Ignore abort errors - they're expected when cancelling requests
      if (isAbortError(err)) {
        return;
      }
      const error = err instanceof Error ? err : new Error("Failed to fetch table data");
      setError(error);
      onError?.(error);
    } finally {
      // Only clear loading if this is still the active request
      if (!abortController.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [enabled, schema, state, includeOverall, customFetchData, onError]);

  useEffect(() => {
    fetchData();

    // Cleanup: abort request on unmount or when dependencies change
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  const setPageIndex = useCallback((value: SetStateAction<number>) => {
    setState((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, page: resolveSetStateAction(value, prev.pagination.page) },
    }));
  }, []);

  const setPageSize = useCallback((value: SetStateAction<number>) => {
    setState((prev) => ({
      ...prev,
      pagination: { pageSize: resolveSetStateAction(value, prev.pagination.pageSize), page: 0 },
    }));
  }, []);

  const setSorting = useCallback((value: SetStateAction<SortingState>) => {
    setState((prev) => ({
      ...prev,
      sorting: resolveSetStateAction(value, prev.sorting),
    }));
  }, []);

  const setFilters = useCallback((value: SetStateAction<FilterMetadata[]>) => {
    setState((prev) => ({
      ...prev,
      filters: resolveSetStateAction(value, prev.filters),
      pagination: { ...prev.pagination, page: 0 },
    }));
  }, []);

  const updateState = useCallback((updater: PartialStateUpdater<BaseDataTableState>) => {
    setState((prev) => ({
      ...prev,
      ...resolvePartialStateUpdater(updater, prev),
    }));
  }, []);

  // Force refetch function (for manual refresh)
  const refetch = useCallback(() => fetchData(), [fetchData]);

  return {
    // Data
    data,
    totalRows,
    overallRow,
    metadata,

    // State
    state,
    isLoading,
    error,

    // Actions
    refetch,
    setPageIndex,
    setPageSize,
    setSorting,
    setFilters,
    updateState,
  };
}

export default useBaseDataTableData;

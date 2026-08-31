import { useCallback, useState } from "react";

import type { FilterDataSource, FilterFetchPayload } from "./filter-bar";
import type { FilterDimension, FilterDimensionValue } from "./types";
import {
  buildDimensionValuesUrl,
  buildServiceUrl,
  isCustomProvider,
  parseFilterDimensionsResponse,
  parseFilterValuesResponse,
  type RawDimension,
} from "./filterConfigUtils";

/**
 * Injectable data layer — host implements this instead of `dataFetcherService`.
 */
export type FilterDataAdapter = {
  loadDimensions?: () => Promise<FilterDimension[]>;
  loadValues?: (dimensionId: string) => Promise<FilterDimensionValue[]>;
  /** Required for URL-based FilterDataSource when `fetchData` is not set. */
  fetchRaw?: (payload: FilterFetchPayload) => Promise<unknown>;
};

interface UseFilterDataReturn {
  dimensions: FilterDimension[];
  valuesByDimension: Record<string, FilterDimensionValue[]>;
  loadingDimensions: boolean;
  loadingValues: boolean;
  loadDimensions: () => Promise<FilterDimension[]>;
  loadValues: (dimensionId: string, dimension?: FilterDimension) => Promise<void>;
  resetCache: () => void;
}

/**
 * Manages filter dimensions/values with caching.
 * Never imports axios or dataFetcherService.
 */
export const useFilterData = (
  filterDataSource?: FilterDataSource,
  adapter?: FilterDataAdapter
): UseFilterDataReturn => {
  const [dimensions, setDimensions] = useState<FilterDimension[]>([]);
  const [valuesByDimension, setValuesByDimension] = useState<
    Record<string, FilterDimensionValue[]>
  >({});
  const [loadingDimensions, setLoadingDimensions] = useState(false);
  const [loadingValues, setLoadingValues] = useState(false);

  const hasDataSourceConfig = (
    source?: FilterDataSource
  ): source is Extract<FilterDataSource, { url: string }> => {
    if (!source) return false;
    if (!("url" in source)) return false;
    return typeof source.url === "string" && source.url.length > 0;
  };

  const getConfigSource = useCallback(
    (): Extract<FilterDataSource, { url: string }> | undefined =>
      hasDataSourceConfig(filterDataSource) ? filterDataSource : undefined,
    [filterDataSource]
  );

  const fetchResponseData = useCallback(
    async (type: "dimensions" | "values", dimensionId?: string): Promise<unknown | null> => {
      const configSource = getConfigSource();

      if (isCustomProvider(filterDataSource)) {
        return filterDataSource.fetchData({
          type,
          dimensionId,
          dataSource:
            configSource && configSource.dimensionValuesUrl
              ? {
                  url:
                    type === "dimensions"
                      ? (configSource.dimensionsUrl ?? configSource.url)
                      : configSource.dimensionValuesUrl,
                  method: "GET",
                  body: configSource.body,
                  service:
                    type === "dimensions"
                      ? (configSource.dimensionsService ?? configSource.service)
                      : (configSource.dimensionValuesService ??
                        configSource.dimensionsService ??
                        configSource.service),
                }
              : undefined,
        });
      }

      if (configSource && adapter?.fetchRaw) {
        if (type === "values") {
          const valuesUrl = configSource.dimensionValuesUrl;
          if (!valuesUrl) return null;
          const requestUrl = buildDimensionValuesUrl(
            valuesUrl,
            dimensionId ?? "",
            configSource.dimensionValuesService ?? configSource.service
          );
          return adapter.fetchRaw({
            type,
            dimensionId,
            dataSource: {
              url: requestUrl,
              method: "GET",
              body: configSource.body,
              service: configSource.dimensionValuesService ?? configSource.service,
            },
          });
        }

        const requestUrl = buildServiceUrl(
          configSource.dimensionsUrl ?? configSource.url,
          configSource.dimensionsService ?? configSource.service
        );
        return adapter.fetchRaw({
          type,
          dimensionId,
          dataSource: {
            url: requestUrl,
            method: "GET",
            body: configSource.body,
            service: configSource.dimensionsService ?? configSource.service,
          },
        });
      }

      return null;
    },
    [filterDataSource, getConfigSource, adapter]
  );

  const mapDimensions = useCallback((rawDimensions: RawDimension[]): FilterDimension[] => {
    return rawDimensions.map((dimension) => ({
      dimension_id: dimension.dimId,
      label: dimension.metadata?.label || dimension.name,
      type: "string",
    }));
  }, []);

  const mapDimensionValues = useCallback(
    (fieldName: string, values: Array<Record<string, unknown>>): FilterDimensionValue[] =>
      values
        .map((value) => value[fieldName])
        .filter((value): value is string => typeof value === "string" && value !== null)
        .map((value) => ({ value, label: value })),
    []
  );

  const loadDimensions = useCallback(async (): Promise<FilterDimension[]> => {
    if (dimensions.length > 0) {
      return dimensions;
    }

    setLoadingDimensions(true);
    try {
      if (adapter?.loadDimensions) {
        const loaded = await adapter.loadDimensions();
        setDimensions(loaded);
        return loaded;
      }

      const responseData = await fetchResponseData("dimensions");
      if (responseData) {
        const parsed = parseFilterDimensionsResponse(responseData, mapDimensions);
        if (parsed) {
          setDimensions(parsed);
          return parsed;
        }
      }

      console.error(
        "[FilterBar] No dimensions loaded. Provide FilterDataAdapter.loadDimensions or FilterDataSource.fetchData."
      );
      return [];
    } catch (error) {
      console.error("Failed to fetch filter dimensions:", error);
      return [];
    } finally {
      setLoadingDimensions(false);
    }
  }, [dimensions, fetchResponseData, mapDimensions, adapter]);

  const loadValues = useCallback(
    async (dimensionId: string, dimensionOverride?: FilterDimension): Promise<void> => {
      const dimension = dimensionOverride || dimensions.find((d) => d.dimension_id === dimensionId);

      if (!dimension || dimension.type !== "string") {
        return;
      }

      if (valuesByDimension[dimensionId]) {
        return;
      }

      setLoadingValues(true);
      try {
        if (adapter?.loadValues) {
          const loaded = await adapter.loadValues(dimensionId);
          setValuesByDimension((prev) => ({ ...prev, [dimensionId]: loaded }));
          return;
        }

        const responseData = await fetchResponseData("values", dimensionId);
        if (responseData) {
          const parsedValues = parseFilterValuesResponse(responseData, mapDimensionValues);
          if (parsedValues) {
            setValuesByDimension((prev) => ({
              ...prev,
              [dimensionId]: parsedValues,
            }));
            return;
          }
        }

        setValuesByDimension((prev) => ({ ...prev, [dimensionId]: [] }));
        console.error(
          `[FilterBar] No values for ${dimensionId}. Provide FilterDataAdapter.loadValues or FilterDataSource.fetchData.`
        );
      } catch (error) {
        console.error(`Failed to fetch values for dimension ${dimensionId}:`, error);
      } finally {
        setLoadingValues(false);
      }
    },
    [dimensions, fetchResponseData, mapDimensionValues, valuesByDimension, adapter]
  );

  const resetCache = useCallback(() => {
    setDimensions([]);
    setValuesByDimension({});
  }, []);

  return {
    dimensions,
    valuesByDimension,
    loadingDimensions,
    loadingValues,
    loadDimensions,
    loadValues,
    resetCache,
  };
};

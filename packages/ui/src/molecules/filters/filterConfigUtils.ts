import type {
  FetchFilterDataCallback,
  FilterDataSource,
} from "./filter-bar";
import type { FilterDimension, FilterDimensionValue } from "./types";

/** Minimal dimension shape used when parsing legacy API arrays. */
export type RawDimension = {
  name: string;
  dimId: string;
  metadata: {
    label: string;
    description: string;
  };
};

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const isFilterDimension = (value: unknown): value is FilterDimension => {
  if (!isRecord(value)) return false;
  return (
    typeof value["dimension_id"] === "string" &&
    typeof value["label"] === "string" &&
    typeof value["type"] === "string"
  );
};

export const isFilterDimensionValues = (value: unknown): value is FilterDimensionValue[] => {
  if (!Array.isArray(value)) return false;
  return value.every(
    (item) =>
      isRecord(item) && typeof item["value"] === "string" && typeof item["label"] === "string"
  );
};

/**
 * Library does not resolve PROXY service keys — host should pass absolute or
 * already-proxied URLs, or use `fetchData` / FilterDataAdapter instead.
 */
export const buildServiceUrl = (url: string, _service?: string): string => url;

export const buildDimensionValuesUrl = (
  url: string,
  dimensionId: string,
  service?: string
): string => {
  const baseUrl = buildServiceUrl(url, service);

  if (baseUrl.includes("{dimensionId}")) {
    return baseUrl.replace("{dimensionId}", encodeURIComponent(dimensionId));
  }

  if (baseUrl.includes(":dimensionId")) {
    return baseUrl.replace(":dimensionId", encodeURIComponent(dimensionId));
  }

  if (baseUrl.includes("dimension_id=")) {
    return baseUrl;
  }

  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}dimension_id=${encodeURIComponent(dimensionId)}`;
};

export const isCustomProvider = (
  source?: FilterDataSource
): source is {
  fetchData: FetchFilterDataCallback;
} => {
  if (!source) return false;
  if (!("fetchData" in source)) return false;
  return typeof source.fetchData === "function";
};

export function parseFilterDimensionsResponse(
  responseData: unknown,
  mapDimensions: (rawDimensions: RawDimension[]) => FilterDimension[]
): FilterDimension[] | null {
  if (isRecord(responseData) && Array.isArray(responseData["dimensions"])) {
    const dimensionsData = responseData["dimensions"];
    if (dimensionsData.every(isFilterDimension)) {
      return dimensionsData;
    }
  }

  if (Array.isArray(responseData)) {
    const rawDimensions: RawDimension[] = [];
    responseData.forEach((item) => {
      if (!isRecord(item)) return;
      if (typeof item["dimId"] !== "string") return;
      const metadata = isRecord(item["metadata"])
        ? {
            label: String(item["metadata"]["label"] ?? item["name"] ?? item["dimId"]),
            description: String(item["metadata"]["description"] ?? ""),
          }
        : { label: String(item["name"] ?? item["dimId"]), description: "" };

      rawDimensions.push({
        dimId: item["dimId"],
        name: String(item["name"] ?? item["dimId"]),
        metadata,
      });
    });

    return mapDimensions(rawDimensions);
  }

  return null;
}

export function parseFilterValuesResponse(
  responseData: unknown,
  mapDimensionValues: (
    fieldName: string,
    values: Array<Record<string, unknown>>
  ) => FilterDimensionValue[]
): FilterDimensionValue[] | null {
  const responseValues = isRecord(responseData) ? responseData["values"] : undefined;
  if (isFilterDimensionValues(responseValues)) {
    return responseValues;
  }

  if (isRecord(responseData) && isRecord(responseData["data"])) {
    const data = responseData["data"];
    if (isRecord(data) && Array.isArray(data["schema"]) && Array.isArray(data["values"])) {
      const schema = data["schema"];
      const fieldName = schema.find(
        (field) => isRecord(field) && typeof field["name"] === "string"
      )?.["name"];
      if (typeof fieldName === "string") {
        return mapDimensionValues(fieldName, data["values"].filter(isRecord));
      }
    }
  }

  return null;
}

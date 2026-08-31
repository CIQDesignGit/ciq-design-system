/**
 * Table fetch helpers — no axios. Hosts inject fetch via `fetchData` / adapter.
 */

import type { APIRequestPayload } from "../types/schema";
import type { TableRow } from "./rows-transformer";
import { toTableRows } from "./rows-transformer";

export type DataSourceConfig = {
  url: string;
  method: "GET" | "POST";
  service?: string;
  body?: Record<string, unknown>;
};

export type FetchOptions<TPayload = Record<string, unknown>> = {
  dataSource: DataSourceConfig;
  payload?: TPayload;
  signal?: AbortSignal;
  /** Host-provided fetch — required when not using useBaseDataTableData customFetchData */
  fetchRaw?: (options: {
    dataSource: DataSourceConfig;
    payload?: TPayload;
    signal?: AbortSignal;
  }) => Promise<unknown>;
  onSettled?: () => void;
};

export type FetchResult<TData = Record<string, unknown>> = {
  data: TData[];
  total: number;
  overallRow?: TData | null;
  metadata?: Record<string, unknown>;
  page?: {
    row_count?: number;
    total_count?: number;
  };
};

/** Host owns proxy/service URL resolution — library returns the URL as-is. */
export function buildUrl(dataSource: DataSourceConfig): string {
  return dataSource.url;
}

export function isAbortError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.name === "AbortError" || error.name === "CanceledError";
  }
  return false;
}

function isFlatResponse(response: unknown): boolean {
  return (
    typeof response === "object" &&
    response !== null &&
    "data" in response &&
    Array.isArray((response as { data: unknown[] }).data)
  );
}

function extractTotalRow(
  rows: TableRow[],
  firstColumnField?: string
): { data: TableRow[]; overallRow: TableRow | null } {
  if (!firstColumnField) {
    return { data: rows, overallRow: null };
  }

  const overallRowIndex = rows.findIndex((row) => {
    const dimValue = row[firstColumnField];
    return dimValue === undefined || dimValue === null;
  });

  if (overallRowIndex === -1) {
    return { data: rows, overallRow: null };
  }

  const overallRow = {
    ...rows[overallRowIndex],
    _isTotalRow: true,
    [firstColumnField]: { value: "Consolidated Total" },
  };

  const data = rows.filter((_, index) => index !== overallRowIndex);

  return { data, overallRow };
}

export function normalizeResponse<TData>(
  rawResponse: unknown,
  payload?: Partial<APIRequestPayload>
): FetchResult<TData> {
  const includeOverall = payload?.include_overall ?? false;
  const firstColumnField = payload?.select?.dimensions?.[0];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = rawResponse as any;

  if (isFlatResponse(rawResponse)) {
    const data = raw.data as TData[];
    const rawTotal = raw.total ?? raw.page?.total_count ?? raw.page?.row_count;
    const total = Number.isFinite(rawTotal) ? rawTotal : data.length;
    return { data, total, overallRow: null, metadata: raw.metadata, page: raw.page };
  }

  const transformedRows = toTableRows(raw, { includeOverall });
  const rawTotal = raw.total ?? raw.page?.total_count ?? raw.page?.row_count;

  if (includeOverall && firstColumnField) {
    const { data, overallRow } = extractTotalRow(transformedRows, firstColumnField);
    const total = Number.isFinite(rawTotal) ? rawTotal : data.length;

    return {
      data: data as TData[],
      total,
      overallRow: overallRow as TData | null,
      metadata: raw.data?.metadata,
      page: raw.page,
    };
  }

  const total = Number.isFinite(rawTotal) ? rawTotal : transformedRows.length;

  return {
    data: transformedRows as TData[],
    total,
    overallRow: null,
    metadata: raw.data?.metadata,
    page: raw.page,
  };
}

export async function fetchTableDataFromDataSource<TData = Record<string, unknown>>(
  options: FetchOptions<APIRequestPayload>
): Promise<FetchResult<TData>> {
  if (!options.fetchRaw) {
    throw new Error(
      "fetchTableDataFromDataSource requires fetchRaw. Pass UseBaseDataTableDataOptions.fetchData instead, or provide fetchRaw."
    );
  }

  const rawResponse = await options.fetchRaw({
    dataSource: options.dataSource,
    payload: options.payload,
    signal: options.signal,
  });
  const result = normalizeResponse<TData>(rawResponse, options.payload);
  options.onSettled?.();
  return result;
}

export default fetchTableDataFromDataSource;

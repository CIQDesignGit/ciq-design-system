import type { SortingState } from "@tanstack/react-table";

import type {
  APIComparePeriodPayload,
  APIFilterAnyClause,
  APIFilterCondition,
  APIFilterNot,
  APIFilterOperator,
  APIFilterPayload,
  APIPaginationPayload,
  APIRequestPayload,
  APISelectPayload,
  APISortPayload,
  BreakdownDimension,
  ColumnSchema,
  DateRangeMetadata,
  FilterMetadata,
  PaginationMetadata,
  WidgetV2Schema,
} from "../types";
import { unwrapValue } from "./breakdown-helpers";

// ============================================
// Compare Period Payload
// ============================================

function buildComparePeriodPayload(
  dateRange?: DateRangeMetadata,
  dateField: string = "date"
): APIComparePeriodPayload | undefined {
  if (!dateRange?.from || !dateRange?.to) return undefined;

  return {
    current: { start: dateRange.from, end: dateRange.to },
    previous: { start: dateRange.pvp_from ?? "", end: dateRange.pvp_to ?? "" },
    date_field: dateField,
  };
}

function buildPaginationPayload(pagination: PaginationMetadata): APIPaginationPayload {
  return {
    limit_rows: pagination.pageSize,
  };
}

function collectFieldsByRole(
  columns: ColumnSchema[],
  metrics: string[] = [],
  dimensions: string[] = []
): { metrics: string[]; dimensions: string[] } {
  for (const column of columns) {
    // If column has children, recurse into them
    if (column.children && column.children.length > 0) {
      collectFieldsByRole(column.children, metrics, dimensions);
    } else {
      // Leaf node - add to appropriate array based on role
      if (column.role === "dimension") {
        dimensions.push(column.field);
      } else {
        metrics.push(column.field);
      }
    }
  }

  return { metrics, dimensions };
}

function buildSelectPayload(columns: ColumnSchema[]): APISelectPayload {
  const { metrics, dimensions } = collectFieldsByRole(columns);
  return { metrics, dimensions };
}

/** Map host FilterOperator → API payload operators (eq → equals, etc.). */
function toAPIFilterOperator(op: FilterMetadata["op"]): APIFilterOperator {
  if (op === "eq") return "equals";
  // Host may carry extras like "any"; treat unknown as equals-safe cast
  return op as APIFilterOperator;
}

function convertToFilterCondition(filter: FilterMetadata): APIFilterCondition {
  const condition: APIFilterCondition = {
    op: toAPIFilterOperator(filter.op),
    field: filter.name,
  };

  // Add values array if present
  if (filter.value && filter.value.length > 0) {
    condition.values = filter.value;
  }

  return condition;
}

function buildFilterPayload(filters: FilterMetadata[]): APIFilterPayload | undefined {
  if (!filters || filters.length === 0) {
    return undefined;
  }

  return {
    where: {
      all: filters.map(convertToFilterCondition),
    },
  };
}

export function buildSortPayload(sorting: SortingState): APISortPayload {
  return {
    by: sorting.map((sort) => ({
      field: sort.id,
      order: sort.desc ? "desc" : "asc",
      null_handling: "last" as const,
    })),
  };
}

// ============================================
// Base Payload Builder (shared by all API payloads)
// ============================================

type BasePayloadOptions = {
  schema: WidgetV2Schema;
  filters?: FilterMetadata[]; // Optional override (defaults to schema.top.metadata.filters)
  sorting?: SortingState; // Optional sorting state
  pagination?: PaginationMetadata; // Optional pagination
};

function buildBasePayload(options: BasePayloadOptions): Partial<APIRequestPayload> {
  const { schema, filters: filterOverride, sorting, pagination } = options;
  const metadata = schema.top?.metadata;

  // Use override filters if provided, otherwise use schema metadata filters
  const filters = filterOverride ?? metadata?.filters ?? [];

  const payload: Partial<APIRequestPayload> = {
    aggregate_metrics: false,
  };

  // Add filters
  const filterPayload = buildFilterPayload(filters);
  if (filterPayload) {
    payload.filter = filterPayload;
  }

  // Add compare_period from dateRange
  const comparePeriod = buildComparePeriodPayload(metadata?.dateRange);
  if (comparePeriod) {
    payload.compare_period = comparePeriod;
  }

  // Add enablePvp if present
  if (metadata?.enablePvp !== undefined) {
    payload.enablePvp = metadata.enablePvp;
  }

  if (metadata?.competitor_enabled) {
    payload.competitor_enabled = true;
  }
  if (metadata?.category_leader_enabled) {
    payload.category_leader_enabled = true;
  }

  // Add sorting if present
  if (sorting && sorting.length > 0) {
    payload.sort = buildSortPayload(sorting);
  }

  // Add pagination if present
  if (pagination) {
    payload.pagination = buildPaginationPayload(pagination);
  }

  return payload;
}

// ============================================
// Main API Payload Builder
// ============================================

export function buildAPIPayload(
  schema: WidgetV2Schema,
  pagination: PaginationMetadata,
  sorting: SortingState,
  filters: FilterMetadata[],
  includeOverall: boolean = false
): APIRequestPayload {
  const basePayload = buildBasePayload({ schema, filters, sorting, pagination });

  return {
    ...basePayload,
    select: buildSelectPayload(schema.body.content.schema.columns),
    aggregate_metrics: false,
    include_overall: includeOverall,
  } as APIRequestPayload;
}

// ============================================
// SubRow Payload Builder
// ============================================

export function buildSubRowPayload(
  schema: WidgetV2Schema,
  parentFilters: Array<{ field: string; value: string | number }>,
  breakdownDimension: string,
  metricFields: string[],
  sorting?: SortingState,
  filters?: FilterMetadata[]
): APIRequestPayload {
  const basePayload = buildBasePayload({ schema, sorting, filters });

  const parentFilterConditions: APIFilterCondition[] = parentFilters.map(({ field, value }) => ({
    op: "equals",
    field,
    value,
  }));

  const allClauses: (APIFilterCondition | APIFilterAnyClause | APIFilterNot)[] = [
    ...parentFilterConditions,
    ...(basePayload.filter?.where.all ?? []),
  ];

  return {
    ...basePayload,
    select: {
      dimensions: [breakdownDimension],
      metrics: metricFields,
    },
    aggregate_metrics: false,
    filter: allClauses.length > 0 ? { where: { all: allClauses } } : undefined,
  } as APIRequestPayload;
}

export function extractParentFilters<TData extends Record<string, unknown>>(
  rowData: TData,
  depth: number,
  primaryField: string,
  hierarchy: BreakdownDimension[],
  getParentRow?: () => { original: TData; depth: number; getParentRow?: () => unknown } | undefined
): Array<{ field: string; value: string | number }> {
  const filters: Array<{ field: string; value: string | number }> = [];

  // Add current row's filter
  const currentField = depth === 0 ? primaryField : hierarchy[depth - 1]?.field;
  if (currentField) {
    const rawValue = rowData[currentField];
    const value = unwrapValue(rawValue);
    if (value !== null) {
      filters.push({
        field: currentField,
        value,
      });
    }
  }

  // Traverse up the parent chain
  if (getParentRow) {
    let parent = getParentRow();
    while (parent) {
      const parentField = parent.depth === 0 ? primaryField : hierarchy[parent.depth - 1]?.field;
      if (parentField) {
        const rawValue = parent.original[parentField];
        const value = unwrapValue(rawValue);
        if (value !== null) {
          // Insert at beginning to maintain root-to-leaf order
          filters.unshift({
            field: parentField,
            value,
          });
        }
      }
      parent = parent.getParentRow?.() as typeof parent | undefined;
    }
  }

  return filters;
}

export default buildAPIPayload;

import type { Row } from "@tanstack/react-table";

import type { BreakdownConfigFromSchema, BreakdownDimension, ColumnSchema } from "../types";

// Handles Genie data format where dimensions/metrics are: { value: X, ...metadata }
export function unwrapValue(value: unknown): string | number | null {
  if (
    value &&
    typeof value === "object" &&
    "value" in value &&
    (typeof (value as { value: unknown }).value === "string" ||
      typeof (value as { value: unknown }).value === "number")
  ) {
    return (value as { value: string | number }).value;
  }
  if (typeof value === "string" || typeof value === "number") {
    return value;
  }
  return null;
}

// Validates that only ONE column can have breakdownHierarchy
export function getBreakdownConfig(columns: ColumnSchema[]): BreakdownConfigFromSchema {
  // Find ALL columns with breakdownHierarchy for validation
  const columnsWithBreakdown = columns.filter(
    (c) => c.role === "dimension" && c.breakdownHierarchy && c.breakdownHierarchy.length > 0
  );

  // Validation: Only one column can have breakdownHierarchy
  if (columnsWithBreakdown.length > 1) {
    return {
      enabled: false,
      primaryDimension: null,
      hierarchy: [],
      error: {
        type: "MULTIPLE_BREAKDOWN_COLUMNS",
        message: `Invalid configuration: Only one column can have breakdownHierarchy. Found ${columnsWithBreakdown.length} columns with breakdown configuration.`,
        columns: columnsWithBreakdown.map((c) => c.field),
      },
    };
  }

  // No breakdown configured
  if (columnsWithBreakdown.length === 0) {
    return { enabled: false, primaryDimension: null, hierarchy: [] };
  }

  // Valid single column with breakdown
  const dimCol = columnsWithBreakdown[0];
  return {
    enabled: true,
    primaryDimension: dimCol, // Full column schema for level 0
    hierarchy: dimCol.breakdownHierarchy!, // Array of { field, type } for sub-levels
  };
}

export function getDimensionAtDepth(
  primaryColumn: ColumnSchema,
  hierarchy: BreakdownDimension[],
  depth: number
): { field: string; type: string } | undefined {
  if (depth === 0) {
    // Root level uses primary column's field and type
    return { field: primaryColumn.field, type: primaryColumn.type ?? "default" };
  }
  // Sub-levels use hierarchy definition
  // depth 1 → hierarchy[0], depth 2 → hierarchy[1]
  return hierarchy[depth - 1];
}

export function getBreakdownDimensionField(
  hierarchy: BreakdownDimension[],
  depth: number
): string | undefined {
  // depth 0 rows expand to hierarchy[0], depth 1 rows expand to hierarchy[1], etc.
  return hierarchy[depth]?.field;
}

// Format: "{value}_{index}" for root, "{parentId}:{value}_{index}" for children
export function buildRowId<TData extends Record<string, unknown>>(
  row: TData,
  depth: number,
  primaryField: string,
  hierarchy: BreakdownDimension[],
  index: number,
  parentId?: string
): string {
  const field = depth === 0 ? primaryField : hierarchy[depth - 1]?.field;

  if (!field) {
    // Fallback: use index only
    return parentId ? `${parentId}:_${index}` : `_${index}`;
  }

  const rawValue = row[field];
  const value = unwrapValue(rawValue);
  const valueStr = String(value ?? "unknown");

  // Include index for uniqueness: "Shark_0", "Shark_1"
  const idPart = `${valueStr}_${index}`;

  return parentId ? `${parentId}:${idPart}` : idPart;
}

export function canRowExpandAtDepth(depth: number, hierarchy: BreakdownDimension[]): boolean {
  // A row can expand if there's a next level in the hierarchy
  // depth 0 can expand if hierarchy[0] exists
  // depth 1 can expand if hierarchy[1] exists
  return depth < hierarchy.length;
}

export function canRowExpand<TData>(row: Row<TData>, hierarchy: BreakdownDimension[]): boolean {
  return canRowExpandAtDepth(row.depth, hierarchy);
}

export function getRowIdFromTanStackRow<TData extends Record<string, unknown>>(
  row: Row<TData>,
  primaryField: string,
  hierarchy: BreakdownDimension[]
): string {
  const parts: string[] = [];
  let currentRow: Row<TData> | undefined = row;

  while (currentRow) {
    const depth = currentRow.depth;
    const field = depth === 0 ? primaryField : hierarchy[depth - 1]?.field;
    const index = currentRow.index;

    if (field) {
      const rawValue = (currentRow.original as Record<string, unknown>)[field];
      const value = unwrapValue(rawValue);
      // Include index: "Shark_0", "SKU123_2"
      parts.unshift(`${String(value ?? "unknown")}_${index}`);
    } else {
      parts.unshift(`_${index}`);
    }

    currentRow = currentRow.getParentRow();
  }

  return parts.join(":");
}

export function getMetricFields(columns: ColumnSchema[]): string[] {
  return columns.filter((c) => c.role === "metric").map((c) => c.field);
}

export function isBreakdownEnabled(columns: ColumnSchema[]): boolean {
  return columns.some(
    (c) => c.role === "dimension" && c.breakdownHierarchy && c.breakdownHierarchy.length > 0
  );
}

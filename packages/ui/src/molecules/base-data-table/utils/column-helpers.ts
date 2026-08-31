/**
 * Column Helper Utilities
 * Helper functions for working with column definitions and metadata
 */

import type { Column } from "@tanstack/react-table";

import { VISIBILITY } from "../constants";
import { cn } from "@/lib/utils";

import type { BaseDataTableColumnMeta, ColumnSchema } from "../types";

/**
 * Get column schema from TanStack column
 */
export function getColumnSchema<TData = Record<string, unknown>>(
  column: Column<TData>
): ColumnSchema | undefined {
  const meta = column.columnDef.meta as BaseDataTableColumnMeta | undefined;
  return meta?.columnSchema;
}

/**
 * Check if a column has custom sort configuration
 */
export function hasCustomSort(column: Column<unknown>): boolean {
  const schema = getColumnSchema(column);
  return !!(schema?.sort?.custom && schema.sort.custom.length > 0);
}

/**
 * Get custom sort fields for a column
 */
export function getCustomSortFields(
  column: Column<unknown>
): Array<{ field: string; dir: "asc" | "desc" }> | undefined {
  const schema = getColumnSchema(column);
  return schema?.sort?.custom;
}

/**
 * Check if column supports PvP (Plan vs Previous) sorting
 */
export function supportsPvPSort(column: Column<unknown>): boolean {
  const schema = getColumnSchema(column);
  return !!(schema?.sort?.pvpAscending !== undefined || schema?.sort?.pvpDescending !== undefined);
}

/**
 * Get column alignment
 */
export function getColumnAlign(column: Column<unknown>): "left" | "center" | "right" {
  const meta = column.columnDef.meta as BaseDataTableColumnMeta | undefined;
  return meta?.align ?? "left";
}

/**
 * Get column tooltip
 */
export function getColumnTooltip(column: Column<unknown>): string | undefined {
  const meta = column.columnDef.meta as BaseDataTableColumnMeta | undefined;
  return meta?.tooltip;
}

/**
 * Check if column is sortable
 */
export function isColumnSortable(column: Column<unknown>): boolean {
  const schema = getColumnSchema(column);
  const visibility = schema?.sort?.visibility ?? VISIBILITY.VISIBLE;
  return visibility === VISIBILITY.VISIBLE && column.getCanSort();
}

/**
 * Get all leaf columns from a column (handles groups)
 */
export function getLeafColumns<TData = Record<string, unknown>>(
  column: Column<TData>
): Column<TData>[] {
  const leafColumns = column.getLeafColumns();
  return leafColumns.length > 0 ? leafColumns : [column];
}

/**
 * Options for computing cell className
 */
export type CellClassNameOptions = {
  align?: "left" | "center" | "right";
  noPadding?: boolean;
  isActive?: boolean;
  pinned?: "left" | "right" | false;
};

/**
 * Computes the className for a table cell based on its properties
 */
export function getCellClassName({
  align = "left",
  noPadding = false,
  isActive = false,
  pinned = false,
}: CellClassNameOptions): string {
  return cn(
    "border-r border-gray-200 relative",
    noPadding ? "p-0" : "p-2",
    {
      "text-left": align === "left",
      "text-center": align === "center",
      "text-right": align === "right",
    },
    isActive && "opacity-40",
    pinned && "bg-muted/20",
    pinned === "left" && "shadow-[inset_-1px_0_0_0_rgba(0,0,0,0.03)]",
    pinned === "right" && "shadow-[inset_1px_0_0_0_rgba(0,0,0,0.03)]"
  );
}

export default {
  getColumnSchema,
  hasCustomSort,
  getCustomSortFields,
  supportsPvPSort,
  getColumnAlign,
  getColumnTooltip,
  isColumnSortable,
  getLeafColumns,
  getCellClassName,
};

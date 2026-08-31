import type { ColumnDef, Row } from "@tanstack/react-table";

import { VISIBILITY } from "../constants";

import { getCell } from "../cells";
import type { BaseDataTableColumnMeta, CellRenderer, ColumnSchema, HeaderRenderer } from "../types";

/**
 * Options for schema transformation
 */
export type TransformSchemaOptions<TData = Record<string, unknown>> = {
  cellRendererOverrides?: Record<string, CellRenderer<TData>>;
  headerRendererOverrides?: Record<string, HeaderRenderer>;
};

// Priority: field override > global registry > default cell
function createCellRenderer<TData = Record<string, unknown>>(
  column: ColumnSchema,
  cellRendererOverrides?: Record<string, CellRenderer<TData>>
): CellRenderer<TData> {
  // Check for field-specific override first (highest priority)
  if (cellRendererOverrides && column.field in cellRendererOverrides) {
    return cellRendererOverrides[column.field] as CellRenderer<TData>;
  }

  // Get base cell type
  const cellType = column.type || "default";

  // Return a wrapper that automatically selects highlight variant if needed
  return ((props) => {
    const value = props.value;

    // Check if value has highlight property - use highlight variant
    const hasHighlight = value && typeof value === "object" && "highlight" in value;
    const typeToUse = hasHighlight ? `${cellType}_highlight` : cellType;

    // Try to get the appropriate cell renderer
    let registeredCell = getCell(typeToUse);

    // Fallback to base type if highlight variant doesn't exist
    if (!registeredCell && hasHighlight) {
      registeredCell = getCell(cellType);
    }

    // Final fallback to default cell
    if (!registeredCell) {
      registeredCell = getCell("default");
    }

    if (registeredCell) {
      // Explicitly construct props compatible with RegisteredCellRendererProps
      return registeredCell({
        value: props.value,
        row: props.row,
        column: props.column,
        rowIndex: props.rowIndex,
        columnId: props.columnId,
        tanstackRow: props.tanstackRow,
      });
    }

    return String(value);
  }) as CellRenderer<TData>;
}

function transformColumn<TData extends Record<string, unknown> = Record<string, unknown>>(
  column: ColumnSchema,
  options: TransformSchemaOptions<TData> = {}
): ColumnDef<TData> {
  const { cellRendererOverrides, headerRendererOverrides } = options;

  // Handle grouped columns (with children)
  if (column.children && column.children.length > 0) {
    return {
      id: column.field,
      header: column.label,
      columns: column.children.map((child) => transformColumn(child, options)),
      meta: {
        tooltip: column.tooltip,
        align: column.align ?? "center",
        columnSchema: column,
      } as BaseDataTableColumnMeta,
    };
  }

  // Regular leaf column
  const cellRenderer = createCellRenderer<TData>(column, cellRendererOverrides);
  const meta: BaseDataTableColumnMeta = {
    tooltip: column.tooltip,
    align: column.align ?? "left",
    columnSchema: column,
    cellRenderer: cellRenderer as CellRenderer,
  };

  // Determine if sorting is enabled for this column based on sort.visibility
  const sortVisibility = column.sort?.visibility ?? VISIBILITY.VISIBLE;
  const enableSorting = sortVisibility === VISIBILITY.VISIBLE;

  // Check for custom header renderer
  const customHeaderRenderer = headerRendererOverrides?.[column.field];

  // Calculate minimum width based on header label length
  // ~8px per character + 48px for padding/icons (sort, menu, etc.)
  const headerBasedMinWidth = Math.max(80, (column.label?.length ?? 0) * 8 + 48);

  // Use column width if specified, otherwise use header-based width
  const columnSize = column.width ?? headerBasedMinWidth;
  // Use explicit width or header-based width as minSize to prevent shrinking
  const columnMinSize = column.width ?? headerBasedMinWidth;

  const columnDef: ColumnDef<TData> = {
    id: column.field,
    accessorKey: column.field,
    header: customHeaderRenderer
      ? () => customHeaderRenderer({ columnId: column.field, column })
      : column.label,
    meta,
    enableSorting,
    enableResizing: column.resize !== false,
    size: columnSize,
    minSize: columnMinSize,
    maxSize: 800,
    cell: ({ getValue, row, column: tanstackColumn }) => {
      // Get the full value (might be simple value or nested object)
      const value = getValue();
      const rowData = row.original;
      const rowIndex = row.index;

      // Pass the full value to cell renderer - let it handle extraction
      // Include tanstackRow for advanced use cases (expansion, depth, etc.)
      return cellRenderer({
        value,
        row: rowData,
        column,
        rowIndex,
        columnId: tanstackColumn.id,
        tanstackRow: row as Row<TData>,
      });
    },
  };

  return columnDef;
}

export function transformSchemaToColumns<
  TData extends Record<string, unknown> = Record<string, unknown>,
>(columns: ColumnSchema[], options: TransformSchemaOptions<TData> = {}): ColumnDef<TData>[] {
  // Filter out hidden columns - they stay in schema for API but don't render
  const visibleColumns = columns.filter((col) => {
    const isHidden = col.width === 0 || col.hidden === true;
    return !isHidden;
  });

  return visibleColumns.map((column) => transformColumn(column, options));
}

export function extractLeafColumnIds(columns: ColumnSchema[]): string[] {
  const ids: string[] = [];

  function traverse(cols: ColumnSchema[]) {
    for (const col of cols) {
      if (col.children && col.children.length > 0) {
        traverse(col.children);
      } else {
        ids.push(col.field);
      }
    }
  }

  traverse(columns);
  return ids;
}

export function getDefaultColumnOrder(columns: ColumnSchema[]): string[] {
  return extractLeafColumnIds(columns);
}

export default transformSchemaToColumns;

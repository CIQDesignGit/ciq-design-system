import type { Row } from "@tanstack/react-table";
import React, { useCallback, useMemo } from "react";

import { ExpandableCell } from "./expandable-cell";

import { getCell } from "../cells";
import { LoadMoreRow } from "../cells/LoadMoreRow";
import { NoDataRow } from "../cells/NoDataRow";
import { BaseDataTable } from "../core/BaseDataTable";
import { useRowBreakdown } from "../hooks/useRowBreakdown";
import type {
  AugmentedRow,
  BaseDataTableProps,
  CellRenderer,
  CellRendererProps,
  ColumnSchema,
  ExpandConfig,
  SpecialRowRenderer,
  SpecialRowRendererProps,
} from "../types";

// ============================================
// Types
// ============================================

export type ExpandableTableProps<TData extends Record<string, unknown>> = Omit<
  BaseDataTableProps<TData>,
  "expandConfig" | "specialRowRenderer"
> & {
  readonly onSubRowMetadata?: (metadata: Record<string, unknown>) => void;
};

// ============================================
// Helper: Get cell renderer based on depth
// ============================================

function getBaseCellRenderer<TData = Record<string, unknown>>(
  cellType: string
): CellRenderer<TData> {
  return ((props: CellRendererProps<TData>) => {
    const value = props.value;

    // Check if value has highlight property - use highlight variant
    const hasHighlight = value && typeof value === "object" && "highlight" in value;
    const typeToUse = hasHighlight ? `${cellType}_highlight` : cellType;

    let registeredCell = getCell(typeToUse);

    if (!registeredCell && hasHighlight) {
      registeredCell = getCell(cellType);
    }

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

// ============================================
// Component
// ============================================

export function ExpandableTable<TData extends Record<string, unknown>>({
  schema,
  data,
  overallRow,
  state,
  cellRenderers: userCellRenderers,
  headerRenderers,
  onSubRowMetadata,
  ...props
}: ExpandableTableProps<TData>) {
  // All expansion logic lives here via the breakdown hook
  const breakdown = useRowBreakdown<TData>({
    schema,
    tableState: state,
    filterDeps: [state.filters],
    paginationDeps: [state.pagination],
    onSubRowMetadata,
  });

  // Augment data with sub-rows and marker rows
  // Prepend overallRow first (if provided) to match BaseDataTable's tableData ordering
  // This ensures row indices are consistent between cache and TanStack Table
  const augmentedData = useMemo(() => {
    const dataWithOverall = overallRow ? [overallRow, ...data] : data;

    if (!breakdown.breakdownEnabled) return dataWithOverall;
    return breakdown.augmentDataWithSubRows(dataWithOverall);
  }, [data, overallRow, breakdown]);

  // Create expandable cell renderer for the primary column
  // Uses tanstackRow from CellRendererProps for access to depth, expansion state, etc.
  const expandableCellRenderer: CellRenderer<TData> = useCallback(
    (props: CellRendererProps<TData>): React.ReactNode => {
      const { value, row: rowData, column, rowIndex, columnId, tanstackRow } = props;

      // If no tanstackRow or breakdown not enabled, render normally
      if (!tanstackRow || !breakdown.breakdownEnabled) {
        const baseCellRenderer = getBaseCellRenderer<TData>(column.type ?? "default");
        return baseCellRenderer(props) as React.ReactNode;
      }

      const augmented = rowData as AugmentedRow<TData>;
      const depth = tanstackRow.depth;
      const isLoading = Boolean(augmented._isLoading);
      const isExpanded = tanstackRow.getIsExpanded();

      // Total row should not be expandable
      const isTotalRow = Boolean(rowData._isTotalRow);
      const canExpand = isTotalRow ? false : breakdown.canRowExpand(tanstackRow);

      // Get the hierarchy for depth-based rendering
      const hierarchy = breakdown.breakdownConfig.hierarchy;
      const primaryColumn = breakdown.breakdownConfig.primaryDimension;

      // Determine the correct field for this depth
      const currentField = depth === 0 ? primaryColumn?.field : hierarchy[depth - 1]?.field;

      // Get value from the correct field (not the accessor value)
      const depthValue = currentField ? (rowData as Record<string, unknown>)[currentField] : value;

      // Determine cell type based on depth
      const currentType =
        depth === 0
          ? (primaryColumn?.type ?? "default")
          : (hierarchy[depth - 1]?.type ?? "default");

      // Create modified column schema with correct type for this depth
      const depthColumn: ColumnSchema = {
        ...column,
        type: currentType,
      };

      // Prefer field-specific user override, then fall back to registry by type
      const depthCellRenderer =
        currentField && userCellRenderers?.[currentField]
          ? userCellRenderers[currentField]
          : getBaseCellRenderer<TData>(currentType);

      const innerContent = depthCellRenderer({
        value: depthValue,
        row: rowData,
        column: depthColumn,
        rowIndex,
        columnId,
        tanstackRow,
      });

      return (
        <ExpandableCell
          isExpanded={isExpanded}
          onToggle={() => breakdown.handleToggleExpand(tanstackRow as Row<TData>)}
          isLoading={isLoading}
          hasSubRows={canExpand}
          depth={depth}
        >
          {innerContent as React.ReactNode}
        </ExpandableCell>
      );
    },
    [breakdown, userCellRenderers]
  );

  // Build cellRenderers with the expandable cell renderer for the primary column
  const cellRenderers = useMemo(() => {
    // If breakdown is not enabled, just use user renderers
    if (!breakdown.breakdownEnabled || !breakdown.breakdownConfig.primaryDimension) {
      return userCellRenderers;
    }

    const primaryField = breakdown.breakdownConfig.primaryDimension.field;

    return {
      ...userCellRenderers,
      [primaryField]: expandableCellRenderer,
    };
  }, [
    userCellRenderers,
    breakdown.breakdownEnabled,
    breakdown.breakdownConfig.primaryDimension,
    expandableCellRenderer,
  ]);

  // Special row renderer for LoadMore and NoData markers
  const specialRowRenderer: SpecialRowRenderer<TData> = useCallback(
    ({
      row,
      rowData,
      columnCount,
      virtualStart,
      measureRef,
      dataIndex,
    }: SpecialRowRendererProps<TData>) => {
      const augmented = rowData as AugmentedRow<TData>;

      // Check if this is a NoData marker row
      if (augmented._isNoDataRow) {
        return (
          <NoDataRow
            key={`no-data-${dataIndex}`}
            depth={augmented._depth ?? 0}
            columnCount={columnCount}
            virtualRef={measureRef}
            dataIndex={dataIndex}
            className="flex absolute w-full"
            style={{ transform: `translateY(${virtualStart}px)` }}
          />
        );
      }

      // Check if this is a LoadMore marker row
      if (augmented._isLoadMoreRow) {
        const parentRow = row.getParentRow();

        return (
          <LoadMoreRow
            key={`load-more-${dataIndex}`}
            depth={augmented._depth ?? 0}
            columnCount={columnCount}
            isLoading={augmented._isLoading ?? false}
            hasError={!!augmented._loadMoreError}
            onLoadMore={() => {
              if (parentRow) breakdown.handleLoadMore(parentRow);
            }}
            onRetry={() => {
              if (parentRow) breakdown.handleRetryLoadMore(parentRow);
            }}
            virtualRef={measureRef}
            dataIndex={dataIndex}
            className="flex absolute w-full"
            style={{ transform: `translateY(${virtualStart}px)` }}
          />
        );
      }

      // Not a special row, render normally
      return null;
    },
    [breakdown]
  );

  // Expansion config for TanStack
  const expandConfig: ExpandConfig<TData> | undefined = useMemo(() => {
    if (!breakdown.breakdownEnabled || !breakdown.onExpandedChange) return undefined;

    return {
      expanded: breakdown.expanded,
      onExpandedChange: breakdown.onExpandedChange,
      getSubRows: (row: TData) => (row as AugmentedRow<TData>).subRows as TData[] | undefined,
      getRowId: (row: TData, index: number, parent?: Row<TData>) =>
        breakdown.getRowId(row, parent ? parent.depth + 1 : 0, index, parent?.id),
    };
  }, [breakdown]);

  // Show config error if breakdown has issues
  if (breakdown.configError) {
    return (
      <div className="border bg-card p-8 text-center rounded-lg">
        <div className="text-destructive font-semibold mb-2">Invalid Table Configuration</div>
        <div className="text-sm text-muted-foreground mb-2">{breakdown.configError.message}</div>
        {breakdown.configError.type === "MULTIPLE_BREAKDOWN_COLUMNS" && (
          <div className="text-xs text-muted-foreground">
            Columns with breakdownHierarchy:{" "}
            <code className="bg-muted px-1 py-0.5 rounded">
              {breakdown.configError.columns.join(", ")}
            </code>
          </div>
        )}
      </div>
    );
  }

  return (
    <BaseDataTable
      schema={schema}
      data={augmentedData as TData[]}
      overallRow={undefined}
      state={state}
      cellRenderers={cellRenderers}
      headerRenderers={headerRenderers}
      expandConfig={expandConfig}
      specialRowRenderer={breakdown.breakdownEnabled ? specialRowRenderer : undefined}
      {...props}
    />
  );
}

export default ExpandableTable;

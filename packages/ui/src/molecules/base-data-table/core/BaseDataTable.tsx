import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  pointerWithin,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import {
  type ColumnOrderState,
  type ColumnPinningState,
  type ColumnSizingState,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ListMinus } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Table } from "@/atoms/table";
import { TooltipProvider } from "@/atoms/tooltip";
import { cn } from "@/lib/utils";

import { PaginationV2 } from "../pagination/PaginationV2";
import type {
  BaseDataTableProps,
  BaseDataTableStateHandlers,
  CellRenderer,
  HeaderAction,
} from "../types";
import { getDefaultColumnOrder, transformSchemaToColumns } from "../utils/schema-transformer";
import { BaseDataTableBody } from "./BaseDataTableBody";
import { BaseDataTableContextProvider } from "./BaseDataTableContext";
import { BaseDataTableHeader } from "./BaseDataTableHeader";

const HeaderDraggable = React.memo(
  ({
    id,
    children,
    disabled,
  }: {
    readonly id: string;
    readonly children: React.ReactNode;
    readonly disabled?: boolean;
  }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
      id,
      disabled,
    });
    return (
      <div
        ref={setNodeRef}
        {...(!disabled ? listeners : {})}
        {...attributes}
        data-draggable-id={id}
        className={cn(disabled ? "cursor-default" : "cursor-move")}
      >
        {children}
      </div>
    );
  }
);
HeaderDraggable.displayName = "HeaderDraggable";

const HeaderDroppable = React.memo(
  ({
    id,
    children,
    disabled,
  }: {
    readonly id: string;
    readonly children: React.ReactNode;
    readonly disabled?: boolean;
  }) => {
    const { setNodeRef } = useDroppable({ id, disabled });
    return (
      <div ref={setNodeRef} data-droppable-id={id} data-droppable-disabled={!!disabled}>
        {children}
      </div>
    );
  }
);
HeaderDroppable.displayName = "HeaderDroppable";

const DragPreview = React.memo(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ({ columnId, table }: { readonly columnId: string; readonly table: any }) => {
    const column = table.getColumn(columnId);
    if (!column) return null;

    // Get the header label from columnDef
    const headerDef = column.columnDef.header;
    const label = typeof headerDef === "string" ? headerDef : columnId;

    return (
      <div
        className={cn(
          "px-3 py-2 rounded-lg shadow-2xl",
          "bg-primary text-white",
          "border border-violet-400",
          "text-xs font-medium",
          "flex items-center gap-2",
          "animate-in fade-in-0 zoom-in-95 duration-150"
        )}
      >
        <ListMinus className="w-3.5 h-3.5 opacity-70" />
        <span className="truncate max-w-[200px]">{label}</span>
      </div>
    );
  }
);
DragPreview.displayName = "DragPreview";

function getTableData<TData extends Record<string, unknown>>(
  data: TData[],
  overallRow?: TData | null
): TData[] {
  return overallRow ? [overallRow, ...data] : data;
}

function getVirtualizationConfig(virtualization: BaseDataTableProps["virtualization"] = {}) {
  return {
    estimatedRowHeight: virtualization.estimatedRowHeight ?? 40,
    overscan: virtualization.overscan ?? 5,
    tableHeight: virtualization.tableHeight,
    visibleRows: virtualization.visibleRows ?? 10,
  };
}

function getFeatureFlags(features: BaseDataTableProps["features"] = {}) {
  return {
    enableColumnReordering: features.enableColumnReordering ?? false,
    enableColumnResizing: features.enableColumnResizing ?? true,
    enableColumnPinning: features.enableColumnPinning ?? true,
    enableSorting: features.enableSorting ?? true,
    enableFilters: features.enableFilters ?? true,
    enablePagination: features.enablePagination ?? true,
  };
}

function getUpdatedPinning(
  prev: ColumnPinningState,
  validColumnIds: Set<string>
): ColumnPinningState {
  return {
    left: prev.left?.filter((id) => validColumnIds.has(id)),
    right: prev.right?.filter((id) => validColumnIds.has(id)),
  };
}

function getUpdatedSizing(prev: ColumnSizingState, validColumnIds: Set<string>): ColumnSizingState {
  return Object.fromEntries(Object.entries(prev).filter(([id]) => validColumnIds.has(id)));
}

function getSortingState(action: HeaderAction) {
  if (action.type !== "sort") return;
  if (action.sortType === "custom" && action.customConfig) {
    return [{ id: action.customConfig.field, desc: action.customConfig.dir === "desc" }];
  }
  return [{ id: action.columnId, desc: action.direction === "desc" }];
}

function getPinnedState(
  columnPinning: ColumnPinningState,
  columnId: string,
  position: "left" | "right" | false
): ColumnPinningState {
  const next = {
    left: (columnPinning.left || []).filter((id) => id !== columnId),
    right: (columnPinning.right || []).filter((id) => id !== columnId),
  };

  if (position === "left") next.left.push(columnId);
  if (position === "right") next.right.push(columnId);
  return next;
}

function getColumnOffsets<TData extends Record<string, unknown>>(
  table: ReturnType<typeof useReactTable<TData>>,
  columnPinning: ColumnPinningState
) {
  const leftOffsets = new Map<string, number>();
  const rightOffsets = new Map<string, number>();
  const allCols = table.getAllLeafColumns();

  let leftAccum = 0;
  for (const colId of columnPinning.left ?? []) {
    leftOffsets.set(colId, leftAccum);

    const col = allCols.find((c) => c.id === colId);
    if (col?.getIsVisible()) leftAccum += col.getSize();
  }

  let rightAccum = 0;
  for (let i = (columnPinning.right ?? []).length - 1; i >= 0; i--) {
    const colId = columnPinning.right![i];
    rightOffsets.set(colId, rightAccum);

    const col = allCols.find((c) => c.id === colId);
    if (col?.getIsVisible()) rightAccum += col.getSize();
  }

  return { leftOffsets, rightOffsets };
}

function getReorderedColumns(currentOrder: string[], activeId: string, overId: string) {
  const oldIndex = currentOrder.indexOf(activeId);
  const newIndex = currentOrder.indexOf(overId);

  if (oldIndex === -1 || newIndex === -1) return null;
  const reordered = [...currentOrder];
  const [moved] = reordered.splice(oldIndex, 1);
  reordered.splice(newIndex, 0, moved);
  return reordered;
}

export function BaseDataTable<TData extends Record<string, unknown> = Record<string, unknown>>(
  props: BaseDataTableProps<TData>
) {
  const {
    schema,
    data,
    totalRows,
    overallRow,
    isLoading = false,
    error = null,
    state,
    onStateChange,
    externalStateToWatch = {},
    cellRenderers = {},
    headerRenderers = {},
    features = {},
    virtualization = {},
    renderPagination,
    renderEmpty,
    renderError,
    emptyMessage = "There are no records to display",
    className,
    onRefresh,
    // Extension props
    expandConfig,
    specialRowRenderer,
    // Infinite-scroll (opt-in)
    hasMore,
    loadingMore,
    onLoadMore,
  } = props;

  // Extract feature flags with defaults
  const fullFeatures = getFeatureFlags(features);

  const {
    enableColumnReordering,
    enableColumnResizing,
    enableColumnPinning,
    enableSorting,
    enablePagination,
  } = fullFeatures;

  // Prepend overallRow to data if provided
  const tableData = useMemo(() => getTableData(data, overallRow), [data, overallRow]);

  // Virtualization config
  const virtualizationConfig = useMemo(
    () => getVirtualizationConfig(virtualization),
    [virtualization]
  );

  // Hash of external state - used to force header re-renders when selection changes
  const externalStateHash = useMemo(
    () => JSON.stringify(externalStateToWatch),
    [externalStateToWatch]
  );

  // Transform schema to columns
  const columns = useMemo(
    () =>
      transformSchemaToColumns<TData>(schema.body.content.schema.columns, {
        cellRendererOverrides: cellRenderers,
        headerRendererOverrides: headerRenderers,
      }),
    [schema.body.content.schema.columns, cellRenderers, headerRenderers]
  );

  // Derive column IDs from schema for change detection
  const schemaColumnIds = useMemo(
    () => schema.body.content.schema.columns.map((col) => col.field).join(","),
    [schema.body.content.schema.columns]
  );

  // Initialize column order from schema
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(() =>
    state.columnOrder.length > 0
      ? state.columnOrder
      : getDefaultColumnOrder(schema.body.content.schema.columns)
  );

  // Column pinning state
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(state.columnPinning);

  // Column sizing state for resize functionality
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});

  // Track previous column IDs to detect schema structure changes
  const prevColumnIdsRef = useRef(schemaColumnIds);

  // Sync internal column state when schema columns change
  useEffect(() => {
    // Skip on initial mount - only run when columns actually change
    if (prevColumnIdsRef.current === schemaColumnIds) {
      return;
    }
    prevColumnIdsRef.current = schemaColumnIds;

    // Reset column order to match new schema
    const newColumnOrder = getDefaultColumnOrder(schema.body.content.schema.columns);
    setColumnOrder(newColumnOrder);

    // Reset column pinning - filter to only include columns that still exist
    const validColumnIds = new Set(newColumnOrder);
    setColumnPinning((prev) => getUpdatedPinning(prev, validColumnIds));

    setColumnSizing((prev) => getUpdatedSizing(prev, validColumnIds));
  }, [schemaColumnIds, schema.body.content.schema.columns]);

  // Drag and drop state
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  // Use ref to always have latest state for handlers (avoids stale closure)
  const stateRef = React.useRef(state);
  stateRef.current = state;

  // Ref for table container to scroll into view on pagination change
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // State handlers - use stateRef to avoid stale closures
  const handlers: BaseDataTableStateHandlers = useMemo(
    () => ({
      onPaginationChange: (pagination) => {
        // Use ref to get latest state, avoiding stale closure issues
        onStateChange?.({ pagination: { ...stateRef.current.pagination, ...pagination } });

        // Scroll table into view after pagination change (use setTimeout to allow re-render)
        setTimeout(() => {
          tableContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
      },
      onSortingChange: (sorting) => {
        onStateChange?.({ sorting });
      },
      onFiltersChange: (filters) => {
        onStateChange?.({ filters });
      },
      onColumnOrderChange: (order) => {
        setColumnOrder(order);
        onStateChange?.({ columnOrder: order });
      },
      onColumnPinningChange: (pinning) => {
        setColumnPinning(pinning);
        onStateChange?.({ columnPinning: pinning });
      },
    }),
    [onStateChange]
  );

  // Create TanStack table instance
  const table = useReactTable<TData>({
    data: tableData,
    columns,
    // Add expansion config if provided (from ExpandableTable wrapper)
    ...(expandConfig && {
      getRowId: expandConfig.getRowId,
      getExpandedRowModel: getExpandedRowModel(),
      getSubRows: expandConfig.getSubRows,
    }),
    state: {
      sorting: state.sorting,
      columnOrder,
      columnPinning: enableColumnPinning ? columnPinning : undefined,
      columnSizing: enableColumnResizing ? columnSizing : undefined,
      ...(expandConfig && { expanded: expandConfig.expanded }),
    },
    onSortingChange: enableSorting
      ? (updater) =>
          handlers.onSortingChange(typeof updater === "function" ? updater(state.sorting) : updater)
      : undefined,
    onColumnOrderChange: enableColumnReordering
      ? (updater) =>
          handlers.onColumnOrderChange(
            typeof updater === "function" ? updater(columnOrder) : updater
          )
      : undefined,
    onColumnPinningChange: enableColumnPinning
      ? (updater) =>
          handlers.onColumnPinningChange(
            typeof updater === "function" ? updater(columnPinning) : updater
          )
      : undefined,
    onColumnSizingChange: enableColumnResizing
      ? (updater) =>
          setColumnSizing(typeof updater === "function" ? updater(columnSizing) : updater)
      : undefined,
    // Add expanded change handler if expandConfig is provided
    onExpandedChange: expandConfig?.onExpandedChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true, // Server-side sorting
    columnResizeMode: enableColumnResizing ? "onChange" : undefined,
    enableColumnResizing,
    enableSorting,
  });

  const columnOffsets = useMemo(
    () => getColumnOffsets(table, columnPinning),
    [table, columnPinning, columnSizing]
  );

  const handleDragStart = ({ active }: DragStartEvent) => setActiveDragId(String(active.id));

  const handleDragCancel = () => setActiveDragId(null);

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return setActiveDragId(null);

    const currentOrder =
      columnOrder.length > 0 ? columnOrder : table.getAllLeafColumns().map((c) => c.id);

    const reordered = getReorderedColumns(currentOrder, String(active.id), String(over.id));

    if (reordered) table.setColumnOrder(reordered);
    setActiveDragId(null);
  };

  const handleHeaderAction = useCallback(
    (action: HeaderAction) => {
      if (action.type === "sort") {
        const sortingState = getSortingState(action);

        if (sortingState) {
          handlers.onSortingChange(sortingState);
        }
      }

      if (action.type === "pin") {
        handlers.onColumnPinningChange(
          getPinnedState(columnPinning, action.columnId, action.position)
        );
      }
    },
    [handlers, columnPinning]
  );

  // Total table width - use table.getTotalSize() for reactive updates during resize
  // Note: We include columnSizing in deps to trigger recalc during resize
  const totalTableWidth = useMemo(() => {
    return table.getTotalSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, columnSizing]);

  // Render error state
  if (error) {
    if (renderError) {
      return (
        <div className={cn("w-full", className)}>{renderError({ error, onRetry: onRefresh })}</div>
      );
    }
    return (
      <div className={cn("w-full", className)}>
        <div className="border bg-card p-8 text-center rounded-bl-lg rounded-br-lg">
          <div className="text-destructive font-semibold mb-2">Error Loading Table</div>
          <div className="text-sm text-muted-foreground mb-4">{error.message}</div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              data-testid="base-data-table-on-refresh-btn"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  // Render empty state
  if (!isLoading && data.length === 0) {
    if (renderEmpty) {
      return <div className={cn("w-full", className)}>{renderEmpty({})}</div>;
    }
    return (
      <div className={cn("w-full", className)}>
        <div className="border bg-card p-8 text-center rounded-bl-lg rounded-br-lg">
          <div className="text-tertiary-text font-medium mb-1">No data available</div>
          <div className="text-sm text-tertiary-text">{emptyMessage}</div>
        </div>
      </div>
    );
  }

  return (
    <BaseDataTableContextProvider
      schema={schema}
      state={state}
      handlers={handlers}
      features={fullFeatures}
      cellRenderers={cellRenderers as Record<string, CellRenderer>}
      isLoading={isLoading}
      error={error}
    >
      <div className={cn("w-full", className)}>
        {/* Table */}
        <div
          ref={tableContainerRef}
          className="border bg-card relative overflow-auto"
          style={{
            maxHeight:
              virtualizationConfig.tableHeight ??
              virtualizationConfig.visibleRows * virtualizationConfig.estimatedRowHeight + 48, // 48px for header
          }}
        >
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
            collisionDetection={pointerWithin}
          >
            <TooltipProvider>
              <Table
                noWrapper
                className="w-full grid"
                style={{
                  minWidth: `${totalTableWidth}px`,
                  tableLayout: "fixed",
                }}
              >
                <colgroup>
                  {/* Render columns in visual order: left-pinned, center (unpinned), right-pinned */}
                  {[
                    ...table.getLeftLeafColumns(),
                    ...table.getCenterLeafColumns(),
                    ...table.getRightLeafColumns(),
                  ].map((column) => (
                    <col
                      key={column.id}
                      style={{
                        width: column.getSize(),
                        minWidth: column.getSize(),
                      }}
                    />
                  ))}
                </colgroup>
                <BaseDataTableHeader
                  table={table}
                  columnOffsets={columnOffsets}
                  onHeaderAction={handleHeaderAction}
                  enableResizing={enableColumnResizing}
                  enableReordering={enableColumnReordering}
                  activeDragId={activeDragId}
                  sorting={state.sorting}
                  externalStateHash={externalStateHash}
                  HeaderDroppable={HeaderDroppable}
                  HeaderDraggable={HeaderDraggable}
                />
                <BaseDataTableBody
                  table={table}
                  isLoading={isLoading}
                  columnOffsets={columnOffsets}
                  activeDragId={activeDragId}
                  virtualizationConfig={virtualizationConfig}
                  tableContainerRef={tableContainerRef}
                  specialRowRenderer={specialRowRenderer}
                  hasMore={hasMore}
                  loadingMore={loadingMore}
                  onLoadMore={onLoadMore}
                />
              </Table>
              <DragOverlay modifiers={[snapCenterToCursor]}>
                {activeDragId && <DragPreview columnId={activeDragId} table={table} />}
              </DragOverlay>
            </TooltipProvider>
          </DndContext>
        </div>

        {enablePagination && (
          <div className="px-4 py-2">
            {renderPagination ? (
              renderPagination({
                pagination: state.pagination,
                totalRows,
                onPaginationChange: handlers.onPaginationChange,
              })
            ) : (
              <PaginationV2
                pagination={state.pagination}
                totalRows={totalRows}
                pageSizeOptions={schema.body.content.options?.pageSizeOptions}
                onPaginationChange={handlers.onPaginationChange}
                showPageSizeSelector={true}
              />
            )}
          </div>
        )}
      </div>
    </BaseDataTableContextProvider>
  );
}

export default BaseDataTable;

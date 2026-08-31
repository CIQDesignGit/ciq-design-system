import type { Row, Table as TanStackTable } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import React, { useEffect, useState } from "react";

import { Skeleton } from "@/atoms/skeleton";
import { TableBody, TableCell, TableRow } from "@/atoms/table";
import { cn } from "@/lib/utils";

import type { BaseDataTableColumnMeta, SpecialRowRenderer } from "../types";
import { getCellClassName } from "../utils/column-helpers";

export type VirtualizationConfig = {
  estimatedRowHeight: number;
  overscan: number;
  tableHeight?: number;
  visibleRows: number;
};

export type BaseDataTableBodyProps<TData = Record<string, unknown>> = {
  readonly table: TanStackTable<TData>;
  readonly isLoading: boolean;
  readonly columnOffsets: {
    leftOffsets: Map<string, number>;
    rightOffsets: Map<string, number>;
  };
  readonly activeDragId?: string | null;
  readonly virtualizationConfig: VirtualizationConfig;
  readonly tableContainerRef: React.RefObject<HTMLDivElement | null>;
  /** Optional renderer for special/marker rows - if returns null, renders normal row */
  readonly specialRowRenderer?: SpecialRowRenderer<TData>;
  /** Whether more rows exist beyond `data` (infinite-scroll, opt-in). */
  readonly hasMore?: boolean;
  /** Whether a load-more request is in flight (infinite-scroll, opt-in). */
  readonly loadingMore?: boolean;
  /** Called when the last rendered row approaches the end of `data` (infinite-scroll, opt-in). */
  readonly onLoadMore?: () => void;
};

/** Number of skeleton rows shown below the virtualized rows while a
 * `loadMore()` page fetch is in flight - enough to read as "more is coming"
 * without exaggerating how much is about to load. */
const INFINITE_SCROLL_SKELETON_ROW_COUNT = 2;

/** Trailing skeleton rows shown below the virtualized rows while a
 * `loadMore()` page fetch is in flight (infinite-scroll, opt-in) - matches the
 * full-table `LoadingRow` shimmer shape so the loading state reads
 * consistently whether it's the first page or a scroll-triggered page. */
const InfiniteScrollLoadingRows: React.FC<{
  readonly columns?: {
    id: string;
    getSize: () => number;
    getCanResize: () => boolean;
    getIsPinned: () => false | "left" | "right";
  }[];
  readonly columnCount: number;
  readonly top: number;
  readonly rowHeight: number;
}> = ({ columns, columnCount, top, rowHeight }) => (
  <>
    {Array.from({ length: INFINITE_SCROLL_SKELETON_ROW_COUNT }).map((_, rowIdx) => (
      <TableRow
        key={rowIdx}
        className="flex absolute w-full"
        style={{ transform: `translateY(${top + rowIdx * rowHeight}px)`, height: `${rowHeight}px` }}
      >
        {Array.from({ length: columnCount }).map((_col, colIdx) => {
          const col = columns?.[colIdx];
          const columnWidth = col?.getSize();
          const canResize = col?.getCanResize() ?? true;
          const pinned = col?.getIsPinned();
          return (
            <TableCell
              key={colIdx}
              className={cn("p-2", col && "flex items-center")}
              style={
                columnWidth === undefined
                  ? {}
                  : {
                      flex: `${canResize && !pinned ? 1 : 0} 0 ${columnWidth}px`,
                      minWidth: columnWidth,
                    }
              }
            >
              <Skeleton className="h-4 w-full" />
            </TableCell>
          );
        })}
      </TableRow>
    ))}
  </>
);

const LoadingRow: React.FC<{
  readonly columnCount: number;
  readonly columns?: {
    id: string;
    getSize: () => number;
    getCanResize: () => boolean;
    getIsPinned: () => false | "left" | "right";
  }[];
}> = ({ columnCount, columns }) => (
  <TableRow className="flex w-full">
    {Array.from({ length: columnCount }).map((_, idx) => {
      const col = columns?.[idx];
      const columnWidth = col?.getSize();
      const canResize = col?.getCanResize() ?? true;
      const pinned = col?.getIsPinned();
      return (
        <TableCell
          key={idx}
          className={cn("p-2", col && "flex items-center")}
          style={
            columnWidth === undefined
              ? {}
              : {
                  flex: `${canResize && !pinned ? 1 : 0} 0 ${columnWidth}px`,
                  minWidth: columnWidth,
                }
          }
        >
          <Skeleton className="h-4 w-full" />
        </TableCell>
      );
    })}
  </TableRow>
);

function TableRowContent<TData extends Record<string, unknown>>({
  row,
  leftOffsets,
  rightOffsets,
  activeDragId,
  style,
  virtualRef,
  dataIndex,
  rowClassName,
}: {
  readonly row: Row<TData>;
  readonly leftOffsets: Map<string, number>;
  readonly rightOffsets: Map<string, number>;
  readonly activeDragId?: string | null;
  readonly style?: React.CSSProperties;
  readonly virtualRef?: (node: HTMLTableRowElement | null) => void;
  readonly dataIndex?: number;
  readonly rowClassName?: string;
}) {
  // Check if this is a total row (marked with _isTotalRow by data-fetcher)
  const isTotalRow = Boolean(row.original._isTotalRow);

  // Total row styling: light purple/slate background, bold text
  const totalRowClassName = isTotalRow
    ? "bg-slate-50 font-semibold border-b-2 border-slate-200"
    : "";

  return (
    <TableRow
      ref={virtualRef}
      data-index={dataIndex}
      key={row.id}
      className={cn("hover:bg-muted/50 transition-colors bg-card", totalRowClassName, rowClassName)}
      style={style}
    >
      {row.getVisibleCells().map((cell) => {
        const column = cell.column;
        const meta = column.columnDef.meta as BaseDataTableColumnMeta | undefined;
        const align = meta?.align ?? "left";
        const pinned = column.getIsPinned();
        const isActive = activeDragId === column.id;
        const noPadding = meta?.columnSchema?.noPadding ?? false;
        const columnWidth = column.getSize();

        // Sticky positioning for pinned columns
        // Use appropriate background for total row
        const stickyBackground = isTotalRow ? "rgb(248 250 252)" : "var(--card)";
        const stickyStyle: React.CSSProperties = pinned
          ? pinned === "left"
            ? {
                position: "sticky",
                left: leftOffsets.get(column.id),
                zIndex: 10,
                background: stickyBackground,
              }
            : {
                position: "sticky",
                right: rightOffsets.get(column.id),
                zIndex: 10,
                background: stickyBackground,
              }
          : {};

        return (
          <TableCell
            key={cell.id}
            style={{
              flex: `${column.getCanResize() && !pinned ? 1 : 0} 0 ${columnWidth}px`,
              minWidth: columnWidth,
              ...stickyStyle,
            }}
            className={getCellClassName({
              align,
              noPadding,
              isActive,
              pinned,
            })}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        );
      })}
    </TableRow>
  );
}

function VirtualizedTableBody<TData extends Record<string, unknown>>({
  table,
  leftOffsets,
  rightOffsets,
  activeDragId,
  virtualizationConfig,
  tableContainerRef,
  specialRowRenderer,
  hasMore,
  loadingMore,
  onLoadMore,
}: {
  readonly table: TanStackTable<TData>;
  readonly leftOffsets: Map<string, number>;
  readonly rightOffsets: Map<string, number>;
  readonly activeDragId?: string | null;
  readonly virtualizationConfig: VirtualizationConfig;
  readonly tableContainerRef: React.RefObject<HTMLDivElement | null>;
  readonly specialRowRenderer?: SpecialRowRenderer<TData>;
  readonly hasMore?: boolean;
  readonly loadingMore?: boolean;
  readonly onLoadMore?: () => void;
}) {
  const [isRefReady, setIsRefReady] = useState(false);
  useEffect(() => {
    // Only trigger once after mount when ref becomes available
    if (tableContainerRef?.current && !isRefReady) {
      setIsRefReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // getRowModel() returns flattened rows including expanded sub-rows
  const rows = table.getRowModel().rows;
  const visibleColumns = table.getAllLeafColumns().filter((c) => c.getIsVisible());
  const columnCount = visibleColumns.length;

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => virtualizationConfig.estimatedRowHeight,
    getScrollElement: () => tableContainerRef.current,
    measureElement:
      typeof window !== "undefined" && navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: virtualizationConfig.overscan,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const lastIndex = virtualItems.length > 0 ? virtualItems[virtualItems.length - 1].index : -1;

  // Range-based infinite scroll (opt-in - only wired when a consumer passes
  // `onLoadMore`). Keyed on the primitive `lastIndex`, not the fresh-each-render
  // virtual items array, mirroring the content-agent VirtualReviewTable pattern.
  useEffect(() => {
    if (!onLoadMore) return;
    if (lastIndex >= rows.length - virtualizationConfig.overscan && hasMore && !loadingMore) {
      onLoadMore();
    }
  }, [lastIndex, rows.length, hasMore, loadingMore, onLoadMore, virtualizationConfig.overscan]);

  const loaderRowHeight = virtualizationConfig.estimatedRowHeight;
  const totalSize = rowVirtualizer.getTotalSize();
  const loaderHeight = loadingMore ? loaderRowHeight * INFINITE_SCROLL_SKELETON_ROW_COUNT : 0;

  return (
    <TableBody className="grid relative" style={{ height: `${totalSize + loaderHeight}px` }}>
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const row = rows[virtualRow.index];

        // Try special row renderer first (if provided)
        // If it returns a non-null value, use that instead of normal row rendering
        if (specialRowRenderer) {
          const specialRow = specialRowRenderer({
            row,
            rowData: row.original,
            columnCount,
            virtualStart: virtualRow.start,
            measureRef: (node) => rowVirtualizer.measureElement(node),
            dataIndex: virtualRow.index,
          });

          if (specialRow !== null && specialRow !== undefined) {
            return <React.Fragment key={virtualRow.key}>{specialRow}</React.Fragment>;
          }
        }

        // Render normal data row
        return (
          <TableRowContent
            key={virtualRow.key}
            row={row}
            leftOffsets={leftOffsets}
            rightOffsets={rightOffsets}
            activeDragId={activeDragId}
            dataIndex={virtualRow.index}
            virtualRef={(node) => rowVirtualizer.measureElement(node)}
            rowClassName="flex absolute w-full"
            style={{ transform: `translateY(${virtualRow.start}px)` }}
          />
        );
      })}
      {loadingMore ? (
        <InfiniteScrollLoadingRows
          columns={visibleColumns}
          columnCount={columnCount}
          top={totalSize}
          rowHeight={loaderRowHeight}
        />
      ) : null}
    </TableBody>
  );
}

export function BaseDataTableBody<TData extends Record<string, unknown> = Record<string, unknown>>({
  table,
  isLoading,
  columnOffsets,
  activeDragId,
  virtualizationConfig,
  tableContainerRef,
  specialRowRenderer,
  hasMore,
  loadingMore,
  onLoadMore,
}: BaseDataTableBodyProps<TData>) {
  const rows = table.getRowModel().rows;
  const { leftOffsets, rightOffsets } = columnOffsets;

  // Show loading skeletons when loading (always, not just on first load)
  if (isLoading) {
    const visibleColumns = table.getAllLeafColumns().filter((c) => c.getIsVisible());
    const columnCount = visibleColumns.length;
    const loadingRowHeight = virtualizationConfig.estimatedRowHeight;
    const loadingRowCount = 5;

    return (
      <TableBody
        className="grid relative"
        style={{ height: `${loadingRowCount * loadingRowHeight}px` }}
      >
        {Array.from({ length: loadingRowCount }).map((_, idx) => (
          <LoadingRow key={idx} columnCount={columnCount} columns={visibleColumns} />
        ))}
      </TableBody>
    );
  }

  // Show empty state when no data
  if (rows.length === 0) {
    return (
      <TableBody className="grid">
        <TableRow className="flex w-full">
          <TableCell
            colSpan={table.getAllLeafColumns().filter((c) => c.getIsVisible()).length}
            className="h-24 text-center flex flex-1 justify-center items-center"
          >
            <div className="text-muted-foreground">No data available</div>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  // Always use virtualized rendering
  return (
    <VirtualizedTableBody
      table={table}
      leftOffsets={leftOffsets}
      rightOffsets={rightOffsets}
      activeDragId={activeDragId}
      virtualizationConfig={virtualizationConfig}
      tableContainerRef={tableContainerRef}
      specialRowRenderer={specialRowRenderer}
      hasMore={hasMore}
      loadingMore={loadingMore}
      onLoadMore={onLoadMore}
    />
  );
}

export default BaseDataTableBody;

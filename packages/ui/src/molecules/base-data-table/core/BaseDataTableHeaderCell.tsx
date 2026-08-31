/**
 * Table V2 Header Cell Component
 * Individual header cell with sorting, tooltips, drag/drop, and resize
 */

import type { Column, Header, SortingState } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react";
import React from "react";

import { TableHead } from "@/atoms/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/atoms/tooltip";
import { cn } from "@/lib/utils";

import type { BaseDataTableColumnMeta, ColumnSchema, HeaderAction } from "../types";
import { BaseDataTableHeaderMenu, type MenuSection } from "./BaseDataTableHeaderMenu";

type BaseDataTableHeaderCellProps<TData> = {
  readonly header: Header<TData, unknown>;
  readonly columnSize: number; // Explicit column size to trigger re-renders on resize
  readonly leftOffset?: number;
  readonly rightOffset?: number;
  readonly isActive: boolean;
  readonly enableResizing: boolean;
  readonly enableReordering: boolean;
  readonly onHeaderAction: (action: HeaderAction) => void;
  readonly sorting?: SortingState; // Sorting state to trigger re-renders when it changes
  readonly HeaderDroppable: React.FC<{ id: string; children: React.ReactNode; disabled?: boolean }>;
  readonly HeaderDraggable: React.FC<{ id: string; children: React.ReactNode; disabled?: boolean }>;
};

/**
 * Build menu sections from column schema
 */
function buildMenuSections<TData>(
  column: Column<TData, unknown>,
  columnSchema: ColumnSchema | undefined,
  onHeaderAction: (action: HeaderAction) => void
): MenuSection[] {
  // Check if header menu is disabled for this column
  const headerMenuVisibility = columnSchema?.headerMenu?.visibility ?? "visible";
  if (headerMenuVisibility === "disabled" || headerMenuVisibility === "hidden") {
    return [];
  }

  const sections: MenuSection[] = [];
  const pinned = column.getIsPinned();

  // Sort section - use TanStack's getCanSort() which is set by schema-transformer based on sort.visibility
  const sortOptions = columnSchema?.sort;
  const showSortOptions = column.getCanSort();

  if (showSortOptions) {
    const sortMenuOptions = [];

    // Regular ascending
    if (sortOptions?.ascending !== false) {
      sortMenuOptions.push({
        id: "sort-asc",
        label: "Sort ascending",
        action: () =>
          onHeaderAction({
            type: "sort",
            columnId: column.id,
            sortType: "regular",
            direction: "asc",
          }),
      });
    }

    // Regular descending
    if (sortOptions?.descending !== false) {
      sortMenuOptions.push({
        id: "sort-desc",
        label: "Sort descending",
        action: () =>
          onHeaderAction({
            type: "sort",
            columnId: column.id,
            sortType: "regular",
            direction: "desc",
          }),
      });
    }

    // PVP ascending
    if (sortOptions?.pvpAscending) {
      sortMenuOptions.push({
        id: "sort-pvp-asc",
        label: "Sort PVP ascending",
        action: () =>
          onHeaderAction({
            type: "sort",
            columnId: column.id,
            sortType: "pvp",
            direction: "asc",
          }),
      });
    }

    // PVP descending
    if (sortOptions?.pvpDescending) {
      sortMenuOptions.push({
        id: "sort-pvp-desc",
        label: "Sort PVP descending",
        action: () =>
          onHeaderAction({
            type: "sort",
            columnId: column.id,
            sortType: "pvp",
            direction: "desc",
          }),
      });
    }

    // Custom sorts
    if (sortOptions?.custom && sortOptions.custom.length > 0) {
      sortOptions.custom.forEach((customSort, index) => {
        sortMenuOptions.push({
          id: `custom-sort-${index}`,
          label: `Sort by ${customSort.field} (${customSort.dir})`,
          action: () =>
            onHeaderAction({
              type: "sort",
              columnId: column.id,
              sortType: "custom",
              direction: customSort.dir === "asc" ? "asc" : "desc",
              customConfig: customSort,
            }),
        });
      });
    }

    if (sortMenuOptions.length > 0) {
      sections.push({
        id: "sort",
        options: sortMenuOptions,
      });
    }
  }

  // Pin section
  const pinOptions = pinned
    ? [
        {
          id: "unpin",
          label: "Unpin",
          action: () =>
            onHeaderAction({
              type: "pin",
              columnId: column.id,
              position: false,
            }),
        },
      ]
    : [
        {
          id: "pin-left",
          label: "Pin left",
          action: () =>
            onHeaderAction({
              type: "pin",
              columnId: column.id,
              position: "left",
            }),
        },
        {
          id: "pin-right",
          label: "Pin right",
          action: () =>
            onHeaderAction({
              type: "pin",
              columnId: column.id,
              position: "right",
            }),
        },
      ];

  sections.push({
    id: "pin",
    options: pinOptions,
  });

  return sections;
}

/**
 * Get sort icon based on current sort state
 * Only shows icon when sort is actively applied
 */
function getSortIcon<TData>(column: Column<TData, unknown>): React.ReactNode {
  const sorted = column.getIsSorted();
  if (sorted === "asc") return <ArrowUpNarrowWide className="h-4 w-4" />;
  if (sorted === "desc") return <ArrowDownNarrowWide className="h-4 w-4" />;
  // Don't show icon for unsorted columns
  return null;
}

/**
 * Table V2 Header Cell
 */
export function BaseDataTableHeaderCell<TData = Record<string, unknown>>({
  header,
  columnSize,
  leftOffset,
  rightOffset,
  isActive,
  enableResizing,
  enableReordering,
  onHeaderAction,
  sorting: _sorting, // Used to trigger re-renders when sorting changes
  HeaderDroppable,
  HeaderDraggable,
}: BaseDataTableHeaderCellProps<TData>) {
  void _sorting;
  const column = header.column;
  const meta = column.columnDef.meta as BaseDataTableColumnMeta | undefined;
  const isLeaf = header.colSpan === 1;
  const alignment = isLeaf ? (meta?.align ?? "left") : "center";
  const pinned = column.getIsPinned();

  // Sticky positioning for pinned columns
  const stickyStyle: React.CSSProperties = pinned
    ? pinned === "left"
      ? {
          position: "sticky",
          left: leftOffset,
          zIndex: 20,
          background: "var(--card)",
        }
      : {
          position: "sticky",
          right: rightOffset,
          zIndex: 20,
          background: "var(--card)",
        }
    : {};

  // Check if column is currently sorted
  const isSorted = column.getIsSorted();

  const headerTitle =
    typeof column.columnDef.header === "string" ? column.columnDef.header : undefined;

  // Header label (without inline sort icon - sort icon is shown in menu area)
  const headerLabel = header.isPlaceholder ? null : (
    <div
      className={cn("flex items-center gap-1 select-none", {
        "justify-start text-left": alignment === "left",
        "justify-center text-center": alignment === "center",
        "justify-end text-right": alignment === "right",
      })}
      style={{ width: "100%" }}
    >
      <span
        className={cn("font-medium text-xs whitespace-nowrap text-violet-800", {
          "cursor-pointer": isLeaf && column.getCanSort(),
        })}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClick={isLeaf ? (column.getToggleSortingHandler() as any) : undefined}
        role={isLeaf && column.getCanSort() ? "button" : undefined}
        title={meta?.tooltip ? undefined : headerTitle}
        data-testid="base-data-table-header-cell-typeof-columncolumn-defheader-string-columncolumn-defheader-undefined-text"
      >
        {flexRender(column.columnDef.header, header.getContext())}
      </span>
    </div>
  );

  // Wrap with tooltip if provided — styled to match MetricDescriptionTooltip
  const headerInner = meta?.tooltip ? (
    <Tooltip>
      <TooltipTrigger asChild data-testid="base-data-table-header-cell-tooltip-trigger">
        <div>{headerLabel}</div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-[320px] p-3">
        {headerTitle ? (
          <div className="text-sm font-semibold text-foreground">{headerTitle}</div>
        ) : null}
        <div className={cn("text-sm text-muted-foreground", headerTitle && "mt-2")}>
          {meta.tooltip}
        </div>
      </TooltipContent>
    </Tooltip>
  ) : (
    headerLabel
  );

  // Enable drag/drop only if reordering is enabled and column is a leaf
  const canDrag = enableReordering && isLeaf;

  // Check if header is a custom renderer (function) vs default (string)
  const hasCustomHeader = typeof column.columnDef.header === "function";

  // Header node with drag/drop
  const headerNode = (
    <div className="relative">
      <HeaderDroppable id={column.id} disabled={!canDrag}>
        <HeaderDraggable id={column.id} disabled={!canDrag}>
          {headerInner}
        </HeaderDraggable>
      </HeaderDroppable>
    </div>
  );

  // Build menu sections (only if not using custom header)
  const menuSections =
    isLeaf && !hasCustomHeader ? buildMenuSections(column, meta?.columnSchema, onHeaderAction) : [];

  const noPadding = meta?.columnSchema?.noPadding ?? false;

  return (
    <TableHead
      key={header.id}
      colSpan={header.colSpan}
      style={{
        flex: `${isLeaf && column.getCanResize() && !pinned ? 1 : 0} 0 ${columnSize}px`,
        minWidth: columnSize,
        ...stickyStyle,
      }}
      className={cn(
        "group relative whitespace-nowrap bg-card border-r border-gray-200",
        noPadding && "!px-0",
        pinned && "bg-muted/30 shadow-[inset_-1px_0_0_0_rgba(0,0,0,0.05)]",
        isLeaf && isActive && "opacity-50 ring-1 ring-primary/40"
      )}
      data-column-id={column.id}
    >
      <div className="flex w-full min-w-0 items-center">
        <div className="min-w-0 flex-1 overflow-hidden">{headerNode}</div>
        {isLeaf && !hasCustomHeader && (
          <div className="flex shrink-0 items-center gap-1">
            <BaseDataTableHeaderMenu
              sections={menuSections}
              customTrigger={isSorted ? getSortIcon(column) : undefined}
            />
          </div>
        )}
      </div>
      {isLeaf && enableResizing && column.getCanResize() && (
        <div
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onMouseDown={header.getResizeHandler() as any}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onTouchStart={header.getResizeHandler() as any}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "absolute top-0 right-0 h-full w-1 cursor-col-resize select-none opacity-0 group-hover:opacity-100",
            column.getIsResizing() ? "bg-primary/40 opacity-100" : "bg-transparent"
          )}
          style={{ transform: "translateX(50%)" }}
        />
      )}
    </TableHead>
  );
}

export default BaseDataTableHeaderCell;

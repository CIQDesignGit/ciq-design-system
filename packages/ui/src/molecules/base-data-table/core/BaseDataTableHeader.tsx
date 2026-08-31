/**
 * Table V2 Header Component
 * Coordinates header row rendering with cells
 */

import type { HeaderGroup, SortingState, Table as TanStackTable } from "@tanstack/react-table";
import React from "react";

import { TableHeader, TableRow } from "@/atoms/table";

import type { HeaderAction } from "../types";
import { BaseDataTableHeaderCell } from "./BaseDataTableHeaderCell";

export type BaseDataTableHeaderProps<TData = Record<string, unknown>> = {
  readonly table: TanStackTable<TData>;
  readonly columnOffsets: {
    leftOffsets: Map<string, number>;
    rightOffsets: Map<string, number>;
  };
  readonly onHeaderAction: (action: HeaderAction) => void;
  readonly enableResizing: boolean;
  readonly enableReordering: boolean;
  readonly activeDragId?: string | null;
  readonly sorting?: SortingState; // Pass sorting state to trigger re-renders
  readonly externalStateHash?: string; // Pass external state hash to trigger re-renders for custom headers
  readonly HeaderDroppable: React.FC<{ id: string; children: React.ReactNode; disabled?: boolean }>;
  readonly HeaderDraggable: React.FC<{ id: string; children: React.ReactNode; disabled?: boolean }>;
};

/**
 * Table V2 Header - Simplified coordinator
 */
export function BaseDataTableHeader<TData = Record<string, unknown>>({
  table,
  columnOffsets,
  onHeaderAction,
  enableResizing,
  enableReordering,
  activeDragId,
  sorting,
  externalStateHash: _externalStateHash, // Used to trigger re-renders when external state changes
  HeaderDroppable,
  HeaderDraggable,
}: BaseDataTableHeaderProps<TData>) {
  const { leftOffsets, rightOffsets } = columnOffsets;

  return (
    <TableHeader className="grid sticky top-0 z-20 bg-card">
      {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
        <TableRow key={headerGroup.id} className="flex w-full">
          {headerGroup.headers.map((header) => {
            // Include sort state in key to force re-render when sorting changes
            const columnSortState = header.column.getIsSorted();
            const columnWidth = header.column.getSize();
            return (
              <BaseDataTableHeaderCell
                key={`${header.id}-${columnSortState || "none"}-${_externalStateHash}`}
                header={header}
                columnSize={columnWidth}
                leftOffset={leftOffsets.get(header.column.id)}
                rightOffset={rightOffsets.get(header.column.id)}
                isActive={header.colSpan === 1 && activeDragId === header.column.id}
                enableResizing={enableResizing}
                enableReordering={enableReordering}
                onHeaderAction={onHeaderAction}
                sorting={sorting}
                HeaderDroppable={HeaderDroppable}
                HeaderDraggable={HeaderDraggable}
              />
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}

export default BaseDataTableHeader;

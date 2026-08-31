import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

import { Button } from "@/atoms/button";
import { cn } from "@/lib/utils";

import type { PaginationMetadata } from "../types";

export type PaginationV2Props = {
  readonly pagination: PaginationMetadata;
  readonly totalRows: number;
  readonly pageSizeOptions?: number[];
  readonly onPaginationChange: (pagination: Partial<PaginationMetadata>) => void;
  readonly className?: string;
  readonly showPageSizeSelector?: boolean;
};

function generatePageWindow(
  current: number,
  total: number,
  radius = 1
): Array<number | "ellipsis"> {
  if (total <= 1) return [];

  const start = Math.max(0, current - radius);
  const end = Math.min(total - 1, current + radius);
  const pages: Array<number | "ellipsis"> = [];

  // Always show first page
  if (start > 0) {
    pages.push(0);
    if (start > 1) pages.push("ellipsis");
  }

  // Show window around current page
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Always show last page
  if (end < total - 1) {
    if (end < total - 2) pages.push("ellipsis");
    pages.push(total - 1);
  }

  return pages;
}

export const PaginationV2: React.FC<PaginationV2Props> = ({
  pagination,
  totalRows: rawTotalRows,
  pageSizeOptions = [10, 25, 50, 100],
  onPaginationChange,
  className,
  showPageSizeSelector = false,
}) => {
  const { page, pageSize } = pagination;

  // Guard against NaN/invalid values
  const totalRows = Number.isFinite(rawTotalRows) ? rawTotalRows : 0;
  const totalPages = Math.max(1, Math.ceil(totalRows / Math.max(1, pageSize)));
  const pages = generatePageWindow(page, totalPages, 1);

  // Calculate current range
  const startRow = totalRows > 0 ? page * pageSize + 1 : 0;
  const endRow = Math.min((page + 1) * pageSize, totalRows);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      onPaginationChange({ page: newPage });
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    onPaginationChange({ pageSize: newPageSize, page: 0 }); // Reset to first page
  };

  if (totalPages <= 1 && totalRows <= Math.min(...pageSizeOptions)) {
    return null; // Don't show pagination if not needed
  }

  return (
    <div
      className={cn(
        "flex items-center gap-4",
        showPageSizeSelector ? "justify-between" : "justify-end",
        className
      )}
    >
      {/* Left side: Page size selector and row count */}
      {showPageSizeSelector && (
        <div className="flex items-center gap-4 text-xs text-slate-600">
          {totalRows > Math.min(...pageSizeOptions) && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Rows per page:</span>
              <select
                className="rounded-lg border border-slate-200 bg-background px-2 py-1 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="text-slate-600">
            Showing <span className="font-medium text-slate-800">{startRow}</span> to{" "}
            <span className="font-medium text-slate-800">{endRow}</span> of{" "}
            <span className="font-medium text-slate-800">{totalRows}</span> rows
          </div>
        </div>
      )}

      {/* Right side: Page navigation */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 0}
            className="h-8 px-2 gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Previous</span>
          </Button>

          {pages.map((p, idx) =>
            p === "ellipsis" ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-slate-400">
                …
              </span>
            ) : (
              <Button
                key={p}
                variant={p === page ? "card" : "ghost"}
                size="sm"
                className={cn(
                  "h-8 w-8 p-0",
                  p === page && "bg-violet-100 text-violet-700 hover:bg-violet-200"
                )}
                onClick={() => handlePageChange(p)}
              >
                {p + 1}
              </Button>
            )
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages - 1}
            className="h-8 px-2 gap-1"
          >
            <span className="text-sm font-medium">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaginationV2;

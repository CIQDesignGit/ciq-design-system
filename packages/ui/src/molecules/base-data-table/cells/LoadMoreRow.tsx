import { Loader2 } from "lucide-react";
import type { JSX } from "react";

import { Button } from "@/atoms/button";
import { TableCell, TableRow } from "@/atoms/table";
import { cn } from "@/lib/utils";

export type LoadMoreRowProps = {
  /** Depth of the parent row (used for indentation) */
  readonly depth: number;
  /** Total number of visible columns */
  readonly columnCount: number;
  /** Whether the load more request is in progress */
  readonly isLoading: boolean;
  /** Whether there was an error loading more rows */
  readonly hasError: boolean;
  /** Callback to load more rows */
  readonly onLoadMore: () => void;
  /** Callback to retry after an error */
  readonly onRetry: () => void;
  /** Optional className for the row */
  readonly className?: string;
  /** Optional style for virtualization positioning */
  readonly style?: React.CSSProperties;
  /** Optional ref callback for virtualization measurement */
  readonly virtualRef?: (node: HTMLTableRowElement | null) => void;
  /** Optional data-index for virtualization */
  readonly dataIndex?: number;
};

function LoadingIndicator({ text }: { readonly text: string }): JSX.Element {
  return (
    <>
      <Loader2 className="h-3 w-3 animate-spin mr-1" />
      {text}
    </>
  );
}

function ErrorState({
  isLoading,
  onRetry,
}: {
  readonly isLoading: boolean;
  readonly onRetry: () => void;
}): JSX.Element {
  return (
    <>
      <span className="text-sm text-destructive">Failed to load more</span>
      <Button
        variant="link"
        size="sm"
        onClick={onRetry}
        disabled={isLoading}
        className="h-auto p-0 text-sm"
      >
        {isLoading ? <LoadingIndicator text="Retrying..." /> : "Retry"}
      </Button>
    </>
  );
}

function LoadMoreButton({
  isLoading,
  onLoadMore,
}: {
  readonly isLoading: boolean;
  readonly onLoadMore: () => void;
}): JSX.Element {
  return (
    <Button
      variant="link"
      size="sm"
      onClick={onLoadMore}
      disabled={isLoading}
      className="h-auto p-0 text-sm"
    >
      {isLoading ? <LoadingIndicator text="Loading..." /> : "Load more..."}
    </Button>
  );
}

export function LoadMoreRow({
  depth,
  columnCount,
  isLoading,
  hasError,
  onLoadMore,
  onRetry,
  className,
  style,
  virtualRef,
  dataIndex,
}: LoadMoreRowProps): JSX.Element {
  const indentPx = (depth + 1) * 24;

  return (
    <TableRow
      ref={virtualRef}
      data-index={dataIndex}
      className={cn("hover:bg-muted/50 transition-colors bg-card", className)}
      style={style}
    >
      <TableCell colSpan={columnCount} className="p-2" style={{ paddingLeft: `${indentPx}px` }}>
        <div className="flex items-center gap-2">
          {hasError ? (
            <ErrorState isLoading={isLoading} onRetry={onRetry} />
          ) : (
            <LoadMoreButton isLoading={isLoading} onLoadMore={onLoadMore} />
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

export default LoadMoreRow;

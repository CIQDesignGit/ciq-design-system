import type { JSX } from "react";

import { TableCell, TableRow } from "@/atoms/table";
import { cn } from "@/lib/utils";

export type NoDataRowProps = {
  /** Depth of the parent row (used for indentation) */
  readonly depth: number;
  /** Total number of visible columns */
  readonly columnCount: number;
  /** Optional className for the row */
  readonly className?: string;
  /** Optional style for virtualization positioning */
  readonly style?: React.CSSProperties;
  /** Optional ref callback for virtualization measurement */
  readonly virtualRef?: (node: HTMLTableRowElement | null) => void;
  /** Optional data-index for virtualization */
  readonly dataIndex?: number;
};

export function NoDataRow({
  depth,
  columnCount,
  className,
  style,
  virtualRef,
  dataIndex,
}: NoDataRowProps): JSX.Element {
  const indentPx = (depth + 1) * 24;

  return (
    <TableRow
      ref={virtualRef}
      data-index={dataIndex}
      className={cn("hover:bg-muted/50 transition-colors bg-card", className)}
      style={style}
    >
      <TableCell colSpan={columnCount} className="p-2" style={{ paddingLeft: `${indentPx}px` }}>
        <span className="text-sm text-muted-foreground">No data available</span>
      </TableCell>
    </TableRow>
  );
}

export default NoDataRow;

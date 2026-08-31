import React from "react";

import type { CellRendererProps } from "../types";
import { extractCellValue } from "./cell-utils";
import { extractPvpData } from "./pvp-utils";
import { PvpIndicator } from "./PvpIndicator";

export const DefaultCell: React.FC<CellRendererProps> = ({ value }) => {
  const displayValue = extractCellValue(value);
  const pvpData = extractPvpData(value);

  if (displayValue == null) {
    return <span className="text-muted-foreground">—</span>;
  }

  // Handle objects and arrays
  if (typeof displayValue === "object") {
    try {
      return <span className="text-xs text-tertiary-text">{JSON.stringify(displayValue)}</span>;
    } catch {
      return <span className="text-muted-foreground">[Object]</span>;
    }
  }

  return (
    <div className="flex flex-col items-start gap-0.5">
      <span className="text-slate-800 line-clamp-2" title={String(displayValue)}>
        {String(displayValue)}
      </span>
      {pvpData && <PvpIndicator data={pvpData} />}
    </div>
  );
};

export default DefaultCell;

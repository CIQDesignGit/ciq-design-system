import React from "react";

import type { CellRendererProps } from "../types";
import { extractCellValue } from "./cell-utils";
import { extractPvpData } from "./pvp-utils";
import { PvpIndicator } from "./PvpIndicator";

export const StringCell: React.FC<CellRendererProps> = ({ value }) => {
  const displayValue = extractCellValue(value);
  const pvpData = extractPvpData(value);

  if (displayValue == null || displayValue === "") {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <div className="flex flex-col items-start gap-0.5">
      <span className="text-slate-800 text-sm line-clamp-2" title={String(displayValue)}>
        {String(displayValue)}
      </span>
      {pvpData && <PvpIndicator data={pvpData} />}
    </div>
  );
};

export default StringCell;

/**
 * Default Highlight Cell Renderer
 * Fallback cell renderer with PvP indicator support
 */

import React from "react";

import type { CellRendererProps } from "../types";
import { extractCellValue } from "./cell-utils";
import { extractPvpData } from "./pvp-utils";
import { PvpIndicator } from "./PvpIndicator";

type HighlightColor = "green" | "red" | "transparent";

type HighlightValue = {
  highlight?: HighlightColor;
  [key: string]: unknown;
};

export const DefaultHighlightCell: React.FC<CellRendererProps> = ({ value }) => {
  // Extract value using shared utility (handles pvp-only objects)
  const displayValue = extractCellValue(value);

  const apiHighlight =
    value && typeof value === "object" && "highlight" in value
      ? (value as HighlightValue).highlight
      : undefined;

  // Extract PvP data if present
  const pvpData = extractPvpData(value);
  const numericValue =
    displayValue !== null && displayValue !== undefined ? parseFloat(String(displayValue)) : null;

  if (displayValue == null) {
    if (pvpData) {
      return (
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-muted-foreground">—</span>
          <PvpIndicator data={pvpData} />
        </div>
      );
    }
    return <span className="text-muted-foreground">—</span>;
  }

  // Handle objects and arrays (should rarely happen now with extractCellValue)
  if (typeof displayValue === "object") {
    try {
      return <span className="text-xs text-slate-700">{JSON.stringify(displayValue)}</span>;
    } catch {
      return <span className="text-muted-foreground">[Object]</span>;
    }
  }

  // Determine color classes based on API highlight
  const getColorClasses = (): string => {
    switch (apiHighlight) {
      case "green":
        return "bg-green-50 !text-green-700";
      case "red":
        return "bg-red-50 !text-red-700";
      case "transparent":
      default:
        return "";
    }
  };

  const colorClasses = getColorClasses();
  const hasBackground = apiHighlight === "green" || apiHighlight === "red";

  // If we have PvP data and a numeric value, show with indicator
  if (pvpData && numericValue !== null && !isNaN(numericValue)) {
    return (
      <div className="relative w-full h-full flex items-start">
        {hasBackground && <div className={`absolute inset-0 -m-2 ${colorClasses}`} />}
        <div className={`relative flex flex-col items-start gap-0.5 ${colorClasses}`}>
          <span className="line-clamp-2">{String(displayValue)}</span>
          <PvpIndicator data={pvpData} currentValue={numericValue} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-start">
      {hasBackground && <div className={`absolute inset-0 -m-2 ${colorClasses}`} />}
      <span className={`relative line-clamp-2 ${colorClasses}`} title={String(displayValue)}>
        {String(displayValue)}
      </span>
    </div>
  );
};

export default DefaultHighlightCell;

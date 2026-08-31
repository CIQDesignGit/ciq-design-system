/**
 * String Highlight Cell Renderer
 * Displays strings with API-driven highlight colors and PvP indicator
 */

import React from "react";

import type { CellRendererProps } from "../types";
import { extractCellValue } from "./cell-utils";
import { extractPvpData } from "./pvp-utils";
import { PvpIndicator } from "./PvpIndicator";

type HighlightColor = "green" | "red" | "transparent";

type StringHighlightValue = {
  highlight?: HighlightColor;
  [key: string]: unknown;
};

export const StringHighlightCell: React.FC<CellRendererProps> = ({ value }) => {
  // Extract value using shared utility (handles pvp-only objects)
  const displayValue = extractCellValue(value);

  const apiHighlight =
    value && typeof value === "object" && "highlight" in value
      ? (value as StringHighlightValue).highlight
      : undefined;

  // Extract PvP data if present
  const pvpData = extractPvpData(value);
  const numericValue =
    displayValue !== null && displayValue !== undefined ? parseFloat(String(displayValue)) : null;

  if (displayValue == null || displayValue === "") {
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
          <span className="text-sm line-clamp-2">{String(displayValue)}</span>
          <PvpIndicator data={pvpData} currentValue={numericValue} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-start">
      {hasBackground && <div className={`absolute inset-0 -m-2 ${colorClasses}`} />}
      <span
        className={`relative text-sm line-clamp-2 ${colorClasses}`}
        title={String(displayValue)}
      >
        {String(displayValue)}
      </span>
    </div>
  );
};

export default StringHighlightCell;

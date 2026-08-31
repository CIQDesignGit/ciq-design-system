/**
 * Shared cell rendering utilities
 * Provides common UI patterns for table cells to eliminate duplication
 *
 * Note: This file exports render helper functions (not standalone components),
 */

import type { JSX } from "react";

import { extractCellValue } from "./cell-utils";
import { extractPvpData, type PvpData } from "./pvp-utils";
import { PvpIndicator } from "./PvpIndicator";

// Highlight color types from API
export type HighlightColor = "green" | "red" | "transparent";

// Color classes for highlighting
export interface HighlightClasses {
  bg: string;
  text: string;
}

/**
 * Get Tailwind classes for highlight colors based on API highlight value
 */
export function getHighlightClasses(highlight?: HighlightColor): HighlightClasses {
  switch (highlight) {
    case "green":
      return { bg: "bg-green-50", text: "!text-green-700" };
    case "red":
      return { bg: "bg-red-50", text: "!text-red-700" };
    case "transparent":
      return { bg: "bg-slate-50", text: "!text-slate-500" };
    default:
      return { bg: "", text: "" };
  }
}

/**
 * Get highlight classes based on numeric value (positive = green, negative = red)
 */
export function getValueBasedHighlightClasses(value: number): HighlightClasses {
  if (value > 0) {
    return { bg: "bg-green-50", text: "!text-green-700" };
  } else if (value < 0) {
    return { bg: "bg-red-50", text: "!text-red-700" };
  }
  return { bg: "bg-slate-50", text: "!text-slate-700" };
}

/**
 * Extract highlight value from cell value object
 */
export function extractHighlight(value: unknown): HighlightColor | undefined {
  if (value && typeof value === "object" && "highlight" in value) {
    return (value as { highlight?: HighlightColor }).highlight;
  }
  return undefined;
}

/**
 * Render empty/null value placeholder
 */
export function renderEmptyValue(): JSX.Element {
  return (
    <div className="flex flex-col items-start gap-0.5">
      <span className="text-muted-foreground">—</span>
    </div>
  );
}

/**
 * Render empty value with PvP indicator when value is null but PvP data exists
 */
export function renderEmptyWithPvp(pvpData: PvpData): JSX.Element {
  return (
    <div className="flex flex-col items-start gap-0.5">
      <span className="text-muted-foreground">—</span>
      <PvpIndicator data={pvpData} />
    </div>
  );
}

/**
 * Render a formatted value with optional PvP indicator
 */
export function renderValueWithPvp(
  formattedValue: string,
  pvpData?: PvpData | null,
  currentValue?: number,
  className = "text-slate-800 font-medium text-sm tabular-nums"
): JSX.Element {
  if (!pvpData) {
    return (
      <div className="flex flex-col items-start gap-0.5">
        <span className={className}>{formattedValue}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-0.5">
      <span className={className}>{formattedValue}</span>
      <PvpIndicator data={pvpData} currentValue={currentValue} />
    </div>
  );
}

/**
 * Render a value with highlight background
 */
export function renderHighlightedValue(
  formattedValue: string,
  highlight: HighlightClasses,
  pvpData?: PvpData | null,
  currentValue?: number
): JSX.Element {
  const hasBackground = highlight.bg !== "";

  return (
    <div className="relative w-full h-full flex items-start">
      {hasBackground && <div className={`absolute inset-0 -m-2 ${highlight.bg}`} />}
      <div className="relative flex flex-col items-start gap-0.5">
        <span className={`text-sm font-medium tabular-nums ${highlight.text || "text-slate-800"}`}>
          {formattedValue}
        </span>
        {pvpData && <PvpIndicator data={pvpData} currentValue={currentValue} />}
      </div>
    </div>
  );
}

/**
 * Common cell value extraction and parsing hook
 * Extracts display value, PvP data, and numeric value from raw cell value
 */
export interface ExtractedCellData {
  displayValue: unknown;
  pvpData: PvpData | null;
  numValue: number | null;
  highlight: HighlightColor | undefined;
}

export function extractCellData(value: unknown): ExtractedCellData {
  const displayValue = extractCellValue(value);
  const pvpData = extractPvpData(value);
  const highlight = extractHighlight(value);

  let numValue: number | null = null;
  if (displayValue !== null && displayValue !== undefined) {
    const parsed =
      typeof displayValue === "number" ? displayValue : parseFloat(String(displayValue));
    numValue = isNaN(parsed) ? null : parsed;
  }

  return { displayValue, pvpData, numValue, highlight };
}

/**
 * Render plan/forecast badge
 */
export function renderBadge(type: "plan" | "forecast", className?: string): JSX.Element {
  const config = {
    plan: {
      letter: "P",
      borderColor: "border-blue-400",
      textColor: "text-blue-700",
    },
    forecast: {
      letter: "F",
      borderColor: "border-amber-400",
      textColor: "text-amber-700",
    },
  };

  const { letter, borderColor, textColor } = config[type];

  return (
    <span
      className={`inline-flex items-center justify-center rounded border border-dashed ${borderColor} ${textColor} text-xs px-1.5 py-0.5 font-medium ${className || ""}`}
    >
      {letter}
    </span>
  );
}

/**
 * Render value with badge (for plan/forecast cells)
 */
export function renderValueWithBadge(
  badgeType: "plan" | "forecast",
  formattedValue: string | null,
  pvpData?: PvpData | null,
  currentValue?: number
): JSX.Element {
  if (formattedValue === null) {
    return (
      <div className="flex items-center gap-2">
        {renderBadge(badgeType)}
        <span className="text-muted-foreground">—</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-0.5">
      <div className="flex items-center gap-2">
        {renderBadge(badgeType)}
        <span className="text-slate-800 font-medium text-sm tabular-nums">{formattedValue}</span>
      </div>
      {pvpData && <PvpIndicator data={pvpData} currentValue={currentValue} />}
    </div>
  );
}

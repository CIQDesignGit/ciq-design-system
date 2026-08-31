/**
 * Number Highlight Cell Renderer
 * Displays numbers with emphasis, highlighting, and PvP indicator
 */

import React from "react";

import type { CellRendererProps } from "../types";
import {
  extractCellData,
  getHighlightClasses,
  getValueBasedHighlightClasses,
  renderEmptyValue,
  renderEmptyWithPvp,
  renderHighlightedValue,
} from "./cell-renderers";
import { formatCompactNumber, formatPercent } from "./formatters";

export const NumberHighlightCell: React.FC<CellRendererProps> = ({ value, column }) => {
  const { displayValue, pvpData, numValue, highlight } = extractCellData(value);

  if (displayValue == null || numValue === null) {
    return pvpData ? renderEmptyWithPvp(pvpData) : renderEmptyValue();
  }

  const isPercentage = column.format === "percentage" || column.type === "percentage";
  const formattedValue = isPercentage ? formatPercent(numValue) : formatCompactNumber(numValue);

  // Use API highlight if provided, otherwise derive from value
  const highlightClasses = highlight
    ? getHighlightClasses(highlight)
    : getValueBasedHighlightClasses(numValue);

  return renderHighlightedValue(formattedValue, highlightClasses, pvpData, numValue);
};

export default NumberHighlightCell;

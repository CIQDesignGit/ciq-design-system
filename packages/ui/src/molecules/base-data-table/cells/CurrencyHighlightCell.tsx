/**
 * Currency Highlight Cell Renderer
 * Displays currency values with proper formatting, highlighting, and PvP indicator
 */

import React from "react";

import type { CellRendererProps } from "../types";
import {
  extractCellData,
  getHighlightClasses,
  renderEmptyValue,
  renderEmptyWithPvp,
  renderHighlightedValue,
  renderValueWithPvp,
} from "./cell-renderers";
import { formatCurrency } from "./formatters";

export const CurrencyHighlightCell: React.FC<CellRendererProps> = ({ value }) => {
  const { displayValue, pvpData, numValue, highlight } = extractCellData(value);

  if (displayValue == null || numValue === null) {
    return pvpData ? renderEmptyWithPvp(pvpData) : renderEmptyValue();
  }

  const formattedValue = formatCurrency(numValue);

  // Only apply highlight styling if API provides highlight
  if (highlight) {
    const highlightClasses = getHighlightClasses(highlight);
    return renderHighlightedValue(formattedValue, highlightClasses, pvpData, numValue);
  }

  return renderValueWithPvp(formattedValue, pvpData, numValue);
};

export default CurrencyHighlightCell;

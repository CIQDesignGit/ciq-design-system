/**
 * Currency Forecast Cell Renderer
 * Displays forecasted currency values with a visual indicator and PvP indicator
 */

import React from "react";

import type { CellRendererProps } from "../types";
import { extractCellData, renderValueWithBadge } from "./cell-renderers";
import { formatCurrency, formatPercent } from "./formatters";

export const CurrencyForecastCell: React.FC<CellRendererProps> = ({ value, column }) => {
  const { displayValue, pvpData, numValue } = extractCellData(value);

  if (displayValue == null || numValue === null) {
    return renderValueWithBadge("forecast", null);
  }

  const isPercentage = column.format === "percentage";
  const formattedValue = isPercentage ? formatPercent(numValue) : formatCurrency(numValue);

  return renderValueWithBadge("forecast", formattedValue, pvpData, numValue);
};

export default CurrencyForecastCell;

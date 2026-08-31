/**
 * Currency Plan Cell Renderer
 * Displays planned currency values with a visual indicator and PvP indicator
 */

import React from "react";

import type { CellRendererProps } from "../types";
import { extractCellData, renderValueWithBadge } from "./cell-renderers";
import { formatCurrency } from "./formatters";

export const CurrencyPlanCell: React.FC<CellRendererProps> = ({ value }) => {
  const { displayValue, pvpData, numValue } = extractCellData(value);

  if (displayValue == null || numValue === null) {
    return renderValueWithBadge("plan", null);
  }

  const formattedValue = formatCurrency(numValue);

  return renderValueWithBadge("plan", formattedValue, pvpData, numValue);
};

export default CurrencyPlanCell;

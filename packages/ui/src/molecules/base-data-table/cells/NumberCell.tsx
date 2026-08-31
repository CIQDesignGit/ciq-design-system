import React from "react";

import type { CellRendererProps } from "../types";
import {
  extractCellData,
  renderEmptyValue,
  renderEmptyWithPvp,
  renderValueWithPvp,
} from "./cell-renderers";
import { formatCompactNumber, formatPercent } from "./formatters";

export const NumberCell: React.FC<CellRendererProps> = ({ value, column }) => {
  const { displayValue, pvpData, numValue } = extractCellData(value);

  if (displayValue == null || numValue === null) {
    return pvpData ? renderEmptyWithPvp(pvpData) : renderEmptyValue();
  }

  const isPercentage = column.format === "percentage" || column.type === "percentage";
  const formattedValue = isPercentage ? formatPercent(numValue) : formatCompactNumber(numValue);

  return renderValueWithPvp(formattedValue, pvpData, numValue);
};

export default NumberCell;

import React from "react";

import type { CellRendererProps } from "../types";
import {
  extractCellData,
  renderEmptyValue,
  renderEmptyWithPvp,
  renderValueWithPvp,
} from "./cell-renderers";
import { formatCurrency } from "./formatters";

export const CurrencyCell: React.FC<CellRendererProps> = ({ value }) => {
  const { displayValue, pvpData, numValue } = extractCellData(value);

  if (displayValue == null || numValue === null) {
    return pvpData ? renderEmptyWithPvp(pvpData) : renderEmptyValue();
  }

  const formattedValue = formatCurrency(numValue);

  return renderValueWithPvp(formattedValue, pvpData, numValue);
};

export default CurrencyCell;

// Import for auto-registration
import { registerCell } from "./CellRegistry";
import { CompetitorMetricCell } from "./CompetitorMetricCell";
import { CurrencyCell } from "./CurrencyCell";
import { CurrencyForecastCell } from "./CurrencyForecastCell";
import { CurrencyHighlightCell } from "./CurrencyHighlightCell";
import { CurrencyPlanCell } from "./CurrencyPlanCell";
import { DefaultCell } from "./DefaultCell";
import { DefaultHighlightCell } from "./DefaultHighlightCell";
import { NumberCell } from "./NumberCell";
import { NumberHighlightCell } from "./NumberHighlightCell";
import { SKUCell } from "./SKUCell";
import { StringCell } from "./StringCell";
import { StringHighlightCell } from "./StringHighlightCell";

// Export cell registry
export {
  CellRegistry,
  clearCellRegistry,
  getCell,
  getRegisteredTypes,
  hasCell,
  registerCell,
  unregisterCell,
} from "./CellRegistry";

// Export competitor metric cell
export { CompetitorMetricCell } from "./CompetitorMetricCell";

// Export competitor utilities
export {
  type CategoryLeaderData,
  type CompetitorData,
  extractCategoryLeaderData,
  extractCompetitorData,
} from "./competitor-utils";

// Export base cell renderers (no highlighting/PvP)
export { CurrencyCell } from "./CurrencyCell";
export { CurrencyForecastCell } from "./CurrencyForecastCell";
export { CurrencyPlanCell } from "./CurrencyPlanCell";
export { DefaultCell } from "./DefaultCell";
export { NumberCell } from "./NumberCell";
export { SKUCell } from "./SKUCell";
export { StringCell } from "./StringCell";

// Export highlight cell renderers (with highlighting and PvP indicator support)
export { CurrencyHighlightCell } from "./CurrencyHighlightCell";
export { DefaultHighlightCell } from "./DefaultHighlightCell";
export { NumberHighlightCell } from "./NumberHighlightCell";
export { StringHighlightCell } from "./StringHighlightCell";

// Export shared components
export { LoadMoreRow, type LoadMoreRowProps } from "./LoadMoreRow";
export { NoDataRow, type NoDataRowProps } from "./NoDataRow";
export { PvpIndicator } from "./PvpIndicator";

// Export utility functions
export { extractCellValue } from "./cell-utils";
export { extractPvpData, type PvpData } from "./pvp-utils";

// Export formatting utilities
export {
  formatCellValue,
  formatCompactNumber,
  formatCurrency,
  formatDecimal,
  formatNumber,
  type FormatOptions,
  formatPercent,
  type FormatType,
  formatValue,
  isNumericFormat,
  isRightAligned,
  parseNumericValue,
} from "./formatters";

// Export cell rendering utilities
export {
  extractCellData,
  type ExtractedCellData,
  extractHighlight,
  getHighlightClasses,
  getValueBasedHighlightClasses,
  type HighlightClasses,
  type HighlightColor,
  renderBadge,
  renderEmptyValue,
  renderEmptyWithPvp,
  renderHighlightedValue,
  renderValueWithBadge,
  renderValueWithPvp,
} from "./cell-renderers";

// Export types
export type { RegionMetadata, RetailerMetadata, SKUCellProps } from "./SKUCell";

export function registerDefaultCells(): void {
  // FCs use CellRendererProps; registry stores RegisteredCellRenderer (row: unknown)
  const asRegistered = (cell: unknown) => cell as import("../types").RegisteredCellRenderer;

  // Base cells (simple, no highlighting/PvP)
  registerCell("default", asRegistered(DefaultCell));
  registerCell("string", asRegistered(StringCell));
  registerCell("number", asRegistered(NumberCell));
  registerCell("percentage", asRegistered(NumberCell));
  registerCell("currency", asRegistered(CurrencyCell));
  registerCell("currency_plan", asRegistered(CurrencyPlanCell));
  registerCell("currency_forecast", asRegistered(CurrencyForecastCell));
  registerCell("sku", asRegistered(SKUCell));

  // Highlight cells (with highlighting and PvP indicator)
  registerCell("default_highlight", asRegistered(DefaultHighlightCell));
  registerCell("string_highlight", asRegistered(StringHighlightCell));
  registerCell("number_highlight", asRegistered(NumberHighlightCell));
  registerCell("percentage_highlight", asRegistered(NumberHighlightCell));
  registerCell("currency_highlight", asRegistered(CurrencyHighlightCell));

  // Competitor/benchmark cells
  registerCell("metric_with_benchmark", asRegistered(CompetitorMetricCell));
}

// Auto-register on module load
registerDefaultCells();

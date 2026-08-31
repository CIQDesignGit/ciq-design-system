/**
 * PvP (Period vs Period) Indicator Component
 * Displays period-over-period comparison with arrow and percentage
 */

import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";

import { formatDecimal } from "./formatters";
import { type PvpData } from "./pvp-utils";

interface PvpIndicatorProps {
  readonly data: PvpData;
  readonly currentValue?: number | null;
  readonly isPercentPvp?: boolean;
}

/**
 * PvP Indicator displays the period-over-period change
 * Shows an up/down arrow with the percentage change
 */
export const PvpIndicator: React.FC<PvpIndicatorProps> = ({ data, isPercentPvp = true }) => {
  const { previousPeriodPercentChange, previousPeriodValue } = data;

  const displayValue = isPercentPvp ? previousPeriodPercentChange : previousPeriodValue;

  if (displayValue === null || displayValue === undefined) {
    return null;
  }

  const isPositive = displayValue > 0;
  const isNegative = displayValue < 0;

  const colorClass = isPositive
    ? "text-emerald-600"
    : isNegative
      ? "text-red-500"
      : "text-slate-500";

  const Icon = isPositive ? ChevronUp : isNegative ? ChevronDown : null;

  return (
    <span className={`inline-flex items-center text-[11px] tabular-nums ${colorClass}`}>
      {Icon && <Icon className="h-3 w-3 mr-0.3" strokeWidth={2.5} />}
      <span>
        {formatDecimal(Math.abs(displayValue))}
        {isPercentPvp ? "%" : ""}
      </span>
    </span>
  );
};

export default PvpIndicator;

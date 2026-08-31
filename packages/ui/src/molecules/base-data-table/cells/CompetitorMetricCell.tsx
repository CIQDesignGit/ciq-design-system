import { Info } from "lucide-react";
import React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/atoms/tooltip";
import { cn } from "@/lib/utils";

import type { CellRendererProps } from "../types";
import { extractCellData, renderEmptyValue } from "./cell-renderers";
import { extractCategoryLeaderData, extractCompetitorData } from "./competitor-utils";
import { formatCompactNumber, formatCurrency, formatPercent } from "./formatters";
import { PvpIndicator } from "./PvpIndicator";

function formatByColumnType(numValue: number, columnType: string): string {
  if (columnType === "currency") return formatCurrency(numValue);
  if (columnType === "number") return formatCompactNumber(numValue);
  return formatPercent(numValue);
}

export const CompetitorMetricCell: React.FC<CellRendererProps> = ({ value, column }) => {
  const [clHovered, setClHovered] = React.useState(false);
  const { displayValue, pvpData, numValue } = extractCellData(value);

  if (displayValue == null || numValue === null) {
    return renderEmptyValue();
  }

  const columnType = column.type ?? "default";
  const isPercentage = column.format === "percentage";
  const formattedValue = isPercentage
    ? formatPercent(numValue)
    : formatByColumnType(numValue, columnType);

  const competitor = extractCompetitorData(value);
  const catLeader = extractCategoryLeaderData(value);
  const hasSubline = competitor !== null || catLeader !== null;

  return (
    <div className={cn("flex flex-col items-start", !hasSubline && "py-1")}>
      <div className="flex items-center gap-2">
        <span className="text-slate-800 font-medium text-sm tabular-nums">{formattedValue}</span>
        {pvpData && <PvpIndicator data={pvpData} currentValue={numValue} />}
      </div>
      {competitor && (
        <span className="text-[11px] leading-tight text-muted-foreground mt-0.5">
          vs. Comp {formatByColumnType(competitor.competitorValue, columnType)}
          {competitor.clientCompDiff != null && (
            <span className={competitor.clientCompDiff >= 0 ? "text-emerald-600" : "text-red-500"}>
              {" "}
              {competitor.clientCompDiff >= 0 ? "+" : ""}
              {formatByColumnType(competitor.clientCompDiff, columnType)}
            </span>
          )}
        </span>
      )}
      {catLeader && (
        <span
          className="inline-flex items-center text-[11px] leading-tight text-muted-foreground mt-1"
          onMouseEnter={() => setClHovered(true)}
          onMouseLeave={() => setClHovered(false)}
        >
          <span>vs. CL {formatByColumnType(catLeader.categoryLeaderValue, columnType)}</span>
          {catLeader.categoryLeaderPvpPercentChange != null && (
            <span>
              {" "}
              ({catLeader.categoryLeaderPvpPercentChange >= 0 ? "+" : ""}
              {catLeader.categoryLeaderPvpPercentChange.toFixed(1)}%)
            </span>
          )}
          {clHovered && (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-0.5 cursor-help">
                    <Info className="h-3.5 w-3.5 text-white fill-slate-500" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" align="start">
                  <span className="text-sm">
                    Category Leader: {catLeader.categoryLeaderLabel} (
                    {formatByColumnType(catLeader.categoryLeaderValue, columnType)})
                  </span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </span>
      )}
    </div>
  );
};

export default CompetitorMetricCell;

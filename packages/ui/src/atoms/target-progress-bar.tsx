import * as React from "react";

import { cn } from "@/lib/utils";

export interface ProgressSegment {
  label: string;
  value: number;
  color: string;
}

export interface TargetProgressBarProps {
  segments: [ProgressSegment, ProgressSegment];
  showLabels?: boolean;
  formatValue?: (value: number) => string;
  height?: string;
}

function widthsFor([achieved, target]: [ProgressSegment, ProgressSegment]) {
  if (achieved.value >= target.value) {
    return [{ color: achieved.color, width: 1 }];
  }
  return [
    { color: achieved.color, width: achieved.value },
    { color: target.color, width: target.value - achieved.value },
  ];
}

function TargetProgressBar({
  segments,
  showLabels = false,
  formatValue = (value) => value.toLocaleString(),
  height = "h-2",
}: TargetProgressBarProps) {
  const bars = widthsFor(segments);

  return (
    <div className="flex flex-col gap-3 w-full min-w-0">
      <div className="flex items-center w-full min-w-0">
        {bars.map((bar, index) => (
          <React.Fragment key={`${bar.color}-${index}`}>
            <div
              className={cn(
                "min-w-0",
                height,
                bar.color,
                index === 0 && "rounded-l-sm",
                index === bars.length - 1 && "rounded-r-sm"
              )}
              style={{ flex: `${bar.width} 1 0%` }}
            />
            {index < bars.length - 1 ? (
              <div
                className={cn("w-px shrink-0 rounded-full h-3", bar.color)}
              />
            ) : null}
          </React.Fragment>
        ))}
      </div>
      {showLabels ? (
        <div className="flex items-start justify-between">
          {segments.map((segment) => (
            <div key={segment.label} className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <span
                  className={cn("size-2 rounded-sm shrink-0", segment.color)}
                />
                <span className="text-[10px] text-tertiary-text">
                  {segment.label}
                </span>
              </div>
              <span className="text-sm font-semibold text-secondary">
                {formatValue(segment.value)}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export { TargetProgressBar };

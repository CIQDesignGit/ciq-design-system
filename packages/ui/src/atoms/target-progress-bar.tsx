import React from "react";

import { cn } from "@/lib/utils";

export interface ProgressSegment {
  label: string;
  value: number;
  color: string;
}

interface TargetProgressBarProps {
  readonly segments: ProgressSegment[];
  readonly showLabels?: boolean;
  readonly formatValue?: (value: number) => string;
  readonly height?: string;
}

const DEFAULT_FORMAT = (v: number): string => v.toLocaleString();

interface BarSlice {
  color: string;
  width: number;
}

function computeBarSlices(segments: ProgressSegment[]): BarSlice[] {
  const [achieved, target] = segments;

  if (achieved.value >= target.value) {
    return [{ color: achieved.color, width: 1 }];
  }

  return [
    { color: achieved.color, width: achieved.value },
    { color: target.color, width: target.value - achieved.value },
  ];
}

export function TargetProgressBar({
  segments,
  showLabels = false,
  formatValue = DEFAULT_FORMAT,
  height = "h-2",
}: TargetProgressBarProps): React.ReactElement {
  const slices = computeBarSlices(segments);

  return (
    <div className="flex flex-col gap-3 w-full min-w-0">
      <div className="flex items-center w-full min-w-0">
        {slices.map((slice, index) => (
          <React.Fragment key={index}>
            <div
              className={cn(
                "min-w-0",
                height,
                slice.color,
                index === 0 && "rounded-l-sm",
                index === slices.length - 1 && "rounded-r-sm"
              )}
              style={{ flex: `${slice.width} 1 0%` }}
            />
            {index < slices.length - 1 && (
              <div className={cn("w-px shrink-0 rounded-full h-3", slice.color)} />
            )}
          </React.Fragment>
        ))}
      </div>

      {showLabels && (
        <div className="flex items-start justify-between">
          {segments.map((segment) => (
            <div key={segment.label} className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <span className={cn("size-2 rounded-sm shrink-0", segment.color)} />
                <span className="text-[10px] text-tertiary-text">{segment.label}</span>
              </div>
              <span className="text-sm font-semibold text-secondary">
                {formatValue(segment.value)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

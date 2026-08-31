/**
 * ValuesList Component
 * Virtualized and non-virtualized list components for filter values
 * Automatically switches to virtualization for large datasets (100+ items)
 */

import { useVirtualizer } from "@tanstack/react-virtual";
import React, { useRef } from "react";

import { Button } from "@/atoms/button";
import { IndeterminateCheckbox } from "@/atoms/indeterminate-checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/atoms/tooltip";
import { useIsTruncated } from "@/hooks/use-is-truncated";
import { cn } from "@/lib/utils";

import type { FilterDimensionValue, ValuesListProps } from "./types";

const VIRTUALIZATION_CONFIG = {
  estimatedItemHeight: 36,
  overscan: 5,
  // Threshold to enable virtualization (items count)
  threshold: 100,
};

const MAX_HEIGHT_CLASSES: Record<number, string> = {
  280: "max-h-[280px]",
};

interface SelectAllRowProps {
  readonly allSelected: boolean;
  readonly someSelected: boolean;
  readonly onSelectAll: () => void;
  readonly onClearAll: () => void;
}

const SelectAllRow: React.FC<SelectAllRowProps> = ({
  allSelected,
  someSelected,
  onSelectAll,
  onClearAll,
}) => (
  <div className="px-3 py-2 flex items-center justify-between">
    <label className="flex items-center gap-2 cursor-pointer">
      <IndeterminateCheckbox
        checked={allSelected}
        indeterminate={someSelected}
        onChange={allSelected ? onClearAll : onSelectAll}
        className="accent-primary shrink-0"
      />
      <span className="text-sm text-secondary font-medium">Select all</span>
    </label>
    <Button
      onClick={onClearAll}
      variant="ghost"
      className="text-slate-400 text-xs hover:text-violet-700 font-normal h-auto p-0 hover:bg-transparent"
    >
      Clear all
    </Button>
  </div>
);

/** Renders a value's label, wrapping it in a tooltip showing the full text only when
 * the label is actually truncated by CSS `truncate` — detected dynamically per-render,
 * so callers don't need to opt in per dimension. */
function ValueLabel({ label }: { readonly label: string }): React.ReactElement {
  const spanRef = useRef<HTMLSpanElement>(null);
  const isTruncated = useIsTruncated(spanRef, [label]);
  const span = (
    <span ref={spanRef} className="text-sm truncate text-slate-900 min-w-0">
      {label}
    </span>
  );
  if (!isTruncated) return span;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{span}</TooltipTrigger>
        <TooltipContent side="right" className="z-[110] max-w-xs bg-black text-white">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const VirtualizedValuesList: React.FC<ValuesListProps> = ({
  values,
  selectedValues,
  onToggle,
  maxHeight = 280,
  testId = "filter-bar-label",
  selectAllProps,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: values.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => VIRTUALIZATION_CONFIG.estimatedItemHeight,
    overscan: VIRTUALIZATION_CONFIG.overscan,
  });

  const maxHeightClass = maxHeight ? MAX_HEIGHT_CLASSES[maxHeight] : undefined;

  return (
    <div
      ref={parentRef}
      className={cn("flex-1 overflow-y-auto", maxHeightClass)}
      style={maxHeightClass ? undefined : { maxHeight }}
    >
      {selectAllProps && <SelectAllRow {...selectAllProps} />}
      <div className="relative w-full" style={{ height: rowVirtualizer.getTotalSize() }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const filterValue = values[virtualRow.index];
          const isChecked = selectedValues.includes(filterValue.value);

          return (
            <label
              key={virtualRow.key}
              data-index={virtualRow.index}
              className="absolute top-0 left-0 w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer overflow-hidden"
              style={{
                height: virtualRow.size,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              data-testid={testId}
            >
              <IndeterminateCheckbox
                checked={isChecked}
                onChange={() => onToggle(filterValue.value)}
                className="accent-primary shrink-0"
              />
              <ValueLabel label={filterValue.label} />
            </label>
          );
        })}
      </div>
    </div>
  );
};

interface SimpleValuesListProps {
  readonly values: FilterDimensionValue[];
  readonly selectedValues: string[];
  readonly onToggle: (value: string) => void;
  readonly maxHeight?: number;
  readonly testId?: string;
  readonly selectAllProps?: ValuesListProps["selectAllProps"];
}

const SimpleValuesList: React.FC<SimpleValuesListProps> = ({
  values,
  selectedValues,
  onToggle,
  maxHeight,
  testId = "filter-bar-label",
  selectAllProps,
}) => {
  const maxHeightClass = maxHeight ? MAX_HEIGHT_CLASSES[maxHeight] : undefined;

  return (
    <div
      className={cn("flex-1 overflow-y-auto", maxHeightClass)}
      style={maxHeightClass ? undefined : maxHeight ? { maxHeight } : undefined}
    >
      {selectAllProps && <SelectAllRow {...selectAllProps} />}
      {values.map((filterValue) => {
        const isChecked = selectedValues.includes(filterValue.value);

        return (
          <label
            key={filterValue.value}
            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer"
            data-testid={testId}
          >
            <IndeterminateCheckbox
              checked={isChecked}
              onChange={() => onToggle(filterValue.value)}
              className="accent-primary shrink-0"
            />
            <ValueLabel label={filterValue.label} />
          </label>
        );
      })}
    </div>
  );
};

export const ValuesList: React.FC<ValuesListProps> = ({
  values,
  selectedValues,
  onToggle,
  maxHeight,
  testId,
  forceVirtualization = false,
  selectAllProps,
}) => {
  const shouldVirtualize = forceVirtualization || values.length >= VIRTUALIZATION_CONFIG.threshold;

  if (shouldVirtualize) {
    return (
      <VirtualizedValuesList
        values={values}
        selectedValues={selectedValues}
        onToggle={onToggle}
        maxHeight={maxHeight}
        testId={testId}
        selectAllProps={selectAllProps}
      />
    );
  }

  return (
    <SimpleValuesList
      values={values}
      selectedValues={selectedValues}
      onToggle={onToggle}
      maxHeight={maxHeight}
      testId={testId}
      selectAllProps={selectAllProps}
    />
  );
};

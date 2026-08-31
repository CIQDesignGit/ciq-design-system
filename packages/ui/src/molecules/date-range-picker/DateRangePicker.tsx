import dayjs from "dayjs";
import { Calendar as CalendarIcon, ChevronDown, Info } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { Button } from "@/atoms/button";
import { Input } from "@/atoms/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/atoms/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/atoms/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/atoms/tooltip";
import { cn } from "@/lib/utils";

import { CalendarMonth } from "./components";
import { useDateInputs, useDateRangeState } from "./hooks";
import { defaultComparePresets, defaultDateRangePresets } from "./presets";
import type {
  ComparePreset,
  DateRange,
  DateRangePickerProps,
  DateRangePickerValue,
  DateRangePreset,
} from "./types";
import {
  detectComparePresetFromRange,
  detectPresetFromRange,
  formatDate,
  formatDateRange,
  getDateBoundsError,
  normalizeDate,
  normalizeDateRange,
} from "./utils";

const buildRangeFromClick = (start: Date, end: Date): DateRange => {
  const startMoment = dayjs(start);
  const endMoment = dayjs(end);

  if (endMoment.isBefore(startMoment)) {
    return { from: end, to: start };
  }

  return { from: start, to: end };
};

export function DateRangePicker({
  value,
  onChange,
  presets = defaultDateRangePresets,
  comparePresets = defaultComparePresets,
  allowedCadences,
  allowedCompareCadences,
  showCompare = true,
  hidecannedsection = false,
  numberOfMonths = 2,
  disabled,
  minDate,
  maxDate,
  defaultPreset,
  defaultComparePreset,
  defaultValue,
  trigger,
  placeholder = "Select date range",
  className,
  align = "start",
  dateFormat = "MMM DD, YYYY",
  weekDays,
  hideInfoText = false,
  showWeekNumbers = true,
  container: portalContainer,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const normalizedMinDate = useMemo(() => normalizeDate(minDate ?? null), [minDate]);
  const normalizedMaxDate = useMemo(() => normalizeDate(maxDate ?? null), [maxDate]);

  // Filter presets based on allowedCadences
  const filteredPresets = useMemo(() => {
    if (!allowedCadences || allowedCadences.length === 0) {
      return presets;
    }
    return presets.filter((preset) => {
      const key = preset.key ?? preset.label;
      return allowedCadences.includes(key);
    });
  }, [presets, allowedCadences]);

  // Filter compare presets based on allowedCompareCadences
  const filteredComparePresets = useMemo(() => {
    if (!allowedCompareCadences || allowedCompareCadences.length === 0) {
      return comparePresets;
    }
    return comparePresets.filter((preset) => {
      const key = preset.key ?? preset.label;
      return allowedCompareCadences.includes(key);
    });
  }, [comparePresets, allowedCompareCadences]);

  // Group presets by category for the dropdown
  const groupedPresets = useMemo(() => {
    const categoryOrder = ["Days", "Weeks", "Month", "Quarter", "Year"];
    const groups: Record<string, typeof filteredPresets> = {};
    let customPreset: (typeof filteredPresets)[0] | null = null;

    for (const preset of filteredPresets) {
      const key = preset.key ?? preset.label;
      if (key === "custom") {
        customPreset = preset;
        continue;
      }

      const category = preset.category ?? "Other";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(preset);
    }

    // Sort groups by category order
    const sortedGroups = categoryOrder
      .filter((cat) => groups[cat]?.length > 0)
      .map((category) => ({
        category,
        presets: groups[category],
      }));

    // Add any remaining categories not in the order
    Object.keys(groups).forEach((category) => {
      if (!categoryOrder.includes(category)) {
        sortedGroups.push({ category, presets: groups[category] });
      }
    });

    return { groups: sortedGroups, customPreset };
  }, [filteredPresets]);

  const {
    localRange,
    localCompareRange,
    selectedCadence,
    selectedCompareCadence,
    activeCalendar,
    selectionStart,
    calendarMonth,
    isPrimaryRangeSelected,
    hasChanges,
    setLocalRange,
    setLocalCompareRange,
    setSelectedCadence,
    setSelectedCompareCadence,
    setActiveCalendar,
    setSelectionStart,
    handleCadenceChange,
    handleCompareCadenceChange,
    handleApply: applyChanges,
    handleReset,
    resetToCommitted,
    goToPreviousMonth,
    goToNextMonth,
  } = useDateRangeState({
    value,
    onChange,
    presets: filteredPresets,
    comparePresets: filteredComparePresets,
    defaultPreset,
    defaultComparePreset,
    defaultValue,
    showCompare,
    maxDate,
  });

  // Validation: check if dates are out of bounds
  const primaryBoundsError = useMemo(
    () => getDateBoundsError(localRange, normalizedMinDate, normalizedMaxDate, dateFormat),
    [localRange, normalizedMinDate, normalizedMaxDate, dateFormat]
  );

  const compareBoundsError = useMemo(
    () =>
      showCompare && isPrimaryRangeSelected
        ? getDateBoundsError(localCompareRange, normalizedMinDate, normalizedMaxDate, dateFormat)
        : null,
    [
      localCompareRange,
      normalizedMinDate,
      normalizedMaxDate,
      dateFormat,
      showCompare,
      isPrimaryRangeSelected,
    ]
  );

  const hasValidationErrors = primaryBoundsError !== null || compareBoundsError !== null;

  // Determine if apply button should be disabled
  const isApplyDisabled = useMemo(() => {
    // Disabled if no complete primary range
    if (!localRange.from || !localRange.to) return true;
    // Disabled if there are validation errors
    if (hasValidationErrors) return true;
    // Disabled if no changes from committed value
    if (!hasChanges) return true;
    return false;
  }, [localRange, hasValidationErrors, hasChanges]);

  // Handle popover open state changes
  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (disabled) return;

      if (isOpen) {
        // When opening, ensure primary calendar is focused
        setActiveCalendar("primary");
        setSelectionStart(null);
      } else {
        // When closing without applying, reset to committed state
        resetToCommitted();
      }

      setOpen(isOpen);
    },
    [disabled, resetToCommitted, setActiveCalendar, setSelectionStart]
  );

  const isDateDisabled = useCallback(
    (date: dayjs.Dayjs): boolean => {
      if (minDate && date.isBefore(dayjs(minDate), "day")) return true;
      if (maxDate && date.isAfter(dayjs(maxDate), "day")) return true;

      return false;
    },
    [minDate, maxDate]
  );

  const {
    primaryFromInput,
    primaryToInput,
    compareFromInput,
    compareToInput,
    inputErrors,
    setPrimaryFromInput,
    setPrimaryToInput,
    setCompareFromInput,
    setCompareToInput,
    handleInputKeyDown,
    handleDateInputBlur,
  } = useDateInputs({
    localRange,
    localCompareRange,
    dateFormat,
    isDateDisabled,
    setLocalRange,
    setLocalCompareRange,
    setSelectedCadence,
    setSelectedCompareCadence,
    presets: filteredPresets,
    comparePresets: filteredComparePresets,
    minDate: normalizedMinDate,
    maxDate: normalizedMaxDate,
  });

  const handleDateClick = useCallback(
    (date: dayjs.Dayjs) => {
      const clickedDate = date.toDate();

      if (activeCalendar === "primary") {
        if (!selectionStart || localRange.to) {
          setLocalRange({ from: clickedDate, to: null });
          setSelectionStart(clickedDate);
          setSelectedCadence("custom");
        } else {
          const newRange = buildRangeFromClick(selectionStart, clickedDate);
          setLocalRange(newRange);
          setSelectionStart(null);
          const detectedPreset = detectPresetFromRange(
            newRange,
            filteredPresets,
            normalizedMaxDate ?? undefined
          );
          setSelectedCadence(detectedPreset ?? "custom");

          if (showCompare) {
            setActiveCalendar("compare");
          }
        }
      } else {
        if (!selectionStart || localCompareRange.to) {
          setLocalCompareRange({ from: clickedDate, to: null });
          setSelectionStart(clickedDate);
          setSelectedCompareCadence("custom");
        } else {
          // Second click - complete selection
          const newCompareRange = buildRangeFromClick(selectionStart, clickedDate);
          setLocalCompareRange(newCompareRange);
          setSelectionStart(null);
          const detectedComparePreset = detectComparePresetFromRange(
            newCompareRange,
            localRange,
            filteredComparePresets
          );
          setSelectedCompareCadence(detectedComparePreset ?? "custom");
        }
      }
    },
    [
      activeCalendar,
      selectionStart,
      localRange,
      localCompareRange.to,
      showCompare,
      filteredPresets,
      filteredComparePresets,
      setLocalRange,
      setLocalCompareRange,
      setSelectionStart,
      setSelectedCadence,
      setSelectedCompareCadence,
      setActiveCalendar,
    ]
  );

  const handleApply = useCallback(() => {
    applyChanges();
    setOpen(false);
  }, [applyChanges]);

  // Normalize display ranges (handles both Date objects and ISO strings)
  const displayRange = normalizeDateRange(value?.range);
  const displayCompareRange = normalizeDateRange(value?.compareRange);
  const hasCommittedSelection = displayRange.from && displayRange.to;

  const months = useMemo(() => {
    const result: dayjs.Dayjs[] = [];
    for (let i = 0; i < numberOfMonths; i++) {
      result.push(calendarMonth.clone().add(i, "month"));
    }
    return result;
  }, [calendarMonth, numberOfMonths]);

  return (
    <Popover open={disabled ? false : open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {trigger ?? (
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "justify-start font-normal h-auto p-0 pr-3 min-w-[280px] overflow-hidden",
              !hasCommittedSelection && "text-muted-foreground",
              className
            )}
          >
            <span className="bg-slate-100 py-3.5 pl-3 pr-1">
              <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
            </span>
            <div className="flex flex-col items-start">
              {hasCommittedSelection ? (
                <>
                  <span className="text-xs text-secondary font-medium">
                    {formatDateRange(displayRange, dateFormat)}
                  </span>
                  {showCompare && displayCompareRange.from && displayCompareRange.to && (
                    <span className="text-xs text-tertiary-text">
                      vs. {formatDateRange(displayCompareRange, dateFormat)}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-sm">{placeholder}</span>
              )}
            </div>
            <ChevronDown className="ml-auto h-4 w-4 text-slate-400" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden mr-3"
        align={align}
        sideOffset={8}
        container={portalContainer}
      >
        <TooltipProvider delayDuration={300}>
          <div className="flex flex-col">
            <div className="flex">
              <div className={cn("bg-white", !hidecannedsection && "border-r border-slate-200")}>
                <div className="flex">
                  {months.map((month, index) => (
                    <CalendarMonth
                      key={index}
                      month={month}
                      primaryRange={localRange}
                      compareRange={localCompareRange}
                      showCompare={showCompare && isPrimaryRangeSelected}
                      onDateClick={handleDateClick}
                      isDateDisabled={isDateDisabled}
                      isFirst={index === 0}
                      isLast={index === months.length - 1}
                      onPrevMonth={goToPreviousMonth}
                      onNextMonth={goToNextMonth}
                      weekdayLabels={weekDays}
                      showWeekNumbers={showWeekNumbers}
                    />
                  ))}
                </div>
              </div>

              {!hidecannedsection && (
                <div className="w-[280px] p-4 flex flex-col bg-white">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-primary">Date Range</h3>
                    <Select value={selectedCadence} onValueChange={handleCadenceChange}>
                      <SelectTrigger className="w-full text-secondary text-xs shadow-xs">
                        <SelectValue placeholder="Select cadence">
                          {filteredPresets.find((p) => (p.key ?? p.label) === selectedCadence)
                            ?.label ?? selectedCadence}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent
                        container={portalContainer}
                        position="popper"
                        sideOffset={4}
                        className="!max-h-72 w-[var(--radix-select-trigger-width)]"
                      >
                        {groupedPresets.groups.map((group, groupIndex) => (
                          <SelectGroup key={group.category}>
                            {groupIndex > 0 && <SelectSeparator />}
                            <SelectLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                              {group.category}
                            </SelectLabel>
                            {group.presets.map((preset) => (
                              <SelectItem
                                key={preset.key ?? preset.label}
                                value={preset.key ?? preset.label}
                                className="text-secondary text-sm"
                              >
                                {preset.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                        {groupedPresets.customPreset && (
                          <>
                            <SelectSeparator />
                            <SelectItem
                              value={
                                groupedPresets.customPreset.key ?? groupedPresets.customPreset.label
                              }
                              className="text-secondary text-sm"
                            >
                              {groupedPresets.customPreset.label}
                            </SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2">
                      <Tooltip open={inputErrors.primaryFrom ? undefined : false}>
                        <TooltipTrigger asChild>
                          <Input
                            value={primaryFromInput}
                            onChange={(e) => setPrimaryFromInput(e.target.value)}
                            onBlur={(e) => handleDateInputBlur("from", "primary", e.target.value)}
                            onKeyDown={(e) =>
                              handleInputKeyDown(e, "from", "primary", primaryFromInput)
                            }
                            onFocus={() => {
                              setActiveCalendar("primary");
                              setSelectionStart(null);
                            }}
                            placeholder="Start date"
                            className={cn(
                              "h-9 bg-white rounded-md !text-xs text-secondary shadow-xs",
                              activeCalendar === "primary" &&
                                !inputErrors.primaryFrom &&
                                "ring-2 ring-primary/20 border-primary",
                              inputErrors.primaryFrom && "border-red-500 ring-2 ring-red-200"
                            )}
                          />
                        </TooltipTrigger>
                        {inputErrors.primaryFrom && (
                          <TooltipContent
                            container={portalContainer}
                            className="text-xs bg-red-50 text-red-700 border-red-200"
                          >
                            {inputErrors.primaryFrom}
                          </TooltipContent>
                        )}
                      </Tooltip>
                      <span className="text-slate-400">-</span>
                      <Tooltip open={inputErrors.primaryTo ? undefined : false}>
                        <TooltipTrigger asChild>
                          <Input
                            value={primaryToInput}
                            onChange={(e) => setPrimaryToInput(e.target.value)}
                            onBlur={(e) => handleDateInputBlur("to", "primary", e.target.value)}
                            onKeyDown={(e) =>
                              handleInputKeyDown(e, "to", "primary", primaryToInput)
                            }
                            onFocus={() => {
                              setActiveCalendar("primary");
                              if (localRange.from) {
                                setSelectionStart(localRange.from);
                                setLocalRange({ from: localRange.from, to: null });
                              } else {
                                setSelectionStart(null);
                              }
                            }}
                            placeholder="End date"
                            className={cn(
                              "h-9 bg-white rounded-md !text-xs text-secondary shadow-xs",
                              activeCalendar === "primary" &&
                                !inputErrors.primaryTo &&
                                "ring-2 ring-primary/20 border-primary",
                              inputErrors.primaryTo && "border-red-500 ring-2 ring-red-200"
                            )}
                          />
                        </TooltipTrigger>
                        {inputErrors.primaryTo && (
                          <TooltipContent
                            container={portalContainer}
                            className="text-xs bg-red-50 text-red-700 border-red-200"
                          >
                            {inputErrors.primaryTo}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </div>
                  </div>

                  {showCompare && (
                    <div
                      className={cn(
                        "space-y-3 mt-4",
                        !isPrimaryRangeSelected && "opacity-50 pointer-events-none"
                      )}
                    >
                      <h3 className="text-sm font-medium text-sky-500">Compare to</h3>
                      <Select
                        value={selectedCompareCadence}
                        onValueChange={handleCompareCadenceChange}
                        disabled={!isPrimaryRangeSelected}
                      >
                        <SelectTrigger className="w-full text-secondary text-xs shadow-xs">
                          <SelectValue placeholder="Select compare cadence">
                            {filteredComparePresets.find(
                              (p) => (p.key ?? p.label) === selectedCompareCadence
                            )?.label ?? selectedCompareCadence}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent
                          container={portalContainer}
                          position="popper"
                          sideOffset={4}
                          className="!max-h-72 w-[var(--radix-select-trigger-width)]"
                        >
                          {filteredComparePresets.map((preset) => (
                            <SelectItem
                              key={preset.key ?? preset.label}
                              value={preset.key ?? preset.label}
                              className="text-secondary text-sm"
                            >
                              {preset.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <div className="flex items-center gap-2">
                        <Tooltip open={inputErrors.compareFrom ? undefined : false}>
                          <TooltipTrigger asChild>
                            <Input
                              value={compareFromInput}
                              onChange={(e) => setCompareFromInput(e.target.value)}
                              onBlur={(e) => handleDateInputBlur("from", "compare", e.target.value)}
                              onKeyDown={(e) =>
                                handleInputKeyDown(e, "from", "compare", compareFromInput)
                              }
                              onFocus={() => {
                                setActiveCalendar("compare");
                                setSelectionStart(null);
                              }}
                              placeholder="Start date"
                              disabled={!isPrimaryRangeSelected}
                              className={cn(
                                "h-9 bg-white rounded-md !text-xs text-secondary shadow-xs",
                                activeCalendar === "compare" &&
                                  isPrimaryRangeSelected &&
                                  !inputErrors.compareFrom &&
                                  "ring-2 ring-sky-200 border-sky-400",
                                inputErrors.compareFrom && "border-red-500 ring-2 ring-red-200"
                              )}
                            />
                          </TooltipTrigger>
                          {inputErrors.compareFrom && (
                            <TooltipContent
                              container={portalContainer}
                              className="text-xs bg-red-50 text-red-700 border-red-200"
                            >
                              {inputErrors.compareFrom}
                            </TooltipContent>
                          )}
                        </Tooltip>
                        <span className="text-slate-400">-</span>
                        <Tooltip open={inputErrors.compareTo ? undefined : false}>
                          <TooltipTrigger asChild>
                            <Input
                              value={compareToInput}
                              onChange={(e) => setCompareToInput(e.target.value)}
                              onBlur={(e) => handleDateInputBlur("to", "compare", e.target.value)}
                              onKeyDown={(e) =>
                                handleInputKeyDown(e, "to", "compare", compareToInput)
                              }
                              onFocus={() => {
                                setActiveCalendar("compare");
                                if (localCompareRange.from) {
                                  setSelectionStart(localCompareRange.from);
                                  setLocalCompareRange({ from: localCompareRange.from, to: null });
                                } else {
                                  setSelectionStart(null);
                                }
                              }}
                              placeholder="End date"
                              disabled={!isPrimaryRangeSelected}
                              className={cn(
                                "h-9 bg-white rounded-md !text-xs text-secondary shadow-xs",
                                activeCalendar === "compare" &&
                                  isPrimaryRangeSelected &&
                                  !inputErrors.compareTo &&
                                  "ring-2 ring-sky-200 border-sky-400",
                                inputErrors.compareTo && "border-red-500 ring-2 ring-red-200"
                              )}
                            />
                          </TooltipTrigger>
                          {inputErrors.compareTo && (
                            <TooltipContent
                              container={portalContainer}
                              className="text-xs bg-red-50 text-red-700 border-red-200"
                            >
                              {inputErrors.compareTo}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer with info text and action buttons */}
            <div className="border-t border-slate-200 px-4 py-3 flex items-center justify-between bg-white">
              {!hideInfoText && normalizedMinDate && normalizedMaxDate ? (
                <p className="text-xs text-secondary flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                  <span>
                    You can select dates between{" "}
                    <span className="font-medium">
                      {formatDate(normalizedMinDate, dateFormat)} and{" "}
                      {formatDate(normalizedMaxDate, dateFormat)},{" "}
                    </span>
                    based on available data.
                  </span>
                </p>
              ) : (
                <div />
              )}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleReset}
                  className="h-8 text-black text-xs"
                >
                  Reset
                </Button>
                {hasValidationErrors ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-block">
                        <Button
                          disabled
                          size="sm"
                          className="h-8 bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                        >
                          Apply
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent
                      container={portalContainer}
                      side="top"
                      className="text-xs py-1.5 px-2 bg-red-50 text-red-600 border-red-200"
                    >
                      Date out of allowed range
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Button
                    size="sm"
                    onClick={handleApply}
                    disabled={isApplyDisabled}
                    className="h-8 bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                  >
                    Apply
                  </Button>
                )}
              </div>
            </div>
          </div>
        </TooltipProvider>
      </PopoverContent>
    </Popover>
  );
}

export type { ComparePreset, DateRangePickerProps, DateRangePickerValue, DateRangePreset };

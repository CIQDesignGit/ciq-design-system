import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { ComparePreset, DateRange, DateRangePickerValue, DateRangePreset } from "../types";
import {
  areDateRangesEqualNullable,
  dateRangeToISOStrings,
  detectComparePresetFromRange,
  detectPresetFromRange,
  emptyDateRange,
  getPresetKey,
  normalizeDate,
  normalizeDateRange,
} from "../utils";

export interface UseDateRangeStateOptions {
  value?: DateRangePickerValue;
  onChange?: (value: DateRangePickerValue) => void;
  presets: DateRangePreset[];
  comparePresets: ComparePreset[];
  defaultPreset?: string;
  defaultComparePreset?: string;
  defaultValue?: DateRangePickerValue;
  showCompare: boolean;
  maxDate?: Date | string;
}

export interface UseDateRangeStateReturn {
  localRange: DateRange;
  localCompareRange: DateRange;
  selectedCadence: string;
  selectedCompareCadence: string;
  activeCalendar: "primary" | "compare";
  selectionStart: Date | null;
  calendarMonth: dayjs.Dayjs;
  isPrimaryRangeSelected: boolean;
  /** Whether local state differs from committed value */
  hasChanges: boolean;
  setLocalRange: React.Dispatch<React.SetStateAction<DateRange>>;
  setLocalCompareRange: React.Dispatch<React.SetStateAction<DateRange>>;
  setSelectedCadence: React.Dispatch<React.SetStateAction<string>>;
  setSelectedCompareCadence: React.Dispatch<React.SetStateAction<string>>;
  setActiveCalendar: React.Dispatch<React.SetStateAction<"primary" | "compare">>;
  setSelectionStart: React.Dispatch<React.SetStateAction<Date | null>>;
  setCalendarMonth: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
  handleCadenceChange: (cadenceKey: string) => void;
  handleCompareCadenceChange: (cadenceKey: string) => void;
  handleApply: () => void;
  handleReset: () => void;
  /** Reset local state to committed value (for closing without applying) */
  resetToCommitted: () => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
}

export function useDateRangeState({
  value,
  onChange,
  presets,
  comparePresets,
  defaultPreset,
  defaultComparePreset,
  defaultValue,
  showCompare,
  maxDate,
}: UseDateRangeStateOptions): UseDateRangeStateReturn {
  const normalizedMaxDate = useMemo(() => normalizeDate(maxDate ?? null), [maxDate]);

  // Normalize input ranges (handles both Date objects and ISO strings)
  const normalizedRange = useMemo(() => normalizeDateRange(value?.range), [value?.range]);
  const normalizedCompareRange = useMemo(
    () => normalizeDateRange(value?.compareRange),
    [value?.compareRange]
  );

  const resolveCadence = useCallback(
    (opts: { cadence?: string; range: DateRange }): string => {
      if (opts.cadence) return opts.cadence;
      if (opts.range.from && opts.range.to) {
        const detected = detectPresetFromRange(opts.range, presets, normalizedMaxDate ?? undefined);
        return detected ?? "custom";
      }
      return "custom";
    },
    [presets, normalizedMaxDate]
  );

  const resolveCompareCadence = useCallback(
    (opts: { compareCadence?: string; compareRange: DateRange; range: DateRange }): string => {
      if (opts.compareCadence) return opts.compareCadence;
      if (opts.compareRange.from && opts.compareRange.to && opts.range.from && opts.range.to) {
        const detected = detectComparePresetFromRange(
          opts.compareRange,
          opts.range,
          comparePresets
        );
        return detected ?? "custom";
      }
      return "custom";
    },
    [comparePresets]
  );

  const [calendarMonth, setCalendarMonth] = useState<dayjs.Dayjs>(() => {
    if (normalizedRange.from) return dayjs(normalizedRange.from).startOf("month");
    return dayjs().subtract(1, "month").startOf("month");
  });

  const defaultsApplied = useRef(false);

  const [localRange, setLocalRange] = useState<DateRange>(normalizedRange);
  const [localCompareRange, setLocalCompareRange] = useState<DateRange>(normalizedCompareRange);

  // Auto-detect cadence from range if not explicitly provided
  const initialCadence = useMemo(
    () => resolveCadence({ cadence: value?.cadence, range: normalizedRange }),
    [resolveCadence, value?.cadence, normalizedRange]
  );

  // Auto-detect compare cadence from compare range if not explicitly provided
  const initialCompareCadence = useMemo(
    () =>
      resolveCompareCadence({
        compareCadence: value?.compareCadence,
        compareRange: normalizedCompareRange,
        range: normalizedRange,
      }),
    [resolveCompareCadence, value?.compareCadence, normalizedCompareRange, normalizedRange]
  );

  const [selectedCadence, setSelectedCadence] = useState<string>(initialCadence);
  const [selectedCompareCadence, setSelectedCompareCadence] =
    useState<string>(initialCompareCadence);

  const [activeCalendar, setActiveCalendar] = useState<"primary" | "compare">("primary");
  const [selectionStart, setSelectionStart] = useState<Date | null>(null);

  const isPrimaryRangeSelected = localRange.from !== null && localRange.to !== null;

  // Check if local state differs from committed value
  const hasChanges = useMemo(() => {
    const rangeChanged = !areDateRangesEqualNullable(localRange, normalizedRange);
    const compareRangeChanged =
      showCompare && !areDateRangesEqualNullable(localCompareRange, normalizedCompareRange);

    return rangeChanged || compareRangeChanged;
  }, [localRange, localCompareRange, normalizedRange, normalizedCompareRange, showCompare]);

  const findPreset = useCallback(
    (key: string) => {
      const preset = presets.find((p) => getPresetKey(p) === key || p.label === key);
      if (!preset && key !== "custom") {
        // Preset lookup miss — fall back without app logger
        console.error(`[DateRangePicker] Preset "${key}" not found. Available presets: ${presets.map((p) => getPresetKey(p)).join(", ")}. Falling back to first preset.`);
        return presets[0];
      }
      return preset;
    },
    [presets]
  );

  const findComparePreset = useCallback(
    (key: string) => {
      const preset = comparePresets.find((p) => getPresetKey(p) === key || p.label === key);
      if (!preset && key !== "custom") {
        // Preset lookup miss — fall back without app logger
        console.error(`[DateRangePicker] Compare preset "${key}" not found. Available presets: ${comparePresets.map((p) => getPresetKey(p)).join(", ")}. Falling back to first preset.`);
        return comparePresets[0];
      }
      return preset;
    },
    [comparePresets]
  );

  useEffect(() => {
    if (defaultsApplied.current) return;

    if (value?.range.from && value?.range.to) {
      defaultsApplied.current = true;
      return;
    }

    if (defaultValue?.range.from && defaultValue?.range.to) {
      const normalizedDefaultRange = normalizeDateRange(defaultValue.range);
      setLocalRange(normalizedDefaultRange);
      setSelectedCadence(defaultValue.cadence ?? "custom");
      if (normalizedDefaultRange.from) {
        setCalendarMonth(dayjs(normalizedDefaultRange.from).startOf("month"));
      }

      if (defaultValue.compareRange?.from && defaultValue.compareRange?.to) {
        setLocalCompareRange(normalizeDateRange(defaultValue.compareRange));
        setSelectedCompareCadence(defaultValue.compareCadence ?? "custom");
      }

      onChange?.({
        range: normalizedDefaultRange,
        compareRange: normalizeDateRange(defaultValue.compareRange),
        cadence: defaultValue.cadence,
        compareCadence: defaultValue.compareCadence,
      });
      defaultsApplied.current = true;
      return;
    }

    if (defaultPreset) {
      const preset = findPreset(defaultPreset);
      if (preset) {
        const presetKey = getPresetKey(preset);
        const newRange = preset.getValue(normalizedMaxDate ?? undefined);
        setLocalRange(newRange);
        setSelectedCadence(presetKey);
        if (newRange.from) {
          setCalendarMonth(dayjs(newRange.from).startOf("month"));
        }

        if (defaultComparePreset && newRange.from && newRange.to) {
          const comparePresetObj = findComparePreset(defaultComparePreset);
          if (comparePresetObj) {
            const compareKey = getPresetKey(comparePresetObj);
            const newCompareRange = comparePresetObj.getValue(newRange);
            setLocalCompareRange(newCompareRange);
            setSelectedCompareCadence(compareKey);
          }
        }

        const newValue: DateRangePickerValue = {
          range: newRange,
          cadence: presetKey,
        };
        if (defaultComparePreset && newRange.from && newRange.to) {
          const comparePresetObj = findComparePreset(defaultComparePreset);
          if (comparePresetObj) {
            newValue.compareRange = comparePresetObj.getValue(newRange);
            newValue.compareCadence = getPresetKey(comparePresetObj);
          }
        }
        onChange?.(newValue);
      }
    }
    defaultsApplied.current = true;
  }, [
    defaultValue,
    defaultPreset,
    defaultComparePreset,
    findPreset,
    findComparePreset,
    value?.range.from,
    value?.range.to,
    onChange,
    normalizedMaxDate,
  ]);

  useEffect(() => {
    if (value) {
      // Use normalized ranges (already converted from strings if needed)
      setLocalRange(normalizedRange);
      setLocalCompareRange(normalizedCompareRange);

      // Auto-detect cadence from range if not explicitly provided
      setSelectedCadence(resolveCadence({ cadence: value.cadence, range: normalizedRange }));

      // Auto-detect compare cadence from compare range if not explicitly provided
      setSelectedCompareCadence(
        resolveCompareCadence({
          compareCadence: value.compareCadence,
          compareRange: normalizedCompareRange,
          range: normalizedRange,
        })
      );
    }
  }, [value, normalizedRange, normalizedCompareRange, resolveCadence, resolveCompareCadence]);

  // Auto-update compare range when primary range changes and a non-custom compare cadence is selected
  useEffect(() => {
    if (
      localRange.from &&
      localRange.to &&
      selectedCompareCadence &&
      selectedCompareCadence !== "custom"
    ) {
      const comparePresetObj = findComparePreset(selectedCompareCadence);
      if (comparePresetObj) {
        const newCompareRange = comparePresetObj.getValue(localRange);
        setLocalCompareRange(newCompareRange);
      }
    }
  }, [localRange, selectedCompareCadence, findComparePreset]);

  const handleCadenceChange = useCallback(
    (cadenceKey: string) => {
      setSelectedCadence(cadenceKey);
      const preset = findPreset(cadenceKey);
      if (preset && cadenceKey !== "custom") {
        const newRange = preset.getValue(normalizedMaxDate ?? undefined);
        setLocalRange(newRange);
        if (newRange.from) {
          setCalendarMonth(dayjs(newRange.from).startOf("month"));
        }

        // Auto-update compare range if a non-custom compare cadence is selected
        if (
          newRange.from &&
          newRange.to &&
          selectedCompareCadence &&
          selectedCompareCadence !== "custom"
        ) {
          const comparePresetObj = findComparePreset(selectedCompareCadence);
          if (comparePresetObj) {
            const newCompareRange = comparePresetObj.getValue(newRange);
            setLocalCompareRange(newCompareRange);
          }
        }

        if (newRange.from && newRange.to && showCompare) {
          setActiveCalendar("compare");
        }
      } else {
        setActiveCalendar("primary");
      }
      setSelectionStart(null);
    },
    [findPreset, findComparePreset, showCompare, selectedCompareCadence, normalizedMaxDate]
  );

  const handleCompareCadenceChange = useCallback(
    (cadenceKey: string) => {
      setSelectedCompareCadence(cadenceKey);
      const preset = findComparePreset(cadenceKey);
      if (preset && cadenceKey !== "custom") {
        const newRange = preset.getValue(localRange);
        setLocalCompareRange(newRange);
      }
      setActiveCalendar("compare");
      setSelectionStart(null);
    },
    [findComparePreset, localRange]
  );

  const handleApply = useCallback(() => {
    // Output dates as ISO strings (YYYY-MM-DD) for API compatibility
    onChange?.({
      range: dateRangeToISOStrings(localRange),
      compareRange:
        showCompare && isPrimaryRangeSelected
          ? dateRangeToISOStrings(localCompareRange)
          : undefined,
      cadence: selectedCadence,
      compareCadence: showCompare && isPrimaryRangeSelected ? selectedCompareCadence : undefined,
    });
  }, [
    onChange,
    localRange,
    localCompareRange,
    showCompare,
    selectedCadence,
    selectedCompareCadence,
    isPrimaryRangeSelected,
  ]);

  const handleReset = useCallback(() => {
    if (defaultValue?.range.from && defaultValue?.range.to) {
      const normalizedDefaultRange = normalizeDateRange(defaultValue.range);
      setLocalRange(normalizedDefaultRange);
      setSelectedCadence(defaultValue.cadence ?? "custom");
      if (normalizedDefaultRange.from) {
        setCalendarMonth(dayjs(normalizedDefaultRange.from).startOf("month"));
      }

      if (defaultValue.compareRange?.from && defaultValue.compareRange?.to) {
        setLocalCompareRange(normalizeDateRange(defaultValue.compareRange));
        setSelectedCompareCadence(defaultValue.compareCadence ?? "custom");
      } else {
        setLocalCompareRange(emptyDateRange());
        setSelectedCompareCadence("custom");
      }
    } else if (defaultPreset) {
      const preset = findPreset(defaultPreset);
      if (preset) {
        const presetKey = getPresetKey(preset);
        const newRange = preset.getValue(normalizedMaxDate ?? undefined);
        setLocalRange(newRange);
        setSelectedCadence(presetKey);
        if (newRange.from) {
          setCalendarMonth(dayjs(newRange.from).startOf("month"));
        }

        if (defaultComparePreset && newRange.from && newRange.to) {
          const comparePresetObj = findComparePreset(defaultComparePreset);
          if (comparePresetObj) {
            const newCompareRange = comparePresetObj.getValue(newRange);
            setLocalCompareRange(newCompareRange);
            setSelectedCompareCadence(getPresetKey(comparePresetObj));
          }
        } else {
          setLocalCompareRange(emptyDateRange());
          setSelectedCompareCadence("custom");
        }
      }
    } else {
      setLocalRange(emptyDateRange());
      setLocalCompareRange(emptyDateRange());
      setSelectedCadence("custom");
      setSelectedCompareCadence("custom");
    }
    setSelectionStart(null);
    setActiveCalendar("primary");
  }, [
    defaultValue,
    defaultPreset,
    defaultComparePreset,
    findPreset,
    findComparePreset,
    normalizedMaxDate,
  ]);

  // Reset local state to committed value (for closing without applying)
  const resetToCommitted = useCallback(() => {
    setLocalRange(normalizedRange);
    setLocalCompareRange(normalizedCompareRange);
    setSelectedCadence(resolveCadence({ cadence: value?.cadence, range: normalizedRange }));
    setSelectedCompareCadence(
      resolveCompareCadence({
        compareCadence: value?.compareCadence,
        compareRange: normalizedCompareRange,
        range: normalizedRange,
      })
    );
    setSelectionStart(null);
    setActiveCalendar("primary");

    // Reset calendar month to show the committed range
    if (normalizedRange.from) {
      setCalendarMonth(dayjs(normalizedRange.from).startOf("month"));
    }
  }, [
    normalizedRange,
    normalizedCompareRange,
    resolveCadence,
    resolveCompareCadence,
    value?.cadence,
    value?.compareCadence,
  ]);

  const goToPreviousMonth = useCallback(() => {
    setCalendarMonth((prev) => prev.clone().subtract(1, "month"));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCalendarMonth((prev) => prev.clone().add(1, "month"));
  }, []);

  return {
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
    setCalendarMonth,
    handleCadenceChange,
    handleCompareCadenceChange,
    handleApply,
    handleReset,
    resetToCommitted,
    goToPreviousMonth,
    goToNextMonth,
  };
}

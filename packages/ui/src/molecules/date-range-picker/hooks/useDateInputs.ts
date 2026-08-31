import dayjs from "dayjs";
import { type KeyboardEvent, useCallback, useEffect, useMemo, useState } from "react";

import type { ComparePreset, DateRange, DateRangePreset } from "../types";
import {
  detectComparePresetFromRange,
  detectPresetFromRange,
  formatDate,
  parseDate,
} from "../utils";

const buildNextRange = (prev: DateRange, type: "from" | "to", date: Date): DateRange => {
  let next: DateRange = { ...prev, [type]: date };

  if (next.from && next.to && dayjs(next.from).isAfter(next.to)) {
    next = type === "from" ? { from: date, to: date } : { from: prev.from, to: date };
  }

  return next;
};

export interface InputValidationErrors {
  primaryFrom: string | null;
  primaryTo: string | null;
  compareFrom: string | null;
  compareTo: string | null;
}

export interface UseDateInputsOptions {
  localRange: DateRange;
  localCompareRange: DateRange;
  dateFormat: string;
  isDateDisabled: (date: dayjs.Dayjs) => boolean;
  setLocalRange: React.Dispatch<React.SetStateAction<DateRange>>;
  setLocalCompareRange: React.Dispatch<React.SetStateAction<DateRange>>;
  setSelectedCadence: React.Dispatch<React.SetStateAction<string>>;
  setSelectedCompareCadence: React.Dispatch<React.SetStateAction<string>>;
  /** Presets for auto-detection */
  presets?: DateRangePreset[];
  /** Compare presets for auto-detection */
  comparePresets?: ComparePreset[];
  /** Min date for validation feedback */
  minDate?: Date | null;
  /** Max date for validation feedback */
  maxDate?: Date | null;
}

export interface UseDateInputsReturn {
  primaryFromInput: string;
  primaryToInput: string;
  compareFromInput: string;
  compareToInput: string;
  /** Validation errors for each input field */
  inputErrors: InputValidationErrors;
  setPrimaryFromInput: React.Dispatch<React.SetStateAction<string>>;
  setPrimaryToInput: React.Dispatch<React.SetStateAction<string>>;
  setCompareFromInput: React.Dispatch<React.SetStateAction<string>>;
  setCompareToInput: React.Dispatch<React.SetStateAction<string>>;
  handleInputKeyDown: (
    e: KeyboardEvent<HTMLInputElement>,
    type: "from" | "to",
    calendar: "primary" | "compare",
    inputValue: string
  ) => void;
  handleDateInputBlur: (
    type: "from" | "to",
    calendar: "primary" | "compare",
    inputValue: string
  ) => void;
}

export function useDateInputs({
  localRange,
  localCompareRange,
  dateFormat,
  setLocalRange,
  setLocalCompareRange,
  setSelectedCadence,
  setSelectedCompareCadence,
  presets = [],
  comparePresets = [],
  minDate,
  maxDate,
}: UseDateInputsOptions): UseDateInputsReturn {
  const [primaryFromInput, setPrimaryFromInput] = useState("");
  const [primaryToInput, setPrimaryToInput] = useState("");
  const [compareFromInput, setCompareFromInput] = useState("");
  const [compareToInput, setCompareToInput] = useState("");

  useEffect(() => {
    setPrimaryFromInput(formatDate(localRange.from, dateFormat));
    setPrimaryToInput(formatDate(localRange.to, dateFormat));
  }, [localRange, dateFormat]);

  useEffect(() => {
    setCompareFromInput(formatDate(localCompareRange.from, dateFormat));
    setCompareToInput(formatDate(localCompareRange.to, dateFormat));
  }, [localCompareRange, dateFormat]);

  // Compute validation errors for each input based on current local ranges
  const inputErrors = useMemo((): InputValidationErrors => {
    const errors: InputValidationErrors = {
      primaryFrom: null,
      primaryTo: null,
      compareFrom: null,
      compareTo: null,
    };

    if (localRange.from) {
      const fromMoment = dayjs(localRange.from);
      if (minDate && fromMoment.isBefore(dayjs(minDate), "day")) {
        errors.primaryFrom = `Date is before minimum (${formatDate(minDate, dateFormat)})`;
      } else if (maxDate && fromMoment.isAfter(dayjs(maxDate), "day")) {
        errors.primaryFrom = `Date is after maximum (${formatDate(maxDate, dateFormat)})`;
      }
    }

    if (localRange.to) {
      const toMoment = dayjs(localRange.to);
      if (minDate && toMoment.isBefore(dayjs(minDate), "day")) {
        errors.primaryTo = `Date is before minimum (${formatDate(minDate, dateFormat)})`;
      } else if (maxDate && toMoment.isAfter(dayjs(maxDate), "day")) {
        errors.primaryTo = `Date is after maximum (${formatDate(maxDate, dateFormat)})`;
      }
    }

    if (localCompareRange.from) {
      const fromMoment = dayjs(localCompareRange.from);
      if (minDate && fromMoment.isBefore(dayjs(minDate), "day")) {
        errors.compareFrom = `Date is before minimum (${formatDate(minDate, dateFormat)})`;
      } else if (maxDate && fromMoment.isAfter(dayjs(maxDate), "day")) {
        errors.compareFrom = `Date is after maximum (${formatDate(maxDate, dateFormat)})`;
      }
    }

    if (localCompareRange.to) {
      const toMoment = dayjs(localCompareRange.to);
      if (minDate && toMoment.isBefore(dayjs(minDate), "day")) {
        errors.compareTo = `Date is before minimum (${formatDate(minDate, dateFormat)})`;
      } else if (maxDate && toMoment.isAfter(dayjs(maxDate), "day")) {
        errors.compareTo = `Date is after maximum (${formatDate(maxDate, dateFormat)})`;
      }
    }

    return errors;
  }, [localRange, localCompareRange, minDate, maxDate, dateFormat]);

  const applyDateFromInput = useCallback(
    (type: "from" | "to", calendar: "primary" | "compare", inputValue: string) => {
      const parsed = parseDate(inputValue, dateFormat);

      // If input is empty or invalid format, don't update
      if (!parsed.isValid()) return false;

      // Always set the date even if out of bounds - validation will show error
      const date = parsed.toDate();
      if (calendar === "primary") {
        const nextRange = buildNextRange(localRange, type, date);
        setLocalRange(nextRange);

        if (nextRange.from && nextRange.to && presets.length > 0) {
          const detected = detectPresetFromRange(nextRange, presets, maxDate ?? undefined);
          setSelectedCadence(detected ?? "custom");
        } else {
          setSelectedCadence("custom");
        }
      } else {
        const nextCompareRange = buildNextRange(localCompareRange, type, date);
        setLocalCompareRange(nextCompareRange);

        if (
          nextCompareRange.from &&
          nextCompareRange.to &&
          localRange.from &&
          localRange.to &&
          comparePresets.length > 0
        ) {
          const detected = detectComparePresetFromRange(
            nextCompareRange,
            localRange,
            comparePresets
          );
          setSelectedCompareCadence(detected ?? "custom");
        } else {
          setSelectedCompareCadence("custom");
        }
      }
      return true;
    },
    [
      dateFormat,
      setLocalRange,
      setLocalCompareRange,
      setSelectedCadence,
      setSelectedCompareCadence,
      presets,
      comparePresets,
      localRange,
      localCompareRange,
    ]
  );

  const handleInputKeyDown = useCallback(
    (
      e: KeyboardEvent<HTMLInputElement>,
      type: "from" | "to",
      calendar: "primary" | "compare",
      inputValue: string
    ) => {
      if (e.key === "Enter") {
        e.preventDefault();
        applyDateFromInput(type, calendar, inputValue);
      }
    },
    [applyDateFromInput]
  );

  const handleDateInputBlur = useCallback(
    (type: "from" | "to", calendar: "primary" | "compare", inputValue: string) => {
      applyDateFromInput(type, calendar, inputValue);
    },
    [applyDateFromInput]
  );

  return {
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
  };
}

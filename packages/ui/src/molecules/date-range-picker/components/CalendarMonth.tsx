import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/atoms/button";

import type { DateRange } from "../types";
import { isDateInRange, isSameDay } from "../utils";

dayjs.extend(weekOfYear);

/**
 * CIQ week numbering: week 1 requires >= 4 days of the new year in the week,
 * matching canvas-client DateRangePickerCalendar.vue logic.
 */
function computeWeekNumbers(month: dayjs.Dayjs): number[] {
  const displayMonth = month.startOf("month");
  const weekStart = displayMonth.startOf("week");
  const weekEnd = displayMonth.endOf("month").endOf("week").startOf("day").add(1, "day");
  const totalDays = weekEnd.diff(weekStart, "day");

  const yearStart = displayMonth.startOf("year");
  const yearEnd = displayMonth.endOf("year");
  const currentYearStartsOnWeek1 = yearStart.day() < 4;
  const currentYearEndsOnWeek1 = yearEnd.day() < 3;
  const prevYearStartsOnWeek1 = yearStart.subtract(1, "year").day() < 4;
  const startingWeekOfYear = yearStart.week();
  const endingWeekOfYear = yearEnd.week();
  const monthName = displayMonth.format("MMMM");

  const weeks = new Set<number>();

  for (let d = 0; d < totalDays; d++) {
    const currentDay = weekStart.add(d, "day");
    let week = currentDay.week();

    const isFirstWeek53 =
      week === startingWeekOfYear &&
      !currentYearStartsOnWeek1 &&
      prevYearStartsOnWeek1 &&
      monthName === "January";
    const isLastWeek53 =
      week === endingWeekOfYear &&
      !currentYearEndsOnWeek1 &&
      currentYearStartsOnWeek1 &&
      monthName === "December";
    const isLastWeek1 =
      week === endingWeekOfYear && currentYearEndsOnWeek1 && monthName === "December";

    if (!currentYearStartsOnWeek1) {
      week = currentDay.subtract(1, "week").week();
    }
    if (isLastWeek1) {
      week = currentDay.week();
    }
    if (isLastWeek53 || isFirstWeek53) {
      week = currentDay.subtract(1, "week").week() + 1;
    }

    weeks.add(week);
  }

  return Array.from(weeks);
}

export interface CalendarMonthProps {
  readonly month: dayjs.Dayjs;
  readonly primaryRange: DateRange;
  readonly compareRange: DateRange;
  readonly showCompare: boolean;
  readonly onDateClick: (date: dayjs.Dayjs) => void;
  readonly isDateDisabled: (date: dayjs.Dayjs) => boolean;
  readonly weekdayLabels?: readonly string[];
  readonly showWeekNumbers?: boolean;
  readonly isFirst?: boolean;
  readonly isLast?: boolean;
  readonly onPrevMonth?: () => void;
  readonly onNextMonth?: () => void;
}

export function CalendarMonth({
  month,
  primaryRange,
  compareRange,
  showCompare,
  onDateClick,
  isDateDisabled,
  weekdayLabels,
  showWeekNumbers = true,
  isFirst,
  isLast,
  onPrevMonth,
  onNextMonth,
}: CalendarMonthProps) {
  const startOfMonth = month.clone().startOf("month");
  const endOfMonth = month.clone().endOf("month");
  const startDay = startOfMonth.day();
  const daysInMonth = endOfMonth.date();

  const days: (dayjs.Dayjs | null)[] = [];
  const weekdayLabelsToUse =
    weekdayLabels ?? Array.from({ length: 7 }, (_, i) => dayjs().day(i).format("dd").charAt(0));

  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(month.clone().date(i));
  }

  const weekNumbers = showWeekNumbers ? computeWeekNumbers(month) : [];

  const getDayClasses = (date: dayjs.Dayjs) => {
    const isDisabled = isDateDisabled(date);
    const isPrimaryStart = isSameDay(date, primaryRange.from);
    const isPrimaryEnd = isSameDay(date, primaryRange.to);
    const isPrimaryInRange = isDateInRange(date, primaryRange.from, primaryRange.to);

    const isCompareStart = showCompare && isSameDay(date, compareRange.from);
    const isCompareEnd = showCompare && isSameDay(date, compareRange.to);
    const isCompareInRange = showCompare && isDateInRange(date, compareRange.from, compareRange.to);

    const isToday = date.isSame(dayjs(), "day");
    const isOverlapping = isPrimaryInRange && isCompareInRange;

    let buttonClasses =
      "h-8 w-8 p-0 font-normal text-sm text-slate-950 rounded-md transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50";
    let wrapperClasses = "relative flex items-center justify-center";

    if (isDisabled) {
      buttonClasses =
        "h-8 w-8 p-0 font-normal text-sm text-slate-300 rounded-md cursor-not-allowed";
      return { buttonClasses, wrapperClasses, isDisabled };
    }

    if (isOverlapping && !isPrimaryStart && !isPrimaryEnd && !isCompareStart && !isCompareEnd) {
      wrapperClasses += " bg-gradient-to-r from-violet-100 to-sky-100";
    } else if (isPrimaryInRange && !isPrimaryStart && !isPrimaryEnd && !isCompareInRange) {
      wrapperClasses += " bg-violet-100";
    } else if (isCompareInRange && !isCompareStart && !isCompareEnd && !isPrimaryInRange) {
      wrapperClasses += " bg-sky-100";
    }

    const dayOfWeek = date.day();
    if (dayOfWeek === 0 && (isPrimaryInRange || isCompareInRange)) {
      wrapperClasses += " rounded-l-md";
    }
    if (dayOfWeek === 6 && (isPrimaryInRange || isCompareInRange)) {
      wrapperClasses += " rounded-r-md";
    }

    if (isPrimaryStart && isCompareStart) {
      buttonClasses =
        "h-8 w-8 p-0 font-normal text-sm rounded-md bg-gradient-to-r from-primary to-sky-500 text-white";
      wrapperClasses += " rounded-l-md";
    } else if (isPrimaryEnd && isCompareEnd) {
      buttonClasses =
        "h-8 w-8 p-0 font-normal text-sm rounded-md bg-gradient-to-r from-primary to-sky-500 text-white";
      wrapperClasses += " rounded-r-md";
    } else if (isPrimaryStart) {
      buttonClasses =
        "h-8 w-8 p-0 font-normal text-sm rounded-md bg-primary text-primary-foreground";
      if (!isPrimaryEnd) {
        wrapperClasses += " rounded-l-md";
        if (isCompareInRange) {
          wrapperClasses += " bg-sky-100";
        } else if (primaryRange.to) {
          wrapperClasses += " bg-violet-100";
        }
      }
    } else if (isPrimaryEnd) {
      buttonClasses =
        "h-8 w-8 p-0 font-normal text-sm rounded-md bg-primary text-primary-foreground";
      wrapperClasses += " rounded-r-md";
      if (isCompareInRange) {
        wrapperClasses += " bg-sky-100";
      } else {
        wrapperClasses += " bg-violet-100";
      }
    } else if (isCompareStart) {
      buttonClasses = "h-8 w-8 p-0 font-normal text-sm rounded-md bg-sky-500 text-white";
      if (!isCompareEnd) {
        wrapperClasses += " rounded-l-md";
        if (isPrimaryInRange) {
          wrapperClasses += " bg-violet-100";
        } else if (compareRange.to) {
          wrapperClasses += " bg-sky-100";
        }
      }
    } else if (isCompareEnd) {
      buttonClasses = "h-8 w-8 p-0 font-normal text-sm rounded-md bg-sky-500 text-white";
      wrapperClasses += " rounded-r-md";
      if (isPrimaryInRange) {
        wrapperClasses += " bg-violet-100";
      } else {
        wrapperClasses += " bg-sky-100";
      }
    } else if (isToday) {
      buttonClasses += " ring-1 ring-primary";
    }

    return { buttonClasses, wrapperClasses, isDisabled };
  };

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        {isFirst ? (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onPrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        ) : (
          <div className="w-7" />
        )}
        <span className="text-sm font-medium text-slate-900">{month.format("MMMM YYYY")}</span>
        {isLast ? (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <div className="w-7" />
        )}
      </div>
      <div className="flex">
        {showWeekNumbers && (
          <div
            className="flex flex-col mr-2 border-r border-dashed border-slate-300 pr-1"
            title="Week Number"
          >
            <div className="h-8 w-8 flex items-center justify-center text-xs font-semibold text-slate-400 mb-2">
              W#
            </div>
            <div className="flex flex-col gap-y-2">
              {weekNumbers.map((wn, i) => (
                <div
                  key={i}
                  className="h-8 w-8 flex items-center justify-center text-xs text-slate-400"
                >
                  {wn}
                </div>
              ))}
            </div>
          </div>
        )}
        <div>
          <div className="grid grid-cols-7 gap-0 mb-2">
            {weekdayLabelsToUse.map((day, index) => (
              <div
                key={`${index}-${day}`}
                className="h-8 flex items-center justify-center text-xs font-semibold text-slate-700"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-x-0 gap-y-2">
            {days.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="h-8 w-8" />;
              }

              const { buttonClasses, wrapperClasses, isDisabled } = getDayClasses(date);

              return (
                <div key={date.format("YYYY-MM-DD")} className={wrapperClasses}>
                  <button
                    type="button"
                    onClick={() => !isDisabled && onDateClick(date)}
                    disabled={isDisabled}
                    className={buttonClasses}
                  >
                    {date.date()}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

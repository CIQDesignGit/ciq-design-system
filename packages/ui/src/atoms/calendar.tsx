import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/atoms/button";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function daysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  className?: string;
}

function Calendar({ selected, onSelect, className }: CalendarProps) {
  const [visible, setVisible] = React.useState(
    () => selected ?? new Date()
  );
  const first = startOfMonth(visible);
  const blanks = first.getDay();
  const total = daysInMonth(visible);

  const cells: Array<number | null> = [
    ...Array.from({ length: blanks }, () => null),
    ...Array.from({ length: total }, (_, index) => index + 1),
  ];

  return (
    <div className={cn("p-3 rounded-lg border bg-card w-[280px]", className)}>
      <div className="flex items-center justify-between mb-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() =>
            setVisible(
              new Date(visible.getFullYear(), visible.getMonth() - 1, 1)
            )
          }
        >
          <ChevronLeft className="size-4" />
        </Button>
        <div className="text-sm font-medium">
          {visible.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() =>
            setVisible(
              new Date(visible.getFullYear(), visible.getMonth() + 1, 1)
            )
          }
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-1">
        {WEEKDAYS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (!day) return <div key={`blank-${index}`} />;
          const date = new Date(visible.getFullYear(), visible.getMonth(), day);
          const isSelected =
            selected &&
            date.toDateString() === selected.toDateString();
          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelect?.(date)}
              className={cn(
                "aspect-square rounded-md text-sm hover:bg-accent",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { Calendar };

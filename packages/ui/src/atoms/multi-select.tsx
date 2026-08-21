import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { Badge } from "@/atoms/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/atoms/popover";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  label: string;
  value: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

function MultiSelect({
  options,
  value = [],
  onValueChange,
  placeholder = "Select…",
  className,
  disabled,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const toggle = (next: string) => {
    if (value.includes(next)) {
      onValueChange?.(value.filter((item) => item !== next));
    } else {
      onValueChange?.([...value, next]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex min-h-[36px] w-full items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-left",
            disabled && "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          <div className="flex flex-1 flex-wrap gap-1">
            {value.length === 0 ? (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                {placeholder}
              </span>
            ) : (
              value.map((item) => {
                const option = options.find((entry) => entry.value === item);
                return (
                  <Badge
                    key={item}
                    variant="outline"
                    className="gap-1 px-1.5 py-0.5 text-xs bg-purple-50 border-purple-200 text-primary font-medium"
                  >
                    {option?.label ?? item}
                    <X
                      className="h-3 w-3 cursor-pointer inline-flex items-center justify-center text-primary hover:text-primary/80"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggle(item);
                      }}
                    />
                  </Badge>
                );
              })
            )}
          </div>
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-1">
        {options.map((option) => {
          const selected = value.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggle(option.value)}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-violet-50"
            >
              <Check
                className={cn("size-4", selected ? "opacity-100" : "opacity-0")}
              />
              {option.label}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

export { MultiSelect };

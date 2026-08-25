import { ChevronDown, Loader2, X } from "lucide-react";
import * as React from "react";

import { Badge } from "@/atoms/badge";
import { Checkbox } from "@/atoms/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/atoms/dropdown-menu";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MultiSelectProps {
  readonly options: MultiSelectOption[];
  readonly selected: string[];
  readonly onChange: (selected: string[]) => void;
  readonly placeholder?: string;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly maxDisplayedItems?: number;
  readonly label?: string;
  readonly showSearch?: boolean;
  readonly icon?: React.ReactNode;
  readonly container?: HTMLElement | null;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className,
  disabled = false,
  loading = false,
  maxDisplayedItems = 3,
  showSearch = true,
  icon,
  container,
}: MultiSelectProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleSelectAll = () => {
    const allValues = options.filter((opt) => !opt.disabled).map((opt) => opt.value);
    onChange(allValues);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onChange(selected.filter((v) => v !== value));
  };

  const selectedItems = selected.map((value) => {
    const option = options.find((opt) => opt.value === value);
    return { value, label: option?.label ?? value };
  });

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, searchQuery]);

  const selectableOptions = options.filter((opt) => !opt.disabled);
  const allSelected =
    selectableOptions.length > 0 && selectableOptions.every((opt) => selected.includes(opt.value));
  const someSelected = selected.length > 0 && !allSelected;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled || loading}
        className={cn(
          "flex min-h-[36px] items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm",
          "focus:outline-none focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "[&[data-state=open]>svg.chevron]:rotate-180",
          className
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          {icon}
          {loading ? (
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Loading...
            </span>
          ) : selected.length === 0 ? (
            <span className="text-tertiary-text">{placeholder}</span>
          ) : selected.length <= maxDisplayedItems ? (
            selectedItems.map((item) => (
              <Badge
                key={item.value}
                variant="outline"
                className="gap-1 px-1.5 py-0.5 text-xs bg-purple-50 border-purple-200 text-primary font-medium"
              >
                {item.label}
                <span
                  role="button"
                  tabIndex={0}
                  className="h-3 w-3 cursor-pointer inline-flex items-center justify-center text-primary hover:text-primary/80"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onClick={(e) => handleRemove(item.value, e)}
                >
                  <X className="h-3 w-3" />
                </span>
              </Badge>
            ))
          ) : (
            <Badge
              variant="outline"
              className="gap-1 px-1.5 py-0.5 text-xs bg-purple-50 border-purple-200 text-primary font-medium"
            >
              {selectedItems[0]?.label} & {selected.length - 1} more
              <span
                role="button"
                tabIndex={0}
                className="h-3 w-3 cursor-pointer inline-flex items-center justify-center text-primary hover:text-primary/80"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleClearAll();
                }}
              >
                <X className="h-3 w-3" />
              </span>
            </Badge>
          )}
        </div>
        {!loading && selected.length === 0 && (
          <ChevronDown className="chevron h-4 w-4 text-muted-foreground transition-transform shrink-0" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-[180px] w-auto" align="start" container={container}>
        {showSearch && (
          <div className="px-2 py-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}

        {/* Selected count and Select all / Clear all */}
        <div className="px-3 py-2">
          <div className="text-xs text-muted-foreground mb-2">{selected.length} Selected</div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              disabled={filteredOptions.length === 0}
              className={cn(
                "flex items-center gap-2 text-sm",
                filteredOptions.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:text-foreground"
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (filteredOptions.length === 0) return;
                if (allSelected) {
                  handleClearAll();
                } else {
                  handleSelectAll();
                }
              }}
            >
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                className="pointer-events-none"
                data-testid="multi-select-dropdown-checkbox"
              />
              <span>Select all</span>
            </button>
            <button
              type="button"
              disabled={selected.length === 0}
              className={cn(
                "text-sm pl-8",
                selected.length === 0
                  ? "text-muted-foreground/40 cursor-not-allowed"
                  : "text-muted-foreground hover:underline"
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (selected.length === 0) return;
                handleClearAll();
              }}
            >
              Clear all
            </button>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Options list */}
        <div className="max-h-[200px] overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">No results found</div>
          ) : (
            filteredOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={selected.includes(option.value)}
                disabled={option.disabled}
                onCheckedChange={() => handleToggle(option.value)}
                onSelect={(e) => e.preventDefault()}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

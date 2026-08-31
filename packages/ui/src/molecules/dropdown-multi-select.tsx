"use client";

import { ChevronDown, Loader2, Search } from "lucide-react";
import * as React from "react";

import { Button } from "@/atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/atoms/dropdown-menu";
import { IndeterminateCheckbox } from "@/atoms/indeterminate-checkbox";
import { Input } from "@/atoms/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/atoms/tooltip";
import { useIsTruncated } from "@/hooks/use-is-truncated";
import { cn } from "@/lib/utils";

export interface DropdownMultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/** Renders an option's label, wrapping it in a tooltip showing the full text only when
 * the label is actually truncated by CSS `truncate`. */
function OptionLabel({ label }: { readonly label: string }): React.ReactElement {
  const spanRef = React.useRef<HTMLSpanElement>(null);
  const isTruncated = useIsTruncated(spanRef, [label]);
  const span = (
    <span ref={spanRef} className="text-sm truncate">
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

export interface DropdownMultiSelectProps {
  /** Available options to select from */
  readonly options: DropdownMultiSelectOption[];
  /** Currently selected values */
  readonly selected: string[];
  /** Callback when selection changes (called on Save) */
  readonly onChange: (selected: string[]) => void;
  /** Placeholder text when nothing is selected */
  readonly placeholder?: React.ReactNode;
  /** Search input placeholder */
  readonly searchPlaceholder?: string;
  /** Icon to display in the trigger */
  readonly icon?: React.ReactNode;
  /** Custom class name for the trigger button */
  readonly triggerClassName?: string;
  /** Custom class name for the dropdown content */
  readonly contentClassName?: string;
  /** Whether the dropdown is disabled */
  readonly disabled?: boolean;
  /** Whether options are loading */
  readonly loading?: boolean;
  /** Maximum characters for label before truncating */
  readonly maxLabelLength?: number;
  /** Text for the save button */
  readonly saveButtonText?: string;
  /** Text for the cancel button */
  readonly cancelButtonText?: string;
  /** Text shown above the list (e.g., "X Selected") */
  readonly selectedCountText?: (count: number) => string;
  /** "Clear All" button text */
  readonly clearAllText?: string;
  /** "Select all" checkbox label */
  readonly selectAllText?: string;
  /** Text shown when no results found */
  readonly noResultsText?: string;
  /** Portal container for the dropdown */
  readonly container?: HTMLElement | null;
  /** Alignment of the dropdown content */
  readonly align?: "start" | "center" | "end";
  /** `data-testid` applied to the trigger button, for consumers that need to target it directly. */
  readonly triggerTestId?: string;
}

export function DropdownMultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  icon,
  triggerClassName,
  contentClassName,
  disabled = false,
  loading = false,
  maxLabelLength = 15,
  saveButtonText = "Save",
  cancelButtonText = "Cancel",
  selectedCountText = (count) => (count > 0 ? `${count} Selected` : "Value"),
  clearAllText = "Clear All",
  selectAllText = "Select all",
  noResultsText = "No results found",
  container,
  align = "start",
  triggerTestId,
}: DropdownMultiSelectProps) {
  // Library: optional portal only — no shadow-DOM queryElement
  const portalContainer = container ?? undefined;

  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [stagedSelection, setStagedSelection] = React.useState<string[]>(selected);

  // Sync staged selection when dropdown opens or selected prop changes
  React.useEffect(() => {
    if (isOpen) {
      setStagedSelection(selected);
      setSearchQuery("");
    }
  }, [isOpen, selected]);

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(query));
  }, [options, searchQuery]);

  const selectableOptions = filteredOptions.filter((opt) => !opt.disabled);
  const allSelected =
    selectableOptions.length > 0 &&
    selectableOptions.every((opt) => stagedSelection.includes(opt.value));
  const someSelected = stagedSelection.length > 0 && !allSelected;

  // Handlers
  const handleToggle = (value: string) => {
    setStagedSelection((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSelectAll = () => {
    const allValues = selectableOptions.map((opt) => opt.value);
    // Merge with existing non-visible selections
    const existingNonVisible = stagedSelection.filter(
      (v) => !filteredOptions.some((opt) => opt.value === v)
    );
    setStagedSelection([...new Set([...existingNonVisible, ...allValues])]);
  };

  const handleClearAll = () => {
    setStagedSelection([]);
  };

  const handleSave = () => {
    onChange(stagedSelection);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setStagedSelection(selected);
    setIsOpen(false);
  };

  // Generate trigger label
  const getTriggerLabel = (): React.ReactNode => {
    if (selected.length === 0) return placeholder;

    const firstItem = options.find((opt) => opt.value === selected[0]);
    const firstLabel = firstItem?.label ?? selected[0];

    if (selected.length === 1) {
      return firstLabel.length > maxLabelLength
        ? `${firstLabel.slice(0, maxLabelLength)}...`
        : firstLabel;
    }

    // Multiple selected: truncate first label and show count
    const truncatedFirst =
      firstLabel.length > maxLabelLength - 3
        ? `${firstLabel.slice(0, maxLabelLength - 3)}...`
        : firstLabel;
    return `${truncatedFirst}&${selected.length - 1}`;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        disabled={disabled || loading}
        data-testid={triggerTestId}
        className={cn(
          "flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm",
          "focus:outline-none focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "[&[data-state=open]>svg.chevron]:rotate-180",
          triggerClassName
        )}
      >
        {icon && <span className="text-muted-foreground shrink-0">{icon}</span>}
        <span className={cn("truncate text-xs", selected.length === 0 && "text-muted-foreground")}>
          {getTriggerLabel()}
        </span>
        <ChevronDown className="chevron h-4 w-4 text-muted-foreground transition-transform shrink-0 ml-auto" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={align}
        className={cn("p-0 w-[280px]", contentClassName)}
        container={portalContainer}
      >
        <div className="flex flex-col max-h-[350px]">
          {/* Search Input */}
          <div className="p-3 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                name="search"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="h-8 pl-8 text-xs bg-white border-slate-200 focus:border-primary"
              />
            </div>
          </div>

          {/* Selected Count Header */}
          <div className="px-3 py-2 text-xs font-medium text-slate-500 bg-slate-50 flex items-center justify-between">
            <span>{selectedCountText(stagedSelection.length)}</span>
            <Button
              onClick={handleClearAll}
              disabled={stagedSelection.length === 0}
              variant="ghost"
              className={cn(
                "font-normal h-auto p-0 hover:bg-transparent",
                stagedSelection.length === 0
                  ? "text-muted-foreground/40 cursor-not-allowed"
                  : "text-primary hover:text-primary/80"
              )}
            >
              {clearAllText}
            </Button>
          </div>

          {/* Select All */}
          <div className="px-3 py-2 border-b border-slate-200">
            <label
              className={cn(
                "flex items-center gap-2",
                selectableOptions.length > 0 ? "cursor-pointer" : "cursor-not-allowed opacity-50"
              )}
            >
              <IndeterminateCheckbox
                checked={allSelected}
                indeterminate={someSelected}
                disabled={selectableOptions.length === 0}
                onChange={allSelected ? handleClearAll : handleSelectAll}
                className="accent-primary"
              />
              <span className="text-sm">{selectAllText}</span>
            </label>
          </div>

          {/* Options List */}
          <div className="flex-1 overflow-y-auto max-h-[180px]">
            {loading ? (
              <div className="h-full flex items-center justify-center py-5">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isChecked = stagedSelection.includes(option.value);
                return (
                  <label
                    key={option.value}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 hover:bg-slate-50",
                      option.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                    )}
                  >
                    <IndeterminateCheckbox
                      checked={isChecked}
                      disabled={option.disabled}
                      onChange={() => handleToggle(option.value)}
                      className="accent-primary"
                    />
                    <OptionLabel label={option.label} />
                  </label>
                );
              })
            ) : (
              <div className="p-4 text-center text-sm text-slate-500">{noResultsText}</div>
            )}
          </div>

          {/* Footer with Cancel/Save buttons */}
          <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-center gap-2 bg-white">
            <Button variant="outline" onClick={handleCancel} className="h-9 px-4 flex-1">
              {cancelButtonText}
            </Button>
            <Button
              onClick={handleSave}
              className="h-9 px-4 flex-1 bg-primary hover:bg-primary/90 text-white"
            >
              {saveButtonText}
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import * as React from "react";
import { Search, X } from "lucide-react";

import { Button } from "@/atoms/button";
import { Input } from "@/atoms/input";
import { Layover } from "@/atoms/layover";

export interface FilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children?: React.ReactNode;
  onApply?: () => void;
  onClear?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

function FilterModal({
  open,
  onOpenChange,
  title = "Filters",
  children,
  onApply,
  onClear,
  searchValue,
  onSearchChange,
}: FilterModalProps) {
  return (
    <Layover open={open} onOpenChange={onOpenChange}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-4" />
          </Button>
        </div>
        {onSearchChange ? (
          <div className="px-6 py-3 relative">
            <Search className="absolute left-9 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search filters"
              className="pl-9"
            />
          </div>
        ) : null}
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 flex-shrink-0">
          {onClear ? (
            <Button variant="outline" onClick={onClear}>
              Clear
            </Button>
          ) : null}
          <Button
            className="px-4 bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => {
              onApply?.();
              onOpenChange(false);
            }}
          >
            Apply
          </Button>
        </div>
      </div>
    </Layover>
  );
}

export { FilterModal };

import { ChevronRight, Search } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/atoms/button";
import { IndeterminateCheckbox } from "@/atoms/indeterminate-checkbox";
import { Input } from "@/atoms/input";
import { Layover } from "@/atoms/layover";

const FILTER_MODAL_MESSAGES = {
  NO_COLUMNS_FOUND: "No columns found",
  SELECT_COLUMN_TO_VIEW_VALUES: "Select a column to view values",
  NO_VALUES_FOUND: "No values found",
} as const;

export interface FilterColumn {
  id: string;
  label: string;
  field: string;
}

export interface FilterValue {
  id: string;
  label: string;
  value: string;
}

function haveSameIdSelections(current: readonly string[], original: readonly string[]): boolean {
  if (current.length !== original.length) {
    return false;
  }
  const originalIds = new Set(original);
  return current.every((id) => originalIds.has(id));
}

export interface FilterModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onApply: (selectedColumn: FilterColumn | null, selectedValues: string[]) => void;
  readonly columns: FilterColumn[];
  readonly values?: FilterValue[];
  readonly getValuesForColumn?: (columnId: string) => FilterValue[];
  readonly selectedColumnId?: string | null;
  readonly selectedValueIds?: string[];
  readonly title?: string;
  readonly columnSearchPlaceholder?: string;
  readonly valueSearchPlaceholder?: string;
  readonly columnsLabel?: string;
  readonly valuesLabel?: string;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  columns,
  values,
  getValuesForColumn,
  selectedColumnId = null,
  selectedValueIds = [],
  title = "Filter Option",
  columnSearchPlaceholder = "Search Column",
  valueSearchPlaceholder = "Search SKUs",
  columnsLabel = "Columns",
  valuesLabel = "SKUs",
}) => {
  const [columnSearch, setColumnSearch] = useState("");
  const [valueSearch, setValueSearch] = useState("");
  const [currentSelectedColumn, setCurrentSelectedColumn] = useState<string | null>(
    selectedColumnId
  );
  const [currentSelectedValues, setCurrentSelectedValues] = useState<string[]>(selectedValueIds);

  // Get values for the currently selected column
  const currentValues = useMemo(() => {
    if (getValuesForColumn && currentSelectedColumn) {
      return getValuesForColumn(currentSelectedColumn);
    }
    return values ?? [];
  }, [getValuesForColumn, currentSelectedColumn, values]);

  // Filter columns based on search
  const filteredColumns = useMemo(() => {
    if (!columnSearch.trim()) return columns;
    const searchLower = columnSearch.toLowerCase();
    return columns.filter((col) => col.label.toLowerCase().includes(searchLower));
  }, [columns, columnSearch]);

  // Filter values based on search
  const filteredValues = useMemo(() => {
    if (!valueSearch.trim()) return currentValues;
    const searchLower = valueSearch.toLowerCase();
    return currentValues.filter((val) => val.label.toLowerCase().includes(searchLower));
  }, [currentValues, valueSearch]);

  // Get selected column object
  const selectedColumn = useMemo(() => {
    return columns.find((col) => col.id === currentSelectedColumn) || null;
  }, [columns, currentSelectedColumn]);

  // Reset selected values when column changes
  useEffect(() => {
    if (currentSelectedColumn !== selectedColumnId) {
      setCurrentSelectedValues([]);
    } else {
      setCurrentSelectedValues(selectedValueIds);
    }
  }, [currentSelectedColumn, selectedColumnId, selectedValueIds]);

  // Check if all filtered values are selected
  const allFilteredValuesSelected = useMemo(() => {
    if (filteredValues.length === 0) return false;
    return filteredValues.every((val) => currentSelectedValues.includes(val.id));
  }, [filteredValues, currentSelectedValues]);

  // Check if some (but not all) filtered values are selected
  const someFilteredValuesSelected = useMemo(() => {
    const selectedCount = filteredValues.filter((val) =>
      currentSelectedValues.includes(val.id)
    ).length;
    return selectedCount > 0 && selectedCount < filteredValues.length;
  }, [filteredValues, currentSelectedValues]);

  const handleSelectAll = () => {
    const allFilteredIds = filteredValues.map((val) => val.id);
    setCurrentSelectedValues((prev) => {
      const newSet = new Set(prev);
      allFilteredIds.forEach((id) => newSet.add(id));
      return Array.from(newSet);
    });
  };

  const handleClearAll = () => {
    const allFilteredIds = filteredValues.map((val) => val.id);
    setCurrentSelectedValues((prev) => prev.filter((id) => !allFilteredIds.includes(id)));
  };

  const handleValueToggle = (valueId: string) => {
    setCurrentSelectedValues((prev) =>
      prev.includes(valueId) ? prev.filter((id) => id !== valueId) : [...prev, valueId]
    );
  };

  const handleApply = () => {
    onApply(selectedColumn, currentSelectedValues);
    onClose();
  };

  const handleCancel = () => {
    // Reset to original values
    setCurrentSelectedColumn(selectedColumnId);
    setCurrentSelectedValues(selectedValueIds);
    setColumnSearch("");
    setValueSearch("");
    onClose();
  };

  const selectedCount = currentSelectedValues.length;
  const hasChanges = useMemo(
    () =>
      currentSelectedColumn !== selectedColumnId ||
      !haveSameIdSelections(currentSelectedValues, selectedValueIds),
    [currentSelectedColumn, selectedColumnId, currentSelectedValues, selectedValueIds]
  );

  return (
    <Layover
      open={isOpen}
      onOpenChange={onClose}
      position="center"
      closeOnOverlayClick={true}
      overlayClassName="bg-black/60 backdrop-blur-sm"
      data-testid="filter-modal-on-close-element"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left Section: Columns */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col">
            {/* Column Search */}
            <div className="px-4 py-3 border-b border-gray-200 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={columnSearchPlaceholder}
                  value={columnSearch}
                  onChange={(e) => setColumnSearch(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </div>

            {/* Columns List */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 py-2">
                <h3 className="text-sm font-medium text-gray-700 mb-2">{columnsLabel}</h3>
                <div className="space-y-1">
                  {filteredColumns.length === 0 ? (
                    <div className="text-sm text-gray-500 py-4 text-center">
                      {FILTER_MODAL_MESSAGES.NO_COLUMNS_FOUND}
                    </div>
                  ) : (
                    filteredColumns.map((column) => (
                      <button
                        key={column.id}
                        onClick={() => setCurrentSelectedColumn(column.id)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                          currentSelectedColumn === column.id
                            ? "bg-purple-100 text-purple-900"
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        <span>{column.label}</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Values */}
          <div className="w-1/2 flex flex-col">
            {/* Value Search */}
            <div className="px-4 py-3 border-b border-gray-200 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={
                    currentSelectedColumn
                      ? `Search ${selectedColumn?.label ?? valueSearchPlaceholder}`
                      : valueSearchPlaceholder
                  }
                  value={valueSearch}
                  onChange={(e) => setValueSearch(e.target.value)}
                  className="pl-9 h-9"
                  disabled={!currentSelectedColumn}
                />
              </div>
            </div>

            {/* Values Header */}
            <div className="px-4 py-2 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                {currentSelectedColumn ? (selectedColumn?.label ?? valuesLabel) : valuesLabel}
              </h3>
              {currentSelectedColumn && (
                <div className="flex items-center justify-between">
                  <label
                    className="flex items-center gap-2 cursor-pointer"
                    data-testid="filter-modal-label"
                  >
                    <IndeterminateCheckbox
                      checked={allFilteredValuesSelected}
                      indeterminate={someFilteredValuesSelected}
                      onChange={allFilteredValuesSelected ? handleClearAll : handleSelectAll}
                      data-testid="filter-modal-all-filtered-values-selected-element"
                    />
                    <span className="text-sm text-gray-700">Select all</span>
                  </label>
                  <button
                    onClick={handleClearAll}
                    className="text-sm text-gray-600 hover:text-gray-900"
                    data-testid="filter-modal-handle-clear-all-btn"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Values List */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 py-2">
                {!currentSelectedColumn ? (
                  <div className="text-sm text-gray-500 py-4 text-center">
                    {FILTER_MODAL_MESSAGES.SELECT_COLUMN_TO_VIEW_VALUES}
                  </div>
                ) : filteredValues.length === 0 ? (
                  <div className="text-sm text-gray-500 py-4 text-center">
                    {FILTER_MODAL_MESSAGES.NO_VALUES_FOUND}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredValues.map((value) => (
                      <label
                        key={value.id}
                        className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                        data-testid="filter-modal-label-2"
                      >
                        <IndeterminateCheckbox
                          checked={currentSelectedValues.includes(value.id)}
                          onChange={() => handleValueToggle(value.id)}
                        />
                        <span className="text-sm text-gray-700 flex-1">{value.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 flex-shrink-0">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="px-4"
            data-testid="filter-modal-handle-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={!hasChanges || !currentSelectedColumn}
            className="px-4 bg-purple-600 hover:bg-purple-700 text-white"
            data-testid="filter-modal-handle-apply-btn"
          >
            Apply{" "}
            {selectedCount > 0 ? `${selectedCount} Filter${selectedCount !== 1 ? "s" : ""}` : ""}
          </Button>
        </div>
      </div>
    </Layover>
  );
};

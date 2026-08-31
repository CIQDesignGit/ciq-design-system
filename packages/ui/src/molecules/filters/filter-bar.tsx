/**
 * Filter Bar Component
 * Two-panel filter UI with dimensions from API on left and values on right
 * Shows filter chips that can be clicked to edit filters
 */

import isEqual from "fast-deep-equal";
import { ChevronDown, ChevronRight, Filter, FunnelPlus, Loader2, Search, X } from "lucide-react";
import React, { useCallback, useDeferredValue, useMemo, useState } from "react";

import { Button } from "@/atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/atoms/dropdown-menu";
import { IndeterminateCheckbox } from "@/atoms/indeterminate-checkbox";
import { Input } from "@/atoms/input";
import { cn } from "@/lib/utils";

import { DimensionListSkeleton } from "./filter-skeleton";
import {
  type ComparisonOperator,
  FILTER_OPERATORS,
  type FilterDimension,
  type FilterState,
  type FilterValue,
} from "./types";
import { useFilterData } from "./useFilterData";
import { ValuesList } from "./values-list";

export type FilterChipSize = "sm" | "md" | "lg";

const CHIP_PADDING_BY_SIZE: Record<FilterChipSize, { label: string; value: string; icon: string }> =
  {
    sm: {
      label: "py-1 px-2",
      value: "px-1",
      icon: "p-1",
    },
    md: {
      label: "py-2 px-3",
      value: "px-2",
      icon: "p-2",
    },
    lg: {
      label: "py-2.5 px-3.5",
      value: "px-2.5",
      icon: "p-2.5",
    },
  };

export type FilterFetchPayload = {
  type: "dimensions" | "values";
  dimensionId?: string;
  dataSource?: {
    url?: string;
    method?: "GET" | "POST";
    service?: string;
    body?: Record<string, unknown>;
  };
};

export type FetchFilterDataCallback = (payload: FilterFetchPayload) => Promise<unknown>;

/** Minimal HTTP config (library-local — no base-data-table types). */
export type FilterHttpDataSource = {
  type?: "http";
  method: "POST" | "GET";
  url: string;
  body?: Record<string, unknown>;
  service?: string;
};

export type FilterDataSource =
  | (FilterHttpDataSource & {
      dimensionsUrl?: string;
      dimensionValuesUrl?: string;
      dimensionsService?: string;
      dimensionValuesService?: string;
      fetchData?: FetchFilterDataCallback;
    })
  | {
      fetchData: FetchFilterDataCallback;
    };

export type FilterIconVariant = "plus" | "default";

/**
 * Derives the percentage/number `operatorValue` draft map from a `FilterState`
 * (used to seed it from `filters` both on Cancel and on opening the dropdown).
 * `draftFilters` alone doesn't represent a numeric filter's live operator/value
 * while it's being typed — that's tracked separately in `operatorValue` and
 * auto-synced into `draftFilters` as the reviewer edits it. Both draft pieces
 * must be reset together whenever `filters` changes underneath the bar (e.g.
 * an external "Clear all" while the panel is closed) or a stale numeric value
 * survives in `operatorValue` and gets silently re-applied on the next Apply.
 */
function buildOperatorValueFromFilters(
  filterState: FilterState
): Record<string, { operator: ComparisonOperator; value: string }> {
  const result: Record<string, { operator: ComparisonOperator; value: string }> = {};
  Object.entries(filterState).forEach(([dimensionId, filterValue]) => {
    if (filterValue.type === "percentage" || filterValue.type === "number") {
      result[dimensionId] = { operator: filterValue.operator, value: filterValue.value };
    }
  });
  return result;
}

export interface FilterBarProps {
  readonly filterDataSource?: FilterDataSource;
  /** Injectable data adapter — preferred over app services */
  readonly filterDataAdapter?: import("./useFilterData").FilterDataAdapter;
  readonly filters: FilterState;
  readonly onFiltersApply: (filters: FilterState) => void;
  readonly className?: string;
  readonly showClearAll?: boolean;
  /** Standardized chip sizing (preferred over passing raw class strings) */
  readonly chipSize?: FilterChipSize;
  /** Fine-grained overrides on top of `chipSize`/`padding` */
  readonly chipClassNames?: Partial<{ label: string; value: string; icon: string }>;
  /** Hide applied filter chips, show only filter icon with count badge. Default: false */
  readonly hideAppliedFilters?: boolean;
  /** Filter icon variant: "plus" (FunnelPlus) or "default" (Filter). Default: "plus" */
  readonly filterIcon?: FilterIconVariant;
  /** Disable the filter bar */
  readonly disabled?: boolean;
  /** Hide active filter chips (keeps ghost chips and filter icon visible) */
  readonly hideActiveChips?: boolean;
  /** Hide ghost filter chips (keeps active chips and filter icon visible) */
  readonly hideGhostChips?: boolean;
  /** Hide the filter icon/dropdown trigger button entirely */
  readonly hideFilterIcon?: boolean;
  /** Optional portal container for dropdown overlays */
  readonly container?: HTMLElement | null;
}

function dimensionOrDescendantMatchesSearch(
  dimension: FilterDimension,
  searchLower: string
): boolean {
  if (dimension.label.toLowerCase().includes(searchLower)) {
    return true;
  }
  const children = dimension.subfilter_values;
  if (!children?.length) {
    return false;
  }
  return children.some((child) => dimensionOrDescendantMatchesSearch(child, searchLower));
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filterDataSource,
  filterDataAdapter,
  filters,
  onFiltersApply,
  className,
  showClearAll = true,
  chipSize = "sm",
  chipClassNames,
  hideAppliedFilters = false,
  filterIcon = "plus",
  disabled = false,
  hideActiveChips = false,
  hideGhostChips = false,
  hideFilterIcon = false,
  container: portalContainer,
}) => {
  const chipPadding = useMemo(() => {
    const base = CHIP_PADDING_BY_SIZE[chipSize];
    return {
      label: cn(base.label, chipClassNames?.label),
      value: cn(base.value, chipClassNames?.value),
      icon: cn(base.icon, chipClassNames?.icon),
    };
  }, [chipSize, chipClassNames]);

  // Dropdown state
  const [open, setOpen] = useState(false);

  // Use the filter data hook for dimensions and values
  const defaultData = useFilterData(filterDataSource, filterDataAdapter);
  const {
    dimensions,
    valuesByDimension: dimensionValues,
    loadingDimensions,
    loadingValues,
    loadDimensions: fetchDimensions,
    loadValues: fetchDimensionValues,
  } = defaultData;

  // UI state
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);
  const [expandedDimensions, setExpandedDimensions] = useState<Record<string, boolean>>({});

  // Search state with deferred values for responsive filtering
  const [columnSearch, setColumnSearch] = useState("");
  const [valueSearch, setValueSearch] = useState("");
  const deferredColumnSearch = useDeferredValue(columnSearch);
  const deferredValueSearch = useDeferredValue(valueSearch);

  // Draft filter state (for Apply/Cancel functionality)
  const [draftFilters, setDraftFilters] = useState<FilterState>({});

  // Chip dropdown state for editing existing filters
  const [editingChip, setEditingChip] = useState<string | null>(null);

  // Operator and value state for percentage/number types
  const [operatorValue, setOperatorValue] = useState<
    Record<string, { operator: ComparisonOperator; value: string }>
  >({});

  const toggleExpand = (dimensionId: string) => {
    setExpandedDimensions((prev) => ({
      [dimensionId]: !prev[dimensionId],
    }));
  };

  // Handle dimension click
  const handleDimensionClick = useCallback(
    (dimensionId: string) => {
      setSelectedDimension(dimensionId);
      setValueSearch("");
      const dimension = findDimensionById(dimensions, dimensionId);

      if (dimension?.type === "string") {
        fetchDimensionValues(dimensionId, dimension);
      } else if (dimension?.type === "percentage" || dimension?.type === "number") {
        // Initialize operator/value state if not exists
        const existingFilter = draftFilters[dimensionId];
        if (
          existingFilter &&
          (existingFilter.type === "percentage" || existingFilter.type === "number")
        ) {
          setOperatorValue((prev) => ({
            ...prev,
            [dimensionId]: {
              operator: existingFilter.operator,
              value: existingFilter.value,
            },
          }));
        } else {
          setOperatorValue((prev) => ({
            ...prev,
            [dimensionId]: {
              operator: "gte" as ComparisonOperator,
              value: "",
            },
          }));
        }
      }
    },
    [fetchDimensionValues, dimensions, draftFilters]
  );

  const findDimensionById = (dims: FilterDimension[], id: string): FilterDimension | null => {
    for (const dim of dims) {
      if (dim.dimension_id === id) return dim;

      if (dim.subfilter_values?.length) {
        const found = findDimensionById(dim.subfilter_values, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Get label for a dimension from multiple sources
  const getDimensionLabel = useCallback(
    (dimensionId: string): string | undefined => {
      // Check API dimensions first
      const dimension = findDimensionById(dimensions, dimensionId);
      if (dimension?.label) return dimension.label;

      // Check existing filters (includes ghost filters with labels)
      const existingFilter = filters[dimensionId];
      if (existingFilter?.label) return existingFilter.label;

      return undefined;
    },
    [dimensions, filters]
  );

  // Handle value toggle (for string and boolean types)
  const handleValueToggle = useCallback(
    (dimensionId: string, valueId: string) => {
      setDraftFilters((prev) => {
        const dimension = findDimensionById(dimensions, dimensionId);
        const filterType = dimension?.type === "boolean" ? "boolean" : "string";
        const label = getDimensionLabel(dimensionId);

        const currentFilter = prev[dimensionId];
        const currentValues =
          currentFilter && (currentFilter.type === "string" || currentFilter.type === "boolean")
            ? currentFilter.values
            : [];

        let newValues: string[];

        if (filterType === "boolean") {
          newValues = currentValues.includes(valueId) ? [] : [valueId];
        } else {
          newValues = currentValues.includes(valueId)
            ? currentValues.filter((v) => v !== valueId)
            : [...currentValues, valueId];
        }

        if (newValues.length === 0) {
          // Remove the dimension key if no values selected
          const { [dimensionId]: removed, ...rest } = prev;
          void removed;
          return rest;
        }

        return {
          ...prev,
          [dimensionId]: { type: filterType, values: newValues, label },
        };
      });
    },
    [dimensions, getDimensionLabel]
  );

  // Handle select all for current dimension (string type only)
  const handleSelectAll = useCallback(() => {
    if (!selectedDimension || !dimensionValues[selectedDimension]) return;

    const dimension = findDimensionById(dimensions, selectedDimension);
    if (dimension?.type !== "string") return;

    const label = getDimensionLabel(selectedDimension);

    // Only select the currently filtered/visible values based on search (uses deferred value)
    const filteredValues = !deferredValueSearch.trim()
      ? dimensionValues[selectedDimension]
      : dimensionValues[selectedDimension].filter((v) =>
          v.label.toLowerCase().includes(deferredValueSearch.toLowerCase())
        );
    const allFilteredValueIds = filteredValues.map((v) => v.value);

    setDraftFilters((prev) => ({
      ...prev,
      [selectedDimension]: { type: "string", values: allFilteredValueIds, label },
    }));
  }, [selectedDimension, dimensionValues, dimensions, deferredValueSearch, getDimensionLabel]);

  // Handle clear all for current dimension
  const handleClearDimension = useCallback((dimensionId: string) => {
    setDraftFilters((prev) => {
      const { [dimensionId]: removed, ...rest } = prev;
      void removed;
      return rest;
    });
    // Clear operator/value state
    setOperatorValue((prev) => {
      const { [dimensionId]: removed, ...rest } = prev;
      void removed;
      return rest;
    });
  }, []);

  // Handle operator change for percentage/number types
  const handleOperatorChange = useCallback(
    (dimensionId: string, operator: ComparisonOperator) => {
      setOperatorValue((prev) => {
        const updated = {
          ...prev,
          [dimensionId]: {
            ...prev[dimensionId],
            operator,
          },
        };

        // Auto-sync to draftFilters if value exists
        const opValue = updated[dimensionId];
        if (opValue && opValue.value.trim()) {
          const dimension = findDimensionById(dimensions, dimensionId);
          if (dimension && (dimension.type === "percentage" || dimension.type === "number")) {
            const label = getDimensionLabel(dimensionId);
            const newFilter: FilterValue =
              dimension.type === "percentage"
                ? { type: "percentage", operator: opValue.operator, value: opValue.value, label }
                : { type: "number", operator: opValue.operator, value: opValue.value, label };
            setDraftFilters((prevDraft) => ({
              ...prevDraft,
              [dimensionId]: newFilter,
            }));
          }
        }

        return updated;
      });
    },
    [dimensions, getDimensionLabel]
  );

  // Handle value change for percentage/number types
  const handleValueChange = useCallback(
    (dimensionId: string, value: string) => {
      setOperatorValue((prev) => {
        const dimension = findDimensionById(dimensions, dimensionId);
        const isPercentage = dimension?.type === "percentage";

        // Clamp percentage values between 0 and 100
        let validatedValue = value;
        if (isPercentage && value.trim()) {
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            validatedValue = Math.max(0, Math.min(100, numValue)).toString();
          }
        }

        const updated = {
          ...prev,
          [dimensionId]: {
            operator: prev[dimensionId]?.operator || ("gte" as ComparisonOperator),
            value: validatedValue,
          },
        };

        // Auto-sync to draftFilters
        const opValue = updated[dimensionId];
        if (dimension && (dimension.type === "percentage" || dimension.type === "number")) {
          if (validatedValue.trim()) {
            // Add or update the filter in draftFilters
            const label = getDimensionLabel(dimensionId);
            const newFilter: FilterValue = {
              type: dimension.type,
              operator: opValue.operator,
              value: validatedValue.trim(),
              label,
            };
            setDraftFilters((prevDraft) => ({
              ...prevDraft,
              [dimensionId]: newFilter,
            }));
          } else {
            // Remove the filter if value is empty
            setDraftFilters((prevDraft) => {
              const { [dimensionId]: removed, ...rest } = prevDraft;
              void removed;
              return rest;
            });
          }
        }

        return updated;
      });
    },
    [dimensions, getDimensionLabel]
  );

  // Handle apply
  const handleApply = useCallback(() => {
    // Sync any pending operator/value filters before applying
    const finalFilters = { ...draftFilters };
    Object.entries(operatorValue).forEach(([dimensionId, opValue]) => {
      const dimension = findDimensionById(dimensions, dimensionId);
      if (dimension && (dimension.type === "percentage" || dimension.type === "number")) {
        if (opValue.value.trim()) {
          // Add or update the filter
          const label = getDimensionLabel(dimensionId);
          finalFilters[dimensionId] = {
            type: dimension.type,
            operator: opValue.operator,
            value: opValue.value,
            label,
          };
        } else {
          // Remove the filter if value is empty
          delete finalFilters[dimensionId];
        }
      }
    });

    onFiltersApply(finalFilters);
    setOpen(false);
    setEditingChip(null);
    setSelectedDimension(null);
  }, [draftFilters, operatorValue, dimensions, onFiltersApply, getDimensionLabel]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    setDraftFilters({ ...filters });
    setOperatorValue(buildOperatorValueFromFilters(filters));
    setOpen(false);
    setEditingChip(null);
    setSelectedDimension(null);
    setColumnSearch("");
    setValueSearch("");
  }, [filters]);

  // Handle remove filter chip
  const handleRemoveFilter = useCallback(
    (dimensionId: string) => {
      const newFilters = { ...filters };
      delete newFilters[dimensionId];
      onFiltersApply(newFilters);
      setDraftFilters(newFilters);
      setOperatorValue((prev) => {
        const { [dimensionId]: removed, ...rest } = prev;
        void removed;
        return rest;
      });
    },
    [filters, onFiltersApply]
  );

  // Handle clear all filters
  const handleClearAll = useCallback(() => {
    onFiltersApply({});
    setDraftFilters({});
    setOperatorValue({});
  }, [onFiltersApply]);

  // Handle chip click to edit
  const handleChipClick = useCallback(
    async (dimensionId: string) => {
      setOpen(true);
      setEditingChip(dimensionId);
      setSelectedDimension(dimensionId);
      setDraftFilters({ ...filters });

      // Ensure dimensions are loaded before proceeding
      let loadedDimensions = dimensions;
      if (loadedDimensions.length === 0) {
        loadedDimensions = await fetchDimensions();
      }

      const dimension = findDimensionById(loadedDimensions, dimensionId);

      if (dimension?.type === "string") {
        fetchDimensionValues(dimensionId, dimension);
      } else if (dimension?.type === "percentage" || dimension?.type === "number") {
        const existingFilter = filters[dimensionId];
        if (
          existingFilter &&
          (existingFilter.type === "percentage" || existingFilter.type === "number")
        ) {
          setOperatorValue((prev) => ({
            ...prev,
            [dimensionId]: {
              operator: existingFilter.operator,
              value: existingFilter.value,
            },
          }));
        } else {
          setOperatorValue((prev) => ({
            ...prev,
            [dimensionId]: {
              operator: "gte" as ComparisonOperator,
              value: "",
            },
          }));
        }
      }
    },
    [filters, fetchDimensionValues, dimensions, fetchDimensions]
  );

  // Filter dimensions by search (uses deferred value for responsive input)
  const filteredDimensions = useMemo(() => {
    if (!deferredColumnSearch.trim()) return dimensions;
    const searchLower = deferredColumnSearch.toLowerCase();
    return dimensions.filter((d) => dimensionOrDescendantMatchesSearch(d, searchLower));
  }, [dimensions, deferredColumnSearch]);

  // Get current dimension values and filter by search (uses deferred value for responsive input)
  const currentDimensionValues = useMemo(() => {
    if (!selectedDimension || !dimensionValues[selectedDimension]) return [];
    if (!deferredValueSearch.trim()) return dimensionValues[selectedDimension];
    const searchLower = deferredValueSearch.toLowerCase();
    return dimensionValues[selectedDimension].filter((v) =>
      v.label.toLowerCase().includes(searchLower)
    );
  }, [selectedDimension, dimensionValues, deferredValueSearch]);

  // Get selected values for current dimension (for string/boolean types)
  const selectedValues = useMemo(() => {
    if (!selectedDimension) return [];
    const filter = draftFilters[selectedDimension];
    if (filter && (filter.type === "string" || filter.type === "boolean")) {
      return filter.values;
    }
    return [];
  }, [selectedDimension, draftFilters]);

  // Check if all values are selected (string type only)
  const allSelected = useMemo(() => {
    if (!selectedDimension) return false;
    const dimension = findDimensionById(dimensions, selectedDimension);
    if (dimension?.type !== "string") return false;
    return (
      currentDimensionValues.length > 0 &&
      currentDimensionValues.every((v) => selectedValues.includes(v.value))
    );
  }, [currentDimensionValues, selectedValues, selectedDimension, dimensions]);

  // Check if some values are selected (for indeterminate state, string type only)
  const someSelected = useMemo(() => {
    if (!selectedDimension) return false;
    const dimension = findDimensionById(dimensions, selectedDimension);
    if (dimension?.type !== "string") return false;
    const selectedCount = currentDimensionValues.filter((v) =>
      selectedValues.includes(v.value)
    ).length;
    return selectedCount > 0 && selectedCount < currentDimensionValues.length;
  }, [currentDimensionValues, selectedValues, selectedDimension, dimensions]);

  // Get current dimension display name
  const currentDimensionName = useMemo(() => {
    if (!selectedDimension) return "Values";
    const label = getDimensionLabel(selectedDimension);
    return label || "Values";
  }, [selectedDimension, getDimensionLabel]);

  // Count total selected values in draft (for Apply button)
  const totalDraftSelectedCount = Object.values(draftFilters).reduce((acc, filterValue) => {
    if (filterValue.type === "string" || filterValue.type === "boolean") {
      return acc + filterValue.values.length;
    }
    return acc + 1; // percentage/number counts as 1 filter
  }, 0);

  // Check if there are changes from current filters
  // This includes both draftFilters and operatorValue changes
  const hasChanges = useMemo(() => {
    // Check draftFilters changes using deep equality
    if (!isEqual(draftFilters, filters)) {
      return true;
    }

    // Check operatorValue changes for percentage/number filters
    for (const [dimensionId, opValue] of Object.entries(operatorValue)) {
      const dimension = findDimensionById(dimensions, dimensionId);
      if (dimension && (dimension.type === "percentage" || dimension.type === "number")) {
        const currentFilter = filters[dimensionId];
        if (
          currentFilter &&
          (currentFilter.type === "percentage" || currentFilter.type === "number")
        ) {
          // Check if operator or value changed
          if (
            currentFilter.operator !== opValue.operator ||
            currentFilter.value !== opValue.value
          ) {
            return true;
          }
        } else if (opValue.value.trim()) {
          // New filter with value
          return true;
        }
      }
    }

    return false;
  }, [draftFilters, filters, operatorValue, dimensions]);

  const formatDimensionId = (id: string): string => {
    return id
      .replace(/_/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Get display parts for a filter chip (dimension name and value + count separately)
  const getFilterChipParts = useCallback(
    (dimensionId: string, filterValue: FilterValue) => {
      // Use label from filter value first, then fall back to getDimensionLabel or formatted ID
      const dimensionName =
        filterValue.label || getDimensionLabel(dimensionId) || formatDimensionId(dimensionId);

      let valueLabel = "";

      if (filterValue.type === "string") {
        const values = dimensionValues[dimensionId] || [];
        const firstValue = values.find((v) => filterValue.values.includes(v.value));
        const firstName = firstValue?.label || filterValue.values[0] || "";

        valueLabel =
          filterValue.values.length === 1
            ? firstName
            : `${firstName}... & ${filterValue.values.length - 1}`;
      } else if (filterValue.type === "boolean") {
        const yesCount = filterValue.values.filter((v) => v === "Yes").length;
        const noCount = filterValue.values.filter((v) => v === "No").length;
        const parts: string[] = [];
        if (yesCount > 0) parts.push("Yes");
        if (noCount > 0) parts.push("No");
        valueLabel = parts.join(" & ");
      } else if (filterValue.type === "percentage" || filterValue.type === "number") {
        const operatorLabel =
          FILTER_OPERATORS.find((op) => op.value === filterValue.operator)?.label ||
          filterValue.operator;
        const unit = filterValue.type === "percentage" ? "%" : "";
        valueLabel = `${operatorLabel} ${filterValue.value}${unit}`;
      }

      return { dimensionName, valueLabel };
    },
    [dimensionValues, getDimensionLabel]
  );

  // A dimension's own filter count, ignoring any subfilter_values (used recursively below).
  const ownActiveCount = (dimension: FilterDimension): number => {
    const filter = draftFilters[dimension.dimension_id];
    if (!filter) return 0;
    if (filter.type === "string" || filter.type === "boolean") return filter.values.length;
    return 1;
  };

  // Parents with subfilters (e.g. "PIM Content Health") never carry a filter value
  // themselves — only their leaf children do (e.g. "PIM Has Title?") — so the parent's
  // badge must sum its own count with every descendant's, recursively.
  const totalActiveCount = (dimension: FilterDimension): number => {
    const childCount = (dimension.subfilter_values ?? []).reduce(
      (sum, child) => sum + totalActiveCount(child),
      0
    );
    return ownActiveCount(dimension) + childCount;
  };

  const renderDimensionItem = (dimension: FilterDimension, level = 0): React.ReactNode => {
    const isSelected = selectedDimension === dimension.dimension_id;
    const isExpanded = expandedDimensions[dimension.dimension_id];

    const activeCount = totalActiveCount(dimension);
    const isActive = activeCount > 0;

    const hasSubfilters = dimension.subfilters_enabled && dimension.subfilter_values?.length;

    let dimensionRowChevron: React.ReactNode;
    if (!hasSubfilters) {
      dimensionRowChevron = <ChevronRight className="h-4 w-4 text-slate-400 opacity-50" />;
    } else if (isExpanded) {
      dimensionRowChevron = <ChevronDown className="h-4 w-4 text-slate-400" />;
    } else {
      dimensionRowChevron = <ChevronRight className="h-4 w-4 text-slate-400" />;
    }

    return (
      <div key={dimension.dimension_id}>
        <Button
          onClick={() => {
            if (level === 0 && !hasSubfilters) {
              setExpandedDimensions({});
            }
            handleDimensionClick(dimension.dimension_id);
            if (hasSubfilters) {
              toggleExpand(dimension.dimension_id);
            }
          }}
          variant="ghost"
          data-testid={`filter-bar-dimension-${dimension.dimension_id}`}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-slate-50 transition-colors text-left h-auto",
            isSelected && "bg-violet-50 hover:bg-violet-50 rounded-none",
            isActive && "font-medium"
          )}
        >
          <span
            className={cn(
              "text-wrap font-normal",
              level > 0 ? "text-slate-400" : "text-secondary",
              isSelected && "font-medium",
              level > 0 && isSelected && "text-slate-500"
            )}
          >
            {dimension.label}
          </span>
          <div className="flex items-center gap-1">
            {isActive && (
              <span className="flex min-w-4 w-auto items-center justify-center px-1 text-xs rounded bg-violet-200 text-violet-600">
                {activeCount}
              </span>
            )}
            {dimensionRowChevron}
          </div>
        </Button>

        {/* Render subfilters recursively */}
        {hasSubfilters && isExpanded && (
          <div>
            {dimension.subfilter_values!.map((child) => renderDimensionItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Render filter dropdown content
  const renderFilterContent = () => {
    return (
      <div className="flex h-[350px] w-[600px]">
        {/* Left Panel - Dimensions */}
        <div className="w-[240px] border-r border-slate-200 flex flex-col bg-slate-50">
          {/* Search Dimensions */}
          <div className="relative border-b border-gray-200">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Search Column"
              value={columnSearch}
              onChange={(e) => setColumnSearch(e.target.value)}
              className="h-12 pl-9 text-xs rounded-none bg-slate-50 border-none focus:border-violet-400"
            />
          </div>

          {/* Dimensions Label */}
          <div className="px-3 py-2 text-xs font-medium text-secondary">Columns</div>

          {/* Dimensions List */}
          <div className="flex-1 overflow-y-auto">
            {loadingDimensions ? (
              <DimensionListSkeleton />
            ) : filteredDimensions.length > 0 ? (
              filteredDimensions.map((dimension) => renderDimensionItem(dimension))
            ) : (
              <div className="p-4 text-center text-sm text-slate-500">No columns found</div>
            )}
          </div>
        </div>

        {/* Right Panel - Values */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {selectedDimension ? (
            (() => {
              const dimension = findDimensionById(dimensions, selectedDimension);
              const dimensionType = dimension?.type || "string";

              // String type - show API values
              if (dimensionType === "string") {
                return (
                  <>
                    {/* Search Values */}
                    <div className="relative border-b border-gray-200">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <Input
                        placeholder={`Search ${currentDimensionName}`}
                        value={valueSearch}
                        onChange={(e) => setValueSearch(e.target.value)}
                        className="h-12 pl-9 text-xs bg-white border-none focus:border-violet-400"
                      />
                    </div>

                    {/* Values Label */}
                    <div className="px-3 py-2 text-xs font-medium text-secondary">
                      <span>{currentDimensionName}</span>
                    </div>

                    {/* Values List with Select All - Virtualized for large datasets */}
                    {loadingValues || loadingDimensions ? (
                      <div className="flex-1 flex items-center justify-center py-5">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : currentDimensionValues.length > 0 ? (
                      <ValuesList
                        values={currentDimensionValues}
                        selectedValues={selectedValues}
                        onToggle={(value) => handleValueToggle(selectedDimension, value)}
                        testId="filter-bar-label-2"
                        selectAllProps={{
                          allSelected,
                          someSelected,
                          onSelectAll: handleSelectAll,
                          onClearAll: () => handleClearDimension(selectedDimension),
                        }}
                      />
                    ) : (
                      <div className="p-4 text-center text-sm text-slate-500">No results found</div>
                    )}
                  </>
                );
              }

              // Boolean type - show Yes/No checkboxes
              if (dimensionType === "boolean") {
                const currentFilter = draftFilters[selectedDimension];
                const selectedBoolValues =
                  currentFilter && currentFilter.type === "boolean" ? currentFilter.values : [];

                return (
                  <>
                    {/* Values Label with Clear */}
                    <div className="px-3 py-2 text-xs font-medium text-slate-500 flex items-center justify-between">
                      <span>{currentDimensionName}</span>
                      <Button
                        onClick={() => handleClearDimension(selectedDimension)}
                        variant="ghost"
                        className="text-slate-400 text-xs hover:text-violet-700 font-normal h-auto p-0 hover:bg-transparent"
                      >
                        Clear All
                      </Button>
                    </div>

                    {/* Boolean Options */}
                    <div className="flex-1 overflow-y-auto">
                      {["Yes", "No"].map((boolValue) => {
                        const isChecked = selectedBoolValues.includes(boolValue);

                        return (
                          <label
                            key={boolValue}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer"
                            data-testid="filter-bar-label-3"
                          >
                            <IndeterminateCheckbox
                              type="radio"
                              checked={isChecked}
                              onChange={() => handleValueToggle(selectedDimension, boolValue)}
                              name={selectedDimension}
                              className="accent-primary"
                            />
                            <span className="text-sm text-slate-900">{boolValue}</span>
                          </label>
                        );
                      })}
                    </div>
                  </>
                );
              }

              // Percentage/Number type - show operator dropdown + value input
              if (dimensionType === "percentage" || dimensionType === "number") {
                const opValue = operatorValue[selectedDimension] || { operator: "gte", value: "" };
                const unit = dimensionType === "percentage" ? "%" : "";
                const placeholder =
                  dimensionType === "percentage" ? "Enter % Value" : "Enter Value";

                return (
                  <>
                    {/* Header */}
                    <div className="px-3 py-2 text-xs font-medium text-slate-500 flex items-center justify-between">
                      <span>{placeholder}</span>
                      <Button
                        onClick={() => handleClearDimension(selectedDimension)}
                        variant="ghost"
                        className="text-slate-400 text-xs hover:text-violet-700 font-normal h-auto p-0 hover:bg-transparent"
                      >
                        Clear All
                      </Button>
                    </div>

                    {/* Operator and Value Input */}
                    <div className="p-4">
                      <div className="flex items-center gap-2">
                        {/* Operator Dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            data-testid="filter-bar-dropdown-menu-trigger"
                          >
                            <Button
                              variant="outline"
                              className="h-9 px-3 flex items-center gap-2 min-w-[80px] justify-between"
                              data-testid="filter-bar-outline-btn"
                            >
                              <span>
                                {FILTER_OPERATORS.find((op) => op.value === opValue.operator)
                                  ?.label || opValue.operator}
                              </span>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="start"
                            className="z-[101]"
                            container={portalContainer}
                          >
                            {FILTER_OPERATORS.map((op) => (
                              <DropdownMenuItem
                                key={op.value}
                                onClick={() => handleOperatorChange(selectedDimension, op.value)}
                                className={cn(
                                  opValue.operator === op.value && "bg-violet-50 text-violet-700"
                                )}
                              >
                                {op.label} ({op.description})
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Value Input */}
                        <div className="flex-1 flex items-center gap-1">
                          <Input
                            id={`value-input-${selectedDimension}`}
                            type="number"
                            min={dimensionType === "percentage" ? 0 : undefined}
                            max={dimensionType === "percentage" ? 100 : undefined}
                            step={dimensionType === "percentage" ? 0.01 : undefined}
                            placeholder="Value"
                            value={opValue.value}
                            onChange={(e) => handleValueChange(selectedDimension, e.target.value)}
                            className="h-9 bg-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                          />
                          {unit && <span className="text-sm text-slate-600">{unit}</span>}
                        </div>
                      </div>
                    </div>
                  </>
                );
              }

              return null;
            })()
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-slate-500">
              Select a column to view filter options
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render footer with Cancel/Apply buttons
  const renderFooter = () => (
    <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-end gap-2 bg-white">
      <Button
        variant="outline"
        onClick={handleCancel}
        className="h-9 px-4  text-gray-950"
        data-testid="filter-bar-handle-cancel-btn"
      >
        Cancel
      </Button>
      <Button
        onClick={handleApply}
        disabled={!hasChanges}
        className="h-9 px-4 bg-primary hover:bg-violet-700 text-white"
        data-testid="filter-bar-handle-apply-btn"
      >
        {totalDraftSelectedCount > 0
          ? `Apply ${totalDraftSelectedCount} Filter${totalDraftSelectedCount !== 1 ? "s" : ""}`
          : "Apply Filter"}
      </Button>
    </div>
  );

  // Render chip dropdown footer with Cancel/Apply buttons (for single dimension)
  const renderChipFooter = () => {
    const filter = selectedDimension ? draftFilters[selectedDimension] : undefined;
    const currentDimensionSelectedCount = filter
      ? filter.type === "string" || filter.type === "boolean"
        ? filter.values.length
        : 1 // percentage/number counts as 1
      : 0;

    return (
      <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-end gap-2 bg-white">
        <Button
          variant="outline"
          onClick={handleCancel}
          className="h-9 px-4 text-gray-950"
          data-testid="filter-bar-handle-cancel-btn-2"
        >
          Cancel
        </Button>
        <Button
          onClick={handleApply}
          disabled={!hasChanges}
          className="h-9 px-4 bg-primary hover:bg-violet-700 text-white"
          data-testid="filter-bar-handle-apply-btn-2"
        >
          {currentDimensionSelectedCount > 0
            ? `Apply ${currentDimensionSelectedCount} Filter${currentDimensionSelectedCount !== 1 ? "s" : ""}`
            : "Apply Filter"}
        </Button>
      </div>
    );
  };

  // Render chip dropdown content (values only - for editing a single dimension)
  const renderChipDropdownContent = () => {
    if (!selectedDimension) return null;

    const dimension = findDimensionById(dimensions, selectedDimension);
    const dimensionType = dimension?.type || "string";
    const currentFilter = draftFilters[selectedDimension];

    return (
      <div className="w-[280px] flex flex-col max-h-[350px]">
        {dimensionType === "string" ? (
          <>
            {/* Search Values */}
            <div className="relative border-b border-gray-200">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Search Value"
                value={valueSearch}
                onChange={(e) => setValueSearch(e.target.value)}
                className="h-12 pl-9 text-xs bg-white border-none focus:border-violet-400"
              />
            </div>

            {/* Selected Count Header */}
            <div className="px-3 py-2 text-xs font-medium text-secondary">
              <span>
                {currentFilter && currentFilter.type === "string" && currentFilter.values.length > 0
                  ? `${currentFilter.values.length} Selected`
                  : "Value"}
              </span>
            </div>

            {/* Values List with Select All - Virtualized for large datasets */}
            {loadingValues || loadingDimensions ? (
              <div className="flex-1 flex items-center justify-center py-5">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : currentDimensionValues.length > 0 ? (
              <ValuesList
                values={currentDimensionValues}
                selectedValues={selectedValues}
                onToggle={(value) => handleValueToggle(selectedDimension, value)}
                maxHeight={220}
                testId="filter-bar-label-5"
                selectAllProps={{
                  allSelected,
                  someSelected,
                  onSelectAll: handleSelectAll,
                  onClearAll: () => handleClearDimension(selectedDimension),
                }}
              />
            ) : (
              <div className="p-4 text-center text-sm text-slate-500">No results found</div>
            )}
          </>
        ) : dimensionType === "boolean" ? (
          <>
            {/* Selected Count Header */}
            <div className="px-3 py-2 text-xs font-medium text-slate-500 flex items-center justify-between">
              <span>
                {currentFilter &&
                currentFilter.type === "boolean" &&
                currentFilter.values.length > 0
                  ? `${currentFilter.values.length} Selected`
                  : "Value"}
              </span>
              <Button
                onClick={() => handleClearDimension(selectedDimension)}
                variant="ghost"
                className="text-slate-400 text-xs hover:text-violet-700 font-normal h-auto p-0 hover:bg-transparent"
              >
                Clear All
              </Button>
            </div>

            {/* Boolean Options */}
            <div className="flex-1 overflow-y-auto max-h-[220px]">
              {["Yes", "No"].map((boolValue) => {
                const selectedBoolValues =
                  currentFilter && currentFilter.type === "boolean" ? currentFilter.values : [];
                const isChecked = selectedBoolValues.includes(boolValue);

                return (
                  <label
                    key={boolValue}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer"
                    data-testid="filter-bar-label-6"
                  >
                    <IndeterminateCheckbox
                      type="radio"
                      checked={isChecked}
                      onChange={() => handleValueToggle(selectedDimension, boolValue)}
                      name={selectedDimension}
                      className="accent-primary"
                    />
                    <span className="text-sm text-slate-900">{boolValue}</span>
                  </label>
                );
              })}
            </div>
          </>
        ) : dimensionType === "percentage" || dimensionType === "number" ? (
          <>
            {/* Header */}
            <div className="px-3 py-2 text-xs font-medium text-slate-500 flex items-center justify-between">
              <span>{dimensionType === "percentage" ? "Enter % Value" : "Enter Value"}</span>
              <Button
                onClick={() => handleClearDimension(selectedDimension)}
                variant="ghost"
                className="text-slate-400 text-xs hover:text-violet-700 font-normal h-auto p-0 hover:bg-transparent"
              >
                Clear All
              </Button>
            </div>

            {/* Operator and Value Input */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                {/* Operator Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild data-testid="filter-bar-dropdown-menu-trigger-2">
                    <Button
                      variant="outline"
                      className="h-9 px-3 flex items-center gap-2 min-w-[80px] justify-between"
                      data-testid="filter-bar-outline-btn-2"
                    >
                      <span>
                        {FILTER_OPERATORS.find(
                          (op) => op.value === (operatorValue[selectedDimension]?.operator || "gte")
                        )?.label || ">="}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="z-[101]"
                    container={portalContainer}
                  >
                    {FILTER_OPERATORS.map((op) => (
                      <DropdownMenuItem
                        key={op.value}
                        onClick={() => handleOperatorChange(selectedDimension, op.value)}
                        className={cn(
                          (operatorValue[selectedDimension]?.operator || "gte") === op.value &&
                            "bg-violet-50 text-violet-700"
                        )}
                      >
                        {op.label} ({op.description})
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Value Input */}
                <div className="flex-1 flex items-center gap-1">
                  <Input
                    type="number"
                    placeholder="Value"
                    value={operatorValue[selectedDimension]?.value || ""}
                    onChange={(e) => handleValueChange(selectedDimension, e.target.value)}
                    className="h-9 bg-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                    id={`value-input-${selectedDimension}`}
                    min={dimensionType === "percentage" ? 0 : undefined}
                    max={dimensionType === "percentage" ? 100 : undefined}
                    step={dimensionType === "percentage" ? 0.01 : undefined}
                  />
                  {dimensionType === "percentage" && (
                    <span className="text-sm text-slate-600">%</span>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    );
  };

  // Render active filter chips (excludes ghost filters with empty values)
  const renderFilterChips = () => {
    const activeFilters = Object.entries(filters).filter(([, filterValue]) => {
      // Exclude ghost filters with no selected values (rendered as ghost chips)
      if (filterValue.ghost) {
        if (filterValue.type === "string" || filterValue.type === "boolean") {
          return filterValue.values.length > 0;
        }
      }
      // Include all non-ghost filters and ghost filters with values
      if (filterValue.type === "string" || filterValue.type === "boolean") {
        return filterValue.values.length > 0;
      }
      return true; // percentage/number filters
    });
    if (activeFilters.length === 0) return null;

    return (
      <>
        {activeFilters.map(([dimensionId, filterValue]) => {
          const { dimensionName, valueLabel } = getFilterChipParts(dimensionId, filterValue);

          return (
            <DropdownMenu
              key={dimensionId}
              open={editingChip === dimensionId && open}
              onOpenChange={(isOpen) => {
                if (!isOpen) {
                  handleCancel();
                }
              }}
            >
              <div
                className="flex items-center shadow-xs overflow-hidden text-xs bg-white border border-slate-200 rounded-lg"
                role="group"
                aria-label={`Filter: ${dimensionName}`}
              >
                <DropdownMenuTrigger asChild data-testid="filter-bar-dropdown-menu-trigger-3">
                  <button
                    type="button"
                    onClick={() => handleChipClick(dimensionId)}
                    className="flex items-center hover:bg-slate-50 cursor-pointer"
                    aria-label={`Edit filter: ${dimensionName}`}
                  >
                    <span className={cn("text-secondary bg-slate-100", chipPadding.label)}>
                      {dimensionName}
                    </span>
                    <span className={cn("font-medium text-slate-900", chipPadding.value)}>
                      {valueLabel}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFilter(dimensionId);
                  }}
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove filter: ${dimensionName}`}
                  className="text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full mr-1 h-auto w-auto hover:bg-slate-300"
                >
                  <X className="h-2 w-2 scale-75" />
                </Button>
              </div>
              <DropdownMenuContent
                align="start"
                className="p-0 w-auto"
                container={portalContainer}
                role="dialog"
                aria-label="Edit filter"
              >
                {renderChipDropdownContent()}
                {renderChipFooter()}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        })}
      </>
    );
  };

  // Render pinned/ghost chips (filters with ghost=true and empty values)
  const renderGhostChips = () => {
    // Find ghost filters with no selected values
    const ghostFilters = Object.entries(filters).filter(([, filterValue]) => {
      if (!filterValue.ghost) return false;
      if (filterValue.type === "string" || filterValue.type === "boolean") {
        return filterValue.values.length === 0;
      }
      return false;
    });

    if (ghostFilters.length === 0) return null;

    return (
      <>
        {ghostFilters.map(([dimensionId, filterValue]) => {
          const dimension = findDimensionById(dimensions, dimensionId);
          const dimensionName =
            filterValue.label ?? dimension?.label ?? formatDimensionId(dimensionId);

          return (
            <DropdownMenu
              key={dimensionId}
              open={editingChip === dimensionId && open}
              onOpenChange={(isOpen) => {
                if (!isOpen) {
                  handleCancel();
                }
              }}
            >
              <DropdownMenuTrigger asChild data-testid="filter-bar-dropdown-menu-trigger-pinned">
                <button
                  type="button"
                  onClick={() => void handleChipClick(dimensionId)}
                  className={cn(
                    "flex items-center shadow-xs overflow-hidden text-xs bg-white border border-dashed border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                  )}
                  aria-label={`Add filter: ${dimensionName}`}
                >
                  <span className={cn("text-secondary bg-slate-50", chipPadding.label)}>
                    {dimensionName}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="p-0 w-auto"
                container={portalContainer}
                role="dialog"
                aria-label="Add filter"
              >
                {renderChipDropdownContent()}
                {renderChipFooter()}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        })}
      </>
    );
  };

  // Count only filters with actual values (exclude ghost filters with empty values)
  const activeFilterCount = Object.values(filters).filter((filterValue) => {
    if (filterValue.type === "string" || filterValue.type === "boolean") {
      return filterValue.values.length > 0;
    }
    return true; // percentage/number filters always count
  }).length;
  const hasActiveFilters = activeFilterCount > 0;

  // Select the appropriate icon based on filterIcon prop
  const FilterIcon = filterIcon === "plus" ? FunnelPlus : Filter;

  // Don't render if no data source / adapter is provided
  if (!filterDataSource && !filterDataAdapter) {
    return null;
  }

  const showGhostChips = !hideAppliedFilters && !hideGhostChips;
  const showActiveChips = !hideAppliedFilters && !hideActiveChips;

  return (
    <>
      <div className={cn("flex items-center gap-2 flex-wrap", className)}>
        {showGhostChips && renderGhostChips()}

        {showActiveChips && renderFilterChips()}

        {!hideFilterIcon && (
          <DropdownMenu
            open={open && !editingChip}
            onOpenChange={(isOpen) => {
              if (disabled) return;
              if (!editingChip) {
                setOpen(isOpen);
                if (isOpen) {
                  fetchDimensions();
                  setDraftFilters({ ...filters });
                  setOperatorValue(buildOperatorValueFromFilters(filters));
                  setExpandedDimensions({});
                } else {
                  handleCancel();
                }
              }
            }}
          >
            <DropdownMenuTrigger
              asChild
              data-testid="filter-bar-dropdown-menu-trigger-4"
              disabled={disabled}
            >
              <button
                type="button"
                className={cn(
                  "relative border bg-card border-slate-200 rounded-lg",
                  chipPadding.icon,
                  filterIcon !== "plus" && "border-gray-200 shadow-xs",
                  disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-slate-50"
                )}
                aria-label={
                  hideAppliedFilters && hasActiveFilters
                    ? `Filters (${activeFilterCount} active)`
                    : "Open filters"
                }
              >
                <FilterIcon
                  className={cn(
                    "h-4 w-4",
                    filterIcon === "plus" ? "text-primary" : "text-tertiary-text"
                  )}
                />
                {hideAppliedFilters && hasActiveFilters && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className={cn("p-0 w-auto z-[101]", hideAppliedFilters && "mr-8")}
              container={portalContainer}
              role="dialog"
              aria-label="Filter options"
            >
              {renderFilterContent()}
              {renderFooter()}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {hasActiveFilters && showClearAll && showActiveChips && (
        <Button
          onClick={handleClearAll}
          variant="ghost"
          className="ml-auto text-xs text-slate-600 hover:text-slate-800 h-auto p-0 hover:bg-transparent"
          data-testid="filter-bar-handle-clear-all-btn"
          disabled={disabled}
        >
          Clear All
        </Button>
      )}
    </>
  );
};

export default FilterBar;

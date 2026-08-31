export interface FilterState {
  [dimensionId: string]: FilterValue;
}

// Filter Dimensions API Types
export interface FilterDimension {
  dimension_id: string;
  label: string;
  type: "string" | "boolean" | "percentage" | "number";
  subfilters_enabled?: boolean;
  subfilter_values?: FilterDimension[];
}

export interface FilterDimensionsResponse {
  task_id: string;
  widget_id: string;
  dimensions: FilterDimension[];
}

export interface FilterDimensionValuesParams {
  agentId: string;
  taskId: string;
  widgetId: string;
  dimensionId: string;
  reportId: string;
}

export interface FilterDimensionValue {
  value: string;
  label: string;
}

export interface FilterDimensionValuesResponse {
  task_id: string;
  widget_id: string;
  dimension_id: string;
  values: FilterDimensionValue[];
}

export interface FilterDimensionsParams {
  agentId: string;
  taskId: string;
  widgetId: string;
  reportId: string;
}

export type FilterValue =
  | { type: "string"; values: string[]; label?: string; ghost?: boolean }
  | { type: "boolean"; values: string[]; label?: string; ghost?: boolean }
  | {
      type: "percentage" | "number";
      operator: ComparisonOperator;
      value: string;
      label?: string;
      ghost?: boolean;
    };

// Operator options for percentage/number types
export type ComparisonOperator = "gte" | "lte" | "gt" | "lt" | "eq";

export interface OperatorOption {
  value: ComparisonOperator;
  label: string;
  description: string;
}

export const FILTER_OPERATORS: readonly OperatorOption[] = [
  { value: "gte", label: ">=", description: "Greater than or equal to" },
  { value: "lte", label: "<=", description: "Less than or equal to" },
  { value: "gt", label: ">", description: "Greater than" },
  { value: "lt", label: "<", description: "Less than" },
  { value: "eq", label: "=", description: "Equal to" },
] as const;

// Values List Props
export interface ValuesListProps {
  values: FilterDimensionValue[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  maxHeight?: number;
  testId?: string;
  forceVirtualization?: boolean;
  /** Props for rendering Select All / Clear All row at the top of the list */
  selectAllProps?: {
    allSelected: boolean;
    someSelected: boolean;
    onSelectAll: () => void;
    onClearAll: () => void;
  };
}

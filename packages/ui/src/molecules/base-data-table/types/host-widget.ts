/**
 * Library-local widget types (vendored from neo-canvas `@/types/widget`).
 */

import {
  CADENCE,
  type Cadence,
  COMPARE_CADENCE,
  type CompareCadence,
  type DataSource,
  type DateRangeMetadata,
  type FilterMetadata,
  type FilterOperator,
  type PaginationMetadata,
  type WidgetMetadata,
} from "./host-data";
import { TIME_GRANULARITY, VISIBILITY } from "../constants";

export { CADENCE, COMPARE_CADENCE };
export type {
  Cadence,
  CompareCadence,
  DataSource,
  DateRangeMetadata,
  FilterMetadata,
  FilterOperator,
  PaginationMetadata,
  WidgetMetadata,
};

export type Visibility = (typeof VISIBILITY)[keyof typeof VISIBILITY];
export type TimeGranularity = (typeof TIME_GRANULARITY)[keyof typeof TIME_GRANULARITY];

export type ActionConfig = {
  visibility: Visibility;
  dataSource?: DataSource;
};

export type GranularityActionConfig = ActionConfig & {
  options?: Array<{ value: TimeGranularity; label: string }>;
  defaultValue?: TimeGranularity;
};

export type DimensionOption = {
  label: string;
  dimensionId: string;
  type: string;
};

export type ViewByActionConfig = ActionConfig & {
  options?: DimensionOption[];
  defaultValue?: string;
  tileDropdownSearch?: {
    enabled: boolean;
    placeholder?: string;
  };
};

export type BreakdownByActionConfig = ActionConfig & {
  options?: DimensionOption[];
  defaultValue?: string | string[];
  maxSelections?: number;
};

export type ExportOption = {
  value: string[];
  label: string;
};

export type ExportActionConfig = ActionConfig & {
  dataSource?: DataSource;
};

export type WidgetActions = {
  filters?: ActionConfig;
  download?: ActionConfig;
  export?: ExportActionConfig;
  refresh?: ActionConfig;
  fullscreen?: ActionConfig;
  granularity?: GranularityActionConfig;
  viewBy?: ViewByActionConfig;
  breakdownBy?: BreakdownByActionConfig;
};

export type WidgetBehavior = {
  syncWithPageState?: boolean;
  refreshInterval?: number;
};

export type WidgetTitleDropdown = {
  options: Array<{ field: string; label: string; description?: string }>;
  defaultKey: string;
};

export type WidgetTop<TActions = WidgetActions> = {
  title?: string | null;
  subtitle?: string | null;
  actions?: TActions;
  titleDropdown?: WidgetTitleDropdown;
};

export type WidgetTopV2WithMetadata = WidgetTop<WidgetActions> & {
  metadata?: WidgetMetadata;
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";
import { fn } from "storybook/test";

import {
  BaseDataTable,
  useBaseDataTableData,
  type BaseDataTableFeatures,
  type BaseDataTableState,
  type WidgetV2Schema,
} from "@/molecules/base-data-table";

// Mock product rows (Action Log–style flat data for Storybook)
const PRODUCT_DATA = [
  {
    product_id: "SKU-001",
    product_name: "Wireless Headphones",
    category: "Electronics",
    price: { Value: "149.99" },
    quantity: { Value: "234" },
    revenue: { Value: "35097.66" },
  },
  {
    product_id: "SKU-002",
    product_name: "Smart Watch Pro",
    category: "Electronics",
    price: { Value: "299.99" },
    quantity: { Value: "156" },
    revenue: { Value: "46798.44" },
  },
  {
    product_id: "SKU-003",
    product_name: "Running Shoes",
    category: "Sports",
    price: { Value: "89.99" },
    quantity: { Value: "412" },
    revenue: { Value: "37075.88" },
  },
  {
    product_id: "SKU-004",
    product_name: "Coffee Maker",
    category: "Home",
    price: { Value: "79.99" },
    quantity: { Value: "189" },
    revenue: { Value: "15118.11" },
  },
  {
    product_id: "SKU-005",
    product_name: "Yoga Mat",
    category: "Sports",
    price: { Value: "29.99" },
    quantity: { Value: "567" },
    revenue: { Value: "17004.33" },
  },
  {
    product_id: "SKU-006",
    product_name: "Bluetooth Speaker",
    category: "Electronics",
    price: { Value: "59.99" },
    quantity: { Value: "298" },
    revenue: { Value: "17877.02" },
  },
  {
    product_id: "SKU-007",
    product_name: "Air Fryer",
    category: "Home",
    price: { Value: "129.99" },
    quantity: { Value: "145" },
    revenue: { Value: "18848.55" },
  },
  {
    product_id: "SKU-008",
    product_name: "Tennis Racket",
    category: "Sports",
    price: { Value: "199.99" },
    quantity: { Value: "87" },
    revenue: { Value: "17399.13" },
  },
];

const SCHEMA: WidgetV2Schema = {
  id: "storybook_demo",
  kind: "widget",
  version: "v2",
  top: {
    title: "Product Sales",
    subtitle: "Sales data by product",
    actions: {},
    metadata: {
      enablePvp: false,
      showTotal: false,
      filters: [],
      dateRange: { cadence: "last7Days", compareCadence: "previousPeriod" },
      pagination: { pageSize: 5, page: 0 },
    },
  },
  body: {
    type: "table",
    content: {
      dataSource: { method: "POST", url: "/api/mock" },
      options: {
        pageSize: 5,
        pageSizeOptions: [5, 10, 25],
        showTotal: false,
        enableColumnReorder: true,
        enableColumnResize: true,
      },
      schema: {
        columns: [
          {
            field: "product_id",
            role: "dimension",
            type: "string",
            label: "Product ID",
            align: "left",
            width: 120,
            sort: { visibility: "visible", ascending: true, descending: true },
          },
          {
            field: "product_name",
            role: "dimension",
            type: "string",
            label: "Product Name",
            align: "left",
            width: 200,
            sort: { visibility: "visible", ascending: true, descending: true },
          },
          {
            field: "category",
            role: "dimension",
            type: "string",
            label: "Category",
            align: "left",
            width: 130,
            sort: { visibility: "visible", ascending: true, descending: true },
          },
          {
            field: "price",
            role: "metric",
            type: "currency",
            label: "Price",
            align: "right",
            width: 100,
            sort: { visibility: "visible", ascending: true, descending: true },
          },
          {
            field: "quantity",
            role: "metric",
            type: "number",
            label: "Qty",
            align: "right",
            width: 80,
            sort: { visibility: "visible", ascending: true, descending: true },
          },
          {
            field: "revenue",
            role: "metric",
            type: "currency",
            label: "Revenue",
            align: "right",
            width: 120,
            sort: { visibility: "visible", ascending: true, descending: true },
          },
        ],
      },
    },
  },
};

const DEFAULT_STATE: BaseDataTableState = {
  pagination: { pageSize: 5, page: 0 },
  sorting: [],
  filters: [],
  columnOrder: [],
  columnPinning: { left: [], right: [] },
};

// Pinning + resizing stay on — TanStack getTotalSize can crash when those states are undefined
const FEATURE_PRESETS = {
  all: {
    enableSorting: true,
    enablePagination: true,
    enableColumnReordering: true,
    enableColumnPinning: true,
    enableColumnResizing: true,
  },
  minimal: {
    enableSorting: false,
    enablePagination: false,
    enableColumnReordering: false,
    enableColumnPinning: true,
    enableColumnResizing: true,
  },
} satisfies Record<string, BaseDataTableFeatures>;

type WrapperProps = {
  readonly features?: BaseDataTableFeatures;
  readonly isLoading?: boolean;
  readonly onStateChange?: (state: Partial<BaseDataTableState>) => void;
};

/** Controlled table with client-side slice (no network). */
function ControlledBaseDataTable({
  features = FEATURE_PRESETS.all,
  isLoading = false,
  onStateChange,
}: WrapperProps) {
  const [state, setState] = useState<BaseDataTableState>(DEFAULT_STATE);

  const handleStateChange = (partial: Partial<BaseDataTableState>) => {
    setState((prev) => ({ ...prev, ...partial }));
    onStateChange?.(partial);
  };

  const currentPageData = useMemo(() => {
    const start = state.pagination.page * state.pagination.pageSize;
    const end = start + state.pagination.pageSize;
    return PRODUCT_DATA.slice(start, end);
  }, [state.pagination]);

  return (
    <BaseDataTable
      schema={SCHEMA}
      data={currentPageData}
      totalRows={PRODUCT_DATA.length}
      state={state}
      onStateChange={handleStateChange}
      isLoading={isLoading}
      error={null}
      features={features}
    />
  );
}

/**
 * Same UI, but data comes from useBaseDataTableData + injected fetchData
 * (how hosts / Action Log should wire the library — no axios inside the package).
 */
function WithFetchAdapterTable() {
  const fetchData = useMemo(
    () => async () => {
      // Simulate a short network delay
      await new Promise((r) => setTimeout(r, 200));
      return {
        data: PRODUCT_DATA,
        total: PRODUCT_DATA.length,
      };
    },
    []
  );

  const { data, totalRows, state, isLoading, error, updateState } = useBaseDataTableData({
    schema: SCHEMA,
    fetchData,
  });

  return (
    <BaseDataTable
      schema={SCHEMA}
      data={data}
      totalRows={totalRows}
      state={state}
      onStateChange={updateState}
      isLoading={isLoading}
      error={error}
      features={FEATURE_PRESETS.all}
    />
  );
}

const meta: Meta<typeof BaseDataTable> = {
  title: "Molecules/BaseDataTable",
  component: BaseDataTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Schema-driven data table. Hosts must inject `fetchData` on `useBaseDataTableData` — the library has no axios / dataFetcherService.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isLoading: { control: "boolean" },
    features: { control: false },
    schema: { control: false },
    data: { control: false },
    state: { control: false },
    onStateChange: { control: false },
    totalRows: { control: false },
    error: { control: false },
  },
  args: {
    isLoading: false,
  },
};

export default meta;
type Story = StoryObj<typeof BaseDataTable>;

export const AllFeatures: Story = {
  render: (args) => (
    <ControlledBaseDataTable
      features={FEATURE_PRESETS.all}
      isLoading={args.isLoading}
      onStateChange={fn()}
    />
  ),
};

export const Minimal: Story = {
  render: (args) => (
    <ControlledBaseDataTable
      features={FEATURE_PRESETS.minimal}
      isLoading={args.isLoading}
      onStateChange={fn()}
    />
  ),
};

export const WithFetchAdapter: Story = {
  render: () => <WithFetchAdapterTable />,
};

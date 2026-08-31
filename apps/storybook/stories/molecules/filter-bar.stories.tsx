import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";

import {
  FilterBar,
  type FilterDataAdapter,
  type FilterDimension,
  type FilterDimensionValue,
  type FilterState,
} from "@/molecules/filters";

const MOCK_DIMENSIONS: FilterDimension[] = [
  { dimension_id: "retailer", label: "Retailer", type: "string" },
  { dimension_id: "brand", label: "Brand", type: "string" },
  { dimension_id: "in_stock", label: "In stock", type: "boolean" },
  { dimension_id: "buy_box", label: "Buy box %", type: "percentage" },
];

const MOCK_VALUES: Record<string, FilterDimensionValue[]> = {
  retailer: [
    { value: "amazon", label: "Amazon" },
    { value: "walmart", label: "Walmart" },
    { value: "target", label: "Target" },
  ],
  brand: [
    { value: "yankee", label: "Yankee Candle" },
    { value: "glade", label: "Glade" },
    { value: "febreze", label: "Febreze" },
  ],
};

const mockAdapter: FilterDataAdapter = {
  loadDimensions: async () => MOCK_DIMENSIONS,
  loadValues: async (dimensionId) => MOCK_VALUES[dimensionId] ?? [],
};

function ControlledFilterBar() {
  const [filters, setFilters] = useState<FilterState>({});
  const adapter = useMemo(() => mockAdapter, []);

  return (
    <div className="space-y-4 p-4">
      <FilterBar filterDataAdapter={adapter} filters={filters} onFiltersApply={setFilters} />
      <pre className="rounded-lg border bg-slate-50 p-3 text-xs overflow-auto max-h-48">
        {JSON.stringify(filters, null, 2)}
      </pre>
    </div>
  );
}

const meta: Meta<typeof FilterBar> = {
  title: "Molecules/Filters/FilterBar",
  component: FilterBar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Two-panel filter UI. Inject `filterDataAdapter` (or `FilterDataSource.fetchData`) — no `dataFetcherService` in the library.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FilterBar>;

export const Default: Story = {
  render: () => <ControlledFilterBar />,
};

export const FetchDataProvider: Story = {
  render: () => {
    const [filters, setFilters] = useState<FilterState>({});
    return (
      <FilterBar
        filterDataSource={{
          fetchData: async ({ type, dimensionId }) => {
            if (type === "dimensions") {
              return { dimensions: MOCK_DIMENSIONS };
            }
            return { values: MOCK_VALUES[dimensionId ?? ""] ?? [] };
          },
        }}
        filters={filters}
        onFiltersApply={setFilters}
      />
    );
  },
};

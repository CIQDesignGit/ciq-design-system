import type { Meta, StoryObj } from "@storybook/react-vite";
import { Suspense } from "react";
import type { VisualizationSpec } from "vega-embed";

import { LazyVegaChart } from "@/molecules/reports";

const SPEC: VisualizationSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  data: { name: "table" },
  mark: "bar",
  encoding: {
    x: { field: "retailer", type: "nominal" },
    y: { field: "spend", type: "quantitative" },
  },
};

const DATA = {
  table: [
    { retailer: "Amazon", spend: 128400 },
    { retailer: "Walmart", spend: 76200 },
  ],
};

const meta: Meta = {
  title: "Molecules/Reports/LazyVegaChart",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "`React.lazy` wrapper around `VegaChart` so conversations can load the chart chunk on demand.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Suspense fallback={<div className="p-4 text-sm text-slate-500">Loading chart…</div>}>
      <LazyVegaChart
        spec={SPEC}
        data={DATA}
        title="Lazy-loaded chart"
        height={240}
      />
    </Suspense>
  ),
};

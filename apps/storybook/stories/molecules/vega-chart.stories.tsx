import type { Meta, StoryObj } from "@storybook/react-vite";
import type { VisualizationSpec } from "vega-embed";

import { VegaChart } from "@/molecules/reports";

const AD_SPEND_BY_RETAILER_SPEC: VisualizationSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  data: { name: "table" },
  mark: { type: "bar", cornerRadiusEnd: 4 },
  encoding: {
    x: { field: "retailer", type: "nominal", title: "Retailer", axis: { labelAngle: 0 } },
    y: { field: "spend", type: "quantitative", title: "Ad Spend (USD)" },
    color: {
      field: "retailer",
      type: "nominal",
      legend: null,
      scale: { range: ["#FF9900", "#0071CE", "#CC0000", "#43B02A"] },
    },
    tooltip: [
      { field: "retailer", type: "nominal", title: "Retailer" },
      { field: "spend", type: "quantitative", title: "Spend", format: "$,.0f" },
    ],
  },
};

const AD_SPEND_BY_RETAILER_DATA = {
  table: [
    { retailer: "Amazon", spend: 128400 },
    { retailer: "Walmart", spend: 76200 },
    { retailer: "Target", spend: 41850 },
    { retailer: "Instacart", spend: 22300 },
  ],
};

const REVENUE_TREND_SPEC: VisualizationSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  data: { name: "table" },
  mark: { type: "line", point: true, interpolate: "monotone", color: "#7800F2" },
  encoding: {
    x: { field: "week", type: "temporal", title: "Week" },
    y: { field: "revenue", type: "quantitative", title: "Revenue (USD)" },
    tooltip: [
      { field: "week", type: "temporal", title: "Week", format: "%b %d" },
      { field: "revenue", type: "quantitative", title: "Revenue", format: "$,.0f" },
    ],
  },
};

const REVENUE_TREND_DATA = {
  table: [
    { week: "2026-06-01", revenue: 182500 },
    { week: "2026-06-08", revenue: 191200 },
    { week: "2026-06-15", revenue: 176800 },
    { week: "2026-06-22", revenue: 204300 },
    { week: "2026-06-29", revenue: 219700 },
    { week: "2026-07-06", revenue: 198100 },
    { week: "2026-07-13", revenue: 225400 },
    { week: "2026-07-20", revenue: 238900 },
  ],
};

const meta: Meta<typeof VegaChart> = {
  title: "Molecules/Reports/VegaChart",
  component: VegaChart,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Renders a Vega/Vega-Lite `spec` via `vega-embed`. Pass named `data` for datasets declared in the spec. Use `LazyVegaChart` to code-split the chart chunk.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    width: { control: "text" },
    height: { control: { type: "number", min: 150, max: 600, step: 10 } },
    title: { control: "text" },
    className: { control: "text" },
    actions: { control: "boolean" },
    spec: { control: false },
    data: { control: false },
    tooltipFormatter: { control: false },
  },
  args: {
    spec: AD_SPEND_BY_RETAILER_SPEC,
    data: AD_SPEND_BY_RETAILER_DATA,
    width: "container",
    height: 300,
    title: "Weekly Ad Spend by Retailer",
    actions: false,
  },
};

export default meta;
type Story = StoryObj<typeof VegaChart>;

export const Default: Story = {};

export const RevenueTrendLine: Story = {
  args: {
    spec: REVENUE_TREND_SPEC,
    data: REVENUE_TREND_DATA,
    title: "Revenue Trend — Last 8 Weeks",
    height: 280,
  },
};

export const WithChartActions: Story = {
  args: { actions: true },
};

export const CustomTooltipFormatter: Story = {
  args: {
    spec: REVENUE_TREND_SPEC,
    data: REVENUE_TREND_DATA,
    title: "Revenue Trend — Custom Tooltip",
    tooltipFormatter: (value) => {
      if (value && typeof value === "object" && "revenue" in value) {
        const v = value as { week: string; revenue: number };
        return `<strong>${v.week}</strong><br/>$${v.revenue.toLocaleString()}`;
      }
      return String(value);
    },
  },
};

export const FixedWidth: Story = {
  args: { width: 480, height: 260 },
};

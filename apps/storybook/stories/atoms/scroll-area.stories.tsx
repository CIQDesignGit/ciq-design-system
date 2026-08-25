import type { Meta, StoryObj } from "@storybook/react-vite";

import { ScrollArea } from "@/atoms/scroll-area";

// ============================================
// Mock Data
// ============================================

const CAMPAIGN_LIST = [
  { sku: "SKU-1001", name: "Wireless Earbuds Pro", retailer: "Amazon", acos: "24.1%" },
  { sku: "SKU-1002", name: "Smart Watch Series 4", retailer: "Amazon", acos: "31.7%" },
  { sku: "SKU-1003", name: "Bluetooth Speaker Mini", retailer: "Walmart", acos: "18.5%" },
  { sku: "SKU-1004", name: "4K Streaming Stick", retailer: "Amazon", acos: "22.9%" },
  { sku: "SKU-1005", name: "Robot Vacuum X200", retailer: "Target", acos: "27.3%" },
  { sku: "SKU-1006", name: "Air Fryer 6-Quart", retailer: "Walmart", acos: "19.8%" },
  { sku: "SKU-1007", name: "Noise Cancelling Headphones", retailer: "Amazon", acos: "29.4%" },
  { sku: "SKU-1008", name: "Electric Toothbrush", retailer: "Target", acos: "15.2%" },
  { sku: "SKU-1009", name: "Instant Pot Duo", retailer: "Walmart", acos: "21.6%" },
  { sku: "SKU-1010", name: "Yoga Mat Premium", retailer: "Amazon", acos: "12.9%" },
  { sku: "SKU-1011", name: "Standing Desk Converter", retailer: "Instacart", acos: "33.5%" },
  { sku: "SKU-1012", name: "Portable Blender", retailer: "Amazon", acos: "17.4%" },
  { sku: "SKU-1013", name: "Fitness Tracker Band", retailer: "Walmart", acos: "26.8%" },
  { sku: "SKU-1014", name: "Reusable Water Bottle", retailer: "Target", acos: "9.6%" },
  { sku: "SKU-1015", name: "LED Desk Lamp", retailer: "Amazon", acos: "20.3%" },
  { sku: "SKU-1016", name: "Ceramic Coffee Grinder", retailer: "Instacart", acos: "23.7%" },
  { sku: "SKU-1017", name: "Weighted Blanket", retailer: "Walmart", acos: "16.1%" },
  { sku: "SKU-1018", name: "USB-C Charging Hub", retailer: "Amazon", acos: "28.0%" },
  { sku: "SKU-1019", name: "Cast Iron Skillet Set", retailer: "Target", acos: "13.5%" },
  { sku: "SKU-1020", name: "Compression Backpack", retailer: "Amazon", acos: "25.9%" },
];

// ============================================
// Content
// ============================================

const CampaignRows = () => (
  <div className="flex flex-col gap-1 p-4">
    {CAMPAIGN_LIST.map((item) => (
      <div
        key={item.sku}
        className="flex items-center justify-between gap-4 rounded-md px-2 py-1.5 text-sm hover:bg-slate-50"
      >
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">{item.name}</span>
          <span className="text-xs text-slate-500">
            {item.sku} &middot; {item.retailer}
          </span>
        </div>
        <span className="text-xs font-medium text-slate-600">ACOS {item.acos}</span>
      </div>
    ))}
  </div>
);

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof ScrollArea> = {
  title: "Atoms/ScrollArea",
  component: ScrollArea,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A Radix-based scroll container with a custom, styled scrollbar. Give it an explicit height
(via \`className\`) and scrollable content, such as a long list of SKUs or campaigns.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["auto", "always", "scroll", "hover"],
      description: "When the scrollbar is visible: on overflow, always, only while scrolling, or on hover.",
    },
    scrollHideDelay: {
      control: "number",
      description: "Delay (ms) before the scrollbar hides. Applies to the 'scroll' and 'hover' types.",
    },
    dir: {
      control: "inline-radio",
      options: ["ltr", "rtl"],
      description: "Reading direction of the scroll area.",
    },
    className: {
      control: false, // required to set an explicit height/width; not meaningful as a live control
      description: "Class names for the outer container - typically sets a fixed height/width.",
    },
    children: {
      control: false, // scrollable content, varies per story
      description: "The scrollable content, rendered inside the viewport.",
    },
  },
  args: {
    type: "hover",
    scrollHideDelay: 600,
    dir: "ltr",
  },
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

// ============================================
// Stories
// ============================================

/** A scrollable list of 20 campaigns inside a fixed-height panel. */
export const Default: Story = {
  render: (args) => (
    <ScrollArea {...args} className="h-72 w-96 rounded-lg border border-slate-200 bg-white">
      <CampaignRows />
    </ScrollArea>
  ),
};

/** Scrollbar is always visible, regardless of hover/scroll state. */
export const AlwaysVisibleScrollbar: Story = {
  render: (args) => (
    <ScrollArea {...args} className="h-72 w-96 rounded-lg border border-slate-200 bg-white">
      <CampaignRows />
    </ScrollArea>
  ),
  args: { type: "always" },
};

/** Scrollbar only appears while the user is actively scrolling. */
export const VisibleOnlyWhileScrolling: Story = {
  render: (args) => (
    <ScrollArea {...args} className="h-72 w-96 rounded-lg border border-slate-200 bg-white">
      <CampaignRows />
    </ScrollArea>
  ),
  args: { type: "scroll", scrollHideDelay: 200 },
};

/** A shorter panel showing only a handful of rows before scrolling kicks in. */
export const CompactPanel: Story = {
  render: (args) => (
    <ScrollArea {...args} className="h-40 w-96 rounded-lg border border-slate-200 bg-white">
      <CampaignRows />
    </ScrollArea>
  ),
};

/** Right-to-left reading direction. */
export const RTLDirection: Story = {
  render: (args) => (
    <ScrollArea {...args} className="h-72 w-96 rounded-lg border border-slate-200 bg-white">
      <CampaignRows />
    </ScrollArea>
  ),
  args: { dir: "rtl" },
};

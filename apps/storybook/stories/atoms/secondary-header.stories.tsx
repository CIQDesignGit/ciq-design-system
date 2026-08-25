import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkles } from "lucide-react";

import { SecondaryHeader, type SecondaryHeaderItem } from "@/atoms/secondary-header";

// ============================================
// Mock Data
// ============================================

const CONTEXT_ITEMS: SecondaryHeaderItem[] = [
  { id: "platform", label: "Amazon", icon: "building-2" },
  { id: "scope", label: "All Brands", icon: "boxes" },
  { id: "task-type", label: "Content Audit", icon: "shield-check" },
];

const SINGLE_ITEM: SecondaryHeaderItem[] = [{ id: "platform", label: "Walmart", icon: "building-2" }];

const MANY_ITEMS: SecondaryHeaderItem[] = [
  { id: "platform", label: "Amazon", icon: "building-2" },
  { id: "scope", label: "All Brands", icon: "boxes" },
  { id: "task-type", label: "Sponsored Products", icon: "shield-check" },
  { id: "retailer-2", label: "Walmart", icon: "building-2" },
  { id: "retailer-3", label: "Target", icon: "building-2" },
  { id: "cadence", label: "Last 7 Days", icon: "boxes" },
  { id: "compliance", label: "Brand Compliant", icon: "shield-check" },
];

const CUSTOM_ICON_ITEMS: SecondaryHeaderItem[] = [
  { id: "platform", label: "Amazon", icon: "building-2" },
  {
    id: "copilot",
    label: "AI-assisted",
    icon: <Sparkles className="h-4 w-4 text-violet-500" />,
  },
];

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof SecondaryHeader> = {
  title: "Atoms/SecondaryHeader",
  component: SecondaryHeader,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A horizontal context bar shown below the page header, displaying the current
filters/scope as pill chips - e.g. platform, brand scope, or task type. Renders nothing
when \`items\` is empty. Each item's \`icon\` can be one of the built-in keys
("building-2" | "boxes" | "shield-check") or a custom ReactNode.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    items: {
      control: false, // array of { id, label, icon } objects - use separate stories for variations
      description:
        "Items to display as pill chips. Each item has an id, label, and icon (a built-in icon key or a custom ReactNode).",
    },
    className: {
      control: false, // Tailwind class override, not meaningful as a live control
      description: "Additional class names applied to the outer bar container.",
    },
  },
  args: {
    items: CONTEXT_ITEMS,
  },
};

export default meta;
type Story = StoryObj<typeof SecondaryHeader>;

// ============================================
// Stories
// ============================================

/** Typical platform / scope / task-type context bar. */
export const Default: Story = {};

/** A single context chip. */
export const SingleItem: Story = {
  args: { items: SINGLE_ITEM },
};

/** Many chips wrap onto a second line as needed. */
export const ManyItems: Story = {
  args: { items: MANY_ITEMS },
};

/** An item using a custom ReactNode icon instead of a built-in icon key. */
export const CustomIcon: Story = {
  args: { items: CUSTOM_ICON_ITEMS },
};

/** Renders nothing when there are no items - shown here with a placeholder note. */
export const EmptyState: Story = {
  args: { items: [] },
  render: (args) => (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-slate-500">
        SecondaryHeader renders null below when items is empty:
      </p>
      <SecondaryHeader {...args} />
      <div className="rounded border border-dashed border-slate-300 p-3 text-xs text-slate-400">
        (nothing rendered here)
      </div>
    </div>
  ),
};

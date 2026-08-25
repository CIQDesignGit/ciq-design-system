import type { Meta, StoryObj } from "@storybook/react-vite";

import { TruncatedBadge } from "@/atoms/truncated-badge";

// ============================================
// Mock Data
// ============================================

const SINGLE_SHORT = ["Amazon US"];
const SINGLE_LONG = ["Very Long Retailer Name That Gets Truncated Eventually"];
const MULTIPLE_MARKETPLACES = ["Amazon US", "Walmart US", "Instacart", "Target Plus"];
const TWO_ITEMS = ["Amazon US", "Amazon CA"];

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof TruncatedBadge> = {
  title: "Atoms/TruncatedBadge",
  component: TruncatedBadge,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Displays a list of items as a single badge — showing the first item (truncated if needed) plus a `&N` suffix for the rest — with a tooltip revealing the full list on hover. Used in table cells where a field (e.g. marketplaces, categories) can hold multiple values.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    items: {
      control: false, // string[] - use the dedicated stories below to see variations
      description: "Array of items to summarize into a single badge.",
    },
    BadgeClassName: {
      control: "text",
      description: "Additional class names applied to the underlying Badge.",
    },
    maxWidth: {
      control: "text",
      description: "Maximum width of the badge before the first item's text truncates.",
    },
    tooltipSide: {
      control: "inline-radio",
      options: ["top", "bottom", "left", "right"],
      description: "Side the tooltip appears on relative to the badge.",
    },
    tooltipSeparator: {
      control: "text",
      description: "Separator used to join items in the tooltip text.",
    },
  },
  args: {
    items: MULTIPLE_MARKETPLACES,
    maxWidth: "160px",
    tooltipSide: "bottom",
    tooltipSeparator: ", ",
  },
};

export default meta;
type Story = StoryObj<typeof TruncatedBadge>;

/** Multiple marketplaces — shows "Amazon US &3" with the rest revealed on hover. */
export const Default: Story = {};

/** A single, short item — no truncation or "&N" suffix, tooltip only appears if hovered text is cut off. */
export const SingleItem: Story = {
  args: { items: SINGLE_SHORT },
};

/** A single long item that gets truncated by `maxWidth` — hover to see the full name. */
export const SingleLongItem: Story = {
  args: { items: SINGLE_LONG },
};

/** Exactly two items — "Amazon US &1". */
export const TwoItems: Story = {
  args: { items: TWO_ITEMS },
};

/** No items — the component renders nothing. */
export const EmptyList: Story = {
  args: { items: [] },
};

/** A wider badge that fits more of the first item's text before truncating. */
export const WiderBadge: Story = {
  args: { items: SINGLE_LONG, maxWidth: "280px" },
};

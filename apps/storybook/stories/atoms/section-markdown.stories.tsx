import type { Meta, StoryObj } from "@storybook/react-vite";

import { SectionMarkdown } from "@/atoms/section-markdown";

const INSIGHT_CONTENT = `
### Buy box loss risk — SKU-4471

Amazon Copilot detected a **12% drop** in buy box ownership for *Yankee Candle Large Jar Candle, 22oz* over the last 7 days.

**Likely causes:**

1. A competing offer priced 8% below your current price of $24.99
2. Inventory dipped to 6 units on 2026-07-29, triggering a fulfillment risk flag
3. Seller rating for the competing offer improved to 4.8 stars

**Recommended actions:**
- Match price to $22.99 to reclaim the buy box
- Replenish inventory to at least 150 units before the next promotional window
- Monitor the competing offer daily for the next 5 days
`;

const EMPTY_STATE_CONTENT = `
### No recommendations right now

Amazon Copilot hasn't found any pricing or inventory risks for this SKU in the last 24 hours. Check back after the next data refresh.
`;

const SIMPLE_CONTENT = `
**Revenue up 18.4%** week-over-week across all Walmart listings in the Home & Garden category.
`;

const meta: Meta<typeof SectionMarkdown> = {
  title: "Atoms/SectionMarkdown",
  component: SectionMarkdown,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Renders a markdown string inside a bordered, card-styled section for AI insights and recommendations.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    content: { control: "text" },
    className: { control: "text" },
  },
  args: {
    content: INSIGHT_CONTENT,
  },
};

export default meta;
type Story = StoryObj<typeof SectionMarkdown>;

export const Default: Story = {};

export const ShortSummary: Story = {
  args: { content: SIMPLE_CONTENT },
};

export const EmptyState: Story = {
  args: { content: EMPTY_STATE_CONTENT },
};

export const Narrow: Story = {
  args: { content: INSIGHT_CONTENT, className: "max-w-sm" },
};

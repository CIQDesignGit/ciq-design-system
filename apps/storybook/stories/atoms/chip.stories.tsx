import type { Meta, StoryObj } from "@storybook/react-vite";

import { Chip } from "@/atoms/chip";

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof Chip> = {
  title: "Atoms/Chip",
  component: Chip,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A small bordered pill for a short piece of metadata, such as a marketplace
name or a filter value. Simpler than \`Badge\` - no variant styling built in,
so color/emphasis is applied via \`className\`.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    message: {
      control: "text",
      description: "Chip label text.",
    },
    textClassName: {
      control: false, // styling escape hatch, not meaningful via controls
      description: "Additional class names applied to the inner text span.",
    },
    className: {
      control: false, // styling escape hatch, not meaningful via controls
      description: "Additional class names applied to the chip container.",
    },
  },
  args: {
    message: "Amazon.com",
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

// ============================================
// Stories
// ============================================

/** Default chip with border and neutral text. */
export const Default: Story = {};

/** Chip styled to indicate a positive/success state via className. */
export const Success: Story = {
  args: {
    message: "In stock",
    className: "border-emerald-200 bg-emerald-50",
    textClassName: "text-emerald-700",
  },
};

/** Chip styled to indicate a warning state via className. */
export const Warning: Story = {
  args: {
    message: "Low inventory",
    className: "border-amber-200 bg-amber-50",
    textClassName: "text-amber-700",
  },
};

/** A row of chips representing marketplaces. */
export const MarketplaceRow: Story = {
  render: () => (
    <div className="flex gap-2">
      <Chip message="Amazon.com" />
      <Chip message="Walmart.com" />
      <Chip message="Amazon.ca" />
      <Chip message="Target.com" />
    </div>
  ),
};

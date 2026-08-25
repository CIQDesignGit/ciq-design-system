import type { Meta, StoryObj } from "@storybook/react-vite";

import { CharacterCount } from "@/atoms/character-count";

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof CharacterCount> = {
  title: "Atoms/CharacterCount",
  component: CharacterCount,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A compact "current / max" character counter, shown under text inputs such
as a Content Agent product title or bullet point editor. Turns red once the
current count exceeds the max.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    current: {
      control: { type: "number", min: 0, max: 500 },
      description: "Current character count.",
    },
    max: {
      control: { type: "number", min: 1, max: 500 },
      description: "Maximum allowed character count.",
    },
    className: {
      control: false, // styling escape hatch, not meaningful via controls
      description: "Additional class names.",
    },
  },
  args: {
    current: 142,
    max: 200,
  },
};

export default meta;
type Story = StoryObj<typeof CharacterCount>;

// ============================================
// Stories
// ============================================

/** Within the limit - shown in the muted foreground color. */
export const Default: Story = {};

/** Right at the limit. */
export const AtLimit: Story = {
  args: {
    current: 200,
    max: 200,
  },
};

/** Over the limit - text turns red to warn the customer. */
export const OverLimit: Story = {
  args: {
    current: 214,
    max: 200,
  },
};

/** Empty input, e.g. an untouched Amazon listing title field. */
export const Empty: Story = {
  args: {
    current: 0,
    max: 150,
  },
};

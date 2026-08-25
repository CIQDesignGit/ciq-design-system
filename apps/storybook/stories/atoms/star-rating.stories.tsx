import type { Meta, StoryObj } from "@storybook/react-vite";

import { StarRating } from "@/atoms/star-rating";

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof StarRating> = {
  title: "Atoms/StarRating",
  component: StarRating,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Displays a product's average review rating as filled/half/empty stars, with an optional numeric value. Commonly used in product and SKU detail cells to surface Amazon/Walmart review scores.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "number", min: 0, max: 5, step: 0.1 },
      description: "Average rating value (0-5). Renders full, half, and empty stars accordingly.",
    },
    maxStars: {
      control: { type: "number", min: 1, max: 10 },
      description: "Total number of stars to render.",
    },
    showValue: {
      control: "boolean",
      description: "Whether to show the numeric rating value next to the stars.",
    },
    className: {
      control: "text",
      description: "Additional class names for the wrapper.",
    },
  },
  args: {
    value: 4.3,
    maxStars: 5,
    showValue: true,
  },
};

export default meta;
type Story = StoryObj<typeof StarRating>;

/** A typical Amazon product rating, e.g. 4.3 out of 5 stars. */
export const Default: Story = {};

/** Perfect rating — all stars filled. */
export const PerfectScore: Story = {
  args: { value: 5 },
};

/** A low rating, e.g. a listing that's losing customer trust. */
export const LowRating: Story = {
  args: { value: 1.8 },
};

/** No reviews yet — zero stars. */
export const NoReviews: Story = {
  args: { value: 0 },
};

/** Stars only, without the numeric label — useful in compact table cells. */
export const StarsOnly: Story = {
  args: { value: 3.7, showValue: false },
};

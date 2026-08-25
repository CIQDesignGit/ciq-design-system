import type { Meta, StoryObj } from "@storybook/react-vite";

import { TextDiff } from "@/atoms/text-diff";

// ============================================
// Mock Data
// ============================================

const TITLE_OLD = "Yankee Candle Large Jar Candle, 22 oz";
const TITLE_NEW =
  "Yankee Candle 22 oz — 150-Hr Burn, Premium Scented Candle";

const BULLET_OLD =
  "Long lasting fragrance. Great for gifting. Made with high quality wax.";
const BULLET_NEW =
  "Long lasting fragrance up to 150 hours. Great for gifting during the holidays. Made with high quality, clean-burning wax.";

const IDENTICAL_TEXT = "Wireless Bluetooth Headphones with Noise Cancellation";

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof TextDiff> = {
  title: "Atoms/TextDiff",
  component: TextDiff,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Renders a word-level diff between two strings — removed words shown with strikethrough, added words highlighted in green. Used by Content Agent to show how an AI-generated title or bullet point compares to the original listing copy.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    oldText: {
      control: "text",
      description: "The original (base) text. Removed words are shown with strikethrough.",
    },
    newText: {
      control: "text",
      description: "The new (target) text. Added words are highlighted in green.",
    },
    className: {
      control: "text",
      description: "Additional class names for the wrapping `<span>`.",
    },
  },
  args: {
    oldText: TITLE_OLD,
    newText: TITLE_NEW,
  },
};

export default meta;
type Story = StoryObj<typeof TextDiff>;

/** A rewritten product title — Content Agent added burn-time and repositioned it as premium. */
export const Default: Story = {};

/** A longer bullet-point rewrite with several word-level insertions. */
export const BulletPointRewrite: Story = {
  args: { oldText: BULLET_OLD, newText: BULLET_NEW },
};

/** No changes — old and new text are identical, so nothing is highlighted. */
export const NoChanges: Story = {
  args: { oldText: IDENTICAL_TEXT, newText: IDENTICAL_TEXT },
};

/** Text was removed entirely, replaced with nothing. */
export const TextRemoved: Story = {
  args: { oldText: "Ships in discreet packaging with free returns.", newText: "" },
};

/** Text added to a previously empty field. */
export const TextAdded: Story = {
  args: { oldText: "", newText: "Now available in 3 new scent variants for fall." },
};

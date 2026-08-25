import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { CopyButton } from "@/atoms/copy-button";

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof CopyButton> = {
  title: "Atoms/CopyButton",
  component: CopyButton,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
An icon button that copies a value to the clipboard, showing a brief
"Copied!" tooltip confirmation. Used next to ASINs, API payloads, and
generated content so customers can quickly copy values out of the app.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "The string copied to the clipboard when clicked.",
    },
    tooltipText: {
      control: "text",
      description: "Tooltip label shown before copying.",
    },
    copiedText: {
      control: "text",
      description: "Tooltip label shown briefly after copying.",
    },
    feedbackDuration: {
      control: { type: "number", min: 500, max: 5000, step: 500 },
      description: "How long (ms) the copied confirmation stays visible.",
    },
    absolute: {
      control: "boolean",
      description: "Positions the button absolutely (bottom-right), revealed on group hover.",
    },
    groupHoverClass: {
      control: "text",
      description: "Tailwind group name used to reveal the button when `absolute` is set.",
    },
    onCopy: { action: "copied" },
    className: {
      control: false, // styling escape hatch, not meaningful via controls
      description: "Additional class names.",
    },
  },
  args: {
    value: "B08XYZ1234",
    tooltipText: "Copy",
    copiedText: "Copied!",
    feedbackDuration: 2000,
    absolute: false,
    onCopy: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof CopyButton>;

// ============================================
// Stories
// ============================================

/** Default copy button for an ASIN value. */
export const Default: Story = {};

/** Copying a longer generated value, e.g. an API key or campaign ID. */
export const LongValue: Story = {
  args: {
    value: "campaign-sp-8f2c1e4d-9a3b-4c7e-b1d2-6f5a8e9c0d1f",
    tooltipText: "Copy campaign ID",
  },
};

/** Absolute-positioned, revealed on hover of a surrounding group - e.g. over a text block. */
export const RevealOnHover: Story = {
  args: {
    absolute: true,
    groupHoverClass: "group-hover/demo",
  },
  render: (args) => (
    <div className="group/demo relative w-[320px] rounded-lg border p-4 text-sm text-muted-foreground">
      Generated title: &quot;Premium Wireless Noise-Cancelling Headphones - 40Hr Battery&quot;
      <CopyButton {...args} value="Premium Wireless Noise-Cancelling Headphones - 40Hr Battery" />
    </div>
  ),
};

/** No value provided - the button renders nothing (guards against copying an empty string). */
export const EmptyValueRendersNothing: Story = {
  args: {
    value: "",
  },
};

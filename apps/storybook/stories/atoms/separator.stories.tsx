import type { Meta, StoryObj } from "@storybook/react-vite";

import { Separator } from "@/atoms/separator";

const meta: Meta<typeof Separator> = {
  title: "Atoms/Separator",
  component: Separator,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A thin visual divider between content sections, built on Radix `Separator`. Supports horizontal and vertical orientation.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      description: "Layout axis of the divider line.",
    },
    decorative: {
      control: "boolean",
      description:
        "When true, hides the separator from assistive tech (it's purely visual).",
    },
    className: {
      control: "text",
      description: "Additional class names for color/length overrides.",
    },
  },
  args: {
    orientation: "horizontal",
    decorative: true,
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

/** Horizontal divider between two blocks of text. */
export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <p className="text-sm text-slate-700">Amazon US — Buy box: 94%</p>
      <Separator {...args} className="my-3" />
      <p className="text-sm text-slate-700">Walmart US — Buy box: 87%</p>
    </div>
  ),
};

/** Vertical divider separating inline stats. */
export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <div className="flex h-8 items-center gap-3 text-sm text-slate-700">
      <span>Revenue: $128.4K</span>
      <Separator {...args} />
      <span>Units: 4,320</span>
      <Separator {...args} />
      <span>ACOS: 14.2%</span>
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "@/atoms/badge";

const meta: Meta<typeof Badge> = {
  title: "Atoms/Badge",
  component: Badge,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A small status/label pill. Used for things like ASIN health flags, campaign
status, or category tags across the CommerceIQ product surfaces.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "inline-radio",
      options: [
        "default",
        "defaultLight",
        "secondary",
        "destructive",
        "outline",
      ],
      description: "Visual style of the badge.",
    },
    children: {
      control: "text",
      description: "Badge label content.",
    },
    className: {
      control: false,
      description: "Additional class names.",
    },
  },
  args: {
    variant: "default",
    children: "In stock",
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

/** Default filled badge. */
export const Default: Story = {};

/** Light tint variant. */
export const DefaultLight: Story = {
  args: {
    variant: "defaultLight",
    children: "12 ASINs",
  },
};

/** Secondary variant for neutral/low-priority labels. */
export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Draft",
  },
};

/** Destructive variant for errors or critical alerts. */
export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Buy Box lost",
  },
};

/** Outline variant for a lower-emphasis, bordered look. */
export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Walmart",
  },
};

/** A row of badges representing different retail statuses. */
export const StatusRow: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="default">In stock</Badge>
      <Badge variant="destructive">Out of stock</Badge>
      <Badge variant="defaultLight">Low inventory</Badge>
      <Badge variant="secondary">Discontinued</Badge>
      <Badge variant="outline">Amazon</Badge>
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Download, Plus } from "lucide-react";
import { fn } from "storybook/test";

import { Button } from "@/atoms/button";

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
The primary action control used across CommerceIQ surfaces - saving a
pricing rule, applying a filter, launching a Sales Agent action, etc.
Supports multiple visual variants and sizes, and can render as a child
element (e.g. a link) via \`asChild\`.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
        "card",
      ],
      description: "Visual style of the button.",
    },
    size: {
      control: "inline-radio",
      options: ["default", "xs", "sm", "lg", "icon"],
      description: "Button height/padding.",
    },
    asChild: {
      control: false,
      description:
        "Render the child element instead of a <button>, merging props/classes onto it.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the button.",
    },
    children: {
      control: "text",
      description: "Button label / content.",
    },
    onClick: { action: "clicked" },
  },
  args: {
    variant: "default",
    size: "default",
    disabled: false,
    children: "Apply pricing rule",
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/** Default primary button. */
export const Default: Story = {};

/** All variants side by side. */
export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-3">
      <Button {...args} variant="default">
        Default
      </Button>
      <Button {...args} variant="destructive">
        Destructive
      </Button>
      <Button {...args} variant="outline">
        Outline
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="link">
        Link
      </Button>
      <Button {...args} variant="card">
        Card
      </Button>
    </div>
  ),
};

/** All sizes side by side. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} size="xs">
        Extra small
      </Button>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="default">
        Default
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
      <Button {...args} size="icon" aria-label="Add SKU">
        <Plus />
      </Button>
    </div>
  ),
};

/** Button with a leading icon, common for export/download actions. */
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Download /> Export report
      </>
    ),
    variant: "outline",
  },
};

/** Disabled state - no pointer events, reduced opacity. */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Save changes",
  },
};

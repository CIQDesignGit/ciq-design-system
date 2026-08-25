import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Input } from "@/atoms/input";
import { Label } from "@/atoms/label";

const meta: Meta<typeof Input> = {
  title: "Atoms/Input",
  component: Input,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A styled, single-line text \`<input>\`. Forwards every native input attribute
(\`type\`, \`placeholder\`, \`disabled\`, \`required\`, \`readOnly\`, \`maxLength\`,
\`value\`, \`onChange\`, etc.) so it works as a drop-in replacement for a plain
\`<input>\` inside forms — campaign names, budget amounts, search fields, and so on.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "number", "email", "password", "search", "tel", "url"],
      description: "Native input type.",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text shown when the field is empty.",
    },
    defaultValue: {
      control: "text",
      description: "Initial (uncontrolled) value.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the field and applies muted styling.",
    },
    readOnly: {
      control: "boolean",
      description: "Prevents editing while keeping the field focusable/selectable.",
    },
    required: {
      control: "boolean",
      description: "Marks the field as required for native form validation.",
    },
    maxLength: {
      control: { type: "number", min: 1 },
      description: "Maximum number of characters allowed.",
    },
    value: { control: false },
    onChange: { control: false },
    className: { control: false },
  },
  args: {
    type: "text",
    placeholder: "Search ASIN or SKU...",
    disabled: false,
    readOnly: false,
    required: false,
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

/** Plain text input with a placeholder. */
export const Default: Story = {
  render: (args) => <Input {...args} onChange={fn()} />,
};

/** Pre-filled with an uncontrolled `defaultValue`. */
export const WithDefaultValue: Story = {
  args: {
    defaultValue: "B08XYZ1234",
    placeholder: undefined,
  },
  render: (args) => <Input {...args} onChange={fn()} />,
};

/** Numeric input for budgets, bids, or targets. */
export const NumberType: Story = {
  args: {
    type: "number",
    placeholder: "Enter daily budget",
  },
  render: (args) => <Input {...args} onChange={fn()} />,
};

/** Disabled field, e.g. a read-only campaign ID. */
export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "CMP-48213",
    placeholder: undefined,
  },
  render: (args) => <Input {...args} onChange={fn()} />,
};

/** Read-only field that can still be focused and selected/copied. */
export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: "amazon-us / sponsored-products",
    placeholder: undefined,
  },
  render: (args) => <Input {...args} onChange={fn()} />,
};

/** Paired with `Label` for a typical form field layout. */
export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-72 gap-1.5">
      <Label htmlFor="campaign-name">Campaign name</Label>
      <Input id="campaign-name" {...args} onChange={fn()} />
    </div>
  ),
  args: {
    placeholder: "Prime Day - Electronics",
  },
};

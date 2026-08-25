import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import { Checkbox } from "@/atoms/checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Atoms/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A Radix-based checkbox supporting checked, unchecked, indeterminate, and
disabled states. Used for row selection in data tables (e.g. selecting
multiple ASINs) and for boolean settings.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
      description: "Checked state (ignored when indeterminate is true).",
    },
    indeterminate: {
      control: "boolean",
      description:
        "Shows a dash instead of a checkmark, e.g. for a partially-selected group.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the checkbox.",
    },
    onCheckedChange: { action: "checked-changed" },
    className: {
      control: false,
      description: "Additional class names.",
    },
  },
  args: {
    checked: false,
    indeterminate: false,
    disabled: false,
    onCheckedChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

function InteractiveCheckboxDemo(args: NonNullable<Story["args"]>) {
  const [checked, setChecked] = useState<boolean>(Boolean(args.checked));
  return (
    <Checkbox
      {...args}
      checked={checked}
      onCheckedChange={(value) => {
        setChecked(value === true);
        args.onCheckedChange?.(value);
      }}
    />
  );
}

/** Interactive checkbox - toggling updates the checked state. */
export const Default: Story = {
  render: (args) => <InteractiveCheckboxDemo {...args} />,
};

/** Pre-checked. */
export const Checked: Story = {
  args: {
    checked: true,
  },
};

/** Indeterminate state for partial selection. */
export const Indeterminate: Story = {
  args: {
    indeterminate: true,
  },
};

/** Disabled and unchecked. */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

/** Disabled but checked. */
export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
  },
};

/** A group of row-selection checkboxes with a header "select all". */
export const SelectionGroup: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 text-sm font-medium">
        <Checkbox indeterminate />
        Select all (2 of 3 ASINs)
      </label>
      <div className="ml-4 flex flex-col gap-2 text-sm">
        <label className="flex items-center gap-2">
          <Checkbox checked /> B08XYZ1234 - Wireless Headphones
        </label>
        <label className="flex items-center gap-2">
          <Checkbox checked /> B09ABC5678 - Smart Watch Pro
        </label>
        <label className="flex items-center gap-2">
          <Checkbox /> B07DEF9012 - Running Shoes
        </label>
      </div>
    </div>
  ),
};

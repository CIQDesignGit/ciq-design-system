import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import { Switch } from "@/atoms/switch";

type ControlledSwitchProps = {
  readonly defaultChecked?: boolean;
  readonly disabled?: boolean;
  readonly onCheckedChange?: (checked: boolean) => void;
};

const ControlledSwitch = ({
  defaultChecked,
  disabled,
  onCheckedChange,
}: ControlledSwitchProps) => {
  const [checked, setChecked] = useState(!!defaultChecked);

  return (
    <Switch
      checked={checked}
      disabled={disabled}
      onCheckedChange={(next) => {
        setChecked(next);
        onCheckedChange?.(next);
      }}
    />
  );
};

const meta: Meta<typeof Switch> = {
  title: "Atoms/Switch",
  component: Switch,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A Radix-based on/off toggle switch. Use it for boolean settings such as enabling automated repricing or pausing a campaign.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disables interaction with the switch.",
    },
    required: {
      control: "boolean",
      description: "Marks the underlying form control as required.",
    },
    checked: { control: false },
    defaultChecked: { control: false },
    onCheckedChange: { control: false },
  },
  args: {
    disabled: false,
    required: false,
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

/** Unchecked by default, toggles interactively. */
export const Default: Story = {
  render: (args) => (
    <ControlledSwitch disabled={args.disabled} onCheckedChange={fn()} />
  ),
};

/** Pre-checked, e.g. "auto-repricing enabled". */
export const CheckedByDefault: Story = {
  render: (args) => (
    <ControlledSwitch
      disabled={args.disabled}
      defaultChecked
      onCheckedChange={fn()}
    />
  ),
};

/** Disabled while off. */
export const DisabledOff: Story = {
  render: () => <ControlledSwitch disabled onCheckedChange={fn()} />,
};

/** Disabled while on — e.g. a setting locked by plan tier. */
export const DisabledOn: Story = {
  render: () => (
    <ControlledSwitch disabled defaultChecked onCheckedChange={fn()} />
  ),
};

/** A labeled row, as it typically appears in a settings panel. */
export const WithLabel: Story = {
  render: () => (
    <label className="flex items-center gap-3 text-sm text-slate-700">
      <ControlledSwitch defaultChecked onCheckedChange={fn()} />
      Enable automated repricing for Amazon US
    </label>
  ),
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import { Toggle } from "@/atoms/toggle";

type ControlledToggleProps = {
  readonly defaultChecked?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly onCheckedChange?: (checked: boolean) => void;
};

const ControlledToggle = ({
  defaultChecked,
  disabled,
  className,
  onCheckedChange,
}: ControlledToggleProps) => {
  const [checked, setChecked] = useState(!!defaultChecked);

  return (
    <Toggle
      checked={checked}
      disabled={disabled}
      className={className}
      onCheckedChange={(next) => {
        setChecked(next);
        onCheckedChange?.(next);
      }}
    />
  );
};

const meta: Meta<typeof Toggle> = {
  title: "Atoms/Toggle",
  component: Toggle,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A compact, custom-built on/off switch (green when on) rendered as an ARIA `switch` button. Smaller footprint than `Switch` — used inline in dense rows.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disables interaction and dims the toggle.",
    },
    className: {
      control: "text",
      description: "Additional class names for the button.",
    },
    checked: { control: false },
    onCheckedChange: { control: false },
  },
  args: {
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

/** Off by default, toggles interactively. */
export const Default: Story = {
  render: (args) => (
    <ControlledToggle
      disabled={args.disabled}
      className={args.className}
      onCheckedChange={fn()}
    />
  ),
};

/** Pre-checked. */
export const CheckedByDefault: Story = {
  render: (args) => (
    <ControlledToggle
      disabled={args.disabled}
      className={args.className}
      defaultChecked
      onCheckedChange={fn()}
    />
  ),
};

/** Disabled while off. */
export const DisabledOff: Story = {
  render: () => <ControlledToggle disabled onCheckedChange={fn()} />,
};

/** Disabled while on. */
export const DisabledOn: Story = {
  render: () => (
    <ControlledToggle disabled defaultChecked onCheckedChange={fn()} />
  ),
};

/** Inline usage inside a table-cell-like row. */
export const InTableRow: Story = {
  render: () => (
    <div className="flex w-64 items-center justify-between rounded-md border px-3 py-2 text-sm">
      <span>SKU-7734 · Include in campaign</span>
      <ControlledToggle defaultChecked onCheckedChange={fn()} />
    </div>
  ),
};

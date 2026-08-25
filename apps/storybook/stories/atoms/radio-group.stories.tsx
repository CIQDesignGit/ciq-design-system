import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import { RadioGroup, RadioGroupItem } from "@/atoms/radio-group";

type RadioOption = { value: string; label: string; disabled?: boolean };

const RETAILER_OPTIONS: RadioOption[] = [
  { value: "amazon", label: "Amazon" },
  { value: "walmart", label: "Walmart" },
  { value: "target", label: "Target" },
  { value: "instacart", label: "Instacart" },
];

const CADENCE_OPTIONS: RadioOption[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const RETAILER_OPTIONS_WITH_DISABLED: RadioOption[] = [
  { value: "amazon", label: "Amazon" },
  { value: "walmart", label: "Walmart" },
  {
    value: "target",
    label: "Target (data sync in progress)",
    disabled: true,
  },
  { value: "instacart", label: "Instacart" },
];

type RadioGroupDemoArgs = {
  readonly options?: RadioOption[];
  readonly defaultValue?: string;
  readonly disabled?: boolean;
  readonly required?: boolean;
  readonly name?: string;
  readonly orientation?: "horizontal" | "vertical";
  readonly dir?: "ltr" | "rtl";
  readonly loop?: boolean;
  readonly onValueChange?: (value: string) => void;
};

const ControlledRadioGroup = ({
  options = RETAILER_OPTIONS,
  defaultValue,
  onValueChange,
  ...rootProps
}: RadioGroupDemoArgs) => {
  const [selected, setSelected] = useState(defaultValue ?? options[0]?.value);

  return (
    <RadioGroup
      {...rootProps}
      value={selected}
      onValueChange={(value) => {
        setSelected(value);
        onValueChange?.(value);
      }}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center gap-2 text-sm text-slate-700 data-[disabled]:opacity-50"
          htmlFor={`radio-${option.value}`}
        >
          <RadioGroupItem
            id={`radio-${option.value}`}
            value={option.value}
            disabled={option.disabled}
          />
          {option.label}
        </label>
      ))}
    </RadioGroup>
  );
};

const meta: Meta<typeof RadioGroup> = {
  title: "Atoms/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A Radix-based radio group for single-choice selections, such as picking a retailer or a
report cadence. Compose \`RadioGroup\` (the root) with one \`RadioGroupItem\` per option.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disables the entire group, preventing selection of any item.",
    },
    required: {
      control: "boolean",
      description: "Marks the group as required for form validation.",
    },
    name: {
      control: "text",
      description: "Name submitted with a parent form when the group is used inside one.",
    },
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      description: "Layout/keyboard-navigation orientation of the group.",
    },
    dir: {
      control: "inline-radio",
      options: ["ltr", "rtl"],
      description: "Reading direction, affects arrow-key navigation.",
    },
    loop: {
      control: "boolean",
      description:
        "Whether arrow-key navigation loops from the last item back to the first.",
    },
    value: { control: false },
    defaultValue: { control: false },
    onValueChange: { control: false },
    className: { control: false },
    children: { control: false },
  },
  args: {
    disabled: false,
    required: false,
    orientation: "vertical",
    dir: "ltr",
    loop: true,
    onValueChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

/** Choosing a retailer to scope a dashboard to. */
export const Default: Story = {
  render: (args) => (
    <ControlledRadioGroup {...args} options={RETAILER_OPTIONS} />
  ),
};

/** Choosing how often a report should run. */
export const ReportCadence: Story = {
  render: (args) => (
    <ControlledRadioGroup
      {...args}
      options={CADENCE_OPTIONS}
      defaultValue="weekly"
    />
  ),
};

/** One option disabled while its data sync is still in progress. */
export const WithDisabledOption: Story = {
  render: (args) => (
    <ControlledRadioGroup {...args} options={RETAILER_OPTIONS_WITH_DISABLED} />
  ),
};

/** Horizontal orientation, useful for compact toolbars. */
export const HorizontalOrientation: Story = {
  render: (args) => (
    <ControlledRadioGroup
      {...args}
      options={CADENCE_OPTIONS}
      orientation="horizontal"
    />
  ),
  args: { orientation: "horizontal" },
  decorators: [
    (Story) => (
      <div className="[&>div]:flex [&>div]:flex-row [&>div]:gap-4">
        <Story />
      </div>
    ),
  ],
};

/** The entire group disabled. */
export const DisabledGroup: Story = {
  render: (args) => (
    <ControlledRadioGroup {...args} options={RETAILER_OPTIONS} />
  ),
  args: { disabled: true },
};

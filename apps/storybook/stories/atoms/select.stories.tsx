import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/atoms/select";

const MARKETPLACES = [
  { value: "amazon-us", label: "Amazon US" },
  { value: "amazon-ca", label: "Amazon CA" },
  { value: "walmart-us", label: "Walmart US" },
  { value: "instacart", label: "Instacart" },
  { value: "target-plus", label: "Target Plus" },
];

const CADENCE_GROUPS = [
  {
    label: "Relative",
    options: [
      { value: "last7Days", label: "Last 7 days" },
      { value: "last30Days", label: "Last 30 days" },
      { value: "last90Days", label: "Last 90 days" },
    ],
  },
  {
    label: "Calendar",
    options: [
      { value: "thisMonth", label: "This month" },
      { value: "thisQuarter", label: "This quarter" },
      { value: "yearToDate", label: "Year to date" },
    ],
  },
];

type ControlledSelectProps = {
  readonly defaultValue?: string;
  readonly disabled?: boolean;
  readonly placeholder?: string;
  readonly triggerSize?: "sm" | "default";
  readonly onValueChange?: (value: string) => void;
};

const ControlledMarketplaceSelect = ({
  defaultValue,
  disabled,
  placeholder = "Select a marketplace...",
  triggerSize = "default",
  onValueChange,
}: ControlledSelectProps) => {
  const [value, setValue] = useState<string | undefined>(defaultValue);

  return (
    <Select
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onValueChange?.(next);
      }}
      disabled={disabled}
    >
      <SelectTrigger size={triggerSize} className="w-56">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {MARKETPLACES.map((marketplace) => (
          <SelectItem key={marketplace.value} value={marketplace.value}>
            {marketplace.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const meta: Meta<typeof Select> = {
  title: "Atoms/Select",
  component: Select,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A Radix-based single-select dropdown, composed from `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, `SelectGroup`, `SelectLabel`, and `SelectSeparator`.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disables the trigger and prevents opening the dropdown.",
    },
    required: {
      control: "boolean",
      description: "Marks the underlying form control as required.",
    },
    value: { control: false },
    defaultValue: { control: false },
    onValueChange: { control: false },
    open: { control: false },
    onOpenChange: { control: false },
    children: { control: false },
  },
  args: {
    disabled: false,
    required: false,
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

/** Basic single-select with a flat list of marketplaces. */
export const Default: Story = {
  render: (args) => (
    <ControlledMarketplaceSelect
      disabled={args.disabled}
      onValueChange={fn()}
    />
  ),
};

/** Pre-selected value passed in as `defaultValue`. */
export const WithDefaultValue: Story = {
  render: (args) => (
    <ControlledMarketplaceSelect
      disabled={args.disabled}
      defaultValue="walmart-us"
      onValueChange={fn()}
    />
  ),
};

/** Disabled select — trigger cannot be opened. */
export const Disabled: Story = {
  render: () => (
    <ControlledMarketplaceSelect
      disabled
      defaultValue="amazon-us"
      onValueChange={fn()}
    />
  ),
};

/** Compact trigger height for dense toolbars. */
export const SmallTrigger: Story = {
  render: (args) => (
    <ControlledMarketplaceSelect
      disabled={args.disabled}
      triggerSize="sm"
      placeholder="Marketplace"
      onValueChange={fn()}
    />
  ),
};

/** Grouped options with labels and a separator. */
export const GroupedOptions: Story = {
  render: () => {
    const GroupedSelect = () => {
      const [value, setValue] = useState("last7Days");
      return (
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Select cadence..." />
          </SelectTrigger>
          <SelectContent>
            {CADENCE_GROUPS.map((group, index) => (
              <SelectGroup key={group.label}>
                {index > 0 && <SelectSeparator />}
                <SelectLabel>{group.label}</SelectLabel>
                {group.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      );
    };
    return <GroupedSelect />;
  },
};

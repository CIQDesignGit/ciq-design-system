import type { Meta, StoryObj } from "@storybook/react-vite";
import { Store } from "lucide-react";
import type { ComponentProps } from "react";
import { useState } from "react";
import { fn } from "storybook/test";

import { MultiSelect, type MultiSelectOption } from "@/atoms/multi-select";

// MultiSelectProps isn't exported from multi-select-dropdown.tsx, so derive it from the component itself.
type MultiSelectProps = ComponentProps<typeof MultiSelect>;

// ============================================
// Mock Data
// ============================================

const RETAILER_OPTIONS: MultiSelectOption[] = [
  { value: "amazon", label: "Amazon" },
  { value: "walmart", label: "Walmart" },
  { value: "target", label: "Target" },
  { value: "instacart", label: "Instacart" },
  { value: "kroger", label: "Kroger" },
  { value: "costco", label: "Costco" },
];

const LARGE_OPTIONS: MultiSelectOption[] = Array.from({ length: 50 }, (_, i) => ({
  value: `sku-${String(i + 1).padStart(3, "0")}`,
  label: `SKU-${String(i + 1).padStart(3, "0")}`,
}));

const OPTIONS_WITH_DISABLED: MultiSelectOption[] = [
  { value: "amazon", label: "Amazon" },
  { value: "walmart", label: "Walmart" },
  { value: "target", label: "Target", disabled: true },
  { value: "instacart", label: "Instacart" },
  { value: "kroger", label: "Kroger", disabled: true },
];

// ============================================
// Controlled Wrapper
// ============================================

const ControlledMultiSelect = (props: MultiSelectProps) => {
  const initialSelected = props.selected ?? [];
  const [selected, setSelected] = useState<string[]>(initialSelected);

  const propsSelectedJson = JSON.stringify(props.selected ?? []);
  const [lastPropsSelected, setLastPropsSelected] = useState(propsSelectedJson);

  if (propsSelectedJson !== lastPropsSelected) {
    setLastPropsSelected(propsSelectedJson);
    setSelected(props.selected ?? []);
  }

  return (
    <MultiSelect
      {...props}
      options={props.options ?? []}
      selected={selected}
      onChange={(next) => {
        setSelected(next);
        props.onChange?.(next);
      }}
    />
  );
};

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof MultiSelect> = {
  title: "Atoms/MultiSelect",
  component: MultiSelect,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A multi-select dropdown built on the design system's DropdownMenu. Selected items render as removable
badges in the trigger (collapsing to "X & N more" past \`maxDisplayedItems\`), with an in-menu search box
and Select all / Clear all controls.
        `,
      },
    },
    a11y: {
      config: {
        rules: [
          // Pre-existing: DropdownMenu content contains input/button children under role="menu"
          { id: "aria-required-children", enabled: false },
        ],
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    options: { control: false }, // array of {value,label,disabled} objects — varied per story
    selected: { control: false }, // controlled internally by the story wrapper
    onChange: { action: "changed" },
    placeholder: {
      control: "text",
      description: "Text shown in the trigger when nothing is selected.",
    },
    className: {
      control: "text",
      description: "Class names applied to the trigger element.",
    },
    disabled: {
      control: "boolean",
      description: "Disable the trigger entirely.",
    },
    loading: {
      control: "boolean",
      description: "Show a loading spinner in place of selected items.",
    },
    maxDisplayedItems: {
      control: { type: "number", min: 1, max: 10 },
      description: "Number of selected badges shown before collapsing to '& N more'.",
    },
    label: {
      control: "text",
      description: "Declared on the component's props, but not currently rendered by MultiSelect.",
    },
    showSearch: {
      control: "boolean",
      description: "Show the search input at the top of the menu.",
    },
    icon: {
      control: false, // ReactNode rendered before the selected badges/placeholder
      description: "Icon rendered at the start of the trigger.",
    },
    container: {
      control: false, // DOM element used as the DropdownMenuContent portal target
      description: "Portal container override, used for rendering inside a shadow DOM host.",
    },
  },
  args: {
    options: RETAILER_OPTIONS,
    selected: [],
    placeholder: "Select retailers...",
    disabled: false,
    loading: false,
    maxDisplayedItems: 3,
    showSearch: true,
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

// ============================================
// Stories
// ============================================

/**
 * Use controls to explore all variations: change `options`/`selected` via the
 * story args, or toggle `disabled`, `loading`, and `showSearch`.
 */
export const Default: Story = {
  render: (args) => <ControlledMultiSelect {...args} />,
};

/** With a leading icon to reinforce what's being selected. */
export const WithIcon: Story = {
  render: (args) => <ControlledMultiSelect {...args} />,
  args: {
    icon: <Store className="h-4 w-4 text-muted-foreground" />,
    selected: ["amazon"],
  },
};

/** Large option list (50 SKUs) — exercises the scrollable menu and search filtering. */
export const LargeList: Story = {
  render: (args) => <ControlledMultiSelect {...args} />,
  args: {
    options: LARGE_OPTIONS,
    selected: [],
    placeholder: "Select SKUs...",
  },
};

/** Some options are disabled and cannot be toggled or included in Select all. */
export const WithDisabledOptions: Story = {
  render: (args) => <ControlledMultiSelect {...args} />,
  args: {
    options: OPTIONS_WITH_DISABLED,
    selected: [],
  },
};

/** Multiple pre-selected retailers, shown as individual removable badges. */
export const WithPreselection: Story = {
  render: (args) => <ControlledMultiSelect {...args} />,
  args: {
    selected: ["amazon", "walmart"],
  },
};

/** More selections than `maxDisplayedItems` collapse into a single "& N more" badge. */
export const TruncatedSelection: Story = {
  render: (args) => <ControlledMultiSelect {...args} />,
  args: {
    selected: ["amazon", "walmart", "target", "instacart"],
    maxDisplayedItems: 2,
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { screen } from "@testing-library/dom";
import { ShoppingCart, Tag, Users } from "lucide-react";
import { useState } from "react";
import { expect, fn } from "storybook/test";

import {
  DropdownMultiSelect,
  type DropdownMultiSelectOption,
  type DropdownMultiSelectProps,
} from "@/molecules/dropdown-multi-select";

// ============================================
// Options Data
// ============================================

const CATEGORY_OPTIONS: DropdownMultiSelectOption[] = [
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "food", label: "Food & Beverages" },
  { value: "home", label: "Home & Garden" },
  { value: "sports", label: "Sports & Outdoors" },
  { value: "books", label: "Books & Media" },
  { value: "toys", label: "Toys & Games" },
  { value: "health", label: "Health & Beauty" },
];

const USER_OPTIONS: DropdownMultiSelectOption[] = [
  { value: "john", label: "John Smith" },
  { value: "jane", label: "Jane Doe" },
  { value: "bob", label: "Bob Johnson" },
  { value: "alice", label: "Alice Williams" },
  { value: "charlie", label: "Charlie Brown" },
];

const LARGE_OPTIONS: DropdownMultiSelectOption[] = Array.from({ length: 50 }, (_, i) => ({
  value: `option-${i + 1}`,
  label: `Option ${i + 1}`,
}));

const OPTIONS_WITH_DISABLED: DropdownMultiSelectOption[] = [
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing", disabled: true },
  { value: "food", label: "Food & Beverages" },
  { value: "home", label: "Home & Garden", disabled: true },
  { value: "sports", label: "Sports & Outdoors" },
];

// ============================================
// Controlled Wrapper
// ============================================

const ControlledDropdownMultiSelect = (props: DropdownMultiSelectProps) => {
  const initialSelected = props.selected ?? [];
  const [selected, setSelected] = useState<string[]>(initialSelected);

  const propsSelectedJson = JSON.stringify(props.selected ?? []);
  const [lastPropsSelected, setLastPropsSelected] = useState(propsSelectedJson);

  if (propsSelectedJson !== lastPropsSelected) {
    setLastPropsSelected(propsSelectedJson);
    setSelected(props.selected ?? []);
  }

  return (
    <DropdownMultiSelect
      {...props}
      options={props.options ?? []}
      selected={selected}
      onChange={(newSelected) => {
        setSelected(newSelected);
        props.onChange?.(newSelected);
      }}
    />
  );
};

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof DropdownMultiSelect> = {
  title: "Molecules/DropdownMultiSelect",
  component: DropdownMultiSelect,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A multi-select dropdown. Use controls to explore:
- **options**: Switch between option sets (categories, users, large list)
- **selected**: Change pre-selected values
- **disabled / loading**: Toggle states
- **placeholder / labels**: Customize text
        `,
      },
    },
    a11y: {
      config: {
        rules: [
          { id: "aria-hidden-focus", enabled: false },
          // Pre-existing: Radix DropdownMenu with role="menu" contains input/button children
          { id: "aria-required-children", enabled: false },
        ],
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    searchPlaceholder: {
      control: "text",
      description: "Search input placeholder",
    },
    disabled: {
      control: "boolean",
      description: "Disable the dropdown",
    },
    loading: {
      control: "boolean",
      description: "Show loading state",
    },
    align: {
      control: "inline-radio",
      options: ["start", "center", "end"],
      description: "Dropdown alignment",
    },
    maxLabelLength: {
      control: { type: "number", min: 5, max: 50 },
      description: "Max label length before truncation",
    },
    onChange: { action: "changed" },
    // Non-controllable - use separate stories for variations
    options: { control: false },
    selected: { control: false },
    icon: { control: false },
    selectedCountText: { control: false },
  },
  args: {
    options: CATEGORY_OPTIONS,
    selected: [],
    placeholder: "Select categories...",
    disabled: false,
    loading: false,
    align: "start",
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof DropdownMultiSelect>;

// ============================================
// Main Story
// ============================================

/**
 * Use controls to explore all variations:
 * - Change `options` to switch between data sets
 * - Adjust `selected` to see different selection states
 * - Toggle `disabled` and `loading`
 */
export const Default: Story = {
  render: (args) => <ControlledDropdownMultiSelect {...args} />,
};

// ============================================
// Icon Variations (need separate stories)
// ============================================

/** With Users icon for team member selection. */
export const WithUsersIcon: Story = {
  render: (args) => <ControlledDropdownMultiSelect {...args} />,
  args: {
    options: USER_OPTIONS,
    selected: ["john"],
    placeholder: "Select team members...",
    icon: <Users className="h-4 w-4" />,
  },
};

/** With Tag icon for label selection. */
export const WithTagIcon: Story = {
  render: (args) => <ControlledDropdownMultiSelect {...args} />,
  args: {
    options: CATEGORY_OPTIONS,
    selected: ["electronics"],
    placeholder: "Select tags...",
    icon: <Tag className="h-4 w-4" />,
  },
};

/** With Cart icon for product selection. */
export const WithCartIcon: Story = {
  render: (args) => <ControlledDropdownMultiSelect {...args} />,
  args: {
    options: CATEGORY_OPTIONS,
    selected: ["electronics", "clothing"],
    placeholder: "Select products...",
    icon: <ShoppingCart className="h-4 w-4" />,
  },
};

// ============================================
// Data Variations
// ============================================

/** Large list with 50 options - tests virtualization/scroll. */
export const LargeList: Story = {
  render: (args) => <ControlledDropdownMultiSelect {...args} />,
  args: {
    options: LARGE_OPTIONS,
    selected: [],
    placeholder: "Select from 50 options...",
  },
};

/** Options with some disabled items. */
export const WithDisabledOptions: Story = {
  render: (args) => <ControlledDropdownMultiSelect {...args} />,
  args: {
    options: OPTIONS_WITH_DISABLED,
    selected: [],
    placeholder: "Some options disabled...",
  },
};

/** Pre-selected multiple items. */
export const WithPreselection: Story = {
  render: (args) => <ControlledDropdownMultiSelect {...args} />,
  args: {
    options: CATEGORY_OPTIONS,
    selected: ["electronics", "clothing", "food"],
    placeholder: "Select categories...",
  },
};

// ============================================
// Interaction Tests
// ============================================

/**
 * Test: Opens dropdown and shows content.
 * Note: Dropdown content renders in a portal, so we use `screen` to query it.
 */
export const InteractionOpenDropdown: Story = {
  render: (args) => <ControlledDropdownMultiSelect {...args} />,
  args: { options: CATEGORY_OPTIONS, selected: [], onChange: fn() },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button");
    await userEvent.click(trigger);
    // Portal content - use screen
    await expect(screen.findByText("Select all")).resolves.toBeInTheDocument();
  },
};

/**
 * Test: Search filters options.
 */
export const InteractionSearch: Story = {
  render: (args) => <ControlledDropdownMultiSelect {...args} />,
  args: { options: CATEGORY_OPTIONS, selected: [], onChange: fn() },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button");
    await userEvent.click(trigger);

    // Portal content - use screen
    const searchInput = await screen.findByPlaceholderText("Search...");
    await userEvent.type(searchInput, "elec");

    await expect(screen.findByText("Electronics")).resolves.toBeInTheDocument();
    expect(screen.queryByText("Clothing")).not.toBeInTheDocument();
  },
};

/**
 * Test: Select and save.
 */
export const InteractionSelectAndSave: Story = {
  render: (args) => <ControlledDropdownMultiSelect {...args} />,
  args: { options: CATEGORY_OPTIONS, selected: [], onChange: fn() },
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole("button");
    await userEvent.click(trigger);

    // Portal content - use screen
    const electronicsOption = await screen.findByText("Electronics");
    await userEvent.click(electronicsOption);

    const saveButton = screen.getByRole("button", { name: /Save/i });
    await userEvent.click(saveButton);

    await expect(args.onChange).toHaveBeenCalledWith(["electronics"]);
  },
};

/**
 * Test: Select all functionality.
 */
export const InteractionSelectAll: Story = {
  render: (args) => <ControlledDropdownMultiSelect {...args} />,
  args: { options: CATEGORY_OPTIONS, selected: [], onChange: fn() },
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole("button");
    await userEvent.click(trigger);

    // Portal content - use screen
    const selectAllLabel = await screen.findByText("Select all");
    await userEvent.click(selectAllLabel);

    const saveButton = screen.getByRole("button", { name: /Save/i });
    await userEvent.click(saveButton);

    await expect(args.onChange).toHaveBeenCalledWith(CATEGORY_OPTIONS.map((opt) => opt.value));
  },
};

// ============================================
// Visual Regression Snapshots
// ============================================

/** Snapshot: Empty state */
export const SnapshotEmpty: Story = {
  args: { options: CATEGORY_OPTIONS, selected: [] },
  parameters: { chromatic: { disableSnapshot: false } },
};

/** Snapshot: With selections */
export const SnapshotWithSelections: Story = {
  args: { options: CATEGORY_OPTIONS, selected: ["electronics", "clothing"] },
  parameters: { chromatic: { disableSnapshot: false } },
};

/** Snapshot: Disabled state */
export const SnapshotDisabled: Story = {
  args: { options: CATEGORY_OPTIONS, selected: ["electronics"], disabled: true },
  parameters: { chromatic: { disableSnapshot: false } },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { useState } from "react";
import { fn } from "storybook/test";

import { Button } from "@/atoms/button";

import { OrderedMultiSelect, type OrderedMultiSelectOption } from "@/atoms/ordered-multi-select";

// ============================================
// Mock Data
// ============================================

const DIMENSION_OPTIONS: OrderedMultiSelectOption[] = [
  { value: "asin", label: "ASIN" },
  { value: "campaign", label: "Campaign" },
  { value: "ad_group", label: "Ad Group" },
  { value: "keyword", label: "Keyword" },
  { value: "retailer", label: "Retailer" },
  { value: "category", label: "Category" },
  { value: "placement", label: "Placement" },
  { value: "date", label: "Date" },
];

// ============================================
// Controlled Wrapper
// ============================================

type WrapperProps = ComponentProps<typeof OrderedMultiSelect>;

const ControlledOrderedMultiSelect = (props: WrapperProps) => {
  const initialSelected = props.selected ?? [];
  const [selected, setSelected] = useState<string[]>(initialSelected);

  const propsSelectedJson = JSON.stringify(props.selected ?? []);
  const [lastPropsSelected, setLastPropsSelected] = useState(propsSelectedJson);

  if (propsSelectedJson !== lastPropsSelected) {
    setLastPropsSelected(propsSelectedJson);
    setSelected(props.selected ?? []);
  }

  return (
    <OrderedMultiSelect
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

const meta: Meta<typeof OrderedMultiSelect> = {
  title: "Atoms/OrderedMultiSelect",
  component: OrderedMultiSelect,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A multi-select that lets users pick and then drag-reorder the selected items — for example, choosing and
ordering report dimensions (ASIN, Campaign, Retailer, etc.). Selected items appear as a draggable list
(via \`@dnd-kit\`) above an "Add dimension" control that opens a checkbox picker in a popover.
Set \`inline\` to render the picker directly without the popover wrapper.
        `,
      },
    },
    a11y: {
      config: {
        rules: [
          // Pre-existing: drag handles rely on pointer/keyboard sensors, not always exposed via role
          { id: "aria-required-children", enabled: false },
        ],
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    options: { control: false }, // ReadonlyArray<{value,label}> — varied per story
    selected: { control: false }, // controlled internally by the story wrapper; order reflects drag-and-drop
    onChange: { action: "reordered" },
    maxSelections: {
      control: { type: "number", min: 1, max: 8 },
      description: "Maximum number of items that can be selected at once.",
    },
    showIndex: {
      control: "boolean",
      description: "Show numbered badges (1, 2, 3...) on each selected item.",
    },
    minSelections: {
      control: { type: "number", min: 0, max: 4 },
      description: "Minimum items that must remain selected — blocks removal below this count.",
    },
    placeholder: {
      control: "text",
      description: "Label shown on the 'Add dimension' trigger when nothing is selected.",
    },
    inline: {
      control: "boolean",
      description: "Render the sortable list and picker directly, without a popover wrapper.",
    },
    trigger: {
      control: false, // custom ReactNode trigger element; ignored when inline
      description: "Custom trigger element for popover mode. Ignored when `inline` is true.",
    },
    align: {
      control: "inline-radio",
      options: ["start", "center", "end"],
      description: "Popover alignment relative to the trigger. Ignored when `inline` is true.",
    },
  },
  args: {
    options: DIMENSION_OPTIONS,
    selected: ["asin", "campaign"],
    maxSelections: 4,
    showIndex: true,
    minSelections: 0,
    placeholder: "Select dimensions…",
    inline: false,
    align: "start",
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof OrderedMultiSelect>;

// ============================================
// Stories
// ============================================

/**
 * Default popover mode. Open the "Add dimension" trigger to pick dimensions, then
 * drag the selected rows to reorder them.
 */
export const Default: Story = {
  render: (args) => <ControlledOrderedMultiSelect {...args} />,
};

/** `inline` renders the sortable list and checkbox picker directly, without the popover. */
export const Inline: Story = {
  render: (args) => <ControlledOrderedMultiSelect {...args} />,
  args: {
    inline: true,
    selected: ["asin", "campaign", "retailer"],
  },
};

/** A custom trigger element replaces the default "Add dimension" button in popover mode. */
export const WithCustomTrigger: Story = {
  render: (args) => <ControlledOrderedMultiSelect {...args} />,
  args: {
    selected: ["asin"],
    trigger: (
      <Button variant="outline" size="sm">
        Customize report dimensions
      </Button>
    ),
  },
};

/** At `maxSelections`, the add control disables and shows a "N dimensions selected" label. */
export const LimitReached: Story = {
  render: (args) => <ControlledOrderedMultiSelect {...args} />,
  args: {
    maxSelections: 3,
    selected: ["asin", "campaign", "retailer"],
  },
};

/** `minSelections` locks the remove button once the count drops to the minimum. */
export const MinSelectionsEnforced: Story = {
  render: (args) => <ControlledOrderedMultiSelect {...args} />,
  args: {
    inline: true,
    minSelections: 2,
    selected: ["asin", "campaign"],
  },
};

/** `showIndex={false}` hides the numbered badges on each selected row. */
export const WithoutIndex: Story = {
  render: (args) => <ControlledOrderedMultiSelect {...args} />,
  args: {
    inline: true,
    showIndex: false,
    selected: ["asin", "campaign", "keyword"],
  },
};

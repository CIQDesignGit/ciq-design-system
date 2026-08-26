import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import { Button } from "@/atoms/button";
import {
  type FilterColumn,
  FilterModal,
  type FilterModalProps,
  type FilterValue,
} from "@/atoms/filter-modal";

// ============================================
// Mock Data
// ============================================

const COLUMNS: FilterColumn[] = [
  { id: "category", label: "Category", field: "category" },
  { id: "marketplace", label: "Marketplace", field: "marketplace" },
  { id: "brand", label: "Brand", field: "brand" },
  { id: "fulfillment", label: "Fulfillment type", field: "fulfillment" },
];

const VALUES_BY_COLUMN: Record<string, FilterValue[]> = {
  category: [
    { id: "electronics", label: "Electronics", value: "electronics" },
    { id: "home", label: "Home & Garden", value: "home" },
    { id: "sports", label: "Sports & Outdoors", value: "sports" },
  ],
  marketplace: [
    { id: "amazon-com", label: "Amazon.com", value: "amazon.com" },
    { id: "amazon-ca", label: "Amazon.ca", value: "amazon.ca" },
    { id: "walmart-com", label: "Walmart.com", value: "walmart.com" },
  ],
  brand: [
    { id: "acme", label: "Acme Audio", value: "acme" },
    { id: "northtrail", label: "NorthTrail Outdoors", value: "northtrail" },
    { id: "homely", label: "Homely Living", value: "homely" },
  ],
};

function getValuesForColumn(columnId: string): FilterValue[] {
  return VALUES_BY_COLUMN[columnId] ?? [];
}

// ============================================
// Controlled Wrapper
// ============================================

const ControlledFilterModal = (props: FilterModalProps) => {
  const [isOpen, setIsOpen] = useState(props.isOpen);

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        Open filter modal
      </Button>
      <FilterModal
        {...props}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          props.onClose();
        }}
        onApply={(column, values) => {
          setIsOpen(false);
          props.onApply(column, values);
        }}
      />
    </>
  );
};

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof FilterModal> = {
  title: "Atoms/FilterModal",
  component: FilterModal,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A two-pane modal for building a single-column filter: pick a column on the
left, then pick one or more values for that column on the right. Used for
ad-hoc table filtering across product and campaign tables.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Whether the modal is visible.",
    },
    onClose: { action: "closed" },
    onApply: { action: "applied" },
    columns: {
      control: false, // array of FilterColumn objects, set per story
      description: "Columns available to filter on, shown in the left pane.",
    },
    values: {
      control: false, // array of FilterValue objects
      description: "Static values for the right pane (ignored if getValuesForColumn is provided).",
    },
    getValuesForColumn: {
      control: false, // callback returning values dynamically per selected column
      description: "Resolves the right-pane values based on the selected column.",
    },
    selectedColumnId: {
      control: "text",
      description: "Initially selected column id.",
    },
    selectedValueIds: {
      control: false, // array of string ids
      description: "Initially selected value ids for the selected column.",
    },
    title: {
      control: "text",
      description: "Modal header title.",
    },
    columnSearchPlaceholder: {
      control: "text",
      description: "Placeholder for the column search input.",
    },
    valueSearchPlaceholder: {
      control: "text",
      description: "Placeholder for the value search input.",
    },
    columnsLabel: {
      control: "text",
      description: "Label above the columns list.",
    },
    valuesLabel: {
      control: "text",
      description: "Label above the values list (before a column is selected).",
    },
  },
  args: {
    isOpen: true,
    columns: COLUMNS,
    getValuesForColumn,
    selectedColumnId: null,
    selectedValueIds: [],
    title: "Filter Option",
    columnSearchPlaceholder: "Search Column",
    valueSearchPlaceholder: "Search SKUs",
    columnsLabel: "Columns",
    valuesLabel: "Values",
    onClose: fn(),
    onApply: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof FilterModal>;

// ============================================
// Stories
// ============================================

/**
 * Click "Open filter modal" to see it - starts with no column selected.
 */
export const Default: Story = {
  render: (args) => <ControlledFilterModal {...args} isOpen={false} />,
};

/** Modal always open, no column selected yet - right pane prompts to pick a column. */
export const NoColumnSelected: Story = {
  args: {
    isOpen: true,
  },
};

/** A column is pre-selected with some values already checked. */
export const WithPreselection: Story = {
  args: {
    isOpen: true,
    selectedColumnId: "category",
    selectedValueIds: ["electronics", "sports"],
  },
};

/** A selected column with no available values - shows the "no values found" empty state. */
export const NoValuesForColumn: Story = {
  args: {
    isOpen: true,
    selectedColumnId: "fulfillment",
    selectedValueIds: [],
  },
};

/** Custom labels for a different table context. */
export const CustomLabels: Story = {
  args: {
    isOpen: true,
    title: "Filter campaigns",
    columnsLabel: "Fields",
    valuesLabel: "Options",
    columnSearchPlaceholder: "Search fields",
    valueSearchPlaceholder: "Search options",
    selectedColumnId: "marketplace",
    selectedValueIds: ["amazon-com"],
  },
};

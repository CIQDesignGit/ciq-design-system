import type { Meta, StoryObj } from "@storybook/react-vite";
import { screen } from "@testing-library/dom";
import { useState } from "react";
import { expect, fn } from "storybook/test";

import { DateRangePicker } from "@/molecules/date-range-picker";
import type { DateRangePickerValue } from "@/molecules/date-range-picker";

// ============================================
// Value Presets
// ============================================

const TODAY = new Date();
const WEEK_AGO = new Date(TODAY.getTime() - 7 * 24 * 60 * 60 * 1000);
const MONTH_AGO = new Date(TODAY.getTime() - 30 * 24 * 60 * 60 * 1000);
const TWO_WEEKS_AGO = new Date(TODAY.getTime() - 14 * 24 * 60 * 60 * 1000);

const VALUE_PRESETS = {
  none: undefined,
  last7Days: { range: { from: WEEK_AGO, to: TODAY }, cadence: "last7Days" } as DateRangePickerValue,
  last30Days: {
    range: { from: MONTH_AGO, to: TODAY },
    cadence: "last30Days",
  } as DateRangePickerValue,
  withCompare: {
    range: { from: WEEK_AGO, to: TODAY },
    compareRange: { from: TWO_WEEKS_AGO, to: WEEK_AGO },
    cadence: "last7Days",
    compareCadence: "previousPeriod",
  } as DateRangePickerValue,
  customRange: {
    range: { from: new Date(2025, 0, 1), to: new Date(2025, 0, 31) },
    cadence: "custom",
  } as DateRangePickerValue,
};

// ============================================
// Controlled Wrapper
// ============================================

const ControlledDateRangePicker = (props: React.ComponentProps<typeof DateRangePicker>) => {
  const [value, setValue] = useState<DateRangePickerValue | undefined>(props.value);

  const propsValueJson = JSON.stringify(props.value);
  const [lastPropsValue, setLastPropsValue] = useState(propsValueJson);

  if (propsValueJson !== lastPropsValue) {
    setLastPropsValue(propsValueJson);
    setValue(props.value);
  }

  return (
    <DateRangePicker
      {...props}
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
        props.onChange?.(newValue);
      }}
    />
  );
};

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof DateRangePicker> = {
  title: "Molecules/DateRangePicker",
  component: DateRangePicker,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A date range picker. Use controls to explore:
- **value**: Select preset date ranges
- **showCompare**: Toggle comparison feature
- **numberOfMonths**: Change calendar display (1-3)
- **dateFormat**: Switch date display format
- **disabled**: Toggle disabled state
        `,
      },
    },
    a11y: {
      config: {
        rules: [
          { id: "aria-hidden-focus", enabled: false },
          // Pre-existing component issues
          { id: "button-name", enabled: false },
          { id: "aria-dialog-name", enabled: false },
          { id: "color-contrast", enabled: false },
        ],
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "select",
      options: ["none", "last7Days", "last30Days", "withCompare", "customRange"],
      mapping: VALUE_PRESETS,
      description: "Selected date range",
    },
    showCompare: {
      control: "boolean",
      description: "Show compare range feature",
    },
    numberOfMonths: {
      control: { type: "number", min: 1, max: 3 },
      description: "Number of months to display",
    },
    dateFormat: {
      control: "select",
      options: ["MMM DD, YYYY", "DD/MM/YYYY", "YYYY-MM-DD", "MM/DD/YYYY"],
      description: "Date display format",
    },
    align: {
      control: "inline-radio",
      options: ["start", "center", "end"],
      description: "Popover alignment",
    },
    disabled: {
      control: "boolean",
      description: "Disable the picker",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    onChange: { action: "changed" },
    // Non-controllable
    allowedCadences: { control: false },
    allowedCompareCadences: { control: false },
    presets: { control: false },
    comparePresets: { control: false },
    minDate: { control: false },
    maxDate: { control: false },
    trigger: { control: false },
    weekDays: { control: false },
  },
  args: {
    showCompare: true,
    numberOfMonths: 2,
    disabled: false,
    align: "start",
    dateFormat: "MMM DD, YYYY",
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

// ============================================
// Main Story
// ============================================

/**
 * Use controls to explore all variations:
 * - Change `value` to see different date states
 * - Toggle `showCompare` for comparison mode
 * - Adjust `numberOfMonths` and `dateFormat`
 * - Change `align` to see popover position (start/center/end)
 */
export const Default: Story = {
  render: (args) => (
    <div className="flex w-full">
      <ControlledDateRangePicker {...args} />
    </div>
  ),
};

// ============================================
// Interaction Tests
// ============================================

/**
 * Test: Opens picker and displays content.
 * Note: Popover content renders in a portal, so we use `screen` to query it.
 */
export const InteractionOpenPicker: Story = {
  args: { showCompare: true, onChange: fn() },
  play: async ({ canvas, userEvent }) => {
    const triggerButton = canvas.getByRole("button");
    await userEvent.click(triggerButton);
    // Portal content - use screen
    await expect(screen.findByText("Date Range")).resolves.toBeInTheDocument();
  },
};

/**
 * Test: Verifies Apply button is visible when picker is open.
 */
export const InteractionApplyVisible: Story = {
  render: (args) => <ControlledDateRangePicker {...args} />,
  args: { value: VALUE_PRESETS.last7Days, showCompare: false, onChange: fn() },
  play: async ({ canvas, userEvent }) => {
    const triggerButton = canvas.getByRole("button");
    await userEvent.click(triggerButton);
    // Portal content - use screen
    await expect(screen.findByText("Date Range")).resolves.toBeInTheDocument();

    // Verify Apply button exists
    const applyButton = await screen.findByRole("button", { name: /Apply/i });
    await expect(applyButton).toBeInTheDocument();
  },
};

// ============================================
// Visual Regression Snapshots
// ============================================

/** Snapshot: Empty state */
export const SnapshotEmpty: Story = {
  parameters: { chromatic: { disableSnapshot: false } },
};

/** Snapshot: With selected range */
export const SnapshotWithRange: Story = {
  args: { value: VALUE_PRESETS.last7Days },
  parameters: { chromatic: { disableSnapshot: false } },
};

/** Snapshot: Disabled state */
export const SnapshotDisabled: Story = {
  args: { value: VALUE_PRESETS.last7Days, disabled: true },
  parameters: { chromatic: { disableSnapshot: false } },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { fn } from "storybook/test";

import { Calendar } from "@/atoms/calendar";

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof Calendar> = {
  title: "Atoms/Calendar",
  component: Calendar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A date picker built on \`react-day-picker\`, used for choosing report date
ranges (e.g. "last 7 days" custom overrides) or scheduling a Sales Agent
action. Supports single date, multiple date, and range selection modes.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    mode: {
      control: "inline-radio",
      options: ["single", "multiple", "range"],
      description: "Selection mode.",
    },
    showOutsideDays: {
      control: "boolean",
      description: "Show days from adjacent months to fill the grid.",
    },
    captionLayout: {
      control: "inline-radio",
      options: ["label", "dropdown", "dropdown-months", "dropdown-years"],
      description: "How the month/year caption is displayed.",
    },
    buttonVariant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link", "card"],
      description: "Button variant used for the prev/next navigation buttons.",
    },
    disabled: {
      control: false, // matcher function/array, not a simple control value
      description: "Dates (or matcher) to disable for selection.",
    },
    selected: {
      control: false, // shape depends on mode (Date | Date[] | DateRange)
      description: "Currently selected date(s). Managed per-story via a controlled wrapper.",
    },
    onSelect: { action: "selected" },
  },
  args: {
    mode: "single",
    showOutsideDays: false,
    captionLayout: "label",
    onSelect: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

// ============================================
// Story Demo Wrappers
// ============================================

type ArgsOf = Story["args"];

function SingleSelectDemo(args: ArgsOf) {
  const [selected, setSelected] = useState<Date | undefined>(new Date(2026, 7, 4));
  return (
    <Calendar
      showOutsideDays={args?.showOutsideDays}
      captionLayout={args?.captionLayout}
      buttonVariant={args?.buttonVariant}
      mode="single"
      selected={selected}
      onSelect={(date) => {
        setSelected(date);
      }}
    />
  );
}

function RangeSelectDemo(args: ArgsOf) {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2026, 6, 28),
    to: new Date(2026, 7, 4),
  });
  return (
    <Calendar
      showOutsideDays={args?.showOutsideDays}
      captionLayout={args?.captionLayout}
      buttonVariant={args?.buttonVariant}
      mode="range"
      selected={range}
      onSelect={(value) => {
        setRange(value);
      }}
    />
  );
}

function MultipleSelectDemo(args: ArgsOf) {
  const [dates, setDates] = useState<Date[] | undefined>([
    new Date(2026, 7, 3),
    new Date(2026, 7, 5),
    new Date(2026, 7, 10),
  ]);
  return (
    <Calendar
      showOutsideDays={args?.showOutsideDays}
      captionLayout={args?.captionLayout}
      buttonVariant={args?.buttonVariant}
      mode="multiple"
      selected={dates}
      onSelect={(value) => {
        setDates(value);
      }}
    />
  );
}

function DropdownCaptionDemo(args: ArgsOf) {
  const [selected, setSelected] = useState<Date | undefined>(new Date(2026, 7, 4));
  return (
    <Calendar
      showOutsideDays={args?.showOutsideDays}
      buttonVariant={args?.buttonVariant}
      mode="single"
      captionLayout="dropdown"
      selected={selected}
      onSelect={(date) => {
        setSelected(date);
      }}
    />
  );
}

function DisabledDatesDemo(args: ArgsOf) {
  const [selected, setSelected] = useState<Date | undefined>(undefined);
  return (
    <Calendar
      showOutsideDays={args?.showOutsideDays}
      captionLayout={args?.captionLayout}
      buttonVariant={args?.buttonVariant}
      mode="single"
      disabled={{ before: new Date(2026, 7, 4) }}
      selected={selected}
      onSelect={(date) => {
        setSelected(date);
      }}
    />
  );
}

// ============================================
// Stories
// ============================================

/** Single-date selection, e.g. picking a report "as of" date. */
export const Default: Story = {
  render: (args) => <SingleSelectDemo {...args} />,
};

/** Range selection, e.g. a custom date range for a performance report. */
export const RangeSelection: Story = {
  render: (args) => <RangeSelectDemo {...args} />,
};

/** Multiple, non-contiguous dates selected - e.g. scheduling recurring exports. */
export const MultipleSelection: Story = {
  render: (args) => <MultipleSelectDemo {...args} />,
};

/** Dropdown caption for fast month/year navigation. */
export const DropdownCaption: Story = {
  render: (args) => <DropdownCaptionDemo {...args} />,
};

/** Past dates disabled - common for "select a future run date" pickers. */
export const WithDisabledDates: Story = {
  render: (args) => <DisabledDatesDemo {...args} />,
};

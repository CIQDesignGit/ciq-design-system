import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import { Textarea } from "@/atoms/textarea";

type ControlledTextareaProps = {
  readonly defaultValue?: string;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly rows?: number;
  readonly onChange?: (value: string) => void;
};

const ControlledTextarea = ({
  defaultValue = "",
  placeholder,
  disabled,
  rows,
  onChange,
}: ControlledTextareaProps) => {
  const [value, setValue] = useState(defaultValue);

  return (
    <Textarea
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      className="w-96"
      onChange={(event) => {
        setValue(event.target.value);
        onChange?.(event.target.value);
      }}
    />
  );
};

const meta: Meta<typeof Textarea> = {
  title: "Atoms/Textarea",
  component: Textarea,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A styled multi-line text input built on the native `<textarea>`. Used for longer free-text fields such as product descriptions, review responses, or campaign notes.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text shown when empty.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the textarea.",
    },
    rows: {
      control: { type: "number", min: 2, max: 12 },
      description: "Number of visible text rows.",
    },
    value: { control: false },
    defaultValue: { control: false },
    onChange: { control: false },
  },
  args: {
    placeholder: "Write a product description...",
    disabled: false,
    rows: 4,
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

/** Empty textarea, ready for input. */
export const Default: Story = {
  render: (args) => (
    <ControlledTextarea
      placeholder={args.placeholder}
      disabled={args.disabled}
      rows={args.rows}
      onChange={fn()}
    />
  ),
};

/** Pre-filled with existing product copy. */
export const WithContent: Story = {
  render: (args) => (
    <ControlledTextarea
      defaultValue="Yankee Candle's Large Jar Candle delivers up to 150 hours of long-lasting fragrance. Perfect for gifting or refreshing any room in your home."
      disabled={args.disabled}
      rows={args.rows}
      onChange={fn()}
    />
  ),
};

/** Disabled state. */
export const Disabled: Story = {
  render: () => (
    <ControlledTextarea
      defaultValue="This field is locked while Content Agent generates a new description."
      disabled
      onChange={fn()}
    />
  ),
};

/** A taller textarea for longer-form content. */
export const TallerRows: Story = {
  render: () => (
    <ControlledTextarea
      rows={8}
      placeholder="Paste full listing copy..."
      onChange={fn()}
    />
  ),
};

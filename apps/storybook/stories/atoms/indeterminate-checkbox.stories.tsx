import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import { IndeterminateCheckbox } from "@/atoms/indeterminate-checkbox";

const SKU_ROWS = [
  { id: "SKU-001", name: "Wireless Headphones" },
  { id: "SKU-002", name: "Smart Watch Pro" },
  { id: "SKU-003", name: "Running Shoes" },
  { id: "SKU-004", name: "Coffee Maker" },
  { id: "SKU-005", name: "Yoga Mat" },
];

type ControlledCheckboxProps = {
  readonly checked?: boolean;
  readonly indeterminate?: boolean;
  readonly disabled?: boolean;
  readonly onChange?: (checked: boolean) => void;
};

const ControlledIndeterminateCheckbox = ({
  checked: initialChecked = false,
  indeterminate = false,
  disabled = false,
  onChange,
}: ControlledCheckboxProps) => {
  const [checked, setChecked] = useState(initialChecked);

  return (
    <IndeterminateCheckbox
      checked={checked}
      indeterminate={indeterminate}
      disabled={disabled}
      aria-label="Select SKU-001"
      onChange={(e) => {
        setChecked(e.target.checked);
        onChange?.(e.target.checked);
      }}
    />
  );
};

const meta: Meta<typeof IndeterminateCheckbox> = {
  title: "Atoms/IndeterminateCheckbox",
  component: IndeterminateCheckbox,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A checkbox \`<input>\` that also supports a visual **indeterminate** state, used
for "select all" headers in tables where some but not all rows are selected.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    indeterminate: {
      control: "boolean",
      description:
        "Shows a dash instead of a checkmark. Only takes visual effect when `checked` is false.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the checkbox.",
    },
    checked: { control: false },
    onChange: { control: false },
    className: { control: false },
  },
  args: {
    indeterminate: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof IndeterminateCheckbox>;

/** Unchecked checkbox for a single SKU row. */
export const Default: Story = {
  render: (args) => (
    <ControlledIndeterminateCheckbox
      indeterminate={args.indeterminate}
      disabled={args.disabled}
      onChange={fn()}
    />
  ),
};

/** Pre-checked row. */
export const Checked: Story = {
  render: (args) => (
    <ControlledIndeterminateCheckbox
      checked
      disabled={args.disabled}
      onChange={fn()}
    />
  ),
};

/** Dash state for partial selection. */
export const Indeterminate: Story = {
  args: { indeterminate: true },
  render: (args) => (
    <ControlledIndeterminateCheckbox
      indeterminate={args.indeterminate}
      disabled={args.disabled}
      onChange={fn()}
    />
  ),
};

/** Disabled and unavailable for interaction. */
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <ControlledIndeterminateCheckbox
      disabled={args.disabled}
      onChange={fn()}
    />
  ),
};

/** Realistic "select all" header wired to SKU rows. */
export const SelectAllHeaderDemo: Story = {
  render: () => {
    const SelectAllDemo = () => {
      const [selected, setSelected] = useState<Record<string, boolean>>({});
      const selectedCount = Object.values(selected).filter(Boolean).length;
      const allSelected = selectedCount === SKU_ROWS.length;
      const someSelected = selectedCount > 0 && !allSelected;

      const toggleAll = (checked: boolean) => {
        setSelected(
          Object.fromEntries(
            SKU_ROWS.map((row) => [row.id, checked])
          ) as Record<string, boolean>
        );
      };

      return (
        <table className="w-80 border-collapse text-sm">
          <thead>
            <tr className="border-b">
              <th className="w-8 py-2 text-left">
                <IndeterminateCheckbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  aria-label="Select all SKUs"
                  onChange={(e) => toggleAll(e.target.checked)}
                />
              </th>
              <th className="py-2 text-left font-medium">SKU</th>
            </tr>
          </thead>
          <tbody>
            {SKU_ROWS.map((row) => (
              <tr key={row.id} className="border-b last:border-0">
                <td className="py-2">
                  <IndeterminateCheckbox
                    checked={selected[row.id] ?? false}
                    aria-label={`Select ${row.id}`}
                    onChange={(e) =>
                      setSelected((prev) => ({
                        ...prev,
                        [row.id]: e.target.checked,
                      }))
                    }
                  />
                </td>
                <td className="py-2">
                  {row.id} - {row.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    };
    return <SelectAllDemo />;
  },
};

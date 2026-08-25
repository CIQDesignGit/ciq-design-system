import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "@/atoms/input";
import { Label } from "@/atoms/label";

const meta: Meta<typeof Label> = {
  title: "Atoms/Label",
  component: Label,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A Radix-based form label. Pair it with \`htmlFor\` and a matching input \`id\` to
associate the label with its control. Automatically dims and shows a
"not-allowed" cursor when the sibling control has the \`peer\` class and is
disabled.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    htmlFor: {
      control: "text",
      description: "ID of the form control this label describes.",
    },
    children: { control: false },
    className: { control: false },
  },
  args: {
    htmlFor: "campaign-name",
    children: "Campaign name",
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

/** Standalone label paired with an input via `htmlFor` / `id`. */
export const Default: Story = {
  render: (args) => (
    <div className="grid w-72 gap-1.5">
      <Label {...args} />
      <Input id={args.htmlFor} placeholder="Prime Day - Electronics" />
    </div>
  ),
};

/** Required field indicator composed into the label's children. */
export const RequiredField: Story = {
  args: {
    htmlFor: "daily-budget",
    children: (
      <>
        Daily budget <span className="text-destructive">*</span>
      </>
    ),
  },
  render: (args) => (
    <div className="grid w-72 gap-1.5">
      <Label {...args} />
      <Input id="daily-budget" type="number" placeholder="150.00" required />
    </div>
  ),
};

/** Dims via `peer-disabled` when its sibling control (marked with the `peer` class) is disabled. */
export const WithDisabledControl: Story = {
  args: {
    htmlFor: "retailer",
    children: "Retailer",
  },
  render: (args) => (
    <div className="grid w-72 gap-1.5">
      <Label {...args} />
      <Input id="retailer" className="peer" defaultValue="Amazon US" disabled />
    </div>
  ),
};

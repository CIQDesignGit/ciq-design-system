import type { Meta, StoryObj } from "@storybook/react-vite";
import { IndeterminateCheckbox } from "@/atoms/indeterminate-checkbox";

const meta: Meta<typeof IndeterminateCheckbox> = {
  title: "Atoms/IndeterminateCheckbox",
  component: IndeterminateCheckbox,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof IndeterminateCheckbox>;

export const Default: Story = { args: {} };

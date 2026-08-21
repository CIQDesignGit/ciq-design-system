import type { Meta, StoryObj } from "@storybook/react-vite";
import { CopyButton } from "@/atoms/copy-button";

const meta: Meta<typeof CopyButton> = {
  title: "Atoms/CopyButton",
  component: CopyButton,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof CopyButton>;

export const Default: Story = {
  args: { value: "B08XYZ1234" },
};

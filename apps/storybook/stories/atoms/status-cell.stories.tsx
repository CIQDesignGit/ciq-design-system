import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusCell } from "@/atoms/status-cell";

const meta: Meta<typeof StatusCell> = {
  title: "Atoms/StatusCell",
  component: StatusCell,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StatusCell>;

export const Default: Story = { args: { status: "In review" } };

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chip } from "@/atoms/chip";

const meta: Meta<typeof Chip> = {
  title: "Atoms/Chip",
  component: Chip,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = { args: { message: "In stock" } };

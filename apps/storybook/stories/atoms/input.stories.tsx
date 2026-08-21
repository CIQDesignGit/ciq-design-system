import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "@/atoms/input";

const meta: Meta<typeof Input> = {
  title: "Atoms/Input",
  component: Input,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { placeholder: "Search..." } };

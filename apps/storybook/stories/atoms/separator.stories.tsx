import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "@/atoms/separator";

const meta: Meta<typeof Separator> = {
  title: "Atoms/Separator",
  component: Separator,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Default: Story = { args: {} };

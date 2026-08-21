import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "@/atoms/skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Atoms/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = { args: { className: "h-8 w-40" } };

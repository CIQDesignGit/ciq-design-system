import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "@/atoms/badge";

const meta: Meta<typeof Badge> = {
  title: "Atoms/Badge",
  component: Badge,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { children: "New" } };

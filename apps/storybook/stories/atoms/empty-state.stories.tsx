import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmptyState } from "@/atoms/empty-state";

const meta: Meta<typeof EmptyState> = {
  title: "Atoms/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = { args: { title: "No results", description: "Try a different filter." } };

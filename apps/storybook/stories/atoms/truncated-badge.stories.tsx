import type { Meta, StoryObj } from "@storybook/react-vite";
import { TruncatedBadge } from "@/atoms/truncated-badge";

const meta: Meta<typeof TruncatedBadge> = {
  title: "Atoms/TruncatedBadge",
  component: TruncatedBadge,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof TruncatedBadge>;

export const Default: Story = {
  args: {
    items: ["Amazon", "Walmart", "Target"],
  },
};

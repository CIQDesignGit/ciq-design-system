import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextDiff } from "@/atoms/text-diff";

const meta: Meta<typeof TextDiff> = {
  title: "Atoms/TextDiff",
  component: TextDiff,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TextDiff>;

export const Default: Story = { args: { original: "old title", suggested: "new title" } };

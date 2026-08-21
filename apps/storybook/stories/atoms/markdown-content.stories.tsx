import type { Meta, StoryObj } from "@storybook/react-vite";
import { MarkdownContent } from "@/atoms/markdown-content";

const meta: Meta<typeof MarkdownContent> = {
  title: "Atoms/MarkdownContent",
  component: MarkdownContent,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof MarkdownContent>;

export const Default: Story = {
  args: { children: <p>Markdown body used inside agent cards.</p> },
};

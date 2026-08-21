import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeBlock } from "@/atoms/code-block";

const meta: Meta<typeof CodeBlock> = {
  title: "Atoms/CodeBlock",
  component: CodeBlock,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CodeBlock>;

export const Default: Story = { args: { children: "const hello = \"world\";" } };

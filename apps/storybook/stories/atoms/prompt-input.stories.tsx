import type { Meta, StoryObj } from "@storybook/react-vite";
import { PromptInput } from "@/atoms/prompt-input";

const meta: Meta<typeof PromptInput> = {
  title: "Atoms/PromptInput",
  component: PromptInput,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof PromptInput>;

export const Default: Story = {
  args: { placeholder: "Ask Blake about this SKU…" },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { CharacterCount } from "@/atoms/character-count";

const meta: Meta<typeof CharacterCount> = {
  title: "Atoms/CharacterCount",
  component: CharacterCount,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CharacterCount>;

export const Default: Story = { args: { current: 12, max: 80 } };

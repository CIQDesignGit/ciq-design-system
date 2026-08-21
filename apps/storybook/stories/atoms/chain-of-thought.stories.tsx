import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtStep,
  ChainOfThoughtTrigger,
} from "@/atoms/chain-of-thought";

const meta: Meta<typeof ChainOfThought> = {
  title: "Atoms/ChainOfThought",
  component: ChainOfThought,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ChainOfThought>;

export const Default: Story = {
  render: () => (
    <ChainOfThought defaultOpen>
      <ChainOfThoughtTrigger>Reasoning</ChainOfThoughtTrigger>
      <ChainOfThoughtContent>
        <ChainOfThoughtStep>Compared last 7 days vs prior 7 days.</ChainOfThoughtStep>
      </ChainOfThoughtContent>
    </ChainOfThought>
  ),
};

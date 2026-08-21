import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "@/atoms/textarea";

const meta: Meta<typeof Textarea> = {
  title: "Atoms/Textarea",
  component: Textarea,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = { args: { placeholder: "Write a note..." } };

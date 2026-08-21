import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScrollButton } from "@/atoms/scroll-button";

const meta: Meta<typeof ScrollButton> = {
  title: "Atoms/ScrollButton",
  component: ScrollButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ScrollButton>;

export const Default: Story = { args: { visible: true } };

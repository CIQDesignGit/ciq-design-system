import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion } from "@/atoms/accordion";

const meta: Meta<typeof Accordion> = {
  title: "Atoms/Accordion",
  component: Accordion,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {
    title: "Content issues",
    badge: 3,
    defaultExpanded: true,
    children: "Missing bullets, title too long, image quality.",
  },
};

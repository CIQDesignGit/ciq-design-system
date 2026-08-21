import type { Meta, StoryObj } from "@storybook/react-vite";
import { SecondaryHeader } from "@/atoms/secondary-header";

const meta: Meta<typeof SecondaryHeader> = {
  title: "Atoms/SecondaryHeader",
  component: SecondaryHeader,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof SecondaryHeader>;

export const Default: Story = {
  args: {
    items: [
      { id: "1", label: "Amazon", icon: "building-2" },
      { id: "2", label: "Electronics", icon: "boxes" },
      { id: "3", label: "Content quality", icon: "shield-check" },
    ],
  },
};

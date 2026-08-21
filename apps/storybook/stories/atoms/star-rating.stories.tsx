import type { Meta, StoryObj } from "@storybook/react-vite";
import { StarRating } from "@/atoms/star-rating";

const meta: Meta<typeof StarRating> = {
  title: "Atoms/StarRating",
  component: StarRating,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StarRating>;

export const Default: Story = { args: { value: 4.5 } };

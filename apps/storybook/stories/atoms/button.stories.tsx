import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/atoms/button";

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = { args: { children: "Button" } };
export const Destructive: Story = {
  args: { variant: "destructive", children: "Delete" },
};
export const Outline: Story = {
  args: { variant: "outline", children: "Outline" },
};
export const Ghost: Story = { args: { variant: "ghost", children: "Ghost" } };
export const Card: Story = { args: { variant: "card", children: "Card" } };
export const Small: Story = { args: { size: "sm", children: "Small" } };

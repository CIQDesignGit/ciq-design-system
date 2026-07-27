import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { children: "Button" },
};

export const Task: Story = {
  args: { intent: "task", children: "Assign to Blake" },
};

export const Context: Story = {
  args: { intent: "context", children: "Add context" },
};

export const Disabled: Story = {
  args: { intent: "task", disabled: true, children: "Disabled" },
};

export const Outline: Story = {
  args: { variant: "outline", children: "Outline" },
};

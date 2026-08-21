import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Toggle } from "@/atoms/toggle";

const meta: Meta<typeof Toggle> = {
  title: "Atoms/Toggle",
  component: Toggle,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  render: function Render() {
    const [checked, setChecked] = useState(true);
    return <Toggle checked={checked} onCheckedChange={setChecked} />;
  },
};

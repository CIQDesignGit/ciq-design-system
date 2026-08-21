import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Switch } from "@/atoms/switch";

const meta: Meta<typeof Switch> = {
  title: "Atoms/Switch",
  component: Switch,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: function Render() {
    const [checked, setChecked] = useState(true);
    return (
      <Switch checked={checked} onCheckedChange={setChecked} />
    );
  },
};

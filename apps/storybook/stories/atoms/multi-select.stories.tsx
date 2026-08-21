import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { MultiSelect } from "@/atoms/multi-select";

const meta: Meta<typeof MultiSelect> = {
  title: "Atoms/MultiSelect",
  component: MultiSelect,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

export const Default: Story = {
  render: function Render() {
    const [value, setValue] = useState<string[]>(["amazon"]);
    return (
      <div className="w-[320px]">
        <MultiSelect
          value={value}
          onValueChange={setValue}
          placeholder="Marketplace"
          options={[
            { label: "Amazon", value: "amazon" },
            { label: "Walmart", value: "walmart" },
            { label: "Target", value: "target" },
          ]}
        />
      </div>
    );
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { OrderedMultiSelect } from "@/atoms/ordered-multi-select";

const OPTIONS = [
  { label: "Title", value: "title" },
  { label: "Bullets", value: "bullets" },
  { label: "Images", value: "images" },
];

const meta: Meta<typeof OrderedMultiSelect> = {
  title: "Atoms/OrderedMultiSelect",
  component: OrderedMultiSelect,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof OrderedMultiSelect>;

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(["title", "bullets"]);
    return (
      <OrderedMultiSelect
        options={OPTIONS}
        selected={selected}
        onChange={setSelected}
      />
    );
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { OrderedMultiSelect } from "@/atoms/ordered-multi-select";

const meta: Meta<typeof OrderedMultiSelect> = {
  title: "Atoms/OrderedMultiSelect",
  component: OrderedMultiSelect,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof OrderedMultiSelect>;

export const Default: Story = {
  args: {
    options: [
      { label: "Title", value: "title" },
      { label: "Bullets", value: "bullets" },
      { label: "Images", value: "images" },
    ],
    value: ["title", "bullets"],
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/atoms/select";

const meta: Meta<typeof Select> = {
  title: "Atoms/Select",
  component: Select,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => (
    <Select defaultValue="amazon">
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Marketplace" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="amazon">Amazon</SelectItem>
        <SelectItem value="walmart">Walmart</SelectItem>
        <SelectItem value="target">Target</SelectItem>
      </SelectContent>
    </Select>
  ),
};

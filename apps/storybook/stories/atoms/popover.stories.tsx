import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/atoms/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/atoms/popover";

const meta: Meta<typeof Popover> = {
  title: "Atoms/Popover",
  component: Popover,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>Filter by marketplace, brand, or ASIN.</PopoverContent>
    </Popover>
  ),
};

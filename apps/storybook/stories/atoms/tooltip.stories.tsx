import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/atoms/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/atoms/tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Atoms/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>Assign this SKU to Blake</TooltipContent>
    </Tooltip>
  ),
};

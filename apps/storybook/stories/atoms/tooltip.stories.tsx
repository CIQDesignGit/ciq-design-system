import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/atoms/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/atoms/tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Atoms/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A Radix-based tooltip (`Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`) for short contextual hints on hover/focus. Stories below force the tooltip open via `defaultOpen` so the content is visible without needing to hover in the docs canvas.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    defaultOpen: {
      control: "boolean",
      description: "Whether the tooltip is open by default (uncontrolled usage).",
    },
    delayDuration: {
      control: { type: "number", min: 0, max: 1000, step: 50 },
      description: "Delay in ms before the tooltip shows after hovering the trigger.",
    },
    open: { control: false },
    onOpenChange: { control: false },
    children: { control: false },
  },
  args: {
    defaultOpen: true,
    delayDuration: 200,
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="flex justify-center pt-16">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

/** A metric abbreviation explained on hover. */
export const Default: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger asChild>
        <Button variant="outline">ACOS: 14.2%</Button>
      </TooltipTrigger>
      <TooltipContent>
        Advertising Cost of Sales — ad spend divided by attributed revenue.
      </TooltipContent>
    </Tooltip>
  ),
};

/** Tooltip explaining why an action is disabled. */
export const OnDisabledAction: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger asChild>
        <span>
          <Button variant="outline" disabled>
            Approve price change
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        You need approver permissions to accept pricing recommendations.
      </TooltipContent>
    </Tooltip>
  ),
};

/** Tooltip positioned to the right of the trigger. */
export const SidePlacement: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger asChild>
        <Button variant="outline">Buy box: 94%</Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        Share of the buy box won across all offers for this SKU.
      </TooltipContent>
    </Tooltip>
  ),
};

/** Closed by default — hover the button to reveal the tooltip. */
export const HoverToReveal: Story = {
  args: { defaultOpen: false },
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>Inventory synced 4 minutes ago.</TooltipContent>
    </Tooltip>
  ),
};

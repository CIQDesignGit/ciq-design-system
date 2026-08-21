import type { Meta, StoryObj } from "@storybook/react-vite";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/atoms/hover-card";
import { Button } from "@/atoms/button";

const meta: Meta<typeof HoverCard> = {
  title: "Atoms/HoverCard",
  component: HoverCard,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">SKU B08XYZ</Button>
      </HoverCardTrigger>
      <HoverCardContent>Wireless Headphones · 4.5 stars</HoverCardContent>
    </HoverCard>
  ),
};

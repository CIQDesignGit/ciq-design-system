import type { Meta, StoryObj } from "@storybook/react-vite";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/atoms/collapsible";
import { Button } from "@/atoms/button";

const meta: Meta<typeof Collapsible> = {
  title: "Atoms/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
  render: () => (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button variant="ghost">Show reasoning</Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 text-sm">
        Title is too long compared with top competitors.
      </CollapsibleContent>
    </Collapsible>
  ),
};

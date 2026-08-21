import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScrollArea } from "@/atoms/scroll-area";

const meta: Meta<typeof ScrollArea> = {
  title: "Atoms/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ScrollArea>;

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-32 w-64 rounded-lg border p-3">
      {Array.from({ length: 20 }, (_, i) => (
        <p key={i} className="text-sm py-1">
          Row {i + 1}
        </p>
      ))}
    </ScrollArea>
  ),
};

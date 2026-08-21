import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/atoms/button";
import { ToastProvider, useToast } from "@/atoms/toaster";

const meta: Meta = {
  title: "Atoms/Toaster",
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

function Trigger() {
  const { toast } = useToast();
  return (
    <Button onClick={() => toast({ title: "Saved", description: "Filter applied." })}>
      Show toast
    </Button>
  );
}

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <Trigger />
    </ToastProvider>
  ),
};

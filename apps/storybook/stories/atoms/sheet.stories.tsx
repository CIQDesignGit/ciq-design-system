import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/atoms/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/atoms/sheet";

const meta: Meta<typeof Sheet> = {
  title: "Atoms/Sheet",
  component: Sheet,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Sheet>;

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open panel</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>SKU details</SheetTitle>
        </SheetHeader>
        <p className="text-sm text-muted-foreground mt-4">
          Side drawer used for filters, details, and knowledge space.
        </p>
      </SheetContent>
    </Sheet>
  ),
};

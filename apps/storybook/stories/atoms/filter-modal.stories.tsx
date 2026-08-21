import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "@/atoms/button";
import { FilterModal } from "@/atoms/filter-modal";

const meta: Meta<typeof FilterModal> = {
  title: "Atoms/FilterModal",
  component: FilterModal,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FilterModal>;

export const Default: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open filters</Button>
        <FilterModal open={open} onOpenChange={setOpen} onClear={() => undefined} onApply={() => undefined}>
          Choose marketplace, brand, and category.
        </FilterModal>
      </>
    );
  },
};

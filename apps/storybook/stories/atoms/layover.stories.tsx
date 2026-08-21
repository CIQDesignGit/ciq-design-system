import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "@/atoms/button";
import { Layover } from "@/atoms/layover";

const meta: Meta<typeof Layover> = {
  title: "Atoms/Layover",
  component: Layover,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Layover>;

export const Default: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open layover</Button>
        <Layover open={open} onOpenChange={setOpen}>
          <div className="bg-white rounded-lg p-6 shadow-xl w-[360px]">
            Overlay content
            <div className="mt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Layover>
      </>
    );
  },
};

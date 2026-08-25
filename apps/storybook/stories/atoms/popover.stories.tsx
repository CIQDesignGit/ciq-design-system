import type { Meta, StoryObj } from "@storybook/react-vite";
import { Info, Settings2 } from "lucide-react";
import { useState } from "react";
import { fn } from "storybook/test";

import { Button } from "@/atoms/button";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/atoms/popover";

const meta: Meta<typeof Popover> = {
  title: "Atoms/Popover",
  component: Popover,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A Radix-based compound popover: \`Popover\` (root), \`PopoverTrigger\`, \`PopoverContent\`, and \`PopoverAnchor\`.
Compose the pieces together for filter panels, row actions, and contextual help.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    open: { control: false },
    defaultOpen: {
      control: "boolean",
      description: "Initial open state for uncontrolled usage.",
    },
    modal: {
      control: "boolean",
      description:
        "When true, pointer/focus interaction with outside elements is disabled while open.",
    },
    onOpenChange: { control: false },
  },
  args: {
    defaultOpen: false,
    modal: false,
    onOpenChange: fn(),
  },
};

const DEFAULT_ALIGN = "center" as const;
const DEFAULT_SIDE_OFFSET = 4;

export default meta;
type Story = StoryObj<typeof Popover>;

/** Basic trigger + content composition. */
export const Default: Story = {
  render: (args) => (
    <Popover
      defaultOpen={args.defaultOpen}
      modal={args.modal}
      onOpenChange={args.onOpenChange}
    >
      <PopoverTrigger asChild>
        <Button variant="outline">Filter by retailer</Button>
      </PopoverTrigger>
      <PopoverContent align={DEFAULT_ALIGN} sideOffset={DEFAULT_SIDE_OFFSET}>
        <div className="space-y-2">
          <p className="text-sm font-medium">Filter by retailer</p>
          <p className="text-sm text-muted-foreground">
            Amazon, Walmart, and Target data will be included.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

/** `PopoverAnchor` decouples the content's anchor point from the trigger. */
export const WithAnchor: Story = {
  render: () => (
    <Popover>
      <PopoverAnchor asChild>
        <div className="flex w-72 items-center gap-2 rounded-md border border-input px-3 py-2">
          <span className="flex-1 truncate text-sm text-muted-foreground">
            SKU-1042 · Wireless Earbuds Pro
          </span>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" aria-label="Row actions">
              <Settings2 className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
        </div>
      </PopoverAnchor>
      <PopoverContent align="end" sideOffset={DEFAULT_SIDE_OFFSET}>
        <div className="space-y-2 text-sm">
          <p className="font-medium">Row actions</p>
          <p className="text-muted-foreground">
            Edit bid, pause keyword, or view ASIN details.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

/** Using a popover as an inline metric explainer. */
export const AsInfoTooltip: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center text-muted-foreground hover:text-foreground"
          aria-label="What is ACOS?"
        >
          <Info className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="max-w-xs">
        <p className="text-sm">
          <strong>ACOS</strong> (Advertising Cost of Sales) is ad spend divided
          by attributed revenue. Lower is generally better.
        </p>
      </PopoverContent>
    </Popover>
  ),
};

/** Content aligned to the end of the trigger. */
export const AlignEnd: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Column settings</Button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={DEFAULT_SIDE_OFFSET}>
        <p className="text-sm">Content aligned to the end of the trigger.</p>
      </PopoverContent>
    </Popover>
  ),
};

const ControlledPopoverDemo = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open programmatically
      </Button>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline">Toggle popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="space-y-2 text-sm">
            <p>
              This popover&apos;s open state is controlled externally via{" "}
              <code>open</code> / <code>onOpenChange</code>.
            </p>
            <Button size="sm" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const ControlledOpen: Story = {
  render: () => <ControlledPopoverDemo />,
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { fn } from "storybook/test";

import { Button } from "@/atoms/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/atoms/collapsible";

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof Collapsible> = {
  title: "Atoms/Collapsible",
  component: Collapsible,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
Unstyled Radix collapsible primitive - the low-level building block behind
components like \`ChainOfThought\`. Compose it from \`Collapsible\` (root),
\`CollapsibleTrigger\`, and \`CollapsibleContent\`.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: false, // controlled via a local wrapper below to keep the story interactive
      description: "Controlled open state.",
    },
    defaultOpen: {
      control: "boolean",
      description: "Whether the panel starts expanded (uncontrolled usage).",
    },
    disabled: {
      control: "boolean",
      description: "Prevents the trigger from toggling the panel.",
    },
    onOpenChange: { action: "open-changed" },
    children: {
      control: false, // must be CollapsibleTrigger/CollapsibleContent, see render functions
      description: "Trigger and content elements.",
    },
  },
  args: {
    defaultOpen: false,
    disabled: false,
    onOpenChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

// ============================================
// Story Demo Wrappers
// ============================================

function InteractiveCollapsibleDemo(args: NonNullable<Story["args"]>) {
  const [open, setOpen] = useState(Boolean(args.defaultOpen));
  return (
    <Collapsible
      {...args}
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        args.onOpenChange?.(value);
      }}
      className="w-[360px] rounded-lg border p-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">B08XYZ1234 - Wireless Headphones</span>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Toggle details">
            <ChevronsUpDown className="size-4" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-2 space-y-1 text-sm text-muted-foreground">
        <p>Price: $149.99</p>
        <p>Buy Box win rate: 94.2%</p>
        <p>Inventory: 234 units</p>
      </CollapsibleContent>
    </Collapsible>
  );
}

// ============================================
// Stories
// ============================================

/** Interactive, controlled collapsible showing/hiding extra ASIN details. */
export const Default: Story = {
  render: (args) => <InteractiveCollapsibleDemo {...args} />,
};

/** Starts expanded (uncontrolled `defaultOpen`). */
export const ExpandedByDefault: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <Collapsible {...args} className="w-[360px] rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Campaign notes</span>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Toggle notes">
            <ChevronsUpDown className="size-4" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-2 text-sm text-muted-foreground">
        Budget increased to $150/day on Aug 1 to capture back-to-school demand.
      </CollapsibleContent>
    </Collapsible>
  ),
};

/** Disabled trigger - the panel cannot be toggled. */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <Collapsible {...args} className="w-[360px] rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Locked settings</span>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Toggle" disabled>
            <ChevronsUpDown className="size-4" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-2 text-sm text-muted-foreground">
        This section is managed by your account admin.
      </CollapsibleContent>
    </Collapsible>
  ),
};

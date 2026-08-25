import type { Meta, StoryObj } from "@storybook/react-vite";
import { Copy, FileDown, Pencil, Settings, Trash2 } from "lucide-react";
import { useState } from "react";
import { fn } from "storybook/test";

import { Button } from "@/atoms/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/atoms/dropdown-menu";

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof DropdownMenu> = {
  title: "Atoms/DropdownMenu",
  component: DropdownMenu,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A Radix-based dropdown menu used for row actions, table column menus, and
settings. Compose it from \`DropdownMenu\` (root), \`DropdownMenuTrigger\`,
\`DropdownMenuContent\`, and item components (\`DropdownMenuItem\`,
\`DropdownMenuCheckboxItem\`, \`DropdownMenuRadioItem\`, submenus, etc).
Content renders in a portal (targeting an \`#overlay-portal\` element when
present, falling back to \`document.body\`).
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
    onOpenChange: { action: "open-changed" },
    children: {
      control: false, // must be DropdownMenuTrigger/DropdownMenuContent, see render functions
      description: "Trigger and content elements.",
    },
  },
  args: {
    onOpenChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

type ArgsOf = NonNullable<Story["args"]>;

// ============================================
// Story Demo Wrappers
// ============================================

function RowActionsMenuDemo(args: ArgsOf) {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu
      {...args}
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        args.onOpenChange?.(value);
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>B08XYZ1234</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Pencil /> Edit pricing rule
          <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy /> Duplicate rule
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FileDown /> Export history
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">
          <Trash2 /> Delete rule
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CheckboxItemsMenuDemo(args: ArgsOf) {
  const [open, setOpen] = useState(false);
  const [showRevenue, setShowRevenue] = useState(true);
  const [showMargin, setShowMargin] = useState(false);
  return (
    <DropdownMenu
      {...args}
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        args.onOpenChange?.(value);
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Settings /> Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Visible metrics</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={showRevenue} onCheckedChange={setShowRevenue} icon>
          Revenue
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={showMargin} onCheckedChange={setShowMargin} icon>
          Margin
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RadioItemsMenuDemo(args: ArgsOf) {
  const [open, setOpen] = useState(false);
  const [cadence, setCadence] = useState("last7Days");
  return (
    <DropdownMenu
      {...args}
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        args.onOpenChange?.(value);
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Date range</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Cadence</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={cadence} onValueChange={setCadence}>
          <DropdownMenuRadioItem value="last7Days" icon>
            Last 7 days
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="last30Days" icon>
            Last 30 days
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="quarterToDate" icon>
            Quarter to date
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SubmenuDemo(args: ArgsOf) {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu
      {...args}
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        args.onOpenChange?.(value);
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Report options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Pencil /> Rename report
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <FileDown /> Export as
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>CSV</DropdownMenuItem>
            <DropdownMenuItem>XLSX</DropdownMenuItem>
            <DropdownMenuItem>PDF</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================
// Stories
// ============================================

/** Row actions menu, as used on an ASIN or campaign table row. */
export const Default: Story = {
  render: (args) => <RowActionsMenuDemo {...args} />,
};

/** With checkbox items, e.g. toggling which metric columns are visible. */
export const WithCheckboxItems: Story = {
  render: (args) => <CheckboxItemsMenuDemo {...args} />,
};

/** With a radio group, e.g. choosing a date range cadence. */
export const WithRadioItems: Story = {
  render: (args) => <RadioItemsMenuDemo {...args} />,
};

/** With a nested submenu, e.g. "Export as..." with format options. */
export const WithSubmenu: Story = {
  render: (args) => <SubmenuDemo {...args} />,
};

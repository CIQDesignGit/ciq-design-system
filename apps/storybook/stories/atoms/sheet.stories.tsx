import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Button } from "@/atoms/button";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/atoms/sheet";

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof Sheet> = {
  title: "Atoms/Sheet",
  component: Sheet,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A slide-in panel (Radix Dialog under the hood) anchored to an edge of the screen. Used for drawers such as a SKU detail view, action-log details, or a widget preview, without leaving the current page context. Click the trigger button to open each story.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    defaultOpen: {
      control: "boolean",
      description: "Whether the sheet is open by default (uncontrolled usage).",
    },
    modal: {
      control: "boolean",
      description: "Whether the sheet traps focus and blocks interaction with the rest of the page.",
    },
    // Non-controllable - compound component, content composed via children
    open: { control: false },
    onOpenChange: { control: false },
    children: { control: false },
  },
  args: {
    defaultOpen: false,
    modal: true,
  },
};

export default meta;
type Story = StoryObj<typeof Sheet>;

/** A right-side drawer showing SKU detail — the most common placement. */
export const Default: Story = {
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger asChild>
        <Button variant="outline">Open SKU details</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>SKU-4471 · Yankee Candle Large Jar, 22oz</SheetTitle>
          <SheetDescription>Amazon US · Buy box: 94% · Price: $24.99</SheetDescription>
        </SheetHeader>
        <div className="py-4 text-sm text-slate-700">
          Inventory: 234 units · 7-day units sold: 156 · ACOS: 12.4%
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
          <Button>Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/** Anchored to the left edge, e.g. a secondary navigation drawer. */
export const LeftSide: Story = {
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger asChild>
        <Button variant="outline">Open from left</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Campaign filters</SheetTitle>
          <SheetDescription>Refine the campaigns shown in this view.</SheetDescription>
        </SheetHeader>
        <div className="py-4 text-sm text-slate-700">Marketplace, status, and budget filters go here.</div>
      </SheetContent>
    </Sheet>
  ),
};

/** Anchored to the top edge, e.g. a global announcement or quick-filter bar. */
export const TopSide: Story = {
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger asChild>
        <Button variant="outline">Open from top</Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>3 pricing alerts need review</SheetTitle>
          <SheetDescription>Buy box losses detected across Amazon US in the last hour.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};

/** Anchored to the bottom edge, e.g. a mobile-style action sheet. */
export const BottomSide: Story = {
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger asChild>
        <Button variant="outline">Open from bottom</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Bulk actions</SheetTitle>
          <SheetDescription>Apply an action to the 12 selected SKUs.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button variant="outline">Export</Button>
          <Button>Apply price change</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

function ReopenableSheetDemo(args: NonNullable<Story["args"]>) {
  const [open, setOpen] = useState(true);
  return (
    <Sheet open={open} onOpenChange={setOpen} modal={args.modal}>
      <SheetTrigger asChild>
        <Button variant="outline">Reopen panel</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Content Agent review</SheetTitle>
          <SheetDescription>2 AI-generated title rewrites are waiting for approval.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

/** Open by default so the panel content is visible without an interaction. */
export const OpenByDefault: Story = {
  args: { defaultOpen: true },
  render: (args) => <ReopenableSheetDemo {...args} />,
};

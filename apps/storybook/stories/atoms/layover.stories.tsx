import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import { Layover } from "@/atoms/layover";

// ============================================
// Controlled Wrapper
// ============================================

type LayoverDemoProps = {
  readonly position?: "center" | "right" | "left" | "bottom" | "top";
  readonly closeOnOverlayClick?: boolean;
  readonly closeOnEscape?: boolean;
  readonly title: string;
  readonly body: string;
  readonly panelClassName?: string;
  readonly onOpenChange?: (open: boolean) => void;
};

const LayoverDemo = ({
  position = "center",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  title,
  body,
  panelClassName = "w-96 rounded-xl bg-background p-6 shadow-xl",
  onOpenChange,
}: LayoverDemoProps) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  return (
    <div>
      <button
        type="button"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        onClick={() => setOpen(true)}
      >
        Open {title}
      </button>
      <Layover
        open={open}
        onOpenChange={handleOpenChange}
        position={position}
        closeOnOverlayClick={closeOnOverlayClick}
        closeOnEscape={closeOnEscape}
      >
        <div className={panelClassName}>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{body}</p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              className="rounded-lg border px-3 py-1.5 text-sm"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Layover>
    </div>
  );
};

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof Layover> = {
  title: "Atoms/Layover",
  component: Layover,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A lightweight, unstyled overlay/modal shell rendered inline (no portal) that
handles the backdrop, escape-to-close, position, and body-scroll locking.
Bring your own panel content via \`children\` — used for dialogs, side drawers,
and bottom sheets such as a campaign details drawer or a bulk-action
confirmation dialog.

Click the button below to open the overlay.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: ["center", "right", "left", "bottom", "top"],
      description: "Where the content panel is anchored within the viewport.",
    },
    closeOnOverlayClick: {
      control: "boolean",
      description: "Whether clicking the backdrop closes the overlay.",
    },
    closeOnEscape: {
      control: "boolean",
      description: "Whether pressing Escape closes the overlay.",
    },
    // Controlled by the local demo wrapper's own open/close button in these stories
    open: { control: false },
    onOpenChange: { control: false },
    // ReactNode - the panel content is composed per-story
    children: { control: false },
    // Styling escape hatches
    className: { control: false },
    overlayClassName: { control: false },
  },
  args: {
    position: "center",
    closeOnOverlayClick: true,
    closeOnEscape: true,
  },
};

export default meta;
type Story = StoryObj<typeof Layover>;

// ============================================
// Stories
// ============================================

/** Centered modal dialog, e.g. a bulk-action confirmation. */
export const Default: Story = {
  render: (args) => (
    <LayoverDemo
      position={args.position}
      closeOnOverlayClick={args.closeOnOverlayClick}
      closeOnEscape={args.closeOnEscape}
      title="Pause 12 campaigns?"
      body="This will pause all selected Sponsored Products campaigns across Amazon US. You can resume them at any time."
      onOpenChange={fn()}
    />
  ),
};

/** Right-anchored drawer, e.g. viewing a campaign's full details without leaving the list. */
export const RightDrawer: Story = {
  args: { position: "right" },
  render: (args) => (
    <LayoverDemo
      position={args.position}
      title="Campaign details"
      body="Prime Day - Electronics Sponsored Products. Spend: $12,480. Impressions: 1.2M. ACOS: 18.4%."
      panelClassName="h-full w-96 bg-background p-6 shadow-xl"
      onOpenChange={fn()}
    />
  ),
};

/** Left-anchored drawer, e.g. a filters panel. */
export const LeftDrawer: Story = {
  args: { position: "left" },
  render: (args) => (
    <LayoverDemo
      position={args.position}
      title="Filters"
      body="Retailer: Amazon US. Date range: Last 30 days. Category: Electronics."
      panelClassName="h-full w-80 bg-background p-6 shadow-xl"
      onOpenChange={fn()}
    />
  ),
};

/** Bottom sheet, e.g. a mobile-style action menu. */
export const BottomSheet: Story = {
  args: { position: "bottom" },
  render: (args) => (
    <LayoverDemo
      position={args.position}
      title="Row actions"
      body="Choose an action for SKU-001 - Wireless Headphones."
      panelClassName="w-full rounded-t-xl bg-background p-6 shadow-xl"
      onOpenChange={fn()}
    />
  ),
};

/** Overlay click and Escape are both disabled - the panel can only be dismissed via its own Close button. */
export const RequiresExplicitClose: Story = {
  args: { closeOnOverlayClick: false, closeOnEscape: false },
  render: (args) => (
    <LayoverDemo
      position={args.position}
      closeOnOverlayClick={args.closeOnOverlayClick}
      closeOnEscape={args.closeOnEscape}
      title="Sync in progress"
      body="Please wait while we sync your Amazon Ads data. This dialog can only be closed once the sync completes."
      onOpenChange={fn()}
    />
  ),
};

import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/atoms/hover-card";

const ASIN_PREVIEW = {
  asin: "B08XYZ1234",
  title: "Wireless Noise-Cancelling Headphones",
  retailer: "Amazon US",
  price: "$149.99",
  acos: "18.4%",
  roas: "5.4x",
};

const CAMPAIGN_PREVIEW = {
  name: "Prime Day - Electronics Sponsored Products",
  retailer: "Amazon US",
  status: "Active",
  spend: "$12,480",
  impressions: "1.2M",
};

const meta: Meta<typeof HoverCard> = {
  title: "Atoms/HoverCard",
  component: HoverCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A hover-triggered popover for previewing supplementary details — e.g. an ASIN's
key metrics or a campaign summary — without requiring a click.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    openDelay: {
      control: { type: "number", min: 0, max: 2000, step: 50 },
      description:
        "Delay in ms before the card opens after the pointer enters the trigger.",
    },
    closeDelay: {
      control: { type: "number", min: 0, max: 2000, step: 50 },
      description: "Delay in ms before the card closes after the pointer leaves.",
    },
    defaultOpen: {
      control: "boolean",
      description: "Whether the card is open on initial render (uncontrolled).",
    },
    open: { control: false },
    onOpenChange: { control: false },
    children: { control: false },
  },
  args: {
    openDelay: 700,
    closeDelay: 300,
    defaultOpen: false,
  },
};

export default meta;
type Story = StoryObj<typeof HoverCard>;

/** Hover over the ASIN to preview its key metrics. */
export const Default: Story = {
  render: (args) => (
    <HoverCard openDelay={args.openDelay} closeDelay={args.closeDelay}>
      <HoverCardTrigger asChild>
        <span className="cursor-pointer font-medium text-primary underline underline-offset-4">
          {ASIN_PREVIEW.asin}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        <div className="space-y-1">
          <p className="text-sm font-semibold">{ASIN_PREVIEW.title}</p>
          <p className="text-xs text-muted-foreground">
            {ASIN_PREVIEW.retailer} &middot; {ASIN_PREVIEW.price}
          </p>
          <div className="mt-2 flex gap-4 text-xs">
            <span>
              ACOS <span className="font-medium">{ASIN_PREVIEW.acos}</span>
            </span>
            <span>
              ROAS <span className="font-medium">{ASIN_PREVIEW.roas}</span>
            </span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

/** `defaultOpen` renders the content immediately. */
export const OpenByDefault: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <HoverCard defaultOpen={args.defaultOpen}>
      <HoverCardTrigger asChild>
        <span className="cursor-pointer font-medium text-primary underline underline-offset-4">
          {CAMPAIGN_PREVIEW.name}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-72" align="start">
        <div className="space-y-1">
          <p className="text-sm font-semibold">{CAMPAIGN_PREVIEW.name}</p>
          <p className="text-xs text-muted-foreground">
            {CAMPAIGN_PREVIEW.retailer} &middot; {CAMPAIGN_PREVIEW.status}
          </p>
          <div className="mt-2 flex gap-4 text-xs">
            <span>
              Spend <span className="font-medium">{CAMPAIGN_PREVIEW.spend}</span>
            </span>
            <span>
              Impressions{" "}
              <span className="font-medium">{CAMPAIGN_PREVIEW.impressions}</span>
            </span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

/** Content aligned to the end of the trigger. */
export const AlignEnd: Story = {
  render: () => (
    <div className="flex justify-end">
      <HoverCard>
        <HoverCardTrigger asChild>
          <span className="cursor-pointer font-medium text-primary underline underline-offset-4">
            {ASIN_PREVIEW.asin}
          </span>
        </HoverCardTrigger>
        <HoverCardContent align="end" className="w-64">
          <p className="text-sm font-semibold">{ASIN_PREVIEW.title}</p>
          <p className="text-xs text-muted-foreground">{ASIN_PREVIEW.price}</p>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};

/** Near-instant open/close for dense tables. */
export const FastDelays: Story = {
  args: {
    openDelay: 0,
    closeDelay: 0,
  },
  render: (args) => (
    <HoverCard openDelay={args.openDelay} closeDelay={args.closeDelay}>
      <HoverCardTrigger asChild>
        <span className="cursor-pointer font-medium text-primary underline underline-offset-4">
          {ASIN_PREVIEW.asin}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        <p className="text-sm font-semibold">{ASIN_PREVIEW.title}</p>
        <p className="text-xs text-muted-foreground">
          {ASIN_PREVIEW.retailer} &middot; {ASIN_PREVIEW.price}
        </p>
      </HoverCardContent>
    </HoverCard>
  ),
};

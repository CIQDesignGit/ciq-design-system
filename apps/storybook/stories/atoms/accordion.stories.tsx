import type { Meta, StoryObj } from "@storybook/react-vite";

import { Accordion } from "@/atoms/accordion";

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof Accordion> = {
  title: "Atoms/Accordion",
  component: Accordion,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A single collapsible section with a clickable header. Used to progressively
disclose details such as SKU-level breakdowns or campaign notes without
leaving the surrounding page.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Header content. Strings/numbers get default typography; ReactNode is rendered as-is.",
    },
    badge: {
      control: "text",
      description: "Optional badge rendered next to the title (e.g. a count).",
    },
    children: {
      control: false, // ReactNode - the collapsible body content
      description: "Content rendered inside the expandable panel.",
    },
    defaultExpanded: {
      control: "boolean",
      description: "Whether the accordion starts expanded.",
    },
    chevronPosition: {
      control: "inline-radio",
      options: ["left", "right"],
      description: "Which side the chevron icon renders on.",
    },
    className: {
      control: false, // styling escape hatch, not meaningful via controls
      description: "Additional class names for the root element.",
    },
    triggerClassName: {
      control: false, // styling escape hatch
      description: "Additional class names for the trigger button.",
    },
    contentClassName: {
      control: false, // styling escape hatch
      description: "Additional class names for the content wrapper.",
    },
  },
  args: {
    title: "ASIN B08XYZ1234 - Wireless Headphones",
    badge: "3 flags",
    defaultExpanded: false,
    chevronPosition: "left",
    children: (
      <div className="p-3 text-sm text-muted-foreground">
        Buy Box lost to a third-party seller on Aug 2. Suggested action: review pricing rules for
        this ASIN in the Amazon Copilot pricing module.
      </div>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

// ============================================
// Stories
// ============================================

/** Default collapsed accordion with a left chevron. */
export const Default: Story = {};

/** Starts open, showing the panel content immediately. */
export const ExpandedByDefault: Story = {
  args: {
    defaultExpanded: true,
  },
};

/** Chevron rendered on the right side of the header, common for list rows. */
export const ChevronOnRight: Story = {
  args: {
    chevronPosition: "right",
    defaultExpanded: true,
  },
};

/** No badge, plain header text. */
export const WithoutBadge: Story = {
  args: {
    badge: undefined,
    title: "Shipping & fulfillment notes",
  },
};

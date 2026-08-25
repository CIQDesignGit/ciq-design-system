import type { Meta, StoryObj } from "@storybook/react-vite";

import { Loader, type LoaderProps } from "@/atoms/loader";

// ============================================
// Mock Data
// ============================================

const ALL_VARIANTS: NonNullable<LoaderProps["variant"]>[] = [
  "circular",
  "classic",
  "pulse",
  "pulse-dot",
  "dots",
  "typing",
  "wave",
  "bars",
  "terminal",
  "text-blink",
  "text-shimmer",
  "loading-dots",
];

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof Loader> = {
  title: "Atoms/Loader",
  component: Loader,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A general-purpose loading indicator with 12 visual variants, three sizes, and
an optional text label (used by the text-based variants). Use it for inline
loading states such as a chat assistant "thinking" indicator, a widget
refreshing its data, or a button's busy state.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ALL_VARIANTS,
      description: "Which loading animation to render.",
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
      description: "Size of the loader.",
    },
    text: {
      control: "text",
      description:
        'Label shown by the "text-blink", "text-shimmer", and "loading-dots" variants (default: "Thinking"). Ignored by the other variants.',
    },
    // Styling escape hatch
    className: { control: false },
  },
  args: {
    variant: "circular",
    size: "md",
  },
};

export default meta;
type Story = StoryObj<typeof Loader>;

// ============================================
// Stories
// ============================================

/** Default spinner used for most inline loading states. */
export const Default: Story = {};

/** A generative-AI "thinking" indicator with a shimmering text label. */
export const TextShimmer: Story = {
  args: {
    variant: "text-shimmer",
    text: "Generating insights...",
  },
};

/** Compact size for use inside buttons or dense table cells. */
export const SmallInline: Story = {
  args: {
    variant: "circular",
    size: "sm",
  },
};

/** Larger size for full-page or full-widget loading states. */
export const LargeFullWidget: Story = {
  args: {
    variant: "circular",
    size: "lg",
  },
};

/** All 12 variants side by side for quick visual comparison. */
export const AllVariants: Story = {
  render: (args) => (
    <div className="grid grid-cols-3 gap-8">
      {ALL_VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-2">
          <Loader variant={variant} size={args.size} />
          <span className="text-xs text-muted-foreground">{variant}</span>
        </div>
      ))}
    </div>
  ),
};

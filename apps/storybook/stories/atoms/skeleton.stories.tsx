import type { Meta, StoryObj } from "@storybook/react-vite";

import { Skeleton } from "@/atoms/skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Atoms/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A shimmering placeholder block used while content (widgets, tables, cards) is loading. It's an unstyled `<div>` by default — shape and size come entirely from `className`.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description:
        "Tailwind classes controlling size and shape (width, height, rounding).",
    },
    style: {
      control: false,
    },
  },
  args: {
    className: "h-4 w-48",
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

/** A single line-height skeleton. */
export const Default: Story = {};

/** Circular skeleton, e.g. placeholder for an avatar. */
export const Avatar: Story = {
  args: {
    className: "size-10 rounded-full",
  },
};

/** A full card skeleton composed of multiple pieces. */
export const CardLoading: Story = {
  render: () => (
    <div className="w-72 space-y-3 rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-24 w-full rounded-lg" />
      <div className="flex gap-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  ),
};

/** Table row skeleton while data loads. */
export const TableRows: Story = {
  render: () => (
    <div className="w-96 space-y-2">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-14" />
        </div>
      ))}
    </div>
  ),
};

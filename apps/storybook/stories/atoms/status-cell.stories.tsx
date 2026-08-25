import type { Meta, StoryObj } from "@storybook/react-vite";

import { StatusCell } from "@/atoms/status-cell";

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof StatusCell> = {
  title: "Atoms/StatusCell",
  component: StatusCell,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A small pill-shaped badge used inside table cells to show a task or action's status (e.g. a content or pricing recommendation's workflow state). Defaults to \"To-do\" when no status is provided.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "text",
      description: 'Status label to display. Falls back to "To-do" when omitted.',
    },
    className: {
      control: "text",
      description: "Additional class names for the outer wrapper.",
    },
  },
  args: {
    status: "In review",
  },
};

export default meta;
type Story = StoryObj<typeof StatusCell>;

/** A custom status label, e.g. a content-edit awaiting review. */
export const Default: Story = {};

/** No status provided — falls back to the default "To-do" label. */
export const DefaultFallback: Story = {
  args: { status: undefined },
};

/** A completed workflow state. */
export const Approved: Story = {
  args: { status: "Approved" },
};

/** A longer status string used for pricing recommendations. */
export const PendingApproval: Story = {
  args: { status: "Pending approval" },
};

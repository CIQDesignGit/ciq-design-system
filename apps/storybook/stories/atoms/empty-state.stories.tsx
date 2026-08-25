import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/atoms/button";
import { EmptyState } from "@/atoms/empty-state";

const meta: Meta<typeof EmptyState> = {
  title: "Atoms/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A simple centered placeholder for when a table, list, or panel has no data -
e.g. no campaigns match the current filters, or no anomalies were detected.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Bold headline text.",
    },
    description: {
      control: "text",
      description: "Supporting text shown below the title.",
    },
    children: {
      control: false,
      description:
        "Optional content rendered below the description, e.g. a call-to-action button.",
    },
    className: {
      control: false,
      description: "Additional class names.",
    },
  },
  args: {
    title: "No campaigns found",
    description: "Try adjusting your filters or date range.",
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

/** Title and description, the most common usage. */
export const Default: Story = {};

/** Title only, no supporting description. */
export const TitleOnly: Story = {
  args: {
    title: "Nothing here yet",
    description: undefined,
  },
};

/** With a call-to-action button below the text. */
export const WithAction: Story = {
  render: (args) => (
    <EmptyState {...args}>
      <Button variant="outline" size="sm">
        Clear filters
      </Button>
    </EmptyState>
  ),
};

/** Empty search results state. */
export const NoSearchResults: Story = {
  args: {
    title: "No ASINs match “wireless earbuds”",
    description: "Check the spelling or try a broader search term.",
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { fn } from "storybook/test";

import { Button } from "@/atoms/button";
import {
  FeedbackPopover,
  FeedbackPopoverGroup,
  type FeedbackTagOption,
} from "@/molecules/feedback";

const POSITIVE_TAGS: FeedbackTagOption[] = [
  { value: "accurate", label: "Accurate data" },
  { value: "actionable", label: "Actionable insight" },
  { value: "fast", label: "Fast to generate" },
];

const NEGATIVE_TAGS: FeedbackTagOption[] = [
  { value: "inaccurate", label: "Inaccurate data" },
  { value: "missing_skus", label: "Missing SKUs" },
  { value: "slow", label: "Too slow" },
];

const meta: Meta<typeof FeedbackPopover> = {
  title: "Molecules/Feedback/FeedbackPopover",
  component: FeedbackPopover,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Popover wrapper around `FeedbackForm`. Use `FeedbackPopoverGroup` when thumbs up and down sit side by side so only one opens at a time.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    sentiment: { control: "inline-radio", options: ["POSITIVE", "NEGATIVE"] },
    tags: {
      control: "select",
      options: ["positive", "negative", "none"],
      mapping: { positive: POSITIVE_TAGS, negative: NEGATIVE_TAGS, none: undefined },
    },
    autoSubmitOnClose: { control: "boolean" },
    align: { control: "inline-radio", options: ["start", "center", "end"] },
    side: { control: "inline-radio", options: ["top", "right", "bottom", "left"] },
    onSubmit: { action: "submit" },
    children: { control: false },
  },
  args: {
    sentiment: "POSITIVE",
    tags: POSITIVE_TAGS,
    autoSubmitOnClose: false,
    align: "end",
    side: "top",
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof FeedbackPopover>;

export const Default: Story = {
  render: (args) => (
    <FeedbackPopover {...args}>
      <Button variant="outline" size="icon" aria-label="Good response" className="h-8 w-8">
        <ThumbsUp className="h-4 w-4" />
      </Button>
    </FeedbackPopover>
  ),
};

export const Negative: Story = {
  render: (args) => (
    <FeedbackPopover {...args}>
      <Button variant="outline" size="icon" aria-label="Bad response" className="h-8 w-8">
        <ThumbsDown className="h-4 w-4" />
      </Button>
    </FeedbackPopover>
  ),
  args: { sentiment: "NEGATIVE", tags: NEGATIVE_TAGS, side: "bottom" },
};

export const AutoSubmitOnClose: Story = {
  render: (args) => (
    <FeedbackPopover {...args}>
      <Button variant="outline" size="icon" aria-label="Good response" className="h-8 w-8">
        <ThumbsUp className="h-4 w-4" />
      </Button>
    </FeedbackPopover>
  ),
  args: { autoSubmitOnClose: true },
};

export const TextTrigger: Story = {
  render: (args) => (
    <FeedbackPopover {...args}>
      <button type="button" className="text-sm font-medium text-violet-700 hover:underline">
        Leave feedback
      </button>
    </FeedbackPopover>
  ),
};

/** Both sentiments in a group — only one popover open at a time. */
export const InGroup: Story = {
  render: () => (
    <FeedbackPopoverGroup>
      <div className="flex items-center gap-2">
        <FeedbackPopover sentiment="POSITIVE" tags={POSITIVE_TAGS} onSubmit={fn()}>
          <Button variant="outline" size="icon" aria-label="Good response" className="h-8 w-8">
            <ThumbsUp className="h-4 w-4" />
          </Button>
        </FeedbackPopover>
        <FeedbackPopover sentiment="NEGATIVE" tags={NEGATIVE_TAGS} onSubmit={fn()}>
          <Button variant="outline" size="icon" aria-label="Bad response" className="h-8 w-8">
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </FeedbackPopover>
      </div>
    </FeedbackPopoverGroup>
  ),
};

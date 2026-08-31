import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import { FeedbackForm } from "@/molecules/feedback";
import type { FeedbackTagOption } from "@/molecules/feedback";

const POSITIVE_TAGS: FeedbackTagOption[] = [
  { value: "accurate", label: "Accurate data" },
  { value: "actionable", label: "Actionable insight" },
  { value: "fast", label: "Fast to generate" },
  { value: "clear_viz", label: "Clear visualization" },
];

const NEGATIVE_TAGS: FeedbackTagOption[] = [
  { value: "inaccurate", label: "Inaccurate data" },
  { value: "missing_skus", label: "Missing SKUs" },
  { value: "slow", label: "Too slow" },
  { value: "confusing", label: "Confusing layout" },
  { value: "wrong_retailer", label: "Wrong retailer" },
];

type ControlledProps = Omit<
  React.ComponentProps<typeof FeedbackForm>,
  "comment" | "onCommentChange" | "selectedTags" | "onTagClick"
> & {
  readonly onCommentChange?: (value: string) => void;
  readonly onTagClick?: (tagValue: string) => void;
};

const ControlledFeedbackForm = (props: ControlledProps) => {
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  return (
    <div className="w-[360px] rounded-xl border border-slate-200 p-3 shadow-sm">
      <FeedbackForm
        {...props}
        comment={comment}
        onCommentChange={(value) => {
          setComment(value);
          props.onCommentChange?.(value);
        }}
        selectedTags={selectedTags}
        onTagClick={(tagValue) => {
          setSelectedTags((prev) =>
            prev.includes(tagValue) ? prev.filter((t) => t !== tagValue) : [...prev, tagValue]
          );
          props.onTagClick?.(tagValue);
        }}
      />
    </div>
  );
};

const meta: Meta<typeof FeedbackForm> = {
  title: "Molecules/Feedback/FeedbackForm",
  component: FeedbackForm,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Thumbs-up/down feedback body: optional tag chips plus a free-text comment box. Used inside `FeedbackPopover`. Inject `onSubmit` — no app feedbackService.",
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
    isSubmitting: { control: "boolean" },
    submitDisabled: { control: "boolean" },
    onSubmit: { action: "submit" },
    onSkip: { action: "skip" },
    selectedTags: { control: false },
    comment: { control: false },
    containerRef: { control: false },
    className: { control: false },
  },
  args: {
    sentiment: "POSITIVE",
    tags: POSITIVE_TAGS,
    isSubmitting: false,
    submitDisabled: false,
    onSubmit: fn(),
    onSkip: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof FeedbackForm>;

export const Default: Story = {
  render: (args) => <ControlledFeedbackForm {...args} />,
};

export const Negative: Story = {
  render: (args) => <ControlledFeedbackForm {...args} />,
  args: { sentiment: "NEGATIVE", tags: NEGATIVE_TAGS },
};

export const WithoutTags: Story = {
  render: (args) => <ControlledFeedbackForm {...args} />,
  args: { tags: undefined },
};

export const Submitting: Story = {
  render: (args) => <ControlledFeedbackForm {...args} />,
  args: { isSubmitting: true },
};

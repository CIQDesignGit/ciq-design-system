import type { Meta, StoryObj } from "@storybook/react-vite";
import { Copy, ThumbsDown, ThumbsUp } from "lucide-react";

import {
  Message,
  MessageAction,
  MessageActions,
  MessageAvatar,
  MessageContent,
} from "@/atoms/message";

// ============================================
// Mock Data
// ============================================

const USER_QUESTION = "What's driving the ACOS spike on B08XYZ1234 this week?";

const ASSISTANT_MARKDOWN_REPLY = `**ACOS on B08XYZ1234 rose from 14.2% to 22.8%** over the last 7 days on Amazon US. Main drivers:

- **CPC increased 18%** on the "wireless headphones" keyword due to increased competitor bidding
- **Conversion rate dropped 9%**, likely tied to a Buy Box loss to a third-party seller
- Spend held steady at roughly **$1,240/day**

Recommended action: review the pricing rule for this ASIN in Amazon Copilot.`;

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof Message> = {
  title: "Atoms/Message",
  component: Message,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
The root container for a single chat message row. Composed with
\`MessageAvatar\`, \`MessageContent\` (plain text or markdown), and
\`MessageActions\` / \`MessageAction\` (tooltip-wrapped action buttons like
copy or thumbs up/down) to build the CommerceIQ Copilot chat experience.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    // ReactNode - composed per-story from MessageAvatar / MessageContent / MessageActions
    children: { control: false },
    // Styling escape hatch
    className: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Message>;

// ============================================
// Stories
// ============================================

/** A user's plain-text question, right-aligned with no avatar. */
export const Default: Story = {
  render: () => (
    <Message className="justify-end">
      <MessageContent className="bg-primary text-primary-foreground">
        {USER_QUESTION}
      </MessageContent>
    </Message>
  ),
};

/** An assistant reply rendered as markdown, with an avatar fallback. */
export const AssistantWithMarkdown: Story = {
  render: () => (
    <Message>
      <MessageAvatar src="" alt="CommerceIQ Copilot" fallback="AI" />
      <MessageContent markdown>{ASSISTANT_MARKDOWN_REPLY}</MessageContent>
    </Message>
  ),
};

/** Message with a row of tooltip-labeled actions: copy, thumbs up, thumbs down. */
export const WithActions: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Message>
        <MessageAvatar src="" alt="CommerceIQ Copilot" fallback="AI" />
        <MessageContent markdown>{ASSISTANT_MARKDOWN_REPLY}</MessageContent>
      </Message>
      <MessageActions className="pl-11">
        <MessageAction tooltip="Copy response">
          <button type="button" aria-label="Copy response" className="rounded p-1 hover:bg-muted">
            <Copy className="h-4 w-4" />
          </button>
        </MessageAction>
        <MessageAction tooltip="Good response">
          <button type="button" aria-label="Good response" className="rounded p-1 hover:bg-muted">
            <ThumbsUp className="h-4 w-4" />
          </button>
        </MessageAction>
        <MessageAction tooltip="Bad response">
          <button type="button" aria-label="Bad response" className="rounded p-1 hover:bg-muted">
            <ThumbsDown className="h-4 w-4" />
          </button>
        </MessageAction>
      </MessageActions>
    </div>
  ),
};

/** Avatar with a real image instead of a text fallback. */
export const WithAvatarImage: Story = {
  render: () => (
    <Message>
      <MessageAvatar
        src="https://i.pravatar.cc/64?img=12"
        alt="Priya Sharma"
        fallback="PS"
      />
      <MessageContent>{"Can you break that down by marketplace?"}</MessageContent>
    </Message>
  ),
};

/** A full back-and-forth exchange combining user and assistant messages. */
export const Conversation: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Message className="justify-end">
        <MessageContent className="bg-primary text-primary-foreground">
          {USER_QUESTION}
        </MessageContent>
      </Message>
      <Message>
        <MessageAvatar src="" alt="CommerceIQ Copilot" fallback="AI" />
        <MessageContent markdown>{ASSISTANT_MARKDOWN_REPLY}</MessageContent>
      </Message>
    </div>
  ),
};

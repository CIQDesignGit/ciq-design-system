import type { Meta, StoryObj } from "@storybook/react-vite";
import { Copy, ThumbsDown, ThumbsUp } from "lucide-react";

import {
  Message,
  MessageAction,
  MessageActions,
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

const DEFAULT_AGENT_AVATAR = {
  src: "",
  alt: "CommerceIQ Copilot",
  fallback: "AI",
} as const;

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
The root container for a single chat message row. Compose with
\`MessageContent\` (plain text or markdown) and optional
\`MessageActions\` / \`MessageAction\`.

Use \`showAvatar\` on \`Message\` to turn the agent avatar on or off
(pass \`avatar\` props to customize src / fallback). You can still compose
\`MessageAvatar\` as a child if you prefer.

\`MessageContent\` variants: \`user\`, \`agent\` (grey bubble), \`agent-plain\` (no background).
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: { control: false },
    className: { control: false },
    showAvatar: {
      control: "boolean",
      description: "Show or hide the agent avatar beside the bubble.",
    },
    avatar: { control: false },
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
      <MessageContent variant="user">{USER_QUESTION}</MessageContent>
    </Message>
  ),
};

/** Agent reply with avatar (showAvatar). */
export const AgentWithAvatar: Story = {
  args: {
    showAvatar: true,
    avatar: DEFAULT_AGENT_AVATAR,
  },
  render: (args) => (
    <Message {...args}>
      <MessageContent markdown>{ASSISTANT_MARKDOWN_REPLY}</MessageContent>
    </Message>
  ),
};

/** Agent reply without avatar — bubble only. */
export const AgentWithoutAvatar: Story = {
  args: {
    showAvatar: false,
  },
  render: (args) => (
    <Message {...args}>
      <MessageContent markdown>{ASSISTANT_MARKDOWN_REPLY}</MessageContent>
    </Message>
  ),
};

/** Agent reply with no bubble background — text only. */
export const AgentPlain: Story = {
  args: {
    showAvatar: true,
    avatar: DEFAULT_AGENT_AVATAR,
  },
  render: (args) => (
    <Message {...args}>
      <MessageContent variant="agent-plain" markdown>
        {ASSISTANT_MARKDOWN_REPLY}
      </MessageContent>
    </Message>
  ),
};

/** Message with a row of tooltip-labeled actions: copy, thumbs up, thumbs down. */
export const WithActions: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Message showAvatar avatar={DEFAULT_AGENT_AVATAR}>
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
    <Message
      showAvatar
      avatar={{
        src: "https://i.pravatar.cc/64?img=12",
        alt: "Priya Sharma",
        fallback: "PS",
      }}
    >
      <MessageContent>{"Can you break that down by marketplace?"}</MessageContent>
    </Message>
  ),
};

/** A full back-and-forth exchange combining user and assistant messages. */
export const Conversation: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Message className="justify-end">
        <MessageContent variant="user">{USER_QUESTION}</MessageContent>
      </Message>
      <Message showAvatar avatar={DEFAULT_AGENT_AVATAR}>
        <MessageContent markdown>{ASSISTANT_MARKDOWN_REPLY}</MessageContent>
      </Message>
      <Message>
        <MessageContent markdown>{ASSISTANT_MARKDOWN_REPLY}</MessageContent>
      </Message>
    </div>
  ),
};

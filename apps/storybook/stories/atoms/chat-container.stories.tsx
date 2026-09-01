import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import {
  ChatContainerContent,
  ChatContainerRoot,
  ChatContainerScrollAnchor,
} from "@/atoms/chat-container";

// ============================================
// Mock Data
// ============================================

const MESSAGES = [
  { id: "msg-1", role: "user", text: "Why did Buy Box win rate drop for B08XYZ1234 last week?" },
  {
    id: "msg-2",
    role: "assistant",
    text: "Buy Box win rate dropped from 96% to 89% between Jul 28 and Aug 3. A competing offer undercut your price by $1.20 on three separate days.",
  },
  { id: "msg-3", role: "user", text: "What do you recommend?" },
  {
    id: "msg-4",
    role: "assistant",
    text: "I'd suggest lowering the price to $24.29, which projects to recover most of the lost Buy Box share while keeping margin above 30%.",
  },
  { id: "msg-5", role: "user", text: "Go ahead and apply that." },
  {
    id: "msg-6",
    role: "assistant",
    text: "Done. The new price of $24.29 is live on Amazon.com. I'll monitor Buy Box share over the next 48 hours and let you know if it needs another adjustment.",
  },
];

function MockMessage({ role, text }: { readonly role: string; readonly text: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2 type-body text-fg-primary ${
          isUser
            ? "rounded-br-[2px] bg-brand-50"
            : "rounded-bl-[2px] bg-surface-muted"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof ChatContainerRoot> = {
  title: "Atoms/ChatContainer",
  component: ChatContainerRoot,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
Scrollable chat message container used by Sales Agent and Content Agent
conversations. Automatically sticks to the bottom as new messages arrive,
unless \`disableStickToBottom\` is set (e.g. once a conversation is complete)
or the customer has scrolled up to read history. Compose it from
\`ChatContainerRoot\`, \`ChatContainerContent\`, and
\`ChatContainerScrollAnchor\`.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: false, // ReactNode composition, see render functions per story
      description: "Chat content, typically a ChatContainerContent.",
    },
    disableStickToBottom: {
      control: "boolean",
      description: "Disable auto-scroll-to-bottom behavior.",
    },
    className: {
      control: false, // styling escape hatch, not meaningful via controls
      description: "Additional class names for the scroll container.",
    },
  },
  args: {
    disableStickToBottom: false,
  },
};

export default meta;
type Story = StoryObj<typeof ChatContainerRoot>;

// ============================================
// Stories
// ============================================

/** A Sales Agent conversation about a Buy Box pricing decision, auto-scrolling to bottom. */
export const Default: Story = {
  render: (args) => (
    <ChatContainerRoot {...args} className="h-[360px] w-[480px] rounded-lg border p-2">
      <ChatContainerContent className="gap-3 p-2">
        {MESSAGES.map((message) => (
          <MockMessage key={message.id} role={message.role} text={message.text} />
        ))}
        <ChatContainerScrollAnchor />
      </ChatContainerContent>
    </ChatContainerRoot>
  ),
};

/** Auto-scroll disabled - useful for a completed/archived conversation the customer is reviewing. */
export const StickToBottomDisabled: Story = {
  args: {
    disableStickToBottom: true,
  },
  render: (args) => (
    <ChatContainerRoot {...args} className="h-[360px] w-[480px] rounded-lg border p-2">
      <ChatContainerContent
        className="gap-3 p-2"
        disableStickToBottom={args.disableStickToBottom}
        onIsAtBottomChange={fn()}
      >
        {MESSAGES.map((message) => (
          <MockMessage key={message.id} role={message.role} text={message.text} />
        ))}
        <ChatContainerScrollAnchor />
      </ChatContainerContent>
    </ChatContainerRoot>
  ),
};

/** Short conversation that doesn't fill the viewport. */
export const ShortConversation: Story = {
  render: (args) => (
    <ChatContainerRoot {...args} className="h-[360px] w-[480px] rounded-lg border p-2">
      <ChatContainerContent className="gap-3 p-2">
        {MESSAGES.slice(0, 2).map((message) => (
          <MockMessage key={message.id} role={message.role} text={message.text} />
        ))}
        <ChatContainerScrollAnchor />
      </ChatContainerContent>
    </ChatContainerRoot>
  ),
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { StickToBottom } from "use-stick-to-bottom";

import { ScrollButton, type ScrollButtonProps } from "@/atoms/scroll-button";

// ============================================
// Mock Data
// ============================================

const CHAT_MESSAGES = [
  { id: 1, from: "user", text: "How is our Amazon ACOS trending this week?" },
  {
    id: 2,
    from: "copilot",
    text: "Amazon ACOS is at 28.6%, up 4.2 points from last week, mainly driven by the Wireless Earbuds Pro campaign.",
  },
  { id: 3, from: "user", text: "What's driving the increase there?" },
  {
    id: 4,
    from: "copilot",
    text: "CPCs rose 22% on the top 5 keywords while conversion rate dropped from 11.2% to 9.4%.",
  },
  { id: 5, from: "user", text: "Should we lower bids?" },
  {
    id: 6,
    from: "copilot",
    text: "I'd recommend lowering bids by 10-15% on the top 3 keywords and reallocating budget to Home Essentials, which is under-pacing at 62%.",
  },
  { id: 7, from: "user", text: "How is Walmart Sponsored Products doing in comparison?" },
  {
    id: 8,
    from: "copilot",
    text: "Walmart ROAS held steady at 5.1x with budget pacing at 88% for the day, no immediate risk.",
  },
  { id: 9, from: "user", text: "And Target?" },
  {
    id: 10,
    from: "copilot",
    text: "Target is pacing slightly ahead at 101% of daily budget with a 6.3x ROAS - within a healthy range.",
  },
];

// ============================================
// Chat Demo
// ============================================

type ScrollButtonDemoArgs = {
  readonly variant?: ScrollButtonProps["variant"];
  readonly size?: ScrollButtonProps["size"];
  readonly disabled?: boolean;
};

/**
 * ScrollButton reads scroll position from the nearest use-stick-to-bottom context, so it
 * must be rendered inside a <StickToBottom> container (see chat-container.tsx for the
 * production wrapper). `initial={false}` keeps the demo scrolled to the top so the button
 * is visible without needing to scroll manually.
 */
const ChatWithScrollButtonDemo = (args: ScrollButtonDemoArgs) => (
  <StickToBottom
    initial={false}
    resize="smooth"
    className="relative h-72 w-96 overflow-y-auto rounded-lg border border-slate-200 bg-white"
  >
    <StickToBottom.Content className="flex flex-col gap-3 p-4">
      {CHAT_MESSAGES.map((message) => (
        <div
          key={message.id}
          className={
            message.from === "user"
              ? "ml-auto max-w-[80%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground"
              : "mr-auto max-w-[80%] rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-800"
          }
        >
          {message.text}
        </div>
      ))}
    </StickToBottom.Content>
    <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2">
      <ScrollButton
        variant={args.variant}
        size={args.size}
        disabled={args.disabled}
        aria-label="Scroll to latest message"
      />
    </div>
  </StickToBottom>
);

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof ScrollButton> = {
  title: "Atoms/ScrollButton",
  component: ScrollButton,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A floating "scroll to bottom" button for chat/conversation panes. It reads its visibility
from the nearest \`use-stick-to-bottom\` context (isAtBottom) and fades out once the user has
scrolled to the latest message, so it must always be rendered inside a \`<StickToBottom>\`
container (see \`chat-container.tsx\`). Extends all native \`<button>\` attributes.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link", "card"],
      description: "Visual style, forwarded to the underlying Button component.",
    },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg", "icon"],
      description: "Size, forwarded to the underlying Button component.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the button (native <button> attribute).",
    },
    className: {
      control: false, // Tailwind class override, not meaningful as a live control
      description: "Additional class names merged with the default floating/animation styles.",
    },
  },
  args: {
    variant: "outline",
    size: "sm",
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof ScrollButton>;

// ============================================
// Stories
// ============================================

/**
 * Scroll the chat pane up to reveal the button - it fades back out once you're at the bottom.
 */
export const Default: Story = {
  render: (args) => <ChatWithScrollButtonDemo {...args} />,
};

/** Solid/primary styling for higher visual prominence. */
export const DefaultVariant: Story = {
  render: (args) => <ChatWithScrollButtonDemo {...args} />,
  args: { variant: "default" },
};

/** Larger size for touch-friendly or high-density layouts. */
export const LargeSize: Story = {
  render: (args) => <ChatWithScrollButtonDemo {...args} />,
  args: { size: "lg" },
};

/** Disabled state. */
export const Disabled: Story = {
  render: (args) => <ChatWithScrollButtonDemo {...args} />,
  args: { disabled: true },
};

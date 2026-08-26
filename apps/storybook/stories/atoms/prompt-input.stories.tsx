import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowUp, Paperclip, Square } from "lucide-react";
import { useState } from "react";
import { fn } from "storybook/test";

import { Button } from "@/atoms/button";

import { PromptInput, PromptInputAction, PromptInputActions, PromptInputTextarea } from "@/atoms/prompt-input";

// ============================================
// Mock Data
// ============================================

const PREFILLED_QUESTION =
  "Why did ACOS increase for the Amazon Wireless Earbuds campaign this week?";

// ============================================
// Copilot Prompt Demo
// ============================================

type PromptInputDemoArgs = {
  readonly isLoading?: boolean;
  readonly value?: string;
  readonly maxHeight?: number | string;
  readonly disabled?: boolean;
  readonly onValueChange?: (value: string) => void;
  readonly onSubmit?: () => void;
};

/**
 * Composes the real PromptInput sub-components into a CommerceIQ Copilot-style
 * chat input: an auto-resizing textarea plus an attach and send/stop action.
 */
const CopilotPromptDemo = (args: PromptInputDemoArgs) => {
  const [value, setValue] = useState(args.value ?? "");

  return (
    <div className="w-[480px]">
      <PromptInput
        isLoading={args.isLoading}
        maxHeight={args.maxHeight}
        disabled={args.disabled}
        value={value}
        onValueChange={(newValue) => {
          setValue(newValue);
          args.onValueChange?.(newValue);
        }}
        onSubmit={() => {
          args.onSubmit?.();
          setValue("");
        }}
      >
        <PromptInputTextarea placeholder="Ask Copilot about ACOS, ROAS, or budget pacing..." />
        <PromptInputActions className="justify-end pt-2">
          <PromptInputAction tooltip="Attach a report">
            <Button variant="ghost" size="icon" className="h-8 w-8" type="button">
              <Paperclip className="h-4 w-4" />
            </Button>
          </PromptInputAction>
          <PromptInputAction tooltip={args.isLoading ? "Stop generating" : "Send message"}>
            <Button
              size="icon"
              className="h-8 w-8 rounded-full"
              type="button"
              disabled={!args.isLoading && value.trim().length === 0}
            >
              {args.isLoading ? <Square className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
            </Button>
          </PromptInputAction>
        </PromptInputActions>
      </PromptInput>
    </div>
  );
};

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof PromptInput> = {
  title: "Atoms/PromptInput",
  component: PromptInput,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A compound chat input used for CommerceIQ Copilot-style prompts. \`PromptInput\` is the
container that manages value state, auto-resize height, and Enter-to-submit behavior.
Compose it with:
- **PromptInputTextarea**: auto-resizing textarea that submits on Enter (Shift+Enter for a newline)
- **PromptInputActions**: a flex row for toolbar buttons
- **PromptInputAction**: a tooltip-wrapped action button (e.g. attach, send, stop)
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isLoading: {
      control: "boolean",
      description:
        "Shows a loading/streaming state. While true, pressing Enter no longer submits.",
    },
    value: {
      control: "text",
      description:
        "Controlled textarea value. When provided alongside onValueChange, PromptInput is fully controlled.",
    },
    onValueChange: {
      control: false, // callback - fires with the new textarea value on every keystroke
      description: "Called with the new value whenever the textarea content changes.",
    },
    maxHeight: {
      control: "number",
      description:
        "Maximum height (px, or any CSS length string) the textarea grows to before scrolling.",
    },
    onSubmit: {
      control: false, // callback - fires on Enter (without Shift)
      description: "Called when the user presses Enter without Shift to submit the prompt.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the input, blocking focus, typing, and submission.",
    },
    className: {
      control: false, // Tailwind class override for the outer container, not meaningful as a live control
      description: "Additional class names applied to the outer container.",
    },
    children: {
      control: false, // composed from PromptInputTextarea / PromptInputActions / PromptInputAction
      description: "The PromptInput sub-components that make up the input (textarea, actions).",
    },
  },
  args: {
    isLoading: false,
    disabled: false,
    maxHeight: 240,
    value: "",
    onValueChange: fn(),
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof PromptInput>;

// ============================================
// Stories
// ============================================

/**
 * Default Copilot prompt input. Type a question and press Enter to submit.
 */
export const Default: Story = {
  render: (args) => <CopilotPromptDemo {...args} />,
};

/** Pre-filled with a question, ready to submit. */
export const WithPrefilledValue: Story = {
  render: (args) => <CopilotPromptDemo {...args} />,
  args: {
    value: PREFILLED_QUESTION,
  },
};

/** Loading state: Enter no longer submits and the send button becomes a stop button. */
export const Loading: Story = {
  render: (args) => <CopilotPromptDemo {...args} />,
  args: {
    value: PREFILLED_QUESTION,
    isLoading: true,
  },
};

/** Disabled input, e.g. while Copilot access is being provisioned. */
export const Disabled: Story = {
  render: (args) => <CopilotPromptDemo {...args} />,
  args: {
    disabled: true,
  },
};

/** A smaller maxHeight causes the textarea to scroll sooner on long messages. */
export const CustomMaxHeight: Story = {
  render: (args) => <CopilotPromptDemo {...args} />,
  args: {
    maxHeight: 80,
    value:
      "Compare Amazon and Walmart ROAS for the last 30 days, broken out by campaign type, and flag any campaigns where ACOS is trending above target.",
  },
};

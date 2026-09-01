import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ArrowUp,
  BookOpen,
  CornerDownRight,
  Globe,
  Paperclip,
  Plus,
  Square,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { fn } from "storybook/test";

import { Button } from "@/atoms/button";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputHeader,
  PromptInputLeading,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  PromptInputTrailing,
} from "@/atoms/prompt-input";

// ============================================
// Shared bits
// ============================================

const toolChipClass =
  "inline-flex h-8 items-center gap-1.5 rounded-full border border-border-default bg-surface px-3 type-caption-strong text-fg-secondary hover:bg-surface-muted";

function ToolChip({
  icon,
  label,
}: {
  readonly icon: ReactNode;
  readonly label: string;
}) {
  return (
    <button type="button" className={toolChipClass}>
      {icon}
      {label}
    </button>
  );
}

function DefaultTools() {
  return (
    <PromptInputTools>
      <PromptInputAction tooltip="Attach a file">
        <ToolChip icon={<Paperclip className="size-3.5" />} label="Attach" />
      </PromptInputAction>
      <PromptInputAction tooltip="Search the web">
        <ToolChip icon={<Globe className="size-3.5" />} label="Search" />
      </PromptInputAction>
      <PromptInputAction tooltip="Study mode">
        <ToolChip icon={<BookOpen className="size-3.5" />} label="Study" />
      </PromptInputAction>
    </PromptInputTools>
  );
}

type DemoArgs = {
  readonly isLoading?: boolean;
  readonly value?: string;
  readonly maxHeight?: number | string;
  readonly disabled?: boolean;
  readonly onValueChange?: (value: string) => void;
  readonly onSubmit?: () => void;
};

function useDemoState(args: DemoArgs) {
  const [value, setValue] = useState(args.value ?? "");
  return {
    inputProps: {
      isLoading: args.isLoading,
      maxHeight: args.maxHeight,
      disabled: args.disabled,
      value,
      onValueChange: (next: string) => {
        setValue(next);
        args.onValueChange?.(next);
      },
      onSubmit: () => {
        args.onSubmit?.();
        setValue("");
      },
    },
  };
}

function CompactDemo({
  args,
  placeholder = "Ask anything",
}: {
  readonly args: DemoArgs;
  readonly placeholder?: string;
}) {
  const { inputProps } = useDemoState(args);
  return (
    <div className="w-[560px]">
      <PromptInput {...inputProps} variant="compact">
        <PromptInputLeading>
          <PromptInputAction tooltip="Add">
            <Button variant="ghost" size="icon" className="size-8" type="button">
              <Plus className="size-4" />
            </Button>
          </PromptInputAction>
        </PromptInputLeading>
        <PromptInputTextarea placeholder={placeholder} />
        <PromptInputTrailing>
          <PromptInputSubmit aria-label={args.isLoading ? "Stop generating" : "Send"}>
            {args.isLoading ? (
              <Square className="size-3.5 fill-current" />
            ) : (
              <ArrowUp />
            )}
          </PromptInputSubmit>
        </PromptInputTrailing>
      </PromptInput>
    </div>
  );
}

function StackedToolsDemo({
  args,
  header,
}: {
  readonly args: DemoArgs;
  readonly header?: ReactNode;
}) {
  const { inputProps } = useDemoState(args);
  return (
    <div className="w-[520px]">
      <PromptInput {...inputProps} variant="stacked">
        {header}
        <PromptInputTextarea placeholder="Ask anything" />
        <PromptInputActions className="justify-between pt-1">
          <DefaultTools />
          <PromptInputSubmit variant="pill" label="Send" aria-label="Send">
            <ArrowUp />
          </PromptInputSubmit>
        </PromptInputActions>
      </PromptInput>
    </div>
  );
}

function ContextBannerDemo({ args }: { readonly args: DemoArgs }) {
  const [context, setContext] = useState<string | null>("Text");
  return (
    <StackedToolsDemo
      args={args}
      header={
        context ? (
          <PromptInputHeader
            variant="banner"
            icon={<CornerDownRight />}
            onDismiss={() => setContext(null)}
          >
            {context}
          </PromptInputHeader>
        ) : null
      }
    />
  );
}

// ============================================
// Story config
// ============================================

const meta: Meta<typeof PromptInput> = {
  title: "Atoms/PromptInput",
  component: PromptInput,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
Compound chat prompt input.

**Layout variants** on \`PromptInput\`:
- \`compact\` — single pill row (leading + textarea + trailing / submit)
- \`stacked\` — taller card (optional header, textarea, tools + submit)

**Header variants** on \`PromptInputHeader\`:
- \`banner\` — muted full-width context strip with dismiss
- \`chip\` — bordered context chip

\`PromptInputSubmit\` is the send control (\`icon\` round or \`pill\` labeled).
Enter submits; Shift+Enter inserts a newline.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["compact", "stacked"],
    },
    isLoading: { control: "boolean" },
    value: { control: "text" },
    onValueChange: { control: false },
    maxHeight: { control: "number" },
    onSubmit: { control: false },
    disabled: { control: "boolean" },
    className: { control: false },
    children: { control: false },
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
// Variants from design
// ============================================

/** Slim single-line bar: + | Ask anything | mic + send */
export const Compact: Story = {
  render: (args) => <CompactDemo args={args} />,
};

/** Stacked card with Attach / Search / Study tools + send pill */
export const WithTools: Story = {
  name: "With tools",
  render: (args) => <StackedToolsDemo args={args} />,
};

/** Context banner (reply-to) above the prompt */
export const WithContextBanner: Story = {
  name: "With context banner",
  render: (args) => <ContextBannerDemo args={args} />,
};

/** Framed context chip above the prompt */
export const WithContextChip: Story = {
  name: "With context chip",
  render: (args) => (
    <StackedToolsDemo
      args={args}
      header={
        <PromptInputHeader
          variant="chip"
          icon={<Square className="size-3.5" />}
          showDismiss={false}
        >
          Text
        </PromptInputHeader>
      }
    />
  ),
};

/** Compact edit / describe mode (same layout, different placeholder) */
export const EditMode: Story = {
  name: "Edit mode",
  render: (args) => (
    <CompactDemo
      args={args}
      placeholder="Describe what you want to add, remove or re-edit"
    />
  ),
};

// ============================================
// State stories
// ============================================

/** Pre-filled stacked input ready to submit */
export const WithPrefilledValue: Story = {
  render: (args) => <StackedToolsDemo args={args} />,
  args: {
    value: "Why did ACOS increase for the Amazon Wireless Earbuds campaign this week?",
  },
};

/** Loading: Enter does not submit; show stop affordance in the send button */
export const Loading: Story = {
  render: (args) => <CompactDemo args={args} />,
  args: {
    value: "Summarize last week's ACOS drivers",
    isLoading: true,
  },
};

/** Disabled input */
export const Disabled: Story = {
  render: (args) => <CompactDemo args={args} />,
  args: {
    disabled: true,
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo } from "react";
import { fn } from "storybook/test";

import { ResponseStream } from "@/atoms/response-stream";

// ============================================
// Mock Data
// ============================================

const COPILOT_RESPONSE = `Your Amazon ACOS increased 4.2 percentage points to 28.6% this week, driven mainly by rising CPCs on the "Wireless Earbuds Pro" campaign. Impressions grew 18% but conversion rate slipped from 11.2% to 9.4%. ROAS for Walmart Sponsored Products held steady at 5.1x. I'd recommend lowering bids on the top 3 keywords in Wireless Earbuds Pro and reallocating ~$1,200 of daily budget to the Home Essentials campaign, which is currently under-pacing at 62% of budget with a 6.8x ROAS.`;

const COPILOT_SHORT_UPDATE = `Budget pacing looks healthy across all retailers today: Amazon at 94%, Walmart at 88%, and Target at 101%. No campaigns are at risk of overspend.`;

// Simulates a token-by-token API stream, similar to how a real Copilot response
// would arrive over server-sent events.
async function* mockTokenStream(text: string, delayMs = 60): AsyncGenerator<string> {
  const words = text.split(" ");
  for (const word of words) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    yield `${word} `;
  }
}

// ============================================
// Async Stream Demo
// ============================================

/**
 * Wraps a fresh async generator on every mount so the story can be replayed
 * by navigating away and back (generators can only be consumed once).
 */
const AsyncStreamDemo = (args: { mode?: "typewriter" | "fade"; onComplete?: () => void }) => {
  const stream = useMemo(() => mockTokenStream(COPILOT_SHORT_UPDATE), []);
  return (
    <ResponseStream
      textStream={stream}
      mode={args.mode}
      onComplete={args.onComplete}
      className="text-sm text-slate-800"
    />
  );
};

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof ResponseStream> = {
  title: "Atoms/ResponseStream",
  component: ResponseStream,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
Renders streaming AI/Copilot answers with a typewriter or fade-in-word animation. Accepts
either a plain string (animated locally) or an \`AsyncIterable<string>\` (e.g. tokens arriving
from a server-sent-events stream). Use \`speed\` for a simple 1-100 dial, or the \`fadeDuration\`
/ \`segmentDelay\` / \`characterChunkSize\` overrides for fine control.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    textStream: {
      control: "text",
      description:
        "Text to stream in. Also accepts an AsyncIterable<string> for real token streams (see the AsyncIterableStream story).",
    },
    mode: {
      control: "inline-radio",
      options: ["typewriter", "fade"],
      description: "Animation style: character-by-character typewriter, or word-by-word fade-in.",
    },
    speed: {
      control: { type: "number", min: 1, max: 100 },
      description: "Overall animation speed from 1 (slowest) to 100 (fastest).",
    },
    className: {
      control: false, // Tailwind class override, not meaningful as a live control
      description: "Additional class names applied to the rendered container element.",
    },
    onComplete: {
      control: false, // callback
      description: "Called once the full text has finished streaming/animating in.",
    },
    as: {
      control: "select",
      options: ["div", "p", "span", "h3"],
      description: "HTML element type to render the streamed text in.",
    },
    fadeDuration: {
      control: "number",
      description: "Overrides the speed-derived fade-in duration (ms). Only used in fade mode.",
    },
    segmentDelay: {
      control: "number",
      description: "Overrides the speed-derived delay (ms) between word segments in fade mode.",
    },
    characterChunkSize: {
      control: "number",
      description:
        "Overrides the speed-derived number of characters revealed per frame in typewriter mode.",
    },
  },
  args: {
    textStream: COPILOT_RESPONSE,
    mode: "typewriter",
    speed: 20,
    as: "div",
    className: "text-sm text-slate-800",
    onComplete: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ResponseStream>;

// ============================================
// Stories
// ============================================

/** Default typewriter animation of a Copilot performance answer. */
export const Default: Story = {};

/** Word-by-word fade-in animation instead of character typewriter. */
export const FadeMode: Story = {
  args: {
    mode: "fade",
  },
};

/** A much faster typewriter speed, useful for long answers. */
export const FastSpeed: Story = {
  args: {
    speed: 90,
  },
};

/** Overrides the derived chunk size to reveal 4 characters per frame regardless of speed. */
export const CustomChunkSize: Story = {
  args: {
    characterChunkSize: 4,
  },
};

/** Streams from a real AsyncIterable<string>, simulating tokens arriving over the wire. */
export const AsyncIterableStream: Story = {
  render: (args) => <AsyncStreamDemo mode={args.mode} onComplete={args.onComplete} />,
};

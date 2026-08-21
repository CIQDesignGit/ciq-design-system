import type { Meta, StoryObj } from "@storybook/react-vite";

import { TokenPage, TokenSection } from "./helpers";

const motions = [
  {
    name: "shimmer",
    className: "animate-shimmer",
    note: "1.6s linear infinite. Also used as animate-[shimmer_4s_infinite_linear] on text loaders.",
  },
  {
    name: "spinner-fade",
    className: "animate-[spinner-fade_1s_linear_infinite]",
    note: "Opacity 1 → 0.15. Classic spinner ticks.",
  },
  {
    name: "thin-pulse",
    className: "animate-[thin-pulse_1.2s_ease-in-out_infinite]",
    note: "Scale + opacity pulse.",
  },
  {
    name: "pulse-dot",
    className: "animate-[pulse-dot_1s_ease-in-out_infinite]",
    note: "Dot scales down to 0.6.",
  },
  {
    name: "bounce-dots",
    className: "animate-[bounce-dots_1.4s_ease-in-out_infinite]",
    note: "Dots hop 4px. Stagger with animation-delay.",
  },
  {
    name: "typing",
    className: "animate-[typing_1.4s_ease-in-out_infinite]",
    note: "Chat typing indicator.",
  },
  {
    name: "wave",
    className: "animate-[wave_1s_ease-in-out_infinite]",
    note: "Scale Y 0.5 → 1.",
  },
  {
    name: "wave-bars",
    className: "animate-[wave-bars_1s_ease-in-out_infinite]",
    note: "Equalizer bars. Scale Y 0.4 → 1.",
  },
  {
    name: "blink",
    className: "animate-[blink_1s_step-end_infinite]",
    note: "On/off cursor blink.",
  },
  {
    name: "text-blink",
    className: "animate-[text-blink_1.2s_ease-in-out_infinite]",
    note: "Opacity 1 → 0.35.",
  },
  {
    name: "loading-dots",
    className: "animate-[loading-dots_1.4s_infinite]",
    note: "Ellipsis dots appearing in sequence.",
  },
] as const;

function MotionPage() {
  return (
    <TokenPage
      title="Motion"
      description="Keyframes live in theme.css. Only shimmer has a named utility class (animate-shimmer). Everything else is used as animate-[name_duration]."
    >
      <TokenSection title="Keyframes">
        <div className="grid gap-3 sm:grid-cols-2">
          {motions.map((motion) => (
            <div
              key={motion.name}
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
            >
              <div
                className={`${motion.className} size-10 shrink-0 rounded-md bg-primary`}
              />
              <div className="min-w-0">
                <p className="font-mono text-sm font-medium">{motion.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {motion.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </TokenSection>
    </TokenPage>
  );
}

const meta = {
  title: "Foundations/Motion",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  render: () => <MotionPage />,
};

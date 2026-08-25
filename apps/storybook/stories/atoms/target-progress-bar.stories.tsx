import type { Meta, StoryObj } from "@storybook/react-vite";

import { type ProgressSegment,TargetProgressBar } from "@/atoms/target-progress-bar";

// ============================================
// Mock Data
// ============================================

const BUDGET_PACING_SEGMENTS: ProgressSegment[] = [
  { label: "Spent", value: 68, color: "bg-emerald-500" },
  { label: "Budget", value: 100, color: "bg-slate-200" },
];

const GOAL_EXCEEDED_SEGMENTS: ProgressSegment[] = [
  { label: "Revenue", value: 125000, color: "bg-primary" },
  { label: "Goal", value: 100000, color: "bg-slate-200" },
];

const LOW_PROGRESS_SEGMENTS: ProgressSegment[] = [
  { label: "Impressions delivered", value: 12000, color: "bg-amber-500" },
  { label: "Target", value: 100000, color: "bg-slate-200" },
];

const ACOS_SEGMENTS: ProgressSegment[] = [
  { label: "Current ACOS", value: 18, color: "bg-sky-500" },
  { label: "Target ACOS", value: 25, color: "bg-slate-200" },
];

const CURRENCY_FORMAT = (v: number): string => `$${v.toLocaleString()}`;
const PERCENT_FORMAT = (v: number): string => `${v}%`;

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof TargetProgressBar> = {
  title: "Atoms/TargetProgressBar",
  component: TargetProgressBar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A two-segment progress bar showing an "achieved" value against a "target" value — e.g. budget spent vs.
budget, or revenue vs. goal. Pass exactly two segments as \`[achieved, target]\`: when achieved meets or
exceeds the target, the bar renders as a single full-width segment in the achieved color; otherwise it
splits into an achieved segment and a remaining-to-target segment, separated by a small divider tick.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    segments: {
      control: false, // exactly two ProgressSegment objects — [achieved, target], varied per story
      description:
        "Tuple of exactly two segments: [achieved, target]. Each has a label, numeric value, and a Tailwind background color class.",
    },
    showLabels: {
      control: "boolean",
      description: "Show the label + formatted value beneath the bar for each segment.",
    },
    formatValue: {
      control: false, // (value: number) => string — formatting callback
      description: "Formats each segment's value when `showLabels` is true. Defaults to `toLocaleString()`.",
    },
    height: {
      control: "select",
      options: ["h-1", "h-1.5", "h-2", "h-3", "h-4"],
      description: "Tailwind height class applied to the bar.",
    },
  },
  args: {
    segments: BUDGET_PACING_SEGMENTS,
    showLabels: true,
    height: "h-2",
  },
};

export default meta;
type Story = StoryObj<typeof TargetProgressBar>;

// ============================================
// Stories
// ============================================

/** Budget pacing: 68 of 100 spent, rendered as achieved + remaining-to-target segments. */
export const Default: Story = {};

/** When achieved meets or exceeds the target, the bar renders as a single full-width segment. */
export const GoalExceeded: Story = {
  args: {
    segments: GOAL_EXCEEDED_SEGMENTS,
    formatValue: CURRENCY_FORMAT,
  },
};

/** `showLabels={false}` renders just the bar, with no label row beneath it. */
export const WithoutLabels: Story = {
  args: {
    showLabels: false,
  },
};

/** A thicker bar (`h-4`) for early-stage progress, e.g. impressions delivered vs. a flight target. */
export const ThickBar: Story = {
  args: {
    segments: LOW_PROGRESS_SEGMENTS,
    height: "h-4",
    formatValue: CURRENCY_FORMAT,
  },
};

/** Custom `formatValue` renders each segment's value as a percentage, e.g. ACOS vs. target ACOS. */
export const CustomFormatting: Story = {
  args: {
    segments: ACOS_SEGMENTS,
    formatValue: PERCENT_FORMAT,
  },
};

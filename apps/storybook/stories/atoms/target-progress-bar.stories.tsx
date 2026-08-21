import type { Meta, StoryObj } from "@storybook/react-vite";
import { TargetProgressBar } from "@/atoms/target-progress-bar";

const meta: Meta<typeof TargetProgressBar> = {
  title: "Atoms/TargetProgressBar",
  component: TargetProgressBar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TargetProgressBar>;

export const Default: Story = { args: { showLabels: true, segments: [{ label: "Spent", value: 68, color: "bg-emerald-500" }, { label: "Budget", value: 100, color: "bg-slate-200" }] } };

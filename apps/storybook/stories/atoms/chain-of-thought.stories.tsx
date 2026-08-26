import type { Meta, StoryObj } from "@storybook/react-vite";
import { Search, Sparkles, TrendingUp } from "lucide-react";

import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtItem,
  ChainOfThoughtStep,
  ChainOfThoughtTrigger,
} from "@/atoms/chain-of-thought";

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof ChainOfThought> = {
  title: "Atoms/ChainOfThought",
  component: ChainOfThought,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
Renders a vertical, connected trail of collapsible reasoning steps - used to
show how an agent (e.g. Sales Agent or Content Agent) arrived at a
recommendation. Compose each step from \`ChainOfThoughtStep\`,
\`ChainOfThoughtTrigger\`, and \`ChainOfThoughtContent\`; \`ChainOfThought\`
automatically marks the last step so the connecting line stops correctly.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: false, // must be ChainOfThoughtStep elements for the connector logic to work
      description: "One or more ChainOfThoughtStep elements.",
    },
    className: {
      control: false, // styling escape hatch, not meaningful via controls
      description: "Additional class names for the root element.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChainOfThought>;

// ============================================
// Stories
// ============================================

/** A typical 3-step reasoning trail for a Sales Agent price recommendation. */
export const Default: Story = {
  render: () => (
    <div className="w-[420px]">
      <ChainOfThought>
        <ChainOfThoughtStep>
          <ChainOfThoughtTrigger leftIcon={<Search className="size-4" />}>
            Reviewed Buy Box history for B08XYZ1234
          </ChainOfThoughtTrigger>
          <ChainOfThoughtContent>
            <ChainOfThoughtItem>
              Lost Buy Box to a third-party seller 3 times in the last 7 days, each time within
              $0.50 of the listed price.
            </ChainOfThoughtItem>
          </ChainOfThoughtContent>
        </ChainOfThoughtStep>

        <ChainOfThoughtStep>
          <ChainOfThoughtTrigger leftIcon={<TrendingUp className="size-4" />}>
            Analyzed competitor pricing trend
          </ChainOfThoughtTrigger>
          <ChainOfThoughtContent>
            <ChainOfThoughtItem>
              Competing offer has trended down 4.2% over the past two weeks, currently at $24.49.
            </ChainOfThoughtItem>
          </ChainOfThoughtContent>
        </ChainOfThoughtStep>

        <ChainOfThoughtStep>
          <ChainOfThoughtTrigger leftIcon={<Sparkles className="size-4" />} showExpandIcon>
            Recommendation: lower price to $24.29
          </ChainOfThoughtTrigger>
          <ChainOfThoughtContent>
            <ChainOfThoughtItem>
              Projected to recover Buy Box share while maintaining a 31% margin.
            </ChainOfThoughtItem>
          </ChainOfThoughtContent>
        </ChainOfThoughtStep>
      </ChainOfThought>
    </div>
  ),
};

/** Single step, expanded by default. */
export const SingleStep: Story = {
  render: () => (
    <div className="w-[420px]">
      <ChainOfThought>
        <ChainOfThoughtStep defaultOpen>
          <ChainOfThoughtTrigger>Checked inventory levels for SKU-00482</ChainOfThoughtTrigger>
          <ChainOfThoughtContent>
            <ChainOfThoughtItem>
              412 units on hand, 18 days of cover at current sell-through rate.
            </ChainOfThoughtItem>
          </ChainOfThoughtContent>
        </ChainOfThoughtStep>
      </ChainOfThought>
    </div>
  ),
};

/** A disabled step trigger, used while a step is still being computed. */
export const DisabledStep: Story = {
  render: () => (
    <div className="w-[420px]">
      <ChainOfThought>
        <ChainOfThoughtStep>
          <ChainOfThoughtTrigger leftIcon={<Search className="size-4" />}>
            Reviewed Buy Box history
          </ChainOfThoughtTrigger>
          <ChainOfThoughtContent>
            <ChainOfThoughtItem>Buy Box currently held.</ChainOfThoughtItem>
          </ChainOfThoughtContent>
        </ChainOfThoughtStep>

        <ChainOfThoughtStep>
          <ChainOfThoughtTrigger disabled leftIcon={<TrendingUp className="size-4" />}>
            Analyzing competitor pricing... (pending)
          </ChainOfThoughtTrigger>
          <ChainOfThoughtContent>
            <ChainOfThoughtItem>Not yet available.</ChainOfThoughtItem>
          </ChainOfThoughtContent>
        </ChainOfThoughtStep>
      </ChainOfThought>
    </div>
  ),
};

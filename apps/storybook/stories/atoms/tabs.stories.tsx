import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/atoms/tabs";

const meta: Meta<typeof Tabs> = {
  title: "Atoms/Tabs",
  component: Tabs,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A Radix-based tab set (`Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`) for switching between related views without navigating away.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    defaultValue: {
      control: "text",
      description: "Value of the tab selected by default (uncontrolled usage).",
    },
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      description: "Layout axis for keyboard navigation between tabs.",
    },
    value: { control: false },
    onValueChange: { control: false },
    children: { control: false },
  },
  args: {
    defaultValue: "amazon",
    orientation: "horizontal",
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

/** Marketplace performance breakdown. */
export const Default: Story = {
  render: (args) => (
    <Tabs {...args} className="w-[420px]">
      <TabsList>
        <TabsTrigger value="amazon">Amazon</TabsTrigger>
        <TabsTrigger value="walmart">Walmart</TabsTrigger>
        <TabsTrigger value="instacart">Instacart</TabsTrigger>
      </TabsList>
      <TabsContent
        value="amazon"
        className="rounded-lg border p-4 text-sm text-slate-700"
      >
        Revenue: $84.2K · Buy box: 94% · ACOS: 12.8%
      </TabsContent>
      <TabsContent
        value="walmart"
        className="rounded-lg border p-4 text-sm text-slate-700"
      >
        Revenue: $31.6K · Buy box: 87% · ACOS: 15.4%
      </TabsContent>
      <TabsContent
        value="instacart"
        className="rounded-lg border p-4 text-sm text-slate-700"
      >
        Revenue: $9.1K · Buy box: 91% · ACOS: 18.0%
      </TabsContent>
    </Tabs>
  ),
};

/** Starts on the second tab (Walmart). */
export const DifferentDefaultTab: Story = {
  args: { defaultValue: "walmart" },
  render: (args) => (
    <Tabs {...args} className="w-[420px]">
      <TabsList>
        <TabsTrigger value="amazon">Amazon</TabsTrigger>
        <TabsTrigger value="walmart">Walmart</TabsTrigger>
        <TabsTrigger value="instacart">Instacart</TabsTrigger>
      </TabsList>
      <TabsContent
        value="amazon"
        className="rounded-lg border p-4 text-sm text-slate-700"
      >
        Revenue: $84.2K · Buy box: 94% · ACOS: 12.8%
      </TabsContent>
      <TabsContent
        value="walmart"
        className="rounded-lg border p-4 text-sm text-slate-700"
      >
        Revenue: $31.6K · Buy box: 87% · ACOS: 15.4%
      </TabsContent>
      <TabsContent
        value="instacart"
        className="rounded-lg border p-4 text-sm text-slate-700"
      >
        Revenue: $9.1K · Buy box: 91% · ACOS: 18.0%
      </TabsContent>
    </Tabs>
  ),
};

/** A tab disabled because that integration hasn't been connected yet. */
export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="amazon" className="w-[420px]">
      <TabsList>
        <TabsTrigger value="amazon">Amazon</TabsTrigger>
        <TabsTrigger value="walmart">Walmart</TabsTrigger>
        <TabsTrigger value="target" disabled>
          Target Plus
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="amazon"
        className="rounded-lg border p-4 text-sm text-slate-700"
      >
        Revenue: $84.2K · Buy box: 94% · ACOS: 12.8%
      </TabsContent>
      <TabsContent
        value="walmart"
        className="rounded-lg border p-4 text-sm text-slate-700"
      >
        Revenue: $31.6K · Buy box: 87% · ACOS: 15.4%
      </TabsContent>
      <TabsContent
        value="target"
        className="rounded-lg border p-4 text-sm text-slate-700"
      >
        Not connected yet.
      </TabsContent>
    </Tabs>
  ),
};

/** Only two tabs. */
export const TwoTabs: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[360px]">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
      </TabsList>
      <TabsContent
        value="overview"
        className="rounded-lg border p-4 text-sm text-slate-700"
      >
        Campaign &quot;Q3 Home &amp; Garden Push&quot; is on track, spending
        $412/day.
      </TabsContent>
      <TabsContent
        value="details"
        className="rounded-lg border p-4 text-sm text-slate-700"
      >
        Bid strategy: Dynamic bids (down only) · Budget: $12,500/month
      </TabsContent>
    </Tabs>
  ),
};

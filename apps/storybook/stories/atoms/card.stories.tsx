import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "@/atoms/badge";
import { Button } from "@/atoms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/atoms/card";

const meta: Meta<typeof Card> = {
  title: "Atoms/Card",
  component: Card,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A generic content container with optional header, title/description, body,
and footer sections. Used throughout dashboards for metric summaries,
ASIN detail panels, and settings sections. Compose it from \`CardHeader\`,
\`CardTitle\`, \`CardDescription\`, \`CardContent\`, and \`CardFooter\`.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: false,
      description: "Additional class names for the card root.",
    },
    children: {
      control: false,
      description: "Card content, typically CardHeader/CardContent/CardFooter.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

/** Full card with header, title, description, content, and footer. */
export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-[380px]">
      <CardHeader>
        <CardTitle>Buy Box win rate</CardTitle>
        <CardDescription>Amazon.com - last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold">94.2%</p>
        <p className="text-sm text-muted-foreground mt-1">
          +1.8 pts vs. previous period
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">
          View ASIN breakdown
        </Button>
      </CardFooter>
    </Card>
  ),
};

/** Header and content only, no footer actions. */
export const HeaderAndContentOnly: Story = {
  render: (args) => (
    <Card {...args} className="w-[380px]">
      <CardHeader>
        <CardTitle>Total ad spend</CardTitle>
        <CardDescription>Sponsored Products - August 2026</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold">$182,430</p>
      </CardContent>
    </Card>
  ),
};

/** Content-only card, no header/footer chrome. */
export const ContentOnly: Story = {
  render: (args) => (
    <Card {...args} className="w-[380px]">
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">
          No anomalies detected in the last 24 hours across your Amazon and
          Walmart catalogs.
        </p>
      </CardContent>
    </Card>
  ),
};

/** Card with a status badge in the header. */
export const WithStatusBadge: Story = {
  render: (args) => (
    <Card {...args} className="w-[380px]">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Retail Media Management sync</CardTitle>
          <CardDescription>Walmart Connect</CardDescription>
        </div>
        <Badge variant="defaultLight">Connected</Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Last synced 12 minutes ago.
        </p>
      </CardContent>
    </Card>
  ),
};

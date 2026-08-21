import type { Meta, StoryObj } from "@storybook/react-vite";

import { TokenPage, TokenSection } from "./helpers";
import { radii } from "./token-data";

function RadiiPage() {
  return (
    <TokenPage
      title="Corner radii"
      description="Base --radius is 6px. Tailwind classes rounded-sm through rounded-xl are mapped in theme.css. Prefer those classes over a raw pixel value."
    >
      <TokenSection title="Scale">
        <div className="grid gap-4 sm:grid-cols-2">
          {radii.map((radius) => (
            <div
              key={radius.name}
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
            >
              <div
                className={`${radius.className} size-20 shrink-0 bg-primary`}
                title={radius.value}
              />
              <div className="min-w-0 space-y-1 text-sm">
                <p className="font-medium">{radius.className}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {radius.cssVar} · {radius.value}
                </p>
                <p className="text-xs text-muted-foreground">{radius.note}</p>
              </div>
            </div>
          ))}
        </div>
      </TokenSection>
    </TokenPage>
  );
}

const meta = {
  title: "Foundations/Radii",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  render: () => <RadiiPage />,
};

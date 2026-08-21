import type { Meta, StoryObj } from "@storybook/react-vite";

import { TokenPage, TokenSection } from "./helpers";
import { spacingScale } from "./token-data";

function SpacingPage() {
  return (
    <TokenPage
      title="Spacing"
      description="CIQ sets --spacing to 4px. Tailwind v4 multiplies that: p-1 is 4px, p-2 is 8px, and so on. --cell-size is 32px (calendar cells)."
    >
      <TokenSection
        title="Base"
        description="Change --spacing in tokens.css and the whole scale moves."
      >
        <div className="rounded-lg border border-border bg-card p-4 font-mono text-sm">
          <p>--spacing: 4px</p>
          <p className="mt-1 text-muted-foreground">--cell-size: 32px</p>
        </div>
      </TokenSection>

      <TokenSection
        title="Scale samples"
        description="A few common steps. Any Tailwind spacing class (p-*, gap-*, w-*) uses this same 4px base."
      >
        <div className="space-y-2">
          {spacingScale.map((step) => (
            <div key={step.token} className="flex items-center gap-3 text-sm">
              <span className="w-16 shrink-0 font-mono text-xs text-muted-foreground">
                {step.token} · {step.px}
              </span>
              <div className={`${step.className} h-4 rounded-sm bg-primary`} />
            </div>
          ))}
        </div>
      </TokenSection>

      <TokenSection title="Cell size">
        <div className="flex items-end gap-4">
          <div
            className="rounded-md bg-primary"
            style={{ width: "var(--cell-size)", height: "var(--cell-size)" }}
          />
          <p className="text-sm text-muted-foreground">
            <code className="font-mono text-xs">var(--cell-size)</code> = 32px.
            Same width as <code className="font-mono text-xs">w-8</code> (8 ×
            4px).
          </p>
        </div>
      </TokenSection>
    </TokenPage>
  );
}

const meta = {
  title: "Foundations/Spacing",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  render: () => <SpacingPage />,
};

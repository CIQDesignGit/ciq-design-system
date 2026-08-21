import type { Meta, StoryObj } from "@storybook/react-vite";

import { TokenPage, TokenSection } from "./helpers";
import { defaultShadow, shadows } from "./token-data";

function ShadowsPage() {
  return (
    <TokenPage
      title="Shadows"
      description="Elevation tokens from tokens.css. Classes shadow-2xs through shadow-2xl are wired in theme.css. The unnamed --shadow variable exists but has no Tailwind class yet."
    >
      <TokenSection title="Scale">
        <div className="grid gap-6 sm:grid-cols-2">
          {shadows.map((shadow) => (
            <div
              key={shadow.name}
              className={`${shadow.className} rounded-lg bg-card p-6`}
            >
              <p className="font-medium">{shadow.className}</p>
              <p className="mt-1 font-mono text-[11px] leading-relaxed text-muted-foreground">
                {shadow.cssVar}
              </p>
              <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
                {shadow.value}
              </p>
            </div>
          ))}
        </div>
      </TokenSection>

      <TokenSection
        title="Unmapped default"
        description="tokens.css defines --shadow. theme.css does not map it, so there is no shadow class for it. Use var(--shadow) in CSS if you need this exact stack."
      >
        <div
          className="rounded-lg bg-card p-6"
          style={{ boxShadow: "var(--shadow)" }}
        >
          <p className="font-medium">var(--shadow)</p>
          <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
            {defaultShadow.value}
          </p>
        </div>
      </TokenSection>
    </TokenPage>
  );
}

const meta = {
  title: "Foundations/Shadows",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  render: () => <ShadowsPage />,
};

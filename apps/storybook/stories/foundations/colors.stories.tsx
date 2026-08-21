import type { Meta, StoryObj } from "@storybook/react-vite";

import { ColorList, TokenPage, TokenSection } from "./helpers";
import {
  actionColors,
  borderColors,
  chartColors,
  feedbackColors,
  fgColors,
  legacyAliasColors,
  primitiveColors,
  sidebarColors,
  surfaceColors,
} from "./token-data";

function ColorsPage() {
  return (
    <TokenPage
      title="Colors"
      description="Two tiers. Tier 1 is appearance (Tailwind palettes + our brand / primary-dark names). Tier 2 is purpose (fg, canvas, surface, border, action, feedback) — use these in components. Do not paste raw hex or hsl."
    >
      <TokenSection
        title="Tier 1 — Primitives"
        description="Brand is Tailwind purple with a CIQ name so we can swap later. Primary dark is slate-950. Slate, purple, green, red, amber, and the rest of Tailwind v4 are also available (bg-slate-900) but components should use Tier 2."
      >
        <ColorList tokens={primitiveColors} />
      </TokenSection>
      <TokenSection
        title="Tier 2 — Foreground"
        description="Text and icon color. Use text-fg-primary, not text-slate-900."
      >
        <ColorList tokens={fgColors} />
      </TokenSection>
      <TokenSection
        title="Tier 2 — Surfaces"
        description="Page and card fills. The token name has no 'bg' — the class adds it (bg-canvas, bg-surface)."
      >
        <ColorList tokens={surfaceColors} />
      </TokenSection>
      <TokenSection
        title="Tier 2 — Borders"
        description="Default, strong (inputs), and focus ring."
      >
        <ColorList tokens={borderColors} />
      </TokenSection>
      <TokenSection
        title="Tier 2 — Action"
        description="Interactive brand color. Buttons and links use bg-action-primary or text-action-primary."
      >
        <ColorList tokens={actionColors} />
      </TokenSection>
      <TokenSection
        title="Tier 2 — Feedback"
        description="Success, warning, and danger. These stay the same in dark mode."
      >
        <ColorList tokens={feedbackColors} />
      </TokenSection>
      <TokenSection
        title="Tier 2 — Charts"
        description="Series colors for graphs. A purple ramp — not the same as a button."
      >
        <ColorList tokens={chartColors} />
      </TokenSection>
      <TokenSection
        title="Tier 2 — Sidebar"
        description="Navigation chrome. Use bg-sidebar, not a generic gray."
      >
        <ColorList tokens={sidebarColors} />
      </TokenSection>
      {/* DO_NOT_REMOVE_LEGACY_ALIASES — keep this section on the Colors page forever. See AGENTS.md. */}
      <TokenSection
        title="Legacy aliases"
        description="Old shadcn names (bg-primary, text-muted-foreground) still work. They point at the new tokens. Prefer the Tier 2 names for new work. Do not remove this section."
      >
        <ColorList tokens={legacyAliasColors} />
      </TokenSection>
      {/* END DO_NOT_REMOVE_LEGACY_ALIASES */}
    </TokenPage>
  );
}

const meta = {
  title: "Foundations/Colors",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "CIQ color tokens. Use Tier 2 Tailwind classes (bg-action-primary, text-fg-primary). Values live in packages/ui/src/styles/tokens.css.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Light: Story = {
  name: "Light",
  render: () => <ColorsPage />,
};

export const Dark: Story = {
  name: "Dark",
  render: () => (
    <div className="dark -m-4 min-h-screen bg-canvas p-8 text-fg-primary">
      <ColorsPage />
    </div>
  ),
};

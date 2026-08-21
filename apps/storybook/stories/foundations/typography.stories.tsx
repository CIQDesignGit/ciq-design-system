import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  TokenPage,
  TokenSection,
  TypeAliasList,
  TypeRoleList,
} from "./helpers";
import {
  legacyAliasType,
  typeFamilies,
  typeRoles,
  typeSizes,
  typeWeights,
} from "./typography-data";

function TypographyPage() {
  return (
    <TokenPage
      title="Typography"
      description="Two tiers. Tier 1 is appearance (Tailwind sizes, weights, and our Inter / Source Serif / JetBrains families). Tier 2 is purpose (type-heading, type-body, type-caption) — use these in components. Do not stack text-sm font-medium by hand."
    >
      <TokenSection
        title="Tier 1 — Families"
        description="Brand is Inter with a CIQ name (font-brand), same as sans. Serif and mono are for prose and code only."
      >
        <div className="space-y-4">
          {typeFamilies.map((family) => (
            <div
              key={family.name}
              className="rounded-lg border border-border-default bg-surface p-4 shadow-xs"
            >
              <p className={`${family.className} text-2xl`}>
                The quick brown fox jumps over the lazy dog.
              </p>
              <dl className="mt-3 grid gap-1 font-mono type-caption text-fg-tertiary sm:grid-cols-2">
                <div>
                  {family.className} · {family.cssVar}
                </div>
                <div>{family.value}</div>
                <div>Weights: {family.weights}</div>
              </dl>
            </div>
          ))}
        </div>
      </TokenSection>

      <TokenSection
        title="Tier 1 — Weights"
        description="Tailwind defaults. Inter ships 400–700. Serif only 400 and 600. Mono 400–600."
      >
        <div className="space-y-2 rounded-lg border border-border-default bg-surface p-4">
          {typeWeights.map((weight) => (
            <p key={weight.name} className={`${weight.className} text-lg`}>
              {weight.name} ({weight.className}, {weight.value}) — Assign to
              Blake
            </p>
          ))}
        </div>
      </TokenSection>

      <TokenSection
        title="Tier 1 — Sizes"
        description="Tailwind defaults. Components should not use these alone — pick a Tier 2 role instead."
      >
        <div className="space-y-3 rounded-lg border border-border-default bg-surface p-4">
          {typeSizes.map((size) => (
            <p key={size.name} className={size.className}>
              {size.className} · ~{size.px} — The quick brown fox
            </p>
          ))}
        </div>
      </TokenSection>

      <TokenSection
        title="Tier 2 — Roles"
        description="Copy these class names. type-body is default UI copy. type-heading, type-title, and type-caption cover the rest. Prefix is type- so it does not clash with text-fg-primary (color)."
      >
        <TypeRoleList tokens={typeRoles} />
      </TokenSection>

      {/* DO_NOT_REMOVE_LEGACY_TYPE_ALIASES — keep this section on the Typography page forever. See AGENTS.md. */}
      <TokenSection
        title="Legacy aliases"
        description="Old size + weight stacks still work (they are Tailwind primitives). New work must use type-*. Do not remove this section."
      >
        <TypeAliasList tokens={legacyAliasType} />
      </TokenSection>
      {/* END DO_NOT_REMOVE_LEGACY_TYPE_ALIASES */}
    </TokenPage>
  );
}

const meta = {
  title: "Foundations/Typography",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "CIQ type tokens. Use Tier 2 classes (type-body, type-heading). Recipes live in packages/ui/src/styles/theme.css.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  render: () => <TypographyPage />,
};

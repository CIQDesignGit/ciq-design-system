# CIQ Design System — agent instructions

## 1. Never remove the Storybook legacy aliases mapping

The **Legacy aliases** section on Foundations → Colors must stay forever.

- Keep `legacyAliasColors` in `apps/storybook/stories/foundations/token-data.ts`
- Keep the "Legacy aliases" `TokenSection` in `apps/storybook/stories/foundations/colors.stories.tsx`
- Keep the CSS aliases in `packages/ui/src/styles/tokens.css` and `theme.css`

Look for the marker `DO_NOT_REMOVE_LEGACY_ALIASES`. Do not delete it, empty the list, or hide the section.

## 2. Always use the new color vocabulary in components

When writing or editing components, Storybook stories, or new UI, use Tier 2 names — not old shadcn names and not raw Tailwind palettes.

| Use this | Not this |
|---|---|
| `text-fg-primary` | `text-foreground`, `text-slate-900` |
| `text-fg-tertiary` | `text-muted-foreground` |
| `bg-canvas` | `bg-background` |
| `bg-surface` | `bg-card`, `bg-white` |
| `bg-action-primary` | `bg-primary`, `bg-purple-600` |
| `text-action-primary` | `text-primary` |
| `bg-feedback-success` | `bg-success-600` |
| `border-border-default` | `border-border` |

Do not paste raw hex or hsl into components. Old names still exist as aliases for existing code; new work must use the new names.

## 3. Never remove the Storybook typography legacy aliases mapping

The **Legacy aliases** section on Foundations → Typography must stay forever.

- Keep `legacyAliasType` in `apps/storybook/stories/foundations/typography-data.ts`
- Keep the "Legacy aliases" `TokenSection` in `apps/storybook/stories/foundations/typography.stories.tsx`

Look for the marker `DO_NOT_REMOVE_LEGACY_TYPE_ALIASES`. Do not delete it, empty the list, or hide the section.

## 4. Always use the new type vocabulary in components

When writing or editing components, Storybook stories, or new UI, use Tier 2 `type-*` roles — not raw `text-sm` / `font-medium` stacks.

| Use this | Not this |
|---|---|
| `type-display` | `text-4xl font-semibold` |
| `type-heading` | `text-2xl font-semibold` |
| `type-title` | `text-lg font-semibold` |
| `type-body-lg` | `text-base` |
| `type-body` | `text-sm` |
| `type-body-strong` | `text-sm font-medium` |
| `type-label` | `text-sm font-medium leading-none` |
| `type-caption` | `text-xs` |
| `type-caption-strong` | `text-xs font-medium` |
| `type-code` | `font-mono text-sm` |

`text-sm` still exists (it is a Tailwind size). Do not use it as the way to style copy. Pair `type-body` with color classes (`text-fg-primary`).

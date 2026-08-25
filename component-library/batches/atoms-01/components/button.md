# Button

## Identity

| Field | Value |
|-------|-------|
| **Name** | `Button` |
| **neo-canvas source** | `src/components/atoms/button.tsx` |
| **Related files** | `src/components/atoms/button-variants.ts` |
| **Story** | `src/components/atoms/button.stories.tsx` |
| **Storybook title** | `Atoms/Button` |
| **In atoms barrel today?** | Yes — `Button`, `buttonVariants` |
| **Batch** | atoms-01 |
| **Tags** | `primitive` |

## Public API

### Exports

```ts
export { Button } from "./button";
export { buttonVariants } from "./button-variants";
export type { ButtonProps } from "./button";
```

### Props / variants

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `variant` | `"default" \| "destructive" \| "outline" \| "secondary" \| "ghost" \| "link" \| "card"` | `"default"` | CVA |
| `size` | `"default" \| "xs" \| "sm" \| "lg" \| "icon"` | `"default"` | CVA |
| `asChild` | `boolean` | `false` | Uses `@radix-ui/react-slot` |
| `className` | `string` | — | Merged via `cn` + CVA |
| …rest | `React.ButtonHTMLAttributes<HTMLButtonElement>` | — | Native button attrs |

`ButtonProps` = button HTML attrs + `VariantProps<typeof buttonVariants>` + `readonly asChild?: boolean`.

### Compound parts

None (single component). Variants live in separate `buttonVariants` module for reuse (e.g. Calendar).

## Dependencies

### npm / peers

| Package | Why |
|---------|-----|
| `@radix-ui/react-slot` | `asChild` |
| `class-variance-authority` | `buttonVariants` |
| `react` | `forwardRef` |

### Internal

| Import | Notes |
|--------|-------|
| `cn` | Class merge |
| `buttonVariants` | Same package |

## Tokens / classes

Base: `inline-flex`, `rounded-lg`, `text-sm`, `font-medium`, `shadow-xs`, `focus:outline-2`, disabled opacity.

Variants (token-backed unless noted):

- `default`: `bg-primary text-primary-foreground hover:bg-primary/90`
- `destructive`: `bg-destructive text-destructive-foreground`
- `outline`: `border border-input bg-card hover:bg-input/50 focus:outline-ring`
- `secondary`: `bg-secondary text-secondary-foreground`
- `ghost` / `link`: `text-foreground` / `text-primary`, `shadow-none`
- **`card` tech debt:** `bg-white hover:bg-gray-50 border border-gray-200` (hard-coded; port as-is)

Sizes: `h-10 px-4 py-2` (default), `xs`/`sm`/`lg`/`icon` as in source.

## Behavior

- `forwardRef` to button/Slot
- `asChild`: merges props onto single child via Radix `Slot`
- `displayName = "Button"`
- SVG children: `[&_svg]:size-4` pointer-events none

## Source of truth

1. Port `button-variants.ts` first (pure CVA, no React).
2. Port `button.tsx` — change `@/utils/cn` → library `cn`; keep `.ts` import style or drop extension per library convention.
3. Do not add ThemeContext.

## Stories

Mirror `button.stories.tsx`:

| Story export | Purpose |
|--------------|---------|
| `Default` | Primary button |
| `Variants` | All 7 variants |
| `Sizes` | xs → icon |
| `WithIcon` | Leading lucide icon |
| `Disabled` | Disabled state |

## Do not port

- App routing / analytics
- No changes to variant names (consumers depend on them)

## Acceptance

- [ ] Exports `Button` + `buttonVariants`
- [ ] All variants and sizes match
- [ ] `asChild` works with a child `<a>`
- [ ] Stories render
- [ ] No `any` / unjustified assertions

# Badge

## Identity

| Field | Value |
|-------|-------|
| **Name** | `Badge` |
| **neo-canvas source** | `src/components/atoms/badge.tsx` |
| **Story** | `src/components/atoms/badge.stories.tsx` |
| **Storybook title** | `Atoms/Badge` |
| **In atoms barrel today?** | Yes — `Badge` only (`badgeVariants` exported from file but not re-exported in atoms `index.ts`; **library should export both**) |
| **Batch** | atoms-01 |
| **Tags** | `primitive` |

## Public API

### Exports

```ts
export { Badge, badgeVariants };
export type { BadgeProps };
```

### Props / variants

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `variant` | `"default" \| "defaultLight" \| "secondary" \| "destructive" \| "outline"` | `"default"` | CVA |
| `className` | `string` | — | |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | Renders a `<div>` |

### Compound parts

None.

## Dependencies

### npm / peers

| Package | Why |
|---------|-----|
| `class-variance-authority` | `badgeVariants` |
| `react` | |

### Internal

| Import | Notes |
|--------|-------|
| `cn` | |

## Tokens / classes

Base: `inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold` + focus ring tokens.

Variants:

- `default`: `bg-primary text-primary-foreground`
- **`defaultLight` tech debt:** `border-violet-100 bg-violet-50 text-primary` (hard-coded violet — port as-is)
- `secondary` / `destructive` / `outline`: token-backed

## Behavior

- Function component (not forwardRef) — match neo-canvas
- No `asChild`

## Source of truth

Port `badge.tsx`; export `badgeVariants` from library barrel.

## Stories

| Story export | Purpose |
|--------------|---------|
| `Default` | Default variant |
| `DefaultLight` | Light tint |
| `Secondary` | Secondary |
| `Destructive` | Destructive |
| `Outline` | Outline |
| `StatusRow` | Multiple badges |

## Do not port

- Domain status maps (alert issue types, etc.)

## Acceptance

- [ ] All 5 variants
- [ ] `badgeVariants` exported for composition
- [ ] Stories render

# Skeleton

## Identity

| Field | Value |
|-------|-------|
| **Name** | `Skeleton` |
| **neo-canvas source** | `src/components/atoms/skeleton.tsx` |
| **Story** | `src/components/atoms/skeleton.stories.tsx` |
| **Storybook title** | `Atoms/Skeleton` |
| **In atoms barrel today?** | **No** (deep-imported today) — library **must** export it |
| **Batch** | atoms-01 |
| **Tags** | `primitive` |

## Public API

### Exports

```ts
export { Skeleton };
```

### Props / variants

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| …rest | `React.ComponentProps<"div">` | — | Size/shape via `className` |
| `style` | `CSSProperties` | — | Merged after default gradient |

No CVA. Shape is 100% consumer `className` (e.g. `h-4 w-48`, `size-10 rounded-full`).

### Compound parts

None.

## Dependencies

### npm / peers

| Package | Why |
|---------|-----|
| `react` | |

### Internal

| Import | Notes |
|--------|-------|
| `cn` | |

### CSS required

From `src/index.css`:

```css
.animate-shimmer {
  animation: shimmer 2s linear infinite;
}
/* + @keyframes shimmer (same file) */
```

## Tokens / classes

Default classes: `rounded-lg animate-shimmer`.

**Inline style (tech debt — port as-is):**

```ts
background: "linear-gradient(90deg, #e5e7eb 25%, #d1d5db 50%, #e5e7eb 75%)",
backgroundSize: "200% 100%",
```

Plus `data-slot="skeleton"`.

## Behavior

- Function component (not forwardRef) — match source
- Not a Radix primitive

## Source of truth

1. Port `skeleton.tsx`.
2. Ensure `.animate-shimmer` exists in library CSS.
3. Note: source uses `React.ComponentProps` without importing `React` namespace — library should `import * as React from "react"` or use `import type { ComponentProps } from "react"` for strict TS.

## Stories

| Story export | Purpose |
|--------------|---------|
| `Default` | Line skeleton |
| `Avatar` | Circle |
| `CardLoading` | Composed card placeholder |
| `TableRows` | Row placeholders |

## Do not port

- Domain-specific loading layouts as part of the atom

## Acceptance

- [ ] Shimmer animates
- [ ] `className` controls size
- [ ] Exported from library barrel
- [ ] Stories render

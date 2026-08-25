# Tooltip

## Identity

| Field | Value |
|-------|-------|
| **Name** | `Tooltip` (+ Provider, Trigger, Content) |
| **neo-canvas source** | `src/components/atoms/tooltip.tsx` |
| **Story** | `src/components/atoms/tooltip.stories.tsx` |
| **Storybook title** | `Atoms/Tooltip` |
| **In atoms barrel today?** | Yes |
| **Batch** | atoms-01 |
| **Tags** | `primitive` |

## Public API

### Exports

```ts
export {
  Tooltip,           // Root
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
};
```

### Props / variants

| Export | Type / notes |
|--------|----------------|
| `TooltipProvider` | Radix `TooltipPrimitive.Provider` re-export |
| `Tooltip` | Radix `Root` re-export |
| `TooltipTrigger` | Radix `Trigger` re-export |
| `TooltipContent` | forwardRef Content + portal |

**`TooltipContent` extra props:**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `sideOffset` | `number` | `4` | |
| `container` | `HTMLElement \| null` | — | Portal mount node |
| `className` | `string` | — | |
| …rest | Radix Content props | — | `side`, children, etc. |

### Compound parts

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>{/* control */}</TooltipTrigger>
    <TooltipContent>{/* hint */}</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

## Dependencies

### npm / peers

| Package | Why |
|---------|-----|
| `@radix-ui/react-tooltip` | Primitive |
| `react` | |
| `tailwindcss-animate` (or equivalent) | `animate-in` / `fade-in-0` / `zoom-in-95` classes |

### Internal

| Import | Notes |
|--------|-------|
| `cn` | |

## Tokens / classes

Content:

```
z-50 max-w-xs whitespace-normal break-words rounded-lg border
bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md
animate-in fade-in-0 zoom-in-95
data-[state=closed]:animate-out …
data-[side=*]:slide-in-from-*
origin-[--radix-tooltip-content-transform-origin]
```

## Behavior

- neo-canvas resolves portal via `queryElement({ query: "#overlay-portal" })` for shadow DOM / web component
- **Library must:** use `container` prop when provided; otherwise portal to `document.body` (Radix default) — **do not** require `#overlay-portal` or `@/web-component/utils`
- Optional: if `container` omitted, `Portal` without container is fine
- File starts with `"use client"` — only needed if library targets Next RSC; Vite SPA can omit

## Source of truth

1. Port structure from `tooltip.tsx`.
2. **Replace** the `useMemo` + `queryElement` block with:

```tsx
<TooltipPrimitive.Portal container={container ?? undefined}>
```

or simply omit container when null so Radix uses default.

3. Keep optional `container` prop for hosts that need a custom portal root (web component later).

## Stories

| Story export | Purpose |
|--------------|---------|
| `Default` | Metric abbreviation |
| `OnDisabledAction` | Wrapper span + disabled Button |
| `SidePlacement` | `side="right"` |
| `HoverToReveal` | `defaultOpen: false` |

Decorator wraps `TooltipProvider`. Depends on **Button**.

## Do not port

- `queryElement` / `#overlay-portal` hard dependency
- `"use client"` unless the library is Next-oriented
- App ThemeContext

## Acceptance

- [ ] All four exports
- [ ] Tooltip shows on hover/focus without neo-canvas portal DOM
- [ ] Optional `container` still supported
- [ ] Stories render

# Card

## Identity

| Field | Value |
|-------|-------|
| **Name** | `Card` (+ parts) |
| **neo-canvas source** | `src/components/atoms/card.tsx` |
| **Story** | `src/components/atoms/card.stories.tsx` |
| **Storybook title** | `Atoms/Card` |
| **In atoms barrel today?** | Yes — all parts |
| **Batch** | atoms-01 |
| **Tags** | `primitive` |

## Public API

### Exports

```ts
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
```

### Props / variants

Each part: `React.HTMLAttributes` on the appropriate element + `className` via `cn`.

| Part | Element | Default classes (summary) |
|------|---------|---------------------------|
| `Card` | `div` | `rounded-lg border bg-card text-card-foreground shadow-sm` |
| `CardHeader` | `div` | `flex flex-col space-y-1.5 p-6` |
| `CardTitle` | `h3` | `text-2xl font-semibold leading-none tracking-tight` |
| `CardDescription` | `p` | `text-sm text-muted-foreground` |
| `CardContent` | `div` | `p-6 pt-0` |
| `CardFooter` | `div` | `flex items-center p-6 pt-0` |

### Compound parts

Compose: `Card` > optional `CardHeader` (`CardTitle` / `CardDescription`) > `CardContent` > optional `CardFooter`.

## Dependencies

### npm / peers

| Package | Why |
|---------|-----|
| `react` | `forwardRef` |

### Internal

| Import | Notes |
|--------|-------|
| `cn` | Source uses `@/utils/cn` |

Stories also use Button + Badge (same batch).

## Tokens / classes

`bg-card`, `text-card-foreground`, `text-muted-foreground`, `border`, `shadow-sm`.

## Behavior

- All parts `forwardRef` + `displayName`
- Presentational only

## Source of truth

Port `card.tsx` as a multi-export module.

## Stories

| Story export | Purpose |
|--------------|---------|
| `Default` | Full card + footer Button |
| `HeaderAndContentOnly` | No footer |
| `ContentOnly` | Body only |
| `WithStatusBadge` | Header + Badge |

## Do not port

- Dashboard widget chrome / data fetching

## Acceptance

- [ ] All 6 exports
- [ ] Stories render (after Button + Badge)
- [ ] Token classes intact

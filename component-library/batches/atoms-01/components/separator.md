# Separator

## Identity

| Field | Value |
|-------|-------|
| **Name** | `Separator` |
| **neo-canvas source** | `src/components/atoms/separator.tsx` |
| **Story** | `src/components/atoms/separator.stories.tsx` |
| **Storybook title** | `Atoms/Separator` |
| **In atoms barrel today?** | Yes |
| **Batch** | atoms-01 |
| **Tags** | `primitive` |

## Public API

### Exports

```ts
export { Separator };
```

### Props / variants

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | |
| `decorative` | `boolean` | `true` | Radix a11y |
| `className` | `string` | — | |
| …rest | Radix Separator Root props | — | |

### Compound parts

None.

## Dependencies

### npm / peers

| Package | Why |
|---------|-----|
| `@radix-ui/react-separator` | Primitive |
| `react` | `forwardRef` |

### Internal

| Import | Notes |
|--------|-------|
| `cn` | |

## Tokens / classes

```
shrink-0 bg-gray-200
horizontal: h-[1px] w-full
vertical: h-full w-[1px]
```

**Tech debt:** `bg-gray-200` hard-coded — prefer `bg-border` later; port as-is for visual parity.

## Behavior

- `forwardRef` to Radix Root
- Default `decorative={true}`

## Source of truth

Port `separator.tsx`.

## Stories

| Story export | Purpose |
|--------------|---------|
| `Default` | Horizontal between text |
| `Vertical` | Inline metrics toolbar |

## Do not port

- Layout spacing wrappers

## Acceptance

- [ ] Horizontal + vertical
- [ ] Stories render

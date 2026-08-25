# Textarea

## Identity

| Field | Value |
|-------|-------|
| **Name** | `Textarea` |
| **neo-canvas source** | `src/components/atoms/textarea.tsx` |
| **Story** | `src/components/atoms/textarea.stories.tsx` |
| **Storybook title** | `Atoms/Textarea` |
| **In atoms barrel today?** | Yes |
| **Batch** | atoms-01 |
| **Tags** | `primitive` |

## Public API

### Exports

```ts
export { Textarea };
```

### Props / variants

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| …rest | `React.ComponentProps<"textarea">` | — | Native textarea |
| `className` | `string` | — | Via `cn` |

### Compound parts

None.

## Dependencies

### npm / peers

| Package | Why |
|---------|-----|
| `react` | `forwardRef` |

### Internal

| Import | Notes |
|--------|-------|
| `cn` | Use direct import |

## Tokens / classes

```
flex min-h-[80px] w-full rounded-lg border border-input bg-white px-3 py-2
text-base text-primary font-medium
placeholder:text-tertiary-text placeholder:font-normal
focus-visible:outline-none
disabled:cursor-not-allowed disabled:opacity-50
md:text-sm
```

**Tech debt:** `bg-white` hard-coded (not `bg-background`). Port as-is; prefer tokenizing later to `bg-background` or `bg-card`.

## Behavior

- `forwardRef<HTMLTextAreaElement>`
- `displayName = "Textarea"`
- `data-testid="textarea-input"`

## Source of truth

Port `textarea.tsx`; swap `cn` import path.

## Stories

| Story export | Purpose |
|--------------|---------|
| `Default` | Controlled empty |
| `WithContent` | Pre-filled |
| `Disabled` | Disabled |
| `TallerRows` | `rows={8}` |

Stories use a local controlled wrapper — fine to mirror in library Storybook.

## Do not port

- Auto-resize / markdown editors
- App feedback services

## Acceptance

- [ ] Native textarea API preserved
- [ ] `data-testid` preserved
- [ ] Stories render

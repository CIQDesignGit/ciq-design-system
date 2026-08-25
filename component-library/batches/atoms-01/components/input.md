# Input

## Identity

| Field | Value |
|-------|-------|
| **Name** | `Input` |
| **neo-canvas source** | `src/components/atoms/input.tsx` |
| **Related files** | — |
| **Story** | `src/components/atoms/input.stories.tsx` |
| **Storybook title** | `Atoms/Input` |
| **In atoms barrel today?** | Yes |
| **Batch** | atoms-01 |
| **Tags** | `primitive` |

## Public API

### Exports

```ts
export { Input };
```

### Props / variants

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| …rest | `React.ComponentProps<"input">` | — | Full native input surface |
| `className` | `string` | — | Merged via `cn` |

No CVA variants. Props type is the native input props object.

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
| `cn` | neo-canvas uses `@/utils` barrel; library should use `cn` directly |

## Tokens / classes

```
flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2
text-base text-primary font-medium
file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground
placeholder:text-tertiary-text placeholder:font-normal
focus-visible:outline-none
disabled:cursor-not-allowed disabled:opacity-50
md:text-sm
```

Requires Tailwind color `tertiary-text` → `var(--tertiary-text)`.

## Behavior

- `forwardRef<HTMLInputElement>`
- `displayName = "Input"`
- Always sets `data-testid="input-type-input"` (preserve for test parity)
- Uncontrolled/controlled via native `value` / `defaultValue` / `onChange`

## Source of truth

1. Copy `input.tsx`.
2. Replace `import { cn } from "@/utils"` with library `cn`.

## Stories

| Story export | Purpose |
|--------------|---------|
| `Default` | Placeholder + onChange |
| `WithDefaultValue` | Uncontrolled default |
| `NumberType` | `type="number"` |
| `Disabled` | Disabled |
| `ReadOnly` | Read-only |
| `WithLabel` | Paired with Label (needs Label from this batch) |

Implement Label before `WithLabel`, or temporarily skip that story until Label lands (same batch, Label is next).

## Do not port

- Form libraries / validation schemas
- App-specific masks

## Acceptance

- [ ] Native attrs work (`type`, `disabled`, `readOnly`, …)
- [ ] Placeholder uses `text-tertiary-text`
- [ ] `data-testid` preserved
- [ ] Stories render

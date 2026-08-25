# Checkbox

## Identity

| Field | Value |
|-------|-------|
| **Name** | `Checkbox` |
| **neo-canvas source** | `src/components/atoms/checkbox.tsx` |
| **Story** | `src/components/atoms/checkbox.stories.tsx` |
| **Storybook title** | `Atoms/Checkbox` |
| **In atoms barrel today?** | Yes |
| **Batch** | atoms-01 |
| **Tags** | `primitive` |

## Public API

### Exports

```ts
export { Checkbox };
```

### Props / variants

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `indeterminate` | `boolean` | — | When true, forces Radix `checked="indeterminate"` |
| `checked` | Radix checked state | — | Ignored visually when `indeterminate` |
| …rest | `React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>` | — | Includes `onCheckedChange`, `disabled` |
| `className` | `string` | — | |

`CheckboxProps` extends Radix Root props with `readonly indeterminate?: boolean`.

### Compound parts

None (Indicator is internal).

## Dependencies

### npm / peers

| Package | Why |
|---------|-----|
| `@radix-ui/react-checkbox` | Primitive |
| `lucide-react` | `Check`, `Minus` icons |
| `react` | `forwardRef` |

### Internal

| Import | Notes |
|--------|-------|
| `cn` | |

## Tokens / classes

```
peer h-4 w-4 shrink-0 rounded-md border border-primary
ring-offset-background
focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
disabled:cursor-not-allowed disabled:opacity-50
data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground
data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground
```

## Behavior

- `forwardRef` to Radix Root
- When `indeterminate` is true, passes `checked="indeterminate"` and shows `Minus`; else shows `Check` when checked
- `displayName` from Radix

**Note:** Batch 02 also has `IndeterminateCheckbox` (native `<input type="checkbox">` with imperative indeterminate). This Radix `Checkbox` already supports indeterminate via prop — keep both for API parity with neo-canvas.

## Source of truth

Port `checkbox.tsx` verbatim aside from `cn` path.

## Stories

| Story export | Purpose |
|--------------|---------|
| `Default` | Interactive controlled |
| `Checked` | Pre-checked |
| `Indeterminate` | Dash state |
| `Disabled` | Disabled unchecked |
| `DisabledChecked` | Disabled checked |
| `SelectionGroup` | Select-all pattern |

## Do not port

- Table selection logic
- Separate `IndeterminateCheckbox` file (Batch 02)

## Acceptance

- [ ] Checked / unchecked / indeterminate / disabled
- [ ] Icons render inside Indicator
- [ ] Stories render

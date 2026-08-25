# Label

## Identity

| Field | Value |
|-------|-------|
| **Name** | `Label` |
| **neo-canvas source** | `src/components/atoms/label.tsx` |
| **Story** | `src/components/atoms/label.stories.tsx` |
| **Storybook title** | `Atoms/Label` |
| **In atoms barrel today?** | Yes |
| **Batch** | atoms-01 |
| **Tags** | `primitive` |

## Public API

### Exports

```ts
export { Label };
```

### Props / variants

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| …rest | `React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>` | — | Radix Label |
| `className` | `string` | — | Merged with `labelVariants()` |

Internal `labelVariants` CVA (no exported variant props used today — single style). Type intersects `VariantProps<typeof labelVariants>` for future variants.

### Compound parts

None.

## Dependencies

### npm / peers

| Package | Why |
|---------|-----|
| `@radix-ui/react-label` | Primitive |
| `class-variance-authority` | `labelVariants` |
| `react` | `forwardRef` |

### Internal

| Import | Notes |
|--------|-------|
| `cn` | |

## Tokens / classes

```
text-sm font-medium leading-none
peer-disabled:cursor-not-allowed peer-disabled:opacity-70
```

Works with sibling controls that use the Tailwind `peer` class (see Input story `WithDisabledControl`).

## Behavior

- `forwardRef` to Radix Root
- `displayName` from Radix Root
- Pair with `htmlFor` + control `id`

## Source of truth

Port `label.tsx`; keep CVA even if single variant.

## Stories

| Story export | Purpose |
|--------------|---------|
| `Default` | Label + Input |
| `RequiredField` | Asterisk in children |
| `WithDisabledControl` | `peer-disabled` styling |

Depends on **Input** (earlier in this batch).

## Do not port

- Form field wrappers / error message components

## Acceptance

- [ ] Radix Label behavior (`htmlFor`)
- [ ] `peer-disabled` styles work with `peer` on input
- [ ] Stories render

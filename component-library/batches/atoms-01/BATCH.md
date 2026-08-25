# Batch atoms-01 — Core form & chrome

## Goal

Ship the ten highest-reuse form and chrome primitives so every later atom/molecule batch has buttons, fields, labels, badges, cards, dividers, loading placeholders, and tooltips.

## Implement order

1. **Button** (+ `buttonVariants`)
2. **Input**
3. **Textarea**
4. **Label**
5. **Checkbox**
6. **Badge**
7. **Card** (Header, Title, Description, Content, Footer)
8. **Separator**
9. **Skeleton**
10. **Tooltip** (Provider, Trigger, Content, Root)

## Shared prerequisites (blockers)

- [ ] **Batch 00** complete ([README](../../README.md#batch-00--foundation))
- [ ] Peer deps below installed
- [ ] Storybook ready

### Peer / npm dependencies for this batch

| Package | Used by |
|---------|---------|
| `class-variance-authority` | Button, Label, Badge |
| `@radix-ui/react-slot` | Button (`asChild`) |
| `@radix-ui/react-label` | Label |
| `@radix-ui/react-checkbox` | Checkbox |
| `@radix-ui/react-separator` | Separator |
| `@radix-ui/react-tooltip` | Tooltip |
| `lucide-react` | Checkbox icons (`Check`, `Minus`) |
| `clsx` + `tailwind-merge` | `cn` |
| `react` / `react-dom` | All |

### Shared utilities to port once

| Utility | neo-canvas source | Notes |
|---------|-------------------|-------|
| `cn` | `src/utils/cn.ts` | Prefer direct `cn` import (not full utils barrel) |
| `buttonVariants` | `src/components/atoms/button-variants.ts` | Export alongside Button |

### Tokens / CSS required

- Semantic colors: `primary`, `primary-foreground`, `secondary`, `destructive`, `accent`, `background`, `foreground`, `card`, `popover`, `muted-foreground`, `border`, `input`, `ring`
- `tertiary-text` (Input/Textarea placeholders)
- `shadow-xs` (Button)
- Utility class `.animate-shimmer` + `@keyframes shimmer` (Skeleton)

## Specs in this pack

| # | Component | Spec |
|---|-----------|------|
| 1 | Button | [components/button.md](./components/button.md) |
| 2 | Input | [components/input.md](./components/input.md) |
| 3 | Textarea | [components/textarea.md](./components/textarea.md) |
| 4 | Label | [components/label.md](./components/label.md) |
| 5 | Checkbox | [components/checkbox.md](./components/checkbox.md) |
| 6 | Badge | [components/badge.md](./components/badge.md) |
| 7 | Card | [components/card.md](./components/card.md) |
| 8 | Separator | [components/separator.md](./components/separator.md) |
| 9 | Skeleton | [components/skeleton.md](./components/skeleton.md) |
| 10 | Tooltip | [components/tooltip.md](./components/tooltip.md) |

## Out of scope

- IndeterminateCheckbox (Batch 02 — separate native-input component)
- MultiSelect, FilterModal, chat atoms
- Moving/deleting neo-canvas files
- App ThemeProvider / toaster

## Definition of done

- [ ] All 10 components match public APIs in specs
- [ ] Stories mirror neo-canvas story exports
- [ ] Typecheck passes
- [ ] Barrel exports only for consumers
- [ ] [CHECKLIST.md](./CHECKLIST.md) complete

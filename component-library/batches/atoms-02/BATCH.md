# Batch atoms-02 — More controls & overlays

## Goal

Add the next layer of form controls and lightweight overlays used across filters, settings, and selection UIs.

## Implement order

1. **Switch** — `src/components/atoms/switch.tsx`
2. **RadioGroup** — `src/components/atoms/radio-group.tsx`
3. **Select** — `src/components/atoms/select.tsx` (compound Select*)
4. **Popover** — `src/components/atoms/popover.tsx`
5. **HoverCard** — `src/components/atoms/hover-card.tsx`
6. **Tabs** — `src/components/atoms/tabs.tsx`
7. **IndeterminateCheckbox** — `src/components/atoms/indeterminate-checkbox.tsx` (native input; distinct from Batch 01 Checkbox)
8. **Toggle** — `src/components/atoms/toggle.tsx`
9. **Avatar** — `src/components/atoms/avatar.tsx`
10. **EmptyState** — `src/components/atoms/empty-state.tsx`

## Shared prerequisites

- [ ] Batch 00 + **atoms-01** complete in the library
- [ ] Peer deps below installed

### Peer / npm dependencies

| Package | Used by |
|---------|---------|
| `@radix-ui/react-switch` | Switch |
| `@radix-ui/react-radio-group` | RadioGroup |
| `@radix-ui/react-select` | Select |
| `@radix-ui/react-popover` | Popover |
| `@radix-ui/react-hover-card` | HoverCard |
| `@radix-ui/react-tabs` | Tabs |
| `@radix-ui/react-avatar` | Avatar |
| `lucide-react` | Select chevrons/check |
| Batch 01 atoms | None strictly required except stories may compose Button |

### Portal note (Select, Popover, HoverCard)

neo-canvas uses `queryElement` / `#overlay-portal` for shadow DOM. **Library:** accept optional `container?: HTMLElement | null` on portaled content; default to Radix body portal. See [tooltip.md](../atoms-01/components/tooltip.md) pattern.

### App coupling to strip

| Component | Do not port |
|-----------|-------------|
| Toggle | Hard dependency on `@/constants/colors` `CHART_COLORS` — replace with token props or CSS variables |

## Specs

| # | Spec |
|---|------|
| 1–10 | [components/](./components/) |

## Definition of done

- [ ] All 10 implemented + Storybook titles `Atoms/<Name>`
- [ ] [CHECKLIST.md](./CHECKLIST.md) complete
- [ ] No `@/web-component` runtime dependency

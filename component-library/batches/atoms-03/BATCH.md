# Batch atoms-03 — Structure & menus

## Goal

Ship layout/structure primitives: sheets, overlays, menus, tables, loaders, and chips.

## Implement order

1. **Sheet** — `src/components/atoms/sheet.tsx` (Radix Dialog-based; strip `#overlay-portal` hard dep)
2. **Layover** — `src/components/atoms/layover.tsx` (custom modal/drawer positions)
3. **Collapsible** — `src/components/atoms/collapsible.tsx`
4. **Accordion** — `src/components/atoms/accordion.tsx` (uses `CHART_COLORS` — tokenize)
5. **ScrollArea** — `src/components/atoms/scroll-area.tsx`
6. **DropdownMenu** — `src/components/atoms/dropdown-menu.tsx` (portal container pattern)
7. **Table** — `src/components/atoms/table.tsx` (table primitives only)
8. **Breadcrumb** — `src/components/atoms/breadcrumb.tsx` (`@radix-ui/react-slot`)
9. **Loader** — `src/components/atoms/loader.tsx` (many visual variants; export default `Loader` + named variants as in source)
10. **Chip** — `src/components/atoms/chip.tsx`

## Shared prerequisites

- [ ] atoms-01 + atoms-02 complete
- [ ] Peers: `@radix-ui/react-dialog`, `@radix-ui/react-collapsible`, `@radix-ui/react-scroll-area`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-slot`, `lucide-react`, CVA (Sheet)

## Specs

See [components/](./components/).

## Tags

- Accordion / Loader: review for molecule promotion if they grow domain-specific

## Definition of done

- [ ] All 10 + stories + [CHECKLIST.md](./CHECKLIST.md)

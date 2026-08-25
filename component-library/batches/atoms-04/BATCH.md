# Batch atoms-04 — Domain-lean primitives

## Goal

Primitives with light product flavor (ratings, progress, multi-select) still needed before chat composites.

## Implement order

1. **Calendar** — `src/components/atoms/calendar.tsx` (+ `react-day-picker`; depends on **Button** / `buttonVariants`)
2. **StarRating** — `src/components/atoms/star-rating.tsx`
3. **TargetProgressBar** — `src/components/atoms/progress-bar.tsx` (export `TargetProgressBar`, `ProgressSegment`)
4. **CopyButton** — `src/components/atoms/copy-button.tsx` (depends on Button, Tooltip; **strip `logger`**)
5. **CharacterCount** — `src/components/atoms/character-count.tsx` (+ optional `character-count.test.tsx` behavior)
6. **TruncatedBadge** — `src/components/atoms/truncated-badge.tsx` (Badge + Tooltip)
7. **StatusCell** — `src/components/atoms/status-cell.tsx`
8. **SecondaryHeader** — `src/components/atoms/secondary-header.tsx`
9. **TextDiff** — `src/components/atoms/text-diff.tsx` (peer: `diff`)
10. **MultiSelect** — `src/components/atoms/multi-select-dropdown.tsx` (Badge, Checkbox, Popover — tag `promote-to-molecule-later`)

## Shared prerequisites

- [ ] atoms-01–03 complete
- [ ] `react-day-picker`, `diff`, `lucide-react`

## Specs

See [components/](./components/).

## Definition of done

- [ ] All 10 + stories + [CHECKLIST.md](./CHECKLIST.md)
- [ ] CopyButton has no `logger` dependency

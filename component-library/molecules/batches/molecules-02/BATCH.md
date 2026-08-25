# Batch molecules-02 — Date + multi-select

## Goal

Date range picking and searchable multi-select used by agents Action Log / filters.

## Prerequisites

- [ ] molecules-01 done
- [ ] Atoms: Calendar, Button, Popover, Checkbox, Badge, Input

## Implement order

1. **DateRangePicker** (+ hooks/presets) — `src/components/molecules/date-range-picker/`
2. **dropdown-multi-select** — `src/components/molecules/dropdown-multi-select.tsx`

## Source map

| Component | Path |
|-----------|------|
| DateRangePicker | `src/components/molecules/date-range-picker/` (barrel `index.ts`) |
| CalendarMonth / hooks | same package |
| DropdownMultiSelect | `src/components/molecules/dropdown-multi-select.tsx` |

## Do not port

- Hard-coded org calendars / retailer holiday APIs

## Definition of done

- [ ] Public API matches date-range-picker `index.ts`
- [ ] Stories + [CHECKLIST.md](./CHECKLIST.md)

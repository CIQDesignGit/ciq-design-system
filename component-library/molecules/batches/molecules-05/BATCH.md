# Batch molecules-05 — Base data table

## Goal

Schema-driven table system for agents Action Log (and future hosts). Largest molecule batch — expect multiple PRs inside the library repo.

## Prerequisites

- [ ] molecules-04 done (FilterBar may be composed)
- [ ] Atoms: Table, Checkbox, Button, Skeleton, Tooltip, …

## Implement order (suggested sub-PRs)

1. Types (`base-data-table/types/`)
2. Cell registry + core cells
3. `BaseDataTable` + header/body
4. `PaginationV2`
5. Hooks with **injected** fetch (`useBaseDataTableData` adapter)
6. `ExpandableTable` if required by Action Log

## Source root

`src/components/molecules/base-data-table/` — follow existing `index.ts` public API.

## Do not port initially

- `examples/` demos (optional later)
- Deep coupling to `@/types/report` where avoidable — prefer library-local table schema types (or shared types package)

## Definition of done

- [ ] Action Log can render with mock rows in Storybook
- [ ] Formatters reuse molecules-03
- [ ] [CHECKLIST.md](./CHECKLIST.md)
- [ ] Foundational molecules stream complete → chat/alerts/agents feature kits next (separate packs)

# BaseDataTable

## Identity

| Field | Value |
|-------|-------|
| **Name** | `BaseDataTable` (+ cells, hooks, `ExpandableTable`, `PaginationV2`) |
| **neo-canvas source** | `src/components/molecules/base-data-table/` |
| **Story** | `Molecules/BaseDataTable` |
| **Batch** | molecules-05 |

## Public API

Named exports from `@/molecules/base-data-table` (also re-exported from package root).

Highlights: `BaseDataTable`, `ExpandableTable`, `PaginationV2`, `useBaseDataTableData`, `useRowBreakdown`, cell registry + default cells, `toTableRows`, schema/types.

### Naming note

Root barrel already exports atom `TableRow`. Row-data type is exported as **`BaseDataTableRow`** (not `TableRow`) to avoid the clash.

## Data loading (injected)

```ts
useBaseDataTableData({
  schema,
  fetchData: async (payload, state, signal) => ({
    data: rows,
    total: rows.length,
  }),
});
```

Without `fetchData`, the hook sets an error — **no axios / `dataFetcherService` in the library**.

Optional low-level: `fetchTableDataFromDataSource({ …, fetchRaw })` if a host wants nested Genie shaping.

## Formatters

Cell formatters re-export **molecules-03** (`@/molecules/formatters`) — single locale-adapter path.

## Do not port (this batch)

- `examples/` demos / scenario HOCs
- Hard `queryElement` / AuthContext / `__globalConfig`
- Built-in HTTP client

## Acceptance

- [x] Storybook mock rows (`AllFeatures` / `WithFetchAdapter`)
- [x] Formatters reuse molecules-03
- [x] Typecheck + barrel
- [x] ExpandableTable exported

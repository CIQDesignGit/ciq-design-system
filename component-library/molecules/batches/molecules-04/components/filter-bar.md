# FilterBar

## Identity

| Field | Value |
|-------|-------|
| **Name** | `FilterBar` |
| **neo-canvas source** | `src/components/molecules/filters/` |
| **Story** | `Molecules/Filters/FilterBar` |
| **Batch** | molecules-04 |

## Public API

Named export `FilterBar` (+ default for neo parity).

Related: `ValuesList`, `DimensionListSkeleton`, `useFilterData`, types (`FilterState`, `FilterDimension`, `FilterValue`, …), `FilterDataAdapter`.

### Props (additions vs neo)

| Prop | Notes |
|------|-------|
| `filterDataAdapter` | Preferred injectable data layer |
| `container` | Optional portal — no `queryElement` |

## FilterDataAdapter

```ts
type FilterDataAdapter = {
  loadDimensions?: () => Promise<FilterDimension[]>;
  loadValues?: (dimensionId: string) => Promise<FilterDimensionValue[]>;
  fetchRaw?: (payload: FilterFetchPayload) => Promise<unknown>;
};
```

Also supported: `FilterDataSource` with `fetchData` callback (no axios inside library).

## Do not port

- `dataFetcherService`
- `apiAxios`
- `__globalConfig`
- `queryElement` hard dependency

## Note

Atom `FilterModal` value type renamed to `FilterModalValue` so the root barrel can export molecules `FilterValue` without a name clash.

## Acceptance

- [x] Storybook works with mock adapter
- [x] No dataFetcherService in package
- [x] Typecheck + barrel

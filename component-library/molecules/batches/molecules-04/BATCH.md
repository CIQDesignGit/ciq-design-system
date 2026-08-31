# Batch molecules-04 — Filters

## Goal

Port FilterBar UI with an injectable data adapter (agents workspace depends on this).

## Prerequisites

- [x] molecules-03 done
- [x] Atoms: Popover, Checkbox, Input, Button, Skeleton, Badge

## Implement order

1. **FilterBar types** — `src/components/molecules/filters/types.ts`
2. **FilterBar** — `src/components/molecules/filters/filter-bar.tsx` (default export today — library should use named export + barrel)
3. Supporting UI: `ValuesList`, skeletons as needed
4. **Do not** hard-wire `useFilterData` → `dataFetcherService`; accept `FilterDataAdapter`

## Adapter sketch

```ts
export type FilterDataAdapter = {
  loadDimensions?: () => Promise<FilterDimension[]>;
  loadValues?: (dimensionId: string) => Promise<FilterDimensionValue[]>;
  fetchRaw?: (payload: FilterFetchPayload) => Promise<unknown>;
};
```

See [components/filter-bar.md](./components/filter-bar.md).

## Definition of done

- [x] FilterBar works in Storybook with a mock adapter
- [x] No `dataFetcherService` import inside library package
- [x] [CHECKLIST.md](./CHECKLIST.md)

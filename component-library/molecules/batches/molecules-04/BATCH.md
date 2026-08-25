# Batch molecules-04 — Filters

## Goal

Port FilterBar UI with an injectable data adapter (agents workspace depends on this).

## Prerequisites

- [ ] molecules-03 done
- [ ] Atoms: Popover, Checkbox, Input, Button, Skeleton, Badge

## Implement order

1. **FilterBar types** — `src/components/molecules/filters/types.ts`
2. **FilterBar** — `src/components/molecules/filters/filter-bar.tsx` (default export today — library should use named export + barrel)
3. Supporting UI: `ValuesList`, skeletons as needed
4. **Do not** hard-wire `useFilterData` → `dataFetcherService`; accept `FilterDataAdapter`

## Adapter sketch

```ts
export type FilterDataAdapter = {
  // Mirror methods FilterBar/useFilterData actually need — fill when writing full specs
  loadDimensions: () => Promise<unknown>;
  loadValues: (dimensionId: string, query: string) => Promise<unknown>;
};
```

## Source map

| Item | Path |
|------|------|
| FilterBar | `src/components/molecules/filters/filter-bar.tsx` |
| useFilterData | `src/components/molecules/filters/useFilterData.ts` (host or adapter wrapper) |
| filterConfigUtils | `src/components/molecules/filters/filterConfigUtils.ts` |

## Definition of done

- [ ] FilterBar works in Storybook with a mock adapter
- [ ] No `dataFetcherService` import inside library package
- [ ] [CHECKLIST.md](./CHECKLIST.md)

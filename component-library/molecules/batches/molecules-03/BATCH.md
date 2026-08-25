# Batch molecules-03 — Charts + formatters

## Goal

Unlock conversation charts and alert number formatting without the full BaseDataTable.

## Prerequisites

- [ ] molecules-02 done
- [ ] Vega peer deps aligned with neo-canvas (`vega`, `vega-embed`)

## Implement order

1. **Formatters** — `src/components/molecules/base-data-table/cells/formatters.ts` (`formatCurrency`, `formatNumber`, `formatPercent`, `formatCompactNumber`, …)
2. **VegaChart** — `src/components/molecules/reports/`
3. **LazyVegaChart** — `src/components/molecules/reports/lazyVegaChart.ts` (or sibling path used by conversations)

## Adapter

| Concern | Approach |
|---------|----------|
| Locale / currency | Props or `FormatLocaleAdapter` — **no** `window.__globalConfig` |
| Theme colors for charts | Optional `colors` prop / `useThemeColors` equivalent injected by host |

## Source map

| Item | Path |
|------|------|
| formatters | `src/components/molecules/base-data-table/cells/formatters.ts` |
| VegaChart | `src/components/molecules/reports/` |
| Lazy loader | search `lazyVegaChart` under `molecules/reports/` |

## Definition of done

- [ ] Alerts can format currency/numbers via library
- [ ] Conversations can lazy-load VegaChart
- [ ] [CHECKLIST.md](./CHECKLIST.md)

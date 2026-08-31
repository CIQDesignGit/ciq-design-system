# VegaChart / LazyVegaChart

## Identity

| Field | Value |
|-------|-------|
| **Name** | `VegaChart`, `LazyVegaChart` |
| **neo-canvas source** | `src/components/molecules/reports/` |
| **Story** | `Molecules/Reports/VegaChart`, `Molecules/Reports/LazyVegaChart` |
| **Batch** | molecules-03 |

## Public API

`VegaChart`, `LazyVegaChart`, types `VegaChartProps`, `TooltipFormatter`

### Library adaptation

| Change | Why |
|--------|-----|
| `onError` + `console.error` | No app `logger` |
| Deps: `vega`, `vega-embed` | Match neo |

## Acceptance

- [x] Conversations can lazy-load charts
- [x] Stories + typecheck

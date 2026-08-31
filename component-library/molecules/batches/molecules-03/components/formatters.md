# Formatters

## Identity

| Field | Value |
|-------|-------|
| **Name** | Formatters (`formatCurrency`, `formatNumber`, `formatPercent`, …) |
| **neo-canvas source** | `src/components/molecules/base-data-table/cells/formatters.ts` |
| **Library path** | `packages/ui/src/molecules/formatters.ts` |
| **Story** | `Molecules/Formatters` |
| **Batch** | molecules-03 |

## Public API

`formatCurrency`, `formatPercent`, `formatCompactNumber`, `formatNumber`, `formatDecimal`, `formatValue`, `formatCellValue`, `parseNumericValue`, `isNumericFormat`, `isRightAligned`, `getLocaleFormatDefaults`, `setFormatLocaleAdapter`

Types: `FormatType`, `FormatOptions`, `FormatLocaleAdapter`

## Adapter

```ts
setFormatLocaleAdapter({
  getLocaleConfig: () => ({ locale: "en-US", currencyString: "USD" }),
});
```

**Do not** read `window.__globalConfig`.

## Acceptance

- [x] Locale injectable
- [x] Stories + typecheck

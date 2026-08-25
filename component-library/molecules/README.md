# Molecules handoff (after atoms)

Use the same Batch Pack format as atoms ([`_template/`](../_template/)). Start only after **atoms-01 through atoms-06** are implemented in the library repo.

## Goal

Unlock foundational molecules needed by agents, alerts, and conversations — without shipping full dashboarding/reporting product surfaces yet.

## Frozen molecule batches

| Batch | Folder | Goal | Items (implement order) |
|-------|--------|------|-------------------------|
| **m00** | — | Shared formatters / types adapters | Decide locale injection (`__globalConfig` → props) |
| **m01** | [`batches/molecules-01/`](./batches/molecules-01/) | Feedback + confirms | `feedback/` (FeedbackForm, FeedbackPopover, FeedbackPopoverGroup), `confirmation-modal.tsx` |
| **m02** | [`batches/molecules-02/`](./batches/molecules-02/) | Date + multi-select | `date-range-picker/`, `dropdown-multi-select.tsx` |
| **m03** | [`batches/molecules-03/`](./batches/molecules-03/) | Charts + formatters | `reports/VegaChart` + `lazyVegaChart`, `base-data-table/cells/formatters` (currency/number/percent) |
| **m04** | [`batches/molecules-04/`](./batches/molecules-04/) | Filters | `filters/FilterBar` + types; **adapter** for `dataFetcherService` / `useFilterData` |
| **m05** | [`batches/molecules-05/`](./batches/molecules-05/) | Data table | `base-data-table/` core (table, cells registry, pagination) with injectable data hooks |

## Deferred (not in first molecule stream)

| Folder / file | Why defer |
|---------------|-----------|
| `molecules/dashboard/` | Dashboarding module |
| `molecules/reporting/` (most) | Report page + content-agent coupling |
| `molecules/agent-panel/` | Agents chrome — ship with agents kit |
| `molecules/metric-tiles/` | Optional; dashboard-coupled tooltip |
| `BlankReportDescription`, `RightSidebars` | AgentPlugin slots — agents kit |

## Adapter rule

Molecules that call `dataFetcherService`, `exportService`, `__globalConfig`, or module code must expose:

```ts
// Example shape — exact interfaces defined per batch pack
type FilterDataAdapter = {
  fetchDimensionValues: (...) => Promise<...>;
};
```

Host (neo-canvas) implements adapters; library stays UI-only.

## Next action

When atoms are done in the library repo, write **full** `molecules-01` component specs (same depth as `atoms-01`) starting with feedback + confirmation-modal. Pack shells are already under `batches/molecules-0N/`.

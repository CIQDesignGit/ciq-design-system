# DateRangePicker

## Identity

| Field | Value |
|-------|-------|
| **Name** | `DateRangePicker` |
| **neo-canvas source** | `src/components/molecules/date-range-picker/` |
| **Related files** | `CalendarMonth`, hooks, presets, utils, types |
| **Story** | `apps/storybook/stories/molecules/date-range-picker.stories.tsx` |
| **Storybook title** | `Molecules/DateRangePicker` |
| **Batch** | molecules-02 |
| **Tags** | `composite` |

## Public API

Matches neo-canvas `date-range-picker/index.ts`:

- `DateRangePicker`, `CalendarMonth`
- Hooks: `useDateInputs`, `useDateRangeState`
- Presets: `defaultDateRangePresets`, `defaultComparePresets`
- Utils: `formatDate`, `normalizeDateRange`, `detectPresetFromRange`, …
- Types: `DateRange`, `DateRangePickerValue`, `DateRangePickerProps`, …

### Library adaptation

| Change | Why |
|--------|-----|
| Optional `container` prop | Replaces `getPortalContainer()` / web-component |
| `console.error` on bad preset keys | Replaces app `logger` |
| Peer/dep: `dayjs` | Same as neo |

## Do not port

Org calendars, retailer holiday APIs, `__globalConfig`.

## Acceptance

- [x] Public API matches barrel
- [x] Stories + typecheck
- [x] No app coupling

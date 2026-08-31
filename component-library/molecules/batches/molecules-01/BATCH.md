# Batch molecules-01 — Feedback + confirms

## Goal

Ship feedback UI used by conversations and alerts, plus the shared confirmation modal used by agents.

## Prerequisites

- [x] Atom batches 01–06 implemented in the library
- [x] Batch 01 atoms available: Button, Textarea, Label, Checkbox, etc.

## Implement order

1. **FeedbackForm** — `src/components/molecules/feedback/` (see folder `index.ts` exports)
2. **FeedbackPopover** / **FeedbackPopoverGroup**
3. **confirmation-modal** — `src/components/molecules/confirmation-modal.tsx`

## Shared notes

| Item | Source | Adapter / strip |
|------|--------|-----------------|
| Feedback submit | Often wired to services in app | Inject `onSubmit` — do not import agents `feedbackService` inside library |
| Types | `FeedbackSentiment`, `FeedbackTagOption` | Export from library barrel |

## Specs

See [components/](./components/).

### Source map

| Component | Path | Stories |
|-----------|------|---------|
| FeedbackForm | `src/components/molecules/feedback/` | colocated `*.stories.tsx` |
| FeedbackPopover | same | same |
| FeedbackPopoverGroup | same | same |
| ConfirmationModal | `src/components/molecules/confirmation-modal.tsx` | if present / add in library |

## Definition of done

- [x] Exports match neo-canvas `feedback/index.ts` + confirmation modal API
- [x] No axios / feedbackService imports in library
- [x] Stories render
- [x] [CHECKLIST.md](./CHECKLIST.md) complete

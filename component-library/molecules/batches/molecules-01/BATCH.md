# Batch molecules-01 — Feedback + confirms

## Goal

Ship feedback UI used by conversations and alerts, plus the shared confirmation modal used by agents.

## Prerequisites

- [ ] Atom batches 01–06 implemented in the library
- [ ] Batch 01 atoms available: Button, Textarea, Label, Checkbox, etc.

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

Write per-component markdown under `components/` when this batch is activated (use [`_template/COMPONENT.md`](../../_template/COMPONENT.md)). Until then this BATCH.md is the freeze contract.

### Source map

| Component | Path | Stories |
|-----------|------|---------|
| FeedbackForm | `src/components/molecules/feedback/` | colocated `*.stories.tsx` |
| FeedbackPopover | same | same |
| FeedbackPopoverGroup | same | same |
| ConfirmationModal | `src/components/molecules/confirmation-modal.tsx` | if present / add in library |

## Definition of done

- [ ] Exports match neo-canvas `feedback/index.ts` + confirmation modal API
- [ ] No axios / feedbackService imports in library
- [ ] Stories render
- [ ] [CHECKLIST.md](./CHECKLIST.md) complete

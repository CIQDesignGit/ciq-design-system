# FeedbackPopover

## Identity

| Field | Value |
|-------|-------|
| **Name** | `FeedbackPopover` |
| **neo-canvas source** | `src/components/molecules/feedback/FeedbackPopover.tsx` |
| **Related files** | `FeedbackForm`, `feedbackPopoverGroupContext` |
| **Story** | `apps/storybook/stories/molecules/feedback-popover.stories.tsx` |
| **Storybook title** | `Molecules/Feedback/FeedbackPopover` |
| **Batch** | molecules-01 |
| **Tags** | `composite` |

## Public API

### Exports

`FeedbackPopover`, type `FeedbackPopoverProps`

### Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `sentiment` | `FeedbackSentiment` | — | |
| `tags` | `FeedbackTagOption[]` | — | |
| `onSubmit` | `(sentiment, comment, tags) => void \| Promise` | — | Host injects |
| `autoSubmitOnClose` | `boolean` | `false` | Outside click submits draft |
| `children` | `ReactNode` | — | Trigger |
| `align` / `side` | Popover placement | `end` / `top` | |
| `open` / `onOpenChange` | controlled | — | Ignored inside group |

## Dependencies

Popover atoms, FeedbackForm

## Do not port

App feedback services.

## Acceptance

- [x] Matches neo-canvas exports
- [x] Stories render

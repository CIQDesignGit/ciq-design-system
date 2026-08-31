# FeedbackForm

## Identity

| Field | Value |
|-------|-------|
| **Name** | `FeedbackForm` |
| **neo-canvas source** | `src/components/molecules/feedback/FeedbackForm.tsx` |
| **Related files** | `types.ts` |
| **Story** | `apps/storybook/stories/molecules/feedback-form.stories.tsx` |
| **Storybook title** | `Molecules/Feedback/FeedbackForm` |
| **Batch** | molecules-01 |
| **Tags** | `composite` |

## Public API

### Exports

`FeedbackForm`, type `FeedbackFormProps`, types `FeedbackSentiment`, `FeedbackTagOption`

### Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `sentiment` | `FeedbackSentiment` | — | Drives placeholder |
| `tags` | `FeedbackTagOption[]` | — | Optional chips |
| `selectedTags` | `string[]` | `[]` | Controlled |
| `onTagClick` | `(value: string) => void` | — | Required when tags shown |
| `comment` | `string` | — | Controlled |
| `onCommentChange` | `(value: string) => void` | — | |
| `onSubmit` / `onSkip` | `() => void` | — | Host wires services |
| `isSubmitting` | `boolean` | `false` | |
| `submitDisabled` | `boolean` | `false` | |

## Dependencies

Button, Textarea, `cn`, lucide-react

## Do not port

App `feedbackService`, axios, agents modules — inject `onSubmit` only.

## Acceptance

- [x] Public API matches neo-canvas
- [x] Stories render
- [x] No service coupling

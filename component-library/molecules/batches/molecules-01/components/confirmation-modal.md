# ConfirmationModal

## Identity

| Field | Value |
|-------|-------|
| **Name** | `ConfirmationModal` |
| **neo-canvas source** | `src/components/molecules/confirmation-modal.tsx` |
| **Related files** | — |
| **Story** | `apps/storybook/stories/molecules/confirmation-modal.stories.tsx` |
| **Storybook title** | `Molecules/ConfirmationModal` |
| **Batch** | molecules-01 |
| **Tags** | `composite` |

## Public API

### Exports

`ConfirmationModal`, type `ConfirmationModalProps`

### Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `isOpen` | `boolean` | — | |
| `onClose` / `onConfirm` | `() => void` | — | |
| `title` | `string` | — | |
| `message` | `string \| ReactNode` | — | |
| `confirmLabel` / `cancelLabel` | `string` | Confirm / Cancel | |
| `confirmVariant` | `"default" \| "destructive"` | `default` | Hard-coded violet/red (tech debt) |
| `showDontShowAgain` | `boolean` | `false` | |
| `dontShowAgainKey` | `string` | — | localStorage key |
| `isLoading` | `boolean` | `false` | |
| `width` | `string` | `560px` | |
| `children` | `ReactNode` | — | Custom body |

## Dependencies

Layover, Button, Checkbox, Label, lucide-react

## Do not port

App routers / services. Keep presentational + optional localStorage for don't-show-again.

## Acceptance

- [x] Public API matches neo-canvas
- [x] Stories render

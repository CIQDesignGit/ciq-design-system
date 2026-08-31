# DropdownMultiSelect

## Identity

| Field | Value |
|-------|-------|
| **Name** | `DropdownMultiSelect` |
| **neo-canvas source** | `src/components/molecules/dropdown-multi-select.tsx` |
| **Story** | `apps/storybook/stories/molecules/dropdown-multi-select.stories.tsx` |
| **Storybook title** | `Molecules/DropdownMultiSelect` |
| **Batch** | molecules-02 |
| **Tags** | `composite` |

## Public API

`DropdownMultiSelect`, types `DropdownMultiSelectProps`, `DropdownMultiSelectOption`

Staged selection with Search / Select all / Clear / Save / Cancel. Calls `onChange` on Save only.

### Library adaptation

| Change | Why |
|--------|-----|
| Optional `container` only | No `queryElement` / `#overlay-portal` |
| `useIsTruncated` in library hooks | No neo `@/hooks` |

## Acceptance

- [x] Public API matches neo
- [x] Stories + typecheck
- [x] No web-component coupling

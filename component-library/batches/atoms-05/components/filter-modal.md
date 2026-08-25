# FilterModal

## Identity

| Field | Value |
|-------|-------|
| **Name** | `FilterModal` |
| **neo-canvas source** | `src/components/atoms/filter-modal.tsx` |
| **Related files** | — |
| **Story** | `src/components/atoms/filter-modal.stories.tsx` |
| **Storybook title** | `Atoms/FilterModal` |
| **In atoms barrel today?** | Yes |
| **Batch** | atoms-05 |
| **Tags** | `promote-to-molecule-later` |

## Public API

### Exports

`FilterModal`, types `FilterColumn`, `FilterValue`, `FilterModalProps`

### Props / variants

Open the source file and preserve the full exported TypeScript surface (props, compound parts, CVA variants). Document any intentional API changes in the library PR.

## Dependencies

### npm / peers

| Package | Why |
|---------|-----|
| `react` | state |

### Internal (library)

| Layover, Checkbox, Input, Button, `cn` |

## Tokens / classes

Preserve token-backed Tailwind classes from source. Note hard-coded colors as tech debt when porting.

## Behavior

Two-pane filter modal — promote-to-molecule-later.

## Source of truth

1. Port `src/components/atoms/filter-modal.tsx` (and related files).
2. Remap `@/utils` / `@/utils/cn` → library `cn`.
3. Remap deep atom imports → library barrel.
4. Strip `@/web-component/*` — optional `container` for portals.
5. Strip `@/constants/colors` by injecting tokens/props where needed.

## Stories

Mirror colocated `*.stories.tsx` exports (Default + variants in source).

## Do not port

App contexts, services, routers, `queryElement` hard dependency (use optional `container` for portals).

## Acceptance

- [ ] Public API matches neo-canvas exports used by consumers
- [ ] Stories render under `Atoms/FilterModal`
- [ ] No required neo-canvas app/runtime coupling
- [ ] Typecheck clean

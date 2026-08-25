# OrderedMultiSelect

## Identity

| Field | Value |
|-------|-------|
| **Name** | `OrderedMultiSelect` |
| **neo-canvas source** | `src/components/atoms/ordered-multi-select/ordered-multi-select.tsx` |
| **Related files** | `ordered-multi-select/index.ts` |
| **Story** | `src/components/atoms/ordered-multi-select/OrderedMultiSelect.stories.tsx` |
| **Storybook title** | `Atoms/OrderedMultiSelect` |
| **In atoms barrel today?** | No (local barrel only) |
| **Batch** | atoms-05 |
| **Tags** | `promote-to-molecule-later` |

## Public API

### Exports

`OrderedMultiSelect`

### Props / variants

Open the source file and preserve the full exported TypeScript surface (props, compound parts, CVA variants). Document any intentional API changes in the library PR.

## Dependencies

### npm / peers

| Package | Why |
|---------|-----|
| Same family as MultiSelect | |

### Internal (library)

| Checkbox/Badge/Popover as in source, `cn` |

## Tokens / classes

Preserve token-backed Tailwind classes from source. Note hard-coded colors as tech debt when porting.

## Behavior

Port entire `ordered-multi-select/` folder.

## Source of truth

1. Port `src/components/atoms/ordered-multi-select/ordered-multi-select.tsx` (and related files).
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
- [ ] Stories render under `Atoms/OrderedMultiSelect`
- [ ] No required neo-canvas app/runtime coupling
- [ ] Typecheck clean

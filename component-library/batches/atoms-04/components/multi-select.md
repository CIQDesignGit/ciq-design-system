# MultiSelect

## Identity

| Field | Value |
|-------|-------|
| **Name** | `MultiSelect` |
| **neo-canvas source** | `src/components/atoms/multi-select-dropdown.tsx` |
| **Related files** | — |
| **Story** | `src/components/atoms/MultiSelect.stories.tsx` |
| **Storybook title** | `Atoms/MultiSelect` |
| **In atoms barrel today?** | Yes |
| **Batch** | atoms-04 |
| **Tags** | `promote-to-molecule-later` |

## Public API

### Exports

`MultiSelect`, type `MultiSelectOption`

### Props / variants

Open the source file and preserve the full exported TypeScript surface (props, compound parts, CVA variants). Document any intentional API changes in the library PR.

## Dependencies

### npm / peers

| Package | Why |
|---------|-----|
| `lucide-react` | ChevronDown, Loader2, X |

### Internal (library)

| `Badge`, `Checkbox`, Popover*, `cn` |

## Tokens / classes

Preserve token-backed Tailwind classes from source. Note hard-coded colors as tech debt when porting.

## Behavior

Complex select — tag promote-to-molecule-later.

## Source of truth

1. Port `src/components/atoms/multi-select-dropdown.tsx` (and related files).
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
- [ ] Stories render under `Atoms/MultiSelect`
- [ ] No required neo-canvas app/runtime coupling
- [ ] Typecheck clean

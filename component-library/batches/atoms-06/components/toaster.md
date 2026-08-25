# Toaster

## Identity

| Field | Value |
|-------|-------|
| **Name** | `Toaster` |
| **neo-canvas source** | `src/components/atoms/toaster.tsx` |
| **Related files** | — |
| **Story** | `src/components/atoms/toaster.stories.tsx` |
| **Storybook title** | `Atoms/Toaster` |
| **In atoms barrel today?** | No |
| **Batch** | atoms-06 |
| **Tags** | `primitive` |

## Public API

### Exports

`Toaster`

### Props / variants

Open the source file and preserve the full exported TypeScript surface (props, compound parts, CVA variants). Document any intentional API changes in the library PR.

## Dependencies

### npm / peers

| Package | Why |
|---------|-----|
| Toast lib used in source (e.g. sonner if present) | |

### Internal (library)

| `cn` |

## Tokens / classes

Preserve token-backed Tailwind classes from source. Note hard-coded colors as tech debt when porting.

## Behavior

Export GlobalToaster / Toaster as named in source; host wires app errors.

## Source of truth

1. Port `src/components/atoms/toaster.tsx` (and related files).
2. Remap `@/utils` / `@/utils/cn` → library `cn`.
3. Remap deep atom imports → library barrel.
4. Strip `@/web-component/*` — optional `container` for portals.
5. Strip `@/constants/colors` by injecting tokens/props where needed.

## Stories

Mirror colocated `*.stories.tsx` exports (Default + variants in source).

## Do not port

Do not wire axios interceptors.

## Acceptance

- [ ] Public API matches neo-canvas exports used by consumers
- [ ] Stories render under `Atoms/Toaster`
- [ ] No required neo-canvas app/runtime coupling
- [ ] Typecheck clean

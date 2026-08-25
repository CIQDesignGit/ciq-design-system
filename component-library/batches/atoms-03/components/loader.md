# Loader

## Identity

| Field | Value |
|-------|-------|
| **Name** | `Loader` |
| **neo-canvas source** | `src/components/atoms/loader.tsx` |
| **Related files** | — |
| **Story** | `src/components/atoms/loader.stories.tsx` |
| **Storybook title** | `Atoms/Loader` |
| **In atoms barrel today?** | Yes (`Loader`) |
| **Batch** | atoms-03 |
| **Tags** | `primitive` |

## Public API

### Exports

`Loader`

### Props / variants

Open the source file and preserve the full exported TypeScript surface (props, compound parts, CVA variants). Document any intentional API changes in the library PR.

## Dependencies

### npm / peers

| Package | Why |
|---------|-----|
| `react` | |

### Internal (library)

| `cn` from `@/utils/cn` |

## Tokens / classes

Preserve token-backed Tailwind classes from source. Note hard-coded colors as tech debt when porting.

## Behavior

Multiple loader variants in one file — export all named variants + default Loader.

## Source of truth

1. Port `src/components/atoms/loader.tsx` (and related files).
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
- [ ] Stories render under `Atoms/Loader`
- [ ] No required neo-canvas app/runtime coupling
- [ ] Typecheck clean

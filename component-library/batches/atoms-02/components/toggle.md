# Toggle

## Identity

| Field | Value |
|-------|-------|
| **Name** | `Toggle` |
| **neo-canvas source** | `src/components/atoms/toggle.tsx` |
| **Related files** | — |
| **Story** | `src/components/atoms/toggle.stories.tsx` |
| **Storybook title** | `Atoms/Toggle` |
| **In atoms barrel today?** | No |
| **Batch** | atoms-02 |
| **Tags** | `primitive` |

## Public API

### Exports

`Toggle`

### Props / variants

Open the source file and preserve the full exported TypeScript surface (props, compound parts, CVA variants). Document any intentional API changes in the library PR.

## Dependencies

### npm / peers

| Package | Why |
|---------|-----|
| `react` | |

### Internal (library)

| `cn` | Replace `CHART_COLORS` |

## Tokens / classes

Preserve token-backed Tailwind classes from source. Note hard-coded colors as tech debt when porting.

## Behavior

Uses `@/constants/colors` CHART_COLORS — accept color props or CSS variables instead.

## Source of truth

1. Port `src/components/atoms/toggle.tsx` (and related files).
2. Remap `@/utils` / `@/utils/cn` → library `cn`.
3. Remap deep atom imports → library barrel.
4. Strip `@/web-component/*` — optional `container` for portals.
5. Strip `@/constants/colors` by injecting tokens/props where needed.

## Stories

Mirror colocated `*.stories.tsx` exports (Default + variants in source).

## Do not port

Do not import `@/constants/colors`. Provide tokenized defaults.

## Acceptance

- [ ] Public API matches neo-canvas exports used by consumers
- [ ] Stories render under `Atoms/Toggle`
- [ ] No required neo-canvas app/runtime coupling
- [ ] Typecheck clean

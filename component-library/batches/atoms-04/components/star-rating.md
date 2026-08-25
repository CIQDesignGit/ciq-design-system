# StarRating

## Identity

| Field | Value |
|-------|-------|
| **Name** | `StarRating` |
| **neo-canvas source** | `src/components/atoms/star-rating.tsx` |
| **Related files** | — |
| **Story** | `src/components/atoms/star-rating.stories.tsx` |
| **Storybook title** | `Atoms/StarRating` |
| **In atoms barrel today?** | Yes |
| **Batch** | atoms-04 |
| **Tags** | `primitive` |

## Public API

### Exports

`StarRating`

### Props / variants

Open the source file and preserve the full exported TypeScript surface (props, compound parts, CVA variants). Document any intentional API changes in the library PR.

## Dependencies

### npm / peers

| Package | Why |
|---------|-----|
| `lucide-react` | Star, StarHalf |

### Internal (library)

| `cn` |

## Tokens / classes

Preserve token-backed Tailwind classes from source. Note hard-coded colors as tech debt when porting.

## Behavior

Display-only rating; preserve half-star logic.

## Source of truth

1. Port `src/components/atoms/star-rating.tsx` (and related files).
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
- [ ] Stories render under `Atoms/StarRating`
- [ ] No required neo-canvas app/runtime coupling
- [ ] Typecheck clean

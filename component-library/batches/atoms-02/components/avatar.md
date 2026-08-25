# Avatar

## Identity

| Field | Value |
|-------|-------|
| **Name** | `Avatar` |
| **neo-canvas source** | `src/components/atoms/avatar.tsx` |
| **Related files** | — |
| **Story** | `src/components/atoms/avatar.stories.tsx` |
| **Storybook title** | `Atoms/Avatar` |
| **In atoms barrel today?** | Yes |
| **Batch** | atoms-02 |
| **Tags** | `primitive` |

## Public API

### Exports

`Avatar`

### Props / variants

Open the source file and preserve the full exported TypeScript surface (props, compound parts, CVA variants). Document any intentional API changes in the library PR.

## Dependencies

### npm / peers

| Package | Why |
|---------|-----|
| `@radix-ui/react-avatar` | Primitive |

### Internal (library)

| `cn` |

## Tokens / classes

Preserve token-backed Tailwind classes from source. Note hard-coded colors as tech debt when porting.

## Behavior

Export Avatar, AvatarImage, AvatarFallback.

## Source of truth

1. Port `src/components/atoms/avatar.tsx` (and related files).
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
- [ ] Stories render under `Atoms/Avatar`
- [ ] No required neo-canvas app/runtime coupling
- [ ] Typecheck clean

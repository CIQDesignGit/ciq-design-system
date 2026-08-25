# Sidebar

## Identity

| Field | Value |
|-------|-------|
| **Name** | `Sidebar` |
| **neo-canvas source** | `src/components/atoms/sidebar.tsx` |
| **Related files** | — |
| **Story** | `src/components/atoms/sidebar.stories.tsx` |
| **Storybook title** | `Atoms/Sidebar` |
| **In atoms barrel today?** | No |
| **Batch** | atoms-06 |
| **Tags** | `promote-to-molecule-later` |

## Public API

### Exports

`Sidebar`

### Props / variants

Open the source file and preserve the full exported TypeScript surface (props, compound parts, CVA variants). Document any intentional API changes in the library PR.

## Dependencies

### npm / peers

| Package | Why |
|---------|-----|
| Radix/Sheet deps as in source | Large shell |

### Internal (library)

| Sheet, Button, `cn`, etc. |

## Tokens / classes

Preserve token-backed Tailwind classes from source. Note hard-coded colors as tech debt when porting.

## Behavior

Large sidebar system with context. Prefer library-local SidebarProvider; no app router.

## Source of truth

1. Port `src/components/atoms/sidebar.tsx` (and related files).
2. Remap `@/utils` / `@/utils/cn` → library `cn`.
3. Remap deep atom imports → library barrel.
4. Strip `@/web-component/*` — optional `container` for portals.
5. Strip `@/constants/colors` by injecting tokens/props where needed.

## Stories

Mirror colocated `*.stories.tsx` exports (Default + variants in source).

## Do not port

Do not couple to neo-canvas routes or AgentLayout.

## Acceptance

- [ ] Public API matches neo-canvas exports used by consumers
- [ ] Stories render under `Atoms/Sidebar`
- [ ] No required neo-canvas app/runtime coupling
- [ ] Typecheck clean

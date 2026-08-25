# ChatContainer

## Identity

| Field | Value |
|-------|-------|
| **Name** | `ChatContainer` |
| **neo-canvas source** | `src/components/atoms/chat-container.tsx` |
| **Related files** | — |
| **Story** | `src/components/atoms/chat-container.stories.tsx` |
| **Storybook title** | `Atoms/ChatContainer` |
| **In atoms barrel today?** | No |
| **Batch** | atoms-05 |
| **Tags** | `promote-to-molecule-later` |

## Public API

### Exports

`ChatContainer`

### Props / variants

Open the source file and preserve the full exported TypeScript surface (props, compound parts, CVA variants). Document any intentional API changes in the library PR.

## Dependencies

### npm / peers

| Package | Why |
|---------|-----|
| `use-stick-to-bottom` | Stick scroll |

### Internal (library)

| `cn` |

## Tokens / classes

Preserve token-backed Tailwind classes from source. Note hard-coded colors as tech debt when porting.

## Behavior

Export ChatContainerRoot / ChatContainerContent as in source.

## Source of truth

1. Port `src/components/atoms/chat-container.tsx` (and related files).
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
- [ ] Stories render under `Atoms/ChatContainer`
- [ ] No required neo-canvas app/runtime coupling
- [ ] Typecheck clean

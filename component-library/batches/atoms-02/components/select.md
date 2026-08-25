# Select

## Identity

| Field | Value |
|-------|-------|
| **Name** | `Select` |
| **neo-canvas source** | `src/components/atoms/select.tsx` |
| **Related files** | — |
| **Story** | `src/components/atoms/select.stories.tsx` |
| **Storybook title** | `Atoms/Select` |
| **In atoms barrel today?** | Yes (compound) |
| **Batch** | atoms-02 |
| **Tags** | `primitive` |

## Public API

### Exports

Export all Select* parts from source (`Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectValue`, scroll buttons, group, label, separator).

### Props / variants

Open the source file and preserve the full exported TypeScript surface (props, compound parts, CVA variants). Document any intentional API changes in the library PR.

## Dependencies

### npm / peers

| Package | Why |
|---------|-----|
| `@radix-ui/react-select` | Primitive |
| `lucide-react` | Chevrons / check |

### Internal (library)

| `cn` |

## Tokens / classes

Preserve token-backed Tailwind classes from source. Note hard-coded colors as tech debt when porting.

## Behavior

Compound Select*; portal: optional `container`, no `#overlay-portal`.

## Source of truth

1. Port `src/components/atoms/select.tsx` (and related files).
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
- [ ] Stories render under `Atoms/Select`
- [ ] No required neo-canvas app/runtime coupling
- [ ] Typecheck clean

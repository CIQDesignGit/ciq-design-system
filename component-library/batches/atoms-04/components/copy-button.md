# CopyButton

## Identity

| Field | Value |
|-------|-------|
| **Name** | `CopyButton` |
| **neo-canvas source** | `src/components/atoms/copy-button.tsx` |
| **Related files** | — |
| **Story** | `src/components/atoms/copy-button.stories.tsx` |
| **Storybook title** | `Atoms/CopyButton` |
| **In atoms barrel today?** | No |
| **Batch** | atoms-04 |
| **Tags** | `primitive` |

## Public API

### Exports

`CopyButton`

### Props / variants

Open the source file and preserve the full exported TypeScript surface (props, compound parts, CVA variants). Document any intentional API changes in the library PR.

## Dependencies

### npm / peers

| Package | Why |
|---------|-----|
| `lucide-react` | Copy, Check |

### Internal (library)

| `Button`, Tooltip*, `cn` |

## Tokens / classes

Preserve token-backed Tailwind classes from source. Note hard-coded colors as tech debt when porting.

## Behavior

Clipboard write; strip `@/utils/logger` — use silent catch or optional onError.

## Source of truth

1. Port `src/components/atoms/copy-button.tsx` (and related files).
2. Remap `@/utils` / `@/utils/cn` → library `cn`.
3. Remap deep atom imports → library barrel.
4. Strip `@/web-component/*` — optional `container` for portals.
5. Strip `@/constants/colors` by injecting tokens/props where needed.

## Stories

Mirror colocated `*.stories.tsx` exports (Default + variants in source).

## Do not port

Do not port `logger`. Do not require Tooltip portal hacks.

## Acceptance

- [ ] Public API matches neo-canvas exports used by consumers
- [ ] Stories render under `Atoms/CopyButton`
- [ ] No required neo-canvas app/runtime coupling
- [ ] Typecheck clean

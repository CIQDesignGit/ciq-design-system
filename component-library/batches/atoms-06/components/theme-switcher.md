# ThemeSwitcher

## Identity

| Field | Value |
|-------|-------|
| **Name** | `ThemeSwitcher` |
| **neo-canvas source** | `src/components/atoms/theme-switcher.tsx` |
| **Related files** | — |
| **Story** | `src/components/atoms/theme-switcher.stories.tsx` |
| **Storybook title** | `Atoms/ThemeSwitcher` |
| **In atoms barrel today?** | No |
| **Batch** | atoms-06 |
| **Tags** | `primitive` |

## Public API

### Exports

`ThemeSwitcher`

### Props / variants

Open the source file and preserve the full exported TypeScript surface (props, compound parts, CVA variants). Document any intentional API changes in the library PR.

## Dependencies

### npm / peers

| Package | Why |
|---------|-----|
| `lucide-react` | Sun/Moon |

### Internal (library)

| Button/Toggle as in source |

## Tokens / classes

Preserve token-backed Tailwind classes from source. Note hard-coded colors as tech debt when porting.

## Behavior

Inject theme via props or library ThemeProvider — do not import neo-canvas ThemeContext.

## Source of truth

1. Port `src/components/atoms/theme-switcher.tsx` (and related files).
2. Remap `@/utils` / `@/utils/cn` → library `cn`.
3. Remap deep atom imports → library barrel.
4. Strip `@/web-component/*` — optional `container` for portals.
5. Strip `@/constants/colors` by injecting tokens/props where needed.

## Stories

Mirror colocated `*.stories.tsx` exports (Default + variants in source).

## Do not port

Do not import `@/contexts/ThemeContext`.

## Acceptance

- [ ] Public API matches neo-canvas exports used by consumers
- [ ] Stories render under `Atoms/ThemeSwitcher`
- [ ] No required neo-canvas app/runtime coupling
- [ ] Typecheck clean

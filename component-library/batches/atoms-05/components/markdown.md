# Markdown

## Identity

| Field | Value |
|-------|-------|
| **Name** | `Markdown` |
| **neo-canvas source** | `src/components/atoms/markdown.tsx` |
| **Related files** | `markdown-content.tsx`, `markdown-content.stories.tsx` |
| **Story** | `src/components/atoms/markdown.stories.tsx` |
| **Storybook title** | `Atoms/Markdown` |
| **In atoms barrel today?** | Yes |
| **Batch** | atoms-05 |
| **Tags** | `promote-to-molecule-later` |

## Public API

### Exports

`Markdown`, type `MarkdownProps`

### Props / variants

Open the source file and preserve the full exported TypeScript surface (props, compound parts, CVA variants). Document any intentional API changes in the library PR.

## Dependencies

### npm / peers

| Package | Why |
|---------|-----|
| `react-markdown` | Rendering |
| `remark-gfm` | GFM |
| Related deps from markdown-content | Tables/sanitize |

### Internal (library)

| `markdown-content`, `cn` |

## Tokens / classes

Preserve token-backed Tailwind classes from source. Note hard-coded colors as tech debt when porting.

## Behavior

Port markdown.tsx + markdown-content.tsx together. Document sanitize allowlist.

## Source of truth

1. Port `src/components/atoms/markdown.tsx` (and related files).
2. Remap `@/utils` / `@/utils/cn` → library `cn`.
3. Remap deep atom imports → library barrel.
4. Strip `@/web-component/*` — optional `container` for portals.
5. Strip `@/constants/colors` by injecting tokens/props where needed.

## Stories

Mirror colocated `*.stories.tsx` exports (Default + variants in source).

## Do not port

Do not enable raw HTML without the same sanitization as neo-canvas.

## Acceptance

- [ ] Public API matches neo-canvas exports used by consumers
- [ ] Stories render under `Atoms/Markdown`
- [ ] No required neo-canvas app/runtime coupling
- [ ] Typecheck clean

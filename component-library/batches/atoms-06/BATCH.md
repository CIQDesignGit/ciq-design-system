# Batch atoms-06 — App-shell leftovers

## Goal

Finish remaining atom-folder components. Several are app-coupled — adapt with injection points.

## Implement order

1. **Sidebar** — `src/components/atoms/sidebar.tsx` (~large; context + mobile sheet; `promote-to-molecule-later`)
2. **ThemeSwitcher** — `src/components/atoms/theme-switcher.tsx` (**do not** hard-wire neo-canvas `ThemeContext` — accept `theme` / `onThemeChange` props or a tiny local provider in the library)
3. **Toaster** / `GlobalToaster` — `src/components/atoms/toaster.tsx` (match toast library used in source; keep presentational)
4. **SectionMarkdown** — `src/components/atoms/section-markdown.tsx` (thin Markdown wrapper for report sections)

## Shared prerequisites

- [ ] atoms-01–05 complete
- [ ] Sheet / Button / Markdown already in library

## Specs

See [components/](./components/).

## Out of scope

- Full neo-canvas ThemeProvider / localStorage persistence (host owns that)
- neo-canvas toast wiring to axios errors

## Definition of done

- [ ] All 4 + stories + [CHECKLIST.md](./CHECKLIST.md)
- [ ] Atom folder migration packs complete — proceed to [molecules](../../molecules/README.md)

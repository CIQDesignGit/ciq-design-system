# Component library handoff (neo-canvas → separate repo)

This folder is the **contract** between neo-canvas and the separate public component library repo.

- **neo-canvas** writes batch packs (specs + source pointers).
- The **library repo** implements components from those packs.
- Do **not** create the npm package inside neo-canvas.

## How to use a batch pack

1. Complete **[Batch 00 — Foundation](#batch-00--foundation)** once.
2. Open `batches/atoms-0N/BATCH.md` and implement components **in the listed order**.
3. For each component, follow `batches/atoms-0N/components/<name>.md`.
4. Tick `batches/atoms-0N/CHECKLIST.md`.
5. Only then start the next batch.

Templates live in [`_template/`](./_template/).

## Batch 00 — Foundation

Required before any atom batch. Port once into the library repo.

| Item | neo-canvas source | What to do |
|------|-------------------|------------|
| Design tokens (CSS vars) | [`src/index.css`](../../src/index.css) (`:root`, `.dark`, `@layer utilities` including `.animate-shimmer`) | Copy token set; keep HSL CSS variables |
| Theme presets (optional) | `src/assets/themes/*.css`, `[data-theme]` blocks in `index.css` | Port if library supports multi-theme |
| Tailwind bridge | [`tailwind.config.js`](../../tailwind.config.js) | Map `theme.extend.colors`, `borderRadius`, `boxShadow` (`shadow-xs`), fonts to CSS vars |
| `cn` helper | [`src/utils/cn.ts`](../../src/utils/cn.ts) | `clsx` + `tailwind-merge` |
| Icons | `lucide-react` | Peer dependency |
| React | React 19 + TypeScript strict | Match neo-canvas constraints where practical |
| Storybook | Existing atom `*.stories.tsx` | Library Storybook titles: `Atoms/<Name>` |

### Token notes used by Batch 01

| Token / utility | Where defined | Used by |
|-----------------|---------------|---------|
| `--primary`, `--primary-foreground`, `--destructive`, … | `src/index.css` | Button, Badge, Checkbox, Card, … |
| `--tertiary-text` → Tailwind `text-tertiary-text` | `index.css` + `tailwind.config.js` `colors.tertiary.text` | Input, Textarea placeholders |
| `--shadow-xs` → `shadow-xs` | `index.css` + `tailwind.config.js` | Button |
| `.animate-shimmer` + `@keyframes shimmer` | `src/index.css` `@layer utilities` | Skeleton |

### Library setup contract

- Public API = **barrel exports only** (no deep imports for consumers).
- Prefer design tokens over hard-coded hex. If neo-canvas already hard-codes (e.g. Skeleton gradient, Separator `bg-gray-200`, Button `card` variant whites), port as-is and mark as tech debt in the component spec.
- Strip app coupling: no axios, AuthContext, `__globalConfig`, or `queryElement` required at runtime. For portals, accept optional `container?: HTMLElement | null`.

---

## Atom batch map (frozen)

~55 atom components → 6 batches. Order is dependency-first.

| Batch | Folder | Goal | Components (implement order) |
|-------|--------|------|------------------------------|
| **00** | — | Tokens + `cn` + Storybook | Foundation only |
| **01** | [`batches/atoms-01/`](./batches/atoms-01/) | Core form & chrome | Button (+ variants), Input, Textarea, Label, Checkbox, Badge, Card, Separator, Skeleton, Tooltip |
| **02** | [`batches/atoms-02/`](./batches/atoms-02/) | More controls & overlays | Switch, RadioGroup, Select, Popover, HoverCard, Tabs, IndeterminateCheckbox, Toggle, Avatar, EmptyState |
| **03** | [`batches/atoms-03/`](./batches/atoms-03/) | Structure & menus | Sheet, Layover, Collapsible, Accordion, ScrollArea, DropdownMenu, Table, Breadcrumb, Loader, Chip |
| **04** | [`batches/atoms-04/`](./batches/atoms-04/) | Domain-lean primitives | Calendar, StarRating, TargetProgressBar, CopyButton, CharacterCount, TruncatedBadge, StatusCell, SecondaryHeader, TextDiff, MultiSelect |
| **05** | [`batches/atoms-05/`](./batches/atoms-05/) | Chat / AI composites | Markdown (+ markdown-content), Message, ChatContainer, PromptInput, ScrollButton, ResponseStream, ChainOfThought, CodeBlock, OrderedMultiSelect, FilterModal |
| **06** | [`batches/atoms-06/`](./batches/atoms-06/) | App-shell leftovers | Sidebar, ThemeSwitcher, Toaster, SectionMarkdown |

Tag **`promote-to-molecule-later`**: FilterModal, Sidebar, chat stack (Message, ChatContainer, PromptInput, …), MultiSelect / OrderedMultiSelect — ship for parity, reclassify later.

---

## Molecules (after atoms)

See [`molecules/README.md`](./molecules/README.md). Same pack format; start only after atom batches 01–06 are implemented in the library.

---

## Principles

1. neo-canvas = catalog + specs; other repo = implementation  
2. 10 at a time; atoms first  
3. Stories are part of the contract  
4. Always fill **Do not port** for app coupling  

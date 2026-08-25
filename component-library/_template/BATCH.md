# Batch {{BATCH_ID}} — {{TITLE}}

## Goal

{{ONE_PARAGRAPH_GOAL}}

## Implement order

Implement components in this exact order (dependency-first):

1. {{COMPONENT_1}}
2. {{COMPONENT_2}}
3. {{COMPONENT_3}}
4. {{COMPONENT_4}}
5. {{COMPONENT_5}}
6. {{COMPONENT_6}}
7. {{COMPONENT_7}}
8. {{COMPONENT_8}}
9. {{COMPONENT_9}}
10. {{COMPONENT_10}}

## Shared prerequisites (blockers)

Complete these before any component in this batch:

- [ ] **Batch 00** foundation: design tokens + Tailwind bridge + `cn` utility (see [README](../../README.md#batch-00--foundation))
- [ ] Peer/npm deps listed below installed in the library repo
- [ ] Storybook configured so atom stories can be added

### Peer / npm dependencies for this batch

| Package | Used by |
|---------|---------|
| {{PKG}} | {{COMPONENTS}} |

### Shared utilities to port once

| Utility | neo-canvas source | Notes |
|---------|-------------------|-------|
| `cn` | `src/utils/cn.ts` | `clsx` + `tailwind-merge` |

## Specs in this pack

| # | Component | Spec |
|---|-----------|------|
| 1 | {{NAME}} | [components/{{slug}}.md](./components/{{slug}}.md) |

## Out of scope

- Do not move or delete neo-canvas source files
- Do not port app coupling (`AuthContext`, axios, `__globalConfig`, routes)
- Components listed in later batches

## Definition of done

- [ ] All 10 components implemented with matching public API
- [ ] Storybook stories exist for each (mirror neo-canvas stories listed in specs)
- [ ] Typecheck passes (strict TypeScript)
- [ ] No deep imports required by consumers — barrel exports only
- [ ] [CHECKLIST.md](./CHECKLIST.md) fully ticked

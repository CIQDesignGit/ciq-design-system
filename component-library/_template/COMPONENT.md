# {{ComponentName}}

## Identity

| Field | Value |
|-------|-------|
| **Name** | `{{ComponentName}}` |
| **neo-canvas source** | `src/components/atoms/{{file}}.tsx` |
| **Related files** | {{related}} |
| **Story** | `src/components/atoms/{{file}}.stories.tsx` |
| **Storybook title** | `Atoms/{{ComponentName}}` |
| **In atoms barrel today?** | Yes / No — `src/components/atoms/index.ts` |
| **Batch** | atoms-0N |
| **Tags** | `primitive` \| `composite` \| `promote-to-molecule-later` |

## Public API

### Exports

```ts
// List every named export the library must expose
```

### Props / variants

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| | | | |

### Compound parts (if any)

| Part | Role |
|------|------|
| | |

## Dependencies

### npm / peers

| Package | Why |
|---------|-----|
| | |

### Internal (other library components / utils)

| Import | Notes |
|--------|-------|
| `cn` | Required |
| | |

## Tokens / classes

List token-backed utilities and any hard-coded colors to replace later:

- `bg-primary`, `text-foreground`, …

## Behavior

- forwardRef: yes/no
- asChild / Slot: yes/no
- Controlled vs uncontrolled notes
- a11y notes
- Edge cases

## Source of truth

1. Open `{{path}}` in neo-canvas and port the implementation.
2. Adapt imports: `@/utils/cn` → library `cn`; drop `@/web-component/*` unless the library needs shadow-DOM portals (prefer optional `container` prop).
3. Keep `displayName` and test ids if present.

## Stories

Mirror these exports from the neo-canvas story file:

| Story export | Purpose |
|--------------|---------|
| `Default` | |

## Do not port

- App contexts, services, routers
- `queryElement` / `#overlay-portal` hard dependency — replace with optional `container?: HTMLElement \| null` on portaled content
- `logger` or analytics

## Acceptance

- [ ] Public exports match this spec
- [ ] Variants/sizes match neo-canvas
- [ ] Stories render in Storybook
- [ ] Types are explicit; no `any` / unjustified `as` / `!`
- [ ] Token classes used (no new hard-coded hex unless noted as tech debt, e.g. Skeleton shimmer)

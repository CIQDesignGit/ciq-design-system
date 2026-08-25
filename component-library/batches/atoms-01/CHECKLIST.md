# Batch atoms-01 checklist

Library implementer: tick as you finish each item.

## Foundation

- [x] Tokens + Tailwind bridge + `cn` (Batch 00)
- [x] Peer packages installed (see BATCH.md)

## Components (in order)

- [x] Button + `buttonVariants`
- [x] Input
- [x] Textarea
- [x] Label
- [x] Checkbox
- [x] Badge (+ `badgeVariants` export)
- [x] Card (+ Header, Title, Description, Content, Footer)
- [x] Separator
- [x] Skeleton
- [x] Tooltip (+ Provider, Trigger, Content)

## Quality gates

- [x] Storybook: all Batch 01 stories render
- [x] `tsc --noEmit` (or library equivalent) passes
- [x] Public barrel exports Batch 01 APIs
- [x] No required dependency on neo-canvas `@/web-component` or app contexts

# Batch atoms-05 — Chat / AI composites

## Goal

Port chat and AI presentation building blocks. Tag all as `promote-to-molecule-later` but ship for conversations/alerts unlock.

## Implement order

1. **Markdown** + **markdown-content** — `markdown.tsx`, `markdown-content.tsx` (peers: `react-markdown`, `remark-gfm`, sanitization approach per source — do not reintroduce unsafe HTML blindly)
2. **Message** — `message.tsx` (Avatar, Tooltip, Markdown)
3. **ChatContainer** — `chat-container.tsx` (peer: `use-stick-to-bottom`)
4. **PromptInput** — `prompt-input.tsx`
5. **ScrollButton** — `scroll-button.tsx`
6. **ResponseStream** — `response-stream.tsx` (includes `useTextStream` if exported)
7. **ChainOfThought** — `chain-of-thought.tsx`
8. **CodeBlock** — `code-block.tsx` (peer: `shiki` or match source highlighter)
9. **OrderedMultiSelect** — `ordered-multi-select/` folder
10. **FilterModal** — `filter-modal.tsx` (depends on Layover + form atoms; `promote-to-molecule-later`)

## Shared prerequisites

- [x] atoms-01–04 complete
- [x] Heavy peers: markdown stack, shiki, use-stick-to-bottom — confirm versions against neo-canvas `package.json`

## Specs

See [components/](./components/).

## Definition of done

- [x] All 10 + stories + [CHECKLIST.md](./CHECKLIST.md)
- [x] Markdown security posture documented (sanitize allowlist)

## Markdown security (documented)

| Surface | Approach |
|---------|----------|
| `Markdown` / `markdown-content` | Same as neo-canvas: `remark-gfm` + `rehype-raw`. **No** HTML allowlist sanitizer — callers must treat source as trusted or sanitize upstream. |
| `CodeBlock` | `DOMPurify.sanitize(highlightedHtml)` with **default** DOMPurify allowlist after Shiki highlight. Language ids restricted via `ALLOWED_LANGUAGES`. |

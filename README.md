# @ciq-dev/ciq-design-system

CIQ Design System — shadcn/ui components with CIQ brand tokens, built on Tailwind CSS v4.

## Install

Public package — no auth required:

```bash
npm install @ciq-dev/ciq-design-system
```

## Quick start

Import the precompiled styles once in your app entry:

```tsx
import "@ciq-dev/ciq-design-system/styles";
```

Use components from the single export surface:

```tsx
import { Button, Input, Badge } from "@ciq-dev/ciq-design-system";

export function App() {
  return (
    <div>
      <Button intent="task">Assign to Blake</Button>
      <Input placeholder="Search..." />
    </div>
  );
}
```

## Tailwind v4 consumers

If you run your own Tailwind build and want to extend tokens, import the raw theme instead:

```css
@import "tailwindcss";
@import "@ciq-dev/ciq-design-system/theme.css";
@source "../node_modules/@ciq-dev/ciq-design-system/dist";
```

The `@source` line tells Tailwind to scan the compiled package output for class names. Without it, components may render unstyled.

## Development

```bash
pnpm install
pnpm storybook    # component playground at localhost:6006
pnpm build        # build the npm package
pnpm typecheck    # TypeScript check
```

## Repo structure

```
packages/ui/     — published @ciq-dev/ciq-design-system package
  src/atoms/     — Button, Input, Badge, Avatar, Label
  src/molecules/ — Dialog, DropdownMenu, Select
  src/styles/    — design tokens (tokens.css + theme.css)
apps/storybook/  — Storybook docs and visual playground
```

## Branch workflow

- `develop` — active development (default branch)
- `release` — release candidate
- `main` — production

CI auto-versions and publishes to npm on push to any of these branches.

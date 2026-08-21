import * as React from "react";

import { cn } from "@/lib/utils";

/** Shared page chrome for every Foundations story. */
export function TokenPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl space-y-10 bg-canvas font-sans text-fg-primary">
      <header className="space-y-2">
        <p className="type-caption font-medium tracking-wide text-fg-tertiary uppercase">
          Foundations
        </p>
        <h1 className="type-heading">{title}</h1>
        <p className="max-w-2xl type-body leading-relaxed text-fg-secondary">
          {description}
        </p>
      </header>
      {children}
    </div>
  );
}

export function TokenSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="type-title text-fg-primary">{title}</h2>
        {description ? (
          <p className="mt-1 type-body text-fg-secondary">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export type ColorToken = {
  name: string;
  /** CSS variable name, e.g. --color-fg-primary */
  cssVar: string;
  /** Tailwind background class, e.g. bg-fg-primary */
  bg: string;
  /** Optional text class so the label stays readable on the swatch */
  fg?: string;
  /** Tailwind primitive this token points at in light mode */
  value: string;
  /** Tailwind primitive in dark mode — omit when unchanged */
  darkValue?: string;
};

/** One list row: small color thumbnail + the names you copy into code. */
export function ColorRow({ token }: { token: ColorToken }) {
  const valueLabel = token.darkValue
    ? `${token.value} → dark ${token.darkValue}`
    : token.value;

  return (
    <div className="flex items-center gap-3 px-3 py-2.5">
      <div
        className={cn(
          "size-8 shrink-0 rounded-md border border-black/10",
          token.bg
        )}
        title={valueLabel}
      />
      <div className="min-w-0 flex-1">
        <p className="type-body-strong text-fg-primary">{token.name}</p>
        <p className="truncate type-caption font-mono text-fg-tertiary">
          {token.bg}
          <span className="mx-1.5 text-fg-disabled">·</span>
          {token.cssVar}
          <span className="mx-1.5 text-fg-disabled">·</span>
          {valueLabel}
        </p>
      </div>
    </div>
  );
}

export function ColorList({ tokens }: { tokens: ColorToken[] }) {
  return (
    <div className="divide-y divide-border-default overflow-hidden rounded-lg border border-border-default bg-surface">
      {tokens.map((token) => (
        <ColorRow key={token.cssVar} token={token} />
      ))}
    </div>
  );
}

export type TypeRoleToken = {
  name: string;
  /** Class you copy into components, e.g. type-body */
  className: string;
  size: string;
  weight: string;
  leading: string;
  family: string;
  usage: string;
  sample?: string;
};

export function TypeRoleRow({ token }: { token: TypeRoleToken }) {
  return (
    <div className="flex flex-col gap-2 px-3 py-3 sm:flex-row sm:items-baseline sm:gap-6">
      <p className={cn(token.className, "min-w-0 flex-1 text-fg-primary")}>
        {token.sample ?? "Assign to Blake"}
      </p>
      <div className="shrink-0 font-mono type-caption text-fg-tertiary sm:w-80">
        <p className="font-medium text-fg-secondary">{token.className}</p>
        <p>
          {token.size} · {token.weight} · {token.leading} · {token.family}
        </p>
        <p>{token.usage}</p>
      </div>
    </div>
  );
}

export function TypeRoleList({ tokens }: { tokens: TypeRoleToken[] }) {
  return (
    <div className="divide-y divide-border-default overflow-hidden rounded-lg border border-border-default bg-surface">
      {tokens.map((token) => (
        <TypeRoleRow key={token.className} token={token} />
      ))}
    </div>
  );
}

export type TypeAliasToken = {
  name: string;
  oldClass: string;
  newClass: string;
};

export function TypeAliasList({ tokens }: { tokens: TypeAliasToken[] }) {
  return (
    <div className="divide-y divide-border-default overflow-hidden rounded-lg border border-border-default bg-surface">
      {tokens.map((token) => (
        <div
          key={token.oldClass}
          className="flex items-baseline justify-between gap-3 px-3 py-2.5"
        >
          <p className="type-body-strong text-fg-primary">{token.name}</p>
          <p className="truncate font-mono type-caption text-fg-tertiary">
            {token.oldClass}
            <span className="mx-1.5 text-fg-disabled">→</span>
            {token.newClass}
          </p>
        </div>
      ))}
    </div>
  );
}

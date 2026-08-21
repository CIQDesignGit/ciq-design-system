import type { TypeAliasToken, TypeRoleToken } from "./helpers";

/** Tier 1 — families. Brand is Inter with a CIQ name. */
export const typeFamilies = [
  {
    name: "Sans",
    className: "font-sans",
    cssVar: "--font-sans",
    value: "Inter, sans-serif",
    weights: "400, 500, 600, 700",
  },
  {
    name: "Brand",
    className: "font-brand",
    cssVar: "--font-brand",
    value: "same as sans (Inter)",
    weights: "400, 500, 600, 700",
  },
  {
    name: "Serif",
    className: "font-serif",
    cssVar: "--font-serif",
    value: '"Source Serif 4", serif',
    weights: "400, 600",
  },
  {
    name: "Mono",
    className: "font-mono",
    cssVar: "--font-mono",
    value: '"JetBrains Mono", monospace',
    weights: "400, 500, 600",
  },
] as const;

/** Tier 1 — Tailwind size primitives. Do not use these in components; use type-*. */
export const typeSizes = [
  { name: "xs", className: "text-xs", px: "12px" },
  { name: "sm", className: "text-sm", px: "14px" },
  { name: "base", className: "text-base", px: "16px" },
  { name: "lg", className: "text-lg", px: "18px" },
  { name: "xl", className: "text-xl", px: "20px" },
  { name: "2xl", className: "text-2xl", px: "24px" },
  { name: "3xl", className: "text-3xl", px: "30px" },
  { name: "4xl", className: "text-4xl", px: "36px" },
] as const;

export const typeWeights = [
  { name: "Regular", className: "font-normal", value: "400" },
  { name: "Medium", className: "font-medium", value: "500" },
  { name: "Semibold", className: "font-semibold", value: "600" },
  { name: "Bold", className: "font-bold", value: "700" },
] as const;

/** Tier 2 — purpose names. One class replaces size + weight + family. */
export const typeRoles: TypeRoleToken[] = [
  {
    name: "Display",
    className: "type-display",
    size: "text-4xl",
    weight: "font-semibold",
    leading: "leading-tight",
    family: "font-sans",
    usage: "Page hero / marketing line",
  },
  {
    name: "Heading",
    className: "type-heading",
    size: "text-2xl",
    weight: "font-semibold",
    leading: "leading-tight",
    family: "font-sans",
    usage: "Page or card title",
  },
  {
    name: "Title",
    className: "type-title",
    size: "text-lg",
    weight: "font-semibold",
    leading: "leading-snug",
    family: "font-sans",
    usage: "Section or dialog title",
  },
  {
    name: "Body lg",
    className: "type-body-lg",
    size: "text-base",
    weight: "font-normal",
    leading: "leading-normal",
    family: "font-sans",
    usage: "Input value, large body",
  },
  {
    name: "Body",
    className: "type-body",
    size: "text-sm",
    weight: "font-normal",
    leading: "leading-normal",
    family: "font-sans",
    usage: "Default UI copy",
  },
  {
    name: "Body strong",
    className: "type-body-strong",
    size: "text-sm",
    weight: "font-medium",
    leading: "leading-normal",
    family: "font-sans",
    usage: "Button, emphasized copy",
  },
  {
    name: "Label",
    className: "type-label",
    size: "text-sm",
    weight: "font-medium",
    leading: "leading-none",
    family: "font-sans",
    usage: "Form label",
  },
  {
    name: "Caption",
    className: "type-caption",
    size: "text-xs",
    weight: "font-normal",
    leading: "leading-normal",
    family: "font-sans",
    usage: "Helper, meta, badge",
  },
  {
    name: "Caption strong",
    className: "type-caption-strong",
    size: "text-xs",
    weight: "font-medium",
    leading: "leading-normal",
    family: "font-sans",
    usage: "Chip, count, compact label",
  },
  {
    name: "Code",
    className: "type-code",
    size: "text-sm",
    weight: "font-normal",
    leading: "leading-normal",
    family: "font-mono",
    usage: "Code snippets",
    sample: "const token = '--font-mono';",
  },
];

/* DO_NOT_REMOVE_LEGACY_TYPE_ALIASES
   This mapping must stay in Storybook forever. See AGENTS.md.
   Never delete this export, never empty this array, never hide the Typography story section. */
export const legacyAliasType: TypeAliasToken[] = [
  { name: "Hero", oldClass: "text-4xl font-semibold", newClass: "type-display" },
  { name: "Card title", oldClass: "text-2xl font-semibold", newClass: "type-heading" },
  { name: "Section title", oldClass: "text-lg font-semibold", newClass: "type-title" },
  { name: "Input / large body", oldClass: "text-base", newClass: "type-body-lg" },
  { name: "Default copy", oldClass: "text-sm", newClass: "type-body" },
  { name: "Button / emphasis", oldClass: "text-sm font-medium", newClass: "type-body-strong" },
  { name: "Form label", oldClass: "text-sm font-medium leading-none", newClass: "type-label" },
  { name: "Helper / badge", oldClass: "text-xs", newClass: "type-caption" },
  { name: "Chip / count", oldClass: "text-xs font-medium", newClass: "type-caption-strong" },
  { name: "Code block", oldClass: "font-mono text-sm", newClass: "type-code" },
];
/* END DO_NOT_REMOVE_LEGACY_TYPE_ALIASES */

if (legacyAliasType.length === 0) {
  throw new Error(
    "DO_NOT_REMOVE_LEGACY_TYPE_ALIASES: the Storybook Typography page must keep the legacy aliases mapping."
  );
}
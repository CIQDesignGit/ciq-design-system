import type { ColorToken } from "./helpers";

/**
 * Token lists copied from packages/ui/src/styles/tokens.css + theme.css.
 * If a value here disagrees with those files, the CSS files win.
 * Values are Tailwind v4 primitive names (purple-600, slate-900, …).
 */

/** Full class names so Tailwind can see them (do not build these with a template). */
const COLOR_BG = {
  brand: "bg-brand",
  "brand-50": "bg-brand-50",
  "brand-100": "bg-brand-100",
  "brand-200": "bg-brand-200",
  "brand-300": "bg-brand-300",
  "brand-400": "bg-brand-400",
  "brand-500": "bg-brand-500",
  "brand-600": "bg-brand-600",
  "brand-700": "bg-brand-700",
  "brand-800": "bg-brand-800",
  "brand-900": "bg-brand-900",
  "brand-950": "bg-brand-950",
  "primary-dark": "bg-primary-dark",
  "fg-primary": "bg-fg-primary",
  "fg-secondary": "bg-fg-secondary",
  "fg-tertiary": "bg-fg-tertiary",
  "fg-disabled": "bg-fg-disabled",
  "fg-inverse": "bg-fg-inverse",
  "fg-brand": "bg-fg-brand",
  canvas: "bg-canvas",
  surface: "bg-surface",
  "surface-subtle": "bg-surface-subtle",
  "surface-muted": "bg-surface-muted",
  "border-default": "bg-border-default",
  "border-strong": "bg-border-strong",
  "border-focus": "bg-border-focus",
  "action-primary": "bg-action-primary",
  "action-primary-hover": "bg-action-primary-hover",
  "action-primary-disabled": "bg-action-primary-disabled",
  "action-primary-fg": "bg-action-primary-fg",
  "action-secondary": "bg-action-secondary",
  "action-secondary-fg": "bg-action-secondary-fg",
  "action-danger": "bg-action-danger",
  "action-danger-fg": "bg-action-danger-fg",
  "feedback-success": "bg-feedback-success",
  "feedback-success-strong": "bg-feedback-success-strong",
  "feedback-success-border": "bg-feedback-success-border",
  "feedback-success-muted": "bg-feedback-success-muted",
  "feedback-success-subtle": "bg-feedback-success-subtle",
  "feedback-warning": "bg-feedback-warning",
  "feedback-warning-muted": "bg-feedback-warning-muted",
  "feedback-warning-subtle": "bg-feedback-warning-subtle",
  "feedback-danger": "bg-feedback-danger",
  "chart-1": "bg-chart-1",
  "chart-2": "bg-chart-2",
  "chart-3": "bg-chart-3",
  "chart-4": "bg-chart-4",
  "chart-5": "bg-chart-5",
  sidebar: "bg-sidebar",
  "sidebar-foreground": "bg-sidebar-foreground",
  "sidebar-primary": "bg-sidebar-primary",
  "sidebar-primary-foreground": "bg-sidebar-primary-foreground",
  "sidebar-accent": "bg-sidebar-accent",
  "sidebar-accent-foreground": "bg-sidebar-accent-foreground",
  "sidebar-border": "bg-sidebar-border",
  "sidebar-ring": "bg-sidebar-ring",
  background: "bg-background",
  foreground: "bg-foreground",
  card: "bg-card",
  "card-foreground": "bg-card-foreground",
  popover: "bg-popover",
  "popover-foreground": "bg-popover-foreground",
  primary: "bg-primary",
  "primary-foreground": "bg-primary-foreground",
  "primary-text": "bg-primary-text",
  secondary: "bg-secondary",
  "secondary-foreground": "bg-secondary-foreground",
  "tertiary-text": "bg-tertiary-text",
  muted: "bg-muted",
  "muted-foreground": "bg-muted-foreground",
  accent: "bg-accent",
  "accent-foreground": "bg-accent-foreground",
  destructive: "bg-destructive",
  "destructive-foreground": "bg-destructive-foreground",
  border: "bg-border",
  input: "bg-input",
  ring: "bg-ring",
  "success-50": "bg-success-50",
  "success-100": "bg-success-100",
  "success-200": "bg-success-200",
  "success-500": "bg-success-500",
  "success-600": "bg-success-600",
  "warning-50": "bg-warning-50",
  "warning-100": "bg-warning-100",
  "warning-600": "bg-warning-600",
  "error-600": "bg-error-600",
} as const;

function t(
  name: string,
  token: keyof typeof COLOR_BG,
  value: string,
  extra?: { darkValue?: string; fg?: string }
): ColorToken {
  return {
    name,
    cssVar: `--color-${token}`,
    bg: COLOR_BG[token],
    value,
    darkValue: extra?.darkValue,
    fg: extra?.fg,
  };
}

/** Tier 1 — CIQ names on top of Tailwind palettes. */
export const primitiveColors: ColorToken[] = [
  t("Brand", "brand", "purple-600"),
  t("Brand 50", "brand-50", "purple-50"),
  t("Brand 100", "brand-100", "purple-100"),
  t("Brand 200", "brand-200", "purple-200"),
  t("Brand 300", "brand-300", "purple-300"),
  t("Brand 400", "brand-400", "purple-400"),
  t("Brand 500", "brand-500", "purple-500"),
  t("Brand 600", "brand-600", "purple-600"),
  t("Brand 700", "brand-700", "purple-700"),
  t("Brand 800", "brand-800", "purple-800"),
  t("Brand 900", "brand-900", "purple-900"),
  t("Brand 950", "brand-950", "purple-950"),
  t("Primary dark", "primary-dark", "slate-950"),
];

export const fgColors: ColorToken[] = [
  t("Primary", "fg-primary", "slate-900", { darkValue: "slate-50" }),
  t("Secondary", "fg-secondary", "slate-700", { darkValue: "slate-300" }),
  t("Tertiary", "fg-tertiary", "slate-500", { darkValue: "purple-300" }),
  t("Disabled", "fg-disabled", "slate-300", { darkValue: "slate-600" }),
  t("Inverse", "fg-inverse", "white"),
  t("Brand", "fg-brand", "purple-950", { darkValue: "purple-100" }),
];

export const surfaceColors: ColorToken[] = [
  t("Canvas", "canvas", "white", { darkValue: "purple-950" }),
  t("Surface", "surface", "white", { darkValue: "purple-900" }),
  t("Surface subtle", "surface-subtle", "slate-100", {
    darkValue: "purple-900",
  }),
  t("Surface muted", "surface-muted", "slate-50", { darkValue: "purple-800" }),
];

export const borderColors: ColorToken[] = [
  t("Default", "border-default", "slate-200", { darkValue: "purple-800" }),
  t("Strong", "border-strong", "slate-300", { darkValue: "purple-800" }),
  t("Focus", "border-focus", "purple-400"),
];

export const actionColors: ColorToken[] = [
  t("Primary", "action-primary", "purple-600", { darkValue: "purple-500" }),
  t("Primary hover", "action-primary-hover", "purple-700", {
    darkValue: "purple-400",
  }),
  t("Primary disabled", "action-primary-disabled", "purple-200", {
    darkValue: "purple-900",
  }),
  t("Primary fg", "action-primary-fg", "white"),
  t("Secondary", "action-secondary", "slate-700", { darkValue: "purple-800" }),
  t("Secondary fg", "action-secondary-fg", "white", {
    darkValue: "purple-100",
  }),
  t("Danger", "action-danger", "red-600", { darkValue: "red-500" }),
  t("Danger fg", "action-danger-fg", "white"),
];

export const feedbackColors: ColorToken[] = [
  t("Success", "feedback-success", "green-600"),
  t("Success strong", "feedback-success-strong", "green-500"),
  t("Success border", "feedback-success-border", "green-200"),
  t("Success muted", "feedback-success-muted", "green-100"),
  t("Success subtle", "feedback-success-subtle", "green-50"),
  t("Warning", "feedback-warning", "amber-600"),
  t("Warning muted", "feedback-warning-muted", "amber-100"),
  t("Warning subtle", "feedback-warning-subtle", "amber-50"),
  t("Danger", "feedback-danger", "red-600"),
];

export const chartColors: ColorToken[] = [
  t("Chart 1", "chart-1", "purple-950"),
  t("Chart 2", "chart-2", "purple-900"),
  t("Chart 3", "chart-3", "purple-800"),
  t("Chart 4", "chart-4", "purple-700"),
  t("Chart 5", "chart-5", "purple-600"),
];

export const sidebarColors: ColorToken[] = [
  t("Sidebar", "sidebar", "slate-50", { darkValue: "purple-950" }),
  t("Foreground", "sidebar-foreground", "purple-950", {
    darkValue: "purple-100",
  }),
  t("Primary", "sidebar-primary", "purple-950", { darkValue: "purple-900" }),
  t("Primary fg", "sidebar-primary-foreground", "white"),
  t("Accent", "sidebar-accent", "fuchsia-100", { darkValue: "purple-800" }),
  t("Accent fg", "sidebar-accent-foreground", "purple-950", {
    darkValue: "fuchsia-100",
  }),
  t("Border", "sidebar-border", "slate-200", { darkValue: "purple-800" }),
  t("Ring", "sidebar-ring", "purple-950", { darkValue: "purple-900" }),
];

/* DO_NOT_REMOVE_LEGACY_ALIASES
   This mapping must stay in Storybook forever. See AGENTS.md.
   Never delete this export, never empty this array, never hide the Colors story section. */
export const legacyAliasColors: ColorToken[] = [
  t("background → canvas", "background", "white", {
    darkValue: "purple-950",
  }),
  t("foreground → fg-primary", "foreground", "slate-900", {
    darkValue: "slate-50",
  }),
  t("card → surface", "card", "white", { darkValue: "purple-900" }),
  t("card-foreground → fg-brand", "card-foreground", "purple-950", {
    darkValue: "purple-100",
  }),
  t("popover → surface", "popover", "white", { darkValue: "purple-900" }),
  t("popover-foreground → fg-brand", "popover-foreground", "purple-950", {
    darkValue: "purple-100",
  }),
  t("primary → action-primary", "primary", "purple-600", {
    darkValue: "purple-500",
  }),
  t("primary-foreground → action-primary-fg", "primary-foreground", "white"),
  t("primary-text → fg-primary", "primary-text", "slate-900", {
    darkValue: "slate-50",
  }),
  t("secondary → action-secondary", "secondary", "slate-700", {
    darkValue: "purple-800",
  }),
  t("secondary-foreground → action-secondary-fg", "secondary-foreground", "white", {
    darkValue: "purple-100",
  }),
  t("tertiary-text → fg-tertiary", "tertiary-text", "slate-500", {
    darkValue: "purple-300",
  }),
  t("muted → surface-subtle", "muted", "slate-100", {
    darkValue: "purple-900",
  }),
  t("muted-foreground → fg-tertiary", "muted-foreground", "slate-500", {
    darkValue: "purple-300",
  }),
  t("accent → surface-muted", "accent", "slate-50", {
    darkValue: "purple-800",
  }),
  t("accent-foreground → fg-brand", "accent-foreground", "purple-950", {
    darkValue: "purple-100",
  }),
  t("destructive → action-danger", "destructive", "red-600", {
    darkValue: "red-500",
  }),
  t("destructive-foreground → action-danger-fg", "destructive-foreground", "white"),
  t("border → border-default", "border", "slate-200", {
    darkValue: "purple-800",
  }),
  t("input → border-strong", "input", "slate-300", {
    darkValue: "purple-800",
  }),
  t("ring → border-focus", "ring", "purple-400"),
  t("success-50 → feedback-success-subtle", "success-50", "green-50"),
  t("success-100 → feedback-success-muted", "success-100", "green-100"),
  t("success-200 → feedback-success-border", "success-200", "green-200"),
  t("success-500 → feedback-success-strong", "success-500", "green-500"),
  t("success-600 → feedback-success", "success-600", "green-600"),
  t("warning-50 → feedback-warning-subtle", "warning-50", "amber-50"),
  t("warning-100 → feedback-warning-muted", "warning-100", "amber-100"),
  t("warning-600 → feedback-warning", "warning-600", "amber-600"),
  t("error-600 → feedback-danger", "error-600", "red-600"),
];
/* END DO_NOT_REMOVE_LEGACY_ALIASES */

if (legacyAliasColors.length === 0) {
  throw new Error(
    "DO_NOT_REMOVE_LEGACY_ALIASES: the Storybook Colors page must keep the legacy aliases mapping."
  );
}

export const radii = [
  {
    name: "sm",
    className: "rounded-sm",
    cssVar: "--radius-sm",
    value: "4px",
    note: "calc(var(--radius) - 2px). Base --radius is 6px.",
  },
  {
    name: "md",
    className: "rounded-md",
    cssVar: "--radius-md",
    value: "6px",
    note: "Same as --radius (6px).",
  },
  {
    name: "lg",
    className: "rounded-lg",
    cssVar: "--radius-lg",
    value: "8px",
    note: "Hardcoded 8px in theme.css.",
  },
  {
    name: "xl",
    className: "rounded-xl",
    cssVar: "--radius-xl",
    value: "12px",
    note: "Hardcoded 12px in theme.css.",
  },
] as const;

export const shadows = [
  {
    name: "2xs",
    className: "shadow-2xs",
    cssVar: "--shadow-2xs",
    value: "0px 4px 8px -1px hsl(0 0% 0% / 0.05)",
  },
  {
    name: "xs",
    className: "shadow-xs",
    cssVar: "--shadow-xs",
    value: "0px 4px 8px -1px hsl(0 0% 0% / 0.05)",
  },
  {
    name: "sm",
    className: "shadow-sm",
    cssVar: "--shadow-sm",
    value:
      "0px 4px 8px -1px hsl(0 0% 0% / 0.1), 0px 1px 2px -2px hsl(0 0% 0% / 0.1)",
  },
  {
    name: "md",
    className: "shadow-md",
    cssVar: "--shadow-md",
    value:
      "0px 4px 8px -1px hsl(0 0% 0% / 0.1), 0px 2px 4px -2px hsl(0 0% 0% / 0.1)",
  },
  {
    name: "lg",
    className: "shadow-lg",
    cssVar: "--shadow-lg",
    value:
      "0px 4px 8px -1px hsl(0 0% 0% / 0.1), 0px 4px 6px -2px hsl(0 0% 0% / 0.1)",
  },
  {
    name: "xl",
    className: "shadow-xl",
    cssVar: "--shadow-xl",
    value:
      "0px 4px 8px -1px hsl(0 0% 0% / 0.1), 0px 8px 10px -2px hsl(0 0% 0% / 0.1)",
  },
  {
    name: "2xl",
    className: "shadow-2xl",
    cssVar: "--shadow-2xl",
    value: "0px 4px 8px -1px hsl(0 0% 0% / 0.25)",
  },
] as const;

/** Default --shadow exists in tokens.css but is not mapped in @theme. */
export const defaultShadow = {
  name: "default",
  cssVar: "--shadow",
  value:
    "0px 4px 8px -1px hsl(0 0% 0% / 0.1), 0px 1px 2px -2px hsl(0 0% 0% / 0.1)",
} as const;

/** Tailwind v4 spacing scale using CIQ --spacing base of 4px. */
export const spacingScale = [
  { token: "1", className: "w-1", px: "4px" },
  { token: "2", className: "w-2", px: "8px" },
  { token: "3", className: "w-3", px: "12px" },
  { token: "4", className: "w-4", px: "16px" },
  { token: "5", className: "w-5", px: "20px" },
  { token: "6", className: "w-6", px: "24px" },
  { token: "8", className: "w-8", px: "32px" },
  { token: "10", className: "w-10", px: "40px" },
  { token: "12", className: "w-12", px: "48px" },
  { token: "16", className: "w-16", px: "64px" },
] as const;

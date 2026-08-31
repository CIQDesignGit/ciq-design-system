export const TIME_GRANULARITY = {
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
} as const;

export type TimeGranularity = (typeof TIME_GRANULARITY)[keyof typeof TIME_GRANULARITY];

export const VISIBILITY = {
  VISIBLE: "visible",
  HIDDEN: "hidden",
  DISABLED: "disabled",
} as const;

export type Visibility = (typeof VISIBILITY)[keyof typeof VISIBILITY];

/** Default CDN for retailer logos — hosts can override via getRetailerLogoUrl options. */
export const RETAILER_LOGO_CDN_BASE = "https://cdn.rboomerang.com/assets/retailer_logos";

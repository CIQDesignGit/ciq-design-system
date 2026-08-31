import { RETAILER_LOGO_CDN_BASE } from "../constants";

export function getRetailerLogoUrl(
  retailerName: string,
  options?: { readonly cdnBase?: string }
): string {
  const base = options?.cdnBase ?? RETAILER_LOGO_CDN_BASE;
  return `${base}/${retailerName.toLowerCase()}retail-logo.png`;
}

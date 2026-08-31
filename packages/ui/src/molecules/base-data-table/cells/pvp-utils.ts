/**
 * PvP (Period vs Period) utility functions
 */

export interface PvpData {
  previousPeriodValue?: number | null;
  previousPeriodDiff?: number | null;
  previousPeriodPercentChange?: number | null;
}

/**
 * Extract PvP data from a cell value object
 */
export function extractPvpData(value: unknown): PvpData | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const obj = value as Record<string, unknown>;

  // Check if any pvp fields exist
  if (
    obj.previousPeriodValue === undefined &&
    obj.previousPeriodDiff === undefined &&
    obj.previousPeriodPercentChange === undefined
  ) {
    return null;
  }

  return {
    previousPeriodValue:
      obj.previousPeriodValue !== undefined ? (obj.previousPeriodValue as number | null) : null,
    previousPeriodDiff:
      obj.previousPeriodDiff !== undefined ? (obj.previousPeriodDiff as number | null) : null,
    previousPeriodPercentChange:
      obj.previousPeriodPercentChange !== undefined
        ? (obj.previousPeriodPercentChange as number | null)
        : null,
  };
}

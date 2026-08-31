export interface CompetitorData {
  competitorValue: number;
  clientCompDiff?: number | null;
}

export interface CategoryLeaderData {
  categoryLeaderValue: number;
  categoryLeaderPvpPercentChange?: number | null;
  categoryLeaderLabel?: string | null;
}

function parseNum(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number.parseFloat(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function extractCompetitorData(cellValue: unknown): CompetitorData | null {
  if (!cellValue || typeof cellValue !== "object") return null;
  const obj = cellValue as Record<string, unknown>;
  const cv = parseNum(obj.competitorValue);
  if (cv === null) return null;
  return {
    competitorValue: cv,
    clientCompDiff: parseNum(obj.clientCompDiff),
  };
}

export function extractCategoryLeaderData(cellValue: unknown): CategoryLeaderData | null {
  if (!cellValue || typeof cellValue !== "object") return null;
  const obj = cellValue as Record<string, unknown>;
  const cv = parseNum(obj.categoryLeaderValue);
  if (cv === null) return null;
  return {
    categoryLeaderValue: cv,
    categoryLeaderPvpPercentChange: parseNum(obj.categoryLeaderPreviousPeriodPercentChange),
    categoryLeaderLabel:
      typeof obj.categoryLeaderLabel === "string" ? obj.categoryLeaderLabel : null,
  };
}

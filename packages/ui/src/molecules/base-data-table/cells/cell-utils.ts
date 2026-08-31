/**
 * Fields that are considered PvP (period-vs-period) metadata, not display values
 */
const PVP_FIELDS = new Set([
  "previousPeriodValue",
  "previousPeriodDiff",
  "previousPeriodPercentChange",
  "highlight",
]);

/**
 * Check if an object contains only PvP metadata fields (no actual value to display)
 */
function isPvpOnlyObject(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const keys = Object.keys(value as object);
  return keys.length > 0 && keys.every((k) => PVP_FIELDS.has(k));
}

/**
 * Extract display value from a cell value.
 * Handles wrapped values { value: X }, empty objects {}, pvp-only objects, and primitives.
 *
 * @param value - The raw cell value (may be wrapped or primitive)
 * @returns The extracted value for display
 *
 * @example
 * extractCellValue({ value: 123 }) // => 123
 * extractCellValue({ value: null }) // => null
 * extractCellValue({}) // => null (empty object)
 * extractCellValue({ previousPeriodValue: 5 }) // => null (pvp-only object)
 * extractCellValue("hello") // => "hello"
 * extractCellValue(null) // => null
 */
export function extractCellValue(value: unknown): unknown {
  if (value && typeof value === "object") {
    if ("value" in value) {
      return (value as Record<string, unknown>).value;
    }
    // Return null for empty objects OR pvp-only objects (no display value)
    if (Object.keys(value as object).length === 0 || isPvpOnlyObject(value)) {
      return null;
    }
  }
  return value;
}

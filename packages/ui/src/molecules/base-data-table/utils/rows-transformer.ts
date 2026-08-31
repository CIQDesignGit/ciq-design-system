// ============ Types ============

export interface NestedDataLeaf {
  Value?: number | string | null;
  PreviousPeriodValue?: number | string | null;
  PreviousPeriodDiff?: number | string | null;
  PreviousPeriodPercentChange?: number | string | null;
  Plan?: number | string | null;
  PlanDiff?: number | string | null;
  PlanPercentChange?: number | string | null;
  Benchmark?: number | string | null;
  BenchmarkDiff?: number | string | null;
  BenchmarkPercentChange?: number | string | null;
  [key: string]: unknown;
}

export interface MetricValueEntry {
  Metric: string;
  Data: Record<string, NestedDataLeaf | Record<string, NestedDataLeaf> | undefined>;
}

/**
 * Top-level dimension metadata map
 * Structure: { [dimensionName]: { [dimensionValue]: { [key: string]: unknown } } }
 */
export type DimensionMetadata = Record<string, Record<string, Record<string, unknown>>>;

/**
 * Page information from the API response
 */
export interface PageInfo {
  limit?: number;
  row_count?: number; // Can represent either current page count or total count depending on API
  next_cursor?: string | null;
}

export interface NestedGenieResponse {
  values?: MetricValueEntry[];
  data?: { values: MetricValueEntry[]; metadata?: DimensionMetadata };
  page?: PageInfo;
  total?: number; // Total rows across all pages (for proper pagination)
}

export type TableRow = Record<string, unknown>;

// ============ Helper ============

function normalizeValue(value: unknown): string | number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    // Try to parse as number, but only if it looks like a number
    const trimmed = value.trim();
    if (trimmed === "") return null;
    // Check if it's a numeric string (possibly with commas)
    const numericPattern = /^-?[\d,]{1,1000}(?:\.\d{1,100})?$/;
    if (numericPattern.test(trimmed)) {
      const parsed = parseFloat(trimmed.replace(/,/g, ""));
      return isNaN(parsed) ? value : parsed;
    }
    // Return original string for non-numeric values like "To do", "Yes", "No"
    return value;
  }
  return null;
}

// ============ Main Function ============

/**
 * Converts nested Genie Data to flat table rows.
 *
 * This function handles:
 * - Multiple metrics that share the same dimensions (merged into same row)
 * - N-level nested dimensions
 * - Dimension metadata from data.metadata for enrichment (title, description, images)
 * - All metric fields (Value, PreviousPeriodValue, Plan, Benchmark, etc.)
 *
 * @example Multi-metric with data.metadata
 * const apiResponse = {
 *   page: { limit: 100, row_count: 2 },
 *   data: {
 *     metadata: {
 *       "SKU Product ID": {
 *         "94306736": {
 *           title: "Ninja Foodi Air Fryer",
 *           image_url: "https://cdn.example.com/products/ninja.jpg",
 *           product_url: "https://store.example.com/products/ninja"
 *         }
 *       },
 *       "Brand": {
 *         "Ninja": {
 *           title: "Ninja",
 *           description: "Kitchen appliance brand"
 *         }
 *       }
 *     },
 *     values: [
 *       {
 *         Metric: "Digital POS",
 *         Data: {
 *           "SKU Product ID": {
 *             "94306736": {
 *               Brand: {
 *                 Ninja: { Value: 10710.98, PreviousPeriodValue: 167161.32 }
 *               }
 *             }
 *           }
 *         }
 *       }
 *     ]
 *   }
 * };
 *
 * const rows = toTableRows(apiResponse);
 * // [
 * //   {
 * //     "SKU Product ID": { value: "94306736", title: "Ninja Foodi Air Fryer", image_url: "..." },
 * //     "Brand": { value: "Ninja", title: "Ninja", description: "Kitchen appliance brand" },
 * //     "Digital POS": { value: 10710.98, previousPeriodValue: 167161.32 }
 * //   }
 * // ]
 */
export function toTableRows(
  payload: NestedGenieResponse,
  options: { includeOverall?: boolean } = {}
): TableRow[] {
  const { includeOverall = false } = options;

  const root = payload.data ?? payload;
  const values = root.values ?? [];

  // Get dimension metadata from data.metadata
  const dimensionMetadata: DimensionMetadata = payload.data?.metadata ?? {};

  if (!values.length) return [];

  // Map: rowKey -> row object
  // Multiple metrics with same dimensions will be merged into the same row
  const rowMap = new Map<string, TableRow>();

  // Track all metrics we encounter for filling missing values
  const allMetrics = new Set<string>();

  type DimensionData = {
    value: string;
    dimName: string; // Track dimension name for metadata lookup
  };

  const createRowKey = (dims: Record<string, DimensionData>) =>
    JSON.stringify(
      Object.entries(dims)
        .map(([name, data]) => [name, data.value])
        .sort(([a], [b]) => a.localeCompare(b))
    );

  /**
   * Lookup metadata for a dimension value from top-level dimension_metadata
   */
  const lookupDimensionMetadata = (dimName: string, dimValue: string): Record<string, unknown> => {
    const dimMeta = dimensionMetadata[dimName];
    if (!dimMeta) return {};

    const valueMeta = dimMeta[dimValue];
    if (!valueMeta) return {};

    // Return the metadata, normalizing field names
    return { ...valueMeta };
  };

  const processLeaf = (
    dims: Record<string, DimensionData>,
    leaf: NestedDataLeaf,
    metric: string
  ) => {
    const key = createRowKey(dims);

    // Get or create row - this enables multi-metric merging
    // Multiple metrics with the same dimension combination will update the same row
    if (!rowMap.has(key)) {
      const row: TableRow = {};
      // Add dimensions as objects with value and metadata from top-level lookup
      for (const [dimName, dimData] of Object.entries(dims)) {
        const metadata = lookupDimensionMetadata(dimName, dimData.value);
        row[dimName] = {
          value: dimData.value,
          ...metadata,
        };
      }
      rowMap.set(key, row);
    }

    const row = rowMap.get(key)!;

    // Create metric data object if we have a metric name
    if (metric && metric.trim()) {
      const metricData: Record<string, unknown> = {};

      // Extract all metric fields from the leaf
      // Use normalizeValue for all fields to preserve non-numeric strings and ensure consistent handling
      if (leaf.Value !== undefined && leaf.Value !== null) {
        metricData.value = normalizeValue(leaf.Value);
      }

      if (leaf.PreviousPeriodValue !== undefined && leaf.PreviousPeriodValue !== null) {
        metricData.previousPeriodValue = normalizeValue(leaf.PreviousPeriodValue);
      }

      if (leaf.PreviousPeriodDiff !== undefined && leaf.PreviousPeriodDiff !== null) {
        metricData.previousPeriodDiff = normalizeValue(leaf.PreviousPeriodDiff);
      }

      if (
        leaf.PreviousPeriodPercentChange !== undefined &&
        leaf.PreviousPeriodPercentChange !== null
      ) {
        metricData.previousPeriodPercentChange = normalizeValue(leaf.PreviousPeriodPercentChange);
      }

      if (leaf.Plan !== undefined && leaf.Plan !== null) {
        metricData.plan = normalizeValue(leaf.Plan);
      }

      if (leaf.PlanDiff !== undefined && leaf.PlanDiff !== null) {
        metricData.planDiff = normalizeValue(leaf.PlanDiff);
      }

      if (leaf.PlanPercentChange !== undefined && leaf.PlanPercentChange !== null) {
        metricData.planPercentChange = normalizeValue(leaf.PlanPercentChange);
      }

      if (leaf.Benchmark !== undefined && leaf.Benchmark !== null) {
        metricData.benchmark = normalizeValue(leaf.Benchmark);
      }

      if (leaf.BenchmarkDiff !== undefined && leaf.BenchmarkDiff !== null) {
        metricData.benchmarkDiff = normalizeValue(leaf.BenchmarkDiff);
      }

      if (leaf.BenchmarkPercentChange !== undefined && leaf.BenchmarkPercentChange !== null) {
        metricData.benchmarkPercentChange = normalizeValue(leaf.BenchmarkPercentChange);
      }

      // Add any other fields from the leaf that aren't standard metric fields
      for (const [key, value] of Object.entries(leaf)) {
        if (
          ![
            "Value",
            "PreviousPeriodValue",
            "PreviousPeriodDiff",
            "PreviousPeriodPercentChange",
            "Plan",
            "PlanDiff",
            "PlanPercentChange",
            "Benchmark",
            "BenchmarkDiff",
            "BenchmarkPercentChange",
          ].includes(key) &&
          value !== undefined &&
          value !== null
        ) {
          metricData[key.charAt(0).toLowerCase() + key.slice(1)] = value;
        }
      }

      // Only add metric if it has data, otherwise set value to null for consistency
      // This prevents empty {} objects that cells can't render properly
      if (Object.keys(metricData).length === 0) {
        metricData.value = null;
      }

      // Add the metric to the row (this enables multiple metrics per row)
      row[metric] = metricData;
    }
  };

  const processNestedDimensions = (
    obj: unknown,
    currentDims: Record<string, DimensionData>,
    currentDimName: string | null,
    metric: string
  ): void => {
    if (!obj || typeof obj !== "object") return;

    // Check if this is a leaf node (has Value or PreviousPeriodValue)
    if ("Value" in obj || "PreviousPeriodValue" in obj) {
      processLeaf(currentDims, obj as NestedDataLeaf, metric);
      return;
    }

    // Skip legacy inline metadata (we use top-level dimension_metadata now)
    // If we have a currentDimName, we're looking at dimension values
    // Otherwise, we're looking at dimension names
    if (currentDimName !== null) {
      // We're iterating through dimension VALUES for currentDimName
      for (const [dimValue, nextLevel] of Object.entries(obj)) {
        if (dimValue === "metadata") continue;

        if (nextLevel && typeof nextLevel === "object") {
          // Add this dimension value to currentDims and recurse
          processNestedDimensions(
            nextLevel,
            {
              ...currentDims,
              [currentDimName]: { value: dimValue, dimName: currentDimName },
            },
            null, // Reset to look for next dimension name
            metric
          );
        }
      }
    } else {
      // We're iterating through dimension NAMES
      for (const [dimName, dimValues] of Object.entries(obj)) {
        if (dimName === "metadata") continue;

        if (dimValues && typeof dimValues === "object") {
          // This is a dimension name, recurse to get its values
          processNestedDimensions(dimValues, currentDims, dimName, metric);
        }
      }
    }
  };

  // Process each metric in the response
  // Multiple metrics with the same dimensions will be merged into the same row
  for (const item of values) {
    const metric = item.Metric ?? "";
    const dataObj = item.Data ?? {};

    // Track this metric
    if (metric && metric.trim()) {
      allMetrics.add(metric);
    }

    // Process Overall (if present and enabled)
    if (
      includeOverall &&
      dataObj.Overall &&
      typeof dataObj.Overall === "object" &&
      "Value" in dataObj.Overall
    ) {
      processLeaf({}, dataObj.Overall as NestedDataLeaf, metric);
    }

    // Process all dimensions recursively
    // This handles n-level nesting (e.g., SKU → Brand → Category → ...)
    for (const [dimName, dimData] of Object.entries(dataObj)) {
      if (dimName === "Overall") continue;
      processNestedDimensions(dimData, {}, dimName, metric);
    }
  }

  // Fill in missing metrics with undefined values (full join behavior)
  for (const row of rowMap.values()) {
    for (const metric of allMetrics) {
      if (!(metric in row)) {
        // Add missing metric with undefined value
        row[metric] = {
          value: undefined,
        };
      }
    }
  }

  return Array.from(rowMap.values());
}

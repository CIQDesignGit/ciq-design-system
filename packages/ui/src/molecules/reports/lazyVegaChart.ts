import React from "react";

/** Lazy-loaded chart chunk for conversations — keeps vega out of the main bundle until needed. */
export const LazyVegaChart = React.lazy(() =>
  import("./VegaChart").then((m) => ({ default: m.VegaChart }))
);

import React, { useEffect, useRef } from "react";
import type { View } from "vega";
import embed, { type VisualizationSpec } from "vega-embed";

export type TooltipFormatter = (value: unknown) => string;

export interface VegaChartProps {
  readonly spec: VisualizationSpec | Record<string, unknown>;
  readonly data?: Record<string, unknown[]>;
  readonly width?: number | string;
  readonly height?: number;
  readonly title?: string;
  readonly className?: string;
  readonly actions?: boolean;
  /** Optional custom tooltip formatter - when provided, overrides default tooltip rendering */
  readonly tooltipFormatter?: TooltipFormatter;
  /** Optional error callback — replaces app logger */
  readonly onError?: (error: unknown) => void;
}

export const VegaChart: React.FC<VegaChartProps> = ({
  spec,
  data,
  width = "container",
  height = 300,
  title,
  className = "",
  actions = false,
  tooltipFormatter,
  onError,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<View | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const renderChart = async () => {
      try {
        const baseSpec = spec as Record<string, unknown>;
        const updatedSpec: VisualizationSpec | Record<string, unknown> = {
          ...baseSpec,
          autosize: {
            type: "fit",
            contains: "padding",
            resize: true,
            ...((baseSpec?.autosize as Record<string, unknown>) || {}),
          },
          ...(typeof width === "number" ? { width } : {}),
          ...(typeof height === "number" ? { height } : {}),
        };

        // Vega tooltip expects formatTooltip(value, valueToHtml, maxDepth) — we wrap our simpler API
        const tooltipOptions = tooltipFormatter
          ? { theme: "light" as const, formatTooltip: (val: unknown) => tooltipFormatter(val) }
          : { theme: "light" as const };

        const result = await embed(chartRef.current!, updatedSpec as VisualizationSpec, {
          actions: actions,
          renderer: "canvas",
          tooltip: tooltipOptions,
          hover: true,
        });

        viewRef.current = result.view;

        if (data) {
          Object.keys(data).forEach((key) => {
            result.view.insert(key, data[key]);
          });
          await result.view.runAsync();
        }
      } catch (error) {
        onError?.(error);
        console.error("Error rendering Vega chart", error);
      }
    };

    void renderChart();

    return () => {
      if (viewRef.current) {
        viewRef.current.finalize();
      }
    };
  }, [spec, data, width, height, actions, tooltipFormatter, onError]);

  return (
    <div className={`pt-2 px-4 ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
        </div>
      )}
      <div ref={chartRef} className="w-full" style={{ minHeight: height, width: "100%" }} />
    </div>
  );
};

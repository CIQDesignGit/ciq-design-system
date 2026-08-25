import { useRef, useState } from "react";

import { Badge } from "@/atoms/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/atoms/tooltip";
import { cn } from "@/lib/utils";

export interface TruncatedBadgeProps {
  /** Array of items to display */
  readonly items: string[];
  /** Optional Badge className for the badge */
  readonly BadgeClassName?: string;
  /** Maximum width of the badge (default: 160px) */
  readonly maxWidth?: string;
  /** Tooltip placement (default: "bottom") */
  readonly tooltipSide?: "top" | "bottom" | "left" | "right";
  /** Custom separator for tooltip text (default: ", ") */
  readonly tooltipSeparator?: string;
}

/**
 * Renders a badge for a list of items.
 * Shows the first item (truncated if needed) with a count suffix if there are more.
 * Shows a tooltip on hover when text is truncated or when there are multiple items.
 *
 * @example
 * // Single item (short) - no tooltip
 * <TruncatedBadge items={["First Item"]} />
 *
 * @example
 * // Single item (long, truncated) - shows tooltip with full text on hover
 * <TruncatedBadge items={["Very Long Retailer Name That Gets Truncated"]} />
 *
 * @example
 * // Multiple items - shows "First Item... &2" with tooltip listing all items
 * <TruncatedBadge items={["First Item", "Second Item", "Third Item"]} />
 */
export function TruncatedBadge({
  items,
  BadgeClassName,
  maxWidth = "160px",
  tooltipSide = "bottom",
  tooltipSeparator = ", ",
}: TruncatedBadgeProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  if (!items || items.length === 0) return null;

  const firstItem = items[0];
  const remainingCount = items.length - 1;
  const tooltipText = items.join(tooltipSeparator);

  // Check truncation only when user hovers - most performant approach
  const handleMouseEnter = () => {
    if (textRef.current) {
      const isTextTruncated = textRef.current.scrollWidth > textRef.current.clientWidth;
      setShowTooltip(isTextTruncated || remainingCount > 0);
    } else {
      // Fallback: show tooltip if there are multiple items
      setShowTooltip(remainingCount > 0);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const badge = (
    <Badge
      variant="outline"
      className={cn(
        "border-warning-100 bg-warning-50 text-warning-600 text-xs h-5 font-normal flex items-center cursor-default",
        BadgeClassName
      )}
      style={{ maxWidth }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span ref={textRef} className="truncate">
        {firstItem}
      </span>
      {remainingCount > 0 && <span className="flex-shrink-0">&amp;{remainingCount}</span>}
    </Badge>
  );

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip open={showTooltip}>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent side={tooltipSide} className="bg-black text-white text-xs">
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

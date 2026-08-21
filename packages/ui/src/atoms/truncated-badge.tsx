import * as React from "react";

import { Badge } from "@/atoms/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/atoms/tooltip";
import { cn } from "@/lib/utils";

export interface TruncatedBadgeProps {
  items: string[];
  BadgeClassName?: string;
  maxWidth?: string;
  tooltipSide?: "top" | "bottom" | "left" | "right";
  tooltipSeparator?: string;
}

function TruncatedBadge({
  items,
  BadgeClassName,
  maxWidth = "160px",
  tooltipSide = "bottom",
  tooltipSeparator = ", ",
}: TruncatedBadgeProps) {
  const firstRef = React.useRef<HTMLSpanElement>(null);
  const [showTooltip, setShowTooltip] = React.useState(false);

  if (!items || items.length === 0) return null;

  const extraCount = items.length - 1;
  const tooltipText = items.join(tooltipSeparator);

  const onEnter = () => {
    if (firstRef.current) {
      const overflow = firstRef.current.scrollWidth > firstRef.current.clientWidth;
      setShowTooltip(overflow || extraCount > 0);
    } else {
      setShowTooltip(extraCount > 0);
    }
  };

  const badge = (
    <Badge
      variant="outline"
      className={cn(
        "border-warning-100 bg-warning-50 text-warning-600 text-xs h-5 font-normal flex items-center cursor-default",
        BadgeClassName
      )}
      style={{ maxWidth }}
      onMouseEnter={onEnter}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span ref={firstRef} className="truncate">
        {items[0]}
      </span>
      {extraCount > 0 ? (
        <span className="flex-shrink-0">&{extraCount}</span>
      ) : null}
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

export { TruncatedBadge };

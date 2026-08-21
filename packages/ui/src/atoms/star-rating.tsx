import * as React from "react";
import { Star, StarHalf } from "lucide-react";

import { cn } from "@/lib/utils";

export interface StarRatingProps {
  value: number;
  maxStars?: number;
  showValue?: boolean;
  className?: string;
}

function StarRating({
  value,
  maxStars = 5,
  showValue = true,
  className,
}: StarRatingProps) {
  const filled = Math.floor(value);
  const remainder = value - filled;
  const showHalf = remainder >= 0.25 && remainder < 0.75;
  const roundUp = remainder >= 0.75;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {showValue ? (
        <span className="text-sm text-slate-700">{value}</span>
      ) : null}
      <div className="flex items-center gap-px">
        {Array.from({ length: maxStars }, (_, index) => {
          if (index < filled || (roundUp && index === filled)) {
            return (
              <Star
                key={index}
                className="size-3.5 fill-amber-400 text-amber-400"
              />
            );
          }
          if (showHalf && index === filled) {
            return (
              <div key={index} className="relative size-3.5">
                <Star className="absolute inset-0 size-3.5 fill-none text-slate-300" />
                <StarHalf className="absolute inset-0 size-3.5 fill-amber-400 text-amber-400" />
              </div>
            );
          }
          return (
            <Star
              key={index}
              className="size-3.5 fill-none text-slate-300"
            />
          );
        })}
      </div>
    </div>
  );
}

export { StarRating };

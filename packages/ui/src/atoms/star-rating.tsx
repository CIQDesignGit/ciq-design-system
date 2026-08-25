import { Star, StarHalf } from "lucide-react";

import { cn } from "@/lib/utils";

const MAX_STARS = 5;

interface StarRatingProps {
  readonly value: number;
  readonly maxStars?: number;
  readonly showValue?: boolean;
  readonly className?: string;
}

export function StarRating({
  value,
  maxStars = MAX_STARS,
  showValue = true,
  className,
}: StarRatingProps): React.ReactElement {
  const fullStars = Math.floor(value);
  const decimal = value - fullStars;
  const hasHalf = decimal >= 0.25 && decimal < 0.75;
  const roundUp = decimal >= 0.75;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {showValue && <span className="text-sm text-slate-700">{value}</span>}
      <div className="flex items-center gap-px">
        {Array.from({ length: maxStars }, (_, i) => {
          if (i < fullStars || (roundUp && i === fullStars)) {
            return <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />;
          }
          if (hasHalf && i === fullStars) {
            return (
              <div key={i} className="relative size-3.5">
                <Star className="absolute inset-0 size-3.5 fill-none text-slate-300" />
                <StarHalf className="absolute inset-0 size-3.5 fill-amber-400 text-amber-400" />
              </div>
            );
          }
          return <Star key={i} className="size-3.5 fill-none text-slate-300" />;
        })}
      </div>
    </div>
  );
}

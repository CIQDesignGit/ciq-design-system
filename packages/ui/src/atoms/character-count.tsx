import * as React from "react";

import { cn } from "@/lib/utils";

export interface CharacterCountProps {
  current: number;
  max: number;
  className?: string;
}

function CharacterCount({ current, max, className }: CharacterCountProps) {
  return (
    <span
      data-testid="character-count"
      className={cn(
        "text-xs font-medium tabular-nums",
        current > max ? "text-red-600" : "text-muted-foreground",
        className
      )}
    >
      {current} / {max}
    </span>
  );
}

export { CharacterCount };

import * as React from "react";

import { cn } from "@/lib/utils";

export interface ChipProps extends React.ComponentProps<"div"> {
  message: string;
  textClassName?: string;
}

function Chip({ message, className, textClassName, ...props }: ChipProps) {
  return (
    <div
      data-slot="chip"
      className={cn(
        "inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-medium",
        className
      )}
      {...props}
    >
      <span className={cn("text-xs font-medium", textClassName)}>
        {message}
      </span>
    </div>
  );
}

export { Chip };

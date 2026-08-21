import * as React from "react";

import { cn } from "@/lib/utils";

function Skeleton({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("rounded-lg animate-shimmer", className)}
      style={{
        background:
          "linear-gradient(90deg, #e5e7eb 25%, #d1d5db 50%, #e5e7eb 75%)",
        backgroundSize: "200% 100%",
        ...style,
      }}
      {...props}
    />
  );
}

export { Skeleton };

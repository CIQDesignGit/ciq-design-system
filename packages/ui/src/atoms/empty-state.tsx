import * as React from "react";

import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  readonly title?: string;
  readonly description?: string;
  readonly className?: string;
  readonly children?: React.ReactNode;
}

function EmptyState({
  title = "Nothing here yet",
  description,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div className={cn("text-center py-12 text-sm", className)}>
      {title ? (
        <div className="font-medium text-foreground">{title}</div>
      ) : null}
      {description ? (
        <div className="text-muted-foreground mt-1">{description}</div>
      ) : null}
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}

export { EmptyState };

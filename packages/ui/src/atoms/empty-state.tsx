import * as React from "react";

import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

function EmptyState({
  title,
  description,
  children,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("text-center py-12 text-sm", className)}>
      {title ? (
        <p className="font-medium text-foreground">{title}</p>
      ) : null}
      {description ? (
        <p className="text-muted-foreground mt-1">{description}</p>
      ) : null}
      {children}
    </div>
  );
}

export { EmptyState };

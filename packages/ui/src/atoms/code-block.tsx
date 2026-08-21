import * as React from "react";

import { cn } from "@/lib/utils";

function CodeBlock({
  className,
  children,
  ...props
}: React.ComponentProps<"pre">) {
  return (
    <pre
      className={cn(
        "overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm",
        className
      )}
      {...props}
    >
      <code>{children}</code>
    </pre>
  );
}

export { CodeBlock };

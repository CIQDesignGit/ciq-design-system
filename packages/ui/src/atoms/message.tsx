import * as React from "react";

import { cn } from "@/lib/utils";

function Message({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-2 text-sm leading-relaxed", className)}
      {...props}
    />
  );
}

function MessageContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-muted px-3 py-2 text-foreground whitespace-pre-wrap",
        className
      )}
      {...props}
    />
  );
}

export { Message, MessageContent };

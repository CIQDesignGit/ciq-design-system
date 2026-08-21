import * as React from "react";

import { cn } from "@/lib/utils";

const ChatContainerRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative flex h-full w-full flex-col overflow-hidden", className)}
    {...props}
  />
));
ChatContainerRoot.displayName = "ChatContainerRoot";

const ChatContainerContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex overflow-y-auto overflow-x-hidden flex-1 flex-col gap-4 p-4", className)}
    {...props}
  />
));
ChatContainerContent.displayName = "ChatContainerContent";

function ChatContainerScrollAnchor({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("h-px w-full shrink-0 scroll-mt-4", className)}
      {...props}
    />
  );
}

export { ChatContainerRoot, ChatContainerContent, ChatContainerScrollAnchor };

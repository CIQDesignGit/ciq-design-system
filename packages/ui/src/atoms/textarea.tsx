import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      data-testid="textarea-input"
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-input bg-white px-3 py-2 text-base text-primary font-medium placeholder:text-tertiary-text placeholder:font-normal focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };

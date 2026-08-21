import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      data-slot="input"
      data-testid="input-type-input"
      className={cn(
        "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-base text-primary font-medium file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-tertiary-text placeholder:font-normal focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };

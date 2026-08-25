import * as React from "react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Native checkbox that supports a visual indeterminate (dash) state.
 * Used for "select all" headers — distinct from the Radix Checkbox atom.
 */
export const IndeterminateCheckbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    readonly indeterminate?: boolean;
  }
>(({ indeterminate, className = "", ...rest }, ref) => {
  const internalRef = useRef<HTMLInputElement>(null);
  const resolvedRef =
    (ref as React.RefObject<HTMLInputElement> | null) || internalRef;

  useEffect(() => {
    if (typeof indeterminate === "boolean" && resolvedRef.current) {
      resolvedRef.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [resolvedRef, indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={resolvedRef}
      className={cn(
        "h-4 w-4 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary",
        className
      )}
      data-testid="indeterminate-checkbox-checkbox-input"
      {...rest}
    />
  );
});

IndeterminateCheckbox.displayName = "IndeterminateCheckbox";

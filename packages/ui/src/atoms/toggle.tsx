import * as React from "react";

import { cn } from "@/lib/utils";

export interface ToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ checked, onCheckedChange, disabled = false, className }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        data-testid="toggle-button-btn"
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex h-4 w-8 items-center rounded-full px-0.5 transition-colors",
          checked ? "bg-green-600" : "bg-gray-300",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <span
          className={cn(
            "inline-block h-3 w-4 transform rounded-full bg-white transition-all duration-200 shadow-lg",
            checked ? "translate-x-3" : "translate-x-0"
          )}
          style={{
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          }}
        />
      </button>
    );
  }
);
Toggle.displayName = "Toggle";

export { Toggle };

import * as React from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export interface AccordionProps {
  title: React.ReactNode;
  badge?: string | number;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
  chevronPosition?: "left" | "right";
  triggerClassName?: string;
  contentClassName?: string;
}

function Accordion({
  title,
  badge,
  children,
  defaultExpanded = false,
  className,
  chevronPosition = "left",
  triggerClassName,
  contentClassName,
}: AccordionProps) {
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  const chevron = (
    <ChevronRight
      className={cn(
        "h-4 w-4 text-gray-600 transition-transform cursor-pointer group-hover:text-primary",
        expanded && "rotate-90"
      )}
    />
  );

  return (
    <div className={cn("rounded-lg overflow-hidden flex flex-col", className)}>
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        className={cn(
          "w-full flex items-center justify-between p-3 hover:bg-violet-50 transition-colors group flex-shrink-0",
          triggerClassName
        )}
      >
        <div className="flex items-center gap-2">
          {chevronPosition === "left" ? chevron : null}
          {typeof title === "string" || typeof title === "number" ? (
            <span className="font-sans text-base font-medium leading-normal tracking-normal align-middle text-primary-text">
              {title}
            </span>
          ) : (
            title
          )}
          {badge !== undefined ? (
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
              {badge}
            </span>
          ) : null}
        </div>
        {chevronPosition === "right" ? chevron : null}
      </button>
      {expanded ? (
        <div className={cn("flex flex-col", contentClassName)}>{children}</div>
      ) : null}
    </div>
  );
}

export { Accordion };

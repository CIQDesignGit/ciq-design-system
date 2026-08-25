import { CopyCheck } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

/**
 * Status Cell component for displaying status badge with icon
 */
export type StatusCellProps = {
  readonly status?: string;
  readonly className?: string;
};

export const StatusCell: React.FC<StatusCellProps> = ({ status, className }) => {
  // Default to "To-do" if no status provided
  const displayStatus = status || "To-do";

  return (
    <div className={cn("flex items-center justify-start", className)}>
      <div className="bg-white border border-slate-200 border-solid box-border flex gap-1 items-center justify-center px-2 py-0.5 rounded-full shrink-0">
        <CopyCheck className="relative shrink-0 size-3 text-slate-600" />
        <span className="text-xs font-normal text-slate-900 leading-4">{displayStatus}</span>
      </div>
    </div>
  );
};

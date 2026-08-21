import * as React from "react";
import { CopyCheck } from "lucide-react";

import { cn } from "@/lib/utils";

export interface StatusCellProps {
  status?: string;
  className?: string;
}

function StatusCell({ status, className }: StatusCellProps) {
  const label = status || "To-do";

  return (
    <div className={cn("flex items-center justify-start", className)}>
      <div className="bg-white border border-slate-200 border-solid box-border flex gap-1 items-center justify-center px-2 py-0.5 rounded-full shrink-0">
        <CopyCheck className="relative shrink-0 size-3 text-slate-600" />
        <span className="text-xs font-normal text-slate-900 leading-4">
          {label}
        </span>
      </div>
    </div>
  );
}

export { StatusCell };

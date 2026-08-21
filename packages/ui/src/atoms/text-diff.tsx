import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextDiffProps {
  original?: string;
  suggested?: string;
  className?: string;
}

function TextDiff({ original, suggested, className }: TextDiffProps) {
  return (
    <div className={cn("text-sm leading-relaxed text-foreground", className)}>
      {original ? (
        <span className="text-slate-400 line-through decoration-slate-400 mr-1">
          {original}
        </span>
      ) : null}
      {suggested ? (
        <span className="box-decoration-clone rounded bg-green-50 px-1 py-0.5 text-green-700">
          {suggested}
        </span>
      ) : null}
    </div>
  );
}

export { TextDiff };

import * as React from "react";

import { cn } from "@/lib/utils";

export interface ResponseStreamProps {
  text: string;
  className?: string;
}

function ResponseStream({ text, className }: ResponseStreamProps) {
  return (
    <div className={cn("whitespace-pre-wrap text-sm leading-relaxed", className)}>
      {text}
    </div>
  );
}

export { ResponseStream };

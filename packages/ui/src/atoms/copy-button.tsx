import * as React from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/atoms/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/atoms/tooltip";
import { cn } from "@/lib/utils";

export interface CopyButtonProps
  extends Omit<
    React.ComponentProps<typeof Button>,
    "onClick" | "value" | "onCopy"
  > {
  value: string;
  onCopy?: (value: string) => void;
  tooltipText?: string;
  copiedText?: string;
  feedbackDuration?: number;
  absolute?: boolean;
  groupHoverClass?: string;
}

function CopyButton({
  value,
  onCopy,
  tooltipText = "Copy",
  copiedText = "Copied!",
  feedbackDuration = 2000,
  absolute = false,
  groupHoverClass = "group-hover/text-section",
  className,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = React.useCallback(
    async (event: React.MouseEvent) => {
      event.stopPropagation();
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        onCopy?.(value);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), feedbackDuration);
      } catch {
        setCopied(false);
      }
    },
    [value, onCopy, feedbackDuration]
  );

  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  if (!value) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={copy}
            aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
            className={cn(
              "h-8 w-8",
              absolute &&
                cn(
                  "absolute bottom-0 right-0 p-1.5 rounded-lg bg-transparent hover:bg-slate-50 transition-all",
                  `opacity-0 ${groupHoverClass}:opacity-100`,
                  "flex items-center justify-center"
                ),
              className
            )}
            {...props}
          >
            {copied ? (
              <Check className="h-4 w-4 text-slate-500" />
            ) : (
              <Copy className="h-4 w-4 text-slate-500" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? copiedText : tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export { CopyButton };

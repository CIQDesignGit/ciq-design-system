
import { Check, Copy } from "lucide-react";
import * as React from "react";

import { Button } from "@/atoms/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/atoms/tooltip";
import { cn } from "@/lib/utils";

interface CopyButtonProps extends Omit<React.ComponentProps<typeof Button>, "onClick" | "onCopy"> {
  readonly value: string;
  readonly onCopy?: (value: string) => void;
  readonly tooltipText?: string;
  readonly copiedText?: string;
  readonly feedbackDuration?: number;
  readonly absolute?: boolean;
  readonly groupHoverClass?: string;
}

export function CopyButton({
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
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = React.useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!value) return;

      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        onCopy?.(value);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          setCopied(false);
          timeoutRef.current = null;
        }, feedbackDuration);
      } catch {
        // Fallback for older browsers — no logger (app coupling stripped)
        const textArea = document.createElement("textarea");
        textArea.value = value;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
          document.body.removeChild(textArea);
          setCopied(true);
          onCopy?.(value);

          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          timeoutRef.current = setTimeout(() => {
            setCopied(false);
            timeoutRef.current = null;
          }, feedbackDuration);
        } catch {
          document.body.removeChild(textArea);
        }
      }
    },
    [value, onCopy, feedbackDuration]
  );

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const tooltipProps = copied
    ? {
        open: true,
        onOpenChange: () => {
          // Prevent closing when showing "Copied!"
        },
      }
    : {};

  if (!value) return null;

  return (
    <TooltipProvider>
      <Tooltip {...tooltipProps}>
        <TooltipTrigger asChild data-testid="copy-button-tooltip-trigger">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleCopy}
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
            aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
            data-testid="copy-button-copied-copied-to-clipboard-copy-to-clipboard-btn"
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

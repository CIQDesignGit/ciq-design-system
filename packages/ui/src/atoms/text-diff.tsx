
import { diffWords } from "diff";
import React from "react";

import { cn } from "@/lib/utils";

interface TextDiffProps {
  /** The original (base) text — removed words shown with strikethrough. */
  readonly oldText: string;
  /** The new (target) text — added words shown with green highlight. */
  readonly newText: string;
  /** Additional class names on the wrapper. */
  readonly className?: string;
}

interface DiffSegment {
  value: string;
  added?: boolean;
  removed?: boolean;
}

/**
 * Renders a word-level diff between two strings. Removed words appear with
 * strikethrough + muted styling; added words appear with a green highlight.
 * Unchanged words render normally.
 *
 * Uses the Myers O(ND) algorithm via the `diff` package (`diffWords`), which
 * tokenizes on word boundaries while preserving whitespace.
 *
 * Designed as a generic utility — not tied to any specific module.
 *
 * @example
 * ```tsx
 * <TextDiff
 *   oldText="Yankee Candle Large Jar Candle, 22 oz"
 *   newText="Yankee Candle 22 oz — 150-Hr Burn, Premium Scented Candle"
 * />
 * ```
 */
export function TextDiff({ oldText, newText, className }: TextDiffProps): React.ReactElement {
  const baseSegments: DiffSegment[] = diffWords(oldText, newText);
  const segments = baseSegments.map((segment, index) => ({
    ...segment,
    rowKey: `${index}-${segment.value}`,
  }));

  return (
    <span className={cn("text-sm leading-relaxed text-foreground", className)}>
      {segments.map((segment) => {
        if (segment.removed) {
          return (
            <span key={segment.rowKey} className="text-slate-400 line-through decoration-slate-400">
              {segment.value}
            </span>
          );
        }

        if (segment.added) {
          return (
            <span
              key={segment.rowKey}
              className="box-decoration-clone rounded bg-green-50 px-1 py-0.5 text-green-700"
            >
              {segment.value}
            </span>
          );
        }

        return <span key={segment.rowKey}>{segment.value}</span>;
      })}
    </span>
  );
}


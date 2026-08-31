import { Circle, CircleCheck } from "lucide-react";
import React from "react";

import { Button } from "@/atoms/button";
import { Textarea } from "@/atoms/textarea";
import { cn } from "@/lib/utils";

import type { FeedbackSentiment, FeedbackTagOption } from "./types";

export interface FeedbackFormProps {
  readonly sentiment: FeedbackSentiment;
  readonly tags?: ReadonlyArray<FeedbackTagOption>;
  readonly selectedTags?: string[];
  readonly onTagClick?: (tagValue: string) => void;
  readonly comment: string;
  readonly onCommentChange: (value: string) => void;
  readonly onSubmit: () => void;
  readonly onSkip: () => void;
  readonly isSubmitting?: boolean;
  readonly submitDisabled?: boolean;
  readonly containerRef?: React.Ref<HTMLDivElement>;
  readonly className?: string;
}

export function FeedbackForm({
  sentiment,
  tags,
  selectedTags = [],
  onTagClick,
  comment,
  onCommentChange,
  onSubmit,
  onSkip,
  isSubmitting = false,
  submitDisabled = false,
  containerRef,
  className,
}: FeedbackFormProps): React.ReactElement {
  // Placeholder copy depends on thumbs-up vs thumbs-down
  const placeholder = sentiment === "POSITIVE" ? "What did you like?" : "What could be improved?";

  return (
    <div className={cn("flex flex-col", className)}>
      {tags && tags.length > 0 && onTagClick && (
        <div className="flex items-center gap-2 flex-wrap mb-2">
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag.value);
            return (
              <Button
                key={tag.value}
                onClick={() => onTagClick(tag.value)}
                className={cn(
                  "text-sm rounded-full border px-3 py-1.5 transition-colors flex items-center gap-2",
                  isSelected
                    ? "bg-white text-slate-500 border-purple-200"
                    : "bg-white text-slate-500 border-slate-100"
                )}
              >
                {tag.label}
                {isSelected ? (
                  <CircleCheck
                    size={16}
                    className="shrink-0 text-white fill-purple-400"
                    aria-hidden
                  />
                ) : (
                  <Circle size={16} className="shrink-0 text-slate-300" aria-hidden />
                )}
              </Button>
            );
          })}
        </div>
      )}

      <div ref={containerRef} className={cn(!tags?.length && "space-y-2")}>
        <Textarea
          value={comment}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onCommentChange(e.target.value)}
          placeholder={placeholder}
          disabled={isSubmitting}
          className="min-h-[72px] resize-none text-tertiary-text border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-slate-400"
        />
        <div className="flex items-center justify-end gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={isSubmitting || submitDisabled}
            onClick={onSubmit}
            className="text-xs h-8 rounded-md text-black"
          >
            {isSubmitting ? "Sending..." : "Share Feedback"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={isSubmitting}
            onClick={onSkip}
            className="text-xs h-8"
          >
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
}

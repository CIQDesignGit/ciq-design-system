import React, { useCallback, useRef, useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/atoms/popover";

import { FeedbackForm } from "./FeedbackForm";
import { useFeedbackPopoverGroup } from "./feedbackPopoverGroupContext";
import type { FeedbackSentiment, FeedbackTagOption } from "./types";

export interface FeedbackPopoverProps {
  readonly sentiment: FeedbackSentiment;
  readonly tags?: ReadonlyArray<FeedbackTagOption>;
  readonly onSubmit: (
    sentiment: FeedbackSentiment,
    comment: string,
    tags: string[]
  ) => Promise<void> | void;
  readonly autoSubmitOnClose?: boolean;
  readonly children: React.ReactNode;
  readonly align?: "start" | "center" | "end";
  readonly side?: "top" | "right" | "bottom" | "left";
  readonly contentClassName?: string;
  /** Controlled open — ignored when inside `FeedbackPopoverGroup`. */
  readonly open?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
}

export function FeedbackPopover({
  sentiment,
  tags,
  onSubmit,
  autoSubmitOnClose = false,
  children,
  align = "end",
  side = "top",
  contentClassName = "w-[300px] p-3 rounded-xl shadow-lg border border-slate-200",
  open: openProp,
  onOpenChange: onOpenChangeProp,
}: FeedbackPopoverProps): React.ReactElement {
  const group = useFeedbackPopoverGroup();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isExplicitCloseRef = useRef(false);
  const isControlled = openProp !== undefined;

  const open = group
    ? group.openSentiment === sentiment
    : isControlled
      ? openProp
      : uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean): void => {
      if (group) {
        if (next) group.requestOpen(sentiment);
        else group.requestClose(sentiment);
        return;
      }
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChangeProp?.(next);
    },
    [group, sentiment, isControlled, onOpenChangeProp]
  );

  const resetState = useCallback((): void => {
    setComment("");
    setSelectedTags([]);
    setIsSubmitting(false);
  }, []);

  const performSubmit = useCallback(
    async (text: string, submittedTags: string[]): Promise<void> => {
      setIsSubmitting(true);
      try {
        await onSubmit(sentiment, text, submittedTags);
      } finally {
        resetState();
        setOpen(false);
      }
    },
    [sentiment, onSubmit, resetState, setOpen]
  );

  const handleOpenChange = useCallback(
    (newOpen: boolean): void => {
      if (!newOpen) {
        if (isExplicitCloseRef.current) {
          isExplicitCloseRef.current = false;
          return;
        }
        const skipAutoSubmit = group?.skipAutoSubmitRef.current === true;
        if (autoSubmitOnClose && !skipAutoSubmit) {
          void performSubmit(comment, selectedTags);
          return;
        }
        if (group) {
          group.skipAutoSubmitRef.current = false;
        }
        resetState();
      }
      setOpen(newOpen);
    },
    [autoSubmitOnClose, comment, selectedTags, performSubmit, resetState, setOpen, group]
  );

  const handleSubmit = useCallback((): void => {
    isExplicitCloseRef.current = true;
    void performSubmit(comment, selectedTags);
  }, [comment, selectedTags, performSubmit]);

  const handleSkip = useCallback((): void => {
    isExplicitCloseRef.current = true;
    void performSubmit("", []);
  }, [performSubmit]);

  const handleTagClick = useCallback((tagValue: string): void => {
    setSelectedTags((prev) =>
      prev.includes(tagValue) ? prev.filter((t) => t !== tagValue) : [...prev, tagValue]
    );
  }, []);

  const handleTriggerPointerDown = useCallback((): void => {
    group?.prepareSwitch(sentiment);
  }, [group, sentiment]);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <span className="inline-flex" onPointerDown={handleTriggerPointerDown}>
          {children}
        </span>
      </PopoverTrigger>
      <PopoverContent align={align} side={side} className={contentClassName}>
        <FeedbackForm
          sentiment={sentiment}
          tags={tags}
          selectedTags={selectedTags}
          onTagClick={handleTagClick}
          comment={comment}
          onCommentChange={setComment}
          onSubmit={handleSubmit}
          onSkip={handleSkip}
          isSubmitting={isSubmitting}
          submitDisabled={comment.length === 0}
        />
      </PopoverContent>
    </Popover>
  );
}

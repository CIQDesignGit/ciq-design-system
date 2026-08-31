import React, { useCallback, useMemo, useRef, useState } from "react";

import {
  FeedbackPopoverGroupContext,
  type FeedbackPopoverGroupContextValue,
} from "./feedbackPopoverGroupContext";
import type { FeedbackSentiment } from "./types";

/**
 * Ensures only one nested `FeedbackPopover` is open at a time.
 * Switching thumbs up ↔ down closes the other without auto-submitting it.
 */
export function FeedbackPopoverGroup({
  children,
}: {
  readonly children: React.ReactNode;
}): React.ReactElement {
  const [openSentiment, setOpenSentiment] = useState<FeedbackSentiment | null>(null);
  const skipAutoSubmitRef = useRef(false);

  const prepareSwitch = useCallback(
    (next: FeedbackSentiment): void => {
      if (openSentiment != null && openSentiment !== next) {
        skipAutoSubmitRef.current = true;
      }
    },
    [openSentiment]
  );

  const requestOpen = useCallback((sentiment: FeedbackSentiment): void => {
    setOpenSentiment(sentiment);
  }, []);

  const requestClose = useCallback((sentiment: FeedbackSentiment): void => {
    setOpenSentiment((prev) => (prev === sentiment ? null : prev));
  }, []);

  const value = useMemo(
    (): FeedbackPopoverGroupContextValue => ({
      openSentiment,
      requestOpen,
      requestClose,
      prepareSwitch,
      skipAutoSubmitRef,
    }),
    [openSentiment, requestOpen, requestClose, prepareSwitch]
  );

  return (
    <FeedbackPopoverGroupContext.Provider value={value}>
      {children}
    </FeedbackPopoverGroupContext.Provider>
  );
}

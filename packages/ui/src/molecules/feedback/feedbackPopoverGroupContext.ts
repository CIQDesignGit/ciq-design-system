import { createContext, useContext, type MutableRefObject } from "react";

import type { FeedbackSentiment } from "./types";

export interface FeedbackPopoverGroupContextValue {
  readonly openSentiment: FeedbackSentiment | null;
  readonly requestOpen: (sentiment: FeedbackSentiment) => void;
  readonly requestClose: (sentiment: FeedbackSentiment) => void;
  readonly prepareSwitch: (sentiment: FeedbackSentiment) => void;
  readonly skipAutoSubmitRef: MutableRefObject<boolean>;
}

export const FeedbackPopoverGroupContext = createContext<FeedbackPopoverGroupContextValue | null>(
  null
);

export function useFeedbackPopoverGroup(): FeedbackPopoverGroupContextValue | null {
  return useContext(FeedbackPopoverGroupContext);
}

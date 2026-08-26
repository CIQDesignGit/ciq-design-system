import { useEffect, useRef } from "react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";

import { cn } from "@/lib/utils";

export type ChatContainerRootProps = {
  readonly children: React.ReactNode;
  readonly className?: string;
  /** When true, disables auto-scroll to bottom (for completed conversations) */
  readonly disableStickToBottom?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export type ChatContainerContentProps = {
  readonly children: React.ReactNode;
  readonly className?: string;
  /** When true, stops auto-scrolling but preserves position */
  readonly disableStickToBottom?: boolean;
  /** Fires whenever the user's at-bottom state changes */
  readonly onIsAtBottomChange?: (isAtBottom: boolean) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export type ChatContainerScrollAnchorProps = {
  readonly className?: string;
  readonly ref?: React.RefObject<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>;

function ChatContainerRoot({
  children,
  className,
  disableStickToBottom,
  ...props
}: ChatContainerRootProps) {
  const commonProps = {
    role: "log",
    "aria-live": "polite" as const,
    "aria-relevant": "additions text" as const,
    "aria-atomic": "false" as const,
    "aria-label": "Chat messages",
    "data-testid": "chat-container-chat-messages-element",
    ...props,
  };

  return (
    <StickToBottom
      className={cn("flex overflow-y-auto overflow-x-hidden", className)}
      resize="smooth"
      {...(!disableStickToBottom && { initial: "instant" })}
      {...commonProps}
    >
      {children}
    </StickToBottom>
  );
}

function ScrollWatcher({
  disableStickToBottom,
  onIsAtBottomChange,
}: {
  readonly disableStickToBottom?: boolean;
  readonly onIsAtBottomChange?: (isAtBottom: boolean) => void;
}) {
  const { isAtBottom, stopScroll, scrollToBottom } = useStickToBottomContext();
  const hasDisabledRef = useRef(false);

  useEffect(() => {
    onIsAtBottomChange?.(isAtBottom);
  }, [isAtBottom, onIsAtBottomChange]);

  useEffect(() => {
    if (disableStickToBottom && !hasDisabledRef.current) {
      hasDisabledRef.current = true;
      stopScroll();
    } else if (!disableStickToBottom && hasDisabledRef.current) {
      hasDisabledRef.current = false;
      scrollToBottom();
      onIsAtBottomChange?.(true);
    }
  }, [disableStickToBottom, stopScroll, scrollToBottom, onIsAtBottomChange]);

  return null;
}

function ChatContainerContent({
  children,
  className,
  disableStickToBottom,
  onIsAtBottomChange,
  ...props
}: ChatContainerContentProps) {
  return (
    <StickToBottom.Content className={cn("flex w-full flex-col", className)} {...props}>
      <ScrollWatcher
        disableStickToBottom={disableStickToBottom}
        onIsAtBottomChange={onIsAtBottomChange}
      />
      {children}
    </StickToBottom.Content>
  );
}

function ChatContainerScrollAnchor({ className, ...props }: ChatContainerScrollAnchorProps) {
  return (
    <div
      className={cn("h-px w-full shrink-0 scroll-mt-4", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export { ChatContainerContent, ChatContainerRoot, ChatContainerScrollAnchor };

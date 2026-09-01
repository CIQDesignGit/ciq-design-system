import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/atoms/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/atoms/tooltip";
import { cn } from "@/lib/utils";

import { Markdown } from "@/atoms/markdown";

export type MessageAvatarProps = {
  readonly src: string;
  readonly alt: string;
  readonly fallback?: string;
  readonly delayMs?: number;
  readonly className?: string;
};

const MessageAvatar = ({ src, alt, fallback, delayMs, className }: MessageAvatarProps) => {
  return (
    <Avatar className={cn("h-8 w-8 shrink-0", className)}>
      <AvatarImage src={src} alt={alt} />
      {fallback && <AvatarFallback delayMs={delayMs}>{fallback}</AvatarFallback>}
    </Avatar>
  );
};

export type MessageProps = {
  readonly children: React.ReactNode;
  readonly className?: string;
  /**
   * When true, renders an agent avatar before the message content.
   * Omit or set false for a bubble-only row (typical for user messages).
   */
  readonly showAvatar?: boolean;
  /** Avatar image/fallback — used only when `showAvatar` is true. */
  readonly avatar?: MessageAvatarProps;
} & Omit<React.HTMLProps<HTMLDivElement>, "children">;

const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ children, className, showAvatar = false, avatar, ...props }, ref) => (
    <div ref={ref} className={cn("flex gap-3 w-full", className)} {...props}>
      {showAvatar ? (
        <MessageAvatar
          src={avatar?.src ?? ""}
          alt={avatar?.alt ?? "Assistant"}
          fallback={avatar?.fallback ?? "AI"}
          delayMs={avatar?.delayMs}
          className={avatar?.className}
        />
      ) : null}
      {children}
    </div>
  )
);
Message.displayName = "Message";

export type MessageContentVariant = "user" | "agent" | "agent-plain";

export type MessageContentProps = {
  readonly children: React.ReactNode;
  readonly markdown?: boolean;
  /**
   * - user: brand-50 bubble, sharp bottom-right
   * - agent: grey-50 bubble, sharp bottom-left
   * - agent-plain: no background (text only)
   */
  readonly variant?: MessageContentVariant;
  readonly className?: string;
} & React.ComponentProps<typeof Markdown> &
  React.HTMLProps<HTMLDivElement>;

const messageContentVariants: Record<MessageContentVariant, string> = {
  user: "rounded-2xl rounded-br-[2px] bg-brand-50 p-3 md:p-4",
  agent: "rounded-2xl rounded-bl-[2px] bg-surface-muted p-3 md:p-4",
  // No fill / no bubble chrome — just the response text
  "agent-plain": "bg-transparent p-0",
};

const MessageContent = ({
  children,
  markdown = false,
  variant = "agent",
  className,
  ...props
}: MessageContentProps) => {
  const classNames = cn(
    "text-fg-primary prose break-words whitespace-normal max-w-[80%]",
    messageContentVariants[variant],
    className
  );

  return markdown ? (
    <Markdown className={classNames} {...props}>
      {children as string}
    </Markdown>
  ) : (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
};

export type MessageActionsProps = {
  readonly children: React.ReactNode;
  readonly className?: string;
} & React.HTMLProps<HTMLDivElement>;

const MessageActions = ({ children, className, ...props }: MessageActionsProps) => (
  <div className={cn("text-muted-foreground flex items-center gap-2", className)} {...props}>
    {children}
  </div>
);

export type MessageActionProps = {
  readonly className?: string;
  readonly tooltip: React.ReactNode;
  readonly children: React.ReactNode;
  readonly side?: "top" | "bottom" | "left" | "right";
} & React.ComponentProps<typeof Tooltip>;

const MessageAction = ({
  tooltip,
  children,
  className,
  side = "top",
  ...props
}: MessageActionProps) => {
  return (
    <TooltipProvider>
      <Tooltip {...props}>
        <TooltipTrigger asChild data-testid="message-tooltip-trigger">
          {children}
        </TooltipTrigger>
        <TooltipContent side={side} className={className}>
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { Message, MessageAction, MessageActions, MessageAvatar, MessageContent };

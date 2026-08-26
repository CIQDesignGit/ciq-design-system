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

export type MessageProps = {
  readonly children: React.ReactNode;
  readonly className?: string;
} & React.HTMLProps<HTMLDivElement>;

const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn("flex gap-3 w-full", className)} {...props}>
      {children}
    </div>
  )
);
Message.displayName = "Message";

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

export type MessageContentProps = {
  readonly children: React.ReactNode;
  readonly markdown?: boolean;
  readonly className?: string;
} & React.ComponentProps<typeof Markdown> &
  React.HTMLProps<HTMLDivElement>;

const MessageContent = ({
  children,
  markdown = false,
  className,
  ...props
}: MessageContentProps) => {
  const classNames = cn(
    "rounded-2xl p-3 md:p-4 text-foreground bg-secondary prose break-words whitespace-normal max-w-[80%]",
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

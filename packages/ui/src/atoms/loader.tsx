import * as React from "react";

import { cn } from "@/lib/utils";

type LoaderSize = "sm" | "md" | "lg";
type LoaderVariant =
  | "circular"
  | "classic"
  | "pulse"
  | "pulse-dot"
  | "dots"
  | "typing"
  | "wave"
  | "bars"
  | "terminal"
  | "text-blink"
  | "text-shimmer"
  | "loading-dots";

export interface LoaderProps {
  variant?: LoaderVariant;
  size?: LoaderSize;
  text?: string;
  className?: string;
}

const sizeBox: Record<LoaderSize, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

function ScreenReaderLabel() {
  return <span className="sr-only">Loading</span>;
}

function CircularLoader({
  size = "md",
  className,
}: Pick<LoaderProps, "size" | "className">) {
  return (
    <div
      className={cn(
        "text-primary animate-spin rounded-full border-2 border-current border-t-transparent",
        sizeBox[size ?? "md"],
        className
      )}
    >
      <ScreenReaderLabel />
    </div>
  );
}

function DotsLoader({
  size = "md",
  className,
}: Pick<LoaderProps, "size" | "className">) {
  const dot = { sm: "h-1.5 w-1.5", md: "h-2 w-2", lg: "h-2.5 w-2.5" }[
    size ?? "md"
  ];
  return (
    <div
      className={cn(
        "flex items-center space-x-1",
        { sm: "h-4", md: "h-5", lg: "h-6" }[size ?? "md"],
        className
      )}
    >
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={cn(
            "bg-primary animate-[bounce-dots_1.4s_ease-in-out_infinite] rounded-full",
            dot
          )}
          style={{ animationDelay: `${index * 160}ms` }}
        />
      ))}
      <ScreenReaderLabel />
    </div>
  );
}

function TextDotsLoader({
  text = "Thinking",
  size = "md",
  className,
}: Pick<LoaderProps, "text" | "size" | "className">) {
  const textSize = { sm: "text-xs", md: "text-sm", lg: "text-base" }[
    size ?? "md"
  ];
  return (
    <div className={cn("inline-flex items-center", className)}>
      <span className={cn("text-tertiary-text font-medium", textSize)}>
        {text}
      </span>
      <span className="inline-flex">
        <span className="text-tertiary-text animate-[loading-dots_1.4s_infinite_0.2s]">
          .
        </span>
        <span className="text-tertiary-text animate-[loading-dots_1.4s_infinite_0.4s]">
          .
        </span>
        <span className="text-tertiary-text animate-[loading-dots_1.4s_infinite_0.6s]">
          .
        </span>
      </span>
    </div>
  );
}

function TextShimmerLoader({
  text = "Thinking",
  size = "md",
  className,
}: Pick<LoaderProps, "text" | "size" | "className">) {
  const textSize = { sm: "text-xs", md: "text-sm", lg: "text-base" }[
    size ?? "md"
  ];
  return (
    <div
      className={cn(
        "bg-[linear-gradient(to_right,var(--muted-foreground)_40%,var(--foreground)_60%,var(--muted-foreground)_80%)] bg-[length:200%_auto] bg-clip-text font-medium text-transparent animate-[shimmer_4s_infinite_linear]",
        textSize,
        className
      )}
    >
      {text}
    </div>
  );
}

function Loader({
  variant = "circular",
  size = "md",
  text,
  className,
}: LoaderProps) {
  if (variant === "dots") {
    return <DotsLoader size={size} className={className} />;
  }
  if (variant === "loading-dots") {
    return <TextDotsLoader text={text} size={size} className={className} />;
  }
  if (variant === "text-shimmer" || variant === "text-blink") {
    return <TextShimmerLoader text={text} size={size} className={className} />;
  }
  return <CircularLoader size={size} className={className} />;
}

export { Loader };

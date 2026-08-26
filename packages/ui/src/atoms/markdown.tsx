import React, { Suspense } from "react";

import { cn } from "@/lib/utils";

import type { MarkdownProps as MarkdownContentProps } from "./markdown-content";
import { Skeleton } from "@/atoms/skeleton";

export type MarkdownProps = MarkdownContentProps;

// react-markdown + remark-gfm + rehype-raw pull in the full unified/micromark parsing
// stack. Lazy-loading keeps that weight out of every route that renders a Markdown
// block eagerly, deferring it to its own async chunk.
const MarkdownContent = React.lazy(() => import("./markdown-content"));

function MarkdownFallback({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-4/5" />
    </div>
  );
}

export const Markdown = React.memo(function Markdown({
  className,
  children,
  ...props
}: MarkdownProps) {
  return (
    <Suspense fallback={<MarkdownFallback className={className} />}>
      <MarkdownContent className={className} {...props}>
        {children}
      </MarkdownContent>
    </Suspense>
  );
});

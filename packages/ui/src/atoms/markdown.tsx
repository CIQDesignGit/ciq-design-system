import * as React from "react";

import { cn } from "@/lib/utils";

function Markdown({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "prose prose-sm max-w-none text-foreground [&_p]:leading-7",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function MarkdownContent(props: React.ComponentProps<typeof Markdown>) {
  return <Markdown {...props} />;
}

function SectionMarkdown({
  title,
  children,
  className,
}: {
  title?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-2", className)}>
      {title ? <h3 className="text-sm font-semibold">{title}</h3> : null}
      <Markdown>{children}</Markdown>
    </section>
  );
}

export { Markdown, MarkdownContent, SectionMarkdown };

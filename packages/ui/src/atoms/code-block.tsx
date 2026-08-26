import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

import { cn } from "@/lib/utils";

export type CodeBlockProps = {
  readonly children?: React.ReactNode;
  readonly className?: string;
} & React.HTMLProps<HTMLDivElement>;

function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  return (
    <div
      className={cn(
        "not-prose flex w-full flex-col overflow-clip border",
        "border-border bg-card text-card-foreground rounded-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export type CodeBlockCodeProps = {
  readonly code: string;
  readonly language?: string;
  readonly theme?: string;
  readonly className?: string;
} & Omit<React.HTMLProps<HTMLDivElement>, "dangerouslySetInnerHTML">;

const ALLOWED_LANGUAGES = new Set([
  "txt",
  "text",
  "plaintext",
  "js",
  "jsx",
  "ts",
  "tsx",
  "json",
  "bash",
  "sh",
  "yaml",
  "yml",
  "css",
  "scss",
  "html",
  "markdown",
  "md",
  "sql",
]);

function normalizeLanguage(lang?: string): string {
  if (!lang) return "plaintext";
  const lower = lang.toLowerCase();
  return ALLOWED_LANGUAGES.has(lower) ? lower : "plaintext";
}

function CodeBlockCode({
  code,
  language = "tsx",
  theme = "github-light",
  className,
  ...props
}: CodeBlockCodeProps) {
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);

  useEffect(() => {
    async function highlight() {
      if (!code) {
        setHighlightedHtml("<pre><code></code></pre>");
        return;
      }

      const safeLang = normalizeLanguage(language);
      const html = await codeToHtml(code, { lang: safeLang, theme });
      setHighlightedHtml(html);
    }
    highlight();
  }, [code, language, theme]);

  const classNames = cn("w-full overflow-x-auto text-[13px] [&>pre]:px-4 [&>pre]:py-4", className);

  // SSR fallback: render plain code if not hydrated yet
  return highlightedHtml ? (
    <div
      className={classNames}
      {...props}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(highlightedHtml) }}
    />
  ) : (
    <div className={classNames} {...props}>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export type CodeBlockGroupProps = React.HTMLAttributes<HTMLDivElement>;

function CodeBlockGroup({ children, className, ...props }: CodeBlockGroupProps) {
  return (
    <div className={cn("flex items-center justify-between", className)} {...props}>
      {children}
    </div>
  );
}

export { CodeBlock, CodeBlockCode, CodeBlockGroup };

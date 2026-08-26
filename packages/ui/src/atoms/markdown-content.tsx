import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

/**
 * Markdown security posture (matches neo-canvas):
 * - `remark-gfm` for GFM tables/lists/strikethrough.
 * - `rehype-raw` enables raw HTML in markdown (no rehype-sanitize / no DOMPurify allowlist here).
 * - Treat markdown `children` as trusted or app-sanitized before render.
 * - Syntax-highlighted code uses `CodeBlock` + DOMPurify.sanitize (default DOMPurify allowlist).
 */
function scrollToElementAndHighlight(
  elementId: string,
  options: {
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
    highlightDuration?: number;
    highlightClasses?: string[];
  } = {}
): boolean {
  const {
    behavior = "smooth",
    block = "center",
    highlightDuration = 2000,
    highlightClasses = ["ring-2", "ring-violet-400", "ring-offset-2"],
  } = options;

  // Library: use document.getElementById — no web-component queryElement.
  const targetElement = document.getElementById(elementId);
  if (!targetElement) return false;

  targetElement.scrollIntoView({ behavior, block, inline: "nearest" });
  targetElement.classList.add(...highlightClasses);
  setTimeout(() => {
    targetElement.classList.remove(...highlightClasses);
  }, highlightDuration);
  return true;
}


const REMARK_PLUGINS = [remarkGfm];
const REHYPE_PLUGINS = [rehypeRaw];

const MAX_TABLE_HEIGHT = 350;

type MarkdownTableProps = {
  readonly children: React.ReactNode;
  readonly tableClassName?: string;
};

/**
 * A table wrapper component that collapses to max 350px height
 * with a "View All" link to expand and show all content.
 */
function MarkdownTable({ children, tableClassName }: MarkdownTableProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsCollapse, setNeedsCollapse] = useState(false);
  const tableRef = useRef<HTMLTableElement>(null);

  // Check if table exceeds max height after render
  useEffect(() => {
    if (tableRef.current) {
      const tableHeight = tableRef.current.scrollHeight;
      setNeedsCollapse(tableHeight > MAX_TABLE_HEIGHT);
    }
  }, [children]);

  return (
    <div className="my-3 overflow-x-auto">
      <div
        className="relative overflow-y-hidden overflow-x-auto transition-all duration-300"
        style={{
          maxHeight: !isExpanded && needsCollapse ? `${MAX_TABLE_HEIGHT}px` : "none",
        }}
      >
        <table
          ref={tableRef}
          className={["min-w-full border-collapse text-sm", tableClassName]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </table>
        {/* Gradient fade overlay when collapsed */}
        {!isExpanded && needsCollapse && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>
      {needsCollapse && (
        <div className="text-center py-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary hover:text-violet-800 underline cursor-pointer transition-colors text-sm font-medium"
          >
            {isExpanded ? "View Less" : "View All"}
          </button>
        </div>
      )}
    </div>
  );
}

function handleHashLinkClick(event: React.MouseEvent<HTMLAnchorElement>): void {
  const href = event.currentTarget.getAttribute("href");
  if (href && href.startsWith("#")) {
    event.preventDefault();
    const targetId = href.substring(1);
    const success = scrollToElementAndHighlight(targetId, {
      block: "start",
    });
    if (success && window.history.pushState) {
      window.history.pushState(null, "", href);
    }
  }
}

const DEFAULT_COMPONENTS: NonNullable<React.ComponentProps<typeof ReactMarkdown>["components"]> = {
  h1: ({ className: h1ClassName, ...props }) => (
    <h1 className={["border-0", h1ClassName].filter(Boolean).join(" ")} {...props} />
  ),
  h2: ({ className: h2ClassName, ...props }) => (
    <h2 className={["border-0", h2ClassName].filter(Boolean).join(" ")} {...props} />
  ),
  h3: ({ className: h3ClassName, ...props }) => (
    <h3 className={["border-0", h3ClassName].filter(Boolean).join(" ")} {...props} />
  ),
  h4: ({ className: h4ClassName, ...props }) => (
    <h4 className={["border-0", h4ClassName].filter(Boolean).join(" ")} {...props} />
  ),
  ul: ({ className: ulClassName, ...props }) => (
    <ul
      className={["list-disc pl-6 my-3 space-y-1", ulClassName].filter(Boolean).join(" ")}
      {...props}
    />
  ),
  ol: ({ className: olClassName, ...props }) => (
    <ol
      className={["list-decimal pl-6 my-3 space-y-1", olClassName].filter(Boolean).join(" ")}
      {...props}
    />
  ),
  li: ({ className: liClassName, ...props }) => (
    <li className={["ml-1", liClassName].filter(Boolean).join(" ")} {...props} />
  ),
  p: ({ className: pClassName, ...props }) => (
    <p
      className={["my-2 leading-6 tracking-tight", pClassName].filter(Boolean).join(" ")}
      {...props}
    />
  ),
  strong: ({ className: strongClassName, ...props }) => (
    <strong className={["font-semibold", strongClassName].filter(Boolean).join(" ")} {...props} />
  ),
  em: ({ className: emClassName, ...props }) => (
    <em className={["italic", emClassName].filter(Boolean).join(" ")} {...props} />
  ),
  a: ({ className: aClassName, href, children, ...props }) => {
    const isHashLink = href?.startsWith("#");
    return (
      <a
        className={[
          "text-primary hover:text-violet-800 underline cursor-pointer transition-colors",
          aClassName,
        ]
          .filter(Boolean)
          .join(" ")}
        href={href}
        onClick={isHashLink ? handleHashLinkClick : undefined}
        target={isHashLink ? undefined : "_blank"}
        rel={isHashLink ? undefined : "noopener noreferrer"}
        data-testid="markdown-is-hash-link"
        {...props}
      >
        {children}
      </a>
    );
  },
  table: ({ className: tableClassName, children, ...props }) => (
    <MarkdownTable tableClassName={tableClassName} {...props}>
      {children}
    </MarkdownTable>
  ),
  thead: ({ className: theadClassName, ...props }) => (
    <thead className={["bg-slate-100", theadClassName].filter(Boolean).join(" ")} {...props} />
  ),
  tbody: (props) => <tbody {...props} />,
  tr: ({ className: trClassName, ...props }) => (
    <tr
      className={["border-b border-slate-200", trClassName].filter(Boolean).join(" ")}
      {...props}
    />
  ),
  th: ({ className: thClassName, ...props }) => (
    <th
      className={[
        "px-3 py-2 text-left font-semibold text-slate-700 border border-slate-200",
        thClassName,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  ),
  td: ({ className: tdClassName, ...props }) => (
    <td
      className={["px-3 py-2 border border-slate-200", tdClassName].filter(Boolean).join(" ")}
      {...props}
    />
  ),
  hr: ({ className: hrClassName, ...props }) => (
    <hr
      className={["border-slate-200 mb-4 mt-2", hrClassName].filter(Boolean).join(" ")}
      {...props}
    />
  ),
};

export type MarkdownProps = {
  readonly children: string;
  readonly className?: string;
  readonly components?: Partial<React.ComponentProps<typeof ReactMarkdown>["components"]>;
} & React.HTMLAttributes<HTMLDivElement>;

const MarkdownContent = React.memo(function Markdown({
  children,
  className,
  components,
  ...divProps
}: MarkdownProps) {
  const resolvedComponents = useMemo(
    () => (components ? { ...DEFAULT_COMPONENTS, ...components } : DEFAULT_COMPONENTS),
    [components]
  );

  return (
    <div className={className} {...divProps}>
      <ReactMarkdown
        remarkPlugins={REMARK_PLUGINS}
        rehypePlugins={REHYPE_PLUGINS}
        components={resolvedComponents}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
});

export default MarkdownContent;

import { Markdown } from "@/atoms/markdown";
import { cn } from "@/lib/utils";

type SectionMarkdownProps = {
  readonly content: string;
  readonly className?: string;
};

export function SectionMarkdown({ content, className }: SectionMarkdownProps) {
  return (
    <section
      className={cn(
        "rounded-lg border bg-card/60 backdrop-blur text-card-foreground shadow-sm p-4 bg-white",
        className
      )}
    >
      <div className="prose dark:prose-invert max-w-none prose-headings:mb-2 prose-headings:font-semibold">
        {/* 16px headings, 14px body, 12px spacing between ordered list items */}
        <style>{`.prose :is(h1,h2,h3){font-size:16px;line-height:1.4} .prose :is(p,li){font-size:14px;line-height:1.6} .prose ol>li{margin-bottom:12px}`}</style>
        <Markdown>{content}</Markdown>
      </div>
    </section>
  );
}

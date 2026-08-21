import * as React from "react";
import { ArrowUp } from "lucide-react";

import { Button } from "@/atoms/button";
import { cn } from "@/lib/utils";

export interface PromptInputProps {
  value?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

function PromptInput({
  value,
  onValueChange,
  onSubmit,
  placeholder = "Ask anything…",
  className,
  disabled,
}: PromptInputProps) {
  const [internal, setInternal] = React.useState("");
  const text = value ?? internal;

  const submit = () => {
    const next = text.trim();
    if (!next) return;
    onSubmit?.(next);
  };

  return (
    <div
      className={cn(
        "flex items-end gap-2 rounded-xl border bg-card p-2 shadow-xs",
        className
      )}
    >
      <textarea
        value={text}
        disabled={disabled}
        placeholder={placeholder}
        rows={1}
        onChange={(event) => {
          setInternal(event.target.value);
          onValueChange?.(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
        className="min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
      />
      <Button
        size="icon"
        disabled={disabled || !text.trim()}
        onClick={submit}
        aria-label="Send"
      >
        <ArrowUp />
      </Button>
    </div>
  );
}

export { PromptInput };

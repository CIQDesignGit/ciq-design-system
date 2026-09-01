import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Textarea } from "@/atoms/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/atoms/tooltip";
import { cn } from "@/lib/utils";

/** Shell layout — compact = single pill row; stacked = textarea above a toolbar */
export type PromptInputVariant = "compact" | "stacked";

type PromptInputContextType = {
  isLoading: boolean;
  value: string;
  setValue: (value: string) => void;
  maxHeight: number | string;
  onSubmit?: () => void;
  disabled?: boolean;
  variant: PromptInputVariant;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
};

const PromptInputContext = createContext<PromptInputContextType | null>(null);

function usePromptInput() {
  const context = useContext(PromptInputContext);
  if (!context) {
    throw new Error("usePromptInput must be used within a PromptInput");
  }
  return context;
}

export type PromptInputProps = {
  readonly isLoading?: boolean;
  readonly value?: string;
  readonly onValueChange?: (value: string) => void;
  readonly maxHeight?: number | string;
  readonly onSubmit?: () => void;
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly disabled?: boolean;
  /**
   * - compact: single-line pill (leading + textarea + trailing)
   * - stacked: taller card (optional header, textarea, tools + submit)
   */
  readonly variant?: PromptInputVariant;
};

function PromptInput({
  className,
  isLoading = false,
  maxHeight = 240,
  value,
  onValueChange,
  onSubmit,
  children,
  disabled = false,
  variant = "stacked",
}: PromptInputProps) {
  const [internalValue, setInternalValue] = useState(value || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Keep internal text in sync when the parent passes a new controlled value
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = useCallback(
    (newValue: string) => {
      setInternalValue(newValue);
      onValueChange?.(newValue);
    },
    [onValueChange]
  );

  const resolvedValue = value ?? internalValue;
  const resolvedSetValue = onValueChange ?? handleChange;

  const contextValue = useMemo<PromptInputContextType>(
    () => ({
      isLoading,
      value: resolvedValue,
      setValue: resolvedSetValue,
      maxHeight,
      onSubmit,
      disabled,
      variant,
      textareaRef,
    }),
    [
      isLoading,
      resolvedValue,
      resolvedSetValue,
      maxHeight,
      onSubmit,
      disabled,
      variant,
    ]
  );

  return (
    <TooltipProvider>
      <PromptInputContext.Provider value={contextValue}>
        <div
          data-slot="prompt-input"
          data-variant={variant}
          className={cn(
            "bg-surface cursor-text border border-border-default shadow-sm",
            variant === "compact"
              ? "flex items-center gap-2 rounded-full px-3 py-2"
              : "flex flex-col gap-2 rounded-3xl p-3",
            disabled && "pointer-events-none opacity-60",
            className
          )}
          onClick={() => textareaRef.current?.focus()}
        >
          {children}
        </div>
      </PromptInputContext.Provider>
    </TooltipProvider>
  );
}

// --- Leading / trailing (compact layout slots) ---

export type PromptInputLeadingProps = React.HTMLAttributes<HTMLDivElement>;

function PromptInputLeading({
  children,
  className,
  ...props
}: PromptInputLeadingProps) {
  return (
    <div
      data-slot="prompt-input-leading"
      className={cn("flex shrink-0 items-center gap-1", className)}
      onClick={(event) => event.stopPropagation()}
      {...props}
    >
      {children}
    </div>
  );
}

export type PromptInputTrailingProps = React.HTMLAttributes<HTMLDivElement>;

function PromptInputTrailing({
  children,
  className,
  ...props
}: PromptInputTrailingProps) {
  return (
    <div
      data-slot="prompt-input-trailing"
      className={cn("ml-auto flex shrink-0 items-center gap-1", className)}
      onClick={(event) => event.stopPropagation()}
      {...props}
    >
      {children}
    </div>
  );
}

// --- Context header (reply banner or framed chip) ---

export type PromptInputHeaderVariant = "banner" | "chip";

export type PromptInputHeaderProps = {
  readonly variant?: PromptInputHeaderVariant;
  /** Optional leading icon (reply arrow, document glyph, etc.) */
  readonly icon?: React.ReactNode;
  /** Called when the dismiss (×) control is pressed — banner only by default */
  readonly onDismiss?: () => void;
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly showDismiss?: boolean;
};

function PromptInputHeader({
  variant = "banner",
  icon,
  onDismiss,
  children,
  className,
  showDismiss,
}: PromptInputHeaderProps) {
  const dismissVisible = showDismiss ?? variant === "banner";

  return (
    <div
      data-slot="prompt-input-header"
      data-variant={variant}
      className={cn(
        "flex items-center gap-2 type-caption text-fg-secondary",
        variant === "banner" &&
          "w-full rounded-full bg-surface-muted px-3 py-2",
        variant === "chip" &&
          "w-fit rounded-lg border border-border-default bg-surface px-2.5 py-1.5",
        className
      )}
      onClick={(event) => event.stopPropagation()}
    >
      {icon ? (
        <span className="shrink-0 text-fg-tertiary [&_svg]:size-4">{icon}</span>
      ) : null}
      <span className="min-w-0 flex-1 truncate type-body-strong text-fg-primary">
        {children}
      </span>
      {dismissVisible && onDismiss ? (
        <button
          type="button"
          aria-label="Dismiss"
          className="shrink-0 rounded-sm text-fg-tertiary hover:text-fg-primary"
          onClick={onDismiss}
        >
          <DismissIcon />
        </button>
      ) : null}
    </div>
  );
}

function DismissIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

// --- Textarea ---

export type PromptInputTextareaProps = {
  readonly disableAutosize?: boolean;
} & React.ComponentProps<typeof Textarea>;

function PromptInputTextarea({
  className,
  onKeyDown,
  disableAutosize = false,
  ...props
}: PromptInputTextareaProps) {
  const {
    value,
    setValue,
    maxHeight,
    onSubmit,
    disabled,
    isLoading,
    textareaRef,
    variant,
  } = usePromptInput();

  useEffect(() => {
    if (disableAutosize || !textareaRef.current) return;

    const el = textareaRef.current;
    const rafId = requestAnimationFrame(() => {
      el.style.height = "auto";
      if (!value) {
        // Reset to one line when empty so compact stays slim
        el.style.height = "";
        return;
      }

      el.style.height =
        typeof maxHeight === "number"
          ? `${Math.min(el.scrollHeight, maxHeight)}px`
          : `min(${el.scrollHeight}px, ${maxHeight})`;
    });

    return () => cancelAnimationFrame(rafId);
  }, [value, maxHeight, disableAutosize, textareaRef]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (disabled || isLoading) {
        if (e.key === "Enter") {
          e.preventDefault();
        }
        return;
      }
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSubmit?.();
      }
      onKeyDown?.(e);
    },
    [disabled, isLoading, onSubmit, onKeyDown]
  );

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      className={cn(
        "w-full flex-1 resize-none border-none bg-transparent text-fg-primary shadow-none outline-none placeholder:text-fg-tertiary focus-visible:ring-0 focus-visible:ring-offset-0",
        variant === "compact"
          ? "min-h-8 type-body py-1"
          : "min-h-[48px] type-body",
        className
      )}
      rows={1}
      disabled={disabled}
      {...props}
    />
  );
}

// --- Actions / tools / submit ---

export type PromptInputActionsProps = React.HTMLAttributes<HTMLDivElement>;

function PromptInputActions({
  children,
  className,
  ...props
}: PromptInputActionsProps) {
  return (
    <div
      data-slot="prompt-input-actions"
      className={cn("flex items-center gap-2", className)}
      onClick={(event) => event.stopPropagation()}
      {...props}
    >
      {children}
    </div>
  );
}

/** Left-side tool chips row (Attach, Search, …) */
export type PromptInputToolsProps = React.HTMLAttributes<HTMLDivElement>;

function PromptInputTools({
  children,
  className,
  ...props
}: PromptInputToolsProps) {
  return (
    <div
      data-slot="prompt-input-tools"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export type PromptInputActionProps = {
  readonly className?: string;
  readonly tooltip: React.ReactNode;
  readonly children: React.ReactNode;
  readonly side?: "top" | "bottom" | "left" | "right";
} & React.ComponentProps<typeof Tooltip>;

function PromptInputAction({
  tooltip,
  children,
  className,
  side = "top",
  ...props
}: PromptInputActionProps) {
  const { disabled } = usePromptInput();

  return (
    <Tooltip {...props}>
      <TooltipTrigger
        asChild
        disabled={disabled}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} className={className}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

export type PromptInputSubmitProps = {
  /** icon = round send; pill = labeled send button */
  readonly variant?: "icon" | "pill";
  readonly children?: React.ReactNode;
  readonly label?: string;
  readonly className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">;

function PromptInputSubmit({
  variant = "icon",
  children,
  label = "Send",
  className,
  onClick,
  type = "button",
  ...props
}: PromptInputSubmitProps) {
  const { onSubmit, disabled, isLoading, value } = usePromptInput();
  const isEmpty = value.trim().length === 0;

  return (
    <button
      type={type}
      data-slot="prompt-input-submit"
      data-variant={variant}
      disabled={disabled || (!isLoading && isEmpty)}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-1.5 transition-colors disabled:pointer-events-none disabled:opacity-40",
        variant === "icon" &&
          "size-8 rounded-full bg-action-primary text-action-primary-fg hover:bg-action-primary-hover [&_svg]:size-4",
        variant === "pill" &&
          "h-8 rounded-full border border-transparent bg-action-primary px-3 type-caption-strong text-action-primary-fg hover:bg-action-primary-hover [&_svg]:size-4",
        className
      )}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(event);
        if (!event.defaultPrevented) {
          onSubmit?.();
        }
      }}
      {...props}
    >
      {children}
      {variant === "pill" ? <span>{label}</span> : null}
    </button>
  );
}

export {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputHeader,
  PromptInputLeading,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  PromptInputTrailing,
};

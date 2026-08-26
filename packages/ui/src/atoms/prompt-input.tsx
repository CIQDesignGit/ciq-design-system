
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

type PromptInputContextType = {
  isLoading: boolean;
  value: string;
  setValue: (value: string) => void;
  maxHeight: number | string;
  onSubmit?: () => void;
  disabled?: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
};

const PromptInputContext = createContext<PromptInputContextType>({
  isLoading: false,
  value: "",
  setValue: () => {},
  maxHeight: 240,
  onSubmit: undefined,
  disabled: false,
  textareaRef: React.createRef<HTMLTextAreaElement>(),
});

function usePromptInput() {
  const context = useContext(PromptInputContext);
  if (!context) {
    throw new Error("usePromptInput must be used within a PromptInput");
  }
  return context;
}

type PromptInputProps = {
  readonly isLoading?: boolean;
  readonly value?: string;
  readonly onValueChange?: (value: string) => void;
  readonly maxHeight?: number | string;
  readonly onSubmit?: () => void;
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly disabled?: boolean;
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
}: PromptInputProps) {
  const [internalValue, setInternalValue] = useState(value || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      textareaRef,
    }),
    [isLoading, resolvedValue, resolvedSetValue, maxHeight, onSubmit, disabled]
  );

  return (
    <TooltipProvider>
      <PromptInputContext.Provider value={contextValue}>
        <div
          className={cn(
            "bg-white cursor-text rounded-2xl border border-slate-200 p-2 shadow-sm",
            disabled && "pointer-events-none",
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

export type PromptInputTextareaProps = {
  readonly disableAutosize?: boolean;
} & React.ComponentProps<typeof Textarea>;

function PromptInputTextarea({
  className,
  onKeyDown,
  disableAutosize = false,
  ...props
}: PromptInputTextareaProps) {
  const { value, setValue, maxHeight, onSubmit, disabled, isLoading, textareaRef } =
    usePromptInput();

  useEffect(() => {
    if (disableAutosize || !textareaRef.current) return;

    const el = textareaRef.current;
    const rafId = requestAnimationFrame(() => {
      el.style.height = "auto";
      if (!value) return;

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
        "text-foreground min-h-[70px] w-full resize-none border-none bg-transparent shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
        className
      )}
      rows={1}
      disabled={disabled}
      {...props}
    />
  );
}

type PromptInputActionsProps = React.HTMLAttributes<HTMLDivElement>;

function PromptInputActions({ children, className, ...props }: PromptInputActionsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
}

type PromptInputActionProps = {
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
      <TooltipTrigger asChild disabled={disabled} onClick={(event) => event.stopPropagation()}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} className={className}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

export { PromptInput, PromptInputAction, PromptInputActions, PromptInputTextarea };

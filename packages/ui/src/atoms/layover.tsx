import * as React from "react";

import { cn } from "@/lib/utils";

export interface LayoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  position?: "center" | "right" | "left" | "bottom" | "top";
}

const positionClasses = {
  center: "items-center justify-center",
  right: "items-center justify-end",
  left: "items-center justify-start",
  bottom: "items-end justify-center",
  top: "items-start justify-center",
};

const panelMotion = {
  center: "animate-in fade-in-0 zoom-in-95",
  right: "animate-in slide-in-from-right",
  left: "animate-in slide-in-from-left",
  bottom: "animate-in slide-in-from-bottom",
  top: "animate-in slide-in-from-top",
};

const Layover = React.forwardRef<HTMLDivElement, LayoverProps>(
  (
    {
      open,
      onOpenChange,
      children,
      className,
      overlayClassName,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      position = "center",
    },
    ref
  ) => {
    React.useEffect(() => {
      if (!closeOnEscape) return;
      const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape" && open) onOpenChange(false);
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [open, onOpenChange, closeOnEscape]);

    React.useEffect(() => {
      document.body.style.overflow = open ? "hidden" : "unset";
      return () => {
        document.body.style.overflow = "unset";
      };
    }, [open]);

    if (!open) return null;

    return (
      <div
        className={cn(
          "fixed inset-0 z-[102] flex animate-in fade-in-0",
          positionClasses[position]
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/50 backdrop-blur-sm",
            overlayClassName
          )}
          aria-hidden="true"
          onClick={() => closeOnOverlayClick && onOpenChange(false)}
        />
        <div
          ref={ref}
          className={cn("relative z-50", panelMotion[position], className)}
          onClick={(event) => event.stopPropagation()}
        >
          {children}
        </div>
      </div>
    );
  }
);
Layover.displayName = "Layover";

export { Layover };

import { AlertTriangle, Check, Info, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { subscribeToToasts, type Toast } from "@/lib/toast";

const isFeedbackSuccessToast = (toast: Toast) =>
  toast.variant === "success" && toast.toastType === "feedback";

export function GlobalToaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function removeToast(id: string) {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }

  function createToastTimeoutHandler(id: string) {
    return () => {
      removeToast(id);
    };
  }

  useEffect(() => {
    const timeoutIds: ReturnType<typeof setTimeout>[] = [];
    const unsubscribe = subscribeToToasts((toast) => {
      setToasts((prev) => [...prev, toast]);
      const duration = toast.durationMs ?? 4000;
      const id = toast.id;
      const timeoutId = globalThis.setTimeout(createToastTimeoutHandler(id), duration);
      timeoutIds.push(timeoutId);
    });

    return () => {
      unsubscribe();
      timeoutIds.forEach((timeoutId) => {
        globalThis.clearTimeout(timeoutId);
      });
    };
  }, []);

  const getIcon = (variant: Toast["variant"]) => {
    switch (variant) {
      case "error":
        return XCircle;
      case "warning":
        return AlertTriangle;
      default:
        return Info;
    }
  };

  return (
    <div className="pointer-events-none fixed bottom-4 left-12 z-[105] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => {
        const StaticIcon = getIcon(toast.variant);
        const useFeedbackStyle = isFeedbackSuccessToast(toast);
        return (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto rounded-xl border shadow-lg p-4 text-sm flex items-start gap-2",
              toast.variant === "error" && "bg-red-50 border-red-200 text-gray-900",
              toast.variant === "success" &&
                (useFeedbackStyle
                  ? "bg-slate-50 border-slate-200 text-slate-900"
                  : "bg-green-50 border-green-200 text-gray-900"),
              toast.variant === "warning" && "bg-orange-50 border-orange-200 text-gray-900",
              (toast.variant === "default" || toast.variant == null) &&
                "bg-white border-slate-200 text-gray-900"
            )}
            role="status"
            aria-live="polite"
          >
            <div className="rounded-full">
              {toast.variant === "success" ? (
                <Check
                  className={cn(
                    "w-4 h-4 flex-shrink-0",
                    useFeedbackStyle ? "text-slate-600" : "text-green-600"
                  )}
                  strokeWidth={2}
                />
              ) : (
                <StaticIcon
                  className={cn(
                    "w-4 h-4",
                    toast.variant === "error" && "text-red-600",
                    toast.variant === "warning" && "text-orange-600",
                    (toast.variant === "default" || toast.variant == null) && "text-slate-500"
                  )}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              {toast.title ? <div className="font-medium">{toast.title}</div> : null}
              {toast.description ? (
                <div className="text-sm mt-1 opacity-80">{toast.description}</div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

import * as React from "react";

import { cn } from "@/lib/utils";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
}

const ToastContext = React.createContext<{
  toasts: Toast[];
  toast: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
} | null>(null);

function Toaster({ className }: { className?: string }) {
  const ctx = React.useContext(ToastContext);
  if (!ctx) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex flex-col gap-2",
        className
      )}
    >
      {ctx.toasts.map((item) => (
        <div
          key={item.id}
          className="rounded-lg border bg-card px-4 py-3 shadow-lg min-w-[240px]"
        >
          {item.title ? (
            <p className="text-sm font-medium">{item.title}</p>
          ) : null}
          {item.description ? (
            <p className="text-sm text-muted-foreground">{item.description}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = React.useCallback((next: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, ...next }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3000);
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
}

function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return ctx;
}

export { Toaster, ToastProvider, useToast };

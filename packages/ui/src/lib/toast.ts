import { getCryptoRandomValue } from "@/lib/get-crypto-random-value";

export type ToastVariant = "default" | "success" | "error" | "warning";

export type ToastType = "feedback";

export type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
  toastType?: ToastType;
};

type Listener = (toast: Toast) => void;
const listeners = new Set<Listener>();

export function subscribeToToasts(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function enqueueToast(partial: Omit<Toast, "id">) {
  const toast: Toast = {
    id: `${Date.now()}-${getCryptoRandomValue().toString(36)}`,
    durationMs: 4000,
    variant: "default",
    ...partial,
  };
  for (const listener of listeners) listener(toast);
  return toast.id;
}

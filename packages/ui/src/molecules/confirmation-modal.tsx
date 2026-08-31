import { X } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/atoms/button";
import { Checkbox } from "@/atoms/checkbox";
import { Label } from "@/atoms/label";
import { Layover } from "@/atoms/layover";

export interface ConfirmationModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
  readonly title: string;
  readonly message?: string | React.ReactNode;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly confirmVariant?: "default" | "destructive";
  readonly showDontShowAgain?: boolean;
  readonly dontShowAgainKey?: string;
  readonly children?: React.ReactNode;
  readonly width?: string;
  readonly isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "default",
  showDontShowAgain = false,
  dontShowAgainKey,
  children,
  width = "560px",
  isLoading = false,
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleConfirm = () => {
    // Host apps can skip this dialog next time via localStorage key
    if (showDontShowAgain && dontShowAgain && dontShowAgainKey) {
      localStorage.setItem(dontShowAgainKey, "true");
    }
    onConfirm();
  };

  const getConfirmButtonClassName = () => {
    if (confirmVariant === "destructive") {
      return "bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700";
    }
    return "bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700";
  };

  return (
    <Layover
      open={isOpen}
      onOpenChange={(open) => !isLoading && !open && onClose()}
      position="center"
      closeOnOverlayClick={!isLoading}
      overlayClassName="bg-black/60 backdrop-blur-none"
      data-testid="confirmation-modal-on-close-element"
    >
      <div className="rounded-lg bg-white shadow-lg flex flex-col gap-6 p-4" style={{ width }}>
        <div className="flex items-start justify-between flex-shrink-0">
          <span className="text-base max-w-[500px] font-semibold text-gray-900">{title}</span>
          <Button
            onClick={onClose}
            disabled={isLoading}
            variant="ghost"
            size="icon"
            className="rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 h-auto w-auto p-0"
            aria-label="Close"
            data-testid="confirmation-modal-close-btn"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {message && <div className="text-sm text-gray-600 whitespace-pre-line">{message}</div>}
          {children}
        </div>

        <div className="flex items-center justify-between flex-shrink-0">
          {showDontShowAgain && (
            <div className="flex cursor-pointer items-center gap-2">
              <Checkbox
                checked={dontShowAgain}
                onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
                id="dontShowAgain"
              />
              <Label className="text-sm text-slate-600 font-normal" htmlFor="dontShowAgain">
                Don't show this message again
              </Label>
            </div>
          )}
          {!showDontShowAgain && <div />}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium"
              data-testid="confirmation-modal-on-close-btn"
            >
              {cancelLabel}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              className={getConfirmButtonClassName()}
              data-testid="confirmation-modal-handle-confirm-btn"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                confirmLabel
              )}
            </Button>
          </div>
        </div>
      </div>
    </Layover>
  );
};

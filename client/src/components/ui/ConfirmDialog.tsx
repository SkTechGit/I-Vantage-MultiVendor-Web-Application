"use client";

import React, { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, AlertCircle, Info, Loader2 } from "lucide-react";
import clsx from "clsx";

export type ConfirmDialogVariant = "danger" | "warning" | "primary";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string | ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmDialogVariant;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

const variantStyles: Record<
  ConfirmDialogVariant,
  {
    iconContainer: string;
    icon: typeof AlertTriangle;
    confirmButton: string;
  }
> = {
  danger: {
    iconContainer: "bg-rose-50 text-rose-600 border-rose-200",
    icon: AlertTriangle,
    confirmButton: "bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500",
  },
  warning: {
    iconContainer: "bg-amber-50 text-amber-600 border-amber-200",
    icon: AlertCircle,
    confirmButton: "bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500",
  },
  primary: {
    iconContainer: "bg-blue-50 text-blue-600 border-blue-200",
    icon: Info,
    confirmButton: "bg-[#1E5BFF] hover:bg-blue-700 text-white focus:ring-blue-500",
  },
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const currentVariant = variantStyles[variant] || variantStyles.danger;
  const IconComponent = currentVariant.icon;

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && !loading) {
      onCancel();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150" />

        {/* Dialog Content Container */}
        <Dialog.Content
          aria-describedby="confirm-dialog-description"
          className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 outline-none animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-start gap-4">
            <div
              className={clsx(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border",
                currentVariant.iconContainer
              )}
            >
              <IconComponent className="h-5 w-5" aria-hidden="true" />
            </div>

            <div className="flex-1 min-w-0">
              <Dialog.Title className="text-base font-bold text-slate-900">
                {title}
              </Dialog.Title>
              <Dialog.Description asChild>
                <div
                  id="confirm-dialog-description"
                  className="mt-1.5 text-xs text-slate-600 leading-relaxed"
                >
                  {description}
                </div>
              </Dialog.Description>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-end gap-2.5">
            <button
              type="button"
              disabled={loading}
              onClick={onCancel}
              className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              {cancelLabel}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={onConfirm}
              className={clsx(
                "inline-flex items-center justify-center rounded-lg px-4 py-2 text-xs font-semibold shadow-xs transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-1",
                currentVariant.confirmButton
              )}
            >
              {loading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              {confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default ConfirmDialog;

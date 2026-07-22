import React from "react";
import { AlertTriangle, LogOut, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning";
  icon?: "delete" | "logout";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  variant = "danger",
  icon = "delete",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon + Title */}
        <div className="flex flex-col items-center text-center gap-3 pt-2">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              variant === "danger"
                ? "bg-red-50 text-red-500"
                : "bg-amber-50 text-amber-500"
            }`}
          >
            {icon === "logout" ? (
              <LogOut className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
          </div>

          <div className="space-y-1">
            <h3
              id="confirm-modal-title"
              className="text-base font-bold text-slate-800"
            >
              {title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer ${
              variant === "danger"
                ? "bg-red-500 hover:bg-red-600 shadow-sm shadow-red-200"
                : "bg-amber-500 hover:bg-amber-600 shadow-sm shadow-amber-200"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

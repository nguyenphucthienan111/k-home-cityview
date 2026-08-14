import React from "react";
import { Home, ShieldOff, ArrowLeft } from "lucide-react";

interface ForbiddenViewProps {
  onNavigate: (path: string) => void;
}

export default function ForbiddenView({ onNavigate }: ForbiddenViewProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-8">

        {/* Error code visual */}
        <div className="relative select-none">
          <span
            className="block text-[10rem] font-black leading-none text-slate-100"
            aria-hidden="true"
          >
            403
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl px-6 py-3 border border-orange-100">
              <span className="text-orange-500 font-bold text-2xl tracking-wide">
                Truy cập bị từ chối
              </span>
            </div>
          </div>
        </div>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
            <ShieldOff className="w-8 h-8 text-orange-400" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <p className="text-slate-600 text-lg">
            Bạn không có quyền truy cập trang này.
          </p>
          <p className="text-slate-400 text-sm">
            Nếu bạn cho rằng đây là nhầm lẫn, vui lòng liên hệ quản trị viên hoặc quay lại trang trước.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>

          <button
            onClick={() => onNavigate("/")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </button>
        </div>

        {/* Help */}
        <p className="text-xs text-slate-400">
          Cần hỗ trợ?{" "}
          <a
            href="tel:0937587438"
            className="text-amber-500 hover:text-amber-600 font-semibold transition-colors"
          >
            Gọi 0937 587 438
          </a>
        </p>
      </div>
    </div>
  );
}

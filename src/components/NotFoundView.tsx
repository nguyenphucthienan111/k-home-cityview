import React from "react";
import { Home, Search, Phone, ArrowLeft } from "lucide-react";

interface NotFoundViewProps {
  onNavigate: (path: string) => void;
}

export default function NotFoundView({ onNavigate }: NotFoundViewProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-8">

        {/* Error code visual */}
        <div className="relative select-none">
          <span
            className="block text-[10rem] font-black leading-none text-slate-100"
            aria-hidden="true"
          >
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl px-6 py-3 border border-slate-100">
              <span className="text-amber-500 font-bold text-2xl tracking-wide">
                Không tìm thấy trang
              </span>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <p className="text-slate-600 text-lg">
            Trang bạn đang tìm không tồn tại hoặc đã được di chuyển.
          </p>
          <p className="text-slate-400 text-sm">
            Đường dẫn có thể đã thay đổi. Hãy thử trở về trang chủ hoặc xem danh sách dự án.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => onNavigate("/")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </button>

          <button
            onClick={() => onNavigate("/san-pham")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            Xem dự án
          </button>
        </div>

        {/* Quick links */}
        <div className="border-t border-slate-100 pt-6 space-y-3">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Truy cập nhanh
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: "K-Home CityView", path: "/k-home-cityview-ho-nai" },
              { label: "K-Home Midtown",  path: "/k-home-midtown-trang-bom" },
              { label: "K-Home Avenue",   path: "/k-home-avenue-nhon-trach" },
              { label: "Tin tức",         path: "/tin-tuc" },
              { label: "Liên hệ",         path: "/lien-he" },
            ].map((link) => (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-amber-600 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 rounded-lg transition-all cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>
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

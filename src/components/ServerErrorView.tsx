import React from "react";
import { Home, RefreshCw, Phone } from "lucide-react";

interface ServerErrorViewProps {
  onNavigate: (path: string) => void;
  /** Mã lỗi HTTP, mặc định 500 */
  code?: number;
}

const ERROR_INFO: Record<number, { title: string; subtitle: string; description: string }> = {
  500: {
    title: "Lỗi máy chủ",
    subtitle: "500 — Internal Server Error",
    description:
      "Hệ thống gặp sự cố không mong muốn. Chúng tôi đang xử lý, vui lòng thử lại sau ít phút.",
  },
  503: {
    title: "Dịch vụ tạm ngưng",
    subtitle: "503 — Service Unavailable",
    description:
      "Hệ thống đang bảo trì hoặc quá tải. Vui lòng thử lại sau vài phút.",
  },
  502: {
    title: "Cổng kết nối lỗi",
    subtitle: "502 — Bad Gateway",
    description:
      "Máy chủ nhận phản hồi không hợp lệ từ dịch vụ phụ trợ. Vui lòng thử lại.",
  },
};

export default function ServerErrorView({ onNavigate, code = 500 }: ServerErrorViewProps) {
  const info = ERROR_INFO[code] ?? ERROR_INFO[500];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-8">

        {/* Error code visual */}
        <div className="relative select-none">
          <span
            className="block text-[10rem] font-black leading-none text-slate-100"
            aria-hidden="true"
          >
            {code}
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl px-6 py-3 border border-red-100">
              <span className="text-red-500 font-bold text-2xl tracking-wide">
                {info.title}
              </span>
            </div>
          </div>
        </div>

        {/* Subtitle & message */}
        <div className="space-y-3">
          <p className="text-slate-500 text-sm font-mono">{info.subtitle}</p>
          <p className="text-slate-600 text-lg">{info.description}</p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Thử lại
          </button>

          <button
            onClick={() => onNavigate("/")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </button>
        </div>

        {/* Status note */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Trong thời gian chờ
          </p>
          <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
            <li>Kiểm tra lại đường truyền internet của bạn</li>
            <li>Tải lại trang sau 1–2 phút</li>
            <li>Liên hệ hotline nếu sự cố kéo dài</li>
          </ul>
        </div>

        {/* Help */}
        <p className="text-xs text-slate-400">
          Cần hỗ trợ gấp?{" "}
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

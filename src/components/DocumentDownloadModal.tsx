import React, { useState } from "react";
import { X, Download, FileText, CheckCircle2, ShieldCheck, Send, ExternalLink, Sparkles } from "lucide-react";
import { trackDownloadDoc, trackLeadConversion } from "../utils/analytics";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultProject?: string;
}

export default function DocumentDownloadModal({ isOpen, onClose, defaultProject = "K-Home CityView Hố Nai" }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [project, setProject] = useState(defaultProject);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setErrorMsg("Vui lòng nhập số điện thoại (Zalo) để nhận tài liệu.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Khách tải bộ hồ sơ NOXH",
          phone: phone.trim(),
          projectSlug: "tai-lieu-noxh",
          projectName: project,
          message: `Tải trọn bộ Mẫu đơn NOXH 2026 (Mẫu 01, 02, 04) & Bảng giá dự án: ${project}.`,
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        trackDownloadDoc(`Bộ hồ sơ NOXH 2026 - ${project}`);
        trackLeadConversion("Download Document Modal", { project });
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || "Gửi yêu cầu không thành công. Vui lòng thử lại.");
      }
    } catch {
      setErrorMsg("Không thể kết nối đến máy chủ. Vui lòng liên hệ Hotline 0937 587 438.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white/90 hover:text-white transition cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Tài Liệu Pháp Lý Chuẩn 2026
          </div>
          <h3 className="text-xl sm:text-2xl font-bold leading-snug">
            Tải Trọn Bộ Biểu Mẫu NOXH &amp; Bảng Giá 2026
          </h3>
          <p className="text-xs sm:text-sm text-amber-100 mt-1.5 leading-relaxed">
            Mẫu 01 (Thu nhập), Mẫu 02 (Nhà ở), Mẫu 04 (Đơn mua) chuẩn Thông tư 05/2024/TT-BXD kèm bảng giá suất ưu đãi.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Đăng Ký Tải Tài Liệu Thành Công!</h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  Chuyên viên Kim Oanh Land đang gửi trọn bộ file Word/PDF mẫu đơn và bảng giá qua Zalo: <span className="font-bold text-slate-800">{phone}</span>.
                </p>
              </div>

              {/* Direct Download Options */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2.5">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tài liệu đính kèm sẵn sàng:</div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-100">
                    <span className="font-medium text-slate-800 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-600" />
                      Mẫu 01, 02, 04 NOXH (File Word)
                    </span>
                    <a 
                      href="https://zalo.me/0937587438" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-[11px] transition"
                    >
                      Nhận Qua Zalo
                    </a>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-100">
                    <span className="font-medium text-slate-800 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-600" />
                      Bảng Giá &amp; Chính Sách Vay 5,4%
                    </span>
                    <a 
                      href="https://zalo.me/0937587438" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition"
                    >
                      Chat Zalo Nhận
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <a 
                  href="https://zalo.me/0937587438" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Mở Zalo Chuyên Viên
                </a>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Highlight list */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Mẫu 01, 02, 04 chuẩn Bộ Xây dựng</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Bảng tính trả góp 5,4%/năm</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Quyết định giao đất &amp; 1/500</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Hướng dẫn nộp Sở Xây Dựng</span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên của bạn</label>
                <input 
                  type="text" 
                  placeholder="VD: Nguyễn Văn Nam"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl text-sm outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số điện thoại Zalo nhận tài liệu <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="tel" 
                  required
                  placeholder="VD: 0937 587 438"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl text-sm outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Dự án quan tâm nhận bảng giá</label>
                <select 
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl text-sm outline-none transition"
                >
                  <option value="K-Home CityView Hố Nai">K-Home CityView Hố Nai (Biên Hòa)</option>
                  <option value="K-Home Midtown Trảng Bom">K-Home Midtown (Trảng Bom)</option>
                  <option value="K-Home Avenue Nhơn Trạch">K-Home Avenue (Nhơn Trạch)</option>
                  <option value="K-Home SkyView Bàu Xéo">K-Home SkyView (Bàu Xéo)</option>
                  <option value="Tất cả dự án NOXH Đồng Nai">Trọn bộ tất cả dự án Đồng Nai</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Tải Về Trọn Bộ Tài Liệu Ngay
                  </>
                )}
              </button>

              <div className="text-[11px] text-slate-400 text-center">
                🔒 Cam kết bảo mật thông tin &bull; Miễn phí 100% từ Kim Oanh Land
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

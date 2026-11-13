import React, { useState } from "react";
import { X, CheckCircle, HelpCircle, ArrowRight, ArrowLeft, Send, Sparkles, AlertCircle, ShieldCheck } from "lucide-react";
import { trackQuizCompleted, trackLeadConversion } from "../utils/analytics";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultProject?: string;
}

export default function EligibilityQuizModal({ isOpen, onClose, defaultProject = "K-Home CityView Hố Nai" }: Props) {
  const [step, setStep] = useState(1);
  const [housing, setHousing] = useState<string>("");
  const [income, setIncome] = useState<string>("");
  const [residence, setResidence] = useState<string>("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [project, setProject] = useState(defaultProject);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const isEligible = housing !== "already_have" && income !== "higher";

  const handleNext = () => {
    if (step === 1 && !housing) return;
    if (step === 2 && !income) return;
    if (step === 3 && !residence) return;
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setErrorMsg("Vui lòng nhập số điện thoại để chuyên viên gửi kết quả xét duyệt.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const quizSummary = `[Trắc nghiệm NOXH]: Nhà ở=${housing}; Thu nhập=${income}; Cư trú=${residence}; Kết quả=${isEligible ? "ĐỦ ĐIỀU KIỆN 100%" : "CẦN TƯ VẤN HỖ TRỢ"}`;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Khách làm trắc nghiệm NOXH",
          phone: phone.trim(),
          projectSlug: "trac-nghiem-dieu-kien",
          projectName: project,
          message: `${quizSummary}. Yêu cầu gửi danh sách căn hộ phù hợp & hỗ trợ chuẩn bị hồ sơ nộp Sở Xây Dựng.`,
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        trackQuizCompleted(isEligible ? "Eligible" : "Need Advisory", quizSummary);
        trackLeadConversion("Eligibility Quiz", { isEligible, project });
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || "Gửi kết quả thất bại. Vui lòng thử lại.");
      }
    } catch {
      setErrorMsg("Không thể kết nối máy chủ. Vui lòng liên hệ Hotline 0937 587 438.");
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
        {/* Top Header */}
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
            Kiểm Tra Điều Kiện 30 Giây
          </div>
          <h3 className="text-xl sm:text-2xl font-bold leading-snug">
            Trắc Nghiệm Điều Kiện Mua NOXH 2026
          </h3>
          <p className="text-xs sm:text-sm text-amber-100 mt-1">
            Theo Luật Nhà ở mới 2023 &bull; Độc thân thu nhập &lt;25tr &bull; Vợ chồng &lt;50tr
          </p>

          {/* Progress bar */}
          <div className="mt-4 flex items-center gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  step >= i ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* STEP 1: Nhà ở */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                Câu hỏi 1 / 3: Về thực trạng nhà ở
              </div>
              <h4 className="text-base font-bold text-slate-900 leading-snug">
                Bạn hoặc vợ/chồng hiện đã có nhà ở đứng tên sổ đỏ tại tỉnh Đồng Nai chưa?
              </h4>

              <div className="space-y-2.5 pt-1">
                {[
                  { id: "none", label: "Chưa có nhà, chưa từng đứng tên sổ đỏ tại Đồng Nai", sub: "Đạt chuẩn điều kiện nhà ở của Luật Nhà ở 2023" },
                  { id: "renting", label: "Đang ở trọ / ở chung với người thân", sub: "Chưa có quyền sở hữu nhà ở riêng" },
                  { id: "already_have", label: "Đã có nhà ở đứng tên chính chủ tại Đồng Nai", sub: "Cần kiểm tra diện tích bình quân/người" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { setHousing(item.id); setStep(2); }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      housing === item.id 
                        ? "border-amber-500 bg-amber-50/70 shadow-xs" 
                        : "border-slate-200 hover:border-amber-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      housing === item.id ? "border-amber-600 bg-amber-600 text-white" : "border-slate-300"
                    }`}>
                      {housing === item.id && <span className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-800">{item.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Thu nhập */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                Câu hỏi 2 / 3: Về mức thu nhập
              </div>
              <h4 className="text-base font-bold text-slate-900 leading-snug">
                Mức thu nhập hàng tháng (thực nhận) của bạn hoặc gia đình thuộc nhóm nào?
              </h4>

              <div className="space-y-2.5 pt-1">
                {[
                  { id: "single_25", label: "Độc thân: Dưới 25 triệu đồng/tháng", sub: "Mức trần thu nhập theo quy định mới 2026" },
                  { id: "single_parent_35", label: "Đơn thân nuôi con: Dưới 35 triệu đồng/tháng", sub: "Ưu tiên đặc biệt cho phụ huynh đơn thân" },
                  { id: "married_50", label: "Cặp vợ chồng: Tổng thu nhập dưới 50 triệu/tháng", sub: "Áp dụng cộng gộp cả hai vợ chồng" },
                  { id: "higher", label: "Thu nhập cao hơn các mức trên", sub: "Chuyên viên sẽ hướng dẫn giải pháp kê khai hợp pháp" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { setIncome(item.id); setStep(3); }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      income === item.id 
                        ? "border-amber-500 bg-amber-50/70 shadow-xs" 
                        : "border-slate-200 hover:border-amber-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      income === item.id ? "border-amber-600 bg-amber-600 text-white" : "border-slate-300"
                    }`}>
                      {income === item.id && <span className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-800">{item.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.sub}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-2 flex justify-between">
                <button 
                  type="button" 
                  onClick={handleBack}
                  className="px-3.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Quay lại
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Cư trú & BHXH */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                Câu hỏi 3 / 3: Về nơi làm việc &amp; BHXH
              </div>
              <h4 className="text-base font-bold text-slate-900 leading-snug">
                Tình trạng làm việc và đóng bảo hiểm xã hội của bạn tại Đồng Nai?
              </h4>

              <div className="space-y-2.5 pt-1">
                {[
                  { id: "bhxh_12m", label: "Đang đóng BHXH từ 12 tháng trở lên tại Đồng Nai", sub: "Không cần hộ khẩu hay tạm trú KT3 (Luật mới 2023)" },
                  { id: "resident_dn", label: "Có hộ khẩu thường trú hoặc tạm trú tại Đồng Nai", sub: "Đủ điều kiện đăng ký mua ngay" },
                  { id: "free_work", label: "Làm việc tự do hoặc BHXH dưới 12 tháng", sub: "Chuyên viên sẽ hướng dẫn cách thức xác nhận đơn vị" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { setResidence(item.id); setStep(4); }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      residence === item.id 
                        ? "border-amber-500 bg-amber-50/70 shadow-xs" 
                        : "border-slate-200 hover:border-amber-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      residence === item.id ? "border-amber-600 bg-amber-600 text-white" : "border-slate-300"
                    }`}>
                      {residence === item.id && <span className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-800">{item.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.sub}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-2 flex justify-between">
                <button 
                  type="button" 
                  onClick={handleBack}
                  className="px-3.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Quay lại
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: KẾT QUẢ & FORM GỬI THÔNG TIN */}
          {step === 4 && (
            <div>
              {isSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle className="w-9 h-9" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Đã Lưu Hồ Sơ Đăng Ký Của Bạn!</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Chuyên viên Kim Oanh Land đang tổng hợp danh sách căn hộ đẹp nhất tại <b>{project}</b> và liên hệ bạn qua số <b>{phone}</b> trong 15 phút.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition"
                  >
                    Hoàn Tất
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Evaluation Box */}
                  <div className={`p-4 rounded-2xl border ${
                    isEligible 
                      ? "bg-emerald-50/80 border-emerald-200 text-emerald-900" 
                      : "bg-amber-50/80 border-amber-200 text-amber-900"
                  }`}>
                    <div className="flex items-center gap-2 font-bold text-sm">
                      {isEligible ? (
                        <>
                          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                          <span>CHÚC MỪNG! BẠN ĐẠT 100% ĐIỀU KIỆN MUA NOXH</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                          <span>HỒ SƠ CỦA BẠN CẦN CHUYÊN VIÊN HỖ TRỢ BỔ SUNG</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs mt-1.5 leading-relaxed opacity-90">
                      {isEligible 
                        ? "Bạn hoàn toàn đủ tiêu chuẩn nộp hồ sơ xét duyệt lên Sở Xây Dựng và được vay gói 5,4%/năm trong 25 năm từ Ngân hàng Chính sách Xã hội."
                        : "Một số tiêu chí cần văn bản xác nhận chuẩn từ cơ quan công tác để đảm bảo hồ sơ không bị từ chối khi chấm điểm."
                      }
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                      {errorMsg}
                    </div>
                  )}

                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Nhập thông tin để nhận danh sách căn hộ &amp; mẫu đơn:
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên của bạn</label>
                    <input 
                      type="text" 
                      placeholder="VD: Lê Thị Mai"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl text-sm outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Số điện thoại Zalo nhận kết quả <span className="text-rose-500">*</span>
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
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Dự án quan tâm</label>
                    <select 
                      value={project}
                      onChange={(e) => setProject(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl text-sm outline-none transition"
                    >
                      <option value="K-Home CityView Hố Nai">K-Home CityView Hố Nai (Biên Hòa)</option>
                      <option value="K-Home Midtown Trảng Bom">K-Home Midtown (Trảng Bom)</option>
                      <option value="K-Home Avenue Nhơn Trạch">K-Home Avenue (Nhơn Trạch)</option>
                      <option value="K-Home SkyView Bàu Xéo">K-Home SkyView (Bàu Xéo)</option>
                      <option value="Tất cả dự án NOXH Đồng Nai">Tất cả dự án Đồng Nai</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold text-sm tracking-wide shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Gửi Yêu Cầu Hỗ Trợ Hồ Sơ Miễn Phí
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <button 
                      type="button" 
                      onClick={handleBack}
                      className="hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Chọn lại câu hỏi
                    </button>
                    <span>🔒 Miễn phí 100%</span>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

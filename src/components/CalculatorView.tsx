import React, { useState, useEffect } from "react";
import { Calculator, Building2, ShieldCheck, HelpCircle, Phone, CheckCircle2, ChevronRight } from "lucide-react";
import MortgageCalculator from "./MortgageCalculator";

interface CalculatorViewProps {
  onNavigate?: (path: string) => void;
}

const PROJECTS_TAB = [
  {
    slug: "k-home-cityview-ho-nai",
    name: "K-Home CityView",
    location: "Hố Nai, Biên Hòa",
    priceRange: "950tr – 2,0 tỷ",
    supportLoan: "75%",
    rate: "5,4%/năm",
    badge: "Trung tâm Biên Hòa",
  },
  {
    slug: "k-home-midtown-trang-bom",
    name: "K-Home Midtown",
    location: "TT. Trảng Bom",
    priceRange: "750tr – 1,65 tỷ",
    supportLoan: "75%",
    rate: "5,4%/năm",
    badge: "4 Mặt Tiền Trảng Bom",
  },
  {
    slug: "k-home-avenue-nhon-trach",
    name: "K-Home Avenue",
    location: "Nhơn Trạch",
    priceRange: "750tr – 1,47 tỷ",
    supportLoan: "75%",
    rate: "5,4%/năm",
    badge: "Gần Sân Bay Long Thành",
  },
];

export default function CalculatorView({ onNavigate }: CalculatorViewProps) {
  // Đọc slug từ query param ?project=... nếu có, mặc định là k-home-cityview-ho-nai
  const [selectedSlug, setSelectedSlug] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const proj = params.get("project");
      if (proj && PROJECTS_TAB.some(p => p.slug === proj)) return proj;
    }
    return "k-home-cityview-ho-nai";
  });

  // Scroll to top khi load trang
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSelectProject = (slug: string) => {
    setSelectedSlug(slug);
    // Cập nhật URL query params mà không reload trang
    const newUrl = `/tinh-tra-gop?project=${slug}`;
    window.history.replaceState(null, "", newUrl);
  };

  const handleContactClick = () => {
    if (onNavigate) {
      onNavigate("/lien-he");
    } else {
      window.location.href = "/lien-he";
    }
  };

  const currentProject = PROJECTS_TAB.find(p => p.slug === selectedSlug) || PROJECTS_TAB[0];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* ── Breadcrumb & Hero Banner ── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white py-12 md:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_50%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs md:text-sm text-slate-300 mb-6" aria-label="Breadcrumb">
            <a 
              href="/" 
              onClick={(e) => { e.preventDefault(); onNavigate ? onNavigate("/") : window.location.href = "/"; }}
              className="hover:text-amber-400 transition-colors"
            >
              Trang chủ
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-amber-400 font-medium">Bảng Tính Trả Góp NOXH</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs md:text-sm font-semibold mb-4 backdrop-blur-md">
              <Calculator className="w-4 h-4" />
              Công Cụ Hoạch Định Tài Chính NOXH Chuẩn 2026
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Bảng Tính Trả Góp Mua Nhà Ở Xã Hội K-Home Đồng Nai
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              Tính toán chính xác số vốn ban đầu (chỉ từ 150 – 300 triệu), số tiền trả góp hàng tháng theo 
              <strong> dư nợ giảm dần</strong> với gói vay chính sách lãi suất <strong>5,4%/năm cố định 25 năm</strong> từ Ngân hàng CSXH.
            </p>
          </div>
        </div>
      </section>

      {/* ── Project Switcher Tabs ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 sm:p-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 pt-2 pb-1">
            Chọn Dự Án Cần Tính Toán Tài Chính:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 mt-1">
            {PROJECTS_TAB.map((proj) => {
              const isActive = proj.slug === selectedSlug;
              return (
                <button
                  key={proj.slug}
                  onClick={() => handleSelectProject(proj.slug)}
                  className={`relative text-left p-4 rounded-xl transition-all duration-300 cursor-pointer flex flex-col justify-between border ${
                    isActive
                      ? "bg-amber-50/80 border-amber-500 shadow-md ring-2 ring-amber-500/20"
                      : "bg-slate-50/70 border-slate-200 hover:bg-slate-100/80 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-1 ${
                        isActive ? "bg-amber-600 text-white" : "bg-slate-200 text-slate-700"
                      }`}>
                        {proj.badge}
                      </span>
                      <h2 className={`font-bold text-base sm:text-lg ${isActive ? "text-amber-900" : "text-slate-800"}`}>
                        {proj.name}
                      </h2>
                      <p className="text-xs text-slate-500">{proj.location}</p>
                    </div>
                    {isActive && (
                      <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-1" />
                    )}
                  </div>

                  <div className="border-t border-slate-200/60 pt-2.5 mt-1 flex items-center justify-between text-xs text-slate-600">
                    <div>
                      Giá: <span className="font-bold text-slate-800">{proj.priceRange}</span>
                    </div>
                    <div>
                      Vay: <span className="font-bold text-amber-700">{proj.supportLoan} ({proj.rate})</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Main Calculator Component ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">Dự án đang chọn:</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {currentProject.name} — {currentProject.location}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" /> Gói vay 5,4%/năm NHCSXH
              </span>
            </div>
          </div>

          {/* Calculator Tool Core */}
          <div className="p-4 sm:p-6 lg:p-8">
            <MortgageCalculator 
              key={selectedSlug} 
              slug={selectedSlug} 
              onContact={handleContactClick} 
            />
          </div>
        </div>
      </section>

      {/* ── Financial Guide & Policy Info ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick FAQ / Guide */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-amber-600" />
                Nguyên Tắc Tính Tiền Trả Góp NOXH Theo Dư Nợ Giảm Dần
              </h3>
              
              <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                <p>
                  Khác với các khoản vay thương mại thông thường với lãi suất thả nổi cao, các dự án <strong>K-Home Đồng Nai</strong> được áp dụng gói tín dụng ưu đãi từ <strong>Ngân hàng Chính sách Xã hội</strong> với lãi suất ưu đãi <strong>5,4%/năm</strong> cố định tối đa 25 năm.
                </p>
                
                <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200/50 space-y-2 text-slate-700">
                  <div className="font-bold text-amber-900">Công thức tính hàng tháng:</div>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                    <li><strong>Tiền gốc hàng tháng</strong> = Số tiền vay gốc / Thời gian vay (tối đa 300 tháng).</li>
                    <li><strong>Tiền lãi hàng tháng</strong> = (Số dư nợ gốc thực tế còn lại) × (5,4% / 12 tháng).</li>
                    <li><strong>Tổng thanh toán</strong> = Tiền gốc + Tiền lãi (Số tiền này sẽ <strong>giảm dần qua từng tháng</strong>).</li>
                  </ul>
                </div>

                <p>
                  <strong>Ví dụ thực tế:</strong> Bạn mua căn hộ 1 phòng ngủ giá <strong>950 triệu đồng</strong>, chỉ cần vốn tự có ban đầu 20% (190 triệu), vay ngân hàng 80% (760 triệu trong 25 năm):
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs sm:text-sm pl-2">
                  <li>Tiền gốc cố định mỗi tháng: ~2,53 triệu đồng/tháng.</li>
                  <li>Tiền lãi tháng đầu: ~3,42 triệu đồng.</li>
                  <li>Tổng trả tháng đầu cao nhất: ~5,95 triệu đồng và sau đó giảm dần mỗi tháng chỉ còn 3 – 4 triệu đồng.</li>
                </ul>
              </div>
            </div>

            {/* Điều kiện vay */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Điều Kiện Vay Vốn Mua Nhà Ở Xã Hội 2026
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <div className="font-bold text-slate-800">1. Điều kiện thu nhập:</div>
                  <p className="text-slate-600">
                    Người độc thân thu nhập thực nhận dưới 15 triệu/tháng. Vợ chồng đã kết hôn tổng thu nhập dưới 30 triệu/tháng.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <div className="font-bold text-slate-800">2. Điều kiện nhà ở:</div>
                  <p className="text-slate-600">
                    Chưa đứng tên sở hữu nhà/đất tại tỉnh Đồng Nai hoặc diện tích bình quân dưới 15m² sàn/người.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <div className="font-bold text-slate-800">3. Hạn mức vay tối đa:</div>
                  <p className="text-slate-600">
                    Hỗ trợ vay lên đến 75% – 80% giá trị căn hộ trên Hợp đồng Mua bán.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <div className="font-bold text-slate-800">4. Thời hạn vay vốn:</div>
                  <p className="text-slate-600">
                    Linh hoạt từ 5 đến 25 năm (300 tháng) tùy theo nguyện vọng và độ tuổi người vay.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Support Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-amber-600 to-orange-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                  <Phone className="w-6 h-6 text-yellow-300 animate-bounce" />
                </div>
                <h3 className="text-xl font-bold leading-snug">
                  Cần Tư Vấn Hồ Sơ & Thẩm Định Vay Miễn Phí?
                </h3>
                <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
                  Đội ngũ chuyên viên Kim Oanh Land sẽ hỗ trợ bạn kiểm tra điều kiện thu nhập, lập phương án vay tối ưu và chuẩn bị hồ sơ xét duyệt trúng 100%.
                </p>

                <div className="pt-2">
                  <a
                    href="tel:0937587438"
                    className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-white text-amber-800 font-extrabold text-sm sm:text-base hover:bg-yellow-50 shadow-lg transition-all"
                  >
                    <Phone className="w-4 h-4 fill-current" />
                    Hotline: 0937 587 438
                  </a>
                </div>

                <p className="text-center text-xs text-amber-200">
                  Hỗ trợ Zalo & Điện thoại 24/7
                </p>
              </div>
            </div>

            {/* Quick Links to Projects */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-3">
              <h4 className="font-bold text-slate-800 text-sm">Xem Thông Tin Chi Tiết Dự Án:</h4>
              <div className="space-y-2 text-xs sm:text-sm">
                <a
                  href="/k-home-cityview-ho-nai"
                  onClick={(e) => { e.preventDefault(); onNavigate ? onNavigate("/k-home-cityview-ho-nai") : window.location.href = "/k-home-cityview-ho-nai"; }}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-amber-50 hover:text-amber-700 text-slate-700 transition-colors group"
                >
                  <span className="font-semibold">K-Home CityView Hố Nai</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="/k-home-midtown-trang-bom"
                  onClick={(e) => { e.preventDefault(); onNavigate ? onNavigate("/k-home-midtown-trang-bom") : window.location.href = "/k-home-midtown-trang-bom"; }}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-amber-50 hover:text-amber-700 text-slate-700 transition-colors group"
                >
                  <span className="font-semibold">K-Home Midtown Trảng Bom</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="/k-home-avenue-nhon-trach"
                  onClick={(e) => { e.preventDefault(); onNavigate ? onNavigate("/k-home-avenue-nhon-trach") : window.location.href = "/k-home-avenue-nhon-trach"; }}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-amber-50 hover:text-amber-700 text-slate-700 transition-colors group"
                >
                  <span className="font-semibold">K-Home Avenue Nhơn Trạch</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

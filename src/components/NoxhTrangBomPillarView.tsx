import React, { useState, useEffect } from "react";
import { 
  Building2, MapPin, CheckCircle, ChevronRight, Phone, ShieldCheck, 
  HelpCircle, Star, Award, TrendingUp, Users, ArrowRight, FileText, 
  DollarSign, Calculator, Send, Check, AlertTriangle, Sparkles,
  Info, Compass, ShieldAlert, CheckSquare, Clock, Download
} from "lucide-react";

interface Props {
  onNavigate: (path: string) => void;
}

export default function NoxhTrangBomPillarView({ onNavigate }: Props) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", project: "K-Home Midtown Trảng Bom", note: "" });

  useEffect(() => {
    document.title = "Nhà Ở Xã Hội Trảng Bom 2026: Tổng Hợp Dự Án, Bảng Giá & Hướng Dẫn Mua A-Z";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone) return;
    setFormSubmitted(true);
  };

  return (
    <article className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      {/* ── Breadcrumb ── */}
      <nav aria-label="Breadcrumb" className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center text-sm text-slate-500">
          <button onClick={() => onNavigate("/")} className="cursor-pointer hover:text-amber-600 transition">Trang chủ</button>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
          <span className="text-slate-900 font-medium truncate">Nhà ở xã hội Trảng Bom 2026</span>
        </div>
      </nav>

      {/* ── Header / Hero Banner (Light / Bright Premium Real Estate Editorial Style) ── */}
      <header className="relative bg-[#FAF9F6] text-[#172033] overflow-hidden border-b border-slate-200/80">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://res.cloudinary.com/dthv0nsq/image/upload/v1785230298/k-home-midtown/Du-an-K-Home-Midtown-3d-birdview-toan-canh-dem-2048x1150.jpg"
            alt="Toàn cảnh đô thị nhà ở xã hội Trảng Bom 2026"
            className="w-full h-full object-cover object-right filter brightness-95 contrast-105"
            loading="eager"
          />
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(90deg, 
                #FFFFFF 0%, 
                rgba(255, 255, 255, 0.96) 35%, 
                rgba(255, 255, 255, 0.72) 60%, 
                rgba(255, 255, 255, 0.20) 100%)`
            }}
          />
          <div className="absolute top-1/2 right-12 -translate-y-1/2 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Content Container (55% left / 45% right) */}
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column (55% ~ lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFF7E6] text-amber-800 border border-[#F5B942] rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  BÁO CÁO THỊ TRƯỜNG NOXH TRẢNG BOM • 2026
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold tracking-tight text-[#172033] leading-[1.12]">
                Nhà Ở Xã Hội <br />
                <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                  Trảng Bom 2026
                </span>
              </h1>

              <p className="text-lg md:text-xl font-semibold text-slate-700 leading-snug">
                Tổng hợp dự án trung tâm & KCN Bàu Xéo, bảng giá & hướng dẫn mua A–Z
              </p>

              <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-xl font-normal">
                Đánh giá chi tiết 2 dự án trọng điểm K-Home Midtown (13,97 ha) và K-Home SkyView Bàu Xéo, cập nhật giá bán từ 750 triệu và chính sách vay 5,4%/năm.
              </p>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-5 pt-1 text-xs md:text-sm text-slate-700">
                <span className="inline-flex items-center gap-2 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  02 dự án trọng điểm Kim Oanh
                </span>
                <span className="inline-flex items-center gap-2 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  Giá chỉ từ 750 triệu/căn*
                </span>
                <span className="inline-flex items-center gap-2 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
                  Lãi suất ưu đãi từ 5,4%/năm*
                </span>
              </div>

              <div className="text-xs text-slate-400 pt-0.5 flex items-center gap-1.5 font-light">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Cập nhật lần cuối: <strong className="font-medium text-slate-500">11/10/2026</strong></span>
              </div>
            </div>

            {/* Right Column (45% ~ lg:col-span-5): Light Glass Premium Report Card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div 
                className="w-full max-w-md rounded-[20px] p-5 sm:p-6 relative overflow-hidden"
                style={{
                  background: "rgba(255, 255, 255, 0.82)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(245, 158, 11, 0.35)",
                  boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)"
                }}
              >
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/60 mb-4">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-600" /> NOXH TRẢNG BOM REPORT
                  </span>
                  <span className="text-[11px] font-mono font-bold bg-amber-100/80 text-amber-900 px-2.5 py-0.5 rounded-md border border-amber-300/60">
                    10/2026
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-center mb-4">
                  <div className="bg-white/90 p-3 rounded-xl border border-amber-100/90 shadow-2xs flex flex-col justify-center">
                    <div className="text-2xl md:text-3xl font-extrabold text-amber-600 font-tech leading-none">900+</div>
                    <div className="text-[11px] text-slate-600 font-medium mt-1.5 leading-tight">Căn hộ NOXH</div>
                  </div>
                  <div className="bg-white/90 p-3 rounded-xl border border-emerald-100/90 shadow-2xs flex flex-col justify-center">
                    <div className="text-2xl md:text-3xl font-extrabold text-emerald-600 font-tech leading-none">750Tr</div>
                    <div className="text-[11px] text-slate-600 font-medium mt-1.5 leading-tight">Giá khởi điểm</div>
                  </div>
                  <div className="bg-white/90 p-3 rounded-xl border border-sky-100/90 shadow-2xs flex flex-col justify-center">
                    <div className="text-2xl md:text-3xl font-extrabold text-sky-600 font-tech leading-none">5,4%</div>
                    <div className="text-[11px] text-slate-600 font-medium mt-1.5 leading-tight">Lãi suất cố định</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Tâm điểm công nghiệp</span>
                    <span className="font-bold text-slate-800">KCN Bàu Xéo • Sông Mây</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Thời gian đọc</span>
                    <span className="font-bold text-slate-800">~15 phút</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Thanh credibility */}
        <div className="bg-white border-t border-slate-200/70 py-3.5 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <span className="font-bold text-slate-900">5.0</span>
              <span className="text-slate-500">(168 lượt đánh giá)</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-slate-500">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Dữ liệu thị trường: <strong>Quý 4/2026</strong>
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Pháp lý: <strong>Quy hoạch chi tiết 1/500 & Sổ hồng lâu dài</strong>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Core Pillar Article */}
        <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          
          {/* Mục lục nội dung */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-5 mb-8">
            <h2 className="text-lg font-bold text-amber-950 flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-amber-600" />
              Mục lục nội dung cẩm nang NOXH Trảng Bom 2026
            </h2>
            <nav className="space-y-2 text-sm">
              <a href="#tiem-nang-thi-truong-noxh-trang-bom" className="block text-slate-700 hover:text-amber-700 hover:underline">
                1. Nhu cầu an cư thực bùng nổ tại Trảng Bom – Đô thị công nghiệp vệ tinh của Đồng Nai
              </a>
              <a href="#danh-sach-du-an-noxh-trang-bom" className="block text-slate-700 hover:text-amber-700 hover:underline">
                2. Tổng hợp 2 dự án nhà ở xã hội quy mô lớn nhất Trảng Bom năm 2026
              </a>
              <a href="#tieu-diem-k-home-midtown-va-skyview" className="block text-slate-700 hover:text-amber-700 hover:underline font-semibold text-amber-800">
                ➔ Tiêu điểm: K-Home Midtown (13,97 ha trung tâm) & K-Home SkyView Bàu Xéo
              </a>
              <a href="#so-sanh-mua-nha-vs-thue-tro-trang-bom" className="block text-slate-700 hover:text-amber-700 hover:underline">
                3. Bảng so sánh tài chính: Mua nhà trả góp 3,5 tr/tháng vs Thuê trọ 25 năm tại Trảng Bom
              </a>
              <a href="#dieu-kien-mua-noxh-trang-bom-2026" className="block text-slate-700 hover:text-amber-700 hover:underline">
                4. Điều kiện mua nhà ở xã hội Trảng Bom 2026 (Xóa bỏ hoàn toàn hộ khẩu/KT3)
              </a>
              <a href="#quy-trinh-6-buoc-mua-noxh-trang-bom" className="block text-slate-700 hover:text-amber-700 hover:underline font-semibold text-emerald-800">
                5. Quy trình 6 bước mua nhà ở xã hội Trảng Bom chuẩn pháp lý 2026
              </a>
              <a href="#ho-so-thu-tuc-mua-noxh-trang-bom" className="block text-slate-700 hover:text-amber-700 hover:underline">
                6. Hướng dẫn chuẩn bị bộ hồ sơ pháp lý Mẫu 01, 02, 04, VNeID & BHXH
              </a>
              <a href="#bang-gia-va-chinh-sach-vay-trang-bom" className="block text-slate-700 hover:text-amber-700 hover:underline">
                7. Bảng giá các loại căn hộ Studio, 1PN, 2PN & Phương thức thanh toán vốn tự có 25%
              </a>
              <a href="#canh-bao-chieu-tro-lua-dao-trang-bom" className="block text-slate-700 hover:text-amber-700 hover:underline font-semibold text-rose-700">
                8. Cảnh báo các chiêu trò lừa đảo mua bán đất sổ chung, suất ngoại giao trái luật
              </a>
              <a href="#cau-hoi-thuong-gap-faq-trang-bom" className="block text-slate-700 hover:text-amber-700 hover:underline">
                9. Giải đáp thắc mắc thường gặp khi mua nhà ở xã hội Trảng Bom (FAQ)
              </a>
            </nav>
          </div>

          {/* ── SECTION 1: TIỀM NĂNG THỊ TRƯỜNG ── */}
          <section id="tiem-nang-thi-truong-noxh-trang-bom" className="mb-10 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white text-sm font-bold">1</span>
              Nhu cầu an cư thực bùng nổ tại Trảng Bom 2026
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Huyện Trảng Bom là đô thị công nghiệp cửa ngõ phía Đông của TP. Biên Hòa, sở hữu dân số đông thứ 2 toàn tỉnh Đồng Nai với hơn <strong>370.000 dân</strong>. Địa phương này tập trung 4 khu công nghiệp trọng điểm quy mô lớn: <strong>KCN Bàu Xéo (gần 500 ha), KCN Sông Mây (473 ha), KCN Hố Nai và KCN Giang Điền</strong>, thu hút hơn <strong>120.000 công nhân, chuyên gia và kỹ sư</strong> sinh sống, làm việc.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Với mục tiêu chuyển đổi Trảng Bom lên Thị xã vào năm 2025–2030, quỹ đất và hạ tầng giao thông dọc trục Quốc lộ 1A, đường 30/4, Hùng Vương và tuyến đường Vành Đai 4 đang được đầu tư mở rộng thần tốc. Tuy nhiên, phần lớn công nhân tại Trảng Bom vẫn đang phải sinh sống trong các dãy phòng trọ chật hẹp, thiếu thốn tiện ích sống.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-4 text-center">
              <div>
                <div className="text-xl md:text-2xl font-extrabold text-amber-600">370.000+</div>
                <div className="text-xs text-slate-500 font-medium">Dân số huyện Trảng Bom</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-extrabold text-emerald-600">4 KCN Lớn</div>
                <div className="text-xs text-slate-500 font-medium">Bàu Xéo, Sông Mây, Hố Nai</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-extrabold text-sky-600">120.000+</div>
                <div className="text-xs text-slate-500 font-medium">Lao động công nghiệp</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-extrabold text-indigo-600">Từ 750 Tr</div>
                <div className="text-xs text-slate-500 font-medium">Giá căn hộ NOXH Singapore</div>
              </div>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Các dự án <strong>nhà ở xã hội Trảng Bom</strong> chuẩn Singapore do Kim Oanh Land đầu tư chính là lời giải trọn vẹn cho bài toán biến ước mơ an cư của người lao động thành hiện thực với số vốn tự có ban đầu chỉ từ <strong>150 triệu đồng</strong>.
            </p>
          </section>

          {/* ── SECTION 2: TỔNG HỢP 2 DỰ ÁN TRỌNG ĐIỂM ── */}
          <section id="danh-sach-du-an-noxh-trang-bom" className="mb-10 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white text-sm font-bold">2</span>
              Tổng hợp 2 dự án nhà ở xã hội quy mô lớn nhất Trảng Bom
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Tại Trảng Bom hiện nay, Kim Oanh Land là đơn vị tiên phong phát triển 2 dự án nhà ở xã hội kiểu mẫu chuẩn quốc tế:
            </p>

            <div className="space-y-4 mb-6">
              {/* Dự án 1: K-Home Midtown */}
              <div className="p-4 rounded-xl border-2 border-amber-500 bg-amber-50/40 relative">
                <span className="absolute -top-3 right-4 bg-amber-600 text-white text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Đại Đô Thị Trung Tâm 13,97 Ha
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  1. K-Home Midtown Trảng Bom (Kim Oanh Land)
                </h3>
                <p className="text-sm text-slate-600 mb-2">
                  📍 <strong>Vị trí:</strong> Giao lộ 4 tuyến đường 30/4 – Hùng Vương – Lý Nam Đế – Lê Đại Hành, TT. Trảng Bom
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-700 mb-3 bg-white p-2.5 rounded-lg border border-amber-200">
                  <div><strong>Quy mô:</strong> 13,97 ha (542 căn NOXH)</div>
                  <div><strong>Loại căn:</strong> Studio, 1PN+, 2PN</div>
                  <div><strong>Giá bán:</strong> Từ 750 Triệu – 1,5 Tỷ</div>
                  <div><strong>Tiêu chuẩn:</strong> Xanh EDGE (Singapore)</div>
                </div>
                <p className="text-sm text-slate-700 mb-3">
                  Tọa lạc tại "trái tim" thị trấn Trảng Bom, dự án sở hữu công viên trung tâm, hồ bơi ngoài trời, shophouse thương mại, trường mầm non và hệ thống an ninh 24/7.
                </p>
                <button 
                  onClick={() => onNavigate("/k-home-midtown-trang-bom")}
                  className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition"
                >
                  Xem chi tiết bảng giá & mặt bằng K-Home Midtown <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Dự án 2: K-Home SkyView Bàu Xéo */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  2. K-Home SkyView Bàu Xéo (Kim Oanh Land)
                </h3>
                <p className="text-sm text-slate-600 mb-2">
                  📍 <strong>Vị trí:</strong> Khu đô thị Bàu Xéo, Quốc Lộ 1A, TT. Trảng Bom, Tỉnh Đồng Nai
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-700 mb-3 bg-slate-50 p-2.5 rounded-lg">
                  <div><strong>Quy mô:</strong> 1,08 ha (Tháp 9 – 12 tầng)</div>
                  <div><strong>Số căn:</strong> 358 căn hộ NOXH</div>
                  <div><strong>Giá bán:</strong> Từ 750 Triệu – 1,45 Tỷ</div>
                  <div><strong>Vị trí:</strong> Sát cạnh KCN Bàu Xéo 500ha</div>
                </div>
                <p className="text-sm text-slate-700 mb-3">
                  Dự án căn hộ nằm ngay trong Khu đô thị Bàu Xéo hiện hữu, cách KCN Bàu Xéo chỉ vài trăm mét, cực kỳ thuận tiện cho công nhân và chuyên gia đi bộ đi làm.
                </p>
                <button 
                  onClick={() => onNavigate("/k-home-skyview-trang-bom")}
                  className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-amber-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
                >
                  Xem chi tiết dự án K-Home SkyView Bàu Xéo <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>

          {/* ── SECTION 3: TIÊU ĐIỂM CHI TIẾT ── */}
          <section id="tieu-diem-k-home-midtown-va-skyview" className="mb-10 scroll-mt-20 bg-gradient-to-br from-amber-50 to-orange-50/50 p-6 rounded-2xl border border-amber-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-600" />
              Tiêu điểm: Kiến trúc Singapore & Không gian sống chuẩn EDGE
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Cả 2 dự án NOXH của Kim Oanh Land tại Trảng Bom đều được quy hoạch bài bản bởi các đơn vị tư vấn hàng đầu, mang lại không gian sống vượt trội so với các dự án nhà ở xã hội thông thường:
            </p>

            <div className="mb-4 overflow-hidden rounded-xl border border-amber-200 shadow-sm">
              <img 
                src="https://res.cloudinary.com/dthv0nsq/image/upload/v1785230298/k-home-midtown/Du-an-K-Home-Midtown-3d-birdview-toan-canh-dem-2048x1150.jpg" 
                alt="Phối cảnh quy hoạch đại đô thị K-Home Midtown Trảng Bom" 
                className="w-full h-64 md:h-80 object-cover"
                loading="lazy"
              />
              <div className="bg-slate-900/80 text-white text-xs px-3 py-1.5 text-center">
                Đại đô thị K-Home Midtown 13,97 ha tọa lạc giữa 4 mặt tiền trung tâm huyện Trảng Bom
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="bg-white p-3.5 rounded-xl border border-amber-100 flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Thiết kế thông minh đón gió:</strong> 100% căn hộ đều có lô gia và cửa sổ đón gió tự nhiên, tối ưu từng m² công năng.
                </div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-amber-100 flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Tiết kiệm chi phí sinh hoạt:</strong> Tiêu chuẩn công trình xanh EDGE giúp giảm 20% chi phí hóa đơn điện, nước sinh hoạt.
                </div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-amber-100 flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Bàn giao hoàn thiện full nội thất:</strong> Tủ bếp, thiết bị vệ sinh, sàn gỗ phòng ngủ, hệ thống chiếu sáng chuẩn mực.
                </div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-amber-100 flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Gói vay 5,4%/năm trong 25 năm:</strong> Mức trả góp hàng tháng chỉ từ 3,0 – 4,5 triệu đồng, tương đương tiền thuê trọ.
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 4: BẢNG SO SÁNH TÀI CHÍNH ── */}
          <section id="so-sanh-mua-nha-vs-thue-tro-trang-bom" className="mb-10 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white text-sm font-bold">3</span>
              Bảng so sánh tài chính: Mua NOXH Trảng Bom vs Thuê trọ 25 năm
            </h2>
            <div className="overflow-x-auto rounded-xl border border-slate-200 mb-4">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3 w-1/3">Hạng mục so sánh</th>
                    <th className="p-3 text-emerald-800 bg-emerald-50/70">Mua NOXH K-Home Midtown (Vay 5,4%)</th>
                    <th className="p-3 text-rose-800 bg-rose-50/70">Tiếp tục thuê trọ tại Trảng Bom</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="p-3 font-semibold">Chi phí hàng tháng</td>
                    <td className="p-3 text-emerald-700 font-bold">Trả góp ~3,0 – 4,2 triệu/tháng</td>
                    <td className="p-3 text-rose-700">Thuê trọ ~2,5 – 3,5 triệu/tháng (tăng theo năm)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Tích lũy sau 25 năm</td>
                    <td className="p-3 text-emerald-700 font-bold">Sở hữu căn hộ có sổ hồng trị giá 1,5 – 2,5 tỷ</td>
                    <td className="p-3 text-rose-700">Mất trắng ~1,1 tỷ tiền thuê nhà mà không có tài sản</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Chất lượng môi trường</td>
                    <td className="p-3">Hồ bơi, sân chơi trẻ em, bảo vệ 24/7, cộng đồng văn minh</td>
                    <td className="p-3">Chật chội, tiếng ồn, an ninh trật tự phức tạp</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Tương lai con cái</td>
                    <td className="p-3">Không gian phát triển toàn diện, có khu vui chơi an toàn</td>
                    <td className="p-3">Thiếu không gian học tập và vui chơi cho trẻ nhỏ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ── SECTION 5: ĐIỀU KIỆN MUA NOXH TRẢNG BOM ── */}
          <section id="dieu-kien-mua-noxh-trang-bom-2026" className="mb-10 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white text-sm font-bold">4</span>
              Điều kiện mua nhà ở xã hội Trảng Bom 2026 (Xóa bỏ hộ khẩu/KT3)
            </h2>
            <div className="space-y-3 mb-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  1. Điều kiện thu nhập xét duyệt mới nhất
                </h4>
                <div className="text-sm text-slate-700 space-y-1">
                  <p>• <strong>Người độc thân:</strong> Thu nhập thực nhận dưới <strong>25 triệu đồng/tháng</strong>.</p>
                  <p>• <strong>Người độc thân nuôi con nhỏ:</strong> Thu nhập thực nhận dưới <strong>35 triệu đồng/tháng</strong>.</p>
                  <p>• <strong>Cặp vợ chồng:</strong> Tổng thu nhập 2 vợ chồng dưới <strong>50 triệu đồng/tháng</strong>.</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  2. Điều kiện nhà ở
                </h4>
                <p className="text-sm text-slate-700">
                  Chưa sở hữu nhà ở hoặc đất ở tại địa bàn tỉnh Đồng Nai (hoặc có nhà nhưng diện tích bình quân dưới 15m² sàn/người).
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                  3. Không cần sổ hộ khẩu thường trú hoặc tạm trú KT3
                </h4>
                <p className="text-sm text-slate-700">
                  Chỉ cần người lao động đang làm việc và có tham gia Bảo hiểm Xã hội (BHXH) từ 12 tháng trở lên tại Đồng Nai đều được nộp hồ sơ xét duyệt bình đẳng.
                </p>
              </div>
            </div>
          </section>

          {/* ── SECTION 6: QUY TRÌNH 6 BƯỚC MUA NOXH TRẢNG BOM ── */}
          <section id="quy-trinh-6-buoc-mua-noxh-trang-bom" className="mb-10 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-600 text-white text-sm font-bold">5</span>
              Quy trình 6 bước mua nhà ở xã hội Trảng Bom chuẩn pháp lý 2026
            </h2>

            <div className="space-y-3.5 mb-6">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center shrink-0 text-sm">1</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Bước 1: Tư vấn điều kiện & Hướng dẫn điền bộ hồ sơ</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Khách hàng liên hệ văn phòng Kim Oanh Land để được chuyên viên hướng dẫn hoàn thiện hồ sơ theo đúng Mẫu 01, Mẫu 02, Mẫu 04 theo quy định mới.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center shrink-0 text-sm">2</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Bước 2: Nộp hồ sơ xét duyệt & Thẩm định tại Sở Xây dựng</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Chủ đầu tư tiếp nhận hồ sơ, lập danh sách người mua gửi về Sở Xây dựng tỉnh Đồng Nai để thẩm định hậu kiểm chéo.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center shrink-0 text-sm">3</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Bước 3: Công bố kết quả xét duyệt & Đặt cọc chọn căn (30 triệu)</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Sau khi danh sách được phê duyệt, khách hàng chọn căn hộ ưng ý và ký Phiếu xác nhận đặt cọc (30.000.000 VNĐ) để khóa căn.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center shrink-0 text-sm">4</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Bước 4: Ký hợp đồng & Đóng vốn tự có 20 – 25% (chia 3 đợt trong 2 tháng)</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Khách hàng thanh toán Đợt 1 (15% đã bao gồm tiền cọc) để ký hợp đồng, sau đó thanh toán tiếp Đợt 2 (5% sau 30 ngày) và Đợt 3 (5% sau 30 ngày tiếp theo).
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center shrink-0 text-sm">5</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Bước 5: Thẩm định giải ngân gói vay ngân hàng chính sách 5,4%/năm</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Ngân hàng Chính sách Xã hội hoặc các Ngân hàng liên kết giải ngân trực tiếp cho Chủ đầu tư theo tiến độ xây dựng.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-extrabold flex items-center justify-center shrink-0 text-sm">6</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Bước 6: Nghiệm thu bàn giao căn hộ hoàn thiện & Cấp sổ hồng lâu dài</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Khách hàng nhận bàn giao nhà thực tế và chủ đầu tư hoàn tất thủ tục cấp sổ hồng sở hữu lâu dài theo quy định pháp luật.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 7: HƯỚNG DẪN BIỂU MẪU HỒ SƠ ── */}
          <section id="ho-so-thu-tuc-mua-noxh-trang-bom" className="mb-10 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white text-sm font-bold">6</span>
              Hướng dẫn hồ sơ & biểu mẫu chuẩn Mẫu 01, 02, 04, VNeID & VssID
            </h2>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-4">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Biểu mẫu / Giấy tờ</th>
                    <th className="p-3">Mục đích xác thực</th>
                    <th className="p-3">Nơi xin xác nhận</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="p-3 font-semibold">Mẫu 01 (Đơn đăng ký mua)</td>
                    <td className="p-3">Khai báo thông tin cá nhân & căn hộ muốn mua</td>
                    <td className="p-3">Tải mẫu tại văn phòng chủ đầu tư</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Mẫu 02 (Thực trạng nhà ở)</td>
                    <td className="p-3">Xác nhận chưa sở hữu nhà đất tại Đồng Nai</td>
                    <td className="p-3">UBND xã/phường nơi tạm trú hoặc thường trú</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Mẫu 04 (Xác nhận thu nhập)</td>
                    <td className="p-3">Xác nhận thu nhập (Độc thân &lt; 25tr, Nuôi con &lt; 35tr, Vợ chồng &lt; 50tr)</td>
                    <td className="p-3">Doanh nghiệp / Đơn vị đang làm việc</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Trích lục BHXH (VssID)</td>
                    <td className="p-3">Chứng minh làm việc & đóng bảo hiểm ≥ 12 tháng</td>
                    <td className="p-3">Xuất file từ App VssID hoặc cơ quan BHXH</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ── SECTION 8: BẢNG GIÁ & LÃI SUẤT ── */}
          <section id="bang-gia-va-chinh-sach-vay-trang-bom" className="mb-10 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white text-sm font-bold">7</span>
              Bảng giá căn hộ K-Home Midtown Trảng Bom & Dòng tiền trả góp
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-center">
                <div className="text-xs text-slate-500 font-bold uppercase mb-1">Căn Studio (36,1m²)</div>
                <div className="text-lg font-extrabold text-amber-700">Giá: ~750 Triệu</div>
                <div className="text-xs text-slate-600 mt-2">Vốn 20%: <strong>~150 Triệu</strong></div>
                <div className="text-xs text-emerald-700 font-bold mt-1">Góp: ~2,8 – 3,2 tr/tháng</div>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-center">
                <div className="text-xs text-slate-500 font-bold uppercase mb-1">Căn 1 Phòng Ngủ A (47m²)</div>
                <div className="text-lg font-extrabold text-emerald-700">Giá: ~990 Triệu</div>
                <div className="text-xs text-slate-600 mt-2">Vốn 20%: <strong>~198 Triệu</strong></div>
                <div className="text-xs text-emerald-700 font-bold mt-1">Góp: ~3,8 – 4,4 tr/tháng</div>
              </div>
              <div className="bg-sky-50 p-4 rounded-xl border border-sky-200 text-center">
                <div className="text-xs text-slate-500 font-bold uppercase mb-1">Căn 1 Phòng Ngủ B (55,1m²)</div>
                <div className="text-lg font-extrabold text-sky-700">Giá: ~1,20 Tỷ</div>
                <div className="text-xs text-slate-600 mt-2">Vốn 20%: <strong>~240 Triệu</strong></div>
                <div className="text-xs text-emerald-700 font-bold mt-1">Góp: ~4,6 – 5,3 tr/tháng</div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200 text-center">
                <div className="text-xs text-slate-500 font-bold uppercase mb-1">Căn 2 Phòng Ngủ (68,8m²)</div>
                <div className="text-lg font-extrabold text-indigo-700">Giá: ~1,50 Tỷ</div>
                <div className="text-xs text-slate-600 mt-2">Vốn 20%: <strong>~300 Triệu</strong></div>
                <div className="text-xs text-emerald-700 font-bold mt-1">Góp: ~5,8 – 6,7 tr/tháng</div>
              </div>
            </div>
          </section>

          {/* ── SECTION 9: CẢNH BÁO LỪA ĐẢO ── */}
          <section id="canh-bao-chieu-tro-lua-dao-trang-bom" className="mb-10 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-rose-600 text-white text-sm font-bold">8</span>
              Cảnh báo chiêu trò lừa đảo mua bán NOXH tại Trảng Bom
            </h2>
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 mb-4 text-slate-800 space-y-3">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">
                  Tại Trảng Bom, xuất hiện các đối tượng môi giới không chính thức nhận "tiền cọc giữ chỗ suất nội bộ" hoặc hứa hẹn bao đậu hồ sơ với chi phí chênh lệch hàng chục triệu đồng. Toàn bộ các hành vi này đều <strong>hoàn toàn trái pháp luật</strong>.
                </p>
              </div>
              <p className="text-sm leading-relaxed">
                Giá bán nhà ở xã hội do Sở Xây dựng thẩm định và niêm yết công khai. Quý khách hàng hãy liên hệ trực tiếp văn phòng bán hàng của chủ đầu tư Kim Oanh Land để được hỗ trợ nộp hồ sơ xét duyệt miễn phí 100%.
              </p>
            </div>
          </section>

          {/* ── SECTION 10: FAQ ── */}
          <section id="cau-hoi-thuong-gap-faq-trang-bom" className="mb-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white text-sm font-bold">9</span>
              Giải đáp thắc mắc thường gặp khi mua nhà ở xã hội Trảng Bom (FAQ)
            </h2>

            <div className="space-y-3">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">
                  Q1: Mua nhà ở xã hội Trảng Bom cần chuẩn bị trước bao nhiêu tiền vốn tự có?
                </h4>
                <p className="text-sm text-slate-700">
                  <strong>Trả lời:</strong> Khách hàng chỉ cần chuẩn bị trước <strong>20 – 25% giá trị căn hộ</strong>, tương đương từ khoảng <strong>150 triệu đồng</strong> đối với căn Studio giá 750 triệu. Số tiền này được chia làm 3 đợt thanh toán nhẹ nhàng trong vòng 2 tháng.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">
                  Q2: Công nhân làm việc tại KCN Bàu Xéo hoặc KCN Sông Mây có được mua không?
                </h4>
                <p className="text-sm text-slate-700">
                  <strong>Trả lời:</strong> Hoàn toàn ĐƯỢC. Công nhân và người lao động làm việc tại các KCN tại Trảng Bom là đối tượng ưu tiên hàng đầu theo đề án phát triển nhà ở xã hội của tỉnh.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">
                  Q3: Dự án K-Home Midtown Trảng Bom nằm ở đâu?
                </h4>
                <p className="text-sm text-slate-700">
                  <strong>Trả lời:</strong> Dự án tọa lạc tại vị trí trung tâm thị trấn Trảng Bom, giữa 4 tuyến đường huyết mạch: 30/4 – Hùng Vương – Lý Nam Đế – Lê Đại Hành, kết nối thuận tiện về TP. Biên Hòa và TP.HCM.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">
                  Q4: Nhà ở xã hội Trảng Bom sau bao lâu thì được bán lại?
                </h4>
                <p className="text-sm text-slate-700">
                  <strong>Trả lời:</strong> Theo Luật Nhà ở, sau thời hạn <strong>5 năm</strong> kể từ ngày hoàn tất thanh toán và nhận bàn giao nhà, chủ sở hữu được quyền bán lại theo giá thị trường tự do.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Banner cuối bài */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-1">Cần hỗ trợ kiểm tra điều kiện hồ sơ NOXH Trảng Bom?</h3>
              <p className="text-amber-100 text-sm">Chuyên viên Kim Oanh Land tư vấn, kiểm tra VNeID và hoàn thiện hồ sơ miễn phí 100%.</p>
            </div>
            <a 
              href="tel:0937587438"
              className="inline-flex items-center gap-2 bg-white text-amber-800 font-extrabold px-5 py-3 rounded-xl text-sm hover:bg-amber-50 transition shadow-md whitespace-nowrap"
            >
              <Phone className="w-4 h-4 text-amber-700" />
              Hotline: 0937 587 438
            </a>
          </div>

        </div>

        {/* Right Column: Sticky Sidebar / Consultation Form */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto no-scrollbar">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm uppercase tracking-wider mb-2">
              <ShieldCheck className="w-5 h-5" />
              Tư Vấn Hồ Sơ Miễn Phí
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Đăng Ký Nhận Bảng Giá NOXH Trảng Bom 2026
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Nhận trọn bộ tài liệu biểu mẫu Mẫu 01, Mẫu 02, Mẫu 04 và bảng giá căn đẹp trực tiếp từ chủ đầu tư Kim Oanh Land.
            </p>

            {formSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-center">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <div className="font-bold text-sm">Đã gửi thông tin thành công!</div>
                <div className="text-xs text-emerald-700 mt-1">Chuyên viên sẽ liên hệ hỗ trợ bạn trong vòng 15 phút.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên của bạn</label>
                  <input 
                    type="text" 
                    placeholder="Nguyễn Văn A" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại (Zalo)</label>
                  <input 
                    type="tel" 
                    placeholder="0937 xxx xxx" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Dự án quan tâm</label>
                  <select 
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="K-Home Midtown Trảng Bom">K-Home Midtown (Trảng Bom)</option>
                    <option value="K-Home SkyView Bàu Xéo">K-Home SkyView (Bàu Xéo)</option>
                    <option value="K-Home CityView Hố Nai">K-Home CityView (Biên Hòa)</option>
                    <option value="K-Home Avenue Nhơn Trạch">K-Home Avenue (Nhơn Trạch)</option>
                  </select>
                </div>
                <button 
                  type="submit" 
                  className="cursor-pointer w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  Gửi Yêu Cầu Tư Vấn Ngay
                </button>
                <div className="text-[11px] text-slate-400 text-center">
                  🔒 Thông tin của bạn được cam kết bảo mật 100%
                </div>
              </form>
            )}

            <div className="mt-5 pt-5 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-600" />
                <span>Hotline: <a href="tel:0937587438" className="font-bold text-slate-900 hover:text-amber-600">0937 587 438</a></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Văn phòng: Đường 30/4, TT. Trảng Bom, Đồng Nai</span>
              </div>
            </div>
          </div>

          {/* Dự án liên quan */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm mb-3">Dự án cùng hệ thống K-Home</h4>
            <div className="space-y-3">
              <div 
                onClick={() => onNavigate("/k-home-cityview-ho-nai")}
                className="group cursor-pointer flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition"
              >
                <img 
                  src="https://res.cloudinary.com/dthv0nsq/image/upload/v1785230285/k-home-cityview/V34_TAN-HOA_EXT_FACADE_FINAL_2.jpg" 
                  alt="K-Home CityView Hố Nai" 
                  className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition">K-Home CityView Biên Hòa</div>
                  <div className="text-[11px] text-slate-500">1.382 căn • Giá từ 950 Triệu</div>
                </div>
              </div>
              <div 
                onClick={() => onNavigate("/k-home-avenue-nhon-trach")}
                className="group cursor-pointer flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition"
              >
                <img 
                  src="https://res.cloudinary.com/dthv0nsq/image/upload/v1785230307/k-home-avenue/PC01-TT-copy_2_2-min.jpg" 
                  alt="K-Home Avenue Nhơn Trạch" 
                  className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition">K-Home Avenue Nhơn Trạch</div>
                  <div className="text-[11px] text-slate-500">1.022 căn • Giá từ 750 Triệu</div>
                </div>
              </div>
            </div>
          </div>

        </aside>

      </div>
    </article>
  );
}

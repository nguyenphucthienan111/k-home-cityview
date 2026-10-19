import React, { useState, useEffect } from "react";
import { 
  Building2, MapPin, CheckCircle, ChevronRight, Phone, ShieldCheck, 
  HelpCircle, Star, Award, TrendingUp, Users, ArrowRight, FileText, 
  DollarSign, Calculator, Send, Check, AlertTriangle, Sparkles,
  Info, Compass, ShieldAlert, CheckSquare, Clock, Download, Plane
} from "lucide-react";

interface Props {
  onNavigate: (path: string) => void;
}

export default function NoxhNhonTrachPillarView({ onNavigate }: Props) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", project: "K-Home Avenue Nhơn Trạch", note: "" });

  useEffect(() => {
    document.title = "Nhà Ở Xã Hội Nhơn Trạch 2026: Tổng Hợp Dự Án, Bảng Giá & Hướng Dẫn Mua A-Z";
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
          <span className="text-slate-900 font-medium truncate">Nhà ở xã hội Nhơn Trạch 2026</span>
        </div>
      </nav>

      {/* ── Header / Hero Banner (Light / Bright Premium Real Estate Editorial Style) ── */}
      <header className="relative bg-[#FAF9F6] text-[#172033] overflow-hidden border-b border-slate-200/80">
        {/* Background Aerial / Urban Image with Asymmetric Bright Gradient */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://res.cloudinary.com/dthv0nsq/image/upload/v1785230307/k-home-avenue/PC01-TT-copy_2_2-min.jpg"
            alt="Toàn cảnh quy hoạch đô thị nhà ở xã hội Nhơn Trạch 2026 gần sân bay Long Thành"
            className="w-full h-full object-cover object-right filter brightness-95 contrast-105"
            loading="eager"
          />
          {/* Asymmetric Bright Gradient: Trắng sáng bên trái, trong suốt 20-30% ở góc phải */}
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
          {/* Subtle Warm Amber Glow */}
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
                  BÁO CÁO THỊ TRƯỜNG NOXH NHƠN TRẠCH • 2026
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold tracking-tight text-[#172033] leading-[1.12]">
                Nhà Ở Xã Hội <br />
                <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                  Nhơn Trạch 2026
                </span>
              </h1>

              <p className="text-lg md:text-xl font-semibold text-slate-700 leading-snug">
                Tổng hợp dự án NOXH Phú Hội, căn hộ đón đầu Sân bay Long Thành & bảng giá A–Z
              </p>

              <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-xl font-normal">
                Báo cáo chuyên sâu dự án Nhà ở xã hội Phú Hội (K-Home Avenue Nhơn Trạch) mặt tiền đường 25C, cập nhật giá bán từ 750 triệu, điều kiện xét duyệt và gói vay ưu đãi 5,4%/năm.
              </p>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-5 pt-1 text-xs md:text-sm text-slate-700">
                <span className="inline-flex items-center gap-2 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  1.104 căn NOXH Phú Hội + 82 shophouse
                </span>
                <span className="inline-flex items-center gap-2 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  Giá chỉ từ 750 triệu/căn*
                </span>
                <span className="inline-flex items-center gap-2 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
                  10 phút đến Sân bay Long Thành
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
                    <FileText className="w-4 h-4 text-amber-600" /> NOXH NHƠN TRẠCH REPORT
                  </span>
                  <span className="text-[11px] font-mono font-bold bg-amber-100/80 text-amber-900 px-2.5 py-0.5 rounded-md border border-amber-300/60">
                    10/2026
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-center mb-4">
                  <div className="bg-white/90 p-3 rounded-xl border border-amber-100/90 shadow-2xs flex flex-col justify-center">
                    <div className="text-2xl md:text-3xl font-extrabold text-amber-600 font-tech leading-none">1.022</div>
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
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Vị trí kết nối</span>
                    <span className="font-bold text-slate-800">Đường 25C • Cạnh Sân bay</span>
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
              <span className="text-slate-500">(152 lượt đánh giá)</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-slate-500">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Dữ liệu thị trường: <strong>Quý 4/2026</strong>
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Pháp lý: <strong>Quy hoạch 1/500 & Giấy phép xây dựng được duyệt</strong>
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
              Mục lục nội dung cẩm nang NOXH Nhơn Trạch 2026
            </h2>
            <nav className="space-y-2 text-sm">
              <a href="#tiem-nang-thi-truong-noxh-nhon-trach" className="block text-slate-700 hover:text-amber-700 hover:underline">
                1. Tiềm năng bứt phá thị trường nhà ở xã hội Nhơn Trạch khi Sân bay Long Thành về đích
              </a>
              <a href="#danh-sach-du-an-noxh-nhon-trach" className="block text-slate-700 hover:text-amber-700 hover:underline">
                2. Tổng hợp các dự án nhà ở xã hội Nhơn Trạch triển khai năm 2026
              </a>
              <a href="#k-home-avenue-nhon-trach-tieu-diem" className="block text-slate-700 hover:text-amber-700 hover:underline font-semibold text-amber-800">
                ➔ Tiêu điểm số 1: K-Home Avenue Nhơn Trạch (1.022 căn chuẩn Singapore đường 25C)
              </a>
              <a href="#so-sanh-mua-nha-vs-thue-tro-nhon-trach" className="block text-slate-700 hover:text-amber-700 hover:underline">
                3. Bảng so sánh tài chính: Mua căn hộ NOXH 750 triệu vs Thuê trọ 25 năm tại Nhơn Trạch
              </a>
              <a href="#dieu-kien-mua-noxh-nhon-trach-2026" className="block text-slate-700 hover:text-amber-700 hover:underline">
                4. Điều kiện mua nhà ở xã hội Nhơn Trạch 2026 theo Luật Nhà ở mới nhất
              </a>
              <a href="#quy-trinh-6-buoc-mua-noxh-nhon-trach" className="block text-slate-700 hover:text-amber-700 hover:underline font-semibold text-emerald-800">
                5. Quy trình 6 bước mua nhà ở xã hội Nhơn Trạch chuẩn pháp lý (Vốn ban đầu 20 - 25%)
              </a>
              <a href="#ho-so-thu-tuc-mua-noxh-nhon-trach" className="block text-slate-700 hover:text-amber-700 hover:underline">
                6. Hướng dẫn hồ sơ & các mẫu đơn chuẩn Mẫu 01, 02, 04, VNeID & VssID
              </a>
              <a href="#bang-gia-va-lai-suat-vay-5-4" className="block text-slate-700 hover:text-amber-700 hover:underline">
                7. Bảng giá chi tiết từng loại căn và bảng tính trả góp lãi suất 5,4%/năm
              </a>
              <a href="#canh-bao-rui-ro-dat-nen-so-chung-vi-bang" className="block text-slate-700 hover:text-amber-700 hover:underline font-semibold text-rose-700">
                8. Cảnh báo rủi ro: Mua căn hộ NOXH có sổ hồng vs Đất nền sổ chung vi bằng Nhơn Trạch
              </a>
              <a href="#cau-hoi-thuong-gap-faq-nhon-trach" className="block text-slate-700 hover:text-amber-700 hover:underline">
                9. Giải đáp thắc mắc thường gặp khi mua nhà ở xã hội Nhơn Trạch (FAQ)
              </a>
            </nav>
          </div>

          {/* ── SECTION 1: TIỀM NĂNG THỊ TRƯỜNG ── */}
          <section id="tiem-nang-thi-truong-noxh-nhon-trach" className="mb-10 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white text-sm font-bold">1</span>
              Tiềm năng bứt phá thị trường nhà ở xã hội Nhơn Trạch 2026
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Huyện Nhơn Trạch (tỉnh Đồng Nai) được ví như "thủ phủ công nghiệp" cửa ngõ phía Đông TP.HCM với <strong>9 khu công nghiệp và 1 cụm công nghiệp</strong> đang hoạt động (KCN Nhơn Trạch 1, 2, 3, 4, 5, 6, KCN Dệt may Nhơn Trạch, KCN Ông Kèo), quy tụ hơn <strong>130.000 chuyên gia, kỹ sư và công nhân lao động</strong>.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Năm 2026 là cột mốc lịch sử khi <strong>Sân bay Quốc tế Long Thành giai đoạn 1</strong> chính thức vận hành và tuyến đường <strong>Vành Đai 3 TP.HCM (cầu Nhơn Trạch)</strong> kết nối trực tiếp Nhơn Trạch với TP. Thủ Đức được thông xe. Thời gian di chuyển từ Nhơn Trạch về trung tâm TP.HCM sẽ rút ngắn chỉ còn khoảng <strong>20 – 25 phút</strong>.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-4 text-center">
              <div>
                <div className="text-xl md:text-2xl font-extrabold text-amber-600">10 KCN</div>
                <div className="text-xs text-slate-500 font-medium">Hạ tầng công nghiệp lớn</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-extrabold text-emerald-600">130.000+</div>
                <div className="text-xs text-slate-500 font-medium">Lao động & chuyên gia</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-extrabold text-sky-600">10 Phút</div>
                <div className="text-xs text-slate-500 font-medium">Kết nối Sân bay Long Thành</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-extrabold text-indigo-600">Từ 750 Tr</div>
                <div className="text-xs text-slate-500 font-medium">Giá căn hộ chuẩn Singapore</div>
              </div>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Trong bối cảnh giá nhà đất tại TP. Thủ Đức và TP. Biên Hòa đã tăng cao, phân khúc <strong>nhà ở xã hội Nhơn Trạch</strong> với mức giá chỉ từ <strong>750 triệu đến 1,4 tỷ đồng/căn</strong> mở ra cơ hội vàng giúp người lao động sở hữu tài sản giá trị ngay tâm điểm phát triển vùng kinh tế trọng điểm.
            </p>
          </section>

          {/* ── SECTION 2: TỔNG HỢP DỰ ÁN ── */}
          <section id="danh-sach-du-an-noxh-nhon-trach" className="mb-10 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white text-sm font-bold">2</span>
              Tổng hợp dự án nhà ở xã hội Nhơn Trạch triển khai năm 2026
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Theo quy hoạch phát triển đô thị tỉnh Đồng Nai, trên địa bàn huyện Nhơn Trạch năm 2026 đang triển khai các dự án nhà ở xã hội đón đầu Sân bay Long Thành gồm: <strong>1. K-Home Avenue Nhơn Trạch (NOXH Phú Hội)</strong> do Kim Oanh Land phát triển (1.104 căn hộ + shophouse mặt tiền đường 25C, giá từ 750 triệu), <strong>2. Dự án NOXH Phước An (KĐT DTA)</strong>, và <strong>3. Khu nhà ở công nhân phụ cận KCN Ông Kèo</strong>. Trong đó, K-Home Avenue là dự án NOXH kiểu mẫu chuẩn Singapore quy mô lớn nhất và có vị trí kết nối sân bay thuận tiện nhất.
            </p>

            <div className="space-y-4 mb-6">
              {/* Dự án 1: K-Home Avenue */}
              <div className="p-4 rounded-xl border-2 border-amber-500 bg-amber-50/40 relative">
                <span className="absolute -top-3 right-4 bg-amber-600 text-white text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Dự Án Trọng Điểm Số 1
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  1. Nhà Ở Xã Hội Phú Hội – K-Home Avenue Nhơn Trạch (Kim Oanh Group)
                </h3>
                <p className="text-sm text-slate-600 mb-2">
                  📍 <strong>Vị trí:</strong> Mặt tiền Tỉnh lộ 25C (Đại lộ Nguyễn Ái Quốc), khu dân cư Phú Hội / Phước An, Huyện Nhơn Trạch, Đồng Nai
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-700 mb-3 bg-white p-2.5 rounded-lg border border-amber-200">
                  <div><strong>Quy mô:</strong> 5,3 ha (4 block 12 tầng)</div>
                  <div><strong>Số căn:</strong> 1.104 căn NOXH + 82 shophouse</div>
                  <div><strong>Giá bán:</strong> Từ 750 Triệu/căn</div>
                  <div><strong>Tiêu chuẩn:</strong> Xanh EDGE (Singapore)</div>
                </div>
                <p className="text-sm text-slate-700 mb-3">
                  Thường được biết đến với tên gọi <strong>Nhà ở xã hội Phú Hội</strong> hoặc <strong>K-Home Avenue</strong>. Tọa lạc ngay mặt tiền đại lộ 25C rộng 100m kết nối thẳng vào cổng chính Sân bay Quốc tế Long Thành. Dự án có hồ bơi resort, công viên cây xanh, shophouse thương mại, trạm sạc xe điện thông minh.
                </p>
                <button 
                  onClick={() => onNavigate("/k-home-avenue-nhon-trach")}
                  className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition"
                >
                  Xem chi tiết bảng giá & mặt bằng K-Home Avenue <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Dự án 2: NOXH Phước An */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  2. Dự án Nhà ở xã hội Phước An (Khu đô thị DTA)
                </h3>
                <p className="text-sm text-slate-600 mb-2">
                  📍 <strong>Vị trí:</strong> Xã Phước An, Huyện Nhơn Trạch, Đồng Nai
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-700 mb-2 bg-slate-50 p-2.5 rounded-lg">
                  <div><strong>Quy mô:</strong> Các khối chung cư cao tầng</div>
                  <div><strong>Số căn:</strong> Hơn 1.500 căn hộ</div>
                  <div><strong>Trạng thái:</strong> Đã bàn giao một số block, đang tiếp tục các giai đoạn sau</div>
                </div>
              </div>

              {/* Dự án 3: NOXH Khu công nghiệp Ông Kèo */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  3. Dự án Nhà ở công nhân KCN Ông Kèo
                </h3>
                <p className="text-sm text-slate-600 mb-2">
                  📍 <strong>Vị trí:</strong> Khu vực phụ cận KCN Ông Kèo, huyện Nhơn Trạch
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-700 mb-2 bg-slate-50 p-2.5 rounded-lg">
                  <div><strong>Quy mô:</strong> Quỹ đất quy hoạch dịch vụ công nghiệp</div>
                  <div><strong>Trạng thái:</strong> Đang hoàn tất thủ tục lựa chọn chủ đầu tư theo đề án 1 triệu căn</div>
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 3: TIÊU ĐIỂM K-HOME AVENUE / NOXH PHÚ HỘI ── */}
          <section id="k-home-avenue-nhon-trach-tieu-diem" className="mb-10 scroll-mt-20 bg-gradient-to-br from-amber-50 to-orange-50/50 p-6 rounded-2xl border border-amber-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-600" />
              Tiêu điểm: Nhà Ở Xã Hội Phú Hội (K-Home Avenue) – Chuẩn Singapore Cửa Ngõ Sân Bay
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Trong các dự án trên, <strong>Nhà ở xã hội Phú Hội (K-Home Avenue Nhơn Trạch)</strong> do Tập đoàn Kim Oanh (Kim Oanh Group) làm chủ đầu tư và đối tác Singapore tư vấn thiết kế là dự án quy mô, hiện đại và đồng bộ bậc nhất huyện Nhơn Trạch:
            </p>

            <div className="mb-4 overflow-hidden rounded-xl border border-amber-200 shadow-sm">
              <img 
                src="https://res.cloudinary.com/dthv0nsq/image/upload/v1785230307/k-home-avenue/PC01-TT-copy_2_2-min.jpg" 
                alt="Phối cảnh kiến trúc K-Home Avenue Nhơn Trạch chuẩn Singapore" 
                className="w-full h-64 md:h-80 object-cover"
                loading="lazy"
              />
              <div className="bg-slate-900/80 text-white text-xs px-3 py-1.5 text-center">
                Phối cảnh 4 block cao 12 tầng dự án K-Home Avenue trên trục đường 25C Nhơn Trạch
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="bg-white p-3.5 rounded-xl border border-amber-100 flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Vị trí vàng trục 25C:</strong> Kết nối trực tiếp vào Cảng hàng không Quốc tế Long Thành chỉ 10 – 12 phút lái xe.
                </div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-amber-100 flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Chuẩn xanh quốc tế EDGE:</strong> Tiết kiệm tối thiểu 20% điện năng và nước sinh hoạt hàng tháng cho cư dân.
                </div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-amber-100 flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Giá bán trực tiếp từ 750 triệu:</strong> Bàn giao hoàn thiện full nội thất cơ bản, chỉ cần xách vali vào ở.
                </div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-amber-100 flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Gói vay 5,4%/năm trong 25 năm:</strong> Trả góp chỉ từ 2,5 – 3,5 triệu đồng/tháng từ Ngân hàng Chính sách Xã hội.
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => onNavigate("/k-home-avenue-nhon-trach")}
                className="cursor-pointer bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition"
              >
                Khám phá chi tiết dự án K-Home Avenue
              </button>
              <a 
                href="tel:0937587438"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-white border border-amber-300 px-4 py-2.5 rounded-xl transition"
              >
                <Phone className="w-3.5 h-3.5" />
                Tư vấn hồ sơ: 0937 587 438
              </a>
            </div>
          </section>

          {/* ── SECTION 4: BẢNG SO SÁNH TÀI CHÍNH ── */}
          <section id="so-sanh-mua-nha-vs-thue-tro-nhon-trach" className="mb-10 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white text-sm font-bold">3</span>
              Bảng so sánh: Mua căn hộ NOXH Nhơn Trạch vs Thuê trọ 25 năm
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Nhiều công nhân và cặp vợ chồng trẻ tại Nhơn Trạch băn khoăn: <em>"Nên tiếp tục thuê phòng trọ hay vay mua căn hộ NOXH?"</em>. Hãy cùng nhìn vào bài toán tài chính thực tế sau 25 năm:
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-200 mb-4">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3 w-1/3">Tiêu chí so sánh</th>
                    <th className="p-3 text-emerald-800 bg-emerald-50/70">Mua NOXH K-Home Avenue (Vay 5,4%)</th>
                    <th className="p-3 text-rose-800 bg-rose-50/70">Thuê phòng trọ tại Nhơn Trạch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="p-3 font-semibold">Chi phí hàng tháng</td>
                    <td className="p-3 text-emerald-700 font-bold">Trả góp ~2,8 – 3,8 triệu/tháng</td>
                    <td className="p-3 text-rose-700">Thuê trọ ~2,5 – 4,0 triệu/tháng (tăng theo năm)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Sau 25 năm</td>
                    <td className="p-3 text-emerald-700 font-bold">Sở hữu vĩnh viễn căn hộ trị giá 1,5 – 2,5 tỷ</td>
                    <td className="p-3 text-rose-700">Mất trắng ~1,2 tỷ tiền thuê trọ mà không có tài sản</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Môi trường sống</td>
                    <td className="p-3">Hồ bơi, công viên, an ninh 24/7, văn minh chuẩn Singapore</td>
                    <td className="p-3">Phòng trọ ẩm thấp, an ninh phức tạp, không có tiện ích</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Sự ổn định tâm lý</td>
                    <td className="p-3">An cư lâu dài, không lo bị chủ nhà đòi phòng hay tăng giá</td>
                    <td className="p-3">Phụ thuộc hoàn toàn vào chủ nhà trọ</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 italic">
              * Ghi chú: Mức trả góp căn hộ Studio/1PN giá 750tr sau khi thanh toán trước 20 - 25% vốn tự có.
            </p>
          </section>

          {/* ── SECTION 5: ĐIỀU KIỆN MUA NOXH NHƠN TRẠCH 2026 ── */}
          <section id="dieu-kien-mua-noxh-nhon-trach-2026" className="mb-10 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white text-sm font-bold">4</span>
              Điều kiện mua nhà ở xã hội Nhơn Trạch 2026 theo luật mới
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Theo quy định mới nhất có hiệu lực thi hành, các rào cản hành chính đã được gỡ bỏ đáng kể để người lao động tại Nhơn Trạch tiếp cận nhà ở dễ dàng hơn:
            </p>

            <div className="space-y-3 mb-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  1. Mức trần thu nhập xét duyệt mới nhất
                </h4>
                <div className="text-sm text-slate-700 space-y-1">
                  <p>• <strong>Người độc thân:</strong> Thu nhập thực nhận dưới <strong>25 triệu đồng/tháng</strong>.</p>
                  <p>• <strong>Người độc thân nuôi con nhỏ:</strong> Thu nhập thực nhận dưới <strong>35 triệu đồng/tháng</strong>.</p>
                  <p>• <strong>Hộ gia đình hai vợ chồng:</strong> Tổng thu nhập 2 vợ chồng dưới <strong>50 triệu đồng/tháng</strong>.</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  2. Điều kiện nhà ở (Xác thực qua VNeID & cơ sở dữ liệu quốc gia)
                </h4>
                <p className="text-sm text-slate-700">
                  Chưa đứng tên sở hữu nhà ở hoặc đất ở tại địa bàn tỉnh Đồng Nai. Hoặc có nhà nhưng diện tích bình quân dưới 15m² sàn/người.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                  3. Xóa bỏ hoàn toàn rào cản Hộ khẩu thường trú / Sổ tạm trú KT3
                </h4>
                <p className="text-sm text-slate-700">
                  Người lao động có hộ khẩu ở bất kỳ tỉnh thành nào trên cả nước, chỉ cần có hợp đồng lao động và tham gia Bảo hiểm Xã hội (BHXH) từ 12 tháng trở lên tại địa bàn tỉnh Đồng Nai đều được nộp hồ sơ xét duyệt bình đẳng 100%.
                </p>
              </div>
            </div>
          </section>

          {/* ── SECTION 6: QUY TRÌNH 6 BƯỚC MUA NOXH NHƠN TRẠCH ── */}
          <section id="quy-trinh-6-buoc-mua-noxh-nhon-trach" className="mb-10 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-600 text-white text-sm font-bold">5</span>
              Quy trình 6 bước mua nhà ở xã hội Nhơn Trạch chuẩn pháp lý 2026
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Người có nhu cầu mua nhà ở xã hội Nhơn Trạch cần tuân thủ đúng quy trình giao dịch 6 bước chuẩn để đảm bảo an toàn tuyệt đối về mặt pháp lý:
            </p>

            <div className="space-y-3.5 mb-6">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center shrink-0 text-sm">1</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Bước 1: Tư vấn điều kiện & Chuẩn bị hồ sơ đăng ký</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Khách hàng liên hệ văn phòng đại diện chủ đầu tư để được kiểm tra cư trú trên ứng dụng VNeID, xác nhận mức thu nhập và chuẩn bị bộ hồ sơ theo Mẫu 01, Mẫu 02, Mẫu 04.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center shrink-0 text-sm">2</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Bước 2: Nộp hồ sơ xét duyệt & Thẩm định tại Sở Xây dựng Đồng Nai</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Chủ đầu tư tiếp nhận hồ sơ hợp lệ và gửi danh sách lên Sở Xây dựng để hậu kiểm chéo với cơ sở dữ liệu quốc gia về đất đai nhằm đảm bảo ứng viên chưa có nhà ở tại Đồng Nai.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center shrink-0 text-sm">3</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Bước 3: Công bố kết quả xét duyệt & Đặt cọc chọn căn</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Sau khi danh sách được phê duyệt, người mua được mời lên lựa chọn vị trí tầng, căn phù hợp và ký Phiếu xác nhận đặt cọc (30.000.000 VNĐ) để khóa căn.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center shrink-0 text-sm">4</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Bước 4: Ký hợp đồng & Đóng vốn tự có 20 – 25% (chia 3 đợt trong 2 tháng)</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Khách hàng thanh toán Đợt 1 (15% đã trừ tiền cọc) để ký hợp đồng, sau đó thanh toán Đợt 2 (5% sau 30 ngày) và Đợt 3 (5% sau 30 ngày tiếp theo).
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center shrink-0 text-sm">5</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Bước 5: Thẩm định giải ngân gói vay ngân hàng chính sách 5,4%/năm</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Ngân hàng Chính sách Xã hội hoặc các Ngân hàng thương mại liên kết tiến hành thẩm định và giải ngân phần còn lại (75 – 80%) theo tiến độ thi công công trình.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-extrabold flex items-center justify-center shrink-0 text-sm">6</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Bước 6: Nghiệm thu bàn giao căn hộ & Cấp sổ hồng lâu dài</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Khách hàng nhận bàn giao căn hộ hoàn thiện nội thất, dọn vào ở và chủ đầu tư tiến hành thủ tục cấp Giấy chứng nhận quyền sở hữu nhà ở (Sổ hồng) cho cư dân.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 7: BIỂU MẪU HỒ SƠ ── */}
          <section id="ho-so-thu-tuc-mua-noxh-nhon-trach" className="mb-10 scroll-mt-20">
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
          <section id="bang-gia-va-lai-suat-vay-5-4" className="mb-10 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white text-sm font-bold">7</span>
              Bảng giá căn hộ K-Home Avenue & Bảng tính dòng tiền trả góp 5,4%/năm
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-center">
                <div className="text-xs text-slate-500 font-bold uppercase mb-1">Căn Studio (37,7m²)</div>
                <div className="text-lg font-extrabold text-amber-700">Giá: ~750 Triệu</div>
                <div className="text-xs text-slate-600 mt-2">Vốn 20%: <strong>~150 Triệu</strong></div>
                <div className="text-xs text-emerald-700 font-bold mt-1">Góp: ~2,8 – 3,2 tr/tháng</div>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-center">
                <div className="text-xs text-slate-500 font-bold uppercase mb-1">Căn 1 Phòng Ngủ + (46,6m²)</div>
                <div className="text-lg font-extrabold text-emerald-700">Giá: ~990 Triệu</div>
                <div className="text-xs text-slate-600 mt-2">Vốn 20%: <strong>~198 Triệu</strong></div>
                <div className="text-xs text-emerald-700 font-bold mt-1">Góp: ~3,8 – 4,4 tr/tháng</div>
              </div>
              <div className="bg-sky-50 p-4 rounded-xl border border-sky-200 text-center">
                <div className="text-xs text-slate-500 font-bold uppercase mb-1">Căn 2 Phòng Ngủ A (65,7m²)</div>
                <div className="text-lg font-extrabold text-sky-700">Giá: ~1,23 Tỷ</div>
                <div className="text-xs text-slate-600 mt-2">Vốn 20%: <strong>~246 Triệu</strong></div>
                <div className="text-xs text-emerald-700 font-bold mt-1">Góp: ~4,8 – 5,5 tr/tháng</div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200 text-center">
                <div className="text-xs text-slate-500 font-bold uppercase mb-1">Căn 2 Phòng Ngủ B (69,5m²)</div>
                <div className="text-lg font-extrabold text-indigo-700">Giá: ~1,40 Tỷ</div>
                <div className="text-xs text-slate-600 mt-2">Vốn 20%: <strong>~280 Triệu</strong></div>
                <div className="text-xs text-emerald-700 font-bold mt-1">Góp: ~5,5 – 6,3 tr/tháng</div>
              </div>
            </div>
          </section>

          {/* ── SECTION 9: CẢNH BÁO RỦI RO ĐẤT NỀN SỔ CHUNG ── */}
          <section id="canh-bao-rui-ro-dat-nen-so-chung-vi-bang" className="mb-10 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-rose-600 text-white text-sm font-bold">8</span>
              Cảnh báo: Rủi ro mua đất nền sổ chung vi bằng tại Nhơn Trạch
            </h2>
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 mb-4 text-slate-800 space-y-3">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">
                  Tại Nhơn Trạch, nhiều môi giới lợi dụng nhu cầu mua nhà giá rẻ để chào bán đất nền phân lô trái phép qua <strong>vi bằng Thừa phát lại</strong> hoặc <strong>sổ hồng chung</strong> với giá 400 – 600 triệu đồng. Thực tế vi bằng chỉ ghi nhận hành vi giao nhận tiền chứ <em>không có giá trị công nhận quyền sở hữu</em>, không xin được giấy phép xây dựng và có nguy cơ bị cưỡng chế phá dỡ.
                </p>
              </div>
              <p className="text-sm leading-relaxed">
                Người dân nên lựa chọn các dự án <strong>nhà ở xã hội có pháp lý hoàn chỉnh</strong> như K-Home Avenue: được Sở Xây dựng cấp phép, ngân hàng nhà nước bảo lãnh giải ngân và được cấp sổ hồng sở hữu lâu dài ổn định cho con cháu.
              </p>
            </div>
          </section>

          {/* ── SECTION 10: FAQ ── */}
          <section id="cau-hoi-thuong-gap-faq-nhon-trach" className="mb-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white text-sm font-bold">9</span>
              Giải đáp thắc mắc thường gặp khi mua nhà ở xã hội Nhơn Trạch (FAQ)
            </h2>

            <div className="space-y-3">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">
                  Q1: Mua nhà ở xã hội Nhơn Trạch cần chuẩn bị trước bao nhiêu tiền vốn tự có?
                </h4>
                <p className="text-sm text-slate-700">
                  <strong>Trả lời:</strong> Người mua chỉ cần có trước khoảng <strong>150 – 200 triệu đồng (20 – 25% giá trị căn hộ)</strong>, thanh toán chia nhỏ thành 3 đợt trong 2 tháng (Cọc 30 triệu, Đợt 1 đóng 15%, Đợt 2 đóng 5%, Đợt 3 đóng 5%). Phần còn lại được ngân hàng chính sách cho vay trả góp 25 năm.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">
                  Q2: Công nhân làm việc tại KCN Nhơn Trạch hộ khẩu ngoài tỉnh có mua được không?
                </h4>
                <p className="text-sm text-slate-700">
                  <strong>Trả lời:</strong> Hoàn toàn ĐƯỢC. Rào cản về sổ hộ khẩu thường trú và tạm trú KT3 đã được xóa bỏ hoàn toàn. Bất kỳ công dân nào có Hợp đồng lao động và đóng Bảo hiểm Xã hội từ 12 tháng tại Đồng Nai đều được đăng ký mua bình đẳng.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">
                  Q3: Dự án K-Home Avenue Nhơn Trạch cách Sân bay Long Thành bao xa?
                </h4>
                <p className="text-sm text-slate-700">
                  <strong>Trả lời:</strong> Dự án nằm ngay trên mặt tiền đường 25C (đại lộ Nguyễn Ái Quốc), chỉ cách cổng Sân bay Quốc tế Long Thành khoảng 10 – 12 phút di chuyển thẳng tắp.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">
                  Q4: Mua nhà ở xã hội Nhơn Trạch có được cấp sổ hồng vĩnh viễn không?
                </h4>
                <p className="text-sm text-slate-700">
                  <strong>Trả lời:</strong> Có. Căn hộ NOXH K-Home Avenue có pháp lý hoàn chỉnh được cấp Giấy chứng nhận quyền sở hữu nhà ở (Sổ hồng) sở hữu lâu dài theo quy định pháp luật. Sau 5 năm, chủ sở hữu được quyền chuyển nhượng lại tự do theo giá thị trường.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Banner cuối bài */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-1">Cần hỗ trợ kiểm tra điều kiện hồ sơ NOXH Nhơn Trạch?</h3>
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
              Đăng Ký Nhận Bảng Giá NOXH Nhơn Trạch 2026
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
                    <option value="K-Home Avenue Nhơn Trạch">K-Home Avenue (Nhơn Trạch)</option>
                    <option value="K-Home CityView Hố Nai">K-Home CityView (Biên Hòa)</option>
                    <option value="K-Home Midtown Trảng Bom">K-Home Midtown (Trảng Bom)</option>
                    <option value="Tất cả dự án NOXH Đồng Nai">Tất cả dự án NOXH Đồng Nai</option>
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
                <span>Văn phòng: Đường 25C Nguyễn Ái Quốc, Nhơn Trạch</span>
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
                onClick={() => onNavigate("/k-home-midtown-trang-bom")}
                className="group cursor-pointer flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition"
              >
                <img 
                  src="https://res.cloudinary.com/dthv0nsq/image/upload/v1785230298/k-home-midtown/Du-an-K-Home-Midtown-3d-birdview-toan-canh-dem-2048x1150.jpg" 
                  alt="K-Home Midtown Trảng Bom" 
                  className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition">K-Home Midtown Trảng Bom</div>
                  <div className="text-[11px] text-slate-500">542 căn • Giá từ 750 Triệu</div>
                </div>
              </div>
              <div 
                onClick={() => onNavigate("/k-home-skyview-trang-bom")}
                className="group cursor-pointer flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition"
              >
                <img 
                  src="https://res.cloudinary.com/dthv0nsq/image/upload/w_1200,q_auto:good,f_auto/k-home-cityview/V34_TAN-HOA_EXT_FACADE_FINAL_2" 
                  alt="K-Home SkyView Bàu Xéo Trảng Bom" 
                  className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition">K-Home SkyView Bàu Xéo</div>
                  <div className="text-[11px] text-slate-500">358 căn • Giá từ 750 Triệu</div>
                </div>
              </div>
            </div>
          </div>

        </aside>

      </div>
    </article>
  );
}

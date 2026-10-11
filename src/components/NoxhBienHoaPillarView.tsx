import React, { useState, useEffect } from "react";
import { 
  Building2, MapPin, CheckCircle, ChevronRight, Phone, ShieldCheck, 
  HelpCircle, Star, Award, TrendingUp, Users, ArrowRight, FileText, 
  DollarSign, Calculator, Send, Check, AlertCircle, Sparkles
} from "lucide-react";

interface Props {
  onNavigate: (path: string) => void;
}

export default function NoxhBienHoaPillarView({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", project: "K-Home CityView Hố Nai", note: "" });

  useEffect(() => {
    document.title = "Nhà Ở Xã Hội Biên Hòa 2026: Tổng Hợp Dự Án, Bảng Giá & Hướng Dẫn Mua A-Z";
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
          <button onClick={() => onNavigate("/")} className="hover:text-amber-600 transition">Trang chủ</button>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
          <span className="text-slate-900 font-medium truncate">Nhà ở xã hội Biên Hòa 2026</span>
        </div>
      </nav>

      {/* ── Header / Hero Banner ── */}
      <header className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white py-12 px-4 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Cẩm Nang Trụ Cột Thị Trường 2026
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Nhà Ở Xã Hội Biên Hòa 2026: Tổng Hợp Dự Án, Bảng Giá & Hướng Dẫn Mua Từ A–Z
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-3xl leading-relaxed mb-6">
            Báo cáo toàn cảnh thị trường nhà ở xã hội (NOXH) tại TP. Biên Hòa, tỉnh Đồng Nai: Danh sách 5 dự án đang triển khai, cập nhật điều kiện thu nhập mới nhất theo Luật Nhà ở 2023, bảng giá phê duyệt từ Sở Xây dựng và gói vay 5,4%/năm.
          </p>

          {/* Social Proof & Rating Badge */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300 border-t border-slate-700/60 pt-4">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold bg-white/10 px-3 py-1 rounded-full">
              <span className="text-white">5,0</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-slate-300 font-normal text-xs">(186 đánh giá)</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Cập nhật: <strong>Tháng 10/2026</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-400" />
              <span>Chủ đầu tư tiêu biểu: <strong>Kim Oanh Group</strong></span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <div className="max-w-5xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Core Pillar Article */}
        <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          
          {/* ── Table of Contents (Mục lục nhảy nhanh cho Google Sitelinks) ── */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-5 mb-8">
            <h2 className="text-lg font-bold text-amber-950 flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-amber-600" />
              Mục lục nội dung bài viết
            </h2>
            <nav className="space-y-2 text-sm">
              <a href="#tai-sao-bien-hoa-la-thi-truong-nha-o-xa-hoi-lon-nhat" className="block text-slate-700 hover:text-amber-700 hover:underline">
                1. Tại sao Biên Hòa là thị trường nhà ở xã hội lớn nhất miền Nam 2026?
              </a>
              <a href="#danh-sach-du-an-nha-o-xa-hoi-bien-hoa-2026" className="block text-slate-700 hover:text-amber-700 hover:underline">
                2. Danh sách dự án nhà ở xã hội Biên Hòa đang triển khai 2026
              </a>
              <a href="#k-home-cityview-ho-nai-du-an-trong-diem" className="block text-slate-700 hover:text-amber-700 hover:underline font-semibold text-amber-800">
                ➔ Tiêu điểm số 1: K-Home CityView Hố Nai (1.328 căn chuẩn Singapore)
              </a>
              <a href="#dieu-kien-mua-nha-o-xa-hoi-bien-hoa-2026" className="block text-slate-700 hover:text-amber-700 hover:underline">
                3. Điều kiện mua nhà ở xã hội Biên Hòa 2026 theo quy định mới
              </a>
              <a href="#ho-so-thu-tuc-mua-noxh-bien-hoa" className="block text-slate-700 hover:text-amber-700 hover:underline">
                4. Hồ sơ mua NOXH Biên Hòa: Trọn bộ giấy tờ & biểu mẫu chuẩn
              </a>
              <a href="#gia-va-chinh-sach-vay-lai-suat-5-4" className="block text-slate-700 hover:text-amber-700 hover:underline">
                5. Giá bán & chính sách vay: Cần bao nhiêu tiền để mua NOXH Biên Hòa?
              </a>
              <a href="#so-sanh-cac-du-an-noxh-bien-hoa" className="block text-slate-700 hover:text-amber-700 hover:underline">
                6. Nên chọn dự án NOXH nào tại Biên Hòa? Bảng so sánh chi tiết
              </a>
              <a href="#cau-hoi-thuong-gap-faq" className="block text-slate-700 hover:text-amber-700 hover:underline">
                7. Câu hỏi thường gặp về nhà ở xã hội Biên Hòa (FAQ)
              </a>
            </nav>
          </div>

          {/* ── SECTION 1 ── */}
          <section id="tai-sao-bien-hoa-la-thi-truong-nha-o-xa-hoi-lon-nhat" className="mb-10 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white text-sm font-bold">1</span>
              Tại sao Biên Hòa là thị trường nhà ở xã hội lớn nhất miền Nam 2026?
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Thành phố Biên Hòa (tỉnh Đồng Nai) hiện là đô thị loại I có dân số đông bậc nhất cả nước với hơn <strong>1,3 triệu dân</strong>. Với vị trí tiếp giáp trực tiếp TP. Thủ Đức (TP.HCM) và là trung tâm công nghiệp lớn của vùng kinh tế trọng điểm phía Nam, Biên Hòa sở hữu hơn <strong>6 khu công nghiệp lớn</strong> (KCN Biên Hòa 1, Biên Hòa 2, Amata, Agtex Long Bình, Loteco, Tam Phước) thu hút hơn <strong>400.000 công nhân, kỹ sư và chuyên gia</strong> sinh sống, làm việc.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Tuy nhiên, trong khi thị trường căn hộ thương mại tại Biên Hòa đã xác lập mặt bằng giá từ <strong>35 – 55 triệu đồng/m²</strong> (tương đương 2,2 – 3,5 tỷ đồng/căn), vượt quá khả năng tài chính của đại đa số gia đình trẻ, thì các dự án <strong>nhà ở xã hội Biên Hòa</strong> với mức giá được Nhà nước thẩm định chỉ từ <strong>16 – 22 triệu đồng/m²</strong> (từ <strong>950 triệu/căn</strong>) chính là lời giải duy nhất cho cơn khát an cư thực.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-4 text-center">
              <div>
                <div className="text-xl md:text-2xl font-extrabold text-amber-600">1,3+ Triệu</div>
                <div className="text-xs text-slate-500 font-medium">Dân số TP. Biên Hòa</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-extrabold text-emerald-600">6 KCN Lớn</div>
                <div className="text-xs text-slate-500 font-medium">Trung tâm công nghiệp</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-extrabold text-sky-600">5.000+ Căn</div>
                <div className="text-xs text-slate-500 font-medium">Chỉ tiêu NOXH 2026-2028</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-extrabold text-indigo-600">5,4%/Năm</div>
                <div className="text-xs text-slate-500 font-medium">Lãi suất vay ưu đãi</div>
              </div>
            </div>
          </section>

          {/* ── SECTION 2 ── */}
          <section id="danh-sach-du-an-nha-o-xa-hoi-bien-hoa-2026" className="mb-10 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white text-sm font-bold">2</span>
              Danh sách dự án nhà ở xã hội Biên Hòa đang triển khai 2026
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Theo công bố mới nhất từ Sở Xây dựng tỉnh Đồng Nai, trên địa bàn thành phố Biên Hòa đang có <strong>5 dự án nhà ở xã hội trọng điểm</strong> đang được xúc tiến và mở bán:
            </p>

            <div className="space-y-4 mb-6">
              {/* Dự án 1 */}
              <div className="p-4 rounded-xl border-2 border-amber-500 bg-amber-50/40 relative">
                <span className="absolute -top-3 right-4 bg-amber-600 text-white text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Dự Án Trọng Điểm Số 1
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  1. K-Home CityView Hố Nai (Kim Oanh Land)
                </h3>
                <p className="text-sm text-slate-600 mb-2">
                  📍 <strong>Vị trí:</strong> Đường Điểu Xiển, phường Hố Nai, TP. Biên Hòa, Đồng Nai
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-700 mb-3 bg-white p-2.5 rounded-lg border border-amber-200">
                  <div><strong>Quy mô:</strong> 2,85 ha (4 block, 22 tầng)</div>
                  <div><strong>Số căn:</strong> 1.328 căn NOXH + 39 Shophouse</div>
                  <div><strong>Giá bán:</strong> Từ 950 Triệu/căn</div>
                  <div><strong>Tiến độ:</strong> Khởi công & chuẩn bị mở bán</div>
                </div>
                <p className="text-sm text-slate-700 mb-3">
                  Dự án NOXH kiểu mẫu quy mô lớn nhất Biên Hòa thiết kế chuẩn Singapore (Surbana Jurong), đạt chứng chỉ xanh EDGE (tiết kiệm 20% điện nước), có hồ bơi, công viên, trường học nội khu.
                </p>
                <button 
                  onClick={() => onNavigate("/k-home-cityview-ho-nai")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition"
                >
                  Xem chi tiết bảng giá & mặt bằng K-Home CityView <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Dự án 2 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  2. Dự án NOXH Long Bình Tân (Eco Residence)
                </h3>
                <p className="text-sm text-slate-600 mb-2">
                  📍 <strong>Vị trí:</strong> Số 52 đường Nguyễn Văn Tỏ, phường Long Bình Tân, TP. Biên Hòa
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-700 mb-2 bg-slate-50 p-2.5 rounded-lg">
                  <div><strong>Quy mô:</strong> 1,4 ha (3 khối tháp 20 tầng)</div>
                  <div><strong>Số căn:</strong> 1.098 căn hộ</div>
                  <div><strong>Giá bán:</strong> 22,3 – 24,5 triệu/m²</div>
                  <div><strong>Trạng thái:</strong> Đã duyệt giá bán</div>
                </div>
              </div>

              {/* Dự án 3 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  3. Dự án NOXH Chung cư A6-A7 Quang Vinh
                </h3>
                <p className="text-sm text-slate-600 mb-2">
                  📍 <strong>Vị trí:</strong> Đường Nguyễn Ái Quốc, phường Quang Vinh, TP. Biên Hòa
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-700 mb-2 bg-slate-50 p-2.5 rounded-lg">
                  <div><strong>Quy mô:</strong> 2 tháp chung cư cao 19 tầng</div>
                  <div><strong>Số căn:</strong> 435 căn hộ</div>
                  <div><strong>Giá bán:</strong> Khoảng 19 – 21 triệu/m²</div>
                  <div><strong>Trạng thái:</strong> Giai đoạn bàn giao / xét duyệt đợt bổ sung</div>
                </div>
              </div>

              {/* Dự án 4 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  4. Dự án NOXH tại Phường Tam Hiệp
                </h3>
                <p className="text-sm text-slate-600 mb-2">
                  📍 <strong>Vị trí:</strong> Phường Tam Hiệp, TP. Biên Hòa (Khu đất hơn 6.400 m²)
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-700 mb-2 bg-slate-50 p-2.5 rounded-lg">
                  <div><strong>Quy mô:</strong> Khối tháp căn hộ hiện đại</div>
                  <div><strong>Số căn:</strong> 520 căn hộ (45m² – 69m²)</div>
                  <div><strong>Thời gian:</strong> 2026 – 2028</div>
                  <div><strong>Trạng thái:</strong> Đang hoàn thiện pháp lý</div>
                </div>
              </div>

              {/* Dự án 5 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  5. Dự án NOXH Phường Phước Tân
                </h3>
                <p className="text-sm text-slate-600 mb-2">
                  📍 <strong>Vị trí:</strong> Phường Phước Tân, TP. Biên Hòa
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-700 mb-2 bg-slate-50 p-2.5 rounded-lg">
                  <div><strong>Quy mô:</strong> Phân khu cao tầng</div>
                  <div><strong>Số căn:</strong> 478 căn hộ</div>
                  <div><strong>Trạng thái:</strong> Đang triển khai mời thầu xây dựng</div>
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 3: TIÊU ĐIỂM K-HOME CITYVIEW ── */}
          <section id="k-home-cityview-ho-nai-du-an-trong-diem" className="mb-10 scroll-mt-20 bg-gradient-to-br from-amber-50 to-orange-50/50 p-6 rounded-2xl border border-amber-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-600" />
              Tiêu điểm: K-Home CityView Hố Nai – Chuẩn Singapore Lớn Nhất Biên Hòa
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Trong 5 dự án trên, <strong>K-Home CityView Hố Nai</strong> được đánh giá là dự án nổi bật và đáng mua nhất năm 2026 nhờ 4 ưu thế vượt trội:
            </p>

            <img 
              src="/k-home cityview/V34_TAN-HOA_EXT_FACADE_FINAL_2.webp" 
              alt="Phối cảnh dự án nhà ở xã hội K-Home CityView Hố Nai Biên Hòa" 
              className="w-full h-64 md:h-80 object-cover rounded-xl mb-4 border border-amber-200 shadow-sm"
              loading="lazy"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="bg-white p-3.5 rounded-xl border border-amber-100 flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Vị trí tâm điểm công nghiệp:</strong> Mặt tiền đường Điểu Xiển rộng 24m, kết nối trực tiếp Quốc lộ 1A và KCN Amata chỉ 5 phút di chuyển.
                </div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-amber-100 flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Kiến trúc Singapore & Tiêu chuẩn EDGE:</strong> 100% căn hộ đón gió đối lưu tự nhiên, tiết kiệm 20% tiền điện nước mỗi tháng.
                </div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-amber-100 flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Đa dạng loại hình (1PN, 2PN, 3PN):</strong> Diện tích linh hoạt từ 47,3m² đến 84,4m², phù hợp cả người độc thân lẫn gia đình đa thế hệ.
                </div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-amber-100 flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Bàn giao nội thất hoàn thiện:</strong> Sàn gỗ, thiết bị vệ sinh, tủ bếp đầy đủ. Nhận nhà chỉ việc dọn vào ở.
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => onNavigate("/k-home-cityview-ho-nai")}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition shadow-sm"
              >
                Xem Trang Dự Án K-Home CityView
              </button>
              <button 
                onClick={() => onNavigate("/tinh-tra-gop")}
                className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold px-4 py-2.5 rounded-xl text-sm transition"
              >
                Tính Bảng Trả Góp Gói 5,4%
              </button>
            </div>
          </section>

          {/* ── SECTION 4 ── */}
          <section id="dieu-kien-mua-nha-o-xa-hoi-bien-hoa-2026" className="mb-10 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white text-sm font-bold">3</span>
              Điều kiện mua nhà ở xã hội Biên Hòa 2026 theo quy định mới
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Theo Luật Nhà ở 2023 và các Nghị định hướng dẫn thi hành, quy định xét duyệt mua nhà ở xã hội tại Đồng Nai đã được nới lỏng rất nhiều, tạo điều kiện thuận lợi nhất cho người có nhu cầu ở thực:
            </p>

            <div className="space-y-3 mb-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  1. Điều kiện thu nhập (Nới rộng)
                </h4>
                <p className="text-sm text-slate-700">
                  - <strong>Người độc thân:</strong> Thu nhập thực nhận sau thuế không vượt quá <strong>15 triệu đồng/tháng</strong>.<br />
                  - <strong>Hộ gia đình hai vợ chồng:</strong> Tổng thu nhập thực nhận sau thuế của 2 vợ chồng không vượt quá <strong>30 triệu đồng/tháng</strong>.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  2. Điều kiện nhà ở (Xác thực VNeID)
                </h4>
                <p className="text-sm text-slate-700">
                  Chưa đứng tên sở hữu nhà ở hoặc quyền sử dụng đất ở tại địa bàn tỉnh Đồng Nai. Hoặc có nhà ở nhưng diện tích bình quân đầu người dưới 15m² sàn/người.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                  3. Xóa bỏ rào cản Hộ khẩu thường trú (KT1/KT3)
                </h4>
                <p className="text-sm text-slate-700">
                  Người lao động có hộ khẩu bất kỳ tỉnh thành nào trên cả nước, chỉ cần có hợp đồng lao động và tham gia Bảo hiểm Xã hội (BHXH) tại Đồng Nai từ 12 tháng trở lên đều được nộp hồ sơ xét duyệt bình đẳng.
                </p>
              </div>
            </div>
          </section>

          {/* ── SECTION 5 ── */}
          <section id="ho-so-thu-tuc-mua-noxh-bien-hoa" className="mb-10 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white text-sm font-bold">4</span>
              Hồ sơ mua NOXH Biên Hòa: Trọn bộ giấy tờ & biểu mẫu chuẩn
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Người mua cần chuẩn bị bộ hồ sơ gồm 4 nhóm giấy tờ căn bản sau:
            </p>
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
                    <td className="p-3">Xác nhận thu nhập dưới 15tr (hoặc dưới 30tr/cặp)</td>
                    <td className="p-3">Cơ quan/doanh nghiệp đang làm việc</td>
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

          {/* ── SECTION 6 ── */}
          <section id="gia-va-chinh-sach-vay-lai-suat-5-4" className="mb-10 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white text-sm font-bold">5</span>
              Giá bán & gói vay 5,4%/năm: Cần bao nhiêu tiền để mua NOXH Biên Hòa?
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Nhờ chính sách bảo trợ xã hội, người mua nhà ở xã hội Biên Hòa được Ngân hàng Chính sách Xã hội (VBSP) hỗ trợ gói tín dụng ưu đãi vượt trội:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-center">
                <div className="text-xs text-slate-500 font-bold uppercase mb-1">Vốn Ban Đầu Cần Có</div>
                <div className="text-2xl font-extrabold text-amber-700">Chỉ 20%</div>
                <div className="text-xs text-slate-600 mt-1">Khoảng 190 – 250 Triệu VNĐ</div>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-center">
                <div className="text-xs text-slate-500 font-bold uppercase mb-1">Hạn Mức Vay Vốn</div>
                <div className="text-2xl font-extrabold text-emerald-700">Tối Đa 80%</div>
                <div className="text-xs text-slate-600 mt-1">Thời hạn vay lên tới 25 năm</div>
              </div>
              <div className="bg-sky-50 p-4 rounded-xl border border-sky-200 text-center">
                <div className="text-xs text-slate-500 font-bold uppercase mb-1">Lãi Suất Cố Định</div>
                <div className="text-2xl font-extrabold text-sky-700">5,4%/Năm</div>
                <div className="text-xs text-slate-600 mt-1">Trả góp từ 3,5 – 5,5 triệu/tháng</div>
              </div>
            </div>
            <p className="text-sm text-slate-600 italic">
              *Số tiền trả góp mỗi tháng tương đương hoặc thậm chí thấp hơn chi phí thuê một phòng trọ gia đình tại Biên Hòa, sau 25 năm căn nhà hoàn toàn thuộc quyền sở hữu vĩnh viễn của bạn.
            </p>
          </section>

          {/* ── SECTION 7: BẢNG SO SÁNH ── */}
          <section id="so-sanh-cac-du-an-noxh-bien-hoa" className="mb-10 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white text-sm font-bold">6</span>
              Nên chọn dự án NOXH nào tại Biên Hòa? Bảng so sánh chi tiết
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Bảng so sánh 5 dự án nhà ở xã hội Biên Hòa giúp khách hàng lựa chọn dự án phù hợp với nơi làm việc và ngân sách gia đình:
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-200 mb-6">
              <table className="w-full text-xs md:text-sm text-left border-collapse">
                <thead className="bg-slate-800 text-white font-semibold">
                  <tr>
                    <th className="p-3">Dự án</th>
                    <th className="p-3">Vị trí</th>
                    <th className="p-3">Giá tham khảo</th>
                    <th className="p-3">Quy mô</th>
                    <th className="p-3">Tiện ích nổi bật</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-amber-50/60 font-medium">
                    <td className="p-3 font-bold text-amber-800">K-Home CityView</td>
                    <td className="p-3">Hố Nai (Đường Điểu Xiển)</td>
                    <td className="p-3 font-bold text-emerald-700">Từ 950 tr/căn</td>
                    <td className="p-3">1.328 căn</td>
                    <td className="p-3">Hồ bơi, chuẩn EDGE, Surbana Jurong, trường học</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3 font-semibold">Eco Residence</td>
                    <td className="p-3">Long Bình Tân (Nguyễn Văn Tỏ)</td>
                    <td className="p-3">22 – 24 tr/m²</td>
                    <td className="p-3">1.098 căn</td>
                    <td className="p-3">Gần KCN Biên Hòa 2, shophouse khối đế</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-3 font-semibold">A6-A7 Quang Vinh</td>
                    <td className="p-3">Quang Vinh (Nguyễn Ái Quốc)</td>
                    <td className="p-3">19 – 21 tr/m²</td>
                    <td className="p-3">435 căn</td>
                    <td className="p-3">Trung tâm thành phố, kết nối nhanh chợ Biên Hòa</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3 font-semibold">NOXH Tam Hiệp</td>
                    <td className="p-3">Phường Tam Hiệp</td>
                    <td className="p-3">Đang cập nhật</td>
                    <td className="p-3">520 căn</td>
                    <td className="p-3">Khu dân cư hiện hữu sầm uất</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-3 font-semibold">NOXH Phước Tân</td>
                    <td className="p-3">Phường Phước Tân</td>
                    <td className="p-3">Đang cập nhật</td>
                    <td className="p-3">478 căn</td>
                    <td className="p-3">Gần đường Võ Nguyên Giáp, kết nối tránh QL1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ── SECTION 8: FAQ ── */}
          <section id="cau-hoi-thuong-gap-faq" className="mb-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white text-sm font-bold">7</span>
              Câu hỏi thường gặp về nhà ở xã hội Biên Hòa (FAQ)
            </h2>

            <div className="space-y-3">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">
                  Q1: Mua nhà ở xã hội Biên Hòa có phải trả phí chênh hoặc phí môi giới không?
                </h4>
                <p className="text-sm text-slate-700">
                  <strong>Trả lời:</strong> Tuyệt đối KHÔNG. Giá bán nhà ở xã hội được Sở Xây dựng tỉnh Đồng Nai thẩm định và phê duyệt giá trần niêm yết. Mọi hành vi thu thêm tiền chênh lệch hoặc phí suất nội bộ đều trái pháp luật. Quý khách hàng hãy liên hệ trực tiếp văn phòng chủ đầu tư để được hỗ trợ nộp hồ sơ miễn phí 100%.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">
                  Q2: Tôi làm lao động tự do không có hợp đồng lao động tại Biên Hòa thì có mua được không?
                </h4>
                <p className="text-sm text-slate-700">
                  <strong>Trả lời:</strong> Có thể được. Người lao động tự do thuộc nhóm đối tượng thu nhập thấp tại đô thị có thể xin xác nhận của UBND phường nơi đang tạm trú theo mẫu quy định về tình trạng nhà ở và thu nhập để nộp hồ sơ xét duyệt.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">
                  Q3: Sau bao lâu thì căn hộ nhà ở xã hội Biên Hòa được cấp sổ hồng và được chuyển nhượng?
                </h4>
                <p className="text-sm text-slate-700">
                  <strong>Trả lời:</strong> Căn hộ NOXH được cấp giấy chứng nhận quyền sở hữu nhà ở (sổ hồng) lâu dài sau khi bàn giao. Theo luật, sau thời hạn <strong>5 năm</strong> kể từ ngày thanh toán hết tiền mua nhà, chủ sở hữu được quyền bán lại theo giá thị trường cho bất kỳ ai mà không bị giới hạn đối tượng.
                </p>
              </div>
            </div>
          </section>

          {/* Call to action cuối bài */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-1">Cần hỗ trợ kiểm tra điều kiện hồ sơ NOXH Biên Hòa?</h3>
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
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Form đăng ký nhận bảng giá & tư vấn hồ sơ */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm uppercase tracking-wider mb-2">
              <ShieldCheck className="w-5 h-5" />
              Tư Vấn Hồ Sơ Miễn Phí
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Đăng Ký Nhận Bảng Giá NOXH Biên Hòa 2026
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Nhận trọn bộ tài liệu Mẫu 01, Mẫu 02, Mẫu 04 và danh sách căn hộ đẹp nhất trực tiếp từ chủ đầu tư.
            </p>

            {formSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-center">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <div className="font-bold text-sm">Đã gửi thông tin thành công!</div>
                <div className="text-xs text-emerald-700 mt-1">Chuyên viên pháp lý sẽ liên hệ hỗ trợ bạn trong vòng 15 phút.</div>
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
                    <option value="K-Home CityView Hố Nai">K-Home CityView Hố Nai (Biên Hòa)</option>
                    <option value="K-Home Midtown Trảng Bom">K-Home Midtown (Trảng Bom)</option>
                    <option value="K-Home Avenue Nhơn Trạch">K-Home Avenue (Nhơn Trạch)</option>
                    <option value="Tất cả dự án NOXH Đồng Nai">Tất cả dự án NOXH Đồng Nai</option>
                  </select>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  Gửi Yêu Cầu Tư Vấn Ngay
                </button>
                <div className="text-[11px] text-slate-400 text-center">
                  🔒 Thông tin của bạn được cam kết bảo mật 100%
                </div>
              </form>
            )}

            {/* Quick Contact Info */}
            <div className="mt-5 pt-5 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-600" />
                <span>Hotline: <a href="tel:0937587438" className="font-bold text-slate-900 hover:text-amber-600">0937 587 438</a></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Văn phòng: Đường Điểu Xiển, P. Hố Nai, Biên Hòa</span>
              </div>
            </div>
          </div>

          {/* Dự án liên quan */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm mb-3">Dự án cùng hệ thống K-Home</h4>
            <div className="space-y-3">
              <div 
                onClick={() => onNavigate("/k-home-midtown-trang-bom")}
                className="group cursor-pointer flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition"
              >
                <img 
                  src="/k-home midtown/Du-an-K-Home-Midtown-3d-birdview-toan-canh-dem-2048x1150.webp" 
                  alt="K-Home Midtown Trảng Bom" 
                  className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition">K-Home Midtown Trảng Bom</div>
                  <div className="text-[11px] text-slate-500">542 căn • Giá từ 750 Triệu</div>
                </div>
              </div>
              <div 
                onClick={() => onNavigate("/k-home-avenue-nhon-trach")}
                className="group cursor-pointer flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition"
              >
                <img 
                  src="/k-home avenue/PC01-TT-copy_2_2-min.jpg.webp" 
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

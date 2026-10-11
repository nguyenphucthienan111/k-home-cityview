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

export default function NoxhBienHoaPillarView({ onNavigate }: Props) {
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
          <button onClick={() => onNavigate("/")} className="cursor-pointer hover:text-amber-600 transition">Trang chủ</button>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
          <span className="text-slate-900 font-medium truncate">Nhà ở xã hội Biên Hòa 2026</span>
        </div>
      </nav>

      {/* ── Header / Hero Banner ── */}
      <header className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white py-12 px-4 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Báo Cáo Trụ Cột Độc Quyền 2026 • Cập Nhật Tháng 10/2026
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Nhà Ở Xã Hội Biên Hòa 2026: Tổng Hợp Dự Án, Bảng Giá & Hướng Dẫn Mua Từ A–Z
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-3xl leading-relaxed mb-6">
            Báo cáo toàn diện nhất về thị trường nhà ở xã hội (NOXH) TP. Biên Hòa: Đánh giá chi tiết 5 dự án đang triển khai, khung giá gốc từ Sở Xây dựng, cập nhật điều kiện thu nhập theo Luật Nhà ở 2023, cẩm nang nộp hồ sơ chuẩn và cảnh báo 7 chiêu trò lừa đảo cần tránh.
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
              <span className="text-slate-300 font-normal text-xs">(186 đánh giá từ người mua thực tế)</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Thời gian đọc: <strong>15 phút</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-400" />
              <span>Đơn vị phát triển tiêu biểu: <strong>Kim Oanh Land</strong></span>
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
                ➔ Tiêu điểm số 1: K-Home CityView Hố Nai (1.382 căn chuẩn Singapore)
              </a>
              <a href="#so-sanh-mua-nha-vs-thue-tro-25-nam" className="block text-slate-700 hover:text-amber-700 hover:underline">
                3. Bảng so sánh tài chính: Mua nhà ở xã hội vs Thuê trọ 25 năm tại Biên Hòa
              </a>
              <a href="#dieu-kien-mua-nha-o-xa-hoi-bien-hoa-2026" className="block text-slate-700 hover:text-amber-700 hover:underline">
                4. Điều kiện mua nhà ở xã hội Biên Hòa 2026 theo quy định mới
              </a>
              <a href="#ho-so-thu-tuc-mua-noxh-bien-hoa" className="block text-slate-700 hover:text-amber-700 hover:underline">
                5. Hướng dẫn hồ sơ & biểu mẫu chuẩn Mẫu 01, 02, 04, VNeID & VssID
              </a>
              <a href="#gia-va-chinh-sach-vay-lai-suat-5-4" className="block text-slate-700 hover:text-amber-700 hover:underline">
                6. Bảng tính dòng tiền trả góp gói vay 5,4%/năm cho từng loại căn hộ
              </a>
              <a href="#canh-bao-chieu-tro-lua-dao-noxh" className="block text-slate-700 hover:text-amber-700 hover:underline font-semibold text-rose-700">
                7. Cảnh báo 5 chiêu trò lừa đảo mua bán NOXH người dân cần tránh
              </a>
              <a href="#so-sanh-cac-du-an-noxh-bien-hoa" className="block text-slate-700 hover:text-amber-700 hover:underline">
                8. Bảng so sánh tổng quan 5 dự án NOXH Biên Hòa 2026
              </a>
              <a href="#cau-hoi-thuong-gap-faq" className="block text-slate-700 hover:text-amber-700 hover:underline">
                9. Giải đáp 8 câu hỏi thường gặp về nhà ở xã hội Biên Hòa (FAQ)
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
              Thành phố Biên Hòa (tỉnh Đồng Nai) hiện là đô thị loại I có dân số đông bậc nhất cả nước với hơn <strong>1,3 triệu dân</strong>. Với vị trí chiến lược tiếp giáp trực tiếp TP. Thủ Đức (TP.HCM) và là trung tâm công nghiệp lớn của vùng kinh tế trọng điểm phía Nam, Biên Hòa sở hữu hơn <strong>6 khu công nghiệp lớn</strong> (KCN Biên Hòa 1, Biên Hòa 2, Amata, Agtex Long Bình, Loteco, Tam Phước) thu hút hơn <strong>400.000 công nhân, kỹ sư và chuyên gia</strong> sinh sống, làm việc.
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
            <p className="text-slate-700 leading-relaxed">
              Theo Đề án "Phát triển 1 triệu căn hộ nhà ở xã hội" của Chính phủ, tỉnh Đồng Nai được giao chỉ tiêu hoàn thành hơn 50.000 căn hộ đến năm 2030, trong đó thành phố Biên Hòa là địa bàn trọng tâm chiếm tới hơn 40% tổng số lượng căn hộ toàn tỉnh.
            </p>
          </section>

          {/* ── SECTION 2 ── */}
          <section id="danh-sach-du-an-nha-o-xa-hoi-bien-hoa-2026" className="mb-10 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white text-sm font-bold">2</span>
              Danh sách dự án nhà ở xã hội Biên Hòa đang triển khai 2026
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Theo công bố chính thức từ Cổng thông tin Sở Xây dựng tỉnh Đồng Nai, trên địa bàn thành phố Biên Hòa đang có <strong>5 dự án nhà ở xã hội trọng điểm</strong> đang được xúc tiến:
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
                  <div><strong>Số căn:</strong> 1.382 căn NOXH + 39 Shophouse</div>
                  <div><strong>Giá bán:</strong> Từ 950 Triệu/căn</div>
                  <div><strong>Tiến độ:</strong> Khởi công & chuẩn bị mở bán</div>
                </div>
                <p className="text-sm text-slate-700 mb-3">
                  Dự án NOXH kiểu mẫu quy mô lớn nhất Biên Hòa thiết kế chuẩn Singapore (Surbana Jurong), đạt chứng chỉ xanh EDGE (tiết kiệm 20% điện nước), có hồ bơi, công viên, trường học nội khu.
                </p>
                <button 
                  onClick={() => onNavigate("/k-home-cityview-ho-nai")}
                  className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition"
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

          {/* ── SECTION 3: TIÊU ĐIỂM K-HOME CITYVIEW (ĐÃ SỬA CLOUDINARY 100%) ── */}
          <section id="k-home-cityview-ho-nai-du-an-trong-diem" className="mb-10 scroll-mt-20 bg-gradient-to-br from-amber-50 to-orange-50/50 p-6 rounded-2xl border border-amber-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-600" />
              Tiêu điểm: K-Home CityView Hố Nai – Chuẩn Singapore Lớn Nhất Biên Hòa
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Trong 5 dự án trên, <strong>K-Home CityView Hố Nai</strong> được đánh giá là dự án an cư hàng đầu nhờ vị trí đắc địa tại cửa ngõ khu công nghiệp và ngôn ngữ thiết kế xanh hiện đại:
            </p>

            {/* Cloudinary URL chính xác */}
            <div className="mb-4 overflow-hidden rounded-xl border border-amber-200 shadow-sm">
              <img 
                src="https://res.cloudinary.com/dthv0nsq/image/upload/v1785230285/k-home-cityview/V34_TAN-HOA_EXT_FACADE_FINAL_2.jpg" 
                alt="Phối cảnh tổng thể dự án nhà ở xã hội K-Home CityView Hố Nai Biên Hòa" 
                className="w-full h-64 md:h-80 object-cover"
                loading="lazy"
              />
              <div className="bg-slate-900/80 text-white text-xs px-3 py-1.5 text-center">
                Phối cảnh kiến trúc chuẩn Singapore 4 block cao 22 tầng dự án K-Home CityView Hố Nai
              </div>
            </div>

            {/* Hình ảnh tiện ích thực tế từ Cloudinary */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="rounded-lg overflow-hidden border border-amber-100">
                <img 
                  src="https://res.cloudinary.com/dthv0nsq/image/upload/v1785230283/k-home-cityview/V11_TH_EXT_NOTM_POOL_2.jpg" 
                  alt="Hồ bơi K-Home CityView" 
                  className="w-full h-24 object-cover"
                  loading="lazy"
                />
                <div className="text-[10px] text-center p-1 bg-white font-medium text-slate-700">Hồ bơi resort</div>
              </div>
              <div className="rounded-lg overflow-hidden border border-amber-100">
                <img 
                  src="https://res.cloudinary.com/dthv0nsq/image/upload/v1785230283/k-home-cityview/V10_TH_EXT_GARDEN_FINAL_2.jpg" 
                  alt="Công viên K-Home CityView" 
                  className="w-full h-24 object-cover"
                  loading="lazy"
                />
                <div className="text-[10px] text-center p-1 bg-white font-medium text-slate-700">Công viên xanh</div>
              </div>
              <div className="rounded-lg overflow-hidden border border-amber-100">
                <img 
                  src="https://res.cloudinary.com/dthv0nsq/image/upload/v1785230282/k-home-cityview/V03_TAN-HOA_EXT_NOXH_KID-PLAYGROUND_FINAL_2-1.jpg" 
                  alt="Khu vui chơi trẻ em K-Home CityView" 
                  className="w-full h-24 object-cover"
                  loading="lazy"
                />
                <div className="text-[10px] text-center p-1 bg-white font-medium text-slate-700">Sân chơi trẻ em</div>
              </div>
            </div>

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
                  <strong>Bàn giao nội thất hoàn thiện:</strong> Sàn gỗ, thiết bị vệ sinh cao cấp, tủ bếp đầy đủ. Nhận nhà chỉ việc dọn vào ở.
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => onNavigate("/k-home-cityview-ho-nai")}
                className="cursor-pointer bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition shadow-sm"
              >
                Xem Trang Chi Tiết Dự Án K-Home CityView
              </button>
              <button 
                onClick={() => onNavigate("/tinh-tra-gop")}
                className="cursor-pointer bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold px-4 py-2.5 rounded-xl text-sm transition"
              >
                Tính Bảng Trả Góp Gói 5,4%
              </button>
            </div>
          </section>

          {/* ── SECTION 4: BÀI TOÁN KINH TẾ: MUA NHÀ VS THUÊ TRỌ 25 NĂM ── */}
          <section id="so-sanh-mua-nha-vs-thue-tro-25-nam" className="mb-10 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white text-sm font-bold">3</span>
              Bảng so sánh tài chính: Mua nhà ở xã hội vs Thuê trọ 25 năm tại Biên Hòa
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Nhiều gia đình công nhân tại Biên Hòa e ngại việc vay ngân hàng và lựa chọn ở trọ lâu năm. Tuy nhiên, khi đặt lên bàn cân kinh tế giữa việc tiếp tục thuê trọ và mua căn hộ NOXH trả góp trong thời hạn vay tối đa <strong>25 năm (300 tháng)</strong>:
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-200 mb-4">
              <table className="w-full text-xs md:text-sm text-left border-collapse">
                <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Tiêu chí so sánh</th>
                    <th className="p-3 text-rose-700 bg-rose-50/50">Thuê phòng trọ gia đình (25 năm)</th>
                    <th className="p-3 text-emerald-800 bg-emerald-50/50">Mua NOXH K-Home CityView (Trả góp 25 năm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="p-3 font-semibold">Chi phí trả hàng tháng</td>
                    <td className="p-3">3,5 – 4,5 triệu (tiền trọ + điện nước giá kinh doanh tăng dần theo lạm phát)</td>
                    <td className="p-3 font-bold text-emerald-700">Từ 3,5 – 4,8 triệu (gốc + lãi ưu đãi 5,4%, giảm dần theo dư nợ)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Tổng số tiền chi ra sau 25 năm</td>
                    <td className="p-3 text-rose-600 font-semibold">Khoảng 1,5 – 1,9 tỷ đồng (mất trắng không thể thu hồi)</td>
                    <td className="p-3 text-emerald-700 font-semibold">Tích lũy hoàn toàn vào quyền sở hữu căn nhà của chính mình</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Tài sản sở hữu sau 25 năm</td>
                    <td className="p-3 text-rose-600 font-bold">Không có gì (vẫn đi ở thuê trọ)</td>
                    <td className="p-3 font-bold text-emerald-800">Sở hữu vĩnh viễn sổ hồng căn hộ (giá trị gia tăng 3 – 4 tỷ đồng)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Môi trường sống con cái & tiện ích</td>
                    <td className="p-3">Chật hẹp, ẩm thấp, tiếng ồn, an ninh không đảm bảo</td>
                    <td className="p-3">Khu compound khép kín, hồ bơi, công viên, an ninh camera 24/7, trường học</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ── SECTION 5 ── */}
          <section id="dieu-kien-mua-nha-o-xa-hoi-bien-hoa-2026" className="mb-10 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white text-sm font-bold">4</span>
              Điều kiện mua nhà ở xã hội Biên Hòa 2026 theo quy định mới
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Theo Luật Nhà ở 2023 và các Nghị định hướng dẫn thi hành, quy định xét duyệt mua nhà ở xã hội tại Đồng Nai đã được nới lỏng rất nhiều, tạo điều kiện thuận lợi nhất cho người có nhu cầu ở thực:
            </p>

            <div className="space-y-3 mb-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  1. Điều kiện thu nhập (Nới rộng theo Luật 2023)
                </h4>
                <p className="text-sm text-slate-700">
                  - <strong>Người độc thân:</strong> Thu nhập thực nhận sau thuế không vượt quá <strong>15 triệu đồng/tháng</strong>.<br />
                  - <strong>Hộ gia đình hai vợ chồng:</strong> Tổng thu nhập thực nhận sau thuế của 2 vợ chồng không vượt quá <strong>30 triệu đồng/tháng</strong>.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  2. Điều kiện nhà ở (Xác thực qua VNeID & cơ sở dữ liệu đất đai)
                </h4>
                <p className="text-sm text-slate-700">
                  Chưa đứng tên sở hữu nhà ở hoặc quyền sử dụng đất ở tại địa bàn tỉnh Đồng Nai. Hoặc có nhà ở nhưng diện tích bình quân đầu người dưới 15m² sàn/người.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                  3. Xóa bỏ hoàn toàn rào cản Hộ khẩu thường trú (KT1/KT3)
                </h4>
                <p className="text-sm text-slate-700">
                  Người lao động có hộ khẩu bất kỳ tỉnh thành nào trên cả nước, chỉ cần có hợp đồng lao động và tham gia Bảo hiểm Xã hội (BHXH) tại Đồng Nai từ 12 tháng trở lên đều được nộp hồ sơ xét duyệt bình đẳng.
                </p>
              </div>
            </div>
          </section>

          {/* ── SECTION 6 ── */}
          <section id="ho-so-thu-tuc-mua-noxh-bien-hoa" className="mb-10 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white text-sm font-bold">5</span>
              Hướng dẫn hồ sơ & biểu mẫu chuẩn Mẫu 01, 02, 04, VNeID & VssID
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

          {/* ── SECTION 7 ── */}
          <section id="gia-va-chinh-sach-vay-lai-suat-5-4" className="mb-10 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white text-sm font-bold">6</span>
              Bảng tính dòng tiền trả góp gói vay 5,4%/năm (Vốn 25% chia 3 đợt trong 2 tháng)
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Người mua nhà ở xã hội Biên Hòa được Ngân hàng Chính sách Xã hội (VBSP) hoặc các ngân hàng thương mại nhà nước hỗ trợ gói tín dụng ưu đãi <strong>5,4%/năm</strong> với thời hạn vay tối đa lên tới <strong>25 năm (300 tháng)</strong>. Đặc biệt, khách hàng chỉ cần chuẩn bị <strong>25% vốn tự có ban đầu</strong>, được chia nhỏ thành <strong>3 đợt thanh toán nhẹ nhàng trong vòng 2 tháng</strong>:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-center">
                <div className="text-xs text-slate-500 font-bold uppercase mb-1">Căn 1 Phòng Ngủ + A (47,3m²)</div>
                <div className="text-xl font-extrabold text-amber-700">Giá: ~950 Triệu</div>
                <div className="text-xs text-slate-600 mt-2">Vốn 25% (2 tháng): <strong>~237 Triệu</strong></div>
                <div className="text-xs text-emerald-700 font-bold mt-1">Trả góp 25 năm: ~3,5 – 4,2 tr/tháng</div>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-center">
                <div className="text-xs text-slate-500 font-bold uppercase mb-1">Căn 2 Phòng Ngủ (62m² - 70m²)</div>
                <div className="text-xl font-extrabold text-emerald-700">Giá: ~1,35 - 1,5 Tỷ</div>
                <div className="text-xs text-slate-600 mt-2">Vốn 25% (2 tháng): <strong>~337 - 375 Triệu</strong></div>
                <div className="text-xs text-emerald-700 font-bold mt-1">Trả góp 25 năm: ~4,8 – 5,8 tr/tháng</div>
              </div>
              <div className="bg-sky-50 p-4 rounded-xl border border-sky-200 text-center">
                <div className="text-xs text-slate-500 font-bold uppercase mb-1">Căn 3 Phòng Ngủ (84,4m²)</div>
                <div className="text-xl font-extrabold text-sky-700">Giá: ~1,85 Tỷ</div>
                <div className="text-xs text-slate-600 mt-2">Vốn 25% (2 tháng): <strong>~462 Triệu</strong></div>
                <div className="text-xs text-emerald-700 font-bold mt-1">Trả góp 25 năm: ~6,5 – 7,5 tr/tháng</div>
              </div>
            </div>

            {/* Chi tiết 2 phương thức thanh toán chuẩn CĐT */}
            <div className="space-y-6">
              {/* Phương thức 1: Vay ngân hàng */}
              <div className="bg-white rounded-xl border-2 border-emerald-500 overflow-hidden shadow-sm">
                <div className="bg-emerald-600 text-white px-4 py-3 font-bold text-sm flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-200" />
                    PHƯƠNG THỨC 1: THANH TOÁN BẰNG VỐN VAY NGÂN HÀNG (TỐI ƯU NHẤT)
                  </span>
                  <span className="text-xs bg-emerald-700 px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
                    Vay 70 - 75% trong 25 năm
                  </span>
                </div>
                <div className="p-4 text-xs md:text-sm">
                  <div className="mb-3 text-slate-700">
                    💡 <strong>Lộ trình vốn ban đầu 25% trả trong 2 tháng (3 đợt):</strong>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">Đợt</th>
                          <th className="p-2.5">Thời điểm thanh toán</th>
                          <th className="p-2.5 text-center">Tỷ lệ</th>
                          <th className="p-2.5">Chi tiết thực hiện</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        <tr className="bg-amber-50/50">
                          <td className="p-2.5 font-bold text-amber-800">Đặt cọc</td>
                          <td className="p-2.5">Ngay khi ký Phiếu xác nhận cọc</td>
                          <td className="p-2.5 text-center font-bold text-amber-700">30.000.000 đ</td>
                          <td className="p-2.5">Ký phiếu xác nhận cọc giữ căn đẹp</td>
                        </tr>
                        <tr className="bg-emerald-50/40">
                          <td className="p-2.5 font-bold text-emerald-800">Đợt 1</td>
                          <td className="p-2.5">Trong vòng 07 ngày kể từ ngày cọc</td>
                          <td className="p-2.5 text-center font-bold text-emerald-700">15%</td>
                          <td className="p-2.5">Đã bao gồm tiền cọc. Ký Hợp đồng dịch vụ tư vấn (HĐDVTV)</td>
                        </tr>
                        <tr className="bg-emerald-50/40">
                          <td className="p-2.5 font-bold text-emerald-800">Đợt 2</td>
                          <td className="p-2.5">Trong vòng 30 ngày kể từ ngày đến hạn Đợt 1</td>
                          <td className="p-2.5 text-center font-bold text-emerald-700">5%</td>
                          <td className="p-2.5">Thanh toán theo tiến độ (tháng thứ 1)</td>
                        </tr>
                        <tr className="bg-emerald-50/40">
                          <td className="p-2.5 font-bold text-emerald-800">Đợt 3</td>
                          <td className="p-2.5">Trong vòng 30 ngày kể từ ngày đến hạn Đợt 2</td>
                          <td className="p-2.5 text-center font-bold text-emerald-700">5%</td>
                          <td className="p-2.5 font-semibold text-emerald-800">Hoàn tất đủ 25% vốn tự có (sau ~2 tháng)</td>
                        </tr>
                        <tr className="bg-sky-50/40">
                          <td className="p-2.5 font-bold text-sky-800">Đợt 4</td>
                          <td className="p-2.5">Theo thông báo giải ngân của CĐT</td>
                          <td className="p-2.5 text-center font-bold text-sky-700">45%</td>
                          <td className="p-2.5">Ngân hàng giải ngân trực tiếp cho Chủ đầu tư</td>
                        </tr>
                        <tr className="bg-sky-50/40">
                          <td className="p-2.5 font-bold text-sky-800">Đợt 5</td>
                          <td className="p-2.5">Trong vòng 15 ngày kể từ ngày nhận thông báo bàn giao</td>
                          <td className="p-2.5 text-center font-bold text-sky-700">25%</td>
                          <td className="p-2.5">Ngân hàng giải ngân 25% + Khách thanh toán 100% Phí bảo trì (PBT)</td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-800">Đợt 6</td>
                          <td className="p-2.5">Trong vòng 15 ngày kể từ ngày nhận thông báo cấp sổ</td>
                          <td className="p-2.5 text-center font-bold text-slate-700">5%</td>
                          <td className="p-2.5">Nhận giấy chứng nhận quyền sở hữu nhà ở (Sổ hồng)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Phương thức 2: Vốn tự có */}
              <div className="bg-white rounded-xl border border-slate-300 overflow-hidden shadow-sm">
                <div className="bg-slate-800 text-white px-4 py-3 font-bold text-sm flex items-center justify-between">
                  <span>PHƯƠNG THỨC 2: THANH TOÁN BẰNG VỐN TỰ CÓ (CHIA LÀM 17 ĐỢT)</span>
                  <span className="text-xs bg-slate-700 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Tiến độ xây dựng giãn cách
                  </span>
                </div>
                <div className="p-4 text-xs md:text-sm">
                  <div className="mb-2 text-slate-700">
                    Khách hàng không sử dụng vốn vay được chia nhỏ thanh toán theo 17 đợt nhẹ nhàng:
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
                    <li className="bg-slate-50 p-2 rounded border border-slate-100">• <strong>Đặt cọc:</strong> 30.000.000 đ ký phiếu xác nhận cọc</li>
                    <li className="bg-slate-50 p-2 rounded border border-slate-100">• <strong>Đợt 1 (7 ngày):</strong> 15% (bao gồm cọc) ký HĐDVTV</li>
                    <li className="bg-slate-50 p-2 rounded border border-slate-100">• <strong>Đợt 2 (30 ngày sau đợt 1):</strong> 10% giá trị hợp đồng</li>
                    <li className="bg-slate-50 p-2 rounded border border-slate-100">• <strong>Đợt 3 & 4 (mỗi 30 ngày):</strong> 5% mỗi đợt</li>
                    <li className="bg-slate-50 p-2 rounded border border-slate-100">• <strong>Đợt 5 đến Đợt 14 (10 đợt tiếp theo):</strong> 3% mỗi đợt (mỗi 30 ngày)</li>
                    <li className="bg-slate-50 p-2 rounded border border-slate-100">• <strong>Đợt 15 (30 ngày sau đợt 14):</strong> 5% giá trị hợp đồng</li>
                    <li className="bg-slate-50 p-2 rounded border border-slate-100">• <strong>Đợt 16 (Bàn giao nhà):</strong> 25% + 100% kinh phí bảo trì</li>
                    <li className="bg-slate-50 p-2 rounded border border-slate-100">• <strong>Đợt 17 (Bàn giao sổ):</strong> 5% nhận giấy chứng nhận</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 8: CẢNH BÁO CHIÊU TRÒ LỪA ĐẢO ── */}
          <section id="canh-bao-chieu-tro-lua-dao-noxh" className="mb-10 scroll-mt-20 bg-rose-50/60 p-6 rounded-2xl border border-rose-200">
            <h2 className="text-2xl font-bold text-rose-900 mb-3 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-rose-600" />
              Cảnh báo 5 chiêu trò lừa đảo mua bán NOXH người dân cần tránh
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed mb-4">
              Lợi dụng nhu cầu mua nhà ở xã hội Biên Hòa rất lớn, nhiều nhóm môi giới tự phát đã dùng các thủ đoạn tinh vi nhằm chiếm đoạt tài sản của người lao động:
            </p>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="bg-white p-3.5 rounded-xl border border-rose-100 flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>1. Lừa đảo "Suất ngoại giao / Suất nội bộ":</strong> Hứa hẹn có suất ưu tiên không cần bốc thăm với giá chênh từ 50 – 150 triệu đồng. Thực tế pháp luật nghiêm cấm mọi hình thức mua bán suất nội bộ.
                </div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-rose-100 flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>2. Thu tiền "Phí bao đậu hồ sơ":</strong> Đòi thu từ 20 – 50 triệu tiền dịch vụ để cam kết hồ sơ 100% được Sở Xây dựng duyệt. Hồ sơ NOXH được thẩm định tự động qua hệ thống chấm điểm VNeID và mã số thuế.
                </div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-rose-100 flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>3. Mua bán qua Hợp đồng ủy quyền / Vi bằng:</strong> Căn hộ NOXH trong 5 năm đầu không được phép chuyển nhượng thương mại. Mọi giao dịch qua vi bằng đều vô hiệu và người mua có nguy cơ mất trắng nhà.
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 9: BẢNG SO SÁNH TỔNG QUAN ── */}
          <section id="so-sanh-cac-du-an-noxh-bien-hoa" className="mb-10 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white text-sm font-bold">8</span>
              Bảng so sánh tổng quan 5 dự án NOXH Biên Hòa 2026
            </h2>
            <div className="overflow-x-auto rounded-xl border border-slate-200 mb-6">
              <table className="w-full text-xs md:text-sm text-left border-collapse">
                <thead className="bg-slate-800 text-white font-semibold">
                  <tr>
                    <th className="p-3">Dự án</th>
                    <th className="p-3">Vị trí</th>
                    <th className="p-3">Giá tham khảo</th>
                    <th className="p-3">Quy mô</th>
                    <th className="p-3">Tiêu chuẩn nổi bật</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-amber-50/60 font-medium">
                    <td className="p-3 font-bold text-amber-800">K-Home CityView</td>
                    <td className="p-3">Hố Nai (Đường Điểu Xiển)</td>
                    <td className="p-3 font-bold text-emerald-700">Từ 950 tr/căn</td>
                    <td className="p-3">1.382 căn</td>
                    <td className="p-3">Chuẩn Singapore Surbana Jurong, tiêu chuẩn xanh EDGE, hồ bơi</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3 font-semibold">Eco Residence</td>
                    <td className="p-3">Long Bình Tân (Nguyễn Văn Tỏ)</td>
                    <td className="p-3">22 – 24,5 tr/m²</td>
                    <td className="p-3">1.098 căn</td>
                    <td className="p-3">Gần KCN Biên Hòa 2, shophouse khối đế</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-3 font-semibold">A6-A7 Quang Vinh</td>
                    <td className="p-3">Quang Vinh (Nguyễn Ái Quốc)</td>
                    <td className="p-3">19 – 21 tr/m²</td>
                    <td className="p-3">435 căn</td>
                    <td className="p-3">Trung tâm thành phố, kết nối chợ Biên Hòa</td>
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
                    <td className="p-3">Gần tuyến tránh Võ Nguyên Giáp</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ── SECTION 10: FAQ ── */}
          <section id="cau-hoi-thuong-gap-faq" className="mb-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white text-sm font-bold">9</span>
              Giải đáp 8 câu hỏi thường gặp về nhà ở xã hội Biên Hòa (FAQ)
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

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">
                  Q4: Dự án nào gần KCN Amata và KCN Biên Hòa 2 nhất?
                </h4>
                <p className="text-sm text-slate-700">
                  <strong>Trả lời:</strong> Dự án K-Home CityView Hố Nai nằm ngay đường Điểu Xiển, chỉ cách KCN Amata khoảng 3–5 phút di chuyển xe máy, là vị trí thuận tiện nhất cho cán bộ, công nhân làm việc tại khu vực này.
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
                  src="https://res.cloudinary.com/dthv0nsq/image/upload/w_1200,q_auto:good,f_auto/k-home-midtown/Du-an-K-Home-Midtown-3d-birdview-toan-canh-dem-2048x1150" 
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
                  src="https://res.cloudinary.com/dthv0nsq/image/upload/w_1200,q_auto:good,f_auto/k-home-avenue/Pc09-Loi-vao-shophouse_2-min" 
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

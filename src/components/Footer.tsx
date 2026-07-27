import React from "react";
import { MapPin, Mail, Phone, Clock, ArrowUp, ShieldCheck, Gem } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-b from-white to-amber-50/70 text-slate-600 pt-16 pb-8 border-t border-amber-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand Intro */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/KOG_Web_RGB_01.svg" alt="K-Home Group Logo" className="h-10 w-auto" />
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Kim Oanh Group — Nhà phát triển bất động sản xã hội uy tín tại Đồng Nai, mang sứ mệnh kiến tạo nhà ở chất lượng cho người thu nhập trung bình với lãi suất ưu đãi 5,4%/năm.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-600 font-semibold bg-amber-100/40 px-3 py-1.5 rounded-lg w-fit">
              <Gem className="w-4 h-4 shrink-0 text-amber-500 animate-pulse" />
              <span>Thành viên của Tập đoàn Kim Oanh Group</span>
            </div>
          </div>

          {/* Column 2: Contact Info */}
          <div className="space-y-4">
            <h4 className="text-slate-800 font-bold text-base tracking-wide border-l-3 border-amber-500 pl-3">
              Thông Tin Liên Hệ
            </h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <span>28 Đ. Đồng Khởi, Phường Tam Hiệp, Thành phố Biên Hòa, Tỉnh Đồng Nai</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                <a href="tel:0799898893" className="hover:text-amber-600 font-medium transition-colors">0937.587.438</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                <a href="mailto:info@kimoanh.com.vn" className="hover:text-amber-600 font-medium transition-colors">info@kimoanh.com.vn</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Giờ làm việc: 8:00 - 18:00 (Hằng ngày)</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-slate-800 font-bold text-base tracking-wide border-l-3 border-amber-500 pl-3">
              Danh Mục Dự Án
            </h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <a href="#projects/k-home-cityview-ho-nai" className="hover:text-amber-600 transition-colors flex items-center gap-1">
                  • K-Home CityView Hố Nai
                </a>
              </li>
              <li>
                <a href="#projects/k-home-avenue-nhon-trach" className="hover:text-amber-600 transition-colors flex items-center gap-1">
                  • K-Home Avenue Nhơn Trạch
                </a>
              </li>
              <li>
                <a href="#projects/k-home-midtown-trang-bom" className="hover:text-amber-600 transition-colors flex items-center gap-1">
                  • K-Home Midtown Trảng Bom
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Policy & Admin CRM Link */}
          <div className="space-y-4">
            <h4 className="text-slate-800 font-bold text-base tracking-wide border-l-3 border-amber-500 pl-3">
              Khách Hàng & Đối Tác
            </h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="/about" className="hover:text-amber-600 transition-colors">• Câu chuyện thương hiệu</a></li>
              <li><a href="/contact" className="hover:text-amber-600 transition-colors">• Đăng ký tham quan thực tế</a></li>
            </ul>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-amber-200/60 pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} K-Home CityView. Tất cả quyền được bảo lưu. Bản quyền thuộc về K-Home Group.
          </div>
          <div className="flex items-center gap-6">
            <a href="/about" className="hover:text-amber-600 transition-colors">Điều khoản sử dụng</a>
            <a href="/about" className="hover:text-amber-600 transition-colors">Chính sách bảo mật</a>
            <button
              onClick={scrollToTop}
              className="bg-white hover:bg-amber-50 text-amber-600 p-2.5 rounded-full shadow-sm border border-amber-200 transition-all cursor-pointer flex items-center justify-center hover:scale-110"
              title="Quay lên đầu trang"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

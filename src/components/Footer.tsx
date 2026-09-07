import React, { useState } from "react";
import { MapPin, Mail, Phone, Clock, ArrowUp, Gem, X, ChevronRight } from "lucide-react";

type ModalType = "terms" | "privacy" | null;

const TERMS_CONTENT = {
  title: "Điều Khoản Sử Dụng",
  updated: "Cập nhật lần cuối: 28/07/2026",
  intro: "Việc truy cập và sử dụng website k-homedongnai.com.vn (sau đây gọi là \"Website\") đồng nghĩa với việc bạn đã đọc, hiểu và đồng ý bị ràng buộc bởi các Điều khoản sử dụng dưới đây.",
  sections: [
    {
      title: "1. Thông tin đơn vị quản lý Website",
      content: "Đơn vị quản lý: Công ty Cổ phần Tập đoàn Địa ốc Kim Oanh (Kim Oanh Group)\nĐịa chỉ trụ sở: 268A Phan Trung, phường Tam Hiệp, tỉnh Đồng Nai, Việt Nam\nHotline hỗ trợ: 0937.587.438\nEmail: k.homekog@gmail.com"
    },
    {
      title: "2. Mục đích của Website",
      content: "Website được xây dựng nhằm cung cấp thông tin về các dự án nhà ở xã hội mang thương hiệu K-Home tại Đồng Nai (bao gồm K-Home CityView Hố Nai, K-Home Midtown Trảng Bom, K-Home Avenue Nhơn Trạch) và hỗ trợ khách hàng đăng ký tư vấn, nhận thông tin dự án."
    },
    {
      title: "3. Chấp nhận Điều khoản",
      content: "Bằng việc truy cập, duyệt hoặc sử dụng bất kỳ nội dung nào trên Website, bạn xác nhận đã đọc và đồng ý với toàn bộ Điều khoản này. Nếu bạn không đồng ý, vui lòng ngừng sử dụng Website."
    },
    {
      title: "4. Quyền sở hữu trí tuệ",
      content: "Toàn bộ nội dung trên Website (bao gồm văn bản, hình ảnh, logo, video, thiết kế, mã nguồn…) thuộc quyền sở hữu của Kim Oanh Group hoặc được cấp phép sử dụng hợp pháp. Nghiêm cấm sao chép, phân phối, chỉnh sửa hoặc sử dụng cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản."
    },
    {
      title: "5. Trách nhiệm của Người sử dụng",
      content: "Người sử dụng cam kết:\n• Cung cấp thông tin chính xác, trung thực khi đăng ký tư vấn hoặc gửi form liên hệ.\n• Không sử dụng Website vào mục đích vi phạm pháp luật, gian lận, phát tán virus, spam hoặc gây hại đến hệ thống.\n• Không giả mạo danh tính hoặc thu thập thông tin của người khác một cách trái phép."
    },
    {
      title: "6. Thông tin dự án và miễn trừ trách nhiệm",
      content: "Các thông tin về dự án (giá bán, tiến độ, chính sách bán hàng, tiện ích, mặt bằng…) được cập nhật theo thời điểm và mang tính chất tham khảo. Kim Oanh Land có quyền thay đổi thông tin mà không cần thông báo trước. Thông tin chính thức sẽ được xác nhận qua hợp đồng và văn bản của Chủ đầu tư.\n\nWebsite không phải là kênh nhận đặt cọc hoặc giao kết hợp đồng mua bán. Mọi giao dịch chính thức chỉ được thực hiện tại văn phòng kinh doanh được ủy quyền."
    },
    {
      title: "7. Liên kết bên thứ ba",
      content: "Website có thể chứa liên kết đến website hoặc dịch vụ của bên thứ ba. Chúng tôi không chịu trách nhiệm về nội dung, chính sách bảo mật hoặc hoạt động của các website đó."
    },
    {
      title: "8. Giới hạn trách nhiệm",
      content: "Kim Oanh Group không chịu trách nhiệm đối với:\n• Thiệt hại phát sinh do việc sử dụng hoặc không thể sử dụng Website.\n• Lỗi kỹ thuật, gián đoạn dịch vụ ngoài tầm kiểm soát.\n• Quyết định mua bán của khách hàng dựa trên thông tin tham khảo trên Website."
    },
    {
      title: "9. Thay đổi Điều khoản",
      content: "Chúng tôi có quyền cập nhật, sửa đổi Điều khoản này bất cứ lúc nào. Phiên bản mới sẽ được đăng tải trên Website và có hiệu lực ngay khi công bố."
    },
    {
      title: "10. Luật áp dụng và giải quyết tranh chấp",
      content: "Điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp phát sinh sẽ được ưu tiên giải quyết thông qua thương lượng. Trường hợp không thương lượng được, tranh chấp sẽ được đưa ra Tòa án có thẩm quyền tại tỉnh Đồng Nai."
    },
  ]
};

const PRIVACY_CONTENT = {
  title: "Chính Sách Bảo Mật",
  updated: "Cập nhật lần cuối: 28/07/2026",
  intro: "Chính sách này giải thích cách Công ty Cổ phần Tập đoàn Địa ốc Kim Oanh (Kim Oanh Group) thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu cá nhân của bạn khi sử dụng Website k-homedongnai.com.vn, phù hợp với Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.",
  sections: [
    {
      title: "1. Đơn vị xử lý dữ liệu",
      content: "Tên đơn vị: Công ty Cổ phần Tập đoàn Địa ốc Kim Oanh\nĐịa chỉ: 268A Phan Trung, phường Tam Hiệp, tỉnh Đồng Nai, Việt Nam\nHotline: 0937.587.438\nEmail: k.homekog@gmail.com"
    },
    {
      title: "2. Dữ liệu cá nhân chúng tôi thu thập",
      content: "Chúng tôi có thể thu thập các thông tin sau khi bạn điền form đăng ký tư vấn, gọi điện/nhắn tin qua Zalo/Messenger, hoặc truy cập Website:\n• Họ tên, số điện thoại, email\n• Nhu cầu quan tâm dự án, loại căn hộ\n• Địa chỉ IP, loại trình duyệt, thời gian truy cập\n• Các thông tin khác bạn chủ động cung cấp\n\nChúng tôi không thu thập dữ liệu nhạy cảm trừ khi bạn tự nguyện cung cấp và có sự đồng ý rõ ràng."
    },
    {
      title: "3. Mục đích xử lý dữ liệu",
      content: "Dữ liệu cá nhân được sử dụng để:\n• Liên hệ tư vấn, hỗ trợ hồ sơ nhà ở xã hội\n• Gửi thông tin dự án, chính sách bán hàng, tiến độ\n• Hỗ trợ khách hàng hoàn thiện thủ tục mua nhà\n• Cải thiện chất lượng Website và dịch vụ\n• Tuân thủ yêu cầu của cơ quan nhà nước có thẩm quyền (khi có)"
    },
    {
      title: "4. Cơ sở pháp lý xử lý dữ liệu",
      content: "Việc xử lý dữ liệu dựa trên:\n• Sự đồng ý của bạn (khi gửi form hoặc chấp nhận cookie)\n• Thực hiện hợp đồng / giao dịch tiềm năng\n• Lợi ích hợp pháp của đơn vị (cải thiện dịch vụ, bảo mật hệ thống)\n• Nghĩa vụ pháp lý theo quy định của pháp luật Việt Nam"
    },
    {
      title: "5. Thời gian lưu trữ",
      content: "Dữ liệu được lưu trữ tối đa 36 tháng kể từ lần tương tác cuối cùng, trừ khi pháp luật yêu cầu lưu trữ lâu hơn hoặc bạn yêu cầu xóa sớm hơn."
    },
    {
      title: "6. Chia sẻ dữ liệu với bên thứ ba",
      content: "Chúng tôi không bán dữ liệu cá nhân. Dữ liệu chỉ được chia sẻ trong các trường hợp:\n• Với nhân viên / bộ phận kinh doanh của Kim Oanh Land để tư vấn\n• Với đối tác kỹ thuật (hosting, hệ thống CRM) có cam kết bảo mật\n• Khi có yêu cầu hợp pháp từ cơ quan nhà nước có thẩm quyền\n• Khi bạn đồng ý rõ ràng"
    },
    {
      title: "7. Quyền của Chủ thể dữ liệu",
      content: "Theo Nghị định 13/2023/NĐ-CP, bạn có các quyền:\n• Được biết về việc xử lý dữ liệu\n• Đồng ý hoặc rút lại sự đồng ý\n• Truy cập, chỉnh sửa, xóa dữ liệu\n• Hạn chế xử lý dữ liệu\n• Phản đối việc xử lý dữ liệu\n• Khiếu nại, tố cáo, khởi kiện theo quy định pháp luật\n\nĐể thực hiện quyền, vui lòng liên hệ qua email k.homekog@gmail.com hoặc hotline 0937.587.438."
    },
    {
      title: "8. Bảo mật dữ liệu",
      content: "Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức phù hợp (mã hóa, phân quyền truy cập, tường lửa…) nhằm bảo vệ dữ liệu cá nhân khỏi truy cập trái phép, mất mát hoặc tiết lộ."
    },
    {
      title: "9. Cookie và công nghệ theo dõi",
      content: "Website có thể sử dụng cookie để ghi nhận phiên truy cập, phân tích lưu lượng và cải thiện trải nghiệm. Bạn có thể tắt cookie trên trình duyệt, tuy nhiên một số chức năng của Website có thể bị ảnh hưởng."
    },
    {
      title: "10. Thay đổi Chính sách",
      content: "Chúng tôi có thể cập nhật Chính sách này theo thời gian. Phiên bản mới sẽ được đăng tải trên Website kèm ngày cập nhật."
    },
    {
      title: "11. Liên hệ",
      content: "Công ty Cổ phần Tập đoàn Địa ốc Kim Oanh\nĐịa chỉ: 268A Phan Trung, phường Tam Hiệp, tỉnh Đồng Nai\nHotline: 0937.587.438\nEmail: k.homekog@gmail.com"
    },
  ]
};

export default function Footer() {
  const [modal, setModal] = useState<ModalType>(null);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const content = modal === "terms" ? TERMS_CONTENT : modal === "privacy" ? PRIVACY_CONTENT : null;

  return (
    <>
      <footer className="bg-gradient-to-b from-white to-amber-50/70 text-slate-600 pt-16 pb-8 border-t border-amber-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            {/* Column 1: Brand */}
            <div className="space-y-4">
              <img src="/KOG_Web_RGB_01.svg" alt="K-Home Group Logo" className="h-10 w-auto" />
              <p className="text-slate-500 text-sm leading-relaxed">
                Kim Oanh Group — Nhà phát triển bất động sản xã hội uy tín tại Đồng Nai, mang sứ mệnh kiến tạo nhà ở chất lượng cho người thu nhập trung bình với lãi suất ưu đãi 5,4%/năm.
              </p>
              <div className="flex items-center gap-2 text-xs text-amber-600 font-semibold bg-amber-100/40 px-3 py-1.5 rounded-lg w-fit">
                <Gem className="w-4 h-4 shrink-0 text-amber-500 animate-pulse" />
                <span>Thành viên của Tập đoàn Kim Oanh Group</span>
              </div>
            </div>

            {/* Column 2: Contact */}
            <div className="space-y-4">
              <h4 className="text-slate-800 font-bold text-base tracking-wide border-l-3 border-amber-500 pl-3">Thông Tin Liên Hệ</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <span>268A, Đường Phan Trung, Phường Tam Hiệp, Tỉnh Đồng Nai, Việt Nam</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                  <a href="tel:0937587438" className="hover:text-amber-600 font-medium transition-colors">0937.587.438</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                  <a href="mailto:k.homekog@gmail.com" className="hover:text-amber-600 font-medium transition-colors">k.homekog@gmail.com</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Giờ làm việc: 8:00 - 18:00 (Hằng ngày)</span>
                </li>
              </ul>
            </div>

            {/* Column 3: Projects — Anchor text tối ưu SEO */}
            <div className="space-y-4">
              <h4 className="text-slate-800 font-bold text-base tracking-wide border-l-3 border-amber-500 pl-3">Danh Mục Dự Án NOXH</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>
                  <a href="/k-home-cityview-ho-nai"
                    title="Nhà ở xã hội K-Home CityView Hố Nai Biên Hòa Đồng Nai"
                    className="hover:text-amber-600 transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 shrink-0" />
                    <span>Nhà ở xã hội K-Home CityView Hố Nai</span>
                  </a>
                </li>
                <li>
                  <a href="/k-home-avenue-nhon-trach"
                    title="K-Home Avenue Nhơn Trạch – NOXH gần sân bay Long Thành"
                    className="hover:text-amber-600 transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 shrink-0" />
                    <span>K-Home Avenue Nhơn Trạch – Gần sân bay Long Thành</span>
                  </a>
                </li>
                <li>
                  <a href="/k-home-midtown-trang-bom"
                    title="K-Home Midtown Trảng Bom – Nhà ở xã hội trung tâm Trảng Bom"
                    className="hover:text-amber-600 transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 shrink-0" />
                    <span>K-Home Midtown Trảng Bom – Trung tâm Trảng Bom</span>
                  </a>
                </li>
                <li>
                  <a href="/video/phong-su-k-home-cityview-ho-nai"
                    title="Thư viện Video Phóng Sự & Tiến Độ K-Home Đồng Nai"
                    className="hover:text-amber-600 transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 shrink-0" />
                    <span>Video phóng sự & tiến độ K-Home</span>
                  </a>
                </li>
                <li>
                  <a href="/san-pham"
                    title="Danh sách toàn bộ căn hộ NOXH K-Home Đồng Nai – Bảng giá"
                    className="hover:text-amber-600 transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 shrink-0" />
                    <span>Xem bảng giá tất cả loại căn hộ K-Home</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Links — Anchor text tối ưu SEO */}
            <div className="space-y-4">
              <h4 className="text-slate-800 font-bold text-base tracking-wide border-l-3 border-amber-500 pl-3">Hỗ Trợ Khách Hàng</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>
                  <a href="/tinh-tra-gop"
                    title="Bảng tính trả góp & lịch đóng tiền mua nhà ở xã hội K-Home"
                    className="hover:text-amber-600 transition-colors flex items-center gap-1 font-semibold text-amber-700">
                    <ChevronRight className="w-3 h-3 shrink-0" />
                    <span>Công cụ tính trả góp NOXH</span>
                  </a>
                </li>
                <li>
                  <a href="/k-home-cityview-ho-nai#gia-ban"
                    title="Bảng giá K-Home CityView Biên Hòa – Cập nhật mới nhất"
                    className="hover:text-amber-600 transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 shrink-0" />
                    <span>Bảng giá K-Home CityView Biên Hòa</span>
                  </a>
                </li>
                <li>
                  <a href="/k-home-cityview-ho-nai#mat-bang"
                    title="Mặt bằng căn hộ K-Home CityView – Layout 1PN 2PN 3PN"
                    className="hover:text-amber-600 transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 shrink-0" />
                    <span>Mặt bằng thiết kế căn hộ K-Home CityView</span>
                  </a>
                </li>
                <li>
                  <a href="/k-home-cityview-ho-nai#phap-ly"
                    title="Điều kiện mua nhà ở xã hội K-Home Đồng Nai – Hồ sơ NOXH"
                    className="hover:text-amber-600 transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 shrink-0" />
                    <span>Điều kiện mua NOXH K-Home Đồng Nai</span>
                  </a>
                </li>
                <li>
                  <a href="/k-home-cityview-ho-nai#tien-ich"
                    title="Tiến độ xây dựng K-Home CityView – Dự kiến bàn giao 2028"
                    className="hover:text-amber-600 transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 shrink-0" />
                    <span>Tiến độ K-Home CityView – Bàn giao 2028</span>
                  </a>
                </li>
                <li>
                  <a href="/lien-he"
                    title="Liên hệ tư vấn nhà ở xã hội K-Home – Hỗ trợ hồ sơ miễn phí"
                    className="hover:text-amber-600 transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 shrink-0" />
                    <span>Tư vấn hồ sơ NOXH miễn phí</span>
                  </a>
                </li>
                <li>
                  <a href="/gioi-thieu"
                    title="Giới thiệu Kim Oanh Land – Chủ đầu tư nhà ở xã hội Đồng Nai"
                    className="hover:text-amber-600 transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 shrink-0" />
                    <span>Kim Oanh Land – Chủ đầu tư K-Home</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright bar */}
          <div className="border-t border-amber-200/60 pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
            <div>© {new Date().getFullYear()} By Kim Oanh Land. Tất cả quyền được bảo lưu.</div>
            <div className="flex items-center gap-6">
              <button onClick={() => setModal("terms")} className="hover:text-amber-600 transition-colors cursor-pointer">
                Điều khoản sử dụng
              </button>
              <button onClick={() => setModal("privacy")} className="hover:text-amber-600 transition-colors cursor-pointer">
                Chính sách bảo mật
              </button>
              <button
                onClick={scrollToTop}
                className="bg-white hover:bg-amber-50 text-amber-600 p-2.5 rounded-full shadow-sm border border-amber-200 transition-all cursor-pointer hover:scale-110"
                title="Quay lên đầu trang"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Legal Modal ── */}
      {modal && content && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(15,23,42,0.75)", backdropFilter: "blur(4px)" }}
          onClick={() => setModal(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 shrink-0">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{content.title}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{content.updated}</p>
              </div>
              <button
                onClick={() => setModal(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto px-7 py-6 space-y-6">
              {/* Intro */}
              <p className="text-slate-500 text-sm leading-relaxed border-l-4 border-amber-400 pl-4 bg-amber-50/50 py-3 rounded-r-xl">
                {content.intro}
              </p>

              {/* Sections */}
              {content.sections.map((section, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-800">{section.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-7 py-4 border-t border-slate-100 shrink-0 flex justify-between items-center">
              <p className="text-xs text-slate-400">
                © {new Date().getFullYear()} Kim Oanh Group. Tất cả quyền được bảo lưu.
              </p>
              <button
                onClick={() => setModal(null)}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

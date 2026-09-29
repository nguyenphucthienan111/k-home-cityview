/**
 * static-project-content.mjs — Sinh nội dung HTML tĩnh hoàn chỉnh cho các trang dự án K-Home
 * Cung cấp hàng nghìn từ ngữ nghĩa, thẻ H1-H3, bảng biểu, FAQ và liên kết nội bộ
 * Giúp Googlebot đọc ngay lập tức 100% nội dung mà không cần đợi chạy JavaScript.
 */

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderCommonHeader(currentSlug = "") {
  return `
    <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="/" class="flex items-center gap-2 text-amber-600 font-extrabold text-xl tracking-tight no-underline">
          <span class="bg-amber-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-black">K</span>
          <span>K-HOME ĐỒNG NAI</span>
        </a>
        <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
          <a href="/" class="hover:text-amber-600 transition-colors no-underline">Trang Chủ</a>
          <a href="/san-pham" class="hover:text-amber-600 transition-colors no-underline">Dự Án K-Home</a>
          <a href="/k-home-cityview-ho-nai" class="${currentSlug === 'k-home-cityview-ho-nai' ? 'text-amber-600 font-bold' : 'hover:text-amber-600'} transition-colors no-underline">CityView Biên Hòa</a>
          <a href="/k-home-midtown-trang-bom" class="${currentSlug === 'k-home-midtown-trang-bom' ? 'text-amber-600 font-bold' : 'hover:text-amber-600'} transition-colors no-underline">Midtown Trảng Bom</a>
          <a href="/k-home-avenue-nhon-trach" class="${currentSlug === 'k-home-avenue-nhon-trach' ? 'text-amber-600 font-bold' : 'hover:text-amber-600'} transition-colors no-underline">Avenue Nhơn Trạch</a>
          <a href="/tin-tuc" class="hover:text-amber-600 transition-colors no-underline">Tin Tức</a>
          <a href="/tinh-tra-gop" class="hover:text-amber-600 transition-colors no-underline">Tính Trả Góp</a>
          <a href="/lien-he" class="hover:text-amber-600 transition-colors no-underline">Liên Hệ</a>
        </nav>
        <div class="flex items-center gap-3">
          <a href="tel:0937587438" class="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xs transition-colors flex items-center gap-2 no-underline">
            <span>Hotline: 0937 587 438</span>
          </a>
        </div>
      </div>
    </header>
  `;
}

export function renderCommonFooter() {
  return `
    <footer class="bg-slate-900 text-slate-300 pt-16 pb-12 mt-20 border-t border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div class="md:col-span-2 space-y-4">
            <div class="flex items-center gap-2 text-white font-extrabold text-xl tracking-tight">
              <span class="bg-amber-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-black">K</span>
              <span>K-HOME ĐỒNG NAI — KIM OANH LAND</span>
            </div>
            <p class="text-sm text-slate-400 leading-relaxed max-w-md">
              Hệ thống thông tin chính thức chuỗi dự án Nhà Ở Xã Hội K-Home tại Đồng Nai chuẩn Singapore: CityView Biên Hòa, Midtown Trảng Bom, Avenue Nhơn Trạch và SkyView Bàu Xéo. Phát triển bởi Kim Oanh Land.
            </p>
            <div class="text-sm text-slate-400 space-y-1">
              <p><strong>Chủ đầu tư:</strong> Công ty Cổ phần Đầu tư & Phát triển Bất động sản Miền Đông (Kim Oanh Group)</p>
              <p><strong>Địa chỉ trụ sở:</strong> 268A Phan Trung, Phường Tân Mai, TP. Biên Hòa, Tỉnh Đồng Nai</p>
              <p><strong>Hotline tư vấn hồ sơ:</strong> <a href="tel:0937587438" class="text-amber-400 font-bold hover:underline">0937 587 438</a></p>
              <p><strong>Email:</strong> k.homekog@gmail.com</p>
            </div>
          </div>
          <div>
            <h4 class="text-white font-bold mb-4 uppercase tracking-wider text-sm">Dự Án Trọng Điểm</h4>
            <ul class="space-y-2.5 text-sm">
              <li><a href="/k-home-cityview-ho-nai" class="hover:text-amber-400 transition-colors">Nhà ở xã hội Biên Hòa (CityView)</a></li>
              <li><a href="/k-home-midtown-trang-bom" class="hover:text-amber-400 transition-colors">Nhà ở xã hội Trảng Bom (Midtown)</a></li>
              <li><a href="/k-home-avenue-nhon-trach" class="hover:text-amber-400 transition-colors">Nhà ở xã hội Nhơn Trạch (Avenue)</a></li>
              <li><a href="/k-home-skyview-trang-bom" class="hover:text-amber-400 transition-colors">K-Home SkyView Bàu Xéo</a></li>
              <li><a href="/san-pham" class="hover:text-amber-400 transition-colors">Danh sách tất cả dự án</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-bold mb-4 uppercase tracking-wider text-sm">Hướng Dẫn & Cẩm Nang</h4>
            <ul class="space-y-2.5 text-sm">
              <li><a href="/tin-tuc" class="hover:text-amber-400 transition-colors">Tin tức nhà ở xã hội 2026</a></li>
              <li><a href="/tinh-tra-gop" class="hover:text-amber-400 transition-colors">Bảng tính trả góp gói vay 5,4%</a></li>
              <li><a href="/gioi-thieu" class="hover:text-amber-400 transition-colors">Về chủ đầu tư Kim Oanh Land</a></li>
              <li><a href="/lien-he" class="hover:text-amber-400 transition-colors">Liên hệ tư vấn thủ tục</a></li>
            </ul>
          </div>
        </div>
        <div class="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© 2026 K-Home Đồng Nai – Kim Oanh Land. Giữ toàn quyền bản quyền nội dung. Thông tin dự án nhà ở xã hội Biên Hòa, Trảng Bom, Nhơn Trạch được bảo hộ.</p>
        </div>
      </div>
    </footer>
  `;
}

/**
 * Render HTML tĩnh cho trang Nhà Ở Xã Hội Biên Hòa – K-Home CityView Hố Nai
 */
export function renderCityViewHtml() {
  return `
    ${renderCommonHeader("k-home-cityview-ho-nai")}
    <main class="bg-white text-slate-800">
      <!-- Breadcrumb -->
      <nav class="bg-slate-50 border-b border-slate-200 py-3 text-xs sm:text-sm" aria-label="Breadcrumb">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-slate-600">
          <a href="/" class="hover:text-amber-600 transition-colors">Trang chủ</a>
          <span>/</span>
          <a href="/san-pham" class="hover:text-amber-600 transition-colors">Dự án K-Home</a>
          <span>/</span>
          <span class="text-slate-900 font-semibold">Nhà Ở Xã Hội Biên Hòa – K-Home CityView Hố Nai</span>
        </div>
      </nav>

      <!-- Hero Header Section -->
      <section class="bg-gradient-to-b from-amber-50/50 via-white to-white pt-10 pb-12 border-b border-slate-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="max-w-4xl">
            <div class="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <span>Đang Tiếp Nhận Hồ Sơ Xét Duyệt 2026</span>
            </div>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              Nhà Ở Xã Hội Biên Hòa – Dự Án K-Home CityView Hố Nai | Bảng Giá & Điều Kiện 2026
            </h1>
            <p class="text-lg sm:text-xl text-slate-700 leading-relaxed mb-8">
              Tổ hợp <strong>nhà ở xã hội Biên Hòa</strong> quy mô <strong>2,85 ha</strong> gồm <strong>1.328 căn hộ NOXH chuẩn Singapore</strong> và 39 căn shophouse tọa lạc ngay mặt tiền <strong>đường Điểu Xiển</strong>, phường Hố Nai, TP. Biên Hòa. Mức giá chỉ từ <strong>950 triệu đồng/căn</strong>, hỗ trợ gói vay ưu đãi cố định <strong>5,4%/năm trong 25 năm</strong> từ Ngân hàng Chính sách Xã hội.
            </p>
            <div class="flex flex-wrap items-center gap-4">
              <a href="#bang-gia" class="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3.5 rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all no-underline">
                Xem Bảng Giá Căn Hộ 2026
              </a>
              <a href="#dieu-kien" class="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all no-underline">
                Kiểm Tra Điều Kiện Mua
              </a>
              <a href="tel:0937587438" class="border-2 border-amber-600 text-amber-700 hover:bg-amber-50 px-6 py-3.5 rounded-xl font-bold text-base transition-colors no-underline">
                Tư Vấn Hồ Sơ: 0937 587 438
              </a>
            </div>
          </div>

          <!-- Quick Stats Grid -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-200">
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span class="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1">Vị Trí Tâm Điểm</span>
              <p class="text-base font-bold text-slate-900">Mặt tiền Điểu Xiển, P. Hố Nai, TP. Biên Hòa</p>
            </div>
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span class="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1">Quy Mô Công Trình</span>
              <p class="text-base font-bold text-slate-900">4 block 22 tầng · 1.328 căn NOXH</p>
            </div>
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span class="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1">Mức Giá Niêm Yết</span>
              <p class="text-base font-bold text-amber-600">Từ 950 Triệu – 2 Tỷ/Căn</p>
            </div>
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span class="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1">Chính Sách Vay NOXH</span>
              <p class="text-base font-bold text-emerald-600">Vay 80% vốn · Lãi suất 5,4%/năm</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content Container -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <!-- Main Left Column -->
          <div class="lg:col-span-2 space-y-12">

            <!-- Section 1: Tổng quan -->
            <section id="tong-quan">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                1. Tổng Quan Dự Án Nhà Ở Xã Hội K-Home CityView Biên Hòa
              </h2>
              <div class="prose max-w-none text-slate-700 leading-relaxed space-y-4">
                <p>
                  <strong>K-Home CityView</strong> là dự án <strong>nhà ở xã hội Biên Hòa</strong> trọng điểm chuẩn quốc tế do <strong>Kim Oanh Land</strong> (thành viên Tập đoàn Kim Oanh Group) làm chủ đầu tư và phát triển, tọa lạc ngay mặt tiền tuyến đường huyết mạch Điểu Xiển, thuộc địa phận phường Hố Nai, thành phố Biên Hòa, tỉnh Đồng Nai.
                </p>
                <p>
                  Được quy hoạch trên quỹ đất rộng <strong>2,85 ha</strong> với tổng mức đầu tư hàng nghìn tỷ đồng, dự án bao gồm <strong>4 tòa tháp chung cư cao 22 tầng</strong>, cung cấp ra thị trường <strong>1.328 căn hộ nhà ở xã hội</strong> chất lượng cao, 425 căn nhà ở thương mại tại Block T4 và 39 căn shophouse dịch vụ khối đế. Đây là dự án NOXH đầu tiên tại tỉnh Đồng Nai được thiết kế và quy hoạch bởi Tập đoàn danh tiếng <strong>Surbana Jurong (Singapore)</strong> và xây dựng theo tiêu chuẩn công trình xanh quốc tế <strong>EDGE</strong> của Tổ chức Tài chính Quốc tế (IFC - World Bank).
                </p>
                
                <!-- Project Specs Table -->
                <div class="overflow-x-auto my-6 rounded-xl border border-slate-200">
                  <table class="w-full text-left text-sm border-collapse">
                    <thead class="bg-slate-100 text-slate-900 border-b border-slate-200">
                      <tr>
                        <th class="p-3 font-bold w-1/3">Thông Số Kỹ Thuật</th>
                        <th class="p-3 font-bold">Chi Tiết Quy Hoạch K-Home CityView</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                      <tr><td class="p-3 font-semibold text-slate-800">Tên thương mại</td><td class="p-3">K-Home CityView (K-Home CityView Hố Nai Biên Hòa)</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Chủ đầu tư</td><td class="p-3">Kim Oanh Land (Công ty CP Đầu tư & Phát triển BĐS Miền Đông)</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Vị trí địa chỉ</td><td class="p-3">Đường Điểu Xiển, Phường Hố Nai, TP. Biên Hòa, Tỉnh Đồng Nai</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Tư vấn thiết kế kiến trúc</td><td class="p-3">Tập đoàn Surbana Jurong (Singapore)</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Quy mô quỹ đất</td><td class="p-3">2,85 hecta</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Mật độ xây dựng</td><td class="p-3">Khoảng 38% (còn lại dành cho công viên cây xanh, hồ bơi & tiện ích)</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Quy mô công trình</td><td class="p-3">4 tòa tháp cao 22 tầng, 1 tầng hầm để xe liên thông hiện đại</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Tổng số lượng căn hộ</td><td class="p-3">1.328 căn hộ NOXH + 425 căn thương mại + 39 shophouse</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Diện tích căn hộ</td><td class="p-3">47,3 m² – 84,4 m² (1PN+, 2PN, 3PN)</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Tiêu chuẩn bàn giao</td><td class="p-3">Bàn giao hoàn thiện nội thất chuẩn Singapore cao cấp</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Hình thức sở hữu</td><td class="p-3">Sổ hồng sở hữu lâu dài (vĩnh viễn)</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Thời gian bàn giao dự kiến</td><td class="p-3">Dự kiến Quý 1/2028 (đang thi công đúng tiến độ)</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <!-- Section 2: Bảng giá căn hộ -->
            <section id="bang-gia">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                2. Bảng Giá Căn Hộ Nhà Ở Xã Hội Biên Hòa – K-Home CityView 2026
              </h2>
              <div class="prose max-w-none text-slate-700 leading-relaxed space-y-4">
                <p>
                  Mức giá bán căn hộ tại <strong>K-Home CityView Biên Hòa</strong> được Sở Xây dựng tỉnh Đồng Nai thẩm định theo đúng quy định nhà ở xã hội, đảm bảo mức giá gốc không có tiền chênh lệch ngoài hợp đồng. Người mua được hỗ trợ vay vốn ưu đãi lên đến 80% giá trị hợp đồng.
                </p>

                <!-- Detailed Pricing Table -->
                <div class="overflow-x-auto my-6 rounded-xl border border-slate-200">
                  <table class="w-full text-left text-sm border-collapse">
                    <thead class="bg-amber-600 text-white">
                      <tr>
                        <th class="p-3 font-bold">Mẫu Căn Hộ</th>
                        <th class="p-3 font-bold">Diện Tích Tim Tường</th>
                        <th class="p-3 font-bold">Diện Tích Thông Thủy</th>
                        <th class="p-3 font-bold">Giá Bán Niêm Yết</th>
                        <th class="p-3 font-bold">Vốn Tự Có 20%</th>
                        <th class="p-3 font-bold">Gói Vay 80% (5,4%)</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
                      <tr class="hover:bg-amber-50/50">
                        <td class="p-3 font-bold text-slate-900"><a href="/k-home-cityview-ho-nai/can-ho-1-phong-ngu-a" class="text-amber-700 underline font-semibold">Căn 1 Phòng Ngủ + A</a></td>
                        <td class="p-3">47,3 m²</td>
                        <td class="p-3">42,3 m²</td>
                        <td class="p-3 font-bold text-amber-600">950 tr – 1,08 tỷ</td>
                        <td class="p-3">190 – 216 tr</td>
                        <td class="p-3">Trả góp ~4,5 tr/tháng</td>
                      </tr>
                      <tr class="hover:bg-amber-50/50">
                        <td class="p-3 font-bold text-slate-900"><a href="/k-home-cityview-ho-nai/can-ho-1-phong-ngu-b" class="text-amber-700 underline font-semibold">Căn 1 Phòng Ngủ + B (2WC)</a></td>
                        <td class="p-3">62,4 m²</td>
                        <td class="p-3">55,1 m²</td>
                        <td class="p-3 font-bold text-amber-600">1,20 – 1,40 tỷ</td>
                        <td class="p-3">240 – 280 tr</td>
                        <td class="p-3">Trả góp ~5,5 tr/tháng</td>
                      </tr>
                      <tr class="hover:bg-amber-50/50">
                        <td class="p-3 font-bold text-slate-900"><a href="/k-home-cityview-ho-nai/can-ho-2-phong-ngu-cityview" class="text-amber-700 underline font-semibold">Căn 2 Phòng Ngủ (2WC)</a></td>
                        <td class="p-3">70,4 m²</td>
                        <td class="p-3">63,2 m²</td>
                        <td class="p-3 font-bold text-amber-600">1,50 – 1,70 tỷ</td>
                        <td class="p-3">300 – 340 tr</td>
                        <td class="p-3">Trả góp ~6,8 tr/tháng</td>
                      </tr>
                      <tr class="hover:bg-amber-50/50">
                        <td class="p-3 font-bold text-slate-900"><a href="/k-home-cityview-ho-nai/can-ho-3-phong-ngu" class="text-amber-700 underline font-semibold">Căn 3 Phòng Ngủ (2WC)</a></td>
                        <td class="p-3">84,4 m²</td>
                        <td class="p-3">75,4 m²</td>
                        <td class="p-3 font-bold text-amber-600">1,80 – 2,00 tỷ</td>
                        <td class="p-3">360 – 400 tr</td>
                        <td class="p-3">Trả góp ~8,0 tr/tháng</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p class="text-sm text-slate-600 italic">
                  * Ghi chú: Giá bán trên đã bao gồm thuế VAT ưu đãi 5% theo luật NOXH, chưa bao gồm 2% kinh phí bảo trì (đóng khi nhận bàn giao). Tất cả căn hộ đều được bàn giao full nội thất cơ bản theo chuẩn Singapore: tủ bếp, sofa, giường, tủ quần áo, thiết bị vệ sinh cao cấp và sàn gỗ.
                </p>
              </div>
            </section>

            <!-- Section 3: Vị trí & Kết nối -->
            <section id="vi-tri">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                3. Vị Trí Tâm Điểm Mặt Tiền Đường Điểu Xiển & Kết Nối Giao Thông
              </h2>
              <div class="prose max-w-none text-slate-700 leading-relaxed space-y-4">
                <p>
                  Dự án tọa lạc tại mặt tiền <strong>đường Điểu Xiển, Phường Hố Nai, TP. Biên Hòa, Tỉnh Đồng Nai</strong>. Đây là vị trí chiến lược thuộc trung tâm vùng đô thị công nghiệp lớn nhất cả nước, kết nối trực tiếp đến các trục hạ tầng giao thông huyết mạch:
                </p>
                <ul class="list-disc list-inside space-y-2">
                  <li><strong>Cách Quốc Lộ 1A & Xa Lộ Hà Nội:</strong> Chỉ 3 – 5 phút di chuyển thông thoáng.</li>
                  <li><strong>Cách Ga Hố Nai:</strong> Khoảng 2 phút (thuận tiện cho việc di chuyển liên tỉnh và tuyến đường sắt đô thị tương lai).</li>
                  <li><strong>Kết nối KCN Amata:</strong> Khoảng 10 phút chạy xe máy.</li>
                  <li><strong>Kết nối KCN Pouchen, KCN Biên Hòa 2 & KCN Long Bình:</strong> Chỉ 10 – 15 phút.</li>
                  <li><strong>Đến trung tâm hành chính TP. Biên Hòa:</strong> Khoảng 3 km (10 phút).</li>
                  <li><strong>Đến Sân bay Quốc tế Long Thành:</strong> Khoảng 30 – 35 phút theo các trục cao tốc và quốc lộ đang mở rộng.</li>
                </ul>
                <p>
                  Nhờ vị trí đắc địa ngay giữa các khu công nghiệp tập trung hàng chục vạn công nhân, kỹ sư và chuyên gia, việc chọn [mua nhà ở xã hội Biên Hòa](/k-home-cityview-ho-nai) tại K-Home CityView giúp người lao động tiết kiệm tối đa thời gian di chuyển, tránh cảnh ùn tắc giao thông hàng ngày và dễ dàng tiếp cận mọi tiện ích dân sinh hoàn chỉnh quanh khu vực.
                </p>
              </div>
            </section>

            <!-- Section 4: Hồ sơ Pháp lý -->
            <section id="phap-ly">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                4. Hồ Sơ Pháp Lý Dự Án K-Home CityView Hố Nai Đã Phê Duyệt Hoàn Chỉnh
              </h2>
              <div class="prose max-w-none text-slate-700 leading-relaxed space-y-4">
                <p>
                  K-Home CityView là một trong những dự án nhà ở xã hội có pháp lý minh bạch và đầy đủ bậc nhất tại tỉnh Đồng Nai hiện nay, được các cấp ban ngành phê duyệt qua các văn bản quy chuẩn:
                </p>
                <div class="space-y-3 my-4">
                  <div class="p-4 bg-slate-50 rounded-xl border-l-4 border-emerald-500">
                    <h3 class="font-bold text-slate-900">1. Quyết định Chấp thuận Chủ trương Đầu tư</h3>
                    <p class="text-sm text-slate-600 mt-1">Quyết định số 177/QĐ-UBND ngày 09/02/2023 của UBND tỉnh Đồng Nai chấp thuận chủ trương đầu tư dự án NOXH tại khu đất 2,85 ha phường Hố Nai. Điều chỉnh bổ sung theo QĐ số 794/QĐ-UBND ngày 12/3/2025 và QĐ số 1191/QĐ-UBND ngày 05/9/2025 về việc giao chủ đầu tư.</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-xl border-l-4 border-emerald-500">
                    <h3 class="font-bold text-slate-900">2. Phê duyệt Quy hoạch Chi tiết Đô thị Tỷ lệ 1/500</h3>
                    <p class="text-sm text-slate-600 mt-1">Công văn số 269/QĐ-UBND ngày 07/11/2025 phê duyệt Quy hoạch chi tiết 1/500 dự án NOXH Hố Nai – đảm bảo tính đồng bộ về hạ tầng kỹ thuật, khoảng lùi công trình, chiều cao 22 tầng và hệ thống phòng cháy chữa cháy.</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-xl border-l-4 border-emerald-500">
                    <h3 class="font-bold text-slate-900">3. Quyết định Giao đất Thực hiện Dự án</h3>
                    <p class="text-sm text-slate-600 mt-1">Quyết định số 3000/QĐ-UBND ngày 08/12/2025 của UBND tỉnh Đồng Nai giao đất sạch cho Kim Oanh Land thực hiện dự án. Dự án được miễn 100% tiền sử dụng đất, đảm bảo căn hộ được cấp sổ hồng sở hữu lâu dài cho cư dân.</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-xl border-l-4 border-emerald-500">
                    <h3 class="font-bold text-slate-900">4. Thẩm định Báo cáo Nghiên cứu Khả thi Đầu tư Xây dựng</h3>
                    <p class="text-sm text-slate-600 mt-1">Văn bản số 7386/SXD-QLHĐ&VLXD ngày 31/12/2025 của Sở Xây dựng tỉnh Đồng Nai thông báo kết quả thẩm định hồ sơ kỹ thuật thi công và an toàn công trình.</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-xl border-l-4 border-emerald-500">
                    <h3 class="font-bold text-slate-900">5. Thư Ngỏ Hỗ Trợ Vốn Vay Ngân Hàng Chính Sách Xã Hội</h3>
                    <p class="text-sm text-slate-600 mt-1">Ngân hàng Chính sách Xã hội Chi nhánh tỉnh Đồng Nai phát hành Thư ngỏ cam kết bố trí nguồn vốn tín dụng ưu đãi 5,4%/năm cho tất cả khách hàng đủ điều kiện mua căn hộ tại K-Home CityView.</p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 5: Điều kiện mua NOXH -->
            <section id="dieu-kien">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                5. Điều Kiện & Đối Tượng Mua Nhà Ở Xã Hội Biên Hòa (Luật Nhà Ở 2023)
              </h2>
              <div class="prose max-w-none text-slate-700 leading-relaxed space-y-4">
                <p>
                  Theo Luật Nhà ở 2023 và Nghị định số 100/2024/NĐ-CP, thủ tục xét duyệt <strong>mua nhà ở xã hội Biên Hòa</strong> đã được nới lỏng rất nhiều, tạo cơ hội cho mọi người lao động an cư:
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                  <div class="p-4 bg-amber-50/60 rounded-xl border border-amber-200">
                    <h4 class="font-bold text-amber-900 mb-1">1. Điều Kiện Thu Nhập</h4>
                    <p class="text-sm text-slate-700">Người độc thân: Thu nhập thực nhận không quá <strong>15 triệu đồng/tháng</strong>. Cặp vợ chồng: Tổng thu nhập cả 2 người không vượt quá <strong>30 triệu đồng/tháng</strong> (tính bình quân 12 tháng gần nhất).</p>
                  </div>
                  <div class="p-4 bg-amber-50/60 rounded-xl border border-amber-200">
                    <h4 class="font-bold text-amber-900 mb-1">2. Thực Trạng Nhà Ở</h4>
                    <p class="text-sm text-slate-700">Chưa đứng tên sở hữu nhà ở hoặc đất ở tại tỉnh Đồng Nai. Nếu đã có nhà nhưng diện tích sàn bình quân dưới <strong>15 m²/người</strong> thì vẫn đủ điều kiện nộp đơn.</p>
                  </div>
                  <div class="p-4 bg-amber-50/60 rounded-xl border border-amber-200">
                    <h4 class="font-bold text-amber-900 mb-1">3. Bãi Bỏ Sổ Hộ Khẩu Giấy</h4>
                    <p class="text-sm text-slate-700">Không còn yêu cầu hộ khẩu thường trú KT1 hay tạm trú KT3 dài hạn. Người lao động ngoại tỉnh chỉ cần có HĐLĐ từ 1 năm và tham gia BHXH tại Đồng Nai (xác thực qua VNeID mức 2).</p>
                  </div>
                  <div class="p-4 bg-amber-50/60 rounded-xl border border-amber-200">
                    <h4 class="font-bold text-amber-900 mb-1">4. Chưa Từng Mua NOXH</h4>
                    <p class="text-sm text-slate-700">Người đứng đơn và vợ/chồng chưa từng được hưởng chính sách hỗ trợ nhà ở xã hội hoặc mua/thuê mua NOXH tại bất kỳ địa phương nào trên toàn quốc.</p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 6: Gói vay 5.4% -->
            <section id="goi-vay">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                6. Bài Toán Tài Chính & Gói Vay Ưu Đãi 5,4%/Năm Ngân Hàng Chính Sách
              </h2>
              <div class="prose max-w-none text-slate-700 leading-relaxed space-y-4">
                <p>
                  Khách hàng mua căn hộ tại K-Home CityView được tiếp cận gói vay mua nhà ở xã hội với lãi suất cố định <strong>5,4%/năm</strong> trong thời hạn lên đến <strong>25 năm (300 tháng)</strong>:
                </p>
                <div class="overflow-x-auto my-6 rounded-xl border border-slate-200">
                  <table class="w-full text-left text-sm border-collapse">
                    <thead class="bg-slate-100 text-slate-900">
                      <tr>
                        <th class="p-3 font-bold">Tiêu Chí So Sánh</th>
                        <th class="p-3 font-bold text-amber-700">Mua Căn Hộ K-Home CityView (Gói Vay 5,4%)</th>
                        <th class="p-3 font-bold text-slate-600">Thuê Trọ / Thuê Nhà Tại Biên Hòa</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                      <tr><td class="p-3 font-semibold">Chi phí hàng tháng</td><td class="p-3 text-emerald-600 font-bold">Trả góp từ 4,5 triệu/tháng (giảm dần)</td><td class="p-3 text-red-600 font-medium">Thuê trọ 4 – 6 triệu/tháng (tăng dần)</td></tr>
                      <tr><td class="p-3 font-semibold">Sau 25 năm</td><td class="p-3 font-bold text-emerald-600">Sở hữu tài sản nhà ở trị giá 2 – 4 tỷ đồng</td><td class="p-3 text-red-600 font-medium">Mất trắng hơn 1,8 – 2,2 tỷ tiền thuê trọ</td></tr>
                      <tr><td class="p-3 font-semibold">Chất lượng môi trường</td><td class="p-3">Hồ bơi, sân chơi trẻ em, bảo vệ 24/7, chuẩn Singapore</td><td class="p-3">Phòng trọ ẩm thấp, an ninh phức tạp</td></tr>
                      <tr><td class="p-3 font-semibold">Tâm lý ổn định</td><td class="p-3">Làm chủ hoàn toàn tổ ấm riêng, tự do sửa sang</td><td class="p-3">Luôn lo lắng bị tăng giá hoặc lấy lại nhà</td></tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  Bạn có thể chủ động nhập số tiền vay và thời hạn để tính toán chính xác dòng tiền thanh toán mỗi tháng tại <a href="/tinh-tra-gop" class="text-amber-600 font-bold underline">Bảng tính trả góp K-Home Đồng Nai</a>.
                </p>
              </div>
            </section>

            <!-- Section 6.1: Mặt bằng tầng & thiết kế -->
            <section id="mat-bang">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                7. Mặt Bằng Tầng Điển Hình & Thiết Kế Căn Hộ Chuẩn Singapore
              </h2>
              <div class="prose max-w-none text-slate-700 leading-relaxed space-y-4">
                <p>
                  Mặt bằng tổng thể K-Home CityView gồm 4 tòa tháp bố trí so le thông minh, giúp 100% căn hộ đều có mặt thoáng đón gió và ánh sáng tự nhiên. Dự án quy hoạch giao thông phân tầng riêng biệt:
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                  <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 class="font-bold text-slate-900 mb-1">Mặt bằng Tầng 1 (Tiện ích & Thương mại)</h4>
                    <p class="text-xs text-slate-600">39 căn Shophouse thương mại, sảnh đón lễ tân, nhà trẻ, nhà sinh hoạt cộng đồng và khu đỗ xe liên thông.</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 class="font-bold text-slate-900 mb-1">Mặt bằng Tầng 2 & 3 (Vườn treo cảnh quan)</h4>
                    <p class="text-xs text-slate-600">Không gian vườn treo ngoài trời, hồ bơi tràn bờ, khu BBQ và lối dạo bộ thư giãn biệt lập cho cư dân.</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 class="font-bold text-slate-900 mb-1">Mặt bằng Tầng 4–11 (Tầng căn hộ thấp)</h4>
                    <p class="text-xs text-slate-600">Bố trí mật độ căn hộ hợp lý, hành lang rộng thoáng, hệ thống 4 thang máy tốc độ cao mỗi tháp.</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 class="font-bold text-slate-900 mb-1">Mặt bằng Tầng 12A–22 (Tầng căn hộ cao)</h4>
                    <p class="text-xs text-slate-600">Tầm nhìn không giới hạn toàn cảnh TP. Biên Hòa, đón luồng gió đối lưu tự nhiên trong lành.</p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 6.2: 8 Yếu tố Singapore Surbana Jurong -->
            <section id="singapore-factors">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                8. 8 Yếu Tố Vượt Trội Chuẩn Singapore Tại K-Home CityView (Surbana Jurong)
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-4 bg-amber-50/50 rounded-xl border border-amber-200">
                  <span class="text-xs font-bold text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded">Yếu tố 01</span>
                  <h4 class="font-bold text-slate-900 mt-2 mb-1">Vị Trí Trung Tâm Đô Thị Biên Hòa</h4>
                  <p class="text-xs text-slate-600">Mặt tiền Điểu Xiển, P. Hố Nai – liền kề chuỗi KCN Amata, Pouchen, Long Bình, giao thông đồng bộ.</p>
                </div>
                <div class="p-4 bg-amber-50/50 rounded-xl border border-amber-200">
                  <span class="text-xs font-bold text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded">Yếu tố 02</span>
                  <h4 class="font-bold text-slate-900 mt-2 mb-1">Tiện Ích Nội Khu Phong Phú</h4>
                  <p class="text-xs text-slate-600">Hồ bơi người lớn & trẻ em, sân chơi trẻ em an toàn, vườn treo, khu BBQ, shophouse thương mại.</p>
                </div>
                <div class="p-4 bg-amber-50/50 rounded-xl border border-amber-200">
                  <span class="text-xs font-bold text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded">Yếu tố 03</span>
                  <h4 class="font-bold text-slate-900 mt-2 mb-1">Đa Dạng Tiện Ích Ngoại Khu Quanh Nhà</h4>
                  <p class="text-xs text-slate-600">Trong bán kính 3km có đầy đủ trường học các cấp, bệnh viện Đa khoa Thống Nhất, chợ Sặt, siêu thị Big C.</p>
                </div>
                <div class="p-4 bg-amber-50/50 rounded-xl border border-amber-200">
                  <span class="text-xs font-bold text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded">Yếu tố 04</span>
                  <h4 class="font-bold text-slate-900 mt-2 mb-1">Tiêu Chuẩn Công Trình Xanh EDGE</h4>
                  <p class="text-xs text-slate-600">Chứng nhận của IFC/World Bank, giảm ít nhất 20% điện năng, nước và năng lượng vật liệu xây dựng.</p>
                </div>
                <div class="p-4 bg-amber-50/50 rounded-xl border border-amber-200">
                  <span class="text-xs font-bold text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded">Yếu tố 05</span>
                  <h4 class="font-bold text-slate-900 mt-2 mb-1">Tầm View Thoáng Đãng Rộng Mở</h4>
                  <p class="text-xs text-slate-600">4 tháp 22 tầng so le không che chắn nhau, đảm bảo đón sáng và thông gió tự nhiên tối đa.</p>
                </div>
                <div class="p-4 bg-amber-50/50 rounded-xl border border-amber-200">
                  <span class="text-xs font-bold text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded">Yếu tố 06</span>
                  <h4 class="font-bold text-slate-900 mt-2 mb-1">Thiết Kế Thông Minh Zero Dead Space</h4>
                  <p class="text-xs text-slate-600">100% không gian đều hữu ích, phòng khách nối liền ban công, bếp kín thoát mùi, logia giặt phơi riêng.</p>
                </div>
                <div class="p-4 bg-amber-50/50 rounded-xl border border-amber-200">
                  <span class="text-xs font-bold text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded">Yếu tố 07</span>
                  <h4 class="font-bold text-slate-900 mt-2 mb-1">Bàn Giao Hoàn Thiện Full Nội Thất Cơ Bản</h4>
                  <p class="text-xs text-slate-600">Tủ bếp trên dưới, sofa, giường, tủ quần áo, thiết bị vệ sinh cao cấp, sàn gỗ – xách vali vào ở ngay.</p>
                </div>
                <div class="p-4 bg-amber-50/50 rounded-xl border border-amber-200">
                  <span class="text-xs font-bold text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded">Yếu tố 08</span>
                  <h4 class="font-bold text-slate-900 mt-2 mb-1">Quản Lý Vận Hành Thông Minh BMS</h4>
                  <p class="text-xs text-slate-600">Kiểm soát ra vào thẻ từ thang máy phân tầng, camera giám sát AI 24/7 và ứng dụng cư dân K-City.</p>
                </div>
              </div>
            </section>

            <!-- Section 6.3: Tiến độ xây dựng & thanh toán -->
            <section id="tien-do">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                9. Tiến Độ Xây Dựng & Kế Hoạch Bàn Giao Căn Hộ
              </h2>
              <div class="space-y-3">
                <div class="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border-l-4 border-emerald-500 text-sm">
                  <span class="font-bold text-emerald-800">Tháng 02/2026:</span>
                  <span class="text-slate-700">Khởi công xây dựng – Lễ động thổ chính thức tại đường Điểu Xiển, P. Hố Nai (Đã hoàn thành)</span>
                </div>
                <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border-l-4 border-amber-500 text-sm">
                  <span class="font-bold text-amber-800">Tháng 08–10/2026:</span>
                  <span class="text-slate-700">Hoàn thành toàn bộ móng cọc & đài móng của 4 block căn hộ</span>
                </div>
                <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border-l-4 border-blue-500 text-sm">
                  <span class="font-bold text-blue-800">Tháng 06/2027:</span>
                  <span class="text-slate-700">Cất nóc công trình – hoàn thành kết cấu thô 22 tầng</span>
                </div>
                <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border-l-4 border-indigo-500 text-sm">
                  <span class="font-bold text-indigo-800">Tháng 12/2027:</span>
                  <span class="text-slate-700">Hoàn thiện nội thất, nghiệm thu hệ thống PCCC và cảnh quan</span>
                </div>
                <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border-l-4 border-purple-500 text-sm">
                  <span class="font-bold text-purple-800">Tháng 01/2028:</span>
                  <span class="text-slate-700">Bàn giao đợt đầu tiên cho cư dân đón Tết nguyên đán</span>
                </div>
              </div>

              <!-- Payment policy -->
              <h3 class="text-xl font-bold text-slate-900 mt-8 mb-4">Chính Sách & Tiến Độ Thanh Toán 5 Đợt Linh Hoạt</h3>
              <div class="overflow-x-auto rounded-xl border border-slate-200">
                <table class="w-full text-left text-sm border-collapse">
                  <thead class="bg-slate-100 text-slate-900">
                    <tr>
                      <th class="p-3 font-bold">Đợt Thanh Toán</th>
                      <th class="p-3 font-bold">Tỷ Lệ Thanh Toán</th>
                      <th class="p-3 font-bold">Thời Điểm Thanh Toán</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr><td class="p-3 font-semibold">Đặt cọc</td><td class="p-3 text-amber-600 font-bold">30.000.000 đ</td><td class="p-3">Ký Phiếu xác nhận đặt cọc giữ chỗ</td></tr>
                    <tr><td class="p-3 font-semibold">Đợt 1</td><td class="p-3 text-amber-600 font-bold">15% (đã gồm tiền cọc)</td><td class="p-3">Trong vòng 7 ngày kể từ ngày cọc – Ký HĐDVTV</td></tr>
                    <tr><td class="p-3 font-semibold">Đợt 2 & 3</td><td class="p-3 text-amber-600 font-bold">5% mỗi đợt</td><td class="p-3">Mỗi đợt cách nhau 30 ngày theo tiến độ</td></tr>
                    <tr><td class="p-3 font-semibold">Ngân hàng giải ngân</td><td class="p-3 text-emerald-600 font-bold">75% giá trị</td><td class="p-3">Ngân hàng CSXH giải ngân trực tiếp theo tiến độ xây dựng</td></tr>
                    <tr><td class="p-3 font-semibold">Bàn giao nhà</td><td class="p-3 font-bold text-slate-900">2% kinh phí bảo trì</td><td class="p-3">Khi có thông báo bàn giao căn hộ chính thức</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <!-- Section 6.4: Đối tác phát triển -->
            <section id="doi-tac">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                10. Các Đơn Vị Đồng Hành & Phát Triển Dự Án K-Home CityView
              </h2>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <p class="font-bold text-slate-900 text-sm">Surbana Jurong</p>
                  <p class="text-xs text-slate-500">Quy hoạch kiến trúc (Singapore)</p>
                </div>
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <p class="font-bold text-slate-900 text-sm">Global Vireon Studio</p>
                  <p class="text-xs text-slate-500">Thiết kế chi tiết</p>
                </div>
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <p class="font-bold text-slate-900 text-sm">Kiến Trúc Việt</p>
                  <p class="text-xs text-slate-500">Thiết kế cảnh quan nội thất</p>
                </div>
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <p class="font-bold text-slate-900 text-sm">CDC Jsc</p>
                  <p class="text-xs text-slate-500">Tư vấn giám sát thi công</p>
                </div>
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <p class="font-bold text-slate-900 text-sm">Phước Thành</p>
                  <p class="text-xs text-slate-500">Tổng thầu xây dựng chính</p>
                </div>
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <p class="font-bold text-slate-900 text-sm">K-City</p>
                  <p class="text-xs text-slate-500">Quản lý & vận hành tòa nhà</p>
                </div>
              </div>
            </section>

            <!-- Section 7: Tiện ích & Chứng nhận EDGE -->
            <section id="tien-ich">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                7. Hệ Sinh Thái Tiện Ích Chuẩn Singapore & Chứng Nhận Xanh Quốc Tế EDGE
              </h2>
              <div class="prose max-w-none text-slate-700 leading-relaxed space-y-4">
                <p>
                  Khác biệt hoàn toàn với định kiến nhà ở xã hội là chất lượng thấp, K-Home CityView được định vị như một khu căn hộ thương mại chuẩn Singapore với hơn 20 tiện ích khép kín:
                </p>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
                  <div class="p-3 bg-slate-50 rounded-lg text-sm font-semibold text-slate-800">🏊 Hồ bơi người lớn & trẻ em</div>
                  <div class="p-3 bg-slate-50 rounded-lg text-sm font-semibold text-slate-800">🎡 Sân chơi trẻ em an toàn</div>
                  <div class="p-3 bg-slate-50 rounded-lg text-sm font-semibold text-slate-800">🏋️ Khu thể thao đa năng ngoài trời</div>
                  <div class="p-3 bg-slate-50 rounded-lg text-sm font-semibold text-slate-800">🌿 Vườn treo cảnh quan tầng 3</div>
                  <div class="p-3 bg-slate-50 rounded-lg text-sm font-semibold text-slate-800">🍖 Khu tiệc BBQ gia đình</div>
                  <div class="p-3 bg-slate-50 rounded-lg text-sm font-semibold text-slate-800">🛒 39 căn shophouse thương mại</div>
                  <div class="p-3 bg-slate-50 rounded-lg text-sm font-semibold text-slate-800">🏫 Nhà trẻ nội khu đạt chuẩn</div>
                  <div class="p-3 bg-slate-50 rounded-lg text-sm font-semibold text-slate-800">🚗 Hầm đỗ xe thông minh</div>
                  <div class="p-3 bg-slate-50 rounded-lg text-sm font-semibold text-slate-800">🛡️ Camera AI & bảo vệ 24/7</div>
                </div>
                <p>
                  Đặc biệt, dự án áp dụng tiêu chuẩn <strong>công trình xanh EDGE</strong> giúp tiết kiệm <strong>ít nhất 20% điện năng</strong>, <strong>20% lượng nước tiêu thụ</strong> và giảm thiểu phát thải carbon ra môi trường, giúp mỗi gia đình cư dân tiết kiệm hàng triệu đồng tiền hóa đơn điện nước hàng tháng.
                </p>
              </div>
            </section>

            <!-- Section 8: FAQ -->
            <section id="faq">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                8. Câu Hỏi Thường Gặp (FAQ) Về Nhà Ở Xã Hội K-Home CityView Biên Hòa
              </h2>
              <div class="space-y-4">
                <details class="group bg-slate-50 rounded-xl p-4 border border-slate-200 cursor-pointer open:bg-amber-50/30">
                  <summary class="font-bold text-slate-900 text-base list-none flex justify-between items-center">
                    <span>1. Dự án Nhà ở xã hội Biên Hòa nào đang tiếp nhận hồ sơ năm 2026?</span>
                    <span class="text-amber-600 font-bold text-xl group-open:rotate-180 transition-transform">↓</span>
                  </summary>
                  <p class="text-sm text-slate-700 mt-3 leading-relaxed">
                    Tại TP. Biên Hòa hiện nay, dự án <strong>K-Home CityView</strong> (tọa lạc mặt tiền đường Điểu Xiển, P. Hố Nai) do Kim Oanh Land làm chủ đầu tư là dự án nhà ở xã hội quy mô lớn nhất (1.328 căn hộ) đang mở tiếp nhận hồ sơ xét duyệt. Mức giá từ 950 triệu/căn với gói vay 5,4%/năm trong 25 năm.
                  </p>
                </details>

                <details class="group bg-slate-50 rounded-xl p-4 border border-slate-200 cursor-pointer open:bg-amber-50/30">
                  <summary class="font-bold text-slate-900 text-base list-none flex justify-between items-center">
                    <span>2. Mua nhà ở xã hội Biên Hòa K-Home CityView có được cấp sổ hồng không?</span>
                    <span class="text-amber-600 font-bold text-xl group-open:rotate-180 transition-transform">↓</span>
                  </summary>
                  <p class="text-sm text-slate-700 mt-3 leading-relaxed">
                    Có. Dự án K-Home CityView được xây dựng trên quỹ đất ở đô thị lâu dài, đã có Quyết định giao đất số 3000/QĐ-UBND và phê duyệt 1/500 hoàn chỉnh. Cư dân sau khi hoàn tất nghĩa vụ thanh toán sẽ được cấp Giấy chứng nhận quyền sở hữu nhà ở (Sổ hồng) sở hữu lâu dài.
                  </p>
                </details>

                <details class="group bg-slate-50 rounded-xl p-4 border border-slate-200 cursor-pointer open:bg-amber-50/30">
                  <summary class="font-bold text-slate-900 text-base list-none flex justify-between items-center">
                    <span>3. Người ngoại tỉnh làm việc tại Biên Hòa có được mua không?</span>
                    <span class="text-amber-600 font-bold text-xl group-open:rotate-180 transition-transform">↓</span>
                  </summary>
                  <p class="text-sm text-slate-700 mt-3 leading-relaxed">
                    Hoàn toàn được. Luật Nhà ở 2023 đã bãi bỏ rào cản hộ khẩu thường trú. Người lao động ngoại tỉnh chỉ cần có Hợp đồng lao động từ 1 năm trở lên và thời gian tham gia BHXH tại tỉnh Đồng Nai từ 12 tháng trở lên (xác thực trực tuyến qua ứng dụng VNeID và VssID).
                  </p>
                </details>

                <details class="group bg-slate-50 rounded-xl p-4 border border-slate-200 cursor-pointer open:bg-amber-50/30">
                  <summary class="font-bold text-slate-900 text-base list-none flex justify-between items-center">
                    <span>4. Mức vay tối đa và lãi suất vay mua K-Home CityView là bao nhiêu?</span>
                    <span class="text-amber-600 font-bold text-xl group-open:rotate-180 transition-transform">↓</span>
                  </summary>
                  <p class="text-sm text-slate-700 mt-3 leading-relaxed">
                    Người mua đủ điều kiện được vay tối đa 75% – 80% giá trị căn hộ từ Ngân hàng Chính sách Xã hội với lãi suất ưu đãi cố định 5,4%/năm trong thời hạn tối đa 25 năm (300 tháng). Tiền trả góp hàng tháng chỉ từ khoảng 4,5 – 6 triệu đồng theo dư nợ giảm dần.
                  </p>
                </details>

                <details class="group bg-slate-50 rounded-xl p-4 border border-slate-200 cursor-pointer open:bg-amber-50/30">
                  <summary class="font-bold text-slate-900 text-base list-none flex justify-between items-center">
                    <span>5. Sau bao lâu thì được chuyển nhượng bán lại căn hộ NOXH?</span>
                    <span class="text-amber-600 font-bold text-xl group-open:rotate-180 transition-transform">↓</span>
                  </summary>
                  <p class="text-sm text-slate-700 mt-3 leading-relaxed">
                    Theo Điều 89 Luật Nhà ở 2023, sau thời hạn 05 năm kể từ ngày thanh toán hết tiền và được cấp Sổ hồng, chủ sở hữu được tự do bán lại căn hộ trên thị trường thương mại cho bất kỳ cá nhân nào mà không phải nộp lại tiền sử dụng đất.
                  </p>
                </details>
              </div>
            </section>

            <!-- Section 9: Tin tức liên quan -->
            <section id="tin-tuc-lien-quan">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                9. Cẩm Nang & Hướng Dẫn Mua Nhà Ở Xã Hội Biên Hòa Mới Nhất
              </h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a href="/tin-tuc" class="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all block no-underline">
                  <h4 class="font-bold text-slate-900 text-sm mb-1 line-clamp-2">Hướng Dẫn Điền Mẫu Đơn 01, 02, 04 Mua Nhà Ở Xã Hội Biên Hòa</h4>
                  <p class="text-xs text-slate-600 line-clamp-2">Chi tiết từng bước điền đơn đăng ký, xin xác nhận thu nhập và thực trạng nhà ở không bị trả hồ sơ.</p>
                </a>
                <a href="/tin-tuc" class="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all block no-underline">
                  <h4 class="font-bold text-slate-900 text-sm mb-1 line-clamp-2">Cảnh Giác 7 Chiêu Trò Lừa Đảo Suất Ngoại Giao NOXH Biên Hòa</h4>
                  <p class="text-xs text-slate-600 line-clamp-2">Cảnh báo thủ đoạn tiền chênh, suất nội bộ và cách thức mua căn hộ giá gốc trực tiếp từ chủ đầu tư.</p>
                </a>
              </div>
            </section>
          </div>

          <!-- Sidebar Sticky Right Column -->
          <div class="lg:col-span-1">
            <div class="sticky top-24 space-y-6">
              <!-- Contact Card -->
              <div class="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-6 rounded-2xl shadow-xl">
                <span class="text-xs font-bold uppercase tracking-wider text-amber-200 block mb-1">Kim Oanh Land</span>
                <h3 class="text-xl font-black mb-3">Tư Vấn Hồ Sơ NOXH Miễn Phí</h3>
                <p class="text-sm text-amber-100 leading-relaxed mb-6">
                  Đội ngũ chuyên viên Kim Oanh Land hỗ trợ kiểm tra điều kiện thu nhập, chuẩn bị bộ hồ sơ nộp Sở Xây dựng và thủ tục vay gói 5,4% hoàn toàn miễn phí.
                </p>
                <div class="space-y-3">
                  <a href="tel:0937587438" class="bg-white text-slate-900 hover:bg-slate-100 w-full py-3 rounded-xl font-bold text-center block shadow-md text-sm no-underline">
                    📞 Gọi Hotline: 0937 587 438
                  </a>
                  <a href="/lien-he" class="bg-amber-700/80 hover:bg-amber-700 text-white w-full py-3 rounded-xl font-semibold text-center block text-sm border border-amber-400/40 no-underline">
                    Đăng Ký Tư Vấn Trực Tuyến
                  </a>
                </div>
              </div>

              <!-- Other Projects Navigation -->
              <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h4 class="font-bold text-slate-900 text-base mb-4 uppercase tracking-wider text-xs">Các Dự Án NOXH Khác Tại Đồng Nai</h4>
                <ul class="space-y-3 text-sm">
                  <li>
                    <a href="/k-home-midtown-trang-bom" class="group flex items-center justify-between text-slate-700 hover:text-amber-600 transition-colors no-underline">
                      <span>K-Home Midtown Trảng Bom</span>
                      <span class="text-xs text-amber-600 font-semibold group-hover:translate-x-1 transition-transform">Từ 750tr &rarr;</span>
                    </a>
                  </li>
                  <li>
                    <a href="/k-home-avenue-nhon-trach" class="group flex items-center justify-between text-slate-700 hover:text-amber-600 transition-colors no-underline">
                      <span>K-Home Avenue Nhơn Trạch</span>
                      <span class="text-xs text-amber-600 font-semibold group-hover:translate-x-1 transition-transform">Từ 750tr &rarr;</span>
                    </a>
                  </li>
                  <li>
                    <a href="/k-home-skyview-trang-bom" class="group flex items-center justify-between text-slate-700 hover:text-amber-600 transition-colors no-underline">
                      <span>K-Home SkyView Bàu Xéo</span>
                      <span class="text-xs text-amber-600 font-semibold group-hover:translate-x-1 transition-transform">Từ 750tr &rarr;</span>
                    </a>
                  </li>
                </ul>
              </div>

              <!-- Mortgage Tool Quick Link -->
              <div class="bg-blue-50/70 p-6 rounded-2xl border border-blue-200">
                <h4 class="font-bold text-blue-950 text-sm mb-2">Bảng Tính Trả Góp Ngân Hàng</h4>
                <p class="text-xs text-blue-800 leading-relaxed mb-4">
                  Tính toán số tiền gốc, tiền lãi hàng tháng theo phương thức dư nợ giảm dần của gói vay 5,4%.
                </p>
                <a href="/tinh-tra-gop" class="text-blue-700 font-bold text-xs hover:underline flex items-center gap-1">
                  Mở công cụ tính trả góp &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    ${renderCommonFooter()}
  `;
}

/**
 * Render HTML tĩnh cho trang tin tức chi tiết
 */
export function renderNewsDetailHtml(article, contentHtml, relatedArticles = []) {
  return `
    ${renderCommonHeader("tin-tuc")}
    <main class="bg-white text-slate-800">
      <!-- Breadcrumb -->
      <nav class="bg-slate-50 border-b border-slate-200 py-3 text-xs sm:text-sm" aria-label="Breadcrumb">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 flex items-center gap-2 text-slate-600">
          <a href="/" class="hover:text-amber-600 transition-colors">Trang chủ</a>
          <span>/</span>
          <a href="/tin-tuc" class="hover:text-amber-600 transition-colors">Tin tức</a>
          <span>/</span>
          <span class="text-slate-900 font-semibold truncate max-w-xs sm:max-w-md">${escapeHtml(article.title)}</span>
        </div>
      </nav>

      <article class="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <!-- Header -->
        <header class="mb-8">
          <div class="flex items-center gap-3 mb-4">
            <span class="bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              ${escapeHtml(article.category || "Tin Tức Dự Án")}
            </span>
            <time datetime="${article.date}" class="text-xs text-slate-500 font-medium">${article.date}</time>
            <span class="text-xs text-slate-400">• Tác giả: Kim Oanh Land</span>
          </div>
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight mb-4">
            ${escapeHtml(article.title)}
          </h1>
          <p class="font-semibold text-slate-800 text-base sm:text-lg border-l-4 border-amber-600 pl-4 py-3 bg-amber-50/70 rounded-r-xl leading-relaxed">
            ${escapeHtml(article.excerpt)}
          </p>
        </header>

        <!-- Main Body -->
        <div class="article-content text-slate-800 leading-relaxed text-base">
          ${contentHtml}
        </div>

        <!-- Conversion CTA Banner -->
        <div class="my-12 p-6 sm:p-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div class="space-y-2 text-center sm:text-left">
            <span class="text-xs uppercase font-extrabold tracking-widest text-amber-200">Kim Oanh Land — Đồng Nai</span>
            <h3 class="text-xl sm:text-2xl font-black">Quan Tâm Dự Án Nhà Ở Xã Hội K-Home?</h3>
            <p class="text-sm text-amber-100 max-w-md">Nhận bảng giá gốc 2026, hướng dẫn chuẩn bị hồ sơ xét duyệt và kết nối vay ngân hàng lãi suất 5,4%/năm.</p>
          </div>
          <div class="shrink-0 flex flex-col sm:flex-row gap-3">
            <a href="/k-home-cityview-ho-nai" class="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-colors text-center no-underline">
              Xem K-Home CityView
            </a>
            <a href="tel:0937587438" class="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-colors text-center no-underline">
              Gọi: 0937 587 438
            </a>
          </div>
        </div>

        <!-- Related Articles -->
        ${relatedArticles.length > 0 ? `
          <div class="mt-12 pt-8 border-t border-slate-200">
            <h3 class="text-xl font-bold text-slate-900 mb-6">Bài Viết Liên Quan</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              ${relatedArticles.map(rel => `
                <a href="/tin-tuc/${rel.slug}" class="p-4 bg-slate-50 hover:bg-amber-50/50 rounded-xl border border-slate-200 hover:border-amber-300 transition-all block no-underline">
                  <h4 class="font-bold text-slate-900 text-sm mb-1 line-clamp-2">${escapeHtml(rel.title)}</h4>
                  <p class="text-xs text-slate-500 line-clamp-2">${escapeHtml(rel.excerpt)}</p>
                </a>
              `).join("")}
            </div>
          </div>
        ` : ""}
      </article>
    </main>
    ${renderCommonFooter()}
  `;
}

/**
 * Render HTML tĩnh cho trang Nhà Ở Xã Hội Trảng Bom – K-Home Midtown
 */
/**
 * Render HTML tĩnh cho trang Nhà Ở Xã Hội Trảng Bom – K-Home Midtown
 */
export function renderMidtownHtml() {
  return `
    ${renderCommonHeader("k-home-midtown-trang-bom")}
    <main class="bg-white text-slate-800">
      <!-- Breadcrumb -->
      <nav class="bg-slate-50 border-b border-slate-200 py-3 text-xs sm:text-sm" aria-label="Breadcrumb">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-slate-600">
          <a href="/" class="hover:text-amber-600 transition-colors">Trang chủ</a>
          <span>/</span>
          <a href="/san-pham" class="hover:text-amber-600 transition-colors">Dự án K-Home</a>
          <span>/</span>
          <span class="text-slate-900 font-semibold">Nhà Ở Xã Hội Trảng Bom – K-Home Midtown</span>
        </div>
      </nav>

      <!-- Hero Header Section -->
      <section class="bg-gradient-to-b from-amber-50/50 via-white to-white pt-10 pb-12 border-b border-slate-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="max-w-4xl">
            <div class="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <span>Đang Tiếp Nhận Hồ Sơ Xét Duyệt Trảng Bom 2026</span>
            </div>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              Nhà Ở Xã Hội Trảng Bom – Dự Án K-Home Midtown | Bảng Giá & Điều Kiện 2026
            </h1>
            <p class="text-lg sm:text-xl text-slate-700 leading-relaxed mb-8">
              Đại đô thị <strong>nhà ở xã hội Trảng Bom</strong> quy mô <strong>13,97 ha</strong> với <strong>542 căn hộ NOXH chuẩn Singapore</strong> và 20 căn shophouse dịch vụ, tọa lạc ngay trung tâm thị trấn Trảng Bom giữa 4 tuyến đường huyết mạch: <strong>30/4 – Hùng Vương – Lý Nam Đế – Lê Đại Hành</strong>. Mức giá chỉ từ <strong>750 triệu đồng/căn</strong>, hỗ trợ gói vay ưu đãi cố định <strong>5,4%/năm trong 25 năm</strong> từ Ngân hàng Chính sách Xã hội.
            </p>
            <div class="flex flex-wrap items-center gap-4">
              <a href="#bang-gia" class="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3.5 rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all no-underline">
                Xem Bảng Giá Căn Hộ 2026
              </a>
              <a href="#dieu-kien" class="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all no-underline">
                Kiểm Tra Điều Kiện Mua
              </a>
              <a href="tel:0937587438" class="border-2 border-amber-600 text-amber-700 hover:bg-amber-50 px-6 py-3.5 rounded-xl font-bold text-base transition-colors no-underline">
                Tư Vấn Hồ Sơ: 0937 587 438
              </a>
            </div>
          </div>

          <!-- Quick Stats Grid -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-200">
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span class="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1">Vị Trí Đắc Địa</span>
              <p class="text-base font-bold text-slate-900">4 mặt tiền đường, trung tâm Trảng Bom</p>
            </div>
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span class="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1">Quy Mô Công Trình</span>
              <p class="text-base font-bold text-slate-900">13,97 ha · 542 căn hộ NOXH (15 tầng)</p>
            </div>
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span class="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1">Mức Giá Niêm Yết</span>
              <p class="text-base font-bold text-amber-600">Từ 750 Triệu – 1,5 Tỷ/Căn</p>
            </div>
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span class="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1">Chính Sách Vay NOXH</span>
              <p class="text-base font-bold text-emerald-600">Vay 80% vốn · Trả góp từ 3,5 tr/tháng</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content Container -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <!-- Main Left Column -->
          <div class="lg:col-span-2 space-y-12">

            <!-- Section 1: Tổng quan -->
            <section id="tong-quan">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                1. Tổng Quan Dự Án Nhà Ở Xã Hội K-Home Midtown Trảng Bom
              </h2>
              <div class="prose max-w-none text-slate-700 leading-relaxed space-y-4">
                <p>
                  <strong>K-Home Midtown</strong> là dự án <strong>nhà ở xã hội Trảng Bom</strong> kiểu mẫu quy mô bậc nhất tỉnh Đồng Nai do <strong>Kim Oanh Land</strong> (thành viên Tập đoàn Kim Oanh Group) làm chủ đầu tư và phát triển. Dự án tọa lạc tại vị trí độc tôn sở hữu 4 mặt tiền đường lớn gồm 30/4, Hùng Vương, Lý Nam Đế và Lê Đại Hành, ngay vùng lõi trung tâm thị trấn Trảng Bom sầm uất.
                </p>
                <p>
                  Với tổng diện tích quy hoạch lên đến <strong>13,97 hecta</strong>, K-Home Midtown được phát triển như một khu đô thị phức hợp đa chức năng hoàn chỉnh, gồm các tòa tháp chung cư cao <strong>15 tầng</strong> cung ứng <strong>542 căn hộ NOXH</strong> chất lượng vượt trội, 20 căn shophouse thương mại, cùng hệ thống công viên cây xanh, hồ bơi tràn bờ và trường học nội khu. Dự án được tư vấn thiết kế bởi Tập đoàn hàng đầu Singapore <strong>Surbana Jurong</strong> và đạt chứng chỉ công trình xanh quốc tế <strong>EDGE</strong>.
                </p>

                <!-- Specs Table -->
                <div class="overflow-x-auto my-6 rounded-xl border border-slate-200">
                  <table class="w-full text-left text-sm border-collapse">
                    <thead class="bg-slate-100 text-slate-900 border-b border-slate-200">
                      <tr>
                        <th class="p-3 font-bold w-1/3">Thông Số Quy Hoạch</th>
                        <th class="p-3 font-bold">Chi Tiết K-Home Midtown Trảng Bom</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                      <tr><td class="p-3 font-semibold text-slate-800">Tên thương mại</td><td class="p-3">K-Home Midtown (K-Home Midtown Trảng Bom)</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Chủ đầu tư</td><td class="p-3">Kim Oanh Land (Tập đoàn Kim Oanh Group)</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Vị trí địa chỉ</td><td class="p-3">Giao lộ đường 30/4 – Hùng Vương – Lý Nam Đế – Lê Đại Hành, TT. Trảng Bom, Đồng Nai</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Tư vấn thiết kế kiến trúc</td><td class="p-3">Tập đoàn Surbana Jurong (Singapore)</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Quy mô quỹ đất</td><td class="p-3">13,97 hecta</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Mật độ xây dựng</td><td class="p-3">Khoảng 38% (còn lại dành cho công viên, hồ bơi & hạ tầng dịch vụ)</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Quy mô công trình</td><td class="p-3">Tòa tháp cao 15 tầng hiện đại, tầng hầm để xe thông thoáng</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Tổng số lượng căn hộ</td><td class="p-3">542 căn hộ NOXH + 20 căn shophouse khối đế</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Diện tích căn hộ</td><td class="p-3">36,1 m² – 68,8 m² (Studio, 1PN+A, 1PN+B, 2PN)</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Tiêu chuẩn bàn giao</td><td class="p-3">Hoàn thiện nội thất cơ bản chuẩn Singapore: sàn gỗ, tủ bếp, thiết bị vệ sinh cao cấp</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Hình thức sở hữu</td><td class="p-3">Sổ hồng sở hữu lâu dài (vĩnh viễn)</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Thời gian bàn giao</td><td class="p-3">Dự kiến Quý 3/2027 – Quý 1/2028 (thi công thần tốc)</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <!-- Section 2: Bảng giá căn hộ -->
            <section id="bang-gia">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                2. Bảng Giá Căn Hộ Nhà Ở Xã Hội Trảng Bom – K-Home Midtown 2026
              </h2>
              <div class="prose max-w-none text-slate-700 leading-relaxed space-y-4">
                <p>
                  Mức giá <strong>mua nhà ở xã hội Trảng Bom</strong> tại dự án K-Home Midtown được công bố niêm yết theo khung giá nhà ở xã hội được phê duyệt, cam kết bán đúng giá gốc chủ đầu tư, không chênh lệch:
                </p>

                <div class="overflow-x-auto my-6 rounded-xl border border-slate-200">
                  <table class="w-full text-left text-sm border-collapse">
                    <thead class="bg-amber-600 text-white">
                      <tr>
                        <th class="p-3 font-bold">Mẫu Căn Hộ</th>
                        <th class="p-3 font-bold">DT Xây Dựng</th>
                        <th class="p-3 font-bold">DT Thông Thủy</th>
                        <th class="p-3 font-bold">Giá Bán Niêm Yết</th>
                        <th class="p-3 font-bold">Vốn Tự Có 20%</th>
                        <th class="p-3 font-bold">Gói Vay 80% (5,4%)</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
                      <tr class="hover:bg-amber-50/50">
                        <td class="p-3 font-bold text-slate-900"><a href="/k-home-midtown-trang-bom/can-ho-studio" class="text-amber-700 underline font-semibold">Căn Hộ Studio</a></td>
                        <td class="p-3">36,1 m²</td>
                        <td class="p-3">32,0 m²</td>
                        <td class="p-3 font-bold text-amber-600">Từ 750 triệu</td>
                        <td class="p-3">~ 150 triệu</td>
                        <td class="p-3">Trả góp ~3,5 tr/tháng</td>
                      </tr>
                      <tr class="hover:bg-amber-50/50">
                        <td class="p-3 font-bold text-slate-900"><a href="/k-home-midtown-trang-bom/can-ho-1-phong-ngu-a" class="text-amber-700 underline font-semibold">Căn 1 Phòng Ngủ + A</a></td>
                        <td class="p-3">47,0 m²</td>
                        <td class="p-3">42,0 m²</td>
                        <td class="p-3 font-bold text-amber-600">Từ 990 triệu</td>
                        <td class="p-3">~ 198 triệu</td>
                        <td class="p-3">Trả góp ~4,6 tr/tháng</td>
                      </tr>
                      <tr class="hover:bg-amber-50/50">
                        <td class="p-3 font-bold text-slate-900"><a href="/k-home-midtown-trang-bom/can-ho-1-phong-ngu-b" class="text-amber-700 underline font-semibold">Căn 1 Phòng Ngủ + B (2WC)</a></td>
                        <td class="p-3">55,1 m²</td>
                        <td class="p-3">48,8 m²</td>
                        <td class="p-3 font-bold text-amber-600">Từ 1,20 tỷ</td>
                        <td class="p-3">~ 240 triệu</td>
                        <td class="p-3">Trả góp ~5,6 tr/tháng</td>
                      </tr>
                      <tr class="hover:bg-amber-50/50">
                        <td class="p-3 font-bold text-slate-900"><a href="/k-home-midtown-trang-bom/can-ho-2-phong-ngu" class="text-amber-700 underline font-semibold">Căn 2 Phòng Ngủ (2WC)</a></td>
                        <td class="p-3">68,8 m²</td>
                        <td class="p-3">61,6 m²</td>
                        <td class="p-3 font-bold text-amber-600">Từ 1,50 tỷ</td>
                        <td class="p-3">~ 300 triệu</td>
                        <td class="p-3">Trả góp ~6,9 tr/tháng</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p class="text-sm text-slate-600 italic">
                  * Giá bán đã bao gồm thuế VAT 5% theo luật NOXH ưu đãi. Cư dân tại Trảng Bom cũng có thể tham khảo thêm dự án <a href="/k-home-skyview-trang-bom" class="text-amber-600 font-bold hover:underline">K-Home SkyView Bàu Xéo</a> hoặc <a href="/k-home-cityview-ho-nai" class="text-amber-600 font-bold hover:underline">nhà ở xã hội Biên Hòa K-Home CityView</a> để so sánh vị trí và diện tích phù hợp nhu cầu.
                </p>
              </div>
            </section>

            <!-- Section 3: Vị trí & Kết nối -->
            <section id="vi-tri">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                3. Vị Trí Vàng Giữa 4 Tuyến Đường Lớn & Kết Nối Giao Thông Trảng Bom
              </h2>
              <div class="prose max-w-none text-slate-700 leading-relaxed space-y-4">
                <p>
                  K-Home Midtown sở hữu vị trí kim cương hiếm có tại huyện Trảng Bom khi nằm gọn giữa 4 trục lộ huyết mạch của thị trấn: <strong>đường 30/4, Hùng Vương, Lý Nam Đế và Lê Đại Hành</strong>. Đây là tâm điểm kết nối các khu công nghiệp trọng điểm lớn nhất Đồng Nai:
                </p>
                <ul class="list-disc list-inside space-y-2">
                  <li><strong>Cách KCN Bàu Xéo (gần 500 ha):</strong> Chỉ 3 – 5 phút di chuyển (nơi có hơn 30.000 chuyên gia, kỹ sư và công nhân làm việc).</li>
                  <li><strong>Kết nối KCN Sông Mây (473 ha):</strong> Khoảng 10 – 12 phút qua đường ĐT 767.</li>
                  <li><strong>Kết nối KCN Hố Nai & KCN Giang Điền:</strong> Chỉ 10 – 15 phút.</li>
                  <li><strong>Đến trung tâm hành chính TP. Biên Hòa:</strong> Khoảng 15 km (20 phút lái xe dọc Quốc Lộ 1A).</li>
                  <li><strong>Đến Ga Trảng Bom:</strong> Khoảng 5 phút (điểm trung chuyển hàng hóa và hành khách đường sắt trọng yếu).</li>
                  <li><strong>Kết nối Sân bay Quốc tế Long Thành:</strong> Khoảng 25 – 30 phút theo các trục ĐT 777 và vành đai liên vùng đang triển khai.</li>
                </ul>
                <p>
                  Nhờ vị trí trung tâm hành chính, cư dân Midtown dễ dàng tiếp cận hệ sinh thái tiện ích đầy đủ quanh bán kính 1km: Trường THPT Thống Nhất, Trường THCS Hùng Vương, Chợ Trảng Bom, Bệnh viện Đa khoa Trảng Bom và Trung tâm Văn hóa Thể thao huyện.
                </p>
              </div>
            </section>

            <!-- Section 4: Pháp lý -->
            <section id="phap-ly">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                4. Hồ Sơ Pháp Lý Dự Án K-Home Midtown Trảng Bom Đã Hoàn Chỉnh
              </h2>
              <div class="prose max-w-none text-slate-700 leading-relaxed space-y-4">
                <p>
                  K-Home Midtown là một trong những dự án [nhà ở xã hội Trảng Bom](/k-home-midtown-trang-bom) có tính pháp lý minh bạch hàng đầu, được UBND tỉnh Đồng Nai phê duyệt đầy đủ các thủ tục theo Luật Nhà ở và Luật Đất đai:
                </p>
                <ul class="list-disc list-inside space-y-2">
                  <li>Quyết định phê duyệt đồ án Quy hoạch chi tiết xây dựng tỷ lệ 1/500 toàn khu đô thị 13,97 ha.</li>
                  <li>Quyết định chấp thuận chủ trương đầu tư và công nhận Kim Oanh Land là chủ đầu tư dự án.</li>
                  <li>Giấy phép xây dựng công trình tháp chung cư NOXH được Sở Xây dựng tỉnh Đồng Nai cấp phép.</li>
                  <li>Biên bản nghiệm thu hoàn thành các hạng mục móng cọc và hạ tầng kỹ thuật đúng tiêu chuẩn quốc gia.</li>
                  <li>Hình thức sở hữu: <strong>Sổ hồng lâu dài</strong>, đảm bảo quyền sở hữu tài sản an toàn tuyệt đối cho người mua.</li>
                </ul>
              </div>
            </section>

            <!-- Section 5: Chuẩn Singapore & EDGE -->
            <section id="chuan-singapore">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                5. Thiết Kế Chuẩn Singapore Surbana Jurong & Tiêu Chuẩn Công Trình Xanh EDGE
              </h2>
              <div class="prose max-w-none text-slate-700 leading-relaxed space-y-4">
                <p>
                  Khác với quan niệm cũ về nhà ở xã hội đơn điệu, K-Home Midtown được thiết kế bởi <strong>Surbana Jurong (Singapore)</strong> mang đến diện mạo như một khu căn hộ thương mại cao cấp:
                </p>
                <ul class="list-disc list-inside space-y-2">
                  <li><strong>100% căn hộ đón ánh sáng và gió tự nhiên:</strong> Thiết kế hành lang mở, đối lưu không khí trong lành, tối ưu hóa ban công và logia giặt phơi riêng biệt.</li>
                  <li><strong>Chứng chỉ xanh quốc tế EDGE (IFC - World Bank):</strong> Giảm ít nhất 20% mức tiêu thụ năng lượng điện, 20% lượng nước sinh hoạt và giảm phát thải carbon, giúp cư dân tiết kiệm hàng triệu đồng hóa đơn sinh hoạt mỗi năm.</li>
                  <li><strong>Hệ tiện ích đa tầng:</strong> Hồ bơi tràn bờ chuẩn phong cách resort, công viên cây xanh tháp tầng, đường chạy bộ nội khu, sân chơi trẻ em an toàn và phòng gym hiện đại.</li>
                  <li><strong>Vật liệu bàn giao cao cấp:</strong> Cửa chống cháy, khóa từ thông minh, thiết bị vệ sinh tiết kiệm nước, tủ bếp chống ẩm và sàn gỗ phòng ngủ cao cấp.</li>
                </ul>
              </div>
            </section>

            <!-- Section 6: Vay 80% Lãi 5.4% -->
            <section id="chinh-sach-vay">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                6. Chính Sách Vay Vốn Ngân Hàng CSXH 80% – Lãi Suất 5,4%/Năm Trong 25 Năm
              </h2>
              <div class="prose max-w-none text-slate-700 leading-relaxed space-y-4">
                <p>
                  Nhằm hỗ trợ công nhân, kỹ sư và người thu nhập thấp tại Trảng Bom hiện thực hóa giấc mơ sở hữu nhà riêng, chính sách tài chính cho K-Home Midtown cực kỳ nhẹ nhàng:
                </p>
                <div class="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                  <h4 class="font-bold text-emerald-900 text-lg">Điểm Nổi Bật Của Gói Vay NOXH Trảng Bom:</h4>
                  <p class="text-emerald-800 text-sm leading-relaxed">
                    • <strong>Tỷ lệ vay:</strong> Lên đến 75% – 80% giá trị căn hộ trên Hợp đồng mua bán.<br>
                    • <strong>Lãi suất ưu đãi:</strong> Cố định <strong>5,4%/năm</strong> do Ngân hàng Chính sách Xã hội bảo trợ.<br>
                    • <strong>Thời hạn vay:</strong> Tối đa <strong>25 năm</strong> (300 tháng).<br>
                    • <strong>Số tiền trả góp:</strong> Chỉ từ <strong>3,5 – 5,5 triệu đồng/tháng</strong> (cả gốc và lãi giảm dần), thấp hơn hoặc bằng chi phí thuê nhà trọ chật chội bên ngoài.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 7: Điều kiện & Thủ tục -->
            <section id="dieu-kien">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                7. Điều Kiện & Thủ Tục Đăng Ký Mua Nhà Ở Xã Hội Trảng Bom 2026
              </h2>
              <div class="prose max-w-none text-slate-700 leading-relaxed space-y-4">
                <p>
                  Theo Luật Nhà ở 2023 (có hiệu lực từ ngày 01/08/2024), điều kiện mua nhà ở xã hội đã được nới lỏng tạo điều kiện tối đa cho người lao động:
                </p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                  <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 class="font-bold text-slate-900 mb-2 text-sm uppercase">1. Điều Kiện Nhà Ở</h4>
                    <p class="text-xs text-slate-600 leading-relaxed">Chưa sở hữu nhà ở hoặc đất ở đứng tên tại tỉnh Đồng Nai, hoặc diện tích nhà ở bình quân dưới 15 m² sàn/người.</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 class="font-bold text-slate-900 mb-2 text-sm uppercase">2. Điều Kiện Thu Nhập</h4>
                    <p class="text-xs text-slate-600 leading-relaxed">Thu nhập chịu thuế dưới 15 triệu/tháng (với người độc thân) hoặc tổng thu nhập hai vợ chồng dưới 30–50 triệu/tháng theo hướng dẫn mới nhất.</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 class="font-bold text-slate-900 mb-2 text-sm uppercase">3. Điều Kiện Cư Trú</h4>
                    <p class="text-xs text-slate-600 leading-relaxed">Có thường trú hoặc tạm trú xác thực qua ứng dụng VNeID mức 2 tại tỉnh Đồng Nai. Không còn yêu cầu đóng BHXH 1 năm phức tạp như trước.</p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 8: FAQ -->
            <section id="faq">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                8. Câu Hỏi Thường Gặp Về Dự Án K-Home Midtown Trảng Bom
              </h2>
              <div class="space-y-4">
                <details class="group bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <summary class="font-bold text-slate-900 cursor-pointer flex items-center justify-between">
                    <span>K-Home Midtown Trảng Bom có vị trí chính xác ở đâu?</span>
                    <span class="transition group-open:rotate-180">▼</span>
                  </summary>
                  <div class="mt-4 text-slate-700 leading-relaxed border-t border-slate-200 pt-4 text-sm">
                    <p>Dự án tọa lạc ngay trung tâm thị trấn Trảng Bom, tiếp giáp 4 tuyến đường: 30/4, Hùng Vương, Lý Nam Đế và Lê Đại Hành, huyện Trảng Bom, tỉnh Đồng Nai. Vị trí chỉ cách KCN Bàu Xéo 3 phút và cách Biên Hòa 15km.</p>
                  </div>
                </details>
                <details class="group bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <summary class="font-bold text-slate-900 cursor-pointer flex items-center justify-between">
                    <span>Giá bán căn hộ K-Home Midtown Trảng Bom là bao nhiêu?</span>
                    <span class="transition group-open:rotate-180">▼</span>
                  </summary>
                  <div class="mt-4 text-slate-700 leading-relaxed border-t border-slate-200 pt-4 text-sm">
                    <p>Giá căn hộ tại K-Home Midtown chỉ từ 750 triệu đồng/căn cho căn Studio, từ 990 triệu đồng/căn cho căn 1PN+A, từ 1,2 tỷ cho căn 1PN+B và từ 1,5 tỷ cho căn 2PN. Tất cả đều được bàn giao hoàn thiện full nội thất cơ bản theo chuẩn Singapore.</p>
                  </div>
                </details>
                <details class="group bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <summary class="font-bold text-slate-900 cursor-pointer flex items-center justify-between">
                    <span>Người lao động làm việc tại KCN Bàu Xéo có được mua không?</span>
                    <span class="transition group-open:rotate-180">▼</span>
                  </summary>
                  <div class="mt-4 text-slate-700 leading-relaxed border-t border-slate-200 pt-4 text-sm">
                    <p>Có! Dự án ưu tiên đặc biệt cho cán bộ, công nhân viên và người lao động làm việc tại các khu công nghiệp trên địa bàn Trảng Bom (Bàu Xéo, Sông Mây, Hố Nai, Giang Điền) đáp ứng đủ điều kiện về nhà ở và thu nhập theo quy định.</p>
                  </div>
                </details>
                <details class="group bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <summary class="font-bold text-slate-900 cursor-pointer flex items-center justify-between">
                    <span>Làm thế nào để nộp hồ sơ xét duyệt căn hộ K-Home Midtown?</span>
                    <span class="transition group-open:rotate-180">▼</span>
                  </summary>
                  <div class="mt-4 text-slate-700 leading-relaxed border-t border-slate-200 pt-4 text-sm">
                    <p>Quý khách chỉ cần liên hệ Hotline Kim Oanh Land: <a href="tel:0937587438" class="text-amber-600 font-bold hover:underline">0937 587 438</a>. Đội ngũ chuyên viên sẽ hỗ trợ kiểm tra điều kiện, hướng dẫn điền mẫu đơn (Mẫu 01, 02, 04) và nộp hồ sơ xét duyệt miễn phí 100%.</p>
                  </div>
                </details>
              </div>
            </section>
          </div>

          <!-- Right Sidebar -->
          <div class="lg:col-span-1 space-y-8">
            <div class="sticky top-24 space-y-6">
              <!-- Hotline Card -->
              <div class="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-6 rounded-2xl shadow-xl">
                <span class="text-xs uppercase font-extrabold tracking-widest text-amber-200 block mb-2">Ban Quản Lý Dự Án K-Home</span>
                <h3 class="text-xl font-bold mb-3">Tư Vấn Hồ Sơ Midtown Trảng Bom</h3>
                <p class="text-sm text-amber-100 mb-6 leading-relaxed">
                  Đăng ký tư vấn miễn phí điều kiện mua nhà ở xã hội, chuẩn bị biểu mẫu hồ sơ và thẩm định gói vay vốn 5,4%/năm.
                </p>
                <a href="tel:0937587438" class="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3.5 rounded-xl font-extrabold text-center block shadow-md transition-all no-underline">
                  Gọi Ngay: 0937 587 438
                </a>
              </div>

              <!-- Other Projects Nav -->
              <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <h4 class="font-bold text-slate-900 text-sm uppercase tracking-wider">Các Dự Án NOXH K-Home Khác</h4>
                <ul class="space-y-3 text-sm">
                  <li>
                    <a href="/k-home-cityview-ho-nai" class="font-semibold text-slate-800 hover:text-amber-600 transition-colors block">
                      K-Home CityView Biên Hòa &rarr;
                    </a>
                    <span class="text-xs text-slate-500">Mặt tiền Điểu Xiển, 1.328 căn từ 950 tr</span>
                  </li>
                  <li>
                    <a href="/k-home-avenue-nhon-trach" class="font-semibold text-slate-800 hover:text-amber-600 transition-colors block">
                      K-Home Avenue Nhơn Trạch &rarr;
                    </a>
                    <span class="text-xs text-slate-500">Mặt tiền 25C gần Sân bay Long Thành, 1.022 căn</span>
                  </li>
                  <li>
                    <a href="/k-home-skyview-trang-bom" class="font-semibold text-slate-800 hover:text-amber-600 transition-colors block">
                      K-Home SkyView Bàu Xéo &rarr;
                    </a>
                    <span class="text-xs text-slate-500">KĐT Bàu Xéo Trảng Bom, 358 căn từ 750 tr</span>
                  </li>
                </ul>
              </div>

              <!-- Calculator Box -->
              <div class="bg-blue-50/70 p-6 rounded-2xl border border-blue-200">
                <h4 class="font-bold text-blue-950 text-sm mb-2">Bảng Tính Trả Góp Ngân Hàng</h4>
                <p class="text-xs text-blue-800 leading-relaxed mb-4">
                  Tính toán số tiền gốc và lãi trả góp hàng tháng theo dư nợ giảm dần của gói vay CSXH 5,4%/năm.
                </p>
                <a href="/tinh-tra-gop" class="text-blue-700 font-bold text-xs hover:underline flex items-center gap-1">
                  Mở công cụ tính trả góp &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    ${renderCommonFooter()}
  `;
}

/**
 * Render HTML tĩnh cho trang Nhà Ở Xã Hội Nhơn Trạch – K-Home Avenue
 */
export function renderAvenueHtml() {
  return `
    ${renderCommonHeader("k-home-avenue-nhon-trach")}
    <main class="bg-white text-slate-800">
      <!-- Breadcrumb -->
      <nav class="bg-slate-50 border-b border-slate-200 py-3 text-xs sm:text-sm" aria-label="Breadcrumb">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-slate-600">
          <a href="/" class="hover:text-amber-600 transition-colors">Trang chủ</a>
          <span>/</span>
          <a href="/san-pham" class="hover:text-amber-600 transition-colors">Dự án K-Home</a>
          <span>/</span>
          <span class="text-slate-900 font-semibold">Nhà Ở Xã Hội Nhơn Trạch – K-Home Avenue</span>
        </div>
      </nav>

      <!-- Hero Header Section -->
      <section class="bg-gradient-to-b from-amber-50/50 via-white to-white pt-10 pb-12 border-b border-slate-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="max-w-4xl">
            <div class="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <span>Đang Tiếp Nhận Hồ Sơ Xét Duyệt Nhơn Trạch 2026</span>
            </div>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              Nhà Ở Xã Hội Nhơn Trạch – K-Home Avenue Gần Sân Bay Long Thành | Bảng Giá 2026
            </h1>
            <p class="text-lg sm:text-xl text-slate-700 leading-relaxed mb-8">
              Tổ hợp <strong>nhà ở xã hội Nhơn Trạch</strong> quy mô <strong>5,3 ha</strong> với <strong>1.022 căn hộ NOXH chuẩn Singapore</strong> và 82 căn shophouse tọa lạc ngay mặt tiền <strong>đại lộ Nguyễn Ái Quốc (đường 25C rộng 100m)</strong> kết nối trực tiếp cổng số 1 Sân bay Quốc tế Long Thành và đường Vành Đai 3 TP.HCM. Mức giá chỉ từ <strong>750 triệu đồng/căn</strong>, hỗ trợ vay 80% vốn cố định <strong>5,4%/năm trong 25 năm</strong>.
            </p>
            <div class="flex flex-wrap items-center gap-4">
              <a href="#bang-gia" class="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3.5 rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all no-underline">
                Xem Bảng Giá Căn Hộ 2026
              </a>
              <a href="#dieu-kien" class="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all no-underline">
                Kiểm Tra Điều Kiện Mua
              </a>
              <a href="tel:0937587438" class="border-2 border-amber-600 text-amber-700 hover:bg-amber-50 px-6 py-3.5 rounded-xl font-bold text-base transition-colors no-underline">
                Tư Vấn Hồ Sơ: 0937 587 438
              </a>
            </div>
          </div>

          <!-- Quick Stats Grid -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-200">
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span class="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1">Mặt Tiền Đại Lộ 25C</span>
              <p class="text-base font-bold text-slate-900">Trục nối thẳng Sân bay Long Thành</p>
            </div>
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span class="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1">Quy Mô Công Trình</span>
              <p class="text-base font-bold text-slate-900">4 block 12 tầng · 1.022 căn NOXH</p>
            </div>
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span class="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1">Mức Giá Niêm Yết</span>
              <p class="text-base font-bold text-amber-600">Từ 750 Triệu – 1,47 Tỷ/Căn</p>
            </div>
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span class="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1">Chính Sách Vay NOXH</span>
              <p class="text-base font-bold text-emerald-600">Vay 80% vốn · Trả góp từ 3,5 tr/tháng</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content Container -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <!-- Main Left Column -->
          <div class="lg:col-span-2 space-y-12">

            <!-- Section 1: Tổng quan -->
            <section id="tong-quan">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                1. Tổng Quan Dự Án Nhà Ở Xã Hội K-Home Avenue Nhơn Trạch
              </h2>
              <div class="prose max-w-none text-slate-700 leading-relaxed space-y-4">
                <p>
                  <strong>K-Home Avenue</strong> là đại dự án <strong>nhà ở xã hội Nhơn Trạch</strong> tiêu biểu do <strong>Kim Oanh Land</strong> đầu tư và phát triển tại huyện Nhơn Trạch, tỉnh Đồng Nai. Dự án nằm tại vị trí chiến lược ngay mặt tiền tuyến đường 25C (Đại lộ Nguyễn Ái Quốc) có lộ giới mở rộng 100m, là cửa ngõ trực tiếp dẫn vào Cảng Hàng không Quốc tế Long Thành.
                </p>
                <p>
                  Dự án được quy hoạch trên tổng diện tích <strong>5,3 hecta</strong>, gồm <strong>4 tòa tháp cao 12 tầng</strong> với <strong>1.022 căn hộ NOXH</strong> chuẩn Singapore, cùng 82 căn nhà phố thương mại shophouse. K-Home Avenue ra đời nhằm đáp ứng cơn khát nhà ở chất lượng cao, giá rẻ cho hơn 130.000 chuyên gia, kỹ sư và công nhân tại 9 khu công nghiệp Nhơn Trạch và nguồn nhân lực phục vụ sân bay Long Thành.
                </p>

                <!-- Specs Table -->
                <div class="overflow-x-auto my-6 rounded-xl border border-slate-200">
                  <table class="w-full text-left text-sm border-collapse">
                    <thead class="bg-slate-100 text-slate-900 border-b border-slate-200">
                      <tr>
                        <th class="p-3 font-bold w-1/3">Thông Số Kỹ Thuật</th>
                        <th class="p-3 font-bold">Chi Tiết Quy Hoạch K-Home Avenue</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                      <tr><td class="p-3 font-semibold text-slate-800">Tên thương mại</td><td class="p-3">K-Home Avenue (K-Home Avenue Nhơn Trạch)</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Chủ đầu tư</td><td class="p-3">Kim Oanh Land (Tập đoàn Kim Oanh Group)</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Vị trí địa chỉ</td><td class="p-3">Mặt tiền đường 25C (Nguyễn Ái Quốc), Xã Phước An, Huyện Nhơn Trạch, Tỉnh Đồng Nai</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Tư vấn thiết kế kiến trúc</td><td class="p-3">Tập đoàn Surbana Jurong (Singapore)</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Quy mô quỹ đất</td><td class="p-3">5,3 hecta</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Mật độ xây dựng</td><td class="p-3">Khoảng 35% – 38%</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Quy mô công trình</td><td class="p-3">4 block cao 12 tầng hiện đại</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Tổng số lượng căn hộ</td><td class="p-3">1.022 căn hộ NOXH + 82 shophouse khối đế</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Diện tích căn hộ</td><td class="p-3">37,7 m² – 69,5 m² (Studio, 1PN+, 2PN Nhỏ, 2PN Lớn)</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Tiêu chuẩn bàn giao</td><td class="p-3">Bàn giao hoàn thiện nội thất chuẩn Singapore cao cấp</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Hình thức sở hữu</td><td class="p-3">Sổ hồng sở hữu lâu dài (vĩnh viễn)</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Thời gian bàn giao dự kiến</td><td class="p-3">Dự kiến Quý 4/2027 – Quý 2/2028</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <!-- Section 2: Bảng giá căn hộ -->
            <section id="bang-gia">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                2. Bảng Giá Căn Hộ Nhà Ở Xã Hội Nhơn Trạch – K-Home Avenue 2026
              </h2>
              <div class="prose max-w-none text-slate-700 leading-relaxed space-y-4">
                <p>
                  Giá bán căn hộ [nhà ở xã hội Nhơn Trạch](/k-home-avenue-nhon-trach) K-Home Avenue được Sở Xây dựng tỉnh thẩm định nghiêm ngặt, áp dụng giá gốc cho người thu nhập thấp:
                </p>

                <div class="overflow-x-auto my-6 rounded-xl border border-slate-200">
                  <table class="w-full text-left text-sm border-collapse">
                    <thead class="bg-amber-600 text-white">
                      <tr>
                        <th class="p-3 font-bold">Mẫu Căn Hộ</th>
                        <th class="p-3 font-bold">DT Xây Dựng</th>
                        <th class="p-3 font-bold">DT Thông Thủy</th>
                        <th class="p-3 font-bold">Giá Bán Niêm Yết</th>
                        <th class="p-3 font-bold">Vốn Tự Có 20%</th>
                        <th class="p-3 font-bold">Gói Vay 80% (5,4%)</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
                      <tr class="hover:bg-amber-50/50">
                        <td class="p-3 font-bold text-slate-900"><a href="/k-home-avenue-nhon-trach/can-ho-studio" class="text-amber-700 underline font-semibold">Căn Hộ Studio</a></td>
                        <td class="p-3">37,7 m²</td>
                        <td class="p-3">33,3 m²</td>
                        <td class="p-3 font-bold text-amber-600">Từ 750 triệu</td>
                        <td class="p-3">~ 150 triệu</td>
                        <td class="p-3">Trả góp ~3,5 tr/tháng</td>
                      </tr>
                      <tr class="hover:bg-amber-50/50">
                        <td class="p-3 font-bold text-slate-900"><a href="/k-home-avenue-nhon-trach/can-ho-1-phong-ngu" class="text-amber-700 underline font-semibold">Căn 1 Phòng Ngủ +</a></td>
                        <td class="p-3">46,6 m²</td>
                        <td class="p-3">41,6 m²</td>
                        <td class="p-3 font-bold text-amber-600">Từ 990 triệu</td>
                        <td class="p-3">~ 198 triệu</td>
                        <td class="p-3">Trả góp ~4,6 tr/tháng</td>
                      </tr>
                      <tr class="hover:bg-amber-50/50">
                        <td class="p-3 font-bold text-slate-900"><a href="/k-home-avenue-nhon-trach/can-ho-2-phong-ngu" class="text-amber-700 underline font-semibold">Căn 2 Phòng Ngủ (Nhỏ - 2WC)</a></td>
                        <td class="p-3">65,7 m²</td>
                        <td class="p-3">58,4 m²</td>
                        <td class="p-3 font-bold text-amber-600">1,23 tỷ – 1,39 tỷ</td>
                        <td class="p-3">246 – 278 triệu</td>
                        <td class="p-3">Trả góp ~5,7 tr/tháng</td>
                      </tr>
                      <tr class="hover:bg-amber-50/50">
                        <td class="p-3 font-bold text-slate-900"><a href="/k-home-avenue-nhon-trach/can-ho-2-phong-ngu-b-avenue" class="text-amber-700 underline font-semibold">Căn 2 Phòng Ngủ (Lớn - 2WC)</a></td>
                        <td class="p-3">69,5 m²</td>
                        <td class="p-3">62,2 m²</td>
                        <td class="p-3 font-bold text-amber-600">1,40 tỷ – 1,47 tỷ</td>
                        <td class="p-3">280 – 294 triệu</td>
                        <td class="p-3">Trả góp ~6,5 tr/tháng</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p class="text-sm text-slate-600 italic">
                  * Giá bán căn hộ đã bao gồm thuế VAT ưu đãi 5% cho NOXH. Nếu quý khách đang công tác tại khu vực Biên Hòa, vui lòng tham khảo thêm dự án <a href="/k-home-cityview-ho-nai" class="text-amber-600 font-bold hover:underline">nhà ở xã hội Biên Hòa K-Home CityView</a> (từ 950 triệu).
                </p>
              </div>
            </section>

            <!-- Section 3: Vị trí & Kết nối -->
            <section id="vi-tri">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                3. Vị Trí Mặt Tiền Đường 25C, Kết Nối Sân Bay Long Thành & Cầu Cát Lái
              </h2>
              <div class="prose max-w-none text-slate-700 leading-relaxed space-y-4">
                <p>
                  K-Home Avenue tọa lạc tại vị trí độc đắc trên trục đường huyết mạch <strong>Nguyễn Ái Quốc (Tỉnh lộ 25C)</strong>, trung tâm giao thương của toàn bộ vùng kinh tế trọng điểm phía Nam:
                </p>
                <ul class="list-disc list-inside space-y-2">
                  <li><strong>Cách Cổng số 1 Sân bay Quốc tế Long Thành:</strong> Chỉ 10 – 12 phút di chuyển dọc theo tuyến đại lộ 25C thẳng tắp rộng 100m.</li>
                  <li><strong>Kết nối Cầu Nhơn Trạch & Tuyến Vành Đai 3 TP.HCM:</strong> Chỉ 10 phút, rút ngắn thời gian di chuyển về TP. Thủ Đức xuống còn 20 phút.</li>
                  <li><strong>Kết nối Cầu Cát Lái & Quận 2 cũ (TP. Thủ Đức):</strong> Khoảng 15 – 20 phút sau khi cầu được hoàn thiện, thuận lợi kết nối trung tâm TP.HCM.</li>
                  <li><strong>Liền kề 9 khu công nghiệp Nhơn Trạch:</strong> KCN Nhơn Trạch 1, 2, 3, 5, 6, KCN Dệt may Nhơn Trạch, KCN Ông Kèo chỉ trong vòng bán kính 3 – 7 km.</li>
                  <li><strong>Kết nối Cao tốc Bến Lức – Long Thành và Cao tốc TP.HCM – Long Thành – Dầu Giây:</strong> Dễ dàng kết nối về các tỉnh miền Tây và Vũng Tàu.</li>
                </ul>
              </div>
            </section>

            <!-- Section 4: Pháp lý -->
            <section id="phap-ly">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                4. Hồ Sơ Pháp Lý Dự Án K-Home Avenue Nhơn Trạch
              </h2>
              <div class="prose max-w-none text-slate-700 leading-relaxed space-y-4">
                <p>
                  Dự án nhà ở xã hội K-Home Avenue đã hoàn tất đầy đủ quy trình pháp lý theo luật định:
                </p>
                <ul class="list-disc list-inside space-y-2">
                  <li>Quyết định phê duyệt Quy hoạch chi tiết 1/500 dự án khu nhà ở xã hội do cơ quan thẩm quyền ban hành.</li>
                  <li>Quyết định giao đất sạch và chấp thuận chủ trương đầu tư cho Kim Oanh Land.</li>
                  <li>Giấy phép xây dựng công trình 4 block chung cư 12 tầng.</li>
                  <li>Hình thức sở hữu pháp lý: <strong>Sổ hồng sở hữu lâu dài</strong>, sang tên chuyển nhượng minh bạch sau 5 năm theo quy định NOXH.</li>
                </ul>
              </div>
            </section>

            <!-- Section 5: Tiêu chuẩn Singapore & Tiện ích -->
            <section id="chuan-singapore">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                5. Thiết Kế Singapore Hiện Đại & Hệ Tiện Ích Đa Lớp Tại K-Home Avenue
              </h2>
              <div class="prose max-w-none text-slate-700 leading-relaxed space-y-4">
                <p>
                  Được đồng hành bởi <strong>Surbana Jurong (Singapore)</strong>, K-Home Avenue mang đến trải nghiệm sống vượt xa chuẩn nhà ở xã hội truyền thống:
                </p>
                <ul class="list-disc list-inside space-y-2">
                  <li><strong>Công trình xanh EDGE:</strong> Ứng dụng giải pháp thiết kế thông minh giảm hấp thụ nhiệt, tối ưu hóa gió mát tự nhiên, tiết kiệm chi phí điện nước lâu dài.</li>
                  <li><strong>Hệ sinh thái tiện ích:</strong> Bể bơi resort xanh mát, công viên dạo bộ, khu vui chơi vận động trẻ em, chòi nghỉ thư giãn, trạm sạc xe điện thông minh nội khu và khu thể dục ngoài trời.</li>
                  <li><strong>Dãy shophouse thương mại 82 căn:</strong> Cung cấp chuỗi cửa hàng tiện lợi siêu thị minimart, cafe sân vườn, nhà thuốc và dịch vụ ẩm thực tại chân tòa nhà.</li>
                </ul>
              </div>
            </section>

            <!-- Section 6: Vay CSXH 5.4% -->
            <section id="chinh-sach-vay">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                6. Chính Sách Vay Vốn Ưu Đãi 80% Lãi Suất 5,4%/Năm Trong 25 Năm
              </h2>
              <div class="prose max-w-none text-slate-700 leading-relaxed space-y-4">
                <p>
                  Chính sách vay mua [nhà ở xã hội Nhơn Trạch](/k-home-avenue-nhon-trach) mang lại giải pháp tài chính vô cùng thiết thực:
                </p>
                <div class="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                  <h4 class="font-bold text-emerald-900 text-lg">Chính Sách Tài Chính Hỗ Trợ Người Mua NOXH Avenue:</h4>
                  <p class="text-emerald-800 text-sm leading-relaxed">
                    • <strong>Vốn ban đầu:</strong> Chỉ cần tích lũy 20% giá trị căn hộ (khoảng 150 – 250 triệu đồng).<br>
                    • <strong>Hạn mức vay:</strong> Lên đến 80% giá trị căn hộ thông qua Ngân hàng Chính sách Xã hội.<br>
                    • <strong>Lãi suất ưu đãi:</strong> Cố định <strong>5,4%/năm</strong> với thời hạn kéo dài tới <strong>25 năm</strong>.<br>
                    • <strong>Gánh nặng hàng tháng:</strong> Trả góp chỉ từ <strong>3,5 – 5,7 triệu đồng/tháng</strong>, phù hợp thu nhập công nhân và vợ chồng trẻ.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 7: Điều kiện mua -->
            <section id="dieu-kien">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                7. Điều Kiện & Thủ Tục Đăng Ký Mua K-Home Avenue Nhơn Trạch
              </h2>
              <div class="prose max-w-none text-slate-700 leading-relaxed space-y-4">
                <p>
                  Người mua căn hộ K-Home Avenue chỉ cần đáp ứng các tiêu chí nới lỏng của Luật Nhà ở 2023:
                </p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                  <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 class="font-bold text-slate-900 mb-2 text-sm uppercase">1. Tiêu Chí Nhà Ở</h4>
                    <p class="text-xs text-slate-600 leading-relaxed">Chưa có tên trong sổ đỏ/sổ hồng nhà ở tại tỉnh Đồng Nai hoặc diện tích ở bình quân dưới 15 m² sàn/người.</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 class="font-bold text-slate-900 mb-2 text-sm uppercase">2. Tiêu Chí Thu Nhập</h4>
                    <p class="text-xs text-slate-600 leading-relaxed">Mức thu nhập không chịu thuế thu nhập cá nhân ở mức cao, hoặc thu nhập hộ gia đình dưới mức trần quy định của chính phủ.</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 class="font-bold text-slate-900 mb-2 text-sm uppercase">3. Xác Thực Cư Trú</h4>
                    <p class="text-xs text-slate-600 leading-relaxed">Xác thực đăng ký thường trú hoặc tạm trú thông qua ứng dụng VNeID mức 2 nhanh chóng, không yêu cầu xác nhận rườm rà.</p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 8: FAQ -->
            <section id="faq">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                8. Câu Hỏi Thường Gặp Về Dự Án K-Home Avenue Nhơn Trạch
              </h2>
              <div class="space-y-4">
                <details class="group bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <summary class="font-bold text-slate-900 cursor-pointer flex items-center justify-between">
                    <span>K-Home Avenue Nhơn Trạch nằm ở đoạn nào trên đường 25C?</span>
                    <span class="transition group-open:rotate-180">▼</span>
                  </summary>
                  <div class="mt-4 text-slate-700 leading-relaxed border-t border-slate-200 pt-4 text-sm">
                    <p>Dự án nằm ngay mặt tiền đường Nguyễn Ái Quốc (25C), thuộc địa phận xã Phước An, huyện Nhơn Trạch, Đồng Nai. Tuyến đường này kết nối trực diện thẳng vào cổng số 1 của Sân bay Long Thành.</p>
                  </div>
                </details>
                <details class="group bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <summary class="font-bold text-slate-900 cursor-pointer flex items-center justify-between">
                    <span>Công nhân làm việc tại KCN Nhơn Trạch có được vay vốn mua không?</span>
                    <span class="transition group-open:rotate-180">▼</span>
                  </summary>
                  <div class="mt-4 text-slate-700 leading-relaxed border-t border-slate-200 pt-4 text-sm">
                    <p>Có. Dự án hướng trực tiếp đến đối tượng người lao động, công nhân, kỹ sư tại 9 KCN Nhơn Trạch với gói vay ưu đãi tối đa 80% giá trị căn hộ từ Ngân hàng Chính sách Xã hội, lãi suất 5,4%/năm.</p>
                  </div>
                </details>
                <details class="group bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <summary class="font-bold text-slate-900 cursor-pointer flex items-center justify-between">
                    <span>Người làm việc tại TP.HCM có mua được K-Home Avenue không?</span>
                    <span class="transition group-open:rotate-180">▼</span>
                  </summary>
                  <div class="mt-4 text-slate-700 leading-relaxed border-t border-slate-200 pt-4 text-sm">
                    <p>Người lao động làm việc tại TP.HCM (đặc biệt khu vực TP. Thủ Đức, Quận 7 lân cận Cầu Cát Lái và Vành Đai 3) hoàn toàn có thể mua nếu đăng ký tạm trú tại Đồng Nai và đáp ứng tiêu chuẩn chưa có nhà ở theo Luật Nhà ở 2023.</p>
                  </div>
                </details>
                <details class="group bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <summary class="font-bold text-slate-900 cursor-pointer flex items-center justify-between">
                    <span>Hotline tiếp nhận và kiểm tra hồ sơ xét duyệt là số nào?</span>
                    <span class="transition group-open:rotate-180">▼</span>
                  </summary>
                  <div class="mt-4 text-slate-700 leading-relaxed border-t border-slate-200 pt-4 text-sm">
                    <p>Quý khách vui lòng gọi Hotline chính thức Kim Oanh Land: <a href="tel:0937587438" class="text-amber-600 font-bold hover:underline">0937 587 438</a> để được chuyên viên hỗ trợ thẩm định hồ sơ trực tuyến hoàn toàn miễn phí.</p>
                  </div>
                </details>
              </div>
            </section>
          </div>

          <!-- Right Sidebar -->
          <div class="lg:col-span-1 space-y-8">
            <div class="sticky top-24 space-y-6">
              <!-- Hotline Card -->
              <div class="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-6 rounded-2xl shadow-xl">
                <span class="text-xs uppercase font-extrabold tracking-widest text-amber-200 block mb-2">Kim Oanh Land — Đồng Nai</span>
                <h3 class="text-xl font-bold mb-3">Tư Vấn Hồ Sơ Avenue Nhơn Trạch</h3>
                <p class="text-sm text-amber-100 mb-6 leading-relaxed">
                  Đăng ký tư vấn miễn phí bảng giá gốc, kiểm tra điều kiện hồ sơ xét duyệt và hướng dẫn gói vay 5,4%/năm.
                </p>
                <a href="tel:0937587438" class="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3.5 rounded-xl font-extrabold text-center block shadow-md transition-all no-underline">
                  Gọi Ngay: 0937 587 438
                </a>
              </div>

              <!-- Other Projects Nav -->
              <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <h4 class="font-bold text-slate-900 text-sm uppercase tracking-wider">Các Dự Án NOXH K-Home Khác</h4>
                <ul class="space-y-3 text-sm">
                  <li>
                    <a href="/k-home-cityview-ho-nai" class="font-semibold text-slate-800 hover:text-amber-600 transition-colors block">
                      K-Home CityView Biên Hòa &rarr;
                    </a>
                    <span class="text-xs text-slate-500">Mặt tiền Điểu Xiển, 1.328 căn từ 950 tr</span>
                  </li>
                  <li>
                    <a href="/k-home-midtown-trang-bom" class="font-semibold text-slate-800 hover:text-amber-600 transition-colors block">
                      K-Home Midtown Trảng Bom &rarr;
                    </a>
                    <span class="text-xs text-slate-500">Trung tâm Trảng Bom, 13,97 ha, 542 căn</span>
                  </li>
                  <li>
                    <a href="/k-home-skyview-trang-bom" class="font-semibold text-slate-800 hover:text-amber-600 transition-colors block">
                      K-Home SkyView Bàu Xéo &rarr;
                    </a>
                    <span class="text-xs text-slate-500">KĐT Bàu Xéo Trảng Bom, 358 căn từ 750 tr</span>
                  </li>
                </ul>
              </div>

              <!-- Calculator Box -->
              <div class="bg-blue-50/70 p-6 rounded-2xl border border-blue-200">
                <h4 class="font-bold text-blue-950 text-sm mb-2">Bảng Tính Trả Góp Ngân Hàng</h4>
                <p class="text-xs text-blue-800 leading-relaxed mb-4">
                  Tính chi tiết tiền gốc và tiền lãi mỗi tháng khi vay mua căn hộ K-Home Avenue với lãi suất 5,4%/năm.
                </p>
                <a href="/tinh-tra-gop" class="text-blue-700 font-bold text-xs hover:underline flex items-center gap-1">
                  Mở công cụ tính trả góp &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    ${renderCommonFooter()}
  `;
}

/**
 * Render HTML tĩnh cho trang Nhà Ở Xã Hội Trảng Bom – K-Home SkyView Bàu Xéo
 */
export function renderSkyViewHtml() {
  return `
    ${renderCommonHeader("k-home-skyview-trang-bom")}
    <main class="bg-white text-slate-800">
      <!-- Breadcrumb -->
      <nav class="bg-slate-50 border-b border-slate-200 py-3 text-xs sm:text-sm" aria-label="Breadcrumb">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-slate-600">
          <a href="/" class="hover:text-amber-600 transition-colors">Trang chủ</a>
          <span>/</span>
          <a href="/san-pham" class="hover:text-amber-600 transition-colors">Dự án K-Home</a>
          <span>/</span>
          <span class="text-slate-900 font-semibold">Nhà Ở Xã Hội Trảng Bom – K-Home SkyView Bàu Xéo</span>
        </div>
      </nav>

      <!-- Hero Header Section -->
      <section class="bg-gradient-to-b from-amber-50/50 via-white to-white pt-10 pb-12 border-b border-slate-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="max-w-4xl">
            <div class="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <span>Đang Nhận Đăng Ký Tư Vấn SkyView Bàu Xéo 2026</span>
            </div>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              Nhà Ở Xã Hội Trảng Bom – K-Home SkyView Bàu Xéo | Bảng Giá & Điều Kiện 2026
            </h1>
            <p class="text-lg sm:text-xl text-slate-700 leading-relaxed mb-8">
              Dự án <strong>nhà ở xã hội Trảng Bom</strong> (K-Home SkyView Bàu Xéo) quy mô <strong>1,08 ha</strong> với <strong>358 căn hộ NOXH chuẩn Singapore</strong> tọa lạc ngay trong Khu đô thị Bàu Xéo, liền kề KCN Bàu Xéo và Quốc Lộ 1A. Mức giá chỉ từ <strong>750 triệu đồng/căn</strong>, hỗ trợ gói vay ưu đãi cố định <strong>5,4%/năm trong 25 năm</strong> từ Ngân hàng Chính sách Xã hội.
            </p>
            <div class="flex flex-wrap items-center gap-4">
              <a href="#bang-gia" class="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3.5 rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all no-underline">
                Xem Bảng Giá Căn Hộ 2026
              </a>
              <a href="#dieu-kien" class="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all no-underline">
                Kiểm Tra Điều Kiện Mua
              </a>
              <a href="tel:0937587438" class="border-2 border-amber-600 text-amber-700 hover:bg-amber-50 px-6 py-3.5 rounded-xl font-bold text-base transition-colors no-underline">
                Tư Vấn Hồ Sơ: 0937 587 438
              </a>
            </div>
          </div>

          <!-- Quick Stats Grid -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-200">
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span class="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1">Vị Trí KĐT Bàu Xéo</span>
              <p class="text-base font-bold text-slate-900">Liền kề KCN Bàu Xéo, QL1A Trảng Bom</p>
            </div>
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span class="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1">Quy Mô Công Trình</span>
              <p class="text-base font-bold text-slate-900">1,08 ha · 358 căn hộ NOXH (9-12 tầng)</p>
            </div>
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span class="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1">Mức Giá Niêm Yết</span>
              <p class="text-base font-bold text-amber-600">Từ 750 Triệu – 1,45 Tỷ/Căn</p>
            </div>
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span class="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1">Chính Sách Vay NOXH</span>
              <p class="text-base font-bold text-emerald-600">Vay 80% vốn · Trả góp từ 3,5 tr/tháng</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content Container -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <!-- Main Left Column -->
          <div class="lg:col-span-2 space-y-12">

            <!-- Section 1: Tổng quan -->
            <section id="tong-quan">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                1. Tổng Quan Dự Án K-Home SkyView Bàu Xéo Trảng Bom
              </h2>
              <div class="prose max-w-none text-slate-700 leading-relaxed space-y-4">
                <p>
                  <strong>K-Home SkyView</strong> (K-Home Sky View Bàu Xéo) là dự án căn hộ <strong>nhà ở xã hội Trảng Bom</strong> chất lượng cao do <strong>Kim Oanh Land</strong> phát triển tại Khu đô thị Bàu Xéo, thị trấn Trảng Bom, tỉnh Đồng Nai. Dự án nằm sát cạnh Khu công nghiệp Bàu Xéo quy mô gần 500 ha – một trong những trung tâm sản xuất công nghiệp sôi động nhất tỉnh.
                </p>
                <p>
                  Được quy hoạch trên quỹ đất rộng <strong>1,08 ha</strong>, dự án bao gồm các block căn hộ cao <strong>9 đến 12 tầng</strong>, cung cấp ra thị trường <strong>358 căn hộ NOXH</strong> chuẩn Singapore. Dự án hướng tới giải quyết bài toán an cư ổn định, lâu dài cho hàng chục ngàn công nhân, chuyên viên kỹ thuật và gia đình trẻ đang sinh sống và làm việc tại Trảng Bom.
                </p>

                <!-- Specs Table -->
                <div class="overflow-x-auto my-6 rounded-xl border border-slate-200">
                  <table class="w-full text-left text-sm border-collapse">
                    <thead class="bg-slate-100 text-slate-900 border-b border-slate-200">
                      <tr>
                        <th class="p-3 font-bold w-1/3">Thông Số Kỹ Thuật</th>
                        <th class="p-3 font-bold">Chi Tiết Quy Hoạch K-Home SkyView</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                      <tr><td class="p-3 font-semibold text-slate-800">Tên thương mại</td><td class="p-3">K-Home SkyView (K-Home SkyView Bàu Xéo)</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Chủ đầu tư</td><td class="p-3">Kim Oanh Land (Tập đoàn Kim Oanh Group)</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Vị trí địa chỉ</td><td class="p-3">Khu đô thị Bàu Xéo, Quốc Lộ 1A, TT. Trảng Bom, Tỉnh Đồng Nai</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Tư vấn thiết kế kiến trúc</td><td class="p-3">Tập đoàn Surbana Jurong (Singapore)</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Quy mô quỹ đất</td><td class="p-3">1,08 hecta</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Mật độ xây dựng</td><td class="p-3">Khoảng 38%</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Quy mô công trình</td><td class="p-3">Các khối tháp cao 9 – 12 tầng</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Tổng số lượng căn hộ</td><td class="p-3">358 căn hộ NOXH chuẩn Singapore</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Diện tích căn hộ</td><td class="p-3">37,0 m² – 65,3 m² (Studio, 1PN+, 2PN)</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Tiêu chuẩn bàn giao</td><td class="p-3">Hoàn thiện nội thất cơ bản cao cấp</td></tr>
                      <tr><td class="p-3 font-semibold text-slate-800">Hình thức sở hữu</td><td class="p-3">Sổ hồng sở hữu lâu dài (vĩnh viễn)</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <!-- Section 2: Bảng giá căn hộ -->
            <section id="bang-gia">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                2. Bảng Giá Căn Hộ K-Home SkyView Bàu Xéo Trảng Bom 2026
              </h2>
              <div class="prose max-w-none text-slate-700 leading-relaxed space-y-4">
                <p>
                  Bảng giá căn hộ [nhà ở xã hội Trảng Bom](/k-home-skyview-trang-bom) SkyView được áp dụng theo đúng quy định hỗ trợ người thu nhập thấp:
                </p>

                <div class="overflow-x-auto my-6 rounded-xl border border-slate-200">
                  <table class="w-full text-left text-sm border-collapse">
                    <thead class="bg-amber-600 text-white">
                      <tr>
                        <th class="p-3 font-bold">Mẫu Căn Hộ</th>
                        <th class="p-3 font-bold">DT Xây Dựng</th>
                        <th class="p-3 font-bold">DT Thông Thủy</th>
                        <th class="p-3 font-bold">Giá Bán Niêm Yết</th>
                        <th class="p-3 font-bold">Vốn Tự Có 20%</th>
                        <th class="p-3 font-bold">Gói Vay 80% (5,4%)</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
                      <tr class="hover:bg-amber-50/50">
                        <td class="p-3 font-bold text-slate-900"><a href="/k-home-skyview-trang-bom/can-ho-studio" class="text-amber-700 underline font-semibold">Căn Hộ Studio</a></td>
                        <td class="p-3">37,0 m²</td>
                        <td class="p-3">33,0 m²</td>
                        <td class="p-3 font-bold text-amber-600">Từ 750 triệu</td>
                        <td class="p-3">~ 150 triệu</td>
                        <td class="p-3">Trả góp ~3,5 tr/tháng</td>
                      </tr>
                      <tr class="hover:bg-amber-50/50">
                        <td class="p-3 font-bold text-slate-900"><a href="/k-home-skyview-trang-bom/can-ho-1-phong-ngu" class="text-amber-700 underline font-semibold">Căn 1 Phòng Ngủ +</a></td>
                        <td class="p-3">45,8 m²</td>
                        <td class="p-3">41,0 m²</td>
                        <td class="p-3 font-bold text-amber-600">Từ 990 triệu</td>
                        <td class="p-3">~ 198 triệu</td>
                        <td class="p-3">Trả góp ~4,6 tr/tháng</td>
                      </tr>
                      <tr class="hover:bg-amber-50/50">
                        <td class="p-3 font-bold text-slate-900"><a href="/k-home-skyview-trang-bom/can-ho-2-phong-ngu" class="text-amber-700 underline font-semibold">Căn 2 Phòng Ngủ (2WC)</a></td>
                        <td class="p-3">65,3 m²</td>
                        <td class="p-3">58,5 m²</td>
                        <td class="p-3 font-bold text-amber-600">1,35 tỷ – 1,45 tỷ</td>
                        <td class="p-3">270 – 290 triệu</td>
                        <td class="p-3">Trả góp ~6,2 tr/tháng</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p class="text-sm text-slate-600 italic">
                  * Khách hàng tại Trảng Bom cũng có thể tham khảo thêm đại đô thị <a href="/k-home-midtown-trang-bom" class="text-amber-600 font-bold hover:underline">K-Home Midtown Trảng Bom</a> (13,97 ha) hoặc dự án trọng điểm <a href="/k-home-cityview-ho-nai" class="text-amber-600 font-bold hover:underline">nhà ở xã hội Biên Hòa K-Home CityView</a> (từ 950 triệu).
                </p>
              </div>
            </section>

            <!-- Section 3: Vị trí & Kết nối -->
            <section id="vi-tri">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                3. Vị Trí Liền Kề KCN Bàu Xéo & Kết Nối Giao Thông
              </h2>
              <div class="prose max-w-none text-slate-700 leading-relaxed space-y-4">
                <p>
                  K-Home SkyView sở hữu vị trí đắt giá ngay trong lòng Khu đô thị Bàu Xéo, trực tiếp kết nối với các trục giao thông đối ngoại quan trọng:
                </p>
                <ul class="list-disc list-inside space-y-2">
                  <li><strong>Liền kề ngay Khu công nghiệp Bàu Xéo:</strong> Chỉ mất 1 – 2 phút đi bộ hoặc xe máy đến nơi làm việc.</li>
                  <li><strong>Cách Quốc Lộ 1A:</strong> Chỉ 300m, kết nối thuận lợi về TP. Biên Hòa (15 phút) và TP.HCM (45 phút).</li>
                  <li><strong>Kết nối KCN Giang Điền & KCN Sông Mây:</strong> Trong vòng 10 – 15 phút.</li>
                  <li><strong>Tiện ích liền kề:</strong> Bệnh viện Đa khoa Trảng Bom, hệ thống ngân hàng, siêu thị, trường học các cấp trong bán kính 1,5 km.</li>
                </ul>
              </div>
            </section>

            <!-- Section 4: Chính sách vay & Điều kiện -->
            <section id="chinh-sach-vay">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                4. Chính Sách Vay Vốn Ngân Hàng CSXH & Điều Kiện Mua Căn Hộ
              </h2>
              <div class="prose max-w-none text-slate-700 leading-relaxed space-y-4">
                <div class="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                  <h4 class="font-bold text-emerald-900 text-lg">Thông Tin Gói Vay Mua NOXH SkyView:</h4>
                  <p class="text-emerald-800 text-sm leading-relaxed">
                    • <strong>Tỷ lệ cho vay:</strong> Tối đa 80% giá trị căn hộ trên HĐMB.<br>
                    • <strong>Lãi suất ưu đãi:</strong> Cố định <strong>5,4%/năm</strong> theo gói bảo trợ của Ngân hàng Chính sách Xã hội.<br>
                    • <strong>Thời hạn vay:</strong> Lên tới <strong>25 năm</strong>.<br>
                    • <strong>Điều kiện:</strong> Chưa sở hữu nhà ở tại Đồng Nai, thu nhập cá nhân/gia đình đáp ứng khung thu nhập NOXH theo Luật Nhà ở 2023, có xác thực VNeID mức 2.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 5: FAQ -->
            <section id="faq">
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-amber-500">
                5. Câu Hỏi Thường Gặp Về Dự Án K-Home SkyView Bàu Xéo
              </h2>
              <div class="space-y-4">
                <details class="group bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <summary class="font-bold text-slate-900 cursor-pointer flex items-center justify-between">
                    <span>K-Home SkyView Bàu Xéo khi nào mở bán chính thức?</span>
                    <span class="transition group-open:rotate-180">▼</span>
                  </summary>
                  <div class="mt-4 text-slate-700 leading-relaxed border-t border-slate-200 pt-4 text-sm">
                    <p>Dự án hiện đang tiếp nhận thông tin đăng ký tư vấn và hỗ trợ khách hàng chuẩn bị hồ sơ xét duyệt trước. Quý khách liên hệ Hotline: 0937 587 438 để nhận thông báo thời gian mở bán đợt đầu.</p>
                  </div>
                </details>
                <details class="group bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <summary class="font-bold text-slate-900 cursor-pointer flex items-center justify-between">
                    <span>Căn hộ K-Home SkyView có sổ hồng vĩnh viễn không?</span>
                    <span class="transition group-open:rotate-180">▼</span>
                  </summary>
                  <div class="mt-4 text-slate-700 leading-relaxed border-t border-slate-200 pt-4 text-sm">
                    <p>Có. Dự án có pháp lý hoàn chỉnh theo quy chuẩn nhà ở xã hội, được cấp sổ hồng sở hữu lâu dài (vĩnh viễn) cho người mua sau khi nhận bàn giao nhà.</p>
                  </div>
                </details>
              </div>
            </section>
          </div>

          <!-- Right Sidebar -->
          <div class="lg:col-span-1 space-y-8">
            <div class="sticky top-24 space-y-6">
              <!-- Hotline Card -->
              <div class="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-6 rounded-2xl shadow-xl">
                <span class="text-xs uppercase font-extrabold tracking-widest text-amber-200 block mb-2">Kim Oanh Land — Đồng Nai</span>
                <h3 class="text-xl font-bold mb-3">Tư Vấn Hồ Sơ SkyView Bàu Xéo</h3>
                <p class="text-sm text-amber-100 mb-6 leading-relaxed">
                  Đăng ký tư vấn miễn phí thủ tục mua nhà ở xã hội, kiểm tra điều kiện hồ sơ và hỗ trợ vay vốn ngân hàng 5,4%/năm.
                </p>
                <a href="tel:0937587438" class="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3.5 rounded-xl font-extrabold text-center block shadow-md transition-all no-underline">
                  Gọi Ngay: 0937 587 438
                </a>
              </div>

              <!-- Other Projects Nav -->
              <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <h4 class="font-bold text-slate-900 text-sm uppercase tracking-wider">Các Dự Án NOXH K-Home Khác</h4>
                <ul class="space-y-3 text-sm">
                  <li>
                    <a href="/k-home-cityview-ho-nai" class="font-semibold text-slate-800 hover:text-amber-600 transition-colors block">
                      K-Home CityView Biên Hòa &rarr;
                    </a>
                    <span class="text-xs text-slate-500">Mặt tiền Điểu Xiển, 1.328 căn từ 950 tr</span>
                  </li>
                  <li>
                    <a href="/k-home-midtown-trang-bom" class="font-semibold text-slate-800 hover:text-amber-600 transition-colors block">
                      K-Home Midtown Trảng Bom &rarr;
                    </a>
                    <span class="text-xs text-slate-500">Trung tâm Trảng Bom, 13,97 ha, 542 căn</span>
                  </li>
                  <li>
                    <a href="/k-home-avenue-nhon-trach" class="font-semibold text-slate-800 hover:text-amber-600 transition-colors block">
                      K-Home Avenue Nhơn Trạch &rarr;
                    </a>
                    <span class="text-xs text-slate-500">Mặt tiền 25C gần Sân bay Long Thành, 1.022 căn</span>
                  </li>
                </ul>
              </div>

              <!-- Calculator Box -->
              <div class="bg-blue-50/70 p-6 rounded-2xl border border-blue-200">
                <h4 class="font-bold text-blue-950 text-sm mb-2">Bảng Tính Trả Góp Ngân Hàng</h4>
                <p class="text-xs text-blue-800 leading-relaxed mb-4">
                  Tính số tiền trả góp hàng tháng theo gói vay 5,4%/năm cho dự án K-Home SkyView Bàu Xéo.
                </p>
                <a href="/tinh-tra-gop" class="text-blue-700 font-bold text-xs hover:underline flex items-center gap-1">
                  Mở công cụ tính trả góp &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    ${renderCommonFooter()}
  `;
}



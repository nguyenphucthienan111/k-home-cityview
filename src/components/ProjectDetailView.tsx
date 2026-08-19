import React, { useEffect, useState, useMemo, useRef, startTransition } from "react";
import { ArrowLeft, CheckCircle, MapPin, Building, Star, Compass, Phone, Send, Eye, LayoutGrid, HelpCircle, ShieldCheck, BadgeCheck, Award, TrendingUp, Users, Building2, Handshake, Newspaper } from "lucide-react";
import { Project } from "../types";
import Lightbox from "./Lightbox";
import { imgUrl } from "../utils/imageUrl";
import MortgageCalculator from "./MortgageCalculator";
import RelatedArticles from "./RelatedArticles";

// Danh sách slug có calculator
const CALC_CONFIG_SLUGS = ["k-home-cityview-ho-nai", "k-home-avenue-nhon-trach", "k-home-midtown-trang-bom"];

// ─── Per-project SEO data ────────────────────────────────────────────────────

const PROJECT_SEO: Record<string, {
  titleTag: string;
  metaDesc: string;
  noxhConditions: { label: string; detail: string }[];
  paymentPolicy: { step: string; pct: string; note: string }[];
  faq: { q: string; a: string }[];
  locationImages?: { src: string; alt: string; caption?: string }[];
  floorPlanImages?: { src: string; alt: string; label: string }[];
  amenityImages?: { src: string; alt: string; caption?: string }[];
  developerImage?: string;
  sampleUnitImages?: { src: string; alt: string; label: string }[];
  // CityView extended sections từ slide
  dongNaiOverview?: { stats: { label: string; value: string; icon?: string }[]; hubText: string; zones: string[]; transportText: string };
  constructionProgress?: { timeline: { date: string; event: string; done?: boolean }[]; siteImages: string[] };
  legalInfo?: { items: { title: string; desc: string }[] };
  singaporeFactors?: { factors: { num: string; title: string; desc: string }[] };
  edgeCert?: { savings: { label: string; pct: string }[]; desc: string };
  buyVsRent?: { tableRows: { label: string; buy: string; rent: string }[]; conclusion: string };
  awards?: { items: { title: string; org: string; year: string; imgSlide?: number }[] };
  partners?: { items: { name: string; role: string }[] };
  // Midtown extended sections
  midtownHighlights?: { heroImage: string; locationText: string; points: { num: string; title: string; desc: string }[] };
  midtownEdge?: { heroImage: string; savings: { label: string; pct: string }[]; desc: string };
  avenueHighlights?: { heroImage: string; locationText: string; points: { num: string; title: string; desc: string }[] };
}> = {
  "k-home-cityview-ho-nai": {
    titleTag: "K-Home CityView Hố Nai Biên Hòa | Bảng Giá, Mặt Bằng & Hồ Sơ NOXH 2026",
    metaDesc: "Dự án K-Home CityView Hố Nai Biên Hòa – 1.328 căn hộ NOXH chuẩn Singapore do Kim Oanh Land phát triển. 47–84m², thiết kế Surbana Jurong, tiêu chuẩn xanh EDGE. Giá từ 950 triệu, lãi suất 5,4%/năm, bàn giao 2028, hỗ trợ hồ sơ miễn phí.",
    locationImages: [
      { src: "/k-home cityview/mat-bang/vi-tri-k-home-dong-nai-kim-oanh-1-scaled.jpg.webp", alt: "Vị trí dự án nhà ở xã hội K-Home CityView Hố Nai Biên Hòa Đồng Nai", caption: "Vị trí K-Home CityView – Hố Nai, TP. Biên Hòa" },
      { src: "/k-home cityview/mat-bang/vi-tri-du-an-noxh-k-home-city-view-dong-nai.jpg.webp", alt: "Bản đồ vị trí dự án NOXH K-Home City View Đồng Nai Kim Oanh Land", caption: "Bản đồ kết nối – K-Home CityView liền kề các KCN lớn" },
    ],
    floorPlanImages: [
      { src: "/k-home cityview/mat-bang/mat-bang-k-home-cityview-tang-12A-22.jpg.webp", alt: "Mặt bằng tầng điển hình 12A-22 NOXH K-Home CityView Hố Nai", label: "Tầng 12A–22 (Tầng điển hình)" },
      { src: "/k-home cityview/mat-bang/mat-bang-k-home-cityview-tang-4-11.jpg.webp", alt: "Mặt bằng tầng 4-11 K-Home CityView Hố Nai Kim Oanh", label: "Tầng 4–11" },
      { src: "/k-home cityview/mat-bang/mat-bang-k-home-cityview-tang-3.jpg.webp", alt: "Mặt bằng tầng 3 vườn treo NOXH K-Home CityView", label: "Tầng 3 (Vườn treo)" },
      { src: "/k-home cityview/mat-bang/mat-bang-k-home-cityview-tang-2.jpg.webp", alt: "Mặt bằng tầng 2 NOXH K-Home CityView Hố Nai Kim Oanh", label: "Tầng 2" },
      { src: "/k-home cityview/mat-bang/k-home-cityview-mat-bang-tang-1.jpg.webp", alt: "Mặt bằng tầng 1 tiện ích K-Home CityView Hố Nai Kim Oanh", label: "Tầng 1 (Tiện ích)" },
      { src: "/k-home cityview/mat-bang/thiet-ke-can-ho-layout-khome-city-view-2048x764.jpg.webp", alt: "Thiết kế căn hộ layout 1PN 2PN 3PN NOXH K-Home CityView Kim Oanh Land", label: "Layout các loại căn hộ" },
    ],
    amenityImages: [
      { src: "/k-home cityview/mat-bang/tien-ich-k-home-city-view-8.jpg.webp", alt: "Tiện ích nội khu NOXH K-Home CityView Hố Nai Biên Hòa" },
      { src: "/k-home cityview/mat-bang/tien-ich-k-home-city-view-6.jpg.webp", alt: "Hồ bơi ngoài trời K-Home CityView", caption: "Hồ bơi ngoài trời" },
      { src: "/k-home cityview/mat-bang/tien-ich-k-home-city-view-2.jpg.webp", alt: "Khu vui chơi trẻ em K-Home CityView Hố Nai", caption: "Khu vui chơi trẻ em & nhà trẻ" },
      { src: "/k-home cityview/mat-bang/tien-ich-k-home-city-view-3.jpg.webp", alt: "Vườn treo K-Home CityView Hố Nai", caption: "Vườn treo" },
      { src: "/k-home cityview/mat-bang/tien-ich-k-home-city-view-9.jpg.webp", alt: "Shophouse thương mại K-Home CityView", caption: "Shophouse & phố thương mại nội khu" },
    ],
    developerImage: "/k-home cityview/mat-bang/top-10-nha-phat-trien-nha-o-xa-hoi-viet-nam-2024.jpg.webp",
    sampleUnitImages: [
      { src: "/k-home cityview/Can-1PN-A/khome-cityview-nha-mau-can-ho-1PN-1.jpg", alt: "Nhà mẫu căn 1 phòng ngủ A K-Home CityView Kim Oanh", label: "Căn 1PN + A (47,3m²)" },
      { src: "/k-home cityview/Can-1PN-B/khome-cityview-nha-mau-can-ho-1PN-1.jpg", alt: "Nhà mẫu căn 1 phòng ngủ B K-Home CityView Kim Oanh", label: "Căn 1PN + B (62,4m²)" },
      { src: "/k-home cityview/Can-2PN/khome-cityview-nha-mau-can-ho-2PN-1.jpg", alt: "Nhà mẫu căn 2 phòng ngủ K-Home City View Hố Nai Biên Hòa", label: "Căn 2PN (70,4m²)" },
      { src: "/k-home cityview/Can-3PN/3pn-noxh-k-home-city-view.jpg", alt: "Nhà mẫu căn 3 phòng ngủ NOXH K-Home CityView Biên Hòa", label: "Căn 3PN (84,4m²)" },
    ],
    dongNaiOverview: {
      stats: [
        { label: "Dân số Đồng Nai", value: "3,3 triệu người" },
        { label: "Lao động KCN", value: "500.000+ công nhân" },
        { label: "Diện tích tỉnh", value: "5.907 km²" },
        { label: "Tốc độ tăng trưởng", value: "Top 5 cả nước" },
      ],
      hubText: "Đồng Nai đang trong quá trình phát triển thành Thành phố trực thuộc Trung ương – tương đương TP. Hồ Chí Minh, với vị thế là trung tâm kinh tế – công nghiệp quan trọng bậc nhất vùng Đông Nam Bộ. Tỉnh được quy hoạch 5 vùng phát triển chiến lược với hơn 30 khu công nghiệp đang vận hành, thu hút hàng chục tỷ USD vốn FDI. Đặc biệt, Sân bay Quốc tế Long Thành – một trong những cảng hàng không hàng đầu thế giới đang được khẩn trương xây dựng – sẽ là đòn bẩy tăng trưởng đột phá cho toàn tỉnh.",
      zones: [
        "Vùng 1: Trung tâm TP. Biên Hòa – đô thị hiện đại, hành chính – thương mại",
        "Vùng 2: Long Thành – Nhơn Trạch – cửa ngõ sân bay quốc tế Long Thành",
        "Vùng 3: Trảng Bom – Thống Nhất – công nghiệp phía Bắc, kinh tế năng động",
        "Vùng 4: Long Khánh – Xuân Lộc – nông nghiệp công nghệ cao",
        "Vùng 5: Định Quán – Tân Phú – lâm nghiệp & du lịch sinh thái",
      ],
      transportText: "Đồng Nai kết nối giao thông quốc gia qua: Cao tốc TP.HCM – Long Thành – Dầu Giây, Quốc lộ 1A, Quốc lộ 51, Tỉnh lộ 25C, tuyến Metro số 1, tuyến đường sắt Bắc – Nam và Sân bay Quốc tế Long Thành đang trong giai đoạn hoàn thiện. K-Home CityView tọa lạc ngay trung tâm Biên Hòa – chỉ 10 phút đến trung tâm hành chính, liền kề các khu công nghiệp Amata, Long Bình, Biên Hòa 2 và 30 phút đến sân bay Long Thành.",
    },
    constructionProgress: {
      timeline: [
        { date: "02/2026", event: "Khởi công xây dựng – Lễ động thổ chính thức tại phường Hố Nai", done: true },
        { date: "08–10/2026", event: "Hoàn thành phần móng cọc & đài móng 4 block", done: false },
        { date: "06/2027", event: "Cất nóc – hoàn thành kết cấu thô toàn bộ 22 tầng", done: false },
        { date: "12/2027", event: "Hoàn thiện nội thất, bàn giao nhà mẫu & chuẩn bị nghiệm thu", done: false },
        { date: "01/2028", event: "Dự kiến bàn giao đợt đầu cho cư dân (theo tiến độ được duyệt)", done: false },
      ],
      siteImages: [
        "slide-k-home-cityview/slide-28",
        "slide-k-home-cityview/slide-29",
      ],
    },
    legalInfo: {
      items: [
        { title: "Chủ trương đầu tư", desc: "Quyết định số 177/QĐ-UBND ngày 09/02/2023 của UBND tỉnh Đồng Nai về việc chấp thuận chủ trương đầu tư dự án nhà ở xã hội tại khu đất 2,85ha phường Hố Nai. Điều chỉnh bổ sung theo QĐ số 794/QĐ-UBND ngày 12/3/2025 và QĐ số 1191/QĐ-UBND ngày 05/9/2025 về giao chủ đầu tư." },
        { title: "Phê duyệt quy hoạch chi tiết 1/500", desc: "Công văn số 269/QĐ-UBND ngày 07/11/2025 của UBND Phường Hố Nai về việc phê duyệt Quy hoạch chi tiết đô thị tỷ lệ 1/500 dự án nhà ở xã hội tại khu đất 2,85ha phường Hố Nai – pháp lý quy hoạch hoàn chỉnh trước khi triển khai thi công." },
        { title: "Quyết định giao đất", desc: "Quyết định số 3000/QĐ-UBND ngày 08/12/2025 của UBND tỉnh Đồng Nai về việc giao đất cho Công ty Cổ phần Đầu tư và Phát triển Bất động sản Miền Đông thực hiện dự án nhà ở xã hội tại phường Hố Nai, tỉnh Đồng Nai – đảm bảo quyền sử dụng đất hợp pháp, cơ sở cấp sổ hồng lâu dài." },
        { title: "Pháp lý xây dựng & Ngân hàng Chính sách", desc: "Văn bản số 7386/SXD-QLHĐ&VLXD ngày 31/12/2025 của Sở Xây dựng thông báo kết quả thẩm định Báo cáo nghiên cứu khả thi đầu tư xây dựng. Ngoài ra, dự án có Thư ngỏ hỗ trợ vay vốn của Ngân hàng Chính sách Xã hội dành cho người mua nhà ở xã hội tại K-Home CityView với lãi suất 5,4%/năm." },
      ],
    },
    singaporeFactors: {
      factors: [
        { num: "01", title: "Vị trí trung tâm đô thị Biên Hòa", desc: "Tọa lạc ngay mặt tiền đường Điểu Xiển, Hố Nai – trung tâm TP. Biên Hòa, gần các KCN lớn, trường học, bệnh viện và siêu thị." },
        { num: "02", title: "Tiện ích nội khu phong phú", desc: "Hồ bơi, sân chơi trẻ em, khu thể dục ngoài trời, vườn treo, nhà sinh hoạt cộng đồng và shophouse thương mại ngay trong khuôn viên dự án." },
        { num: "03", title: "Đa dạng tiện ích quanh nhà", desc: "Trong bán kính 5km có đầy đủ: trường học các cấp, bệnh viện, siêu thị, chợ, ngân hàng và trung tâm thương mại phục vụ nhu cầu hàng ngày." },
        { num: "04", title: "Phát triển theo tiêu chuẩn công trình xanh EDGE", desc: "Dự án hướng đến chứng chỉ EDGE (IFC/World Bank), tiết kiệm ít nhất 20% năng lượng, nước và năng lượng vật liệu so với công trình thông thường." },
        { num: "05", title: "Tầm view rộng thoáng", desc: "4 block cao 22 tầng thiết kế so le, đảm bảo tầm nhìn thông thoáng, không bị che khuất. Các căn tầng cao có view toàn cảnh TP. Biên Hòa." },
        { num: "06", title: "Thiết kế thông minh, tối ưu không gian", desc: "100% căn hộ có cửa sổ đón sáng tự nhiên. Bố cục tối ưu từng m², không có hành lang tối hay không gian chết theo tiêu chuẩn thiết kế Singapore." },
        { num: "07", title: "Bàn giao hoàn thiện nội thất chất lượng cao", desc: "Bàn giao full nội thất theo tiêu chuẩn dự án — tủ bếp, sofa, giường, tủ quần áo, sàn gỗ. Cư dân chỉ cần mang đồ cá nhân là ở được ngay." },
        { num: "08", title: "Quản lý vận hành thông minh", desc: "Hệ thống BMS quản lý tòa nhà, camera AI 24/7, kiểm soát ra vào bằng thẻ từ, ứng dụng quản lý cư dân theo mô hình chuyên nghiệp Singapore." },
      ],
    },
    edgeCert: {
      savings: [
        { label: "Tiết kiệm điện năng", pct: "≥ 20%" },
        { label: "Tiết kiệm nước", pct: "≥ 20%" },
        { label: "Lượng phát thải carbon", pct: "≥ 20%" },
      ],
      desc: "Chứng chỉ EDGE (Excellence in Design for Greater Efficiencies) do IFC – World Bank Group cấp cho các công trình tiết kiệm tài nguyên. K-Home CityView là một trong số ít dự án NOXH tại Việt Nam hướng đến chuẩn EDGE, giúp cư dân giảm chi phí điện nước hàng tháng ít nhất 20% so với căn hộ thông thường.",
    },
    buyVsRent: {
      tableRows: [
        { label: "Chi phí hàng tháng", buy: "Trả góp ~4,5 triệu/tháng", rent: "Thuê ~5-7 triệu/tháng" },
        { label: "Sau 25 năm", buy: "Sở hữu tài sản 2–4 tỷ", rent: "Mất trắng ~2,1 tỷ tiền thuê" },
        { label: "Ổn định chỗ ở", buy: "Không lo giá thuê tăng, không bị đuổi", rent: "Phụ thuộc chủ nhà" },
        { label: "Tích lũy tài sản", buy: "Bất động sản tăng giá theo thời gian", rent: "Không tích lũy được gì" },
        { label: "Lãi suất", buy: "5,4%/năm – thấp nhất thị trường", rent: "Không áp dụng" },
        { label: "Điều kiện", buy: "Cần đủ điều kiện NOXH", rent: "Chỉ cần có tiền cọc" },
      ],
      conclusion: "Với mức trả góp chỉ từ 3,5–4,5 triệu/tháng — tương đương hoặc thấp hơn tiền thuê nhà — người mua K-Home CityView vừa có chỗ ở ổn định, vừa tích lũy tài sản lâu dài. Đây là lý do tại sao nhiều gia đình công nhân chọn mua thay vì tiếp tục thuê trọ.",
    },
    awards: {
      items: [
        { title: "PropertyGuru Vietnam Property Awards", org: "PropertyGuru – Best Affordable Housing Development 2025", year: "2025", imgSlide: 14 },
        { title: "Top 10 Nhà phát triển NOXH hàng đầu Việt Nam", org: "Bộ Xây dựng & Hiệp hội Bất động sản Việt Nam", year: "2024", imgSlide: 17  },
        { title: "Giải thưởng Kiến trúc xanh bền vững", org: "Hội Kiến trúc sư Việt Nam", year: "2024", imgSlide: 12 },
      ],
    },

    partners: {
      items: [
        { name: "Surbana Jurong (Singapore)", role: "Tập đoàn tư vấn quy hoạch & thiết kế kiến trúc tổng thể" },
        { name: "Global Vireon Studio", role: "Tư vấn thiết kế kiến trúc chi tiết" },
        { name: "Kiến Trúc Việt", role: "Tư vấn thiết kế nội thất & cảnh quan" },
        { name: "CDC Jsc (CDCs)", role: "Đơn vị tư vấn giám sát thi công" },
        { name: "Phước Thành", role: "Nhà thầu xây dựng chính" },
        { name: "K-City", role: "Đơn vị quản lý & vận hành tòa nhà" },
      ],
    },
    noxhConditions: [
      { label: "Chưa có nhà tại Đồng Nai", detail: "Không đứng tên sổ đỏ nhà ở tại tỉnh Đồng Nai" },
      { label: "Chưa từng mua NOXH", detail: "Chưa từng mua/thuê mua nhà ở xã hội tại bất kỳ tỉnh thành nào" },
      { label: "Thu nhập hộ gia đình", detail: "Vợ chồng: dưới 50 triệu/tháng • Đơn thân nuôi con: dưới 35 triệu/tháng • Độc thân: dưới 25 triệu/tháng" },
      { label: "Hộ khẩu hoặc tạm trú", detail: "Có hộ khẩu hoặc đang tạm trú tại tỉnh Đồng Nai từ 1 năm trở lên" },
      { label: "Đang làm việc tại Đồng Nai", detail: "Ưu tiên công nhân, người lao động tại các khu công nghiệp tỉnh Đồng Nai" },
    ],
    paymentPolicy: [
      { step: "Đặt cọc", pct: "30.000.000 đ", note: "Khi ký Phiếu xác nhận cọc" },
      { step: "Đợt 1", pct: "15%", note: "7 ngày từ ngày cọc – ký HĐDVTV" },
      { step: "Đợt 2–3", pct: "5% / đợt", note: "Mỗi đợt cách 30 ngày" },
      { step: "Ngân hàng giải ngân", pct: "75%", note: "NH giải ngân theo tiến độ" },
      { step: "Bàn giao", pct: "Phí bảo trì 2%", note: "15 ngày kể từ thông báo bàn giao" },
    ],
    faq: [
      { q: "K-Home CityView Hố Nai giá bao nhiêu?", a: "K-Home CityView có giá từ 950 triệu đến 2 tỷ/căn tùy loại: 1PN+A từ 950 triệu, 1PN+B từ 1,20 tỷ, 2PN từ 1,50 tỷ, 3PN từ 1,80 tỷ. Tất cả bàn giao full nội thất, lãi suất NOXH 5,4%/năm." },
      { q: "Điều kiện mua K-Home CityView là gì?", a: "Người mua cần: chưa có nhà tại Đồng Nai, chưa từng mua NOXH, thu nhập dưới 50 triệu/tháng (cặp vợ chồng) hoặc dưới 25 triệu (độc thân), có hộ khẩu hoặc tạm trú tại Đồng Nai." },
      { q: "K-Home CityView ở đâu?", a: "K-Home CityView tọa lạc tại đường Điểu Xiển, Phường Hố Nai, TP. Biên Hòa, Tỉnh Đồng Nai. Cách trung tâm Biên Hòa khoảng 3km, gần các KCN Biên Hòa 1, 2, Amata, Hố Nai và Long Bình." },
      { q: "K-Home CityView khi nào bàn giao nhà?", a: "Dự án đã khởi công và đang thi công. Tiến độ dự kiến: hoàn thành móng tháng 8–10/2026, cất nóc tháng 6/2027, hoàn thiện nội thất tháng 12/2027 và bàn giao đợt đầu cho cư dân vào tháng 1/2028. Liên hệ hotline 0937.587.438 để cập nhật tiến độ mới nhất." },
      { q: "Vay mua K-Home CityView được bao nhiêu?", a: "Người mua đủ điều kiện NOXH được vay tối đa 80% giá trị căn hộ từ Ngân hàng Chính sách Xã hội với lãi suất 5,4%/năm cố định trong 25 năm. Trả góp chỉ từ khoảng 3,5–4,5 triệu/tháng." },
      { q: "K-Home CityView có được bán lại không?", a: "Theo quy định NOXH, người mua phải ở tối thiểu 5 năm sau khi nhận bàn giao mới được bán lại. Khi bán phải bán lại cho người đủ điều kiện mua NOXH hoặc trả lại cho chủ đầu tư." },
      { q: "K-Home CityView có bao nhiêu căn?", a: "Dự án có tổng cộng 1.816 căn gồm: 1.328 căn hộ NOXH, 425 căn nhà ở thương mại (Block T4) và 39 căn shophouse, phân bổ trong 4 block cao 22 tầng trên quỹ đất 2,85 hecta tại Hố Nai, Biên Hòa." },
      { q: "Hỗ trợ hồ sơ NOXH K-Home CityView như thế nào?", a: "Đội ngũ Kim Oanh Land hỗ trợ hoàn toàn miễn phí: kiểm tra điều kiện đủ tiêu chuẩn, chuẩn bị giấy tờ, nộp hồ sơ xét duyệt và kết nối Ngân hàng Chính sách Xã hội. Hotline: 0937.587.438." },
      { q: "Mặt bằng K-Home CityView gồm những loại căn nào?", a: "K-Home CityView Hố Nai có 4 loại căn hộ: 1PN+ A (47,3m²), 1PN+ B (62,4m²), 2 phòng ngủ (70,4m²) và 3 phòng ngủ (84,4m²). Đây là dự án NOXH đầu tiên tại Đồng Nai có căn hộ 3 phòng ngủ." },
      { q: "Tiện ích K-Home CityView Hố Nai có gì?", a: "K-Home CityView có đầy đủ tiện ích nội khu: hồ bơi người lớn và trẻ em, sân chơi trẻ em, khu thể dục ngoài trời, nhà sinh hoạt cộng đồng, vườn cảnh quan, khu BBQ, bãi đỗ xe và hệ thống shophouse khối đế." },
      { q: "K-Home CityView có sổ hồng không?", a: "Có. Dự án được pháp lý đầy đủ theo quy định nhà ở xã hội, cấp sổ hồng sở hữu lâu dài. Hồ sơ pháp lý minh bạch từ giai đoạn đặt cọc đến khi nhận nhà." },
      { q: "Nhà ở xã hội K-Home CityView Biên Hòa khác gì với nhà thương mại?", a: "NOXH K-Home CityView được bán theo giá Nhà nước quy định (thấp hơn thị trường 20–40%), người mua được vay lãi suất 5,4%/năm từ Ngân hàng Chính sách. Tuy nhiên cần đáp ứng điều kiện thu nhập, chưa có nhà và chưa mua NOXH trước đó." },
      { q: "K-Home CityView do ai thiết kế?", a: "K-Home CityView được thiết kế và quy hoạch bởi Tập đoàn Surbana Jurong (Singapore) – đơn vị tư vấn quy hoạch đô thị hàng đầu châu Á với hơn 70 năm kinh nghiệm. Dự án phát triển theo tiêu chuẩn công trình xanh EDGE của IFC/World Bank, đảm bảo tiết kiệm ít nhất 20% điện, nước và giảm khí thải carbon." },
      { q: "K-Home CityView bàn giao nội thất gì?", a: "Căn hộ K-Home CityView được bàn giao hoàn thiện đầy đủ nội thất thiết yếu (trừ thiết bị điện tử): sofa, bàn trà, kệ tivi, bàn ăn – ghế ăn, giường, chăn – ga – gối – nệm, tủ quần áo, bàn học/trang điểm, vách kính WC, bồn cầu, lavabo, gương phòng tắm, trần thạch cao, đèn điện cơ bản, ống dẫn máy lạnh, quạt hút mùi. Cư dân dọn vào ở ngay." },
      { q: "K-Home CityView đường Điểu Xiển gần KCN nào?", a: "K-Home CityView nằm tại đường Điểu Xiển, Hố Nai, Biên Hòa – liền kề các khu công nghiệp lớn nhất Đồng Nai: KCN Amata, KCN Long Bình, KCN Biên Hòa 2, KCN Hố Nai. Từ dự án chỉ mất 10–15 phút đến các KCN này, rất thuận tiện cho công nhân và kỹ sư an cư tại chỗ." },
      { q: "K Home City View Biên Hòa là dự án gì?", a: "K Home City View (hay K-Home CityView, KHome CityView, K Home CityView) đều là tên gọi của cùng một dự án: K-Home CityView Hố Nai tại đường Điểu Xiển, Phường Hố Nai, TP. Biên Hòa, Đồng Nai – dự án nhà ở xã hội chuẩn Singapore do Kim Oanh Land phát triển với 1.328 căn NOXH, giá từ 950 triệu." },
      { q: "K Home Cityview và K-Home CityView có phải một không?", a: "Đúng – K Home Cityview, K-Home CityView, K Home City View, KHome City View đều là các cách viết khác nhau của cùng một dự án nhà ở xã hội tại Hố Nai, Biên Hòa do Kim Oanh Land phát triển. Hotline tư vấn: 0937.587.438." },
      { q: "Khome city view Đồng Nai ở đâu?", a: "Khome city view (tên đầy đủ: K-Home CityView) tọa lạc tại đường Điểu Xiển, Phường Hố Nai, TP. Biên Hòa, Tỉnh Đồng Nai. Đây là dự án nhà ở xã hội chuẩn Singapore quy mô 2,85 ha với 1.328 căn hộ NOXH và 39 shophouse." },
    ],
  },
  "k-home-midtown-trang-bom": {
    titleTag: "K-Home Midtown Trảng Bom | Nhà Ở Xã Hội | Giá từ 750 triệu | Cập nhật 2026",
    metaDesc: "K-Home Midtown Trảng Bom – dự án NOXH quy mô 13,97 ha, 542 căn hộ. Vị trí trung tâm Trảng Bom, tiện ích đầy đủ, vay ưu đãi 5,4%/năm. Xem bảng giá, mặt bằng & tiến độ mới nhất.",
    noxhConditions: [
      { label: "Chưa có nhà tại Đồng Nai", detail: "Không đứng tên sổ đỏ nhà ở tại tỉnh Đồng Nai" },
      { label: "Chưa từng mua NOXH", detail: "Chưa từng mua/thuê mua nhà ở xã hội tại bất kỳ tỉnh thành nào" },
      { label: "Thu nhập hộ gia đình", detail: "Vợ chồng: dưới 50 triệu/tháng • Đơn thân nuôi con: dưới 35 triệu/tháng • Độc thân: dưới 25 triệu/tháng" },
      { label: "Hộ khẩu hoặc tạm trú", detail: "Có hộ khẩu hoặc tạm trú tại tỉnh Đồng Nai từ 1 năm trở lên" },
      { label: "Ưu tiên công nhân KCN", detail: "Ưu tiên người lao động tại các KCN Trảng Bom, Bàu Xéo và các KCN lân cận" },
    ],
    paymentPolicy: [
      { step: "Đặt cọc", pct: "30.000.000 đ", note: "Khi ký Phiếu xác nhận cọc" },
      { step: "Đợt 1", pct: "15%", note: "7 ngày từ ngày cọc – ký HĐDVTV" },
      { step: "Đợt 2–3", pct: "5% / đợt", note: "Mỗi đợt cách 30 ngày" },
      { step: "Ngân hàng giải ngân", pct: "75%", note: "NH giải ngân theo tiến độ" },
      { step: "Bàn giao", pct: "Phí bảo trì 2%", note: "15 ngày kể từ thông báo bàn giao" },
    ],
    faq: [
      { q: "K-Home Midtown Trảng Bom ở đâu?", a: "K-Home Midtown tọa lạc tại trung tâm huyện Trảng Bom, giao lộ 4 tuyến đường 30/4 – Hùng Vương – Lý Nam Đế – Lê Đại Hành, Phường Trảng Bom, Đồng Nai. Cách TP.HCM khoảng 40km qua cao tốc." },
      { q: "K-Home Midtown Trảng Bom giá bao nhiêu?", a: "K-Home Midtown có giá từ 750 triệu đến 1,5 tỷ/căn: Studio từ 750 triệu, 1PN+A từ 990 triệu, 1PN+B từ 1,2 tỷ, 2PN từ 1,5 tỷ. Bàn giao full nội thất, trả góp từ 3,5–4,5 triệu/tháng." },
      { q: "K-Home Midtown có bao nhiêu căn?", a: "Dự án có 542 căn hộ NOXH và 20 căn shophouse, trên quỹ đất 13,97 ha tại trung tâm huyện Trảng Bom – quy mô lớn nhất trong 3 dự án K-Home tại Đồng Nai." },
      { q: "Điều kiện mua K-Home Midtown là gì?", a: "Người mua cần: chưa có nhà tại Đồng Nai, chưa từng mua NOXH, thu nhập dưới 50 triệu/tháng (hộ gia đình), có hộ khẩu hoặc tạm trú tại Đồng Nai. Ưu tiên công nhân, người lao động tại KCN Trảng Bom." },
      { q: "K-Home Midtown vay được lãi suất bao nhiêu?", a: "Người đủ điều kiện NOXH được vay tối đa 80% từ Ngân hàng Chính sách Xã hội với lãi suất 5,4%/năm cố định 25 năm. Trả góp chỉ từ 3,5 triệu/tháng, phù hợp thu nhập công nhân." },
      { q: "K-Home Midtown tiện ích có gì?", a: "Dự án có đầy đủ tiện ích nội khu: hồ bơi người lớn và trẻ em, Sky Garden vườn cảnh quan, sân chơi trẻ em, khu thể dục ngoài trời, nhà sinh hoạt cộng đồng và 20 căn shophouse thương mại tại tầng đế." },
      { q: "K-Home Midtown có sổ hồng không?", a: "Có. Dự án được pháp lý đầy đủ theo quy định nhà ở xã hội, cấp sổ hồng sở hữu lâu dài sau khi hoàn thành các thủ tục theo quy định." },
      { q: "Từ K-Home Midtown đến TP.HCM mất bao lâu?", a: "Từ K-Home Midtown đến TP.HCM khoảng 35–45 phút qua cao tốc TP.HCM – Long Thành – Dầu Giây (cách khoảng 40km). Thuận tiện cho người làm việc tại TP.HCM." },
      { q: "Mặt bằng căn hộ K-Home Midtown có những loại gì?", a: "K-Home Midtown có 4 loại căn: Studio (36,1m²), 1 phòng ngủ+ loại A (47m²), 1 phòng ngủ+ loại B (55,1m²) và 2 phòng ngủ (68,8m²). Tất cả bàn giao hoàn thiện nội thất, thiết kế tối ưu công năng theo tiêu chuẩn Singapore." },
      { q: "Nhà ở xã hội K-Home Midtown gần KCN nào?", a: "K-Home Midtown gần các KCN lớn tại Đồng Nai: KCN Bàu Xéo, KCN Hố Nai, KCN Biên Hòa. Từ dự án chỉ mất 10–20 phút đến các khu công nghiệp này, giúp công nhân tiết kiệm thời gian và chi phí đi lại." },
      { q: "K-Home Midtown có nhà mẫu để tham quan không?", a: "Liên hệ hotline 0937.587.438 để đăng ký tham quan nhà mẫu và cập nhật lịch tham quan mới nhất từ chủ đầu tư Kim Oanh Land. Hỗ trợ tư vấn và đặt lịch hoàn toàn miễn phí." },
      { q: "Hồ sơ mua nhà ở xã hội K-Home Midtown cần gì?", a: "Hồ sơ gồm: CMND/CCCD, hộ khẩu hoặc xác nhận tạm trú, giấy xác nhận thu nhập, giấy xác nhận chưa có nhà tại Đồng Nai. Đội ngũ Kim Oanh Land hỗ trợ hoàn thiện toàn bộ miễn phí." },
      { q: "K Home Midtown và K-Home Midtown có phải một không?", a: "Đúng – K Home Midtown, K-Home Midtown, KHome Midtown, K Home Mid Town đều là các cách viết khác nhau của cùng một dự án nhà ở xã hội tại trung tâm huyện Trảng Bom, Đồng Nai do Kim Oanh Land phát triển. Hotline: 0937.587.438." },
      { q: "K Home Mid Town Trảng Bom là dự án gì?", a: "K Home Mid Town (hay K-Home Midtown) là dự án nhà ở xã hội quy mô 13,97 ha tại trung tâm huyện Trảng Bom, Đồng Nai. 542 căn hộ NOXH từ 750 triệu, thiết kế chuẩn Singapore, bàn giao full nội thất, lãi suất 5,4%/năm." },
    ],
    locationImages: [
      { src: "slide-k-home-midtown/ban-do-vi-tri-du-an-k-home-midtown-tai-trung-tam-trang-bom-ket-noi-cac-tuyen-duo", alt: "Bản đồ vị trí dự án K-Home Midtown tại trung tâm Trảng Bom – kết nối các tuyến đường và KCN Đồng Nai", caption: "Vị trí K-Home Midtown – Trung tâm của trung tâm Trảng Bom" },
    ],
    floorPlanImages: [
      { src: "slide-k-home-midtown/mat-bang-can-ho-dien-hinh-k-home-midtown-studio-1-phong-ngu-a-1-phong-ngu-b-va-2", alt: "Mặt bằng căn hộ điển hình K-Home Midtown Studio 1PN A 1PN B 2PN", label: "Layout căn hộ điển hình" },
      { src: "slide-k-home-midtown/mat-bang-tang-1-k-home-midtown-trang-bom-ho-boi-san-choi-tre-em-khu-the-duc-va-c", alt: "Mặt bằng tầng 1 K-Home Midtown Trảng Bom tiện ích hồ bơi sân chơi khu thể dục", label: "Tầng 1 (Tiện ích)" },
      { src: "slide-k-home-midtown/mat-bang-tang-2-k-home-midtown-khu-vuc-nha-xe-sinh-hoat-cong-dong-va-sanh-thang-", alt: "Mặt bằng tầng 2 K-Home Midtown nhà xe sinh hoạt cộng đồng sảnh thang máy", label: "Tầng 2" },
      { src: "slide-k-home-midtown/mat-bang-tang-3-k-home-midtown-bo-tri-can-ho-va-san-vuon-noi-khu", alt: "Mặt bằng tầng 3 K-Home Midtown sân vườn nội khu Trảng Bom", label: "Tầng 3 (Sân vườn)" },
      { src: "slide-k-home-midtown/mat-bang-tang-dien-hinh-4-5-8-11-14-15-k-home-midtown-layout-can-ho-studio-1pn-v", alt: "Mặt bằng tầng điển hình 4 5 8 11 14 15 K-Home Midtown layout studio 1PN 2PN", label: "Tầng 4,5,8,11,14,15" },
      { src: "slide-k-home-midtown/mat-bang-tang-6-du-an-k-home-midtown-layout-can-ho-va-tien-ich-noi-khu", alt: "Mặt bằng tầng 6 K-Home Midtown layout căn hộ tiện ích nội khu", label: "Tầng 6" },
      { src: "slide-k-home-midtown/mat-bang-tang-7-du-an-k-home-midtown-trang-bom-so-do-phan-bo-can-ho-thap-a-va-th", alt: "Mặt bằng tầng 7 K-Home Midtown Trảng Bom tháp A tháp B", label: "Tầng 7" },
      { src: "slide-k-home-midtown/mat-bang-tang-12a-du-an-k-home-midtown-trang-bom-so-do-can-ho-va-sanh-thang-may", alt: "Mặt bằng tầng 12A K-Home Midtown Trảng Bom sơ đồ căn hộ sảnh thang máy", label: "Tầng 12A" },
      { src: "slide-k-home-midtown/mat-bang-tang-12b-du-an-k-home-midtown-trang-bom-bo-tri-can-ho-thap-a-va-thap-b", alt: "Mặt bằng tầng 12B K-Home Midtown Trảng Bom bố trí căn hộ tháp A tháp B", label: "Tầng 12B" },
    ],
    amenityImages: [
      { src: "slide-k-home-midtown/ho-boi-ngoai-troi-tai-k-home-midtown-trang-bom-khong-gian-thu-gian-va-tien-ich-n", alt: "Hồ bơi ngoài trời K-Home Midtown Trảng Bom không gian thư giãn tiện ích nội khu chuẩn Singapore", caption: "Hồ bơi ngoài trời" },
      { src: "slide-k-home-midtown/khong-gian-song-tai-k-home-midtown-trang-bom-view-huong-cong-vien-va-tien-ich-no", alt: "Không gian sống K-Home Midtown Trảng Bom view hướng công viên tiện ích nội khu", caption: "View hướng công viên nội khu" },
    ],
    developerImage: "slide-k-home-midtown/doi-ngu-phat-trien-du-an-k-home-midtown-kim-oanh-land-cung-cac-doi-tac-global-vi",
    sampleUnitImages: [
      { src: "/k-home midtown/Can-Studio/k-home-midtown-studio-1.jpg", alt: "Nhà mẫu căn Studio K-Home Midtown Trảng Bom Kim Oanh Land", label: "Căn Studio (36,1m²)" },
      { src: "/k-home midtown/Can-1PN-A/k-home-midtown-1PNA.jpg", alt: "Nhà mẫu căn 1 phòng ngủ A K-Home Midtown Trảng Bom Kim Oanh", label: "Căn 1PN + A (47,0m²)" },
      { src: "/k-home midtown/Can-1PN-B/k-home-midtown-1PNB.jpg", alt: "Nhà mẫu căn 1 phòng ngủ B K-Home Midtown Trảng Bom Kim Oanh", label: "Căn 1PN + B (55,1m²)" },
      { src: "/k-home midtown/Can-2PN/k-home-midtown-2pn.jpg", alt: "Nhà mẫu căn 2 phòng ngủ K-Home Midtown Trảng Bom Đồng Nai Kim Oanh", label: "Căn 2PN (68,8m²)" },
    ],
    midtownHighlights: {
      heroImage: "slide-k-home-midtown/phoi-canh-tong-the-du-an-k-home-midtown-trang-bom-phong-cach-song-chuan-singapor",
      locationText: "Nằm tại tâm điểm kết nối của các tuyến giao thông huyết mạch liên vùng, K-Home Midtown khẳng định vị thế trung tâm của trung tâm đô thị Trảng Bom với nền tảng kinh tế – xã hội và phát triển công nghiệp sôi động bậc nhất của Đồng Nai. Từ đây, mọi hành trình kết nối của cư dân K-Home Midtown đều trở nên dễ dàng, mỗi bước chân luôn bắt nhịp cùng dòng chảy phát triển mạnh mẽ của cả khu vực.",
      points: [
        { num: "01", title: "Vị trí trung tâm – Giao thông kết nối", desc: "Giữa 4 tuyến đường: 30/4 – Hùng Vương – Lý Nam Đế – Lê Đại Hành. Trung tâm hành chính, kinh tế huyện Trảng Bom." },
        { num: "02", title: "Phát triển theo chuẩn công trình xanh EDGE", desc: "Tiêu chuẩn EDGE quốc tế (IFC/World Bank): giảm 20% điện năng, 20% lượng nước, 20% khí phát thải carbon." },
        { num: "03", title: "Thiết kế thông minh – Tối ưu công năng", desc: "100% căn hộ có cửa sổ đón sáng và thông gió tự nhiên. Bố cục tối ưu từng m² theo tiêu chuẩn Singapore." },
        { num: "04", title: "Tiện ích phong phú – Đa dạng trải nghiệm", desc: "Hồ bơi người lớn và trẻ em, sân chơi, khu thể dục, Sky Garden, BBQ, shophouse 20 căn khối đế." },
        { num: "05", title: "Cộng đồng văn minh", desc: "Quy chế quản lý cư dân văn minh, ban quản trị chuyên nghiệp theo mô hình Singapore." },
        { num: "06", title: "Vận hành thông minh", desc: "Hệ thống BMS quản lý tòa nhà, camera AI 24/7, kiểm soát ra vào bằng thẻ từ, ứng dụng quản lý cư dân." },
        { num: "07", title: "Pháp lý chuẩn chỉnh", desc: "Pháp lý đầy đủ theo quy định NOXH, sổ hồng sở hữu lâu dài, hỗ trợ thủ tục hoàn toàn miễn phí." },
        { num: "08", title: "Đơn vị phát triển uy tín", desc: "Kim Oanh Land – Top 10 nhà phát triển NOXH hàng đầu Việt Nam, giải thưởng PropertyGuru 2025." },
        { num: "09", title: "Hệ thống đối tác chuyên nghiệp", desc: "Global Vireon Studio, Kiến Trúc Việt, Decofi, Nagecco – các đơn vị tư vấn thiết kế và thi công uy tín." },
        { num: "10", title: "Chính sách ưu đãi vượt trội", desc: "Vay NOXH lãi suất 5,4%/năm – 25 năm. Trả góp từ 3,5 triệu/tháng. Hỗ trợ hồ sơ vay ngân hàng miễn phí." },
      ],
    },
    midtownEdge: {
      heroImage: "slide-k-home-midtown/tien-ich-va-cong-trinh-xanh-edge-tai-k-home-midtown-giam-20-dien-nang-nuoc-va-kh",
      savings: [
        { label: "Giảm điện năng tiêu thụ", pct: "20%" },
        { label: "Giảm lượng nước sử dụng", pct: "20%" },
        { label: "Giảm khí phát thải carbon", pct: "20%" },
      ],
      desc: "Phong cách sống chuẩn Singapore hiện diện tại K-Home Midtown trong từng chi tiết. Thiết kế tinh gọn, thông minh đón trọn ánh sáng và gió tự nhiên, kết hợp cùng tiêu chuẩn xanh quốc tế EDGE, mở ra một không gian sống vừa tinh tế, vừa bền vững.",
    },
    constructionProgress: {
      timeline: [
        { date: "2024", event: "Phê duyệt quy hoạch 1/500 và hoàn tất pháp lý dự án", done: true },
        { date: "21/08/2025", event: "Động thổ dự án", done: true },
        { date: "20/01/2026", event: "Khởi công xây dựng chính thức", done: true },
        { date: "Q2–Q3/2026", event: "Thi công phần thô các tầng", done: false },
        { date: "2027", event: "Hoàn thiện nội thất & bàn giao", done: false },
      ],
      siteImages: [],
    },
    legalInfo: {
      items: [
        { title: "Giấy chứng nhận đăng ký đầu tư", desc: "Dự án được cấp Giấy CNĐT hợp lệ bởi cơ quan có thẩm quyền tỉnh Đồng Nai. Chủ đầu tư: Kim Oanh Land JSC." },
        { title: "Phê duyệt quy hoạch 1/500", desc: "Quy hoạch chi tiết tỷ lệ 1/500 được UBND tỉnh Đồng Nai phê duyệt, đảm bảo pháp lý đầy đủ trước khi triển khai xây dựng." },
        { title: "Chuyển đổi mục đích sử dụng đất", desc: "Đất đã hoàn tất thủ tục chuyển đổi sang đất ở, đảm bảo cấp sổ hồng sở hữu lâu dài cho người mua." },
        { title: "Giấy phép xây dựng", desc: "Giấy phép xây dựng đã được cấp đầy đủ, dự án đang trong giai đoạn triển khai xây dựng hợp pháp tại trung tâm Trảng Bom." },
      ],
    },
    buyVsRent: {
      tableRows: [
        { label: "Chi phí hàng tháng", buy: "Trả góp ~3,5 triệu/tháng", rent: "Thuê ~4-6 triệu/tháng" },
        { label: "Sau 25 năm", buy: "Sở hữu tài sản 1,5–3 tỷ", rent: "Mất trắng ~1,8 tỷ tiền thuê" },
        { label: "Ổn định chỗ ở", buy: "Không lo giá thuê tăng, không bị đuổi", rent: "Phụ thuộc chủ nhà" },
        { label: "Tích lũy tài sản", buy: "Bất động sản tăng giá theo thời gian", rent: "Không tích lũy được gì" },
        { label: "Lãi suất", buy: "5,4%/năm – thấp nhất thị trường", rent: "Không áp dụng" },
        { label: "Điều kiện", buy: "Cần đủ điều kiện NOXH", rent: "Chỉ cần có tiền cọc" },
      ],
      conclusion: "Với mức trả góp chỉ từ 3,5 triệu/tháng — thấp hơn tiền thuê trọ tại Trảng Bom — người mua K-Home Midtown vừa có chỗ ở ổn định ngay trung tâm huyện, vừa tích lũy tài sản lâu dài. Đây là lý do tại sao nhiều công nhân KCN Trảng Bom chọn mua thay vì tiếp tục thuê.",
    },
    awards: {
      items: [
        { title: "PropertyGuru Vietnam Property Awards", org: "Best Affordable Housing Development 2025 – Kim Oanh Land", year: "2025" },
        { title: "Top 10 Nhà phát triển NOXH hàng đầu Việt Nam", org: "Bộ Xây dựng & Hiệp hội Bất động sản Việt Nam", year: "2024" },
        { title: "Giải thưởng Kiến trúc xanh bền vững", org: "Hội Kiến trúc sư Việt Nam công nhận", year: "2024" },
      ],
    },
    partners: {
      items: [
        { name: "Global Vireon Studio", role: "Tư vấn thiết kế kiến trúc tổng thể" },
        { name: "Kiến Trúc Việt", role: "Tư vấn thiết kế nội thất & cảnh quan" },
        { name: "Decofi", role: "Tư vấn & thi công nội thất" },
        { name: "Nagecco", role: "Đơn vị giám sát thi công" },
        { name: "K-City", role: "Đơn vị quản lý & vận hành tòa nhà" },
      ],
    },
    singaporeFactors: {
      factors: [
        { num: "01", title: "Vị trí trung tâm – Giao thông kết nối", desc: "Giữa 4 tuyến đường: 30/4 – Hùng Vương – Lý Nam Đế – Lê Đại Hành. Trung tâm hành chính, kinh tế huyện Trảng Bom, dễ dàng kết nối toàn vùng." },
        { num: "02", title: "Phát triển theo chuẩn công trình xanh EDGE", desc: "Tiêu chuẩn EDGE quốc tế (IFC/World Bank): giảm 20% điện năng, 20% lượng nước, 20% khí phát thải carbon." },
        { num: "03", title: "Thiết kế thông minh – Tối ưu công năng", desc: "100% căn hộ có cửa sổ đón sáng và thông gió tự nhiên. Bố cục tối ưu từng m² theo tiêu chuẩn Singapore." },
        { num: "04", title: "Tiện ích phong phú – Đa dạng trải nghiệm", desc: "Hồ bơi người lớn và trẻ em, sân chơi, khu thể dục, Sky Garden, BBQ, 20 căn shophouse khối đế." },
        { num: "05", title: "Cộng đồng văn minh", desc: "Quy chế quản lý cư dân văn minh, ban quản trị chuyên nghiệp theo mô hình Singapore." },
        { num: "06", title: "Vận hành thông minh", desc: "Hệ thống BMS quản lý tòa nhà, camera AI 24/7, kiểm soát ra vào bằng thẻ từ, ứng dụng quản lý cư dân." },
        { num: "07", title: "Pháp lý chuẩn chỉnh", desc: "Pháp lý đầy đủ theo quy định NOXH, sổ hồng sở hữu lâu dài, hỗ trợ thủ tục hoàn toàn miễn phí." },
        { num: "08", title: "Bàn giao hoàn thiện nội thất chất lượng cao", desc: "Bàn giao full nội thất theo tiêu chuẩn dự án — tủ bếp, sofa, giường, tủ quần áo, sàn gỗ. Chỉ cần mang đồ cá nhân là ở được ngay." },
      ],
    },
    edgeCert: {
      savings: [
        { label: "Giảm điện năng tiêu thụ", pct: "≥ 20%" },
        { label: "Giảm lượng nước sử dụng", pct: "≥ 20%" },
        { label: "Giảm khí phát thải carbon", pct: "≥ 20%" },
      ],
      desc: "Phong cách sống chuẩn Singapore hiện diện tại K-Home Midtown trong từng chi tiết. Thiết kế tinh gọn, thông minh đón trọn ánh sáng và gió tự nhiên, kết hợp cùng tiêu chuẩn xanh quốc tế EDGE, mở ra không gian sống vừa tinh tế vừa bền vững – nơi giá trị gia đình Việt được gìn giữ, vun đầy và tiếp nối theo năm tháng.",
    },
  },
  "k-home-avenue-nhon-trach": {
    titleTag: "K-Home Avenue Nhơn Trạch | Nhà Ở Xã Hội gần Sân bay Long Thành | Giá từ 750 triệu",
    metaDesc: "K-Home Avenue Nhơn Trạch – nhà ở xã hội quy mô lớn, gần đường 25C và sân bay Long Thành. Căn Studio, 1PN, 2PN giá từ 750 triệu. Hỗ trợ vay 5,4%/năm, pháp lý rõ ràng.",
    noxhConditions: [
      { label: "Chưa có nhà tại Đồng Nai", detail: "Không đứng tên sổ đỏ nhà ở tại tỉnh Đồng Nai" },
      { label: "Chưa từng mua NOXH", detail: "Chưa từng mua/thuê mua nhà ở xã hội tại bất kỳ tỉnh thành nào" },
      { label: "Thu nhập hộ gia đình", detail: "Vợ chồng: dưới 50 triệu/tháng • Đơn thân nuôi con: dưới 35 triệu/tháng • Độc thân: dưới 25 triệu/tháng" },
      { label: "Hộ khẩu hoặc tạm trú", detail: "Có hộ khẩu hoặc tạm trú tại tỉnh Đồng Nai từ 1 năm trở lên" },
      { label: "Ưu tiên công nhân KCN Nhơn Trạch", detail: "Ưu tiên người lao động tại các KCN Nhơn Trạch 1–6, Long Thành và vùng lân cận" },
    ],
    paymentPolicy: [
      { step: "Đặt cọc", pct: "30.000.000 đ", note: "Khi ký Phiếu xác nhận cọc" },
      { step: "Đợt 1", pct: "15%", note: "7 ngày từ ngày cọc – ký HĐDVTV" },
      { step: "Đợt 2–3", pct: "5% / đợt", note: "Mỗi đợt cách 30 ngày" },
      { step: "Ngân hàng giải ngân", pct: "75%", note: "NH giải ngân theo tiến độ" },
      { step: "Bàn giao", pct: "Phí bảo trì 2%", note: "15 ngày kể từ thông báo bàn giao" },
    ],
    faq: [
      { q: "K-Home Avenue Nhơn Trạch ở đâu?", a: "K-Home Avenue tọa lạc trên đường Nguyễn Ái Quốc (Tỉnh lộ 25C), xã Nhơn Trạch, tỉnh Đồng Nai – trục đường kết nối trực tiếp đến Cảng Hàng không Quốc tế Long Thành đang xây dựng." },
      { q: "K-Home Avenue Nhơn Trạch giá bao nhiêu?", a: "K-Home Avenue có giá từ 750 triệu: Studio 37,7m² từ 750 triệu, 1PN+ 46,6m² từ 990 triệu, 2PN nhỏ 65,7m² từ 1,23 tỷ, 2PN lớn 69,5m² từ 1,40 tỷ. Tất cả bàn giao full nội thất." },
      { q: "Điều kiện mua K-Home Avenue là gì?", a: "Người mua cần: chưa có nhà tại Đồng Nai, chưa từng mua NOXH, thu nhập dưới 50 triệu/tháng (hộ gia đình), có hộ khẩu hoặc tạm trú tại Đồng Nai. Hỗ trợ hồ sơ hoàn toàn miễn phí." },
      { q: "K-Home Avenue gần sân bay Long Thành không?", a: "Có. K-Home Avenue nằm trên trục đường 25C – tuyến đường kết nối trực tiếp đến Sân bay Quốc tế Long Thành, dự kiến hoạt động 2026. Đây là lợi thế lớn về tiềm năng tăng giá trị bất động sản." },
      { q: "K-Home Avenue có bao nhiêu căn?", a: "Dự án có 1.022 căn hộ NOXH và 82 căn shophouse thương mại, trên quỹ đất 5,3 ha tại Nhơn Trạch – huyện đang phát triển mạnh nhờ hạ tầng sân bay Long Thành." },
      { q: "Vay mua K-Home Avenue lãi suất bao nhiêu?", a: "Người đủ điều kiện NOXH được vay tối đa 80% từ Ngân hàng Chính sách Xã hội với lãi suất 5,4%/năm cố định 25 năm. Trả góp chỉ từ 3,5 triệu/tháng cho căn Studio." },
      { q: "K-Home Avenue khi nào mở bán chính thức?", a: "K-Home Avenue đang trong giai đoạn chuẩn bị ra hàng. Liên hệ hotline 0937.587.438 để đăng ký danh sách ưu tiên và nhận thông báo ngay khi mở bán chính thức." },
      { q: "Từ K-Home Avenue đến TP.HCM mất bao lâu?", a: "Từ K-Home Avenue đến TP.HCM khoảng 30–40 phút qua cầu Phước Khánh và các tuyến đường vành đai, cầu Nhơn Trạch đang thi công sẽ rút ngắn thêm thời gian di chuyển." },
      { q: "Mặt bằng K-Home Avenue Nhơn Trạch có những loại căn nào?", a: "K-Home Avenue có 4 loại căn: Studio (37,7m²), 1 phòng ngủ+ (46,6m²), 2 phòng ngủ nhỏ (65,7m²) và 2 phòng ngủ lớn (69,5m²). 4 block cao 12 tầng, bàn giao hoàn thiện nội thất tiêu chuẩn Singapore." },
      { q: "Tiện ích dự án K-Home Avenue có gì?", a: "K-Home Avenue có hệ thống tiện ích đầy đủ: hồ bơi, sân chơi trẻ em, khu thể dục ngoài trời, Sky Garden vườn cảnh quan, nhà sinh hoạt cộng đồng, trạm sạc xe điện và 82 căn shophouse khối đế." },
      { q: "Nhà ở xã hội K-Home Avenue Nhơn Trạch có sổ hồng không?", a: "Có. Dự án được pháp lý đầy đủ theo quy định nhà ở xã hội, cấp sổ hồng sở hữu lâu dài. Kim Oanh Land hỗ trợ hoàn thiện toàn bộ thủ tục pháp lý miễn phí cho người mua." },
      { q: "K-Home Avenue gần KCN Nhơn Trạch không?", a: "Có. K-Home Avenue nằm trong khu vực huyện Nhơn Trạch, gần các KCN Nhơn Trạch 1–6 và KCN Long Thành. Thuận tiện cho công nhân và kỹ sư làm việc tại các khu công nghiệp này an cư tại chỗ." },
      { q: "K Home Avenue và K-Home Avenue có phải một không?", a: "Đúng – K Home Avenue, K-Home Avenue, KHome Avenue đều là các cách viết của cùng một dự án nhà ở xã hội tại đường Nguyễn Ái Quốc (25C), xã Nhơn Trạch, Đồng Nai do Kim Oanh Land phát triển. 1.022 căn NOXH từ 750 triệu." },
      { q: "K Home Avenue Nhơn Trạch Đồng Nai là dự án gì?", a: "K Home Avenue (tên đầy đủ: K-Home Avenue Nhơn Trạch) là dự án nhà ở xã hội 5,3 ha tại đường 25C, Nhơn Trạch, Đồng Nai – gần sân bay Long Thành. 1.022 căn NOXH + 82 shophouse, giá từ 750 triệu, lãi suất 5,4%/năm." },
    ],
    locationImages: [
      { src: "slide-k-home-avenue/ban-do-vi-tri-chien-luoc-k-home-avenue-cua-ngo-khu-dong-tp-hcm-ket-noi-san-bay-l", alt: "Bản đồ vị trí chiến lược K-Home Avenue Nhơn Trạch – cửa ngõ khu Đông TP.HCM kết nối sân bay Long Thành", caption: "K-Home Avenue – Cửa ngõ khu Đông TP.HCM, 10 phút đến sân bay Long Thành" },
      { src: "slide-k-home-avenue/tiem-nang-vuot-troi-cua-khu-vuc-nhon-trach-va-du-an-k-home-avenue", alt: "Tiềm năng vượt trội khu vực Nhơn Trạch và dự án K-Home Avenue Đồng Nai", caption: "Tiềm năng phát triển Nhơn Trạch – Long Thành" },
    ],
    floorPlanImages: [
      { src: "slide-k-home-avenue/mat-bang-can-ho-dien-hinh-k-home-avenue-studio-1pn-2pn-a-va-2pn-b-kem-hinh-anh-n", alt: "Mặt bằng căn hộ điển hình K-Home Avenue Studio 1PN 2PN A 2PN B Nhơn Trạch", label: "Layout căn hộ điển hình" },
      { src: "slide-k-home-avenue/mat-bang-tang-1-du-an-k-home-avenue-voi-day-du-tien-ich-noi-khu", alt: "Mặt bằng tầng 1 K-Home Avenue Nhơn Trạch tiện ích nội khu hồ bơi sân chơi", label: "Tầng 1 (Tiện ích)" },
      { src: "slide-k-home-avenue/mat-bang-tang-2-du-an-k-home-avenue", alt: "Mặt bằng tầng 2 dự án K-Home Avenue Nhơn Trạch Đồng Nai", label: "Tầng 2" },
      { src: "slide-k-home-avenue/mat-bang-tang-3-du-an-k-home-avenue", alt: "Mặt bằng tầng 3 dự án K-Home Avenue Nhơn Trạch", label: "Tầng 3" },
      { src: "slide-k-home-avenue/mat-bang-tang-dien-hinh-4-12-du-an-k-home-avenue", alt: "Mặt bằng tầng điển hình 4-12 K-Home Avenue Nhơn Trạch layout căn hộ studio 1PN 2PN", label: "Tầng 4–12 (Điển hình)" },
    ],
    amenityImages: [
      { src: "slide-k-home-avenue/he-tien-ich-da-lop-tai-k-home-avenue-ho-boi-san-choi-va-tien-ich-ngoai-khu-xung-", alt: "Hệ tiện ích đa lớp K-Home Avenue Nhơn Trạch hồ bơi sân chơi trẻ em và tiện ích ngoại khu", caption: "Hệ tiện ích đa lớp – nội khu & ngoại khu" },
      { src: "slide-k-home-avenue/phoi-canh-tong-the-du-an-nha-o-xa-hoi-k-home-avenue-chuan-singapore-tai-nhon-tra", alt: "Phối cảnh tổng thể nhà ở xã hội K-Home Avenue chuẩn Singapore Nhơn Trạch Đồng Nai", caption: "Phối cảnh tổng thể K-Home Avenue" },
      { src: "slide-k-home-avenue/tong-quan-du-an-k-home-avenue-nang-tam-chuan-song-xanh-voi-4-block-cao-12-tang-t", alt: "Tổng quan K-Home Avenue Nhơn Trạch 4 block 12 tầng nâng tầm chuẩn sống xanh", caption: "4 block cao 12 tầng – 1.022 căn hộ NOXH" },
    ],
    developerImage: "/k-home cityview/mat-bang/top-10-nha-phat-trien-nha-o-xa-hoi-viet-nam-2024.jpg.webp",
    sampleUnitImages: [
      { src: "/k-home avenue/Can-Studio/layout-can-ho-khome-avenue-studio.jpg", alt: "Nhà mẫu căn Studio K-Home Avenue Nhơn Trạch Kim Oanh Land 37,7m²", label: "Căn Studio (37,7m²)" },
      { src: "/k-home avenue/Can-1PN/layout-can-ho-khome-avenue-1pn.jpg", alt: "Nhà mẫu căn 1 phòng ngủ K-Home Avenue Nhơn Trạch Kim Oanh Land 46,6m²", label: "Căn 1PN+ (46,6m²)" },
      { src: "/k-home avenue/Can-2PN-nho/layout-can-ho-khome-avenue-2PNA.jpg", alt: "Nhà mẫu căn 2 phòng ngủ nhỏ A K-Home Avenue Nhơn Trạch 65,7m²", label: "Căn 2PN-A (65,7m²)" },
      { src: "/k-home avenue/Can-2PN-lon/layout-can-ho-khome-avenue-2PNB.jpg", alt: "Nhà mẫu căn 2 phòng ngủ lớn B K-Home Avenue Nhơn Trạch 69,5m²", label: "Căn 2PN-B (69,5m²)" },
    ],
    avenueHighlights: {
      heroImage: "slide-k-home-avenue/phoi-canh-tong-the-du-an-nha-o-xa-hoi-k-home-avenue-chuan-singapore-tai-nhon-tra",
      locationText: "Tọa lạc tại trung tâm đô thị Nhơn Trạch, chỉ khoảng 10 phút kết nối sân bay quốc tế Long Thành. K-Home Avenue sở hữu vị trí chiến lược khi liền kề khu thương mại tự do 1.000ha và thừa hưởng mạng lưới hạ tầng đa phương thức: đại lộ Nguyễn Ái Quốc, Tôn Đức Thắng, Vành đai 3, cao tốc Bến Lức – Long Thành, TP.HCM – Long Thành – Dầu Giây, metro Thủ Thiêm – Long Thành.",
      points: [
        { num: "01", title: "Vị trí trung tâm, giao thông kết nối", desc: "Tọa lạc đường Nguyễn Ái Quốc (25C), 10 phút đến sân bay Long Thành. Kết nối cao tốc TP.HCM – Long Thành – Dầu Giây, Vành đai 3, metro Thủ Thiêm – Long Thành." },
        { num: "02", title: "Phát triển theo chuẩn công trình xanh EDGE", desc: "Tiêu chuẩn EDGE quốc tế (IFC/World Bank): giảm ≥20% điện năng, ≥20% nước, ≥20% khí phát thải carbon so với công trình thông thường." },
        { num: "03", title: "Thiết kế thông minh, tối ưu không gian", desc: "100% căn hộ có cửa sổ đón sáng tự nhiên. Bố cục tối ưu từng m², không gian thông thoáng theo tiêu chuẩn Singapore." },
        { num: "04", title: "Tiện ích phong phú, đa dạng", desc: "Hồ bơi, sân chơi trẻ em, minimart, khu thể dục, BBQ, bãi cỏ cộng đồng, trạm sạc xe điện và 82 căn shophouse khối đế." },
        { num: "05", title: "Cộng đồng văn minh", desc: "Quy chế quản lý cư dân văn minh, ban quản trị chuyên nghiệp theo mô hình quản lý Singapore hiện đại." },
        { num: "06", title: "Chủ đầu tư uy tín, giàu kinh nghiệm", desc: "Kim Oanh Land – Top 10 nhà phát triển NOXH hàng đầu Việt Nam, giải thưởng PropertyGuru 2025, kinh nghiệm 20+ năm." },
        { num: "07", title: "Hệ thống đối tác chuyên nghiệp", desc: "Global Vireon Studio, Cubic, Phan Vũ, Handong Engineering, K-City Property Management, Coninco – các đơn vị tư vấn và thi công uy tín." },
        { num: "08", title: "Quản lý, vận hành khoa học", desc: "Hệ thống BMS quản lý tòa nhà thông minh, camera AI 24/7, ứng dụng quản lý cư dân, kiểm soát ra vào bằng thẻ từ." },
        { num: "09", title: "Pháp lý chuẩn chỉnh", desc: "Pháp lý đầy đủ theo quy định NOXH, sổ hồng sở hữu lâu dài. Kim Oanh Land hỗ trợ hoàn thiện toàn bộ thủ tục miễn phí." },
        { num: "10", title: "Chính sách ưu đãi vượt trội", desc: "Vay NOXH lãi suất 5,4%/năm – 25 năm. Trả góp từ 3 triệu/tháng. Hỗ trợ hồ sơ vay ngân hàng hoàn toàn miễn phí." },
      ],
    },
    constructionProgress: {
      timeline: [
        { date: "2024 – đầu 2025", event: "Phê duyệt quy hoạch 1/500 và hoàn tất pháp lý dự án", done: true },
        { date: "21/08/2025", event: "Động thổ dự án – cùng 3 dự án K-Home Đồng Nai", done: true },
        { date: "Q1/2026", event: "Khởi công xây dựng chính thức", done: true },
        { date: "2026 – 2027", event: "Thi công phần thô và hoàn thiện các block", done: false },
        { date: "Cuối 2027", event: "Hoàn thiện nội thất & bàn giao căn hộ cho cư dân", done: false },
      ],
      siteImages: [],
    },
    legalInfo: {
      items: [
        { title: "Giấy chứng nhận đăng ký đầu tư", desc: "Dự án được cấp Giấy CNĐT hợp lệ bởi cơ quan có thẩm quyền tỉnh Đồng Nai. Chủ đầu tư: Kim Oanh Land (thành viên Kim Oanh Group)." },
        { title: "Phê duyệt quy hoạch chi tiết 1/500", desc: "Quy hoạch chi tiết tỷ lệ 1/500 được UBND tỉnh Đồng Nai phê duyệt, đảm bảo pháp lý đầy đủ trước khi triển khai xây dựng." },
        { title: "Chuyển đổi mục đích sử dụng đất", desc: "Đất đã hoàn tất thủ tục chuyển đổi sang đất ở, đảm bảo cấp sổ hồng sở hữu lâu dài cho người mua." },
        { title: "Giấy phép xây dựng", desc: "Giấy phép xây dựng đã được cấp đầy đủ, dự án đang trong giai đoạn triển khai xây dựng hợp pháp tại Nhơn Trạch, Đồng Nai." },
      ],
    },
    singaporeFactors: {
      factors: [
        { num: "01", title: "Vị trí cửa ngõ khu Đông TP.HCM", desc: "Đường Nguyễn Ái Quốc (25C), 10 phút đến sân bay Long Thành. Liền kề khu thương mại tự do 1.000ha, kết nối metro và cao tốc." },
        { num: "02", title: "Phát triển theo chuẩn EDGE xanh bền vững", desc: "Giảm ≥20% điện năng, ≥20% nước, ≥20% khí thải carbon. Là một trong số ít NOXH Việt Nam hướng đến chứng chỉ EDGE." },
        { num: "03", title: "Thiết kế thông minh, tối ưu không gian", desc: "100% căn hộ có cửa sổ đón sáng và thông gió tự nhiên, bố cục tối ưu theo tiêu chuẩn thiết kế Singapore." },
        { num: "04", title: "Hệ tiện ích đa lớp – nội khu & ngoại khu", desc: "Hồ bơi, minimart, sân chơi, BBQ, trạm sạc xe điện trong khu. Ngoài khu: TTTM, bệnh viện, trường liên cấp, công viên." },
        { num: "05", title: "Cộng đồng văn minh, an toàn", desc: "Ban quản trị chuyên nghiệp, camera AI 24/7, kiểm soát ra vào bằng thẻ từ, ứng dụng quản lý cư dân thông minh." },
        { num: "06", title: "Tầm view sân bay & đô thị Long Thành", desc: "Các căn tầng cao có tầm nhìn thông thoáng hướng sân bay Long Thành và đô thị mới Nhơn Trạch đang phát triển mạnh." },
        { num: "07", title: "Bàn giao hoàn thiện nội thất", desc: "Bàn giao full nội thất cơ bản: tủ bếp, sofa, giường, tủ quần áo, sàn gỗ. Cư dân chỉ cần mang đồ cá nhân là ở được ngay." },
        { num: "08", title: "Quản lý vận hành theo chuẩn Singapore", desc: "K-City Property Management vận hành theo mô hình quản lý chuyên nghiệp, minh bạch phí dịch vụ và bảo trì." },
      ],
    },
    edgeCert: {
      savings: [
        { label: "Giảm điện năng tiêu thụ", pct: "≥ 20%" },
        { label: "Giảm lượng nước sử dụng", pct: "≥ 20%" },
        { label: "Giảm khí phát thải carbon", pct: "≥ 20%" },
      ],
      desc: "Phong cách sống chuẩn Singapore hiện diện tại K-Home Avenue trong từng chi tiết: thiết kế tinh gọn, thông minh, đón trọn ánh sáng và gió tự nhiên, kết hợp tiêu chuẩn xanh quốc tế EDGE – mở ra không gian sống vừa tinh tế vừa bền vững.",
    },
    buyVsRent: {
      tableRows: [
        { label: "Chi phí hàng tháng", buy: "Trả góp khoảng 3–4 triệu/tháng", rent: "Thuê 4–6 triệu/tháng" },
        { label: "Sau 25 năm", buy: "Sở hữu tài sản 1,2–2 tỷ", rent: "Mất trắng tiền thuê" },
        { label: "Ổn định chỗ ở", buy: "Không lo giá thuê tăng, không bị đuổi", rent: "Phụ thuộc chủ nhà" },
        { label: "Tích lũy tài sản", buy: "Bất động sản tăng giá theo thời gian", rent: "Không tích lũy được gì" },
        { label: "Lãi suất", buy: "5,4%/năm – thấp nhất thị trường", rent: "Không áp dụng" },
        { label: "Điều kiện", buy: "Cần đủ điều kiện NOXH", rent: "Chỉ cần có tiền cọc" },
      ],
      conclusion: "Với mức trả góp thấp hơn tiền thuê trọ tại khu vực Nhơn Trạch – Long Thành, người mua K-Home Avenue vừa có chỗ ở ổn định gần sân bay Long Thành, vừa tích lũy tài sản lâu dài trong khu vực có tốc độ tăng trưởng cao nhất tỉnh Đồng Nai.",
    },
    awards: {
      items: [
        { title: "PropertyGuru Vietnam Property Awards", org: "Best Affordable Housing Development 2025 – Kim Oanh Land", year: "2025" },
        { title: "Top 10 Nhà phát triển NOXH hàng đầu Việt Nam", org: "Bộ Xây dựng & Hiệp hội Bất động sản Việt Nam", year: "2024" },
        { title: "Giải thưởng Kiến trúc xanh bền vững", org: "Hội Kiến trúc sư Việt Nam công nhận", year: "2024" },
      ],
    },
    partners: {
      items: [
        { name: "Global Vireon Studio", role: "Tư vấn thiết kế kiến trúc tổng thể" },
        { name: "Cubic", role: "Tư vấn thiết kế nội thất" },
        { name: "Phan Vũ", role: "Nhà thầu xây dựng chính" },
        { name: "Handong Engineering", role: "Tư vấn kết cấu & M&E" },
        { name: "K-City Property", role: "Quản lý & vận hành tòa nhà" },
        { name: "Coninco", role: "Đơn vị giám sát thi công" },
      ],
    },
  },
};

interface ProjectDetailViewProps {
  slug: string;
  onNavigate: (hash: string) => void;
}

export default function ProjectDetailView({ slug, onNavigate }: ProjectDetailViewProps) {
  const [project, setProject] = useState<Project | null>(null);
  const seo = PROJECT_SEO[slug];

  // Parse **bold** markers and \n\n paragraph breaks into JSX
  const renderRichText = (text: string) => {
    return text.split("\n\n").map((paragraph, pIdx) => {
      // Heading: toàn bộ đoạn là **...**
      const headingMatch = paragraph.match(/^\*\*(.+)\*\*$/);

      if (headingMatch) {
        return (
          <div key={pIdx}>
            {pIdx > 0 && <hr className="border-slate-200 my-5" />}
            <h3 className="text-base font-bold text-slate-800 mb-2">
              {headingMatch[1]}
            </h3>
          </div>
        );
      }

      const parts = paragraph.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={pIdx} className="text-slate-600 text-sm leading-relaxed">
          {parts.map((part, i) =>
            i % 2 === 1 ? <strong key={i} className="text-slate-800 font-semibold">{part}</strong> : part
          )}
        </p>
      );
    });
  };
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [activeFloorTab, setActiveFloorTab] = useState(0);

  // Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data: Project[]) => {
        const list = Array.isArray(data) ? data : [];
        const found = list.find((p) => p.slug === slug);
        setProject(found || null);
        if (found) {
          // Preload ảnh mặt bằng để tránh lag khi click tab
          if (seo?.floorPlanImages) {
            seo.floorPlanImages.forEach((img) => {
              const preloadImg = new Image();
              preloadImg.src = imgUrl(img.src, "full");
            });
          }
          // Dùng SEO title/meta từ PROJECT_SEO nếu có
          document.title = seo?.titleTag ?? `${found.title} | Giá Bán & Mặt Bằng Dự Án K-Home`;
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
            metaDesc.setAttribute("content", seo?.metaDesc ?? `${found.description} Cập nhật mặt bằng, chính sách chiết khấu đợt 1 từ chủ đầu tư Kim Oanh Group.`);
          }

          // Schema RealEstateListing
          const existingSchema = document.getElementById("schema-project");
          if (existingSchema) existingSchema.remove();
          const schema = document.createElement("script");
          schema.id = "schema-project";
          schema.type = "application/ld+json";
          schema.text = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            "name": found.title,
            "alternateName": found.slug === "k-home-cityview-ho-nai"
              ? ["K-Home CityView", "K Home CityView", "K Home City View", "KHome CityView", "K-Home City View", "K Home Cityview Biên Hòa", "NOXH K-Home CityView Hố Nai"]
              : found.slug === "k-home-midtown-trang-bom"
              ? ["K-Home Midtown", "K Home Midtown", "K Home Mid Town", "K-Home Mid Town", "KHome Midtown", "K Home Midtown Trảng Bom", "NOXH K-Home Midtown Trảng Bom"]
              : found.slug === "k-home-avenue-nhon-trach"
              ? ["K-Home Avenue", "K Home Avenue", "KHome Avenue", "K Home Avenue Nhơn Trạch", "NOXH K-Home Avenue Nhơn Trạch", "K-Home Avenue Đồng Nai"]
              : undefined,
            "description": found.description,
            "url": `https://k-homedongnai.com.vn/${found.slug}`,
            "image": `https://k-homedongnai.com.vn${found.image}`,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": found.location,
              "addressRegion": "Đồng Nai",
              "addressCountry": "VN"
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "VND",
              "price": found.priceNumber ? found.priceNumber * 1000000000 : undefined,
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": "Kim Oanh Group",
                "url": "https://k-homedongnai.com.vn"
              }
            },
            "numberOfRooms": found.unitTypes?.length,
            "floorSize": {
              "@type": "QuantitativeValue",
              "value": found.area,
              "unitCode": "MTK"
            }
          });
          document.head.appendChild(schema);

          // Schema BreadcrumbList
          const existingBreadcrumb = document.getElementById("schema-breadcrumb-project");
          if (existingBreadcrumb) existingBreadcrumb.remove();
          const breadcrumb = document.createElement("script");
          breadcrumb.id = "schema-breadcrumb-project";
          breadcrumb.type = "application/ld+json";
          breadcrumb.text = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "https://k-homedongnai.com.vn/" },
              { "@type": "ListItem", "position": 2, "name": "Dự án", "item": "https://k-homedongnai.com.vn/san-pham" },
              { "@type": "ListItem", "position": 3, "name": found.title, "item": `https://k-homedongnai.com.vn/${found.slug}` }
            ]
          });
          document.head.appendChild(breadcrumb);

          // FAQ Schema — lợi thế SEO lớn nhất, 3 trang top 1 đều không có
          const existingFaq = document.getElementById("schema-faq-project");
          if (existingFaq) existingFaq.remove();
          if (seo?.faq?.length) {
            const faqSchema = document.createElement("script");
            faqSchema.id = "schema-faq-project";
            faqSchema.type = "application/ld+json";
            faqSchema.text = JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": seo.faq.map(({ q, a }) => ({
                "@type": "Question",
                "name": q,
                "acceptedAnswer": { "@type": "Answer", "text": a },
              })),
            });
            document.head.appendChild(faqSchema);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch project detail:", err);
        setLoading(false);
      });

    // Cleanup: reset title khi unmount
    return () => {
      document.title = "K-Home Đồng Nai | Nhà Ở Xã Hội Kim Oanh Land – CityView, Midtown, Avenue";
      document.getElementById("schema-project")?.remove();
      document.getElementById("schema-breadcrumb-project")?.remove();
      document.getElementById("schema-faq-project")?.remove();
    };
  }, [slug]);

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formName.trim() || !formPhone.trim()) {
      setFormError("Vui lòng điền đầy đủ: Họ tên, Số điện thoại.");
      return;
    }

    setIsSubmitting(true);

    fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: formName,
        email: formEmail,
        phone: formPhone,
        projectSlug: project?.slug,
        projectName: project?.title,
        message: formMessage || `Tôi có nhu cầu tham quan và nhận báo giá dự án ${project?.title}.`
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error("Gửi yêu cầu không thành công");
        return res.json();
      })
      .then(() => {
        setSubmitSuccess(true);
        setIsSubmitting(false);
        // Clear fields
        setFormName("");
        setFormEmail("");
        setFormPhone("");
        setFormMessage("");
      })
      .catch((err) => {
        console.error("Contact submission error:", err);
        setFormError("Có lỗi xảy ra trong quá trình gửi yêu cầu. Vui lòng thử lại sau.");
        setIsSubmitting(false);
      });
  };

  // Check if mobile view
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Nav dots state
  const [activeSection, setActiveSection] = useState("tong-quan");
  const scrollLockRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navSections = slug === "k-home-cityview-ho-nai" ? [
    { id: "tong-quan", label: "Tổng Quan" },
    { id: "vi-tri", label: "Vị Trí" },
    { id: "gia-ban", label: "Giá Bán" },
    { id: "mat-bang", label: "Mặt Bằng" },
    { id: "tien-ich", label: "Tiện Ích" },
    { id: "tiem-nang", label: "Tiềm Năng" },
    { id: "tien-do-trien-khai", label: "Tiến Độ" },
    { id: "video-tien-do", label: "Video" },
    { id: "phap-ly", label: "Pháp Lý" },
    { id: "yeu-to-singapore", label: "8 Yếu Tố" },
    { id: "chung-chi-edge", label: "EDGE" },
    { id: "mua-vs-thue", label: "Mua vs Thuê" },
    { id: "giai-thuong", label: "Giải Thưởng" },
    { id: "chu-dau-tu", label: "Chủ Đầu Tư" },
    { id: "dieu-kien-mua", label: "Điều Kiện" },
    { id: "chinh-sach-thanh-toan", label: "Thanh Toán" },
    { id: "tinh-tra-gop", label: "Trả Góp" },
    { id: "lien-he", label: "Liên Hệ" },
    { id: "faq", label: "FAQ" },
  ] : slug === "k-home-midtown-trang-bom" ? [
    { id: "tong-quan", label: "Tổng Quan" },
    { id: "mat-bang", label: "Mặt Bằng" },
    { id: "tien-ich", label: "Tiện Ích" },
    { id: "nha-mau", label: "Nhà Mẫu" },
    { id: "tien-do-trien-khai", label: "Tiến Độ" },
    { id: "phap-ly", label: "Pháp Lý" },
    { id: "yeu-to-singapore", label: "Tiềm Năng" },
    { id: "chung-chi-edge", label: "EDGE" },
    { id: "mua-vs-thue", label: "Mua vs Thuê" },
    { id: "giai-thuong", label: "Giải Thưởng" },
    { id: "doi-tac", label: "Đối Tác" },
    { id: "chu-dau-tu", label: "Chủ Đầu Tư" },
    { id: "midtown-highlights", label: "Highlights" },
    { id: "midtown-edge", label: "Tiện Ích EDGE" },
    { id: "dieu-kien-mua", label: "Điều Kiện" },
    { id: "chinh-sach-thanh-toan", label: "Thanh Toán" },
    { id: "tinh-tra-gop", label: "Trả Góp" },
    { id: "lien-he", label: "Liên Hệ" },
    { id: "faq", label: "FAQ" },
  ] : slug === "k-home-avenue-nhon-trach" ? [
    { id: "tong-quan", label: "Tổng Quan" },
    { id: "mat-bang", label: "Mặt Bằng" },
    { id: "tien-ich", label: "Tiện Ích" },
    { id: "nha-mau", label: "Nhà Mẫu" },
    { id: "tien-do-trien-khai", label: "Tiến Độ" },
    { id: "phap-ly", label: "Pháp Lý" },
    { id: "yeu-to-singapore", label: "Tiềm Năng" },
    { id: "chung-chi-edge", label: "EDGE" },
    { id: "mua-vs-thue", label: "Mua vs Thuê" },
    { id: "giai-thuong", label: "Giải Thưởng" },
    { id: "doi-tac", label: "Đối Tác" },
    { id: "chu-dau-tu", label: "Chủ Đầu Tư" },
    { id: "avenue-highlights", label: "Highlights" },
    { id: "dieu-kien-mua", label: "Điều Kiện" },
    { id: "chinh-sach-thanh-toan", label: "Thanh Toán" },
    { id: "tinh-tra-gop", label: "Trả Góp" },
    { id: "lien-he", label: "Liên Hệ" },
    { id: "faq", label: "FAQ" },
  ] : [];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      // Lock scroll tracking for 1.2 seconds to prevent conflicting updates
      if (scrollLockRef.current) clearTimeout(scrollLockRef.current);
      
      const y = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(id);
      
      // Re-enable scroll tracking after smooth scroll completes
      scrollLockRef.current = setTimeout(() => {
        scrollLockRef.current = null;
      }, 1200);
    }
  };


  // Track active section on scroll - SIMPLE: section whose top is closest to viewport top wins
  useEffect(() => {
    if (!["k-home-cityview-ho-nai", "k-home-midtown-trang-bom", "k-home-avenue-nhon-trach"].includes(slug)) return;
    
    const sectionIds = slug === "k-home-cityview-ho-nai" 
      ? ["tong-quan", "vi-tri", "gia-ban", "mat-bang", "tien-ich", "tiem-nang", "tien-do-trien-khai", "video-tien-do", "phap-ly", "yeu-to-singapore", "chung-chi-edge", "mua-vs-thue", "giai-thuong", "chu-dau-tu", "dieu-kien-mua", "chinh-sach-thanh-toan", "tinh-tra-gop", "lien-he", "faq"]
      : slug === "k-home-midtown-trang-bom"
      ? ["tong-quan", "mat-bang", "nha-mau", "tien-do-trien-khai", "tien-ich", "tiem-nang", "phap-ly", "yeu-to-singapore", "chung-chi-edge", "mua-vs-thue", "giai-thuong", "midtown-highlights", "midtown-edge", "doi-tac", "chu-dau-tu", "dieu-kien-mua", "chinh-sach-thanh-toan", "tinh-tra-gop", "lien-he", "faq"]
      : ["tong-quan", "mat-bang", "nha-mau", "tiem-nang", "tien-do-trien-khai", "tien-ich", "phap-ly", "yeu-to-singapore", "chung-chi-edge", "mua-vs-thue", "giai-thuong", "avenue-highlights", "doi-tac", "chu-dau-tu", "dieu-kien-mua", "chinh-sach-thanh-toan", "tinh-tra-gop", "lien-he", "faq"];
    
    const trackSection = () => {
      // Skip if scroll lock is active (user just clicked a dot)
      if (scrollLockRef.current !== null) return;
      
      let closestSection = sectionIds[0];
      let closestDistance = Infinity;
      
      // Find section whose top is closest to viewport top
      for (const sectionId of sectionIds) {
        const element = document.getElementById(sectionId);
        if (!element) continue;
        
        const rect = element.getBoundingClientRect();
        
        // Calculate distance from viewport top
        // Prefer sections that are in or near the viewport
        let distance: number;
        
        if (rect.top >= 0 && rect.top <= window.innerHeight) {
          // Section is in viewport - distance is how far from top
          distance = rect.top;
        } else if (rect.top < 0) {
          // Section is above viewport - distance is how far below top it disappeared
          // Use large penalty so it's only chosen if nothing else is visible
          distance = 10000 + Math.abs(rect.top);
        } else {
          // Section is below viewport
          distance = 10000 + rect.top;
        }
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = sectionId;
        }
      }
      
      setActiveSection(closestSection);
    };
    
    window.addEventListener("scroll", trackSection);
    trackSection();
    
    return () => {
      window.removeEventListener("scroll", trackSection);
      if (scrollLockRef.current) clearTimeout(scrollLockRef.current);
    };
  }, [slug]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Helper: Cloudinary URL cho slide CityView
  const slideImg = (num: number, mode: "thumbnail" | "full" = "full") => {
    const transform = mode === "thumbnail"
      ? "w_900,q_auto:good,f_auto"
      : "w_1600,q_auto:best,f_auto";
    return `https://res.cloudinary.com/dthv0nsq/image/upload/${transform}/slide-k-home-cityview/slide-${num}`;
  };

  // Helper: Cloudinary URL cho slide Midtown (dùng public_id slug)
  const slideMidtownImg = (publicId: string, mode: "thumbnail" | "full" = "full") => {
    const transform = mode === "thumbnail"
      ? "w_900,q_auto:good,f_auto"
      : "w_1600,q_auto:best,f_auto";
    return `https://res.cloudinary.com/dthv0nsq/image/upload/${transform}/${publicId}`;
  };

  // Helper: Cloudinary URL cho slide Avenue — dùng chung hàm, tách tên để rõ ràng
  const slideAvenueImg = (publicId: string, mode: "thumbnail" | "full" = "full") => {
    const transform = mode === "thumbnail"
      ? "w_900,q_auto:good,f_auto"
      : "w_1600,q_auto:best,f_auto";
    return `https://res.cloudinary.com/dthv0nsq/image/upload/${transform}/${publicId}`;
  };

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Slide lightbox state — dùng riêng cho ảnh slide Cloudinary
  const [slideLightboxOpen, setSlideLightboxOpen] = useState(false);
  const [slideLightboxImages, setSlideLightboxImages] = useState<string[]>([]);
  const [slideLightboxAlts, setSlideLightboxAlts] = useState<string[]>([]);
  const [slideLightboxIndex, setSlideLightboxIndex] = useState(0);

  const openSlide = (nums: number[], startIdx = 0, alts?: string[]) => {
    setSlideLightboxImages(nums.map(n => slideImg(n)));
    setSlideLightboxAlts(alts || nums.map(n => `K-Home CityView – slide ${n}`));
    setSlideLightboxIndex(startIdx);
    setSlideLightboxOpen(true);
  };

  // Midtown slide lightbox — dùng public_id slug thay vì số
  const openMidtownSlide = (ids: string[], startIdx = 0, alts?: string[]) => {
    setSlideLightboxImages(ids.map(id => slideMidtownImg(id)));
    setSlideLightboxAlts(alts || ids.map(id => `K-Home Midtown – ${id.split("/").pop()}`));
    setSlideLightboxIndex(startIdx);
    setSlideLightboxOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 text-sm">Đang tải thông tin chi tiết dự án...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Không tìm thấy dự án</h2>
        <p className="text-slate-500 text-sm">Dự án bạn tìm kiếm không tồn tại hoặc đã được gỡ bỏ khỏi hệ thống.</p>
        <button
          onClick={() => onNavigate("/san-pham")}
          className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium text-xs tracking-wider uppercase transition-colors cursor-pointer"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <>
      {/* ── Mobile: Sticky Top Navigation — chỉ CityView ── */}
      {/* REMOVED - will add better design later */}

      {/* ── Mobile: Side Dot Navigation — Option 3 ── */}
      {isMobile && ["k-home-cityview-ho-nai", "k-home-midtown-trang-bom", "k-home-avenue-nhon-trach"].includes(slug) && (
        <div style={{
          position: 'fixed',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
        }}
        >
          {/* Top line */}
          <div style={{
            width: '2px',
            height: '16px',
            background: 'linear-gradient(to bottom, transparent, #cbd5e1)',
            marginBottom: '8px'
          }} />

          {/* Dots container */}
          {navSections.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              title={s.label}
              style={{
                width: activeSection === s.id ? '20px' : '12px',
                height: activeSection === s.id ? '20px' : '12px',
                borderRadius: '50%',
                border: activeSection === s.id ? '2px solid #dc2626' : '2px solid #cbd5e1',
                backgroundColor: activeSection === s.id ? '#fca5a5' : '#f1f5f9',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '8px',
                fontWeight: 'bold',
                color: activeSection === s.id ? '#dc2626' : '#94a3b8'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fed7d7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = activeSection === s.id ? '#fca5a5' : '#f1f5f9';
              }}
            >
              {idx + 1}
            </button>
          ))}

          {/* Bottom line */}
          <div style={{
            width: '2px',
            height: '16px',
            background: 'linear-gradient(to top, transparent, #cbd5e1)',
            marginTop: '8px'
          }} />
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* ── Desktop: Side Navigation (Hidden on mobile, lg:flex) ── */}
        {["k-home-cityview-ho-nai", "k-home-midtown-trang-bom", "k-home-avenue-nhon-trach"].includes(slug) && (
          <div className="fixed left-4 xl:left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center">
            {/* Thanh dọc trên */}
            <div className="w-px h-8 bg-gradient-to-b from-transparent to-slate-300" />

            {/* Dots container */}
            <div className="relative flex flex-col items-center gap-0">
              {/* Thanh dọc nền xuyên suốt */}
              <div className="absolute left-1/2 -translate-x-1/2 top-3 bottom-3 w-px bg-slate-200" />

              {navSections.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  title={s.label}
                  className="group relative flex items-center justify-center py-1.5 cursor-pointer z-10"
                >
                  {/* Dot */}
                  <span className={`block rounded-full border-2 transition-all duration-200 ${
                    activeSection === s.id
                      ? "w-3.5 h-3.5 bg-amber-500 border-amber-500 shadow-md shadow-amber-300"
                      : idx === navSections.length - 1
                      ? "w-2.5 h-2.5 bg-white border-amber-400 group-hover:border-amber-500 group-hover:bg-amber-100"
                      : "w-2.5 h-2.5 bg-white border-slate-300 group-hover:border-amber-400 group-hover:bg-amber-50"
                  }`} />

                  {/* Tooltip label */}
                  <span className={`absolute left-5 whitespace-nowrap text-[11px] font-semibold px-2.5 py-1 rounded-lg pointer-events-none shadow-lg opacity-0 group-hover:opacity-100 transition-opacity ${
                    idx === navSections.length - 1
                      ? "bg-amber-500 text-white"
                      : "bg-slate-800 text-white"
                  }`}>
                    {s.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Thanh dọc dưới */}
            <div className="w-px h-8 bg-gradient-to-b from-slate-300 to-transparent" />
          </div>
        )}
      
      {/* Back navigation button */}
      <div id="tong-quan">
      <button
        onClick={() => onNavigate("/san-pham")}
        className="inline-flex items-center gap-2 text-slate-600 hover:text-amber-600 text-sm font-medium transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Quay lại rổ hàng dự án
      </button>
      </div>

      {/* Title & Location Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-slate-100 pb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-amber-200">
              {project.type}
            </span>
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              {project.status}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-semibold text-slate-900 tracking-tight">
            {project.title}
          </h1>
          <p className="text-slate-500 text-sm flex items-center gap-1.5 font-light">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0" /> {project.location}
          </p>
          {/* Freshness badge — SEO signal + user trust */}
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400" />
            Cập nhật: Tháng 8/2026
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center justify-between gap-10 w-full lg:w-auto">
          <div className="space-y-0.5">
            <span className="text-xs text-slate-400 block font-medium">Bảng giá rổ hàng:</span>
            <span className="text-2xl font-bold text-amber-600 font-tech">{project.price}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Diện tích căn:</span>
            <span className="text-sm font-semibold text-slate-800 block mt-1">{project.area}</span>
          </div>
        </div>
      </div>

      {/* Gallery Image Grid with Lightbox feature */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            Bộ Sưu Tập Hình Ảnh
            <span className="text-xs font-normal text-slate-400">(Click để mở rộng xem chi tiết)</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => openLightbox(0)}
            className="md:col-span-2 relative h-96 md:h-[480px] rounded-2xl overflow-hidden shadow-sm group cursor-pointer border border-slate-100"
          >
            <img
              src={imgUrl(project.image, "full")}
              alt={project.galleryAlts?.[0] ?? `${project.title} - Nhà ở xã hội Hố Nai Biên Hòa Đồng Nai Kim Oanh Land`}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="bg-white/90 backdrop-blur-sm text-slate-800 p-3 rounded-full shadow-lg flex items-center gap-1.5 text-xs font-semibold">
                <Eye className="w-4 h-4" /> Xem Toàn Màn Hình
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-1 gap-4 h-48 md:h-[480px]">
            {project.gallery.slice(1, 3).map((img, idx) => (
              <div
                key={idx}
                onClick={() => openLightbox(idx + 1)}
                className="relative rounded-2xl overflow-hidden shadow-sm group cursor-pointer border border-slate-100 h-full"
              >
                <img
                  src={imgUrl(img, "full")}
                  alt={project.galleryAlts?.[idx + 1] ?? `${project.title} - Căn hộ nhà ở xã hội Hố Nai Biên Hòa Đồng Nai - ảnh ${idx + 2}`}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="bg-white/90 backdrop-blur-sm text-slate-800 p-2 rounded-full shadow flex items-center justify-center">
                    <Eye className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Details Body & Side Registration Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left 2 Columns: Description & Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Tabs Selector */}
          <div className="flex border-b border-slate-100">
            {[
              { id: "overview",  label: "Tổng Quan & Mô Tả" },
              { id: "units",     label: "Bảng Giá & Loại Hình" },
              { id: "amenities", label: "Tiện Ích Đẳng Cấp" },
              { id: "map",       label: "Vị Trí Bản Đồ" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 text-sm font-semibold tracking-wide transition-all border-b-2 cursor-pointer ${
                  activeTab === tab.id
                    ? "border-amber-600 text-amber-600"
                    : "border-transparent text-slate-500 hover:text-amber-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="space-y-1">
                  <span className="text-slate-400 text-xs uppercase font-tech">Chủ đầu tư:</span>
                  <span className="block font-bold text-slate-800 text-sm">{project.developer}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 text-xs uppercase font-tech">Xếp hạng:</span>
                  <span className="block font-bold text-slate-800 text-sm flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {project.rating}/5
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 text-xs uppercase font-tech">Số tầng:</span>
                  <span className="block font-bold text-slate-800 text-sm">{project.floorCount} tầng</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 text-xs uppercase font-tech">Tiêu chuẩn:</span>
                  <span className="block font-bold text-slate-800 text-sm">Thiết kế Singapore · Xanh EDGE</span>
                </div>
              </div>

              {/* Bảng thông tin tổng quan — chỉ hiện cho CityView */}
              {slug === "k-home-cityview-ho-nai" && (
                <div className="space-y-3">
                  <h3 className="text-xl font-display font-semibold text-slate-800">Thông Tin Tổng Quan Dự Án</h3>
                  <div className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    {[
                      { label: "Tên dự án", value: "K-Home CityView Hố Nai" },
                      { label: "Tên pháp lý", value: "Dự án nhà ở xã hội tại khu đất 2,85ha, phường Hố Nai, thành phố Đồng Nai" },
                      { label: "Địa chỉ", value: "Đường Điểu Xiển, phường Hố Nai, tỉnh Đồng Nai (TP. Biên Hòa cũ)" },
                      { label: "Chủ đầu tư", value: "Công ty CP Đầu tư & Phát triển BĐS Miền Đông (thành viên Tập đoàn Kim Oanh Group)" },
                      { label: "Quy mô", value: "2,85 ha · 4 Block cao 22 tầng · 1.816 căn" },
                      { label: "Loại hình", value: "NOXH: 1.328 căn · Shophouse: 39 căn" },
                      { label: "Diện tích căn", value: "47m² (1PN+) · 62–70m² (2PN) · 84m² (3PN)" },
                      { label: "Đơn vị thiết kế", value: "Tập đoàn Surbana Jurong (Singapore)" },
                      { label: "Tiêu chuẩn", value: "Công trình xanh EDGE (IFC / World Bank Group)" },
                      { label: "Bàn giao", value: "Hoàn thiện đầy đủ nội thất thiết yếu (trừ thiết bị điện tử)" },
                      { label: "Lãi suất hỗ trợ", value: "5,4%/năm – Ngân hàng Chính sách Xã hội TP. Đồng Nai" },
                      { label: "Dự kiến bàn giao", value: "Tháng 1/2028" },
                    ].map((row, i) => (
                      <div key={i} className={`grid grid-cols-5 px-4 py-3 border-b border-slate-50 last:border-0 ${i % 2 === 0 ? "bg-slate-50/60" : "bg-white"}`}>
                        <span className="col-span-2 text-xs font-bold text-slate-500 uppercase tracking-wide self-center">{row.label}</span>
                        <span className="col-span-3 text-sm font-semibold text-slate-800 leading-snug">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-xl font-display font-semibold text-slate-800">Mô Tả Chi Tiết Dự Án</h3>
                <div className="space-y-3">
                  {renderRichText(project.longDescription)}
                </div>
              </div>

              {/* Bảng giá tóm tắt ngay trong tab Tổng Quan — tránh bỏ lỡ */}
              {project.unitTypes && project.unitTypes.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-display font-semibold text-slate-800">Bảng Giá Các Loại Căn</h3>
                    <button
                      onClick={() => setActiveTab("units")}
                      className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      Xem chi tiết →
                    </button>
                  </div>
                  <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-amber-50 border-b border-amber-100">
                          <th className="text-left px-4 py-3 text-xs font-bold text-amber-800 uppercase">Loại căn</th>
                          <th className="text-center px-4 py-3 text-xs font-bold text-amber-800 uppercase">DT xây dựng</th>
                          <th className="text-center px-4 py-3 text-xs font-bold text-amber-800 uppercase">DT sử dụng</th>
                          <th className="text-right px-4 py-3 text-xs font-bold text-amber-800 uppercase">Giá bán</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 bg-white">
                        {project.unitTypes.map((unit, idx) => (
                          <tr
                            key={idx}
                            onClick={() => onNavigate(`/${project.slug}/${unit.slug}`)}
                            className="hover:bg-amber-50/40 transition-colors cursor-pointer group"
                          >
                            <td className="px-4 py-3 font-semibold text-slate-800 group-hover:text-amber-700 text-sm">
                              {unit.name}
                            </td>
                            <td className="px-4 py-3 text-center text-slate-600 text-sm">{unit.constructionArea}</td>
                            <td className="px-4 py-3 text-center text-slate-600 text-sm">{unit.usableArea}</td>
                            <td className="px-4 py-3 text-right font-bold text-amber-600 text-sm">{unit.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-slate-400">* Click vào từng loại căn để xem hình ảnh và mô tả chi tiết.</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Unit Types */}
          {activeTab === "units" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-display font-semibold text-slate-800 mb-1">Bảng Giá & Loại Hình Căn Hộ</h3>
                <p className="text-slate-500 text-sm">Cập nhật bảng giá dự kiến từ chủ đầu tư Kim Oanh Group. Giá chưa bao gồm VAT 5% và phí bảo trì 2%.</p>
              </div>

              {/* Bảng giá chi tiết NOXH — chỉ hiện cho CityView */}
              {slug === "k-home-cityview-ho-nai" && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
                    <div className="bg-amber-500 px-5 py-3">
                      <span className="text-white text-xs font-bold uppercase tracking-widest">Giá tòa NOXH (T1 – T2 – T3) — Nhà ở xã hội</span>
                    </div>
                    {[
                      { type: "Căn 1 Phòng Ngủ + A", area: "47,3m²", price: "950 triệu – 1,08 tỷ/căn", note: "Công năng: 1PN lớn + 1PN nhỏ, 1WC, ban công, phòng khách, bàn ăn" },
                      { type: "Căn 1 Phòng Ngủ + B", area: "62,4m²", price: "1,20 tỷ – 1,40 tỷ/căn", note: "Công năng: 1PN master, 2WC, 2 ban công, phòng khách, bếp, bàn ăn" },
                      { type: "Căn 2 Phòng Ngủ", area: "70,4m²", price: "1,50 tỷ – 1,70 tỷ/căn", note: "Công năng: 2PN, 2 ban công, 2WC, phòng khách, bếp, bàn ăn" },
                      { type: "Căn hộ 3 phòng ngủ", area: "84,4m²", price: "1,80 tỷ – 2,00 tỷ/căn", note: "Công năng: 3PN (góc), 2 ban công, 2WC, phòng khách, bếp, bàn ăn" },
                    ].map((row, i) => (
                      <div key={i} className={`px-5 py-3.5 border-b border-amber-50 last:border-0 ${i % 2 === 0 ? "bg-amber-50/40" : "bg-white"}`}>
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div>
                            <span className="text-sm font-bold text-slate-800">{row.type}</span>
                            <span className="ml-2 text-xs text-slate-500">{row.area}</span>
                          </div>
                          <span className="text-sm font-bold text-amber-600">{row.price}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{row.note}</p>
                      </div>
                    ))}
                    <div className="bg-amber-50 px-5 py-3 border-t border-amber-100">
                      <p className="text-xs text-slate-600">⚠️ Giá NOXH chưa gồm VAT 5% và phí bảo trì 2%. Bàn giao đầy đủ nội thất thiết yếu (trừ thiết bị điện tử). Liên hệ <strong>0937.587.438</strong> để được tư vấn và hỗ trợ hồ sơ miễn phí.</p>
                    </div>
                  </div>
                </div>
              )}

              {project.unitTypes && project.unitTypes.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-amber-50 border-b border-amber-100">
                        <th className="text-left px-5 py-3.5 text-xs font-bold text-amber-800 uppercase tracking-wider">Loại căn hộ</th>
                        <th className="text-center px-5 py-3.5 text-xs font-bold text-amber-800 uppercase tracking-wider">DT xây dựng</th>
                        <th className="text-center px-5 py-3.5 text-xs font-bold text-amber-800 uppercase tracking-wider">DT sử dụng</th>
                        <th className="text-right px-5 py-3.5 text-xs font-bold text-amber-800 uppercase tracking-wider">Giá bán</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {project.unitTypes.map((unit, idx) => (
                        <tr
                          key={idx}
                          onClick={() => onNavigate(`/${project.slug}/${unit.slug}`)}
                          className="hover:bg-amber-50/40 transition-colors cursor-pointer group"
                        >
                          <td className="px-5 py-4 font-semibold text-slate-800 group-hover:text-amber-700 flex items-center gap-2">
                            {unit.name}
                            <span className="text-[10px] text-amber-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                              Xem chi tiết →
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center text-slate-600">{unit.constructionArea}</td>
                          <td className="px-5 py-4 text-center text-slate-600">{unit.usableArea}</td>
                          <td className="px-5 py-4 text-right font-bold text-amber-600">{unit.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <LayoutGrid className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">Bảng giá sẽ được cập nhật sớm.</p>
                </div>
              )}

              <p className="text-xs text-slate-400 italic">
                * Giá trên là giá tham khảo đợt 1, chưa bao gồm phí quản lý, VAT và các khoản phí khác. Liên hệ chuyên viên để nhận báo giá chính xác nhất.
              </p>
            </div>
          )}

          {/* Tab 3: Amenities */}
          {activeTab === "amenities" && (
            <div className="space-y-6">
              <h3 className="text-xl font-display font-semibold text-slate-800">Chuỗi Đặc Quyền Sống Thượng Lưu</h3>
              <p className="text-slate-500 text-sm">
                Chúng tôi không chỉ xây nhà, chúng tôi thiết lập phong cách sống. Mỗi bước chân của chủ nhân tại đây đều chạm vào các tiện ích cao cấp tiêu chuẩn khách sạn quốc tế.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-amber-50/40 rounded-xl border border-slate-100 hover:border-amber-500/20 transition-all">
                    <CheckCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    <span className="text-slate-700 text-sm font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Location Map */}
          {activeTab === "map" && (
            <div className="space-y-6">
              <h3 className="text-xl font-display font-semibold text-slate-800">Vị Trí Dự Án</h3>
              <p className="text-slate-500 text-sm">
                {project.location}
              </p>
              <div className="w-full h-96 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden relative shadow-inner">
                <iframe
                  src={project.mapEmbedUrl || `https://www.google.com/maps/embed/v1/place?key=AIzaSyD&q=${encodeURIComponent(project.location + ", Vietnam")}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Bản đồ ${project.title}`}
                ></iframe>
              </div>
            </div>
          )}

        </div>

        {/* Right 1 Column: Sticky Registration Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm space-y-6 sticky top-24">
            <div className="text-center pb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-1">Tư vấn chuyên sâu</span>
              <h3 className="text-xl font-display font-semibold text-slate-800">Đăng Ký Nhận Báo Giá</h3>
              <p className="text-slate-400 text-xs mt-1">Hỗ trợ nhận thông tin rổ hàng ngoại giao chiết khấu tốt nhất</p>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 text-base">Gửi Yêu Cầu Thành Công!</h3>
                  <p className="text-slate-500 text-xs px-2">
                    Cảm ơn bạn đã đăng ký. Chuyên viên kinh doanh cao cấp của K-Home sẽ liên hệ tư vấn trong vòng 15 phút.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Gửi yêu cầu mới
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {formError && (
                  <div className="p-3 bg-red-50 border-l-2 border-red-500 text-red-600 text-xs font-medium rounded">
                    {formError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="sidebar-name" className="text-xs font-semibold text-slate-600 block">Họ và tên của bạn *</label>
                  <input
                    id="sidebar-name"
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn Hải"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-lg text-sm outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="sidebar-email" className="text-xs font-semibold text-slate-600 block">Địa chỉ Email <span className="text-slate-400 font-normal">(không bắt buộc)</span></label>
                  <input
                    id="sidebar-email"
                    type="email"
                    placeholder="VD: hainguyen@gmail.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-lg text-sm outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="sidebar-phone" className="text-xs font-semibold text-slate-600 block">Số điện thoại liên lạc *</label>
                  <input
                    id="sidebar-phone"
                    type="tel"
                    required
                    placeholder="VD: 0937587438"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-lg text-sm outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="sidebar-message" className="text-xs font-semibold text-slate-600 block">Lời nhắn yêu cầu tư vấn</label>
                  <textarea
                    id="sidebar-message"
                    rows={3}
                    placeholder={`Tôi muốn đặt lịch xem thực tế dự án ${project.title}.`}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-lg text-sm outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold tracking-wide shadow-md shadow-amber-600/10 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Đăng Ký Tư Vấn Miễn Phí
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-xs">
              <Phone className="w-3.5 h-3.5" /> Hotline: <a href="tel:0937587438" className="text-slate-600 font-bold hover:text-amber-600">0937 587 438</a>
            </div>
          </div>
        </div>

      </div>

      {/* ── Vị trí dự án ── */}
      {seo?.locationImages && seo.locationImages.length > 0 && (
        <section className="space-y-5">
          <h2 className="text-2xl font-display font-bold text-slate-800">Vị Trí Dự Án</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            {slug === "k-home-cityview-ho-nai"
              ? "Nằm tại đường Điểu Xiển, phường Hố Nai, TP. Biên Hòa – một trong những khu vực trung tâm có tốc độ phát triển hạ tầng mạnh nhất tỉnh Đồng Nai. Từ K-Home CityView, cư dân dễ dàng kết nối mọi điểm đến quan trọng: chỉ 5 phút đến Lotte Mart, TTHC Biên Hòa và Công viên 30-4; 10 phút đến GO! Tân Hiệp và Trường Đại học Đồng Nai; 20 phút đến AEON Mall và TTHC Đồng Nai; 30 phút đến Sân bay Quốc tế Long Thành. Liền kề các khu công nghiệp lớn như Amata, Long Bình, Biên Hòa 2 – nơi tập trung hàng trăm nghìn công nhân và kỹ sư đang cần chỗ ở ổn định. Đặc biệt, Đồng Nai đang trong quá trình phát triển thành Thành phố trực thuộc Trung ương với Sân bay Quốc tế Long Thành – một trong những cảng hàng không hàng đầu thế giới – đang được khẩn trương xây dựng, tạo đà tăng trưởng mạnh cho toàn khu vực."
              : project.location}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seo.locationImages.map((img, i) => (
              <button
                key={i}
                onClick={() => {
                  const urls = seo.locationImages!.map(x => imgUrl(x.src, "full"));
                  const alts = seo.locationImages!.map(x => x.alt);
                  setSlideLightboxImages(urls);
                  setSlideLightboxAlts(alts);
                  setSlideLightboxIndex(i);
                  setSlideLightboxOpen(true);
                }}
                className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm cursor-zoom-in relative group w-full text-left"
              >
                <img
                  src={imgUrl(img.src, "full")}
                  alt={img.alt}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  width="800"
                  height="224"
                  style={{ backgroundColor: "#e2e8f0" }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end justify-end p-2 opacity-0 group-hover:opacity-100">
                  <span className="bg-white/90 text-slate-800 px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"><Eye className="w-3 h-3" /> Phóng to</span>
                </div>
                {img.caption && (
                  <p className="text-xs text-slate-500 text-center py-2 bg-slate-50 border-t border-slate-100">{img.caption}</p>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── Khoảng cách kết nối — chỉ CityView ── */}
      {slug === "k-home-cityview-ho-nai" && (
        <section id="vi-tri" className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-800">Vị Trí – Vô Vàn Trải Nghiệm</h2>
              <p className="text-xs text-slate-500 mt-0.5">Chỉ vài phút từ K-Home CityView đến mọi điểm đến quan trọng</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { time: "5 phút", places: "Lotte Mart · TTHC Biên Hòa · Công viên 30-4", color: "bg-green-500" },
              { time: "10 phút", places: "GO! Tân Hiệp · Trường ĐH Đồng Nai · KCN Hố Nai", color: "bg-amber-500" },
              { time: "20 phút", places: "AEON Mall · TTHC Đồng Nai · KCN Amata", color: "bg-orange-500" },
              { time: "30 phút", places: "Sân bay Quốc tế Long Thành", color: "bg-red-500" },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow space-y-2">
                <span className={`inline-block ${item.color} text-white text-xs font-bold px-3 py-1 rounded-full`}>{item.time}</span>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">{item.places}</p>
              </div>
            ))}
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
            <p className="text-sm text-slate-600 leading-relaxed">Bên cạnh kết nối tiện lợi đến các trung tâm thương mại và dịch vụ, K-Home CityView còn nằm liền kề các khu công nghiệp lớn nhất Đồng Nai: <strong className="text-slate-800">KCN Amata, Long Bình, Biên Hòa 2, Hố Nai</strong> – nơi hàng trăm nghìn công nhân và kỹ sư đang làm việc và có nhu cầu an cư ngay tại chỗ. Đây chính là lợi thế vị trí độc đáo giúp K-Home CityView luôn duy trì nhu cầu cao từ người mua ở thực lẫn tiềm năng cho thuê.</p>
          </div>
        </section>
      )}

      {/* ── Hướng dẫn đường đi đến K-Home CityView — Local SEO ── */}
      {slug === "k-home-cityview-ho-nai" && (
        <section id="duong-di" className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-800">Hướng Dẫn Đường Đi Đến K-Home CityView</h2>
              <p className="text-xs text-slate-500 mt-0.5">Địa chỉ: Đường Điểu Xiển, Phường Hố Nai, TP. Biên Hòa, Đồng Nai</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                from: "Từ Trung tâm Biên Hòa",
                time: "~10 phút",
                route: "Theo đường Nguyễn Ái Quốc → rẽ vào đường Hùng Vương → rẽ phải vào đường Điểu Xiển, dự án nằm bên tay phải (~3km).",
                icon: "🏙️",
              },
              {
                from: "Từ TP. Hồ Chí Minh",
                time: "~45–60 phút",
                route: "Theo cao tốc TP.HCM – Long Thành → ra Quốc lộ 1A hướng Biên Hòa → vào đường Điểu Xiển (~40km qua cao tốc).",
                icon: "🛣️",
              },
              {
                from: "Từ KCN Amata Biên Hòa",
                time: "~10–15 phút",
                route: "Theo đường nội bộ KCN Amata → ra Quốc lộ 1A → rẽ vào đường Điểu Xiển (~5–7km).",
                icon: "🏭",
              },
              {
                from: "Từ Sân bay Long Thành",
                time: "~30 phút",
                route: "Theo đường 25C (Tỉnh lộ) → vào Quốc lộ 51 → kết nối Quốc lộ 1A → đường Điểu Xiển (~30km).",
                icon: "✈️",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{item.from}</p>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{item.time}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{item.route}</p>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
            <Phone className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700">
              Cần hướng dẫn đường đi thực tế hoặc đặt lịch tham quan dự án? Gọi ngay{" "}
              <a href="tel:0937587438" className="font-bold text-amber-600 hover:underline">0937 587 438</a>
              {" "}— đội ngũ sẽ hướng dẫn và đón tiếp tận nơi.
            </p>
          </div>
        </section>
      )}

      {/* ── Giá Bán & Thanh Toán — chỉ CityView ── */}
      {slug === "k-home-cityview-ho-nai" && (
        <section id="gia-ban" className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-800">Giá Bán & Chính Sách Thanh Toán</h2>
              <p className="text-xs text-slate-500 mt-0.5">Bảng giá dự kiến nhà ở xã hội K-Home CityView Hố Nai – cập nhật mới nhất từ chủ đầu tư Kim Oanh Land</p>
            </div>
          </div>

          {/* Intro text SEO */}
          <p className="text-slate-600 text-sm leading-relaxed">
            Với chính sách giá nhà ở xã hội được Nhà nước phê duyệt và kiểm soát chặt chẽ, <strong className="text-slate-800">K-Home CityView Hố Nai</strong> mang đến mức giá thấp hơn đáng kể so với căn hộ thương mại cùng vị trí tại TP. Biên Hòa. Cư dân còn được hỗ trợ vay vốn ưu đãi từ <strong className="text-slate-800">Ngân hàng Chính sách Xã hội TP. Đồng Nai</strong> với lãi suất chỉ <strong className="text-slate-800">5,4%/năm</strong> — thấp hơn 2–3 lần so với lãi suất ngân hàng thương mại thông thường. Đây là cơ hội hiếm có để người lao động tại Đồng Nai sở hữu căn hộ chất lượng cao với chi phí hàng tháng tương đương hoặc thấp hơn tiền thuê trọ.
          </p>

          {/* 4 loại căn */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-700">Bảng giá các loại căn hộ NOXH K-Home CityView</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  type: "Căn 1 Phòng Ngủ + A",
                  area: "47,3m²",
                  price: "950 triệu – 1,08 tỷ/căn",
                  note: "Phù hợp đơn thân, cặp đôi trẻ mới kết hôn",
                  features: ["1 phòng ngủ lớn + 1 phòng ngủ nhỏ", "1 WC · 1 ban công · Phòng khách + bàn ăn"],
                  tag: "Giá tốt nhất",
                  tagColor: "bg-green-500",
                },
                {
                  type: "Căn 1 Phòng Ngủ + B",
                  area: "62,4m²",
                  price: "1,20 tỷ – 1,40 tỷ/căn",
                  note: "Cặp đôi cần không gian thoải mái, 2 khu vệ sinh riêng",
                  features: ["1 phòng ngủ master rộng", "2 WC · 2 ban công · Bếp + phòng khách"],
                  tag: "Phổ biến",
                  tagColor: "bg-amber-500",
                },
                {
                  type: "Căn 2 Phòng Ngủ",
                  area: "70,4m²",
                  price: "1,50 tỷ – 1,70 tỷ/căn",
                  note: "Lý tưởng cho gia đình 3–4 người, có phòng riêng cho con",
                  features: ["2 phòng ngủ đầy đủ cửa sổ đón sáng", "2 WC · 2 ban công · Bếp + bàn ăn"],
                  tag: "Gia đình",
                  tagColor: "bg-blue-500",
                },
                {
                  type: "Căn hộ 3 phòng ngủ",
                  area: "84,4m²",
                  price: "1,80 tỷ – 2,00 tỷ/căn",
                  note: "Gia đình nhiều thế hệ, diện tích lớn nhất dự án",
                  features: ["3 phòng ngủ (1 master + 2 phụ)", "2 WC · 2 ban công · Phòng khách rộng"],
                  tag: "Rộng nhất",
                  tagColor: "bg-purple-500",
                },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-amber-100 rounded-2xl p-5 hover:border-amber-300 hover:shadow-md transition-all space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${item.tagColor}`}>{item.tag}</span>
                      </div>
                      <span className="block font-bold text-slate-800 text-sm">{item.type}</span>
                      <span className="block text-xs text-slate-400 mt-0.5">Diện tích xây dựng: {item.area}</span>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-amber-600 text-right">{item.price}</span>
                  </div>
                  <p className="text-xs text-slate-500 italic">{item.note}</p>
                  <ul className="space-y-1">
                    {item.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-1.5 text-xs text-slate-600">
                        <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Lưu ý giá */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 space-y-3">
            <p className="text-sm font-bold text-slate-800">⚠️ Lưu ý quan trọng về giá bán:</p>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2"><span className="text-amber-500 font-bold shrink-0">•</span>Giá trên là giá <strong>dự kiến</strong> – chưa bao gồm VAT 5% và phí bảo trì 2% theo quy định nhà ở xã hội</li>
              <li className="flex items-start gap-2"><span className="text-amber-500 font-bold shrink-0">•</span>Tất cả căn hộ được bàn giao <strong>đầy đủ nội thất thiết yếu</strong>: sofa, bàn ăn, giường, tủ quần áo, bồn cầu, lavabo, gương, trần thạch cao, đèn điện, ống dẫn máy lạnh, quạt hút mùi (trừ thiết bị điện tử)</li>
              <li className="flex items-start gap-2"><span className="text-amber-500 font-bold shrink-0">•</span>Giá bán chính thức sẽ được công bố tại thời điểm mở bán. Đăng ký nhận thông báo sớm nhất ngay bên dưới</li>
            </ul>
          </div>

          {/* Hỗ trợ vay vốn */}
          <div className="bg-green-50 border border-green-100 rounded-2xl p-5 space-y-4">
            <div>
              <p className="text-sm font-bold text-slate-800 mb-0.5">Chính sách hỗ trợ vay vốn mua nhà ở xã hội K-Home CityView</p>
              <p className="text-xs text-slate-500">Người đủ điều kiện NOXH được vay ưu đãi từ Ngân hàng Chính sách Xã hội TP. Đồng Nai</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Vốn tự có tối thiểu", value: "25%", sub: "khoảng 237–500 triệu" },
                { label: "Vay tối đa", value: "75%", sub: "từ Ngân hàng Chính sách" },
                { label: "Lãi suất ưu đãi", value: "5,4%/năm", sub: "cố định theo quy định" },
                { label: "Kỳ hạn vay", value: "25 năm", sub: "trả góp ~3,5–4,5 tr/tháng" },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl p-3 text-center border border-green-100 shadow-sm">
                  <span className="block text-xl font-bold text-green-600">{s.value}</span>
                  <span className="block text-xs font-semibold text-slate-700 mt-0.5">{s.label}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">{s.sub}</span>
                </div>
              ))}
            </div>
            <div className="bg-white border border-green-100 rounded-xl p-4 space-y-1">
              <p className="text-xs font-bold text-slate-700">Điều kiện vay vốn NOXH K-Home CityView:</p>
              <ul className="space-y-1 text-xs text-slate-500">
                <li>• Chưa đứng tên sổ nhà ở tại tỉnh Đồng Nai & chưa từng mua nhà ở xã hội</li>
                <li>• Thu nhập: dưới 50 triệu/tháng (hộ gia đình) · dưới 35 triệu (đơn thân nuôi con) · dưới 25 triệu (độc thân)</li>
                <li>• Có hộ khẩu hoặc tạm trú tại tỉnh Đồng Nai từ 1 năm trở lên</li>
                <li>• Ưu tiên công nhân, người lao động tại các khu công nghiệp tỉnh Đồng Nai</li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ── Mặt bằng tầng ── */}
      {seo?.floorPlanImages && seo.floorPlanImages.length > 0 && (
        <section id="mat-bang" className="space-y-4">
          <h2 className="text-2xl font-display font-bold text-slate-800">Mặt Bằng & Layout Căn Hộ</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            {slug === "k-home-midtown-trang-bom"
              ? "K-Home Midtown có 1 block cao 15 tầng, 2 tháp A và B. Tầng 1 tập trung toàn bộ tiện ích nội khu, tầng 2 nhà xe và sinh hoạt cộng đồng, tầng 3 sân vườn, tầng 4–15 là mặt bằng căn hộ điển hình với Studio, 1PN+, và 2PN."
              : slug === "k-home-avenue-nhon-trach"
              ? "K-Home Avenue có 4 block cao 12 tầng. Tầng 1 tập trung tiện ích nội khu đầy đủ, tầng 2–3 bổ sung tiện ích, tầng 4–12 là mặt bằng căn hộ điển hình với Studio, 1PN+, 2PN-A và 2PN-B."
              : "K-Home CityView có tầng trệt & tầng 2 tập trung tiện ích \"all-in-one\" chuẩn Singapore, tầng 3 có vườn treo độc đáo, tầng 4–22 là mặt bằng căn hộ điển hình với 4 loại căn: 1PN+ A (47,3m²), 1PN+ B (62,4m²), 2 phòng ngủ (70,4m²) và 3 phòng ngủ (84,4m²). Khuôn viên được chia rõ ràng: khu căn hộ trung tâm, khu tiện ích công cộng (hồ bơi, công viên, sân thể thao, khu vui chơi trẻ em) xen kẽ giữa các tòa, tầng trệt thương mại – shophouse phục vụ mua sắm và dịch vụ hàng ngày."
            }
          </p>

          {/* Tab buttons */}
          <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-1">
            {seo.floorPlanImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveFloorTab(i)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  activeFloorTab === i
                    ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-amber-400 hover:text-amber-600"
                }`}
              >
                {img.label}
              </button>
            ))}
          </div>

          {/* Active image — fixed height container để tránh layout shift */}
          <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-200" style={{ height: "400px" }}>
            <img
              key={activeFloorTab}
              src={imgUrl(seo.floorPlanImages[activeFloorTab].src, "full")}
              alt={seo.floorPlanImages[activeFloorTab].alt}
              className="w-full h-full object-contain"
              loading="eager"
              width="800"
              height="400"
              decoding="async"
              style={{ backgroundColor: "#e2e8f0", display: "block", cursor: "zoom-in" }}
              onClick={() => {
                const urls = seo.floorPlanImages!.map(img => imgUrl(img.src, "full"));
                const alts = seo.floorPlanImages!.map(img => img.alt);
                setSlideLightboxImages(urls);
                setSlideLightboxAlts(alts);
                setSlideLightboxIndex(activeFloorTab);
                setSlideLightboxOpen(true);
              }}
            />
          </div>
          <p className="text-xs text-slate-400">* Click vào ảnh để xem toàn màn hình và phóng to chi tiết.</p>
        </section>
      )}

      {/* ── Tiện ích chi tiết ── */}
      {seo?.amenityImages && seo.amenityImages.length > 0 && (
        <section id="tien-ich" className="space-y-5">
          <h2 className="text-2xl font-display font-bold text-slate-800">Tiện Ích Nội Khu</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            {slug === "k-home-midtown-trang-bom"
              ? "Hệ thống tiện ích K-Home Midtown được quy hoạch trên quỹ đất 13,97 ha, đáp ứng nhu cầu sinh hoạt hàng ngày của cư dân ngay trong khuôn viên dự án."
              : slug === "k-home-avenue-nhon-trach"
              ? "Hệ tiện ích đa lớp K-Home Avenue – từ hồ bơi, sân chơi, minimart, BBQ bên trong đến TTTM, bệnh viện, trường liên cấp, sân bay Long Thành ngay bên ngoài."
              : "Được xây dựng theo mô hình đô thị khép kín chuẩn Singapore, K-Home CityView tích hợp hệ tiện ích đa tầng ngay tại khối đế và tầng trệt. Tầng trệt bố trí khoa học với hồ bơi người lớn – trẻ em trung tâm, sân chơi thiếu nhi an toàn, khu thể dục – BBQ, vườn cộng đồng xen kẽ mảng xanh. Khối đế thương mại tích hợp shophouse, café, minimart, dịch vụ thiết yếu ngay dưới chân nhà. Tầng 3 có vườn treo độc đáo. Đặc biệt, trong khuôn viên còn có trường học nội khu phục vụ con em cư dân, trạm sạc ô tô và xe máy điện, nhà sinh hoạt cộng đồng đa năng – tất cả kết nối trong một tổng thể khép kín, giúp cư dân tiết kiệm thời gian di chuyển và tận hưởng cuộc sống xanh ngay tại nhà."
            }
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {seo.amenityImages.map((img, i) => (
              <button
                key={i}
                onClick={() => {
                  const urls = seo.amenityImages!.map(x => imgUrl(x.src, "full"));
                  const alts = seo.amenityImages!.map(x => x.alt);
                  setSlideLightboxImages(urls);
                  setSlideLightboxAlts(alts);
                  setSlideLightboxIndex(i);
                  setSlideLightboxOpen(true);
                }}
                className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm cursor-zoom-in relative group w-full text-left"
              >
                <img
                  src={imgUrl(img.src, "thumbnail")}
                  alt={img.alt}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  width="400"
                  height="192"
                  style={{ backgroundColor: "#e2e8f0" }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end justify-end p-2 opacity-0 group-hover:opacity-100">
                  <span className="bg-white/90 text-slate-800 px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"><Eye className="w-3 h-3" /> Phóng to</span>
                </div>
                {img.caption && (
                  <p className="text-xs text-slate-600 font-medium text-center py-2 bg-slate-50 border-t border-slate-100">{img.caption}</p>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── Nhà mẫu ── */}
      {seo?.sampleUnitImages && seo.sampleUnitImages.length > 0 && (
        <section id="nha-mau" className="space-y-5">
          <h2 className="text-2xl font-display font-bold text-slate-800">
            Nhà Mẫu Căn Hộ {slug === "k-home-midtown-trang-bom" ? "K-Home Midtown" : slug === "k-home-avenue-nhon-trach" ? "K-Home Avenue" : "K-Home CityView"}
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            {slug === "k-home-midtown-trang-bom"
              ? "Căn hộ K-Home Midtown bàn giao hoàn thiện full nội thất theo tiêu chuẩn dự án, bao gồm tủ bếp, sofa, bàn ăn, giường, tủ quần áo, chăn ga gối — chỉ trừ các thiết bị điện tử."
              : slug === "k-home-avenue-nhon-trach"
              ? "Căn hộ K-Home Avenue bàn giao hoàn thiện nội thất cơ bản theo tiêu chuẩn dự án, bao gồm tủ bếp, sofa, giường, tủ quần áo, sàn gỗ — chỉ trừ các thiết bị điện tử."
              : "Khi nhận bàn giao căn hộ K-Home CityView, cư dân sẽ có đầy đủ nội thất thiết yếu sẵn sàng để ở ngay: sofa, bàn trà, kệ tivi, bàn ăn – ghế ăn, giường, chăn – ga – gối – nệm, tủ quần áo, bàn học/trang điểm, vách kính WC, bồn cầu, lavabo, gương phòng tắm, trần thạch cao, đèn điện cơ bản, hệ thống ống ruột gà máy lạnh, quạt hút mùi. Chỉ trừ các thiết bị điện tử – cư dân chỉ cần mang theo đồ dùng cá nhân là có thể dọn vào ở ngay."
            }
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {seo.sampleUnitImages.map((img, i) => {
              const unit = project.unitTypes?.[i];
              return (
                <div
                  key={i}
                  onClick={() => unit && onNavigate(`/${project.slug}/${unit.slug}`)}
                  className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm group cursor-pointer hover:border-amber-400/50 hover:shadow-md transition-all"
                >
                  <img
                    src={imgUrl(img.src, "thumbnail")}
                    alt={img.alt}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    width="400"
                    height="160"
                    style={{ backgroundColor: "#e2e8f0" }}
                  />
                  <div className="px-3 py-2.5 bg-white">
                    <p className="text-xs font-bold text-slate-700 truncate">{img.label}</p>
                    {unit && <p className="text-[10px] text-amber-600 font-semibold mt-0.5">{unit.price}</p>}
                    <p className="text-[10px] text-slate-400 mt-0.5 group-hover:text-amber-500 transition-colors">Xem chi tiết →</p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-400">* Click vào từng loại căn để xem đầy đủ hình ảnh nhà mẫu, diện tích và thông tin chi tiết.</p>
        </section>
      )}

      {/* ── Tổng quan Biên Hòa / Đồng Nai ── */}
      {seo?.dongNaiOverview && (
        <section id="tiem-nang" className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-800">Tiềm Năng Phát Triển Đồng Nai – TP. Biên Hòa</h2>
              <p className="text-xs text-slate-500 mt-0.5">Khu vực đang được đầu tư hạ tầng mạnh nhất Đông Nam Bộ</p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {seo.dongNaiOverview.stats.map((s, i) => (
              <div key={i} className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center space-y-1">
                <span className="block text-2xl font-bold text-blue-700">{s.value}</span>
                <span className="block text-xs text-slate-500 font-medium">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Slide ảnh tổng quan Biên Hòa — click to zoom */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[2, 3, 4, 6, 7, 8, 9, 10].map((num, i) => (
              <button key={i} onClick={() => openSlide([2, 3, 4, 6, 7, 8, 9, 10], i, [
                  "Tổng quan về thành phố Đồng Nai – quy hoạch đô thị trực thuộc trung ương",
                  "Biên Hòa – trung tâm kinh tế công nghiệp phía Nam Đồng Nai",
                  "KCN Đồng Nai – 44 khu công nghiệp đang hoạt động 15.000 ha",
                  "Tổng quan phát triển Đồng Nai Biên Hòa – slide 6",
                  "Tổng quan phát triển Đồng Nai Biên Hòa – slide 7",
                  "Tổng quan phát triển Đồng Nai Biên Hòa – slide 8",
                  "Tổng quan phát triển Đồng Nai Biên Hòa – slide 9",
                  "Tổng quan phát triển Đồng Nai Biên Hòa – slide 10",
                ])} className="relative group rounded-2xl overflow-hidden border border-slate-200 cursor-zoom-in w-full">
                <img src={slideImg(num, "thumbnail")} alt={`Tổng quan phát triển Biên Hòa Đồng Nai - slide ${num}`} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" width="400" height="160" style={{ backgroundColor: "#e2e8f0" }} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="bg-white/90 text-slate-800 px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"><Eye className="w-3 h-3" /> Phóng to</span>
                </div>
              </button>
            ))}
          </div>

          <p className="text-slate-600 text-sm leading-relaxed">{seo.dongNaiOverview.hubText}</p>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {seo.dongNaiOverview.zones.map((z, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-600 leading-relaxed">
                <span className="block font-bold text-amber-600 mb-1">Vùng {i + 1}</span>
                {z.replace(`Vùng ${i + 1}: `, "")}
              </div>
            ))}
          </div>

          <div className="bg-slate-800 text-white rounded-2xl p-5">
            <p className="text-sm leading-relaxed text-slate-200">
              <span className="font-bold text-amber-400">Kết nối giao thông: </span>
              {seo.dongNaiOverview.transportText}
            </p>
          </div>

          {/* Slide giao thông quốc gia — click to zoom */}
          <button onClick={() => openSlide([5], 0, ["Hạ tầng giao thông quốc gia kết nối Đồng Nai Biên Hòa – cao tốc sân bay Long Thành"])} className="relative group w-full rounded-2xl overflow-hidden border border-slate-200 cursor-zoom-in block">
            <img src={slideImg(5, "thumbnail")} alt="Hạ tầng giao thông quốc gia kết nối Đồng Nai Biên Hòa cao tốc sân bay Long Thành" className="w-full object-cover max-h-80 group-hover:scale-105 transition-transform duration-300" loading="lazy" width="800" height="320" style={{ backgroundColor: "#e2e8f0" }} />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Xem toàn màn hình</span>
            </div>
          </button>
        </section>
      )}

      {/* ── Tiến độ xây dựng ── */}
      {seo?.constructionProgress && (
        <section id="tien-do-trien-khai" className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-800">Tiến Độ Triển Khai Dự Án</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {slug === "k-home-cityview-ho-nai"
                  ? "Cập nhật tiến độ xây dựng K-Home CityView Hố Nai – dự kiến bàn giao tháng 1/2028"
                  : slug === "k-home-midtown-trang-bom"
                  ? "Cập nhật tiến độ xây dựng K-Home Midtown Trảng Bom"
                  : "Cập nhật tiến độ xây dựng K-Home Avenue Nhơn Trạch"}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative pl-6 space-y-0 border-l-2 border-amber-200">
            {seo.constructionProgress.timeline.map((t, i) => (
              <div key={i} className="relative pb-6 last:pb-0">
                <div className={`absolute -left-[25px] top-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${t.done ? "bg-amber-500 border-amber-500" : "bg-white border-slate-300"}`}>
                  {t.done && <span className="w-2 h-2 bg-white rounded-full block" />}
                </div>
                <div className={`ml-4 p-3 rounded-xl border ${t.done ? "bg-amber-50 border-amber-100" : "bg-white border-slate-100"}`}>
                  <span className={`text-xs font-bold block mb-0.5 ${t.done ? "text-amber-600" : "text-slate-400"}`}>{t.date}</span>
                  <span className="text-sm font-semibold text-slate-700">{t.event}</span>
                  {t.done && <span className="ml-2 text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">✓ Hoàn thành</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Ảnh công trường — click to zoom */}
          {seo.constructionProgress.siteImages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[39, 40].map((num, i) => (
                <button key={i} onClick={() => openSlide([39, 40], i, [
                  "Tiến độ triển khai dự án K-Home CityView Hố Nai Biên Hòa 2026–2028",
                  "Công trường xây dựng nhà ở xã hội K-Home CityView Đồng Nai Kim Oanh",
                ])} className="relative group rounded-2xl overflow-hidden border border-slate-200 cursor-zoom-in w-full">
                  <img src={slideImg(num, "thumbnail")} alt={`Tiến độ triển khai K-Home CityView Hố Nai Biên Hòa - slide ${num}`} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" width="400" height="224" style={{ backgroundColor: "#e2e8f0" }} />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Xem toàn màn hình</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Video Tiến Độ Xây Dựng (K-Home CityView only) ── */}
      {slug === "k-home-cityview-ho-nai" && (
        <section id="video-tien-do" className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-lg">▶</span>
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-800">Video Tiến Độ Xây Dựng</h2>
              <p className="text-xs text-slate-500 mt-0.5">Theo dõi quá trình xây dựng K-Home CityView - Cập nhật tháng 8/2026</p>
            </div>
          </div>

          {/* Video Player */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-black group">
            <video
              controls
              preload="auto"
              className="w-full h-auto"
              poster="https://res.cloudinary.com/dthv0nsq/video/upload/so_0,w_800,c_scale/v1787103780/k-home-cityview/news/1787061348083_6670155327040053447_g6651426268921315096.jpg"
              style={{ maxHeight: "600px", objectFit: "contain", display: "block" }}
              title="Video Tiến Độ Xây Dựng K-Home CityView Hố Nai - Cập Nhật Tháng 8/2026 - Kết Cấu Chính Tiến Hành"
            >
              <source
                src="https://res.cloudinary.com/dthv0nsq/video/upload/w_800,h_600,c_fill,q_auto,f_auto/v1787103780/k-home-cityview/news/1787061348083_6670155327040053447_g6651426268921315096.mp4"
                type="video/mp4"
              />
              Trình duyệt của bạn không hỗ trợ video tag. Vui lòng tải xuống video: <a href="https://res.cloudinary.com/dthv0nsq/video/upload/w_800,h_600,c_fill,q_auto,f_auto/v1787103780/k-home-cityview/news/1787061348083_6670155327040053447_g6651426268921315096.mp4">Tiến Độ Xây Dựng K-Home CityView</a>
            </video>
          </div>

          {/* Video Description */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-slate-800">Về Video Này</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Video tiến độ xây dựng K-Home CityView ghi lại những bước tiến ngoạn mục của công trình từ giai đoạn nhồi cọc, nền móng, dựng kết cấu chính (cột dầm), đổ sàn từng tầng, cho đến bắt đầu các công tác hoàn thiện bên trong các căn hộ. 
              <br /><br />
              Dự án nhà ở xã hội Biên Hòa được phát triển bởi <strong>Kim Oanh Group</strong>, một trong những nhà phát triển bất động sản uy tín nhất tại Đông Nam Bộ. Với tiến độ xây dựng ổn định, K-Home CityView dự kiến bàn giao các căn hộ đầu tiên cho cư dân vào <strong>tháng 1/2028</strong>.
            </p>
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200">
              <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">Công trình xanh EDGE</span>
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">Thiết kế Singapore</span>
              <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-semibold">1.328 căn NOXH</span>
            </div>
          </div>
        </section>
      )}

      {/* ── Pháp lý ── */}
      {seo?.legalInfo && (
        <section id="phap-ly" className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-800">Pháp Lý Dự Án – Minh Bạch & Đầy Đủ</h2>
              <p className="text-xs text-slate-500 mt-0.5">Hồ sơ pháp lý được kiểm tra và công bố công khai</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seo.legalInfo.items.map((item, i) => (
              <div key={i} className="bg-green-50 border border-green-100 rounded-2xl p-5 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-800 text-sm mb-1">{item.title}</span>
                  <span className="block text-xs text-slate-600 leading-relaxed">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Slide pháp lý — chỉ CityView có ảnh slide */}
          {slug === "k-home-cityview-ho-nai" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[19, 20].map((num, i) => (
                <button key={i} onClick={() => openSlide([19, 20], i, [
                  "Giấy chứng nhận đăng ký đầu tư dự án NOXH K-Home CityView Kim Oanh Land",
                  "Phê duyệt quy hoạch 1/500 và pháp lý dự án K-Home CityView Biên Hòa",
                ])} className="relative group rounded-2xl overflow-hidden border border-slate-200 cursor-zoom-in w-full">
                  <img src={slideImg(num, "thumbnail")} alt={`Hồ sơ pháp lý dự án NOXH K-Home CityView Biên Hòa Kim Oanh Land - slide ${num}`} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" width="400" height="224" style={{ backgroundColor: "#e2e8f0" }} />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Xem toàn màn hình</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── 8 Yếu tố Singapore ── */}
      {seo?.singaporeFactors && (
        <section id="yeu-to-singapore" className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-800">8 Yếu Tố Định Hình Chất Sống Singapore</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {slug === "k-home-midtown-trang-bom"
                  ? "Sống là tận hưởng – K-Home Midtown áp dụng 8 tiêu chuẩn Singapore vào dự án NOXH tại trung tâm Trảng Bom"
                  : slug === "k-home-avenue-nhon-trach"
                  ? "Sống là tận hưởng – K-Home Avenue áp dụng 8 tiêu chuẩn Singapore vào dự án NOXH cửa ngõ sân bay Long Thành"
                  : "Sống là tận hưởng – K-Home CityView áp dụng 8 tiêu chuẩn Singapore vào dự án NOXH đầu tiên tại Đồng Nai"}
              </p>
            </div>
          </div>

          {/* Slide Singapore — theo từng dự án */}
          {slug === "k-home-midtown-trang-bom" ? (
            <button onClick={() => openMidtownSlide(["slide-k-home-midtown/phoi-canh-tong-the-du-an-k-home-midtown-trang-bom-phong-cach-song-chuan-singapor"], 0, ["Phong cách sống chuẩn Singapore – K-Home Midtown Trảng Bom Kim Oanh Land EDGE"])} className="relative group w-full rounded-2xl overflow-hidden border border-slate-200 cursor-zoom-in block">
              <img src={slideMidtownImg("slide-k-home-midtown/phoi-canh-tong-the-du-an-k-home-midtown-trang-bom-phong-cach-song-chuan-singapor", "thumbnail")} alt="Phong cách sống chuẩn Singapore K-Home Midtown Trảng Bom Kim Oanh Land" className="w-full object-cover max-h-72 group-hover:scale-105 transition-transform duration-300" loading="lazy" width="800" height="288" style={{ backgroundColor: "#e2e8f0" }} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Xem toàn màn hình</span>
              </div>
            </button>
          ) : slug === "k-home-avenue-nhon-trach" ? (
            <button onClick={() => { setSlideLightboxImages([slideAvenueImg("slide-k-home-avenue/phoi-canh-tong-the-du-an-nha-o-xa-hoi-k-home-avenue-chuan-singapore-tai-nhon-tra")]); setSlideLightboxAlts(["Phong cách sống chuẩn Singapore K-Home Avenue Nhơn Trạch Kim Oanh Land EDGE"]); setSlideLightboxIndex(0); setSlideLightboxOpen(true); }} className="relative group w-full rounded-2xl overflow-hidden border border-slate-200 cursor-zoom-in block">
              <img src={slideAvenueImg("slide-k-home-avenue/phoi-canh-tong-the-du-an-nha-o-xa-hoi-k-home-avenue-chuan-singapore-tai-nhon-tra", "thumbnail")} alt="Phong cách sống chuẩn Singapore K-Home Avenue Nhơn Trạch Kim Oanh Land EDGE" className="w-full object-cover max-h-72 group-hover:scale-105 transition-transform duration-300" loading="lazy" width="800" height="288" style={{ backgroundColor: "#e2e8f0" }} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Xem toàn màn hình</span>
              </div>
            </button>
          ) : (
            <button onClick={() => openSlide([41], 0, ["8 yếu tố định hình chất sống Singapore tại K-Home CityView Biên Hòa Kim Oanh Land"])} className="relative group w-full rounded-2xl overflow-hidden border border-slate-200 cursor-zoom-in block">
              <img src={slideImg(41, "thumbnail")} alt="8 yếu tố định hình chất sống Singapore tại K-Home CityView Biên Hòa Kim Oanh Land" className="w-full object-cover max-h-72 group-hover:scale-105 transition-transform duration-300" loading="lazy" width="800" height="288" style={{ backgroundColor: "#e2e8f0" }} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Xem toàn màn hình</span>
              </div>
            </button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seo.singaporeFactors.factors.map((f, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-amber-300 hover:bg-amber-50/30 transition-all">
                <span className="shrink-0 w-10 h-10 bg-amber-500 text-white text-sm font-bold rounded-xl flex items-center justify-center">{f.num}</span>
                <div>
                  <span className="block font-bold text-slate-800 text-sm mb-1">{f.title}</span>
                  <span className="block text-xs text-slate-500 leading-relaxed">{f.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Chứng chỉ EDGE ── */}
      {seo?.edgeCert && (
        <section id="chung-chi-edge" className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-3xl p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-800">Chứng Chỉ Công Trình Xanh EDGE</h2>
              <p className="text-xs text-green-700 font-semibold mt-0.5">Excellence in Design for Greater Efficiencies – IFC / World Bank Group</p>
            </div>
          </div>

          {/* Slide EDGE — CityView slide-23, Midtown & Avenue dùng slide riêng */}
          {slug === "k-home-midtown-trang-bom" ? (
            <button onClick={() => openMidtownSlide(["slide-k-home-midtown/tien-ich-va-cong-trinh-xanh-edge-tai-k-home-midtown-giam-20-dien-nang-nuoc-va-kh"], 0, ["Tiện ích và công trình xanh EDGE K-Home Midtown Trảng Bom giảm 20% điện nước carbon"])} className="relative group w-full rounded-2xl overflow-hidden border border-green-200 cursor-zoom-in block">
              <img src={slideMidtownImg("slide-k-home-midtown/tien-ich-va-cong-trinh-xanh-edge-tai-k-home-midtown-giam-20-dien-nang-nuoc-va-kh", "thumbnail")} alt="Chứng chỉ công trình xanh EDGE K-Home Midtown Trảng Bom giảm 20% điện nước khí thải carbon" className="w-full object-cover max-h-64 group-hover:scale-105 transition-transform duration-300" loading="lazy" width="800" height="256" style={{ backgroundColor: "#e2e8f0" }} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Xem toàn màn hình</span>
              </div>
            </button>
          ) : slug === "k-home-avenue-nhon-trach" ? (
            <button onClick={() => { setSlideLightboxImages([slideAvenueImg("slide-k-home-avenue/he-tien-ich-da-lop-tai-k-home-avenue-ho-boi-san-choi-va-tien-ich-ngoai-khu-xung-")]); setSlideLightboxAlts(["Hệ tiện ích đa lớp K-Home Avenue EDGE – giảm 20% điện nước khí thải carbon Nhơn Trạch"]); setSlideLightboxIndex(0); setSlideLightboxOpen(true); }} className="relative group w-full rounded-2xl overflow-hidden border border-green-200 cursor-zoom-in block">
              <img src={slideAvenueImg("slide-k-home-avenue/he-tien-ich-da-lop-tai-k-home-avenue-ho-boi-san-choi-va-tien-ich-ngoai-khu-xung-", "thumbnail")} alt="Hệ tiện ích đa lớp K-Home Avenue Nhơn Trạch EDGE giảm 20% điện nước carbon Kim Oanh Land" className="w-full object-cover max-h-64 group-hover:scale-105 transition-transform duration-300" loading="lazy" width="800" height="256" style={{ backgroundColor: "#e2e8f0" }} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Xem toàn màn hình</span>
              </div>
            </button>
          ) : (
            <button onClick={() => openSlide([23], 0, ["Chứng chỉ công trình xanh EDGE K-Home CityView Biên Hòa – tiết kiệm 20% điện nước Kim Oanh Land"])} className="relative group w-full rounded-2xl overflow-hidden border border-green-200 cursor-zoom-in block">
              <img src={slideImg(23, "thumbnail")} alt="Chứng chỉ công trình xanh EDGE K-Home CityView Biên Hòa tiết kiệm điện nước Kim Oanh Land" className="w-full object-cover max-h-64 group-hover:scale-105 transition-transform duration-300" loading="lazy" width="800" height="256" style={{ backgroundColor: "#e2e8f0" }} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Xem toàn màn hình</span>
              </div>
            </button>
          )}

          <div className="grid grid-cols-3 gap-4">
            {seo.edgeCert.savings.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 text-center border border-green-100 shadow-sm">
                <span className="block text-3xl font-bold text-green-600">{s.pct}</span>
                <span className="block text-xs text-slate-500 mt-1 font-medium">{s.label}</span>
              </div>
            ))}
          </div>

          <p className="text-slate-600 text-sm leading-relaxed">{seo.edgeCert.desc}</p>
        </section>
      )}

      {/* ── Mua vs Thuê ── */}
      {seo?.buyVsRent && (
        <section id="mua-vs-thue" className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-800">Mua Nhà vs Thuê Trọ – Đâu Là Lựa Chọn Thông Minh?</h2>
              <p className="text-xs text-slate-500 mt-0.5">Bài toán tài chính thực tế dành cho người lao động tại Đồng Nai</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase">Tiêu chí</th>
                  <th className="text-center px-5 py-3.5 text-xs font-bold uppercase text-amber-300">Mua {project.title}</th>
                  <th className="text-center px-5 py-3.5 text-xs font-bold uppercase text-slate-300">Tiếp tục thuê trọ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {seo.buyVsRent.tableRows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-amber-50/20" : "bg-white"}>
                    <td className="px-5 py-3.5 font-semibold text-slate-700 text-sm">{row.label}</td>
                    <td className="px-5 py-3.5 text-center text-green-700 font-bold text-sm">{row.buy}</td>
                    <td className="px-5 py-3.5 text-center text-slate-400 text-sm">{row.rent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="text-slate-700 text-sm leading-relaxed font-medium">💡 {seo.buyVsRent.conclusion}</p>
          </div>
        </section>
      )}

      {/* ── Giải thưởng ── */}
      {seo?.awards && (
        <section id="giai-thuong" className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-800">Giải Thưởng & Công Nhận Uy Tín</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {seo.awards.items.map((a, i) => (
              <div key={i} className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 rounded-2xl p-5 space-y-3 text-center">
                {a.imgSlide !== undefined ? (
                  <button
                    onClick={() => openSlide(seo.awards!.items.filter(x => x.imgSlide !== undefined).map(x => x.imgSlide!), seo.awards!.items.filter(x => x.imgSlide !== undefined).findIndex(x => x.imgSlide === a.imgSlide))}
                    className="w-full cursor-zoom-in relative group rounded-xl overflow-hidden"
                  >
                    <img src={slideImg(a.imgSlide, "thumbnail")} alt={`${a.title} ${a.year} Kim Oanh Land`} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" width="400" height="144" style={{ backgroundColor: "#e2e8f0" }} />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="bg-white/90 text-slate-800 px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"><Eye className="w-3 h-3" /> Phóng to</span>
                    </div>
                  </button>
                ) : (
                  <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center mx-auto">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                )}
                <div>
                  <span className="block text-xs font-bold text-amber-600 mb-1">{a.year}</span>
                  <span className="block font-bold text-slate-800 text-sm leading-snug">{a.title}</span>
                  <span className="block text-xs text-slate-500 mt-1 leading-relaxed">{a.org}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Slide giải thưởng banner — chỉ CityView */}
          {slug === "k-home-cityview-ho-nai" && (
            <button onClick={() => openSlide([15, 16], 0, [
                "Giải thưởng PropertyGuru Vietnam Property Awards 2025 Kim Oanh Land Best Affordable Housing Development",
                "Top 10 doanh nghiệp bất động sản triển vọng nhất Việt Nam 2024 Kim Oanh Land",
              ])} className="relative group w-full rounded-2xl overflow-hidden border border-slate-200 cursor-zoom-in block">
              <img src={slideImg(15, "thumbnail")} alt="Giải thưởng Kim Oanh Land PropertyGuru Vietnam Property Awards Best Affordable Housing Development 2025" className="w-full object-cover max-h-72 group-hover:scale-105 transition-transform duration-300" loading="lazy" width="800" height="288" style={{ backgroundColor: "#e2e8f0" }} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Xem toàn màn hình</span>
              </div>
            </button>
          )}
        </section>
      )}

      {/* ── Các đối tác ── */}
      {seo?.partners && (
        <section id="doi-tac" className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center shrink-0">
              <Handshake className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-800">
                {slug === "k-home-midtown-trang-bom" ? "Vươn Mình Cùng Đô Thị – Đội Ngũ Kiến Tạo"
                  : slug === "k-home-avenue-nhon-trach" ? "Đối Tác Đồng Hành K-Home Avenue"
                  : "Đối Tác Đồng Hành"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {slug === "k-home-midtown-trang-bom"
                  ? "Từ tầm nhìn kiến tạo đến từng chi tiết hoàn thiện"
                  : slug === "k-home-avenue-nhon-trach"
                  ? "Các đơn vị tư vấn và thi công uy tín tham gia dự án K-Home Avenue"
                  : "Các đơn vị tư vấn và thi công uy tín tham gia dự án K-Home CityView"}
              </p>
            </div>
          </div>

          {/* Ảnh đội ngũ Midtown */}
          {slug === "k-home-midtown-trang-bom" && (
            <button onClick={() => openMidtownSlide(["slide-k-home-midtown/doi-ngu-phat-trien-du-an-k-home-midtown-kim-oanh-land-cung-cac-doi-tac-global-vi"], 0, ["Đội ngũ kiến tạo K-Home Midtown – Kim Oanh Land cùng Global Vireon Studio, Kiến Trúc Việt, Decofi, Nagecco"])} className="relative group w-full rounded-2xl overflow-hidden border border-slate-200 cursor-zoom-in block">
              <img src={slideMidtownImg("slide-k-home-midtown/doi-ngu-phat-trien-du-an-k-home-midtown-kim-oanh-land-cung-cac-doi-tac-global-vi", "thumbnail")} alt="Đội ngũ phát triển K-Home Midtown Kim Oanh Land Global Vireon Studio Kiến Trúc Việt Decofi Nagecco" className="w-full object-cover max-h-56 group-hover:scale-105 transition-transform duration-300" loading="lazy" width="800" height="224" style={{ backgroundColor: "#e2e8f0" }} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Xem toàn màn hình</span>
              </div>
            </button>
          )}

          {/* Ảnh đội ngũ Avenue */}
          {slug === "k-home-avenue-nhon-trach" && (
            <button onClick={() => { setSlideLightboxImages([slideAvenueImg("slide-k-home-avenue/doi-tac-dong-hanh-du-an-k-home-avenue-global-vireon-studio-cubic-phan-vu-handong")]); setSlideLightboxAlts(["Đối tác đồng hành K-Home Avenue – Global Vireon Studio, Cubic, Phan Vũ, Handong, K-City, Coninco"]); setSlideLightboxIndex(0); setSlideLightboxOpen(true); }} className="relative group w-full rounded-2xl overflow-hidden border border-slate-200 cursor-zoom-in block">
              <img src={slideAvenueImg("slide-k-home-avenue/doi-tac-dong-hanh-du-an-k-home-avenue-global-vireon-studio-cubic-phan-vu-handong", "thumbnail")} alt="Đối tác đồng hành K-Home Avenue Global Vireon Studio Cubic Phan Vũ Handong K-City Coninco" className="w-full object-cover max-h-56 group-hover:scale-105 transition-transform duration-300" loading="lazy" width="800" height="224" style={{ backgroundColor: "#e2e8f0" }} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Xem toàn màn hình</span>
              </div>
            </button>
          )}

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {seo.partners.items.map((p, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center space-y-2 hover:border-amber-300 hover:bg-amber-50/30 transition-all">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                  <Building className="w-5 h-5 text-amber-600" />
                </div>
                <span className="block text-sm font-bold text-slate-800 leading-tight">{p.name}</span>
                <span className="block text-[10px] text-slate-500 leading-relaxed">{p.role}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Chủ đầu tư ── */}
      {seo?.developerImage && (
        <section id="chu-dau-tu" className="bg-slate-50 rounded-3xl border border-slate-100 p-8 space-y-4">
          <h2 className="text-2xl font-display font-bold text-slate-800">Chủ Đầu Tư – Kim Oanh Land</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            {slug === "k-home-midtown-trang-bom"
              ? "Kim Oanh Land kiến tạo K-Home Midtown từ khát vọng mang phong cách sống chuẩn Singapore hòa vào nhịp phát triển mạnh mẽ của khu vực. Dự kiến đến năm 2028, Kim Oanh Land sẽ triển khai khoảng 40.000 căn nhà ở xã hội tại Đồng Nai và TP.HCM."
              : slug === "k-home-avenue-nhon-trach"
              ? "Kim Oanh Land kiến tạo K-Home Avenue từ khát vọng mang phong cách sống chuẩn Singapore hòa vào nhịp phát triển mạnh mẽ của khu Đông TP.HCM và vùng ven sân bay Long Thành. Đến năm 2028, Kim Oanh Land dự kiến triển khai khoảng 40.000 căn nhà ở xã hội tại Đồng Nai và TP.HCM."
              : "Kim Oanh Land là đơn vị phát triển bất động sản uy tín trực thuộc Tập đoàn Kim Oanh Group, chuyên đầu tư các dự án nhà ở xã hội chất lượng cao tại Đồng Nai và các vùng phụ cận. Với triết lý \"sản phẩm thật, giá trị thật\", công ty chú trọng thiết kế xanh, tiện ích đồng bộ và chất lượng nội thất từ các thương hiệu hàng đầu. Kim Oanh Land đã và đang phát triển chuỗi dự án K-Home chuẩn Singapore: K-Home New City, K-Home Avenue, K-Home Midtown, K-Home Skyview và K-Home CityView – với mục tiêu hỗ trợ người lao động có cơ hội an cư bền vững và góp phần thực hiện chương trình 1 triệu căn nhà ở xã hội quốc gia. Dự kiến đến năm 2028, Kim Oanh Land sẽ triển khai khoảng 40.000 căn nhà ở xã hội tại Đồng Nai và TP.HCM."
            }
          </p>
          <img
            src={imgUrl(seo.developerImage, "full")}
            alt="Top 10 Nhà phát triển nhà ở xã hội hàng đầu Việt Nam 2024 – Kim Oanh Land"
            className="w-full max-w-2xl mx-auto rounded-2xl object-cover cursor-zoom-in hover:opacity-90 transition-opacity"
            loading="lazy"
            width="800"
            height="450"
            style={{ backgroundColor: "#e2e8f0" }}
            onClick={() => {
              setSlideLightboxImages([imgUrl(seo.developerImage!, "full")]);
              setSlideLightboxAlts(["Top 10 Nhà phát triển nhà ở xã hội hàng đầu Việt Nam 2024 – Kim Oanh Land"]);
              setSlideLightboxIndex(0);
              setSlideLightboxOpen(true);
            }}
          />
        </section>
      )}

      {/* ── Midtown: Vị trí & 10 điểm nhấn ── */}
      {seo?.midtownHighlights && (
        <section id="midtown-highlights" className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-800">Tọa Độ Phong Cách – Trung Tâm Của Trung Tâm</h2>
              <p className="text-xs text-slate-500 mt-0.5">K-Home Midtown tại trung tâm hành chính huyện Trảng Bom, Đồng Nai</p>
            </div>
          </div>

          {/* Location map slide */}
          <button onClick={() => openMidtownSlide(["slide-k-home-midtown/ban-do-vi-tri-du-an-k-home-midtown-tai-trung-tam-trang-bom-ket-noi-cac-tuyen-duo"], 0, ["Bản đồ vị trí dự án K-Home Midtown tại trung tâm Trảng Bom – kết nối các tuyến đường và KCN Đồng Nai"])} className="relative group w-full rounded-2xl overflow-hidden border border-slate-200 cursor-zoom-in block">
            <img src={slideMidtownImg("slide-k-home-midtown/ban-do-vi-tri-du-an-k-home-midtown-tai-trung-tam-trang-bom-ket-noi-cac-tuyen-duo", "thumbnail")} alt="Bản đồ vị trí dự án K-Home Midtown Trảng Bom Đồng Nai kết nối KCN giao thông" className="w-full object-cover max-h-80 group-hover:scale-105 transition-transform duration-300" loading="lazy" width="800" height="320" style={{ backgroundColor: "#e2e8f0" }} />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Xem toàn màn hình</span>
            </div>
          </button>

          <p className="text-slate-600 text-sm leading-relaxed">{seo.midtownHighlights.locationText}</p>

          {/* Hero phối cảnh */}
          <button onClick={() => openMidtownSlide([seo.midtownHighlights!.heroImage], 0, ["Phối cảnh tổng thể dự án K-Home Midtown Trảng Bom – phong cách sống chuẩn Singapore"])} className="relative group w-full rounded-2xl overflow-hidden border border-slate-200 cursor-zoom-in block">
            <img src={slideMidtownImg(seo.midtownHighlights.heroImage, "thumbnail")} alt="Phối cảnh tổng thể K-Home Midtown Trảng Bom Đồng Nai phong cách sống chuẩn Singapore" className="w-full object-cover max-h-72 group-hover:scale-105 transition-transform duration-300" loading="lazy" width="800" height="288" style={{ backgroundColor: "#e2e8f0" }} />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Xem toàn màn hình</span>
            </div>
          </button>

          {/* 10 điểm nhấn */}
          <div id="10-diem-nhan" className="flex items-center gap-3 pt-2">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-slate-800">10 Điểm Nhấn Của K-Home Midtown</h3>
            </div>
          </div>

          <button onClick={() => openMidtownSlide(["slide-k-home-midtown/10-diem-nhan-noi-bat-cua-du-an-nha-o-xa-hoi-k-home-midtown-trang-bom"], 0, ["10 điểm nhấn nổi bật của dự án nhà ở xã hội K-Home Midtown Trảng Bom Đồng Nai"])} className="relative group w-full rounded-2xl overflow-hidden border border-slate-200 cursor-zoom-in block">
            <img src={slideMidtownImg("slide-k-home-midtown/10-diem-nhan-noi-bat-cua-du-an-nha-o-xa-hoi-k-home-midtown-trang-bom", "thumbnail")} alt="10 điểm nhấn nổi bật dự án nhà ở xã hội K-Home Midtown Trảng Bom Kim Oanh Land" className="w-full object-cover max-h-64 group-hover:scale-105 transition-transform duration-300" loading="lazy" width="800" height="256" style={{ backgroundColor: "#e2e8f0" }} />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Xem toàn màn hình</span>
            </div>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seo.midtownHighlights.points.map((p, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-teal-300 hover:bg-teal-50/20 transition-all">
                <span className="shrink-0 w-10 h-10 bg-teal-600 text-white text-sm font-bold rounded-xl flex items-center justify-center">{p.num}</span>
                <div>
                  <span className="block font-bold text-slate-800 text-sm mb-1">{p.title}</span>
                  <span className="block text-xs text-slate-500 leading-relaxed">{p.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Midtown: EDGE & Tiện ích ── */}
      {seo?.midtownEdge && (
        <section id="midtown-edge" className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-3xl p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-800">Nâng Niu Nhịp Sống – Từ Chuẩn Mực Quốc Tế EDGE</h2>
              <p className="text-xs text-green-700 font-semibold mt-0.5">Excellence in Design for Greater Efficiencies – IFC / World Bank Group</p>
            </div>
          </div>

          <button onClick={() => openMidtownSlide([seo.midtownEdge!.heroImage], 0, ["Tiện ích và công trình xanh EDGE tại K-Home Midtown Trảng Bom – giảm 20% điện nước khí thải"])} className="relative group w-full rounded-2xl overflow-hidden border border-green-200 cursor-zoom-in block">
            <img src={slideMidtownImg(seo.midtownEdge.heroImage, "thumbnail")} alt="Tiện ích công trình xanh EDGE K-Home Midtown Trảng Bom giảm 20% điện nước carbon Kim Oanh Land" className="w-full object-cover max-h-64 group-hover:scale-105 transition-transform duration-300" loading="lazy" width="800" height="256" style={{ backgroundColor: "#e2e8f0" }} />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Xem toàn màn hình</span>
            </div>
          </button>

          <div className="grid grid-cols-3 gap-4">
            {seo.midtownEdge.savings.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 text-center border border-green-100 shadow-sm">
                <span className="block text-3xl font-bold text-green-600">-{s.pct}</span>
                <span className="block text-xs text-slate-500 mt-1 font-medium">{s.label}</span>
              </div>
            ))}
          </div>

          <p className="text-slate-600 text-sm leading-relaxed">{seo.midtownEdge.desc}</p>
        </section>
      )}

      {/* ── Midtown: Đội ngũ & Đối tác — dùng section partners chung bên dưới ── */}

      {/* ── Avenue: Vị trí & 10 giá trị cốt lõi ── */}
      {seo?.avenueHighlights && (
        <section id="avenue-highlights" className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-800">Tọa Độ Phong Cách – Cửa Ngõ Khu Đông TP.HCM</h2>
              <p className="text-xs text-slate-500 mt-0.5">K-Home Avenue – 10 phút đến sân bay Long Thành, kết nối metro & cao tốc</p>
            </div>
          </div>

          {/* Bản đồ vị trí */}
          <button onClick={() => {
            setSlideLightboxImages([slideAvenueImg("slide-k-home-avenue/ban-do-vi-tri-chien-luoc-k-home-avenue-cua-ngo-khu-dong-tp-hcm-ket-noi-san-bay-l"), slideAvenueImg("slide-k-home-avenue/tiem-nang-vuot-troi-cua-khu-vuc-nhon-trach-va-du-an-k-home-avenue")]);
            setSlideLightboxAlts(["Bản đồ vị trí chiến lược K-Home Avenue Nhơn Trạch – cửa ngõ khu Đông TP.HCM sân bay Long Thành", "Tiềm năng vượt trội khu vực Nhơn Trạch và dự án K-Home Avenue Đồng Nai"]);
            setSlideLightboxIndex(0); setSlideLightboxOpen(true);
          }} className="relative group w-full rounded-2xl overflow-hidden border border-slate-200 cursor-zoom-in block">
            <img src={slideAvenueImg("slide-k-home-avenue/ban-do-vi-tri-chien-luoc-k-home-avenue-cua-ngo-khu-dong-tp-hcm-ket-noi-san-bay-l", "thumbnail")} alt="Bản đồ vị trí chiến lược K-Home Avenue Nhơn Trạch cửa ngõ khu Đông TP.HCM sân bay Long Thành" className="w-full object-cover max-h-80 group-hover:scale-105 transition-transform duration-300" loading="lazy" width="800" height="320" style={{ backgroundColor: "#e2e8f0" }} />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Xem toàn màn hình</span>
            </div>
          </button>

          <p className="text-slate-600 text-sm leading-relaxed">{seo.avenueHighlights.locationText}</p>

          {/* Phối cảnh tổng thể */}
          <button onClick={() => { setSlideLightboxImages([slideAvenueImg(seo.avenueHighlights!.heroImage)]); setSlideLightboxAlts(["Phối cảnh tổng thể K-Home Avenue chuẩn Singapore Nhơn Trạch Đồng Nai"]); setSlideLightboxIndex(0); setSlideLightboxOpen(true); }} className="relative group w-full rounded-2xl overflow-hidden border border-slate-200 cursor-zoom-in block">
            <img src={slideAvenueImg(seo.avenueHighlights.heroImage, "thumbnail")} alt="Phối cảnh tổng thể nhà ở xã hội K-Home Avenue chuẩn Singapore Nhơn Trạch Đồng Nai Kim Oanh Land" className="w-full object-cover max-h-72 group-hover:scale-105 transition-transform duration-300" loading="lazy" width="800" height="288" style={{ backgroundColor: "#e2e8f0" }} />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Xem toàn màn hình</span>
            </div>
          </button>

          {/* 10 giá trị cốt lõi */}
          <div id="10-gia-tri" className="flex items-center gap-3 pt-2">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-800">10 Giá Trị Cốt Lõi K-Home Avenue</h3>
          </div>

          <button onClick={() => { setSlideLightboxImages([slideAvenueImg("slide-k-home-avenue/10-gia-tri-cot-loi-cua-du-an-nha-o-xa-hoi-k-home-avenue")]); setSlideLightboxAlts(["10 giá trị cốt lõi dự án nhà ở xã hội K-Home Avenue Nhơn Trạch Kim Oanh Land"]); setSlideLightboxIndex(0); setSlideLightboxOpen(true); }} className="relative group w-full rounded-2xl overflow-hidden border border-slate-200 cursor-zoom-in block">
            <img src={slideAvenueImg("slide-k-home-avenue/10-gia-tri-cot-loi-cua-du-an-nha-o-xa-hoi-k-home-avenue", "thumbnail")} alt="10 giá trị cốt lõi dự án nhà ở xã hội K-Home Avenue Nhơn Trạch Đồng Nai Kim Oanh Land" className="w-full object-cover max-h-64 group-hover:scale-105 transition-transform duration-300" loading="lazy" width="800" height="256" style={{ backgroundColor: "#e2e8f0" }} />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Xem toàn màn hình</span>
            </div>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seo.avenueHighlights.points.map((p, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-emerald-300 hover:bg-emerald-50/20 transition-all">
                <span className="shrink-0 w-10 h-10 bg-emerald-600 text-white text-sm font-bold rounded-xl flex items-center justify-center">{p.num}</span>
                <div>
                  <span className="block font-bold text-slate-800 text-sm mb-1">{p.title}</span>
                  <span className="block text-xs text-slate-500 leading-relaxed">{p.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Điều kiện mua NOXH ── */}
      {seo?.noxhConditions && (
        <section id="dieu-kien-mua" className="bg-amber-50 border border-amber-100 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shrink-0">
              <BadgeCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-slate-800">Điều Kiện Mua Nhà Ở Xã Hội</h2>
              <p className="text-xs text-slate-500 mt-0.5">Kiểm tra ngay — hỗ trợ hồ sơ miễn phí nếu đủ điều kiện</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {seo.noxhConditions.map((c, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-amber-100 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-sm font-bold text-slate-800">{c.label}</span>
                  <span className="block text-xs text-slate-500 mt-0.5 leading-relaxed">{c.detail}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-4 border border-amber-200 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-bold text-slate-800">Không chắc mình có đủ điều kiện không?</p>
              <p className="text-xs text-slate-500 mt-0.5">Gọi ngay để được kiểm tra miễn phí trong 5 phút</p>
            </div>
            <a href="tel:0937587438" className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2">
              <Phone className="w-4 h-4" /> 0937 587 438
            </a>
          </div>
        </section>
      )}

      {/* ── Chính sách thanh toán ── */}
      {seo?.paymentPolicy && (
        <section id="chinh-sach-thanh-toan" className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-xl font-display font-bold text-slate-800">Chính Sách Thanh Toán</h2>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 bg-amber-500 text-white text-xs font-bold px-5 py-3">
              <span>Đợt</span>
              <span className="text-center">Tỷ lệ</span>
              <span className="text-right">Ghi chú</span>
            </div>
            {seo.paymentPolicy.map((row, i) => (
              <div key={i} className={`grid grid-cols-3 px-5 py-3.5 border-b border-slate-50 text-sm ${i % 2 === 0 ? "bg-amber-50/30" : "bg-white"}`}>
                <span className="font-semibold text-slate-700">{row.step}</span>
                <span className="text-center font-bold text-amber-600">{row.pct}</span>
                <span className="text-right text-slate-500 text-xs leading-snug">{row.note}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 flex items-start gap-1.5">
            <span className="text-amber-500 font-bold shrink-0">* Lưu ý:</span>
            Lịch thanh toán trên áp dụng cho phương thức vay ngân hàng chính sách. Tỷ lệ và tiến độ có thể thay đổi theo quyết định của chủ đầu tư.
          </p>
        </section>
      )}

      {/* ── Tính Trả Góp ── */}
      {CALC_CONFIG_SLUGS.includes(slug) && (
        <section id="tinh-tra-gop">
          <MortgageCalculator
            slug={slug}
            onContact={() => {
              const el = document.getElementById("lien-he");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          />
        </section>
      )}

      {/* ── Form liên hệ sau Chính Sách Thanh Toán ── */}
      <section id="lien-he" className="bg-amber-50 border border-amber-100 rounded-3xl p-6 md:p-8 space-y-5">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Đăng ký nhận thông tin</span>
          <h2 className="text-xl md:text-2xl font-display font-bold text-slate-800">Nhận Bảng Giá & Chính Sách Ưu Đãi Mới Nhất</h2>
          <p className="text-slate-500 text-sm">Điền thông tin bên dưới – chuyên viên Kim Oanh Land sẽ liên hệ tư vấn trong vòng 15 phút</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 max-w-lg mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="bottom-name" className="text-xs font-semibold text-slate-600 block">Họ và tên *</label>
              <input
                id="bottom-name"
                type="text"
                required
                placeholder="VD: Nguyễn Văn An"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-amber-200 focus:border-amber-500 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl text-sm outline-none transition-all shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="bottom-phone" className="text-xs font-semibold text-slate-600 block">Số điện thoại *</label>
              <input
                id="bottom-phone"
                type="tel"
                required
                placeholder="VD: 0937 587 438"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-amber-200 focus:border-amber-500 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl text-sm outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="bottom-email" className="text-xs font-semibold text-slate-600 block">Email <span className="text-slate-400 font-normal">(không bắt buộc)</span></label>
            <input
              id="bottom-email"
              type="email"
              placeholder="VD: email@gmail.com"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-amber-200 focus:border-amber-500 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl text-sm outline-none transition-all shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="bottom-unit" className="text-xs font-semibold text-slate-600 block">Loại căn quan tâm</label>
            <select
              id="bottom-unit"
              value={formMessage}
              onChange={(e) => setFormMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-amber-200 focus:border-amber-500 text-slate-800 rounded-xl text-sm outline-none transition-all shadow-sm"
            >
              <option value="">-- Chọn loại căn --</option>
              <option value="Căn 1 Phòng Ngủ + A (47,3m²) – 950tr–1,08 tỷ">Căn 1 Phòng Ngủ + A (47,3m²) – 950 triệu – 1,08 tỷ</option>
              <option value="Căn 1 Phòng Ngủ + B (62,4m²) – 1,20–1,40 tỷ">Căn 1 Phòng Ngủ + B (62,4m²) – 1,20 tỷ – 1,40 tỷ</option>
              <option value="Căn 2 Phòng Ngủ (70,4m²) – 1,50–1,70 tỷ">Căn 2 Phòng Ngủ (70,4m²) – 1,50 tỷ – 1,70 tỷ</option>
              <option value="Căn 3 Phòng Ngủ (84,4m²) – 1,80–2,00 tỷ">Căn 3 Phòng Ngủ (84,4m²) – 1,80 tỷ – 2,00 tỷ</option>
              <option value="Chưa quyết định – cần tư vấn thêm">Chưa quyết định – cần tư vấn thêm</option>
            </select>
          </div>

          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-medium rounded-xl">
              {formError}
            </div>
          )}

          {submitSuccess ? (
            <div className="py-6 text-center space-y-2">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <p className="text-slate-800 font-bold">Đăng ký thành công!</p>
              <p className="text-slate-500 text-xs">Chuyên viên sẽ liên hệ bạn trong vòng 15 phút.</p>
              <button onClick={() => setSubmitSuccess(false)} className="text-xs text-amber-600 hover:text-amber-700 underline cursor-pointer">Gửi yêu cầu mới</button>
            </div>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-200 cursor-pointer"
            >
              {isSubmitting
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><Send className="w-4 h-4" /> Nhận Bảng Giá & Tư Vấn Miễn Phí</>
              }
            </button>
          )}

          <p className="text-center text-slate-400 text-xs">Hoặc gọi thẳng hotline: <a href="tel:0937587438" className="text-amber-600 font-bold hover:text-amber-700">0937 587 438</a></p>
        </form>
      </section>

      {/* ── FAQ ── */}
      {seo?.faq && (
        <section id="faq" className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-slate-800">Câu Hỏi Thường Gặp</h2>
              <p className="text-xs text-slate-500 mt-0.5">Giải đáp mọi thắc mắc về {project.title}</p>
            </div>
          </div>
          <div className="space-y-3">
            {seo.faq.map((item, i) => (
              <details key={i} className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none select-none hover:bg-amber-50/50 transition-colors">
                  <span className="font-semibold text-slate-800 text-sm pr-4">{item.q}</span>
                  <span className="shrink-0 w-6 h-6 rounded-full bg-slate-100 group-open:bg-amber-500 text-slate-500 group-open:text-white flex items-center justify-center text-xs font-bold transition-all">
                    <svg className="w-3 h-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  </span>
                </summary>
                <div className="px-5 pb-4 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-50">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* ── Form liên hệ sau Chính Sách Thanh Toán ── */}
      {slideLightboxOpen && slideLightboxImages.length > 0 && (
        <Lightbox
          images={slideLightboxImages}
          initialIndex={slideLightboxIndex}
          caption="Click vào ảnh để zoom • Cuộn chuột để phóng to/thu nhỏ"
          rawUrls={true}
          alts={slideLightboxAlts}
          onClose={() => setSlideLightboxOpen(false)}
        />
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <Lightbox
          images={project.gallery}
          initialIndex={lightboxIndex}
          caption={`${project.title} - Phối cảnh không gian sống`}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* Related Articles — Internal Linking Cluster for SEO */}
      <RelatedArticles
        projectSlug={slug}
        limit={6}
        title={`Tin Tức Liên Quan ${project.name || "K-Home"}`}
        onNavigate={onNavigate}
      />

    </div>
    </>
  );
}

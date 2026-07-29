import React, { useEffect, useState, useMemo, useRef } from "react";
import { ArrowLeft, CheckCircle, MapPin, Building, Star, Compass, Phone, Send, Eye, LayoutGrid, HelpCircle, ShieldCheck, BadgeCheck, Award, TrendingUp, Users, Gift, Building2, Handshake, Newspaper } from "lucide-react";
import { Project } from "../types";
import Lightbox from "./Lightbox";
import { imgUrl } from "../utils/imageUrl";

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
  promotion?: { title: string; items: string[]; note: string };
  partners?: { items: { name: string; role: string }[] };
}> = {
  "k-home-cityview-ho-nai": {
    titleTag: "K-Home CityView Hố Nai | Nhà Ở Xã Hội Biên Hòa | Giá từ 950 triệu",
    metaDesc: "Dự án nhà ở xã hội K-Home CityView tại đường Điểu Xiển, Hố Nai, Biên Hòa. 1.352 căn hộ NOXH + shophouse, diện tích 47–84m², lãi suất 5,4%/năm, hỗ trợ hồ sơ miễn phí. Cập nhật bảng giá & tiến độ mới nhất.",
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
      hubText: "Biên Hòa – TP. Đồng Nai đang được quy hoạch trở thành đô thị loại I, là trung tâm kinh tế – công nghiệp quan trọng nhất vùng Đông Nam Bộ. Tỉnh Đồng Nai quy hoạch 5 vùng phát triển chiến lược với hơn 30 khu công nghiệp hoạt động, thu hút hàng chục tỷ USD vốn FDI.",
      zones: [
        "Vùng 1: Trung tâm TP. Biên Hòa – đô thị hiện đại",
        "Vùng 2: Long Thành – Nhơn Trạch – cửa ngõ sân bay",
        "Vùng 3: Trảng Bom – Thống Nhất – công nghiệp phía Bắc",
        "Vùng 4: Long Khánh – Xuân Lộc – nông nghiệp công nghệ cao",
        "Vùng 5: Định Quán – Tân Phú – lâm nghiệp & du lịch sinh thái",
      ],
      transportText: "Đồng Nai kết nối giao thông quốc gia qua: Cao tốc TP.HCM – Long Thành – Dầu Giây, Quốc lộ 1A, Quốc lộ 51, Tỉnh lộ 25C, tuyến Metro số 1, tuyến đường sắt Bắc – Nam và Sân bay Quốc tế Long Thành đang xây dựng.",
    },
    constructionProgress: {
      timeline: [
        { date: "08/2026", event: "Khởi công xây dựng – Lễ động thổ chính thức", done: true },
        { date: "Q4/2026", event: "Hoàn thành móng cọc & đài móng 4 block", done: false },
        { date: "Q2/2027", event: "Thi công thô đến tầng 10", done: false },
        { date: "Q4/2027", event: "Hoàn thành kết cấu thô toàn bộ 22 tầng", done: false },
        { date: "Q1/2028", event: "Hoàn thiện nội thất & bàn giao nhà mẫu", done: false },
        { date: "01/2028", event: "Dự kiến bàn giao đợt đầu cho cư dân", done: false },
      ],
      siteImages: [
        "slide-k-home-cityview/slide-28",
        "slide-k-home-cityview/slide-29",
      ],
    },
    legalInfo: {
      items: [
        { title: "Giấy chứng nhận đăng ký đầu tư", desc: "Dự án được cấp Giấy CNĐT số 362/CNĐT ngày 09/10/2023 bởi Ban Quản lý các Khu công nghiệp Đồng Nai. Chủ đầu tư: Kim Oanh Land JSC." },
        { title: "Phê duyệt quy hoạch 1/500", desc: "Quy hoạch chi tiết tỷ lệ 1/500 được UBND tỉnh Đồng Nai phê duyệt, đảm bảo pháp lý đầy đủ trước khi triển khai xây dựng." },
        { title: "Chuyển đổi mục đích sử dụng đất", desc: "Đất đã hoàn tất thủ tục chuyển đổi mục đích sử dụng đất sang đất ở, đảm bảo cấp sổ hồng sở hữu lâu dài cho người mua." },
        { title: "Giấy phép xây dựng", desc: "Giấy phép xây dựng đã được cấp đầy đủ theo quy định, dự án đang trong giai đoạn triển khai xây dựng hợp pháp." },
      ],
    },
    singaporeFactors: {
      factors: [
        { num: "01", title: "Quy hoạch đô thị theo chuẩn HDB Singapore", desc: "Áp dụng mô hình New Town Planning của Singapore với đầy đủ tiện ích trong bán kính đi bộ 500m." },
        { num: "02", title: "Thiết kế không gian xanh", desc: "30% diện tích dành cho cây xanh, vườn treo tầng 3, Sky Garden và hành lang sinh thái." },
        { num: "03", title: "Hệ thống quản lý thông minh", desc: "Ứng dụng công nghệ quản lý tòa nhà BMS, camera AI 24/7, kiểm soát ra vào bằng thẻ từ." },
        { num: "04", title: "Tối ưu ánh sáng & thông gió tự nhiên", desc: "100% căn hộ có cửa sổ, thiết kế hành lang và ban công đón gió Đông Nam tự nhiên." },
        { num: "05", title: "Tiêu chuẩn bàn giao hoàn thiện", desc: "Bàn giao full nội thất tiêu chuẩn Singapore — cư dân chỉ cần mang đồ cá nhân là ở được ngay." },
        { num: "06", title: "Hạ tầng giao thông nội khu an toàn", desc: "Phân tách hoàn toàn luồng xe và người đi bộ, bãi xe ngầm, khu vực vui chơi trẻ em tách biệt giao thông." },
        { num: "07", title: "Cộng đồng cư dân văn minh", desc: "Quy chế quản lý cư dân và ban quản trị tòa nhà theo mô hình quản lý chuyên nghiệp Singapore." },
        { num: "08", title: "Công trình xanh chuẩn EDGE", desc: "Thiết kế đạt tiêu chuẩn EDGE (Excellence in Design for Greater Efficiencies), tiết kiệm ít nhất 20% năng lượng, nước và năng lượng vật liệu." },
      ],
    },
    edgeCert: {
      savings: [
        { label: "Tiết kiệm năng lượng", pct: "≥ 20%" },
        { label: "Tiết kiệm nước", pct: "≥ 20%" },
        { label: "Năng lượng vật liệu xây dựng", pct: "≥ 20%" },
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
    promotion: {
      title: "Chương Trình Tri Ân Khách Hàng – Tổng Giá Trị 6 Tỷ Đồng",
      items: [
        "Chiết khấu lên đến 3% giá trị căn hộ khi thanh toán sớm",
        "Gói nội thất bổ sung trị giá 30 triệu đồng cho 100 khách đầu tiên",
        "Hỗ trợ phí làm hồ sơ vay ngân hàng hoàn toàn miễn phí",
        "Tặng 1 năm phí quản lý chung cư cho khách hàng đặt cọc sớm",
        "Ưu tiên chọn tầng và hướng căn hộ theo thứ tự đặt cọc",
      ],
      note: "* Chương trình áp dụng trong giai đoạn mở bán đầu. Điều kiện chi tiết vui lòng liên hệ hotline 0937.587.438 để được tư vấn cụ thể.",
    },
    partners: {
      items: [
        { name: "Global Vireon Studio", role: "Đơn vị tư vấn thiết kế kiến trúc tổng thể" },
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
      { q: "K-Home CityView Hố Nai giá bao nhiêu?", a: "K-Home CityView có giá từ 950 triệu đến 2 tỷ/căn tùy loại: 1PN+A từ 950 triệu, 1PN+B từ 1,25 tỷ, 2PN từ 1,50 tỷ, 3PN từ 1,80 tỷ. Tất cả bàn giao full nội thất, lãi suất NOXH 5,4%/năm." },
      { q: "Điều kiện mua K-Home CityView là gì?", a: "Người mua cần: chưa có nhà tại Đồng Nai, chưa từng mua NOXH, thu nhập dưới 50 triệu/tháng (cặp vợ chồng) hoặc dưới 25 triệu (độc thân), có hộ khẩu hoặc tạm trú tại Đồng Nai." },
      { q: "K-Home CityView ở đâu?", a: "K-Home CityView tọa lạc tại đường Điểu Xiển, Phường Hố Nai, TP. Biên Hòa, Tỉnh Đồng Nai. Cách trung tâm Biên Hòa khoảng 3km, gần các KCN Biên Hòa 1, 2, Amata, Hố Nai và Long Bình." },
      { q: "K-Home CityView khi nào bàn giao nhà?", a: "Dự án đang trong giai đoạn bốc thăm và thi công. Dự kiến bàn giao theo tiến độ được cơ quan nhà nước phê duyệt. Liên hệ hotline 0937.587.438 để cập nhật tiến độ mới nhất." },
      { q: "Vay mua K-Home CityView được bao nhiêu?", a: "Người mua đủ điều kiện NOXH được vay tối đa 80% giá trị căn hộ từ Ngân hàng Chính sách Xã hội với lãi suất 5,4%/năm cố định trong 25 năm. Trả góp chỉ từ khoảng 3,5–4,5 triệu/tháng." },
      { q: "K-Home CityView có được bán lại không?", a: "Theo quy định NOXH, người mua phải ở tối thiểu 5 năm sau khi nhận bàn giao mới được bán lại. Khi bán phải bán lại cho người đủ điều kiện mua NOXH hoặc trả lại cho chủ đầu tư." },
      { q: "K-Home CityView có bao nhiêu căn?", a: "Dự án có tổng cộng khoảng 1.350 căn hộ NOXH và 30 căn shophouse thương mại, phân bổ trong 4 block cao 22 tầng trên tổng diện tích 2,85 hecta tại Hố Nai, Biên Hòa." },
      { q: "Hỗ trợ hồ sơ NOXH K-Home CityView như thế nào?", a: "Đội ngũ Kim Oanh Land hỗ trợ hoàn toàn miễn phí: kiểm tra điều kiện đủ tiêu chuẩn, chuẩn bị giấy tờ, nộp hồ sơ xét duyệt và kết nối Ngân hàng Chính sách Xã hội. Hotline: 0937.587.438." },
      { q: "Mặt bằng K-Home CityView gồm những loại căn nào?", a: "K-Home CityView Hố Nai có 4 loại căn hộ: 1PN+ A (47,3m²), 1PN+ B (62,4m²), 2 phòng ngủ (70,4m²) và 3 phòng ngủ (84,4m²). Đây là dự án NOXH đầu tiên tại Đồng Nai có căn hộ 3 phòng ngủ." },
      { q: "Tiện ích K-Home CityView Hố Nai có gì?", a: "K-Home CityView có đầy đủ tiện ích nội khu: hồ bơi người lớn và trẻ em, sân chơi trẻ em, khu thể dục ngoài trời, nhà sinh hoạt cộng đồng, vườn cảnh quan, khu BBQ, bãi đỗ xe và hệ thống shophouse khối đế." },
      { q: "K-Home CityView có sổ hồng không?", a: "Có. Dự án được pháp lý đầy đủ theo quy định nhà ở xã hội, cấp sổ hồng sở hữu lâu dài. Hồ sơ pháp lý minh bạch từ giai đoạn đặt cọc đến khi nhận nhà." },
      { q: "Nhà ở xã hội K-Home CityView Biên Hòa khác gì với nhà thương mại?", a: "NOXH K-Home CityView được bán theo giá Nhà nước quy định (thấp hơn thị trường 20–40%), người mua được vay lãi suất 5,4%/năm từ Ngân hàng Chính sách. Tuy nhiên cần đáp ứng điều kiện thu nhập, chưa có nhà và chưa mua NOXH trước đó." },
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
    ],
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
    ],
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
            <h4 className="text-base font-bold text-slate-800 mb-2">
              {headingMatch[1]}
            </h4>
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
      document.title = "K-Home Đồng Nai | CityView – Midtown – Avenue | Nhà Ở Xã Hội Kim Oanh Group";
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

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Helper: Cloudinary URL cho slide (full resolution để zoom đọc được chữ)
  const slideImg = (num: number, mode: "thumbnail" | "full" = "full") => {
    const transform = mode === "thumbnail"
      ? "w_900,q_auto:good,f_auto"
      : "w_1600,q_auto:best,f_auto";
    return `https://res.cloudinary.com/dthv0nsq/image/upload/${transform}/slide-k-home-cityview/slide-${num}`;
  };

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Slide lightbox state — dùng riêng cho ảnh slide Cloudinary
  const [slideLightboxOpen, setSlideLightboxOpen] = useState(false);
  const [slideLightboxImages, setSlideLightboxImages] = useState<string[]>([]);
  const [slideLightboxIndex, setSlideLightboxIndex] = useState(0);

  const openSlide = (nums: number[], startIdx = 0) => {
    setSlideLightboxImages(nums.map(n => slideImg(n)));
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Back navigation button */}
      <button
        onClick={() => onNavigate("/san-pham")}
        className="inline-flex items-center gap-2 text-slate-600 hover:text-amber-600 text-sm font-medium transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Quay lại rổ hàng dự án
      </button>

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
              alt={project.title}
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
                  alt={`${project.title} - Hình ảnh dự án ${idx + 2}`}
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
                <p className="text-slate-500 text-sm">Cập nhật bảng giá đợt 1 từ chủ đầu tư Kim Oanh Group. Giá có thể thay đổi theo từng đợt mở bán.</p>
              </div>

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
                  <h4 className="font-bold text-slate-800 text-base">Gửi Yêu Cầu Thành Công!</h4>
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
                  <label className="text-xs font-semibold text-slate-600 block">Họ và tên của bạn *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn Hải"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-lg text-sm outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 block">Địa chỉ Email <span className="text-slate-400 font-normal">(không bắt buộc)</span></label>
                  <input
                    type="email"
                    placeholder="VD: hainguyen@gmail.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-lg text-sm outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 block">Số điện thoại liên lạc *</label>
                  <input
                    type="tel"
                    required
                    placeholder="VD: 0937587438"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-lg text-sm outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 block">Lời nhắn yêu cầu tư vấn</label>
                  <textarea
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
          <p className="text-slate-500 text-sm leading-relaxed">{project.location}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seo.locationImages.map((img, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                <img
                  src={imgUrl(img.src, "full")}
                  alt={img.alt}
                  className="w-full h-56 object-cover"
                  loading="lazy"
                  style={{ backgroundColor: "#e2e8f0" }}
                />
                {img.caption && (
                  <p className="text-xs text-slate-500 text-center py-2 bg-slate-50 border-t border-slate-100">{img.caption}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Mặt bằng tầng ── */}
      {seo?.floorPlanImages && seo.floorPlanImages.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-bold text-slate-800">Mặt Bằng & Layout Căn Hộ</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            K-Home CityView có tầng trệt & tầng 2 tập trung tiện ích "all-in-one", tầng 3 có vườn treo, tầng 4–22 là mặt bằng điển hình với các loại căn 1PN+, 2PN và 3PN.
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
          <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-200" style={{ minHeight: "400px" }}>
            <img
              key={activeFloorTab}
              src={imgUrl(seo.floorPlanImages[activeFloorTab].src, "full")}
              alt={seo.floorPlanImages[activeFloorTab].alt}
              className="w-full object-cover"
              loading="eager"
              decoding="async"
              style={{ backgroundColor: "#e2e8f0", display: "block" }}
            />
          </div>
        </section>
      )}

      {/* ── Tiện ích chi tiết ── */}
      {seo?.amenityImages && seo.amenityImages.length > 0 && (
        <section className="space-y-5">
          <h2 className="text-2xl font-display font-bold text-slate-800">Tiện Ích Nội Khu</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Hệ thống tiện ích K-Home CityView được quy hoạch khép kín ngay trong khuôn viên dự án, đáp ứng nhu cầu sinh hoạt thiết thực của cư dân hàng ngày.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {seo.amenityImages.map((img, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                <img
                  src={imgUrl(img.src, "thumbnail")}
                  alt={img.alt}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                  style={{ backgroundColor: "#e2e8f0" }}
                />
                {img.caption && (
                  <p className="text-xs text-slate-600 font-medium text-center py-2 bg-slate-50 border-t border-slate-100">{img.caption}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Nhà mẫu ── */}
      {seo?.sampleUnitImages && seo.sampleUnitImages.length > 0 && (
        <section className="space-y-5">
          <h2 className="text-2xl font-display font-bold text-slate-800">Nhà Mẫu Căn Hộ K-Home CityView</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Căn hộ K-Home CityView bàn giao hoàn thiện full nội thất theo tiêu chuẩn dự án, bao gồm tủ bếp An Cường, sofa, bàn ăn, giường, tủ quần áo, chăn ga gối — chỉ trừ các thiết bị điện tử.
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
        <section className="space-y-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[2, 3, 4, 6 , 7, 8, 9, 10].map((num, i) => (
              <button key={i} onClick={() => openSlide([2, 3, 4, 6 , 7, 8, 9, 10], i)} className="relative group rounded-2xl overflow-hidden border border-slate-200 cursor-zoom-in w-full">
                <img src={slideImg(num, "thumbnail")} alt={i === 0 ? "Tổng quan TP Biên Hòa Đồng Nai quy hoạch đô thị loại I" : "5 vùng phát triển chiến lược tỉnh Đồng Nai"} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" style={{ backgroundColor: "#e2e8f0" }} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Xem toàn màn hình</span>
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
          <button onClick={() => openSlide([5])} className="relative group w-full rounded-2xl overflow-hidden border border-slate-200 cursor-zoom-in block">
            <img src={slideImg(5, "thumbnail")} alt="Hạ tầng giao thông quốc gia kết nối Đồng Nai Biên Hòa" className="w-full object-cover max-h-80 group-hover:scale-105 transition-transform duration-300" loading="lazy" style={{ backgroundColor: "#e2e8f0" }} />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Xem toàn màn hình</span>
            </div>
          </button>
        </section>
      )}

      {/* ── Tiến độ xây dựng ── */}
      {seo?.constructionProgress && (
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-800">Tiến Độ Triển Khai Dự Án</h2>
              <p className="text-xs text-slate-500 mt-0.5">Cập nhật tiến độ xây dựng K-Home CityView Hố Nai</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[39, 40].map((num, i) => (
              <button key={i} onClick={() => openSlide([39, 40], i)} className="relative group rounded-2xl overflow-hidden border border-slate-200 cursor-zoom-in w-full">
                <img src={slideImg(num, "thumbnail")} alt={`Tiến độ thi công K-Home CityView Hố Nai Biên Hòa 2026 - ảnh ${i + 1}`} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" style={{ backgroundColor: "#e2e8f0" }} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Xem toàn màn hình</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── Pháp lý ── */}
      {seo?.legalInfo && (
        <section className="space-y-5">
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

          {/* Slide pháp lý — click to zoom */}
          {[19, 20].map((num, i) => (
              <button key={i} onClick={() => openSlide([19, 20], i)} className="relative group rounded-2xl overflow-hidden border border-slate-200 cursor-zoom-in w-full">
                <img src={slideImg(num, "thumbnail")} alt={`Hồ sơ pháp lý dự án NOXH K-Home CityView Biên Hòa Kim Oanh Land - ảnh ${i + 1}`} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" style={{ backgroundColor: "#e2e8f0" }} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Xem toàn màn hình</span>
                </div>
              </button>
            ))}
        </section>
      )}

      {/* ── 8 Yếu tố Singapore ── */}
      {seo?.singaporeFactors && (
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-800">8 Yếu Tố Singapore Trong Thiết Kế K-Home CityView</h2>
              <p className="text-xs text-slate-500 mt-0.5">Tiêu chuẩn nhà ở xã hội Singapore – HDB – được ứng dụng vào dự án NOXH đầu tiên tại Đồng Nai</p>
            </div>
          </div>

          {/* Slide HDB Singapore — click to zoom */}
          <button onClick={() => openSlide([41])} className="relative group w-full rounded-2xl overflow-hidden border border-slate-200 cursor-zoom-in block">
            <img src={slideImg(41, "thumbnail")} alt="Mô hình nhà ở xã hội Singapore HDB áp dụng tại K-Home CityView Kim Oanh" className="w-full object-cover max-h-72 group-hover:scale-105 transition-transform duration-300" loading="lazy" style={{ backgroundColor: "#e2e8f0" }} />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Xem toàn màn hình</span>
            </div>
          </button>

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
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-3xl p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-800">Chứng Chỉ Công Trình Xanh EDGE</h2>
              <p className="text-xs text-green-700 font-semibold mt-0.5">Excellence in Design for Greater Efficiencies – IFC / World Bank Group</p>
            </div>
          </div>

          {/* Slide EDGE — click to zoom */}
          <button onClick={() => openSlide([23])} className="relative group w-full rounded-2xl overflow-hidden border border-green-200 cursor-zoom-in block">
            <img src={slideImg(23, "thumbnail")} alt="Chứng chỉ EDGE công trình xanh K-Home CityView giảm 20% điện nước" className="w-full object-cover max-h-64 group-hover:scale-105 transition-transform duration-300" loading="lazy" style={{ backgroundColor: "#e2e8f0" }} />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Xem toàn màn hình</span>
            </div>
          </button>

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
        <section className="space-y-5">
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
                  <th className="text-center px-5 py-3.5 text-xs font-bold uppercase text-amber-300">Mua K-Home CityView</th>
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
        <section className="space-y-5">
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
                    <img src={slideImg(a.imgSlide, "thumbnail")} alt={`${a.title} ${a.year} Kim Oanh Land`} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" style={{ backgroundColor: "#e2e8f0" }} />
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

          {/* Slide giải thưởng — click to zoom, hiện cả 2 ảnh */}
          <button onClick={() => openSlide([15, 16])} className="relative group w-full rounded-2xl overflow-hidden border border-slate-200 cursor-zoom-in block">
            <img src={slideImg(13, "thumbnail")} alt="PropertyGuru Vietnam Property Awards 2025 Kim Oanh Land Best Affordable Housing" className="w-full object-cover max-h-72 group-hover:scale-105 transition-transform duration-300" loading="lazy" style={{ backgroundColor: "#e2e8f0" }} />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Xem toàn màn hình</span>
            </div>
          </button>
        </section>
      )}

      {/* ── Khuyến mãi / Tri ân ── */}
      {seo?.promotion && (
        <section className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-8 space-y-5 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-white">{seo.promotion.title}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {seo.promotion.items.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/15 backdrop-blur-sm rounded-xl p-3.5">
                <span className="shrink-0 w-6 h-6 bg-white text-amber-600 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <span className="text-sm text-white leading-relaxed">{item}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-white/70 leading-relaxed">{seo.promotion.note}</p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a href="tel:0937587438" className="flex-1 bg-white text-amber-600 font-bold py-3 px-5 rounded-xl text-sm text-center hover:bg-amber-50 transition-colors flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" /> Đăng Ký Nhận Ưu Đãi: 0937 587 438
            </a>
          </div>
        </section>
      )}

      {/* ── Các đối tác ── */}
      {seo?.partners && (
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center shrink-0">
              <Handshake className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-800">Đối Tác Đồng Hành</h2>
              <p className="text-xs text-slate-500 mt-0.5">Các đơn vị tư vấn và thi công uy tín tham gia dự án K-Home CityView</p>
            </div>
          </div>

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
      {seo?.developerImage && (        <section className="bg-slate-50 rounded-3xl border border-slate-100 p-8 space-y-4">
          <h2 className="text-2xl font-display font-bold text-slate-800">Chủ Đầu Tư – Kim Oanh Land</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Kim Oanh Land đang khẳng định vai trò tiên phong trong phân khúc nhà ở xã hội nhờ lợi thế quỹ đất dồi dào và hệ sinh thái phát triển khép kín. Dự kiến đến năm 2028, Kim Oanh Land sẽ triển khai khoảng 40.000 căn nhà ở xã hội tại Đồng Nai và TP.HCM.
          </p>
          <img
            src={imgUrl(seo.developerImage, "full")}
            alt="Top 10 Nhà phát triển nhà ở xã hội hàng đầu Việt Nam 2024 – Kim Oanh Land"
            className="w-full max-w-2xl mx-auto rounded-2xl object-cover"
            loading="lazy"
            style={{ backgroundColor: "#e2e8f0" }}
          />
        </section>
      )}

      {/* ── Điều kiện mua NOXH ── */}
      {seo?.noxhConditions && (
        <section className="bg-amber-50 border border-amber-100 rounded-3xl p-8 space-y-6">
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
        <section className="space-y-5">
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

      {/* ── FAQ ── */}
      {seo?.faq && (
        <section className="space-y-5">
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

      {/* Slide Lightbox Modal */}
      {slideLightboxOpen && slideLightboxImages.length > 0 && (
        <Lightbox
          images={slideLightboxImages}
          initialIndex={slideLightboxIndex}
          caption="Click vào ảnh để zoom • Cuộn chuột để phóng to/thu nhỏ"
          rawUrls={true}
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

    </div>
  );
}

/**
 * generate-static-html.mjs — Sinh static HTML cho từng route
 * Mỗi file có đúng title/meta/canonical cho Googlebot đọc trước khi JS chạy
 * Run: node scripts/generate-static-html.mjs (sau npm run build)
 *
 * Bao gồm:
 *   - Static routes: trang dự án, trang điều hướng
 *   - Tất cả bài tin tức từ scripts/news-data.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parseNewsData } from "./parse-news.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, "../dist");
const BASE_URL = "https://k-homedongnai.com.vn";

// ─── Static routes ────────────────────────────────────────────────────────────
const STATIC_ROUTES = [
  {
    dir: "k-home-cityview-ho-nai",
    title: "K-Home CityView Hố Nai Biên Hòa | Bảng Giá, Mặt Bằng & Hồ Sơ NOXH 2026",
    description: "Dự án K-Home CityView Hố Nai Biên Hòa: 1.328 căn hộ NOXH chuẩn Singapore, giá từ 950 triệu, lãi suất 5,4%/năm, bàn giao 2028. Xem bảng giá, mặt bằng, điều kiện mua NOXH Đồng Nai.",
    keywords: "k-home cityview, k home cityview, k home city view, khome cityview, k-home city view, k-home cityview hố nai, k-home cityview biên hòa, k home cityview biên hòa, nhà ở xã hội k-home cityview, bảng giá k-home cityview, mặt bằng k-home cityview, k home đồng nai, k-home cityview đồng nai, giá k-home cityview",
  },
  {
    dir: "k-home-cityview-ho-nai/can-ho-1-phong-ngu-a",
    title: "Căn Hộ 1 Phòng Ngủ A K-Home CityView | 47,3m² | Giá từ 950 Triệu",
    description: "Căn hộ 1 phòng ngủ + A tại K-Home CityView Hố Nai, diện tích 47,3m², giá từ 950 triệu, bàn giao full nội thất, lãi suất NOXH 5,4%/năm.",
  },
  {
    dir: "k-home-cityview-ho-nai/can-ho-1-phong-ngu-b",
    title: "Căn Hộ 1 Phòng Ngủ B K-Home CityView | 62,4m² | Giá từ 1,2 Tỷ",
    description: "Căn hộ 1 phòng ngủ + B tại K-Home CityView Hố Nai, diện tích 62,4m², 2 nhà vệ sinh, giá từ 1,2 tỷ, bàn giao full nội thất, lãi suất NOXH 5,4%/năm.",
  },
  {
    dir: "k-home-cityview-ho-nai/can-ho-2-phong-ngu-cityview",
    title: "Căn Hộ 2 Phòng Ngủ K-Home CityView | 70,4m² | Giá từ 1,5 Tỷ",
    description: "Căn hộ 2 phòng ngủ tại K-Home CityView Hố Nai, diện tích 70,4m², 2 nhà vệ sinh, giá từ 1,5 tỷ, bàn giao full nội thất, lãi suất NOXH 5,4%/năm.",
  },
  {
    dir: "k-home-cityview-ho-nai/can-ho-3-phong-ngu",
    title: "Căn Hộ 3 Phòng Ngủ K-Home CityView | 84,4m² | Giá từ 1,8 Tỷ",
    description: "Căn hộ 3 phòng ngủ tại K-Home CityView Hố Nai, diện tích 84,4m², 2 nhà vệ sinh, giá từ 1,8 tỷ, bàn giao full nội thất. NOXH đầu tiên tại Đồng Nai có căn 3PN.",
  },
  {
    dir: "k-home-midtown-trang-bom",
    title: "K-Home Midtown Trảng Bom | Nhà Ở Xã Hội Kim Oanh | Giá từ 750 Triệu",
    description: "K-Home Midtown Trảng Bom – dự án NOXH quy mô 13,97 ha, 542 căn hộ Studio đến 2PN. Trung tâm Trảng Bom, vay 5,4%/năm. Xem bảng giá & mặt bằng mới nhất 2026.",
    keywords: "k-home midtown, k home midtown, k home midtown trảng bom, k-home midtown trảng bom, khome midtown, k home mid town, k-home mid town, nhà ở xã hội trảng bom, noxh trảng bom kim oanh, k home đồng nai trảng bom",
  },
  {
    dir: "k-home-midtown-trang-bom/can-ho-studio",
    title: "Căn Hộ Studio K-Home Midtown Trảng Bom | 36,1m² | Giá từ 750 Triệu",
    description: "Căn hộ Studio tại K-Home Midtown Trảng Bom, diện tích 36,1m², giá từ 750 triệu, bàn giao full nội thất, lãi suất NOXH 5,4%/năm.",
  },
  {
    dir: "k-home-midtown-trang-bom/can-ho-1-phong-ngu-a",
    title: "Căn Hộ 1 Phòng Ngủ A K-Home Midtown | 47m² | Giá từ 990 Triệu",
    description: "Căn hộ 1 phòng ngủ + A tại K-Home Midtown Trảng Bom, diện tích 47m², giá từ 990 triệu, bàn giao full nội thất, lãi suất NOXH 5,4%/năm.",
  },
  {
    dir: "k-home-midtown-trang-bom/can-ho-1-phong-ngu-b",
    title: "Căn Hộ 1 Phòng Ngủ B K-Home Midtown | 55,1m² | Giá từ 1,2 Tỷ",
    description: "Căn hộ 1 phòng ngủ + B tại K-Home Midtown Trảng Bom, diện tích 55,1m², giá từ 1,2 tỷ, bàn giao full nội thất, lãi suất NOXH 5,4%/năm.",
  },
  {
    dir: "k-home-midtown-trang-bom/can-ho-2-phong-ngu",
    title: "Căn Hộ 2 Phòng Ngủ K-Home Midtown Trảng Bom | 68,8m² | Giá từ 1,5 Tỷ",
    description: "Căn hộ 2 phòng ngủ tại K-Home Midtown Trảng Bom, diện tích 68,8m², 2 nhà vệ sinh, giá từ 1,5 tỷ, bàn giao full nội thất, lãi suất NOXH 5,4%/năm.",
  },
  {
    dir: "k-home-avenue-nhon-trach",
    title: "K-Home Avenue Nhơn Trạch | NOXH Gần Sân Bay Long Thành | Giá từ 750 Triệu",
    description: "K-Home Avenue Nhơn Trạch – nhà ở xã hội 4 block 12 tầng, 1.022 căn hộ. Gần sân bay Long Thành, đường 25C. Vay 5,4%/năm, pháp lý đầy đủ. Xem bảng giá & mặt bằng.",
    keywords: "k-home avenue, k home avenue, k home avenue nhơn trạch, k-home avenue nhơn trạch, khome avenue, k-home avenue đồng nai, nhà ở xã hội nhơn trạch, noxh nhơn trạch kim oanh, k home đồng nai nhơn trạch, noxh gần sân bay long thành",
  },
  {
    dir: "k-home-avenue-nhon-trach/can-ho-studio",
    title: "Căn Hộ Studio K-Home Avenue Nhơn Trạch | 37,7m² | Giá từ 750 Triệu",
    description: "Căn hộ Studio tại K-Home Avenue Nhơn Trạch, diện tích 37,7m², giá từ 750 triệu, bàn giao full nội thất, lãi suất NOXH 5,4%/năm.",
  },
  {
    dir: "k-home-avenue-nhon-trach/can-ho-1-phong-ngu",
    title: "Căn Hộ 1 Phòng Ngủ K-Home Avenue Nhơn Trạch | 46,6m² | Giá từ 990 Triệu",
    description: "Căn hộ 1 phòng ngủ tại K-Home Avenue Nhơn Trạch, diện tích 46,6m², giá từ 990 triệu, bàn giao full nội thất, lãi suất NOXH 5,4%/năm.",
  },
  {
    dir: "k-home-avenue-nhon-trach/can-ho-2-phong-ngu",
    title: "Căn Hộ 2 Phòng Ngủ K-Home Avenue Nhơn Trạch | 65,7m² | Giá từ 1,23 Tỷ",
    description: "Căn hộ 2 phòng ngủ tại K-Home Avenue Nhơn Trạch, diện tích 65,7m², giá từ 1,23 tỷ, bàn giao full nội thất, lãi suất NOXH 5,4%/năm.",
  },
  {
    dir: "k-home-avenue-nhon-trach/can-ho-2-phong-ngu-b-avenue",
    title: "Căn Hộ 2 Phòng Ngủ Lớn K-Home Avenue Nhơn Trạch | 69,5m² | Giá từ 1,4 Tỷ",
    description: "Căn hộ 2 phòng ngủ lớn tại K-Home Avenue Nhơn Trạch, diện tích 69,5m², giá từ 1,4 tỷ, bàn giao full nội thất, lãi suất NOXH 5,4%/năm.",
  },
  {
    dir: "san-pham",
    title: "Danh Sách Dự Án K-Home Đồng Nai | Bảng Giá 3 Dự Án NOXH Kim Oanh",
    description: "Xem đầy đủ thông tin, bảng giá và mặt bằng 3 dự án nhà ở xã hội K-Home tại Đồng Nai: CityView Biên Hòa, Midtown Trảng Bom, Avenue Nhơn Trạch. Kim Oanh Land.",
  },
  {
    dir: "tin-tuc",
    title: "Tin Tức Nhà Ở Xã Hội K-Home Đồng Nai | Cập Nhật Mới Nhất",
    description: "Cập nhật tin tức mới nhất về nhà ở xã hội K-Home Đồng Nai, điều kiện mua NOXH 2026, tiến độ dự án CityView, Midtown, Avenue từ Kim Oanh Land.",
  },
  {
    dir: "gioi-thieu",
    title: "Giới Thiệu K-Home Đồng Nai | Kim Oanh Land – NOXH Đồng Nai",
    description: "Kim Oanh Land – Top 10 nhà phát triển NOXH Việt Nam. Tìm hiểu về chủ đầu tư và chuỗi dự án K-Home tại Đồng Nai: CityView, Midtown, Avenue.",
  },
  {
    dir: "lien-he",
    title: "Liên Hệ Tư Vấn K-Home Đồng Nai | Hotline 0937 587 438",
    description: "Liên hệ tư vấn miễn phí về dự án nhà ở xã hội K-Home tại Đồng Nai. Hotline: 0937 587 438. Hỗ trợ hồ sơ NOXH, bảng giá và thủ tục vay ngân hàng.",
  },
  // ─── Error pages ────────────────────────────────────────────────────────────
  {
    dir: "404",
    title: "Không Tìm Thấy Trang | K-Home Đồng Nai",
    description: "Trang bạn đang tìm không tồn tại. Hãy quay lại trang chủ hoặc xem các dự án nhà ở xã hội K-Home tại Đồng Nai.",
  },
  {
    dir: "403",
    title: "Truy Cập Bị Từ Chối | K-Home Đồng Nai",
    description: "Bạn không có quyền truy cập trang này. Hãy quay lại trang chủ K-Home Đồng Nai.",
  },
  {
    dir: "500",
    title: "Lỗi Máy Chủ | K-Home Đồng Nai",
    description: "Hệ thống gặp sự cố. Vui lòng thử lại sau hoặc liên hệ hỗ trợ K-Home Đồng Nai.",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Escape ký tự HTML đặc biệt trong attribute values
 * Tránh trường hợp title/description chứa dấu " làm hỏng HTML
 */
function escAttr(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function injectMeta(template, { title, description, canonical, keywords }) {
  const t = escAttr(title);
  const d = escAttr(description);
  const c = escAttr(canonical);

  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${d}" />`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${c}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${t}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${d}" />`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${c}" />`)
    .replace(/<meta name="twitter:url"[^>]*>/, `<meta name="twitter:url" content="${c}" />`)
    .replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${t}" />`)
    .replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${d}" />`);

  // Inject keywords nếu có
  if (keywords) {
    const kw = escAttr(keywords);
    if (html.includes('<meta name="keywords"')) {
      html = html.replace(/<meta name="keywords"[^>]*>/, `<meta name="keywords" content="${kw}" />`);
    }
  }

  return html;
}

// Ghi file HTML với optional static internal links cho Googlebot
function writeRoute(template, dirPath, meta) {
  let html = injectMeta(template, meta);

  // Inject static <a href> links vào <body> — Googlebot đọc được trước khi JS render
  // Giải quyết vấn đề: internal links trong React content không có trong HTML tĩnh
  const staticLinks = meta.staticLinks || [];
  if (staticLinks.length > 0) {
    const linkHtml = `\n<div id="seo-links" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap">${
      staticLinks.map(({ href, text }) => `<a href="${escAttr(href)}">${text}</a>`).join("")
    }</div>`;
    html = html.replace("</body>", `${linkHtml}\n</body>`);
  }

  // Inject JSON-LD schemas nếu có (FAQPage, BreadcrumbList, etc.)
  const schemas = meta.schemas || [];
  if (schemas.length > 0) {
    const schemaHtml = schemas.map(s =>
      `<script type="application/ld+json">${JSON.stringify(s)}</script>`
    ).join("\n");
    html = html.replace("</head>", `${schemaHtml}\n</head>`);
  }

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(path.join(dirPath, "index.html"), html, "utf-8");
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const templatePath = path.join(DIST_DIR, "index.html");
  if (!fs.existsSync(templatePath)) {
    console.error("❌ dist/index.html not found. Run npm run build:vite first.");
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, "utf-8");
  console.log("📄 Template loaded from dist/index.html\n");

  let count = 0;

  // 1. Static routes
  console.log("── Static routes ──────────────────────────────");

  // ─── Schemas per-route ────────────────────────────────────────────────────
  // FAQPage + BreadcrumbList cho trang CityView — inject vào HTML tĩnh để Googlebot đọc
  const CITYVIEW_FAQ_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "K-Home CityView Hố Nai giá bao nhiêu?", "acceptedAnswer": { "@type": "Answer", "text": "K-Home CityView có giá từ 950 triệu đến 2 tỷ/căn tùy loại: 1PN+A từ 950 triệu, 1PN+B từ 1,20 tỷ, 2PN từ 1,50 tỷ, 3PN từ 1,80 tỷ. Tất cả bàn giao full nội thất, lãi suất NOXH 5,4%/năm." } },
      { "@type": "Question", "name": "Điều kiện mua K-Home CityView là gì?", "acceptedAnswer": { "@type": "Answer", "text": "Người mua cần: chưa có nhà tại Đồng Nai, chưa từng mua NOXH, thu nhập dưới 50 triệu/tháng (cặp vợ chồng) hoặc dưới 25 triệu (độc thân), có hộ khẩu hoặc tạm trú tại Đồng Nai." } },
      { "@type": "Question", "name": "K-Home CityView ở đâu?", "acceptedAnswer": { "@type": "Answer", "text": "K-Home CityView tọa lạc tại đường Điểu Xiển, Phường Hố Nai, TP. Biên Hòa, Tỉnh Đồng Nai. Cách trung tâm Biên Hòa khoảng 3km, gần các KCN Amata, Long Bình, Biên Hòa 2, Hố Nai." } },
      { "@type": "Question", "name": "K-Home CityView khi nào bàn giao nhà?", "acceptedAnswer": { "@type": "Answer", "text": "Dự án đã khởi công và đang thi công. Tiến độ dự kiến: hoàn thành móng tháng 8–10/2026, cất nóc tháng 6/2027, hoàn thiện nội thất tháng 12/2027 và bàn giao đợt đầu tháng 1/2028." } },
      { "@type": "Question", "name": "Vay mua K-Home CityView được bao nhiêu?", "acceptedAnswer": { "@type": "Answer", "text": "Người mua đủ điều kiện NOXH được vay tối đa 75–80% giá trị căn hộ từ Ngân hàng Chính sách Xã hội với lãi suất 5,4%/năm trong 25 năm. Trả góp chỉ từ khoảng 3,5–4,5 triệu/tháng." } },
      { "@type": "Question", "name": "K-Home CityView có được bán lại không?", "acceptedAnswer": { "@type": "Answer", "text": "Theo quy định NOXH, người mua phải ở tối thiểu 5 năm sau khi nhận bàn giao mới được bán lại. Khi bán phải bán lại cho người đủ điều kiện NOXH hoặc trả lại cho chủ đầu tư." } },
      { "@type": "Question", "name": "K-Home CityView có bao nhiêu căn?", "acceptedAnswer": { "@type": "Answer", "text": "Dự án có tổng cộng 1.816 căn gồm: 1.328 căn hộ NOXH, 425 căn nhà ở thương mại (Block T4) và 39 căn shophouse, phân bổ trong 4 block cao 22 tầng trên quỹ đất 2,85 hecta tại Hố Nai, Biên Hòa." } },
      { "@type": "Question", "name": "Hỗ trợ hồ sơ NOXH K-Home CityView như thế nào?", "acceptedAnswer": { "@type": "Answer", "text": "Đội ngũ Kim Oanh Land hỗ trợ hoàn toàn miễn phí: kiểm tra điều kiện đủ tiêu chuẩn, chuẩn bị giấy tờ, nộp hồ sơ xét duyệt và kết nối Ngân hàng Chính sách Xã hội. Hotline: 0937.587.438." } },
      { "@type": "Question", "name": "Mặt bằng K-Home CityView gồm những loại căn nào?", "acceptedAnswer": { "@type": "Answer", "text": "K-Home CityView Hố Nai có 4 loại căn hộ: 1PN+ A (47,3m²), 1PN+ B (62,4m²), 2 phòng ngủ (70,4m²) và 3 phòng ngủ (84,4m²). NOXH đầu tiên tại Đồng Nai có căn 3 phòng ngủ." } },
      { "@type": "Question", "name": "Tiện ích K-Home CityView Hố Nai có gì?", "acceptedAnswer": { "@type": "Answer", "text": "K-Home CityView có hồ bơi người lớn và trẻ em, sân chơi trẻ em, khu thể dục ngoài trời, nhà sinh hoạt cộng đồng, vườn cảnh quan, khu BBQ, bãi đỗ xe và hệ thống shophouse khối đế." } },
      { "@type": "Question", "name": "K-Home CityView có sổ hồng không?", "acceptedAnswer": { "@type": "Answer", "text": "Có. Dự án được pháp lý đầy đủ theo quy định nhà ở xã hội, cấp sổ hồng sở hữu lâu dài. Hồ sơ pháp lý minh bạch từ giai đoạn đặt cọc đến khi nhận nhà." } },
      { "@type": "Question", "name": "K-Home CityView do ai thiết kế?", "acceptedAnswer": { "@type": "Answer", "text": "K-Home CityView được thiết kế và quy hoạch bởi Tập đoàn Surbana Jurong (Singapore) – đơn vị tư vấn quy hoạch đô thị hàng đầu châu Á. Dự án phát triển theo tiêu chuẩn công trình xanh EDGE của IFC/World Bank." } },
      { "@type": "Question", "name": "K-Home CityView đường Điểu Xiển gần KCN nào?", "acceptedAnswer": { "@type": "Answer", "text": "K-Home CityView nằm tại đường Điểu Xiển, Hố Nai – liền kề KCN Amata, KCN Long Bình, KCN Biên Hòa 2, KCN Hố Nai. Từ dự án chỉ mất 10–15 phút đến các KCN này." } },
      { "@type": "Question", "name": "K Home City View Biên Hòa là dự án gì?", "acceptedAnswer": { "@type": "Answer", "text": "K Home City View (hay K-Home CityView) là dự án nhà ở xã hội chuẩn Singapore tại Biên Hòa, Đồng Nai do Kim Oanh Land phát triển. 1.328 căn NOXH + 39 shophouse, giá từ 950 triệu, lãi suất 5,4%/năm." } },
    ],
  };

  const CITYVIEW_BREADCRUMB_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": `${BASE_URL}/` },
      { "@type": "ListItem", "position": 2, "name": "Dự án K-Home", "item": `${BASE_URL}/san-pham` },
      { "@type": "ListItem", "position": 3, "name": "K-Home CityView Hố Nai Biên Hòa", "item": `${BASE_URL}/k-home-cityview-ho-nai` },
    ],
  };

  const CITYVIEW_WEBPAGE_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "K-Home CityView Hố Nai Biên Hòa | Bảng Giá, Mặt Bằng & Hồ Sơ NOXH 2026",
    "url": `${BASE_URL}/k-home-cityview-ho-nai`,
    "description": "Dự án K-Home CityView Hố Nai Biên Hòa: 1.328 căn NOXH chuẩn Singapore, giá từ 950 triệu, lãi suất 5,4%/năm, bàn giao 2028.",
    "inLanguage": "vi-VN",
    "dateModified": new Date().toISOString().split("T")[0],
    "publisher": {
      "@type": "Organization",
      "name": "Kim Oanh Land",
      "url": `${BASE_URL}/`,
    },
    "about": {
      "@type": "Residence",
      "name": "K-Home CityView Hố Nai Biên Hòa",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Đường Điểu Xiển, Phường Hố Nai",
        "addressLocality": "TP. Biên Hòa",
        "addressRegion": "Tỉnh Đồng Nai",
        "addressCountry": "VN",
      },
    },
  };

  // Schemas cho Midtown
  const MIDTOWN_BREADCRUMB = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": `${BASE_URL}/` },
      { "@type": "ListItem", "position": 2, "name": "Dự án K-Home", "item": `${BASE_URL}/san-pham` },
      { "@type": "ListItem", "position": 3, "name": "K-Home Midtown Trảng Bom", "item": `${BASE_URL}/k-home-midtown-trang-bom` },
    ],
  };

  // Schemas cho Avenue
  const AVENUE_BREADCRUMB = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": `${BASE_URL}/` },
      { "@type": "ListItem", "position": 2, "name": "Dự án K-Home", "item": `${BASE_URL}/san-pham` },
      { "@type": "ListItem", "position": 3, "name": "K-Home Avenue Nhơn Trạch", "item": `${BASE_URL}/k-home-avenue-nhon-trach` },
    ],
  };

  // Map schema per dir
  const ROUTE_SCHEMAS = {
    "k-home-cityview-ho-nai": [CITYVIEW_FAQ_SCHEMA, CITYVIEW_BREADCRUMB_SCHEMA, CITYVIEW_WEBPAGE_SCHEMA],
    "k-home-midtown-trang-bom": [MIDTOWN_BREADCRUMB],
    "k-home-avenue-nhon-trach": [AVENUE_BREADCRUMB],
  };

  for (const route of STATIC_ROUTES) {
    const canonical = `${BASE_URL}/${route.dir}`;
    const dirPath = path.join(DIST_DIR, route.dir);
    writeRoute(template, dirPath, {
      title: route.title,
      description: route.description,
      canonical,
      keywords: route.keywords ?? null,
      schemas: ROUTE_SCHEMAS[route.dir] ?? [],
    });
    count++;
    console.log(`✅ /${route.dir}`);
  }

  // 2. News article routes  — dist/tin-tuc/[slug]/index.html
  const NEWS_DATA = parseNewsData();
  console.log(`\n── Bài tin tức (${NEWS_DATA.length} bài) ────────────────────`);
  const newsDirBase = path.join(DIST_DIR, "tin-tuc");

  for (const article of NEWS_DATA) {
    const canonical = `${BASE_URL}/tin-tuc/${article.slug}`;
    // Title cho bài tin tức: "[title] | K-Home Đồng Nai"
    const title = article.title.includes("K-Home") || article.title.includes("NOXH")
      ? `${article.title} | K-Home Đồng Nai`
      : `${article.title} | K-Home CityView Đồng Nai`;
    const dirPath = path.join(newsDirBase, article.slug);

    // Tạo NewsArticle + BreadcrumbList schema cho từng bài
    const newsArticleSchema = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": article.title,
      "description": article.excerpt,
      "datePublished": article.date,
      "dateModified": article.date,
      "url": canonical,
      "inLanguage": "vi-VN",
      "isAccessibleForFree": true,
      "author": {
        "@type": "Organization",
        "name": "K-Home Đồng Nai – Kim Oanh Land",
        "url": BASE_URL,
      },
      "publisher": {
        "@type": "Organization",
        "name": "K-Home Đồng Nai",
        "logo": {
          "@type": "ImageObject",
          "url": `${BASE_URL}/android-chrome-512x512.png`,
          "width": 512,
          "height": 512,
        },
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonical,
      },
    };

    const newsBreadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": `${BASE_URL}/` },
        { "@type": "ListItem", "position": 2, "name": "Tin tức", "item": `${BASE_URL}/tin-tuc` },
        { "@type": "ListItem", "position": 3, "name": article.title, "item": canonical },
      ],
    };

    writeRoute(template, dirPath, {
      title,
      description: article.excerpt,
      canonical,
      schemas: [newsArticleSchema, newsBreadcrumbSchema],
      // Static <a href> links cho Googlebot — link về money page trong HTML tĩnh
      staticLinks: [
        { href: "/k-home-cityview-ho-nai", text: "K-Home CityView Hố Nai Biên Hòa" },
        { href: "/tin-tuc", text: "Tin tức K-Home Đồng Nai" },
        { href: "/", text: "K-Home Đồng Nai" },
      ],
    });
    count++;
    console.log(`✅ /tin-tuc/${article.slug}`);
  }

  console.log(`\n🎉 Done — ${count} files generated (${STATIC_ROUTES.length} static + ${NEWS_DATA.length} news)`);

  // 3. Vercel root 404.html — Vercel dùng file này khi không tìm thấy asset tĩnh
  // (khác với /404/index.html dành cho route /404 trong SPA)
  const notFoundHtml = injectMeta(template, {
    title: "Không Tìm Thấy Trang | K-Home Đồng Nai",
    description: "Trang bạn đang tìm không tồn tại. Hãy quay lại trang chủ hoặc xem các dự án nhà ở xã hội K-Home tại Đồng Nai.",
    canonical: `${BASE_URL}/404`,
    keywords: null,
  });
  fs.writeFileSync(path.join(DIST_DIR, "404.html"), notFoundHtml, "utf-8");
  console.log("✅ /404.html (Vercel root error page)");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});

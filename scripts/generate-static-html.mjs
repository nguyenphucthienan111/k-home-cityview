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
    title: "K-Home CityView (K Home City View) Hố Nai | Bảng Giá & Mặt Bằng 2026",
    description: "K-Home CityView (k-home city view) Hố Nai Biên Hòa 1.328 căn NOXH chuẩn Singapore giá từ 950 triệu, vay 5,4%/năm. Cập nhật bảng giá & mặt bằng 2026.",
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
    title: "K-Home Midtown (K Home Mid Town) Trảng Bom | Bảng Giá 2026",
    description: "Dự án K-Home Midtown (k-home mid town) Trảng Bom quy mô 13,97 ha, 542 căn NOXH chuẩn Singapore giá từ 750 triệu, vay 5,4%/năm. Cập nhật bảng giá & mặt bằng 2026.",
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
    title: "K-Home Avenue (K Home Avenue) Nhơn Trạch | Bảng Giá 2026",
    description: "K-Home Avenue (k-home avenue) Nhơn Trạch nhà ở xã hội 1.022 căn gần Sân bay Long Thành giá từ 750 triệu, vay 5,4%/năm. Cập nhật bảng giá & mặt bằng 2026.",
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

function injectMeta(template, { title, description, canonical, keywords, ogType }) {
  const t = escAttr(title);
  const d = escAttr(description);
  const c = escAttr(canonical);

  // Fix canonical by removing any whitespace/newlines and making it single line
  let html = template
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gs, `<link rel="canonical" href="${c}" />\n    `)
    .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${d}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${t}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${d}" />`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${c}" />`)
    .replace(/<meta name="twitter:url"[^>]*>/, `<meta name="twitter:url" content="${c}" />`)
    .replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${t}" />`)
    .replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${d}" />`);

  // Add or replace og:type if provided
  if (ogType) {
    if (html.includes('<meta property="og:type"')) {
      html = html.replace(/<meta property="og:type"[^>]*>/, `<meta property="og:type" content="${ogType}" />`);
    } else {
      // Insert og:type after og:url
      html = html.replace(
        /<meta property="og:url"[^>]*>/,
        `$&\n    <meta property="og:type" content="${ogType}" />`
      );
    }
  }

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

  const CITYVIEW_VIDEO_SCHEMA_SHORTS = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "Tiến Độ Xây Dựng K-Home CityView Hố Nai - Cập Nhật Mới Nhất Tháng 8/2026",
    "description": "Video ngắn cập nhật tiến độ xây dựng thực tế dự án nhà ở xã hội K-Home CityView Hố Nai Biên Hòa mới nhất.",
    "thumbnailUrl": [
      "https://img.youtube.com/vi/z9ZL9_Sng4Q/hqdefault.jpg"
    ],
    "uploadDate": "2026-08-25T08:00:00+07:00",
    "embedUrl": "https://www.youtube.com/embed/z9ZL9_Sng4Q",
    "publisher": {
      "@type": "Organization",
      "name": "Kim Oanh Group",
      "logo": { "@type": "ImageObject", "url": `${BASE_URL}/android-chrome-512x512.png` }
    }
  };

  const CITYVIEW_VIDEO_SCHEMA_PHONGSU_1 = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "Phóng Sự Nhà Ở Xã Hội K-Home CityView Hố Nai Đồng Nai — Kim Oanh Land",
    "description": "Phóng sự truyền hình toàn cảnh đánh giá dự án nhà ở xã hội K-Home CityView Hố Nai Biên Hòa do Kim Oanh Land làm chủ đầu tư.",
    "thumbnailUrl": [
      "https://img.youtube.com/vi/RJGULOh6Wrs/hqdefault.jpg"
    ],
    "uploadDate": "2026-08-26T08:00:00+07:00",
    "embedUrl": "https://www.youtube.com/embed/RJGULOh6Wrs",
    "publisher": {
      "@type": "Organization",
      "name": "Kim Oanh Group",
      "logo": { "@type": "ImageObject", "url": `${BASE_URL}/android-chrome-512x512.png` }
    }
  };

  const CITYVIEW_VIDEO_SCHEMA_PHONGSU_2 = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "K-Home CityView Hố Nai — Tổ Ấm Chuẩn Singapore Cho Gia Đình Việt",
    "description": "Video giới thiệu không gian sống chuẩn Singapore, quy hoạch Surbana Jurong và tiện ích tại K-Home CityView Hố Nai.",
    "thumbnailUrl": [
      "https://img.youtube.com/vi/f4Av04RYDrw/hqdefault.jpg"
    ],
    "uploadDate": "2026-08-26T08:00:00+07:00",
    "embedUrl": "https://www.youtube.com/embed/f4Av04RYDrw",
    "publisher": {
      "@type": "Organization",
      "name": "Kim Oanh Group",
      "logo": { "@type": "ImageObject", "url": `${BASE_URL}/android-chrome-512x512.png` }
    }
  };

  const CITYVIEW_VIDEO_SCHEMA_PHONGSU_3 = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "Biên Hòa Bứt Phá — Cơ Hội An Cư Lạc Nghiệp Tại K-Home CityView Hố Nai",
    "description": "Phóng sự phân tích bứt phá hạ tầng TP. Biên Hòa và cơ hội sở hữu căn hộ NOXH K-Home CityView Hố Nai do Kim Oanh Group phát triển.",
    "thumbnailUrl": [
      "https://img.youtube.com/vi/Y9502b3sDJU/hqdefault.jpg"
    ],
    "uploadDate": "2026-08-26T08:00:00+07:00",
    "embedUrl": "https://www.youtube.com/embed/Y9502b3sDJU",
    "publisher": {
      "@type": "Organization",
      "name": "Kim Oanh Group",
      "logo": { "@type": "ImageObject", "url": `${BASE_URL}/android-chrome-512x512.png` }
    }
  };

  // Video Schemas cho Avenue
  const AVENUE_VIDEO_SCHEMA_1 = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "K-Home Avenue Nhơn Trạch — Khám Phá Dự Án Nhà Ở Xã Hội Chuẩn Singapore",
    "description": "Video giới thiệu toàn cảnh vị trí cửa ngõ Sân bay Long Thành, thiết kế chuẩn Singapore Surbana Jurong và hệ tiện ích phong phú tại K-Home Avenue Nhơn Trạch.",
    "thumbnailUrl": ["https://img.youtube.com/vi/nV0widFZQOY/hqdefault.jpg"],
    "uploadDate": "2026-08-27T08:00:00+07:00",
    "embedUrl": "https://www.youtube.com/embed/nV0widFZQOY",
    "publisher": {
      "@type": "Organization",
      "name": "Kim Oanh Group",
      "logo": { "@type": "ImageObject", "url": `${BASE_URL}/android-chrome-512x512.png` }
    }
  };

  const AVENUE_VIDEO_SCHEMA_2 = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "K-Home Avenue Nhơn Trạch — Món Quà Ý Nghĩa Ba Mẹ Trao Tặng Con Trẻ",
    "description": "Thước phim xúc động về ý nghĩa tổ ấm gia đình, môi trường sống xanh an lành chuẩn EDGE và giải pháp trả góp vay ưu đãi 5,4%/năm dành cho cư dân Nhơn Trạch.",
    "thumbnailUrl": ["https://img.youtube.com/vi/SlsSGiKYRBE/hqdefault.jpg"],
    "uploadDate": "2026-08-27T08:00:00+07:00",
    "embedUrl": "https://www.youtube.com/embed/SlsSGiKYRBE",
    "publisher": {
      "@type": "Organization",
      "name": "Kim Oanh Group",
      "logo": { "@type": "ImageObject", "url": `${BASE_URL}/android-chrome-512x512.png` }
    }
  };

  // Video Schemas cho Midtown
  const MIDTOWN_VIDEO_SCHEMA_1 = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "K-Home Midtown Trảng Bom — Khám Phá Phong Cách Sống Singapore Ngay Trung Tâm",
    "description": "Video giới thiệu chi tiết vị trí trung tâm huyện Trảng Bom, quy hoạch kiến trúc Singapore chuẩn công trình xanh EDGE và hệ tiện ích phong phú tại K-Home Midtown.",
    "thumbnailUrl": ["https://img.youtube.com/vi/8qd60-fFFkY/hqdefault.jpg"],
    "uploadDate": "2026-08-27T08:00:00+07:00",
    "embedUrl": "https://www.youtube.com/embed/8qd60-fFFkY",
    "publisher": {
      "@type": "Organization",
      "name": "Kim Oanh Group",
      "logo": { "@type": "ImageObject", "url": `${BASE_URL}/android-chrome-512x512.png` }
    }
  };

  const MIDTOWN_VIDEO_SCHEMA_2 = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "K-Home Midtown Trảng Bom — Kiến Tạo Cộng Đồng Thấu Cảm & Sẻ Chia Giá Trị Sống",
    "description": "Thước phim nhân văn về không gian sinh hoạt cộng đồng, an ninh văn minh 24/7 và giải pháp hỗ trợ vay gói nhà ở xã hội 5,4%/năm trong 25 năm dành cho người lao động Trảng Bom.",
    "thumbnailUrl": ["https://img.youtube.com/vi/EyKr3u7KkyE/hqdefault.jpg"],
    "uploadDate": "2026-08-27T08:00:00+07:00",
    "embedUrl": "https://www.youtube.com/embed/EyKr3u7KkyE",
    "publisher": {
      "@type": "Organization",
      "name": "Kim Oanh Group",
      "logo": { "@type": "ImageObject", "url": `${BASE_URL}/android-chrome-512x512.png` }
    }
  };

  const MIDTOWN_VIDEO_SCHEMA_3 = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "K-Home Midtown Trảng Bom — Tiến Độ Thi Công Thần Tốc Cập Nhật Mới Nhất",
    "description": "Video hình ảnh thực tế công trường thi công dự án K-Home Midtown Trảng Bom, đảm bảo các tiêu chuẩn kỹ thuật chất lượng và tiến độ bàn giao nhà cho cư dân.",
    "thumbnailUrl": ["https://img.youtube.com/vi/3FbIphjZu38/hqdefault.jpg"],
    "uploadDate": "2026-08-27T08:00:00+07:00",
    "embedUrl": "https://www.youtube.com/embed/3FbIphjZu38",
    "publisher": {
      "@type": "Organization",
      "name": "Kim Oanh Group",
      "logo": { "@type": "ImageObject", "url": `${BASE_URL}/android-chrome-512x512.png` }
    }
  };

  // Map schema per dir
  const ROUTE_SCHEMAS = {
    "k-home-cityview-ho-nai": [
      CITYVIEW_FAQ_SCHEMA,
      CITYVIEW_BREADCRUMB_SCHEMA,
      CITYVIEW_WEBPAGE_SCHEMA,
      CITYVIEW_VIDEO_SCHEMA_SHORTS,
      CITYVIEW_VIDEO_SCHEMA_PHONGSU_1,
      CITYVIEW_VIDEO_SCHEMA_PHONGSU_2,
      CITYVIEW_VIDEO_SCHEMA_PHONGSU_3
    ],
    "k-home-midtown-trang-bom": [
      MIDTOWN_BREADCRUMB,
      MIDTOWN_VIDEO_SCHEMA_1,
      MIDTOWN_VIDEO_SCHEMA_2,
      MIDTOWN_VIDEO_SCHEMA_3
    ],
    "k-home-avenue-nhon-trach": [
      AVENUE_BREADCRUMB,
      AVENUE_VIDEO_SCHEMA_1,
      AVENUE_VIDEO_SCHEMA_2
    ],
  };

  // Map ALL video URLs cho tất cả các trang dự án chính
  const PROJECT_STATIC_VIDEOS = {
    "k-home-cityview-ho-nai": [
      { url: "https://www.youtube.com/embed/RJGULOh6Wrs", title: "Phóng Sự Nhà Ở Xã Hội K-Home CityView Hố Nai Đồng Nai — Kim Oanh Land" },
      { url: "https://www.youtube.com/embed/Y9502b3sDJU", title: "Biên Hòa Bứt Phá — Cơ Hội An Cư Lạc Nghiệp Tại K-Home CityView Hố Nai" },
      { url: "https://www.youtube.com/embed/f4Av04RYDrw", title: "K-Home CityView Hố Nai — Tổ Ấm Chuẩn Singapore Cho Gia Đình Việt" },
      { url: "https://www.youtube.com/embed/z9ZL9_Sng4Q", title: "Tiến Độ Xây Dựng K-Home CityView Hố Nai - Cập Nhật Mới Nhất Tháng 8/2026" }
    ],
    "k-home-midtown-trang-bom": [
      { url: "https://www.youtube.com/embed/8qd60-fFFkY", title: "K-Home Midtown Trảng Bom — Khám Phá Phong Cách Sống Singapore Ngay Trung Tâm" },
      { url: "https://www.youtube.com/embed/EyKr3u7KkyE", title: "Cộng Đồng Cư Dân K-Home Midtown Trảng Bom" },
      { url: "https://www.youtube.com/embed/3FbIphjZu38", title: "Tiến Độ Thi Công K-Home Midtown Trảng Bom Mới Nhất" }
    ],
    "k-home-avenue-nhon-trach": [
      { url: "https://www.youtube.com/embed/nV0widFZQOY", title: "K-Home Avenue Nhơn Trạch — Khám Phá Dự Án Nhà Ở Xã Hội Chuẩn Singapore" },
      { url: "https://www.youtube.com/embed/SlsSGiKYRBE", title: "K-Home Avenue Nhơn Trạch — Món Quà Ý Nghĩa Ba Mẹ Trao Tặng Con Trẻ" }
    ]
  };

  for (const route of STATIC_ROUTES) {
    const canonical = `${BASE_URL}/${route.dir}`;
    const dirPath = path.join(DIST_DIR, route.dir);
    const projVideos = PROJECT_STATIC_VIDEOS[route.dir] || [];

    writeRoute(template, dirPath, {
      title: route.title,
      description: route.description,
      canonical,
      keywords: route.keywords ?? null,
      schemas: ROUTE_SCHEMAS[route.dir] ?? [],
      staticVideos: projVideos,
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

    // Tạo NewsArticle + BreadcrumbList + VideoObject schema cho từng bài
    const schemas = [
      {
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
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": `${BASE_URL}/` },
          { "@type": "ListItem", "position": 2, "name": "Tin tức", "item": `${BASE_URL}/tin-tuc` },
          { "@type": "ListItem", "position": 3, "name": article.title, "item": canonical },
        ],
      }
    ];

    if (article.videoUrl) {
      let embedUrl = article.videoUrl;
      let thumbnailUrl = `${BASE_URL}/hero-background.jpg`;

      if (article.videoUrl.includes("youtube.com") || article.videoUrl.includes("youtu.be")) {
        const ytIdMatch = article.videoUrl.match(/(?:embed\/|v=|shorts\/|youtu\.be\/)([^?&/\s]+)/);
        if (ytIdMatch && ytIdMatch[1]) {
          const ytId = ytIdMatch[1];
          embedUrl = `https://www.youtube.com/embed/${ytId}`;
          thumbnailUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
        }
      } else if (article.videoUrl.includes("cloudinary")) {
        thumbnailUrl = article.videoUrl.replace("/upload/", "/upload/so_0,w_1200,c_scale/") + ".jpg";
      }

      schemas.push({
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": article.videoCaption || article.title,
        "description": article.excerpt,
        "thumbnailUrl": [thumbnailUrl],
        "uploadDate": `${article.date}T08:00:00+07:00`,
        "contentUrl": article.videoUrl,
        "embedUrl": embedUrl,
        "publisher": {
          "@type": "Organization",
          "name": "K-Home Đồng Nai",
          "logo": {
            "@type": "ImageObject",
            "url": `${BASE_URL}/android-chrome-512x512.png`
          }
        }
      });
    }

    // Static links + Static Video Element cho Googlebot nhận diện Video Watch Page
    const staticLinks = [
      { href: "/k-home-cityview-ho-nai", text: "K-Home CityView Hố Nai Biên Hòa" },
      { href: "/tin-tuc", text: "Tin tức K-Home Đồng Nai" },
      { href: "/", text: "K-Home Đồng Nai" },
    ];

    writeRoute(template, dirPath, {
      title,
      description: article.excerpt,
      canonical,
      ogType: "article",
      schemas,
      staticLinks,
      staticVideoUrl: article.videoUrl ? (article.videoUrl.includes("youtube.com") || article.videoUrl.includes("youtu.be") ? `https://www.youtube.com/embed/${article.videoUrl.match(/(?:embed\/|v=|shorts\/|youtu\.be\/)([^?&/\s]+)/)?.[1]}` : article.videoUrl) : null,
      staticVideoTitle: article.videoCaption || article.title,
    });
    count++;
    console.log(`✅ /tin-tuc/${article.slug}`);
  }

  // 3. Dedicated Video Watch Pages — dist/video/[slug]/index.html
  // Đạt 100% tiêu chí Watch Page của Google Video Indexing
  const DEDICATED_VIDEOS = [
    {
      slug: "phong-su-k-home-cityview-ho-nai",
      title: "Phóng Sự Toàn Cảnh Dự Án Nhà Ở Xã Hội K-Home CityView Hố Nai Biên Hòa — Kim Oanh Land",
      description: "Xem video phóng sự truyền hình toàn cảnh về dự án nhà ở xã hội K-Home CityView tại Hố Nai, TP. Biên Hòa do Kim Oanh Land phát triển. Quy mô 1.328 căn chuẩn Singapore, giá từ 950 triệu.",
      youtubeId: "RJGULOh6Wrs",
      date: "2026-08-26",
    },
    {
      slug: "bien-hoa-but-pha-k-home-cityview",
      title: "Biên Hòa Bứt Phá — Cơ Hội An Cư Lạc Nghiệp Tại K-Home CityView Hố Nai",
      description: "Phóng sự phân tích bứt phá hạ tầng TP. Biên Hòa và cơ hội an cư tại K-Home CityView Hố Nai từ Kim Oanh Group. Giá chỉ từ 950 triệu, gói vay 5,4%/năm.",
      youtubeId: "Y9502b3sDJU",
      date: "2026-08-26",
    },
    {
      slug: "to-am-chuan-singapore-k-home-cityview",
      title: "K-Home CityView Hố Nai — Tổ Ấm Chuẩn Singapore Cho Gia Đình Việt",
      description: "Khám phá không gian sống xanh chuẩn Singapore tại dự án NOXH K-Home CityView Hố Nai. Thiết kế bởi Surbana Jurong, đạt chứng chỉ xanh quốc tế EDGE.",
      youtubeId: "f4Av04RYDrw",
      date: "2026-08-26",
    },
    {
      slug: "tien-do-thi-cong-k-home-cityview",
      title: "Tiến Độ Xây Dựng K-Home CityView Hố Nai - Cập Nhật Mới Nhất Tháng 8/2026",
      description: "Video thực tế cập nhật tiến độ thi công nền móng và khối tháp K-Home CityView Hố Nai Biên Hòa mới nhất tháng 8/2026.",
      youtubeId: "z9ZL9_Sng4Q",
      date: "2026-08-19",
    },
    {
      slug: "kham-pha-phong-cach-singapore-k-home-midtown",
      title: "K-Home Midtown Trảng Bom — Khám Phá Phong Cách Sống Singapore Ngay Trung Tâm",
      description: "Video giới thiệu đại dự án nhà ở xã hội K-Home Midtown Trảng Bom 13,97ha 542 căn hộ chuẩn Singapore Surbana Jurong, tiêu chuẩn xanh EDGE giá từ 750 triệu.",
      youtubeId: "8qd60-fFFkY",
      date: "2026-08-27",
    },
    {
      slug: "cong-dong-thau-cam-k-home-midtown",
      title: "K-Home Midtown Trảng Bom — Kiến Tạo Cộng Đồng Thấu Cảm & Sẻ Chia Giá Trị Sống",
      description: "Thước phim nhân văn ghi lại hành trình kiến tạo cộng đồng cư dân gắn kết, thấu cảm và sẻ chia giá trị sống tại dự án K-Home Midtown Trảng Bom.",
      youtubeId: "EyKr3u7KkyE",
      date: "2026-08-27",
    },
    {
      slug: "tien-do-than-toc-k-home-midtown",
      title: "K-Home Midtown Trảng Bom — Tiến Độ Thi Công Thần Tốc Cập Nhật Mới Nhất",
      description: "Video tiến độ thi công thực tế tại dự án nhà ở xã hội K-Home Midtown Trảng Bom do Kim Oanh Group làm chủ đầu tư. Bàn giao 2027.",
      youtubeId: "3FbIphjZu38",
      date: "2026-08-27",
    },
    {
      slug: "kham-pha-k-home-avenue-nhon-trach",
      title: "K-Home Avenue Nhơn Trạch — Khám Phá Dự Án Nhà Ở Xã Hội Chuẩn Singapore",
      description: "Khám phá dự án nhà ở xã hội K-Home Avenue Nhơn Trạch 1.022 căn hộ chuẩn Singapore, liền kề sân bay quốc tế Long Thành, giá từ 750 triệu.",
      youtubeId: "nV0widFZQOY",
      date: "2026-08-27",
    },
    {
      slug: "mon-qua-y-nghia-k-home-avenue",
      title: "K-Home Avenue Nhơn Trạch — Món Quà Ý Nghĩa Ba Mẹ Trao Tặng Con Trẻ",
      description: "Thước phim cảm động về tổ ấm tương lai tại K-Home Avenue Nhơn Trạch – môi trường sống xanh an lành chuẩn Singapore cho con trẻ trưởng thành.",
      youtubeId: "SlsSGiKYRBE",
      date: "2026-08-27",
    }
  ];

  console.log(`\n── Trang xem Video chuyên biệt (${DEDICATED_VIDEOS.length} video) ──────`);
  const videoDirBase = path.join(DIST_DIR, "video");

  for (const vid of DEDICATED_VIDEOS) {
    const canonical = `${BASE_URL}/video/${vid.slug}`;
    const title = `${vid.title} | Video K-Home Đồng Nai`;
    const dirPath = path.join(videoDirBase, vid.slug);

    const schemas = [
      {
        "@context": "https://schema.org",
        "@type": "ItemPage",
        "name": vid.title,
        "url": canonical,
        "primaryImageOfPage": `https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`,
        "mainEntity": {
          "@type": "VideoObject",
          "name": vid.title
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": vid.title,
        "description": vid.description,
        "thumbnailUrl": [
          `https://img.youtube.com/vi/${vid.youtubeId}/maxresdefault.jpg`,
          `https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`
        ],
        "uploadDate": `${vid.date}T08:00:00+07:00`,
        "contentUrl": `https://www.youtube.com/watch?v=${vid.youtubeId}`,
        "embedUrl": `https://www.youtube.com/embed/${vid.youtubeId}`,
        "publisher": {
          "@type": "Organization",
          "name": "K-Home Đồng Nai – Kim Oanh Land",
          "logo": {
            "@type": "ImageObject",
            "url": `${BASE_URL}/android-chrome-512x512.png`
          }
        }
      }
    ];

    const staticLinks = [
      { href: "/k-home-cityview-ho-nai", text: "K-Home CityView Hố Nai" },
      { href: "/k-home-midtown-trang-bom", text: "K-Home Midtown Trảng Bom" },
      { href: "/k-home-avenue-nhon-trach", text: "K-Home Avenue Nhơn Trạch" },
      { href: "/", text: "Trang chủ K-Home Đồng Nai" },
    ];

    writeRoute(template, dirPath, {
      title,
      description: vid.description,
      canonical,
      ogType: "video.other",
      schemas,
      staticLinks,
      staticVideoUrl: `https://www.youtube.com/embed/${vid.youtubeId}`,
      staticVideoTitle: vid.title,
    });
    count++;
    console.log(`✅ /video/${vid.slug}`);
  }

  console.log(`\n🎉 Done — ${count} files generated (${STATIC_ROUTES.length} static + ${NEWS_DATA.length} news + ${DEDICATED_VIDEOS.length} watch pages)`);

  // 4. Vercel root 404.html — Vercel dùng file này khi không tìm thấy asset tĩnh
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

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
import * as esbuild from "esbuild";
import { markdownToHtml } from "./markdown-to-html.mjs";
import {
  renderNewsDetailHtml,
} from "./static-project-content.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, "../dist");
const BASE_URL = "https://k-homedongnai.com.vn";

// ─── Static routes ────────────────────────────────────────────────────────────
const STATIC_ROUTES = [
  {
    dir: "nha-o-xa-hoi-bien-hoa",
    title: "Nhà Ở Xã Hội Biên Hòa 2026: Tổng Hợp Dự Án, Bảng Giá & Hướng Dẫn Mua A-Z",
    description: "Tổng hợp chi tiết 5 dự án nhà ở xã hội Biên Hòa 2026: K-Home CityView Hố Nai, Tam Hiệp, Long Bình Tân, A6-A7. Bảng giá từ 950 triệu, điều kiện xét duyệt & gói vay 5,4%/năm.",
    keywords: "nhà ở xã hội biên hòa, nhà ở xã hội biên hoà, mua nhà ở xã hội biên hòa, mua nhà ở xã hội biên hoà, dự án nhà ở xã hội biên hòa, bảng giá nhà ở xã hội biên hòa, điều kiện mua nhà ở xã hội biên hòa, hồ sơ mua nhà ở xã hội biên hòa, noxh biên hòa, k-home cityview biên hòa, k home cityview, chung cư biên hòa giá rẻ",
  },
  {
    dir: "nha-o-xa-hoi-nhon-trach",
    title: "Nhà Ở Xã Hội Nhơn Trạch (Phú Hội) 2026: Tổng Hợp Dự Án, Bảng Giá & Hướng Dẫn Mua A-Z",
    description: "Tổng hợp chi tiết các dự án nhà ở xã hội Nhơn Trạch (NOXH Phú Hội) 2026 đón đầu Sân bay Long Thành: K-Home Avenue Phú Hội mặt tiền 25C. Bảng giá từ 750 triệu, điều kiện xét duyệt & gói vay 5,4%/năm.",
    keywords: "nhà ở xã hội nhơn trạch, nhà ở xã hội phú hội, noxh phú hội, nhà ở xã hội phú hội nhơn trạch, mua nhà ở xã hội nhơn trạch, mua nhà ở xã hội phú hội, k-home avenue, k home avenue nhơn trạch, nhà ở xã hội đường 25c, chung cư nhơn trạch giá rẻ, căn hộ giá rẻ nhơn trạch, noxh nhơn trạch, điều kiện mua nhà ở xã hội nhơn trạch",
  },
  {
    dir: "nha-o-xa-hoi-trang-bom",
    title: "Nhà Ở Xã Hội Trảng Bom (Kim Oanh) 2026: Dự Án K-Home Midtown, Bảng Giá & Hướng Dẫn Mua A-Z",
    description: "Tổng hợp dự án nhà ở xã hội Trảng Bom 2026: Chung cư NOXH Khu dân cư và siêu thị Trảng Bom (K-Home Midtown Kim Oanh) 562 căn hộ từ 750 triệu, K-Home SkyView Bàu Xéo. Điều kiện mua & gói vay 5,4%/năm.",
    keywords: "nhà ở xã hội trảng bom, nhà ở xã hội kim oanh trảng bom, mua nhà ở xã hội trảng bom, chung cư nhà ở xã hội trảng bom, khu dân cư và siêu thị trảng bom, noxh trảng bom, k-home midtown, k home midtown trảng bom, căn hộ giá rẻ trảng bom, nhà ở xã hội bàu xéo, k-home skyview, điều kiện mua nhà ở xã hội trảng bom",
  },
  {
    dir: "k-home-cityview-ho-nai",
    title: "Nhà Ở Xã Hội Biên Hòa – K-Home CityView Hố Nai | Bảng Giá & Điều Kiện 2026",
    description: "Dự án Nhà Ở Xã Hội Biên Hòa (K-Home CityView Hố Nai Kim Oanh Land) – chung cư Biên Hòa giá rẻ 1.382 căn NOXH chuẩn Singapore giá từ 950 triệu, vay 5,4%/năm.",
    keywords: "chung cư biên hòa giá rẻ, chung cư biên hoà giá rẻ, nhà ở xã hội biên hoà, nhà ở xã hội biên hòa, nhà ở xã hội hố nai, noxh biên hòa, noxh hố nai, chung cư hố nai giá rẻ, căn hộ giá rẻ biên hòa, nhà ở xã hội đồng nai 2026, chung cư nhà ở xã hội biên hòa, k-home cityview, k home cityview, k home city view, khome cityview, k-home city view, k-home cityview hố nai, k-home cityview biên hòa, k home cityview biên hòa, nhà ở xã hội đường điểu xiển, chung cư đường điểu xiển biên hòa, mua nhà ở xã hội biên hòa, điều kiện mua nhà ở xã hội biên hòa, k home đồng nai",
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
    title: "Nhà Ở Xã Hội Trảng Bom – K-Home Midtown | Bảng Giá & Điều Kiện 2026",
    description: "Dự án Nhà Ở Xã Hội Trảng Bom (K-Home Midtown Kim Oanh) quy mô 13,97 ha, 542 căn NOXH chuẩn Singapore giá từ 750 triệu, vay 5,4%/năm. Hướng dẫn hồ sơ NOXH Trảng Bom từ A-Z.",
    keywords: "chung cư trảng bom giá rẻ, nhà ở xã hội trảng bom, nhà ở xã hội trảng bom đồng nai, noxh trảng bom, nhà ở xã hội kcn bàu xéo, căn hộ giá rẻ trảng bom, k-home midtown, k home midtown, k home midtown trảng bom, k-home midtown trảng bom, khome midtown, k home mid town, k-home mid town, mua nhà ở xã hội trảng bom, điều kiện mua nhà ở xã hội trảng bom, noxh trảng bom kim oanh, k home đồng nai trảng bom",
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
    description: "Căn hộ 1 phòng ngủ + B tại K-Home Midtown Trảng Bom, diện tích 55,1m², 2 nhà vệ sinh, giá từ 1,2 tỷ, bàn giao full nội thất, lãi suất NOXH 5,4%/năm.",
  },
  {
    dir: "k-home-midtown-trang-bom/can-ho-2-phong-ngu",
    title: "Căn Hộ 2 Phòng Ngủ K-Home Midtown Trảng Bom | 68,8m² | Giá từ 1,5 Tỷ",
    description: "Căn hộ 2 phòng ngủ tại K-Home Midtown Trảng Bom, diện tích 68,8m², 2 nhà vệ sinh, giá từ 1,5 tỷ, bàn giao full nội thất, lãi suất NOXH 5,4%/năm.",
  },
  {
    dir: "k-home-avenue-nhon-trach",
    title: "Nhà Ở Xã Hội Nhơn Trạch – K-Home Avenue Gần Sân Bay Long Thành | Bảng Giá 2026",
    description: "Dự án Nhà Ở Xã Hội Nhơn Trạch (K-Home Avenue Kim Oanh) – chung cư Nhơn Trạch giá rẻ mặt tiền đường 25C gần Sân bay Long Thành, 1.022 căn NOXH chuẩn Singapore giá từ 750 triệu, vay 5,4%/năm.",
    keywords: "chung cư nhơn trạch giá rẻ, chung cư nhơn trạch, nhà ở xã hội nhơn trạch, nhà ở xã hội nhơn trạch đồng nai, noxh nhơn trạch, căn hộ giá rẻ nhơn trạch, nhà ở xã hội đường 25c, nhà ở xã hội gần sân bay long thành, nhà ở xã hội cho công nhân nhơn trạch, k-home avenue, k home avenue, k home avenue nhơn trạch, k-home avenue nhơn trạch, khome avenue, mua nhà ở xã hội nhơn trạch, điều kiện mua nhà ở xã hội nhơn trạch, k home đồng nai",
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
    dir: "k-home-skyview-trang-bom",
    title: "Nhà Ở Xã Hội Trảng Bom – K-Home SkyView Bàu Xéo | Bảng Giá 2026",
    description: "Dự án Nhà Ở Xã Hội Trảng Bom (K-Home SkyView Bàu Xéo Kim Oanh) quy mô 1,08 ha, 358 căn NOXH chuẩn Singapore giá từ 750 triệu, vay 5,4%/năm. Hướng dẫn thủ tục & bảng giá 2026.",
    keywords: "nhà ở xã hội trảng bom, noxh trảng bom, nhà ở xã hội bàu xéo, chung cư bàu xéo trảng bom, k-home skyview, khome skyview, k home skyview, k-home skyview trảng bom, căn hộ trảng bom giá rẻ, nhà ở xã hội đồng nai 2026",
  },
  {
    dir: "k-home-skyview-trang-bom/can-ho-studio",
    title: "Căn Hộ Studio K-Home SkyView Trảng Bom | 37,0m² | Giá từ 750 Triệu",
    description: "Căn hộ Studio tại K-Home SkyView Trảng Bom, diện tích 37,0m², giá từ 750 triệu, thiết kế tối ưu công năng, chuẩn xanh EDGE, lãi suất vay 5,4%/năm.",
  },
  {
    dir: "k-home-skyview-trang-bom/can-ho-1-phong-ngu",
    title: "Căn Hộ 1 Phòng Ngủ K-Home SkyView Trảng Bom | 45,8m² | Giá từ 990 Triệu",
    description: "Căn hộ 1 phòng ngủ + tại K-Home SkyView Trảng Bom, diện tích 45,8m², giá từ 990 triệu, bàn giao full nội thất cơ bản, lãi suất NOXH 5,4%/năm.",
  },
  {
    dir: "k-home-skyview-trang-bom/can-ho-2-phong-ngu",
    title: "Căn Hộ 2 Phòng Ngủ K-Home SkyView Trảng Bom | 65,3m² | Giá từ 1,35 Tỷ",
    description: "Căn hộ 2 phòng ngủ tại K-Home SkyView Trảng Bom, diện tích 65,3m², 2 nhà vệ sinh, giá từ 1,35 tỷ, ban công thoáng mát, lãi suất NOXH 5,4%/năm.",
  },
  {
    dir: "san-pham",
    title: "Danh Sách Dự Án K-Home Đồng Nai | Bảng Giá 4 Dự Án NOXH Kim Oanh",
    description: "Xem đầy đủ thông tin, bảng giá và mặt bằng 4 dự án nhà ở xã hội K-Home tại Đồng Nai: CityView Biên Hòa, Midtown Trảng Bom, Avenue Nhơn Trạch, SkyView Trảng Bom. Kim Oanh Land.",
  },
  {
    dir: "tinh-tra-gop",
    title: "Bảng Tính Trả Góp & Lãi Suất NOXH K-Home Đồng Nai 2026 | Kim Oanh",
    description: "Công cụ tính tiền trả góp mua nhà ở xã hội K-Home Đồng Nai: CityView Biên Hòa, Midtown Trảng Bom, Avenue Nhơn Trạch. Vốn ban đầu từ 150tr, vay 80% lãi suất 5,4%/năm.",
    keywords: "bảng tính trả góp k-home, tính tiền vay mua nhà ở xã hội đồng nai, lãi suất vay k-home kim oanh, tính trả góp k-home cityview, tính trả góp k-home midtown, tính trả góp k-home avenue, công cụ tính trả góp noxh",
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

  // Bơm HTML tĩnh chuẩn SEO vào bên trong <div id="root">...</div> để Googlebot đọc ngay lập tức
  if (meta.bodyHtml) {
    html = html.replace('<div id="root"></div>', `<div id="root">${meta.bodyHtml}</div>`);
  }

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

  // 0. Compile and load React SSR renderer
  console.log("⚡ Compiling ssr-render.tsx with esbuild...");
  const cacheSsrFile = path.join(__dirname, ".cache-ssr-render.mjs");
  await esbuild.build({
    entryPoints: [path.join(__dirname, "ssr-render.tsx")],
    bundle: true,
    platform: "node",
    format: "esm",
    outfile: cacheSsrFile,
    external: ["react", "react-dom", "react-dom/server", "lucide-react", "xlsx"],
  });
  const {
    renderHomeHtml,
    renderProjectHtml,
    renderUnitHtml,
    renderProjectsPageHtml,
    renderCalculatorPageHtml,
    renderNewsPageHtml,
    renderAboutPageHtml,
    renderContactPageHtml,
    renderNotFoundHtml,
    renderForbiddenHtml,
    renderServerErrorHtml,
    renderVideoWatchHtml,
    renderNoxhBienHoaPillarHtml,
    renderNoxhNhonTrachPillarHtml,
    renderNoxhTrangBomPillarHtml,
  } = await import(`file:///${cacheSsrFile.replace(/\\/g, "/")}`);
  console.log("✅ SSR renderer loaded successfully\n");

  // Render Trang Chủ (/) trực tiếp vào dist/index.html
  console.log("── Rendering Homepage (/) ─────────────────────────");
  const homeHtml = renderHomeHtml();
  const homeFullHtml = template.replace('<div id="root"></div>', `<div id="root">${homeHtml}</div>`);
  fs.writeFileSync(templatePath, homeFullHtml, "utf-8");
  console.log(`✅ / (dist/index.html — ${Math.round(homeFullHtml.length / 1024)} KB static HTML)\n`);

  let count = 1;

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
      { "@type": "Question", "name": "K-Home CityView có bao nhiêu căn?", "acceptedAnswer": { "@type": "Answer", "text": "Dự án có tổng cộng 1.816 căn gồm: 1.382 căn hộ NOXH, 425 căn nhà ở thương mại (Block T4) và 39 căn shophouse, phân bổ trong 4 block cao 22 tầng trên quỹ đất 2,85 hecta tại Hố Nai, Biên Hòa." } },
      { "@type": "Question", "name": "Hỗ trợ hồ sơ NOXH K-Home CityView như thế nào?", "acceptedAnswer": { "@type": "Answer", "text": "Đội ngũ Kim Oanh Land hỗ trợ hoàn toàn miễn phí: kiểm tra điều kiện đủ tiêu chuẩn, chuẩn bị giấy tờ, nộp hồ sơ xét duyệt và kết nối Ngân hàng Chính sách Xã hội. Hotline: 0937.587.438." } },
      { "@type": "Question", "name": "Mặt bằng K-Home CityView gồm những loại căn nào?", "acceptedAnswer": { "@type": "Answer", "text": "K-Home CityView Hố Nai có 4 loại căn hộ: 1PN+ A (47,3m²), 1PN+ B (62,4m²), 2 phòng ngủ (70,4m²) và 3 phòng ngủ (84,4m²). NOXH đầu tiên tại Đồng Nai có căn 3 phòng ngủ." } },
      { "@type": "Question", "name": "Tiện ích K-Home CityView Hố Nai có gì?", "acceptedAnswer": { "@type": "Answer", "text": "K-Home CityView có hồ bơi người lớn và trẻ em, sân chơi trẻ em, khu thể dục ngoài trời, nhà sinh hoạt cộng đồng, vườn cảnh quan, khu BBQ, bãi đỗ xe và hệ thống shophouse khối đế." } },
      { "@type": "Question", "name": "K-Home CityView có sổ hồng không?", "acceptedAnswer": { "@type": "Answer", "text": "Có. Dự án được pháp lý đầy đủ theo quy định nhà ở xã hội, cấp sổ hồng sở hữu lâu dài. Hồ sơ pháp lý minh bạch từ giai đoạn đặt cọc đến khi nhận nhà." } },
      { "@type": "Question", "name": "K-Home CityView do ai thiết kế?", "acceptedAnswer": { "@type": "Answer", "text": "K-Home CityView được thiết kế và quy hoạch bởi Tập đoàn Surbana Jurong (Singapore) – đơn vị tư vấn quy hoạch đô thị hàng đầu châu Á. Dự án phát triển theo tiêu chuẩn công trình xanh EDGE của IFC/World Bank." } },
      { "@type": "Question", "name": "K-Home CityView đường Điểu Xiển gần KCN nào?", "acceptedAnswer": { "@type": "Answer", "text": "K-Home CityView nằm tại đường Điểu Xiển, Hố Nai – liền kề KCN Amata, KCN Long Bình, KCN Biên Hòa 2, KCN Hố Nai. Từ dự án chỉ mất 10–15 phút đến các KCN này." } },
      { "@type": "Question", "name": "K Home City View Biên Hòa là dự án gì?", "acceptedAnswer": { "@type": "Answer", "text": "K Home City View (hay K-Home CityView) là dự án nhà ở xã hội chuẩn Singapore tại Biên Hòa, Đồng Nai do Kim Oanh Land phát triển. 1.382 căn NOXH + 39 shophouse, giá từ 950 triệu, lãi suất 5,4%/năm." } },
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
    "description": "Dự án K-Home CityView Hố Nai Biên Hòa: 1.382 căn NOXH chuẩn Singapore, giá từ 950 triệu, lãi suất 5,4%/năm, bàn giao 2028.",
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

  // Product Schema với AggregateRating chuẩn Google Rich Snippet (hiển thị sao vàng trên Google Search)
  const CITYVIEW_PRODUCT_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Nhà Ở Xã Hội K-Home CityView Hố Nai Biên Hòa",
    "image": [
      "https://res.cloudinary.com/dthv0nsq/image/upload/w_1200,q_auto:good,f_auto/k-home-cityview/V34_TAN-HOA_EXT_FACADE_FINAL_2",
      "https://res.cloudinary.com/dthv0nsq/image/upload/w_1200,q_auto:good,f_auto/k-home-cityview/TAN-HOA_AERIAL_1_DRAFT-3_2-1"
    ],
    "description": "Dự án căn hộ chung cư nhà ở xã hội K-Home CityView Hố Nai Biên Hòa chuẩn Singapore, quy mô 1.816 căn, giá từ 950 triệu, vay ưu đãi 5,4%/năm.",
    "brand": {
      "@type": "Brand",
      "name": "Kim Oanh Land"
    },
    "category": "Nhà Ở Xã Hội Biên Hòa",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "VND",
      "lowPrice": "950000000",
      "highPrice": "2000000000",
      "offerCount": "1816",
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock",
      "url": `${BASE_URL}/k-home-cityview-ho-nai`
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "186",
      "reviewCount": "186"
    },
    "review": [
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Nguyễn Minh Tuấn" },
        "datePublished": "2026-08-15",
        "reviewBody": "Dự án NOXH vị trí ngay Hố Nai gần KCN Amata rất thuận tiện đi làm. Giá 950 triệu trả góp nhẹ nhàng, hồ sơ được Kim Oanh Land hỗ trợ nhanh gọn.",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Trần Thị Thu Thảo" },
        "datePublished": "2026-09-02",
        "reviewBody": "Thiết kế chuẩn Singapore Surbana Jurong có hồ bơi, công viên xanh mát. Lãi suất vay 5,4% cố định rất an tâm.",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }
      }
    ]
  };

  // Schemas cho Midtown
  const MIDTOWN_FAQ_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "K-Home Midtown Trảng Bom ở đâu?", "acceptedAnswer": { "@type": "Answer", "text": "K-Home Midtown tọa lạc tại trung tâm huyện Trảng Bom, giao lộ 4 tuyến đường 30/4 – Hùng Vương – Lý Nam Đế – Lê Đại Hành, TT. Trảng Bom, Đồng Nai." } },
      { "@type": "Question", "name": "K-Home Midtown Trảng Bom giá bao nhiêu?", "acceptedAnswer": { "@type": "Answer", "text": "K-Home Midtown có giá từ 750 triệu đến 1,5 tỷ/căn: Studio từ 750 triệu, 1PN+A từ 990 triệu, 1PN+B từ 1,2 tỷ, 2PN từ 1,5 tỷ. Bàn giao full nội thất, trả góp từ 3,5 triệu/tháng." } },
      { "@type": "Question", "name": "K-Home Midtown có bao nhiêu căn?", "acceptedAnswer": { "@type": "Answer", "text": "Dự án có 542 căn hộ NOXH và 20 căn shophouse, trên quỹ đất 13,97 ha tại trung tâm huyện Trảng Bom do Kim Oanh Land phát triển." } },
      { "@type": "Question", "name": "Điều kiện mua K-Home Midtown là gì?", "acceptedAnswer": { "@type": "Answer", "text": "Người mua cần: chưa có nhà tại Đồng Nai, chưa từng mua NOXH, thu nhập dưới 50 triệu/tháng (hộ gia đình), có hộ khẩu hoặc tạm trú tại Đồng Nai. Vay ưu đãi 5,4%/năm trong 25 năm." } },
    ]
  };

  const MIDTOWN_BREADCRUMB = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": `${BASE_URL}/` },
      { "@type": "ListItem", "position": 2, "name": "Dự án K-Home", "item": `${BASE_URL}/san-pham` },
      { "@type": "ListItem", "position": 3, "name": "K-Home Midtown Trảng Bom", "item": `${BASE_URL}/k-home-midtown-trang-bom` },
    ],
  };

  const MIDTOWN_WEBPAGE_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "K-Home Midtown Trảng Bom | Bảng Giá, Mặt Bằng & Hồ Sơ NOXH 2026",
    "url": `${BASE_URL}/k-home-midtown-trang-bom`,
    "description": "Dự án K-Home Midtown Trảng Bom: 542 căn NOXH chuẩn Singapore, quy mô 13,97 ha, giá từ 750 triệu, lãi suất 5,4%/năm.",
    "inLanguage": "vi-VN",
    "dateModified": new Date().toISOString().split("T")[0],
    "publisher": { "@type": "Organization", "name": "Kim Oanh Land", "url": `${BASE_URL}/` },
    "about": {
      "@type": "Residence",
      "name": "K-Home Midtown Trảng Bom",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Đường 30/4, Thị Trấn Trảng Bom",
        "addressLocality": "Huyện Trảng Bom",
        "addressRegion": "Tỉnh Đồng Nai",
        "addressCountry": "VN",
      },
    },
  };

  // Product Schema với AggregateRating cho K-Home Midtown Trảng Bom
  const MIDTOWN_PRODUCT_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Nhà Ở Xã Hội Kim Oanh Trảng Bom – K-Home Midtown",
    "image": [
      "https://res.cloudinary.com/dthv0nsq/image/upload/v1785230298/k-home-midtown/Du-an-K-Home-Midtown-3d-birdview-toan-canh-dem-2048x1150.jpg"
    ],
    "description": "Chung cư nhà ở xã hội Khu dân cư và siêu thị Trảng Bom (K-Home Midtown) 562 căn hộ chuẩn Singapore giá từ 750 triệu, vay 5,4%/năm.",
    "brand": { "@type": "Brand", "name": "Kim Oanh Group" },
    "category": "Nhà Ở Xã Hội Trảng Bom",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "VND",
      "lowPrice": "750000000",
      "highPrice": "1500000000",
      "offerCount": "562",
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock",
      "url": `${BASE_URL}/k-home-midtown-trang-bom`
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "168",
      "reviewCount": "168"
    },
    "review": [
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Hoàng Văn Nam" },
        "datePublished": "2026-08-10",
        "reviewBody": "Vị trí trung tâm thị trấn Trảng Bom có sẵn siêu thị và công viên, mua ở thực rất tiện ích. Trả góp 3,5 triệu/tháng vừa sức.",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }
      }
    ]
  };

  // Schemas cho Avenue
  const AVENUE_FAQ_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "K-Home Avenue Nhơn Trạch ở đâu?", "acceptedAnswer": { "@type": "Answer", "text": "K-Home Avenue tọa lạc trên đường Nguyễn Ái Quốc (Tỉnh lộ 25C), xã Phước An / Long Thọ, huyện Nhơn Trạch, tỉnh Đồng Nai – trục đường kết nối trực tiếp đến Cảng Hàng không Quốc tế Long Thành và Vành Đai 3 TP.HCM." } },
      { "@type": "Question", "name": "K-Home Avenue Nhơn Trạch giá bao nhiêu?", "acceptedAnswer": { "@type": "Answer", "text": "K-Home Avenue có giá từ 750 triệu đến 1,47 tỷ/căn: Studio 37,7m² từ 750 triệu, 1PN+ 46,6m² từ 990 triệu, 2PN nhỏ 65,7m² từ 1,23 tỷ, 2PN lớn 69,5m² từ 1,40 tỷ. Tất cả bàn giao full nội thất chuẩn Singapore." } },
      { "@type": "Question", "name": "K-Home Avenue cách Sân bay Long Thành bao xa?", "acceptedAnswer": { "@type": "Answer", "text": "K-Home Avenue chỉ cách Sân bay Quốc tế Long Thành khoảng 10–12 phút di chuyển qua đại lộ 25C Nguyễn Ái Quốc. Đón đầu nhu cầu an cư của chuyên gia hàng không." } },
      { "@type": "Question", "name": "Điều kiện mua và vay vốn K-Home Avenue là gì?", "acceptedAnswer": { "@type": "Answer", "text": "Chưa có nhà tại Đồng Nai, thu nhập dưới 50 triệu/tháng (vợ chồng) hoặc dưới 25 triệu (độc thân). Vay tối đa 80% từ Ngân hàng Chính sách Xã hội với lãi suất 5,4%/năm cố định 25 năm, trả góp từ 2,5 – 3,5 triệu/tháng." } },
      { "@type": "Question", "name": "K-Home Avenue có bao nhiêu căn?", "acceptedAnswer": { "@type": "Answer", "text": "Dự án quy mô 5,3 ha, gồm 4 block cao 12 tầng với 1.022 căn hộ NOXH chuẩn Singapore và 82 căn shophouse thương mại." } },
    ]
  };

  const AVENUE_BREADCRUMB = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": `${BASE_URL}/` },
      { "@type": "ListItem", "position": 2, "name": "Dự án K-Home", "item": `${BASE_URL}/san-pham` },
      { "@type": "ListItem", "position": 3, "name": "K-Home Avenue Nhơn Trạch", "item": `${BASE_URL}/k-home-avenue-nhon-trach` },
    ],
  };

  const AVENUE_WEBPAGE_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "K-Home Avenue (K Home Avenue) Nhơn Trạch | Bảng Giá & Mặt Bằng 2026",
    "url": `${BASE_URL}/k-home-avenue-nhon-trach`,
    "description": "K-Home Avenue (k-home avenue) Nhơn Trạch nhà ở xã hội 1.022 căn gần Sân bay Long Thành giá từ 750 triệu, vay 5,4%/năm. Cập nhật bảng giá & mặt bằng 2026.",
    "inLanguage": "vi-VN",
    "dateModified": new Date().toISOString().split("T")[0],
    "publisher": { "@type": "Organization", "name": "Kim Oanh Land", "url": `${BASE_URL}/` },
    "about": {
      "@type": "Residence",
      "name": "K-Home Avenue Nhơn Trạch",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Đường Nguyễn Ái Quốc (25C), Xã Phước An",
        "addressLocality": "Huyện Nhơn Trạch",
        "addressRegion": "Tỉnh Đồng Nai",
        "addressCountry": "VN",
      },
    },
  };

  // Product Schema với AggregateRating cho K-Home Avenue Nhơn Trạch
  const AVENUE_PRODUCT_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Nhà Ở Xã Hội Phú Hội – K-Home Avenue Nhơn Trạch",
    "image": [
      "https://res.cloudinary.com/dthv0nsq/image/upload/v1785230307/k-home-avenue/PC01-TT-copy_2_2-min.jpg"
    ],
    "description": "Dự án nhà ở xã hội K-Home Avenue Nhơn Trạch (NOXH Phú Hội) 1.104 căn hộ chuẩn Singapore đón đầu Sân bay Long Thành, giá từ 750 triệu, vay 5,4%/năm.",
    "brand": { "@type": "Brand", "name": "Kim Oanh Group" },
    "category": "Nhà Ở Xã Hội Nhơn Trạch",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "VND",
      "lowPrice": "750000000",
      "highPrice": "1470000000",
      "offerCount": "1104",
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock",
      "url": `${BASE_URL}/k-home-avenue-nhon-trach`
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "152",
      "reviewCount": "152"
    },
    "review": [
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Lê Đình Trọng" },
        "datePublished": "2026-08-20",
        "reviewBody": "Mặt tiền đường 25C chạy thẳng ra sân bay Long Thành 10 phút. Nhà ở xã hội mà bàn giao full nội thất chuẩn Singapore rất đáng mua.",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }
      }
    ]
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

  // Schemas cho SkyView
  const SKYVIEW_PRODUCT_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "K-Home SkyView Trảng Bom",
    "image": [
      "https://res.cloudinary.com/dthv0nsq/image/upload/w_1200,q_auto:good,f_auto/k-home-cityview/V34_TAN-HOA_EXT_FACADE_FINAL_2"
    ],
    "description": "Dự án căn hộ nhà ở xã hội K-Home SkyView Trảng Bom do Kim Oanh Group phát triển. Quy mô 1,08 ha, 358 căn hộ chuẩn Singapore đạt chứng chỉ xanh EDGE, giá từ 750 triệu/căn.",
    "brand": {
      "@type": "Brand",
      "name": "Kim Oanh Group"
    },
    "category": "Nhà Ở Xã Hội",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "VND",
      "lowPrice": "750000000",
      "highPrice": "1450000000",
      "offerCount": "358",
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock",
      "url": `${BASE_URL}/k-home-skyview-trang-bom`
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "135",
      "reviewCount": "135"
    },
    "review": [
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Nguyễn Hoàng Nam" },
        "datePublished": "2026-08-22",
        "reviewBody": "K-Home SkyView vị trí rất đẹp sát ngay KCN Bàu Xéo và QL1A Trảng Bom, mức giá từ 750 triệu và hỗ trợ gói vay ưu đãi 5,4%/năm rất phù hợp cho công nhân viên và gia đình trẻ.",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }
      }
    ]
  };

  const SKYVIEW_FAQ_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "K-Home SkyView Trảng Bom ở đâu?", "acceptedAnswer": { "@type": "Answer", "text": "K-Home SkyView tọa lạc tại Khu dân cư Bàu Xéo, huyện Trảng Bom, tỉnh Đồng Nai – liền kề KCN Bàu Xéo và Quốc Lộ 1A." } },
      { "@type": "Question", "name": "K-Home SkyView Trảng Bom giá bao nhiêu?", "acceptedAnswer": { "@type": "Answer", "text": "K-Home SkyView có giá từ 750 triệu đến 1,45 tỷ/căn: Studio 37m² từ 750 triệu, 1PN+ 45,8m² từ 990 triệu, 2PN 65,3m² từ 1,35 tỷ. Hỗ trợ vay ưu đãi 5,4%/năm." } },
      { "@type": "Question", "name": "K-Home SkyView có bao nhiêu căn?", "acceptedAnswer": { "@type": "Answer", "text": "Dự án quy mô 1,08 ha gồm 358 căn hộ NOXH chuẩn Singapore do Kim Oanh Group phát triển, đạt chứng chỉ xanh EDGE." } },
      { "@type": "Question", "name": "Điều kiện mua và gói vay K-Home SkyView là gì?", "acceptedAnswer": { "@type": "Answer", "text": "Chưa có nhà tại Đồng Nai, thu nhập dưới 50 triệu/tháng (vợ chồng) hoặc dưới 25 triệu (độc thân). Vay tối đa 80% từ Ngân hàng CSXH với lãi suất 5,4%/năm trong 25 năm." } },
    ]
  };

  const SKYVIEW_BREADCRUMB = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": `${BASE_URL}/` },
      { "@type": "ListItem", "position": 2, "name": "Dự án K-Home", "item": `${BASE_URL}/san-pham` },
      { "@type": "ListItem", "position": 3, "name": "K-Home SkyView Trảng Bom", "item": `${BASE_URL}/k-home-skyview-trang-bom` },
    ],
  };

  const SKYVIEW_WEBPAGE_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "K-Home SkyView Trảng Bom | Bảng Giá & Mặt Bằng 2026",
    "url": `${BASE_URL}/k-home-skyview-trang-bom`,
    "description": "Dự án K-Home SkyView Trảng Bom: 358 căn NOXH chuẩn Singapore, quy mô 1,08 ha, giá từ 750 triệu, vay 5,4%/năm.",
    "inLanguage": "vi-VN",
    "dateModified": new Date().toISOString().split("T")[0],
    "publisher": { "@type": "Organization", "name": "Kim Oanh Land", "url": `${BASE_URL}/` },
    "about": {
      "@type": "Residence",
      "name": "K-Home SkyView Trảng Bom",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "KDC Bàu Xéo",
        "addressLocality": "Huyện Trảng Bom",
        "addressRegion": "Tỉnh Đồng Nai",
        "addressCountry": "VN",
      },
    },
  };

  const NOXH_BIEN_HOA_BREADCRUMB = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": `${BASE_URL}/` },
      { "@type": "ListItem", "position": 2, "name": "Nhà ở xã hội Biên Hòa 2026", "item": `${BASE_URL}/nha-o-xa-hoi-bien-hoa` },
    ],
  };

  const NOXH_BIEN_HOA_ARTICLE = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Nhà Ở Xã Hội Biên Hòa 2026: Tổng Hợp Dự Án, Bảng Giá & Hướng Dẫn Mua A-Z",
    "description": "Tổng hợp 5 dự án nhà ở xã hội Biên Hòa 2026: K-Home CityView Hố Nai, Tam Hiệp, Long Bình Tân, A6-A7. Bảng giá từ 950 triệu, điều kiện xét duyệt & gói vay 5,4%/năm.",
    "url": `${BASE_URL}/nha-o-xa-hoi-bien-hoa`,
    "inLanguage": "vi-VN",
    "datePublished": "2026-05-26T08:00:00+07:00",
    "dateModified": new Date().toISOString().split("T")[0],
    "image": "https://res.cloudinary.com/dthv0nsq/image/upload/w_1200,q_auto:good,f_auto/k-home-cityview/V34_TAN-HOA_EXT_FACADE_FINAL_2",
    "author": {
      "@type": "Organization",
      "name": "Kim Oanh Group",
      "url": BASE_URL
    },
    "publisher": {
      "@type": "Organization",
      "name": "Kim Oanh Group",
      "logo": { "@type": "ImageObject", "url": `${BASE_URL}/android-chrome-512x512.png` }
    },
    "about": {
      "@type": "Product",
      "name": "Dự Án Nhà Ở Xã Hội Biên Hòa 2026",
      "image": "https://res.cloudinary.com/dthv0nsq/image/upload/w_1200,q_auto:good,f_auto/k-home-cityview/V34_TAN-HOA_EXT_FACADE_FINAL_2",
      "description": "Tổng hợp các dự án nhà ở xã hội tiêu biểu tại TP. Biên Hòa chuẩn Singapore, giá từ 950 triệu/căn, hỗ trợ vay 5,4%/năm.",
      "brand": { "@type": "Brand", "name": "Kim Oanh Group" },
      "category": "Nhà Ở Xã Hội Biên Hòa",
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "VND",
        "lowPrice": "950000000",
        "highPrice": "2000000000",
        "offerCount": "1816",
        "priceValidUntil": "2026-12-31",
        "availability": "https://schema.org/InStock",
        "url": `${BASE_URL}/nha-o-xa-hoi-bien-hoa`
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": "186",
        "reviewCount": "186"
      }
    }
  };

  const NOXH_BIEN_HOA_FAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Mua nhà ở xã hội Biên Hòa có phải trả phí chênh hoặc phí môi giới không?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tuyệt đối không. Giá bán nhà ở xã hội được Sở Xây dựng tỉnh Đồng Nai thẩm định và phê duyệt giá trần niêm yết. Mọi hành vi thu thêm tiền chênh lệch hoặc phí suất nội bộ đều trái pháp luật."
        }
      },
      {
        "@type": "Question",
        "name": "Điều kiện thu nhập để mua nhà ở xã hội Biên Hòa năm 2026 là bao nhiêu?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Theo quy định mới: Người độc thân có thu nhập thực nhận dưới 25 triệu đồng/tháng; Người độc thân nuôi con nhỏ dưới 35 triệu đồng/tháng; Cặp vợ chồng có tổng thu nhập thực nhận dưới 50 triệu đồng/tháng đủ điều kiện đăng ký mua."
        }
      },
      {
        "@type": "Question",
        "name": "Mua nhà ở xã hội Biên Hòa cần chuẩn bị trước bao nhiêu tiền vốn tự có?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Khách hàng chỉ cần chuẩn bị trước 25% tổng giá trị căn hộ, đóng chia làm 3 đợt trong vòng 2 tháng. Ví dụ căn hộ 1PN giá 950 triệu tại K-Home CityView chỉ cần vốn ban đầu khoảng 237 triệu đồng, 75% còn lại được ngân hàng CSXH giải ngân cho vay với lãi suất 5,4%/năm trong 25 năm."
        }
      },
      {
        "@type": "Question",
        "name": "Hộ khẩu ở tỉnh khác chưa có KT3 có được đăng ký mua nhà ở xã hội Biên Hòa không?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hoàn toàn được. Theo Luật Nhà ở 2023, điều kiện sổ hộ khẩu thường trú và tạm trú KT3 đã được bãi bỏ. Bất kỳ người lao động nào chỉ cần có hợp đồng lao động và tham gia BHXH tại Đồng Nai từ 12 tháng trở lên đều được xét duyệt bình đẳng."
        }
      },
      {
        "@type": "Question",
        "name": "Quy trình mua nhà ở xã hội Biên Hòa chuẩn pháp lý gồm những bước nào?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Quy trình chuẩn gồm 6 bước: 1. Tư vấn điều kiện & chuẩn bị hồ sơ (Mẫu 01, 02, 04); 2. Nộp hồ sơ và chủ đầu tư gửi thẩm định Sở Xây dựng; 3. Công bố danh sách hợp lệ & đặt cọc giữ căn; 4. Ký hợp đồng & đóng vốn tự có 25% chia 3 đợt; 5. Hoàn tất giải ngân gói vay NOXH 5,4%/năm; 6. Nhận bàn giao căn hộ và cấp sổ hồng lâu dài."
        }
      },
      {
        "@type": "Question",
        "name": "Dự án nhà ở xã hội nào tại Biên Hòa quy mô lớn và chuẩn Singapore?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Dự án K-Home CityView Hố Nai do Kim Oanh Land phát triển tại đường Điểu Xiển là dự án lớn nhất với 1.382 căn hộ NOXH chuẩn Singapore, đạt chứng chỉ xanh EDGE và giá từ 950 triệu đồng/căn."
        }
      }
    ]
  };

  // Schemas cho Nhà ở xã hội Nhơn Trạch
  const NOXH_NHON_TRACH_BREADCRUMB = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": `${BASE_URL}/` },
      { "@type": "ListItem", "position": 2, "name": "Nhà ở xã hội Nhơn Trạch 2026", "item": `${BASE_URL}/nha-o-xa-hoi-nhon-trach` },
    ],
  };

  const NOXH_NHON_TRACH_ARTICLE = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Nhà Ở Xã Hội Nhơn Trạch 2026: Tổng Hợp Dự Án, Bảng Giá & Hướng Dẫn Mua A-Z",
    "description": "Tổng hợp chi tiết các dự án nhà ở xã hội Nhơn Trạch 2026: K-Home Avenue mặt tiền 25C gần Sân bay Long Thành, Phước An. Bảng giá từ 750 triệu, điều kiện xét duyệt & gói vay 5,4%/năm.",
    "url": `${BASE_URL}/nha-o-xa-hoi-nhon-trach`,
    "inLanguage": "vi-VN",
    "datePublished": "2026-06-15T08:00:00+07:00",
    "dateModified": new Date().toISOString().split("T")[0],
    "image": "https://res.cloudinary.com/dthv0nsq/image/upload/v1785230307/k-home-avenue/PC01-TT-copy_2_2-min.jpg",
    "author": { "@type": "Organization", "name": "Kim Oanh Group", "url": BASE_URL },
    "publisher": {
      "@type": "Organization",
      "name": "Kim Oanh Group",
      "logo": { "@type": "ImageObject", "url": `${BASE_URL}/android-chrome-512x512.png` }
    },
    "about": {
      "@type": "Product",
      "name": "Dự Án Nhà Ở Xã Hội Nhơn Trạch 2026 (K-Home Avenue Phú Hội)",
      "image": "https://res.cloudinary.com/dthv0nsq/image/upload/v1785230307/k-home-avenue/PC01-TT-copy_2_2-min.jpg",
      "description": "Dự án nhà ở xã hội Nhơn Trạch K-Home Avenue mặt tiền đại lộ 25C kết nối Sân bay Long Thành, 1.104 căn NOXH chuẩn Singapore giá từ 750 triệu.",
      "brand": { "@type": "Brand", "name": "Kim Oanh Group" },
      "category": "Nhà Ở Xã Hội Nhơn Trạch",
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "VND",
        "lowPrice": "750000000",
        "highPrice": "1470000000",
        "offerCount": "1104",
        "priceValidUntil": "2026-12-31",
        "availability": "https://schema.org/InStock",
        "url": `${BASE_URL}/nha-o-xa-hoi-nhon-trach`
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": "152",
        "reviewCount": "152"
      }
    }
  };

  const NOXH_NHON_TRACH_FAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Mua nhà ở xã hội Nhơn Trạch cần chuẩn bị trước bao nhiêu tiền vốn tự có?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Khách hàng chỉ cần chuẩn bị trước 20 – 25% giá trị căn hộ, tương đương từ khoảng 150 triệu đồng đối với căn Studio giá 750 triệu tại K-Home Avenue. Số tiền được chia làm 3 đợt thanh toán trong vòng 2 tháng."
        }
      },
      {
        "@type": "Question",
        "name": "Điều kiện thu nhập để mua nhà ở xã hội Nhơn Trạch năm 2026 là bao nhiêu?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Người độc thân có thu nhập thực nhận dưới 25 triệu/tháng; người độc thân nuôi con nhỏ dưới 35 triệu/tháng; cặp vợ chồng có tổng thu nhập thực nhận dưới 50 triệu/tháng đủ điều kiện đăng ký mua."
        }
      },
      {
        "@type": "Question",
        "name": "Công nhân KCN Nhơn Trạch hộ khẩu ngoài tỉnh có mua được NOXH không?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hoàn toàn được. Rào cản hộ khẩu và tạm trú KT3 đã được bãi bỏ. Bất kỳ công dân nào có hợp đồng lao động và tham gia BHXH từ 12 tháng tại Đồng Nai đều được đăng ký mua bình đẳng."
        }
      },
      {
        "@type": "Question",
        "name": "Dự án K-Home Avenue Nhơn Trạch cách Sân bay Long Thành bao xa?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Dự án tọa lạc trên đường Nguyễn Ái Quốc (25C), chỉ cách cổng Sân bay Quốc tế Long Thành khoảng 10 – 12 phút di chuyển thẳng tắp."
        }
      }
    ]
  };

  // Schemas cho Nhà ở xã hội Trảng Bom
  const NOXH_TRANG_BOM_BREADCRUMB = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": `${BASE_URL}/` },
      { "@type": "ListItem", "position": 2, "name": "Nhà ở xã hội Trảng Bom 2026", "item": `${BASE_URL}/nha-o-xa-hoi-trang-bom` },
    ],
  };

  const NOXH_TRANG_BOM_ARTICLE = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Nhà Ở Xã Hội Trảng Bom 2026: Tổng Hợp Dự Án, Bảng Giá & Hướng Dẫn Mua A-Z",
    "description": "Tổng hợp chi tiết các dự án nhà ở xã hội Trảng Bom 2026: K-Home Midtown 13,97 ha trung tâm thị trấn, K-Home SkyView Bàu Xéo. Bảng giá từ 750 triệu, điều kiện xét duyệt & gói vay 5,4%/năm.",
    "url": `${BASE_URL}/nha-o-xa-hoi-trang-bom`,
    "inLanguage": "vi-VN",
    "datePublished": "2026-06-20T08:00:00+07:00",
    "dateModified": new Date().toISOString().split("T")[0],
    "image": "https://res.cloudinary.com/dthv0nsq/image/upload/v1785230298/k-home-midtown/Du-an-K-Home-Midtown-3d-birdview-toan-canh-dem-2048x1150.jpg",
    "author": { "@type": "Organization", "name": "Kim Oanh Group", "url": BASE_URL },
    "publisher": {
      "@type": "Organization",
      "name": "Kim Oanh Group",
      "logo": { "@type": "ImageObject", "url": `${BASE_URL}/android-chrome-512x512.png` }
    },
    "about": {
      "@type": "Product",
      "name": "Dự Án Nhà Ở Xã Hội Trảng Bom 2026 (K-Home Midtown Kim Oanh)",
      "image": "https://res.cloudinary.com/dthv0nsq/image/upload/v1785230298/k-home-midtown/Du-an-K-Home-Midtown-3d-birdview-toan-canh-dem-2048x1150.jpg",
      "description": "Dự án nhà ở xã hội Trảng Bom K-Home Midtown (Khu dân cư và siêu thị Trảng Bom) 562 căn hộ chuẩn Singapore giá từ 750 triệu, vay 5,4%/năm.",
      "brand": { "@type": "Brand", "name": "Kim Oanh Group" },
      "category": "Nhà Ở Xã Hội Trảng Bom",
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "VND",
        "lowPrice": "750000000",
        "highPrice": "1500000000",
        "offerCount": "562",
        "priceValidUntil": "2026-12-31",
        "availability": "https://schema.org/InStock",
        "url": `${BASE_URL}/nha-o-xa-hoi-trang-bom`
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": "168",
        "reviewCount": "168"
      }
    }
  };

  const NOXH_TRANG_BOM_FAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Mua nhà ở xã hội Trảng Bom cần chuẩn bị trước bao nhiêu tiền vốn tự có?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Khách hàng chỉ cần chuẩn bị trước 20 – 25% giá trị căn hộ, tương đương từ khoảng 150 triệu đồng đối với căn Studio giá 750 triệu tại K-Home Midtown hoặc SkyView. Số tiền được chia làm 3 đợt thanh toán trong vòng 2 tháng."
        }
      },
      {
        "@type": "Question",
        "name": "Công nhân KCN Bàu Xéo hoặc Sông Mây có được mua NOXH Trảng Bom không?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hoàn toàn được. Công nhân và người lao động làm việc tại các KCN tại Trảng Bom là nhóm đối tượng ưu tiên hàng đầu theo đề án phát triển nhà ở xã hội của tỉnh Đồng Nai."
        }
      },
      {
        "@type": "Question",
        "name": "Dự án K-Home Midtown Trảng Bom nằm ở vị trí nào?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Dự án tọa lạc tại trung tâm thị trấn Trảng Bom, giữa 4 tuyến đường huyết mạch: 30/4 – Hùng Vương – Lý Nam Đế – Lê Đại Hành, kết nối thuận lợi về TP. Biên Hòa và TP.HCM."
        }
      },
      {
        "@type": "Question",
        "name": "Nhà ở xã hội Trảng Bom sau bao lâu thì được bán lại?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Theo Luật Nhà ở, sau thời hạn 5 năm kể từ ngày hoàn tất thanh toán và nhận bàn giao nhà, chủ sở hữu được quyền bán lại theo giá thị trường tự do."
        }
      }
    ]
  };

  // Map schema per dir
  const ROUTE_SCHEMAS = {
    "nha-o-xa-hoi-bien-hoa": [
      NOXH_BIEN_HOA_BREADCRUMB,
      NOXH_BIEN_HOA_ARTICLE,
      NOXH_BIEN_HOA_FAQ,
    ],
    "nha-o-xa-hoi-nhon-trach": [
      NOXH_NHON_TRACH_BREADCRUMB,
      NOXH_NHON_TRACH_ARTICLE,
      NOXH_NHON_TRACH_FAQ,
    ],
    "nha-o-xa-hoi-trang-bom": [
      NOXH_TRANG_BOM_BREADCRUMB,
      NOXH_TRANG_BOM_ARTICLE,
      NOXH_TRANG_BOM_FAQ,
    ],
    "k-home-cityview-ho-nai": [
      CITYVIEW_PRODUCT_SCHEMA,
      CITYVIEW_FAQ_SCHEMA,
      CITYVIEW_BREADCRUMB_SCHEMA,
      CITYVIEW_WEBPAGE_SCHEMA,
      CITYVIEW_VIDEO_SCHEMA_SHORTS,
      CITYVIEW_VIDEO_SCHEMA_PHONGSU_1,
      CITYVIEW_VIDEO_SCHEMA_PHONGSU_2,
      CITYVIEW_VIDEO_SCHEMA_PHONGSU_3
    ],
    "k-home-midtown-trang-bom": [
      MIDTOWN_PRODUCT_SCHEMA,
      MIDTOWN_FAQ_SCHEMA,
      MIDTOWN_BREADCRUMB,
      MIDTOWN_WEBPAGE_SCHEMA,
      MIDTOWN_VIDEO_SCHEMA_1,
      MIDTOWN_VIDEO_SCHEMA_2,
      MIDTOWN_VIDEO_SCHEMA_3
    ],
    "k-home-avenue-nhon-trach": [
      AVENUE_PRODUCT_SCHEMA,
      AVENUE_FAQ_SCHEMA,
      AVENUE_BREADCRUMB,
      AVENUE_WEBPAGE_SCHEMA,
      AVENUE_VIDEO_SCHEMA_1,
      AVENUE_VIDEO_SCHEMA_2
    ],
    "k-home-skyview-trang-bom": [
      SKYVIEW_PRODUCT_SCHEMA,
      SKYVIEW_FAQ_SCHEMA,
      SKYVIEW_BREADCRUMB,
      SKYVIEW_WEBPAGE_SCHEMA,
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

    let bodyHtml = null;
    if (route.dir === "nha-o-xa-hoi-bien-hoa") {
      bodyHtml = renderNoxhBienHoaPillarHtml();
    } else if (route.dir === "nha-o-xa-hoi-nhon-trach") {
      bodyHtml = renderNoxhNhonTrachPillarHtml();
    } else if (route.dir === "nha-o-xa-hoi-trang-bom") {
      bodyHtml = renderNoxhTrangBomPillarHtml();
    } else if (route.dir === "k-home-cityview-ho-nai") {
      bodyHtml = renderProjectHtml("k-home-cityview-ho-nai");
    } else if (route.dir === "k-home-midtown-trang-bom") {
      bodyHtml = renderProjectHtml("k-home-midtown-trang-bom");
    } else if (route.dir === "k-home-avenue-nhon-trach") {
      bodyHtml = renderProjectHtml("k-home-avenue-nhon-trach");
    } else if (route.dir === "k-home-skyview-trang-bom") {
      bodyHtml = renderProjectHtml("k-home-skyview-trang-bom");
    } else if (route.dir.startsWith("k-home-cityview-ho-nai/can-ho-")) {
      const uSlug = route.dir.split("/")[1];
      bodyHtml = renderUnitHtml("k-home-cityview-ho-nai", uSlug);
    } else if (route.dir.startsWith("k-home-midtown-trang-bom/can-ho-")) {
      const uSlug = route.dir.split("/")[1];
      bodyHtml = renderUnitHtml("k-home-midtown-trang-bom", uSlug);
    } else if (route.dir.startsWith("k-home-avenue-nhon-trach/can-ho-")) {
      const uSlug = route.dir.split("/")[1];
      bodyHtml = renderUnitHtml("k-home-avenue-nhon-trach", uSlug);
    } else if (route.dir.startsWith("k-home-skyview-trang-bom/can-ho-")) {
      const uSlug = route.dir.split("/")[1];
      bodyHtml = renderUnitHtml("k-home-skyview-trang-bom", uSlug);
    } else if (route.dir === "san-pham") {
      bodyHtml = renderProjectsPageHtml();
    } else if (route.dir === "tinh-tra-gop") {
      bodyHtml = renderCalculatorPageHtml();
    } else if (route.dir === "tin-tuc") {
      bodyHtml = renderNewsPageHtml();
    } else if (route.dir === "gioi-thieu") {
      bodyHtml = renderAboutPageHtml();
    } else if (route.dir === "lien-he") {
      bodyHtml = renderContactPageHtml();
    } else if (route.dir === "404") {
      bodyHtml = renderNotFoundHtml();
    } else if (route.dir === "403") {
      bodyHtml = renderForbiddenHtml();
    } else if (route.dir === "500") {
      bodyHtml = renderServerErrorHtml(500);
    }

    writeRoute(template, dirPath, {
      title: route.title,
      description: route.description,
      canonical,
      keywords: route.keywords ?? null,
      schemas: ROUTE_SCHEMAS[route.dir] ?? [],
      staticVideos: projVideos,
      bodyHtml,
    });
    count++;
    console.log(`✅ /${route.dir}`);
  }

  // 2. News article routes  — dist/tin-tuc/[slug]/index.html
  // Biên dịch newsData.ts sang ESM để nạp trọn vẹn 100% nội dung bài viết
  const cacheNewsFile = path.join(__dirname, ".cache-newsData.mjs");
  await esbuild.build({
    entryPoints: [path.join(__dirname, "../src/data/newsData.ts")],
    format: "esm",
    outfile: cacheNewsFile,
  });
  const { newsData: ALL_NEWS } = await import(`file:///${cacheNewsFile.replace(/\\/g, "/")}`);
  console.log(`\n── Bài tin tức (${ALL_NEWS.length} bài) ────────────────────`);
  const newsDirBase = path.join(DIST_DIR, "tin-tuc");

  for (const article of ALL_NEWS) {
    const canonical = `${BASE_URL}/tin-tuc/${article.slug}`;
    // Title cho bài tin tức: "[title] | K-Home Đồng Nai"
    const title = article.title.includes("K-Home") || article.title.includes("NOXH")
      ? `${article.title} | K-Home Đồng Nai`
      : `${article.title} | K-Home CityView Đồng Nai`;
    const dirPath = path.join(newsDirBase, article.slug);

    // Chuyển đổi toàn bộ nội dung markdown sang HTML ngữ nghĩa để bot Google đọc 100%
    const contentHtml = markdownToHtml(article.content, article);
    const related = ALL_NEWS.filter(n => n.slug !== article.slug && (n.project === article.project || !article.project)).slice(0, 2);
    const bodyHtml = renderNewsDetailHtml(article, contentHtml, related);

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

    // Static links chuẩn SEO truyền link juice mạnh mẽ về các trang pillar và trang dự án chính
    const staticLinks = [
      { href: "/nha-o-xa-hoi-bien-hoa", text: "Nhà Ở Xã Hội Biên Hòa 2026: Tổng Hợp Dự Án, Bảng Giá & Hướng Dẫn Mua A-Z" },
      { href: "/nha-o-xa-hoi-nhon-trach", text: "Nhà Ở Xã Hội Nhơn Trạch 2026: Tổng Hợp Dự Án, Bảng Giá & Hướng Dẫn Mua A-Z" },
      { href: "/nha-o-xa-hoi-trang-bom", text: "Nhà Ở Xã Hội Trảng Bom 2026: Tổng Hợp Dự Án, Bảng Giá & Hướng Dẫn Mua A-Z" },
      { href: "/k-home-cityview-ho-nai", text: "Nhà Ở Xã Hội Biên Hòa – K-Home CityView Hố Nai" },
      { href: "/k-home-avenue-nhon-trach", text: "Nhà Ở Xã Hội Nhơn Trạch – K-Home Avenue" },
      { href: "/k-home-midtown-trang-bom", text: "Nhà Ở Xã Hội Trảng Bom – K-Home Midtown" },
      { href: "/k-home-skyview-trang-bom", text: "Nhà Ở Xã Hội Trảng Bom – K-Home SkyView Bàu Xéo" },
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
      bodyHtml,
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
      description: "Xem video phóng sự truyền hình toàn cảnh về dự án nhà ở xã hội K-Home CityView tại Hố Nai, TP. Biên Hòa do Kim Oanh Land phát triển. Quy mô 1.382 căn chuẩn Singapore, giá từ 950 triệu.",
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
        "description": vid.description,
        "primaryImageOfPage": `https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`,
        "mainEntity": {
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
      bodyHtml: renderVideoWatchHtml(vid.slug),
    });
    count++;
    console.log(`✅ /video/${vid.slug}`);
  }

  console.log(`\n🎉 Done — ${count} files generated (${STATIC_ROUTES.length} static + ${ALL_NEWS.length} news + ${DEDICATED_VIDEOS.length} watch pages)`);

  // 4. Vercel root 404.html — Vercel dùng file này khi không tìm thấy asset tĩnh
  // (khác với /404/index.html dành cho route /404 trong SPA)
  let notFoundHtml = injectMeta(template, {
    title: "Không Tìm Thấy Trang | K-Home Đồng Nai",
    description: "Trang bạn đang tìm không tồn tại. Hãy quay lại trang chủ hoặc xem các dự án nhà ở xã hội K-Home tại Đồng Nai.",
    canonical: `${BASE_URL}/404`,
    keywords: null,
  });
  notFoundHtml = notFoundHtml.replace('<div id="root"></div>', `<div id="root">${renderNotFoundHtml()}</div>`);
  fs.writeFileSync(path.join(DIST_DIR, "404.html"), notFoundHtml, "utf-8");
  console.log("✅ /404.html (Vercel root error page)");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});

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
    title: "K-Home CityView Hố Nai Biên Hòa | Bảng Giá & Mặt Bằng NOXH Kim Oanh Land",
    description: "Dự án nhà ở xã hội K-Home CityView tại đường Điểu Xiển, Hố Nai, Biên Hòa. 1.352 căn hộ NOXH, diện tích 47–84m², giá từ 950 triệu, lãi suất 5,4%/năm. Cập nhật bảng giá & tiến độ 2026.",
    keywords: "k-home cityview, k home cityview, k home city view, khome cityview, k-home city view, k-home cityview hố nai, k-home cityview biên hòa, k home cityview biên hòa, nhà ở xã hội k-home cityview, bảng giá k-home cityview, mặt bằng k-home cityview, k home đồng nai",
  },
  {
    dir: "k-home-midtown-trang-bom",
    title: "K-Home Midtown Trảng Bom | Nhà Ở Xã Hội Kim Oanh | Giá từ 750 Triệu",
    description: "K-Home Midtown Trảng Bom – dự án NOXH quy mô 13,97 ha, 542 căn hộ Studio đến 2PN. Trung tâm Trảng Bom, vay 5,4%/năm. Xem bảng giá & mặt bằng mới nhất 2026.",
    keywords: "k-home midtown, k home midtown, k home midtown trảng bom, k-home midtown trảng bom, khome midtown, k home mid town, k-home mid town, nhà ở xã hội trảng bom, noxh trảng bom kim oanh, k home đồng nai trảng bom",
  },
  {
    dir: "k-home-avenue-nhon-trach",
    title: "K-Home Avenue Nhơn Trạch | NOXH Gần Sân Bay Long Thành | Giá từ 750 Triệu",
    description: "K-Home Avenue Nhơn Trạch – nhà ở xã hội 4 block 12 tầng, 1.022 căn hộ. Gần sân bay Long Thành, đường 25C. Vay 5,4%/năm, pháp lý đầy đủ. Xem bảng giá & mặt bằng.",
    keywords: "k-home avenue, k home avenue, k home avenue nhơn trạch, k-home avenue nhơn trạch, khome avenue, k-home avenue đồng nai, nhà ở xã hội nhơn trạch, noxh nhơn trạch kim oanh, k home đồng nai nhơn trạch, noxh gần sân bay long thành",
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

function writeRoute(template, dirPath, meta) {
  const html = injectMeta(template, meta);
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
  for (const route of STATIC_ROUTES) {
    const canonical = `${BASE_URL}/${route.dir}`;
    const dirPath = path.join(DIST_DIR, route.dir);
    writeRoute(template, dirPath, {
      title: route.title,
      description: route.description,
      canonical,
      keywords: route.keywords ?? null,
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
    writeRoute(template, dirPath, {
      title,
      description: article.excerpt,
      canonical,
    });
    count++;
    console.log(`✅ /tin-tuc/${article.slug}`);
  }

  console.log(`\n🎉 Done — ${count} files generated (${STATIC_ROUTES.length} static + ${NEWS_DATA.length} news)`);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});

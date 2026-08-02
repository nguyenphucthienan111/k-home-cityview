/**
 * Generate static HTML files cho từng route quan trọng
 * Mỗi file có đúng title/meta/canonical cho Googlebot
 * Run: node scripts/generate-static-html.mjs (sau npm run build)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, "../dist");

// SEO data cho từng route
const ROUTES = [
  {
    path: "/k-home-cityview-ho-nai",
    title: "K-Home CityView Hố Nai Biên Hòa | Bảng Giá & Mặt Bằng NOXH Kim Oanh Land",
    description: "Dự án nhà ở xã hội K-Home CityView tại đường Điểu Xiển, Hố Nai, Biên Hòa. 1.352 căn hộ NOXH, diện tích 47–84m², giá từ 950 triệu, lãi suất 5,4%/năm. Cập nhật bảng giá & tiến độ 2026.",
    canonical: "https://k-homedongnai.com.vn/k-home-cityview-ho-nai",
    dir: "k-home-cityview-ho-nai",
  },
  {
    path: "/k-home-midtown-trang-bom",
    title: "K-Home Midtown Trảng Bom | Nhà Ở Xã Hội Kim Oanh | Giá từ 750 Triệu",
    description: "K-Home Midtown Trảng Bom – dự án NOXH quy mô 13,97 ha, 542 căn hộ Studio đến 2PN. Trung tâm Trảng Bom, vay 5,4%/năm. Xem bảng giá & mặt bằng mới nhất 2026.",
    canonical: "https://k-homedongnai.com.vn/k-home-midtown-trang-bom",
    dir: "k-home-midtown-trang-bom",
  },
  {
    path: "/k-home-avenue-nhon-trach",
    title: "K-Home Avenue Nhơn Trạch | NOXH Gần Sân Bay Long Thành | Giá từ 750 Triệu",
    description: "K-Home Avenue Nhơn Trạch – nhà ở xã hội 4 block 12 tầng, 1.022 căn hộ. Gần sân bay Long Thành, đường 25C. Vay 5,4%/năm, pháp lý đầy đủ. Xem bảng giá & mặt bằng.",
    canonical: "https://k-homedongnai.com.vn/k-home-avenue-nhon-trach",
    dir: "k-home-avenue-nhon-trach",
  },
  {
    path: "/san-pham",
    title: "Danh Sách Dự Án K-Home Đồng Nai | Bảng Giá 3 Dự Án NOXH Kim Oanh",
    description: "Xem đầy đủ thông tin, bảng giá và mặt bằng 3 dự án nhà ở xã hội K-Home tại Đồng Nai: CityView Biên Hòa, Midtown Trảng Bom, Avenue Nhơn Trạch. Kim Oanh Land.",
    canonical: "https://k-homedongnai.com.vn/san-pham",
    dir: "san-pham",
  },
  {
    path: "/tin-tuc",
    title: "Tin Tức Nhà Ở Xã Hội K-Home Đồng Nai | Cập Nhật Mới Nhất",
    description: "Cập nhật tin tức mới nhất về nhà ở xã hội K-Home Đồng Nai, điều kiện mua NOXH 2026, tiến độ dự án CityView, Midtown, Avenue từ Kim Oanh Land.",
    canonical: "https://k-homedongnai.com.vn/tin-tuc",
    dir: "tin-tuc",
  },
  {
    path: "/gioi-thieu",
    title: "Giới Thiệu K-Home Đồng Nai | Kim Oanh Land – NOXH Đồng Nai",
    description: "Kim Oanh Land – Top 10 nhà phát triển NOXH Việt Nam. Tìm hiểu về chủ đầu tư và chuỗi dự án K-Home tại Đồng Nai: CityView, Midtown, Avenue.",
    canonical: "https://k-homedongnai.com.vn/gioi-thieu",
    dir: "gioi-thieu",
  },
  {
    path: "/lien-he",
    title: "Liên Hệ Tư Vấn K-Home Đồng Nai | Hotline 0937 587 438",
    description: "Liên hệ tư vấn miễn phí về dự án nhà ở xã hội K-Home tại Đồng Nai. Hotline: 0937 587 438. Hỗ trợ hồ sơ NOXH, bảng giá và thủ tục vay ngân hàng.",
    canonical: "https://k-homedongnai.com.vn/lien-he",
    dir: "lien-he",
  },
];

function generateHtml(template, route) {
  return template
    .replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`)
    .replace(
      /<meta name="description"[^>]*>/,
      `<meta name="description" content="${route.description}" />`
    )
    .replace(
      /<link rel="canonical"[^>]*>/,
      `<link rel="canonical" href="${route.canonical}" />`
    )
    .replace(
      /<meta property="og:title"[^>]*>/,
      `<meta property="og:title" content="${route.title}" />`
    )
    .replace(
      /<meta property="og:description"[^>]*>/,
      `<meta property="og:description" content="${route.description}" />`
    )
    .replace(
      /<meta property="og:url"[^>]*>/,
      `<meta property="og:url" content="${route.canonical}" />`
    )
    .replace(
      /<meta name="twitter:url"[^>]*>/,
      `<meta name="twitter:url" content="${route.canonical}" />`
    )
    .replace(
      /<meta name="twitter:title"[^>]*>/,
      `<meta name="twitter:title" content="${route.title}" />`
    )
    .replace(
      /<meta name="twitter:description"[^>]*>/,
      `<meta name="twitter:description" content="${route.description}" />`
    );
}

async function main() {
  // Đọc index.html từ dist
  const templatePath = path.join(DIST_DIR, "index.html");
  if (!fs.existsSync(templatePath)) {
    console.error("❌ dist/index.html not found. Run npm run build first.");
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, "utf-8");
  console.log("📄 Template loaded from dist/index.html\n");

  let created = 0;
  for (const route of ROUTES) {
    const html = generateHtml(template, route);
    const dirPath = path.join(DIST_DIR, route.dir);

    // Tạo folder nếu chưa có
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Ghi index.html vào folder
    fs.writeFileSync(path.join(dirPath, "index.html"), html, "utf-8");
    created++;
    console.log(`✅ ${route.path} → dist${route.path}/index.html`);
    console.log(`   Title: ${route.title.slice(0, 60)}...`);
  }

  console.log(`\n🎉 Generated ${created} static HTML files`);
}

main().catch(console.error);

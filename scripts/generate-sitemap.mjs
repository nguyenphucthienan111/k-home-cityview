#!/usr/bin/env node
/**
 * generate-sitemap.mjs — Tạo sitemap.xml với image tags + robots.txt
 * Chạy: node scripts/generate-sitemap.mjs
 * Đã tích hợp vào "npm run build"
 *
 * News URLs được lấy tự động từ scripts/news-data.mjs — không hardcode nữa
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parseNewsData } from "./parse-news.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "../public");
const BASE_URL   = "https://k-homedongnai.com.vn";
const TODAY      = new Date().toISOString().split("T")[0];

// ─── Ảnh khai báo cho từng trang (giống đối thủ khai báo image trong sitemap) ─
const PAGE_IMAGES = {
  "/k-home-cityview-ho-nai": [
    { loc: "/k-home cityview/V34_TAN-HOA_EXT_FACADE_FINAL_2.webp",            title: "Phối cảnh tổng thể K-Home CityView Hố Nai Biên Hòa Đồng Nai" },
    { loc: "/k-home cityview/TAN-HOA_AERIAL_1_DRAFT-3_2-1.webp",              title: "Toàn cảnh nhìn từ trên cao K-Home CityView NOXH Hố Nai" },
    { loc: "/k-home cityview/V11_TH_EXT_NOTM_POOL_2.webp",                    title: "Hồ bơi nội khu K-Home CityView chuẩn Singapore Biên Hòa" },
    { loc: "/k-home cityview/V12_TH_EXT_NOXH_POOL_2.webp",                    title: "Hồ bơi nhà ở xã hội K-Home CityView Hố Nai Kim Oanh" },
    { loc: "/k-home cityview/V03_TAN-HOA_EXT_NOXH_KID-PLAYGROUND_FINAL_2-1.webp", title: "Khu vui chơi trẻ em K-Home CityView Hố Nai Đồng Nai" },
    { loc: "/k-home cityview/V10_TH_EXT_GARDEN_FINAL_2.webp",                 title: "Vườn cảnh quan xanh mát K-Home CityView Kim Oanh Land" },
    { loc: "/k-home cityview/V07_TH_EXT_NOXH_KHOI-DE_FINAL_2-1.webp",        title: "Shophouse khối đế K-Home CityView đường Điểu Xiển Hố Nai" },
    { loc: "/k-home cityview/V36_TAN-HOA_EXT_NOXH_PARK_FINAL_2.jpg",         title: "Công viên nội khu K-Home CityView NOXH Biên Hòa Đồng Nai" },
    { loc: "/k-home cityview/V02_TAN-HOA_EXT_BBQ-GARDEN_FN_2-1.webp",        title: "Khu BBQ và vườn cộng đồng K-Home CityView Kim Oanh" },
    { loc: "/k-home cityview/V09_TH_EXT_STREET-VIEW_FINAL_2.webp",            title: "Mặt tiền đường Điểu Xiển K-Home CityView Hố Nai" },
    { loc: "/k-home cityview/mat-bang/mat-bang-k-home-cityview-tang-12A-22.jpg.webp", title: "Mặt bằng tầng 12A-22 K-Home CityView Hố Nai Biên Hòa" },
    { loc: "/k-home cityview/mat-bang/mat-bang-k-home-cityview-tang-4-11.jpg.webp",  title: "Mặt bằng tầng 4-11 K-Home CityView căn hộ NOXH" },
    { loc: "/k-home cityview/mat-bang/mat-bang-k-home-cityview-tang-3.jpg.webp",     title: "Mặt bằng tầng 3 vườn treo K-Home CityView" },
    { loc: "/k-home cityview/mat-bang/k-home-cityview-mat-bang-tang-1.jpg.webp",     title: "Mặt bằng tầng 1 tiện ích K-Home CityView Hố Nai" },
    { loc: "/k-home cityview/mat-bang/thiet-ke-can-ho-layout-khome-city-view-2048x764.jpg.webp", title: "Thiết kế căn hộ 1PN 2PN 3PN K-Home CityView Kim Oanh" },
    { loc: "/k-home cityview/mat-bang/tien-ich-k-home-city-view-8.jpg.webp",  title: "Tiện ích nội khu NOXH K-Home CityView Hố Nai Biên Hòa" },
    { loc: "/k-home cityview/mat-bang/tien-ich-k-home-city-view-6.jpg.webp",  title: "Hồ bơi ngoài trời K-Home CityView Biên Hòa Đồng Nai" },
    { loc: "/k-home cityview/mat-bang/vi-tri-k-home-dong-nai-kim-oanh-1-scaled.jpg.webp", title: "Vị trí dự án K-Home CityView Hố Nai gần KCN Amata Biên Hòa 2" },
    { loc: "/k-home cityview/Can-1PN-A/khome-cityview-nha-mau-can-ho-1PN-1.jpg",    title: "Nhà mẫu căn 1 phòng ngủ A K-Home CityView Kim Oanh Land" },
    { loc: "/k-home cityview/Can-2PN/khome-cityview-nha-mau-can-ho-2PN-1.jpg",      title: "Nhà mẫu căn 2 phòng ngủ K-Home CityView Hố Nai Biên Hòa" },
    { loc: "/k-home cityview/Can-3PN/3pn-noxh-k-home-city-view.jpg",                title: "Nhà mẫu căn 3 phòng ngủ NOXH K-Home CityView Đồng Nai" },
  ],
  "/k-home-midtown-trang-bom": [
    { loc: "/k-home midtown/Du-an-K-Home-Midtown-3d-birdview-toan-canh-dem-2048x1150.webp", title: "Phối cảnh K-Home Midtown Trảng Bom Đồng Nai" },
    { loc: "/k-home midtown/Du-an-K-Home-Midtown-3d-ho-boi-view-2-2048x1150.webp",          title: "Hồ bơi nội khu K-Home Midtown Trảng Bom Kim Oanh" },
    { loc: "/k-home midtown/Du-an-K-Home-Midtown-3d-cong-vien-thap-tang-2048x1150.webp",    title: "Công viên cây xanh K-Home Midtown Trảng Bom Đồng Nai" },
  ],
  "/k-home-avenue-nhon-trach": [
    { loc: "/k-home avenue/Pc09-Loi-vao-shophouse_2-min.jpg.webp",   title: "Shophouse K-Home Avenue Nhơn Trạch gần sân bay Long Thành" },
    { loc: "/k-home avenue/PC01-TT-copy_2_2-min.jpg.webp",           title: "Phối cảnh K-Home Avenue Nhơn Trạch NOXH Đồng Nai" },
    { loc: "/k-home avenue/Pc07-Tien-ich-be-boi_2-min.jpg.webp",     title: "Hồ bơi tiện ích K-Home Avenue Nhơn Trạch Kim Oanh" },
    { loc: "/k-home avenue/Pc05-Tien-ich-khu-vui-choi_2-min.jpg.webp", title: "Khu vui chơi trẻ em K-Home Avenue Nhơn Trạch" },
  ],
  "/": [
    { loc: "/hero-background.jpg", title: "K-Home Đồng Nai – Nhà Ở Xã Hội Kim Oanh Land Biên Hòa" },
  ],
};

// ─── URL list ─────────────────────────────────────────────────────────────────
const STATIC_URLS = [
  { loc: "/",                         priority: "0.6",  changefreq: "daily",   lastmod: TODAY },
  { loc: "/san-pham",                 priority: "0.8",  changefreq: "weekly",  lastmod: TODAY },
  { loc: "/k-home-cityview-ho-nai",   priority: "1.0",  changefreq: "weekly",  lastmod: TODAY }, // ⭐ SAME AS HOMEPAGE — Featured Project
  { loc: "/k-home-midtown-trang-bom", priority: "0.85", changefreq: "weekly",  lastmod: TODAY },
  { loc: "/k-home-avenue-nhon-trach", priority: "0.85", changefreq: "weekly",  lastmod: TODAY },
  { loc: "/tin-tuc",                  priority: "0.7",  changefreq: "weekly",  lastmod: TODAY },
  { loc: "/gioi-thieu",               priority: "0.6",  changefreq: "monthly", lastmod: TODAY },
  { loc: "/lien-he",                  priority: "0.6",  changefreq: "monthly", lastmod: TODAY },
];

const UNIT_URLS = [
  ...["can-ho-1-phong-ngu-a","can-ho-1-phong-ngu-b","can-ho-2-phong-ngu-cityview","can-ho-3-phong-ngu"]
    .map(u => ({ loc: `/k-home-cityview-ho-nai/${u}`,   priority: "0.8",  changefreq: "weekly", lastmod: TODAY })),
  ...["can-ho-studio","can-ho-1-phong-ngu-a","can-ho-1-phong-ngu-b","can-ho-2-phong-ngu"]
    .map(u => ({ loc: `/k-home-midtown-trang-bom/${u}`, priority: "0.75", changefreq: "weekly", lastmod: TODAY })),
  ...["can-ho-studio","can-ho-1-phong-ngu","can-ho-2-phong-ngu","can-ho-2-phong-ngu-b-avenue"]
    .map(u => ({ loc: `/k-home-avenue-nhon-trach/${u}`, priority: "0.75", changefreq: "weekly", lastmod: TODAY })),
];

// ─── Tin tức — tự động parse từ api/news.ts ───────────────────────────────────
const NEWS_URLS = parseNewsData().map(article => ({
  loc: `/tin-tuc/${article.slug}`,
  lastmod: article.date,
  priority: "0.65",
  changefreq: "weekly",
}));

const ALL_URLS = [...STATIC_URLS, ...UNIT_URLS, ...NEWS_URLS];

// Encode space → %20 trong URL ảnh
const enc = (s) => s.replace(/ /g, "%20");

// ─── Generate sitemap.xml ─────────────────────────────────────────────────────
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${ALL_URLS.map(url => {
  const imgs = PAGE_IMAGES[url.loc] || [];
  const imgXml = imgs.map(i =>
    `    <image:image>\n      <image:loc>${BASE_URL}${enc(i.loc)}</image:loc>\n      <image:title>${i.title}</image:title>\n    </image:image>`
  ).join("\n");
  return `  <url>
    <loc>${BASE_URL}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
${imgXml ? imgXml + "\n" : ""}  </url>`;
}).join("\n")}
</urlset>`;

// ─── Tạo post-sitemap.xml (trang dự án + căn hộ) ─────────────────────────────
const postUrls = [...STATIC_URLS.filter(u => u.loc.startsWith("/k-home")), ...UNIT_URLS, ...NEWS_URLS];
const postSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${postUrls.map(url => {
  const imgs = PAGE_IMAGES[url.loc] || [];
  const imgXml = imgs.map(i =>
    `    <image:image>\n      <image:loc>${BASE_URL}${enc(i.loc)}</image:loc>\n      <image:title>${i.title}</image:title>\n    </image:image>`
  ).join("\n");
  return `  <url>
    <loc>${BASE_URL}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
${imgXml ? imgXml + "\n" : ""}  </url>`;
}).join("\n")}
</urlset>`;

// ─── Tạo page-sitemap.xml (trang tĩnh) ───────────────────────────────────────
const pageUrls = STATIC_URLS.filter(u => !u.loc.startsWith("/k-home"));
const pageSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pageUrls.map(url => {
  const imgs = PAGE_IMAGES[url.loc] || [];
  const imgXml = imgs.map(i =>
    `    <image:image>\n      <image:loc>${BASE_URL}${enc(i.loc)}</image:loc>\n      <image:title>${i.title}</image:title>\n    </image:image>`
  ).join("\n");
  return `  <url>
    <loc>${BASE_URL}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
${imgXml ? imgXml + "\n" : ""}  </url>`;
}).join("\n")}
</urlset>`;

// ─── Tạo sitemap_index.xml (file mẹ — giống cấu trúc đối thủ) ────────────────
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/post-sitemap.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/page-sitemap.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
</sitemapindex>`;

// Ghi tất cả files
fs.writeFileSync(path.join(PUBLIC_DIR, "post-sitemap.xml"),  postSitemap,  "utf-8");
fs.writeFileSync(path.join(PUBLIC_DIR, "page-sitemap.xml"),  pageSitemap,  "utf-8");
fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap_index.xml"), sitemapIndex, "utf-8");
// sitemap.xml = alias của sitemap_index để tương thích các tool cũ
fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap.xml"), sitemapIndex.replace("sitemapindex", "sitemapindex"), "utf-8");

const totalImages = ALL_URLS.reduce((s, u) => s + (PAGE_IMAGES[u.loc]?.length || 0), 0);
console.log(`✅ sitemap_index.xml — 2 sitemaps`);
console.log(`   post-sitemap.xml  — ${postUrls.length} URLs, ${postUrls.reduce((s,u)=>s+(PAGE_IMAGES[u.loc]?.length||0),0)} images`);
console.log(`   page-sitemap.xml  — ${pageUrls.length} URLs`);

// ─── robots.txt ───────────────────────────────────────────────────────────────
const robotsTxt = `# robots.txt — k-homedongnai.com.vn
User-agent: *
Allow: /
Allow: /api/projects
Allow: /api/news
Disallow: /admin
Disallow: /api/admin
Sitemap: ${BASE_URL}/sitemap_index.xml
`;

fs.writeFileSync(path.join(PUBLIC_DIR, "robots.txt"), robotsTxt, "utf-8");
console.log("✅ robots.txt — Sitemap URL updated to sitemap_index.xml");
console.log(`\n📊 Total: ${ALL_URLS.length} URLs | ${totalImages} images | ${TODAY}`);

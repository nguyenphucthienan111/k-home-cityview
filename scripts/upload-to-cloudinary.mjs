/**
 * Upload toàn bộ ảnh trong /public lên Cloudinary
 * Chỉ upload file chưa tồn tại (idempotent)
 * Run: node scripts/upload-to-cloudinary.mjs
 */
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "../public");

cloudinary.config({
  cloud_name: "dthv0nsq",
  api_key:    "649843139256213",
  api_secret: "dmv4t8j4oiN6JWSV58HJwjl_yN4",
});

// Lấy tất cả ảnh JPG/PNG/WebP trong /public
function getAllImages(dir, base = PUBLIC_DIR) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllImages(fullPath, base));
    } else if (/\.(jpg|jpeg|png|webp)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

// Convert local path → Cloudinary public_id
// Ví dụ: /public/k-home cityview/Can-1PN-A/img.jpg → k-home-cityview/Can-1PN-A/img
function toPublicId(filePath) {
  const rel = path.relative(PUBLIC_DIR, filePath);
  // Bỏ extension kép như .jpg.webp, replace backslash, normalize spaces
  return rel
    .replace(/\\/g, "/")
    .replace(/(\.(jpg|jpeg|png|webp))+$/i, "")
    .replace(/ /g, "-");
}

// Upload 1 file với retry
async function uploadFile(filePath, retries = 2) {
  const publicId = toPublicId(filePath);
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      overwrite: true,         // overwrite để fix các file đã upload sai public_id
      invalidate: true,
      resource_type: "image",
      quality: "auto:good",    // auto quality
      fetch_format: "auto",    // auto WebP/AVIF
    });
    return { ok: true, publicId, url: result.secure_url };
  } catch (err) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 1000));
      return uploadFile(filePath, retries - 1);
    }
    return { ok: false, publicId, error: err.message };
  }
}

async function main() {
  const images = getAllImages(PUBLIC_DIR);
  console.log(`📦 Tìm thấy ${images.length} ảnh cần upload\n`);

  // Upload theo batch 5 file cùng lúc
  const BATCH = 5;
  const results = { ok: 0, skipped: 0, failed: 0, urls: {} };

  for (let i = 0; i < images.length; i += BATCH) {
    const batch = images.slice(i, i + BATCH);
    const promises = batch.map(f => uploadFile(f));
    const batchResults = await Promise.all(promises);

    for (const r of batchResults) {
      if (r.ok && r.skipped) {
        results.skipped++;
        console.log(`⏭  SKIP  ${r.publicId}`);
      } else if (r.ok) {
        results.ok++;
        results.urls[r.publicId] = r.url;
        console.log(`✅ OK    ${r.publicId}`);
      } else {
        results.failed++;
        console.error(`❌ FAIL  ${r.publicId}: ${r.error}`);
      }
    }

    console.log(`   Progress: ${Math.min(i + BATCH, images.length)}/${images.length}`);
  }

  console.log(`\n🎉 Done! OK: ${results.ok}, Skipped: ${results.skipped}, Failed: ${results.failed}`);

  // Lưu mapping URL ra file để dùng update projects.ts
  fs.writeFileSync(
    path.join(__dirname, "cloudinary-urls.json"),
    JSON.stringify(results.urls, null, 2)
  );
  console.log(`📄 URLs saved to scripts/cloudinary-urls.json`);
}

main().catch(console.error);

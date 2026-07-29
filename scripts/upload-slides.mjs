/**
 * Upload ảnh slide K-Home CityView lên Cloudinary
 * Run: node scripts/upload-slides.mjs
 */
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SLIDE_DIR = path.join(__dirname, "../public/slide-k-home-cityview");

cloudinary.config({
  cloud_name: "dthv0nsq",
  api_key:    "649843139256213",
  api_secret: "dmv4t8j4oiN6JWSV58HJwjl_yN4",
});

async function uploadFile(filePath, retries = 2) {
  // public_id: slide-k-home-cityview/slide-0, slide-1, ...
  const fileName = path.basename(filePath);
  // Extract number from filename like "...hình ảnh-5.jpg"
  const match = fileName.match(/-(\d+)\.jpg$/i);
  const num = match ? parseInt(match[1]) : fileName;
  const publicId = `slide-k-home-cityview/slide-${num}`;

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      overwrite: true,
      invalidate: true,
      resource_type: "image",
      quality: "auto:good",
      fetch_format: "auto",
    });
    return { ok: true, publicId, url: result.secure_url, num };
  } catch (err) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 1500));
      return uploadFile(filePath, retries - 1);
    }
    return { ok: false, publicId, error: err.message, num };
  }
}

async function main() {
  const files = fs.readdirSync(SLIDE_DIR)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .map(f => path.join(SLIDE_DIR, f));

  // Sort by number
  files.sort((a, b) => {
    const numA = parseInt(path.basename(a).match(/-(\d+)\./)?.[1] ?? "0");
    const numB = parseInt(path.basename(b).match(/-(\d+)\./)?.[1] ?? "0");
    return numA - numB;
  });

  console.log(`📦 Tìm thấy ${files.length} slide cần upload\n`);

  const BATCH = 4;
  const results = { ok: 0, failed: 0, urls: {} };

  for (let i = 0; i < files.length; i += BATCH) {
    const batch = files.slice(i, i + BATCH);
    const batchResults = await Promise.all(batch.map(f => uploadFile(f)));

    for (const r of batchResults) {
      if (r.ok) {
        results.ok++;
        results.urls[r.publicId] = r.url;
        console.log(`✅ OK  slide-${r.num} → ${r.publicId}`);
      } else {
        results.failed++;
        console.error(`❌ FAIL slide-${r.num}: ${r.error}`);
      }
    }
    console.log(`   Progress: ${Math.min(i + BATCH, files.length)}/${files.length}`);
  }

  console.log(`\n🎉 Done! OK: ${results.ok}, Failed: ${results.failed}`);
  fs.writeFileSync(
    path.join(__dirname, "slide-urls.json"),
    JSON.stringify(results.urls, null, 2)
  );
  console.log(`📄 URLs saved to scripts/slide-urls.json`);
}

main().catch(console.error);

/**
 * Upload ảnh slide K-Home Midtown lên Cloudinary
 * Run: node scripts/upload-midtown-slides.mjs
 */
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SLIDE_DIR = path.join(__dirname, "../public/slide-k-home-midtown");

cloudinary.config({
  cloud_name: "dthv0nsq",
  api_key:    "649843139256213",
  api_secret: "dmv4t8j4oiN6JWSV58HJwjl_yN4",
});

// Map filename → clean public_id slug
function toSlug(filename) {
  return filename
    .replace(/\.[^.]+$/, "")           // remove extension
    .toLowerCase()
    .replace(/à|á|ả|ã|ạ|ă|ắ|ặ|ằ|ẳ|ẵ|â|ấ|ầ|ẩ|ẫ|ậ/g, "a")
    .replace(/è|é|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/g, "e")
    .replace(/ì|í|ỉ|ĩ|ị/g, "i")
    .replace(/ò|ó|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/g, "o")
    .replace(/ù|ú|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/g, "u")
    .replace(/ỳ|ý|ỷ|ỹ|ỵ/g, "y")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);                      // max 80 chars
}

async function uploadFile(filePath, retries = 2) {
  const fileName = path.basename(filePath);
  const slug = toSlug(fileName);
  const publicId = `slide-k-home-midtown/${slug}`;

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      overwrite: true,
      invalidate: true,
      resource_type: "image",
      quality: "auto:good",
      fetch_format: "auto",
    });
    return { ok: true, publicId, url: result.secure_url, slug };
  } catch (err) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 1500));
      return uploadFile(filePath, retries - 1);
    }
    return { ok: false, publicId, error: err.message, slug };
  }
}

async function main() {
  const files = fs.readdirSync(SLIDE_DIR)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .map(f => path.join(SLIDE_DIR, f));

  console.log(`📦 Tìm thấy ${files.length} ảnh Midtown cần upload\n`);

  const BATCH = 4;
  const results = { ok: 0, failed: 0, mapping: {} };

  for (let i = 0; i < files.length; i += BATCH) {
    const batch = files.slice(i, i + BATCH);
    const batchResults = await Promise.all(batch.map(f => uploadFile(f)));

    for (const r of batchResults) {
      if (r.ok) {
        results.ok++;
        results.mapping[path.basename(files[results.ok - 1 + results.failed])] = r.publicId;
        console.log(`✅ OK  ${r.slug}`);
        console.log(`      → ${r.publicId}`);
      } else {
        results.failed++;
        console.error(`❌ FAIL ${r.slug}: ${r.error}`);
      }
    }
    console.log(`   Progress: ${Math.min(i + BATCH, files.length)}/${files.length}\n`);
  }

  console.log(`\n🎉 Done! OK: ${results.ok}, Failed: ${results.failed}`);

  // Save mapping for reference
  const mapping = {};
  for (const f of files) {
    const slug = toSlug(path.basename(f));
    mapping[path.basename(f)] = `slide-k-home-midtown/${slug}`;
  }
  fs.writeFileSync(
    path.join(__dirname, "midtown-slide-mapping.json"),
    JSON.stringify(mapping, null, 2)
  );
  console.log(`📄 Mapping saved to scripts/midtown-slide-mapping.json`);
}

main().catch(console.error);

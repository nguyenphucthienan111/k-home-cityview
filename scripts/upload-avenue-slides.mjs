import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SLIDE_DIR = path.join(__dirname, "../public/slide-k-home-avenue");

cloudinary.config({
  cloud_name: "dthv0nsq",
  api_key:    "649843139256213",
  api_secret: "dmv4t8j4oiN6JWSV58HJwjl_yN4",
});

function toSlug(filename) {
  return filename
    .replace(/\.[^.]+$/, "")
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
    .slice(0, 80);
}

async function uploadFile(filePath, retries = 2) {
  const slug = toSlug(path.basename(filePath));
  const publicId = `slide-k-home-avenue/${slug}`;
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId, overwrite: true, invalidate: true,
      resource_type: "image", quality: "auto:good", fetch_format: "auto",
    });
    return { ok: true, publicId, url: result.secure_url };
  } catch (err) {
    if (retries > 0) { await new Promise(r => setTimeout(r, 1500)); return uploadFile(filePath, retries - 1); }
    return { ok: false, publicId, error: err.message };
  }
}

async function main() {
  const files = fs.readdirSync(SLIDE_DIR).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f)).map(f => path.join(SLIDE_DIR, f));
  console.log(`📦 Tìm thấy ${files.length} ảnh Avenue\n`);
  const mapping = {};
  for (let i = 0; i < files.length; i += 4) {
    const batch = files.slice(i, i + 4);
    const results = await Promise.all(batch.map(f => uploadFile(f)));
    for (const r of results) {
      if (r.ok) { mapping[r.publicId] = r.url; console.log(`✅ ${r.publicId}`); }
      else console.error(`❌ ${r.publicId}: ${r.error}`);
    }
    console.log(`   Progress: ${Math.min(i + 4, files.length)}/${files.length}`);
  }
  fs.writeFileSync(path.join(__dirname, "avenue-slide-mapping.json"), JSON.stringify(mapping, null, 2));
  console.log(`\n🎉 Done! Mapping saved to scripts/avenue-slide-mapping.json`);
}
main().catch(console.error);

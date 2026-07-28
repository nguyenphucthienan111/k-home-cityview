/**
 * Re-upload các file có extension kép (.jpg.webp) với public_id đúng
 * Run: node scripts/fix-double-ext.mjs
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

function toPublicId(filePath) {
  const rel = path.relative(PUBLIC_DIR, filePath);
  return rel
    .replace(/\\/g, "/")
    .replace(/(\.(jpg|jpeg|png|webp))+$/i, "")  // strip extension kép
    .replace(/ /g, "-");
}

function getAllDoubleExtImages(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllDoubleExtImages(fullPath));
    } else if (/\.(jpg|jpeg|png|webp)\.(jpg|jpeg|png|webp)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

async function main() {
  const files = getAllDoubleExtImages(PUBLIC_DIR);
  console.log(`🔧 Tìm thấy ${files.length} file extension kép cần fix\n`);

  for (const f of files) {
    const publicId = toPublicId(f);
    console.log(`Uploading: ${publicId}`);
    try {
      await cloudinary.uploader.upload(f, {
        public_id: publicId,
        overwrite: true,
        invalidate: true,
        resource_type: "image",
        quality: "auto:good",
        fetch_format: "auto",
      });
      console.log(`✅ OK: ${publicId}`);
    } catch (err) {
      console.error(`❌ FAIL: ${publicId} — ${err.message}`);
    }
  }
  console.log("\n🎉 Done!");
}

main().catch(console.error);

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FOLDER = path.join(__dirname, "../public/news");

cloudinary.config({
  cloud_name: "dthv0nsq",
  api_key:    "649843139256213",
  api_secret: "dmv4t8j4oiN6JWSV58HJwjl_yN4",
});

function toPublicId(filename) {
  return "k-home-cityview/news/" + filename
    .replace(/(\.(mp4|webm|mov|avi))+$/i, "")
    .replace(/ /g, "-")
    .toLowerCase();
}

async function main() {
  const files = fs.readdirSync(FOLDER).filter(f => /\.(mp4|webm|mov|avi)$/i.test(f));
  console.log(`Uploading ${files.length} video(s)...`);

  for (const f of files) {
    const publicId = toPublicId(f);
    try {
      const result = await cloudinary.uploader.upload(path.join(FOLDER, f), {
        public_id: publicId,
        overwrite: true,
        invalidate: true,
        resource_type: "video",
        quality: "auto",
        eager: [
          { width: 1280, height: 720, crop: "fit", quality: "auto" },
          { width: 640, height: 360, crop: "fit", quality: "auto" }
        ],
        eager_async: true,
        tags: ["k-home-cityview", "news"],
      });
      console.log(`✅ ${publicId}`);
      console.log(`   URL: ${result.secure_url}`);
    } catch (err) {
      console.error(`❌ ${publicId}: ${err.message}`);
    }
  }
  console.log("Done!");
}

main().catch(console.error);

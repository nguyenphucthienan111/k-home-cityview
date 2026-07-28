import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FOLDER = path.join(__dirname, "../public/k-home cityview/mat-bang");

cloudinary.config({
  cloud_name: "dthv0nsq",
  api_key:    "649843139256213",
  api_secret: "dmv4t8j4oiN6JWSV58HJwjl_yN4",
});

function toPublicId(filename) {
  return "k-home-cityview/mat-bang/" + filename
    .replace(/(\.(jpg|jpeg|png|webp))+$/i, "")
    .replace(/ /g, "-");
}

async function main() {
  const files = fs.readdirSync(FOLDER).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  console.log(`Uploading ${files.length} files...`);

  for (const f of files) {
    const publicId = toPublicId(f);
    try {
      const result = await cloudinary.uploader.upload(path.join(FOLDER, f), {
        public_id: publicId,
        overwrite: true,
        invalidate: true,
        resource_type: "image",
        quality: "auto:good",
        fetch_format: "auto",
      });
      console.log(`✅ ${publicId}`);
    } catch (err) {
      console.error(`❌ ${publicId}: ${err.message}`);
    }
  }
  console.log("Done!");
}

main().catch(console.error);

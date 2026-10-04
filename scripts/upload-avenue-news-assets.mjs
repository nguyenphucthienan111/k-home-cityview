import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AVENUE_DIR = path.join(__dirname, "../public/k-home avenue");

cloudinary.config({
  cloud_name: "dthv0nsq",
  api_key:    "649843139256213",
  api_secret: "dmv4t8j4oiN6JWSV58HJwjl_yN4",
});

const imageFiles = [
  "1791093831065_6670155327040053447_g6189235973430287538_a4c287b5273b5ec4abf763d01c7f2f1a.jpg",
  "1791093831096_6670155327040053447_g6189235973430287538_1daa818b01790b945cd996364a73798e.jpg",
  "1791093831117_6670155327040053447_g6189235973430287538_2164b330b252560050e213a92210fcfb.jpg",
  "1791093831133_6670155327040053447_g6189235973430287538_a687ed83608490e2ed835170fdcb1dba.jpg",
  "1791093831147_6670155327040053447_g6189235973430287538_6e08a9261ac426567562c7042882d975.jpg"
];

const videoFile = "1790939554694_6670155327040053447_g6189235973430287538.mp4";

async function main() {
  const uploaded = {
    images: [],
    video: null
  };

  console.log("Uploading 5 images to Cloudinary...");
  for (let i = 0; i < imageFiles.length; i++) {
    const fileName = imageFiles[i];
    const filePath = path.join(AVENUE_DIR, fileName);
    const publicId = `k-home-avenue/news/pho-thu-tuong-kiem-tra-san-bay-long-thanh-${i + 1}`;

    try {
      const res = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        overwrite: true,
        invalidate: true,
        resource_type: "image",
        quality: "auto:good",
        fetch_format: "auto",
        tags: ["k-home-avenue", "san-bay-long-thanh", "news"]
      });
      console.log(`✅ Image ${i + 1}: ${res.secure_url}`);
      uploaded.images.push({
        fileName,
        publicId,
        url: res.secure_url
      });
    } catch (err) {
      console.error(`❌ Failed image ${fileName}:`, err.message);
    }
  }

  console.log("\nUploading video to Cloudinary...");
  const videoPath = path.join(AVENUE_DIR, videoFile);
  const videoPublicId = `k-home-avenue/news/video-pho-thu-tuong-kiem-tra-san-bay-long-thanh`;
  try {
    const res = await cloudinary.uploader.upload(videoPath, {
      public_id: videoPublicId,
      overwrite: true,
      invalidate: true,
      resource_type: "video",
      quality: "auto",
      tags: ["k-home-avenue", "san-bay-long-thanh", "video"]
    });
    console.log(`✅ Video: ${res.secure_url}`);
    uploaded.video = {
      fileName: videoFile,
      publicId: videoPublicId,
      url: res.secure_url
    };
  } catch (err) {
    console.error(`❌ Failed video ${videoFile}:`, err.message);
  }

  fs.writeFileSync(
    path.join(__dirname, "uploaded-avenue-assets.json"),
    JSON.stringify(uploaded, null, 2),
    "utf-8"
  );
  console.log("\nDone! Saved to scripts/uploaded-avenue-assets.json");
}

main().catch(console.error);

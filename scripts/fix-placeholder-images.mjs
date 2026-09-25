import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const newsDataPath = path.join(ROOT_DIR, "src", "data", "newsData.ts");

const replacements = {
  n193: "https://res.cloudinary.com/dthv0nsq/image/upload/v1785230282/k-home-cityview/V07_TH_EXT_NOXH_KHOI-DE_FINAL_2-1.jpg",
  n194: "https://res.cloudinary.com/dthv0nsq/image/upload/v1786605627/hon-800-khach-hang-tham-quan-sales-gallery-k-home-cityview-trong-ngay-khai-truong-18_thf4k2.webp",
  n195: "https://res.cloudinary.com/dthv0nsq/image/upload/v1786605858/hon-800-khach-hang-tham-quan-sales-gallery-k-home-cityview-trong-ngay-khai-truong-1-5_kjphal.webp",
  n196: "https://res.cloudinary.com/dthv0nsq/image/upload/v1790229383/news/luat-dat-dai-2024-luat-nha-o-2023-so-hong-nguoi-lao-dong.jpg",
  n197: "https://res.cloudinary.com/dthv0nsq/image/upload/v1786456831/1-200-khach-hang-tham-du-su-kien-gioi-thieu-du-an-k-home-cityview-tai-trung-tam-do-thi-bien-hoa-1-2_bqb2ss.webp",
  n198: "https://res.cloudinary.com/dthv0nsq/image/upload/v1785230285/k-home-cityview/V35_TAN-HOA_EXT_NOXH_POOL2_2.jpg",
  n199: "https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/Can-2PN/khome-cityview-nha-mau-can-ho-2PN-1.jpg",
};

let content = fs.readFileSync(newsDataPath, "utf8");

for (const [id, newImageUrl] of Object.entries(replacements)) {
  const idPattern = new RegExp(`(id:\\s*"${id}"[\\s\\S]*?)(?=id:\\s*"n|\\n\\];)`);
  const match = content.match(idPattern);
  if (!match) {
    console.error(`Could not find block for ${id}`);
    continue;
  }

  let block = match[1];

  // Find current image URL
  const imgMatch = block.match(/image:\s*"([^"]+)"/);
  if (imgMatch) {
    const oldUrl = imgMatch[1];
    block = block.replace(`image: "${oldUrl}"`, `image: "${newImageUrl}"`);
    block = block.split(oldUrl).join(newImageUrl);
  }

  content = content.replace(match[1], block);
  console.log(`✅ Fixed image for ${id}: ${newImageUrl}`);
}

fs.writeFileSync(newsDataPath, content, "utf8");
console.log("Successfully fixed all placeholder images in newsData.ts!");

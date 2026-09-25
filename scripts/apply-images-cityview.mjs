import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const newsDataPath = path.join(ROOT_DIR, "src", "data", "newsData.ts");

const imageMapping = {
  n180: "https://res.cloudinary.com/dthv0nsq/image/upload/v1790305281/news/toan-canh-mua-nha-o-xa-hoi-bien-hoa-2026.jpg",
  n181: "https://res.cloudinary.com/dthv0nsq/image/upload/v1790305283/news/nha-o-xa-hoi-phuong-ho-nai-bien-hoa-tam-diem-san-don.jpg",
  n182: "https://res.cloudinary.com/dthv0nsq/image/upload/v1790305285/news/nha-o-xa-hoi-gan-kcn-amata-kcn-bien-hoa-2.jpg",
  n183: "https://res.cloudinary.com/dthv0nsq/image/upload/v1790305286/news/mua-nha-o-xa-hoi-truc-duong-dieu-xien-xa-lo-ha-noi.jpg",
  n184: "https://res.cloudinary.com/dthv0nsq/image/upload/v1790305288/news/so-sanh-nha-o-xa-hoi-bien-hoa-va-chung-cu-thuong-mai.jpg",
  n185: "https://res.cloudinary.com/dthv0nsq/image/upload/v1790305289/news/cam-nang-mua-nha-o-xa-hoi-bien-hoa-cho-cong-nhan-kcn.jpg",
  n186: "https://res.cloudinary.com/dthv0nsq/image/upload/v1790305291/news/vo-chong-tre-moi-cuoi-mua-nha-o-xa-hoi-bien-hoa.jpg",
  n187: "https://res.cloudinary.com/dthv0nsq/image/upload/v1790305292/news/can-bo-giao-vien-luc-luong-vu-trang-mua-noxh-bien-hoa.jpg",
  n188: "https://res.cloudinary.com/dthv0nsq/image/upload/v1790305293/news/lao-dong-tu-do-buon-ban-nho-mua-nha-o-xa-hoi-bien-hoa.jpg",
  n189: "https://res.cloudinary.com/dthv0nsq/image/upload/v1790305296/news/tam-tru-ho-khau-ngoai-tinh-mua-nha-o-xa-hoi-bien-hoa-2026.jpg",
  n190: "https://res.cloudinary.com/dthv0nsq/image/upload/v1790305297/news/bang-gia-nha-o-xa-hoi-bien-hoa-2026-muc-gia-m2.jpg",
  n191: "https://res.cloudinary.com/dthv0nsq/image/upload/v1790305299/news/vay-von-ngan-hang-chinh-sach-mua-noxh-bien-hoa-lai-suat-5-4.jpg",
  n192: "https://res.cloudinary.com/dthv0nsq/image/upload/v1790305301/news/bang-phan-ky-dong-tien-tra-gop-noxh-bien-hoa-thu-nhap-12-15-trieu.jpg",
  n193: "https://res.cloudinary.com/dthv0nsq/image/upload/v1790305303/news/chi-phi-phat-sinh-phi-bao-tri-vat-quan-ly-noxh-bien-hoa.jpg",
  n194: "https://res.cloudinary.com/dthv0nsq/image/upload/v1790305304/news/quy-trinh-nop-ho-so-mua-nha-o-xa-hoi-bien-hoa-truc-tiep.jpg",
  n195: "https://res.cloudinary.com/dthv0nsq/image/upload/v1790305306/news/quy-trinh-cham-diem-uu-tien-boc-tham-chon-can-noxh-bien-hoa.jpg",
  n196: "https://res.cloudinary.com/dthv0nsq/image/upload/v1790305308/news/quy-dinh-cap-so-hong-cho-thue-ban-lai-noxh-bien-hoa-sau-5-nam.jpg",
  n197: "https://res.cloudinary.com/dthv0nsq/image/upload/v1790305310/news/7-chieu-tro-lua-dao-suat-ngoai-giao-noxh-bien-hoa-can-canh-giac.jpg",
  n198: "https://res.cloudinary.com/dthv0nsq/image/upload/v1790305312/news/tieu-chuan-tien-ich-nha-o-xa-hoi-bien-hoa-ho-boi-cong-vien.jpg",
  n199: "https://res.cloudinary.com/dthv0nsq/image/upload/v1790305313/news/checklist-nhan-ban-giao-can-ho-nha-o-xa-hoi-bien-hoa.jpg",
};

let content = fs.readFileSync(newsDataPath, "utf8");

// Split articles by `  {\r?\n    id: "n`
for (const [id, newImageUrl] of Object.entries(imageMapping)) {
  // Find the block starting with `id: "${id}"` up to the next `id: "n` or end of array
  const idPattern = new RegExp(`(id:\\s*"${id}"[\\s\\S]*?)(?=id:\\s*"n|\\n\\];)`);
  const match = content.match(idPattern);
  if (!match) {
    console.error(`Could not find block for ${id}`);
    continue;
  }

  let block = match[1];

  // 1. Ensure project: "cityview"
  block = block.replace(/project:\s*"[^"]*"/, 'project: "cityview"');

  // 2. Find old image URL
  const oldImgMatch = block.match(/image:\s*"([^"]+)"/);
  if (oldImgMatch) {
    const oldUrl = oldImgMatch[1];
    // Replace image property
    block = block.replace(`image: "${oldUrl}"`, `image: "${newImageUrl}"`);
    // Replace in markdown image ![...](oldUrl)
    block = block.split(oldUrl).join(newImageUrl);
  }

  content = content.replace(match[1], block);
  console.log(`Updated ${id} with image: ${newImageUrl}`);
}

fs.writeFileSync(newsDataPath, content, "utf8");
console.log("Successfully wrote updated newsData.ts!");

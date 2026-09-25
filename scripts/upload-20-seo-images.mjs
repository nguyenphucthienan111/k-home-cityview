import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const PUBLIC_NEWS_DIR = path.join(ROOT_DIR, "public", "news");
const BRAIN_DIR = "C:/Users/ASUS/.gemini/antigravity/brain/b2b1c9f3-74ae-4a5e-b54f-64bd24261110";

cloudinary.config({
  cloud_name: "dthv0nsq",
  api_key:    "649843139256213",
  api_secret: "dmv4t8j4oiN6JWSV58HJwjl_yN4",
});

const articlesImages = [
  {
    id: "n180",
    source: path.join(BRAIN_DIR, "noxh_bien_hoa_2026_1790304751977.jpg"),
    publicId: "toan-canh-mua-nha-o-xa-hoi-bien-hoa-2026",
    filename: "toan-canh-mua-nha-o-xa-hoi-bien-hoa-2026.jpg",
  },
  {
    id: "n181",
    source: path.join(BRAIN_DIR, "noxh_ho_nai_bien_hoa_1790304783737.jpg"),
    publicId: "nha-o-xa-hoi-phuong-ho-nai-bien-hoa-tam-diem-san-don",
    filename: "nha-o-xa-hoi-phuong-ho-nai-bien-hoa-tam-diem-san-don.jpg",
  },
  {
    id: "n182",
    source: path.join(BRAIN_DIR, "noxh_kcn_amata_bien_hoa_1790304801111.jpg"),
    publicId: "nha-o-xa-hoi-gan-kcn-amata-kcn-bien-hoa-2",
    filename: "nha-o-xa-hoi-gan-kcn-amata-kcn-bien-hoa-2.jpg",
  },
  {
    id: "n183",
    source: path.join(BRAIN_DIR, "duong_dieu_xien_bien_hoa_1790304821112.jpg"),
    publicId: "mua-nha-o-xa-hoi-truc-duong-dieu-xien-xa-lo-ha-noi",
    filename: "mua-nha-o-xa-hoi-truc-duong-dieu-xien-xa-lo-ha-noi.jpg",
  },
  {
    id: "n184",
    source: path.join(BRAIN_DIR, "so_sanh_noxh_chung_cu_1790304837605.jpg"),
    publicId: "so-sanh-nha-o-xa-hoi-bien-hoa-va-chung-cu-thuong-mai",
    filename: "so-sanh-nha-o-xa-hoi-bien-hoa-va-chung-cu-thuong-mai.jpg",
  },
  {
    id: "n185",
    source: path.join(BRAIN_DIR, "cong_nhan_mua_noxh_1790304855928.jpg"),
    publicId: "cam-nang-mua-nha-o-xa-hoi-bien-hoa-cho-cong-nhan-kcn",
    filename: "cam-nang-mua-nha-o-xa-hoi-bien-hoa-cho-cong-nhan-kcn.jpg",
  },
  {
    id: "n186",
    source: path.join(BRAIN_DIR, "vo_chong_tre_mua_nha_1790304873538.jpg"),
    publicId: "vo-chong-tre-moi-cuoi-mua-nha-o-xa-hoi-bien-hoa",
    filename: "vo-chong-tre-moi-cuoi-mua-nha-o-xa-hoi-bien-hoa.jpg",
  },
  {
    id: "n187",
    source: path.join(BRAIN_DIR, "can_bo_giao_vien_noxh_1790304897826.jpg"),
    publicId: "can-bo-giao-vien-luc-luong-vu-trang-mua-noxh-bien-hoa",
    filename: "can-bo-giao-vien-luc-luong-vu-trang-mua-noxh-bien-hoa.jpg",
  },
  {
    id: "n188",
    source: path.join(BRAIN_DIR, "lao_dong_tu_do_mua_nha_1790304915057.jpg"),
    publicId: "lao-dong-tu-do-buon-ban-nho-mua-nha-o-xa-hoi-bien-hoa",
    filename: "lao-dong-tu-do-buon-ban-nho-mua-nha-o-xa-hoi-bien-hoa.jpg",
  },
  {
    id: "n189",
    source: path.join(BRAIN_DIR, "tam_tru_mua_noxh_1790304934160.jpg"),
    publicId: "tam-tru-ho-khau-ngoai-tinh-mua-nha-o-xa-hoi-bien-hoa-2026",
    filename: "tam-tru-ho-khau-ngoai-tinh-mua-nha-o-xa-hoi-bien-hoa-2026.jpg",
  },
  {
    id: "n190",
    source: path.join(BRAIN_DIR, "bang_gia_m2_noxh_1790304959969.jpg"),
    publicId: "bang-gia-nha-o-xa-hoi-bien-hoa-2026-muc-gia-m2",
    filename: "bang-gia-nha-o-xa-hoi-bien-hoa-2026-muc-gia-m2.jpg",
  },
  {
    id: "n191",
    source: path.join(BRAIN_DIR, "vay_ngan_hang_chinh_sach_1790304979939.jpg"),
    publicId: "vay-von-ngan-hang-chinh-sach-mua-noxh-bien-hoa-lai-suat-5-4",
    filename: "vay-von-ngan-hang-chinh-sach-mua-noxh-bien-hoa-lai-suat-5-4.jpg",
  },
  {
    id: "n192",
    source: path.join(BRAIN_DIR, "phan_ky_dong_tien_tra_gop_1790304995507.jpg"),
    publicId: "bang-phan-ky-dong-tien-tra-gop-noxh-bien-hoa-thu-nhap-12-15-trieu",
    filename: "bang-phan-ky-dong-tien-tra-gop-noxh-bien-hoa-thu-nhap-12-15-trieu.jpg",
  },
  {
    id: "n193",
    source: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    publicId: "chi-phi-phat-sinh-phi-bao-tri-vat-quan-ly-noxh-bien-hoa",
    filename: "chi-phi-phat-sinh-phi-bao-tri-vat-quan-ly-noxh-bien-hoa.jpg",
  },
  {
    id: "n194",
    source: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
    publicId: "quy-trinh-nop-ho-so-mua-nha-o-xa-hoi-bien-hoa-truc-tiep",
    filename: "quy-trinh-nop-ho-so-mua-nha-o-xa-hoi-bien-hoa-truc-tiep.jpg",
  },
  {
    id: "n195",
    source: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    publicId: "quy-trinh-cham-diem-uu-tien-boc-tham-chon-can-noxh-bien-hoa",
    filename: "quy-trinh-cham-diem-uu-tien-boc-tham-chon-can-noxh-bien-hoa.jpg",
  },
  {
    id: "n196",
    source: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
    publicId: "quy-dinh-cap-so-hong-cho-thue-ban-lai-noxh-bien-hoa-sau-5-nam",
    filename: "quy-dinh-cap-so-hong-cho-thue-ban-lai-noxh-bien-hoa-sau-5-nam.jpg",
  },
  {
    id: "n197",
    source: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
    publicId: "7-chieu-tro-lua-dao-suat-ngoai-giao-noxh-bien-hoa-can-canh-giac",
    filename: "7-chieu-tro-lua-dao-suat-ngoai-giao-noxh-bien-hoa-can-canh-giac.jpg",
  },
  {
    id: "n198",
    source: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
    publicId: "tieu-chuan-tien-ich-nha-o-xa-hoi-bien-hoa-ho-boi-cong-vien",
    filename: "tieu-chuan-tien-ich-nha-o-xa-hoi-bien-hoa-ho-boi-cong-vien.jpg",
  },
  {
    id: "n199",
    source: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    publicId: "checklist-nhan-ban-giao-can-ho-nha-o-xa-hoi-bien-hoa",
    filename: "checklist-nhan-ban-giao-can-ho-nha-o-xa-hoi-bien-hoa.jpg",
  },
];

async function main() {
  console.log("🚀 Starting upload of 20 images to Cloudinary and local backup...");
  
  const uploadMap = {};

  for (const item of articlesImages) {
    try {
      console.log(`Uploading ${item.id} (${item.publicId})...`);
      
      // Copy to public/news if local file, or download if URL
      const localDest = path.join(PUBLIC_NEWS_DIR, item.filename);
      if (item.source.startsWith("http")) {
        const resp = await fetch(item.source);
        const buffer = Buffer.from(await resp.arrayBuffer());
        fs.writeFileSync(localDest, buffer);
      } else if (fs.existsSync(item.source)) {
        fs.copyFileSync(item.source, localDest);
      }

      // Upload to Cloudinary
      const res = await cloudinary.uploader.upload(localDest, {
        folder: "news",
        public_id: item.publicId,
        overwrite: true,
        resource_type: "image",
        quality: "auto:good",
        fetch_format: "auto",
      });

      uploadMap[item.id] = res.secure_url;
      console.log(`✅ [${item.id}] -> ${res.secure_url}`);
    } catch (err) {
      console.error(`❌ [${item.id}] Upload failed:`, err.message);
    }
  }

  console.log("\n📝 Updating src/data/newsData.ts with project: 'cityview' and new images...");
  
  const newsDataPath = path.join(ROOT_DIR, "src", "data", "newsData.ts");
  let content = fs.readFileSync(newsDataPath, "utf8");

  for (const item of articlesImages) {
    const newImageUrl = uploadMap[item.id];
    if (!newImageUrl) continue;

    // Regex to match the article block for this id
    // We update project: "k-home-cityview-ho-nai" -> project: "cityview"
    // and image: "..." -> image: newImageUrl
    const articleRegex = new RegExp(`(\\{[\\s\\S]*?id:\\s*"${item.id}"[\\s\\S]*?\\})`, "g");

    content = content.replace(articleRegex, (block) => {
      // replace project
      let updated = block.replace(/project:\s*"k-home-cityview-ho-nai"/g, 'project: "cityview"');
      
      // get current image URL
      const imgMatch = updated.match(/image:\s*"([^"]+)"/);
      if (imgMatch) {
        const oldImg = imgMatch[1];
        updated = updated.replace(`image: "${oldImg}"`, `image: "${newImageUrl}"`);
        // Also replace in content markdown ![...](oldImg)
        updated = updated.split(oldImg).join(newImageUrl);
      }
      return updated;
    });
  }

  fs.writeFileSync(newsDataPath, content, "utf8");
  console.log("✅ newsData.ts successfully updated!");
}

main().catch(console.error);

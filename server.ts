import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { createServer as createViteServer } from "vite";
import ContactModel from "./src/models/Contact.js";
import { requireAuth } from "./src/middleware/auth.js";
import { sendContactNotification, verifyMailer } from "./src/lib/mailer.js";
import { newsData } from "./src/data/newsData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" })); // giới hạn body size chống DoS

// Rate limit chung cho toàn bộ API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Quá nhiều yêu cầu. Vui lòng thử lại sau." },
});

// Rate limit riêng cho login — chống brute-force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau 15 phút." },
});

// Rate limit cho form submit của khách
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 20, // 20 lần / giờ / IP — đủ thoải mái cho khách thật, vẫn chặn spam bot
  message: { error: "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau." },
});

app.use("/api", apiLimiter);

// ─── MongoDB Connection ───────────────────────────────────────────────────────
async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI không được cấu hình trong file .env");
  }
  await mongoose.connect(uri);
  console.log("✅ MongoDB đã kết nối thành công");

  // Seed dữ liệu mẫu nếu DB còn trống
  const count = await ContactModel.countDocuments();
  if (count === 0) {
    await ContactModel.insertMany(SEED_CONTACTS);
    console.log("✅ Đã seed dữ liệu mẫu vào MongoDB");
  }
}

const SEED_CONTACTS = [
  {
    name: "Nguyễn Văn Hải", email: "hainguyen@gmail.com", phone: "0912345678",
    projectSlug: "k-home-cityview-ho-nai", projectName: "K-Home CityView Biên Hòa",
    message: "Tôi muốn tìm hiểu căn hộ 2 phòng ngủ, vui lòng gửi bảng báo giá và mặt bằng chi tiết.",
    status: "Chờ liên hệ", notes: "Khách hàng có nhu cầu mua ở thực, tài chính sẵn 1 tỷ.",
  },
  {
    name: "Trần Thị Mai", email: "maitran@yahoo.com", phone: "0987654321",
    projectSlug: "k-home-avenue-nhon-trach", projectName: "K-Home Avenue Nhơn Trạch",
    message: "Cần tư vấn chính sách chiết khấu đợt 1 và điều kiện vay ngân hàng hỗ trợ.",
    status: "Đang thương lượng", notes: "Đang chờ ngân hàng phê duyệt hồ sơ vay.",
  },
  {
    name: "Phạm Minh Hoàng", email: "hoangpm@techcorp.vn", phone: "0905112233",
    projectSlug: "k-home-midtown-trang-bom", projectName: "K-Home Midtown Trảng Bom",
    message: "Cần đặt lịch xem nhà mẫu vào cuối tuần này.",
    status: "Đã liên hệ", notes: "Đã xếp lịch xem nhà mẫu vào 9h sáng thứ Bảy.",
  },
  {
    name: "Lê Hoàng Yến", email: "yenlh@gmail.com", phone: "0937587438",
    projectSlug: "k-home-cityview-ho-nai", projectName: "K-Home CityView Biên Hòa",
    message: "Muốn tham quan vị trí thực tế dự án CityView Hố Nai.",
    status: "Đã chốt", notes: "Đã ký văn bản đặt cọc căn hộ tầng 10.",
  },
];

// ─── Static Data (Projects & News) ────────────────────────────────────────────
const projects = [
  {
    id: "1", slug: "k-home-cityview-ho-nai", title: "K-Home CityView Biên Hòa",
    location: "Đường Điểu Xiển, Phường Hố Nai, TP. Biên Hòa, Đồng Nai",
    type: "Căn hộ nhà ở xã hội", price: "Từ 950 Triệu", priceNumber: 0.95, area: "47,3m² - 84,4m²",
    image: "https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/V34_TAN-HOA_EXT_FACADE_FINAL_2",
    description: "K-Home CityView Hố Nai – nhà ở xã hội chuẩn Singapore tại đường Điểu Xiển, Biên Hòa. 1.328 căn NOXH + 39 shophouse, diện tích 47–84m², thiết kế Surbana Jurong, tiêu chuẩn xanh EDGE, giá từ 950 triệu, lãi suất 5,4%/năm, bàn giao nội thất 2028, hỗ trợ hồ sơ miễn phí.",
    longDescription: "**Tổng quan dự án K-Home CityView Hố Nai**\n\n**K-Home CityView** là dự án nhà ở xã hội (NOXH) chuẩn Singapore do **Kim Oanh Land** – thành viên Tập đoàn Kim Oanh Group – phát triển, tọa lạc tại mặt tiền **đường Điểu Xiển**, phường Hố Nai, thành phố Biên Hòa, tỉnh Đồng Nai. Quy hoạch trên quỹ đất **2,85 ha** với **4 tòa tháp cao 22 tầng**, cung cấp **1.328 căn hộ NOXH** và **39 căn shophouse** khối đế.\n\nVị trí đắc địa tại trung tâm TP. Biên Hòa – 5 phút đến Lotte Mart, TTHC Biên Hòa, 10 phút đến GO! Tân Hiệp, 20 phút đến AEON Mall, 30 phút đến Sân bay Quốc tế Long Thành. Đồng Nai đang trên lộ trình trở thành Thành phố trực thuộc Trung ương với Sân bay Quốc tế Long Thành đang được khẩn trương xây dựng.\n\n**Thiết kế Singapore & Đối tác chiến lược**\n\nDự án được thiết kế và quy hoạch bởi **Tập đoàn Surbana Jurong (Singapore)** – đơn vị tư vấn quy hoạch đô thị hàng đầu châu Á hơn 70 năm kinh nghiệm. Các đối tác **Global Vireon Studio**, **Kiến Trúc Việt**, **CDC Jsc** và **K-City** cùng đồng hành trong thiết kế, thi công và vận hành. Dự án phát triển theo tiêu chuẩn **công trình xanh EDGE** (IFC/World Bank), tiết kiệm ≥20% điện năng, ≥20% nước và giảm ≥20% khí thải carbon.\n\n**8 lý do K-Home CityView thu hút người mua**\n\n(1) Vị trí trung tâm đô thị Biên Hòa, liền kề KCN Amata, Long Bình, Biên Hòa 2; (2) hệ tiện ích nội khu đầy đủ: hồ bơi, sân chơi, thể dục, vườn treo, BBQ; (3) tiện ích ngoại khu phong phú trong bán kính 5km; (4) tiêu chuẩn xanh EDGE giảm chi phí sinh hoạt; (5) tầm view rộng thoáng; (6) 100% căn hộ đón sáng và thông gió tự nhiên; (7) bàn giao full nội thất (sofa, bàn ăn, giường, tủ, bồn cầu, lavabo, gương, trần thạch cao, đèn điện, ống máy lạnh, quạt hút mùi); (8) quản lý BMS, camera AI 24/7.\n\n**Quy mô sản phẩm**\n\nBốn loại căn từ 47–84m²: 1PN+A (47,3m², từ 950 triệu), 1PN+B (62,4m², từ 1,20 tỷ), 2PN (70,4m², từ 1,50 tỷ), 3PN (84,4m², từ 1,80 tỷ). Đây là NOXH đầu tiên tại Đồng Nai có căn 3 phòng ngủ.\n\n**Hệ thống tiện ích nội khu**\n\nTầng trệt: hồ bơi trung tâm, sân chơi thiếu nhi, khu BBQ, vườn cộng đồng. Tầng 3: vườn treo độc đáo. Khối đế: shophouse, café, minimart, dịch vụ thiết yếu. Trong khuôn viên còn có trường học nội khu và trạm sạc xe điện.\n\n**Pháp lý minh bạch & Chính sách vay**\n\nQĐ chủ trương đầu tư 177/QĐ-UBND (2023), QĐ giao đất 3000/QĐ-UBND (12/2025), Quy hoạch 1/500 phê duyệt, Giấy phép xây dựng. Người đủ điều kiện NOXH được vay tối đa 75% với lãi suất **5,4%/năm** trong 25 năm, trả góp từ 3,5–4,5 triệu/tháng. Sổ hồng lâu dài. Hỗ trợ hồ sơ miễn phí.\n\n**Tại sao mua thay vì thuê trọ?**\n\nHiện nhiều công nhân tại Đồng Nai chi 5–7 triệu/tháng tiền thuê nhưng không tích lũy được gì. Với K-Home CityView, trả góp chỉ 3,5–4,5 triệu/tháng – bằng hoặc thấp hơn tiền thuê – nhưng sau 25 năm sở hữu tài sản trị giá 2–4 tỷ. Người thuê cùng giai đoạn mất trắng hơn 2 tỷ.\n\n**K-Home CityView so với căn hộ thương mại**\n\nCăn hộ thương mại cùng vị trí tại Biên Hòa dao động 2,5–4 tỷ/căn, cao hơn 40–60%. Lãi suất vay thương mại 11–13%/năm cao gấp 2–3 lần so với ưu đãi NOXH 5,4%/năm. Đây là lợi thế tài chính không nơi nào sánh được.\n\n**Tiến độ dự án**\n\nĐã khởi công. Hoàn thành móng tháng 8–10/2026 → Cất nóc tháng 6/2027 → Hoàn thiện nội thất tháng 12/2027 → Bàn giao đợt đầu tháng 1/2028.",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31336.366419319656!2d106.85764146213!3d10.959912858798274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174ddbb3dca0a9d%3A0x6a42d2ebd1b96a45!2sK-Home%20Cityview%20-%20Kim%20Oanh%20Land!5e0!3m2!1sen!2s!4v1786073499860!5m2!1sen!2s", 
    gallery: [
      "/k-home cityview/V34_TAN-HOA_EXT_FACADE_FINAL_2.webp",
      "/k-home cityview/V02_TAN-HOA_EXT_BBQ-GARDEN_FN_2-1.webp",
      "/k-home cityview/TAN-HOA_AERIAL_1_DRAFT-3_2-1.webp",
      "/k-home cityview/V03_TAN-HOA_EXT_NOXH_KID-PLAYGROUND_FINAL_2-1.webp",
      "/k-home cityview/V32_TAN-HOA_EXT_AERIAL_2_FINAL_2.webp",
      "/k-home cityview/V11_TH_EXT_NOTM_POOL_2.webp",
      "/k-home cityview/V12_TH_EXT_NOXH_POOL_2.webp",
      "/k-home cityview/V35_TAN-HOA_EXT_NOXH_POOL2_2.jpg",
      "/k-home cityview/V10_TH_EXT_GARDEN_FINAL_2.webp",
      "/k-home cityview/V08_TH_EXT_NOTM_SAN-VUON_FINAL_2.webp",
      "/k-home cityview/V09_TH_EXT_STREET-VIEW_FINAL_2.webp",
      "/k-home cityview/V07_TH_EXT_NOXH_KHOI-DE_FINAL_2-1.webp",
      "/k-home cityview/V36_TAN-HOA_EXT_NOXH_PARK_FINAL_2.jpg",
      "/k-home cityview/260323_TAN-HOA_BALCONY_FINAL_2-1.webp",
      "/k-home cityview/260328_TAN-HOA_V05_FINAL_2-1.webp",
      "/k-home cityview/260328_TAN-HOA_V06_FINAL_2-1.webp",
      "/k-home cityview/thiet-ke-can-ho-layout-khome-city-view-2048x764.jpg",
    ],
    galleryAlts: [
      "Phối cảnh tổng thể dự án nhà ở xã hội K-Home CityView Hố Nai Biên Hòa Đồng Nai",
      "Khu BBQ và vườn cộng đồng nội khu K-Home CityView Kim Oanh Land",
      "Toàn cảnh dự án NOXH K-Home CityView nhìn từ trên cao Hố Nai Biên Hòa",
      "Khu vui chơi trẻ em ngoài trời dự án K-Home CityView Đồng Nai",
      "Phối cảnh 4 block cao tầng K-Home CityView Điểu Xiển Hố Nai Kim Oanh",
      "Hồ bơi nội khu K-Home CityView Biên Hòa chuẩn Singapore",
      "Hồ bơi ngoài trời nhà ở xã hội K-Home CityView Hố Nai Kim Oanh",
      "Hồ bơi trẻ em và người lớn NOXH K-Home CityView Biên Hòa Đồng Nai",
      "Vườn cảnh quan và không gian xanh nội khu K-Home CityView Kim Oanh Land",
      "Sân vườn và không gian sinh hoạt nội khu K-Home CityView",
      "Mặt tiền đường Điểu Xiển dự án K-Home CityView Hố Nai Biên Hòa",
      "Shophouse và phố thương mại khối đế K-Home CityView Đồng Nai",
      "Công viên cây xanh nội khu nhà ở xã hội K-Home CityView Kim Oanh",
      "Ban công căn hộ K-Home CityView view thoáng Biên Hòa Đồng Nai",
      "Phối cảnh căn hộ K-Home CityView Hố Nai nội thất thiết kế Singapore",
      "Không gian sống hiện đại tại K-Home CityView NOXH Biên Hòa Kim Oanh",
      "Layout thiết kế căn hộ 1PN 2PN 3PN nhà ở xã hội K-Home CityView",
    ],
    amenities: ["Hồ bơi người lớn & trẻ em", "Sân chơi trẻ em an toàn", "Khu thể dục ngoài trời", "Nhà sinh hoạt cộng đồng đa năng", "Vườn treo tầng 3", "Khu BBQ sinh hoạt gia đình", "Shophouse & minimart nội khu", "Nhà trẻ & trường học trong khuôn viên", "Trạm sạc ô tô & xe máy điện", "Hệ thống an ninh AI 24/7", "Bãi đậu ô tô & xe máy", "Khu drop-off đón trả cư dân tiện lợi"],
    unitTypes: [
      { slug: "can-ho-1-phong-ngu-a", name: "Căn 1 Phòng Ngủ + A", bedrooms: 1, bathrooms: 1, constructionArea: "47,3m²", usableArea: "42,3m²", price: "950 triệu – 1,08 tỷ/căn", priceNumber: 950,  furnished: true,
        description: "**Căn hộ 1 Phòng Ngủ + A** là lựa chọn lý tưởng cho cặp vợ chồng trẻ hoặc cá nhân muốn sở hữu không gian riêng tư tại K-Home CityView với mức giá tốt nhất trong rổ hàng.\n\n**Diện tích & Bố cục**\n\nVới diện tích xây dựng **47,3m²** và diện tích sử dụng thực tế **42,3m²**, căn hộ được thiết kế tối ưu từng m² theo tiêu chuẩn Singapore. Không gian được phân chia hợp lý gồm: **1 phòng ngủ** rộng rãi, **1 nhà vệ sinh** đầy đủ tiện nghi, phòng khách mở thông thoáng, bếp hiện đại và ban công đón ánh sáng tự nhiên.\n\n**Nội thất bàn giao**\n\nCăn hộ được bàn giao **full nội thất** cao cấp theo tiêu chuẩn dự án, bao gồm toàn bộ nội thất cơ bản như tủ bếp, kệ bếp, tủ âm tường, sàn gỗ và hệ thống chiếu sáng — chỉ trừ các thiết bị điện tử. Cư dân chỉ cần mang theo đồ dùng cá nhân là có thể dọn vào ở ngay.\n\n**Giá bán & Chính sách**\n\nMức giá **950 triệu – 1,05 tỷ/căn** là mức giá nhà ở xã hội được Nhà nước phê duyệt, người mua được hưởng **lãi suất vay ưu đãi NOXH** từ các ngân hàng quốc doanh. Đây là cơ hội hiếm có để sở hữu nhà ở pháp lý rõ ràng tại khu vực trung tâm Biên Hòa.",
        images: [
          "/k-home cityview/Can-1PN-A/1pn-noxh-k-home-city-view.jpg",
          "/k-home cityview/Can-1PN-A/khome-cityview-nha-mau-can-ho-1PN-1.jpg",
          "/k-home cityview/Can-1PN-A/khome-cityview-nha-mau-can-ho-1PN-2.jpg",
          "/k-home cityview/Can-1PN-A/khome-cityview-nha-mau-can-ho-1PN-3.jpg",
          "/k-home cityview/Can-1PN-A/khome-cityview-nha-mau-can-ho-1PN-4-2048x1209.jpg",
          "/k-home cityview/Can-1PN-A/khome-cityview-nha-mau-can-ho-1PN-5.jpg",
          "/k-home cityview/Can-1PN-A/khome-cityview-nha-mau-can-ho-1PN-7.jpg",
        ]},
      { slug: "can-ho-1-phong-ngu-b", name: "Căn 1 Phòng Ngủ + B", bedrooms: 1, bathrooms: 2, constructionArea: "62,4m²", usableArea: "55,1m²", price: "1,20 tỷ – 1,40 tỷ/căn", priceNumber: 1200, furnished: true,
        description: "**Căn hộ 1 Phòng Ngủ + B** là phiên bản nâng cấp so với loại A, sở hữu diện tích rộng hơn và **2 nhà vệ sinh** riêng biệt — đáp ứng nhu cầu của các gia đình nhỏ hoặc cặp đôi cần không gian sinh hoạt thoải mái hơn.\n\n**Diện tích & Bố cục**\n\nDiện tích xây dựng **62,4m²** và diện tích sử dụng **55,1m²** cho phép bố trí không gian rộng rãi hơn: **1 phòng ngủ** master rộng, **2 nhà vệ sinh** (1 trong phòng ngủ, 1 cho khách), phòng khách – bếp mở thông thoáng và ban công rộng.\n\n**Nội thất bàn giao**\n\nCăn hộ bàn giao **full nội thất** theo tiêu chuẩn dự án, đảm bảo cư dân có thể sử dụng ngay mà không cần đầu tư thêm nhiều. Các thiết bị điện tử không nằm trong gói bàn giao.\n\n**Giá bán & Chính sách**\n\nMức giá **1,20 tỷ – 1,40 tỷ/căn** thuộc phân khúc nhà ở xã hội được Nhà nước kiểm soát, người mua được hưởng đầy đủ chính sách hỗ trợ vay vốn ưu đãi NOXH với lãi suất thấp hơn lãi suất thị trường.",
        images: [
          "/k-home cityview/Can-1PN-B/2pns-noxh-k-home-city-view-2048x1536.jpg",
          "/k-home cityview/Can-1PN-B/khome-cityview-nha-mau-can-ho-1PN-1.jpg",
          "/k-home cityview/Can-1PN-B/khome-cityview-nha-mau-can-ho-1PN-2.jpg",
          "/k-home cityview/Can-1PN-B/khome-cityview-nha-mau-can-ho-1PN-3.jpg",
          "/k-home cityview/Can-1PN-B/khome-cityview-nha-mau-can-ho-1PN-4-2048x1209.jpg",
          "/k-home cityview/Can-1PN-B/khome-cityview-nha-mau-can-ho-1PN-5.jpg",
          "/k-home cityview/Can-1PN-B/khome-cityview-nha-mau-can-ho-1PN-7.jpg",
        ]},
      { slug: "can-ho-2-phong-ngu-cityview", name: "Căn 2 Phòng Ngủ", bedrooms: 2, bathrooms: 2, constructionArea: "70,4m²", usableArea: "63,2m²", price: "1,50 tỷ – 1,70 tỷ/căn", priceNumber: 1500, furnished: true,
        description: "**Căn hộ 2 Phòng Ngủ** là lựa chọn phổ biến nhất tại K-Home CityView, phù hợp cho gia đình 3–4 thành viên với nhu cầu có phòng ngủ riêng cho con cái và không gian sinh hoạt chung thoải mái.\n\n**Diện tích & Bố cục**\n\nDiện tích xây dựng **70,4m²** và diện tích sử dụng **63,2m²** — đây là diện tích lý tưởng cho gia đình nhỏ. Bố cục gồm **2 phòng ngủ** đầy đủ cửa sổ đón sáng, **2 nhà vệ sinh** riêng biệt, phòng khách – bếp rộng và ban công thông thoáng.\n\n**Nội thất bàn giao**\n\nBàn giao **full nội thất** hoàn thiện cao cấp theo tiêu chuẩn dự án. Toàn bộ các phòng đều được trang bị nội thất cố định chất lượng, sẵn sàng để ở ngay sau khi nhận bàn giao — ngoại trừ thiết bị điện tử.\n\n**Giá bán & Chính sách**\n\nMức giá **1,50 tỷ – 1,60 tỷ/căn** là mức giá NOXH cạnh tranh nhất thị trường Biên Hòa cho căn 2 phòng ngủ. Người đủ điều kiện mua NOXH được hưởng lãi suất vay ưu đãi từ **Ngân hàng Vietinbank, BIDV, Vietcombank, Agribank** theo chính sách nhà ở xã hội quốc gia.",
        images: [
          "/k-home cityview/Can-2PN/2pn-noxh-k-home-city-view-2048x1536.jpg",
          "/k-home cityview/Can-2PN/khome-cityview-nha-mau-can-ho-2PN-1.jpg",
          "/k-home cityview/Can-2PN/khome-cityview-nha-mau-can-ho-2PN-2.jpg",
          "/k-home cityview/Can-2PN/khome-cityview-nha-mau-can-ho-2PN-3.jpg.webp",
          "/k-home cityview/Can-2PN/khome-cityview-nha-mau-can-ho-2PN-4.jpg",
          "/k-home cityview/Can-2PN/khome-cityview-nha-mau-can-ho-2PN-6.jpg",
          "/k-home cityview/Can-2PN/khome-cityview-nha-mau-can-ho-2PN-8.jpg",
        ]},
      { slug: "can-ho-3-phong-ngu", name: "Căn hộ 3 phòng ngủ", bedrooms: 3, bathrooms: 2, constructionArea: "84,4m²", usableArea: "75,4m²", price: "1,80 tỷ – 2,00 tỷ/căn", priceNumber: 1800, furnished: true,
        description: "**Căn hộ 3 Phòng Ngủ** là loại căn lớn nhất và cao cấp nhất trong rổ hàng K-Home CityView, dành cho gia đình nhiều thế hệ hoặc gia đình có từ 2 con trở lên cần không gian sống rộng rãi, riêng tư và đầy đủ tiện nghi.\n\n**Diện tích & Bố cục**\n\nDiện tích xây dựng **84,4m²** và diện tích sử dụng **75,4m²** — là diện tích lớn nhất trong dự án. Bố cục tối ưu với **3 phòng ngủ** đầy đủ (1 phòng ngủ master + 2 phòng ngủ phụ), **2 nhà vệ sinh** tiện nghi, phòng khách – bếp rộng mở, ban công lớn và khu vực lưu trữ thông minh.\n\n**Nội thất bàn giao**\n\nBàn giao **full nội thất** hoàn thiện với chất lượng đồng bộ theo tiêu chuẩn cao cấp của dự án. Đặc biệt, căn 3PN có phòng ngủ master với hệ thống tủ âm tường toàn bộ, nhà vệ sinh master riêng biệt hoàn toàn, và phòng khách có đủ diện tích để bố trí khu ăn uống gia đình.\n\n**Giá bán & Chính sách**\n\nMức giá **1,80 tỷ – 2,00 tỷ/căn** là mức giá nhà ở xã hội được Nhà nước phê duyệt và kiểm soát chặt chẽ. Đây là cơ hội hiếm có để sở hữu căn hộ 3 phòng ngủ pháp lý đầy đủ với mức giá thấp hơn nhiều so với thị trường thương mại.",
        images: [
          "/k-home cityview/Can-3PN/3pn-noxh-k-home-city-view.jpg",
          "/k-home cityview/Can-3PN/z8043585440423_c4eeb73748a69f41c37d6bd9786582eb.jpg",
          "/k-home cityview/Can-3PN/z8043585442660_e37f1a0db75375dac4ed416b73ece7e8.jpg",
          "/k-home cityview/Can-3PN/z8043585455366_2dda820049421cbd45648d9d5ac9f3d8.jpg",
          "/k-home cityview/Can-3PN/z8043585482160_d5b849ce2ee46420548001a9e3a59892.jpg",
          "/k-home cityview/Can-3PN/z8043585489809_81937cf59023f875a66f1cb8ee71e996.jpg",
          "/k-home cityview/Can-3PN/z8043585499389_46f12736b66e663d1b327ee7e381d01c.jpg",
        ]},
    ],
    status: "Đang bốc thăm", rating: 4.8, floorCount: 22, developer: "Kim Oanh Land (Tập đoàn Kim Oanh Group)",
  },
  {
    id: "2", slug: "k-home-midtown-trang-bom", title: "K-Home Midtown Trảng Bom",
    location: "Giữa 4 tuyến đường 30/4 – Hùng Vương – Lý Nam Đế – Lê Đại Hành, P. Trảng Bom, Đồng Nai",
    type: "Căn hộ nhà ở xã hội", price: "Từ 750 Triệu", priceNumber: 0.75, area: "36,1m² - 68,8m²",
    image: "https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-midtown/Du-an-K-Home-Midtown-3d-birdview-toan-canh-dem-2048x1150",
    description: "K-Home Midtown Trảng Bom – dự án nhà ở xã hội quy mô 13,97 ha, 542 căn hộ. Vị trí trung tâm Trảng Bom, giao 4 tuyến đường lớn. Lãi suất ưu đãi 5,4%/năm, hỗ trợ hồ sơ miễn phí.",
    longDescription: "**Tổng quan dự án K-Home Midtown Trảng Bom**\n\n**K-Home Midtown** là dự án nhà ở xã hội (NOXH) do **Kim Oanh Land** phát triển, tọa lạc tại trung tâm thị trấn Trảng Bom, tỉnh Đồng Nai. Dự án được quy hoạch trên quỹ đất rộng **13,97 ha** với **1 block cao 15 tầng**, cung cấp **542 căn hộ nhà ở xã hội** cùng **20 căn shophouse**.\n\nĐây là dự án có quy mô đất lớn nhất trong hệ thống 3 dự án K-Home tại Đồng Nai, hướng đến giải pháp an cư ổn định cho người lao động, công nhân và gia đình trẻ đang làm việc tại các khu công nghiệp trong khu vực.\n\n**Vị trí & Kết nối**\n\nK-Home Midtown sở hữu vị trí thuận lợi tại giao điểm của 4 tuyến đường chính: **đường 30/4**, **đường Hùng Vương**, **đường Lý Nam Đế** và **đường Lê Đại Hành**. Từ dự án, cư dân dễ dàng kết nối đến các khu công nghiệp lớn (Bàu Xéo, Hố Nai…), trung tâm TP. Biên Hòa và TP. Hồ Chí Minh qua cao tốc TP.HCM – Long Thành – Dầu Giây.\n\n**Thiết kế & Đối tác**\n\nDự án được thiết kế theo **tiêu chuẩn Singapore** hiện đại, chú trọng tối ưu công năng, ánh sáng tự nhiên và không gian sống thực tế. Các đơn vị tư vấn đồng hành gồm: **Global Vireon Studio**, **Kiến Trúc Việt**, **NAGECCO** và **K-City**. Dự án hướng đến tiêu chuẩn **công trình xanh EDGE**, hỗ trợ tiết kiệm điện và nước trong quá trình sử dụng.\n\n**Quy mô sản phẩm**\n\nDự án cung cấp đa dạng loại căn hộ: Studio (36,1m²), 1 phòng ngủ+ loại A (47m²), 1 phòng ngủ+ loại B (55,1m²), 2 phòng ngủ (68,8m²) và 20 căn shophouse. Tất cả bàn giao hoàn thiện nội thất theo tiêu chuẩn dự án.\n\n**Hệ thống tiện ích nội khu**\n\nVới quỹ đất rộng 13,97 ha, K-Home Midtown được quy hoạch hệ thống tiện ích đầy đủ phục vụ cư dân: **hồ bơi**, **sân chơi trẻ em**, **khu thể dục ngoài trời**, **Sky Garden & vườn cảnh quan**, **nhà sinh hoạt cộng đồng** và không gian xanh nội khu.\n\n**Pháp lý & Chính sách hỗ trợ**\n\nSổ hồng sở hữu lâu dài theo quy định nhà ở xã hội. Người mua đủ điều kiện được hỗ trợ vay từ **Ngân hàng Chính sách Xã hội** với lãi suất ưu đãi **5,4%/năm** trong 25 năm, trả góp từ khoảng 3,5 – 4,5 triệu/tháng. Đội ngũ Kim Oanh Land hỗ trợ hoàn thiện hồ sơ miễn phí.",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1384.902626805889!2d107.00522593899112!3d10.956108940275927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174e700442d0327%3A0xc12a0db1c85bf214!2sK-Home%20Midtown!5e0!3m2!1sen!2s!4v1784803611439!5m2!1sen!2s",
    gallery: [
      "/k-home midtown/Du-an-K-Home-Midtown-3d-birdview-toan-canh-dem-2048x1150.webp",
      "/k-home midtown/Du-an-K-Home-Midtown-3d-ho-boi-view-2-2048x1150.webp",
      "/k-home midtown/Du-an-K-Home-Midtown-3d-cong-vien-thap-tang-2048x1150.webp",
      "/k-home midtown/midtown.jpg",
      "/k-home midtown/midtown1.webp",
      "/k-home midtown/midtown2.webp",
      "/k-home midtown/midtown3.webp",
      "/k-home midtown/o34-384785.jpg",
      "/k-home midtown/k-home-midtown-mat-bang-can-ho-tang-dien-hinh.jpg.webp",
    ],
    amenities: ["Hồ bơi người lớn & trẻ em", "Sân chơi trẻ em", "Khu thể dục ngoài trời", "Sky Garden & vườn cảnh quan", "Shophouse thương mại nội khu", "Hệ thống an ninh 24/7"],
    unitTypes: [
      { slug: "can-ho-studio", name: "Căn Studio",  bedrooms: 0, bathrooms: 1, constructionArea: "36,1m²", usableArea: "32,0m²", price: "Từ 750 triệu/căn", priceNumber: 750,  furnished: true,
        description: "**Căn Studio K-Home Midtown** là loại căn compact thông minh với mức giá khởi điểm thấp nhất trong rổ hàng, phù hợp cho người độc thân, công nhân viên chức hoặc cặp đôi trẻ mới kết hôn muốn có chỗ ở riêng tư ngay trung tâm Trảng Bom.\n\n**Diện tích & Bố cục**\n\nDiện tích xây dựng **36,1m²** và diện tích sử dụng **32,0m²** — thiết kế studio mở thông minh, không phân chia vách cứng giữa phòng ngủ và phòng khách giúp không gian trông rộng rãi hơn thực tế. Bố cục bao gồm khu vực sinh hoạt kết hợp ngủ nghỉ, **1 nhà vệ sinh** đầy đủ tiện nghi, bếp nhỏ tiện lợi và ban công nhỏ đón gió.\n\n**Nội thất bàn giao**\n\nBàn giao **full nội thất** hoàn thiện theo tiêu chuẩn dự án — toàn bộ nội thất cố định được thiết kế tích hợp tối ưu không gian: giường ngủ âm tường, tủ quần áo built-in, bàn làm việc gấp gọn và bếp compact. Chỉ trừ các thiết bị điện tử.\n\n**Giá bán & Chính sách**\n\nMức giá khởi điểm **750 triệu/căn** — đây là mức giá NOXH thấp nhất trong hệ thống K-Home, người đủ điều kiện được hưởng lãi suất vay ưu đãi NOXH, trả góp chỉ từ khoảng **3,5 triệu/tháng**.",
        images: [
        "/k-home midtown/Can-Studio/k-home-midtown-studio-1.jpg",
        "/k-home midtown/Can-Studio/01_XU.jpg",
        "/k-home midtown/Can-Studio/dsc01072.webp",
        "/k-home midtown/Can-Studio/dsc01084.webp",
        "/k-home midtown/Can-Studio/dsc01089.webp",
        "/k-home midtown/Can-Studio/dsc01093.webp",
        "/k-home midtown/Can-Studio/dsc01099.webp",
        "/k-home midtown/Can-Studio/dsc01105.webp",
        "/k-home midtown/Can-Studio/dsc01117.webp",
        "/k-home midtown/Can-Studio/dsc01125.webp",
        "/k-home midtown/Can-Studio/dsc01129.webp",
        "/k-home midtown/Can-Studio/dsc01134.webp",
      ]},
      { slug: "can-ho-1-phong-ngu-a", name: "Căn 1 Phòng Ngủ + A", bedrooms: 1, bathrooms: 1, constructionArea: "47,0m²", usableArea: "42,0m²", price: "Từ 990 triệu/căn", priceNumber: 990,  furnished: true,
        description: "**Căn 1 Phòng Ngủ + A K-Home Midtown** là loại căn phổ biến nhất trong dự án, cân bằng hoàn hảo giữa diện tích sử dụng và mức giá — là lựa chọn hàng đầu cho các cặp đôi, gia đình nhỏ 2–3 người tại khu vực Trảng Bom.\n\n**Diện tích & Bố cục**\n\nDiện tích xây dựng **47,0m²** và diện tích sử dụng **42,0m²** với bố cục tách biệt rõ ràng: **1 phòng ngủ** riêng có cửa sổ đón sáng, **1 nhà vệ sinh** đầy đủ, phòng khách thông bếp rộng thoáng và ban công nhỏ. Cửa sổ lớn giúp không gian luôn sáng và thông gió tự nhiên.\n\n**Nội thất bàn giao**\n\nBàn giao **full nội thất** hoàn thiện đồng bộ theo tiêu chuẩn dự án. Phòng ngủ có giường đôi, tủ âm tường; phòng khách có sofa, kệ TV; bếp có tủ bếp đầy đủ. Chỉ trừ các thiết bị điện tử.\n\n**Giá bán & Chính sách**\n\nGiá từ **990 triệu/căn** — vẫn thuộc khung NOXH, được hỗ trợ vay ưu đãi lãi suất thấp từ các ngân hàng quốc doanh. Mức trả góp hàng tháng phù hợp với thu nhập của công nhân và người lao động tại các KCN Trảng Bom.",
        images: [
        "/k-home midtown/Can-1PN-A/k-home-midtown-1PNA.jpg",
        "/k-home midtown/Can-1PN-A/02_CK.jpg",
        "/k-home midtown/Can-1PN-A/03_79.jpg",
        "/k-home midtown/Can-1PN-A/04.jpg",
      ]},
      { slug: "can-ho-1-phong-ngu-b", name: "Căn 1 Phòng Ngủ + B", bedrooms: 1, bathrooms: 1, constructionArea: "55,1m²", usableArea: "48,8m²", price: "Từ 1,20 tỷ/căn",   priceNumber: 1200, furnished: true,
        description: "**Căn 1 Phòng Ngủ + B K-Home Midtown** là phiên bản mở rộng của loại 1PN+A, sở hữu diện tích lớn hơn đáng kể với không gian phòng khách và bếp thoải mái hơn — phù hợp cho gia đình trẻ cần thêm không gian sinh hoạt hoặc người có nhu cầu làm việc tại nhà.\n\n**Diện tích & Bố cục**\n\nDiện tích xây dựng **55,1m²** và diện tích sử dụng **48,8m²** — không gian phụ trội so với 1PN+A được phân bổ vào phòng khách rộng hơn, bếp tách biệt riêng và khu vực ăn uống có thể bố trí bàn 4–6 người. **1 phòng ngủ** đủ lớn cho giường đôi cỡ Queen, **1 nhà vệ sinh** và ban công.\n\n**Nội thất bàn giao**\n\nBàn giao **full nội thất** hoàn thiện cao cấp, đồng bộ toàn bộ dự án. Không gian bếp được trang bị tủ bếp trên dưới đầy đủ. Chỉ trừ các thiết bị điện tử.\n\n**Giá bán & Chính sách**\n\nGiá từ **1,20 tỷ/căn** — mức giá NOXH được Nhà nước kiểm soát và phê duyệt, người mua đủ điều kiện được hưởng đầy đủ chính sách hỗ trợ tín dụng nhà ở xã hội với lãi suất ưu đãi.",
        images: [
        "/k-home midtown/Can-1PN-B/k-home-midtown-1PNB.jpg",
        "/k-home midtown/Can-1PN-B/02_CK.jpg",
        "/k-home midtown/Can-1PN-B/03_79.jpg",
        "/k-home midtown/Can-1PN-B/04.jpg",
      ]},
      { slug: "can-ho-2-phong-ngu", name: "Căn 2 Phòng Ngủ",     bedrooms: 2, bathrooms: 2, constructionArea: "68,8m²", usableArea: "61,6m²", price: "Từ 1,50 tỷ/căn",   priceNumber: 1500, furnished: true,
        description: "**Căn 2 Phòng Ngủ K-Home Midtown** là loại căn cao cấp nhất trong rổ hàng NOXH của dự án, lý tưởng cho gia đình 3–4 người cần không gian sống đủ rộng, có phòng riêng cho con cái và không gian sinh hoạt chung thoải mái.\n\n**Diện tích & Bố cục**\n\nDiện tích xây dựng **68,8m²** và diện tích sử dụng **61,6m²** — bố cục 2 phòng ngủ riêng biệt với cửa sổ đón sáng tự nhiên, **2 nhà vệ sinh** riêng biệt (1 trong phòng ngủ master, 1 cho khách), phòng khách rộng thoáng và bếp có không gian bố trí bàn ăn gia đình đầy đủ. Ban công rộng có thể dùng làm góc thư giãn ngoài trời.\n\n**Nội thất bàn giao**\n\nBàn giao **full nội thất** hoàn thiện cao cấp, đồng bộ toàn bộ dự án. Đặc biệt phòng khách của căn 2PN được thiết kế với diện tích đủ để bố trí sofa gia đình và khu vực ăn uống riêng. Chỉ trừ các thiết bị điện tử.\n\n**Giá bán & Chính sách**\n\nGiá từ **1,50 tỷ/căn** — là mức giá NOXH cạnh tranh nhất cho căn hộ 2 phòng ngủ tại khu vực Trảng Bom. Cư dân đủ điều kiện được hưởng lãi suất vay ưu đãi NOXH từ các ngân hàng quốc doanh với kỳ hạn vay dài.",
        images: [
        "/k-home midtown/Can-2PN/k-home-midtown-2pn.jpg",
        "/k-home midtown/Can-2PN/2pn liv.jpg",
        "/k-home midtown/Can-2PN/2pn-kit_Fy.jpg",
        "/k-home midtown/Can-2PN/2pn kid.jpg",
        "/k-home midtown/Can-2PN/dsc01317.webp",
        "/k-home midtown/Can-2PN/dsc01338.webp",
        "/k-home midtown/Can-2PN/dsc01350.webp",
        "/k-home midtown/Can-2PN/dsc01360.webp",
        "/k-home midtown/Can-2PN/dsc01367.webp",
        "/k-home midtown/Can-2PN/dsc01377.webp",
        "/k-home midtown/Can-2PN/dsc01385.webp",
        "/k-home midtown/Can-2PN/dsc01394.webp",
        "/k-home midtown/Can-2PN/dsc01397.webp",
        "/k-home midtown/Can-2PN/dsc01400.webp",
        "/k-home midtown/Can-2PN/dsc01401.webp",
        "/k-home midtown/Can-2PN/dsc01417.webp",
        "/k-home midtown/Can-2PN/dsc01426.webp",
        "/k-home midtown/Can-2PN/dsc01440.webp",
      ]},
    ],
    status: "Đã công bố", rating: 4.7, floorCount: 15, developer: "Kim Oanh Land (Tập đoàn Kim Oanh Group)",
  },
  {
    id: "3", slug: "k-home-avenue-nhon-trach", title: "K-Home Avenue Nhơn Trạch",
    location: "Đường Nguyễn Ái Quốc (25C), Xã Nhơn Trạch, Tỉnh Đồng Nai",
    type: "Căn hộ nhà ở xã hội", price: "Từ 750 Triệu", priceNumber: 0.75, area: "37,7m² - 69,5m²",
    image: "https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-avenue/Pc09-Loi-vao-shophouse_2-min",
    description: "K-Home Avenue Nhơn Trạch – dự án nhà ở xã hội tại đường 25C, quy mô 5,3 ha, 1.022 căn hộ. Gần sân bay Long Thành, lãi suất ưu đãi 5,4%/năm, hỗ trợ hồ sơ miễn phí.",
    longDescription: "**Tổng quan dự án K-Home Avenue Nhơn Trạch**\n\n**K-Home Avenue** là dự án nhà ở xã hội (NOXH) do **Kim Oanh Land** phát triển, tọa lạc tại đường **Nguyễn Ái Quốc (Tỉnh lộ 25C)**, xã Nhơn Trạch, tỉnh Đồng Nai. Dự án được quy hoạch trên quỹ đất **5,3 ha** với **4 block cao 12 tầng**, cung cấp **1.022 căn hộ nhà ở xã hội** cùng **82 căn shophouse**.\n\nVới vị trí nằm trên trục kết nối quan trọng của huyện Nhơn Trạch, K-Home Avenue hướng đến giải pháp an cư phù hợp cho người lao động và gia đình trẻ trong khu vực đang phát triển mạnh nhờ hạ tầng sân bay Long Thành và các khu công nghiệp.\n\n**Vị trí & Lợi thế kết nối**\n\nDự án nằm trên đường **Nguyễn Ái Quốc (Tỉnh lộ 25C)** — tuyến đường kết nối Nhơn Trạch với khu vực **Sân bay Quốc tế Long Thành** đang xây dựng và các trục giao thông liên vùng. Cư dân thuận tiện di chuyển đến khu vực sân bay Long Thành, các khu công nghiệp tại Nhơn Trạch (KCN Nhơn Trạch 1–6), TP. Biên Hòa và TP. Hồ Chí Minh qua hệ thống cao tốc và đường vành đai.\n\n**Thiết kế & Đối tác**\n\nK-Home Avenue được quy hoạch và thiết kế theo **tiêu chuẩn Singapore** hiện đại với sự tham gia của: **Surbana Jurong** (Singapore), **Global Vireon Studio**, **Handong**, **Coninco** và **K-City**. Thiết kế tập trung tối ưu công năng, ánh sáng tự nhiên và thông gió. Dự án hướng đến tiêu chuẩn **công trình xanh EDGE** nhằm giảm chi phí vận hành cho cư dân.\n\n**Quy mô sản phẩm**\n\nDự án cung cấp đa dạng: Studio (37,7m²), 1 phòng ngủ+ (46,6m²), 2 phòng ngủ nhỏ (65,7m²), 2 phòng ngủ lớn (69,5m²) và 82 căn shophouse. Tất cả bàn giao hoàn thiện nội thất theo tiêu chuẩn dự án.\n\n**Hệ thống tiện ích nội khu**\n\nHệ thống tiện ích phục vụ nhu cầu thiết thực hàng ngày của cư dân bao gồm: **hồ bơi**, **sân chơi trẻ em**, **khu thể dục ngoài trời**, **Sky Garden & vườn cảnh quan**, **nhà sinh hoạt cộng đồng**, **trạm sạc xe điện** và hệ thống shophouse khối đế.\n\n**Pháp lý & Chính sách hỗ trợ**\n\nSổ hồng sở hữu lâu dài theo quy định nhà ở xã hội. Người mua đủ điều kiện được hỗ trợ vay từ **Ngân hàng Chính sách Xã hội** với lãi suất ưu đãi **5,4%/năm** trong 25 năm, trả góp chỉ từ 3,5 triệu/tháng. Đội ngũ Kim Oanh Land hỗ trợ hoàn thiện hồ sơ miễn phí.",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.298520835324!2d106.89406377488157!3d10.711442389433383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31751946f2629b55%3A0x3fffa92e2b45f1d8!2sK-Home%20Avenue%20-%20Kim%20Oanh%20Homes!5e0!3m2!1sen!2s!4v1784803690040!5m2!1sen!2s",
    gallery: [
      "/k-home avenue/Pc09-Loi-vao-shophouse_2-min.jpg.webp",
      "/k-home avenue/PC01-TT-copy_2_2-min.jpg.webp",
      "/k-home avenue/PC02-TT-10K_2-min.jpg.webp",
      "/k-home avenue/PC03-TT-10K_2-min.jpg.webp",
      "/k-home avenue/Pc04-Tien-ich-tram-sac_2-min.jpg.webp",
      "/k-home avenue/Pc05-Tien-ich-khu-vui-choi_2-min.jpg.webp",
      "/k-home avenue/Pc06-Tien-ich-dung-nghi_2-min.jpg.webp",
      "/k-home avenue/Pc07-Tien-ich-be-boi_2-min.jpg.webp",
      "/k-home avenue/Pc08-Tien-ich-cong-vien_2-min.jpg.webp",
      "/k-home avenue/layout-can-ho-khome-avenue-nhon-trach.jpg",
    ],
    amenities: ["Hồ bơi người lớn & trẻ em", "Sân chơi trẻ em", "Khu thể dục ngoài trời", "Sky Garden & vườn cảnh quan", "82 căn shophouse thương mại", "Hệ thống an ninh 24/7"],
    unitTypes: [
      // ── Avenue: Chuẩn hóa slug naming để match CityView/Midtown ──
      { slug: "can-ho-studio", name: "Căn Studio",    bedrooms: 0, bathrooms: 1, constructionArea: "37,7m²", usableArea: "33,3m²", price: "Từ 750 triệu/căn",       priceNumber: 750,  furnished: true,
        description: "**Căn Studio K-Home Avenue** là lựa chọn tối ưu cho người độc thân, công nhân kỹ thuật cao và cặp đôi trẻ tại khu vực Nhơn Trạch — nơi đang được đầu tư hạ tầng mạnh mẽ nhờ sân bay Long Thành. Đây là loại căn có mức giá khởi điểm thấp nhất và tỷ lệ đặt cọc cao nhất trong dự án.\n\n**Diện tích & Bố cục**\n\nDiện tích xây dựng **37,7m²** và diện tích sử dụng **33,3m²** — thiết kế studio linh hoạt tối ưu từng cm². Không gian mở thông thoáng với khu sinh hoạt kết hợp ngủ nghỉ, **1 nhà vệ sinh** đầy đủ tiện nghi, bếp mini hiện đại và ban công nhỏ đón gió mát.\n\n**Nội thất bàn giao**\n\nBàn giao **full nội thất** cao cấp theo tiêu chuẩn Singapore của dự án. Nội thất được thiết kế đa năng, tiết kiệm tối đa không gian: giường ngủ tích hợp tủ, bàn làm việc gấp gọn, tủ bếp compact và khu vệ sinh clean-line hiện đại. Chỉ trừ các thiết bị điện tử.\n\n**Giá bán & Tiềm năng**\n\nGiá từ **750 triệu/căn** — mức giá NOXH thấp nhất trong hệ thống K-Home, được hỗ trợ lãi suất vay ưu đãi. Khu vực Nhơn Trạch đang trong giai đoạn tăng trưởng mạnh nhờ hạ tầng sân bay Long Thành, căn studio tại đây có tiềm năng cho thuê rất tốt.",
        images: [
        "/k-home avenue/Can-Studio/layout-can-ho-khome-avenue-studio.jpg",
        "/k-home avenue/Can-Studio/01_XU.jpg",
        "/k-home avenue/Can-Studio/dsc01072.webp",
        "/k-home avenue/Can-Studio/dsc01084.webp",
        "/k-home avenue/Can-Studio/dsc01089.webp",
        "/k-home avenue/Can-Studio/dsc01093.webp",
        "/k-home avenue/Can-Studio/dsc01099.webp",
        "/k-home avenue/Can-Studio/dsc01105.webp",
        "/k-home avenue/Can-Studio/dsc01117.webp",
        "/k-home avenue/Can-Studio/dsc01125.webp",
        "/k-home avenue/Can-Studio/dsc01129.webp",
        "/k-home avenue/Can-Studio/dsc01134.webp",
      ]},
      { slug: "can-ho-1-phong-ngu-a", name: "Căn 1 Phòng Ngủ +",      bedrooms: 1, bathrooms: 1, constructionArea: "46,6m²", usableArea: "41,6m²", price: "Từ 990 triệu/căn",       priceNumber: 990,  furnished: true,
        description: "**Căn 1 Phòng Ngủ+ K-Home Avenue** là loại căn phổ biến nhất trong dự án, cân bằng tốt giữa diện tích, công năng và giá cả — phù hợp cho cặp đôi trẻ và gia đình 2–3 người muốn sở hữu tổ ấm đầu tiên tại khu vực cửa ngõ sân bay Long Thành.\n\n**Diện tích & Bố cục**\n\nDiện tích xây dựng **46,6m²** và diện tích sử dụng **41,6m²** với bố cục tách biệt rõ ràng: **1 phòng ngủ** riêng biệt đón ánh sáng tự nhiên, **1 nhà vệ sinh** tiện nghi, phòng khách thông bếp mở rộng thoáng và ban công đón gió. Cửa sổ được thiết kế đón hướng Đông hoặc Tây Nam theo tiêu chuẩn thiết kế Singapore.\n\n**Nội thất bàn giao**\n\nBàn giao **full nội thất** hoàn thiện theo tiêu chuẩn dự án được tư vấn bởi **Surbana Jurong** Singapore. Toàn bộ nội thất cố định được lắp đặt sẵn: tủ âm tường phòng ngủ, tủ bếp trên dưới, sàn gỗ, trần thạch cao và hệ thống chiếu sáng. Chỉ trừ thiết bị điện tử.\n\n**Giá bán & Tiềm năng**\n\nGiá từ **990 triệu/căn** — mức giá NOXH được Nhà nước phê duyệt, hỗ trợ vay lãi suất ưu đãi. Nhơn Trạch là khu vực có tốc độ tăng giá BĐS nhanh nhất vùng Đông Nam Bộ nhờ sân bay Long Thành — tiềm năng tăng giá và cho thuê rất cao trong tương lai gần.",
        images: [
        "/k-home avenue/Can-1PN/layout-can-ho-khome-avenue-1PN.jpg",
        "/k-home avenue/Can-1PN/dsc01146.webp",
        "/k-home avenue/Can-1PN/dsc01150.webp",
        "/k-home avenue/Can-1PN/dsc01152.webp",
        "/k-home avenue/Can-1PN/dsc01162.webp",
        "/k-home avenue/Can-1PN/dsc01184.webp",
        "/k-home avenue/Can-1PN/dsc01190.webp",
        "/k-home avenue/Can-1PN/dsc01209.webp",
        "/k-home avenue/Can-1PN/dsc01220.webp",
        "/k-home avenue/Can-1PN/dsc01245.webp",
        "/k-home avenue/Can-1PN/dsc01269.webp",
        "/k-home avenue/Can-1PN/dsc01279.webp",
        "/k-home avenue/Can-1PN/dsc01286.webp",
      ]},
      { slug: "can-ho-2-phong-ngu", name: "Căn 2 Phòng Ngủ (Nhỏ)", bedrooms: 2, bathrooms: 2, constructionArea: "65,7m²", usableArea: "58,4m²", price: "1,23 tỷ – 1,39 tỷ/căn", priceNumber: 1230, furnished: true,
        description: "**Căn 2 Phòng Ngủ (Nhỏ) K-Home Avenue** là loại căn 2 phòng ngủ có diện tích vừa phải, tối ưu cho gia đình 3–4 người muốn có không gian riêng tư cho mỗi thành viên với mức ngân sách hợp lý nhất trong phân khúc 2PN của dự án.\n\n**Diện tích & Bố cục**\n\nDiện tích xây dựng **65,7m²** và diện tích sử dụng **58,4m²** — phân bổ hợp lý với **2 phòng ngủ** riêng biệt (phòng ngủ chính rộng đủ giường đôi Queen, phòng ngủ phụ đủ giường đơn hoặc bàn làm việc), **2 nhà vệ sinh** tiện nghi, phòng khách kết hợp bàn ăn và ban công thoáng.\n\n**Nội thất bàn giao**\n\nBàn giao **full nội thất** hoàn thiện cao cấp, đồng bộ toàn dự án theo tiêu chuẩn thiết kế Singapore. Cả 2 phòng ngủ đều có tủ âm tường built-in, phòng khách đủ diện tích bố trí bàn ăn 4 người. Chỉ trừ thiết bị điện tử.\n\n**Giá bán & Tiềm năng**\n\nGiá từ **1,23 tỷ đến 1,39 tỷ/căn** tùy tầng và hướng nhìn — đây là mức giá NOXH được kiểm soát, thấp hơn đáng kể so với căn hộ thương mại cùng diện tích tại Nhơn Trạch. Tiềm năng cho thuê cao nhờ vị trí gần các KCN Nhơn Trạch và cửa ngõ sân bay Long Thành.",
        images: [
        "/k-home avenue/Can-2PN-nho/layout-can-ho-khome-avenue-2PNA.jpg",
        "/k-home avenue/Can-2PN-nho/dsc01317.webp",
        "/k-home avenue/Can-2PN-nho/dsc01338.webp",
        "/k-home avenue/Can-2PN-nho/dsc01350.webp",
        "/k-home avenue/Can-2PN-nho/dsc01360.webp",
        "/k-home avenue/Can-2PN-nho/dsc01367.webp",
        "/k-home avenue/Can-2PN-nho/dsc01377.webp",
        "/k-home avenue/Can-2PN-nho/dsc01385.webp",
        "/k-home avenue/Can-2PN-nho/dsc01394.webp",
        "/k-home avenue/Can-2PN-nho/dsc01397.webp",
        "/k-home avenue/Can-2PN-nho/dsc01400.webp",
        "/k-home avenue/Can-2PN-nho/dsc01401.webp",
        "/k-home avenue/Can-2PN-nho/dsc01417.webp",
        "/k-home avenue/Can-2PN-nho/dsc01426.webp",
        "/k-home avenue/Can-2PN-nho/dsc01440.webp",
      ]},
      { slug: "can-ho-2-phong-ngu-b-avenue", name: "Căn 2 Phòng Ngủ (Lớn)", bedrooms: 2, bathrooms: 2, constructionArea: "69,5m²", usableArea: "62,2m²", price: "1,40 tỷ – 1,47 tỷ/căn", priceNumber: 1400, furnished: true,
        description: "**Căn 2 Phòng Ngủ (Lớn) K-Home Avenue** là loại căn cao cấp nhất trong rổ hàng NOXH của dự án, dành cho gia đình cần không gian sinh hoạt rộng rãi hơn với diện tích phòng ngủ master lớn và phòng khách thoải mái hơn phiên bản nhỏ.\n\n**Diện tích & Bố cục**\n\nDiện tích xây dựng **69,5m²** và diện tích sử dụng **62,2m²** — diện tích vượt trội so với 2PN (Nhỏ) được phân bổ vào phòng ngủ master rộng hơn (đủ cho giường King size), phòng khách có diện tích bố trí bàn ăn 6 người và góc làm việc riêng. **2 nhà vệ sinh** với master bathroom riêng biệt hoàn toàn.\n\n**Nội thất bàn giao**\n\nBàn giao **full nội thất** hoàn thiện cao cấp nhất trong hệ thống K-Home Avenue, phòng ngủ master có tủ âm tường walk-in đặc biệt rộng rãi. Toàn bộ nội thất cố định được thiết kế đồng bộ theo tiêu chuẩn Singapore. Chỉ trừ thiết bị điện tử.\n\n**Giá bán & Tiềm năng**\n\nGiá từ **1,40 tỷ đến 1,47 tỷ/căn** — là mức giá đỉnh trong rổ hàng NOXH K-Home Avenue nhưng vẫn thấp hơn rất nhiều so với căn hộ thương mại cùng diện tích. Vị trí Nhơn Trạch đang trong giai đoạn bùng nổ hạ tầng, loại căn lớn nhất thường có khả năng tăng giá mạnh nhất trong dài hạn.",
        images: [
        "/k-home avenue/Can-2PN-lon/layout-can-ho-khome-avenue-2PNB.jpg",
        "/k-home avenue/Can-2PN-lon/dsc01317.webp",
        "/k-home avenue/Can-2PN-lon/dsc01338.webp",
        "/k-home avenue/Can-2PN-lon/dsc01350.webp",
        "/k-home avenue/Can-2PN-lon/dsc01360.webp",
        "/k-home avenue/Can-2PN-lon/dsc01367.webp",
        "/k-home avenue/Can-2PN-lon/dsc01377.webp",
        "/k-home avenue/Can-2PN-lon/dsc01385.webp",
        "/k-home avenue/Can-2PN-lon/dsc01394.webp",
        "/k-home avenue/Can-2PN-lon/dsc01397.webp",
        "/k-home avenue/Can-2PN-lon/dsc01400.webp",
        "/k-home avenue/Can-2PN-lon/dsc01401.webp",
        "/k-home avenue/Can-2PN-lon/dsc01417.webp",
        "/k-home avenue/Can-2PN-lon/dsc01426.webp",
        "/k-home avenue/Can-2PN-lon/dsc01440.webp",
      ]},
    ],
    status: "Đã công bố", rating: 4.8, floorCount: 12, developer: "Kim Oanh Land (Tập đoàn Kim Oanh Group)",
  },
];

// news data imported from src/data/newsData.ts
const newsList = newsData;
// ─── 301 Redirects: /projects/* → slug mới ───────────────────────────────────
// Google đã index các URL /projects/... cũ, cần 301 để chuyển vĩnh viễn
const PROJECT_REDIRECTS: Record<string, string> = {
  "/projects/k-home-cityview-ho-nai":   "/k-home-cityview-ho-nai",
  "/projects/k-home-midtown-trang-bom": "/k-home-midtown-trang-bom",
  "/projects/k-home-avenue-nhon-trach": "/k-home-avenue-nhon-trach",
  "/projects/k-home-grand-urban":       "/k-home-cityview-ho-nai",
};

// Redirect /projects/:slug/:unit → /:slug/:unit
app.get("/projects/:projectSlug/:unitSlug", (req, res) => {
  res.redirect(301, `/${req.params.projectSlug}/${req.params.unitSlug}`);
});

// ─── 301 Redirects: Old Avenue unit slugs → Standardized slugs ────────────────
// Google đã index URLs cũ của Avenue với -nho, -lon, cần redirect lâu dài
const AVENUE_SLUG_REDIRECTS: Record<string, string> = {
  "can-ho-2-phong-ngu-nho": "can-ho-2-phong-ngu",
  "can-ho-2-phong-ngu-lon": "can-ho-2-phong-ngu-b-avenue",
};

app.get("/k-home-avenue-nhon-trach/:oldUnitSlug", (req, res, next) => {
  const newSlug = AVENUE_SLUG_REDIRECTS[req.params.oldUnitSlug];
  if (newSlug) {
    res.redirect(301, `/k-home-avenue-nhon-trach/${newSlug}`);
  } else {
    next();
  }
});

// Redirect /projects/:slug → /:slug hoặc fallback
app.get("/projects/:projectSlug", (req, res) => {
  const target = PROJECT_REDIRECTS[`/projects/${req.params.projectSlug}`]
    || `/${req.params.projectSlug}`;
  res.redirect(301, target);
});

// Redirect /projects (trang danh sách) → /san-pham
app.get("/projects", (_req, res) => {
  res.redirect(301, "/san-pham");
});

// ─── 301 Redirects: Old news slugs → New news slugs ────────────────────────────
// Google đã index các URL tin tức cũ, cần 301 để transfer link juice
const NEWS_SLUG_REDIRECTS: Record<string, string> = {
  "/tin-tuc/k-home-cityview-la-gi-co-nen-mua-o-that-tai-bien-hoa-2026-khong": "/tin-tuc/k-home-cityview-la-gi-co-nen-mua-o-that-tai-bien-hoa-2026",
  "/tin-tuc/vi-tri-k-home-cityview-bien-hoa-noi-bat-so-voi-cac-du-an-noxh-khac": "/tin-tuc/vi-tri-k-home-cityview-bien-hoa-noi-bat-so-voi-cac-du-an-noxh",
  "/tin-tuc/mat-bang-k-home-cityview-co-toi-uu-anh-sang-va-thong-gio-khong-vay": "/tin-tuc/danh-gia-mat-bang-k-home-cityview-huong-nang-va-thong-gio-tu-nhien",
};

app.get("/tin-tuc/:slug", (req, res, next) => {
  const oldPath = `/tin-tuc/${req.params.slug}`;
  const newPath = NEWS_SLUG_REDIRECTS[oldPath];
  if (newPath) {
    res.redirect(301, newPath);
  } else {
    next();
  }
});

// ─── Public API Routes ────────────────────────────────────────────────────────
app.get("/api/projects", (_req, res) => res.json(projects));
app.get("/api/news", (_req, res) => res.json(newsList));

// Khách hàng gửi form liên hệ
app.post("/api/contact", contactLimiter, async (req, res) => {
  const { name, email, phone, projectSlug, projectName, message } = req.body;

  if (!name || !phone) {
    res.status(400).json({ error: "Vui lòng điền đầy đủ: Họ tên, Số điện thoại." });
    return;
  }

  try {
    const contact = await ContactModel.create({
      name: String(name).trim().slice(0, 200),
      email: String(email).trim().slice(0, 200),
      phone: String(phone).trim().slice(0, 20),
      projectSlug: projectSlug ? String(projectSlug).trim() : "general",
      projectName: projectName ? String(projectName).trim() : "Tư vấn chung",
      message: message ? String(message).trim().slice(0, 2000) : "",
    });

    // Gửi email thông báo — chạy nền, không block response
    sendContactNotification({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      projectName: contact.projectName,
      message: contact.message,
      createdAt: contact.createdAt,
    }).catch((err) => console.error("⚠️ Gửi email thất bại (không ảnh hưởng lưu DB):", err.message));

    res.status(201).json({ success: true, contact });
  } catch (err: any) {
    if (err.name === "ValidationError") {
      res.status(400).json({ error: "Dữ liệu không hợp lệ: " + err.message });
    } else {
      console.error("POST /api/contact error:", err);
      res.status(500).json({ error: "Lỗi máy chủ. Vui lòng thử lại." });
    }
  }
});

// ─── Admin Auth Route ─────────────────────────────────────────────────────────
app.post("/api/admin/login", loginLimiter, async (req, res) => {
  const { username, password } = req.body;

  const adminUser = process.env.ADMIN_USERNAME;
  const adminHash = process.env.ADMIN_PASSWORD_HASH;
  const jwtSecret = process.env.JWT_SECRET;

  if (!adminUser || !adminHash || !jwtSecret) {
    res.status(500).json({ error: "Lỗi cấu hình máy chủ." });
    return;
  }

  if (!username || !password) {
    res.status(400).json({ error: "Vui lòng nhập tài khoản và mật khẩu." });
    return;
  }

  const usernameMatch = String(username).toLowerCase() === adminUser.toLowerCase();
  const passwordMatch = await bcrypt.compare(String(password), adminHash);

  if (!usernameMatch || !passwordMatch) {
    res.status(401).json({ error: "Tài khoản hoặc mật khẩu không chính xác." });
    return;
  }

  const token = jwt.sign({ username: adminUser }, jwtSecret, { expiresIn: "8h" });
  res.json({ success: true, token });
});

// ─── Protected Admin CRM Routes (JWT required) ───────────────────────────────
app.get("/api/contacts", requireAuth, async (_req, res) => {
  try {
    const contacts = await ContactModel.find().sort({ createdAt: -1 }).lean();
    // Chuẩn hoá _id của MongoDB thành id string cho frontend
    const mapped = contacts.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest }));
    res.json(mapped);
  } catch (err) {
    console.error("GET /api/contacts error:", err);
    res.status(500).json({ error: "Lỗi máy chủ khi tải danh sách." });
  }
});

app.put("/api/contacts/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const allowedStatuses = ["Chờ liên hệ", "Đã liên hệ", "Đang thương lượng", "Đã chốt"];
  const update: Record<string, string> = {};

  if (status !== undefined) {
    if (!allowedStatuses.includes(status)) {
      res.status(400).json({ error: "Trạng thái không hợp lệ." });
      return;
    }
    update.status = status;
  }
  if (notes !== undefined) {
    update.notes = String(notes).slice(0, 5000);
  }

  try {
    const contact = await ContactModel.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean();
    if (!contact) {
      res.status(404).json({ error: "Không tìm thấy khách hàng." });
      return;
    }
    const { _id, ...rest } = contact as any;
    res.json({ success: true, contact: { id: _id.toString(), ...rest } });
  } catch (err) {
    console.error("PUT /api/contacts/:id error:", err);
    res.status(500).json({ error: "Lỗi máy chủ khi cập nhật." });
  }
});

app.delete("/api/contacts/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await ContactModel.findByIdAndDelete(id);
    if (!contact) {
      res.status(404).json({ error: "Không tìm thấy khách hàng." });
      return;
    }
    res.json({ success: true, message: "Đã xóa thành công." });
  } catch (err) {
    console.error("DELETE /api/contacts/:id error:", err);
    res.status(500).json({ error: "Lỗi máy chủ khi xóa." });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
async function startServer() {
  await connectDB();
  await verifyMailer(); // kiểm tra SMTP ngay khi khởi động

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    const publicPath = path.join(process.cwd(), "public");
    // Serve public assets (images, etc.) — must be before dist to avoid conflicts
    app.use(express.static(publicPath));
    app.use(express.static(distPath));

    // ── SPA fallback với canonical injection ──────────────────────────────────
    // Googlebot đọc HTML trước khi JS chạy, nên cần inject canonical đúng URL
    // ngay trong HTML response thay vì chờ React cập nhật
    const { readFileSync } = await import("fs");
    const indexHtml = readFileSync(path.join(distPath, "index.html"), "utf-8");
    const BASE_URL = "https://k-homedongnai.com.vn";

    app.get("*", (req, res) => {
      const reqPath = req.path === "/" ? "/" : req.path.replace(/\/$/, "");
      const canonicalUrl = `${BASE_URL}${reqPath}`;
      // Thay canonical href trong HTML trước khi serve
      const html = indexHtml.replace(
        /<link rel="canonical" href="[^"]*"/,
        `<link rel="canonical" href="${canonicalUrl}"`
      );
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(html);
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server đang chạy tại http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("❌ Lỗi khởi động server:", err);
  process.exit(1);
});


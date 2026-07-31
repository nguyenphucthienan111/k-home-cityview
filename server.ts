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
    description: "Dự án nhà ở xã hội K-Home CityView tại đường Điểu Xiển, Hố Nai, Biên Hòa. Quy mô 2,85 ha, 4 block 22 tầng, khoảng 1.352 căn hộ NOXH. Lãi suất ưu đãi 5,4%/năm, hỗ trợ hồ sơ miễn phí.",
    longDescription: "**Tổng quan dự án K-Home CityView Hố Nai**\n\n**K-Home CityView** là dự án nhà ở xã hội (NOXH) do **Kim Oanh Land** phát triển, tọa lạc tại mặt tiền **đường Điểu Xiển**, phường Hố Nai, thành phố Biên Hòa, tỉnh Đồng Nai. Dự án được quy hoạch trên quỹ đất rộng **2,85 ha** với **4 tòa tháp cao 22 tầng**, cung cấp khoảng **1.352 căn hộ nhà ở xã hội** cùng hệ thống shophouse khối đế.\n\nVới vị trí nằm trong khu vực có mật độ lao động cao và hạ tầng đang phát triển mạnh, K-Home CityView hướng đến giải pháp an cư ổn định, pháp lý rõ ràng và chi phí phù hợp cho người lao động, công chức và gia đình trẻ tại Đồng Nai.\n\n**Thiết kế & Đối tác**\n\nDự án được thiết kế theo **tiêu chuẩn Singapore** hiện đại, tập trung tối ưu công năng sử dụng, tận dụng ánh sáng tự nhiên và thông gió. Các căn hộ được bố trí mặt thoáng, hạn chế tối đa hành lang tối và không gian chết.\n\nCác đơn vị tư vấn đồng hành gồm: **Global Vireon Studio**, **Kiến Trúc Việt**, **CDC Jsc** và **K-City**. Dự án cũng hướng đến tiêu chuẩn **công trình xanh EDGE**, giúp tiết kiệm điện năng và nước sinh hoạt trong quá trình vận hành.\n\n**Quy mô sản phẩm**\n\nDự án cung cấp đa dạng loại căn hộ phù hợp nhiều nhu cầu: căn hộ 1 phòng ngủ+ (47,3m²), căn hộ 2 phòng ngủ (62,4 – 70,4m²), căn hộ 3 phòng ngủ (84,4m²) và shophouse khối đế. Tất cả đều được bàn giao hoàn thiện nội thất theo tiêu chuẩn dự án.\n\n**Hệ thống tiện ích nội khu**\n\nHệ thống tiện ích được quy hoạch phục vụ nhu cầu thiết thực của cư dân ngay trong khuôn viên dự án, bao gồm: **hồ bơi** người lớn và trẻ em, **sân chơi trẻ em**, **khu thể dục ngoài trời**, **nhà sinh hoạt cộng đồng**, vườn cảnh quan và lối dạo bộ.\n\n**Pháp lý & Chính sách hỗ trợ**\n\nSổ hồng sở hữu lâu dài theo quy định nhà ở xã hội. Người mua đủ điều kiện được hỗ trợ vay từ **Ngân hàng Chính sách Xã hội** với lãi suất ưu đãi **5,4%/năm** trong 25 năm, trả góp từ khoảng 3,5 – 4,5 triệu/tháng. Đội ngũ Kim Oanh Land hỗ trợ hoàn thiện hồ sơ mua nhà hoàn toàn miễn phí.\n\n**Vị trí kết nối**\n\nDự án nằm trên trục đường Điểu Xiển, thuận tiện di chuyển đến trung tâm TP. Biên Hòa và các khu công nghiệp lớn tại Đồng Nai như KCN Amata, Biên Hòa 2, Long Bình, Hố Nai cùng các tiện ích hiện hữu như trường học, bệnh viện, siêu thị trong bán kính 5km.",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d946.1114524333827!2d106.9022019!3d10.9592617!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174dd0052a72139%3A0xd752da458a5eca9e!2zTk9YSCBI4buRIE5haQ!5e1!3m2!1sen!2s!4v1784801484940!5m2!1sen!2s",
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
    amenities: ["Hồ bơi người lớn & trẻ em", "Sân chơi trẻ em", "Khu thể dục ngoài trời", "Nhà sinh hoạt cộng đồng", "Shophouse thương mại nội khu", "Hệ thống an ninh 24/7"],
    unitTypes: [
      { slug: "can-ho-1-phong-ngu-a", name: "Căn 1 Phòng Ngủ + A", bedrooms: 1, bathrooms: 1, constructionArea: "47,3m²", usableArea: "42,3m²", price: "950 triệu – 1,05 tỷ/căn", priceNumber: 950,  furnished: true,
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
      { slug: "can-ho-1-phong-ngu-b", name: "Căn 1 Phòng Ngủ + B", bedrooms: 1, bathrooms: 2, constructionArea: "62,4m²", usableArea: "55,1m²", price: "1,25 tỷ – 1,40 tỷ/căn", priceNumber: 1250, furnished: true,
        description: "**Căn hộ 1 Phòng Ngủ + B** là phiên bản nâng cấp so với loại A, sở hữu diện tích rộng hơn và **2 nhà vệ sinh** riêng biệt — đáp ứng nhu cầu của các gia đình nhỏ hoặc cặp đôi cần không gian sinh hoạt thoải mái hơn.\n\n**Diện tích & Bố cục**\n\nDiện tích xây dựng **62,4m²** và diện tích sử dụng **55,1m²** cho phép bố trí không gian rộng rãi hơn: **1 phòng ngủ** master rộng, **2 nhà vệ sinh** (1 trong phòng ngủ, 1 cho khách), phòng khách – bếp mở thông thoáng và ban công rộng.\n\n**Nội thất bàn giao**\n\nCăn hộ bàn giao **full nội thất** theo tiêu chuẩn dự án, đảm bảo cư dân có thể sử dụng ngay mà không cần đầu tư thêm nhiều. Các thiết bị điện tử không nằm trong gói bàn giao.\n\n**Giá bán & Chính sách**\n\nMức giá **1,25 tỷ – 1,40 tỷ/căn** thuộc phân khúc nhà ở xã hội được Nhà nước kiểm soát, người mua được hưởng đầy đủ chính sách hỗ trợ vay vốn ưu đãi NOXH với lãi suất thấp hơn lãi suất thị trường.",
        images: [
          "/k-home cityview/Can-1PN-B/2pns-noxh-k-home-city-view-2048x1536.jpg",
          "/k-home cityview/Can-1PN-B/khome-cityview-nha-mau-can-ho-1PN-1.jpg",
          "/k-home cityview/Can-1PN-B/khome-cityview-nha-mau-can-ho-1PN-2.jpg",
          "/k-home cityview/Can-1PN-B/khome-cityview-nha-mau-can-ho-1PN-3.jpg",
          "/k-home cityview/Can-1PN-B/khome-cityview-nha-mau-can-ho-1PN-4-2048x1209.jpg",
          "/k-home cityview/Can-1PN-B/khome-cityview-nha-mau-can-ho-1PN-5.jpg",
          "/k-home cityview/Can-1PN-B/khome-cityview-nha-mau-can-ho-1PN-7.jpg",
        ]},
      { slug: "can-ho-2-phong-ngu", name: "Căn 2 Phòng Ngủ", bedrooms: 2, bathrooms: 2, constructionArea: "70,4m²", usableArea: "63,2m²", price: "1,50 tỷ – 1,60 tỷ/căn", priceNumber: 1500, furnished: true,
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
      { slug: "can-ho-1-phong-ngu", name: "Căn 1 Phòng Ngủ +",      bedrooms: 1, bathrooms: 1, constructionArea: "46,6m²", usableArea: "41,6m²", price: "Từ 990 triệu/căn",       priceNumber: 990,  furnished: true,
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
      { slug: "can-ho-2-phong-ngu-nho", name: "Căn 2 Phòng Ngủ (Nhỏ)", bedrooms: 2, bathrooms: 2, constructionArea: "65,7m²", usableArea: "58,4m²", price: "1,23 tỷ – 1,39 tỷ/căn", priceNumber: 1230, furnished: true,
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
      { slug: "can-ho-2-phong-ngu-lon", name: "Căn 2 Phòng Ngủ (Lớn)", bedrooms: 2, bathrooms: 2, constructionArea: "69,5m²", usableArea: "62,2m²", price: "1,40 tỷ – 1,47 tỷ/căn", priceNumber: 1400, furnished: true,
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
    status: "Sắp công bố", rating: 4.8, floorCount: 12, developer: "Kim Oanh Land (Tập đoàn Kim Oanh Group)",
  },
];

const newsList = [
  {
    id: "1",
    slug: "dieu-kien-mua-nha-o-xa-hoi-dong-nai-2026",
    title: "Điều Kiện Mua Nhà Ở Xã Hội Đồng Nai 2026: Nới Lỏng Thu Nhập, Bỏ Sổ Hộ Khẩu",
    date: "2026-07-27",
    excerpt: "Quy định năm 2026 đã nới lỏng thu nhập và bãi bỏ yêu cầu sổ hộ khẩu — cơ hội lớn cho người lao động tại Biên Hòa, Nhơn Trạch, Trảng Bom sở hữu nhà ở xã hội.",
    image: "https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news/news-1",
    category: "Chính sách",
    content: `Bạn đang làm việc tại các khu công nghiệp Biên Hòa, Nhơn Trạch, Trảng Bom với mức lương vừa phải và muốn sở hữu nhà ở xã hội (NOXH)? Quy định năm 2026 đã có nhiều thay đổi có lợi cho người lao động. Bài viết dưới đây tổng hợp chính xác, minh bạch các điều kiện theo Luật Nhà ở 2023 và các nghị định mới nhất, kèm thông tin về chuỗi dự án K-Home đang triển khai tại Đồng Nai.

![Chuỗi dự án nhà ở xã hội K-Home Đồng Nai 2026 – cơ hội an cư cho người lao động](/news/news 1.webp)

## 1. Điều kiện về nhà ở (bắt buộc)

Người đứng tên mua NOXH tại Đồng Nai phải thuộc một trong các trường hợp sau (theo Điều 29 Nghị định 100/2024/NĐ-CP được sửa đổi):

- Chưa có nhà ở thuộc sở hữu của bản thân và vợ/chồng (không có tên trong Giấy chứng nhận quyền sử dụng đất, quyền sở hữu nhà ở tại tỉnh Đồng Nai).
- Đã có nhà ở nhưng diện tích nhà ở bình quân đầu người trong hộ gia đình thấp hơn 15m² sàn/người.
- Chưa được mua, thuê mua nhà ở xã hội hoặc hưởng chính sách hỗ trợ nhà ở, đất ở dưới mọi hình thức tại Đồng Nai.

![Điều kiện về nhà ở khi mua nhà ở xã hội Đồng Nai – diện tích dưới 15m2 sàn mỗi người](/news/news 2.jpg)

## 2. Điều kiện về thu nhập (đã được nới lỏng mạnh từ 07/4/2026)

Theo Nghị định 136/2026/NĐ-CP (có hiệu lực từ ngày 07/4/2026), mức thu nhập bình quân hàng tháng thực nhận được nâng lên như sau:

| Đối tượng | Mức thu nhập tối đa |
|---|---|
| Người độc thân / chưa kết hôn | ≤ 25 triệu đồng/tháng |
| Người độc thân đang nuôi con dưới tuổi thành niên | ≤ 35 triệu đồng/tháng |
| Người đã kết hôn (tổng 2 vợ chồng) | ≤ 50 triệu đồng/tháng |

**Lưu ý quan trọng:**
- Thu nhập tính theo bảng lương, tiền công do cơ quan/đơn vị/doanh nghiệp xác nhận.
- Thời gian xác định: 12 tháng liền kề trước thời điểm cơ quan có thẩm quyền xác nhận.
- UBND tỉnh được phép điều chỉnh hệ số theo điều kiện địa phương.

![Mức thu nhập mua nhà ở xã hội Đồng Nai 2026 theo Nghị định 136 – độc thân 25 triệu, vợ chồng 50 triệu](/news/news 3.jpg)

## 3. Điều kiện về cư trú (đã bỏ sổ hộ khẩu)

Theo Luật Nhà ở 2023, điều kiện về sổ hộ khẩu hoặc tạm trú KT3 dài hạn đã được bãi bỏ. Hiện nay chỉ cần:

- Có hợp đồng lao động có thời hạn từ 01 năm trở lên.
- Đang tham gia đóng Bảo hiểm xã hội (BHXH) tại tỉnh Đồng Nai.

![Điều kiện cư trú mua nhà ở xã hội Đồng Nai 2026 – chỉ cần hợp đồng lao động và BHXH](/news/news 4.jpg)

## Chuỗi dự án K-Home tại Đồng Nai

Nếu bạn đáp ứng đủ 3 điều kiện trên, chuỗi dự án K-Home do Kim Oanh Group phát triển là lựa chọn đáng cân nhắc. Các dự án theo tiêu chuẩn Singapore, hướng tới chứng chỉ công trình xanh EDGE.

![Chuỗi dự án nhà ở xã hội K-Home Kim Oanh Group tại Đồng Nai chuẩn Singapore và EDGE](/news/news 5.jpg)

**K-Home CityView (P. Hố Nai, Biên Hòa):** Đường Điểu Xiển, 2,85 ha, 4 tòa 22 tầng, ~1.800 căn. Đã khởi công 20/5/2026.

![Dự án K-Home Cityview phường Hố Nai Biên Hòa – nhà ở xã hội 2026](/news/news 6.jpg)

**K-Home Avenue (Nhơn Trạch):** Mặt tiền đường 25C, ~1.100–1.200 căn (4 tòa 12 tầng). Sales Gallery khai trương 12/4/2026. Kết nối sân bay Long Thành và Vành đai 3.

![K-Home Avenue Nhơn Trạch mặt tiền đường 25C – căn hộ mẫu chuẩn Singapore](/news/news 7.jpg)

**K-Home Midtown (Trảng Bom):** Trung tâm Trảng Bom, 1 block 15 tầng, ~500–560 căn. Phục vụ lao động các cụm công nghiệp khu vực.

![K-Home Midtown Trảng Bom – nhà ở xã hội cho lao động khu công nghiệp](/news/news 8.webp)

Người mua được hỗ trợ vay vốn ưu đãi từ Ngân hàng Chính sách xã hội (lãi suất ~5,4%/năm, tối đa 75–80% giá trị hợp đồng, thời hạn đến 25 năm).



Bạn có đủ điều kiện? Hãy liên hệ **0937.587.438** để được tư vấn miễn phí về hồ sơ, chính sách và cập nhật tiến độ mở bán mới nhất.

---RELATED---danh-gia-du-an-k-home-cityview-bien-hoa-2026|Đánh giá dự án K-Home CityView Biên Hòa 2026;lai-suat-mua-nha-giam-sau-co-hoi-vang|Lãi suất vay mua nhà giảm sâu 2026`,
  },
  {
    id: "2",
    slug: "danh-gia-du-an-k-home-cityview-bien-hoa-2026",
    title: "Đánh Giá Chi Tiết Dự Án K-Home CityView Biên Hòa: Vị Trí, Thiết Kế & Giá Bán Mới Nhất 2026",
    date: "2026-07-28",
    excerpt: "Tìm hiểu chi tiết dự án NOXH K-Home CityView Biên Hòa: vị trí Hố Nai, quy mô 1.816 căn, tiện ích chuẩn xanh EDGE, giá ~20,5 triệu/m² và tiến độ thi công mới nhất tháng 7/2026.",
    image: "https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/V32_TAN-HOA_EXT_AERIAL_2_FINAL_2",
    category: "Đánh giá dự án",
    content: `Thành phố Biên Hòa đang chứng kiến bước ngoặt lớn về nguồn cung nhà ở xã hội (NOXH) với sự xuất hiện của K-Home CityView. Được phát triển bởi Kim Oanh Group, dự án không chỉ giải quyết nhu cầu an cư cho hàng ngàn người lao động mà còn thiết lập tiêu chuẩn sống mới tại khu vực trung tâm.

![Phối cảnh tổng thể dự án nhà ở xã hội K-Home CityView Biên Hòa Hố Nai Đồng Nai](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/V32_TAN-HOA_EXT_AERIAL_2_FINAL_2)

## 1. Tổng quan thông tin dự án K-Home CityView

- **Tên thương mại:** K-Home CityView (thuộc chuỗi thương hiệu K-Home)
- **Chủ đầu tư:** Công ty CP Đầu tư & Phát triển BĐS Miền Đông (thành viên Kim Oanh Group)
- **Vị trí:** Đường Điểu Xiển, phường Hố Nai, TP. Biên Hòa, tỉnh Đồng Nai
- **Đơn vị thiết kế:** Tập đoàn Surbana Jurong (Singapore)
- **Quy mô quỹ đất:** 2,85 ha
- **Số lượng sản phẩm:** 1.382 căn (1.352 NOXH + 30 shophouse)
- **Quy mô xây dựng:** 4 tòa tháp cao 22 tầng
- **Pháp lý:** Sổ hồng riêng từng căn

![Bản đồ vị trí K-Home CityView đường Điểu Xiển phường Hố Nai Biên Hòa](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/maps)

## 2. Vị trí "vàng" giải tỏa cơn khát nhà ở tại TP. Biên Hòa

Nằm trên mặt tiền đường Điểu Xiển, phường Hố Nai, dự án hưởng lợi trọn vẹn từ hạ tầng giao thông đồng bộ:

- **Kết nối vùng:** Dễ dàng di chuyển ra Quốc lộ 1A hướng về TP.HCM.
- **Kết nối việc làm:** Gần các KCN trọng điểm: KCN Amata, KCN Hố Nai, KCN Biên Hòa 2.
- **Tiện ích ngoại khu:** Chợ truyền thống, trường học, bệnh viện, Lotte Mart, GO!

![Vị trí vàng K-Home CityView gần KCN Amata và trung tâm Biên Hòa](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/golden-map)

## 3. Thiết kế chuẩn xanh EDGE và hệ tiện ích "All-in-one"

K-Home CityView xóa bỏ định kiến "nhà ở xã hội thiếu tiện ích" với đầu tư bài bản từ Surbana Jurong:

- **Chứng chỉ xanh EDGE:** Tiết kiệm tối thiểu 20% điện, nước sinh hoạt và lượng phát thải carbon hàng tháng.
- **Tiện ích khép kín:** Công viên, hồ bơi (người lớn & trẻ em), trường mầm non, khu BBQ, trạm sạc xe điện, shophouse nội khu.
- **Diện tích căn hộ:** 47,3 m² – 85 m², đáp ứng 1–3 phòng ngủ.



---GALLERY---https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/V12_TH_EXT_NOXH_POOL_2|https://res.cloudinary.com/dthv0nsq/image/upload/v1785230283/k-home-cityview/V10_TH_EXT_GARDEN_FINAL_2.jpg|Tiện ích hồ bơi và công viên xanh chuẩn Singapore tại K-Home CityView Biên Hòa

![Mặt bằng căn hộ diện tích 47.3m2 đến 84.4m2 dự án K-Home CityView Hố Nai](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/thiet-ke-can-ho-layout-khome-city-view-2048x764)

## 4. K-Home CityView giá bao nhiêu? (Cập nhật chính thức)

- **Giá bán chính thức:** Dao động từ 20,5 – 22,5 triệu đồng/m²  (thông thủy, đã bao gồm VAT).
- **Mức giá tham khảo:** Chỉ từ 950 triệu (đối với căn 1PN); từ 1,5 tỷ đồng/căn (đối với căn 2PN) và từ 1,8 tỷ đồng/căn (đối với 3 PN).
- **Nội thất bàn giao:** Hoàn thiện cơ bản với vật liệu thương hiệu An Cường.
- **Chính sách vay:** NH Chính sách xã hội — lãi suất 5,4%/năm, thời hạn đến 25 năm.

---GALLERY---https://res.cloudinary.com/dthv0nsq/image/upload/v1785230275/k-home-cityview/Can-1PN-B/khome-cityview-nha-mau-can-ho-1PN-1.jpg|https://res.cloudinary.com/dthv0nsq/image/upload/v1785230274/k-home-cityview/Can-1PN-B/khome-cityview-nha-mau-can-ho-1PN-3.jpg|https://res.cloudinary.com/dthv0nsq/image/upload/v1785230275/k-home-cityview/Can-1PN-B/khome-cityview-nha-mau-can-ho-1PN-4-2048x1209.jpg|Nội thất bàn giao chuẩn An Cường tại căn hộ K-Home CityView Biên Hòa

## 5. Tiến độ dự án mới nhất (tháng 7/2026)

- Lễ khởi công chính thức: **20/05/2026**
- Hiện tại: Đang thi công phần móng cọc và hạ tầng cơ sở.
- Dự kiến bàn giao: Cuối 2027 – đầu 2028.

![Tiến độ thi công móng cọc dự án K-Home CityView Hố Nai tháng 7 năm 2026](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/progress)

![Lễ khởi công dự án nhà ở xã hội K-Home CityView Biên Hòa ngày 20 tháng 5 năm 2026](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/start-city-view)

## Kết luận

K-Home CityView Biên Hòa đang trở thành một trong những dự án NOXH được quan tâm lớn nhất tại Đồng Nai nhờ vị trí trung tâm, thiết kế chuẩn Singapore, chứng chỉ xanh EDGE và giá được nhà nước phê duyệt minh bạch.

Nếu bạn đang tìm kiếm căn hộ NOXH tại Hố Nai – Biên Hòa, đây là thời điểm phù hợp để theo dõi sát tiến độ và chuẩn bị hồ sơ. Liên hệ **0937.587.438** để được tư vấn miễn phí.

---RELATED---dieu-kien-mua-nha-o-xa-hoi-dong-nai-2026|Điều kiện mua nhà ở xã hội Đồng Nai 2026`,
  },
  {
    id: "6",
    slug: "mat-bang-k-home-cityview-quy-mo-loai-can-va-tien-ich-noi-khu-moi-nhat",
    title: "Mặt Bằng K-Home CityView: Quy Mô, Loại Căn Và Tiện Ích Nội Khu Mới Nhất",
    date: "2026-08-01",
    excerpt: "Cập nhật mặt bằng K-Home CityView Biên Hòa, quy mô dự án, loại căn hộ, tiện ích nội khu và lý do dự án thu hút người mua ở thật năm 2026.",
    image: "https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/thiet-ke-can-ho-layout-khome-city-view-2048x764",
    category: "Đánh giá dự án",
    content: `Mặt bằng K-Home CityView là một trong những yếu tố được người mua quan tâm nhất khi tìm hiểu dự án, bởi nó quyết định trực tiếp đến cảm giác sống, sự riêng tư, khả năng khai thác công năng của căn hộ và mức độ phù hợp với từng nhóm khách hàng.

![Mặt bằng tổng thể và layout các loại căn hộ tại dự án K-Home CityView Hố Nai Biên Hòa](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/thiet-ke-can-ho-layout-khome-city-view-2048x764)

## Mặt bằng K-Home CityView có gì đáng chú ý?

Với quy mô khoảng 2,85 ha, dự án được quy hoạch thành 4 block cao 22 tầng, tạo nên một quần thể nhà ở xã hội có tổ chức tương đối bài bản tại Biên Hòa.

Điểm đáng chú ý là K-Home CityView không đi theo mô hình nhà ở xã hội nhỏ lẻ, mà được phát triển theo hướng một khu căn hộ khép kín, có hệ thống cảnh quan và tiện ích đồng bộ. Điều này giúp dự án có lợi thế về cảm nhận không gian sống, chứ không chỉ dừng ở việc cung cấp chỗ ở với mức giá dễ tiếp cận.

---GALLERY---https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/mat-bang/k-home-cityview-ho-nai-1.jpg|https://res.cloudinary.com/dthv0nsq/image/upload/v1785329651/slide-k-home-cityview/SLIDE-PRESENT-KHOME-CITYVIEW--21-06-2026-h%C3%ACnh-%E1%BA%A3nh-31.jpg|Mặt bằng tổng thể và sơ đồ tầng 1 dự án K-Home CityView Hố Nai Biên Hòa

## Quy mô dự án K-Home CityView

Theo thông tin công bố từ chủ đầu tư, K-Home CityView được xây dựng trên diện tích khoảng **28.459,4 m²** (gần 2,85 ha). Dự án gồm:

- **4 block** cao **22 tầng**
- **1.382 căn hộ** (1.352 NOXH + 30 shophouse thương mại)
- **Pháp lý:** Sổ hồng riêng từng căn

Quy mô lớn thường đem lại lợi thế về tiện ích, bố trí cảnh quan và khả năng hình thành cộng đồng cư dân đông, ổn định — phù hợp cho những người mua để ở lâu dài.

---GALLERY---https://res.cloudinary.com/dthv0nsq/image/upload/v1785329651/slide-k-home-cityview/SLIDE-PRESENT-KHOME-CITYVIEW--21-06-2026-h%C3%ACnh-%E1%BA%A3nh-31.jpg|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/mat-bang/mat-bang-k-home-cityview-tang-2.jpg|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/mat-bang/mat-bang-k-home-cityview-tang-4-11.jpg|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/mat-bang/mat-bang-k-home-cityview-tang-12A-22.jpg|Mặt bằng tầng điển hình các block dự án K-Home CityView Hố Nai

## Loại căn hộ tại K-Home CityView

K-Home CityView được định hướng phục vụ nhiều nhóm khách hàng khác nhau, vì vậy loại căn hộ cũng được phát triển linh hoạt. Diện tích dao động từ **47 m² đến 84 m²**, phù hợp với người độc thân, gia đình trẻ, hoặc gia đình có 2–3 thế hệ.

| Loại căn | Diện tích | Phù hợp |
|---|---|---|
| 1 phòng ngủ (A) | ~47–50 m² | Người độc thân, cặp đôi |
| 1 phòng ngủ (B) | ~52–55 m² | Cặp vợ chồng trẻ |
| 2 phòng ngủ | ~62–70 m² | Gia đình nhỏ 3–4 người |
| 3 phòng ngủ | ~78–84 m² | Gia đình 4–5 người |

Sự đa dạng này là điểm cộng vì người mua có thể chọn diện tích phù hợp với nhu cầu thực tế và khả năng tài chính.

---PROJECT-LINK---k-home-cityview-ho-nai|Xem chi tiết căn hộ K-Home CityView →

---GALLERY---https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/Can-1PN-A/1pn-noxh-k-home-city-view.jpg|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/Can-1PN-B/2pns-noxh-k-home-city-view-2048x1536.jpg|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/Can-2PN/2pn-noxh-k-home-city-view-2048x1536.jpg|https://res.cloudinary.com/dthv0nsq/image/upload/v1785230277/k-home-cityview/Can-3PN/3pn-noxh-k-home-city-view.jpg|Layout căn hộ 1PN, 2PN và 3PN tại K-Home CityView Biên Hòa

## Mặt bằng căn hộ có hợp lý không?

Trong phân khúc NOXH, điều quan trọng nhất của mặt bằng không chỉ là diện tích lớn hay nhỏ, mà là cách bố trí công năng có hợp lý hay không. Với K-Home CityView, thiết kế được chú trọng theo tiêu chí tối ưu sinh hoạt gia đình: khu sinh hoạt chung, khu riêng tư và khả năng đón sáng, đón gió tự nhiên.

Đối với gia đình trẻ, mặt bằng hợp lý giúp:
- Tối ưu diện tích sử dụng, giảm cảm giác chật chội
- Dễ bố trí nội thất theo nhu cầu
- Tạo không gian sinh hoạt thoải mái lâu dài
- Tăng giá trị khai thác thực tế của căn hộ

---GALLERY---https://res.cloudinary.com/dthv0nsq/image/upload/v1785230275/k-home-cityview/Can-1PN-B/khome-cityview-nha-mau-can-ho-1PN-1.jpg|https://res.cloudinary.com/dthv0nsq/image/upload/v1785230274/k-home-cityview/Can-1PN-B/khome-cityview-nha-mau-can-ho-1PN-3.jpg|https://res.cloudinary.com/dthv0nsq/image/upload/v1785230275/k-home-cityview/Can-1PN-B/khome-cityview-nha-mau-can-ho-1PN-4-2048x1209.jpg|Căn hộ mẫu 1PN bàn giao hoàn thiện cơ bản chuẩn An Cường tại K-Home CityView

## Tiện ích nội khu K-Home CityView gồm những gì?

Một trong những điểm làm K-Home CityView khác biệt so với nhiều dự án NOXH truyền thống là hệ thống tiện ích nội khu được quy hoạch khá đầy đủ. Dự án được phát triển theo hướng "mọi nhu cầu trong vài bước chân" — cư dân có thể tiếp cận nhiều dịch vụ sinh hoạt, vui chơi và thư giãn ngay trong khuôn viên.

**Tiện ích nổi bật:**
- Hồ bơi người lớn và trẻ em
- Công viên và hồ cảnh quan trung tâm
- Vườn dạo bộ, khu nghỉ chân ngoài trời
- Khu vui chơi trẻ em
- Khu thể thao đa năng ngoài trời
- Khu BBQ ngoài trời
- Trường mầm non nội khu
- Shophouse và minimart phục vụ nhu cầu hằng ngày
- Trạm sạc xe điện
- Hệ thống an ninh 24/7 và camera giám sát

---GALLERY---https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/mat-bang/tien-ich-k-home-city-view-2.jpg|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/mat-bang/tien-ich-k-home-city-view-3.jpg|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/mat-bang/tien-ich-k-home-city-view-6.jpg|Sơ đồ và hình ảnh tiện ích nội khu dự án K-Home CityView Hố Nai

## Tiện ích xanh có gì nổi bật?

K-Home CityView còn được phát triển theo định hướng công trình xanh **EDGE** và chất sống Singapore. Ngoài tiện ích sử dụng thông thường, dự án hướng đến tiết kiệm năng lượng, tiết kiệm nước và tăng hiệu quả vận hành không gian sống:

- Tiết kiệm tối thiểu **20% điện năng** tiêu thụ
- Tiết kiệm tối thiểu **20% nước sinh hoạt**
- Nhiều mảng xanh, cảnh quan mở và lối đi bộ thư giãn
- Tổ chức ánh sáng, gió và mặt thoáng tốt hơn

---GALLERY---https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/mat-bang/tien-ich-k-home-city-view-8.jpg|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/mat-bang/tien-ich-k-home-city-view-9.jpg|Tiện ích cảnh quan xanh và không gian cộng đồng nội khu K-Home CityView

## Mặt bằng này phù hợp ai?

K-Home CityView phù hợp với:

- Người lao động đang làm việc tại Biên Hòa và các KCN lân cận
- Gia đình trẻ cần căn hộ vừa túi tiền nhưng vẫn có tiện ích đầy đủ
- Người muốn mua nhà để ở lâu dài, không phải đầu tư lướt sóng
- Người có nhu cầu sống trong môi trường an ninh, cộng đồng cư dân rõ ràng

![Phối cảnh tổng thể khu dự án nhà ở xã hội K-Home CityView Biên Hòa từ trên cao](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/V32_TAN-HOA_EXT_AERIAL_2_FINAL_2)

## Kết luận

Mặt bằng K-Home CityView cho thấy dự án đang đi theo hướng một khu căn hộ NOXH quy mô lớn, quy hoạch tốt, loại căn đa dạng và tiện ích nội khu tương đối đầy đủ. Đây là điểm khác biệt quan trọng so với nhiều dự án nhà ở xã hội truyền thống vốn chỉ tập trung vào chức năng ở mà chưa chú trọng đến trải nghiệm sống.

Liên hệ **0937.587.438** để được tư vấn miễn phí về các loại căn, chính sách vay và tiến độ mở bán mới nhất.

---RELATED---danh-gia-du-an-k-home-cityview-bien-hoa-2026|Đánh giá chi tiết K-Home CityView Biên Hòa 2026;vi-tri-k-home-cityview-bien-hoa-noi-bat-so-voi-cac-du-an-noxh-khac|Vị trí K-Home CityView nổi bật so với các NOXH khác`,
  },
  {
    id: "5",
    slug: "vi-tri-k-home-cityview-bien-hoa-noi-bat-so-voi-cac-du-an-noxh-khac",
    title: "Vị Trí K-Home CityView Biên Hòa Có Gì Nổi Bật So Với Các Dự Án NOXH Khác?",
    date: "2026-07-31",
    excerpt: "Khám phá vị trí K-Home CityView Biên Hòa, lợi thế kết nối, tiện ích xung quanh, tiềm năng an cư và lý do dự án nổi bật giữa các NOXH tại Đồng Nai.",
    image: "https://res.cloudinary.com/dthv0nsq/image/upload/v1785323498/slide-k-home-cityview/slide-25.jpg",
    category: "Đánh giá dự án",
    content: `Khi chọn mua nhà ở xã hội (NOXH), vị trí thường là yếu tố được cân nhắc đầu tiên — vì nó ảnh hưởng trực tiếp đến mọi khía cạnh của cuộc sống hằng ngày. Bài viết này phân tích cụ thể vị trí K-Home CityView và lý do nó được đánh giá nổi bật so với nhiều dự án NOXH khác tại Biên Hòa.

![Ảnh aerial nhìn từ trên cao toàn khu dự án K-Home CityView Hố Nai Biên Hòa Đồng Nai](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/TAN-HOA_AERIAL_1_DRAFT-3_2-1)

## Vị trí K-Home CityView ở đâu?

K-Home CityView tọa lạc trên đường Điểu Xiển, thuộc phường Hố Nai, TP. Biên Hòa, Đồng Nai. Đây là một vị trí được đánh giá khá đặc biệt trong phân khúc NOXH vì nằm ngay khu vực đô thị đang phát triển, có mật độ dân cư cao và tiếp giáp nhiều tuyến đường quan trọng của thành phố.

So với nhiều dự án NOXH thường nằm xa trung tâm hoặc ở khu vực hạ tầng chưa hoàn chỉnh, K-Home CityView có lợi thế lớn khi nằm trong vùng đã hình thành cộng đồng dân cư, gần khu công nghiệp, gần tiện ích sẵn có và kết nối thuận lợi đến các trục giao thông chính. Đây là yếu tố quan trọng với người mua ở thật vì nó ảnh hưởng trực tiếp đến thời gian di chuyển, sinh hoạt hằng ngày và giá trị sống lâu dài.

![Phối cảnh mặt tiền đường Điểu Xiển nhìn vào dự án K-Home CityView Hố Nai](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/V09_TH_EXT_STREET-VIEW_FINAL_2)

## Vị trí này kết nối những khu vực nào?

Từ K-Home CityView, cư dân có thể di chuyển nhanh đến trung tâm Biên Hòa, tiếp cận các tuyến huyết mạch như Quốc lộ 1A, Nguyễn Ái Quốc, Võ Nguyên Giáp và các trục liên vùng khác của Đồng Nai.

Không chỉ dừng ở kết nối nội đô, vị trí còn thuận tiện cho việc đi làm tại các khu công nghiệp lớn xung quanh:

- **KCN Amata** — một trong những KCN lớn nhất Biên Hòa
- **KCN Hố Nai** — ngay khu vực lân cận dự án
- **KCN Long Bình & Biên Hòa 2** — kết nối nhanh qua các trục chính

Đây là điểm cộng rất lớn với nhóm khách hàng mục tiêu của NOXH: công nhân, kỹ sư, chuyên gia và nhân sự văn phòng đang làm việc tại khu vực Biên Hòa.

![Phối cảnh tổng thể dự án nhà ở xã hội K-Home CityView Biên Hòa nhìn từ trên cao](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/V32_TAN-HOA_EXT_AERIAL_2_FINAL_2)

## Điểm mạnh nhất của vị trí K-Home CityView là gì?

Điểm mạnh lớn nhất không chỉ là "gần trung tâm" mà là gần **đúng nơi người mua cần ở**. Với nhà ở xã hội, một vị trí tốt không nhất thiết phải nằm ở khu đất đắt đỏ nhất — mà phải giúp cư dân giảm chi phí đi lại, tiếp cận nơi làm việc nhanh và có đầy đủ dịch vụ thiết yếu xung quanh.

K-Home CityView đáp ứng khá rõ tiêu chí đó:

- Gần các khu công nghiệp lớn, thuận tiện cho người đi làm hằng ngày
- Gần chợ, siêu thị, trường học, bệnh viện và hệ thống dịch vụ dân sinh
- Nằm trong khu vực có nhu cầu ở thật cao, không phụ thuộc vào bài toán đầu tư ngắn hạn
- Có tiềm năng gia tăng giá trị theo quá trình đô thị hóa của Biên Hòa

---GALLERY---https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/V34_TAN-HOA_EXT_FACADE_FINAL_2|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/V07_TH_EXT_NOXH_KHOI-DE_FINAL_2-1|Phối cảnh mặt tiền và khối đế dự án K-Home CityView Biên Hòa

## So với các dự án NOXH khác tại Biên Hòa, K-Home CityView khác gì?

Nhiều dự án NOXH khác tại Biên Hòa thường có lợi thế về giá nhưng lại nằm xa trung tâm hơn, hoặc kết nối chưa thật sự thuận tiện với khu công nghiệp và các dịch vụ hiện hữu. K-Home CityView lại nằm trong vùng có sẵn hạ tầng, cộng đồng cư dân đông và hệ thống tiện ích đã hoạt động ổn định — nên người mua có thể "vào ở nhanh" hơn về mặt nhịp sống.

Ngoài ra, dự án được phát triển theo tiêu chuẩn sống hiện đại, quy mô **2,85 ha** với **4 block cao 22 tầng** và **1.382 căn hộ**, cho thấy đây không phải dự án NOXH nhỏ lẻ, mà là một khu căn hộ có quy hoạch bài bản hơn nhiều mô hình NOXH truyền thống.

![Không gian sân vườn cây xanh chuẩn Singapore tại dự án K-Home CityView Hố Nai](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/V10_TH_EXT_GARDEN_FINAL_2)

## Tiện ích xung quanh K-Home CityView có gì?

Từ dự án có thể tiếp cận nhanh các tiện ích thiết yếu đang hoạt động tại Biên Hòa:

- Trung tâm mua sắm: **Lotte Mart, GO! Đồng Nai**
- Bệnh viện: Bệnh viện Đồng Nai, các phòng khám khu vực Hố Nai
- Trường học: Nhiều trường tiểu học, THCS, THPT trong bán kính gần
- Chợ truyền thống và hệ thống dịch vụ dân sinh khu Hố Nai

Đối với người mua ở thật, điều này quan trọng hơn rất nhiều so với quảng bá hình ảnh đơn thuần. Một căn hộ NOXH tốt không chỉ là nơi "có chỗ ở", mà phải đảm bảo tiện cho con đi học, thuận cho cha mẹ đi làm và đủ hạ tầng để sinh sống lâu dài.

---GALLERY---https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/V36_TAN-HOA_EXT_NOXH_PARK_FINAL_2|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/V08_TH_EXT_NOTM_SAN-VUON_FINAL_2|Công viên và sân vườn xanh nội khu tại K-Home CityView Biên Hòa

## Vị trí ảnh hưởng thế nào đến khả năng ở thật?

Khi mua để ở thật, vị trí là yếu tố quyết định gần như đầu tiên. Một dự án ở xa nơi làm việc quá nhiều sẽ khiến chi phí xăng xe, thời gian di chuyển và áp lực sinh hoạt tăng lên mỗi ngày. Ngược lại, dự án gần khu công nghiệp và trung tâm dân cư như K-Home CityView giúp gia đình tiết kiệm đáng kể thời gian và chi phí dài hạn.

Với những gia đình trẻ hoặc người lao động đang sống thuê trọ, đây là lợi thế rất thực tế. Thay vì tiếp tục trả tiền thuê hằng tháng mà không tích lũy được tài sản, họ có thể chuyển sang phương án sở hữu căn hộ với lịch thanh toán phù hợp hơn, trong khi vẫn giữ được sự thuận tiện trong cuộc sống.

## Ai sẽ phù hợp nhất với vị trí này?

K-Home CityView đặc biệt phù hợp với:

- Người làm việc tại các KCN Amata, Hố Nai, Long Bình, Biên Hòa 2
- Gia đình trẻ cần nhà gần trung tâm để ổn định cuộc sống
- Người muốn con cái có điều kiện học tập, sinh hoạt thuận tiện
- Khách hàng ưu tiên ở thật hơn là đầu tư ngắn hạn

---GALLERY---https://res.cloudinary.com/dthv0nsq/image/upload/v1785255559/k-home-cityview/mat-bang/tien-ich-k-home-city-view-9.jpg|https://res.cloudinary.com/dthv0nsq/image/upload/v1785230269/k-home-cityview/260323_TAN-HOA_BALCONY_FINAL_2-1.jpg|Khu vui chơi trẻ em và ban công view thoáng tại K-Home CityView Hố Nai Biên Hòa

## Kết luận

Điểm nổi bật lớn nhất của K-Home CityView so với nhiều dự án NOXH khác tại Biên Hòa là vị trí nằm gần trung tâm, gần khu công nghiệp, gần tiện ích hiện hữu và phù hợp nhu cầu ở thật. Trong bối cảnh Biên Hòa tiếp tục phát triển mạnh về công nghiệp và đô thị, những dự án có vị trí như K-Home CityView thường được ưu tiên bởi người mua có nhu cầu sinh sống lâu dài.

Liên hệ **0937.587.438** để được tư vấn miễn phí về hồ sơ, tiến độ và chính sách mua nhà tại K-Home CityView.

---RELATED---k-home-cityview-la-gi-co-nen-mua-o-that-tai-bien-hoa-2026-khong|K-Home CityView là gì? Có nên mua ở thật tại Biên Hòa 2026;danh-gia-du-an-k-home-cityview-bien-hoa-2026|Đánh giá chi tiết K-Home CityView Biên Hòa 2026`,
  },
  {
    id: "4",
    slug: "k-home-cityview-la-gi-co-nen-mua-o-that-tai-bien-hoa-2026-khong",
    title: "K-Home CityView Là Gì? Có Nên Mua Ở Thật Tại Biên Hòa Năm 2026 Không?",
    date: "2026-07-30",
    excerpt: "Tìm hiểu K-Home CityView là gì, vị trí ở đâu, quy mô ra sao, giá bán, tiện ích và lý do dự án được quan tâm tại Biên Hòa năm 2026.",
    image: "https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/slide-k-home-cityview/SLIDE-PRESENT-KHOME-CITYVIEW--21-06-2026-hình-ảnh-21",
    category: "Đánh giá dự án",
    content: `Nếu bạn đang tìm kiếm nhà ở tại Biên Hòa và gặp tên K-Home CityView, rất có thể bạn đang muốn biết đây là dự án gì, phù hợp với ai và có đáng để cân nhắc mua ở thật hay không. Bài viết này tổng hợp những thông tin thiết yếu nhất để bạn có cái nhìn rõ ràng trước khi quyết định.

![Phối cảnh tổng thể dự án nhà ở xã hội K-Home CityView Biên Hòa Đồng Nai 2026](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/slide-k-home-cityview/SLIDE-PRESENT-KHOME-CITYVIEW--21-06-2026-hình-ảnh-18)

## K-Home CityView là gì?

K-Home CityView là dự án nhà ở xã hội theo định hướng tiêu chuẩn sống hiện đại do Kim Oanh Land phát triển tại trung tâm Biên Hòa, Đồng Nai. Dự án tọa lạc trên đường Điểu Xiển, thuộc khu vực Hố Nai — một vị trí khá thuận lợi khi kết nối đến các trục giao thông quan trọng, khu công nghiệp, tiện ích dân sinh và trung tâm thành phố.

Điểm đáng chú ý của K-Home CityView nằm ở cách phát triển khác biệt so với hình dung truyền thống về nhà ở xã hội. Dự án không chỉ hướng đến nhu cầu an cư với mức chi phí dễ tiếp cận, mà còn được triển khai theo định hướng không gian sống xanh, tiện ích đồng bộ và tiêu chuẩn xây dựng hiện đại — trong đó có tiêu chuẩn xanh EDGE giúp tiết kiệm năng lượng, nước và giảm phát thải vật liệu.

**Thông tin tổng quan:**
- **Chủ đầu tư:** Công ty CP Đầu tư & Phát triển BĐS Miền Đông (thành viên Kim Oanh Group)
- **Đơn vị thiết kế:** Tập đoàn Surbana Jurong (Singapore)
- **Vị trí:** Đường Điểu Xiển, phường Hố Nai, TP. Biên Hòa, tỉnh Đồng Nai
- **Quy mô:** 2,85 ha — 4 tòa tháp 22 tầng — 1.382 căn (1.352 NOXH + 30 shophouse)
- **Pháp lý:** Sổ hồng riêng từng căn

![Phối cảnh mặt tiền 4 tòa tháp dự án K-Home CityView Hố Nai Biên Hòa](https://res.cloudinary.com/dthv0nsq/image/upload/v1785315453/news/news-6.jpg)

## Vì sao K-Home CityView được quan tâm?

Sự quan tâm dành cho K-Home CityView đến từ nhiều yếu tố cùng lúc. Trước hết, dự án nằm ngay Biên Hòa — khu vực có mật độ dân cư cao, nhu cầu nhà ở thật lớn, đặc biệt là nhóm người lao động, gia đình trẻ, kỹ sư và chuyên gia đang làm việc tại các khu công nghiệp lân cận.

Sự kiện giới thiệu dự án vào ngày **21/06/2026** đã thu hút hơn **1.200 khách hàng** tham dự, cho thấy mức độ quan tâm thực tế của thị trường. Ngoài ra, mức vốn ban đầu từ khoảng **200 triệu đồng**, cộng với khả năng vay ưu đãi qua Ngân hàng Chính sách Xã hội (lãi suất 5,4%/năm, đến 25 năm), giúp giảm áp lực tài chính đáng kể cho người mua ở thật.

![Không gian sân vườn và khu BBQ ngoài trời tại dự án K-Home CityView Biên Hòa](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/V02_TAN-HOA_EXT_BBQ-GARDEN_FN_2-1)

## Vị trí K-Home CityView có gì đặc biệt?

K-Home CityView nằm trên trục đường Điểu Xiển, thuộc khu đô thị đang phát triển của Biên Hòa. Từ dự án, cư dân kết nối thuận tiện đến Quốc lộ 1A, Nguyễn Ái Quốc, Võ Nguyên Giáp và các khu vực lân cận của TP. Biên Hòa.

Lợi thế lớn của vị trí này là:
- Gần khu dân cư đông, tiện ích xã hội (chợ, trường, bệnh viện, Lotte Mart, GO!)
- Gần các KCN trọng điểm: **KCN Amata, KCN Hố Nai, KCN Biên Hòa 2**
- Nhu cầu nhà ở thật rất cao — giúp tiết kiệm thời gian di chuyển và ổn định nhịp sống

![Phối cảnh góc nhìn từ đường Điểu Xiển vào dự án K-Home CityView Hố Nai](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/V09_TH_EXT_STREET-VIEW_FINAL_2)

## Thiết kế và tiêu chuẩn sống tại dự án

K-Home CityView được phát triển theo tiêu chuẩn sống xanh **EDGE** (Excellence in Design for Greater Efficiencies), đồng thời hướng đến giải pháp tiết kiệm năng lượng và tối ưu vật liệu thân thiện với môi trường. Cụ thể:

- Tiết kiệm tối thiểu **20% điện năng** tiêu thụ
- Tiết kiệm tối thiểu **20% nước sinh hoạt**
- Giảm **20% khí thải carbon** trong vật liệu xây dựng

Dự án có đa dạng loại căn từ **1 đến 3 phòng ngủ** (47,3 m² – 85 m²), phù hợp với người độc thân, cặp vợ chồng trẻ hoặc gia đình nhiều thế hệ.

---GALLERY---https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/V12_TH_EXT_NOXH_POOL_2|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/V11_TH_EXT_NOTM_POOL_2|Hồ bơi người lớn và khu thư giãn ngoài trời tại K-Home CityView Biên Hòa

![Khu vui chơi trẻ em ngoài trời tại dự án nhà ở xã hội K-Home CityView](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/V03_TAN-HOA_EXT_NOXH_KID-PLAYGROUND_FINAL_2-1)

## Có nên mua ở thật tại Biên Hòa năm 2026 không?

Nếu bạn đang tìm một nơi an cư lâu dài, K-Home CityView là dự án đáng cân nhắc — đặc biệt khi tiêu chí của bạn là vị trí trung tâm, nhu cầu ở thật, tài chính vừa tầm và mong muốn sống trong môi trường có quy hoạch rõ ràng.

Tuy nhiên, việc có nên mua hay không còn phụ thuộc vào 3 yếu tố:

1. **Nhu cầu ở thật hay đầu tư** — NOXH có hạn chế giao dịch trong 5 năm đầu, không phù hợp nếu mục đích là lướt sóng.
2. **Khả năng đáp ứng điều kiện hồ sơ** — cần kiểm tra thu nhập, tình trạng nhà ở hiện tại và hợp đồng lao động.
3. **Kế hoạch tài chính dài hạn 5–25 năm** — trả góp ổn định là yếu tố quan trọng.

Nếu bạn mua để ở thật, dự án này phù hợp hơn so với các sản phẩm đầu tư thuần túy vì điểm mạnh nằm ở công năng sử dụng, sự tiện lợi trong sinh hoạt hằng ngày và chi phí sở hữu tương đối dễ tiếp cận.

![Mặt bằng tổng thể các loại căn hộ 1PN 2PN 3PN tại dự án K-Home CityView Hố Nai](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/thiet-ke-can-ho-layout-khome-city-view-2048x764)

## Ai nên mua K-Home CityView?

K-Home CityView phù hợp với các nhóm sau:

- Người lao động đang làm việc tại Biên Hòa, Hố Nai, KCN Amata, Long Bình.
- Gia đình trẻ muốn có chỗ ở ổn định với chi phí ban đầu vừa phải.
- Người muốn mua nhà ở xã hội nhưng vẫn ưu tiên môi trường sống xanh và tiện ích đầy đủ.
- Những người muốn an cư lâu dài thay vì tiếp tục thuê nhà nhiều năm.

Nếu bạn mua để lướt sóng hoặc kỳ vọng lợi nhuận ngắn hạn, NOXH thường không phải lựa chọn tối ưu. Nhưng nếu mục tiêu là ổn định cuộc sống và tích lũy tài sản, dự án này khá phù hợp.

---GALLERY---https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/260328_TAN-HOA_V05_FINAL_2-1|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/k-home-cityview/260328_TAN-HOA_V06_FINAL_2-1|Phối cảnh khu vườn cây xanh và không gian cộng đồng tại K-Home CityView Biên Hòa

## Kết luận

K-Home CityView là một trong những dự án nhà ở xã hội đáng chú ý nhất tại Biên Hòa năm 2026, nhờ vị trí trung tâm, quy mô lớn, mức vốn ban đầu dễ tiếp cận và định hướng phát triển theo tiêu chuẩn sống xanh. Với những ai đang tìm nhà để ở thật, đây là dự án rất nên theo dõi kỹ về điều kiện hồ sơ, tiến độ và chính sách bán hàng.

Liên hệ **0937.587.438** để được tư vấn miễn phí về hồ sơ và chính sách mua nhà.

---RELATED---danh-gia-du-an-k-home-cityview-bien-hoa-2026|Đánh giá chi tiết K-Home CityView Biên Hòa 2026;dieu-kien-mua-nha-o-xa-hoi-dong-nai-2026|Điều kiện mua nhà ở xã hội Đồng Nai 2026`,
  },
  {
    id: "3",
    slug: "ly-do-chon-k-home-thay-vi-nha-o-xa-hoi-thong-thuong",
    title: "Lý Do Nên Chọn K-Home Thay Vì Nhà Ở Xã Hội Thông Thường",
    date: "2026-07-29",
    excerpt: "So sánh thực tế chuỗi dự án K-Home (CityView, Avenue, Midtown) với nhà ở xã hội thông thường: thiết kế Singapore, chứng chỉ xanh EDGE, tiện ích khép kín và vị trí chiến lược gần KCN Đồng Nai.",
    image: "https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news3/1",
    category: "So sánh & Tư vấn",
    content: `Nhà ở xã hội (NOXH) ngày càng phổ biến tại Đồng Nai, giúp nhiều công nhân và người thu nhập thấp có cơ hội an cư. Tuy nhiên, không phải dự án NOXH nào cũng giống nhau. Chuỗi dự án K-Home do Kim Oanh Land phát triển đang được nhiều người quan tâm vì mang đến tiêu chuẩn cao hơn so với phần lớn nhà ở xã hội thông thường hiện nay.

![Phối cảnh tổng thể dự án nhà ở xã hội K-Home chuẩn Singapore Đồng Nai](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news3/1)

## 1. Thiết kế bởi đơn vị Singapore – Không gian sống tối ưu hơn

Hầu hết dự án NOXH thông thường được thiết kế theo tiêu chuẩn tối thiểu của Việt Nam. Trong khi đó, các dự án K-Home được tư vấn thiết kế bởi **Tập đoàn Surbana Jurong (Singapore)** – đơn vị có kinh nghiệm phát triển nhà ở xã hội và đô thị tại nhiều quốc gia.

Điều này thể hiện rõ ở:

- Bố trí căn hộ thông minh, tận dụng tối đa ánh sáng và gió tự nhiên.
- Diện tích sử dụng hợp lý, hạn chế lãng phí không gian.
- Ban công và cửa sổ lớn giúp căn hộ luôn thông thoáng.

---GALLERY---https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news3/2-1|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news3/2-2|Thiết kế căn hộ K-Home chuẩn Singapore tối ưu ánh sáng và thông gió tự nhiên

## 2. Áp dụng chứng chỉ công trình xanh EDGE – Tiết kiệm điện nước thực tế

Đây là điểm khác biệt lớn nhất. Nhiều dự án NOXH thông thường chưa đạt chứng chỉ xanh quốc tế. Các dự án K-Home được phát triển theo tiêu chuẩn công trình xanh EDGE.

Theo công bố, thiết kế đạt chuẩn EDGE giúp:

- Tiết kiệm tối thiểu **20% điện năng**
- Tiết kiệm tối thiểu **20% lượng nước sinh hoạt**
- Giảm **20% khí thải carbon** trong vật liệu xây dựng

Lợi ích lâu dài: chi phí sinh hoạt hàng tháng thấp hơn so với căn hộ thông thường cùng diện tích.

![Công trình xanh EDGE tại chuỗi dự án nhà ở xã hội K-Home Đồng Nai tiết kiệm điện nước](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news3/3)

## 3. Hệ tiện ích "All-in-one" đầy đủ hơn nhiều dự án NOXH cơ bản

Nhà ở xã hội thông thường thường chỉ đáp ứng nhu cầu ở tối thiểu. Chuỗi K-Home đầu tư hệ tiện ích nội khu khá hoàn chỉnh:

- Hồ bơi (khu người lớn và trẻ em)
- Trường mầm non nội khu
- Công viên cây xanh, khu vui chơi trẻ em
- Khu BBQ, sân thể thao đa năng
- Trạm sạc xe điện ô tô và xe máy
- Minimart, quán café, nhà sinh hoạt cộng đồng

---GALLERY---https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news3/4-1|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news3/4-2|Hệ tiện ích hồ bơi công viên trường mầm non tại dự án K-Home Đồng Nai

## 4. Vị trí chiến lược gần các khu công nghiệp lớn

Các dự án K-Home được đặt tại những vị trí có nhu cầu nhà ở thực cao:

- **K-Home CityView:** Đường Điểu Xiển, phường Hố Nai – gần KCN Amata, Biên Hòa 2, Long Bình
- **K-Home Avenue:** Nhơn Trạch – kết nối thuận tiện với sân bay Long Thành và các KCN khu vực
- **K-Home Midtown:** Trung tâm Trảng Bom – gần KCN Bàu Xéo và tiện ích hiện hữu

![Vị trí các dự án K-Home gần khu công nghiệp Đồng Nai](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news3/5)

## 5. Chính sách tài chính rõ ràng và hỗ trợ vay ưu đãi

Người mua K-Home được tiếp cận chính sách vay từ **Ngân hàng Chính sách xã hội** với lãi suất ưu đãi **5,4%/năm**, thời hạn lên đến 25 năm, vay tối đa khoảng 75–80% giá trị căn hộ.

Kết hợp với mức giá được cơ quan nhà nước phê duyệt, số vốn ban đầu cần chuẩn bị thường chỉ từ khoảng **200 triệu đồng trở lên** tùy căn, giúp nhiều người lao động tiếp cận được.

![Chính sách vay ưu đãi lãi suất 5,4% tại dự án K-Home từ Ngân hàng Chính sách xã hội](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news3/7)

## 6. Thương hiệu và cam kết chất lượng từ chủ đầu tư

Kim Oanh Land đang phát triển chuỗi K-Home theo định hướng dài hạn (mục tiêu hàng chục nghìn căn đến năm 2028). Việc duy trì thương hiệu giúp khách hàng yên tâm hơn về tiến độ, chất lượng bàn giao và vận hành sau này.

![Cam kết chất lượng từ chủ đầu tư Kim Oanh Land phát triển chuỗi dự án K-Home](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news3/8)

## Kết luận

Nhà ở xã hội thông thường giải quyết được nhu cầu "có chỗ ở". Chuỗi K-Home hướng đến việc mang lại không gian sống có chất lượng cao hơn trong phân khúc giá NOXH: thiết kế chuẩn Singapore, tiết kiệm điện nước nhờ EDGE, tiện ích đầy đủ và vị trí thuận tiện.

![Căn hộ mẫu K-Home sẵn sàng đón khách tham quan](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news3/6)

**Xem chi tiết từng dự án:**

---PROJECT-LINK---k-home-cityview-ho-nai|K-Home CityView Hố Nai
---PROJECT-LINK---k-home-avenue-nhon-trach|K-Home Avenue Nhơn Trạch
---PROJECT-LINK---k-home-midtown-trang-bom|K-Home Midtown Trảng Bom

Hoặc liên hệ **0937.587.438** để được tư vấn miễn phí về điều kiện và hồ sơ mua NOXH.

---RELATED---dieu-kien-mua-nha-o-xa-hoi-dong-nai-2026|Điều kiện mua nhà ở xã hội Đồng Nai 2026;danh-gia-du-an-k-home-cityview-bien-hoa-2026|Đánh giá dự án K-Home CityView Biên Hòa 2026`,
  },
  {
    id: "4",
    slug: "gia-ban-k-home-cityview-2026-can-bao-nhieu-tien",
    title: "Giá Bán K-Home CityView 2026: Cần Bao Nhiêu Tiền Để Sở Hữu Căn Hộ?",
    date: "2026-07-30",
    excerpt: "Cập nhật giá bán K-Home CityView 2026 mới nhất. Giá bình quân bao nhiêu/m²? Cần chuẩn bị bao nhiêu vốn ban đầu để sở hữu căn hộ nhà ở xã hội tại Hố Nai – Biên Hòa?",
    image: "https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news7/1",
    category: "Đánh giá dự án",
    content: `Một trong những câu hỏi được tìm kiếm nhiều nhất về dự án K-Home CityView chính là: "Giá bán bao nhiêu?" và "Cần bao nhiêu tiền để sở hữu?". Dưới đây là thông tin tổng hợp dựa trên các số liệu công bố đến giữa năm 2026.

![Phối cảnh dự án K-Home CityView Biên Hòa 2026](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news7/1)

## 1. Giá bán chính thức theo công bố

Theo Quyết định số 27/2026/QĐ-MĐC ngày 04/6/2026 của chủ đầu tư, giá bán bình quân nhà ở xã hội tại dự án được phê duyệt là:

**25.605.000 đồng/m² diện tích sử dụng (thông thủy)**, đã bao gồm thuế VAT.

Đây là mức giá bình quân. Giá thực tế của từng căn sẽ được điều chỉnh theo hệ số tầng, hướng, vị trí căn theo quy định.

![Giá bán bình quân K-Home CityView 25.6 triệu đồng/m2](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news7/2)

## 2. Ước tính giá theo loại căn hộ (tham khảo)

Diện tích căn hộ tại K-Home CityView từ khoảng 47 m², 62 m², 70 m² và 84 m² (thông thủy).

Mức giá tham khảo thường được nêu trên thị trường:

- Căn hộ 1 phòng ngủ (~47 m²): từ khoảng **1 – 1,1 tỷ đồng**
- Căn hộ 1PN+ (~62 m²): từ khoảng **1,3 – 1,5 tỷ đồng**
- Căn hộ 2 phòng ngủ (~70 m²): từ khoảng **1,5 – 1,7 tỷ đồng**
- Căn hộ 3 phòng ngủ (~84 m²): từ khoảng **1,8 – 2,1 tỷ đồng**

![Bảng giá tham khảo căn hộ K-Home CityView 2026](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news7/3)

## 3. Cần bao nhiêu tiền để sở hữu? (Vốn ban đầu)

Với chính sách hỗ trợ vay từ Ngân hàng Chính sách xã hội:

- Lãi suất ưu đãi hiện nay khoảng **5,4%/năm**
- Thời hạn vay lên đến **25 năm**
- Hạn mức vay thường lên đến **75–80%** giá trị căn hộ

Vốn tự có ban đầu cần chuẩn bị khoảng **20–25% giá trị căn hộ**, tương đương từ khoảng **200 triệu đồng** trở lên tùy loại căn.

**Ví dụ minh họa:**
- Căn khoảng 1,1 tỷ → vốn ban đầu khoảng 220–275 triệu
- Căn khoảng 1,5 tỷ → vốn ban đầu khoảng 300–375 triệu

![Vốn ban đầu sở hữu căn hộ K-Home CityView từ 200 triệu](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news7/4)

## 4. Các khoản chi phí cần lưu ý thêm

Ngoài giá căn hộ, người mua cần dự trù:

- Phí bảo trì (thường 2%)
- Chi phí làm sổ hồng
- Phí quản lý vận hành sau bàn giao
- Chi phí nội thất phát sinh (nếu muốn nâng cấp thêm)

## 5. Lời khuyên trước khi quyết định

Giá nhà ở xã hội được cơ quan nhà nước phê duyệt và kiểm soát, nên tính minh bạch cao hơn so với nhà ở thương mại. Tuy nhiên, giá cuối cùng vẫn phụ thuộc vào diện tích thông thủy thực tế, tầng và hướng căn, thời điểm mở bán chính thức.

---GALLERY---https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news7/5-1|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news7/5-2|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news7/5-3|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news7/5-4|Căn hộ mẫu K-Home CityView sẵn sàng tư vấn giá

## Kết luận

Với mức giá bình quân khoảng 25,6 triệu đồng/m² và chính sách vay ưu đãi, K-Home CityView là một trong những lựa chọn nhà ở xã hội có khả năng tiếp cận tốt tại khu vực Hố Nai – Biên Hòa năm 2026.

**Xem chi tiết dự án:**

---PROJECT-LINK---k-home-cityview-ho-nai|K-Home CityView Hố Nai – Xem giá & sản phẩm chi tiết

Liên hệ **0937.587.438** để nhận bảng giá chi tiết và được tư vấn phương án tài chính phù hợp.

---RELATED---danh-gia-du-an-k-home-cityview-bien-hoa-2026|Đánh giá dự án K-Home CityView Biên Hòa 2026;dieu-kien-mua-nha-o-xa-hoi-dong-nai-2026|Điều kiện mua nhà ở xã hội Đồng Nai 2026`,
  },
  {
    id: "5",
    slug: "k-home-cityview-co-phu-hop-voi-gia-dinh-tre-khong",
    title: "K-Home CityView Có Phù Hợp Với Gia Đình Trẻ Đang Tìm Nhà Ở Thật Không?",
    date: "2026-07-30",
    excerpt: "Đánh giá khách quan về diện tích, tiện ích, vị trí, tài chính và chất lượng sống tại K-Home CityView — dự án nhà ở xã hội Hố Nai – Biên Hòa có phù hợp với gia đình trẻ tìm nhà ở thật không?",
    image: "https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news8/1",
    category: "Đánh giá dự án",
    content: `Nhiều gia đình trẻ hiện nay đang tìm kiếm một căn hộ để ở thật, không phải để đầu cơ. Họ cần không gian vừa đủ, tiện ích phục vụ cuộc sống hàng ngày, vị trí thuận tiện đi làm và mức giá có thể tiếp cận được bằng lương.

Vậy dự án nhà ở xã hội K-Home CityView (đường Điểu Xiển, phường Hố Nai, Biên Hòa) có đáp ứng được nhu cầu này không?

![K-Home CityView có phù hợp với gia đình trẻ không](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news8/1)

## 1. Diện tích và thiết kế phù hợp với gia đình trẻ

K-Home CityView cung cấp các loại căn hộ từ 1 đến 3 phòng ngủ, diện tích thông thủy khoảng 47 m², 62 m², 70 m² và 84 m²:

- **Căn 1PN hoặc 1PN+:** Phù hợp vợ chồng mới cưới hoặc gia đình có 1 con nhỏ.
- **Căn 2PN:** Phù hợp gia đình 3–4 người.
- **Căn 3PN:** Dành cho gia đình đông thành viên hơn.

Thiết kế được tư vấn bởi Surbana Jurong (Singapore), chú trọng tối ưu ánh sáng tự nhiên và thông gió.

![Layout căn hộ 2 phòng ngủ K-Home CityView phù hợp gia đình trẻ](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news8/2)

## 2. Tiện ích hỗ trợ cuộc sống gia đình có con nhỏ

Đây là điểm cộng rõ rệt nếu bạn là gia đình trẻ:

- Hồ bơi phân khu người lớn và trẻ em
- Trường mầm non nội khu
- Công viên, khu vui chơi trẻ em
- Khu thể thao, BBQ
- Trạm sạc xe điện

---GALLERY---https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news8/3-1|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news8/3-2|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news8/3|Tiện ích trường mầm non hồ bơi khu vui chơi tại K-Home CityView

## 3. Vị trí thuận tiện cho người đi làm

Dự án nằm tại phường Hố Nai, gần nhiều khu công nghiệp lớn như Amata, Biên Hòa 2, Long Bình. Đây là lợi thế với các gia đình trẻ đang làm việc tại các khu công nghiệp Đồng Nai.

![Vị trí K-Home CityView gần khu công nghiệp thuận tiện đi làm](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news8/4)

## 4. Khả năng tài chính phù hợp với người có thu nhập trung bình

Là dự án nhà ở xã hội, giá bán được cơ quan nhà nước phê duyệt (mức bình quân khoảng **25,6 triệu đồng/m²** thông thủy). Kết hợp với chính sách vay ưu đãi từ Ngân hàng Chính sách xã hội:

- Lãi suất khoảng **5,4%/năm**, thời hạn đến **25 năm**
- Vay đến **75–80%** giá trị căn hộ
- Vốn ban đầu chỉ từ khoảng **200 triệu đồng** trở lên tùy loại căn

![Vốn ban đầu sở hữu căn hộ K-Home CityView phù hợp gia đình trẻ](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news8/5)

## 5. Những điểm cần cân nhắc

Dù có nhiều ưu điểm, gia đình trẻ vẫn nên lưu ý:

- Có quy định về đối tượng, điều kiện thu nhập và hạn chế chuyển nhượng theo luật NOXH.
- Tiến độ bàn giao dự kiến cuối 2027 – đầu 2028, chưa phù hợp nếu cần nhà ở ngay.
- Nội thất bàn giao ở mức cơ bản, có thể cần đầu tư thêm nếu muốn nâng cấp.

## Kết luận

K-Home CityView phù hợp với nhiều gia đình trẻ đang tìm nhà ở thật, đặc biệt là những gia đình có thu nhập thuộc diện mua NOXH, đang làm việc gần khu công nghiệp khu vực Hố Nai – Biên Hòa, cần tiện ích cho con nhỏ và muốn sở hữu nhà với vốn ban đầu không quá lớn.

![Căn hộ mẫu K-Home CityView dành cho gia đình trẻ](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news8/6)

**Xem chi tiết dự án:**

---PROJECT-LINK---k-home-cityview-ho-nai|K-Home CityView Hố Nai – Xem căn hộ phù hợp gia đình

Bạn đang là gia đình trẻ và quan tâm dự án này? Liên hệ **0937.587.438** để được tư vấn cụ thể về loại căn và điều kiện hồ sơ.

---RELATED---gia-ban-k-home-cityview-2026-can-bao-nhieu-tien|Giá bán K-Home CityView 2026;danh-gia-du-an-k-home-cityview-bien-hoa-2026|Đánh giá dự án K-Home CityView Biên Hòa`,
  },
  {
    id: "6",
    slug: "k-home-cityview-tieu-chuan-song-xanh-edge",
    title: "K-Home CityView Và Tiêu Chuẩn Sống Xanh EDGE Có Gì Khác Biệt?",
    date: "2026-07-31",
    excerpt: "K-Home CityView áp dụng tiêu chuẩn sống xanh EDGE như thế nào? Tìm hiểu EDGE là gì, lợi ích thực tế về tiết kiệm điện, nước và sự khác biệt so với nhà ở xã hội thông thường.",
    image: "https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news9/1",
    category: "Đánh giá dự án",
    content: `Nhiều người khi tìm hiểu dự án K-Home CityView thường nghe đến cụm từ "tiêu chuẩn xanh EDGE" hoặc "công trình xanh EDGE". Vậy EDGE là gì? Và việc áp dụng tiêu chuẩn này mang lại sự khác biệt như thế nào so với các dự án nhà ở xã hội thông thường?

![K-Home CityView và tiêu chuẩn sống xanh EDGE có gì khác biệt](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news9/1)

## 1. EDGE là gì?

EDGE (Excellence in Design for Greater Efficiencies) là hệ thống chứng nhận công trình xanh do **International Finance Corporation (IFC)** – thành viên của Nhóm Ngân hàng Thế giới – phát triển.

EDGE tập trung vào ba yếu tố cốt lõi:

- Tiết kiệm năng lượng (điện)
- Tiết kiệm nước
- Giảm năng lượng hàm chứa trong vật liệu xây dựng

Mức tối thiểu để đạt EDGE Certified là tiết kiệm ít nhất **20%** ở cả ba hạng mục so với mức tiêu thụ thông thường.

![Chứng nhận công trình xanh EDGE là gì tiết kiệm 20% điện nước](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news9/2)

## 2. K-Home CityView áp dụng EDGE như thế nào?

Theo công bố của chủ đầu tư Kim Oanh Land, dự án K-Home CityView được phát triển theo tiêu chuẩn công trình xanh EDGE, kết hợp với đơn vị tư vấn thiết kế Surbana Jurong (Singapore).

Các giải pháp được áp dụng:

- Thiết kế tối ưu hướng nắng, hướng gió để tận dụng ánh sáng và thông gió tự nhiên
- Sử dụng vật liệu và thiết bị tiết kiệm điện, nước
- Giảm lãng phí tài nguyên trong quá trình xây dựng và vận hành

![Thiết kế K-Home CityView theo tiêu chuẩn xanh EDGE](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news9/3)

## 3. Sự khác biệt so với nhà ở xã hội thông thường

| Tiêu chí | NOXH thông thường | K-Home CityView (chuẩn EDGE) |
|---|---|---|
| Tiết kiệm điện | Thiết kế cơ bản | Hướng tới ≥ 20% |
| Tiết kiệm nước | Thiết kế cơ bản | Hướng tới ≥ 20% |
| Vật liệu xây dựng | Tiêu chuẩn thông thường | Giảm năng lượng hàm chứa ≥ 20% |
| Thiết kế không gian | Tối ưu công năng cơ bản | Tối ưu ánh sáng + gió tự nhiên |
| Chi phí vận hành | Trung bình | Thấp hơn nhờ tiết kiệm điện nước |

![So sánh nhà ở xã hội thông thường và K-Home CityView chuẩn EDGE](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news9/4)

## 4. Lợi ích thực tế đối với cư dân K-Home CityView

- **Tiết kiệm chi phí hàng tháng:** Hóa đơn điện và nước thấp hơn giúp gia đình cân đối tài chính tốt hơn.
- **Không gian sống thoáng đãng hơn:** Thiết kế tận dụng ánh sáng và gió tự nhiên giúp ít phải dùng đèn và máy lạnh vào ban ngày.
- **Môi trường sống bền vững hơn:** Giảm tác động đến môi trường ngay từ giai đoạn xây dựng.
- **Giá trị dài hạn:** Công trình xanh ngày càng được thị trường đánh giá cao hơn.

---GALLERY---https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news9/5-1|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news9/5-2|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news9/5-3|Lợi ích tiết kiệm điện nước khi sống tại K-Home CityView chuẩn EDGE

## Kết luận

Việc K-Home CityView áp dụng tiêu chuẩn sống xanh EDGE tạo ra sự khác biệt rõ rệt so với nhiều dự án nhà ở xã hội chỉ đáp ứng tiêu chuẩn kỹ thuật tối thiểu. Điểm mạnh không chỉ nằm ở thiết kế đẹp hơn, mà còn ở khả năng tiết kiệm chi phí vận hành và mang lại không gian sống thoáng đãng, bền vững hơn.

![Không gian sống xanh tại dự án K-Home CityView đạt chuẩn EDGE](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news9/6)

**Xem chi tiết dự án:**

---PROJECT-LINK---k-home-cityview-ho-nai|K-Home CityView Hố Nai – Trải nghiệm tiêu chuẩn xanh EDGE

Bạn muốn tìm hiểu thêm về cách thiết kế EDGE ảnh hưởng đến từng loại căn hộ cụ thể? Liên hệ **0937.587.438** để được tư vấn chi tiết.

---RELATED---danh-gia-du-an-k-home-cityview-bien-hoa-2026|Đánh giá dự án K-Home CityView Biên Hòa;ly-do-chon-k-home-thay-vi-nha-o-xa-hoi-thong-thuong|Lý do nên chọn K-Home thay vì NOXH thông thường`,
  },
  {
    id: "7",
    slug: "vi-sao-k-home-cityview-thu-hut-su-quan-tam-lon",
    title: "Vì Sao K-Home CityView Thu Hút Sự Quan Tâm Lớn Từ Khách Hàng?",
    date: "2026-07-31",
    excerpt: "Vì sao dự án K-Home CityView tại Hố Nai – Biên Hòa thu hút đông đảo khách hàng quan tâm? Phân tích các lý do thực tế về vị trí, thiết kế, tiện ích, giá và chính sách tài chính năm 2026.",
    image: "https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news10/1",
    category: "Đánh giá dự án",
    content: `Dự án nhà ở xã hội K-Home CityView từ khi xuất hiện thông tin đã nhận được sự quan tâm đáng kể từ người mua nhà, đặc biệt là công nhân, người lao động và gia đình trẻ tại Đồng Nai. Vậy điều gì tạo nên sức hút này?

![Vì sao K-Home CityView thu hút đông khách hàng quan tâm](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news10/1)

## 1. Vị trí gần nhiều khu công nghiệp lớn

K-Home CityView nằm tại khu vực Hố Nai – nơi tập trung nhiều khu công nghiệp quan trọng như Amata, Biên Hòa 2, Long Bình. Đây là lợi thế lớn với người lao động đang làm việc tại các KCN, giúp giảm thời gian và chi phí đi lại hàng ngày.

![Vị trí K-Home CityView gần khu công nghiệp Amata Biên Hòa](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news10/2)

## 2. Thiết kế chuẩn Singapore và tiêu chuẩn xanh EDGE

Dự án được tư vấn thiết kế bởi Surbana Jurong (Singapore) và phát triển theo tiêu chuẩn công trình xanh EDGE. Khác với nhiều dự án NOXH chỉ đáp ứng tiêu chuẩn tối thiểu, K-Home CityView chú trọng tối ưu ánh sáng, thông gió và tiết kiệm điện nước.

---GALLERY---https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news10/3-1|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news10/3-2|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news10/3-3|Thiết kế chuẩn Singapore và EDGE tại K-Home CityView

## 3. Hệ tiện ích đầy đủ hơn mức trung bình

Dự án tích hợp nhiều tiện ích nội khu: hồ bơi (người lớn và trẻ em), trường mầm non, công viên, khu vui chơi trẻ em, khu thể thao, BBQ, trạm sạc xe điện, minimart, nhà sinh hoạt cộng đồng.

---GALLERY---https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news10/4-1|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news10/4-2|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news10/4-3|Hệ tiện ích đầy đủ tại dự án K-Home CityView

## 4. Giá bán và chính sách tài chính dễ tiếp cận

Giá bán bình quân được phê duyệt khoảng **25,6 triệu đồng/m²** (thông thủy, đã gồm VAT). Kết hợp với chính sách vay từ Ngân hàng Chính sách xã hội:

- Lãi suất ưu đãi khoảng **5,4%/năm**
- Thời hạn lên đến **25 năm**
- Vay đến **75–80%** giá trị căn hộ
- Vốn ban đầu chỉ từ khoảng **200 triệu đồng** trở lên

![Chính sách vay ưu đãi giúp K-Home CityView dễ tiếp cận](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news10/5)

## 5. Thương hiệu và quy mô dự án

K-Home CityView thuộc chuỗi thương hiệu K-Home do Kim Oanh Land phát triển với quy mô gần 1.800 căn, tạo sự tin tưởng hơn so với các dự án nhỏ lẻ.

## Kết luận

Sức hút của K-Home CityView đến từ sự kết hợp giữa vị trí thuận tiện, tiêu chuẩn thiết kế cao hơn, tiện ích đầy đủ và chính sách tài chính hỗ trợ người mua nhà ở thật.

---GALLERY---https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news10/6-1|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news10/6-2|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news10/6-3|Căn hộ mẫu K-Home CityView sẵn sàng đón khách tham quan

**Xem chi tiết dự án:**

---PROJECT-LINK---k-home-cityview-ho-nai|K-Home CityView Hố Nai – Xem toàn bộ thông tin dự án

Liên hệ **0937.587.438** để được tư vấn và xem nhà mẫu.

---RELATED---danh-gia-du-an-k-home-cityview-bien-hoa-2026|Đánh giá dự án K-Home CityView Biên Hòa;k-home-cityview-tieu-chuan-song-xanh-edge|K-Home CityView & Tiêu Chuẩn Xanh EDGE`,
  },
  {
    id: "8",
    slug: "tien-do-k-home-cityview-2026-cap-nhat-moi-nhat",
    title: "Tiến Độ K-Home CityView 2026: Cập Nhật Mới Nhất Cho Khách Hàng Quan Tâm",
    date: "2026-08-01",
    excerpt: "Cập nhật tiến độ K-Home CityView 2026 mới nhất. Dự án đã khởi công khi nào? Hiện đang thi công đến đâu? Dự kiến bàn giao vào thời điểm nào?",
    image: "https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news11/1",
    category: "Tin tức dự án",
    content: `Tiến độ thi công là một trong những yếu tố quan trọng nhất khi khách hàng quyết định mua nhà ở xã hội. Dưới đây là thông tin cập nhật về tiến độ dự án K-Home CityView tính đến năm 2026.

![Tiến độ K-Home CityView 2026 cập nhật mới nhất](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news11/1)

## 1. Các mốc tiến độ đã thực hiện

- **Lễ động thổ:** Ngày 23/9/2025, Kim Oanh Land tổ chức lễ động thổ dự án K-Home CityView.
- **Khởi công xây dựng:** Dự án chính thức khởi công vào khoảng tháng 5/2026 (ngày 20/5/2026).
- **Tổng thầu thi công:** Công ty Phước Thành, áp dụng các giải pháp quản lý BIM, ERP để kiểm soát tiến độ và chất lượng.

![Lễ động thổ khởi công dự án K-Home CityView](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news11/2)

## 2. Tình hình thi công hiện tại (cập nhật 2026)

Tính đến giữa và cuối năm 2026, dự án đang trong giai đoạn triển khai thi công. Chủ đầu tư cho biết sẽ đẩy nhanh tiến độ nhằm đảm bảo đúng kế hoạch.

Chi tiết cụ thể (đang thi công móng, tầng bao nhiêu, % hoàn thành...) được cập nhật định kỳ qua Sales Gallery hoặc thông báo chính thức từ chủ đầu tư.

![Tiến độ thi công thực tế K-Home CityView năm 2026](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news11/3)

## 3. Dự kiến thời gian bàn giao

Theo các thông tin công bố:

- Dự kiến hoàn thành và bàn giao căn hộ vào năm **2027** (một số nguồn nêu cụ thể hơn là cuối 2027 – đầu 2028).
- Thời gian bàn giao chính thức phụ thuộc vào tiến độ thi công thực tế và các thủ tục nghiệm thu.

![Timeline tiến độ và dự kiến bàn giao K-Home CityView](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news11/4)

## 4. Sales Gallery và nhà mẫu

Kim Oanh Land dự kiến khai trương Sales Gallery và căn hộ mẫu vào khoảng đầu tháng 6/2026 để khách hàng có thể đến tham quan trực tiếp, trải nghiệm thiết kế và chất lượng bàn giao.

---GALLERY---https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news11/5-0|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news11/5-1|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news11/5-2|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news11/5-3|https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news11/5-4|Sales Gallery và căn hộ mẫu K-Home CityView

---PROJECT-CENTER---k-home-cityview-ho-nai|K-Home CityView Hố Nai

## 5. Lời khuyên cho khách hàng quan tâm tiến độ

- Theo dõi thông tin chính thức từ chủ đầu tư Kim Oanh Land hoặc đơn vị phân phối được ủy quyền.
- Nên đến trực tiếp công trường hoặc Sales Gallery (khi đã mở) để kiểm tra tiến độ thực tế.
- Tiến độ nhà ở xã hội có thể điều chỉnh theo điều kiện thi công, thời tiết và thủ tục pháp lý.

## Kết luận

Tính đến năm 2026, K-Home CityView đã hoàn thành các bước quan trọng: động thổ, khởi công và đang đẩy mạnh thi công. Dự kiến bàn giao trong năm 2027.

![Cập nhật tiến độ mới nhất dự án K-Home CityView](https://res.cloudinary.com/dthv0nsq/image/upload/q_auto,f_auto/news11/6)

Bạn muốn nhận thông tin tiến độ mới nhất hoặc đặt lịch tham quan? Liên hệ **0937.587.438** để được hỗ trợ.

---RELATED---danh-gia-du-an-k-home-cityview-bien-hoa-2026|Đánh giá dự án K-Home CityView Biên Hòa;vi-sao-k-home-cityview-thu-hut-su-quan-tam-lon|Vì Sao K-Home CityView Thu Hút Sự Quan Tâm Lớn`,
  },
];

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
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
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


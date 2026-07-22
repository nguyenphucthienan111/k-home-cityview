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
  windowMs: 10 * 60 * 1000, // 10 phút
  max: 5,
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
    name: "Lê Hoàng Yến", email: "yenlh@gmail.com", phone: "0933445566",
    projectSlug: "k-home-cityview-ho-nai", projectName: "K-Home CityView Biên Hòa",
    message: "Muốn tham quan vị trí thực tế dự án CityView Hố Nai.",
    status: "Đã chốt", notes: "Đã ký văn bản đặt cọc căn hộ tầng 10.",
  },
];

// ─── Static Data (Projects & News) ────────────────────────────────────────────
const projects = [
  {
    id: "1", slug: "k-home-cityview-ho-nai", title: "K-Home CityView Biên Hòa",
    location: "Đường Điều Xiển, Phường Hố Nai, TP. Biên Hòa, Đồng Nai",
    type: "Căn hộ nhà ở xã hội", price: "Từ 950 Triệu", priceNumber: 0.95, area: "45m² - 70m²",
    image: "/cityview.jpg",
    description: "Tọa lạc tại Phường Hố Nai, TP. Biên Hòa, K-Home CityView là dự án nhà ở xã hội quy mô 2,85 hecta với 1.352 căn hộ và 30 căn shophouse, tiêu chuẩn thiết kế Singapore.",
    longDescription: "K-Home CityView là dự án nhà ở xã hội (NOXH) do Kim Oanh Land & K-Home Group phát triển tại Phường Hố Nai, TP. Biên Hòa, Đồng Nai. Quy mô 2,85 hecta với 4 block cao tầng, gồm 1.352 căn hộ NOXH và 30 căn shophouse thương mại.\n\nDự án được thiết kế theo tiêu chuẩn Singapore bởi các đối tác uy tín: Global Vireon Studio, Kiến Trúc Việt, CDC Jsc và K-City. Hạ tầng tiện ích nội khu đầy đủ gồm hồ bơi, sân chơi trẻ em, khu thể dục ngoài trời và nhà sinh hoạt cộng đồng.",
    gallery: ["/cityview.jpg", "/cityview1.jpg", "/cityview2.jpg", "/cityview3.jpg"],
    amenities: ["Hồ bơi người lớn & trẻ em", "Sân chơi trẻ em", "Khu thể dục ngoài trời", "Nhà sinh hoạt cộng đồng", "Shophouse thương mại nội khu", "Hệ thống an ninh 24/7"],
    status: "Đang mở bán", rating: 4.8, floorCount: 18, developer: "Kim Oanh Land • K-Home Group",
  },
  {
    id: "2", slug: "k-home-midtown-trang-bom", title: "K-Home Midtown Trảng Bom",
    location: "Giữa 4 tuyến đường 30/4 – Hùng Vương – Lý Nam Đế – Lê Đại Hành, P. Trảng Bom, Đồng Nai",
    type: "Căn hộ nhà ở xã hội", price: "Trả góp 3.5 – 4.5 Tr/tháng", priceNumber: 0.8, area: "45m² - 70m²",
    image: "/midtown.jpg",
    description: "Tọa lạc tại trung tâm huyện Trảng Bom, K-Home Midtown là dự án NOXH quy mô 13,97 hecta với 542 căn hộ và 20 căn shophouse, kết nối thuận tiện 4 tuyến đường lớn.",
    longDescription: "K-Home Midtown là dự án nhà ở xã hội quy mô lớn nhất trong 3 dự án K-Home tại Đồng Nai, với diện tích 13,97 hecta tọa lạc ngay trung tâm huyện Trảng Bom. Dự án gồm 542 căn hộ NOXH cao 15 tầng và 20 căn shophouse.\n\nVị trí đắc địa nằm giữa 4 tuyến đường chính: 30/4, Hùng Vương, Lý Nam Đế và Lê Đại Hành — kết nối dễ dàng tới các khu công nghiệp lớn trong vùng. Đối tác thiết kế: Global Vireon Studio, Kiến Trúc Việt, NAGECCO và K-City.",
    gallery: ["/midtown.jpg", "/midtown1.webp", "/midtown2.webp", "/midtown3.webp"],
    amenities: ["Hồ bơi người lớn & trẻ em", "Sân chơi trẻ em", "Khu thể dục ngoài trời", "Sky Garden & vườn cảnh quan", "Shophouse thương mại nội khu", "Hệ thống an ninh 24/7"],
    status: "Đang thi công", rating: 4.7, floorCount: 15, developer: "Kim Oanh Land • K-Home Group",
  },
  {
    id: "3", slug: "k-home-avenue-nhon-trach", title: "K-Home Avenue Nhơn Trạch",
    location: "Đường Nguyễn Ái Quốc (25C), Xã Nhơn Trạch, Tỉnh Đồng Nai",
    type: "Căn hộ nhà ở xã hội", price: "Từ 750 Triệu", priceNumber: 0.75, area: "45m² - 70m²",
    image: "/avenue.jpg",
    description: "Tọa lạc trên trục đường Nguyễn Ái Quốc (25C), K-Home Avenue là dự án NOXH quy mô 5,3 hecta với 1.022 căn hộ và 82 căn shophouse, hưởng lợi trực tiếp từ hạ tầng sân bay Long Thành.",
    longDescription: "K-Home Avenue tọa lạc tại xã Nhơn Trạch, tỉnh Đồng Nai — khu vực đang phát triển mạnh nhờ hưởng lợi từ dự án sân bay quốc tế Long Thành và các tuyến cao tốc kết nối vùng. Dự án có quy mô 5,3 hecta gồm 1.022 căn hộ NOXH và 82 căn shophouse thương mại.\n\nThiết kế bởi đội ngũ quốc tế: Surbana Jurong (Singapore), Global Vireon Studio, Handong, Coninco và K-City — mang đến chuẩn sống cao cấp với mức giá phù hợp người thu nhập thấp và trung bình.",
    gallery: ["/avenue.jpg", "/avenue1.jpg", "/avenue2.png", "/avenue3.jpg"],
    amenities: ["Hồ bơi người lớn & trẻ em", "Sân chơi trẻ em", "Khu thể dục ngoài trời", "Sky Garden & vườn cảnh quan", "82 căn shophouse thương mại", "Hệ thống an ninh 24/7"],
    status: "Sắp mở bán", rating: 4.8, floorCount: 12, developer: "Kim Oanh Land • K-Home Group",
  },
];

const newsList = [
  {
    id: "1", slug: "chinh-thuc-cong-bo-k-home-grand-urban-giai-doan-2",
    title: "Chính thức công bố kế hoạch xây dựng K-Home Grand Urban Giai đoạn 2",
    date: "2026-07-20",
    excerpt: "Chủ đầu tư K-Home Group vừa công bố kế hoạch khởi công phân khu The Oasis thuộc giai đoạn 2 dự án K-Home Grand Urban với hàng loạt nâng cấp đắt giá.",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
    category: "Tin tức dự án",
    content: "Nối tiếp thành công vang dội của giai đoạn 1 với hơn 95% căn hộ được giao dịch thành công trong ngày đầu tiên mở bán, K-Home Group đã chính thức đưa ra thị trường lộ trình phát triển giai đoạn 2 của K-Home Grand Urban.",
  },
  {
    id: "2", slug: "xu-huong-lua-chon-can-ho-xanh-thong-minh",
    title: "Xu hướng lựa chọn căn hộ xanh thông minh lên ngôi năm 2026",
    date: "2026-07-15",
    excerpt: "Khảo sát mới đây cho thấy hơn 85% người mua nhà sẵn sàng chi trả thêm từ 10% - 15% ngân sách cho các căn hộ áp dụng giải pháp xanh và tự động hóa thông minh.",
    image: "https://images.unsplash.com/photo-1502005229762-fc1b2381f0db?auto=format&fit=crop&w=800&q=80",
    category: "Thị trường",
    content: "Sự phát triển vượt bậc của công nghệ và biến đổi khí hậu đang định hình lại hành vi của người mua nhà.",
  },
  {
    id: "3", slug: "lai-suat-mua-nha-giam-sau-co-hoi-vang",
    title: "Lãi suất vay mua nhà giảm sâu: Cơ hội vàng cho người mua nhà ở thực",
    date: "2026-07-10",
    excerpt: "Nhiều ngân hàng thương mại lớn đồng loạt hạ mức lãi suất vay mua nhà ưu đãi xuống chỉ còn từ 4.5%/năm.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
    category: "Tài chính",
    content: "Làn sóng hạ lãi suất cho vay đang diễn ra vô cùng mạnh mẽ.",
  },
];

// ─── Public API Routes ────────────────────────────────────────────────────────
app.get("/api/projects", (_req, res) => res.json(projects));
app.get("/api/news", (_req, res) => res.json(newsList));

// Khách hàng gửi form liên hệ
app.post("/api/contact", contactLimiter, async (req, res) => {
  const { name, email, phone, projectSlug, projectName, message } = req.body;

  if (!name || !email || !phone) {
    res.status(400).json({ error: "Vui lòng điền đầy đủ: Họ tên, Email, Số điện thoại." });
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

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
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

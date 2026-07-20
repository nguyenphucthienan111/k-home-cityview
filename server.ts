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
    projectSlug: "k-home-grand-urban", projectName: "K-Home Grand Urban",
    message: "Tôi muốn tìm hiểu căn hộ 2 phòng ngủ hướng Đông Nam, vui lòng gửi bảng báo giá.",
    status: "Chờ liên hệ", notes: "Khách hàng có nhu cầu mua ở thực, tài chính sẵn 2 tỷ.",
  },
  {
    name: "Trần Thị Mai", email: "maitran@yahoo.com", phone: "0987654321",
    projectSlug: "k-home-resort-villas", projectName: "K-Home Resort Villas",
    message: "Cần tư vấn căn biệt thự song lập view trực diện biển. Có hỗ trợ vay ngân hàng không?",
    status: "Đang thương lượng", notes: "Đang chờ ngân hàng phê duyệt khoản vay 50%.",
  },
  {
    name: "Phạm Minh Hoàng", email: "hoangpm@techcorp.vn", phone: "0905112233",
    projectSlug: "k-home-sky-garden", projectName: "K-Home Sky Garden",
    message: "Cần đặt lịch xem nhà mẫu Penthouse vào cuối tuần này.",
    status: "Đã liên hệ", notes: "Đã xếp lịch xem nhà mẫu vào 9h sáng thứ Bảy.",
  },
  {
    name: "Lê Hoàng Yến", email: "yenlh@gmail.com", phone: "0933445566",
    projectSlug: "k-home-riverside-mansion", projectName: "K-Home Riverside Mansion",
    message: "Muốn tham quan vị trí thực tế dự án Riverside Mansion.",
    status: "Đã chốt", notes: "Đã ký văn bản đặt cọc căn Villa sông số 05.",
  },
];

// ─── Static Data (Projects & News — không đổi) ────────────────────────────────
const projects = [
  {
    id: "1", slug: "k-home-grand-urban", title: "K-Home Grand Urban",
    location: "Khu đô thị sáng tạo Đông Sài Gòn, Quận 9, TP. Hồ Chí Minh",
    type: "Căn hộ chung cư", price: "Từ 3.2 Tỷ", priceNumber: 3.2, area: "54m² - 110m²",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    description: "Tọa lạc tại tâm điểm đô thị sáng tạo Thủ Đức, K-Home Grand Urban mang đến chuẩn mực sống thông minh và không gian xanh sinh thái ngập tràn.",
    longDescription: "Dự án K-Home Grand Urban được kiến tạo như một ốc đảo thông minh giữa lòng thành phố năng động. Được áp dụng công nghệ Smart Home tiên tiến, toàn bộ hệ thống chiếu sáng, điều hòa, an ninh đều được điều khiển chỉ bằng một chạm trên điện thoại của bạn.\n\nVới mật độ xây dựng chỉ 30%, hơn 70% diện tích còn lại dành cho công viên cây xanh, hồ điều hòa và các công trình công cộng đẳng cấp.",
    gallery: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80"],
    amenities: ["Hồ bơi tràn bờ vô cực","Phòng Gym & Yoga 5 sao","Sân chơi trẻ em sắc màu","Trung tâm thương mại","Hệ thống an ninh AI 3 lớp","Đường dạo bộ sinh thái"],
    status: "Đang mở bán", rating: 4.8, floorCount: 35, developer: "K-Home Group",
  },
  {
    id: "2", slug: "k-home-resort-villas", title: "K-Home Resort Villas",
    location: "Bờ biển Chí Linh, Phường 10, Thành phố Vũng Tàu",
    type: "Biệt thự nghỉ dưỡng", price: "Từ 17.5 Tỷ", priceNumber: 17.5, area: "250m² - 450m²",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
    description: "Khu biệt thự nghỉ dưỡng riêng tư bên bờ biển thơ mộng, mở ra không gian thư giãn tuyệt mỹ cùng đặc quyền bãi tắm riêng biệt.",
    longDescription: "K-Home Resort Villas là kiệt tác kiến trúc nghỉ dưỡng nằm kiêu hãnh trên dải cát vàng của biển Chí Linh. Mỗi căn biệt thự đều được thiết kế mở đón trọn gió biển mát lành và ánh nắng ngập tràn tự nhiên.",
    gallery: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1600596542815-31beec98d26a?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"],
    amenities: ["Bãi biển tư nhân","Hồ bơi vô cực ngắm hoàng hôn","Hệ thống nhà hàng Beach Club","Vườn nướng BBQ ven biển","Dịch vụ quản gia 24/7","Bến du thuyền thượng lưu"],
    status: "Đang mở bán", rating: 4.9, floorCount: 2, developer: "K-Home Premium",
  },
  {
    id: "3", slug: "k-home-sky-garden", title: "K-Home Sky Garden",
    location: "Trần Não, Quận 2 (TP. Thủ Đức), TP. Hồ Chí Minh",
    type: "Căn hộ Penthouse", price: "Từ 8.5 Tỷ", priceNumber: 8.5, area: "120m² - 280m²",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    description: "Tuyệt tác căn hộ xanh lơ lửng giữa mây trời, với vườn treo tầng thượng riêng biệt ngắm trọn vẹn hoàng hôn sông Sài Gòn.",
    longDescription: "Tọa lạc tại vị trí vàng đường Trần Não, K-Home Sky Garden tái định nghĩa khái niệm căn hộ cao cấp tại Việt Nam.",
    gallery: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1502005229762-fc1b2381f0db?auto=format&fit=crop&w=800&q=80"],
    amenities: ["Vườn treo chân mây","Đài quan sát viễn vọng","Hồ bơi jacuzzi nước ấm","Phòng thử rượu vang sang trọng","Rạp chiếu phim mini cao cấp","Sky Bar tầng thượng"],
    status: "Sắp mở bán", rating: 4.7, floorCount: 40, developer: "K-Home Land",
  },
  {
    id: "4", slug: "k-home-riverside-mansion", title: "K-Home Riverside Mansion",
    location: "Đại lộ Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
    type: "Nhà phố thương mại", price: "Từ 15.0 Tỷ", priceNumber: 15.0, area: "180m² - 320m²",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    description: "Khu đô thị sinh thái biệt lập ven sông, nơi hội tụ dòng chảy thịnh vượng, mang lại phong thủy đại cát đại lợi cho gia chủ.",
    longDescription: "Nằm trải dọc bên dòng sông mát mẻ quanh năm tại Nam Sài Gòn, K-Home Riverside Mansion là biểu tượng của sự phồn vinh và yên ả.",
    gallery: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1600596542815-31beec98d26a?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?auto=format&fit=crop&w=800&q=80"],
    amenities: ["Bến thuyền Kayak ven sông","Công viên điêu khắc nghệ thuật","Sân tập Golf mini","Khu thể thao phức hợp ngoài trời","Hệ thống trường học quốc tế liên cấp","Phòng khám đa khoa quốc tế"],
    status: "Đang mở bán", rating: 4.9, floorCount: 4, developer: "K-Home Luxury",
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

# 🔒 Hướng dẫn Setup Bảo Mật MongoDB + JWT Auth

## Những thay đổi đã thực hiện

✅ **Xóa bỏ tệp JSON lưu trữ dữ liệu không an toàn** → Chuyển sang MongoDB
✅ **JWT Authentication thực** → Server xác thực mọi request bằng token
✅ **Bcrypt hashed password** → Không còn hardcode password trong source
✅ **Express Rate Limiting** → Chống brute-force và spam
✅ **Input validation** → Mongoose schema validation cho mọi field
✅ **Loại bỏ credentials khỏi source code** → Tất cả nhạy cảm vào `.env`

---

## Yêu cầu

1. **MongoDB** phải được cài đặt và chạy:
   - **Local MongoDB**: [Download tại đây](https://www.mongodb.com/try/download/community)
   - **MongoDB Atlas** (Cloud miễn phí): [Tạo cluster tại đây](https://www.mongodb.com/cloud/atlas/register)

2. **Node.js** v18+

---

## Bước 1: Cài MongoDB Local (nếu chưa có)

### Windows:
```bash
# Download MongoDB Community Server từ mongodb.com
# Sau khi cài xong, khởi động service:
net start MongoDB
```

### macOS (với Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

### Linux (Ubuntu/Debian):
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
```

Hoặc dùng Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7
```

---

## Bước 2: Cấu hình `.env`

Copy file `.env.example` thành `.env`:
```bash
cp .env.example .env
```

Đã có sẵn giá trị mặc định cho local MongoDB trong `.env`:
```env
MONGODB_URI="mongodb://127.0.0.1:27017/k-home-cityview"
JWT_SECRET="<đã được gen sẵn>"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="<hash của 'admin123'>"
```

### Nếu dùng MongoDB Atlas (Cloud):
1. Tạo cluster miễn phí tại [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Lấy connection string (dạng `mongodb+srv://...`)
3. Thay đổi `MONGODB_URI` trong `.env`:
```env
MONGODB_URI="mongodb+srv://<user>:<password>@cluster.mongodb.net/k-home-cityview?retryWrites=true&w=majority"
```

---

## Bước 3: Tạo mật khẩu Admin mới (tùy chọn)

Nếu muốn đổi mật khẩu từ `admin123` mặc định:

```bash
node scripts/hash-password.mjs
```

Script sẽ hỏi mật khẩu mới và in ra bcrypt hash. Copy hash đó vào `ADMIN_PASSWORD_HASH` trong file `.env`.

---

## Bước 4: Chạy Server

```bash
# Development mode (với Vite HMR)
npm run dev

# Production build
npm run build
npm start
```

Server sẽ tự động:
- Kết nối MongoDB
- Tạo database `k-home-cityview` nếu chưa tồn tại
- Seed 4 contact mẫu nếu DB còn trống
- Khởi động tại `http://localhost:3000`

---

## Bước 5: Đăng nhập Admin

1. Truy cập: `http://localhost:3000#admin`
2. Nhập:
   - **Tài khoản**: `admin`
   - **Mật khẩu**: `admin123` (hoặc mật khẩu bạn vừa tạo ở Bước 3)

Token JWT sẽ được lưu trong `sessionStorage` và tự động đính kèm vào mọi request API bảo mật.

---

## So sánh Trước & Sau

### ❌ Trước (Không an toàn)
```typescript
// contacts.json nằm public, có thể tải trực tiếp
app.get("/api/contacts", (req, res) => {
  res.json(contactsList); // Không kiểm tra auth
});

// Mật khẩu hardcode trong React component
if (username === "admin" && password === "admin123") { ... }
```

### ✅ Sau (Bảo mật thực sự)
```typescript
// Middleware yêu cầu JWT token hợp lệ
app.get("/api/contacts", requireAuth, async (req, res) => {
  const contacts = await ContactModel.find();
  res.json(contacts);
});

// Login API kiểm tra bcrypt hash từ .env
const passwordMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
if (!passwordMatch) return res.status(401).json({ error: "Sai mật khẩu" });
const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "8h" });
```

---

## Rate Limiting

Hệ thống tự động giới hạn:
- **Login**: Tối đa 10 lần thử / 15 phút (chống brute-force)
- **Contact form**: Tối đa 5 lần gửi / 10 phút (chống spam)
- **API tổng quát**: Tối đa 100 request / 15 phút

---

## Monitoring & Logs

Khi server chạy, bạn sẽ thấy:
```
✅ MongoDB đã kết nối thành công
✅ Đã seed dữ liệu mẫu vào MongoDB (nếu DB trống)
🚀 Server đang chạy tại http://0.0.0.0:3000
```

Nếu có lỗi MongoDB connection:
```
❌ Lỗi khởi động server: MongoServerError: connect ECONNREFUSED 127.0.0.1:27017
```
→ Kiểm tra MongoDB đã chạy chưa: `mongod --version`

---

## Production Deployment

Khi deploy lên Cloud Run / Railway / Render:

1. **Set environment variables** trên platform:
   ```
   MONGODB_URI=<MongoDB Atlas connection string>
   JWT_SECRET=<random 128-char string>
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD_HASH=<bcrypt hash từ scripts/hash-password.mjs>
   NODE_ENV=production
   ```

2. **MongoDB Atlas** khuyến nghị cho production — miễn phí 512MB đầu tiên.

3. **KHÔNG commit `.env`** vào Git (đã có trong `.gitignore`).

---

## Câu hỏi thường gặp

**Q: Tôi quên mật khẩu admin?**
→ Chạy `node scripts/hash-password.mjs`, tạo hash mới và cập nhật `ADMIN_PASSWORD_HASH` trong `.env`.

**Q: Token hết hạn khi nào?**
→ JWT token có thời gian sống 8 giờ (cấu hình tại `server.ts` dòng `expiresIn: "8h"`).

**Q: Làm sao xem data trong MongoDB?**
→ Dùng [MongoDB Compass](https://www.mongodb.com/products/compass) (GUI miễn phí) hoặc CLI:
```bash
mongosh
use k-home-cityview
db.contacts.find()
```

**Q: Tôi muốn đổi database name?**
→ Sửa cuối cùng của `MONGODB_URI` trong `.env`, ví dụ:
```
mongodb://127.0.0.1:27017/my-custom-db-name
```

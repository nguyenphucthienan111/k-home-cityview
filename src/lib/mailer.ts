import nodemailer from "nodemailer";

// ─── Tạo transporter Gmail ─────────────────────────────────────────────────
// Yêu cầu bật "2-Step Verification" trên tài khoản Google,
// sau đó tạo "App Password" tại: https://myaccount.google.com/apppasswords
function createTransporter() {
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASS;

  if (!user || !pass) {
    throw new Error("MAIL_USER và MAIL_PASS chưa được cấu hình trong .env");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
    logger: false,
    debug: false,
  });
}

// ─── Kiểm tra kết nối SMTP khi server khởi động ───────────────────────────
export async function verifyMailer(): Promise<void> {
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASS;
  if (!user || !pass) {
    console.warn("⚠️  Email chưa cấu hình (MAIL_USER / MAIL_PASS trống) — bỏ qua verify.");
    return;
  }
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log(`✅ Mailer SMTP kết nối OK — gửi từ: ${user}`);
  } catch (err: any) {
    console.error(`❌ Mailer SMTP lỗi: ${err.message}`);
    console.error("   → Kiểm tra MAIL_USER, MAIL_PASS trong .env và App Password Gmail.");
  }
}

// ─── Gửi thông báo khi có form tư vấn mới ─────────────────────────────────
export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  projectName: string;
  message: string;
  createdAt: Date;
}

export async function sendContactNotification(contact: ContactPayload): Promise<void> {
  const recipient = process.env.MAIL_TO || process.env.MAIL_USER;
  if (!recipient) return;

  const transporter = createTransporter();

  const formattedDate = contact.createdAt.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    dateStyle: "short",
    timeStyle: "short",
  });

  const htmlBody = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .card { background: #ffffff; border-radius: 8px; max-width: 560px; margin: 0 auto;
            padding: 28px 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    h2 { color: #b45309; margin-top: 0; font-size: 18px; }
    .badge { display: inline-block; background: #fef3c7; color: #92400e;
             font-size: 12px; font-weight: 600; padding: 3px 10px;
             border-radius: 99px; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 8px 0; font-size: 14px; vertical-align: top; }
    td:first-child { color: #6b7280; width: 130px; white-space: nowrap; }
    td:last-child { color: #111827; font-weight: 500; }
    .message-box { background: #f9fafb; border-left: 3px solid #d97706;
                   padding: 10px 14px; border-radius: 4px; font-size: 14px;
                   color: #374151; margin-top: 16px; white-space: pre-wrap; }
    .footer { margin-top: 24px; font-size: 12px; color: #9ca3af; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <h2>🏠 Khách hàng mới đăng ký tư vấn</h2>
    <span class="badge">K-Home · ${formattedDate}</span>
    <table>
      <tr><td>Họ tên</td><td>${contact.name}</td></tr>
      <tr><td>Số điện thoại</td><td>${contact.phone}</td></tr>
      <tr><td>Email</td><td>${contact.email || "—"}</td></tr>
      <tr><td>Dự án quan tâm</td><td>${contact.projectName}</td></tr>
    </table>
    ${
      contact.message
        ? `<div class="message-box">${contact.message}</div>`
        : ""
    }
    <div class="footer">Email tự động từ hệ thống K-Home · Không cần trả lời email này</div>
  </div>
</body>
</html>
  `.trim();

  await transporter.sendMail({
    from: `"K-Home Thông báo" <${process.env.MAIL_USER}>`,
    to: recipient,
    subject: `[K-Home] Đăng ký tư vấn mới — ${contact.name} · ${contact.phone}`,
    html: htmlBody,
    // Plain text fallback
    text: `Khách hàng mới đăng ký tư vấn\n\nHọ tên: ${contact.name}\nĐiện thoại: ${contact.phone}\nEmail: ${contact.email || "—"}\nDự án: ${contact.projectName}\nNội dung: ${contact.message || "—"}\nThời gian: ${formattedDate}`,
  });
}

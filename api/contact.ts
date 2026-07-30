import type { VercelRequest, VercelResponse } from "@vercel/node";
import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";

// ─── Gửi email thông báo ──────────────────────────────────────────────────────
async function sendMail(contact: {
  name: string; email: string; phone: string;
  projectName: string; message: string; createdAt: Date;
}) {
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASS;
  const to   = process.env.MAIL_TO || user;
  if (!user || !pass || !to) return; // chưa cấu hình → bỏ qua

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  const formattedDate = contact.createdAt.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh", dateStyle: "short", timeStyle: "short",
  });

  const html = `
<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"/>
<style>
  body{font-family:Arial,sans-serif;background:#f5f5f5;margin:0;padding:20px}
  .card{background:#fff;border-radius:8px;max-width:560px;margin:0 auto;padding:28px 32px;box-shadow:0 2px 8px rgba(0,0,0,.08)}
  h2{color:#b45309;margin-top:0;font-size:18px}
  .badge{display:inline-block;background:#fef3c7;color:#92400e;font-size:12px;font-weight:600;padding:3px 10px;border-radius:99px;margin-bottom:20px}
  table{width:100%;border-collapse:collapse}
  td{padding:8px 0;font-size:14px;vertical-align:top}
  td:first-child{color:#6b7280;width:130px;white-space:nowrap}
  td:last-child{color:#111827;font-weight:500}
  .msg{background:#f9fafb;border-left:3px solid #d97706;padding:10px 14px;border-radius:4px;font-size:14px;color:#374151;margin-top:16px;white-space:pre-wrap}
  .footer{margin-top:24px;font-size:12px;color:#9ca3af;text-align:center}
</style></head><body>
<div class="card">
  <h2>🏠 Khách hàng mới đăng ký tư vấn</h2>
  <span class="badge">K-Home · ${formattedDate}</span>
  <table>
    <tr><td>Họ tên</td><td>${contact.name}</td></tr>
    <tr><td>Số điện thoại</td><td>${contact.phone}</td></tr>
    <tr><td>Email</td><td>${contact.email || "—"}</td></tr>
    <tr><td>Dự án quan tâm</td><td>${contact.projectName}</td></tr>
  </table>
  ${contact.message ? `<div class="msg">${contact.message}</div>` : ""}
  <div class="footer">Email tự động từ hệ thống K-Home · Không cần trả lời email này</div>
</div></body></html>`.trim();

  await transporter.sendMail({
    from: `"K-Home Thông báo" <${user}>`,
    to,
    subject: `[K-Home] Đăng ký tư vấn mới — ${contact.name} · ${contact.phone}`,
    html,
    text: `Họ tên: ${contact.name}\nĐiện thoại: ${contact.phone}\nEmail: ${contact.email || "—"}\nDự án: ${contact.projectName}\nNội dung: ${contact.message || "—"}\nThời gian: ${formattedDate}`,
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, email, phone, projectSlug, projectName, message } = req.body ?? {};
  if (!name || !phone) {
    return res.status(400).json({ error: "Vui lòng điền đầy đủ: Họ tên, Số điện thoại." });
  }

  const uri = process.env.MONGODB_URI!;
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000, maxPoolSize: 1 });
  try {
    await client.connect();
    const contact = {
      name: String(name).trim().slice(0, 200),
      email: String(email).trim().slice(0, 200),
      phone: String(phone).trim().slice(0, 20),
      projectSlug: projectSlug ? String(projectSlug).trim() : "general",
      projectName: projectName ? String(projectName).trim() : "Tư vấn chung",
      message: message ? String(message).trim().slice(0, 2000) : "",
      status: "Chờ liên hệ",
      notes: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await client.db().collection("contacts").insertOne(contact);

    // Gửi email thông báo — await để đảm bảo gửi xong trước khi Vercel function kết thúc
    try {
      await sendMail({ ...contact, createdAt: contact.createdAt });
    } catch (mailErr: any) {
      console.error("⚠️ Gửi email thất bại:", mailErr.message);
    }

    return res.status(201).json({ success: true, id: result.insertedId.toString() });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi máy chủ.", detail: err?.message });
  } finally {
    await client.close();
  }
}

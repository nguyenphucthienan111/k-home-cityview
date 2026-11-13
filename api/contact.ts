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

// ─── Gửi Zalo Webhook thông báo tức thì ─────────────────────────────────────────
async function sendZaloWebhook(contact: {
  name: string; email: string; phone: string;
  projectName: string; message: string; createdAt: Date;
}) {
  const webhookUrl = process.env.ZALO_WEBHOOK_URL || process.env.WEBHOOK_URL;
  if (!webhookUrl) return;

  const formattedDate = contact.createdAt.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh", dateStyle: "short", timeStyle: "short",
  });

  const payload = {
    event: "new_lead",
    source: "k-homedongnai.com.vn",
    name: contact.name,
    phone: contact.phone,
    email: contact.email || "",
    projectName: contact.projectName,
    message: contact.message || "",
    createdAt: contact.createdAt.toISOString(),
    formattedDate,
    text: `🏠 KHÁCH HÀNG MỚI ĐĂNG KÝ TƯ VẤN K-HOME\n\n👤 Họ tên: ${contact.name}\n📞 SĐT: ${contact.phone}\n🏢 Dự án: ${contact.projectName}\n💬 Lời nhắn: ${contact.message || "Tư vấn hồ sơ & bảng giá"}\n⏰ Thời gian: ${formattedDate}`,
    content: `🏠 KHÁCH HÀNG MỚI ĐĂNG KÝ TƯ VẤN K-HOME\n\n👤 Họ tên: ${contact.name}\n📞 SĐT: ${contact.phone}\n🏢 Dự án: ${contact.projectName}\n💬 Lời nhắn: ${contact.message || "Tư vấn hồ sơ & bảng giá"}\n⏰ Thời gian: ${formattedDate}`
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err: any) {
    console.error("⚠️ Gửi Zalo Webhook thất bại:", err.message);
  }
}

// ─── Gửi Telegram Bot thông báo (nếu có cấu hình) ──────────────────────────────
async function sendTelegramAlert(contact: {
  name: string; email: string; phone: string;
  projectName: string; message: string; createdAt: Date;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const formattedDate = contact.createdAt.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh", dateStyle: "short", timeStyle: "short",
  });

  const text = `🏠 <b>KHÁCH HÀNG MỚI ĐĂNG KÝ K-HOME</b>\n\n` +
    `👤 <b>Họ tên:</b> ${contact.name}\n` +
    `📞 <b>SĐT:</b> <code>${contact.phone}</code>\n` +
    `🏢 <b>Dự án:</b> ${contact.projectName}\n` +
    `✉️ <b>Email:</b> ${contact.email || "Không có"}\n` +
    `💬 <b>Nội dung:</b> ${contact.message || "Đăng ký tư vấn"}\n` +
    `⏰ <b>Thời gian:</b> ${formattedDate}`;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    });
  } catch (err: any) {
    console.error("⚠️ Gửi Telegram thất bại:", err.message);
  }
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
      email: String(email || "").trim().slice(0, 200),
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

    // Gửi song song: Email + Zalo Webhook + Telegram Alert
    await Promise.allSettled([
      sendMail({ ...contact, createdAt: contact.createdAt }),
      sendZaloWebhook({ ...contact, createdAt: contact.createdAt }),
      sendTelegramAlert({ ...contact, createdAt: contact.createdAt }),
    ]);

    return res.status(201).json({ success: true, id: result.insertedId.toString() });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi máy chủ.", detail: err?.message });
  } finally {
    await client.close();
  }
}

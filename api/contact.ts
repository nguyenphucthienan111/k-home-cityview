import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB } from "./_lib/db";
import ContactModel from "./_lib/ContactModel";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, projectSlug, projectName, message } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: "Vui lòng điền đầy đủ: Họ tên, Email, Số điện thoại." });
  }

  try {
    await connectDB();
    const contact = await ContactModel.create({
      name:        String(name).trim().slice(0, 200),
      email:       String(email).trim().slice(0, 200),
      phone:       String(phone).trim().slice(0, 20),
      projectSlug: projectSlug ? String(projectSlug).trim() : "general",
      projectName: projectName ? String(projectName).trim() : "Tư vấn chung",
      message:     message ? String(message).trim().slice(0, 2000) : "",
    });
    return res.status(201).json({ success: true, contact });
  } catch (err: any) {
    console.error("POST /api/contact error:", err);
    return res.status(500).json({ 
      error: "Lỗi máy chủ. Vui lòng thử lại.",
      detail: err?.message || String(err)
    });
  }
}

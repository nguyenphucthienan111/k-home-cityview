import type { VercelRequest, VercelResponse } from "@vercel/node";
import { MongoClient } from "mongodb";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, email, phone, projectSlug, projectName, message } = req.body ?? {};
  if (!name || !email || !phone) {
    return res.status(400).json({ error: "Vui lòng điền đầy đủ: Họ tên, Email, Số điện thoại." });
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
    return res.status(201).json({ success: true, id: result.insertedId.toString() });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi máy chủ.", detail: err?.message });
  } finally {
    await client.close();
  }
}

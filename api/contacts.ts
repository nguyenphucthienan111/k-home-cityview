import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB } from "./_lib/db";
import { requireAuth } from "./_lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = requireAuth(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const db = await connectDB();
    const contacts = await db.collection("contacts")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    const mapped = contacts.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest }));
    return res.json(mapped);
  } catch (err: any) {
    console.error("GET /api/contacts error:", err);
    return res.status(500).json({ error: "Lỗi máy chủ khi tải danh sách.", detail: err?.message });
  }
}

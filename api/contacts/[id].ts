import type { VercelRequest, VercelResponse } from "@vercel/node";
import jwt from "jsonwebtoken";
import { MongoClient, ObjectId } from "mongodb";

const ALLOWED_STATUSES = ["Chờ liên hệ", "Đã liên hệ", "Đang thương lượng", "Đã chốt"];

function requireAuth(req: VercelRequest): string | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return null;
    const payload = jwt.verify(auth.replace("Bearer ", ""), secret) as { username: string };
    return payload.username;
  } catch { return null; }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireAuth(req)) return res.status(401).json({ error: "Unauthorized" });

  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  if (!id) return res.status(400).json({ error: "Missing id." });

  let objectId: ObjectId;
  try { objectId = new ObjectId(id); }
  catch { return res.status(400).json({ error: "Invalid id." }); }

  const uri = process.env.MONGODB_URI!;
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000, maxPoolSize: 1 });
  try {
    await client.connect();
    const col = client.db().collection("contacts");

    if (req.method === "PUT") {
      const { status, notes } = req.body ?? {};
      const update: Record<string, unknown> = { updatedAt: new Date() };
      if (status !== undefined) {
        if (!ALLOWED_STATUSES.includes(status)) return res.status(400).json({ error: "Trạng thái không hợp lệ." });
        update.status = status;
      }
      if (notes !== undefined) update.notes = String(notes).slice(0, 5000);
      const result = await col.findOneAndUpdate({ _id: objectId }, { $set: update }, { returnDocument: "after" });
      if (!result) return res.status(404).json({ error: "Không tìm thấy khách hàng." });
      const { _id, ...rest } = result;
      return res.json({ success: true, contact: { id: _id.toString(), ...rest } });
    }

    if (req.method === "DELETE") {
      const result = await col.findOneAndDelete({ _id: objectId });
      if (!result) return res.status(404).json({ error: "Không tìm thấy khách hàng." });
      return res.json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi máy chủ.", detail: err?.message });
  } finally {
    await client.close();
  }
}

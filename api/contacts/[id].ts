import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ObjectId } from "mongodb";
import { connectDB } from "../_lib/db";
import { requireAuth } from "../_lib/auth";

const ALLOWED_STATUSES = ["Chờ liên hệ", "Đã liên hệ", "Đang thương lượng", "Đã chốt"];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = requireAuth(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  if (!id) return res.status(400).json({ error: "Missing id." });

  let objectId: ObjectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return res.status(400).json({ error: "Invalid id format." });
  }

  try {
    const db = await connectDB();

    if (req.method === "PUT") {
      const { status, notes } = req.body ?? {};
      const update: Record<string, unknown> = { updatedAt: new Date() };

      if (status !== undefined) {
        if (!ALLOWED_STATUSES.includes(status)) {
          return res.status(400).json({ error: "Trạng thái không hợp lệ." });
        }
        update.status = status;
      }
      if (notes !== undefined) {
        update.notes = String(notes).slice(0, 5000);
      }

      const result = await db.collection("contacts").findOneAndUpdate(
        { _id: objectId },
        { $set: update },
        { returnDocument: "after" }
      );
      if (!result) return res.status(404).json({ error: "Không tìm thấy khách hàng." });
      const { _id, ...rest } = result;
      return res.json({ success: true, contact: { id: _id.toString(), ...rest } });
    }

    if (req.method === "DELETE") {
      const result = await db.collection("contacts").findOneAndDelete({ _id: objectId });
      if (!result) return res.status(404).json({ error: "Không tìm thấy khách hàng." });
      return res.json({ success: true, message: "Đã xóa thành công." });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err: any) {
    console.error("contacts/[id] error:", err);
    return res.status(500).json({ error: "Lỗi máy chủ.", detail: err?.message });
  }
}

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB } from "../_lib/db";
import ContactModel from "../_lib/ContactModel";
import { requireAuth } from "../_lib/auth";

const ALLOWED_STATUSES = ["Chờ liên hệ", "Đã liên hệ", "Đang thương lượng", "Đã chốt"];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = requireAuth(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  if (!id) return res.status(400).json({ error: "Missing id." });

  await connectDB();

  if (req.method === "PUT") {
    const { status, notes } = req.body ?? {};
    const update: Record<string, string> = {};

    if (status !== undefined) {
      if (!ALLOWED_STATUSES.includes(status)) {
        return res.status(400).json({ error: "Trạng thái không hợp lệ." });
      }
      update.status = status;
    }
    if (notes !== undefined) {
      update.notes = String(notes).slice(0, 5000);
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const contact = await (ContactModel.findByIdAndUpdate as any)(
        id,
        { $set: update },
        { new: true, runValidators: true, lean: true }
      ) as Record<string, unknown> | null;
      if (!contact) return res.status(404).json({ error: "Không tìm thấy khách hàng." });
      const { _id, ...rest } = contact;
      return res.json({ success: true, contact: { id: String(_id), ...rest } });
    } catch (err) {
      console.error("PUT /api/contacts/:id error:", err);
      return res.status(500).json({ error: "Lỗi máy chủ khi cập nhật." });
    }
  }

  if (req.method === "DELETE") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const contact = await (ContactModel.findByIdAndDelete as any)(id) as Record<string, unknown> | null;
      if (!contact) return res.status(404).json({ error: "Không tìm thấy khách hàng." });
      return res.json({ success: true, message: "Đã xóa thành công." });
    } catch (err) {
      console.error("DELETE /api/contacts/:id error:", err);
      return res.status(500).json({ error: "Lỗi máy chủ khi xóa." });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

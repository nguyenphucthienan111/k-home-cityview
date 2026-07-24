import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB } from "../_lib/db";
import ContactModel from "../_lib/ContactModel";
import { requireAuth } from "../_lib/auth";

const ALLOWED_STATUSES = ["Chờ liên hệ", "Đã liên hệ", "Đang thương lượng", "Đã chốt"];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = requireAuth(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { id } = req.query as { id: string };

  await connectDB();

  if (req.method === "PUT") {
    const { status, notes } = req.body;
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
      const contact = await ContactModel.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean();
      if (!contact) return res.status(404).json({ error: "Không tìm thấy khách hàng." });
      const { _id, ...rest } = contact as any;
      return res.json({ success: true, contact: { id: _id.toString(), ...rest } });
    } catch (err) {
      console.error("PUT /api/contacts/:id error:", err);
      return res.status(500).json({ error: "Lỗi máy chủ khi cập nhật." });
    }
  }

  if (req.method === "DELETE") {
    try {
      const contact = await ContactModel.findByIdAndDelete(id);
      if (!contact) return res.status(404).json({ error: "Không tìm thấy khách hàng." });
      return res.json({ success: true, message: "Đã xóa thành công." });
    } catch (err) {
      console.error("DELETE /api/contacts/:id error:", err);
      return res.status(500).json({ error: "Lỗi máy chủ khi xóa." });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

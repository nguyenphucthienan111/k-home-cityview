import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { username, password } = req.body ?? {};
  const adminUser = process.env.ADMIN_USERNAME;
  const adminHash = process.env.ADMIN_PASSWORD_HASH;
  const jwtSecret = process.env.JWT_SECRET;

  if (!adminUser || !adminHash || !jwtSecret) return res.status(500).json({ error: "Lỗi cấu hình máy chủ." });
  if (!username || !password) return res.status(400).json({ error: "Vui lòng nhập tài khoản và mật khẩu." });

  const usernameMatch = String(username).toLowerCase() === adminUser.toLowerCase();
  const passwordMatch = await bcrypt.compare(String(password), adminHash);
  if (!usernameMatch || !passwordMatch) return res.status(401).json({ error: "Tài khoản hoặc mật khẩu không chính xác." });

  const token = jwt.sign({ username: adminUser }, jwtSecret, { expiresIn: "8h" });
  return res.json({ success: true, token });
}

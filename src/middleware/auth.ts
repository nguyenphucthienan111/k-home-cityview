import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  admin?: { username: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Yêu cầu xác thực. Vui lòng đăng nhập." });
    return;
  }

  const token = authHeader.slice(7);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    res.status(500).json({ error: "Lỗi cấu hình máy chủ." });
    return;
  }

  try {
    const payload = jwt.verify(token, secret) as { username: string };
    req.admin = { username: payload.username };
    next();
  } catch {
    res.status(401).json({ error: "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại." });
  }
}

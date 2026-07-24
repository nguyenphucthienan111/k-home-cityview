import type { VercelRequest } from "@vercel/node";
import jwt from "jsonwebtoken";

export function requireAuth(req: VercelRequest): string | null {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.replace("Bearer ", "");
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return null;
    const payload = jwt.verify(token, secret) as { username: string };
    return payload.username;
  } catch {
    return null;
  }
}

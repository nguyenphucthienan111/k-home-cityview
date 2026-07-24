import type { VercelRequest, VercelResponse } from "@vercel/node";
import jwt from "jsonwebtoken";
import { MongoClient } from "mongodb";

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
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const uri = process.env.MONGODB_URI!;
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000, maxPoolSize: 1 });
  try {
    await client.connect();
    const contacts = await client.db().collection("contacts").find({}).sort({ createdAt: -1 }).toArray();
    const mapped = contacts.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest }));
    return res.json(mapped);
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi máy chủ.", detail: err?.message });
  } finally {
    await client.close();
  }
}

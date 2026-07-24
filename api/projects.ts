import type { VercelRequest, VercelResponse } from "@vercel/node";
import { projects } from "./_lib/staticData";

// Static projects data - không cần MongoDB cho public readonly data
// Data được import từ staticData.ts (extracted từ server.ts)
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  // CORS headers  
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (_req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (_req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  return res.json(projects);
}

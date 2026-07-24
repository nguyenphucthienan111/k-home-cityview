import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { projects } = require("./_lib/staticData");
    return res.json(projects);
  } catch (err) {
    console.error("api/projects error:", err);
    return res.status(500).json({ error: String(err) });
  }
}

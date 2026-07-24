import type { VercelRequest, VercelResponse } from "@vercel/node";

// TEMPORARY DEBUG ENDPOINT — DELETE AFTER DEBUGGING
// Checks env vars without exposing secret values
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const uri = process.env.MONGODB_URI || "";
  const jwt = process.env.JWT_SECRET || "";

  // Also try to connect and catch the real error
  let connectError = null;
  let connectSuccess = false;
  try {
    const mongoose = await import("mongoose");
    await mongoose.default.connect(uri);
    connectSuccess = true;
  } catch (e: any) {
    connectError = e?.message || String(e);
  }

  return res.json({
    MONGODB_URI: {
      exists: !!uri,
      length: uri.length,
      startsWithMongodb: uri.startsWith("mongodb"),
      preview: uri.substring(0, 30) + "...",
    },
    JWT_SECRET: { exists: !!jwt, length: jwt.length },
    ADMIN_USERNAME: { exists: !!process.env.ADMIN_USERNAME },
    ADMIN_PASSWORD_HASH: {
      exists: !!process.env.ADMIN_PASSWORD_HASH,
      length: (process.env.ADMIN_PASSWORD_HASH || "").length,
    },
    nodeVersion: process.version,
    mongooseConnect: { success: connectSuccess, error: connectError },
  });
}

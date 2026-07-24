import type { VercelRequest, VercelResponse } from "@vercel/node";

// TEMPORARY DEBUG ENDPOINT — DELETE AFTER DEBUGGING
// Checks env vars without exposing secret values
export default function handler(_req: VercelRequest, res: VercelResponse) {
  const uri = process.env.MONGODB_URI || "";
  const jwt = process.env.JWT_SECRET || "";

  return res.json({
    MONGODB_URI: {
      exists: !!uri,
      length: uri.length,
      startsWithQuote: uri.startsWith('"'),
      endsWithQuote: uri.endsWith('"'),
      startsWithMongodb: uri.startsWith("mongodb"),
      preview: uri.substring(0, 20) + "...",
    },
    JWT_SECRET: {
      exists: !!jwt,
      length: jwt.length,
      startsWithQuote: jwt.startsWith('"'),
    },
    ADMIN_USERNAME: {
      exists: !!process.env.ADMIN_USERNAME,
      value: process.env.ADMIN_USERNAME,
    },
    ADMIN_PASSWORD_HASH: {
      exists: !!process.env.ADMIN_PASSWORD_HASH,
      length: (process.env.ADMIN_PASSWORD_HASH || "").length,
      startsWithDollar: (process.env.ADMIN_PASSWORD_HASH || "").startsWith("$"),
    },
    nodeVersion: process.version,
  });
}

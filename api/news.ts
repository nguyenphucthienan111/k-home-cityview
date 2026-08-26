import type { VercelRequest, VercelResponse } from "@vercel/node";
import { newsData } from "../src/data/newsData.js";

// ─── 301 Redirects: Old news slugs → New news slugs ────────────────
const NEWS_SLUG_REDIRECTS: Record<string, string> = {
  "/tin-tuc/k-home-cityview-la-gi-co-nen-mua-o-that-tai-bien-hoa-2026-khong": "/tin-tuc/k-home-cityview-la-gi-co-nen-mua-o-that-tai-bien-hoa-2026",
  "/tin-tuc/vi-tri-k-home-cityview-bien-hoa-noi-bat-so-voi-cac-du-an-noxh-khac": "/tin-tuc/vi-tri-k-home-cityview-bien-hoa-noi-bat-so-voi-cac-du-an-noxh",
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  const requestPath = req.url || "";
  const newPath = NEWS_SLUG_REDIRECTS[requestPath];
  if (newPath) {
    res.redirect(301, newPath);
    return;
  }

  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
  return res.json(newsData);
}

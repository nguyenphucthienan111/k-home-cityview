/**
 * parse-news.mjs — Tự động đọc src/data/newsData.ts và trả về array metadata
 * Dùng bởi: generate-static-html.mjs và generate-sitemap.mjs
 *
 * Không cần maintain file riêng — mỗi lần thêm bài vào newsData.ts
 * là các script build tự nhận biết ngay.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NEWS_TS   = path.join(__dirname, "../src/data/newsData.ts");

/**
 * Parse src/data/newsData.ts và trả về array:
 * [{ slug, title, date, excerpt }, ...]
 * theo đúng thứ tự trong file (mới nhất trước).
 */
export function parseNewsData() {
  const src = fs.readFileSync(NEWS_TS, "utf-8");

  // Tìm tất cả block object trong newsData array.
  // Mỗi entry bắt đầu bằng `{` và chứa slug, title, date, excerpt.
  // Dùng cách split theo id để tách từng entry an toàn.
  const entries = [];

  // Match từng block: id: "nXX", ... (cho đến block tiếp theo hoặc cuối array)
  // Regex lấy phần từ sau `id: "nXX"` đến trước `id: "nYY"` hoặc `];`
  const blockRegex = /\{\s*\n\s+"?id"?:\s*"n\d+"[\s\S]*?(?=\n\s*\{|\n\];)/g;
  const blocks = src.match(blockRegex) || [];

  for (const block of blocks) {
    const slug    = extractField(block, "slug");
    const title   = extractField(block, "title");
    const date    = extractField(block, "date");
    const excerpt = extractField(block, "excerpt");

    if (slug && title && date && excerpt) {
      entries.push({ slug, title, date, excerpt });
    }
  }

  if (entries.length === 0) {
    throw new Error(
      "parse-news.mjs: Không tìm thấy bài nào trong src/data/newsData.ts. " +
      "Kiểm tra format file có còn đúng không."
    );
  }

  return entries;
}

/** Extract giá trị của field dạng `fieldName: "value"` trong một block text */
function extractField(block, fieldName) {
  // Hỗ trợ cả `"..."` và không có nội dung đặc biệt
  const re = new RegExp(`${fieldName}:\\s*"([^"]*)"`, "s");
  const m  = block.match(re);
  return m ? m[1] : null;
}

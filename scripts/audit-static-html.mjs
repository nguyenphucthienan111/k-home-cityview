import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "../dist");

function checkDir(dir) {
  let results = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (item !== "assets") {
        results = results.concat(checkDir(full));
      }
    } else if (item.endsWith(".html")) {
      const content = fs.readFileSync(full, "utf8");
      const rootMatch = content.match(/<div id="root">([\s\S]*?)<\/div>/);
      const innerLen = rootMatch ? rootMatch[1].trim().length : 0;
      results.push({
        file: full.replace(/\\/g, "/").replace(distDir.replace(/\\/g, "/"), ""),
        size: (content.length / 1024).toFixed(1) + " KB",
        innerLen,
        hasContent: innerLen > 100,
      });
    }
  }
  return results;
}

const audit = checkDir(distDir);
const emptyOnes = audit.filter(a => !a.hasContent);
console.log("==========================================");
console.log("📊 K-HOME STATIC HTML AUDIT REPORT");
console.log("==========================================");
console.log("Tổng số file HTML được kiểm tra:", audit.length);
console.log("Số file ĐÃ CÓ nội dung tĩnh (SSR):", audit.filter(a => a.hasContent).length);
console.log("Số file CHƯA CÓ nội dung tĩnh:    ", emptyOnes.length);

if (emptyOnes.length > 0) {
  console.log("\n❌ CÁC FILE CHƯA CÓ NỘI DUNG TĨNH:");
  emptyOnes.forEach(f => console.log(`  - ${f.file} (${f.size})`));
} else {
  console.log("\n🎉 HOÀN HẢO! 100% TẤT CẢ CÁC FILE HTML ĐỀU CÓ NỘI DUNG TĨNH!");
}
console.log("==========================================");

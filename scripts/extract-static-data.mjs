/**
 * Chạy: node scripts/extract-static-data.mjs
 * Script sẽ đọc server.ts và extract projects + news data vào api/_lib/staticData.ts
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverPath = join(__dirname, "../server.ts");
const outputPath = join(__dirname, "../api/_lib/staticData.ts");

const content = readFileSync(serverPath, "utf8");

// Extract projects block
const projStart = content.indexOf("const projects = [");
const newsStart = content.indexOf("\nconst newsList = [");
if (projStart === -1) throw new Error("Cannot find 'const projects = [' in server.ts");
if (newsStart === -1) throw new Error("Cannot find 'const newsList = [' in server.ts");

const projectsBlock = content.slice(projStart, newsStart).trim();

// Extract news block — ends before "// ─── Public API Routes"
const newsBlockStart = newsStart + 1; // skip leading \n
const newsEnd = content.indexOf("// ─── Public API Routes", newsBlockStart);
if (newsEnd === -1) throw new Error("Cannot find '// ─── Public API Routes' in server.ts");
const newsBlock = content.slice(newsBlockStart, newsEnd).trim();

// Build output
const output = `// Auto-extracted static data from server.ts
// Dùng cho Vercel serverless functions
// Tái tạo bằng: node scripts/extract-static-data.mjs

export ${projectsBlock}

export ${newsBlock}
`;

writeFileSync(outputPath, output, "utf8");
console.log("✅ staticData.ts đã được tạo thành công!");
console.log(`   projects: ${(projectsBlock.match(/slug:/g) || []).length} unit types + projects`);
console.log(`   newsList: ${(newsBlock.match(/id:/g) || []).length} items`);

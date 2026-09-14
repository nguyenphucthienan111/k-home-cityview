/**
 * node scripts/generate-api-functions.mjs
 * Generates api/projects.ts and api/news.ts with data inlined from source files.
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, "..");

// ── Extract projects inner content from src/data/staticProjects.ts ─────────────
const staticProjects = readFileSync(join(root, "src", "data", "staticProjects.ts"), "utf8");
const projOpen = "export const STATIC_PROJECTS: Project[] = [";
const projStart = staticProjects.indexOf(projOpen) + projOpen.length;
let projectsInner = staticProjects.slice(projStart).trimEnd();
if (projectsInner.endsWith("];")) projectsInner = projectsInner.slice(0, -2).trim();
else if (projectsInner.endsWith("]")) projectsInner = projectsInner.slice(0, -1).trim();

// ── Extract news inner content from src/data/newsData.ts ───────────────────────
const newsContent = readFileSync(join(root, "src", "data", "newsData.ts"), "utf8");
const newsOpen = "export const newsData: News[] = [";
const newsStart = newsContent.indexOf(newsOpen) + newsOpen.length;
let newsInner = newsContent.slice(newsStart).trimEnd();
if (newsInner.endsWith("];")) newsInner = newsInner.slice(0, -2).trim();
else if (newsInner.endsWith("]")) newsInner = newsInner.slice(0, -1).trim();

// ── Write api/projects.ts ────────────────────────────────────────────────────
const projectsFile = [
  `import type { VercelRequest, VercelResponse } from "@vercel/node";`,
  ``,
  `// AUTO-GENERATED — run: node scripts/generate-api-functions.mjs`,
  `// Data inlined from src/data/staticProjects.ts — no external imports needed`,
  `const DATA = [`,
  projectsInner,
  `];`,
  ``,
  `export default function handler(_req: VercelRequest, res: VercelResponse) {`,
  `  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");`,
  `  return res.json(DATA);`,
  `}`,
  ``,
].join("\n");

// ── Write api/news.ts ────────────────────────────────────────────────────────
const newsFile = [
  `import type { VercelRequest, VercelResponse } from "@vercel/node";`,
  ``,
  `// AUTO-GENERATED — run: node scripts/generate-api-functions.mjs`,
  `// Data inlined from src/data/newsData.ts — no external imports needed`,
  `const DATA = [`,
  newsInner,
  `];`,
  ``,
  `export default function handler(_req: VercelRequest, res: VercelResponse) {`,
  `  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");`,
  `  return res.json(DATA);`,
  `}`,
  ``,
].join("\n");

writeFileSync(join(root, "api", "projects.ts"), projectsFile, "utf8");
writeFileSync(join(root, "api", "news.ts"),     newsFile,     "utf8");

console.log("✅ api/projects.ts:", Buffer.byteLength(projectsFile), "bytes");
console.log("✅ api/news.ts:    ", Buffer.byteLength(newsFile),     "bytes");


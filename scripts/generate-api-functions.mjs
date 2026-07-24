/**
 * node scripts/generate-api-functions.mjs
 * Generates api/projects.ts and api/news.ts with data inlined — no imports needed.
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, "..");

const server = readFileSync(join(root, "server.ts"), "utf8");

// ── Extract projects inner content ──────────────────────────────────────────
const PROJ_OPEN  = "const projects = [";
const NEWS_OPEN  = "\nconst newsList = [";
const projStart  = server.indexOf(PROJ_OPEN) + PROJ_OPEN.length;
const newsAnchor = server.indexOf(NEWS_OPEN);
let projectsInner = server.slice(projStart, newsAnchor).trimEnd();
if (projectsInner.endsWith("];")) projectsInner = projectsInner.slice(0, -2).trim();
else if (projectsInner.endsWith("]")) projectsInner = projectsInner.slice(0, -1).trim();

// ── Extract news inner content ───────────────────────────────────────────────
const newsStart  = newsAnchor + NEWS_OPEN.length;
// End marker — the comment separator before "Public API Routes"
const newsEndPos = server.indexOf("// ─── Public API Routes", newsStart);
let newsInner    = server.slice(newsStart, newsEndPos).trimEnd();
if (newsInner.endsWith("];")) newsInner = newsInner.slice(0, -2).trim();
else if (newsInner.endsWith("]")) newsInner = newsInner.slice(0, -1).trim();

// ── Write api/projects.ts ────────────────────────────────────────────────────
const projectsFile = [
  `import type { VercelRequest, VercelResponse } from "@vercel/node";`,
  ``,
  `// AUTO-GENERATED — run: node scripts/generate-api-functions.mjs`,
  `// Data inlined from server.ts — no external imports needed`,
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
  `// Data inlined from server.ts — no external imports needed`,
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

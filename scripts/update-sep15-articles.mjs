import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { group1Articles } from './sep15_data/group1_dongnai.mjs';
import { group2Articles } from './sep15_data/group2_cityview.mjs';
import { group3Articles } from './sep15_data/group3_midtown.mjs';
import { group4Articles } from './sep15_data/group4_avenue.mjs';
import { group5Articles } from './sep15_data/group5_skyview.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const all30Articles = [
  ...group1Articles,
  ...group2Articles,
  ...group3Articles,
  ...group4Articles,
  ...group5Articles
];

console.log(`Total Sep 15 articles to update: ${all30Articles.length}`);

// Check IDs
const ids = all30Articles.map(a => a.id);
console.log(`Unique IDs: ${new Set(ids).size}`);
console.log(`ID range: ${ids[0]} -> ${ids[ids.length - 1]}`);

// Check word counts of each article
all30Articles.forEach((art, idx) => {
  const words = art.content.split(/\s+/).filter(Boolean).length;
  console.log(`${idx + 1}. [${art.id}] ${art.slug} (${words} words)`);
});

// Update src/data/newsData.ts
const newsPath = path.join(root, 'src', 'data', 'newsData.ts');
let originalNews = fs.readFileSync(newsPath, 'utf8');

// Find start of n113
const n113Pos = originalNews.indexOf('id: "n113"');
if (n113Pos === -1) {
  console.error('id: "n113" not found in newsData.ts');
  process.exit(1);
}

const n113BracePos = originalNews.lastIndexOf('  {', n113Pos);
if (n113BracePos === -1) {
  console.error("Could not find start of n113 block");
  process.exit(1);
}

// Find start of n104 (the article immediately following n142)
const n104Pos = originalNews.indexOf('id: "n104"');
if (n104Pos === -1) {
  console.error('id: "n104" not found in newsData.ts');
  process.exit(1);
}

const n104BracePos = originalNews.lastIndexOf('  {', n104Pos);
if (n104BracePos === -1) {
  console.error("Could not find start of n104 block");
  process.exit(1);
}

// Format 30 articles as TypeScript code
const articlesTs = all30Articles.map(art => {
  return `  {
    id: ${JSON.stringify(art.id)},
    slug: ${JSON.stringify(art.slug)},
    title: ${JSON.stringify(art.title)},
    date: ${JSON.stringify(art.date)},
    excerpt: ${JSON.stringify(art.excerpt)},
    image: ${JSON.stringify(art.image)},
    category: ${JSON.stringify(art.category)},
    project: ${JSON.stringify(art.project)},
    content: ${JSON.stringify(art.content)},
  },`;
}).join('\n');

const updatedNews = originalNews.slice(0, n113BracePos) + articlesTs + '\n' + originalNews.slice(n104BracePos);

fs.writeFileSync(newsPath, updatedNews, 'utf8');
console.log(`Successfully updated ${all30Articles.length} deep long-form articles from Sep 15 in src/data/newsData.ts!`);

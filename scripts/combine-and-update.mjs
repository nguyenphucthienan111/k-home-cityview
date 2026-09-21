import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { group1Articles } from './article_data/group1_dongnai.mjs';
import { group2Articles } from './article_data/group2_cityview.mjs';
import { group3Articles } from './article_data/group3_midtown.mjs';
import { group4Articles } from './article_data/group4_avenue.mjs';
import { group5Articles } from './article_data/group5_skyview.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const all30Articles = [
  ...group1Articles,
  ...group2Articles,
  ...group3Articles,
  ...group4Articles,
  ...group5Articles
];

console.log(`Total articles to update: ${all30Articles.length}`);

// Check IDs
const ids = all30Articles.map(a => a.id);
console.log(`Unique IDs: ${new Set(ids).size}`);
console.log(`ID range: ${ids[0]} -> ${ids[ids.length - 1]}`);

// Check word counts of each article
all30Articles.forEach((art, idx) => {
  const words = art.content.split(/\s+/).length;
  console.log(`${idx + 1}. [${art.id}] ${art.slug} (${words} words)`);
});

// Update src/data/newsData.ts
const newsPath = path.join(root, 'src', 'data', 'newsData.ts');
let originalNews = fs.readFileSync(newsPath, 'utf8');

// Find insertion boundaries
const marker = 'export const newsData: News[] = [';
const pos = originalNews.indexOf(marker);
if (pos === -1) {
  console.error("Marker not found in newsData.ts");
  process.exit(1);
}

const newlineIndex = originalNews.indexOf('\n', pos);
const startIndex = newlineIndex + 1;

// Find where n113 starts (the first old article)
const endMarker = 'id: "n113"';
const n113Pos = originalNews.indexOf(endMarker);
if (n113Pos === -1) {
  console.error('id: "n113" not found in newsData.ts');
  process.exit(1);
}

// Find the opening brace of n113 block
const bracePos = originalNews.lastIndexOf('  {', n113Pos);
if (bracePos === -1 || bracePos < startIndex) {
  console.error("Could not find start of n113 block");
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

const updatedNews = originalNews.slice(0, startIndex) + articlesTs + '\n' + originalNews.slice(bracePos);

fs.writeFileSync(newsPath, updatedNews, 'utf8');
console.log(`Successfully updated ${all30Articles.length} deep long-form articles in src/data/newsData.ts!`);

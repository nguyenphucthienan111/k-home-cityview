import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { newKeywordArticles } from './new_articles/group_new_keywords.mjs';
import { resolutionLawArticles } from './new_articles/group_resolutions_laws.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const all7 = [
  ...newKeywordArticles,
  ...resolutionLawArticles
];

console.log(`Total new articles to insert: ${all7.length}`);
all7.forEach((a, i) => console.log(`${i+1}. [${a.id}] ${a.title}`));

const newsPath = path.join(root, 'src', 'data', 'newsData.ts');
let originalNews = fs.readFileSync(newsPath, 'utf8');

// Check if n173 already exists
if (originalNews.includes('id: "n173"')) {
  console.log('Notice: id "n173" already exists in newsData.ts. Exiting to avoid duplicate insertion.');
  process.exit(0);
}

const marker = 'export const newsData: News[] = [';
const pos = originalNews.indexOf(marker);
if (pos === -1) {
  console.error("Marker not found in newsData.ts");
  process.exit(1);
}

const newlineIndex = originalNews.indexOf('\n', pos);
const insertPos = newlineIndex + 1;

// Format 7 articles as TypeScript code
const articlesTs = all7.map(art => {
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

const updatedNews = originalNews.slice(0, insertPos) + articlesTs + '\n' + originalNews.slice(insertPos);
fs.writeFileSync(newsPath, updatedNews, 'utf8');
console.log(`Successfully inserted ${all7.length} new articles into src/data/newsData.ts!`);

// Verify new total count
const matches = updatedNews.match(/id:\s*['"][^'"]+['"]/g);
console.log('New total articles count in newsData.ts:', matches ? matches.length : 0);

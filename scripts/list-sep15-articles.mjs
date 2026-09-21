import fs from 'fs';

const content = fs.readFileSync('src/data/newsData.ts', 'utf8');

// Find all articles with date "2026-09-15"
// Let's split by object boundaries
const n113Index = content.indexOf('id: "n113"');
const n142Index = content.indexOf('id: "n142"');
const nextIndex = content.indexOf('id: "n104"');

const block = content.slice(content.lastIndexOf('{', n113Index), content.indexOf('  {', nextIndex));

// Parse each item
const items = [];
const regex = /id:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*date:\s*"([^"]+)",\s*excerpt:\s*"([^"]+)",\s*image:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*project:\s*"([^"]+)",\s*content:\s*"((?:[^"\\]|\\.)*)"/g;

let match;
while ((match = regex.exec(block)) !== null) {
  const [_, id, slug, title, date, excerpt, image, category, project, rawContent] = match;
  const decodedContent = rawContent.replace(/\\n/g, '\n').replace(/\\"/g, '"');
  const wordCount = decodedContent.split(/\s+/).filter(Boolean).length;
  items.push({ id, slug, title, date, excerpt, image, category, project, wordCount, content: decodedContent });
}

console.log(`Found ${items.length} articles from 2026-09-15:`);
items.slice(0, 13).forEach((item, idx) => {
  console.log(`${idx + 1}. [${item.id}] [${item.project}] (${item.wordCount} words)`);
  console.log(`   Title: ${item.title}`);
  console.log(`   Slug: ${item.slug}`);
  console.log(`   Excerpt: ${item.excerpt}`);
});

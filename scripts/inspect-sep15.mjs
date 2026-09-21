import fs from 'fs';

const content = fs.readFileSync('src/data/newsData.ts', 'utf8');

// Parse items
const n113Pos = content.indexOf('id: "n113"');
const n142Pos = content.indexOf('id: "n142"');
// Find end of n142
const nextAfter142 = content.indexOf('id: "n104"', n142Pos);

const sep15Block = content.slice(content.lastIndexOf('  {', n113Pos), nextAfter142 !== -1 ? content.lastIndexOf('  {', nextAfter142) : content.length);

// Extract each article
const articleRegex = /{\s*id:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*date:\s*"([^"]+)",\s*excerpt:\s*"([^"]+)",\s*image:\s*([^,\n]+),\s*category:\s*"([^"]+)",\s*project:\s*"([^"]+)",\s*content:\s*`([^`]+)`\s*}/g;

let match;
let count = 0;
while ((match = articleRegex.exec(sep15Block)) !== null) {
  count++;
  const [_, id, slug, title, date, excerpt, image, category, project, body] = match;
  const words = body.split(/\s+/).length;
  const h2Count = (body.match(/## /g) || []).length;
  const h3Count = (body.match(/### /g) || []).length;
  const hasTable = body.includes('|---|');
  const hasFAQ = body.toLowerCase().includes('faq') || body.toLowerCase().includes('câu hỏi thường gặp');
  const hasGallery = body.includes('---GALLERY---');
  const hasRelated = body.includes('---RELATED---');

  console.log(`${count}. [${id}] [${project}] ${title}`);
  console.log(`   Slug: ${slug}`);
  console.log(`   Words: ${words} | Table: ${hasTable} | FAQ: ${hasFAQ} | Gallery: ${hasGallery} | Related: ${hasRelated}`);
  console.log(`   First 120 chars of body: ${body.substring(0, 120).replace(/\n/g, ' ')}...`);
  console.log('---');
}

console.log(`Total parsed: ${count}`);

import fs from 'fs';
const content = fs.readFileSync('src/data/newsData.ts', 'utf8');
const regex = /id:\s*"([^"]+)",[\s\S]*?date:\s*"([^"]+)"/g;
let match;
const dateGroups = {};
while ((match = regex.exec(content)) !== null) {
  const id = match[1];
  const date = match[2];
  if (!dateGroups[date]) dateGroups[date] = [];
  dateGroups[date].push(id);
}
for (const [date, ids] of Object.entries(dateGroups)) {
  console.log(`${date}: ${ids.length} articles (${ids[0]} -> ${ids[ids.length - 1]})`);
}

const fs = require('fs');
const classified = JSON.parse(fs.readFileSync('all_classified.json', 'utf-8'));

// Normalize line endings to LF for reliable parsing
const rawContent = fs.readFileSync('scripts/generate-task9-explanations.cjs', 'utf-8');
const content = rawContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

// Find rootDictionary boundaries
const startIdx = content.indexOf('const rootDictionary = {');
const endIdx = content.indexOf('\n};\n', startIdx);
if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find rootDictionary boundaries');
  process.exit(1);
}

const dictSection = content.slice(startIdx, endIdx + 4);
const existingKeys = new Set();
const keyMatches = [...dictSection.matchAll(/^\s+['"]([\w-]+)['"]:/gm)];
for (const m of keyMatches) existingKeys.add(m[1]);

console.log('Existing keys:', existingKeys.size);

// Build new entries
const newEntries = [];
for (const [word, info] of Object.entries(classified)) {
  const root = info.root;
  if (!root || root.length < 2 || existingKeys.has(root)) continue;
  
  let line;
  if (info.type === 'alternating') {
    line = `  '${root}': { type: 'alternating', verify: '${info.verify || 'проверьте'}', alternation: '${info.alternation}' }`;
  } else if (info.type === 'foreign' || info.type === 'unverifiable') {
    line = `  '${root}': { type: 'unverifiable', verify: null }`;
  } else {
    line = `  '${root}': { type: 'verifiable', verify: '${info.verify || word}' }`;
  }
  newEntries.push(line);
  existingKeys.add(root);
}

console.log('New entries to add:', newEntries.length);

if (newEntries.length === 0) {
  console.log('No new entries to add');
  process.exit(0);
}

// Insert new entries before the closing };
const insertPos = endIdx + 1; // after the newline before };
const newContent = content.slice(0, insertPos) + '\n' + newEntries.join(',\n') + '\n' + content.slice(insertPos);

// Write back with original line endings (CRLF)
const finalContent = newContent.replace(/\n/g, '\r\n');
fs.writeFileSync('scripts/generate-task9-explanations.cjs', finalContent, 'utf-8');
console.log('Updated generate-task9-explanations.cjs');
console.log('Total entries now:', existingKeys.size);

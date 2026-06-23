const fs = require('fs');
const classified = JSON.parse(fs.readFileSync('all_classified.json', 'utf-8'));

// Normalize line endings to LF for reliable parsing
const rawContent = fs.readFileSync('scripts/generate-task9-explanations.cjs', 'utf-8');
let content = rawContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

// Find rootDictionary boundaries
const startIdx = content.indexOf('const rootDictionary = {');
const endIdx = content.indexOf('\n};\n', startIdx);
if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find rootDictionary boundaries');
  process.exit(1);
}

const dictSection = content.slice(startIdx, endIdx + 4);
const existingKeys = new Set();
const keyMatches = [...dictSection.matchAll(/^\s+['"]([\wа-яёА-ЯЁ-]+)['"]:/gm)];
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
let insertPos = endIdx + 1; // after the newline before };

// Check if previous line ends with comma; if not, add one
let pos = insertPos - 1;
while (pos > 0 && /\s/.test(content[pos])) pos--;
console.log('Debug: pos=', pos, 'char=', JSON.stringify(content[pos]), 'insertPos=', insertPos);
if (pos > 0 && content[pos] !== ',') {
  content = content.slice(0, pos + 1) + ',' + content.slice(pos + 1);
  insertPos++; // adjust for added comma
  console.log('Debug: comma added at pos', pos);
} else {
  console.log('Debug: comma NOT added (char=', JSON.stringify(content[pos]), ')');
}

const newContent = content.slice(0, insertPos) + '\n' + newEntries.join(',\n') + '\n' + content.slice(insertPos);

// Debug: check around the last old entry
const debugIdx = newContent.indexOf('колоссальн');
if (debugIdx !== -1) {
  console.log('Debug newContent around колоссальн:', JSON.stringify(newContent.slice(debugIdx - 5, debugIdx + 50)));
}

// Write back with original line endings (CRLF)
const finalContent = newContent.replace(/\n/g, '\r\n');
const debugIdx2 = finalContent.indexOf('колоссальн');
if (debugIdx2 !== -1) {
  console.log('Debug finalContent around колоссальн:', JSON.stringify(finalContent.slice(debugIdx2 - 5, debugIdx2 + 50)));
}
fs.writeFileSync('scripts/generate-task9-explanations.cjs', finalContent, 'utf-8');
console.log('Updated generate-task9-explanations.cjs');
console.log('Total entries now:', existingKeys.size);

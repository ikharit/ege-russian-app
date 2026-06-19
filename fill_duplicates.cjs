const fs = require('fs');

const content = fs.readFileSync('src/data/sections/dooshin20.ts', 'utf8');

// Step 1: Build map of text -> correctAnswer from questions that already have answers
const answeredMap = new Map();

// Find all question blocks with their IDs, texts, and correctAnswers
const questionPattern = /\{\s*id:\s*'(qd20-\d+)',\s*type:\s*'text',\s*text:\s*'([^']+)',\s*correctAnswer:\s*\[([^\]]*)\]/g;
let match;
while ((match = questionPattern.exec(content)) !== null) {
  const id = match[1];
  const text = match[2];
  const caStr = match[3].trim();
  
  // Skip if it's still a placeholder
  if (caStr.includes("'?'")) continue;
  
  // Parse the correctAnswer array
  const answers = [...caStr.matchAll(/'([^']+)'/g)].map(m => m[1]);
  if (answers.length > 0) {
    answeredMap.set(text, answers);
  }
}

console.log(`Found ${answeredMap.size} unique texts with answers`);

// Step 2: Replace placeholders with answers from the map
let newContent = content;
let replacedCount = 0;

const placeholderPattern = /(\{\s*id:\s*'(qd20-\d+)',\s*type:\s*'text',\s*text:\s*'([^']+)',\s*)correctAnswer:\s*\['\?'\]/g;

while ((match = placeholderPattern.exec(content)) !== null) {
  const fullMatch = match[0];
  const prefix = match[1];
  const id = match[2];
  const text = match[3];
  
  const answers = answeredMap.get(text);
  if (answers) {
    const replacement = `${prefix}correctAnswer: ['${answers.join("', '")}']`;
    newContent = newContent.replace(fullMatch, replacement);
    replacedCount++;
  }
}

fs.writeFileSync('src/data/sections/dooshin20.ts', newContent, 'utf8');
console.log(`Replaced ${replacedCount} placeholder answers`);

// Step 3: Check remaining placeholders
const remaining = [...newContent.matchAll(/id:\s*'(qd20-\d+)'[\s\S]*?correctAnswer:\s*\['\?'\]/g)];
console.log(`Remaining placeholders: ${remaining.length}`);
remaining.forEach(m => console.log(`  ${m[1]}`));

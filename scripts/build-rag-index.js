import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Build RAG knowledge index from existing verified sources
// Sources: theory/*.ts, explanations/*.json, task data files

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const outputDir = path.join(projectRoot, 'public', 'data');
const outputPath = path.join(outputDir, 'knowledge-index.json');

const entries = [];

// === SOURCE 1: Theory rules (task4.ts - task22-26.ts) ===
const theoryDir = path.join(projectRoot, 'src', 'data', 'theory');
const theoryFiles = fs.readdirSync(theoryDir).filter(f => f.endsWith('.ts') && !f.includes('index'));

for (const file of theoryFiles) {
  const content = fs.readFileSync(path.join(theoryDir, file), 'utf8');
  const taskMatch = content.match(/taskNumber:\s*['"](\d+)["']/);
  const taskNumber = taskMatch ? taskMatch[1] : file.match(/task(\d+)/)?.[1] || 'unknown';
  
  // Extract rules using regex
  const ruleMatches = content.matchAll(/\{\s*id:\s*['"]([^'"]+)['"][\s\S]*?content:\s*['"]([^'"]+)['"][\s\S]*?examples:\s*\[([\s\S]*?)\][\s\S]*?tags:\s*\[([^\]]*)\]/g);
  
  for (const match of ruleMatches) {
    const [_, ruleId, content, examplesBlock, tagsBlock] = match;
    const tags = tagsBlock.split(',').map(t => t.trim().replace(/['"]/g, '')).filter(Boolean);
    
    entries.push({
      id: `theory-${taskNumber}-${ruleId}`,
      source: `theory/${file}`,
      taskNumber,
      ruleId,
      content,
      explanation: `Правило: ${content}. Примеры: ${examplesBlock.replace(/\s+/g, ' ').substring(0, 200)}`,
      tags,
      relatedAtoms: tags,
    });
  }
}

// === SOURCE 2: Word explanations (task9-word-explanations.json) ===
const wordExplanationsPath = path.join(projectRoot, 'src', 'data', 'explanations', 'task9-word-explanations.json');
if (fs.existsSync(wordExplanationsPath)) {
  const wordExplanations = JSON.parse(fs.readFileSync(wordExplanationsPath, 'utf8'));
  for (const [word, explanation] of Object.entries(wordExplanations)) {
    // Determine atom type from explanation
    let atomType = 'roots';
    if (explanation.includes('чередующийся')) atomType = 'root_vowel_alternation';
    else if (explanation.includes('непроверяемый')) atomType = 'root_unverifiable';
    else if (explanation.includes('иноязычный')) atomType = 'foreign_words';
    else if (explanation.includes('проверяемый')) atomType = 'root_verifiable';
    
    entries.push({
      id: `word-${word}`,
      source: 'explanations/task9-word-explanations.json',
      taskNumber: '9',
      word,
      content: explanation,
      explanation,
      tags: [atomType, 'task9', 'roots'],
      relatedAtoms: ['task9', atomType],
    });
  }
}

// === SOURCE 3: Generic word explanations (wordExplanations.json) ===
const genericExplanationsPath = path.join(projectRoot, 'src', 'data', 'explanations', 'wordExplanations.json');
if (fs.existsSync(genericExplanationsPath)) {
  const genericExplanations = JSON.parse(fs.readFileSync(genericExplanationsPath, 'utf8'));
  for (const [word, explanation] of Object.entries(genericExplanations)) {
    // Try to infer task number from explanation content
    let taskNumber = '9';
    if (explanation.includes('приставк')) taskNumber = '10';
    else if (explanation.includes('суффикс')) taskNumber = '11';
    else if (explanation.includes('окончани')) taskNumber = '12';
    else if (explanation.includes('НЕ') || explanation.includes('НИ')) taskNumber = '13';
    else if (explanation.includes('предлог')) taskNumber = '14';
    
    entries.push({
      id: `word-generic-${word}`,
      source: 'explanations/wordExplanations.json',
      taskNumber,
      word,
      content: explanation,
      explanation,
      tags: ['generic', `task${taskNumber}`],
      relatedAtoms: [`task${taskNumber}`],
    });
  }
}

// === SOURCE 4: Task-specific word explanations (task4, task5, task10-16) ===
const taskFiles = [
  { file: 'task4-word-explanations.json', task: '4', key: 'accents' },
  { file: 'task5-word-explanations.json', task: '5', key: 'paronyms' },
  { file: 'task10-word-explanations.json', task: '10', key: 'pre-pri' },
  { file: 'task11-word-explanations.json', task: '11', key: 'suffixes' },
  { file: 'task12-word-explanations.json', task: '12', key: 'participles' },
  { file: 'task13-word-explanations.json', task: '13', key: 'ne-ni' },
  { file: 'task14-word-explanations.json', task: '14', key: 'spelling' },
  { file: 'task15-word-explanations.json', task: '15', key: 'punctuation' },
  { file: 'task16-word-explanations.json', task: '16', key: 'complex-sentences' },
];

for (const { file, task } of taskFiles) {
  const filePath = path.join(projectRoot, 'src', 'data', 'explanations', file);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    for (const [category, words] of Object.entries(data)) {
      for (const [word, explanation] of Object.entries(words)) {
        entries.push({
          id: `word-${task}-${word}`,
          source: `explanations/${file}`,
          taskNumber: task,
          word,
          content: explanation,
          explanation,
          tags: [category, `task${task}`],
          relatedAtoms: [`task${task}`, category],
        });
      }
    }
  }
}

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write index
fs.writeFileSync(outputPath, JSON.stringify(entries, null, 2));

console.log(`Built knowledge index: ${entries.length} entries`);
console.log(`  - Theory rules: ${entries.filter(e => e.source.startsWith('theory')).length}`);
console.log(`  - Word explanations (task9): ${entries.filter(e => e.source === 'explanations/task9-word-explanations.json').length}`);
console.log(`  - Generic explanations: ${entries.filter(e => e.source === 'explanations/wordExplanations.json').length}`);
console.log(`Output: ${outputPath}`);

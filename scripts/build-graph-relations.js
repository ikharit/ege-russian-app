import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const nodes = new Map();
const edges = [];

function addNode(id, type, label, extra = {}) {
  if (!nodes.has(id)) {
    nodes.set(id, { id, type, label, ...extra });
  }
}

function addEdge(source, target, relation) {
  edges.push({ source, target, relation });
}

// 1. Load knowledge index
const indexPath = path.join(projectRoot, 'public', 'data', 'knowledge-index.json');
const entries = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

for (const entry of entries) {
  const taskId = `task:${entry.taskNumber}`;
  addNode(taskId, 'task', `Задание ${entry.taskNumber}`);

  if (entry.word) {
    const wordId = `word:${entry.word}`;
    addNode(wordId, 'word', entry.word, { taskNumber: entry.taskNumber });
    addEdge(wordId, taskId, 'belongs_to_task');

    for (const atom of entry.relatedAtoms || []) {
      const atomId = `atom:${atom}`;
      addNode(atomId, 'atom', atom);
      addEdge(wordId, atomId, 'has_atom');
      addEdge(atomId, taskId, 'belongs_to_task');
    }
  }

  if (entry.ruleId) {
    const ruleId = `rule:${entry.ruleId}`;
    addNode(ruleId, 'rule', entry.ruleId, { source: entry.source });
    addEdge(ruleId, taskId, 'governs');
    for (const atom of entry.relatedAtoms || []) {
      addEdge(ruleId, `atom:${atom}`, 'references_atom');
    }
  }
}

// 2. Read questionMapping.ts for cross-links
const mappingPath = path.join(projectRoot, 'src', 'data', 'questionMapping.ts');
const mappingContent = fs.readFileSync(mappingPath, 'utf8');

// Extract manual mappings: 'word:xxx:taskN': { ... questionIds: ['q1', 'q2'] ... }
const mappingRegex = /'word:([^']+):task(\d+)':\s*\{[\s\S]*?questionIds:\s*\[([^\]]*)\]/g;
let match;
while ((match = mappingRegex.exec(mappingContent)) !== null) {
  const word = match[1];
  const task = match[2];
  const questionIds = match[3].split(',').map(s => s.trim().replace(/['"]/g, '')).filter(Boolean);
  const wordId = `word:${word}`;
  addNode(wordId, 'word', word, { taskNumber: task });
  addNode(`task:${task}`, 'task', `Задание ${task}`);
  addEdge(wordId, `task:${task}`, 'belongs_to_task');
  for (const qid of questionIds) {
    const qId = `question:${qid}`;
    addNode(qId, 'question', qid);
    addEdge(wordId, qId, 'has_question');
    addEdge(qId, `task:${task}`, 'belongs_to_task');
  }
  // Extract atomIds if present
  const atomMatch = match[0].match(/atomIds:\s*\[([^\]]*)\]/);
  if (atomMatch) {
    const atomIds = atomMatch[1].split(',').map(s => s.trim().replace(/['"]/g, '')).filter(Boolean);
    for (const aid of atomIds) {
      const atomId = `atom:${aid}`;
      addNode(atomId, 'atom', aid);
      addEdge(wordId, atomId, 'has_atom');
    }
  }
}

// 3. Read atoms.ts for parent-child relationships
const atomsPath = path.join(projectRoot, 'src', 'data', 'atomization', 'atoms.ts');
const atomsContent = fs.readFileSync(atomsPath, 'utf8');

// Extract all atoms
const atomDefRegex = /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)'/g;
while ((match = atomDefRegex.exec(atomsContent)) !== null) {
  const id = match[1];
  const name = match[2];
  addNode(`atom:${id}`, 'atom', name);
}

// Extract parentAtom relationships
const parentRegex = /id:\s*'([^']+)'[\s\S]*?parentAtom:\s*'([^']+)'/g;
while ((match = parentRegex.exec(atomsContent)) !== null) {
  const child = match[1];
  const parent = match[2];
  addEdge(`atom:${child}`, `atom:${parent}`, 'is_child_of');
}

// 4. Write output
const output = {
  nodes: Array.from(nodes.values()),
  edges,
  meta: {
    generatedAt: new Date().toISOString(),
    nodeCount: nodes.size,
    edgeCount: edges.length,
    sources: ['knowledge-index.json', 'questionMapping.ts', 'atoms.ts']
  }
};

const outputDir = path.join(projectRoot, 'public', 'data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
const outputPath = path.join(outputDir, 'graph-relations.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log(`Built graph relations: ${nodes.size} nodes, ${edges.length} edges`);
console.log(`  - Tasks: ${Array.from(nodes.values()).filter(n => n.type === 'task').length}`);
console.log(`  - Words: ${Array.from(nodes.values()).filter(n => n.type === 'word').length}`);
console.log(`  - Rules: ${Array.from(nodes.values()).filter(n => n.type === 'rule').length}`);
console.log(`  - Atoms: ${Array.from(nodes.values()).filter(n => n.type === 'atom').length}`);
console.log(`  - Questions: ${Array.from(nodes.values()).filter(n => n.type === 'question').length}`);
console.log(`Output: ${outputPath}`);

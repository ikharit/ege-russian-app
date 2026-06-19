import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const indexPath = path.join(projectRoot, 'public', 'data', 'knowledge-index.json');
const explanationsDir = path.join(projectRoot, 'src', 'data', 'explanations');
const theoryDir = path.join(projectRoot, 'src', 'data', 'theory');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

function log(level, msg) {
  const c = level === 'error' ? colors.red : level === 'warn' ? colors.yellow : level === 'success' ? colors.green : colors.blue;
  console.log(c + msg + colors.reset);
}

const errors = [];
const warnings = [];

// 1. Load index
if (!fs.existsSync(indexPath)) {
  log('error', `❌ Index not found: ${indexPath}`);
  process.exit(1);
}

const entries = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
log('info', `📚 Loaded ${entries.length} entries from knowledge-index.json`);

// 2. Check required fields
const requiredFields = ['id', 'source', 'taskNumber', 'content', 'explanation', 'tags', 'relatedAtoms'];
for (const entry of entries) {
  for (const field of requiredFields) {
    if (entry[field] === undefined || entry[field] === null || entry[field] === '') {
      errors.push(`Missing field "${field}" in entry "${entry.id || '(no id)'}"`);
    }
  }
}

// 3. Check task number consistency
for (const entry of entries) {
  const source = entry.source || '';
  const taskNum = entry.taskNumber || '';
  
  // Extract expected task number from source filename
  const match = source.match(/task(\d+)/);
  if (match && match[1] !== taskNum) {
    errors.push(`Task number mismatch: source "${source}" suggests task ${match[1]}, but entry has "${taskNum}" (id: ${entry.id})`);
  }
}

// 4. Contradiction detection
const contradictionPairs = [
  ['проверяемый', 'непроверяемый'],
  ['чередующийся', 'проверяемый'],
  ['чередующийся', 'непроверяемый'],
];

for (const entry of entries) {
  const content = (entry.content + ' ' + entry.explanation).toLowerCase();
  for (const [a, b] of contradictionPairs) {
    if (content.includes(a) && content.includes(b)) {
      warnings.push(`Contradiction in entry "${entry.id}": contains both "${a}" and "${b}"`);
    }
  }
}

// 5. Orphan check: every source must exist
for (const entry of entries) {
  const source = entry.source;
  let exists = false;
  
  if (source.startsWith('explanations/')) {
    const file = source.replace('explanations/', '');
    exists = fs.existsSync(path.join(explanationsDir, file));
  } else if (source.startsWith('theory/')) {
    const file = source.replace('theory/', '');
    exists = fs.existsSync(path.join(theoryDir, file));
  }
  
  if (!exists) {
    warnings.push(`Orphaned entry "${entry.id}": source "${source}" not found`);
  }
}

// 6. Duplicate IDs
const idCounts = {};
for (const entry of entries) {
  idCounts[entry.id] = (idCounts[entry.id] || 0) + 1;
}
for (const [id, count] of Object.entries(idCounts)) {
  if (count > 1) {
    errors.push(`Duplicate ID: "${id}" appears ${count} times`);
  }
}

// 7. JSON validity of source files
if (fs.existsSync(explanationsDir)) {
  const files = fs.readdirSync(explanationsDir).filter(f => f.endsWith('.json'));
  for (const file of files) {
    try {
      JSON.parse(fs.readFileSync(path.join(explanationsDir, file), 'utf8'));
    } catch (e) {
      errors.push(`Invalid JSON in ${file}: ${e.message}`);
    }
  }
}

// 8. Statistics
const perTask = {};
const perSource = {};
for (const entry of entries) {
  perTask[entry.taskNumber] = (perTask[entry.taskNumber] || 0) + 1;
  perSource[entry.source] = (perSource[entry.source] || 0) + 1;
}

console.log('');
log('info', '=== 📊 RAG Validation Report ===');
console.log('');
log('info', `Total entries: ${entries.length}`);
log('info', 'Entries per task:');
for (const [task, count] of Object.entries(perTask).sort()) {
  console.log(`  Задание ${task}: ${count} записей`);
}
console.log('');
log('info', 'Entries per source:');
for (const [source, count] of Object.entries(perSource).sort()) {
  console.log(`  ${source}: ${count} записей`);
}
console.log('');

if (errors.length > 0) {
  log('error', `❌ Errors (${errors.length}):`);
  for (const e of errors) {
    log('error', `  - ${e}`);
  }
}

if (warnings.length > 0) {
  log('warn', `⚠️ Warnings (${warnings.length}):`);
  for (const w of warnings) {
    log('warn', `  - ${w}`);
  }
}

console.log('');
if (errors.length === 0 && warnings.length === 0) {
  log('success', '✅ All checks passed! RAG data is valid.');
  process.exit(0);
} else if (errors.length === 0) {
  log('warn', '⚠️ RAG Validation: ' + entries.length + ' entries, 0 errors, ' + warnings.length + ' warnings');
  process.exit(0);
} else {
  log('error', '❌ RAG Validation: ' + entries.length + ' entries, ' + errors.length + ' errors, ' + warnings.length + ' warnings');
  process.exit(1);
}

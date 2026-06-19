import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const issues = [];

function addIssue(file, location, severity, message, suggestion) {
  issues.push({ file, location, severity, message, suggestion });
}

console.log('🔍 RAG Data Quality Audit — Full Scan\n');

// === 1. LOAD THEORY RULES ===
const theoryDir = path.join(projectRoot, 'src', 'data', 'theory');
const theoryRules = {};

for (const file of fs.readdirSync(theoryDir).filter(f => f.endsWith('.ts') && !f.includes('index'))) {
  const content = fs.readFileSync(path.join(theoryDir, file), 'utf8');
  const taskMatch = content.match(/taskNumber:\s*['"]([\d-]+)['"]/);
  const taskNumber = taskMatch ? taskMatch[1] : file.match(/task([\d-]+)/)?.[1] || 'unknown';
  
  const rules = [];
  const ruleMatches = content.matchAll(/\{\s*id:\s*['"]([^'"]+)['"][\s\S]*?content:\s*['"]([^'"]+)['"][\s\S]*?tags:\s*\[([^\]]*)\]/g);
  for (const match of ruleMatches) {
    const [_, id, content, tags] = match;
    rules.push({ id, content, tags: tags.split(',').map(t => t.trim().replace(/['"]/g, '')).filter(Boolean) });
  }
  theoryRules[taskNumber] = rules;
}

console.log(`📚 Loaded theory rules: ${Object.keys(theoryRules).length} task files`);
for (const [task, rules] of Object.entries(theoryRules)) {
  console.log(`   Task ${task}: ${rules.length} rules`);
}

// === 2. CHECK wordExplanations.json ===
console.log('\n--- Checking wordExplanations.json ---');
const wordExpPath = path.join(projectRoot, 'src', 'data', 'explanations', 'wordExplanations.json');
if (fs.existsSync(wordExpPath)) {
  const wordExplanations = JSON.parse(fs.readFileSync(wordExpPath, 'utf8'));
  
  for (const [word, explanation] of Object.entries(wordExplanations)) {
    const exp = explanation;
    
    // Check 1: Contradictions in the same explanation
    if (exp.includes('проверяемый') && exp.includes('чередующийся')) {
      addIssue('wordExplanations.json', `word: "${word}"`, 'error', 
        `Explanation claims both 'проверяемый' and 'чередующийся' for the same word`,
        'Determine the correct type and fix the explanation');
    }
    
    // Check 2: If says 'проверяемый', check word must share root
    if (exp.includes('проверяемый')) {
      const checkMatch = exp.match(/однокоренное[:\s]+(\S+)/);
      if (checkMatch) {
        const checkWord = checkMatch[1].toLowerCase().replace(/[,.!?]$/, '');
        const wordRoot = word.toLowerCase().replace(/[аеёиоуыэюя]/g, '').replace(/[^а-яё]/g, '');
        const checkRoot = checkWord.replace(/[аеёиоуыэюя]/g, '').replace(/[^а-яё]/g, '');
        
        if (wordRoot.length > 2 && checkRoot.length > 2 && wordRoot !== checkRoot) {
          addIssue('wordExplanations.json', `word: "${word}"`, 'warning',
            `Marked as 'проверяемый' but check word '${checkWord}' has different root (${checkRoot} vs ${wordRoot}) — likely чередование`,
            `Change to 'чередующийся' with pattern like "${wordRoot}/${checkRoot}"`);
        }
      }
    }
    
    // Check 3: If says 'чередующийся', should mention alternation pattern
    if (exp.includes('чередующийся') && !exp.match(/[еиыоа]/)) {
      addIssue('wordExplanations.json', `word: "${word}"`, 'warning',
        `Marked as 'чередующийся' but no vowel alternation pattern found`,
        'Add the alternation pattern (e.g., е/и, а/о)');
    }
    
    // Check 4: If says 'иноязычный', should not have 'проверяемый'
    if (exp.includes('иноязычный') && /\bпроверяемый\b/.test(exp)) {
      addIssue('wordExplanations.json', `word: "${word}"`, 'error',
        `Foreign words cannot be 'проверяемый' — they are always 'непроверяемый'`,
        'Remove "проверяемый" and mark as "непроверяемый, иноязычный"');
    }
  }
  console.log(`   Checked ${Object.keys(wordExplanations).length} entries, found ${issues.filter(i => i.file === 'wordExplanations.json').length} issues`);
}

// === 3. CHECK task9-word-explanations.json ===
console.log('\n--- Checking task9-word-explanations.json ---');
const task9ExpPath = path.join(projectRoot, 'src', 'data', 'explanations', 'task9-word-explanations.json');
if (fs.existsSync(task9ExpPath)) {
  const task9Explanations = JSON.parse(fs.readFileSync(task9ExpPath, 'utf8'));
  
  for (const [word, explanation] of Object.entries(task9Explanations)) {
    const exp = explanation;
    
    // Same checks as above
    if (exp.includes('проверяемый') && exp.includes('чередующийся')) {
      addIssue('task9-word-explanations.json', `word: "${word}"`, 'error',
        `Both 'проверяемый' and 'чередующийся' in explanation`);
    }
    
    if (exp.includes('проверяемый')) {
      const checkMatch = exp.match(/однокоренное[:\s]+(\S+)/);
      if (checkMatch) {
        const checkWord = checkMatch[1].toLowerCase().replace(/[,.!?]$/, '');
        const wordRoot = word.toLowerCase().replace(/[аеёиоуыэюя]/g, '').replace(/[^а-яё]/g, '');
        const checkRoot = checkWord.replace(/[аеёиоуыэюя]/g, '').replace(/[^а-яё]/g, '');
        
        if (wordRoot.length > 2 && checkRoot.length > 2 && wordRoot !== checkRoot) {
          addIssue('task9-word-explanations.json', `word: "${word}"`, 'warning',
            `Check word '${checkWord}' has different root (${checkRoot} vs ${wordRoot})`);
        }
      }
    }
    
    if (exp.includes('иноязычный') && exp.includes('проверяемый')) {
      addIssue('task9-word-explanations.json', `word: "${word}"`, 'error',
        `Foreign word marked as 'проверяемый'`);
    }
  }
  console.log(`   Checked ${Object.keys(task9Explanations).length} entries, found ${issues.filter(i => i.file === 'task9-word-explanations.json').length} issues`);
}

// === 4. CHECK dooshin questions (task9-12) ===
console.log('\n--- Checking dooshin question data ---');
const dooshinDir = path.join(projectRoot, 'src', 'data', 'sections', 'dooshin');
if (fs.existsSync(dooshinDir)) {
  for (const file of fs.readdirSync(dooshinDir).filter(f => f.endsWith('.ts'))) {
    const content = fs.readFileSync(path.join(dooshinDir, file), 'utf8');
    const taskMatch = file.match(/task(\d+)/);
    const taskNum = taskMatch ? taskMatch[1] : 'unknown';
    
    // Extract questions
    const questionMatches = content.matchAll(/\{\s*id:\s*['"]([^'"]+)['"][\s\S]*?text:\s*['"]([^'"]+)['"][\s\S]*?correctAnswer:\s*\[([^\]]*)\][\s\S]*?explanation:\s*['"]([^'"]+)['"]/g);
    
    let checked = 0;
    for (const match of questionMatches) {
      const [_, id, text, correctAnswer, explanation] = match;
      checked++;
      
      // Check: explanation should not be generic "Проверьте правописание"
      if (explanation === 'Проверьте правописание.' || explanation === 'Проверьте правописание') {
        addIssue(file, `question ${id}`, 'warning',
          `Generic explanation — no specific rule referenced`,
          'Add specific explanation linking to theory rule');
      }
      
      // Check: correctAnswer should match the blanks in text
      const blankCount = (text.match(/[_]/g) || []).length;
      const answerCount = correctAnswer.split(',').length;
      if (blankCount !== answerCount) {
        addIssue(file, `question ${id}`, 'error',
          `Blank count (${blankCount}) doesn't match answer count (${answerCount})`,
          `Text: "${text}" | Answers: [${correctAnswer}]`);
      }
    }
    
    if (checked > 0) {
      const fileIssues = issues.filter(i => i.file === file);
      console.log(`   ${file}: ${checked} questions, ${fileIssues.length} issues`);
    }
  }
}

// === 5. CHECK theory/*.ts rules ===
console.log('\n--- Checking theory rules ---');
for (const [taskNum, rules] of Object.entries(theoryRules)) {
  for (const rule of rules) {
    // Check: rule content should not be empty or too short
    if (rule.content.length < 20) {
      addIssue(`theory/task${taskNum}.ts`, `rule ${rule.id}`, 'warning',
        `Rule content is too short (${rule.content.length} chars)`,
        'Add more detailed explanation');
    }
    
    // Check: should have relatedAtoms or tags
    if (rule.tags.length === 0) {
      addIssue(`theory/task${taskNum}.ts`, `rule ${rule.id}`, 'warning',
        `Rule has no tags`);
    }
  }
}

// === 6. CHECK sections atoms ===
console.log('\n--- Checking section atoms ---');
const sectionsDir = path.join(projectRoot, 'src', 'data', 'sections');
for (const file of fs.readdirSync(sectionsDir).filter(f => f.endsWith('.ts'))) {
  const content = fs.readFileSync(path.join(sectionsDir, file), 'utf8');
  
  // Check if atoms reference correct task numbers
  const atomsMatches = content.matchAll(/atoms:\s*\[([^\]]*)\]/g);
  for (const match of atomsMatches) {
    const atoms = match[1].split(',').map(a => a.trim().replace(/['"]/g, '')).filter(Boolean);
    
    for (const atom of atoms) {
      if (atom.startsWith('task') && atom.match(/^task\d+$/)) {
        // Check if task number exists in theory
        const taskNum = atom.replace('task', '');
        if (!theoryRules[taskNum]) {
          addIssue(file, `atoms: [${atoms.join(', ')}]`, 'warning',
            `Atom references task ${taskNum} but no theory rules found for that task`,
            `Add theory/task${taskNum}.ts or check atom name`);
        }
      }
    }
  }
}

// === 7. CHECK section files for missing atoms ===
console.log('\n--- Checking questions for missing atoms ---');
for (const file of fs.readdirSync(sectionsDir).filter(f => f.endsWith('.ts'))) {
  const content = fs.readFileSync(path.join(sectionsDir, file), 'utf8');
  
  // Find questions without atoms
  const questionBlocks = content.matchAll(/\{\s*id:\s*['"]([^'"]+)['"][\s\S]*?correctAnswer:[\s\S]*?\}/g);
  for (const match of questionBlocks) {
    const block = match[0];
    if (!block.includes('atoms:')) {
      addIssue(file, `question ${match[1]}`, 'warning',
        `Question has no 'atoms' field — theory won't be shown on wrong answer`,
        'Add atoms: ["taskN", "atom_name"]');
    }
  }
}

// === REPORT ===
console.log('\n' + '='.repeat(60));
console.log('📊 AUDIT REPORT');
console.log('='.repeat(60));

const errors = issues.filter(i => i.severity === 'error');
const warnings = issues.filter(i => i.severity === 'warning');

console.log(`\n❌ Errors: ${errors.length}`);
console.log(`⚠️  Warnings: ${warnings.length}`);
console.log(`📁 Files affected: ${new Set(issues.map(i => i.file)).size}`);

if (errors.length > 0) {
  console.log('\n--- ERRORS (must fix) ---');
  for (const issue of errors) {
    console.log(`\n  [${issue.file}] ${issue.location}`);
    console.log(`  ❌ ${issue.message}`);
    if (issue.suggestion) console.log(`  💡 ${issue.suggestion}`);
  }
}

if (warnings.length > 0) {
  console.log('\n--- WARNINGS (should fix) ---');
  for (const issue of warnings.slice(0, 20)) { // Show first 20
    console.log(`\n  [${issue.file}] ${issue.location}`);
    console.log(`  ⚠️  ${issue.message}`);
    if (issue.suggestion) console.log(`  💡 ${issue.suggestion}`);
  }
  if (warnings.length > 20) {
    console.log(`\n  ... and ${warnings.length - 20} more warnings`);
  }
}

// Save report to file
const reportPath = path.join(projectRoot, 'rag-audit-report.json');
fs.writeFileSync(reportPath, JSON.stringify({ 
  timestamp: new Date().toISOString(),
  summary: { errors: errors.length, warnings: warnings.length, files: new Set(issues.map(i => i.file)).size },
  issues 
}, null, 2));
console.log(`\n💾 Full report saved to: ${reportPath}`);

// Exit with error code if errors found
if (errors.length > 0) {
  console.log(`\n⛔ Found ${errors.length} errors. Fix them before proceeding.`);
  process.exit(1);
} else if (warnings.length > 0) {
  console.log(`\n✅ No errors, but ${warnings.length} warnings to address.`);
  process.exit(0);
} else {
  console.log('\n✅ All data passed validation!');
  process.exit(0);
}

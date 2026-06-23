/**
 * audit-questions.js
 * Скрипт автоматического аудита всех заданий в приложении.
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');

// Шаблонные explanation
const TEMPLATE_PATTERNS = [
  /Проверяемый\/непроверяемый\/чередующийся/,
  /Подберите однокоренное/,
  /Требует проверки/,
];

function findTsFiles(dir, pattern) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findTsFiles(fullPath, pattern));
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      const relPath = path.relative(PROJECT_ROOT, fullPath);
      if (pattern.test(relPath)) {
        results.push(relPath);
      }
    }
  }
  
  return results;
}

function extractQuestions(filePath, content) {
  const questions = [];
  
  // Regex for question objects
  const regex = /\{[^}]*?id:\s*["']([^"']+)["'][^}]*?type:\s*["']([^"']+)["'][^}]*?text:\s*["']([^"']*?)["'][^}]*?correctAnswer:\s*(\[[^\]]*\])[^}]*?explanation:\s*["']([^"']*?)["'][^}]*?\}/g;
  
  let match;
  while ((match = regex.exec(content)) !== null) {
    questions.push({
      id: match[1],
      type: match[2],
      text: match[3],
      correctAnswer: match[4],
      explanation: match[5],
      file: filePath,
    });
  }
  
  return questions;
}

function isTemplateExplanation(explanation) {
  return TEMPLATE_PATTERNS.some(pattern => pattern.test(explanation));
}

function runAudit() {
  console.log('🔍 Аудит заданий...\n');
  
  // Find all potential question files
  const sectionFiles = findTsFiles(path.join(SRC_DIR, 'data', 'sections'), /\.(ts)$/);
  const atomizationFiles = findTsFiles(path.join(SRC_DIR, 'data', 'atomization'), /\.(ts)$/);
  const taskFiles = findTsFiles(path.join(SRC_DIR, 'data'), /task.*Questions\.ts$/);
  
  const allFiles = [...new Set([...sectionFiles, ...atomizationFiles, ...taskFiles])];
  
  console.log(`Найдено файлов: ${allFiles.length}\n`);
  
  const allQuestions = [];
  const idMap = new Map();
  const textMap = new Map();
  const issues = [];
  
  for (const file of allFiles) {
    const fullPath = path.join(PROJECT_ROOT, file);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const questions = extractQuestions(file, content);
    
    if (questions.length > 0) {
      console.log(`  ${file}: ${questions.length} вопросов`);
    }
    
    for (const q of questions) {
      allQuestions.push(q);
      
      // Check uniqueness
      if (idMap.has(q.id)) {
        issues.push({
          type: 'DUPLICATE_ID',
          id: q.id,
          file1: idMap.get(q.id).file,
          file2: q.file,
          text: q.text,
        });
      } else {
        idMap.set(q.id, q);
      }
      
      // Group by text
      if (!textMap.has(q.text)) textMap.set(q.text, []);
      textMap.get(q.text).push(q);
      
      // Check empty/placeholder answers
      if (q.correctAnswer === '[]' || q.correctAnswer === '["?"]' || q.correctAnswer === "['?']") {
        issues.push({
          type: 'EMPTY_ANSWER',
          id: q.id,
          file: q.file,
          text: q.text,
        });
      }
      
      // Check template explanation
      if (isTemplateExplanation(q.explanation)) {
        issues.push({
          type: 'TEMPLATE_EXPLANATION',
          id: q.id,
          file: q.file,
          text: q.text,
          explanation: q.explanation,
        });
      }
      
      // Check very short explanation
      if (q.explanation.length < 10) {
        issues.push({
          type: 'SHORT_EXPLANATION',
          id: q.id,
          file: q.file,
          text: q.text,
          explanation: q.explanation,
        });
      }
    }
  }
  
  // Check text duplicates with different answers
  const duplicateTexts = [];
  for (const [text, qs] of textMap) {
    if (qs.length > 1) {
      const answers = new Set(qs.map(q => q.correctAnswer));
      if (answers.size > 1) {
        duplicateTexts.push({ text, questions: qs });
      }
    }
  }
  
  // Report
  console.log(`\n📊 Всего вопросов: ${allQuestions.length}`);
  console.log(`Уникальных ID: ${idMap.size}`);
  console.log(`Дубликатов по ID: ${issues.filter(i => i.type === 'DUPLICATE_ID').length}`);
  console.log(`Пустых/placeholder ответов: ${issues.filter(i => i.type === 'EMPTY_ANSWER').length}`);
  console.log(`Шаблонных explanation: ${issues.filter(i => i.type === 'TEMPLATE_EXPLANATION').length}`);
  console.log(`Слишком коротких explanation: ${issues.filter(i => i.type === 'SHORT_EXPLANATION').length}`);
  console.log(`Текстов с разными ответами: ${duplicateTexts.length}`);
  
  // Save report
  const report = {
    total: allQuestions.length,
    uniqueIds: idMap.size,
    issues: issues,
    duplicateTexts: duplicateTexts.map(d => ({
      text: d.text.substring(0, 100),
      ids: d.questions.map(q => q.id),
      answers: [...new Set(d.questions.map(q => q.correctAnswer))],
    })),
  };
  
  const reportPath = path.join(PROJECT_ROOT, 'audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
  
  console.log(`\n📄 Полный отчёт: ${reportPath}`);
  
  // Print critical issues
  if (issues.length > 0) {
    console.log(`\n⚠️ Найдено проблем: ${issues.length}`);
    
    const emptyAnswers = issues.filter(i => i.type === 'EMPTY_ANSWER');
    if (emptyAnswers.length > 0) {
      console.log(`\n❌ Пустые ответы (${emptyAnswers.length}):`);
      emptyAnswers.slice(0, 10).forEach(i => console.log(`  ${i.id}: ${i.text.substring(0, 50)}`));
      if (emptyAnswers.length > 10) console.log(`  ... и ещё ${emptyAnswers.length - 10}`);
    }
    
    const templates = issues.filter(i => i.type === 'TEMPLATE_EXPLANATION');
    if (templates.length > 0) {
      console.log(`\n📝 Шаблонные explanation (${templates.length}):`);
      templates.slice(0, 10).forEach(i => console.log(`  ${i.id}: ${i.explanation.substring(0, 80)}`));
      if (templates.length > 10) console.log(`  ... и ещё ${templates.length - 10}`);
    }
    
    const dupIds = issues.filter(i => i.type === 'DUPLICATE_ID');
    if (dupIds.length > 0) {
      console.log(`\n🔁 Дубликаты ID (${dupIds.length}):`);
      dupIds.slice(0, 10).forEach(i => console.log(`  ${i.id}: ${i.file1} ↔ ${i.file2}`));
      if (dupIds.length > 10) console.log(`  ... и ещё ${dupIds.length - 10}`);
    }
    
    if (duplicateTexts.length > 0) {
      console.log(`\n📋 Тексты с разными ответами (${duplicateTexts.length}):`);
      duplicateTexts.slice(0, 10).forEach(d => {
        console.log(`  "${d.text.substring(0, 60)}..."`);
        d.questions.forEach(q => console.log(`    ${q.id}: ${q.correctAnswer}`));
      });
      if (duplicateTexts.length > 10) console.log(`  ... и ещё ${duplicateTexts.length - 10}`);
    }
  } else {
    console.log('\n✅ Проблем не найдено!');
  }
}

runAudit();

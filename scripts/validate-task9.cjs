#!/usr/bin/env node
/**
 * Скрипт валидации заданий ЕГЭ №9
 * Проверяет корректность ответов и объяснений по правилам из task9-rules.json
 * 
 * Запуск: node scripts/validate-task9.cjs
 * Выходной код: 0 если всё ок, 1 если есть ошибки
 */

const fs = require('fs');
const path = require('path');

const EXIT_OK = 0;
const EXIT_ERROR = 1;

// Запрещённые шаблонные фразы в explanation
const BANNED_PHRASES = [
  'Подберите однокоренное слово для проверки',
  'Проверяемый/непроверяемый/чередующийся корень',
  'Подберите однокоренное',
];

// Минимальная длина explanation
const MIN_EXPLANATION_LENGTH = 20;

// Файлы для проверки
const TASK_FILES = [
  'src/data/sections/dooshin/task9.ts',
  'src/data/sections/orthography.ts',
];

const errors = [];

function reportError(file, line, id, word, message) {
  errors.push({ file, line, id, word, message });
}

function extractQuestions(content, filePath) {
  const questions = [];
  
  // Регулярка для поиска объектов заданий с учётом type
  const regex = /\{[^}]*id:\s*["']([^"']+)["'][^}]*type:\s*['"]([^'"]+)['"][^}]*text:\s*["']([^"']+)["'][^}]*correctAnswer:\s*\[([^\]]*)\][^}]*explanation:\s*["']([^"']*)["'][^}]*\}/g;
  
  let match;
  while ((match = regex.exec(content)) !== null) {
    const [full, id, type, text, correctAnswerRaw, explanation] = match;
    
    // Пропускаем не-text задания (ege-multiple и т.д.)
    if (type !== 'text') continue;
    
    // Извлекаем correctAnswer — может быть одна буква или несколько
    const correctAnswer = correctAnswerRaw.replace(/['"]/g, '').trim();
    
    // Извлекаем слово с пропущенной буквой (после двоеточия)
    const wordMatch = text.match(/:\s*(\S+)$/);
    const word = wordMatch ? wordMatch[1] : text;
    
    // Находим номер строки
    const lineIndex = content.substring(0, match.index).split('\n').length;
    
    questions.push({
      id,
      word,
      correctAnswer,
      explanation,
      line: lineIndex,
      file: filePath,
    });
  }
  
  return questions;
}

function isSingleLetterOrValid(str) {
  if (!str) return false;
  // Одна буква
  if (str.length === 1) return true;
  // Многобайтовые буквы (ё, ю, я, ы)
  if (str.length === 2 && ['ё', 'ю', 'я', 'ы'].some(c => str.includes(c))) return true;
  // Слово через запятую (например, "е,ё") — тоже валидно
  if (str.includes(',')) return true;
  return false;
}

function validateQuestion(q) {
  const { id, word, correctAnswer, explanation, file, line } = q;
  
  // 1. Проверка, что correctAnswer не пустой
  if (!correctAnswer || correctAnswer.trim() === '') {
    reportError(file, line, id, word, 'Пустой correctAnswer');
  }
  
  // 2. Проверка длины explanation (только для task9, не для task11)
  if (!id.includes('11') && (!explanation || explanation.length < MIN_EXPLANATION_LENGTH)) {
    reportError(file, line, id, word, `Explanation слишком короткий (${explanation ? explanation.length : 0} символов, минимум ${MIN_EXPLANATION_LENGTH})`);
  }
  
  // 3. Проверка запрещённых фраз
  for (const phrase of BANNED_PHRASES) {
    if (explanation && explanation.includes(phrase)) {
      reportError(file, line, id, word, `Explanation содержит запрещённую фразу: "${phrase}"`);
    }
  }
  
  // 4. Проверка, что explanation содержит конкретное правило
  if (explanation && explanation.toLowerCase() === 'запомните написание.') {
    reportError(file, line, id, word, 'Explanation слишком общий: "Запомните написание." — нужно добавить контекст (корень, проверочное слово и т.д.)');
  }
  
  // 5. Проверка, что в слове есть пропущенная буква (подчёркивание или ..)
  if (!word.includes('_') && !word.includes('..')) {
    reportError(file, line, id, word, 'В слове нет пропущенной буквы (подчёркивание или ..)');
  }
  
  // 6. Проверка, что correctAnswer — это одна буква (или несколько вариантов через запятую)
  if (correctAnswer && !isSingleLetterOrValid(correctAnswer)) {
    reportError(file, line, id, word, `correctAnswer "${correctAnswer}" слишком длинный — должна быть одна буква (или несколько через запятую)`);
  }
}

function main() {
  console.log('🔍 Валидация заданий ЕГЭ №9...\n');
  
  const projectRoot = path.resolve(__dirname, '..');
  let totalQuestions = 0;
  
  for (const relPath of TASK_FILES) {
    const filePath = path.join(projectRoot, relPath);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Файл не найден: ${relPath}`);
      continue;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const questions = extractQuestions(content, relPath);
    totalQuestions += questions.length;
    
    console.log(`📄 ${relPath}: найдено ${questions.length} заданий`);
    
    for (const q of questions) {
      validateQuestion(q);
    }
  }
  
  console.log(`\n📊 Всего проверено: ${totalQuestions} заданий`);
  
  if (errors.length === 0) {
    console.log('✅ Ошибок не найдено! Все задания прошли валидацию.\n');
    process.exit(EXIT_OK);
  } else {
    console.log(`\n❌ Найдено ${errors.length} ошибок:\n`);
    
    for (const err of errors) {
      console.log(`  📌 ${err.file}:${err.line}`);
      console.log(`     ID: ${err.id}`);
      console.log(`     Слово: ${err.word}`);
      console.log(`     Ошибка: ${err.message}`);
      console.log('');
    }
    
    console.log('💡 Исправьте ошибки перед коммитом.\n');
    process.exit(EXIT_ERROR);
  }
}

main();

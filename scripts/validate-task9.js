#!/usr/bin/env node
/**
 * Скрипт валидации заданий ЕГЭ №9
 * Проверяет корректность ответов и объяснений по правилам из task9-rules.json
 * 
 * Запуск: node scripts/validate-task9.js
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
  'src/data/task9Questions.ts',
];

const errors = [];

function reportError(file, line, id, word, message) {
  errors.push({ file, line, id, word, message });
}

function extractQuestions(content, filePath) {
  const questions = [];
  const lines = content.split('\n');
  
  // Регулярка для поиска объектов заданий
  // Пример: { id: "qd9-1", type: 'text', text: 'Впишите...', correctAnswer: ["и"], explanation: '...' }
  const regex = /\{[^}]*id:\s*["']([^"']+)["'][^}]*text:\s*["']([^"']+)["'][^}]*correctAnswer:\s*\[["']([^"']*)["']\][^}]*explanation:\s*["']([^"']*)["'][^}]*\}/g;
  
  let match;
  while ((match = regex.exec(content)) !== null) {
    const [full, id, text, correctAnswer, explanation] = match;
    // Извлекаем слово с пропущенной буквой
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

function validateQuestion(q) {
  const { id, word, correctAnswer, explanation, file, line } = q;
  
  // 1. Проверка, что correctAnswer не пустой
  if (!correctAnswer || correctAnswer.trim() === '') {
    reportError(file, line, id, word, 'Пустой correctAnswer');
  }
  
  // 2. Проверка длины explanation
  if (!explanation || explanation.length < MIN_EXPLANATION_LENGTH) {
    reportError(file, line, id, word, `Explanation слишком короткий (${explanation ? explanation.length : 0} символов, минимум ${MIN_EXPLANATION_LENGTH})`);
  }
  
  // 3. Проверка запрещённых фраз
  for (const phrase of BANNED_PHRASES) {
    if (explanation && explanation.includes(phrase)) {
      reportError(file, line, id, word, `Explanation содержит запрещённую фразу: "${phrase}"`);
    }
  }
  
  // 4. Проверка, что explanation содержит конкретное правило
  // (не просто "Запомните написание" без контекста)
  if (explanation && explanation.toLowerCase() === 'запомните написание.') {
    reportError(file, line, id, word, 'Explanation слишком общий: "Запомните написание." — нужно добавить контекст (корень, проверочное слово и т.д.)');
  }
  
  // 5. Проверка, что в слове есть пропущенная буква (подчёркивание)
  if (!word.includes('_')) {
    reportError(file, line, id, word, 'В слове нет пропущенной буквы (подчёркивание)');
  }
  
  // 6. Проверка, что correctAnswer — это одна буква
  if (correctAnswer && correctAnswer.length > 1 && !['ё', 'ю', 'я', 'ы'].includes(correctAnswer)) {
    // Допускаем ё, ю, я, ы как многобайтовые, но не слова
    if (correctAnswer.length > 2) {
      reportError(file, line, id, word, `correctAnswer "${correctAnswer}" слишком длинный — должна быть одна буква`);
    }
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

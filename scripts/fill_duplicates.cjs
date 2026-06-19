/**
 * fill_duplicates.cjs
 * Заполняет correctAnswer для дублирующихся вопросов в dooshin20.ts,
 * копируя ответы из уже заполненных оригиналов.
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'sections', 'dooshin20.ts');

const content = fs.readFileSync(filePath, 'utf-8');

// Извлекаем все вопросы из файла
const questionRegex = /\{\s*id:\s*'([^']+)',\s*type:\s*'text',\s*text:\s*'([^']+)',\s*correctAnswer:\s*(\[[^\]]*\]),\s*explanation:\s*'([^']+)'/g;

const questions = [];
let match;
while ((match = questionRegex.exec(content)) !== null) {
  questions.push({
    id: match[1],
    text: match[2],
    correctAnswer: match[3],
    explanation: match[4]
  });
}

// Строим карту: text -> correctAnswer (берём только ответы, не равные ['?'])
const textToAnswer = {};
const textToExplanation = {};
for (const q of questions) {
  if (q.correctAnswer !== "['?']" && q.correctAnswer !== "[]") {
    if (!textToAnswer[q.text]) {
      textToAnswer[q.text] = q.correctAnswer;
      textToExplanation[q.text] = q.explanation;
    }
  }
}

// Заменяем ['?'] на правильные ответы для дубликатов
let newContent = content;
let replaced = 0;

for (const q of questions) {
  if (q.correctAnswer === "['?']" && textToAnswer[q.text]) {
    const oldPattern = `id: '${q.id}', type: 'text', text: '${q.text}', correctAnswer: ['?'], explanation: 'Требует проверки'`;
    const newPattern = `id: '${q.id}', type: 'text', text: '${q.text}', correctAnswer: ${textToAnswer[q.text]}, explanation: '${textToExplanation[q.text]}'`;
    
    if (newContent.includes(oldPattern)) {
      newContent = newContent.replace(oldPattern, newPattern);
      replaced++;
      console.log(`✅ ${q.id}: ${textToAnswer[q.text]}`);
    }
  }
}

fs.writeFileSync(filePath, newContent, 'utf-8');
console.log(`\nВсего замен: ${replaced}`);
console.log(`Файл сохранён: ${filePath}`);

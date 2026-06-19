const fs = require('fs');
const path = require('path');
const wordExplanations = JSON.parse(fs.readFileSync('C:/Users/USER/Documents/kimi/workspace/ege-russian-app/src/data/explanations/wordExplanations.json', 'utf-8'));

function extractWord(text, correctAnswer) {
  const match = text.match(/([а-яёА-ЯЁ]+_[а-яёА-ЯЁ]+)/i);
  if (!match) return null;
  const wordWithUnderscore = match[1];
  if (correctAnswer.length > 0) {
    return wordWithUnderscore.replace('_', correctAnswer[0].toLowerCase());
  }
  return null;
}

function generateTask9Explanation(word) {
  const lowerWord = word.toLowerCase();
  if (wordExplanations[lowerWord]) {
    return wordExplanations[lowerWord];
  }
  return 'Проверяемый/непроверяемый/чередующийся корень. Подберите однокоренное слово для проверки: «' + word + '».';
}

function generateExplanation(text, correctAnswer, atoms) {
  const word = extractWord(text, correctAnswer);
  if (!word) {
    return 'Проверьте правописание.';
  }
  if (atoms && atoms.includes('task9')) {
    return generateTask9Explanation(word);
  }
  return 'Проверьте правописание: «' + word + '».';
}

// Test with actual file content
const content = fs.readFileSync('C:/Users/USER/Documents/kimi/workspace/ege-russian-app/src/data/sections/dooshin/task9.ts', 'utf-8');
const questionRegex = /(\{ id: "qd\d+-\d+", type: 'text', text: '[^']+', correctAnswer: \[[^\]]+\], explanation: )'([^']+)'/g;

let count = 0;
let changed = 0;
const newContent = content.replace(questionRegex, (match, prefix, oldExplanation) => {
  const idMatch = match.match(/id: "(qd\d+-\d+)"/);
  const textMatch = match.match(/text: '([^']+)'/);
  const answerMatch = match.match(/correctAnswer: \[([^\]]+)\]/);
  const atomsMatch = match.match(/atoms: \[([^\]]+)\]/);

  if (!idMatch || !textMatch || !answerMatch) return match;

  const id = idMatch[1];
  const text = textMatch[1];
  const answer = answerMatch[1].replace(/['"]/g, '').trim().split(',').map(s => s.trim());
  const atoms = atomsMatch ? atomsMatch[1].replace(/['"]/g, '').split(',').map(s => s.trim()) : [];

  const newExplanation = generateExplanation(text, answer, atoms);
  count++;
  
  if (count === 1) {
    console.log('ID:', id);
    console.log('Old:', oldExplanation);
    console.log('New:', newExplanation);
    console.log('Equal:', newExplanation === oldExplanation);
  }
  
  if (newExplanation !== oldExplanation) {
    changed++;
  }

  return prefix + "'" + newExplanation + "'";
});

console.log('Total:', count, 'Changed:', changed);
console.log('Content changed:', newContent !== content);

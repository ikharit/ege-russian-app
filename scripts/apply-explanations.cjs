const fs = require('fs');
const path = require('path');

// Load word-specific explanations
const wordExplanationsPath = path.join(__dirname, '../src/data/explanations/wordExplanations.json');
const wordExplanations = fs.existsSync(wordExplanationsPath) 
  ? JSON.parse(fs.readFileSync(wordExplanationsPath, 'utf-8'))
  : {};

// Inline explanation engine logic (CommonJS version)
function extractWord(text, correctAnswer) {
  const match = text.match(/([а-яёА-ЯЁ]+_[а-яёА-ЯЁ]+)/i);
  if (!match) return null;
  const wordWithUnderscore = match[1];
  if (correctAnswer.length > 0) {
    return wordWithUnderscore.replace('_', correctAnswer[0].toLowerCase());
  }
  return null;
}

const prefixRules = [
  { pattern: /^преди/, prefix: 'преди-', description: 'ПРЕДИ- = перед (редко)' },
  { pattern: /^пред/, prefix: 'пред-', description: 'ПРЕД- = перед чем-то, заранее' },
  { pattern: /^пре/, prefix: 'пре-', description: 'ПРЕ- = высшая степень, торжественность или близко к ПЕРЕ-' },
  { pattern: /^при/, prefix: 'при-', description: 'ПРИ- = приближение, неполнота, доведение до конца' },
  { pattern: /^пере/, prefix: 'пере-', description: 'ПЕРЕ- = через, заново, избыток' },
  { pattern: /^про/, prefix: 'про-', description: 'ПРО- = прохождение, проверка' },
  { pattern: /^подо/, prefix: 'подо-', description: 'ПОДО- = перед глухой согласной (редко)' },
  { pattern: /^под/, prefix: 'под-', description: 'ПОД- = перед гласной или звонкой согласной' },
  { pattern: /^по/, prefix: 'по-', description: 'ПО- = неполнота, начало, окончание' },
  { pattern: /^пра/, prefix: 'пра-', description: 'ПРА- = степень родства, предок' },
  { pattern: /^раз/, prefix: 'раз-', description: 'РАЗ- = без ударения, перед глухой' },
  { pattern: /^рас/, prefix: 'рас-', description: 'РАС- = без ударения, перед глухой' },
  { pattern: /^роз/, prefix: 'роз-', description: 'РОЗ- = под ударением' },
  { pattern: /^рос/, prefix: 'рос-', description: 'РОС- = под ударением' },
  { pattern: /^без/, prefix: 'без-', description: 'БЕЗ- = перед звонкой согласной' },
  { pattern: /^бес/, prefix: 'бес-', description: 'БЕС- = перед глухой согласной' },
  { pattern: /^воз/, prefix: 'воз-', description: 'ВОЗ- = перед звонкой согласной' },
  { pattern: /^вос/, prefix: 'вос-', description: 'ВОС- = перед глухой согласной' },
  { pattern: /^взо/, prefix: 'взо-', description: 'ВЗО- = перед звонкой согласной (краткая форма ВОЗ-)' },
  { pattern: /^вз/, prefix: 'вз-', description: 'ВЗ- = перед звонкой согласной (краткая форма ВОЗ-)' },
  { pattern: /^через/, prefix: 'через-', description: 'ЧЕРЕЗ- = перед глухой согласной' },
  { pattern: /^черес/, prefix: 'черес-', description: 'ЧЕРЕС- = перед глухой согласной' },
  { pattern: /^чрез/, prefix: 'чрез-', description: 'ЧРЕЗ- = перед звонкой согласной' },
  { pattern: /^чрес/, prefix: 'чрес-', description: 'ЧРЕС- = перед глухой согласной' },
  { pattern: /^низ/, prefix: 'низ-', description: 'НИЗ- = под ударением' },
  { pattern: /^обо/, prefix: 'обо-', description: 'ОБО- = перед глухой согласной (редко)' },
  { pattern: /^об/, prefix: 'об-', description: 'ОБ- = перед гласной или звонкой согласной' },
  { pattern: /^ото/, prefix: 'ото-', description: 'ОТО- = перед глухой согласной (редко)' },
  { pattern: /^от/, prefix: 'от-', description: 'ОТ- = перед гласной или звонкой согласной' },
  { pattern: /^съ/, prefix: 'съ-', description: 'СЪ- = перед е, ё, ю, я' },
  { pattern: /^со/, prefix: 'со-', description: 'СО- = перед глухой согласной или сонорной' },
  { pattern: /^с[аио]/, prefix: 'с-', description: 'С- = перед согласной' },
  { pattern: /^въ/, prefix: 'въ-', description: 'ВЪ- = перед е, ё, ю, я' },
  { pattern: /^во/, prefix: 'во-', description: 'ВО- = перед глухой согласной или сонорной' },
  { pattern: /^в[аио]/, prefix: 'в-', description: 'В- = перед согласной' },
  { pattern: /^изо/, prefix: 'изо-', description: 'ИЗО- = перед глухой согласной (редко)' },
  { pattern: /^из/, prefix: 'из-', description: 'ИЗ- = перед гласной или звонкой согласной' },
  { pattern: /^ис/, prefix: 'ис-', description: 'ИС- = перед глухой согласной' },
  { pattern: /^недо/, prefix: 'недо-', description: 'НЕДО- = недостаточность' },
  { pattern: /^не/, prefix: 'не-', description: 'НЕ- = отрицание' },
  { pattern: /^зао/, prefix: 'зао-', description: 'ЗАО- = редкая форма' },
  { pattern: /^за/, prefix: 'за-', description: 'ЗА- = начало действия, закрытие' },
  { pattern: /^нао/, prefix: 'нао-', description: 'НАО- = редкая форма' },
  { pattern: /^на/, prefix: 'на-', description: 'НА- = направление, накопление' },
  { pattern: /^до/, prefix: 'до-', description: 'ДО- = доведение до конца' },
  { pattern: /^у/, prefix: 'у-', description: 'У- = удаление, усиление' },
  { pattern: /^о/, prefix: 'о-', description: 'О- = обращение, окончание' },
  { pattern: /^межи/, prefix: 'межи-', description: 'МЕЖИ- = между (редко)' },
  { pattern: /^меж/, prefix: 'меж-', description: 'МЕЖ- = между' },
  { pattern: /^к/, prefix: 'ко-', description: 'КО- = краткая форма (ко перед глухой)' },
  { pattern: /^т/, prefix: 'т-', description: 'Т- = редкая форма' },
  { pattern: /^ш/, prefix: 'ш-', description: 'Ш- = редкая форма' },
  { pattern: /^ж/, prefix: 'ж-', description: 'Ж- = редкая форма' },
  { pattern: /^м/, prefix: 'м-', description: 'М- = редкая форма' },
  { pattern: /^з/, prefix: 'з-', description: 'З- = редкая форма' },
  { pattern: /^ч/, prefix: 'ч-', description: 'Ч- = редкая форма' },
  { pattern: /^н/, prefix: 'н-', description: 'Н- = редкая форма' },
  { pattern: /^п/, prefix: 'п-', description: 'П- = редкая форма' },
  { pattern: /^в/, prefix: 'в-', description: 'В- = редкая форма' },
  { pattern: /^б/, prefix: 'б-', description: 'Б- = редкая форма' },
  { pattern: /^с/, prefix: 'с-', description: 'С- = редкая форма' },
];

function detectPrefix(word) {
  for (const { pattern, prefix, description } of prefixRules) {
    if (pattern.test(word)) {
      return { prefix, description };
    }
  }
  return null;
}

function generateTask10Explanation(word) {
  const prefixInfo = detectPrefix(word);
  if (prefixInfo) {
    return 'Приставка ' + prefixInfo.prefix + ' ' + prefixInfo.description;
  }
  return 'Проверьте правописание приставки в слове «' + word + '».';
}

function generateTask9Explanation(word) {
  const lowerWord = word.toLowerCase();
  if (wordExplanations[lowerWord]) {
    return wordExplanations[lowerWord];
  }
  return 'Проверяемый/непроверяемый/чередующийся корень. Подберите однокоренное слово для проверки: «' + word + '».';
}

function generateTask11Explanation(word) {
  const lowerWord = word.toLowerCase();
  if (wordExplanations[lowerWord]) {
    return wordExplanations[lowerWord];
  }
  return 'Проверьте правописание суффикса в слове «' + word + '».';
}

function generateTask12Explanation(word) {
  const lowerWord = word.toLowerCase();
  if (wordExplanations[lowerWord]) {
    return wordExplanations[lowerWord];
  }
  return 'Проверьте окончание/суффикс в слове «' + word + '».';
}

function generateExplanation(text, correctAnswer, atoms) {
  const word = extractWord(text, correctAnswer);
  if (!word) {
    return 'Проверьте правописание.';
  }
  if (atoms && atoms.includes('task10')) {
    return generateTask10Explanation(word);
  }
  if (atoms && atoms.includes('task9')) {
    return generateTask9Explanation(word);
  }
  if (atoms && atoms.includes('task11')) {
    return generateTask11Explanation(word);
  }
  if (atoms && atoms.includes('task12')) {
    return generateTask12Explanation(word);
  }
  return 'Проверьте правописание: «' + word + '».';
}

// Process dooshin files
const dir = path.join(__dirname, '../src/data/sections/dooshin');
const files = fs.readdirSync(dir).filter(f => f.startsWith('task'));

let totalQuestions = 0;
let changedQuestions = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Find all questions and replace explanations
  const questionRegex = /(\{ id: "qd\d+-\d+", type: 'text', text: '[^']+', correctAnswer: \[[^\]]+\], explanation: )'([^']+)'([^}]*)\}/g;

  let newContent = content.replace(questionRegex, (match, prefix, oldExplanation, suffix) => {
    // Extract question data from the match
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
    totalQuestions++;
    if (newExplanation !== oldExplanation) {
      changedQuestions++;
    }

    return prefix + "'" + newExplanation + "'" + suffix + '}';
  });

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log('Updated:', file);
  }
}

console.log('Total questions:', totalQuestions);
console.log('Changed explanations:', changedQuestions);

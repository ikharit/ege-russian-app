const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../src/data/sections/dooshin/task9.ts');
let content = fs.readFileSync(filePath, 'utf-8');

const ALTERNATIONS = {
  'раст': { pattern: 'рос/раст/ращ', check: 'расти' },
  'гор': { pattern: 'гар/гор', check: 'гореть' },
  'мак': { pattern: 'мак/моч', check: 'мочить' },
  'плав': { pattern: 'плав/плов', check: 'плавать' },
  'плов': { pattern: 'плав/плов', check: 'плавать' },
  'лаг': { pattern: 'лаг/лож', check: 'ложить' },
  'лож': { pattern: 'лаг/лож', check: 'ложить' },
  'дир': { pattern: 'дир/дра', check: 'драть' },
  'жиг': { pattern: 'жиг/жег', check: 'жечь' },
  'жег': { pattern: 'жиг/жег', check: 'жечь' },
  'мер': { pattern: 'мир/мер', check: 'умереть' },
  'тер': { pattern: 'тир/тер', check: 'тереть' },
  'тир': { pattern: 'тир/тер', check: 'тереть' },
  'пер': { pattern: 'пир/пер', check: 'переть' },
  'пир': { pattern: 'пир/пер', check: 'переть' },
  'блист': { pattern: 'блист/блест', check: 'блестеть' },
  'блест': { pattern: 'блист/блест', check: 'блестеть' },
  'бер': { pattern: 'бер/бир', check: 'беречь' },
  'бир': { pattern: 'бер/бир', check: 'беречь' },
  'бира': { pattern: 'бер/бир', check: 'брать' },
  'стел': { pattern: 'стил/стел', check: 'стелить' },
  'скак': { pattern: 'скак/скоч', check: 'скакать' },
  'скоч': { pattern: 'скак/скоч', check: 'скакать' },
  'зар': { pattern: 'зар/зор', check: 'заря' },
  'плат': { pattern: 'плот/плат', check: 'плоть' },
  'плот': { pattern: 'плот/плат', check: 'плоть' },
  'чит': { pattern: 'чит/чет', check: 'читать' },
  'чет': { pattern: 'чит/чет', check: 'читать' },
  'гляд': { pattern: 'гляд/глян', check: 'глядеть' },
  'глян': { pattern: 'гляд/глян', check: 'глядеть' },
  'мир': { pattern: 'мир/мер', check: 'умереть' },
};

let totalChanges = 0;

// 1. Исправление чередующихся корней, ошибочно помеченных как "проверяемый"
const regexProv = new RegExp(
  "explanation: 'Корень -([^-]+)- \\(проверяемый\\)\\. Проверьте через однокоренное: ([^']+)\\.",
  'g'
);

content = content.replace(regexProv, (match, root, checkWord) => {
  const rootLower = root.toLowerCase();
  for (const [altRoot, info] of Object.entries(ALTERNATIONS)) {
    if (rootLower.includes(altRoot)) {
      totalChanges++;
      return `explanation: 'Корень -${root}- (чередующийся). Чередование: ${info.pattern} (проверьте через: ${info.check}).`;
    }
  }
  return match;
});

// 2. Исправление "(проверяемый)" + "чередование" в одной строке (mixed)
const regexMixed = new RegExp(
  "explanation: 'Корень -([^-]+)- \\(проверяемый\\)\\. (Чередование: [^']+)'",
  'g'
);

content = content.replace(regexMixed, (match, root, altPart) => {
  totalChanges++;
  return `explanation: 'Корень -${root}- (чередующийся). ${altPart}`;
});

// 3. Исправление самопроверки (check word = само слово)
// Найти: text: 'Впишите пропущенную букву: X_Y', correctAnswer: ["Z"], explanation: '... Проверьте через однокоренное: XYZ.'
const lines = content.split('\n');
let newLines = [];

for (const line of lines) {
  let modified = line;
  
  const textMatch = line.match(/text:\s*'Впишите пропущенную букву:\s*(\S+)'/);
  const answerMatch = line.match(/correctAnswer:\s*\["([^"]+)"\]/);
  const checkMatch = line.match(/Проверьте через однокоренное:\s*(\S+)/);
  
  if (textMatch && answerMatch && checkMatch) {
    const wordWithGap = textMatch[1];
    const answer = answerMatch[1];
    const fullWord = wordWithGap.replace('_', answer).toLowerCase().replace(/[.,]/g, '');
    const checkWord = checkMatch[1].toLowerCase().replace(/[.,]/g, '');
    
    if (fullWord === checkWord) {
      const rootMatch = line.match(/Корень\s+-([^-]+)-/);
      if (rootMatch) {
        const root = rootMatch[1].toLowerCase();
        for (const [altRoot, info] of Object.entries(ALTERNATIONS)) {
          if (root.includes(altRoot)) {
            modified = line.replace(
              /Проверьте через однокоренное:\s*\S+/,
              `Чередование: ${info.pattern} (проверьте через: ${info.check})`
            );
            totalChanges++;
            break;
          }
        }
      }
    }
  }
  
  newLines.push(modified);
}

content = newLines.join('\n');

fs.writeFileSync(filePath, content, 'utf-8');
console.log(`\u2705 Всего замен: ${totalChanges}`);

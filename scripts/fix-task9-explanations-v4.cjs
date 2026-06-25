const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../src/data/sections/dooshin/task9.ts');
let content = fs.readFileSync(filePath, 'utf-8');

const CHECK_MAP = {
  'тир/тер': 'тереть',
  'стил/стел': 'стелить',
  'рос/раст/ращ': 'расти',
  'жиг/жег': 'жечь',
  'мак/моч': 'мочить',
  'бер/бир': 'беречь',
  'плов/плыв': 'плыть',
  'лаг/лож': 'ложить',
  'скак/скоч': 'скакать',
  'жег/жиг': 'жечь',
};

let totalChanges = 0;

for (const [pattern, checkWord] of Object.entries(CHECK_MAP)) {
  const regex = new RegExp(
    `Чередование: ${pattern.replace(/\//g, '\\/')} \(проверьте через: проверьте\)`,
    'g'
  );
  const newStr = `Чередование: ${pattern} (проверьте через: ${checkWord})`;
  const newContent = content.replace(regex, newStr);
  if (newContent !== content) {
    const count = (content.match(regex) || []).length;
    totalChanges += count;
    content = newContent;
  }
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log(`\u2705 Всего замен 'проверьте': ${totalChanges}`);

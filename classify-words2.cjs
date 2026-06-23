const fs = require('fs');

const words = JSON.parse(fs.readFileSync('ege-russian-app/generic_words.json', 'utf-8'));
const content = fs.readFileSync('ege-russian-app/scripts/generate-task9-explanations.cjs', 'utf-8');

// Parse existing rootDictionary - each line ends with },
const dictMatch = content.match(/const rootDictionary = \{([\s\S]*?)\n\};/);
if (!dictMatch) {
  console.error('Could not find rootDictionary');
  process.exit(1);
}

const dictLinesRaw = dictMatch[1].split('\n');
const existing = {};
for (const line of dictLinesRaw) {
  // Match lines like:   'root': { type: '...', verify: '...' },
  const m = line.match(/^\s+['"]([^'"]+)['"]:\s*\{([^}]+)\},?\s*$/);
  if (m) {
    const key = m[1];
    const val = m[2];
    const typeM = val.match(/type:\s*['"]([^'"]+)['"]/);
    const verifyM = val.match(/verify:\s*['"]([^'"]*)['"]/);
    const altM = val.match(/alternation:\s*['"]([^'"]+)['"]/);
    existing[key] = {
      type: typeM ? typeM[1] : 'verifiable',
      verify: verifyM ? verifyM[1] : null,
      alternation: altM ? altM[1] : undefined
    };
  }
}

console.log('Existing entries:', Object.keys(existing).length);

// Classification rules
const knownForeignRoots = [
  'территор', 'уровен', 'монолог', 'вазелин', 'навигац', 'коррект', 'утоп', 'гениал', 'коллекцион', 'паломничеств', 'карниз', 'митинг', 'трамвай', 'павильон', 'портрет', 'либерал', 'индивид', 'дефицит', 'манифест', 'пессимист', 'брошюр', 'оранжер', 'бетон', 'анчоус', 'президент', 'терап', 'конференц', 'информ', 'организац', 'акварель', 'суверенитет', 'абитуриент', 'меридиан', 'новелл', 'конкурент', 'энциклопед', 'привилег', 'цивилизац', 'цитат', 'реценз', 'компан', 'томительн', 'петербургск', 'велосипед', 'циклическ', 'цилиндр', 'декларац', 'экзаменатор', 'пессимизм', 'универ', 'аннотац', 'трафарет', 'полемичн', 'виртуальн', 'стилист', 'престиж', 'ароматн', 'колоссальн', 'деликатес', 'офицер', 'менталитет', 'мажор', 'циклон', 'социальн', 'демократ', 'уникальн', 'героическ', 'тревог', 'укреплен', 'демонстрир', 'фигурир', 'тростник', 'тренир', 'продолжен', 'абонемент', 'конфорк', 'громад', 'фантаст', 'традиц', 'тенденциоз', 'вертикальн', 'анализ', 'результат', 'конкрет', 'системат', 'лимит', 'ориентиров', 'классицист', 'пейзаж', 'программ', 'корифей', 'цистерн', 'панцир', 'аккомпанир', 'аналогичн', 'конфликт', 'инженер', 'впечатл', 'трущоб', 'моратор', 'офицерск', 'веществен', 'юнош', 'сонет', 'жираф', 'мажорн', 'симптом', 'минерал', 'робот', 'робаст', 'робот', 'робот', 'робот', 'робот', 'робот', 'робот', 'робот', 'робот', 'робот', 'робот', 'робот', 'робот', 'робот', 'робот', 'робот', 'робот', 'робот', 'робот'
];

const knownAlternations = {
  'лаг': { alt: 'лаг/лож', verify: 'ложить' },
  'лож': { alt: 'лож/лаг', verify: 'лагать' },
  'раст': { alt: 'раст/ращ', verify: 'расти' },
  'ращ': { alt: 'ращ/раст', verify: 'расти' },
  'рос': { alt: 'раст/рос', verify: 'расти' },
  'скак': { alt: 'скак/скоч', verify: 'скакать' },
  'скоч': { alt: 'скоч/скак', verify: 'скакать' },
  'гар': { alt: 'гар/гор', verify: 'гореть' },
  'гор': { alt: 'гор/гар', verify: 'гореть' },
  'твар': { alt: 'твар/твор', verify: 'творить' },
  'твор': { alt: 'твор/твар', verify: 'творить' },
  'клан': { alt: 'клан/клон', verify: 'клонить' },
  'клон': { alt: 'клон/клан', verify: 'клонить' },
  'зар': { alt: 'зар/зор', verify: 'заря' },
  'зор': { alt: 'зор/зар', verify: 'заря' },
  'плав': { alt: 'плав/плов', verify: 'плыть' },
  'плов': { alt: 'плов/плав', verify: 'плыть' },
  'плыв': { alt: 'плыв/плав', verify: 'плыть' },
  'бер': { alt: 'бер/бир', verify: 'брать' },
  'бир': { alt: 'бир/бер', verify: 'брать' },
  'мер': { alt: 'мер/мир', verify: 'умирать' },
  'мир': { alt: 'мир/мер', verify: 'умирать' },
  'жег': { alt: 'жег/жиг', verify: 'жечь' },
  'жиг': { alt: 'жиг/жег', verify: 'жечь' },
  'стел': { alt: 'стел/стил', verify: 'стелить' },
  'стил': { alt: 'стил/стел', verify: 'стелить' },
  'чет': { alt: 'чет/чит', verify: 'читать' },
  'чит': { alt: 'чит/чет', verify: 'читать' },
  'кас': { alt: 'кас/кос', verify: 'касаться' },
  'кос': { alt: 'кос/кас', verify: 'касаться' },
  'крап': { alt: 'крап/кроп', verify: 'крапать' },
  'кроп': { alt: 'кроп/крап', verify: 'крапать' },
  'мак': { alt: 'мак/моч', verify: 'макать' },
  'моч': { alt: 'моч/мак', verify: 'макать' },
  'равн': { alt: 'равн/ровн', verify: 'ровный' },
  'ровн': { alt: 'ровн/равн', verify: 'ровный' },
  'лаз': { alt: 'лаз/лез', verify: 'лезть' },
  'лез': { alt: 'лез/лаз', verify: 'лезть' },
  'локот': { alt: 'локот/лок', verify: 'локоть' },
  'лок': { alt: 'лок/локот', verify: 'локоть' },
  'тир': { alt: 'тир/тер', verify: 'тереть' },
  'тер': { alt: 'тер/тир', verify: 'тереть' },
  'блест': { alt: 'блест/блист', verify: 'блестеть' },
  'блист': { alt: 'блист/блест', verify: 'блестеть' },
  'им': { alt: 'им/а', verify: 'имя' },
  'а': { alt: 'а/им', verify: 'имя' },
  'я': { alt: 'я/им', verify: 'имя' }
};

function classify(word) {
  const lower = word.toLowerCase();
  
  // Check known foreign roots
  for (const root of knownForeignRoots) {
    if (lower.includes(root)) {
      return { type: 'unverifiable', root, verify: null };
    }
  }
  
  // Check known alternations
  for (const [root, info] of Object.entries(knownAlternations)) {
    if (lower.includes(root)) {
      return { type: 'alternating', root, verify: info.verify, alternation: info.alt };
    }
  }
  
  // Default: verifiable with self as verify
  // Try to extract a reasonable root
  let root = lower;
  const suffixes = ['ать', 'ять', 'еть', 'ить', 'уть', 'ывать', 'ивать', 'овать', 'евать', 'нуть', 'ти', 'чь', 'сти', 'зть', 'ереть', 'ореть', 'ареть', 'иреть', 'ыть', 'уть', 'ять', 'ать', 'ться', 'тся', 'ться', 'а', 'я', 'о', 'е', 'и', 'у', 'ий', 'ый', 'ой', 'ая', 'яя', 'ое', 'ее', 'ие', 'ые', 'ие', 'ого', 'его', 'ому', 'ему', 'ом', 'ем', 'ых', 'их', 'ым', 'им', 'ыми', 'ими', 'ую', 'юю', 'ей', 'ей', 'ов', 'ев', 'ев', 'ов', 'ий', 'ый', 'ой', 'ие', 'ые', 'ие', 'ого', 'его', 'ому', 'ему', 'ом', 'ем', 'ых', 'их', 'ым', 'им', 'ыми', 'ими', 'ую', 'юю', 'ей', 'ей', 'ами', 'ями', 'ах', 'ях', 'ов', 'ев', 'ей', 'ий', 'ый', 'ой', 'ие', 'ые', 'ие', 'ого', 'его', 'ому', 'ему', 'ом', 'ем', 'ых', 'их', 'ым', 'им', 'ыми', 'ими', 'ую', 'юю', 'ей', 'ей', 'ами', 'ями', 'ах', 'ях', 'ов', 'ев', 'ей'];
  
  for (const suffix of suffixes) {
    if (root.endsWith(suffix)) {
      root = root.slice(0, -suffix.length);
      break;
    }
  }
  
  const prefixes = ['не', 'об', 'о', 'по', 'при', 'про', 'раз', 'рас', 'у', 'на', 'под', 'от', 'в', 'со', 'вы', 'за', 'пере', 'без', 'воз', 'вос', 'вз', 'с', 'до', 'из', 'ис', 'недо', 'обо', 'ото', 'подо', 'пред', 'преди', 'пра', 'съ', 'через', 'черес', 'чрез', 'чрес', 'низ', 'меж', 'въ', 'взо', 'изо', 'зао', 'нао', 'межи'];
  for (const prefix of prefixes) {
    if (root.startsWith(prefix)) {
      root = root.slice(prefix.length);
      break;
    }
  }
  
  if (root.length < 3) root = lower;
  
  return { type: 'verifiable', root, verify: word };
}

const classified = { verifiable: 0, unverifiable: 0, alternating: 0 };

for (const word of words) {
  const result = classify(word);
  classified[result.type]++;
  
  if (!existing[result.root]) {
    if (result.type === 'verifiable') {
      existing[result.root] = { type: 'verifiable', verify: result.verify };
    } else if (result.type === 'unverifiable') {
      existing[result.root] = { type: 'unverifiable', verify: null };
    } else if (result.type === 'alternating') {
      existing[result.root] = { type: 'alternating', verify: result.verify, alternation: result.alternation };
    }
  }
}

console.log('Classification:');
console.log('  Verifiable:', classified.verifiable);
console.log('  Unverifiable:', classified.unverifiable);
console.log('  Alternating:', classified.alternating);

// Build new dict lines
const dictLines = [];
for (const [key, val] of Object.entries(existing)) {
  if (val.type === 'alternating') {
    dictLines.push(`  '${key}': { type: 'alternating', verify: '${val.verify}', alternation: '${val.alternation}' }`);
  } else if (val.type === 'unverifiable') {
    dictLines.push(`  '${key}': { type: 'unverifiable', verify: null }`);
  } else {
    dictLines.push(`  '${key}': { type: 'verifiable', verify: '${val.verify}' }`);
  }
}

const newDictSection = `const rootDictionary = {\n${dictLines.join(',\n')}\n};`;
const newContent = content.replace(/const rootDictionary = \{[\s\S]*?\n\};/, newDictSection);

fs.writeFileSync('ege-russian-app/scripts/generate-task9-explanations.cjs', newContent, 'utf-8');
console.log('Updated generate-task9-explanations.cjs');
console.log('Total entries:', Object.keys(existing).length);

// Save classification for review
const review = {};
for (const word of words) {
  review[word] = classify(word);
}
fs.writeFileSync('ege-russian-app/auto_classified.json', JSON.stringify(review, null, 2), 'utf-8');
console.log('Saved to auto_classified.json');

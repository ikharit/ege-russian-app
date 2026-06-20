const fs = require('fs');
const path = require('path');

/**
 * Batch root analyzer for remaining 324 task9 words.
 * Only adds entries where we are confident about the root type.
 * Uses pattern matching against known Russian roots.
 */

const task9Path = path.join(__dirname, '../src/data/sections/dooshin/task9.ts');
const task9Content = fs.readFileSync(task9Path, 'utf-8');

const generic = 'Проверяемый/непроверяемый/чередующийся корень. Подберите однокоренное слово для проверки, запомните словарное написание или определите тип чередования.';

const matches = task9Content.matchAll(/id:\s*"(qd9-\d+)"[\s\S]*?text:\s*'Впишите пропущенную букву:\s*([^']+)'[\s\S]*?correctAnswer:\s*\[([^\]]+)\][\s\S]*?explanation:\s*'([^']+)'/g);

const remaining = [];
for (const m of matches) {
  if (m[4].includes(generic)) {
    remaining.push({
      id: m[1],
      word: m[2].replace(/_/g, ''),
      rawWord: m[2],
      correct: m[3].split(',').map(s => s.trim().replace(/['"]/g, '')),
    });
  }
}

console.log(`Processing ${remaining.length} remaining words...`);

// Known root patterns with high confidence
const ROOT_PATTERNS = {
  // Alternating roots (suffix-dependent е/и)
  'бер/бир': { test: w => /би[рр]/.test(w) || /бе[рр]/.test(w), type: 'alternating', alt: 'бер/бир', verify: 'брать' },
  'мер/мир': { test: w => /ми[рр]/.test(w) || /ме[рр]/.test(w), type: 'alternating', alt: 'мер/мир', verify: 'умереть' },
  'пер/пир': { test: w => /пи[рр]/.test(w) || /пе[рр]/.test(w), type: 'alternating', alt: 'пер/пир', verify: 'переть' },
  'тер/тир': { test: w => /ти[рр]/.test(w) || /те[рр]/.test(w), type: 'alternating', alt: 'тер/тир', verify: 'тереть' },
  'блест/блист': { test: w => /блист/.test(w) || /блест/.test(w), type: 'alternating', alt: 'блест/блист', verify: 'блестеть' },
  'стел/стил': { test: w => /стил/.test(w) || /стел/.test(w), type: 'alternating', alt: 'стел/стил', verify: 'стелить' },
  'чет/чит': { test: w => /чит/.test(w) || /чет/.test(w), type: 'alternating', alt: 'чет/чит', verify: 'читать' },
  
  // Alternating (stress-dependent)
  'клан/клон': { test: w => /клон/.test(w) || /клан/.test(w), type: 'alternating', alt: 'клан/клон', verify: 'клонить' },
  'гар/гор': { test: w => /гар/.test(w) || /гор/.test(w), type: 'alternating', alt: 'гар/гор', verify: 'гореть' },
  'твар/твор': { test: w => /твар/.test(w) || /твор/.test(w), type: 'alternating', alt: 'твар/твор', verify: 'творить' },
  'зар/зор': { test: w => /зар/.test(w) || /зор/.test(w), type: 'alternating', alt: 'зар/зор', verify: 'заря' },
  
  // Alternating (consonant-dependent)
  'лаг/лож': { test: w => /лаг/.test(w) || /лож/.test(w), type: 'alternating', alt: 'лаг/лож', verify: 'ложить' },
  'раст/рос': { test: w => /раст/.test(w) || /рос/.test(w) || /ращ/.test(w), type: 'alternating', alt: 'раст/рос', verify: 'расти' },
  'скак/скоч': { test: w => /скак/.test(w) || /скоч/.test(w) || /скок/.test(w), type: 'alternating', alt: 'скак/скоч', verify: 'скакать' },
  
  // Verifiable roots
  'блест': { test: w => /блест/.test(w), type: 'verifiable', verify: 'блестеть' },
  'гнил': { test: w => /гнил/.test(w) || /гнил/.test(w), type: 'verifiable', verify: 'гниль' },
  'брег': { test: w => /брег/.test(w), type: 'verifiable', verify: 'берег' },
  'влажн': { test: w => /влажн/.test(w), type: 'verifiable', verify: 'влажный' },
  'возвр': { test: w => /возвр/.test(w), type: 'verifiable', verify: 'возврат' },
  'возм': { test: w => /возм/.test(w), type: 'verifiable', verify: 'возмездие' },
  'возн': { test: w => /возн/.test(w), type: 'verifiable', verify: 'возникнуть' },
  'возр': { test: w => /возр/.test(w), type: 'verifiable', verify: 'возродить' },
  'возсл': { test: w => /возсл/.test(w), type: 'verifiable', verify: 'возслать' },
  'воздв': { test: w => /воздв/.test(w), type: 'verifiable', verify: 'воздвигнуть' },
  'возде': { test: w => /возде/.test(w), type: 'verifiable', verify: 'воздевать' },
  'воздуш': { test: w => /возд/.test(w), type: 'verifiable', verify: 'воздух' },
  'обезвр': { test: w => /обезвр/.test(w), type: 'verifiable', verify: 'безвредный' },
  'обезд': { test: w => /обезд/.test(w), type: 'verifiable', verify: 'бездорожье' },
  'обезл': { test: w => /обезл/.test(w), type: 'verifiable', verify: 'безлесный' },
  'обезн': { test: w => /обезн/.test(w), type: 'verifiable', verify: 'безногий' },
  'обезр': { test: w => /обезр/.test(w), type: 'verifiable', verify: 'безрукий' },
  'обезвож': { test: w => /обезвож/.test(w), type: 'verifiable', verify: 'безводный' },
  'обезглав': { test: w => /обезглав/.test(w), type: 'verifiable', verify: 'безглавый' },
  'обезземел': { test: w => /обезземел/.test(w), type: 'verifiable', verify: 'безземельный' },
  'обезлес': { test: w => /обезлес/.test(w), type: 'verifiable', verify: 'безлесный' },
  'обезлюд': { test: w => /обезлюд/.test(w), type: 'verifiable', verify: 'безлюдный' },
  'обезлич': { test: w => /обезлич/.test(w), type: 'verifiable', verify: 'безличный' },
  'обезмолв': { test: w => /обезмолв/.test(w), type: 'verifiable', verify: 'безмолвный' },
  'обезнож': { test: w => /обезнож/.test(w), type: 'verifiable', verify: 'безногий' },
  'обезобр': { test: w => /обезобр/.test(w), type: 'verifiable', verify: 'безобразный' },
  'обезрож': { test: w => /обезрож/.test(w), type: 'verifiable', verify: 'безрожий' },
  'обезум': { test: w => /обезум/.test(w), type: 'verifiable', verify: 'безумный' },
  'обезья': { test: w => /обезья/.test(w), type: 'verifiable', verify: 'безъязычный' },
  'обезьян': { test: w => /обезьян/.test(w), type: 'verifiable', verify: 'безъязычный' },
};

// Simple pattern matching for known Russian roots
const SIMPLE_PATTERNS = [
  // Alternating
  { pattern: /блист/, root: 'блист', type: 'alternating', alt: 'блест/блист', verify: 'блестеть' },
  { pattern: /блест/, root: 'блест', type: 'alternating', alt: 'блест/блист', verify: 'блистать' },
  { pattern: /клон/, root: 'клон', type: 'alternating', alt: 'клан/клон', verify: 'клонить' },
  { pattern: /клан/, root: 'клан', type: 'alternating', alt: 'клан/клон', verify: 'кланяться' },
  { pattern: /зар/, root: 'зар', type: 'alternating', alt: 'зар/зор', verify: 'заря' },
  { pattern: /зор/, root: 'зор', type: 'alternating', alt: 'зар/зор', verify: 'зорька' },
  { pattern: /твар/, root: 'твар', type: 'alternating', alt: 'твар/твор', verify: 'тварь' },
  { pattern: /твор/, root: 'твор', type: 'alternating', alt: 'твар/твор', verify: 'творить' },
  { pattern: /гар/, root: 'гар', type: 'alternating', alt: 'гар/гор', verify: 'нагар' },
  { pattern: /гор/, root: 'гор', type: 'alternating', alt: 'гар/гор', verify: 'гореть' },
  { pattern: /лаг/, root: 'лаг', type: 'alternating', alt: 'лаг/лож', verify: 'слагать' },
  { pattern: /лож/, root: 'лож', type: 'alternating', alt: 'лаг/лож', verify: 'ложить' },
  { pattern: /раст/, root: 'раст', type: 'alternating', alt: 'раст/рос', verify: 'расти' },
  { pattern: /рос/, root: 'рос', type: 'alternating', alt: 'раст/рос', verify: 'роса' },
  { pattern: /ращ/, root: 'ращ', type: 'alternating', alt: 'раст/рос', verify: 'расти' },
  { pattern: /скак/, root: 'скак', type: 'alternating', alt: 'скак/скоч', verify: 'скакать' },
  { pattern: /скоч/, root: 'скоч', type: 'alternating', alt: 'скак/скоч', verify: 'скочить' },
  { pattern: /скок/, root: 'скок', type: 'alternating', alt: 'скак/скоч', verify: 'подскок' },
  { pattern: /бир/, root: 'бир', type: 'alternating', alt: 'бер/бир', verify: 'забирать' },
  { pattern: /бер/, root: 'бер', type: 'alternating', alt: 'бер/бир', verify: 'уберу' },
  { pattern: /мир/, root: 'мир', type: 'alternating', alt: 'мер/мир', verify: 'замирать' },
  { pattern: /мер/, root: 'мер', type: 'alternating', alt: 'мер/мир', verify: 'умереть' },
  { pattern: /тир/, root: 'тир', type: 'alternating', alt: 'тер/тир', verify: 'стирать' },
  { pattern: /тер/, root: 'тер', type: 'alternating', alt: 'тер/тир', verify: 'тру' },
  { pattern: /пир/, root: 'пир', type: 'alternating', alt: 'пер/пир', verify: 'запирать' },
  { pattern: /пер/, root: 'пер', type: 'alternating', alt: 'пер/пир', verify: 'запереть' },
  { pattern: /стил/, root: 'стил', type: 'alternating', alt: 'стел/стил', verify: 'расстилать' },
  { pattern: /стел/, root: 'стел', type: 'alternating', alt: 'стел/стил', verify: 'расстелить' },
  { pattern: /чит/, root: 'чит', type: 'alternating', alt: 'чет/чит', verify: 'вычитать' },
  { pattern: /чет/, root: 'чет', type: 'alternating', alt: 'чет/чит', verify: 'вычет' },
  { pattern: /жиг/, root: 'жиг', type: 'alternating', alt: 'жег/жиг', verify: 'сжигать' },
  { pattern: /жег/, root: 'жег', type: 'alternating', alt: 'жег/жиг', verify: 'сжёг' },
  { pattern: /кас/, root: 'кас', type: 'alternating', alt: 'кас/кос', verify: 'касаться' },
  { pattern: /кос/, root: 'кос', type: 'alternating', alt: 'кас/кос', verify: 'коснуться' },
  { pattern: /плав/, root: 'плав', type: 'alternating', alt: 'плав/плов', verify: 'плавать' },
  { pattern: /плов/, root: 'плов', type: 'alternating', alt: 'плав/плов', verify: 'пловец' },
  { pattern: /плыв/, root: 'плыв', type: 'alternating', alt: 'плав/плыв', verify: 'плыть' },
  { pattern: /крап/, root: 'крап', type: 'alternating', alt: 'крап/кроп', verify: 'крапина' },
  { pattern: /кроп/, root: 'кроп', type: 'alternating', alt: 'крап/кроп', verify: 'окропить' },
  { pattern: /мак/, root: 'мак', type: 'alternating', alt: 'мак/моч', verify: 'макать' },
  { pattern: /моч/, root: 'моч', type: 'alternating', alt: 'мак/моч', verify: 'намочить' },
  { pattern: /равн/, root: 'равн', type: 'alternating', alt: 'равн/ровн', verify: 'равнять' },
  { pattern: /ровн/, root: 'ровн', type: 'alternating', alt: 'равн/ровн', verify: 'ровнять' },
  { pattern: /лез/, root: 'лез', type: 'alternating', alt: 'лез/лаз', verify: 'лезть' },
  { pattern: /лаз/, root: 'лаз', type: 'alternating', alt: 'лез/лаз', verify: 'лазить' },
  { pattern: /локот/, root: 'локот', type: 'alternating', alt: 'локот/лок', verify: 'локоть' },
  { pattern: /локт/, root: 'локт', type: 'alternating', alt: 'локот/лок', verify: 'локоть' },
  
  // Verifiable
  { pattern: /слав/, root: 'слав', type: 'verifiable', verify: 'слава' },
  { pattern: /брег/, root: 'брег', type: 'verifiable', verify: 'берег' },
  { pattern: /гнил/, root: 'гнил', type: 'verifiable', verify: 'гниль' },
  { pattern: /гни/, root: 'гни', type: 'verifiable', verify: 'гнить' },
  { pattern: /влажн/, root: 'влажн', type: 'verifiable', verify: 'влажный' },
  { pattern: /влаж/, root: 'влаж', type: 'verifiable', verify: 'влажный' },
  { pattern: /возвр/, root: 'возвр', type: 'verifiable', verify: 'возврат' },
  { pattern: /возм/, root: 'возм', type: 'verifiable', verify: 'возмездие' },
  { pattern: /возн/, root: 'возн', type: 'verifiable', verify: 'возникнуть' },
  { pattern: /возр/, root: 'возр', type: 'verifiable', verify: 'возродить' },
  { pattern: /воздв/, root: 'воздв', type: 'verifiable', verify: 'воздвигнуть' },
  { pattern: /возд/, root: 'возд', type: 'verifiable', verify: 'воздух' },
  { pattern: /обезвр/, root: 'обезвр', type: 'verifiable', verify: 'безвредный' },
  { pattern: /обезд/, root: 'обезд', type: 'verifiable', verify: 'бездорожье' },
  { pattern: /обезл/, root: 'обезл', type: 'verifiable', verify: 'безлесный' },
  { pattern: /обезн/, root: 'обезн', type: 'verifiable', verify: 'безногий' },
  { pattern: /обезр/, root: 'обезр', type: 'verifiable', verify: 'безрукий' },
  { pattern: /обезвож/, root: 'обезвож', type: 'verifiable', verify: 'безводный' },
  { pattern: /обезглав/, root: 'обезглав', type: 'verifiable', verify: 'безглавый' },
  { pattern: /обезземел/, root: 'обезземел', type: 'verifiable', verify: 'безземельный' },
  { pattern: /обезлес/, root: 'обезлес', type: 'verifiable', verify: 'безлесный' },
  { pattern: /обезлюд/, root: 'обезлюд', type: 'verifiable', verify: 'безлюдный' },
  { pattern: /обезлич/, root: 'обезлич', type: 'verifiable', verify: 'безличный' },
  { pattern: /обезмолв/, root: 'обезмолв', type: 'verifiable', verify: 'безмолвный' },
  { pattern: /обезнож/, root: 'обезнож', type: 'verifiable', verify: 'безногий' },
  { pattern: /обезобр/, root: 'обезобр', type: 'verifiable', verify: 'безобразный' },
  { pattern: /обезрож/, root: 'обезрож', type: 'verifiable', verify: 'безрожий' },
  { pattern: /обезум/, root: 'обезум', type: 'verifiable', verify: 'безумный' },
  { pattern: /безотл/, root: 'безотл', type: 'verifiable', verify: 'отлагать' },
  { pattern: /безотв/, root: 'безотв', type: 'verifiable', verify: 'ответ' },
  { pattern: /безотлог/, root: 'безотлог', type: 'verifiable', verify: 'отлагать' },
  { pattern: /благосл/, root: 'благосл', type: 'verifiable', verify: 'славить' },
  { pattern: /благоч/, root: 'благоч', type: 'verifiable', verify: 'честь' },
  { pattern: /блст/, root: 'блист', type: 'verifiable', verify: 'блестеть' },
  { pattern: /блест/, root: 'блест', type: 'verifiable', verify: 'блестеть' },
  { pattern: /брез/, root: 'брез', type: 'verifiable', verify: 'береза' },
  { pattern: /брезг/, root: 'брезг', type: 'verifiable', verify: 'брезгать' },
  { pattern: /брезж/, root: 'брезж', type: 'verifiable', verify: 'брезжить' },
  { pattern: /брезглив/, root: 'брезглив', type: 'verifiable', verify: 'брезгать' },
  { pattern: /брезгун/, root: 'брезгун', type: 'verifiable', verify: 'брезгать' },
  { pattern: /брезгуш/, root: 'брезгуш', type: 'verifiable', verify: 'брезгать' },
  { pattern: /брезжит/, root: 'брезжит', type: 'verifiable', verify: 'брезжить' },
  { pattern: /брезжил/, root: 'брезжил', type: 'verifiable', verify: 'брезжить' },
  { pattern: /брезжим/, root: 'брезжим', type: 'verifiable', verify: 'брезжить' },
  { pattern: /брезжис/, root: 'брезжис', type: 'verifiable', verify: 'брезжить' },
  { pattern: /брезжитс/, root: 'брезжитс', type: 'verifiable', verify: 'брезжить' },
  { pattern: /брезжилс/, root: 'брезжилс', type: 'verifiable', verify: 'брезжить' },
  { pattern: /брезжимс/, root: 'брезжимс', type: 'verifiable', verify: 'брезжить' },
  { pattern: /брезжись/, root: 'брезжись', type: 'verifiable', verify: 'брезжить' },
  { pattern: /брезжитесь/, root: 'брезжитесь', type: 'verifiable', verify: 'брезжить' },
  { pattern: /брезжимтесь/, root: 'брезжимтесь', type: 'verifiable', verify: 'брезжить' },
  { pattern: /брезжитесь/, root: 'брезжитесь', type: 'verifiable', verify: 'брезжить' },
  { pattern: /брезжимтесь/, root: 'брезжимтесь', type: 'verifiable', verify: 'брезжить' },
];

const found = {};
const unmatched = [];

for (const item of remaining) {
  const w = item.word;
  let matched = false;
  
  for (const p of SIMPLE_PATTERNS) {
    if (p.pattern.test(w)) {
      found[w] = { ...p, id: item.id, correct: item.correct };
      matched = true;
      break;
    }
  }
  
  if (!matched) {
    unmatched.push(item);
  }
}

console.log(`Matched: ${Object.keys(found).length}`);
console.log(`Unmatched: ${unmatched.length}`);

// Show some matched
console.log('\n=== Matched samples ===');
const matchedWords = Object.keys(found).slice(0, 20);
for (const w of matchedWords) {
  console.log(`${w}: ${found[w].type}, root=${found[w].root}, verify=${found[w].verify || found[w].alt}`);
}

// Show unmatched
console.log('\n=== Unmatched samples (first 30) ===');
for (const u of unmatched.slice(0, 30)) {
  console.log(`${u.id}: ${u.word} (answer: ${u.correct.join(',')})`);
}

// Save for further processing
fs.writeFileSync('matched_roots.json', JSON.stringify(found, null, 2), 'utf-8');
fs.writeFileSync('unmatched_words.json', JSON.stringify(unmatched, null, 2), 'utf-8');
console.log('\nSaved matched_roots.json and unmatched_words.json');

const fs = require('fs');
const path = require('path');

// Load existing explanations
const task9Explanations = JSON.parse(fs.readFileSync('C:/Users/USER/Documents/kimi/workspace/ege-russian-app/src/data/explanations/task9-word-explanations.json', 'utf-8'));
const wordExplanations = JSON.parse(fs.readFileSync('C:/Users/USER/Documents/kimi/workspace/ege-russian-app/src/data/explanations/wordExplanations.json', 'utf-8'));

// Dictionary of known roots with verification words
const rootDictionary = {
  // Verifiable roots
  'блист': { type: 'verifiable', verify: 'блестеть' },
  'наж': { type: 'verifiable', verify: 'нагой' },
  'свят': { type: 'verifiable', verify: 'святой' },
  'зар': { type: 'verifiable', verify: 'заря' },
  'кал': { type: 'verifiable', verify: 'калить' },
  'скрип': { type: 'verifiable', verify: 'скрип' },
  'пир': { type: 'verifiable', verify: 'переть' },
  'трепет': { type: 'verifiable', verify: 'трепет' },
  'плот': { type: 'verifiable', verify: 'плоть' },
  'общ': { type: 'verifiable', verify: 'общий' },
  'чищ': { type: 'verifiable', verify: 'чистый' },
  'свеж': { type: 'verifiable', verify: 'свежий' },
  'постиж': { type: 'verifiable', verify: 'постигать' },
  'прав': { type: 'verifiable', verify: 'право' },
  'влад': { type: 'verifiable', verify: 'владеть' },
  'стар': { type: 'verifiable', verify: 'стареть' },
  'ход': { type: 'verifiable', verify: 'ходить' },
  'кос': { type: 'verifiable', verify: 'касаться' },
  'вяд': { type: 'verifiable', verify: 'вянуть' },
  'иссяк': { type: 'verifiable', verify: 'иссякать' },
  'напряж': { type: 'verifiable', verify: 'напрягать' },
  'лаг': { type: 'alternating', verify: 'ложить', alternation: 'лаг/лож' },
  'тир': { type: 'alternating', verify: 'тереть', alternation: 'тир/тер' },
  'скоч': { type: 'alternating', verify: 'скакать', alternation: 'скоч/скак' },
  'дир': { type: 'verifiable', verify: 'драть' },
  'ним': { type: 'verifiable', verify: 'нимать' },
  'един': { type: 'verifiable', verify: 'единый' },
  'чет': { type: 'verifiable', verify: 'чета' },
  'локот': { type: 'alternating', verify: 'локоть', alternation: 'локот/лок' },
  'бег': { type: 'verifiable', verify: 'бег' },
  'раст': { type: 'verifiable', verify: 'расти' },
  'плав': { type: 'verifiable', verify: 'плыть' },
  'мак': { type: 'verifiable', verify: 'макать' },
  'поглощ': { type: 'verifiable', verify: 'поглощать' },
  'одар': { type: 'verifiable', verify: 'дар' },
  'предполож': { type: 'verifiable', verify: 'положить' },
  'опозда': { type: 'verifiable', verify: 'опоздать' },
  'запина': { type: 'verifiable', verify: 'пинать' },
  'расстил': { type: 'verifiable', verify: 'стилить' },
  'возник': { type: 'verifiable', verify: 'возникать' },
  'выраж': { type: 'verifiable', verify: 'выразить' },
  'укрощ': { type: 'verifiable', verify: 'укрощать' },
  'цыган': { type: 'unverifiable', verify: null },
  'целеб': { type: 'verifiable', verify: 'целебный' },
  'челн': { type: 'unverifiable', verify: null },
  'пример': { type: 'verifiable', verify: 'пример' },
  'чёт': { type: 'verifiable', verify: 'чётный' },
  'доросл': { type: 'verifiable', verify: 'дорослый' },
  'умал': { type: 'verifiable', verify: 'умаяться' },
  'лаз': { type: 'alternating', verify: 'лезть', alternation: 'лаз/лез' },
  'поплав': { type: 'verifiable', verify: 'плавать' },
  'промок': { type: 'verifiable', verify: 'промокать' },
  'отрасл': { type: 'verifiable', verify: 'отрасль' },
  'расчёс': { type: 'verifiable', verify: 'чесать' },
  'чечёт': { type: 'unverifiable', verify: null },
  'поджог': { type: 'verifiable', verify: 'жечь' },
  'борд': { type: 'unverifiable', verify: null },
  'кают': { type: 'unverifiable', verify: null },
  'запас': { type: 'verifiable', verify: 'запасть' },
  'перекал': { type: 'verifiable', verify: 'перекалить' },
  'выровн': { type: 'verifiable', verify: 'ровный' },
  'загор': { type: 'verifiable', verify: 'загореть' },
  'уравн': { type: 'verifiable', verify: 'равный' },
  'плавучест': { type: 'verifiable', verify: 'плавучесть' },
  'материал': { type: 'unverifiable', verify: null },
  'жёстк': { type: 'verifiable', verify: 'жёсткий' },
  'шов': { type: 'verifiable', verify: 'шов' },
  'шёпот': { type: 'verifiable', verify: 'шептать' },
  'инициатив': { type: 'unverifiable', verify: null },
  'конспектир': { type: 'verifiable', verify: 'конспектировать' },
  'территорий': { type: 'unverifiable', verify: null },
  'обгор': { type: 'verifiable', verify: 'обгореть' },
  'богатств': { type: 'verifiable', verify: 'богатый' },
  'касательн': { type: 'verifiable', verify: 'касаться' },
  'пригор': { type: 'verifiable', verify: 'пригореть' },
  'оправда': { type: 'verifiable', verify: 'оправдать' },
  'враст': { type: 'verifiable', verify: 'врасти' },
  'зажиг': { type: 'verifiable', verify: 'зажигать' },
  'шёлк': { type: 'verifiable', verify: 'шёлк' },
  'решёт': { type: 'verifiable', verify: 'решётка' },
  'одоле': { type: 'verifiable', verify: 'одолеть' },
  'растительн': { type: 'verifiable', verify: 'расти' },
  'забавл': { type: 'verifiable', verify: 'забавляться' },
  'шоколад': { type: 'unverifiable', verify: null },
  'шорох': { type: 'verifiable', verify: 'шорох' },
  'шоссе': { type: 'unverifiable', verify: null },
  'равновесий': { type: 'verifiable', verify: 'равновесие' },
  'декоративн': { type: 'unverifiable', verify: null },
  'нараст': { type: 'verifiable', verify: 'нарастить' },
  'витраж': { type: 'unverifiable', verify: null },
  'вермишел': { type: 'unverifiable', verify: null },
  'замар': { type: 'verifiable', verify: 'замарать' },
  'вакцинир': { type: 'unverifiable', verify: null },
  'плыв': { type: 'alternating', verify: 'плыть', alternation: 'плыв/плав' },
  'облаг': { type: 'verifiable', verify: 'облагать' },
  'растущ': { type: 'verifiable', verify: 'расти' },
  'скакалк': { type: 'verifiable', verify: 'скакалка' },
  'вытира': { type: 'verifiable', verify: 'вытирать' },
  'каса': { type: 'verifiable', verify: 'касаться' },
  'плавн': { type: 'verifiable', verify: 'плавник' },
  'поскач': { type: 'verifiable', verify: 'скакать' },
  'выдел': { type: 'verifiable', verify: 'выделение' },
  'смир': { type: 'verifiable', verify: 'смирение' },
  'приобрет': { type: 'verifiable', verify: 'приобретение' },
  'обиж': { type: 'verifiable', verify: 'обижать' },
  'сочетательн': { type: 'verifiable', verify: 'сочетать' },
  'экспериментальн': { type: 'unverifiable', verify: null },
  'махн': { type: 'verifiable', verify: 'махнуть' },
  'оплат': { type: 'verifiable', verify: 'оплатить' },
  'соприкаса': { type: 'verifiable', verify: 'соприкасаться' },
  'предположительн': { type: 'verifiable', verify: 'предположить' },
  'чопорн': { type: 'unverifiable', verify: null },
  'пара': { type: 'verifiable', verify: 'пара' },
  'выр': { type: 'verifiable', verify: 'вырыть' },
  'шокир': { type: 'unverifiable', verify: null },
  'зашоренн': { type: 'verifiable', verify: 'шоры' },
  'энциклопедист': { type: 'unverifiable', verify: null },
  'умаля': { type: 'verifiable', verify: 'умаяться' },
  'поплавок': { type: 'verifiable', verify: 'плавать' },
  'вырост': { type: 'verifiable', verify: 'вырасти' },
  'скач': { type: 'verifiable', verify: 'скакать' },
  'материальн': { type: 'unverifiable', verify: null },
  'пригорью': { type: 'verifiable', verify: 'пригореть' },
  'прилагательн': { type: 'verifiable', verify: 'прилагать' },
  'космонавтик': { type: 'unverifiable', verify: null },
  'прыг': { type: 'verifiable', verify: 'прыгать' },
  'поглощ': { type: 'verifiable', verify: 'поглощать' },
  'одарённ': { type: 'verifiable', verify: 'дар' },
  'приоритет': { type: 'unverifiable', verify: null },
  'поглощен': { type: 'verifiable', verify: 'поглощать' },
  'макан': { type: 'verifiable', verify: 'макать' },
  'бордов': { type: 'unverifiable', verify: null },
  'прыгун': { type: 'verifiable', verify: 'прыгать' },
  'скачк': { type: 'verifiable', verify: 'скакать' },
  'бесшовн': { type: 'verifiable', verify: 'шов' },
  'выр': { type: 'verifiable', verify: 'вырыть' },
  'цепочк': { type: 'verifiable', verify: 'цепочка' },
  'интеллектуальн': { type: 'unverifiable', verify: null },
  'баскетбол': { type: 'unverifiable', verify: null },
  'загар': { type: 'verifiable', verify: 'загареть' },
  'прогрессивн': { type: 'unverifiable', verify: null },
  'приоритетн': { type: 'unverifiable', verify: null },
  'приобрет': { type: 'verifiable', verify: 'приобретение' },
  'сочет': { type: 'verifiable', verify: 'сочетать' },
  'мгновен': { type: 'unverifiable', verify: null },
  'панорам': { type: 'unverifiable', verify: null },
  'диапазон': { type: 'unverifiable', verify: null },
  'период': { type: 'unverifiable', verify: null },
  'галактик': { type: 'unverifiable', verify: null },
  'космонавт': { type: 'unverifiable', verify: null },
  'гипотез': { type: 'unverifiable', verify: null },
  'лог': { type: 'unverifiable', verify: null },
  'вокзал': { type: 'unverifiable', verify: null },
  'палисад': { type: 'unverifiable', verify: null },
  'интенсив': { type: 'unverifiable', verify: null },
  'равнобедр': { type: 'unverifiable', verify: null },
  'вестибюл': { type: 'unverifiable', verify: null },
  'леле': { type: 'unverifiable', verify: null },
  'вентилятор': { type: 'unverifiable', verify: null },
  'касат': { type: 'unverifiable', verify: null },
  'интеллигент': { type: 'unverifiable', verify: null },
  'волейбол': { type: 'unverifiable', verify: null },
  'аквамарин': { type: 'unverifiable', verify: null },
  'сатир': { type: 'unverifiable', verify: null },
  'хаот': { type: 'unverifiable', verify: null },
  'капюшон': { type: 'unverifiable', verify: null },
  'галерей': { type: 'unverifiable', verify: null },
  'винегрет': { type: 'unverifiable', verify: null },
};

// Prefixes to remove
const prefixes = ['не', 'об', 'о', 'по', 'при', 'про', 'раз', 'рас', 'у', 'на', 'под', 'от', 'в', 'со', 'вы', 'за', 'пере', 'без', 'воз', 'вос', 'вз', 'с', 'до', 'из', 'ис', 'недо', 'обо', 'ото', 'подо', 'пред', 'преди', 'пра', 'съ', 'через', 'черес', 'чрез', 'чрес', 'низ', 'съ', 'въ', 'взо', 'изо', 'недо', 'зао', 'нао', 'меж', 'межи', 'низ', 'съ', 'въ', 'взо', 'изо', 'недо', 'зао', 'нао', 'меж', 'межи', 'через', 'черес', 'чрез', 'чрес', 'низ', 'съ', 'въ', 'взо', 'изо', 'недо', 'зао', 'нао', 'меж', 'межи', 'через', 'черес', 'чрез', 'чрес', 'низ', 'съ', 'въ', 'взо', 'изо', 'недо', 'зао', 'нао', 'меж', 'межи'];

// Suffixes to remove
const suffixes = ['ательный', 'ательн', 'ительный', 'ительн', 'нный', 'нн', 'щий', 'щ', 'вый', 'в', 'ить', 'ит', 'ать', 'ат', 'еть', 'ет', 'ывать', 'ыв', 'ивать', 'ив', 'ться', 'тся', 'яться', 'я', 'сь', 'ся', 'ение', 'ен', 'ения', 'ен', 'ован', 'ов', 'ирован', 'ир', 'изирован', 'изир', 'ный', 'н', 'ая', 'а', 'ий', 'и', 'ой', 'о', 'ые', 'ы', 'ое', 'е', 'ую', 'у', 'ем', 'м', 'ет', 'т', 'ут', 'те', 'ешь', 'шь', 'ю', 'я', 'аю', 'аешь', 'ает', 'аем', 'ает', 'ают', 'у', 'ишь', 'ит', 'им', 'ите', 'ат', 'ят', 'юсь', 'ешься', 'ется', 'емся', 'етесь', 'ются', 'ла', 'ло', 'ли', 'л', 'лся', 'лась', 'лось', 'лись', 'вш', 'вши', 'вшись', 'вший', 'вшего', 'вшему', 'вшим', 'вшем', 'вшая', 'вшей', 'вшую', 'вшею', 'вшие', 'вших', 'вшим', 'вшими', 'вших', 'вшись'];

function findRoot(word) {
  const lower = word.toLowerCase();
  
  // Try removing prefixes
  for (const prefix of prefixes) {
    if (lower.startsWith(prefix)) {
      const withoutPrefix = lower.slice(prefix.length);
      // Check if the remaining part starts with a known root
      for (const [root, info] of Object.entries(rootDictionary)) {
        if (withoutPrefix.startsWith(root)) {
          return { root, info, prefix };
        }
      }
    }
  }
  
  // Try without prefix
  for (const [root, info] of Object.entries(rootDictionary)) {
    if (lower.startsWith(root)) {
      return { root, info, prefix: '' };
    }
  }
  
  return null;
}

function generateExplanation(word) {
  const rootInfo = findRoot(word);
  if (!rootInfo) {
    return null; // Use fallback
  }
  
  const { root, info, prefix } = rootInfo;
  let explanation = '';
  
  if (info.type === 'verifiable') {
    explanation = `Корень -${root}- (проверяемый)`;
    if (info.verify) {
      explanation += `. Проверьте через однокоренное: ${info.verify}`;
    }
  } else if (info.type === 'alternating') {
    explanation = `Корень -${root}- (чередующийся)`;
    if (info.alternation) {
      explanation += `. Чередование: ${info.alternation}`;
    }
    if (info.verify) {
      explanation += ` (проверьте через: ${info.verify})`;
    }
  } else if (info.type === 'unverifiable') {
    explanation = `Корень -${root}- (непроверяемый). Запомните написание: ${word}`;
  }
  
  if (prefix) {
    explanation += `. Приставка: ${prefix}-`;
  }
  
  return explanation + '.';
}

// Process all words from task9
const content = fs.readFileSync('C:/Users/USER/Documents/kimi/workspace/ege-russian-app/src/data/sections/dooshin/task9.ts', 'utf-8');
const matches = content.matchAll(/id:\s*\"(qd9-\d+)\"[\s\S]*?text:\s*'([^']+)'[\s\S]*?correctAnswer:\s*\[(.*?)\]/g);

const allExplanations = { ...wordExplanations, ...task9Explanations };
let generated = 0;
let fallback = 0;

for (const match of matches) {
  const [_, id, text, answer] = match;
  const wordMatch = text.match(/Впишите пропущенную букву:\s*([а-яё_]+)/i);
  if (wordMatch) {
    const ans = answer.replace(/['"]/g, '').trim().toLowerCase();
    const word = wordMatch[1].replace('_', ans);
    
    if (!allExplanations[word.toLowerCase()]) {
      const explanation = generateExplanation(word);
      if (explanation) {
        allExplanations[word.toLowerCase()] = explanation;
        generated++;
      } else {
        fallback++;
      }
    }
  }
}

console.log('Generated explanations:', generated);
console.log('Fallback (no root found):', fallback);
console.log('Total covered:', Object.keys(allExplanations).length);

// Save to JSON
fs.writeFileSync('C:/Users/USER/Documents/kimi/workspace/ege-russian-app/src/data/explanations/wordExplanations.json', JSON.stringify(allExplanations, null, 2), 'utf-8');
console.log('Saved to wordExplanations.json');

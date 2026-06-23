const fs = require('fs');

const classified = JSON.parse(fs.readFileSync('all_classified.json', 'utf-8'));

const fixes = {
  'совмещать': { type: 'verifiable', root: 'мест', verify: 'место' },
  'оберегаемый': { type: 'verifiable', root: 'берег', verify: 'беречь' },
  'лёг': { type: 'alternating', root: 'лёг', verify: 'ложить', alternation: 'лёг/лож' },
  'озираться': { type: 'verifiable', root: 'зир', verify: 'зреть' },
  'сбережения': { type: 'verifiable', root: 'берег', verify: 'беречь' },
  'развивать': { type: 'verifiable', root: 'вив', verify: 'вить' },
  'пощечина': { type: 'verifiable', root: 'щеч', verify: 'щека' },
  'возрождение': { type: 'verifiable', root: 'род', verify: 'род' },
  'разминаться': { type: 'verifiable', root: 'мин', verify: 'мять' },
  'прожорливый': { type: 'unverifiable', root: 'прожорл', verify: null },
  'развивается': { type: 'verifiable', root: 'вив', verify: 'вить' },
  'развиваются': { type: 'verifiable', root: 'вив', verify: 'вить' },
  'сокращение': { type: 'verifiable', root: 'кращ', verify: 'краткий' },
  'беречь': { type: 'verifiable', root: 'берег', verify: 'беречь' },
  'проклинать': { type: 'verifiable', root: 'клин', verify: 'клясть' },
  'роптать': { type: 'unverifiable', root: 'ропт', verify: null },
  'свила': { type: 'verifiable', root: 'вив', verify: 'вить' },
  'продолжение': { type: 'verifiable', root: 'долж', verify: 'долгий' },
  'обжора': { type: 'unverifiable', root: 'обжор', verify: null },
};

for (const [word, fix] of Object.entries(fixes)) {
  if (classified[word]) {
    classified[word] = { ...classified[word], ...fix };
    console.log('Fixed:', word, '→', fix.type);
  } else {
    console.log('Word not found:', word);
  }
}

fs.writeFileSync('all_classified.json', JSON.stringify(classified, null, 2), 'utf-8');
console.log('Saved fixes to all_classified.json');

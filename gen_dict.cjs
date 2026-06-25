const fs = require('fs');
const words = JSON.parse(fs.readFileSync('temp_words.json', 'utf-8'));

const filtered = words.filter(w => w.length >= 2 && !/^(\d+|single|multiple|text|easy|medium|hard|type|options|correctanswer|explanation|id)$/.test(w));

const frequentWords = [
  'а','без','был','быть','в','весь','вне','во','вот','все','всего','всей','всем','всеми','всему','всех','всею','всю','вся','вы','где','да','два','для','до','его','ее','ей','ему','если','есть','еще','же','за','здесь','и','из','или','им','ими','итак','их','к','как','кем','ко','когда','кого','ком','кому','которая','которого','которое','которой','котором','которому','которую','которые','который','которых','кроме','куда','ли','либо','между','меня','мне','мной','мною','мог','могут','может','мои','моих','мой','моя','моё','мы','на','над','надо','нами','нас','наш','наша','наше','наши','не','него','нее','ней','нем','нему','нет','ни','ним','ними','них','но','ну','о','об','оба','один','одна','однажды','однако','одни','одним','одними','одних','одно','одного','одной','одном','одному','одною','одну','он','она','они','оно','от','перед','по','под','после','потому','при','про','с','сам','сама','сами','самим','самими','самих','само','самого','самой','самом','самому','саму','свое','своего','своей','своем','своему','своею','свои','своих','свой','свою','своя','себе','себя','сей','со','так','также','такие','таким','такими','таких','таков','такова','таковое','таковой','таковом','таковому','таковою','такову','таковы','таковые','таковым','таковыми','таковых','такое','такого','такой','таком','такому','такою','такую','там','твои','твоих','твой','твоя','твое','твоего','твоей','твоем','твоему','твоею','твою','те','тебя','тем','теми','теперь','тех','то','тобой','тобою','того','тоже','той','только','том','тому','тот','три','ту','ты','у','уже','чего','чем','чему','через','что','чтобы','чье','чьего','чьей','чьем','чьему','чьею','чьи','чьих','чьим','чьими','чьих','чью','чья','эта','эти','этим','этими','этих','это','этого','этой','этом','этому','этот','эту','я'
];

const allWords = [...new Set([...filtered, ...frequentWords])].sort((a,b)=>a.localeCompare(b,'ru'));

const lines = [
  "import { SpellDictionary, SpellException } from '../types/spellEngine'",
  '',
  '// ─────────────────────────────────────────────────────────────',
  '// Auto-generated dictionary from src/data/*.ts question files',
  '// + top-200 frequent Russian words + manual exceptions',
  '// Total words: ' + allWords.length,
  '// ─────────────────────────────────────────────────────────────',
  '',
  'export const DICTIONARY_WORDS: string[] = [',
];

const chunkSize = 100;
for (let i = 0; i < allWords.length; i += chunkSize) {
  const chunk = allWords.slice(i, i + chunkSize);
  lines.push('  ' + chunk.map(w => JSON.stringify(w)).join(', '));
}

lines.push(']');
lines.push('');
lines.push('export const SPELL_EXCEPTIONS: SpellException[] = [');
lines.push("  { word: 'пловец', rule: 'root-plav-plov', exception: true, note: 'Исключение: корень -плов- с \"о\" (пловец, пловчиха)' },");
lines.push("  { word: 'пловчиха', rule: 'root-plav-plov', exception: true, note: 'Исключение: корень -плов- с \"о\" (пловец, пловчиха)' },");
lines.push("  { word: 'солнце', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: н (солнце)' },");
lines.push("  { word: 'чувство', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: т (чувство)' },");
lines.push("  { word: 'радостный', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: т (радостный)' },");
lines.push("  { word: 'крестный', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: т (крестный)' },");
lines.push("  { word: 'местный', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: т (местный)' },");
lines.push("  { word: 'известный', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: т (известный)' },");
lines.push("  { word: 'честный', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: т (честный)' },");
lines.push("  { word: 'бесчестный', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: т (бесчестный)' },");
lines.push("  { word: 'запчастный', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: т (запчастный)' },");
lines.push("  { word: 'дивчина', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: т (дивчина)' },");
lines.push("  { word: 'праздничный', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: д (праздничный)' },");
lines.push("  { word: 'дождливый', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: з (дождливый)' },");
lines.push("  { word: 'дождь', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: з (дождь)' },");
lines.push("  { word: 'лестный', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: т (лестный)' },");
lines.push("  { word: 'сердитый', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: т (сердитый)' },");
lines.push("  { word: 'сердце', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: д (сердце)' },");
lines.push("  { word: 'вещественный', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: т (вещественный)' },");
lines.push("  { word: 'гроздья', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: д (гроздья)' },");
lines.push("  { word: 'гроздь', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: д (гроздь)' },");
lines.push("  { word: 'поздно', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: д (поздно)' },");
lines.push("  { word: 'грустный', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: т (грустный)' },");
lines.push("  { word: 'грустить', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: т (грустить)' },");
lines.push("  { word: 'здравствуй', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: т (здравствуй)' },");
lines.push("  { word: 'здравствуйте', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: т (здравствуйте)' },");
lines.push("  { word: 'праздник', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: д (праздник)' },");
lines.push("  { word: 'праздновать', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: д (праздновать)' },");
lines.push("  { word: 'праздный', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: д (праздный)' },");
lines.push("  { word: 'праздность', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: д (праздность)' },");
lines.push("  { word: 'праздно', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: д (праздно)' },");
lines.push("  { word: 'ястреб', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: т (ястреб)' },");
lines.push("  { word: 'гусь', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: т (гусь)' },");
lines.push("  { word: 'гусенок', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: т (гусенок)' },");
lines.push("  { word: 'гусыня', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: т (гусыня)' },");
lines.push("  { word: 'гусак', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: т (гусак)' },");
lines.push("  { word: 'гусар', rule: 'silent-consonant', exception: true, note: 'Непроизносимый согласный: т (гусар)' },");
lines.push(']');
lines.push('');
lines.push('const allWordsLowercase = DICTIONARY_WORDS.map(w => w.toLowerCase())');
lines.push('');
lines.push('export function buildSpellDictionary(): SpellDictionary {');
lines.push('  const words = new Set(allWordsLowercase)');
lines.push('  const exceptions = new Map<string, SpellException>()');
lines.push('  SPELL_EXCEPTIONS.forEach(exc => exceptions.set(exc.word.toLowerCase(), exc))');
lines.push('  return {');
lines.push('    words,');
lines.push('    exceptions,');
lines.push('    addWord(word: string) { words.add(word.toLowerCase()) },');
lines.push('    addException(exc: SpellException) { exceptions.set(exc.word.toLowerCase(), exc) },');
lines.push('    isInDictionary(word: string) { return words.has(word.toLowerCase()) },');
lines.push('    getException(word: string) { return exceptions.get(word.toLowerCase()) }');
lines.push('  }');
lines.push('}');
lines.push('');
lines.push('// Pre-built singleton for fast import');
lines.push('export const spellDictionary = buildSpellDictionary()');
lines.push('');
lines.push('export function isInDictionary(word: string): boolean {');
lines.push('  return spellDictionary.isInDictionary(word)');
lines.push('}');
lines.push('');
lines.push('export function getWordForms(baseWord: string): string[] {');
lines.push('  // Simple Russian morphology: return common suffixes');
lines.push('  const base = baseWord.toLowerCase()');
lines.push('  const forms: string[] = [base]');
lines.push("  const suffixes = ['а','я','ы','и','е','у','ю','ом','ем','ой','ей','ов','ев','ами','ями','ах','ях','ся','сь','л','ла','ло','ли','ть','ет','ут','ит','ат','ят']");
lines.push('  suffixes.forEach(suf => {');
lines.push('    if (spellDictionary.isInDictionary(base + suf)) forms.push(base + suf)');
lines.push('    if (spellDictionary.isInDictionary(base.slice(0, -1) + suf)) forms.push(base.slice(0, -1) + suf)');
lines.push('  })');
lines.push('  return [...new Set(forms)]');
lines.push('}');
lines.push('');
lines.push('export function getException(word: string): SpellException | undefined {');
lines.push('  return spellDictionary.getException(word)');
lines.push('}');
lines.push('');

fs.writeFileSync('src/data/spellDictionary.ts', lines.join('\n'), 'utf-8');
console.log('Created src/data/spellDictionary.ts with ' + allWords.length + ' words');

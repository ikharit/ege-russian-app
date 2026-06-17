export interface AccentWord {
  id: string
  word: string        // слово с заглавной ударной буквой
  normalized: string  // слово без ударения
  stressIndex: number // индекс ударной буквы (0-based)
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

function buildWord(normalized: string, stressIndex: number): string {
  return normalized.slice(0, stressIndex) + normalized[stressIndex].toUpperCase() + normalized.slice(stressIndex + 1)
}

function makeWord(id: string, normalized: string, stressIndex: number, explanation: string, difficulty: AccentWord['difficulty']): AccentWord {
  return {
    id,
    word: buildWord(normalized, stressIndex),
    normalized,
    stressIndex,
    explanation,
    difficulty,
  }
}

// Уровень 1 — базовые слова (лёгкие) — 20 слов
export const accentWordsLevel1: AccentWord[] = [
  makeWord('w1', 'квартал', 4, 'Ударение на А: квартАл', 'easy'),
  makeWord('w2', 'километр', 5, 'Ударение на Е: киломЕтр', 'easy'),
  makeWord('w3', 'намерение', 3, 'Ударение на Е: намЕрение', 'easy'),
  makeWord('w4', 'недруг', 1, 'Ударение на Е: нЕдруг', 'easy'),
  makeWord('w5', 'недуг', 3, 'Ударение на У: недУг', 'easy'),
  makeWord('w6', 'каталог', 5, 'Ударение на О: каталОг', 'easy'),
  makeWord('w7', 'дешевизна', 5, 'Ударение на И: дешевИзна', 'easy'),
  makeWord('w8', 'договоренность', 5, 'Ударение на Ё: договорЁнность', 'easy'),
  makeWord('w9', 'значимость', 1, 'Ударение на А: знАчимость', 'easy'),
  makeWord('w10', 'ненависть', 1, 'Ударение на Е: нЕнависть', 'easy'),
  makeWord('w11', 'новостей', 5, 'Ударение на Е: новостЕй', 'easy'),
  makeWord('w12', 'ноготь', 1, 'Ударение на О: нОготь', 'easy'),
  makeWord('w13', 'позвонить', 5, 'Ударение на И: позвонИть', 'easy'),
  makeWord('w14', 'сверлить', 5, 'Ударение на И: сверлИть', 'easy'),
  makeWord('w15', 'диспансер', 5, 'Ударение на Е: диспансЕр', 'easy'),
  makeWord('w16', 'жалюзи', 5, 'Ударение на И: жалюзИ', 'easy'),
  makeWord('w17', 'досуг', 3, 'Ударение на У: досУг', 'easy'),
  makeWord('w18', 'корысть', 3, 'Ударение на Ы: корЫсть', 'easy'),
  makeWord('w19', 'краны', 2, 'Ударение на А: крАны', 'easy'),
  makeWord('w20', 'банты', 1, 'Ударение на А: бАнты', 'easy'),
]

// Уровень 2 — средние слова — 20 слов
export const accentWordsLevel2: AccentWord[] = [
  makeWord('w21', 'аэропорты', 5, 'Ударение на О: аэропОрты', 'medium'),
  makeWord('w22', 'местностей', 1, 'Ударение на Е: мЕстностей', 'medium'),
  makeWord('w23', 'нарост', 2, 'Ударение на О: нарОст', 'medium'),
  makeWord('w24', 'конусов', 1, 'Ударение на О: кОнусов', 'medium'),
  makeWord('w25', 'лыжня', 3, 'Ударение на Я: лыжнЯ', 'medium'),
  makeWord('w26', 'лекторов', 1, 'Ударение на Е: лЕкторов', 'medium'),
  makeWord('w27', 'локтя', 1, 'Ударение на О: лОктя', 'medium'),
  makeWord('w28', 'некролог', 3, 'Ударение на О: некрОлог', 'medium'),
  makeWord('w29', 'водопровод', 5, 'Ударение на О: водопровОд', 'medium'),
  makeWord('w30', 'дефис', 3, 'Ударение на И: дефИс', 'medium'),
  makeWord('w31', 'документ', 5, 'Ударение на Е: докумЕнт', 'medium'),
  makeWord('w32', 'гражданство', 5, 'Ударение на А: граждАнство', 'medium'),
  makeWord('w33', 'газопровод', 5, 'Ударение на О: газопровОд', 'medium'),
  makeWord('w34', 'бороду', 1, 'Ударение на О: бОроду', 'medium'),
  makeWord('w35', 'бухгалтеров', 5, 'Ударение на А: бухгАлтеров', 'medium'),
  makeWord('w36', 'еретик', 5, 'Ударение на И: еретИк', 'medium'),
  makeWord('w37', 'вероисповедание', 7, 'Ударение на Е: вероисповЕдание', 'medium'),
  makeWord('w38', 'иксы', 0, 'Ударение на И: Иксы', 'medium'),
  makeWord('w39', 'отрочество', 0, 'Ударение на О: Отрочество', 'medium'),
  makeWord('w40', 'некролог', 3, 'Ударение на О: некрОлог', 'medium'),
]

// Уровень 3 — сложные слова — 20 слов
export const accentWordsLevel3: AccentWord[] = [
  makeWord('w41', 'партера', 2, 'Ударение на Е: партЕр', 'hard'),
  makeWord('w42', 'портфель', 4, 'Ударение на Е: портфЕль', 'hard'),
  makeWord('w43', 'поручни', 1, 'Ударение на О: пОручни', 'hard'),
  makeWord('w44', 'приданое', 3, 'Ударение на А: придАное', 'hard'),
  makeWord('w45', 'призыв', 4, 'Ударение на Ы: призЫв', 'hard'),
  makeWord('w46', 'свекла', 1, 'Ударение на Ё: свЁкла', 'hard'),
  makeWord('w47', 'сироты', 3, 'Ударение на О: сирОты', 'hard'),
  makeWord('w48', 'созыв', 3, 'Ударение на Ы: созЫв', 'hard'),
  makeWord('w49', 'сосредоточение', 7, 'Ударение на О: сосредотОчение', 'hard'),
  makeWord('w50', 'средства', 2, 'Ударение на Е: срЕдства', 'hard'),
  makeWord('w51', 'статуя', 2, 'Ударение на А: стАтуя', 'hard'),
  makeWord('w52', 'столяр', 4, 'Ударение на Я: столЯр', 'hard'),
  makeWord('w53', 'таможня', 3, 'Ударение на О: тамОжня', 'hard'),
  makeWord('w54', 'торты', 1, 'Ударение на О: тОрты', 'hard'),
  makeWord('w55', 'туфля', 1, 'Ударение на У: тУфля', 'hard'),
  makeWord('w56', 'кремень', 3, 'Ударение на Е: кремЕнь', 'hard'),
  makeWord('w57', 'мужество', 3, 'Ударение на Е: мужЕство', 'hard'),
  makeWord('w58', 'обеспечить', 5, 'Ударение на Е: обеспЕчить', 'hard'),
  makeWord('w59', 'одобрить', 5, 'Ударение на И: одобрИть', 'hard'),
  makeWord('w60', 'оптовый', 3, 'Ударение на О: оптОвый', 'hard'),
]

export const allAccentWords: AccentWord[] = [
  ...accentWordsLevel1,
  ...accentWordsLevel2,
  ...accentWordsLevel3,
]

export const accentWordsById = Object.fromEntries(
  allAccentWords.map(w => [w.id, w])
)

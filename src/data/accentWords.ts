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

// Уровень 1 — базовые слова (лёгкие)
export const accentWordsLevel1: AccentWord[] = [
  makeWord('w1', 'квартал', 2, 'Ударение на второй слог: квартАл', 'easy'),
  makeWord('w2', 'километр', 2, 'Ударение на третий слог: киломЕтр', 'easy'),
  makeWord('w3', 'намерение', 1, 'Ударение на второй слог: намЕрение', 'easy'),
  makeWord('w4', 'недруг', 1, 'Ударение на первый слог: нЕдруг', 'easy'),
  makeWord('w5', 'недуг', 1, 'Ударение на первый слог: недУг', 'easy'),
  makeWord('w6', 'каталог', 3, 'Ударение на четвёртый слог: каталОг', 'easy'),
  makeWord('w7', 'дешевизна', 3, 'Ударение на четвёртый слог: дешевИзна', 'easy'),
  makeWord('w8', 'договоренность', 3, 'Ударение на четвёртый слог: договорЁнность', 'easy'),
  makeWord('w9', 'значимость', 1, 'Ударение на второй слог: знАчимость', 'easy'),
  makeWord('w10', 'неначисть', 1, 'Ударение на первый слог: нЕнависть', 'easy'),
  makeWord('w11', 'новостей', 1, 'Ударение на первый слог: новостЕй', 'easy'),
  makeWord('w12', 'ноготь', 1, 'Ударение на первый слог: нОготь', 'easy'),
  makeWord('w13', 'позвонить', 3, 'Ударение на четвёртый слог: позвонИть', 'easy'),
  makeWord('w14', 'сверлить', 3, 'Ударение на четвёртый слог: сверлИть', 'easy'),
  makeWord('w15', 'диспансер', 3, 'Ударение на четвёртый слог: диспансЕр', 'easy'),
  makeWord('w16', 'жалюзи', 3, 'Ударение на последний слог: жалюзИ', 'easy'),
  makeWord('w17', 'досуг', 3, 'Ударение на второй слог: досУг', 'easy'),
  makeWord('w18', 'корысть', 2, 'Ударение на третий слог: корЫсть', 'easy'),
  makeWord('w19', 'краны', 2, 'Ударение на третий слог: крАны', 'easy'),
  makeWord('w20', 'банты', 3, 'Ударение на четвёртый слог: бАнты', 'easy'),
]

// Уровень 2 — средние слова
export const accentWordsLevel2: AccentWord[] = [
  makeWord('w21', 'аэропорты', 3, 'Ударение на четвёртый слог: аэропОрты', 'medium'),
  makeWord('w22', 'местностей', 1, 'Ударение на второй слог: мЕстностей', 'medium'),
  makeWord('w23', 'нарост', 1, 'Ударение на второй слог: нарОст', 'medium'),
  makeWord('w24', 'конусов', 2, 'Ударение на третий слог: кОнусов', 'medium'),
  makeWord('w25', 'лыжня', 2, 'Ударение на третий слог: лыжнЯ', 'medium'),
  makeWord('w26', 'лекторов', 2, 'Ударение на третий слог: лЕкторов', 'medium'),
  makeWord('w27', 'локтя', 2, 'Ударение на третий слог: лОктя', 'medium'),
  makeWord('w28', 'некролог', 1, 'Ударение на второй слог: некрОлог', 'medium'),
  makeWord('w29', 'водопровод', 3, 'Ударение на четвёртый слог: водопровОд', 'medium'),
  makeWord('w30', 'дефис', 3, 'Ударение на четвёртый слог: дефИс', 'medium'),
  makeWord('w31', 'банты', 3, 'Ударение на четвёртый слог: бАнты', 'medium'),
  makeWord('w32', 'документ', 3, 'Ударение на четвёртый слог: докумЕнт', 'medium'),
  makeWord('w33', 'гражданство', 3, 'Ударение на четвёртый слог: граждАнство', 'medium'),
  makeWord('w34', 'газопровод', 3, 'Ударение на четвёртый слог: газопровОд', 'medium'),
  makeWord('w35', 'бороду', 3, 'Ударение на четвёртый слог: бОроду', 'medium'),
  makeWord('w36', 'бухгалтеров', 3, 'Ударение на четвёртый слог: бухгАлтеров', 'medium'),
  makeWord('w37', 'еретик', 3, 'Ударение на четвёртый слог: еретИк', 'medium'),
  makeWord('w38', 'вероисповедание', 3, 'Ударение на четвёртый слог: вероисповЕдание', 'medium'),
  makeWord('w39', 'иксы', 3, 'Ударение на второй слог: Иксы', 'medium'),
  makeWord('w40', 'отрочество', 1, 'Ударение на первый слог: Отрочество', 'medium'),
]

// Уровень 3 — сложные слова
export const accentWordsLevel3: AccentWord[] = [
  makeWord('w41', 'партера', 1, 'Ударение на второй слог: партЕр', 'hard'),
  makeWord('w42', 'портфель', 1, 'Ударение на второй слог: портфЕль', 'hard'),
  makeWord('w43', 'поручни', 1, 'Ударение на второй слог: пОручни', 'hard'),
  makeWord('w44', 'приданое', 1, 'Ударение на второй слог: придАное', 'hard'),
  makeWord('w45', 'призыв', 1, 'Ударение на второй слог: призЫв', 'hard'),
  makeWord('w46', 'свекла', 1, 'Ударение на первый слог: свЁкла', 'hard'),
  makeWord('w47', 'сироты', 1, 'Ударение на второй слог: сирОты', 'hard'),
  makeWord('w48', 'созыв', 1, 'Ударение на второй слог: созЫв', 'hard'),
  makeWord('w49', 'сосредоточение', 1, 'Ударение на пятый слог: сосредотОчение', 'hard'),
  makeWord('w50', 'средства', 1, 'Ударение на второй слог: срЕдства', 'hard'),
  makeWord('w51', 'статуя', 1, 'Ударение на второй слог: стАтуя', 'hard'),
  makeWord('w52', 'столяр', 1, 'Ударение на второй слог: столЯр', 'hard'),
  makeWord('w53', 'таможня', 1, 'Ударение на второй слог: тамОжня', 'hard'),
  makeWord('w54', 'торты', 1, 'Ударение на первый слог: тОрты', 'hard'),
  makeWord('w55', 'туфля', 1, 'Ударение на первый слог: тУфля', 'hard'),
  makeWord('w56', 'кремнь', 2, 'Ударение на третий слог: кремЕнь', 'hard'),
  makeWord('w57', 'мужество', 1, 'Ударение на второй слог: мужество', 'hard'),
  makeWord('w58', 'обеспечить', 3, 'Ударение на четвёртый слог: обеспЕчить', 'hard'),
  makeWord('w59', 'одобрить', 3, 'Ударение на четвёртый слог: одобрИть', 'hard'),
  makeWord('w60', 'оптовый', 3, 'Ударение на четвёртый слог: оптОвый', 'hard'),
]

export const allAccentWords: AccentWord[] = [
  ...accentWordsLevel1,
  ...accentWordsLevel2,
  ...accentWordsLevel3,
]

export const accentWordsById = Object.fromEntries(
  allAccentWords.map(w => [w.id, w])
)

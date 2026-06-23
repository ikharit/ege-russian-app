// Unified Question Mapping
// ========================
// Система связывает все дублирующиеся вопросы (из курса, банка заданий, тренажёров)
// через canonicalWordId — единый идентификатор слова/корня в рамках номера задания.
//
// Примеры canonicalWordId:
//   word:блестать:task9       ← слово "блестать" в задании №9
//   word:превысить:task10      ← слово "превысить" в задании №10
//   word:запирать:task9        ← слово "запирать" в задании №9
//   rule:prefix_pre_pri:task10 ← правило приставок ПРЕ-/ПРИ- в задании №10

// Маппинг: canonicalWordId → { word, taskNumber, ruleId?, atomIds?, questionIds[] }
export interface CanonicalMapping {
  word: string          // нормализованное слово (или название правила)
  taskNumber: string
  ruleId?: string      // ID правила из task9-rules.json (если применимо)
  atomIds?: string[]    // связанные атомы
  questionIds: string[] // все questionId, относящиеся к этому слову/правилу
}

// ========================
// AUTO-GENERATED MAPPING
// ========================
// Этот объект строится автоматически при импорте всех вопросов.
// Для ручного добавления используй функцию registerQuestionMapping.

export const questionMapping: Record<string, CanonicalMapping> = {}

// ========================
// Ручной маппинг (дублирующиеся слова из разных файлов)
// ========================
// Формат: canonicalWordId → { word, taskNumber, questionIds: [...] }

const manualMappings: Record<string, Omit<CanonicalMapping, 'questionIds'> & { questionIds: string[] }> = {
  // Задание №9 — Чередование гласных в корне
  'word:стеречь:task9': {
    word: 'стеречь',
    taskNumber: '9',
    ruleId: 'alternation_der_dra',
    atomIds: ['root_der_dra', 'vowel_alternation'],
    questionIds: ['q9-1', 'qd9-401'],
  },
  'word:выскочка:task9': {
    word: 'выскочка',
    taskNumber: '9',
    ruleId: 'alternation_skak_skoch',
    atomIds: ['root_skak_skoch', 'vowel_alternation'],
    questionIds: ['q9-4', 'qd9-404'],
  },
  'word:ростовщик:task9': {
    word: 'ростовщик',
    taskNumber: '9',
    ruleId: 'alternation_rast_rast',
    atomIds: ['root_rast_rast', 'vowel_alternation'],
    questionIds: ['q9-5', 'qd9-405'],
  },
  'word:запирать:task9': {
    word: 'запирать',
    taskNumber: '9',
    ruleId: 'alternation_per_pri',
    atomIds: ['root_per_pri', 'vowel_alternation'],
    questionIds: ['qd9-14', 't9-11'],
  },
  'word:блестать:task9': {
    word: 'блестать',
    taskNumber: '9',
    ruleId: 'alternation_blist_blest',
    atomIds: ['root_blist_blest', 'vowel_alternation'],
    questionIds: ['qd9-1', 'qd9-515'],
  },
  'word:плавать:task9': {
    word: 'плавать',
    taskNumber: '9',
    ruleId: 'alternation_plav_plov',
    atomIds: ['root_plav_plov', 'vowel_alternation'],
    questionIds: ['qd9-80', 'qd9-121', 'qd9-144', 'qd9-756'],
  },
  'word:вырасти:task9': {
    word: 'вырасти',
    taskNumber: '9',
    ruleId: 'alternation_rast_rasch_ros',
    atomIds: ['root_rast_rasch_ros', 'vowel_alternation'],
    questionIds: ['qd9-387', 'qd9-446', 'qd9-636', 'qd9-684', 'qd9-760'],
  },
  'word:почитатель:task9': {
    word: 'почитатель',
    taskNumber: '9',
    ruleId: 'alternation_chit_chit',
    atomIds: ['root_chit_chit', 'vowel_alternation'],
    questionIds: ['q9-13'],
  },
  'word:обжигаться:task9': {
    word: 'обжигаться',
    taskNumber: '9',
    ruleId: 'alternation_zhig_zhig',
    atomIds: ['root_zhig_zhig', 'vowel_alternation'],
    questionIds: ['q9-14'],
  },
  'word:выдрать:task9': {
    word: 'выдрать',
    taskNumber: '9',
    ruleId: 'alternation_dir_dra',
    atomIds: ['root_dir_dra', 'vowel_alternation'],
    questionIds: ['q9-9', 'qd9-409'],
  },
  'word:парадоксальный:task9': {
    word: 'парадоксальный',
    taskNumber: '9',
    ruleId: 'foreign_paradox',
    atomIds: ['foreign_words'],
    questionIds: ['q9-12'],
  },
  'word:аналогичный:task9': {
    word: 'аналогичный',
    taskNumber: '9',
    ruleId: 'foreign_analog',
    atomIds: ['foreign_words'],
    questionIds: ['qd9-429'],
  },
  'word:покоситься:task9': {
    word: 'покоситься',
    taskNumber: '9',
    ruleId: 'alternation_kos_kos',
    atomIds: ['root_kos_kos', 'vowel_alternation'],
    questionIds: ['qd9-283'],
  },
  'word:облагаться:task9': {
    word: 'облагаться',
    taskNumber: '9',
    ruleId: 'alternation_lag_lag',
    atomIds: ['root_lag_lag', 'vowel_alternation'],
    questionIds: ['qd9-74'],
  },
  'word:спешить:task9': {
    word: 'спешить',
    taskNumber: '9',
    ruleId: 'alternation_spesh_spesh',
    atomIds: ['root_spesh_spesh', 'vowel_alternation'],
    questionIds: ['qd9-408'],
  },

  // Задание №10 — ПРЕ-/ПРИ- и другие приставки
  'word:превысить:task10': {
    word: 'превысить',
    taskNumber: '10',
    ruleId: 'prefix_pre_pri',
    atomIds: ['prefix_pre_pri'],
    questionIds: ['q10-atom-1'],
  },
  'word:приблизить:task10': {
    word: 'приблизить',
    taskNumber: '10',
    ruleId: 'prefix_pre_pri',
    atomIds: ['prefix_pre_pri'],
    questionIds: ['q10-atom-2'],
  },
}

// ========================
// Инициализация
// ========================
for (const [canonicalId, mapping] of Object.entries(manualMappings)) {
  questionMapping[canonicalId] = mapping
}

// ========================
// Функции
// ========================

/**
 * Извлекает нормализованное слово из текста вопроса.
 * Пример: "Впишите пропущенную букву: бл_стать" → "блестать"
 */
export function extractWordFromQuestion(text: string): string | null {
  // Убираем префикс
  const clean = text.replace(/^[^:]+:\s*/, '').trim()
  // Убираем пропуски (.. или _)
  const word = clean.replace(/[._]+/g, '').trim().toLowerCase()
  return word || null
}

/**
 * Возвращает canonicalWordId для вопроса.
 * Сначала ищет по questionId в маппинге, если не найдено — генерирует из слова.
 */
export function getCanonicalWordId(question: { id: string; text: string; taskNumber?: string }): string | undefined {
  // 1. Ищем по questionId
  for (const [canonicalId, mapping] of Object.entries(questionMapping)) {
    if (mapping.questionIds.includes(question.id)) {
      return canonicalId
    }
  }
  // 2. Если не нашли — генерируем из слова (best-effort)
  const word = extractWordFromQuestion(question.text)
  if (word) {
    const taskNum = question.taskNumber || 'unknown'
    return `word:${word}:task${taskNum}`
  }
  return undefined
}

/**
 * Возвращает ruleId для вопроса (если есть в маппинге).
 */
export function getRuleId(questionId: string): string | undefined {
  for (const mapping of Object.values(questionMapping)) {
    if (mapping.questionIds.includes(questionId)) {
      return mapping.ruleId
    }
  }
  return undefined
}

/**
 * Возвращает все questionIds для данного canonicalWordId.
 */
export function getQuestionIdsByCanonical(canonicalWordId: string): string[] {
  return questionMapping[canonicalWordId]?.questionIds || []
}

/**
 * Регистрирует новый вопрос в маппинге (runtime).
 */
export function registerQuestionMapping(
  canonicalWordId: string,
  questionId: string,
  word: string,
  taskNumber: string,
  ruleId?: string,
  atomIds?: string[]
) {
  if (!questionMapping[canonicalWordId]) {
    questionMapping[canonicalWordId] = {
      word,
      taskNumber,
      ruleId,
      atomIds,
      questionIds: [],
    }
  }
  if (!questionMapping[canonicalWordId].questionIds.includes(questionId)) {
    questionMapping[canonicalWordId].questionIds.push(questionId)
  }
}

/**
 * Агрегирует ошибки по canonicalWordId из массива WrongAnswer.
 * Возвращает: { canonicalWordId, word, ruleId, wrongCount, questionIds[], taskNumber }
 */
export function aggregateErrorsByWord(
  wrongAnswers: { questionId: string; canonicalWordId?: string; word?: string; ruleId?: string; taskNumber?: string }[]
): Array<{
  canonicalWordId: string
  word: string
  ruleId?: string
  taskNumber?: string
  wrongCount: number
  questionIds: string[]
}> {
  const map: Record<string, {
    canonicalWordId: string
    word: string
    ruleId?: string
    taskNumber?: string
    wrongCount: number
    questionIds: Set<string>
  }> = {}

  for (const wa of wrongAnswers) {
    const cid = wa.canonicalWordId || `unknown:${wa.questionId}`
    if (!map[cid]) {
      map[cid] = {
        canonicalWordId: cid,
        word: wa.word || 'unknown',
        ruleId: wa.ruleId,
        taskNumber: wa.taskNumber,
        wrongCount: 0,
        questionIds: new Set(),
      }
    }
    map[cid].wrongCount++
    map[cid].questionIds.add(wa.questionId)
  }

  return Object.values(map).map(m => ({
    ...m,
    questionIds: Array.from(m.questionIds),
  }))
}

/**
 * Агрегирует ошибки по ruleId.
 */
export function aggregateErrorsByRule(
  wrongAnswers: { ruleId?: string; word?: string; taskNumber?: string }[]
): Array<{
  ruleId: string
  word?: string
  taskNumber?: string
  wrongCount: number
  words: string[]
}> {
  const map: Record<string, {
    ruleId: string
    taskNumber?: string
    wrongCount: number
    words: Set<string>
  }> = {}

  for (const wa of wrongAnswers) {
    const rid = wa.ruleId || 'unknown'
    if (!map[rid]) {
      map[rid] = {
        ruleId: rid,
        taskNumber: wa.taskNumber,
        wrongCount: 0,
        words: new Set(),
      }
    }
    map[rid].wrongCount++
    if (wa.word) map[rid].words.add(wa.word)
  }

  return Object.values(map).map(m => ({
    ...m,
    words: Array.from(m.words),
  }))
}

export default questionMapping

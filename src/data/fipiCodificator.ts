/**
 * ЕДИНЫЙ КОДИФИКАТОР ФИПИ — ЕГЭ по русскому языку (2026)
 * ═══════════════════════════════════════════════════════
 * Это единый источник истины (single source of truth) для всех агентов.
 * Любое задание в проекте ДОЛЖНО соответствовать этому кодификатору.
 *
 * Правила:
 * 1. Номер задания → формат → темы — строго по ФИПИ
 * 2. Если в проекте задание с номером N не соответствует формату — это ошибка
 * 3. При добавлении новых заданий — проверять через этот файл
 */

export interface FIPITaskFormat {
  /** Номер задания по ФИПИ (1–27) */
  taskNumber: number
  /** Короткое название */
  shortName: string
  /** Полное название по ФИПИ */
  fullName: string
  /** Формат задания (определяет UI и тип ответа) */
  format: 'single-choice' | 'multiple-choice' | 'text-input' | 'ege-multiple' | 'essay'
  /** Часть экзамена */
  part: 1 | 2
  /** Тип ответа */
  answerType: 'letter' | 'number' | 'word' | 'sentence' | 'essay'
  /** Балл за задание */
  maxScore: number
  /** Темы, проверяемые в задании */
  topics: string[]
  /** Примеры заданий (формат вопроса) */
  examples: string[]
  /** Проверочные элементы по кодификатору ФИПИ */
  codificatorElements: string[]
  /** Файлы в проекте, где хранятся задания этого типа */
  projectFiles: string[]
  /** Статус в проекте */
  status: 'implemented' | 'partial' | 'not-implemented'
}

export const FIPICodificator: Record<number, FIPITaskFormat> = {
  // ═══════════════════════════════════════════════════════
  // ЧАСТЬ 1 — Задания с кратким ответом
  // ═══════════════════════════════════════════════════════

  1: {
    taskNumber: 1,
    shortName: 'Ударения',
    fullName: 'Установление соответствия между ударением и буквой',
    format: 'single-choice',
    part: 1,
    answerType: 'letter',
    maxScore: 1,
    topics: ['Ударения', 'Орфоэпия', 'Буква Ё'],
    examples: ['Впишите ударную букву: аэропОрт'],
    codificatorElements: ['1.1', '1.2'],
    projectFiles: ['src/data/accentWords.ts', 'src/pages/AccentTrainer.tsx'],
    status: 'implemented',
  },

  2: {
    taskNumber: 2,
    shortName: 'Паронимы',
    fullName: 'Употребление паронимов',
    format: 'single-choice',
    part: 1,
    answerType: 'word',
    maxScore: 1,
    topics: ['Паронимы', 'Лексические нормы'],
    examples: ['Выберите правильное слово: предоставить/представить'],
    codificatorElements: ['2.1'],
    projectFiles: ['src/data/task5Questions.ts', 'src/pages/Task5Trainer.tsx'],
    status: 'implemented',
  },

  3: {
    taskNumber: 3,
    shortName: 'Лексические нормы',
    fullName: 'Лексические нормы (устойчивые словосочетания)',
    format: 'single-choice',
    part: 1,
    answerType: 'word',
    maxScore: 1,
    topics: ['Лексические нормы', 'Устойчивые словосочетания', 'Фразеологизмы'],
    examples: ['Выберите правильное слово: оказать влияние/воздействие'],
    codificatorElements: ['2.2'],
    projectFiles: [],
    status: 'not-implemented',
  },

  4: {
    taskNumber: 4,
    shortName: 'Грамматические нормы',
    fullName: 'Грамматические нормы (управление, формы слов)',
    format: 'single-choice',
    part: 1,
    answerType: 'word',
    maxScore: 1,
    topics: ['Грамматические нормы', 'Управление', 'Формы слов'],
    examples: ['Выберите правильную форму: не с кем/ни с кем'],
    codificatorElements: ['2.3'],
    projectFiles: [],
    status: 'not-implemented',
  },

  5: {
    taskNumber: 5,
    shortName: 'Орфоэпия',
    fullName: 'Орфоэпические нормы (произношение)',
    format: 'single-choice',
    part: 1,
    answerType: 'word',
    maxScore: 1,
    topics: ['Орфоэпия', 'Произношение', 'Ударение'],
    examples: ['Выберите слово с правильным произношением: квартАл/квартал'],
    codificatorElements: ['2.4'],
    projectFiles: [],
    status: 'not-implemented',
  },

  6: {
    taskNumber: 6,
    shortName: 'Ударения (ошибка)',
    fullName: 'Установление ударения в словах (найти ошибку)',
    format: 'multiple-choice',
    part: 1,
    answerType: 'number',
    maxScore: 1,
    topics: ['Ударения', 'Орфоэпия', 'Неправильное ударение'],
    examples: ['Укажите слово, где ударение поставлено НЕВЕРНО: аэропОрт, квартАл...'],
    codificatorElements: ['2.5'],
    projectFiles: [],
    status: 'not-implemented',
  },

  7: {
    taskNumber: 7,
    shortName: 'НЕ/НИ',
    fullName: 'Правописание НЕ и НИ с разными частями речи',
    format: 'text-input',
    part: 1,
    answerType: 'word',
    maxScore: 1,
    topics: ['НЕ/НИ', 'Частицы', 'Приставки', 'Отрицание'],
    examples: ['Впишите пропущенную частицу: (не)вероятно, (не)забываемый'],
    codificatorElements: ['3.1'],
    projectFiles: ['src/data/task10Questions.ts', 'src/pages/Task10Trainer.tsx'],
    status: 'implemented',
  },

  8: {
    taskNumber: 8,
    shortName: 'Корень',
    fullName: 'Правописание безударной гласной в корне слова',
    format: 'text-input',
    part: 1,
    answerType: 'letter',
    maxScore: 1,
    topics: ['Корень', 'Проверяемая гласная', 'Чередующаяся гласная', 'Непроверяемая гласная'],
    examples: ['Впишите пропущенную букву: иск_зить, оп_лчение'],
    codificatorElements: ['3.2'],
    projectFiles: [
      'src/data/sections/dooshin/task9.ts',
      'src/data/sections/orthography.ts',
      'src/data/rules/task9-rules.json',
    ],
    status: 'implemented',
  },

  9: {
    taskNumber: 9,
    shortName: 'Приставки',
    fullName: 'Правописание приставок (ПРЕ/ПРИ, ЗА/С, НЕ/НИ, НАД/НАДО, БЕЗ/БЕС)',
    format: 'text-input',
    part: 1,
    answerType: 'letter',
    maxScore: 1,
    topics: ['Приставки', 'ПРЕ/ПРИ', 'ЗА/С', 'НЕ/НИ', 'НАД/НАДО', 'БЕЗ/БЕС', 'ИС/ИЗ/ВОЗ/ВЗО/ВОС'],
    examples: ['Впишите пропущенные буквы: пр_дать, с_полнить, в_збудить'],
    codificatorElements: ['3.3'],
    projectFiles: ['src/data/sections/dooshin/task10.ts', 'src/data/sections/orthography.ts'],
    status: 'implemented',
  },

  10: {
    taskNumber: 10,
    shortName: 'Суффиксы',
    fullName: 'Правописание суффиксов (кроме -Н/-НН-)',
    format: 'text-input',
    part: 1,
    answerType: 'letter',
    maxScore: 1,
    topics: ['Суффиксы', 'Суффикс -ЕВ/-ОВ/-ИВ', 'Суффикс -ИК/-ЕК', 'Суффикс -ЕЦ/-ИЦ', 'Суффикс -ЧИК/-ЧЕК/-ЧН', 'Суффикс -ИВА/-ЕВА/-ЫВА/-АВА', 'Суффикс -ИТЕЛЬ/-АТЕЛЬ/-ЕЛЬ', 'Суффикс -ОСТЬ/-ЕСТЬ', 'Суффикс -ИЗН/-ЕЗН', 'Суффикс -ИН/-АН/-ЯН', 'Суффикс -ОВАТ/-ЕВАТ', 'Суффикс -ЕНИЕ/-ИНИЕ', 'Суффикс -ЕСК/-ИСК', 'Суффикс -ЧАТ/-ЩАТ', 'Суффикс -ЧИВАТ/-ЧЕВАТ'],
    examples: ['Впишите пропущенную букву: к_рочка, р_бота'],
    codificatorElements: ['3.4'],
    projectFiles: ['src/data/sections/dooshin/task11.ts'],
    status: 'implemented',
  },

  11: {
    taskNumber: 11,
    shortName: 'Н/НН',
    fullName: 'Правописание -Н- и -НН- в суффиксах',
    format: 'text-input',
    part: 1,
    answerType: 'letter',
    maxScore: 1,
    topics: ['Н/НН', 'Причастия', 'Отглагольные прилагательные', 'Суффикс -ЕНН-', 'Суффикс -ОНН-', 'Суффикс -ИН-', 'Приставки с НЕ'],
    examples: ['Впишите пропущенные буквы: дерев_нный, кожа_ый'],
    codificatorElements: ['3.5'],
    projectFiles: ['src/data/sections/dooshin/task12.ts', 'src/data/sections/n_nn.ts'],
    status: 'implemented',
  },

  12: {
    taskNumber: 12,
    shortName: 'Не с разными частями речи',
    fullName: 'Правописание НЕ с разными частями речи',
    format: 'text-input',
    part: 1,
    answerType: 'word',
    maxScore: 1,
    topics: ['НЕ', 'Частицы', 'Наречия', 'Прилагательные', 'Причастия', 'Глаголы', 'Категория состояния'],
    examples: ['Впишите пропущенную частицу: (не)забываемый, (не)внимательно'],
    codificatorElements: ['3.6'],
    projectFiles: ['src/data/sections/dooshin/task10.ts'],
    status: 'partial',
  },

  13: {
    taskNumber: 13,
    shortName: 'Сложные слова',
    fullName: 'Правописание сложных слов',
    format: 'text-input',
    part: 1,
    answerType: 'letter',
    maxScore: 1,
    topics: ['Сложные слова', 'Слитное/дефисное/раздельное написание', 'Наречия', 'Сложные прилагательные', 'Сложные существительные', 'Сложные предикативы', 'Числительные', 'Де-/ДИС-/АНТИ-/КОНТР-/ПОЛУ-/ПСЕВДО-'],
    examples: ['Впишите пропущенную букву: (в)воздух, (в)збрание'],
    codificatorElements: ['3.7'],
    projectFiles: ['src/data/sections/dooshin/task15.ts'],
    status: 'implemented',
  },

  14: {
    taskNumber: 14,
    shortName: 'Придаточные и однородные',
    fullName: 'Пунктуация в сложноподчинённом предложении (придаточные и однородные)',
    format: 'ege-multiple',
    part: 1,
    answerType: 'number',
    maxScore: 1,
    topics: ['Придаточные предложения', 'Однородные члены', 'Союзы', 'Запятые'],
    examples: ['Укажите цифры, на местах которых нужно поставить запятые: ...'],
    codificatorElements: ['4.1', '4.2'],
    projectFiles: ['src/data/sections/dooshin/task14.ts'],
    status: 'partial',
  },

  15: {
    taskNumber: 15,
    shortName: 'Вводные слова и обращения',
    fullName: 'Пунктуация (вводные слова, обращения, обособленные члены)',
    format: 'ege-multiple',
    part: 1,
    answerType: 'number',
    maxScore: 1,
    topics: ['Вводные слова', 'Обращения', 'Обособленные члены', 'Вводные конструкции', 'Уточняющие члены', 'Причастный оборот', 'Деепричастный оборот', 'Сравнительный оборот', 'Однородные члены с союзами'],
    examples: ['Укажите цифры, на местах которых нужно поставить запятые: ...'],
    codificatorElements: ['4.3', '4.4', '4.5'],
    projectFiles: ['src/data/sections/dooshin/task15.ts'],
    status: 'partial',
  },

  16: {
    taskNumber: 16,
    shortName: 'Два предложения с одной запятой',
    fullName: 'Указание двух предложений, в которых нужно поставить одну запятую',
    format: 'ege-multiple',
    part: 1,
    answerType: 'number',
    maxScore: 2,
    topics: ['Придаточные предложения', 'Сложносочинённые предложения', 'Вводные слова', 'Обособленные члены', 'Однородные члены', 'Прямая речь', 'Обращения'],
    examples: ['Укажите два предложения, в которых нужно поставить одну запятую: 1)... 2)... 3)... 4)... 5)...'],
    codificatorElements: ['4.1', '4.2', '4.3', '4.4', '4.5'],
    projectFiles: [
      'src/data/task16Questions.ts',
      'src/pages/Task16Trainer.tsx',
    ],
    status: 'partial',
  },

  17: {
    taskNumber: 17,
    shortName: 'Сколько запятых?',
    fullName: 'Сколько запятых нужно поставить в предложении?',
    format: 'single-choice',
    part: 1,
    answerType: 'number',
    maxScore: 1,
    topics: ['Придаточные предложения', 'Сложносочинённые предложения', 'Вводные слова', 'Обособленные члены', 'Однородные члены', 'Прямая речь', 'Обращения', 'Причастные обороты', 'Деепричастные обороты'],
    examples: ['Сколько запятых нужно поставить в предложении? Когда начался дождь мы укрылись под крышей. (0/1/2/3)'],
    codificatorElements: ['4.1', '4.2', '4.3', '4.4', '4.5', '4.6'],
    projectFiles: [
      'src/data/task17Questions.ts',
      'src/data/task16LessonData.ts',    // ⚠️ ОШИБКА НАЗВАНИЯ — это task17 по формату
      'src/data/sections/punctuation.ts', // ⚠️ lesson-punct-16-* — это task17 по формату
      'src/pages/Task16Trainer.tsx',     // ⚠️ использует task16Questions, но формат — task17
    ],
    status: 'implemented',
  },

  18: {
    taskNumber: 18,
    shortName: 'Лексические средства',
    fullName: 'Лексические средства выразительности',
    format: 'single-choice',
    part: 1,
    answerType: 'word',
    maxScore: 1,
    topics: ['Лексические средства', 'Эпитет', 'Метафора', 'Сравнение', 'Олицетворение', 'Аллегория', 'Ирония', 'Перифраз', 'Эвфемизм', 'Антонимы', 'Синонимы', 'Омонимы', 'Паронимы', 'Архаизмы', 'Неологизмы', 'Диалектизмы', 'Профессионализмы', 'Жаргонизмы'],
    examples: ['Какое лексическое средство использовано в предложении?'],
    codificatorElements: ['5.1'],
    projectFiles: [],
    status: 'not-implemented',
  },

  19: {
    taskNumber: 19,
    shortName: 'Грамматические средства',
    fullName: 'Грамматические средства выразительности',
    format: 'single-choice',
    part: 1,
    answerType: 'word',
    maxScore: 1,
    topics: ['Грамматические средства', 'Морфологические средства', 'Синтаксические средства', 'Восклицательные предложения', 'Вопросительные предложения', 'Повторы', 'Параллелизм', 'Анафора', 'Эпифора', 'Инверсия', 'Риторический вопрос', 'Односоставные предложения'],
    examples: ['Какое грамматическое средство использовано в предложении?'],
    codificatorElements: ['5.2'],
    projectFiles: [],
    status: 'not-implemented',
  },

  20: {
    taskNumber: 20,
    shortName: 'Коммуникативная задача',
    fullName: 'Компоненты коммуникативной задачи текста',
    format: 'single-choice',
    part: 1,
    answerType: 'word',
    maxScore: 1,
    topics: ['Коммуникативная задача', 'Тема', 'Проблема', 'Тезис', 'Тип речи', 'Адресат', 'Цель высказывания', 'Жанр', 'Средства связи', 'Смысловые связи', 'Логические связи'],
    examples: ['Какова коммуникативная задача текста?'],
    codificatorElements: ['6.1'],
    projectFiles: [],
    status: 'not-implemented',
  },

  21: {
    taskNumber: 21,
    shortName: 'Средства связи',
    fullName: 'Средства связи предложений в тексте',
    format: 'single-choice',
    part: 1,
    answerType: 'word',
    maxScore: 1,
    topics: ['Средства связи', 'Синтаксические', 'Лексические', 'Морфологические', 'Анафора', 'Эпифора', 'Ключевое слово', 'Синонимы', 'Антонимы', 'Союзы', 'Союзные слова', 'Местоимения', 'Деепричастия', 'Причастия', 'Инфинитив', 'Повтор', 'Параллелизм', 'Вопросно-ответная форма'],
    examples: ['Какое средство связи используется между предложениями?'],
    codificatorElements: ['6.2'],
    projectFiles: [],
    status: 'not-implemented',
  },

  22: {
    taskNumber: 22,
    shortName: 'Типы речи',
    fullName: 'Типы речи (описание, повествование, рассуждение)',
    format: 'single-choice',
    part: 1,
    answerType: 'word',
    maxScore: 1,
    topics: ['Типы речи', 'Описание', 'Повествование', 'Рассуждение', 'Смешанный тип'],
    examples: ['Какой тип речи представлен в тексте?'],
    codificatorElements: ['6.3'],
    projectFiles: [],
    status: 'not-implemented',
  },

  23: {
    taskNumber: 23,
    shortName: 'Лексический анализ',
    fullName: 'Лексический анализ текста (значение слова)',
    format: 'single-choice',
    part: 1,
    answerType: 'word',
    maxScore: 1,
    topics: ['Лексический анализ', 'Значение слова', 'Прямое/переносное', 'Синонимы', 'Антонимы', 'Омонимы', 'Паронимы', 'Стилистическая окраска', 'Экспрессия', 'Активные/пассивные словари', 'Устаревшие слова', 'Неологизмы'],
    examples: ['Каково значение слова в контексте текста?'],
    codificatorElements: ['6.4'],
    projectFiles: [],
    status: 'not-implemented',
  },

  24: {
    taskNumber: 24,
    shortName: 'Орфографические ошибки',
    fullName: 'Поиск орфографических ошибок в тексте',
    format: 'single-choice',
    part: 1,
    answerType: 'word',
    maxScore: 1,
    topics: ['Орфографические ошибки', 'Корень', 'Приставки', 'Суффиксы', 'Н/НН', 'Сложные слова', 'Проверяемая гласная', 'Чередующаяся гласная', 'Не с разными частями речи'],
    examples: ['Найдите слово с орфографической ошибкой'],
    codificatorElements: ['6.5'],
    projectFiles: [],
    status: 'not-implemented',
  },

  25: {
    taskNumber: 25,
    shortName: 'Пунктуационные ошибки',
    fullName: 'Поиск пунктуационных ошибок в тексте',
    format: 'single-choice',
    part: 1,
    answerType: 'word',
    maxScore: 1,
    topics: ['Пунктуационные ошибки', 'Запятые', 'Придаточные', 'Вводные слова', 'Обособленные члены', 'Однородные члены', 'Прямая речь', 'Обращения', 'Двоеточие', 'Тире', 'Скобки', 'Кавычки'],
    examples: ['Найдите предложение с пунктуационной ошибкой'],
    codificatorElements: ['6.6'],
    projectFiles: [],
    status: 'not-implemented',
  },

  26: {
    taskNumber: 26,
    shortName: 'Установление соответствия',
    fullName: 'Установление соответствия между грамматическими категориями',
    format: 'single-choice',
    part: 1,
    answerType: 'word',
    maxScore: 1,
    topics: ['Грамматические категории', 'Части речи', 'Род', 'Число', 'Падеж', 'Время', 'Наклонение', 'Вид', 'Залог', 'Степень сравнения', 'Лицо', 'Предлоги', 'Союзы', 'Местоимения', 'Наречия', 'Прилагательные', 'Причастия', 'Деепричастия'],
    examples: ['Установите соответствие между грамматическими категориями'],
    codificatorElements: ['6.7'],
    projectFiles: [],
    status: 'not-implemented',
  },

  // ═══════════════════════════════════════════════════════
  // ЧАСТЬ 2 — Задания с развёрнутым ответом
  // ═══════════════════════════════════════════════════════

  27: {
    taskNumber: 27,
    shortName: 'Сочинение',
    fullName: 'Сочинение-рассуждение на лингвистическую тему',
    format: 'essay',
    part: 2,
    answerType: 'essay',
    maxScore: 24,
    topics: ['Сочинение', 'Рассуждение', 'Лингвистический анализ', 'Аргументы', 'Примеры', 'Средства связи', 'Лексические средства', 'Грамматические средства', 'Стилистика', 'Орфография', 'Пунктуация', 'Композиция', 'Тезис', 'Аргументация', 'Вывод'],
    examples: ['Напишите сочинение-рассуждение на лингвистическую тему (200-250 слов)'],
    codificatorElements: ['7.1', '7.2', '7.3', '7.4', '7.5', '7.6', '7.7'],
    projectFiles: ['src/pages/EssayPage.tsx', 'src/data/essayTopics.ts'],
    status: 'partial',
  },
}

/**
 * Вспомогательные функции для работы с кодификатором
 */

/** Получить формат задания по номеру */
export function getTaskFormat(taskNumber: number): FIPITaskFormat | undefined {
  return FIPICodificator[taskNumber]
}

/** Получить все задания определённого статуса */
export function getTasksByStatus(status: FIPITaskFormat['status']): FIPITaskFormat[] {
  return Object.values(FIPICodificator).filter(t => t.status === status)
}

/** Получить все задания определённой части */
export function getTasksByPart(part: 1 | 2): FIPITaskFormat[] {
  return Object.values(FIPICodificator).filter(t => t.part === part)
}

/** Проверить, соответствует ли задание в проекте кодификатору */
export function validateTaskFormat(
  taskNumber: number,
  actualFormat: string,
  actualTopics: string[]
): { valid: boolean; issues: string[] } {
  const format = getTaskFormat(taskNumber)
  if (!format) {
    return { valid: false, issues: [`Задание ${taskNumber} не найдено в кодификаторе`] }
  }

  const issues: string[] = []

  // Проверка формата
  if (actualFormat !== format.format) {
    issues.push(
      `Формат не соответствует: ожидается "${format.format}", получено "${actualFormat}"`
    )
  }

  // Проверка тем
  const missingTopics = format.topics.filter(t => !actualTopics.includes(t))
  if (missingTopics.length > 0) {
    issues.push(`Отсутствуют темы: ${missingTopics.join(', ')}`)
  }

  return { valid: issues.length === 0, issues }
}

/** Получить список несоответствий в проекте (known issues) */
export function getKnownIssues(): string[] {
  return [
    '⚠️ task16LessonData.ts назван как task16, но по формату — task17 ("Сколько запятых?")',
    '⚠️ punctuation.ts: lesson-punct-16-* — по формату task17, а не task16',
    '⚠️ task16Questions.ts: формат "Укажите предложение" (1 из 5) — это скорее task16, но по ФИПИ task16 = "2 предложения из 5"',
  ]
}

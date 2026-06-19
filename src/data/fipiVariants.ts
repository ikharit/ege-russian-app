export type FipiTaskType = 'theory' | 'practice' | 'essay'

export interface FipiTask {
  taskNumber: number
  type: FipiTaskType
  title: string
  maxScore: number
  sectionId: string
  dataSource: string
  questionCount: number
}

export interface FipiVariant {
  id: string
  name: string
  year: number
  description: string
  tasks: FipiTask[]
  timeLimit: number // minutes
  primaryScore: number
  secondaryScore: number
}

export interface ExamResult {
  variantId: string
  date: string
  primaryScore: number
  secondaryScore: number
  taskScores: Record<number, number>
  timeSpent: number // seconds
}

export const fipiVariants: FipiVariant[] = [
  {
    id: 'variant-demo-1',
    name: 'Вариант 1 (демо)',
    year: 2025,
    description: 'Простой вариант для знакомства с форматом ЕГЭ. Задания базового и среднего уровня.',
    timeLimit: 90,
    primaryScore: 15,
    secondaryScore: 60,
    tasks: [
      { taskNumber: 4, type: 'practice', title: 'Ударения', maxScore: 1, sectionId: 'section-orthoepy', dataSource: 'accent', questionCount: 1 },
      { taskNumber: 5, type: 'practice', title: 'Паронимы', maxScore: 1, sectionId: 'section-lexicography', dataSource: 'task5', questionCount: 1 },
      { taskNumber: 6, type: 'practice', title: 'Суффиксы глаголов', maxScore: 1, sectionId: 'section-grammar', dataSource: 'task6', questionCount: 1 },
      { taskNumber: 7, type: 'practice', title: 'Окончания глаголов', maxScore: 1, sectionId: 'section-grammar', dataSource: 'task7', questionCount: 1 },
      { taskNumber: 8, type: 'practice', title: 'НЕ с разными частями речи', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task8', questionCount: 1 },
      { taskNumber: 9, type: 'practice', title: 'Пропущенные буквы (корни)', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task9', questionCount: 1 },
      { taskNumber: 10, type: 'practice', title: 'ПРЕ/ПРИ, Ъ/Ь, Ы/И', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task10', questionCount: 1 },
      { taskNumber: 11, type: 'practice', title: 'Суффиксы прилагательных', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task11', questionCount: 1 },
      { taskNumber: 12, type: 'practice', title: 'Окончания причастий и деепричастий', maxScore: 1, sectionId: 'section-grammar', dataSource: 'task12', questionCount: 1 },
      { taskNumber: 13, type: 'practice', title: 'НЕ/НИ с причастиями', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task13', questionCount: 1 },
      { taskNumber: 14, type: 'practice', title: 'Слитное/раздельное/дефисное написание', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task14', questionCount: 1 },
      { taskNumber: 15, type: 'practice', title: 'Пунктуация в простых предложениях', maxScore: 1, sectionId: 'section-punctuation', dataSource: 'task15', questionCount: 1 },
      { taskNumber: 16, type: 'practice', title: 'Пунктуация в сложных предложениях', maxScore: 1, sectionId: 'section-punctuation', dataSource: 'task16', questionCount: 1 },
      { taskNumber: 17, type: 'theory', title: 'Стилистические средства', maxScore: 1, sectionId: 'section-text-work', dataSource: 'placeholder', questionCount: 1 },
      { taskNumber: 26, type: 'essay', title: 'Сочинение', maxScore: 4, sectionId: 'section-text-work', dataSource: 'essay', questionCount: 1 },
    ],
  },
  {
    id: 'variant-base-2',
    name: 'Вариант 2 (базовый)',
    year: 2025,
    description: 'Классический набор заданий. Проверяет знание основных правил и умение работать с текстом.',
    timeLimit: 120,
    primaryScore: 15,
    secondaryScore: 60,
    tasks: [
      { taskNumber: 4, type: 'practice', title: 'Ударения', maxScore: 1, sectionId: 'section-orthoepy', dataSource: 'accent', questionCount: 1 },
      { taskNumber: 5, type: 'practice', title: 'Паронимы', maxScore: 1, sectionId: 'section-lexicography', dataSource: 'task5', questionCount: 1 },
      { taskNumber: 6, type: 'practice', title: 'Суффиксы глаголов', maxScore: 1, sectionId: 'section-grammar', dataSource: 'task6', questionCount: 1 },
      { taskNumber: 7, type: 'practice', title: 'Окончания глаголов', maxScore: 1, sectionId: 'section-grammar', dataSource: 'task7', questionCount: 1 },
      { taskNumber: 8, type: 'practice', title: 'НЕ с разными частями речи', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task8', questionCount: 1 },
      { taskNumber: 9, type: 'practice', title: 'Пропущенные буквы (корни)', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task9', questionCount: 1 },
      { taskNumber: 10, type: 'practice', title: 'ПРЕ/ПРИ, Ъ/Ь, Ы/И', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task10', questionCount: 1 },
      { taskNumber: 11, type: 'practice', title: 'Суффиксы прилагательных', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task11', questionCount: 1 },
      { taskNumber: 12, type: 'practice', title: 'Окончания причастий и деепричастий', maxScore: 1, sectionId: 'section-grammar', dataSource: 'task12', questionCount: 1 },
      { taskNumber: 13, type: 'practice', title: 'НЕ/НИ с причастиями', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task13', questionCount: 1 },
      { taskNumber: 14, type: 'practice', title: 'Слитное/раздельное/дефисное написание', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task14', questionCount: 1 },
      { taskNumber: 15, type: 'practice', title: 'Пунктуация в простых предложениях', maxScore: 1, sectionId: 'section-punctuation', dataSource: 'task15', questionCount: 1 },
      { taskNumber: 16, type: 'practice', title: 'Пунктуация в сложных предложениях', maxScore: 1, sectionId: 'section-punctuation', dataSource: 'task16', questionCount: 1 },
      { taskNumber: 17, type: 'theory', title: 'Стилистические средства', maxScore: 1, sectionId: 'section-text-work', dataSource: 'placeholder', questionCount: 1 },
      { taskNumber: 26, type: 'essay', title: 'Сочинение', maxScore: 4, sectionId: 'section-text-work', dataSource: 'essay', questionCount: 1 },
    ],
  },
  {
    id: 'variant-advanced-3',
    name: 'Вариант 3 (продвинутый)',
    year: 2026,
    description: 'Задания повышенной сложности. Требует уверенного знания правил и аналитических навыков.',
    timeLimit: 150,
    primaryScore: 15,
    secondaryScore: 60,
    tasks: [
      { taskNumber: 4, type: 'practice', title: 'Ударения', maxScore: 1, sectionId: 'section-orthoepy', dataSource: 'accent', questionCount: 1 },
      { taskNumber: 5, type: 'practice', title: 'Паронимы', maxScore: 1, sectionId: 'section-lexicography', dataSource: 'task5', questionCount: 1 },
      { taskNumber: 6, type: 'practice', title: 'Суффиксы глаголов', maxScore: 1, sectionId: 'section-grammar', dataSource: 'task6', questionCount: 1 },
      { taskNumber: 7, type: 'practice', title: 'Окончания глаголов', maxScore: 1, sectionId: 'section-grammar', dataSource: 'task7', questionCount: 1 },
      { taskNumber: 8, type: 'practice', title: 'НЕ с разными частями речи', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task8', questionCount: 1 },
      { taskNumber: 9, type: 'practice', title: 'Пропущенные буквы (корни)', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task9', questionCount: 1 },
      { taskNumber: 10, type: 'practice', title: 'ПРЕ/ПРИ, Ъ/Ь, Ы/И', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task10', questionCount: 1 },
      { taskNumber: 11, type: 'practice', title: 'Суффиксы прилагательных', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task11', questionCount: 1 },
      { taskNumber: 12, type: 'practice', title: 'Окончания причастий и деепричастий', maxScore: 1, sectionId: 'section-grammar', dataSource: 'task12', questionCount: 1 },
      { taskNumber: 13, type: 'practice', title: 'НЕ/НИ с причастиями', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task13', questionCount: 1 },
      { taskNumber: 14, type: 'practice', title: 'Слитное/раздельное/дефисное написание', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task14', questionCount: 1 },
      { taskNumber: 15, type: 'practice', title: 'Пунктуация в простых предложениях', maxScore: 1, sectionId: 'section-punctuation', dataSource: 'task15', questionCount: 1 },
      { taskNumber: 16, type: 'practice', title: 'Пунктуация в сложных предложениях', maxScore: 1, sectionId: 'section-punctuation', dataSource: 'task16', questionCount: 1 },
      { taskNumber: 17, type: 'theory', title: 'Стилистические средства', maxScore: 1, sectionId: 'section-text-work', dataSource: 'placeholder', questionCount: 1 },
      { taskNumber: 26, type: 'essay', title: 'Сочинение', maxScore: 4, sectionId: 'section-text-work', dataSource: 'essay', questionCount: 1 },
    ],
  },
  {
    id: 'variant-hard-4',
    name: 'Вариант 4 (сложный)',
    year: 2026,
    description: 'Максимальная сложность заданий. Проверяет глубокое понимание и скорость работы.',
    timeLimit: 150,
    primaryScore: 15,
    secondaryScore: 60,
    tasks: [
      { taskNumber: 4, type: 'practice', title: 'Ударения', maxScore: 1, sectionId: 'section-orthoepy', dataSource: 'accent', questionCount: 1 },
      { taskNumber: 5, type: 'practice', title: 'Паронимы', maxScore: 1, sectionId: 'section-lexicography', dataSource: 'task5', questionCount: 1 },
      { taskNumber: 6, type: 'practice', title: 'Суффиксы глаголов', maxScore: 1, sectionId: 'section-grammar', dataSource: 'task6', questionCount: 1 },
      { taskNumber: 7, type: 'practice', title: 'Окончания глаголов', maxScore: 1, sectionId: 'section-grammar', dataSource: 'task7', questionCount: 1 },
      { taskNumber: 8, type: 'practice', title: 'НЕ с разными частями речи', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task8', questionCount: 1 },
      { taskNumber: 9, type: 'practice', title: 'Пропущенные буквы (корни)', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task9', questionCount: 1 },
      { taskNumber: 10, type: 'practice', title: 'ПРЕ/ПРИ, Ъ/Ь, Ы/И', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task10', questionCount: 1 },
      { taskNumber: 11, type: 'practice', title: 'Суффиксы прилагательных', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task11', questionCount: 1 },
      { taskNumber: 12, type: 'practice', title: 'Окончания причастий и деепричастий', maxScore: 1, sectionId: 'section-grammar', dataSource: 'task12', questionCount: 1 },
      { taskNumber: 13, type: 'practice', title: 'НЕ/НИ с причастиями', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task13', questionCount: 1 },
      { taskNumber: 14, type: 'practice', title: 'Слитное/раздельное/дефисное написание', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task14', questionCount: 1 },
      { taskNumber: 15, type: 'practice', title: 'Пунктуация в простых предложениях', maxScore: 1, sectionId: 'section-punctuation', dataSource: 'task15', questionCount: 1 },
      { taskNumber: 16, type: 'practice', title: 'Пунктуация в сложных предложениях', maxScore: 1, sectionId: 'section-punctuation', dataSource: 'task16', questionCount: 1 },
      { taskNumber: 17, type: 'theory', title: 'Стилистические средства', maxScore: 1, sectionId: 'section-text-work', dataSource: 'placeholder', questionCount: 1 },
      { taskNumber: 26, type: 'essay', title: 'Сочинение', maxScore: 4, sectionId: 'section-text-work', dataSource: 'essay', questionCount: 1 },
    ],
  },
  {
    id: 'variant-expert-5',
    name: 'Вариант 5 (экспертный)',
    year: 2026,
    description: 'Полный имитационный вариант с максимальным временем. Для тех, кто готовится к 90+ баллам.',
    timeLimit: 180,
    primaryScore: 15,
    secondaryScore: 60,
    tasks: [
      { taskNumber: 4, type: 'practice', title: 'Ударения', maxScore: 1, sectionId: 'section-orthoepy', dataSource: 'accent', questionCount: 1 },
      { taskNumber: 5, type: 'practice', title: 'Паронимы', maxScore: 1, sectionId: 'section-lexicography', dataSource: 'task5', questionCount: 1 },
      { taskNumber: 6, type: 'practice', title: 'Суффиксы глаголов', maxScore: 1, sectionId: 'section-grammar', dataSource: 'task6', questionCount: 1 },
      { taskNumber: 7, type: 'practice', title: 'Окончания глаголов', maxScore: 1, sectionId: 'section-grammar', dataSource: 'task7', questionCount: 1 },
      { taskNumber: 8, type: 'practice', title: 'НЕ с разными частями речи', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task8', questionCount: 1 },
      { taskNumber: 9, type: 'practice', title: 'Пропущенные буквы (корни)', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task9', questionCount: 1 },
      { taskNumber: 10, type: 'practice', title: 'ПРЕ/ПРИ, Ъ/Ь, Ы/И', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task10', questionCount: 1 },
      { taskNumber: 11, type: 'practice', title: 'Суффиксы прилагательных', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task11', questionCount: 1 },
      { taskNumber: 12, type: 'practice', title: 'Окончания причастий и деепричастий', maxScore: 1, sectionId: 'section-grammar', dataSource: 'task12', questionCount: 1 },
      { taskNumber: 13, type: 'practice', title: 'НЕ/НИ с причастиями', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task13', questionCount: 1 },
      { taskNumber: 14, type: 'practice', title: 'Слитное/раздельное/дефисное написание', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task14', questionCount: 1 },
      { taskNumber: 15, type: 'practice', title: 'Пунктуация в простых предложениях', maxScore: 1, sectionId: 'section-punctuation', dataSource: 'task15', questionCount: 1 },
      { taskNumber: 16, type: 'practice', title: 'Пунктуация в сложных предложениях', maxScore: 1, sectionId: 'section-punctuation', dataSource: 'task16', questionCount: 1 },
      { taskNumber: 17, type: 'theory', title: 'Стилистические средства', maxScore: 1, sectionId: 'section-text-work', dataSource: 'placeholder', questionCount: 1 },
      { taskNumber: 26, type: 'essay', title: 'Сочинение', maxScore: 4, sectionId: 'section-text-work', dataSource: 'essay', questionCount: 1 },
    ],
  },
]

// Deterministic shuffle for consistent variant questions
function seededShuffle<T>(array: T[], seed: string): T[] {
  const arr = [...array]
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0
  }
  const random = () => {
    hash = ((hash * 16807) % 2147483647) | 0
    return (hash & 0x7fffffff) / 0x7fffffff
  }
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function getQuestionsForTask<T>(variantId: string, taskNumber: number, allQuestions: T[], count: number): T[] {
  return seededShuffle(allQuestions, `${variantId}-task-${taskNumber}`).slice(0, count)
}

export function getVariantById(id: string): FipiVariant | undefined {
  return fipiVariants.find((v) => v.id === id)
}

export function getAllVariants(): FipiVariant[] {
  return fipiVariants
}

// Simplified primary → secondary score conversion for 15-task MVP
export function convertPrimaryToSecondary(primaryScore: number, maxPrimary: number): number {
  // Linear scaling: 0 primary → 0 test, maxPrimary → 100 test
  return Math.round((primaryScore / maxPrimary) * 100)
}

export function getScoreLabel(testScore: number): { label: string; color: string } {
  if (testScore >= 80) return { label: 'Отлично', color: 'text-duo-green' }
  if (testScore >= 60) return { label: 'Хорошо', color: 'text-duo-blue' }
  if (testScore >= 36) return { label: 'Проходной балл', color: 'text-duo-yellow' }
  return { label: 'Ниже порога', color: 'text-duo-red' }
}

// ═══════════════════════════════════════════════════════════════════════════════
//
// ⚠️ ВНИМАНИЕ АГЕНТАМ: БАЗА ДАННЫХ ПЕРЕПИСАНА (Агент 7, 2026-06-29)
// Старые файлы `src/data/taskXQuestions.ts` теперь — ТОЛЬКО АДАПТЕРЫ.
// Источник правды: `src/data/questions/taskX.ts`. Не добавляй в старые файлы!
//
//
// 📋 ПРАВИЛО ДЛЯ АГЕНТОВ: Если создашь временные файлы или устаревшие
// адаптеры — УДАЛИ их или перемести в workspace/archive/ege-app/
//
// ЕДИНАЯ БАЗА ДАННЫХ ЗАДАНИЙ ЕГЭ — ТИПЫ
// ═══════════════════════════════════════════════════════════════════════════════
//
// Все вопросы нормализованы в единый формат UnifiedQuestion.
// Уроки и секции содержат только ссылки (ID), не вложенные объекты.
// Индексы генерируются автоматически из questions/index.ts
//
// Добавляя новое задание: создай файл в questions/taskX.ts, добавь в index.ts.

// ─── Подсказка ───
export interface Hint {
  level: 1 | 2 | 3
  text: string
  xpPenalty: number
}

// ─── Единый вопрос — источник правды для всех заданий ───
export interface UnifiedQuestion {
  id: string              // Уникальный ID (taskNumber + порядковый, e.g. 't12-1')
  taskNumber: string      // Номер задания ЕГЭ: '7', '9', '12', 'dooshin', 'essay'
  type: 'single' | 'multiple' | 'text' | 'ege-multiple'
  text: string            // Текст вопроса (вопрос или задание)
  options?: string[]      // Варианты ответа (для single/multiple/ege-multiple)
  correctAnswer: string[] // Правильные ответы (массив — даже для одиночного)
  explanation: string    // Пояснение (почему так)
  alwaysShowExplanation?: boolean  // Показывать пояснение сразу?
  theory?: string         // Текст теории (если встроен в вопрос)
  difficulty: 'easy' | 'medium' | 'hard'
  xpReward: number       // Сколько XP за правильный ответ
  atoms: string[]         // Атомы (навыки/темы) — например ['conjugation_2', 'task12']
  tags: string[]          // Теги для рубрикации и поиска
  // IRT / аналитика
  irtDifficulty?: number
  errorType?: string      // Тип ошибки для анализа
  // Теория
  theoryLessonId?: string // Ссылка на теоретический урок
  theoryUrl?: string      // URL внешней теории
  hints?: Hint[]          // Подсказки с уровнями
  // Служебные (для агентов)
  lastEditedBy?: string   // Кто последний редактировал
  agent?: string          // Агент, создавший/отредактировавший (e.g. 'Агент 7')
  verified?: boolean      // Проверено пользователем (true = галлюцинации исправлены)
  createdAt?: string      // ISO дата создания
  updatedAt?: string      // ISO дата обновления
}

// ─── Урок — содержит только ссылки на вопросы ───
export interface UnifiedLesson {
  id: string
  sectionId: string
  title: string
  type: 'theory' | 'practice' | 'test'
  description: string
  xpReward: number
  prerequisites: string[]      // ID уроков, которые нужно пройти
  questionIds: string[]        // ← ССЫЛКИ на вопросы (не вложенные объекты!)
  theory?: string             // Текст теории
  isComingSoon?: boolean
  // Служебные
  order?: number              // Порядок в секции
  tags?: string[]             // Теги урока
}

// ─── Группа уроков ───
export interface LessonGroup {
  id: string
  title: string
  subtitle?: string
  lessonIds: string[]        // ← ССЫЛКИ на уроки
  isReviewSubgroup?: boolean
  prerequisites?: string[]
  subgroups?: LessonGroup[]   // Вложенные группы
}

// ─── Секция — содержит только ссылки на уроки ───
export interface UnifiedSection {
  id: string
  courseId: string
  title: string
  subtitle: string
  order: number
  icon: string
  color: string
  lessonIds: string[]         // ← ССЫЛКИ на уроки (плоский список)
  groups?: LessonGroup[]      // Группировка уроков (опционально)
}

// ─── Курс ───
export interface UnifiedCourse {
  id: string
  title: string
  description: string
  sectionIds: string[]      // ← ССЫЛКИ на секции
}

// ─── Атом — описание навыка/темы ───
export interface Atom {
  id: string
  name: string              // Человекочитаемое название
  description: string       // Описание
  taskNumbers: string[]     // В каких заданиях встречается
  parentId?: string        // Родительский атом (иерархия)
}

// ─── Индексы (генерируются автоматически) ───
export interface QuestionIndex {
  byId: Record<string, UnifiedQuestion>
  byTask: Record<string, UnifiedQuestion[]>     // '12' → [q1, q2, ...]
  byAtom: Record<string, UnifiedQuestion[]>     // 'conjugation_2' → [...]
  byTag: Record<string, UnifiedQuestion[]>      // 'спряжение' → [...]
  byDifficulty: Record<string, UnifiedQuestion[]> // 'easy' → [...]
  all: UnifiedQuestion[]
}

export interface LessonIndex {
  byId: Record<string, UnifiedLesson>
  bySection: Record<string, UnifiedLesson[]>    // 'section-gram-1' → [...]
  all: UnifiedLesson[]
}

export interface SectionIndex {
  byId: Record<string, UnifiedSection>
  all: UnifiedSection[]
}

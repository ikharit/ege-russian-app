import { Achievement } from '../types'

export const achievements: Achievement[] = [
  // === УРОКИ ===
  { id: 'ach-first-lesson', title: 'Первые шаги', description: 'Пройдите первый урок', icon: 'Star', condition: 'complete_lesson' },
  { id: 'ach-lessons-5', title: 'Уверенный старт', description: 'Пройдите 5 уроков', icon: 'BookOpen', condition: 'complete_lessons_5' },
  { id: 'ach-lessons-10', title: 'Десятка', description: 'Пройдите 10 уроков', icon: 'BookOpen', condition: 'complete_lessons_10' },
  { id: 'ach-lessons-25', title: 'Марафонец', description: 'Пройдите 25 уроков', icon: 'BookOpen', condition: 'complete_lessons_25' },
  { id: 'ach-lessons-50', title: 'Ветеран', description: 'Пройдите 50 уроков', icon: 'BookOpen', condition: 'complete_lessons_50' },
  
  // === ИДЕАЛЬНЫЕ УРОКИ ===
  { id: 'ach-perfect', title: 'Идеально', description: 'Пройдите урок без ошибок', icon: 'Trophy', condition: 'perfect_lesson' },
  { id: 'ach-perfect-5', title: 'Безупречность', description: '5 идеальных уроков подряд', icon: 'Trophy', condition: 'perfect_5' },
  { id: 'ach-perfect-10', title: 'Гений', description: '10 идеальных уроков подряд', icon: 'Trophy', condition: 'perfect_10' },
  
  // === СТРИК ===
  { id: 'ach-streak-3', title: 'Серия из 3', description: 'Занимайтесь 3 дня подряд', icon: 'Flame', condition: 'streak_3' },
  { id: 'ach-streak-7', title: 'Неделя задорова', description: 'Занимайтесь 7 дней подряд', icon: 'Flame', condition: 'streak_7' },
  { id: 'ach-streak-14', title: 'Две недели', description: 'Занимайтесь 14 дней подряд', icon: 'Flame', condition: 'streak_14' },
  { id: 'ach-streak-30', title: 'Месяц без перерыва', description: 'Занимайтесь 30 дней подряд', icon: 'Flame', condition: 'streak_30' },
  
  // === XP ===
  { id: 'ach-xp-100', title: 'Сотня', description: 'Наберите 100 XP', icon: 'Zap', condition: 'xp_100' },
  { id: 'ach-xp-500', title: 'Полтысячи', description: 'Наберите 500 XP', icon: 'Zap', condition: 'xp_500' },
  { id: 'ach-xp-1000', title: 'Тысяча', description: 'Наберите 1000 XP', icon: 'Zap', condition: 'xp_1000' },
  { id: 'ach-xp-5000', title: 'Мастер XP', description: 'Наберите 5000 XP', icon: 'Zap', condition: 'xp_5000' },
  
  // === УРОВНИ ===
  { id: 'ach-level-5', title: 'Средний уровень', description: 'Достигните 5 уровня', icon: 'Crown', condition: 'level_5' },
  { id: 'ach-level-10', title: 'Эксперт', description: 'Достигните 10 уровня', icon: 'Crown', condition: 'level_10' },
  { id: 'ach-level-20', title: 'Гуру', description: 'Достигните 20 уровня', icon: 'Crown', condition: 'level_20' },
  
  // === РАЗДЕЛЫ ===
  { id: 'ach-section-1', title: 'Работа с текстом покорена', description: 'Пройдите все уроки работы с текстом', icon: 'Award', condition: 'complete_section_textwork' },
  { id: 'ach-section-2', title: 'Орфоэпия освоена', description: 'Пройдите все уроки орфоэпии и лексикологии', icon: 'Award', condition: 'complete_section_orthoepy' },
  { id: 'ach-section-3', title: 'Грамматика в кармане', description: 'Пройдите все уроки грамматики', icon: 'Award', condition: 'complete_section_grammar' },
  { id: 'ach-section-4', title: 'Орфография покорена', description: 'Пройдите все уроки орфографии', icon: 'Award', condition: 'complete_section_orthography' },
  { id: 'ach-section-5', title: 'Пунктуация освоена', description: 'Пройдите все уроки пунктуации', icon: 'Award', condition: 'complete_section_punctuation' },
  { id: 'ach-all-sections', title: 'Мастер ЕГЭ', description: 'Пройдите уроки во всех разделах', icon: 'Crown', condition: 'complete_all_sections' },
  
  // === АТОМИЗАЦИЯ ===
  { id: 'ach-atom-first', title: 'Атомарный ученик', description: 'Пройдите тренировку по атомам', icon: 'Atom', condition: 'atom_practice' },
  { id: 'ach-atom-master', title: 'Атомный физик', description: 'Освойте 5 атомов', icon: 'Atom', condition: 'atom_master_5' },
  
  // === СЕРДЕЧКИ ===
  { id: 'ach-no-hearts-lost', title: 'Железная воля', description: 'Пройдите урок без потери сердечек', icon: 'Heart', condition: 'no_hearts_lost' },
  { id: 'ach-heart-restore', title: 'Воскресение', description: 'Восстановите сердечки', icon: 'Heart', condition: 'restore_hearts' },
  
  // === СПЕЦИАЛЬНЫЕ ===
  { id: 'ach-night-owl', title: 'Сова', description: 'Занимайтесь после 22:00', icon: 'Moon', condition: 'night_study' },
  { id: 'ach-early-bird', title: 'Жаворонок', description: 'Занимайтесь до 8:00', icon: 'Sun', condition: 'morning_study' },
  { id: 'ach-weekend', title: 'Выходной учёный', description: 'Занимайтесь в выходные', icon: 'Calendar', condition: 'weekend_study' },
  { id: 'ach-speedrun', title: 'Скоростной', description: 'Пройдите урок менее чем за 2 минуты', icon: 'Timer', condition: 'speedrun' },
  { id: 'ach-persistent', title: 'Упорство', description: 'Пройдите урок с 3 попыток', icon: 'Repeat', condition: 'persistent' },
  { id: 'ach-export', title: 'Бэкап', description: 'Экспортируйте прогресс', icon: 'Download', condition: 'export_progress' },
  { id: 'ach-infinite', title: 'Бессмертие', description: 'Включите бесконечные сердечки', icon: 'Infinity', condition: 'infinite_hearts' },
  
  // === НОВЫЕ: КОМБО ===
  { id: 'ach-combo-5', title: 'Серия', description: '5 правильных ответов подряд', icon: 'Zap', condition: 'combo_5' },
  { id: 'ach-combo-10', title: 'Комбо-мастер', description: '10 правильных ответов подряд', icon: 'Zap', condition: 'combo_10' },
  
  // === НОВЫЕ: ВОПРОСЫ ===
  { id: 'ach-questions-50', title: 'Знаток', description: 'Ответьте правильно на 50 вопросов', icon: 'Target', condition: 'questions_50' },
  { id: 'ach-questions-200', title: 'Эксперт', description: 'Ответьте правильно на 200 вопросов', icon: 'Target', condition: 'questions_200' },
  { id: 'ach-questions-500', title: 'Гуру вопросов', description: 'Ответьте правильно на 500 вопросов', icon: 'Target', condition: 'questions_500' },
  
  // === НОВЫЕ: ВРЕМЯ ===
  { id: 'ach-time-1h', title: 'Первый час', description: 'Проведите 1 час в уроках', icon: 'Clock', condition: 'time_1h' },
  { id: 'ach-time-5h', title: 'Полдня', description: 'Проведите 5 часов в уроках', icon: 'Clock', condition: 'time_5h' },
  { id: 'ach-time-10h', title: 'Марафон', description: 'Проведите 10 часов в уроках', icon: 'Clock', condition: 'time_10h' },
  
  // === НОВЫЕ: ДОПОЛНИТЕЛЬНЫЕ ===
  { id: 'ach-retry-5', title: 'Не сдаваться', description: 'Пройдите урок с 5 попыток', icon: 'Repeat', condition: 'retry_5' },
  { id: 'ach-fast-learner', title: 'Быстрый ученик', description: 'Пройдите 3 урока за день', icon: 'Rocket', condition: 'fast_learner' },
  { id: 'ach-collection', title: 'Коллекционер', description: 'Соберите 10 достижений', icon: 'Star', condition: 'collection_10' },
  { id: 'ach-collector', title: 'Магнит', description: 'Соберите 20 достижений', icon: 'Star', condition: 'collection_20' },
  { id: 'ach-quest-master', title: 'Квестоман', description: 'Выполните 10 ежедневных квестов', icon: 'Target', condition: 'quest_master' },
  // === НОВЫЕ: РАБОТА НАД ОШИБКАМИ ===
  { id: 'ach-mistake-1', title: 'Исправлено!', description: 'Исправьте первую ошибку', icon: 'CheckCircle', condition: 'fix_mistake_1' },
  { id: 'ach-mistake-5', title: 'Пятёрка', description: 'Исправьте 5 ошибок', icon: 'CheckCircle', condition: 'fix_mistake_5' },
  { id: 'ach-mistake-10', title: 'Десятка', description: 'Исправьте 10 ошибок', icon: 'CheckCircle', condition: 'fix_mistake_10' },
  { id: 'ach-mistake-25', title: 'Четверть', description: 'Исправьте 25 ошибок', icon: 'CheckCircle', condition: 'fix_mistake_25' },
  { id: 'ach-mistake-all', title: 'Всё чисто', description: 'Исправьте все ошибки (раздел пуст)', icon: 'CheckCircle', condition: 'fix_mistake_all' },
  
  // === ДОЩИНСКИЙ ===
  { id: 'ach-dooshin-first', title: 'Первый вариант', description: 'Пройдите первый урок из Дощинского', icon: 'BookOpen', condition: 'dooshin_first' },
  { id: 'ach-dooshin-5', title: 'Пять вариантов', description: 'Пройдите 5 уроков из Дощинского', icon: 'BookOpen', condition: 'dooshin_5' },
  { id: 'ach-dooshin-10', title: 'Десятка вариантов', description: 'Пройдите 10 уроков из Дощинского', icon: 'BookOpen', condition: 'dooshin_10' },
  { id: 'ach-dooshin-20', title: 'Половина пути', description: 'Пройдите 20 уроков из Дощинского', icon: 'BookOpen', condition: 'dooshin_20' },
  { id: 'ach-dooshin-all', title: 'Мастер Дощинского', description: 'Пройдите все уроки из Дощинского (50 вариантов)', icon: 'Trophy', condition: 'dooshin_all' },
  { id: 'ach-dooshin-9', title: 'Корни — освоены', description: 'Пройдите все уроки задания 9 из Дощинского', icon: 'Award', condition: 'dooshin_9' },
  { id: 'ach-dooshin-task-10', title: 'НЕ/НИ — покорены', description: 'Пройдите все уроки задания 10 из Дощинского', icon: 'Award', condition: 'dooshin_task_10' },
  { id: 'ach-dooshin-11', title: 'Суффиксы — в кармане', description: 'Пройдите все уроки задания 11 из Дощинского', icon: 'Award', condition: 'dooshin_11' },
  { id: 'ach-dooshin-12', title: 'Окончания — наизусть', description: 'Пройдите все уроки задания 12 из Дощинского', icon: 'Award', condition: 'dooshin_12' },
]

export function getAchievementProgress(id: string, stats: any, progress: any): { current: number, target: number } {
  const map: Record<string, { current: number, target: number }> = {
    'ach-lessons-5': { current: Object.values(progress).filter((l: any) => l.status === 'completed').length, target: 5 },
    'ach-lessons-10': { current: Object.values(progress).filter((l: any) => l.status === 'completed').length, target: 10 },
    'ach-lessons-25': { current: Object.values(progress).filter((l: any) => l.status === 'completed').length, target: 25 },
    'ach-lessons-50': { current: Object.values(progress).filter((l: any) => l.status === 'completed').length, target: 50 },
    'ach-xp-100': { current: stats.xp, target: 100 },
    'ach-xp-500': { current: stats.xp, target: 500 },
    'ach-xp-1000': { current: stats.xp, target: 1000 },
    'ach-xp-5000': { current: stats.xp, target: 5000 },
    'ach-level-5': { current: stats.level, target: 5 },
    'ach-level-10': { current: stats.level, target: 10 },
    'ach-level-20': { current: stats.level, target: 20 },
    'ach-streak-3': { current: stats.streak, target: 3 },
    'ach-streak-7': { current: stats.streak, target: 7 },
    'ach-streak-14': { current: stats.streak, target: 14 },
    'ach-streak-30': { current: stats.streak, target: 30 },
    // Новые
    'ach-questions-50': { current: stats.totalQuestionsAnswered || 0, target: 50 },
    'ach-questions-200': { current: stats.totalQuestionsAnswered || 0, target: 200 },
    'ach-questions-500': { current: stats.totalQuestionsAnswered || 0, target: 500 },
    'ach-time-1h': { current: stats.totalLessonTimeMinutes || 0, target: 60 },
    'ach-time-5h': { current: stats.totalLessonTimeMinutes || 0, target: 300 },
    'ach-time-10h': { current: stats.totalLessonTimeMinutes || 0, target: 600 },
    'ach-collection': { current: stats.achievements.length, target: 10 },
    'ach-collector': { current: stats.achievements.length, target: 20 },
    'ach-mistake-1': { current: stats.mistakesFixed || 0, target: 1 },
    'ach-mistake-5': { current: stats.mistakesFixed || 0, target: 5 },
    'ach-mistake-10': { current: stats.mistakesFixed || 0, target: 10 },
    'ach-mistake-25': { current: stats.mistakesFixed || 0, target: 25 },
    'ach-mistake-all': { current: stats.mistakesFixed || 0, target: 1 },
    // Дощинский
    'ach-dooshin-first': { current: Object.values(progress).filter((l: any) => l.status === 'completed' && l.id?.startsWith('lesson-dooshin')).length, target: 1 },
    'ach-dooshin-5': { current: Object.values(progress).filter((l: any) => l.status === 'completed' && l.id?.startsWith('lesson-dooshin')).length, target: 5 },
    'ach-dooshin-10': { current: Object.values(progress).filter((l: any) => l.status === 'completed' && l.id?.startsWith('lesson-dooshin')).length, target: 10 },
    'ach-dooshin-20': { current: Object.values(progress).filter((l: any) => l.status === 'completed' && l.id?.startsWith('lesson-dooshin')).length, target: 20 },
    'ach-dooshin-all': { current: Object.values(progress).filter((l: any) => l.status === 'completed' && l.id?.startsWith('lesson-dooshin')).length, target: 40 },
    'ach-dooshin-9': { current: Object.values(progress).filter((l: any) => l.status === 'completed' && l.id?.match(/^lesson-dooshin-9-/)).length, target: 10 },
    'ach-dooshin-task-10': { current: Object.values(progress).filter((l: any) => l.status === 'completed' && l.id?.match(/^lesson-dooshin-10-/)).length, target: 10 },
    'ach-dooshin-11': { current: Object.values(progress).filter((l: any) => l.status === 'completed' && l.id?.match(/^lesson-dooshin-11-/)).length, target: 10 },
    'ach-dooshin-12': { current: Object.values(progress).filter((l: any) => l.status === 'completed' && l.id?.match(/^lesson-dooshin-12-/)).length, target: 10 },
  }
  return map[id] || { current: 0, target: 1 }
}

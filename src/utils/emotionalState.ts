import { EmotionalState, MotivationalMessage, UserStats, LessonProgress } from '../types'

export type { EmotionalState, MotivationalMessage }

export function getInitialEmotionalState(): EmotionalState {
  return {
    recentAccuracy: 0,
    sessionDuration: 0,
    errorsInRow: 0,
    successesInRow: 0,
    lastVisit: '',
    lastExamDate: undefined,
    lastStreakBeforeBreak: undefined,
    newLevelReached: false,
    previousLevel: undefined,
    overdueSRSLessons: 0,
    comboAtStart: 0,
  }
}

export function getMotivationalMessage(
  state: EmotionalState,
  userStats: UserStats,
  lessonProgress?: Record<string, LessonProgress>
): MotivationalMessage {
  const today = new Date().toISOString().split('T')[0]
  const daysSinceVisit = state.lastVisit
    ? Math.floor((new Date(today).getTime() - new Date(state.lastVisit).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  // 1. New level reached (highest priority)
  if (state.newLevelReached && userStats.level > 1) {
    return {
      text: `Поздравляем! Уровень ${userStats.level} — ты крут! 🎉`,
      tone: 'celebrating',
      icon: '🎉',
    }
  }

  // 2. Streak = 7
  if (userStats.streak === 7) {
    return {
      text: 'Неделя подряд! Ты неостановим 🔥',
      tone: 'celebrating',
      icon: '🔥',
    }
  }

  // 3. Streak broken (was > 1, now is 1 or 0 and not today)
  if (state.lastStreakBeforeBreak && state.lastStreakBeforeBreak >= 3 && userStats.streak <= 1) {
    return {
      text: 'Бывает! Главное — начать заново. Вот простое задание 💪',
      tone: 'encouraging',
      icon: '💪',
    }
  }

  // 4. 3 errors in a row
  if (state.errorsInRow >= 3) {
    return {
      text: 'Не расстраивайся! Давай разберём эту тему подробнее 📖',
      tone: 'calming',
      icon: '📖',
    }
  }

  // 5. 5 successes in a row
  if (state.successesInRow >= 5) {
    return {
      text: 'Ты в ударе! 🔥 Готов к заданию посложнее?',
      tone: 'challenging',
      icon: '⚡',
    }
  }

  // 6. Not visited for 3+ days
  if (daysSinceVisit >= 3) {
    return {
      text: 'Скучаем! Вот короткий урок на 5 минут 🌟',
      tone: 'encouraging',
      icon: '🌟',
    }
  }

  // 7. Long time since exam (14+ days)
  if (state.lastExamDate) {
    const daysSinceExam = Math.floor(
      (new Date(today).getTime() - new Date(state.lastExamDate).getTime()) / (1000 * 60 * 60 * 24)
    )
    if (daysSinceExam >= 14) {
      return {
        text: 'Проверь свои силы! Вот новый вариант ЕГЭ 📝',
        tone: 'challenging',
        icon: '📝',
      }
    }
  }

  // 8. Overdue SRS lessons
  if (state.overdueSRSLessons && state.overdueSRSLessons >= 3) {
    return {
      text: `Повторение — мать учения! ${state.overdueSRSLessons} урока ждут тебя 🔁`,
      tone: 'encouraging',
      icon: '🔁',
    }
  }

  // 9. Low accuracy warning (< 50% and at least 5 attempts)
  if (state.recentAccuracy < 50 && state.sessionDuration > 5) {
    return {
      text: 'Ты справишься! Попробуй пройти теорию ещё раз 📚',
      tone: 'calming',
      icon: '📚',
    }
  }

  // 10. Streak approaching milestone (5 days)
  if (userStats.streak === 5) {
    return {
      text: 'Ещё 2 дня — и неделя подряд! Не останавливайся! 🔥',
      tone: 'challenging',
      icon: '🔥',
    }
  }

  // 11. First visit ever
  if (!state.lastVisit || state.lastVisit === '') {
    return {
      text: 'Добро пожаловать! Начни с простого урока 🚀',
      tone: 'encouraging',
      icon: '🚀',
    }
  }

  // 12. High accuracy celebration (> 90% and 10+ attempts)
  if (state.recentAccuracy >= 90 && state.successesInRow >= 3) {
    return {
      text: 'Идеально! Ты настоящий профи! ✨',
      tone: 'celebrating',
      icon: '✨',
    }
  }

  // Default: generic encouraging message
  return {
    text: 'Продолжай в том же духе! Каждый урок приближает к цели 🎯',
    tone: 'encouraging',
    icon: '🎯',
  }
}

export function getToneColor(tone: MotivationalMessage['tone']): string {
  switch (tone) {
    case 'encouraging': return 'bg-gradient-to-r from-duo-green/10 to-duo-blue/10 border-duo-green/20 text-duo-green-dark'
    case 'celebrating': return 'bg-gradient-to-r from-duo-yellow/10 to-amber-50 border-duo-yellow/30 text-amber-800'
    case 'calming': return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700'
    case 'challenging': return 'bg-gradient-to-r from-duo-purple/10 to-violet-50 border-duo-purple/20 text-duo-purple'
  }
}

export function getToneIconBg(tone: MotivationalMessage['tone']): string {
  switch (tone) {
    case 'encouraging': return 'bg-duo-green/20'
    case 'celebrating': return 'bg-duo-yellow/20'
    case 'calming': return 'bg-blue-200/50'
    case 'challenging': return 'bg-duo-purple/20'
  }
}

export function updateEmotionalState(
  current: EmotionalState,
  changes: Partial<EmotionalState>
): EmotionalState {
  return { ...current, ...changes }
}

export function recordAnswerAttempt(
  state: EmotionalState,
  isCorrect: boolean
): EmotionalState {
  return {
    ...state,
    errorsInRow: isCorrect ? 0 : state.errorsInRow + 1,
    successesInRow: isCorrect ? state.successesInRow + 1 : 0,
    recentAccuracy: isCorrect
      ? Math.min(100, Math.round((state.recentAccuracy * 0.9) + 10))
      : Math.max(0, Math.round((state.recentAccuracy * 0.9))),
  }
}

export function recordSessionStart(state: EmotionalState): EmotionalState {
  return {
    ...state,
    sessionDuration: 0,
    errorsInRow: 0,
    successesInRow: 0,
    lastVisit: new Date().toISOString().split('T')[0],
    comboAtStart: state.successesInRow,
  }
}

export function recordLevelUp(state: EmotionalState, oldLevel: number, newLevel: number): EmotionalState {
  return {
    ...state,
    newLevelReached: newLevel > oldLevel,
    previousLevel: oldLevel,
  }
}

export function recordStreakBreak(state: EmotionalState, currentStreak: number): EmotionalState {
  if (currentStreak <= 1 && state.lastStreakBeforeBreak === undefined) {
    return { ...state, lastStreakBeforeBreak: currentStreak > 0 ? currentStreak : 1 }
  }
  return state
}

export function recordExamTaken(state: EmotionalState): EmotionalState {
  return {
    ...state,
    lastExamDate: new Date().toISOString().split('T')[0],
  }
}

export function clearTransientFlags(state: EmotionalState): EmotionalState {
  return {
    ...state,
    newLevelReached: false,
    previousLevel: undefined,
    lastStreakBeforeBreak: undefined,
  }
}

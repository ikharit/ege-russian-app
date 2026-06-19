import { PlayerType, PlayerProfile, UserStats, LessonProgress, EmotionalState } from '../types'
import { Course } from '../types'

export type { PlayerType, PlayerProfile }

const PLAYER_TYPE_WEIGHTS: Record<PlayerType, { xp: number; achievements: number; leaderboard: number; lessonsCompleted: number; sectionsOpened: number; classActivity: number; challenges: number; duels: number; explorationDepth: number; socialShares: number; pvpActivity: number }> = {
  achiever: {
    xp: 3, achievements: 5, leaderboard: 4, lessonsCompleted: 2,
    sectionsOpened: 1, classActivity: 1, challenges: 2, duels: 1,
    explorationDepth: 1, socialShares: 0, pvpActivity: 1,
  },
  explorer: {
    xp: 1, achievements: 1, leaderboard: 0, lessonsCompleted: 2,
    sectionsOpened: 5, classActivity: 1, challenges: 0, duels: 0,
    explorationDepth: 5, socialShares: 0, pvpActivity: 0,
  },
  socializer: {
    xp: 1, achievements: 1, leaderboard: 1, lessonsCompleted: 2,
    sectionsOpened: 1, classActivity: 5, challenges: 2, duels: 1,
    explorationDepth: 1, socialShares: 4, pvpActivity: 1,
  },
  killer: {
    xp: 2, achievements: 2, leaderboard: 5, lessonsCompleted: 2,
    sectionsOpened: 1, classActivity: 2, challenges: 4, duels: 5,
    explorationDepth: 1, socialShares: 1, pvpActivity: 5,
  },
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)))
}

export function detectPlayerType(
  userStats: UserStats,
  lessonProgress: Record<string, LessonProgress>,
  course: Course,
  leaderboardEntries: number = 0,
  duelCount: number = 0,
  challengeCount: number = 0,
  classJoined: boolean = false
): PlayerProfile {
  const completedLessons = Object.values(lessonProgress).filter(l => l.status === 'completed').length
  const totalLessons = course.sections.reduce((sum, s) => sum + s.lessons.length, 0)
  const sectionsWithProgress = course.sections.filter(s =>
    s.lessons.some(l => lessonProgress[l.id]?.status === 'completed')
  ).length
  const totalSections = course.sections.length

  // Normalized metrics (0-100)
  const xpScore = Math.min(100, (userStats.xp / 1000) * 100)
  const achievementScore = Math.min(100, ((userStats.achievements?.length || 0) / 20) * 100)
  const leaderboardScore = Math.min(100, leaderboardEntries * 20)
  const lessonsScore = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0
  const sectionsScore = totalSections > 0 ? (sectionsWithProgress / totalSections) * 100 : 0
  const classScore = classJoined ? 80 : 10
  const challengeScore = Math.min(100, challengeCount * 25)
  const duelScore = Math.min(100, duelCount * 25)
  const explorationScore = sectionsWithProgress >= 3 ? 80 : sectionsWithProgress * 25

  const scores: Record<PlayerType, number> = {
    achiever: 0,
    explorer: 0,
    socializer: 0,
    killer: 0,
  }

  for (const type of Object.keys(PLAYER_TYPE_WEIGHTS) as PlayerType[]) {
    const w = PLAYER_TYPE_WEIGHTS[type]
    scores[type] = clampScore(
      (xpScore * w.xp +
        achievementScore * w.achievements +
        leaderboardScore * w.leaderboard +
        lessonsScore * w.lessonsCompleted +
        sectionsScore * w.sectionsOpened +
        classScore * w.classActivity +
        challengeScore * w.challenges +
        duelScore * w.duels +
        explorationScore * w.explorationDepth) /
      (w.xp + w.achievements + w.leaderboard + w.lessonsCompleted + w.sectionsOpened + w.classActivity + w.challenges + w.duels + w.explorationDepth)
    )
  }

  const dominantType = (Object.entries(scores) as [PlayerType, number][])
    .sort((a, b) => b[1] - a[1])[0][0]

  return {
    type: dominantType,
    scores,
    detectedAt: new Date().toISOString(),
    source: 'behavior',
  }
}

export function getPlayerTypeLabel(type: PlayerType): string {
  switch (type) {
    case 'achiever': return 'Достиженец'
    case 'explorer': return 'Исследователь'
    case 'socializer': return 'Коммуникатор'
    case 'killer': return 'Соревнователь'
  }
}

export function getPlayerTypeDescription(type: PlayerType): string {
  switch (type) {
    case 'achiever':
      return 'Ты стремишься к целям, собираешь достижения и отслеживаешь прогресс. XP, уровни и награды — твой двигатель!'
    case 'explorer':
      return 'Ты любишь открывать новое, изучать скрытые темы и копать вглубь. Каждый урок — это приключение!'
    case 'socializer':
      return 'Ты мотивируешься общением, классом и совместным прогрессом. Учиться вместе — веселее!'
    case 'killer':
      return 'Ты любишь соревнования, дуэли и быть лучшим. Топ рейтинга — твоя цель!'
  }
}

export function getPlayerTypeColor(type: PlayerType): string {
  switch (type) {
    case 'achiever': return '#F59E0B' // amber-500
    case 'explorer': return '#8B5CF6' // violet-500
    case 'socializer': return '#F97316' // orange-500
    case 'killer': return '#EF4444' // red-500
  }
}

export function getPlayerTypeGradient(type: PlayerType): string {
  switch (type) {
    case 'achiever': return 'from-amber-50 to-yellow-50'
    case 'explorer': return 'from-violet-50 to-purple-50'
    case 'socializer': return 'from-orange-50 to-rose-50'
    case 'killer': return 'from-red-50 to-orange-50'
  }
}

export function getPlayerTypeBorder(type: PlayerType): string {
  switch (type) {
    case 'achiever': return 'border-amber-200'
    case 'explorer': return 'border-violet-200'
    case 'socializer': return 'border-orange-200'
    case 'killer': return 'border-red-200'
  }
}

export function getPlayerTypeIcon(type: PlayerType): string {
  switch (type) {
    case 'achiever': return '🏆'
    case 'explorer': return '🔮'
    case 'socializer': return '👥'
    case 'killer': return '⚔️'
  }
}

export function getPersonalityDashboardPriorities(type: PlayerType): {
  xpFirst: boolean
  newTopicsFirst: boolean
  socialFirst: boolean
  competitiveFirst: boolean
} {
  switch (type) {
    case 'achiever':
      return { xpFirst: true, newTopicsFirst: false, socialFirst: false, competitiveFirst: false }
    case 'explorer':
      return { xpFirst: false, newTopicsFirst: true, socialFirst: false, competitiveFirst: false }
    case 'socializer':
      return { xpFirst: false, newTopicsFirst: false, socialFirst: true, competitiveFirst: false }
    case 'killer':
      return { xpFirst: false, newTopicsFirst: false, socialFirst: false, competitiveFirst: true }
  }
}

export function calculateQuizProfile(answers: { question: number; choice: number }[]): PlayerProfile {
  // Quiz mapping: 0=achiever, 1=explorer, 2=socializer, 3=killer
  const scores: Record<PlayerType, number> = { achiever: 0, explorer: 0, socializer: 0, killer: 0 }
  const typeMap: PlayerType[] = ['achiever', 'explorer', 'socializer', 'killer']

  for (const ans of answers) {
    if (ans.choice >= 0 && ans.choice < 4) {
      scores[typeMap[ans.choice]] += 1
    }
  }

  // Normalize to 0-100
  const maxPossible = answers.length
  for (const type of typeMap) {
    scores[type] = clampScore((scores[type] / maxPossible) * 100)
  }

  const dominantType = (Object.entries(scores) as [PlayerType, number][])
    .sort((a, b) => b[1] - a[1])[0][0]

  return {
    type: dominantType,
    scores,
    detectedAt: new Date().toISOString(),
    source: 'quiz',
  }
}

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    text: 'Что тебя мотивирует больше всего?',
    options: [
      { label: 'Достижения, награды и прогресс', type: 'achiever' },
      { label: 'Открытие новых тем и знаний', type: 'explorer' },
      { label: 'Общение и совместная работа', type: 'socializer' },
      { label: 'Победа и лидерство', type: 'killer' },
    ],
  },
  {
    id: 2,
    text: 'Как ты предпочитаешь учиться?',
    options: [
      { label: 'По плану с чёткими целями', type: 'achiever' },
      { label: 'Исследуя всё подряд', type: 'explorer' },
      { label: 'В группе с друзьями', type: 'socializer' },
      { label: 'Соревнуясь с другими', type: 'killer' },
    ],
  },
  {
    id: 3,
    text: 'Что для тебя важнее в приложении?',
    options: [
      { label: 'Трекер прогресса и ачивки', type: 'achiever' },
      { label: 'Карта курса с секретами', type: 'explorer' },
      { label: 'Класс и чаты', type: 'socializer' },
      { label: 'Рейтинг и дуэли', type: 'killer' },
    ],
  },
  {
    id: 4,
    text: 'Как ты реагируешь на ошибку?',
    options: [
      { label: 'Анализирую и стремлюсь исправить', type: 'achiever' },
      { label: 'Ищу связанные темы', type: 'explorer' },
      { label: 'Прошу помощи у друзей', type: 'socializer' },
      { label: 'Делаю ещё раз, пока не победю', type: 'killer' },
    ],
  },
  {
    id: 5,
    text: 'Твой идеальный вечер пятницы?',
    options: [
      { label: 'Закрыть все задачи недели', type: 'achiever' },
      { label: 'Почитать что-то новое', type: 'explorer' },
      { label: 'Встреча с друзьями', type: 'socializer' },
      { label: 'Игра с соревнованием', type: 'killer' },
    ],
  },
]

export function getPersonalityMotivation(type: PlayerType, context: { xpToNext?: number; level?: number; unlockedTopics?: number; totalTopics?: number; classRank?: number; className?: string; rivalName?: string }): string {
  switch (type) {
    case 'achiever':
      if (context.xpToNext !== undefined && context.level !== undefined) {
        return `Ещё ${context.xpToNext} XP до уровня ${context.level + 1}!`
      }
      return 'Получи награду за следующее достижение! 🏅'
    case 'explorer':
      if (context.unlockedTopics !== undefined && context.totalTopics !== undefined) {
        return `Ты открыл ${context.unlockedTopics} из ${context.totalTopics} тем. Что там дальше? 🔮`
      }
      return 'Новая тема ждёт тебя! 🔮'
    case 'socializer':
      if (context.classRank !== undefined && context.className) {
        return `Твой класс ${context.className} вперёд! Догоняй! 👥`
      }
      return 'Присоединяйся к классу и учись вместе! 👥'
    case 'killer':
      if (context.rivalName) {
        return `Победи ${context.rivalName} в дуэли! ⚔️`
      }
      if (context.classRank !== undefined) {
        return `Ты #${context.classRank} в классе! До #1 — немного XP!`
      }
      return 'Вызови на дуэль! ⚔️'
  }
}

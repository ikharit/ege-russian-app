import { ProgressData } from '../stores/classStore'
import { detectPlayerType, PlayerType, PlayerProfile } from './personalityEngine'
import { course } from '../data/courseData'

export interface StudentAnalytics {
  profileId: string
  name: string
  playerProfile: PlayerProfile
  riskLevel: 'low' | 'medium' | 'high'
  strengths: string[]
  weaknesses: string[]
  motivation: string
  lastActivityDays: number
  completionRate: number
  accuracy: number
  streak: number
  totalTimeMinutes: number
  topTask: string
  weakestTask: string
  recommendation: string
  behaviorProfile?: {
    mostActiveCategory: string
    leastActiveCategory: string
    preferredLearningTime: string
    sessionFrequency: string
    avgSessionDuration: number
    totalClicks: number
    totalSessions: number
    topClickedElements: { element: string; count: number }[]
    timeDistribution: Record<string, number>
    clickDistribution: Record<string, number>
    motivationSignals: {
      achievementDriven: number
      socialDriven: number
      explorationDriven: number
      competitionDriven: number
    }
  }
}

export interface ClassAnalyticsSummary {
  totalStudents: number
  dominantType: PlayerType
  typeDistribution: Record<PlayerType, number>
  atRiskCount: number
  avgCompletionRate: number
  avgAccuracy: number
  avgStreak?: number
  riskDistribution?: { low: number; medium: number; high: number }
  playerTypeDistribution?: Record<PlayerType, number>
  motivationDistribution?: Record<string, number>
  topWeakTopics?: string[]
  insights?: string[]
  topPerformers: string[]
  needAttention: string[]
  classInsights: string[]
}

function daysSince(dateStr: string | undefined): number {
  if (!dateStr) return 999
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return 999
  return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24))
}

export function analyzeStudent(
  profileId: string,
  name: string,
  progress: ProgressData | undefined
): StudentAnalytics {
  if (!progress) {
    return {
      profileId,
      name,
      playerProfile: { type: 'achiever', scores: { achiever: 25, explorer: 25, socializer: 25, killer: 25 }, detectedAt: new Date().toISOString(), source: 'behavior' },
      riskLevel: 'high',
      strengths: [],
      weaknesses: ['Нет данных о прогрессе'],
      motivation: 'Начни учиться — твой прогресс покажет, что тебе интересно!',
      lastActivityDays: 999,
      completionRate: 0,
      accuracy: 0,
      streak: 0,
      totalTimeMinutes: 0,
      topTask: '—',
      weakestTask: '—',
      recommendation: 'Ученик ещё не начал обучение. Рекомендуется мотивировать первыми простыми заданиями.',
    }
  }

  const stats = progress.userStats
  const lessonProgress = progress.lessonProgress || {}
  const taskStats = progress.taskStats || {}

  // Detect player type from behavior
  const playerProfile = detectPlayerType(
    stats,
    lessonProgress,
    course,
    0, // leaderboard entries - we'll calculate later if needed
    0, // duel count - not tracked per student yet
    0, // challenge count
    false // class joined - not available here
  )

  // Calculate metrics
  const totalLessons = course.sections.reduce((sum, s) => sum + s.lessons.length, 0)
  const completedLessons = Object.values(lessonProgress).filter(l => l.status === 'completed').length
  const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  const totalAttempts = Object.values(taskStats).reduce((sum, t) => sum + (t.total || 0), 0)
  const totalCorrect = Object.values(taskStats).reduce((sum, t) => sum + (t.correct || 0), 0)
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0

  const lastActivity = stats.lastActivityDate
  const lastActivityDays = daysSince(lastActivity)

  // Find top and weakest tasks
  const taskEntries = Object.entries(taskStats)
  const sortedByAccuracy = taskEntries
    .filter(([, t]) => t.total >= 3)
    .sort((a, b) => (b[1].correct / b[1].total) - (a[1].correct / a[1].total))
  
  const topTask = sortedByAccuracy.length > 0 ? sortedByAccuracy[0][0] : '—'
  const weakestTask = sortedByAccuracy.length > 0 ? sortedByAccuracy[sortedByAccuracy.length - 1][0] : '—'

  // Determine strengths and weaknesses
  const strengths: string[] = []
  const weaknesses: string[] = []

  if (accuracy >= 80) strengths.push('Высокая точность ответов')
  else if (accuracy < 50) weaknesses.push('Низкая точность ответов')

  if (stats.streak >= 7) strengths.push('Сильный стрик')
  else if (stats.streak === 0 && lastActivityDays < 3) weaknesses.push('Прервался стрик')

  if (completionRate >= 50) strengths.push('Хороший прогресс курса')
  else if (completionRate < 20) weaknesses.push('Мало пройдено уроков')

  if (stats.totalQuestionsAnswered && stats.totalQuestionsAnswered >= 100) strengths.push('Много практики')
  
  if (stats.maxCombo && stats.maxCombo >= 10) strengths.push('Умеет поддерживать комбо')

  if (lastActivityDays > 7) weaknesses.push('Давно не заходил')
  else if (lastActivityDays > 3) weaknesses.push('Не был несколько дней')

  if (stats.hearts !== undefined && stats.hearts <= 1) weaknesses.push('Мало жизней')

  // Risk level
  let riskLevel: 'low' | 'medium' | 'high' = 'low'
  if (lastActivityDays > 14 || (completionRate < 10 && lastActivityDays > 7)) {
    riskLevel = 'high'
  } else if (lastActivityDays > 7 || accuracy < 40 || completionRate < 20) {
    riskLevel = 'medium'
  }

  // Motivation based on player type
  const motivationMap: Record<PlayerType, string> = {
    achiever: 'Мотивируется достижениями и XP. Давай конкретные цели и отмечай прогресс!',
    explorer: 'Любит открывать новое. Предложи интересные темы и бонусные материалы!',
    socializer: 'Мотивируется общением. Вовлеки в классные активности и совместные задания!',
    killer: 'Любит соревнования. Организуй дуэли и конкурсы в классе!',
  }

  // Recommendation
  let recommendation = ''
  if (riskLevel === 'high') {
    recommendation = 'Срочно требует внимания! Свяжись с учеником, выясни причины пропусков.'
  } else if (riskLevel === 'medium') {
    recommendation = 'Нужна поддержка. Предложи помощь, мотивируй персональным сообщением.'
  } else if (accuracy < 60) {
    recommendation = 'Активен, но точность низкая. Предложи повторить теорию по слабым темам.'
  } else if (completionRate < 30) {
    recommendation = 'Хорошая точность, но мало пройдено. Предложи план на неделю.'
  } else {
    recommendation = 'Всё отлично! Можно предложить более сложные задания или дуэли.'
  }

  return {
    profileId,
    name,
    playerProfile,
    riskLevel,
    strengths: strengths.length > 0 ? strengths : ['Начал обучение'],
    weaknesses: weaknesses.length > 0 ? weaknesses : [],
    motivation: motivationMap[playerProfile.type],
    lastActivityDays,
    completionRate,
    accuracy,
    streak: stats.streak || 0,
    totalTimeMinutes: stats.totalLessonTimeMinutes || 0,
    topTask,
    weakestTask,
    recommendation,
    behaviorProfile: progress?.behaviorProfile,
  }
}

export function analyzeClass(
  students: { profileId: string; name: string; progress?: ProgressData }[]
): ClassAnalyticsSummary {
  const analytics = students.map(s => analyzeStudent(s.profileId, s.name, s.progress))
  
  const totalStudents = students.length
  if (totalStudents === 0) {
    return {
      totalStudents: 0,
      dominantType: 'achiever',
      typeDistribution: { achiever: 0, explorer: 0, socializer: 0, killer: 0 },
      atRiskCount: 0,
      avgCompletionRate: 0,
      avgAccuracy: 0,
      topPerformers: [],
      needAttention: [],
      classInsights: ['Добавьте учеников, чтобы увидеть аналитику.'],
    }
  }

  // Type distribution
  const typeDistribution: Record<PlayerType, number> = { achiever: 0, explorer: 0, socializer: 0, killer: 0 }
  for (const a of analytics) {
    typeDistribution[a.playerProfile.type]++
  }
  const dominantType = (Object.entries(typeDistribution) as [PlayerType, number][])
    .sort((a, b) => b[1] - a[1])[0][0]

  // Averages
  const avgCompletionRate = Math.round(analytics.reduce((sum, a) => sum + a.completionRate, 0) / totalStudents)
  const avgAccuracy = Math.round(analytics.reduce((sum, a) => sum + a.accuracy, 0) / totalStudents)
  const atRiskCount = analytics.filter(a => a.riskLevel === 'high').length

  // Top performers and need attention
  const sortedByScore = [...analytics].sort((a, b) => 
    (b.completionRate + b.accuracy) - (a.completionRate + a.accuracy)
  )
  const topPerformers = sortedByScore.slice(0, 3).map(a => a.name)
  const needAttention = analytics.filter(a => a.riskLevel === 'high' || a.riskLevel === 'medium').map(a => a.name)

  // Insights
  const insights: string[] = []
  
  if (atRiskCount > 0) {
    insights.push(`${atRiskCount} учеников требуют внимания — возможно, пропускают занятия.`)
  }
  
  if (avgAccuracy < 60) {
    insights.push('Средняя точность класса низкая. Рекомендуется повторить базовые темы.')
  } else if (avgAccuracy > 80) {
    insights.push('Класс показывает отличную точность! Можно ускорить темп.')
  }

  if (avgCompletionRate < 30) {
    insights.push('Мало пройдено уроков. Ученикам нужна мотивация для регулярных занятий.')
  }

  const typePercent = Math.round((typeDistribution[dominantType] / totalStudents) * 100)
  const typeLabel = dominantType === 'achiever' ? 'достиженцы' : 
                    dominantType === 'explorer' ? 'исследователи' :
                    dominantType === 'socializer' ? 'коммуникаторы' : 'соревнователи'
  insights.push(`${typePercent}% класса — ${typeLabel}. Адаптируй подход: ${getTypeStrategy(dominantType)}`)

  if (insights.length === 0) {
    insights.push('Класс в хорошей форме. Продолжайте в том же духе!')
  }

  return {
    totalStudents,
    dominantType,
    typeDistribution,
    atRiskCount,
    avgCompletionRate,
    avgAccuracy,
    topPerformers,
    needAttention,
    classInsights: insights,
  }
}

function getTypeStrategy(type: PlayerType): string {
  switch (type) {
    case 'achiever': return 'чёткие цели, XP, достижения'
    case 'explorer': return 'новые темы, бонусные материалы, карта курса'
    case 'socializer': return 'групповые задания, обсуждения, классный чат'
    case 'killer': return 'дуэли, рейтинги, соревнования'
  }
}

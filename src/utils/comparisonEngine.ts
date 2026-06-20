import { useProgressStore } from '../stores/progressStore'
import { useStudentStore } from '../stores/studentStore'

export interface ComparisonStats {
  speedPercentile: number
  accuracyPercentile: number
  efficiencyPercentile: number
  streakPercentile: number
  overallPercentile: number
  averages: {
    avgSpeed: number
    avgAccuracy: number
    avgEfficiency: number
  }
  details: {
    speed: { value: number; norm: number; label: string }
    accuracy: { value: number; norm: number; label: string }
    efficiency: { value: number; norm: number; label: string }
    streak: { value: number; norm: number; label: string }
  }
  motivation: string
  taskBreakdown: { taskNumber: string; percentile: number; userAccuracy: number }[]
  hasEnoughData: boolean
}

interface StudentData {
  id: string
  name: string
  xp: number
  level: number
  streak: number
  accuracy: number
  avgAnswerTime: number
  totalAnswers: number
  daysActive: number
  taskStats: Record<string, { total: number; correct: number }>
}

function collectStudentData(): StudentData[] {
  const profiles = useStudentStore.getState().profiles
  const result: StudentData[] = []

  // Текущий пользователь
  const currentProgress = useProgressStore.getState()
  const answerHistory = currentProgress.answerHistory
  const totalTime = answerHistory.reduce((sum, h) => sum + (h.timeSpent || 0), 0)
  const avgTime = answerHistory.length > 0 ? totalTime / answerHistory.length / 1000 : 0
  const totalAnswers = answerHistory.length

  const taskStats = currentProgress.taskStats
  const totalAttempts = Object.values(taskStats).reduce((sum, t) => sum + (t.total || 0), 0)
  const totalCorrect = Object.values(taskStats).reduce((sum, t) => sum + (t.correct || 0), 0)
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0

  const completedDates = Object.values(currentProgress.lessonProgress)
    .filter((l) => l.completedAt)
    .map((l) => new Date(l.completedAt!).getTime())
    .sort((a, b) => a - b)
  const daysActive = completedDates.length > 0
    ? Math.max(1, Math.floor((Date.now() - completedDates[0]) / (1000 * 60 * 60 * 24)))
    : 1

  result.push({
    id: 'me',
    name: 'Вы',
    xp: currentProgress.userStats.xp,
    level: currentProgress.userStats.level,
    streak: currentProgress.userStats.streak,
    accuracy,
    avgAnswerTime: avgTime,
    totalAnswers,
    daysActive,
    taskStats,
  })

  // Профили из studentStore (максимум 9)
  for (const profile of profiles.slice(0, 9)) {
    const progress = profile.progress || {}
    const pTaskStats = progress.taskStats || {}
    const pTotalAttempts = (Object.values(pTaskStats) as any[]).reduce((sum: number, t: any) => sum + (t.total || 0), 0)
    const pTotalCorrect = (Object.values(pTaskStats) as any[]).reduce((sum: number, t: any) => sum + (t.correct || 0), 0)
    const pAccuracy = pTotalAttempts > 0 ? Math.round((pTotalCorrect / pTotalAttempts) * 100) : 0

    const pAnswerHistory = progress.answerHistory || []
    const pTotalTime = pAnswerHistory.reduce((sum: number, h: any) => sum + (h.timeSpent || 0), 0)
    const pAvgTime = pAnswerHistory.length > 0 ? pTotalTime / pAnswerHistory.length / 1000 : 0

    const pCompletedDates = Object.values(progress.lessonProgress || {})
      .filter((l: any) => l.completedAt)
      .map((l: any) => new Date(l.completedAt).getTime())
      .sort((a: number, b: number) => a - b)
    const pDaysActive = pCompletedDates.length > 0
      ? Math.max(1, Math.floor((Date.now() - pCompletedDates[0]) / (1000 * 60 * 60 * 24)))
      : 1

    result.push({
      id: profile.id,
      name: profile.name,
      xp: progress.userStats?.xp || 0,
      level: progress.userStats?.level || 1,
      streak: progress.userStats?.streak || 0,
      accuracy: pAccuracy,
      avgAnswerTime: pAvgTime,
      totalAnswers: pAnswerHistory.length,
      daysActive: pDaysActive,
      taskStats: pTaskStats,
    })
  }

  return result
}

function calculatePercentile(value: number, allValues: number[], higherIsBetter: boolean): number {
  const sorted = [...allValues].sort((a, b) => a - b)
  const count = sorted.length
  if (count === 0) return 50
  if (count === 1) return 100

  // Найти позицию
  let position = 0
  for (let i = 0; i < count; i++) {
    if (higherIsBetter) {
      if (sorted[i] <= value) position = i + 1
    } else {
      if (sorted[i] >= value) position = i + 1
    }
  }

  return Math.round(((position - 1) / (count - 1)) * 100)
}

export function calculateComparisonStats(): ComparisonStats {
  const allStudents = collectStudentData()
  const me = allStudents[0]

  const hasEnoughData = me.totalAnswers >= 20

  const speeds = allStudents.map((s) => s.avgAnswerTime)
  const accuracies = allStudents.map((s) => s.accuracy)
  const efficiencies = allStudents.map((s) => (s.daysActive > 0 ? s.xp / s.daysActive : 0))
  const streaks = allStudents.map((s) => s.streak)

  const speedPercentile = calculatePercentile(me.avgAnswerTime, speeds, false)
  const accuracyPercentile = calculatePercentile(me.accuracy, accuracies, true)
  const efficiencyPercentile = calculatePercentile(
    me.daysActive > 0 ? me.xp / me.daysActive : 0,
    efficiencies,
    true
  )
  const streakPercentile = calculatePercentile(me.streak, streaks, true)

  const overallPercentile = Math.round(
    (speedPercentile + accuracyPercentile + efficiencyPercentile + streakPercentile) / 4
  )

  // Средние значения по группе
  const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length
  const avgAccuracy = accuracies.reduce((a, b) => a + b, 0) / accuracies.length
  const avgEfficiency = efficiencies.reduce((a, b) => a + b, 0) / efficiencies.length

  // Мотивационное сообщение
  let motivation = ''
  if (overallPercentile > 80) {
    motivation = 'Ты в топ-20%! 🔥'
  } else if (overallPercentile > 50) {
    motivation = 'Ты выше среднего! 💪'
  } else if (overallPercentile > 30) {
    motivation = 'Хороший прогресс! Продолжай в том же духе 📈'
  } else {
    motivation = 'Есть куда расти! Каждый день +1% 📈'
  }

  // По заданиям
  const taskBreakdown: { taskNumber: string; percentile: number; userAccuracy: number }[] = []
  const taskNumbers = Array.from(new Set([
    ...Object.keys(me.taskStats),
    ...allStudents.flatMap((s) => Object.keys(s.taskStats)),
  ])).sort((a, b) => Number(a) - Number(b))

  for (const taskNum of taskNumbers) {
    const taskAccuracies = allStudents
      .map((s) => {
        const t = s.taskStats[taskNum]
        if (!t || t.total === 0) return -1
        return Math.round((t.correct / t.total) * 100)
      })
      .filter((a) => a >= 0)

    const userAcc = me.taskStats[taskNum]
    const userAccuracy = userAcc && userAcc.total > 0 ? Math.round((userAcc.correct / userAcc.total) * 100) : -1

    if (userAccuracy >= 0 && taskAccuracies.length > 1) {
      const percentile = calculatePercentile(userAccuracy, taskAccuracies, true)
      taskBreakdown.push({ taskNumber: taskNum, percentile, userAccuracy })
    }
  }

  return {
    speedPercentile,
    accuracyPercentile,
    efficiencyPercentile,
    streakPercentile,
    overallPercentile,
    averages: {
      avgSpeed: Math.round(avgSpeed * 10) / 10,
      avgAccuracy: Math.round(avgAccuracy),
      avgEfficiency: Math.round(avgEfficiency * 10) / 10,
    },
    details: {
      speed: { value: Math.round(me.avgAnswerTime * 10) / 10, norm: Math.round(avgSpeed * 10) / 10, label: 'сек на вопрос' },
      accuracy: { value: me.accuracy, norm: Math.round(avgAccuracy), label: '%' },
      efficiency: { value: Math.round((me.daysActive > 0 ? me.xp / me.daysActive : 0) * 10) / 10, norm: Math.round(avgEfficiency * 10) / 10, label: 'XP/день' },
      streak: { value: me.streak, norm: Math.round(streaks.reduce((a, b) => a + b, 0) / streaks.length), label: 'дней' },
    },
    motivation,
    taskBreakdown,
    hasEnoughData,
  }
}

export function getPercentileLabel(percentile: number): string {
  if (percentile >= 90) return 'Топ-10%'
  if (percentile >= 80) return 'Топ-20%'
  if (percentile >= 70) return 'Топ-30%'
  if (percentile >= 60) return 'Выше среднего'
  if (percentile >= 40) return 'Средний'
  if (percentile >= 20) return 'Ниже среднего'
  return 'Требуется практика'
}

export function getPercentileColor(percentile: number): string {
  if (percentile >= 80) return '#58cc02' // duo-green
  if (percentile >= 60) return '#93d500' // light green
  if (percentile >= 40) return '#f5a623' // yellow
  if (percentile >= 20) return '#ff8c00' // orange
  return '#ff4b4b' // red
}

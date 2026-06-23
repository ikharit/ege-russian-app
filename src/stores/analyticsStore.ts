import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type EventCategory =
  | 'lesson' | 'trainer' | 'theory' | 'exam' | 'flashcard'
  | 'dashboard' | 'profile' | 'leaderboard' | 'shop' | 'chat'
  | 'game' | 'duel' | 'marathon' | 'adaptive' | 'mistakes'
  | 'notification' | 'auth' | 'settings' | 'other'

export interface AnalyticsEvent {
  id: string
  timestamp: string
  category: EventCategory
  action: string
  label?: string
  value?: number
  duration?: number // seconds spent
  metadata?: Record<string, unknown>
}

export interface PageSession {
  page: string
  enteredAt: string
  leftAt?: string
  durationSeconds: number
}

export interface ClickEvent {
  id: string
  timestamp: string
  element: string
  page: string
  category: EventCategory
  label?: string
}

export interface TimeSpentByCategory {
  category: EventCategory
  totalSeconds: number
  sessionCount: number
  avgDuration: number
}

export interface ClickStatsByCategory {
  category: EventCategory
  clickCount: number
  uniqueElements: number
  topElements: { element: string; count: number }[]
}

export interface UserBehaviorProfile {
  mostActiveCategory: EventCategory
  leastActiveCategory: EventCategory
  preferredLearningTime: 'morning' | 'afternoon' | 'evening' | 'night' | 'mixed'
  sessionFrequency: 'daily' | 'few_times_week' | 'weekly' | 'rarely'
  avgSessionDuration: number
  totalClicks: number
  totalSessions: number
  topClickedElements: { element: string; count: number }[]
  timeDistribution: Record<EventCategory, number>
  clickDistribution: Record<EventCategory, number>
  motivationSignals: {
    achievementDriven: number // XP seeking, level up, achievements
    socialDriven: number     // class, leaderboard, chat, duels
    explorationDriven: number // new topics, theory, knowledge map
    competitionDriven: number // duels, leaderboard, challenges
  }
}

interface AnalyticsState {
  events: AnalyticsEvent[]
  pageSessions: PageSession[]
  clickEvents: ClickEvent[]
  lastEventTrim: string
  dailySnapshots: DailySnapshot[]
}

export interface DailySnapshot {
  date: string // YYYY-MM-DD
  totalSessions: number
  totalClicks: number
  totalTimeSeconds: number
  accuracy?: number
  lessonsCompleted: number
  xpEarned: number
  timeDistribution: Record<string, number>
  clickDistribution: Record<string, number>
  motivationSignals: {
    achievementDriven: number
    socialDriven: number
    explorationDriven: number
    competitionDriven: number
  }
}

export interface TrendData {
  dates: string[]
  sessions: number[]
  clicks: number[]
  timeMinutes: number[]
  accuracy: number[]
  xp: number[]
  motivationAchievement: number[]
  motivationSocial: number[]
  motivationExploration: number[]
  motivationCompetition: number[]
}

interface AnalyticsActions {
  trackEvent: (category: EventCategory, action: string, label?: string, value?: number, metadata?: Record<string, unknown>) => void
  trackClick: (element: string, page: string, category: EventCategory, label?: string) => void
  startPageSession: (page: string) => void
  endPageSession: (page: string) => void
  getBehaviorProfile: () => UserBehaviorProfile
  getTimeByCategory: () => TimeSpentByCategory[]
  getClicksByCategory: () => ClickStatsByCategory[]
  getEventsForPeriod: (days: number) => AnalyticsEvent[]
  getDailySnapshot: (date: string) => DailySnapshot | undefined
  getTrends: (days: number) => TrendData
  takeSnapshot: () => void
  getAlerts: () => TeacherAlert[]
  getRecommendations: () => TeacherRecommendation[]
  trimOldEvents: (keepDays?: number) => void
  clearAnalytics: () => void
}

export interface TeacherAlert {
  id: string
  type: 'risk' | 'trend' | 'achievement' | 'behavior'
  severity: 'low' | 'medium' | 'high'
  title: string
  message: string
  studentName?: string
  date: string
}

export interface TeacherRecommendation {
  id: string
  category: 'motivation' | 'content' | 'engagement' | 'risk'
  priority: 'low' | 'medium' | 'high'
  title: string
  description: string
  action: string
  date?: string
  targetStudents?: string[]
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10)
}

function getHourOfDay(timestamp: string): number {
  return new Date(timestamp).getHours()
}

function categorizeHour(hour: number): 'morning' | 'afternoon' | 'evening' | 'night' {
  if (hour >= 6 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 22) return 'evening'
  return 'night'
}

export const useAnalyticsStore = create<AnalyticsState & AnalyticsActions>()(
  persist(
    (set, get) => ({
      events: [],
      pageSessions: [],
      clickEvents: [],
      lastEventTrim: new Date().toISOString(),
      dailySnapshots: [],

      trackEvent(category, action, label, value, metadata) {
        const event: AnalyticsEvent = {
          id: generateId(),
          timestamp: new Date().toISOString(),
          category,
          action,
          label,
          value,
          metadata,
        }
        set((state) => ({
          events: [...state.events.slice(-4999), event], // keep last 5000 events
        }))
      },

      trackClick(element, page, category, label) {
        const click: ClickEvent = {
          id: generateId(),
          timestamp: new Date().toISOString(),
          element,
          page,
          category,
          label,
        }
        set((state) => ({
          clickEvents: [...state.clickEvents.slice(-9999), click], // keep last 10000
        }))
      },

      startPageSession(page) {
        const session: PageSession = {
          page,
          enteredAt: new Date().toISOString(),
          durationSeconds: 0,
        }
        set((state) => ({
          pageSessions: [...state.pageSessions.slice(-1999), session],
        }))
      },

      endPageSession(page) {
        const now = new Date().toISOString()
        set((state) => {
          const sessions = [...state.pageSessions]
          // Find the most recent unclosed session for this page
          for (let i = sessions.length - 1; i >= 0; i--) {
            if (sessions[i].page === page && !sessions[i].leftAt) {
              const entered = new Date(sessions[i].enteredAt)
              const left = new Date(now)
              const duration = Math.max(0, Math.round((left.getTime() - entered.getTime()) / 1000))
              sessions[i] = { ...sessions[i], leftAt: now, durationSeconds: duration }
              break
            }
          }
          return { pageSessions: sessions }
        })
      },

      getBehaviorProfile() {
        const { events, clickEvents, pageSessions } = get()
        const recentEvents = events.filter(e => {
          const days = (Date.now() - new Date(e.timestamp).getTime()) / (1000 * 60 * 60 * 24)
          return days <= 30
        })
        const recentClicks = clickEvents.filter(c => {
          const days = (Date.now() - new Date(c.timestamp).getTime()) / (1000 * 60 * 60 * 24)
          return days <= 30
        })
        const recentSessions = pageSessions.filter(s => {
          const days = (Date.now() - new Date(s.enteredAt).getTime()) / (1000 * 60 * 60 * 24)
          return days <= 30
        })

        // Time distribution by category
        const timeDistribution: Record<string, number> = {}
        const clickDistribution: Record<string, number> = {}
        const categories: EventCategory[] = [
          'lesson', 'trainer', 'theory', 'exam', 'flashcard',
          'dashboard', 'profile', 'leaderboard', 'shop', 'chat',
          'game', 'duel', 'marathon', 'adaptive', 'mistakes',
          'notification', 'auth', 'settings', 'other',
        ]
        categories.forEach(c => { timeDistribution[c] = 0; clickDistribution[c] = 0 })

        recentEvents.forEach(e => {
          if (e.duration) {
            timeDistribution[e.category] = (timeDistribution[e.category] || 0) + e.duration
          }
        })

        recentClicks.forEach(c => {
          clickDistribution[c.category] = (clickDistribution[c.category] || 0) + 1
        })

        // Also add page session durations to categories based on page name
        recentSessions.forEach(s => {
          const cat = pageToCategory(s.page)
          timeDistribution[cat] = (timeDistribution[cat] || 0) + (s.durationSeconds || 0)
        })

        // Find most/least active categories
        const timeEntries = Object.entries(timeDistribution).filter(([, v]) => v > 0)
        const mostActiveCategory = (timeEntries.sort((a, b) => b[1] - a[1])[0]?.[0] || 'other') as EventCategory
        const leastActiveCategory = (timeEntries.sort((a, b) => a[1] - b[1])[0]?.[0] || 'other') as EventCategory

        // Preferred learning time
        const hours = recentEvents.map(e => getHourOfDay(e.timestamp))
        const hourCounts: Record<string, number> = {}
        hours.forEach(h => {
          const cat = categorizeHour(h)
          hourCounts[cat] = (hourCounts[cat] || 0) + 1
        })
        const preferredLearningTime = (Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'mixed') as UserBehaviorProfile['preferredLearningTime']

        // Session frequency (unique days with events)
        const uniqueDays = new Set(recentEvents.map(e => e.timestamp.split('T')[0]))
        const sessionFrequency: UserBehaviorProfile['sessionFrequency'] =
          uniqueDays.size >= 20 ? 'daily' :
          uniqueDays.size >= 8 ? 'few_times_week' :
          uniqueDays.size >= 4 ? 'weekly' : 'rarely'

        // Average session duration
        const closedSessions = recentSessions.filter(s => s.durationSeconds > 0)
        const avgSessionDuration = closedSessions.length > 0
          ? Math.round(closedSessions.reduce((sum, s) => sum + s.durationSeconds, 0) / closedSessions.length)
          : 0

        // Top clicked elements
        const elementCounts: Record<string, number> = {}
        recentClicks.forEach(c => {
          const key = `${c.page}::${c.element}`
          elementCounts[key] = (elementCounts[key] || 0) + 1
        })
        const topClickedElements = Object.entries(elementCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([element, count]) => ({ element, count }))

        // Motivation signals
        const motivationSignals = {
          achievementDriven: 0,
          socialDriven: 0,
          explorationDriven: 0,
          competitionDriven: 0,
        }

        // Achievement signals: XP, levels, achievements, lesson completion
        motivationSignals.achievementDriven +=
          (clickDistribution['dashboard'] || 0) * 2 +
          (clickDistribution['profile'] || 0) * 1 +
          (timeDistribution['lesson'] || 0) * 0.5

        // Social signals: class, chat, leaderboard
        motivationSignals.socialDriven +=
          (clickDistribution['leaderboard'] || 0) * 2 +
          (clickDistribution['chat'] || 0) * 3 +
          (clickDistribution['duel'] || 0) * 1

        // Exploration signals: theory, new lessons, knowledge map
        motivationSignals.explorationDriven +=
          (clickDistribution['theory'] || 0) * 3 +
          (timeDistribution['theory'] || 0) * 0.5 +
          (timeDistribution['flashcard'] || 0) * 0.3

        // Competition signals: duels, leaderboard, games
        motivationSignals.competitionDriven +=
          (clickDistribution['duel'] || 0) * 3 +
          (clickDistribution['game'] || 0) * 2 +
          (clickDistribution['leaderboard'] || 0) * 2 +
          (clickDistribution['exam'] || 0) * 1

        // Normalize to 0-100
        const maxSignal = Math.max(...Object.values(motivationSignals), 1)
        for (const key of Object.keys(motivationSignals) as (keyof typeof motivationSignals)[]) {
          motivationSignals[key] = Math.round((motivationSignals[key] / maxSignal) * 100)
        }

        return {
          mostActiveCategory,
          leastActiveCategory,
          preferredLearningTime,
          sessionFrequency,
          avgSessionDuration,
          totalClicks: recentClicks.length,
          totalSessions: closedSessions.length,
          topClickedElements,
          timeDistribution: timeDistribution as Record<EventCategory, number>,
          clickDistribution: clickDistribution as Record<EventCategory, number>,
          motivationSignals,
        }
      },

      getTimeByCategory() {
        const { events, pageSessions } = get()
        const recentEvents = events.filter(e => {
          const days = (Date.now() - new Date(e.timestamp).getTime()) / (1000 * 60 * 60 * 24)
          return days <= 30
        })
        const recentSessions = pageSessions.filter(s => {
          const days = (Date.now() - new Date(s.enteredAt).getTime()) / (1000 * 60 * 60 * 24)
          return days <= 30
        })

        const byCategory: Record<string, { totalSeconds: number; sessionCount: number }> = {}

        recentEvents.forEach(e => {
          if (e.duration) {
            if (!byCategory[e.category]) byCategory[e.category] = { totalSeconds: 0, sessionCount: 0 }
            byCategory[e.category].totalSeconds += e.duration
            byCategory[e.category].sessionCount++
          }
        })

        recentSessions.forEach(s => {
          const cat = pageToCategory(s.page)
          if (!byCategory[cat]) byCategory[cat] = { totalSeconds: 0, sessionCount: 0 }
          byCategory[cat].totalSeconds += s.durationSeconds || 0
          byCategory[cat].sessionCount++
        })

        return Object.entries(byCategory).map(([category, data]) => ({
          category: category as EventCategory,
          totalSeconds: data.totalSeconds,
          sessionCount: data.sessionCount,
          avgDuration: data.sessionCount > 0 ? Math.round(data.totalSeconds / data.sessionCount) : 0,
        })).sort((a, b) => b.totalSeconds - a.totalSeconds)
      },

      getClicksByCategory() {
        const { clickEvents } = get()
        const recentClicks = clickEvents.filter(c => {
          const days = (Date.now() - new Date(c.timestamp).getTime()) / (1000 * 60 * 60 * 24)
          return days <= 30
        })

        const byCategory: Record<string, { clicks: ClickEvent[]; elementCounts: Record<string, number> }> = {}

        recentClicks.forEach(c => {
          if (!byCategory[c.category]) byCategory[c.category] = { clicks: [], elementCounts: {} }
          byCategory[c.category].clicks.push(c)
          byCategory[c.category].elementCounts[c.element] = (byCategory[c.category].elementCounts[c.element] || 0) + 1
        })

        return Object.entries(byCategory).map(([category, data]) => {
          const topElements = Object.entries(data.elementCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([element, count]) => ({ element, count }))
          return {
            category: category as EventCategory,
            clickCount: data.clicks.length,
            uniqueElements: Object.keys(data.elementCounts).length,
            topElements,
          }
        }).sort((a, b) => b.clickCount - a.clickCount)
      },

      getEventsForPeriod(days) {
        const { events } = get()
        return events.filter(e => {
          const d = (Date.now() - new Date(e.timestamp).getTime()) / (1000 * 60 * 60 * 24)
          return d <= days
        })
      },

      getDailySnapshot(date) {
        const { dailySnapshots } = get()
        return dailySnapshots.find(s => s.date === date)
      },

      takeSnapshot() {
        const today = new Date().toISOString().split('T')[0]
        const bp = get().getBehaviorProfile()
        const timeByCat = get().getTimeByCategory()
        const clicksByCat = get().getClicksByCategory()
        const events = get().getEventsForPeriod(1)
        
        const totalTime = timeByCat.reduce((sum, t) => sum + t.totalSeconds, 0)
        const totalClicks = clicksByCat.reduce((sum, c) => sum + c.clickCount, 0)
        const totalSessions = timeByCat.reduce((sum, t) => sum + t.sessionCount, 0)
        
        const timeDistribution: Record<string, number> = {}
        timeByCat.forEach(t => { timeDistribution[t.category] = t.totalSeconds })
        
        const clickDistribution: Record<string, number> = {}
        clicksByCat.forEach(c => { clickDistribution[c.category] = c.clickCount })
        
        const lessonsCompleted = events.filter(e => e.category === 'lesson' && e.action === 'complete').length
        const xpEarned = events.filter(e => e.category === 'lesson').reduce((sum, e) => sum + (e.value || 0), 0)

        const snapshot: DailySnapshot = {
          date: today,
          totalSessions,
          totalClicks,
          totalTimeSeconds: totalTime,
          lessonsCompleted,
          xpEarned,
          timeDistribution,
          clickDistribution,
          motivationSignals: bp.motivationSignals,
        }

        set((state) => {
          const existing = state.dailySnapshots.findIndex(s => s.date === today)
          const snapshots = [...state.dailySnapshots]
          if (existing >= 0) {
            snapshots[existing] = snapshot
          } else {
            snapshots.push(snapshot)
          }
          return { dailySnapshots: snapshots.slice(-90) } // keep 90 days
        })
      },

      getTrends(days) {
        const { dailySnapshots } = get()
        const now = new Date()
        const dates: string[] = []
        const sessions: number[] = []
        const clicks: number[] = []
        const timeMinutes: number[] = []
        const accuracy: number[] = []
        const xp: number[] = []
        const motivationAchievement: number[] = []
        const motivationSocial: number[] = []
        const motivationExploration: number[] = []
        const motivationCompetition: number[] = []

        for (let i = days - 1; i >= 0; i--) {
          const d = new Date(now)
          d.setDate(d.getDate() - i)
          const dateStr = d.toISOString().split('T')[0]
          dates.push(dateStr)
          
          const snap = dailySnapshots.find(s => s.date === dateStr)
          if (snap) {
            sessions.push(snap.totalSessions)
            clicks.push(snap.totalClicks)
            timeMinutes.push(Math.round(snap.totalTimeSeconds / 60))
            accuracy.push(snap.accuracy || 0)
            xp.push(snap.xpEarned)
            motivationAchievement.push(snap.motivationSignals.achievementDriven)
            motivationSocial.push(snap.motivationSignals.socialDriven)
            motivationExploration.push(snap.motivationSignals.explorationDriven)
            motivationCompetition.push(snap.motivationSignals.competitionDriven)
          } else {
            sessions.push(0)
            clicks.push(0)
            timeMinutes.push(0)
            accuracy.push(0)
            xp.push(0)
            motivationAchievement.push(0)
            motivationSocial.push(0)
            motivationExploration.push(0)
            motivationCompetition.push(0)
          }
        }

        return { dates, sessions, clicks, timeMinutes, accuracy, xp, motivationAchievement, motivationSocial, motivationExploration, motivationCompetition }
      },

      getAlerts() {
        const { pageSessions, clickEvents, dailySnapshots } = get()
        const alerts: TeacherAlert[] = []
        const now = new Date().toISOString().split('T')[0]

        // Check last activity
        const lastSession = pageSessions[pageSessions.length - 1]
        if (lastSession) {
          const daysSince = (Date.now() - new Date(lastSession.enteredAt).getTime()) / (1000 * 60 * 60 * 24)
          if (daysSince > 3) {
            alerts.push({
              id: generateId(),
              type: 'risk',
              severity: daysSince > 7 ? 'high' : 'medium',
              title: daysSince > 7 ? 'Давно не заходил' : 'Несколько дней без занятий',
              message: `Последняя активность ${Math.round(daysSince)} дней назад.`,
              date: now,
            })
          }
        }

        // Check motivation shift
        if (dailySnapshots.length >= 2) {
          const latest = dailySnapshots[dailySnapshots.length - 1]
          const prev = dailySnapshots[dailySnapshots.length - 2]
          const totalLatest = Object.values(latest.motivationSignals).reduce((a, b) => a + b, 0)
          const totalPrev = Object.values(prev.motivationSignals).reduce((a, b) => a + b, 0)
          
          if (totalLatest > 0 && totalPrev > 0) {
            const diff = Math.abs(totalLatest - totalPrev) / Math.max(totalLatest, totalPrev)
            if (diff > 0.3) {
              alerts.push({
                id: generateId(),
                type: 'behavior',
                severity: 'low',
                title: 'Изменение мотивации',
                message: 'Заметен сдвиг в мотивационном профиле.',
                date: now,
              })
            }
          }
        }

        // Check drop in activity
        if (dailySnapshots.length >= 7) {
          const lastWeek = dailySnapshots.slice(-7)
          const avgSessions = lastWeek.reduce((sum, s) => sum + s.totalSessions, 0) / 7
          const prevWeek = dailySnapshots.slice(-14, -7)
          const avgPrev = prevWeek.length > 0 ? prevWeek.reduce((sum, s) => sum + s.totalSessions, 0) / prevWeek.length : 0
          
          if (avgPrev > 0 && avgSessions < avgPrev * 0.5) {
            alerts.push({
              id: generateId(),
              type: 'trend',
              severity: 'medium',
              title: 'Падение активности',
              message: `Активность упала на ${Math.round((1 - avgSessions / avgPrev) * 100)}% по сравнению с прошлой неделей.`,
              date: now,
            })
          }
        }

        return alerts.sort((a, b) => {
          const severityOrder = { high: 0, medium: 1, low: 2 }
          return severityOrder[a.severity] - severityOrder[b.severity]
        })
      },

      getRecommendations() {
        const bp = get().getBehaviorProfile()
        const alerts = get().getAlerts()
        const recs: TeacherRecommendation[] = []
        const now = new Date().toISOString().split('T')[0]

        // Motivation-based recommendations
        const maxSignal = Math.max(
          bp.motivationSignals.achievementDriven,
          bp.motivationSignals.socialDriven,
          bp.motivationSignals.explorationDriven,
          bp.motivationSignals.competitionDriven
        )
        const dominant = Object.entries(bp.motivationSignals).find(([, v]) => v === maxSignal)?.[0]

        if (dominant === 'achievementDriven') {
          recs.push({
            id: generateId(),
            category: 'motivation',
            priority: 'medium',
            title: 'Фокус на достижениях',
            description: 'Ученик мотивируется XP и наградами.',
            action: 'Добавьте больше достижений и чётких целей.',
            date: now,
          })
        } else if (dominant === 'socialDriven') {
          recs.push({
            id: generateId(),
            category: 'motivation',
            priority: 'medium',
            title: 'Социальное обучение',
            description: 'Ученик мотивируется общением.',
            action: 'Вовлеките в групповые задания и классный чат.',
            date: now,
          })
        } else if (dominant === 'explorationDriven') {
          recs.push({
            id: generateId(),
            category: 'content',
            priority: 'medium',
            title: 'Новые темы',
            description: 'Ученик любит исследовать.',
            action: 'Предложите бонусные материалы и карту курса.',
            date: now,
          })
        } else if (dominant === 'competitionDriven') {
          recs.push({
            id: generateId(),
            category: 'engagement',
            priority: 'medium',
            title: 'Соревнования',
            description: 'Ученик любит конкуренцию.',
            action: 'Организуйте дуэли и турниры в классе.',
            date: now,
          })
        }

        // Risk-based recommendations
        const riskAlerts = alerts.filter(a => a.type === 'risk')
        if (riskAlerts.length > 0) {
          recs.push({
            id: generateId(),
            category: 'risk',
            priority: 'high',
            title: 'Требуется внимание',
            description: 'Ученик давно не проявлял активности.',
            action: 'Свяжитесь с учеником, выясните причины пропусков.',
            date: now,
          })
        }

        // Low engagement recommendations
        if (bp.totalSessions < 5) {
          recs.push({
            id: generateId(),
            category: 'engagement',
            priority: 'high',
            title: 'Низкая вовлечённость',
            description: 'Мало сессий за последние 30 дней.',
            action: 'Предложите короткие ежедневные задания для формирования привычки.',
            date: now,
          })
        }

        return recs.sort((a, b) => {
          const priorityOrder = { high: 0, medium: 1, low: 2 }
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        })
      },

      trimOldEvents(keepDays = 30) {
        const cutoff = Date.now() - keepDays * 24 * 60 * 60 * 1000
        set((state) => ({
          events: state.events.filter(e => new Date(e.timestamp).getTime() > cutoff),
          clickEvents: state.clickEvents.filter(c => new Date(c.timestamp).getTime() > cutoff),
          pageSessions: state.pageSessions.filter(s => new Date(s.enteredAt).getTime() > cutoff),
          lastEventTrim: new Date().toISOString(),
        }))
      },

      clearAnalytics() {
        set({ events: [], pageSessions: [], clickEvents: [], dailySnapshots: [], lastEventTrim: new Date().toISOString() })
      },
    }),
    {
      name: 'ege-analytics-storage',
    }
  )
)

function pageToCategory(page: string): EventCategory {
  const p = page.toLowerCase()
  if (p.includes('lesson')) return 'lesson'
  if (p.includes('trainer') || p.includes('task') || p.includes('accent')) return 'trainer'
  if (p.includes('theory')) return 'theory'
  if (p.includes('exam') || p.includes('variant')) return 'exam'
  if (p.includes('flashcard')) return 'flashcard'
  if (p.includes('dashboard') || p.includes('today')) return 'dashboard'
  if (p.includes('profile')) return 'profile'
  if (p.includes('leaderboard')) return 'leaderboard'
  if (p.includes('shop')) return 'shop'
  if (p.includes('chat')) return 'chat'
  if (p.includes('game') || p.includes('mini')) return 'game'
  if (p.includes('duel')) return 'duel'
  if (p.includes('marathon')) return 'marathon'
  if (p.includes('adaptive') || p.includes('practice')) return 'adaptive'
  if (p.includes('mistake') || p.includes('error') || p.includes('weak')) return 'mistakes'
  if (p.includes('notification')) return 'notification'
  if (p.includes('auth') || p.includes('login')) return 'auth'
  if (p.includes('setting')) return 'settings'
  return 'other'
}

export { pageToCategory }

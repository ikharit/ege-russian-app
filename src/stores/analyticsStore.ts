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
  trimOldEvents: (keepDays?: number) => void
  clearAnalytics: () => void
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
        set({ events: [], pageSessions: [], clickEvents: [], lastEventTrim: new Date().toISOString() })
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

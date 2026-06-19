import { UserStats } from '../../types'

export const getInitialStats = (): UserStats => ({
  xp: 0,
  level: 1,
  streak: 0,
  maxStreak: 0,
  lastActivityDate: '',
  hearts: 5,
  maxHearts: 5,
  achievements: [],
  name: 'ученик',
  lastHeartRestore: '',
  infiniteHearts: false,
  totalLessonTimeMinutes: 0,
  totalQuestionsAnswered: 0,
  totalHeartsLost: 0,
  mistakesFixed: 0,
  currentCombo: 0,
  maxCombo: 0,
  emotionalState: {
    recentAccuracy: 0,
    sessionDuration: 0,
    errorsInRow: 0,
    successesInRow: 0,
    lastVisit: '',
  },
})

const getToday = () => new Date().toISOString().split('T')[0]

const daysBetween = (a: string, b: string): number => {
  const d1 = new Date(a)
  const d2 = new Date(b)
  return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24))
}

function getYesterday(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

export function createUserActions(set: any, get: any) {
  return {
    checkHeartRestore: () => {
      set((s: any) => {
        const last = s.userStats.lastHeartRestore || s.userStats.lastActivityDate
        if (!last || s.userStats.hearts >= s.userStats.maxHearts) return {}

        const now = new Date()
        const lastDate = new Date(last)
        const minutesPassed = (now.getTime() - lastDate.getTime()) / (1000 * 60)
        const restored = Math.floor(minutesPassed / 240)

        if (restored <= 0) return {}

        const newHearts = Math.min(s.userStats.maxHearts, s.userStats.hearts + restored)
        return {
          userStats: {
            ...s.userStats,
            hearts: newHearts,
            lastHeartRestore: now.toISOString()
          }
        }
      })
    },

    setUserName: (name: string) => {
      set((s: any) => ({
        userStats: { ...s.userStats, name }
      }))
    },

    toggleInfiniteHearts: () => {
      set((s: any) => ({
        userStats: { ...s.userStats, infiniteHearts: !s.userStats.infiniteHearts }
      }))
    },

    recordQuestionAnswered: () => {
      set((s: any) => {
        const newCombo = (s.userStats.currentCombo || 0) + 1
        return {
          userStats: {
            ...s.userStats,
            totalQuestionsAnswered: (s.userStats.totalQuestionsAnswered || 0) + 1,
            currentCombo: newCombo,
            maxCombo: Math.max(s.userStats.maxCombo || 0, newCombo)
          }
        }
      })
    },

    resetCombo: () => {
      set((s: any) => ({
        userStats: {
          ...s.userStats,
          currentCombo: 0
        }
      }))
    },

    addXP: (amount: number) => {
      set((s: any) => {
        const newXP = s.userStats.xp + amount
        const newLevel = Math.floor(newXP / 100) + 1
        return {
          userStats: {
            ...s.userStats,
            xp: newXP,
            level: newLevel
          }
        }
      })
    },

    loseHeart: () => {
      const state = get()
      if (state.userStats.hearts <= 0) return false
      set((s: any) => ({
        userStats: { 
          ...s.userStats, 
          hearts: s.userStats.hearts - 1,
          totalHeartsLost: (s.userStats.totalHeartsLost || 0) + 1
        },
        currentLessonHeartsLost: s.currentLessonHeartsLost + 1
      }))
      return true
    },

    restoreHearts: () => {
      set((s: any) => ({
        userStats: { ...s.userStats, hearts: s.userStats.maxHearts },
        heartRestoreCount: s.heartRestoreCount + 1
      }))
    },

    updateStreak: () => {
      const today = getToday()
      set((s: any) => {
        const last = s.userStats.lastActivityDate
        let newStreak = s.userStats.streak
        let streakFrozen = s.userStats.streakFrozen || false
        let streakFreezeUsed = s.userStats.streakFreezeUsed || 0
        let streakFreezeLastReset = s.userStats.streakFreezeLastReset || ''

        if (streakFreezeLastReset && daysBetween(streakFreezeLastReset, today) >= 7) {
          streakFreezeUsed = 0
          streakFreezeLastReset = today
        }

        if (last === today) {
          // Already studied today
        } else if (last === getYesterday()) {
          newStreak += 1
          streakFrozen = false
        } else {
          if (streakFreezeUsed < 1) {
            streakFrozen = true
            streakFreezeUsed += 1
            streakFreezeLastReset = streakFreezeLastReset || today
          } else {
            newStreak = 1
            streakFrozen = false
          }
        }
        return {
          userStats: {
            ...s.userStats,
            streak: newStreak,
            maxStreak: Math.max(s.userStats.maxStreak, newStreak),
            lastActivityDate: today,
            streakFrozen,
            streakFreezeUsed,
            streakFreezeLastReset
          }
        }
      })
    },
  }
}

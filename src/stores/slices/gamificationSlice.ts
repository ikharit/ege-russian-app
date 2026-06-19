import { dailyQuests } from '../../data/dailyQuests'

const getToday = () => new Date().toISOString().split('T')[0]

export interface LeaderboardEntry {
  id: string
  name: string
  avatar: string
  xp: number
  level: number
  streak: number
  lessonsCompleted: number
  updatedAt: string
  achievements?: string[]
}

export interface TeacherStudent {
  id: string
  name: string
  lastActive: string
  lessonsCompleted: number
  totalAttempts: number
  averageScore: number
  weakTopics: string[]
}

const defaultLeaderboard: LeaderboardEntry[] = [
  { id: '1', name: 'Анна М.', avatar: '👩‍🎓', xp: 450, level: 5, streak: 7, lessonsCompleted: 12, updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '2', name: 'Дмитрий К.', avatar: '👨‍🎓', xp: 380, level: 4, streak: 5, lessonsCompleted: 10, updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '3', name: 'Мария С.', avatar: '👩‍🎓', xp: 320, level: 4, streak: 3, lessonsCompleted: 9, updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '4', name: 'Иван П.', avatar: '👨‍🎓', xp: 290, level: 3, streak: 4, lessonsCompleted: 8, updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '5', name: 'Елена В.', avatar: '👩‍🎓', xp: 250, level: 3, streak: 2, lessonsCompleted: 7, updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '6', name: 'Алексей Н.', avatar: '👨‍🎓', xp: 210, level: 3, streak: 1, lessonsCompleted: 6, updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '7', name: 'Ольга Р.', avatar: '👩‍🎓', xp: 180, level: 2, streak: 3, lessonsCompleted: 5, updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '8', name: 'Павел Д.', avatar: '👨‍🎓', xp: 150, level: 2, streak: 0, lessonsCompleted: 4, updatedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString() },
]

const defaultTeacherStudents: TeacherStudent[] = [
  { id: 's1', name: 'Анна М.', lastActive: '2025-01-15', lessonsCompleted: 12, totalAttempts: 45, averageScore: 78, weakTopics: ['Задание 19', 'Задание 17'] },
  { id: 's2', name: 'Дмитрий К.', lastActive: '2025-01-14', lessonsCompleted: 10, totalAttempts: 38, averageScore: 72, weakTopics: ['Задание 13', 'Задание 14'] },
  { id: 's3', name: 'Мария С.', lastActive: '2025-01-15', lessonsCompleted: 9, totalAttempts: 30, averageScore: 85, weakTopics: ['Задание 16'] },
  { id: 's4', name: 'Иван П.', lastActive: '2025-01-13', lessonsCompleted: 8, totalAttempts: 28, averageScore: 68, weakTopics: ['Задание 20', 'Задание 12'] },
  { id: 's5', name: 'Елена В.', lastActive: '2025-01-15', lessonsCompleted: 7, totalAttempts: 22, averageScore: 75, weakTopics: ['Задание 9'] },
]

export function createGamificationActions(set: any, get: any) {
  return {
    clearLastAchievement: () => {
      set({ lastUnlockedAchievement: null })
    },

    addLeaderboardEntry: (entry: LeaderboardEntry) => {
      set((s: any) => ({
        leaderboard: [...s.leaderboard.filter((e: LeaderboardEntry) => e.id !== entry.id), entry]
          .sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.xp - a.xp)
      }))
    },

    getLeaderboard: () => {
      return get().leaderboard
    },

    checkLeaderboardRanks: () => {
      const state = get()
      const all = [...state.leaderboard, {
        id: 'me',
        name: 'Вы',
        avatar: '🎓',
        xp: state.userStats.xp,
        level: state.userStats.level,
        streak: state.userStats.streak,
        lessonsCompleted: Object.values(state.lessonProgress).filter((l: any) => l.status === 'completed').length,
        updatedAt: state.userStats.lastActivityDate || new Date().toISOString()
      }]
      const sortedByXP = [...all].sort((a, b) => b.xp - a.xp)
      const myIndex = sortedByXP.findIndex(e => e.id === 'me')
      const myRank = myIndex >= 0 ? myIndex + 1 : -1

      const newRanks = new Set(state.leaderboardRanks)
      if (myRank === 1) newRanks.add('rank-1-all')
      if (myRank === 2) newRanks.add('rank-2')
      if (myRank === 3) newRanks.add('rank-3')

      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      const weekActive = all.filter(e => new Date(e.updatedAt) >= weekAgo)
      const monthActive = all.filter(e => new Date(e.updatedAt) >= monthAgo)

      const weekSorted = [...weekActive].sort((a, b) => b.xp - a.xp)
      const monthSorted = [...monthActive].sort((a, b) => b.xp - a.xp)

      if (weekSorted.length > 0 && weekSorted[0]?.id === 'me') newRanks.add('rank-1-week')
      if (monthSorted.length > 0 && monthSorted[0]?.id === 'me') newRanks.add('rank-1-month')

      const ranksArr = Array.from(newRanks)
      if (ranksArr.length !== state.leaderboardRanks.length || !ranksArr.every(r => state.leaderboardRanks.includes(r))) {
        set({ leaderboardRanks: ranksArr })
      }
    },

    setTeacherMode: (isTeacher: boolean) => {
      set({ isTeacher })
    },

    addStudent: (student: TeacherStudent) => {
      set((s: any) => ({
        teacherStudents: [...s.teacherStudents.filter((st: TeacherStudent) => st.id !== student.id), student]
      }))
    },

    getStudentStats: (studentId: string) => {
      return get().teacherStudents.find((s: TeacherStudent) => s.id === studentId)
    },

    getDailyQuests: () => {
      return get().dailyQuestProgress
    },

    updateQuestProgress: (questId: string, amount = 1) => {
      const today = getToday()
      set((s: any) => {
        const existing = s.dailyQuestProgress[questId]
        if (existing && existing.date !== today) {
          return {
            dailyQuestProgress: {
              ...s.dailyQuestProgress,
              [questId]: { current: amount, completed: false, claimed: false, date: today }
            }
          }
        }
        const newCurrent = (existing?.current || 0) + amount
        return {
          dailyQuestProgress: {
            ...s.dailyQuestProgress,
            [questId]: {
              current: newCurrent,
              completed: existing?.completed || false,
              claimed: existing?.claimed || false,
              date: today
            }
          }
        }
      })
    },

    claimQuestReward: (questId: string) => {
      const state = get()
      const quest = state.dailyQuestProgress[questId]
      if (!quest || !quest.completed || quest.claimed) return false
      
      const questDef = dailyQuests.find((q: any) => q.id === questId)
      if (!questDef) return false

      set((s: any) => ({
        dailyQuestProgress: {
          ...s.dailyQuestProgress,
          [questId]: { ...quest, claimed: true }
        }
      }))
      get().addXP(questDef.rewardXP)
      return true
    },

    resetDailyQuests: () => {
      set({ dailyQuestProgress: {} })
    },

    setActiveStatus: (statusId: string) => {
      set((s: any) => ({
        userStats: { ...s.userStats, activeStatus: statusId }
      }))
    },
  }
}

export { defaultLeaderboard, defaultTeacherStudents }

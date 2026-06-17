import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserStats, LessonProgress, Achievement, UserAtomProgress } from '../types'
import { achievements as allAchievements } from '../data/courseData'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

interface LeaderboardEntry {
  id: string
  name: string
  avatar: string
  xp: number
  level: number
  streak: number
  lessonsCompleted: number
}

interface TeacherStudent {
  id: string
  name: string
  lastActive: string
  lessonsCompleted: number
  totalAttempts: number
  averageScore: number
  weakTopics: string[]
}

interface ProgressState {
  userStats: UserStats
  lessonProgress: Record<string, LessonProgress>
  atomProgress: Record<string, UserAtomProgress>
  achievements: string[]
  lastUnlockedAchievement: string | null
  currentLessonId: string | null
  leaderboard: LeaderboardEntry[]
  teacherStudents: TeacherStudent[]
  isTeacher: boolean
  userId: string | null

  // Actions
  startLesson: (lessonId: string) => void
  completeLesson: (lessonId: string, score: number, xpEarned: number) => void
  loseHeart: () => boolean
  restoreHearts: () => void
  addXP: (amount: number) => void
  checkAchievements: () => string[]
  updateStreak: () => void
  getLessonProgress: (lessonId: string) => LessonProgress
  isLessonAvailable: (lessonId: string, prerequisites: string[]) => boolean
  // Atom tracking
  recordAtomAttempt: (atomId: string, isCorrect: boolean) => void
  getAtomProgress: (atomId: string) => UserAtomProgress
  getWeakAtoms: (threshold?: number) => string[]
  // Achievement toast
  clearLastAchievement: () => void
  // Leaderboard
  addLeaderboardEntry: (entry: LeaderboardEntry) => void
  getLeaderboard: () => LeaderboardEntry[]
  // Teacher
  setTeacherMode: (isTeacher: boolean) => void
  addStudent: (student: TeacherStudent) => void
  getStudentStats: (studentId: string) => TeacherStudent | undefined
  // Supabase
  setUserId: (userId: string | null) => void
  syncProgress: () => Promise<void>
  loadProgress: () => Promise<void>
  checkHeartRestore: () => void
  setUserName: (name: string) => void
  toggleInfiniteHearts: () => void
}

const getToday = () => new Date().toISOString().split('T')[0]

const getInitialStats = (): UserStats => ({
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
  infiniteHearts: false
})

const defaultLeaderboard: LeaderboardEntry[] = [
  { id: '1', name: 'Анна М.', avatar: '👩‍🎓', xp: 450, level: 5, streak: 7, lessonsCompleted: 12 },
  { id: '2', name: 'Дмитрий К.', avatar: '👨‍🎓', xp: 380, level: 4, streak: 5, lessonsCompleted: 10 },
  { id: '3', name: 'Мария С.', avatar: '👩‍🎓', xp: 320, level: 4, streak: 3, lessonsCompleted: 9 },
  { id: '4', name: 'Иван П.', avatar: '👨‍🎓', xp: 290, level: 3, streak: 4, lessonsCompleted: 8 },
  { id: '5', name: 'Елена В.', avatar: '👩‍🎓', xp: 250, level: 3, streak: 2, lessonsCompleted: 7 },
  { id: '6', name: 'Алексей Н.', avatar: '👨‍🎓', xp: 210, level: 3, streak: 1, lessonsCompleted: 6 },
  { id: '7', name: 'Ольга Р.', avatar: '👩‍🎓', xp: 180, level: 2, streak: 3, lessonsCompleted: 5 },
  { id: '8', name: 'Павел Д.', avatar: '👨‍🎓', xp: 150, level: 2, streak: 0, lessonsCompleted: 4 },
]

const defaultTeacherStudents: TeacherStudent[] = [
  { id: 's1', name: 'Анна М.', lastActive: '2025-01-15', lessonsCompleted: 12, totalAttempts: 45, averageScore: 78, weakTopics: ['Задание 19', 'Задание 17'] },
  { id: 's2', name: 'Дмитрий К.', lastActive: '2025-01-14', lessonsCompleted: 10, totalAttempts: 38, averageScore: 72, weakTopics: ['Задание 13', 'Задание 14'] },
  { id: 's3', name: 'Мария С.', lastActive: '2025-01-15', lessonsCompleted: 9, totalAttempts: 30, averageScore: 85, weakTopics: ['Задание 16'] },
  { id: 's4', name: 'Иван П.', lastActive: '2025-01-13', lessonsCompleted: 8, totalAttempts: 28, averageScore: 68, weakTopics: ['Задание 20', 'Задание 12'] },
  { id: 's5', name: 'Елена В.', lastActive: '2025-01-15', lessonsCompleted: 7, totalAttempts: 22, averageScore: 75, weakTopics: ['Задание 9'] },
]

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      userStats: getInitialStats(),
      lessonProgress: {},
      atomProgress: {},
      achievements: [],
      lastUnlockedAchievement: null,
      currentLessonId: null,
      leaderboard: defaultLeaderboard,
      teacherStudents: defaultTeacherStudents,
      isTeacher: false,
      userId: null,

      setUserId: (userId) => set({ userId }),

      syncProgress: async () => {
        const { userId, userStats, lessonProgress, achievements } = get()
        if (!userId || !isSupabaseConfigured) return
        await supabase.from('user_progress').upsert({
          user_id: userId,
          user_stats: userStats,
          lesson_progress: lessonProgress,
          achievements,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
      },

      loadProgress: async () => {
        const { userId } = get()
        if (!userId || !isSupabaseConfigured) return
        const { data } = await supabase.from('user_progress').select('*').eq('user_id', userId).single()
        if (data) {
          set({
            userStats: data.user_stats || getInitialStats(),
            lessonProgress: data.lesson_progress || {},
            achievements: data.achievements || []
          })
        }
      },

      checkHeartRestore: () => {
        set((s) => {
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
        set((s) => ({
          userStats: { ...s.userStats, name }
        }))
      },

      toggleInfiniteHearts: () => {
        set((s) => ({
          userStats: { ...s.userStats, infiniteHearts: !s.userStats.infiniteHearts }
        }))
      },

      startLesson: (lessonId) => {
        set((state) => ({
          currentLessonId: lessonId,
          lessonProgress: {
            ...state.lessonProgress,
            [lessonId]: {
              ...state.lessonProgress[lessonId],
              lessonId,
              status: 'started',
              score: state.lessonProgress[lessonId]?.score || 0,
              bestScore: state.lessonProgress[lessonId]?.bestScore || 0,
              attempts: (state.lessonProgress[lessonId]?.attempts || 0) + 1,
              xpEarned: state.lessonProgress[lessonId]?.xpEarned || 0,
            }
          }
        }))
      },

      completeLesson: (lessonId, score, xpEarned) => {
        const state = get()
        const existing = state.lessonProgress[lessonId]
        const newBestScore = existing?.bestScore ? Math.max(existing.bestScore, score) : score

        set((s) => ({
          lessonProgress: {
            ...s.lessonProgress,
            [lessonId]: {
              lessonId,
              status: 'completed',
              score,
              bestScore: newBestScore,
              attempts: (existing?.attempts || 0) + 1,
              xpEarned: (existing?.xpEarned || 0) + xpEarned,
              completedAt: new Date().toISOString()
            }
          }
        }))

        get().addXP(xpEarned)
        get().updateStreak()
        const newAchievements = get().checkAchievements()
        if (newAchievements.length > 0) {
          set((s) => ({
            achievements: [...new Set([...s.achievements, ...newAchievements])],
            lastUnlockedAchievement: newAchievements[0],
            userStats: {
              ...s.userStats,
              achievements: [...new Set([...s.userStats.achievements, ...newAchievements])]
            }
          }))
        }
      },

      loseHeart: () => {
        const state = get()
        if (state.userStats.hearts <= 0) return false
        set((s) => ({
          userStats: { ...s.userStats, hearts: s.userStats.hearts - 1 }
        }))
        return true
      },

      restoreHearts: () => {
        set((s) => ({
          userStats: { ...s.userStats, hearts: s.userStats.maxHearts }
        }))
      },

      addXP: (amount) => {
        set((s) => {
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

      checkAchievements: () => {
        const state = get()
        const unlocked: string[] = []
        const completedLessons = Object.values(state.lessonProgress).filter(l => l.status === 'completed')
        const completedCount = completedLessons.length
        const xp = state.userStats.xp
        const streak = state.userStats.streak
        const level = state.userStats.level
        const currentAchs = state.achievements

        // Lessons
        if (completedCount >= 1 && !currentAchs.includes('ach-first-lesson')) unlocked.push('ach-first-lesson')
        if (completedCount >= 5 && !currentAchs.includes('ach-lessons-5')) unlocked.push('ach-lessons-5')
        if (completedCount >= 10 && !currentAchs.includes('ach-lessons-10')) unlocked.push('ach-lessons-10')
        if (completedCount >= 25 && !currentAchs.includes('ach-lessons-25')) unlocked.push('ach-lessons-25')
        if (completedCount >= 50 && !currentAchs.includes('ach-lessons-50')) unlocked.push('ach-lessons-50')

        // Streak
        if (streak >= 3 && !currentAchs.includes('ach-streak-3')) unlocked.push('ach-streak-3')
        if (streak >= 7 && !currentAchs.includes('ach-streak-7')) unlocked.push('ach-streak-7')
        if (streak >= 14 && !currentAchs.includes('ach-streak-14')) unlocked.push('ach-streak-14')
        if (streak >= 30 && !currentAchs.includes('ach-streak-30')) unlocked.push('ach-streak-30')

        // XP
        if (xp >= 100 && !currentAchs.includes('ach-xp-100')) unlocked.push('ach-xp-100')
        if (xp >= 500 && !currentAchs.includes('ach-xp-500')) unlocked.push('ach-xp-500')
        if (xp >= 1000 && !currentAchs.includes('ach-xp-1000')) unlocked.push('ach-xp-1000')
        if (xp >= 5000 && !currentAchs.includes('ach-xp-5000')) unlocked.push('ach-xp-5000')

        // Levels
        if (level >= 5 && !currentAchs.includes('ach-level-5')) unlocked.push('ach-level-5')
        if (level >= 10 && !currentAchs.includes('ach-level-10')) unlocked.push('ach-level-10')
        if (level >= 20 && !currentAchs.includes('ach-level-20')) unlocked.push('ach-level-20')

        // Perfect lessons
        const perfectCount = completedLessons.filter(l => l.score === 100).length
        if (perfectCount >= 1 && !currentAchs.includes('ach-perfect')) unlocked.push('ach-perfect')
        if (perfectCount >= 5 && !currentAchs.includes('ach-perfect-5')) unlocked.push('ach-perfect-5')
        if (perfectCount >= 10 && !currentAchs.includes('ach-perfect-10')) unlocked.push('ach-perfect-10')

        // Infinite hearts
        if (state.userStats.infiniteHearts && !currentAchs.includes('ach-infinite')) unlocked.push('ach-infinite')

        // Set last unlocked for toast notification
        if (unlocked.length > 0) {
          // Don't set here — caller will handle it to avoid race condition
        }

        return unlocked
      },

      updateStreak: () => {
        const today = getToday()
        set((s) => {
          const last = s.userStats.lastActivityDate
          let newStreak = s.userStats.streak
          if (last === today) {
            // Already studied today
          } else if (last === getYesterday()) {
            newStreak += 1
          } else {
            newStreak = 1
          }
          return {
            userStats: {
              ...s.userStats,
              streak: newStreak,
              maxStreak: Math.max(s.userStats.maxStreak, newStreak),
              lastActivityDate: today
            }
          }
        })
      },

      getLessonProgress: (lessonId) => {
        return get().lessonProgress[lessonId] || {
          lessonId,
          status: 'locked',
          score: 0,
          bestScore: 0,
          attempts: 0,
          xpEarned: 0
        }
      },

      isLessonAvailable: (lessonId, prerequisites) => {
        const progress = get().lessonProgress
        if (prerequisites.length === 0) return true
        return prerequisites.every(prId => progress[prId]?.status === 'completed')
      },

      recordAtomAttempt: (atomId, isCorrect) => {
        set((s) => {
          const existing = s.atomProgress[atomId]
          const total = (existing?.totalAttempts || 0) + 1
          const correct = (existing?.correctCount || 0) + (isCorrect ? 1 : 0)
          const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
          let mastery: 'new' | 'learning' | 'review' | 'mastered' = 'new'
          if (total >= 10 && accuracy >= 90) mastery = 'mastered'
          else if (total >= 5 && accuracy >= 70) mastery = 'review'
          else if (total >= 1) mastery = 'learning'

          return {
            atomProgress: {
              ...s.atomProgress,
              [atomId]: {
                atomId,
                totalAttempts: total,
                correctCount: correct,
                accuracy,
                lastAttemptAt: new Date().toISOString(),
                masteryLevel: mastery,
              }
            }
          }
        })
      },

      getAtomProgress: (atomId) => {
        return get().atomProgress[atomId] || {
          atomId,
          totalAttempts: 0,
          correctCount: 0,
          accuracy: 0,
          lastAttemptAt: '',
          masteryLevel: 'new',
        }
      },

      getWeakAtoms: (threshold = 70) => {
        return Object.values(get().atomProgress)
          .filter(p => p.accuracy > 0 && p.accuracy < threshold)
          .sort((a, b) => a.accuracy - b.accuracy)
          .map(p => p.atomId)
      },

      clearLastAchievement: () => {
        set({ lastUnlockedAchievement: null })
      },

      addLeaderboardEntry: (entry) => {
        set((s) => ({
          leaderboard: [...s.leaderboard.filter(e => e.id !== entry.id), entry]
            .sort((a, b) => b.xp - a.xp)
        }))
      },

      getLeaderboard: () => {
        return get().leaderboard
      },

      setTeacherMode: (isTeacher) => {
        set({ isTeacher })
      },

      addStudent: (student) => {
        set((s) => ({
          teacherStudents: [...s.teacherStudents.filter(st => st.id !== student.id), student]
        }))
      },

      getStudentStats: (studentId) => {
        return get().teacherStudents.find(s => s.id === studentId)
      }
    }),
    {
      name: 'ege-progress-storage',
    }
  )
)

function getYesterday(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

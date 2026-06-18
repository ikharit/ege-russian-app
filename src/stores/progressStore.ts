import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserStats, LessonProgress, Achievement, UserAtomProgress, WrongAnswer } from '../types'
import { achievements as allAchievements, course } from '../data/courseData'
import { dailyQuests } from '../data/dailyQuests'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

interface LeaderboardEntry {
  id: string
  name: string
  avatar: string
  xp: number
  level: number
  streak: number
  lessonsCompleted: number
  updatedAt: string
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
  wrongAnswers: WrongAnswer[]
  achievements: string[]
  lastUnlockedAchievement: string | null
  currentLessonId: string | null
  currentLessonStartTime: string | null
  currentLessonHeartsLost: number
  heartRestoreCount: number
  exportCount: number
  dailyQuestProgress: Record<string, { current: number; completed: boolean; claimed: boolean; date: string }>
  leaderboard: LeaderboardEntry[]
  leaderboardRanks: string[]
  teacherStudents: TeacherStudent[]
  isTeacher: boolean
  userId: string | null
  // Theory tests completion tracking
  theoryTestsCompleted: Record<string, { completed: boolean; score: number; xpEarned: number; completedAt?: string }>

  // Actions
  startLesson: (lessonId: string) => void
  completeLesson: (lessonId: string, score: number, xpEarned: number) => void
  loseHeart: () => boolean
  restoreHearts: () => void
  addXP: (amount: number) => void
  checkAchievements: (lessonId?: string) => string[]
  updateStreak: () => void
  getLessonProgress: (lessonId: string) => LessonProgress
  isLessonAvailable: (lessonId: string, prerequisites: string[]) => boolean
  // Atom tracking
  recordAtomAttempt: (atomId: string, isCorrect: boolean) => void
  getAtomProgress: (atomId: string) => UserAtomProgress
  getWeakAtoms: (threshold?: number) => string[]
  // Wrong answers
  recordWrongAnswer: (question: { id: string; text: string; options?: string[]; correctAnswer: string[]; explanation: string; atoms?: string[] }, userAnswer: string[], lessonId?: string) => void
  removeWrongAnswer: (questionId: string) => void
  markWrongAnswerReviewed: (questionId: string) => void
  incrementWrongAnswerAttempt: (questionId: string, userAnswer: string[]) => void
  getWrongAnswers: () => WrongAnswer[]
  getUnreviewedWrongAnswers: () => WrongAnswer[]
  // Task analytics
  taskStats: Record<string, { total: number; correct: number; wrong: number; lastAttemptAt: string }>
  getTaskStats: () => Record<string, { total: number; correct: number; wrong: number; lastAttemptAt: string }>
  getProblematicTasks: (limit?: number) => { taskNumber: string; accuracy: number; total: number; wrong: number }[]
  getProblematicQuestions: (limit?: number) => { questionId: string; text: string; taskNumber: string; wrongCount: number; attempts: number }[]
  updateTaskStats: (taskNumber: string, isCorrect: boolean) => void
  clearLastAchievement: () => void
  // Leaderboard
  addLeaderboardEntry: (entry: LeaderboardEntry) => void
  getLeaderboard: () => LeaderboardEntry[]
  checkLeaderboardRanks: () => void
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
  incrementExportCount: () => void
  recordQuestionAnswered: () => void
  // Daily quests
  getDailyQuests: () => Record<string, { current: number; completed: boolean; claimed: boolean; date: string }>
  updateQuestProgress: (questId: string, amount?: number) => void
  claimQuestReward: (questId: string) => boolean
  resetDailyQuests: () => void
  completeTheoryTest: (taskNumber: string, score: number, xpEarned: number) => void
  // Status
  setActiveStatus: (statusId: string) => void
}

const getToday = () => new Date().toISOString().split('T')[0]

const daysBetween = (a: string, b: string): number => {
  const d1 = new Date(a)
  const d2 = new Date(b)
  return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24))
}

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
  infiniteHearts: false,
  totalLessonTimeMinutes: 0,
  totalQuestionsAnswered: 0,
  totalHeartsLost: 0,
  mistakesFixed: 0,
})

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

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      userStats: getInitialStats(),
      lessonProgress: {},
      atomProgress: {},
      wrongAnswers: [],
      taskStats: {},
      achievements: [],
      lastUnlockedAchievement: null,
      currentLessonId: null,
      currentLessonStartTime: null,
      currentLessonHeartsLost: 0,
      heartRestoreCount: 0,
      exportCount: 0,
      dailyQuestProgress: {},
      leaderboard: defaultLeaderboard,
      leaderboardRanks: [],
      teacherStudents: defaultTeacherStudents,
      isTeacher: false,
      userId: null,
      theoryTestsCompleted: {},

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

      incrementExportCount: () => {
        set((s) => ({
          exportCount: s.exportCount + 1
        }))
      },

      recordQuestionAnswered: () => {
        set((s) => ({
          userStats: {
            ...s.userStats,
            totalQuestionsAnswered: (s.userStats.totalQuestionsAnswered || 0) + 1
          }
        }))
      },

      startLesson: (lessonId) => {
        set((state) => ({
          currentLessonId: lessonId,
          currentLessonStartTime: new Date().toISOString(),
          currentLessonHeartsLost: 0,
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
        const wasCompleted = existing?.status === 'completed'

        // Calculate lesson duration
        let extraMinutes = 0
        if (state.currentLessonStartTime) {
          const start = new Date(state.currentLessonStartTime)
          const durationMin = Math.round((Date.now() - start.getTime()) / (1000 * 60))
          extraMinutes = Math.max(0, durationMin)
        }

        set((s) => ({
          lessonProgress: {
            ...s.lessonProgress,
            [lessonId]: {
              lessonId,
              status: 'completed',
              score,
              bestScore: newBestScore,
              attempts: wasCompleted ? (existing?.attempts || 0) : (existing?.attempts || 0) + 1,
              xpEarned: wasCompleted ? (existing?.xpEarned || 0) : (existing?.xpEarned || 0) + xpEarned,
              completedAt: wasCompleted ? (existing?.completedAt || new Date().toISOString()) : new Date().toISOString()
            }
          },
          userStats: {
            ...s.userStats,
            totalLessonTimeMinutes: (s.userStats.totalLessonTimeMinutes || 0) + extraMinutes
          },
          currentLessonStartTime: null,
          currentLessonHeartsLost: 0
        }))

        if (!wasCompleted) {
          get().addXP(xpEarned)
          get().updateStreak()
        }
        const newAchievements = get().checkAchievements(lessonId)
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

      completeTheoryTest: (taskNumber, score, xpEarned) => {
        const state = get()
        const existing = state.theoryTestsCompleted[taskNumber]
        const newBestScore = existing?.score ? Math.max(existing.score, score) : score
        const newXpEarned = existing?.xpEarned ? Math.max(existing.xpEarned, xpEarned) : xpEarned

        set((s) => ({
          theoryTestsCompleted: {
            ...s.theoryTestsCompleted,
            [taskNumber]: {
              completed: true,
              score: newBestScore,
              xpEarned: newXpEarned,
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
        set((s) => ({
          userStats: { ...s.userStats, hearts: s.userStats.maxHearts },
          heartRestoreCount: s.heartRestoreCount + 1
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

      checkAchievements: (lessonId?: string) => {
        const state = get()
        const unlocked: string[] = []
        const completedLessons = Object.values(state.lessonProgress).filter(l => l.status === 'completed')
        const completedCount = completedLessons.length
        const xp = state.userStats.xp
        const streak = state.userStats.streak
        const level = state.userStats.level
        const currentAchs = state.achievements

        const addIfNew = (id: string) => {
          if (!currentAchs.includes(id) && !unlocked.includes(id)) unlocked.push(id)
        }

        // Lessons
        if (completedCount >= 1) addIfNew('ach-first-lesson')
        if (completedCount >= 5) addIfNew('ach-lessons-5')
        if (completedCount >= 10) addIfNew('ach-lessons-10')
        if (completedCount >= 25) addIfNew('ach-lessons-25')
        if (completedCount >= 50) addIfNew('ach-lessons-50')

        // Streak
        if (streak >= 3) addIfNew('ach-streak-3')
        if (streak >= 7) addIfNew('ach-streak-7')
        if (streak >= 14) addIfNew('ach-streak-14')
        if (streak >= 30) addIfNew('ach-streak-30')

        // XP
        if (xp >= 100) addIfNew('ach-xp-100')
        if (xp >= 500) addIfNew('ach-xp-500')
        if (xp >= 1000) addIfNew('ach-xp-1000')
        if (xp >= 5000) addIfNew('ach-xp-5000')

        // Levels
        if (level >= 5) addIfNew('ach-level-5')
        if (level >= 10) addIfNew('ach-level-10')
        if (level >= 20) addIfNew('ach-level-20')

        // Perfect lessons
        const perfectCount = completedLessons.filter(l => l.score === 100).length
        if (perfectCount >= 1) addIfNew('ach-perfect')
        if (perfectCount >= 5) addIfNew('ach-perfect-5')
        if (perfectCount >= 10) addIfNew('ach-perfect-10')

        // Infinite hearts
        if (state.userStats.infiniteHearts) addIfNew('ach-infinite')

        // Sections
        const sectionIds = ['section-text-work', 'section-orthoepy-lex', 'section-grammar', 'section-orthography', 'section-punctuation']
        const sectionAchievements = ['ach-section-1', 'ach-section-2', 'ach-section-3']
        const allSectionsComplete = sectionIds.every((sid, idx) => {
          const section = course.sections.find(s => s.id === sid)
          if (!section) return false
          const allCompleted = section.lessons.every(l => state.lessonProgress[l.id]?.status === 'completed')
          if (allCompleted) addIfNew(sectionAchievements[idx])
          return allCompleted
        })
        if (allSectionsComplete) addIfNew('ach-all-sections')

        // Atoms
        const atomValues = Object.values(state.atomProgress)
        if (atomValues.some(a => a.totalAttempts > 0)) addIfNew('ach-atom-first')
        const masteredAtoms = atomValues.filter(a => a.masteryLevel === 'mastered').length
        if (masteredAtoms >= 5) addIfNew('ach-atom-master')

        // Time-based (check current time at completion)
        const now = new Date()
        const hour = now.getHours()
        const day = now.getDay() // 0 = Sunday, 6 = Saturday
        if (hour >= 22 || hour < 6) addIfNew('ach-night-owl')
        if (hour >= 5 && hour < 9) addIfNew('ach-early-bird')
        if (day === 0 || day === 6) addIfNew('ach-weekend')

        // Speedrun
        if (lessonId && state.currentLessonStartTime) {
          const start = new Date(state.currentLessonStartTime)
          const durationMin = (now.getTime() - start.getTime()) / (1000 * 60)
          if (durationMin < 2) addIfNew('ach-speedrun')
        }

        // Persistent (10+ attempts on any lesson)
        if (Object.values(state.lessonProgress).some(l => (l.attempts || 0) >= 10)) {
          addIfNew('ach-persistent')
        }

        // No hearts lost in current lesson
        if (lessonId && state.currentLessonHeartsLost === 0 && state.userStats.hearts > 0) {
          addIfNew('ach-no-hearts-lost')
        }

        // Heart restore (3+ times)
        if (state.heartRestoreCount >= 3) addIfNew('ach-heart-restore')

        // Export progress
        if (state.exportCount >= 1) addIfNew('ach-export')

        // NEW: Questions answered
        const totalQuestions = state.userStats.totalQuestionsAnswered || 0
        if (totalQuestions >= 50) addIfNew('ach-questions-50')
        if (totalQuestions >= 200) addIfNew('ach-questions-200')
        if (totalQuestions >= 500) addIfNew('ach-questions-500')

        // NEW: Time spent
        const totalMinutes = state.userStats.totalLessonTimeMinutes || 0
        if (totalMinutes >= 60) addIfNew('ach-time-1h')
        if (totalMinutes >= 300) addIfNew('ach-time-5h')
        if (totalMinutes >= 600) addIfNew('ach-time-10h')

        // NEW: Collection
        if (state.achievements.length >= 10) addIfNew('ach-collection')
        if (state.achievements.length >= 20) addIfNew('ach-collector')

        // NEW: Retry (5+ attempts on any lesson)
        if (Object.values(state.lessonProgress).some(l => (l.attempts || 0) >= 5)) {
          addIfNew('ach-retry-5')
        }

        // NEW: Mistakes fixed
        const mistakesFixed = state.userStats.mistakesFixed || 0
        if (mistakesFixed >= 1) addIfNew('ach-mistake-1')
        if (mistakesFixed >= 5) addIfNew('ach-mistake-5')
        if (mistakesFixed >= 10) addIfNew('ach-mistake-10')
        if (mistakesFixed >= 25) addIfNew('ach-mistake-25')
        if (state.wrongAnswers.length === 0 && mistakesFixed > 0) addIfNew('ach-mistake-all')

        return unlocked
      },

      updateStreak: () => {
        const today = getToday()
        set((s) => {
          const last = s.userStats.lastActivityDate
          let newStreak = s.userStats.streak
          let streakFrozen = s.userStats.streakFrozen || false
          let streakFreezeUsed = s.userStats.streakFreezeUsed || 0
          let streakFreezeLastReset = s.userStats.streakFreezeLastReset || ''

          // Reset free freeze every 7 days
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
            // Streak broken — try freeze
            if (streakFreezeUsed < 1) {
              streakFrozen = true
              streakFreezeUsed += 1
              streakFreezeLastReset = streakFreezeLastReset || today
              // Keep streak, don't reset
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

      getTaskStats: () => get().taskStats,

      getProblematicTasks: (limit = 5) => {
        const stats = get().taskStats
        return Object.entries(stats)
          .map(([taskNumber, data]) => ({
            taskNumber,
            accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
            total: data.total,
            wrong: data.wrong,
          }))
          .filter(t => t.total > 0 && t.wrong > 0 && t.accuracy < 95)
          .sort((a, b) => a.accuracy - b.accuracy)
          .slice(0, limit)
      },

      getProblematicQuestions: (limit = 10) => {
        const wrong = get().wrongAnswers
        const map: Record<string, { questionId: string; text: string; taskNumber: string; wrongCount: number; attempts: number }> = {}
        for (const w of wrong) {
          if (!map[w.questionId]) {
            map[w.questionId] = {
              questionId: w.questionId,
              text: w.text,
              taskNumber: w.taskNumber ?? '—',
              wrongCount: 0,
              attempts: 0,
            }
          }
          map[w.questionId].wrongCount++
          map[w.questionId].attempts = w.attempts
        }
        return Object.values(map)
          .sort((a, b) => b.wrongCount - a.wrongCount)
          .slice(0, limit)
      },

      recordWrongAnswer: (question, userAnswer, lessonId) => {
        set((s) => {
          const existing = s.wrongAnswers.find(w => w.questionId === question.id)
          if (existing) {
            return {
              wrongAnswers: s.wrongAnswers.map(w =>
                w.questionId === question.id
                  ? { ...w, userAnswer, timestamp: new Date().toISOString(), attempts: w.attempts + 1, reviewed: false }
                  : w
              )
            }
          }
          const newWrong: WrongAnswer = {
            questionId: question.id,
            text: question.text,
            options: question.options,
            correctAnswer: question.correctAnswer,
            userAnswer,
            explanation: question.explanation,
            taskNumber: question.atoms?.find(a => a.startsWith('task'))?.replace('task', '') ?? undefined,
            lessonId,
            timestamp: new Date().toISOString(),
            reviewed: false,
            attempts: 1,
          }
          return { wrongAnswers: [...s.wrongAnswers, newWrong] }
        })
      },

      removeWrongAnswer: (questionId) => {
        set((s) => ({
          wrongAnswers: s.wrongAnswers.filter(w => w.questionId !== questionId),
          userStats: {
            ...s.userStats,
            mistakesFixed: (s.userStats.mistakesFixed || 0) + 1
          }
        }))
      },

      markWrongAnswerReviewed: (questionId) => {
        set((s) => ({
          wrongAnswers: s.wrongAnswers.map(w =>
            w.questionId === questionId ? { ...w, reviewed: true } : w
          )
        }))
      },

      incrementWrongAnswerAttempt: (questionId, userAnswer) => {
        set((s) => ({
          wrongAnswers: s.wrongAnswers.map(w =>
            w.questionId === questionId
              ? { ...w, userAnswer, attempts: w.attempts + 1, timestamp: new Date().toISOString() }
              : w
          )
        }))
      },

      getWrongAnswers: () => get().wrongAnswers,

      getUnreviewedWrongAnswers: () => get().wrongAnswers.filter(w => !w.reviewed),

      updateTaskStats: (taskNumber, isCorrect) => {
        set((s) => {
          const current = s.taskStats[taskNumber] || { total: 0, correct: 0, wrong: 0, lastAttemptAt: '' }
          return {
            taskStats: {
              ...s.taskStats,
              [taskNumber]: {
                total: current.total + 1,
                correct: current.correct + (isCorrect ? 1 : 0),
                wrong: current.wrong + (isCorrect ? 0 : 1),
                lastAttemptAt: new Date().toISOString(),
              }
            }
          }
        })
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

      checkLeaderboardRanks: () => {
        const state = get()
        const all = [...state.leaderboard, {
          id: 'me',
          name: 'Вы',
          avatar: '🎓',
          xp: state.userStats.xp,
          level: state.userStats.level,
          streak: state.userStats.streak,
          lessonsCompleted: Object.values(state.lessonProgress).filter(l => l.status === 'completed').length,
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
      },

      // Daily Quests
      getDailyQuests: () => {
        return get().dailyQuestProgress
      },

      updateQuestProgress: (questId, amount = 1) => {
        const today = getToday()
        set((s) => {
          const existing = s.dailyQuestProgress[questId]
          // Reset if from different day
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

      claimQuestReward: (questId) => {
        const state = get()
        const quest = state.dailyQuestProgress[questId]
        if (!quest || !quest.completed || quest.claimed) return false
        
        const questDef = dailyQuests.find((q) => q.id === questId)
        if (!questDef) return false

        set((s) => ({
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
        set((s) => ({
          userStats: { ...s.userStats, activeStatus: statusId }
        }))
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

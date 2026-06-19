import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserStats, LessonProgress, Achievement, UserAtomProgress, WrongAnswer } from '../types'
import { achievements as allAchievements, course } from '../data/courseData'
import { dailyQuests } from '../data/dailyQuests'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { getInitialStats, createUserActions } from './slices/userSlice'
import { createLessonActions, createAnalyticsActions } from './slices/lessonAnalyticsSlice'
import { createGamificationActions, defaultLeaderboard, defaultTeacherStudents, LeaderboardEntry, TeacherStudent } from './slices/gamificationSlice'
import { createAchievementChecker } from './slices/achievementChecker'
import { createSyncActions } from './slices/syncSlice'

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
  theoryTestsCompleted: Record<string, { completed: boolean; score: number; xpEarned: number; completedAt?: string }>
  taskStats: Record<string, { total: number; correct: number; wrong: number; lastAttemptAt: string }>

  startLesson: (lessonId: string) => void
  completeLesson: (lessonId: string, score: number, xpEarned: number) => void
  loseHeart: () => boolean
  restoreHearts: () => void
  addXP: (amount: number) => void
  checkAchievements: (lessonId?: string) => string[]
  updateStreak: () => void
  getLessonProgress: (lessonId: string) => LessonProgress
  isLessonAvailable: (lessonId: string, prerequisites: string[]) => boolean
  recordAtomAttempt: (atomId: string, isCorrect: boolean) => void
  getAtomProgress: (atomId: string) => UserAtomProgress
  getWeakAtoms: (threshold?: number) => string[]
  recordWrongAnswer: (question: { id: string; text: string; options?: string[]; correctAnswer: string[]; explanation: string; atoms?: string[] }, userAnswer: string[], lessonId?: string) => void
  removeWrongAnswer: (questionId: string) => void
  markWrongAnswerReviewed: (questionId: string) => void
  incrementWrongAnswerAttempt: (questionId: string, userAnswer: string[]) => void
  getWrongAnswers: () => WrongAnswer[]
  getUnreviewedWrongAnswers: () => WrongAnswer[]
  getTaskStats: () => Record<string, { total: number; correct: number; wrong: number; lastAttemptAt: string }>
  getProblematicTasks: (limit?: number) => { taskNumber: string; accuracy: number; total: number; wrong: number }[]
  getProblematicQuestions: (limit?: number) => { questionId: string; text: string; taskNumber: string; wrongCount: number; attempts: number }[]
  updateTaskStats: (taskNumber: string, isCorrect: boolean) => void
  clearLastAchievement: () => void
  addLeaderboardEntry: (entry: LeaderboardEntry) => void
  getLeaderboard: () => LeaderboardEntry[]
  checkLeaderboardRanks: () => void
  setTeacherMode: (isTeacher: boolean) => void
  addStudent: (student: TeacherStudent) => void
  getStudentStats: (studentId: string) => TeacherStudent | undefined
  setUserId: (userId: string | null) => void
  syncProgress: () => Promise<void>
  loadProgress: () => Promise<void>
  checkHeartRestore: () => void
  setUserName: (name: string) => void
  toggleInfiniteHearts: () => void
  incrementExportCount: () => void
  recordQuestionAnswered: () => void
  getDailyQuests: () => Record<string, { current: number; completed: boolean; claimed: boolean; date: string }>
  updateQuestProgress: (questId: string, amount?: number) => void
  claimQuestReward: (questId: string) => boolean
  resetDailyQuests: () => void
  completeTheoryTest: (taskNumber: string, score: number, xpEarned: number) => void
  setActiveStatus: (statusId: string) => void
  importProgress: (data: string) => { success: boolean; message: string }
}

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

      checkAchievements: createAchievementChecker(get),
      completeTheoryTest: (taskNumber, score, xpEarned) => {
        const state = get()
        const existing = state.theoryTestsCompleted[taskNumber]
        const newBestScore = existing?.score ? Math.max(existing.score, score) : score
        const newXpEarned = existing?.xpEarned ? Math.max(existing.xpEarned, xpEarned) : xpEarned

        set((s: any) => ({
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
          set((s: any) => ({
            achievements: [...new Set([...s.achievements, ...newAchievements])],
            lastUnlockedAchievement: newAchievements[0],
            userStats: {
              ...s.userStats,
              achievements: [...new Set([...s.userStats.achievements, ...newAchievements])]
            }
          }))
        }
      },

      importProgress: (data: string) => {
        try {
          const parsed = JSON.parse(data)
          
          // Валидация
          if (!parsed.userStats || !parsed.lessonProgress) {
            return { success: false, message: 'Неверный формат файла' }
          }
          
          // Мерж с текущим прогрессом
          set((s: any) => {
            const mergedLessonProgress = { ...s.lessonProgress }
            Object.entries(parsed.lessonProgress).forEach(([key, val]: [string, any]) => {
              if (!mergedLessonProgress[key] || val.status === 'completed') {
                mergedLessonProgress[key] = val
              }
            })
            
            const mergedAchievements = [...new Set([...s.achievements, ...(parsed.achievements || [])])]
            
            return {
              userStats: {
                ...s.userStats,
                ...parsed.userStats,
                xp: Math.max(s.userStats.xp, parsed.userStats.xp || 0),
                streak: Math.max(s.userStats.streak, parsed.userStats.streak || 0),
                bestStreak: Math.max(s.userStats.bestStreak, parsed.userStats.bestStreak || 0),
              },
              lessonProgress: mergedLessonProgress,
              achievements: mergedAchievements,
              atomProgress: { ...s.atomProgress, ...(parsed.atomProgress || {}) },
              wrongAnswers: [...s.wrongAnswers, ...(parsed.wrongAnswers || [])],
              taskStats: { ...s.taskStats, ...(parsed.taskStats || {}) },
              theoryTestsCompleted: { ...s.theoryTestsCompleted, ...(parsed.theoryTestsCompleted || {}) },
            }
          })
          
          return { success: true, message: 'Прогресс успешно импортирован' }
        } catch (e) {
          return { success: false, message: 'Ошибка чтения JSON' }
        }
      },

      ...createUserActions(set, get),
      ...createLessonActions(set, get),
      ...createAnalyticsActions(set, get),
      ...createGamificationActions(set, get),
      ...createSyncActions(
        set, get,
        () => get().userStats,
        () => get().lessonProgress,
        () => get().atomProgress,
        () => get().wrongAnswers,
        () => get().achievements,
        () => get().taskStats,
        () => get().dailyQuestProgress,
        () => get().theoryTestsCompleted,
        () => get().leaderboardRanks,
        () => get().teacherStudents,
        () => get().isTeacher,
      ),
    }),
    {
      name: 'ege-progress-storage',
    }
  )
)

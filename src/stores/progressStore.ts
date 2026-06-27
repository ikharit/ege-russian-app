import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserStats, LessonProgress, Achievement, UserAtomProgress, WrongAnswer, EmotionalState, AnswerHistory, ErrorAnalysis, ScheduleDay, WeeklySchedulePreferences, PlayerProfile, SavedExplanation, QuestionFeedback } from '../types'
import { getPredictiveScore } from '../utils/predictiveScore'
import { achievements as allAchievements, course } from '../data/courseData'
import { dailyQuests } from '../data/dailyQuests'
import { ExamResult } from '../data/fipiVariants'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { getInitialStats, createUserActions } from './slices/userSlice'
import { createLessonActions, createAnalyticsActions } from './slices/lessonAnalyticsSlice'
import { createGamificationActions, defaultTeacherStudents, LeaderboardEntry, TeacherStudent } from './slices/gamificationSlice'
import { createAchievementChecker } from './slices/achievementChecker'
import { createSyncActions } from './slices/syncSlice'
import { getInitialEmotionalState, updateEmotionalState, recordAnswerAttempt, recordSessionStart, recordLevelUp, recordExamTaken, clearTransientFlags } from '../utils/emotionalState'
import { analyzeErrors } from '../utils/errorPatternAnalyzer'
import { SRSItem, calculateNextReview, scoreToQuality, initSRS } from '../utils/spacedRepetition'

export interface ProgressState {
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
  examResults: ExamResult[]
  srsData: Record<string, SRSItem>
  answerHistory: AnswerHistory[]
  weeklySchedule: ScheduleDay[] | null
  predictiveScoreHistory: { date: string; score: number }[]
  examDate: string | null
  savedExplanations: SavedExplanation[]
  feedback: QuestionFeedback[]

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
  loadLeaderboard: () => Promise<void>
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
  saveExamResult: (result: ExamResult) => void
  getExamResults: () => ExamResult[]
  getBestExamResult: (variantId: string) => ExamResult | undefined
  migrateToFirebase: () => Promise<void>
  setPlayerProfile: (profile: PlayerProfile) => void
  getPlayerProfile: () => PlayerProfile | undefined
  updateEmotionalState: (changes: Partial<EmotionalState>) => void
  clearTransientEmotionalFlags: () => void
  recordAnswerAttempt: (isCorrect: boolean) => void
  recordSessionStart: () => void
  recordLevelUp: (oldLevel: number, newLevel: number) => void
  recordAnswer: (entry: AnswerHistory) => void
  getErrorAnalysis: () => ErrorAnalysis
  generateWeeklySchedule: (preferences?: WeeklySchedulePreferences) => void
  markScheduleItemDone: (day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun', index: number) => void
  setExamDate: (date: string | null) => void
  recordPredictiveScore: () => void
  getSRSData: () => Record<string, SRSItem>
  getDueSRSItems: () => SRSItem[]
  initSRSData: () => void
  reviewLesson: (lessonId: string, score: number) => void
  saveExplanation: (item: SavedExplanation) => void
  removeSavedExplanation: (id: string) => void
  getSavedExplanations: () => SavedExplanation[]
  submitFeedback: (feedback: QuestionFeedback) => void
  getFeedbackStats: () => { questionId: string; count: number; types: QuestionFeedback['type'][] }[]
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
      leaderboard: [],
      leaderboardRanks: [],
      teacherStudents: defaultTeacherStudents,
      isTeacher: false,
      userId: null,
      theoryTestsCompleted: {},
      examResults: [],
      srsData: {},
      answerHistory: [],
      weeklySchedule: null,
      predictiveScoreHistory: [],
      examDate: '2027-06-01',
      savedExplanations: [],

      feedback: [],

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
            const mergedExamResults = [...s.examResults, ...(parsed.examResults || [])]
            
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
              examResults: mergedExamResults,
              srsData: { ...s.srsData, ...(parsed.srsData || {}) },
              answerHistory: [...s.answerHistory, ...(parsed.answerHistory || [])],
            }
          })
          
          return { success: true, message: 'Прогресс успешно импортирован' }
        } catch (e) {
          return { success: false, message: 'Ошибка чтения JSON' }
        }
      },

      saveExamResult: (result: ExamResult) => {
        set((s: any) => ({
          examResults: [...s.examResults, result],
        }))
      },

      getExamResults: () => get().examResults,

      getBestExamResult: (variantId: string) => {
        const results = get().examResults.filter((r: ExamResult) => r.variantId === variantId)
        if (results.length === 0) return undefined
        return results.reduce((best: ExamResult, r: ExamResult) =>
          r.secondaryScore > best.secondaryScore ? r : best
        )
      },

      ...createUserActions(set, get),
      ...(() => {
        const lessonActions = createLessonActions(set, get)
        return {
          ...lessonActions,
          completeLesson: (lessonId: string, score: number, xpEarned: number) => {
            const state = get()
            const wasCompleted = state.lessonProgress[lessonId]?.status === 'completed'
            const existingSRS = state.srsData?.[lessonId]

            lessonActions.completeLesson(lessonId, score, xpEarned)

            // SRS: обновить или создать item
            set((s: any) => {
              let newSRS: SRSItem
              if (existingSRS) {
                // Повторное прохождение — качество по фактической точности
                const quality = scoreToQuality(score)
                newSRS = calculateNextReview(existingSRS, quality)
              } else {
                // Первое прохождение — quality 4 по умолчанию
                const now = new Date()
                const nextReview = new Date(now)
                nextReview.setDate(now.getDate() + 1)
                newSRS = {
                  lessonId,
                  interval: 1,
                  repetitions: 1,
                  easeFactor: 2.5,
                  nextReview: nextReview.toISOString(),
                  lastReview: now.toISOString(),
                  quality: 4,
                }
              }
              return {
                srsData: {
                  ...s.srsData,
                  [lessonId]: newSRS,
                },
              }
            })

            // Эмоциональное состояние: обновить overdueSRS
            if (wasCompleted) {
              const overdueCount = Object.values(get().srsData || {}).filter((item: SRSItem) => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                const nextReview = new Date(item.nextReview)
                nextReview.setHours(0, 0, 0, 0)
                return nextReview < today
              }).length
              set((s: any) => ({
                userStats: {
                  ...s.userStats,
                  emotionalState: {
                    ...(s.userStats.emotionalState || getInitialEmotionalState()),
                    overdueSRSLessons: overdueCount,
                  },
                },
              }))
            }

            if (typeof navigator !== 'undefined' && navigator.onLine) {
              import('./firebaseStore').then(({ useFirebaseStore }) => {
                useFirebaseStore.getState().syncProgress().catch(() => {})
              })
            }
          },
        }
      })(),
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
        () => get().examResults,
        () => get().answerHistory,
      ),
      migrateToFirebase: async () => {
        const { useFirebaseStore } = await import('./firebaseStore')
        await useFirebaseStore.getState().migrateToFirebase()
      },
      setPlayerProfile: (profile: PlayerProfile) => {
        set((s: any) => ({
          userStats: { ...s.userStats, playerProfile: profile },
        }))
      },
      getPlayerProfile: () => {
        return get().userStats.playerProfile
      },
      updateEmotionalState: (changes: Partial<EmotionalState>) => {
        set((s: any) => ({
          userStats: {
            ...s.userStats,
            emotionalState: updateEmotionalState(s.userStats.emotionalState || getInitialEmotionalState(), changes),
          },
        }))
      },
      clearTransientEmotionalFlags: () => {
        set((s: any) => ({
          userStats: {
            ...s.userStats,
            emotionalState: clearTransientFlags(s.userStats.emotionalState || getInitialEmotionalState()),
          },
        }))
      },
      recordAnswerAttempt: (isCorrect: boolean) => {
        set((s: any) => ({
          userStats: {
            ...s.userStats,
            emotionalState: recordAnswerAttempt(s.userStats.emotionalState || getInitialEmotionalState(), isCorrect),
          },
        }))
      },
      recordSessionStart: () => {
        set((s: any) => ({
          userStats: {
            ...s.userStats,
            emotionalState: recordSessionStart(s.userStats.emotionalState || getInitialEmotionalState()),
          },
        }))
      },
      recordLevelUp: (oldLevel: number, newLevel: number) => {
        set((s: any) => ({
          userStats: {
            ...s.userStats,
            emotionalState: recordLevelUp(s.userStats.emotionalState || getInitialEmotionalState(), oldLevel, newLevel),
          },
        }))
      },
      recordExamTaken: () => {
        set((s: any) => ({
          userStats: {
            ...s.userStats,
            emotionalState: recordExamTaken(s.userStats.emotionalState || getInitialEmotionalState()),
          },
        }))
      },
      recordAnswer: (entry: AnswerHistory) => {
        set((s: any) => ({
          answerHistory: [...s.answerHistory, entry],
        }))
      },
      getErrorAnalysis: (): ErrorAnalysis => {
        return analyzeErrors(get().answerHistory)
      },
      generateWeeklySchedule: (_preferences?: WeeklySchedulePreferences) => {
        set({ weeklySchedule: [] as ScheduleDay[] })
      },
      markScheduleItemDone: (day, index) => {
        set((s: any) => {
          if (!s.weeklySchedule) return s
          const newSchedule = s.weeklySchedule.map((d: ScheduleDay) => {
            if (d.day !== day) return d
            const newItems = d.items.map((item: ScheduleDay['items'][number], idx: number) =>
              idx === index ? { ...item, type: 'break' as const, title: '✅ ' + item.title, reason: 'Выполнено!' } : item
            )
            return { ...d, items: newItems }
          })
          return { weeklySchedule: newSchedule }
        })
      },
      setExamDate: (date: string | null) => {
        set({ examDate: date })
      },
      recordPredictiveScore: () => {
        const state = get()
        const daysToExam = state.examDate
          ? Math.max(0, Math.ceil((new Date(state.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
          : 180
        const score = getPredictiveScore(state, daysToExam)
        set((s: any) => ({
          predictiveScoreHistory: [
            ...s.predictiveScoreHistory,
            { date: new Date().toISOString().split('T')[0], score: score.predictedSecondary },
          ],
        }))
      },

      // SRS actions
      getSRSData: () => get().srsData,
      getDueSRSItems: () => {
        const srsData = get().srsData
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return Object.values(srsData).filter((item: SRSItem) => {
          const nextReview = new Date(item.nextReview)
          nextReview.setHours(0, 0, 0, 0)
          return nextReview <= today
        })
      },
      initSRSData: () => {
        const state = get()
        const newSRS = initSRS(state.lessonProgress, state.srsData)
        set({ srsData: newSRS })
      },
      reviewLesson: (lessonId: string, score: number) => {
        const existingSRS = get().srsData?.[lessonId]
        if (!existingSRS) return
        const quality = scoreToQuality(score)
        const newSRS = calculateNextReview(existingSRS, quality)
        set((s: any) => ({
          srsData: {
            ...s.srsData,
            [lessonId]: newSRS,
          },
        }))
      },
      saveExplanation: (item: SavedExplanation) => {
        set((s: any) => ({
          savedExplanations: [...s.savedExplanations.filter((e: SavedExplanation) => e.questionId !== item.questionId), item],
        }))
      },
      removeSavedExplanation: (id: string) => {
        set((s: any) => ({
          savedExplanations: s.savedExplanations.filter((e: SavedExplanation) => e.id !== id),
        }))
      },
      getSavedExplanations: () => get().savedExplanations,
      submitFeedback: (feedback: QuestionFeedback) => {
        set((s: any) => ({
          feedback: [...s.feedback, feedback],
        }))
      },
      getFeedbackStats: () => {
        const all = get().feedback
        const grouped = all.reduce((acc: Record<string, { count: number; types: QuestionFeedback['type'][] }>, f) => {
          if (!acc[f.questionId]) acc[f.questionId] = { count: 0, types: [] }
          acc[f.questionId].count += 1
          acc[f.questionId].types.push(f.type)
          return acc
        }, {})
        return Object.entries(grouped)
          .map(([questionId, data]) => ({ questionId, count: data.count, types: data.types }))
          .sort((a, b) => b.count - a.count)
      },
    }),
    {
      name: 'ege-progress-storage',
      onRehydrateStorage: (state) => {
        console.log('[ProgressStore] Rehydrated from localStorage', {
          hasState: !!state,
          lessonCount: state ? Object.keys(state.lessonProgress || {}).length : 0,
          xp: state?.userStats?.xp ?? 0,
        })
      },
    }
  )
)

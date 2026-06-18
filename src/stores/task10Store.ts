import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { task10Questions, Task10Question } from '../data/task10Questions'

export interface Task10Progress {
  questionId: string
  stars: number
  totalCorrect: number
  totalWrong: number
}

export interface Task10Stats {
  totalCorrect: number
  totalWrong: number
  streak: number
  bestStreak: number
  sessionStarted: string
  questionsMastered: number
  currentStage: number
}

export interface Task10Settings {
  sound: boolean
  showExplanation: boolean
}

interface Task10State {
  questionProgress: Record<string, Task10Progress>
  stats: Task10Stats
  settings: Task10Settings
  currentQuestionId: string | null
  sessionQueue: string[]
  sessionIndex: number
  selectedRows: number[]
  hasAnswered: boolean
  getNextQuestion: () => Task10Question | null
  answerQuestion: (questionId: string, selectedRows: number[]) => { correct: boolean }
  startSession: () => void
  resetProgress: () => void
  resetQuestion: (questionId: string) => void
  updateSettings: (settings: Partial<Task10Settings>) => void
  getProgressForQuestion: (questionId: string) => Task10Progress
  getOverallProgress: () => { total: number; mastered: number; learning: number; newQuestions: number }
  setSelectedRows: (rows: number[]) => void
  clearAnswer: () => void
}

const QUESTIONS_PER_STAGE = 4
const MAX_STARS = 5
const MIN_STARS = 0

function getStageQuestions(stage: number): Task10Question[] {
  const start = stage * QUESTIONS_PER_STAGE
  const end = start + QUESTIONS_PER_STAGE
  return task10Questions.slice(start, end)
}

function getInitialStats(): Task10Stats {
  return {
    totalCorrect: 0,
    totalWrong: 0,
    streak: 0,
    bestStreak: 0,
    sessionStarted: new Date().toISOString(),
    questionsMastered: 0,
    currentStage: 0,
  }
}

function getDefaultSettings(): Task10Settings {
  return {
    sound: true,
    showExplanation: true,
  }
}

function getDefaultProgress(questionId: string): Task10Progress {
  return {
    questionId,
    stars: 0,
    totalCorrect: 0,
    totalWrong: 0,
  }
}

export const useTask10Store = create<Task10State>()(
  persist(
    (set, get) => ({
      questionProgress: {},
      stats: getInitialStats(),
      settings: getDefaultSettings(),
      currentQuestionId: null,
      sessionQueue: [],
      sessionIndex: 0,
      selectedRows: [],
      hasAnswered: false,

      getNextQuestion: () => {
        const state = get()
        const { sessionQueue, sessionIndex } = state

        if (sessionQueue.length > 0 && sessionIndex < sessionQueue.length) {
          const qId = sessionQueue[sessionIndex]
          set({ currentQuestionId: qId, sessionIndex: sessionIndex + 1, selectedRows: [], hasAnswered: false })
          return task10Questions.find(q => q.id === qId) || null
        }

        const currentStage = state.stats.currentStage
        const stageQuestions = getStageQuestions(currentStage)
        const stageQuestionIds = stageQuestions.map(q => q.id)

        const stageProgress = stageQuestionIds.map(id => {
          const prog = state.questionProgress[id] || getDefaultProgress(id)
          return { id, stars: prog.stars }
        })

        const notMasteredInStage = stageProgress.filter(q => q.stars < MAX_STARS).map(q => q.id)

        const leakingQuestions: string[] = []
        for (let s = 0; s < currentStage; s++) {
          const prevStageQuestions = getStageQuestions(s)
          for (const q of prevStageQuestions) {
            const prog = state.questionProgress[q.id] || getDefaultProgress(q.id)
            if (prog.stars < MAX_STARS) {
              leakingQuestions.push(q.id)
            }
          }
        }

        // Shuffle
        for (let i = notMasteredInStage.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[notMasteredInStage[i], notMasteredInStage[j]] = [notMasteredInStage[j], notMasteredInStage[i]]
        }

        for (let i = leakingQuestions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[leakingQuestions[i], leakingQuestions[j]] = [leakingQuestions[j], leakingQuestions[i]]
        }

        const queue: string[] = []
        let currentIdx = 0
        let leakIdx = 0
        const alternateEvery = 3

        while (currentIdx < notMasteredInStage.length || leakIdx < leakingQuestions.length) {
          for (let i = 0; i < alternateEvery && currentIdx < notMasteredInStage.length; i++) {
            queue.push(notMasteredInStage[currentIdx++])
          }
          if (leakIdx < leakingQuestions.length) {
            queue.push(leakingQuestions[leakIdx++])
          }
        }

        if (queue.length === 0) {
          const nextStage = currentStage + 1
          const nextStageQuestions = getStageQuestions(nextStage)
          if (nextStageQuestions.length === 0) {
            return null
          }
          set(prev => ({ stats: { ...prev.stats, currentStage: nextStage } }))
          return get().getNextQuestion()
        }

        set({ sessionQueue: queue, sessionIndex: 0, currentQuestionId: queue[0], selectedRows: [], hasAnswered: false })
        return task10Questions.find(q => q.id === queue[0]) || null
      },

      answerQuestion: (questionId: string, selectedRows: number[]) => {
        const question = task10Questions.find(q => q.id === questionId)
        if (!question) return { correct: false }

        const correct =
          selectedRows.length === question.correctAnswers.length &&
          selectedRows.every(r => question.correctAnswers.includes(r))

        set(prev => {
          const existing = prev.questionProgress[questionId] || getDefaultProgress(questionId)
          let newStars = existing.stars
          if (correct) {
            newStars = Math.min(MAX_STARS, newStars + 1)
          } else {
            newStars = Math.max(MIN_STARS, newStars - 1)
          }
          const updated: Task10Progress = {
            ...existing,
            stars: newStars,
            totalCorrect: existing.totalCorrect + (correct ? 1 : 0),
            totalWrong: existing.totalWrong + (correct ? 0 : 1),
          }
          return {
            questionProgress: { ...prev.questionProgress, [questionId]: updated },
            stats: {
              ...prev.stats,
              totalCorrect: prev.stats.totalCorrect + (correct ? 1 : 0),
              totalWrong: prev.stats.totalWrong + (correct ? 0 : 1),
              streak: correct ? prev.stats.streak + 1 : 0,
              bestStreak: correct
                ? Math.max(prev.stats.bestStreak, prev.stats.streak + 1)
                : prev.stats.bestStreak,
              questionsMastered: Object.values({ ...prev.questionProgress, [questionId]: updated }).filter(
                p => p.stars >= MAX_STARS
              ).length,
            },
            hasAnswered: true,
          }
        })

        return { correct }
      },

      startSession: () => {
        get().getNextQuestion()
      },

      resetProgress: () => {
        set({
          questionProgress: {},
          stats: getInitialStats(),
          currentQuestionId: null,
          sessionQueue: [],
          sessionIndex: 0,
          selectedRows: [],
          hasAnswered: false,
        })
      },

      resetQuestion: (questionId: string) => {
        set(prev => ({
          questionProgress: { ...prev.questionProgress, [questionId]: getDefaultProgress(questionId) },
        }))
      },

      updateSettings: (settings) => {
        set(prev => ({ settings: { ...prev.settings, ...settings } }))
      },

      getProgressForQuestion: (questionId: string) => {
        return get().questionProgress[questionId] || getDefaultProgress(questionId)
      },

      getOverallProgress: () => {
        const state = get()
        const total = task10Questions.length
        const mastered = Object.values(state.questionProgress).filter(p => p.stars >= MAX_STARS).length
        const learning = Object.values(state.questionProgress).filter(
          p => p.stars > 0 && p.stars < MAX_STARS
        ).length
        const newQuestions = total - Object.keys(state.questionProgress).length
        return { total, mastered, learning, newQuestions }
      },

      setSelectedRows: (rows) => {
        set({ selectedRows: rows })
      },

      clearAnswer: () => {
        set({ selectedRows: [], hasAnswered: false })
      },
    }),
    {
      name: 'task10-trainer-v1',
      partialize: (state) => ({
        questionProgress: state.questionProgress,
        stats: state.stats,
        settings: state.settings,
      }),
    }
  )
)

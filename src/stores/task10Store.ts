import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { task10Questions, Task10Question } from '../data/task10Questions'

export type QuestionStatus = 'new' | 'deferred' | 'passed'

export interface Task10Progress {
  questionId: string
  status: QuestionStatus
  totalCorrect: number
  totalWrong: number
}

export interface Task10Stats {
  totalCorrect: number
  totalWrong: number
  streak: number
  bestStreak: number
  sessionStarted: string
  questionsPassed: number
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
  getOverallProgress: () => { total: number; passed: number; deferred: number; newQuestions: number }
  setSelectedRows: (rows: number[]) => void
  clearAnswer: () => void
}

const QUESTIONS_PER_STAGE = 4

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
    questionsPassed: 0,
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
    status: 'new',
    totalCorrect: 0,
    totalWrong: 0,
  }
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
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

      // Build a fresh session queue.
      // First all current-stage new questions (shuffled), then any deferred
      // from previous stages (shuffled), then any deferred from current stage.
      // Deferred questions go to the END of the queue.
      getNextQuestion: () => {
        const state = get()
        const { sessionQueue, sessionIndex } = state

        // If we have items in the current session queue, return the next one
        if (sessionQueue.length > 0 && sessionIndex < sessionQueue.length) {
          const qId = sessionQueue[sessionIndex]
          set({ currentQuestionId: qId, sessionIndex: sessionIndex + 1, selectedRows: [], hasAnswered: false })
          return task10Questions.find(q => q.id === qId) || null
        }

        // Queue exhausted — build a new session queue
        const currentStage = state.stats.currentStage
        const allIds = task10Questions.map(q => q.id)

        // Determine which questions are already passed globally
        const passedIds = new Set(
          allIds.filter(id => (state.questionProgress[id]?.status || 'new') === 'passed')
        )

        // Gather new questions for current stage
        const stageQuestions = getStageQuestions(currentStage)
        const stageNewIds = shuffleArray(
          stageQuestions
            .map(q => q.id)
            .filter(id => !passedIds.has(id) && (state.questionProgress[id]?.status || 'new') !== 'deferred')
        )

        // Gather deferred questions from PREVIOUS stages (shuffle them)
        const prevDeferredIds: string[] = []
        for (let s = 0; s < currentStage; s++) {
          const prevStage = getStageQuestions(s)
          for (const q of prevStage) {
            if ((state.questionProgress[q.id]?.status || 'new') === 'deferred') {
              prevDeferredIds.push(q.id)
            }
          }
        }
        const shuffledPrevDeferred = shuffleArray(prevDeferredIds)

        // Gather deferred questions from CURRENT stage (shuffle them)
        const currDeferredIds = shuffleArray(
          stageQuestions
            .map(q => q.id)
            .filter(id => (state.questionProgress[id]?.status || 'new') === 'deferred')
        )

        // Build queue: current stage new → previous deferred → current deferred
        const queue: string[] = [...stageNewIds, ...shuffledPrevDeferred, ...currDeferredIds]

        // If nothing left in current stage, try advancing to next stage
        if (queue.length === 0) {
          const nextStage = currentStage + 1
          const nextStageQuestions = getStageQuestions(nextStage)
          if (nextStageQuestions.length === 0) {
            // All questions across all stages are passed → done
            const anyDeferred = allIds.some(
              id => (state.questionProgress[id]?.status || 'new') === 'deferred'
            )
            if (anyDeferred) {
              // One final pass with all remaining deferred questions
              const allDeferred = shuffleArray(
                allIds.filter(id => (state.questionProgress[id]?.status || 'new') === 'deferred')
              )
              set({ sessionQueue: allDeferred, sessionIndex: 0, currentQuestionId: allDeferred[0], selectedRows: [], hasAnswered: false })
              return task10Questions.find(q => q.id === allDeferred[0]) || null
            }
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
          let newStatus: QuestionStatus = existing.status
          if (correct) {
            newStatus = 'passed'
          } else if (existing.status !== 'passed') {
            newStatus = 'deferred'
          }
          const updated: Task10Progress = {
            ...existing,
            status: newStatus,
            totalCorrect: existing.totalCorrect + (correct ? 1 : 0),
            totalWrong: existing.totalWrong + (correct ? 0 : 1),
          }

          // If answer was wrong, append this question to the end of the session queue
          // so it doesn't appear immediately.
          const newQueue = [...prev.sessionQueue]
          if (!correct && !newQueue.includes(questionId)) {
            newQueue.push(questionId)
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
              questionsPassed: Object.values({ ...prev.questionProgress, [questionId]: updated }).filter(
                p => p.status === 'passed'
              ).length,
            },
            hasAnswered: true,
            sessionQueue: newQueue,
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
        const passed = Object.values(state.questionProgress).filter(p => p.status === 'passed').length
        const deferred = Object.values(state.questionProgress).filter(p => p.status === 'deferred').length
        const newQuestions = total - Object.keys(state.questionProgress).length
        return { total, passed, deferred, newQuestions }
      },

      setSelectedRows: (rows) => {
        set({ selectedRows: rows })
      },

      clearAnswer: () => {
        set({ selectedRows: [], hasAnswered: false })
      },
    }),
    {
      name: 'task10-trainer-v2',
      partialize: (state) => ({
        questionProgress: state.questionProgress,
        stats: state.stats,
        settings: state.settings,
      }),
    }
  )
)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { task5Questions, Task5Question } from '../data/questions/task5'

export type QuestionStatus = 'new' | 'deferred' | 'passed'

export interface Task5Progress {
  questionId: string
  status: QuestionStatus
  totalCorrect: number
  totalWrong: number
}

export interface Task5Stats {
  totalCorrect: number
  totalWrong: number
  streak: number
  bestStreak: number
  sessionStarted: string
  questionsPassed: number
  currentStage: number
}

export interface Task5Settings {
  sound: boolean
  showExplanation: boolean
}

interface Task5State {
  questionProgress: Record<string, Task5Progress>
  stats: Task5Stats
  settings: Task5Settings
  currentQuestionId: string | null
  sessionQueue: string[]
  sessionIndex: number
  selectedSentence: number | null
  hasAnswered: boolean
  getNextQuestion: () => Task5Question | null
  answerQuestion: (questionId: string, selectedSentence: number) => { correct: boolean }
  startSession: () => void
  resetProgress: () => void
  resetQuestion: (questionId: string) => void
  updateSettings: (settings: Partial<Task5Settings>) => void
  getProgressForQuestion: (questionId: string) => Task5Progress
  getOverallProgress: () => { total: number; passed: number; deferred: number; newQuestions: number }
  setSelectedSentence: (sentence: number | null) => void
  clearAnswer: () => void
}

const QUESTIONS_PER_STAGE = 4

function getStageQuestions(stage: number): Task5Question[] {
  const start = stage * QUESTIONS_PER_STAGE
  const end = start + QUESTIONS_PER_STAGE
  return task5Questions.slice(start, end)
}

function getInitialStats(): Task5Stats {
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

function getDefaultSettings(): Task5Settings {
  return {
    sound: true,
    showExplanation: true,
  }
}

function getDefaultProgress(questionId: string): Task5Progress {
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

export const useTask5Store = create<Task5State>()(
  persist(
    (set, get) => ({
      questionProgress: {},
      stats: getInitialStats(),
      settings: getDefaultSettings(),
      currentQuestionId: null,
      sessionQueue: [],
      sessionIndex: 0,
      selectedSentence: null,
      hasAnswered: false,

      getNextQuestion: () => {
        const state = get()
        const { sessionQueue, sessionIndex } = state

        if (sessionQueue.length > 0 && sessionIndex < sessionQueue.length) {
          const qId = sessionQueue[sessionIndex]
          set({ currentQuestionId: qId, sessionIndex: sessionIndex + 1, selectedSentence: null, hasAnswered: false })
          return task5Questions.find(q => q.id === qId) || null
        }

        const currentStage = state.stats.currentStage
        const allIds = task5Questions.map(q => q.id)

        const passedIds = new Set(
          allIds.filter(id => (state.questionProgress[id]?.status || 'new') === 'passed')
        )

        const stageQuestions = getStageQuestions(currentStage)
        const stageNewIds = shuffleArray(
          stageQuestions
            .map(q => q.id)
            .filter(id => !passedIds.has(id) && (state.questionProgress[id]?.status || 'new') !== 'deferred')
        )

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

        const currDeferredIds = shuffleArray(
          stageQuestions
            .map(q => q.id)
            .filter(id => (state.questionProgress[id]?.status || 'new') === 'deferred')
        )

        const queue: string[] = [...stageNewIds, ...shuffledPrevDeferred, ...currDeferredIds]

        if (queue.length === 0) {
          const nextStage = currentStage + 1
          const nextStageQuestions = getStageQuestions(nextStage)
          if (nextStageQuestions.length === 0) {
            const anyDeferred = allIds.some(
              id => (state.questionProgress[id]?.status || 'new') === 'deferred'
            )
            if (anyDeferred) {
              const allDeferred = shuffleArray(
                allIds.filter(id => (state.questionProgress[id]?.status || 'new') === 'deferred')
              )
              set({ sessionQueue: allDeferred, sessionIndex: 1, currentQuestionId: allDeferred[0], selectedSentence: null, hasAnswered: false })
              return task5Questions.find(q => q.id === allDeferred[0]) || null
            }
            return null
          }
          set(prev => ({ stats: { ...prev.stats, currentStage: nextStage } }))
          return get().getNextQuestion()
        }

        set({ sessionQueue: queue, sessionIndex: 1, currentQuestionId: queue[0], selectedSentence: null, hasAnswered: false })
        return task5Questions.find(q => q.id === queue[0]) || null
      },

      answerQuestion: (questionId: string, selectedSentence: number) => {
        const question = task5Questions.find(q => q.id === questionId)
        if (!question) return { correct: false }

        const correct = selectedSentence === question.correctAnswer

        set(prev => {
          const existing = prev.questionProgress[questionId] || getDefaultProgress(questionId)
          let newStatus: QuestionStatus = existing.status
          if (correct) {
            newStatus = 'passed'
          } else if (existing.status !== 'passed') {
            newStatus = 'deferred'
          }
          const updated: Task5Progress = {
            ...existing,
            status: newStatus,
            totalCorrect: existing.totalCorrect + (correct ? 1 : 0),
            totalWrong: existing.totalWrong + (correct ? 0 : 1),
          }

          const newQueue = [...prev.sessionQueue]
          let newSessionIndex = prev.sessionIndex
          if (!correct) {
            const idx = newQueue.indexOf(questionId)
            if (idx !== -1) {
              newQueue.splice(idx, 1)
              if (idx < prev.sessionIndex) {
                newSessionIndex = prev.sessionIndex - 1
              }
            }
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
            sessionIndex: newSessionIndex,
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
          selectedSentence: null,
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
        const total = task5Questions.length
        const passed = Object.values(state.questionProgress).filter(p => p.status === 'passed').length
        const deferred = Object.values(state.questionProgress).filter(p => p.status === 'deferred').length
        const newQuestions = total - Object.keys(state.questionProgress).length
        return { total, passed, deferred, newQuestions }
      },

      setSelectedSentence: (sentence) => {
        set({ selectedSentence: sentence })
      },

      clearAnswer: () => {
        set({ selectedSentence: null, hasAnswered: false })
      },
    }),
    {
      name: 'task5-trainer-v1',
      partialize: (state) => ({
        questionProgress: state.questionProgress,
        stats: state.stats,
        settings: state.settings,
      }),
    }
  )
)

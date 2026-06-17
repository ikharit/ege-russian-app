// STOREV2
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { allAccentWords } from '../data/accentWords'

export interface WordProgress {
  wordId: string
  stars: number        // 0-5, +1 за правильный, -1 за неправильный
  totalCorrect: number
  totalWrong: number
}

export interface AccentTrainerStats {
  totalCorrect: number
  totalWrong: number
  streak: number
  bestStreak: number
  sessionStarted: string
  wordsMastered: number
  currentStage: number
}

export interface AccentTrainerSettings {
  sound: boolean
  changeBackground: boolean
  showExplanation: boolean
}

interface AccentTrainerState {
  wordProgress: Record<string, WordProgress>
  stats: AccentTrainerStats
  settings: AccentTrainerSettings
  currentWordId: string | null
  sessionQueue: string[]
  sessionIndex: number
  getNextWord: () => string | null
  answerWord: (wordId: string, correct: boolean) => void
  startSession: () => void
  resetProgress: () => void
  resetWord: (wordId: string) => void
  updateSettings: (settings: Partial<AccentTrainerSettings>) => void
  getProgressForWord: (wordId: string) => WordProgress
  getOverallProgress: () => { total: number; mastered: number; learning: number; newWords: number }
}

const WORDS_PER_STAGE = 30
const MAX_STARS = 5
const MIN_STARS = 0

function getStageWords(stage: number): typeof allAccentWords {
  const start = stage * WORDS_PER_STAGE
  const end = start + WORDS_PER_STAGE
  return allAccentWords.slice(start, end)
}

function getInitialProgress(): AccentTrainerStats {
  return {
    totalCorrect: 0,
    totalWrong: 0,
    streak: 0,
    bestStreak: 0,
    sessionStarted: new Date().toISOString(),
    wordsMastered: 0,
    currentStage: 0,
  }
}

function getDefaultSettings(): AccentTrainerSettings {
  return {
    sound: true,
    changeBackground: true,
    showExplanation: true,
  }
}

function getDefaultWordProgress(wordId: string): WordProgress {
  return {
    wordId,
    stars: 0,
    totalCorrect: 0,
    totalWrong: 0,
  }
}

export const useAccentTrainerStore = create<AccentTrainerState>()(
  persist(
    (set, get) => ({
      wordProgress: {},
      stats: getInitialProgress(),
      settings: getDefaultSettings(),
      currentWordId: null,
      sessionQueue: [],
      sessionIndex: 0,

      getNextWord: () => {
        const state = get()
        const { sessionQueue, sessionIndex } = state

        if (sessionQueue.length > 0 && sessionIndex < sessionQueue.length) {
          const wordId = sessionQueue[sessionIndex]
          set({ currentWordId: wordId, sessionIndex: sessionIndex + 1 })
          return wordId
        }

        const currentStage = state.stats.currentStage
        const stageWords = getStageWords(currentStage)
        const stageWordIds = stageWords.map(w => w.id)

        const currentStageQueue: string[] = []
        const stageProgress = stageWordIds.map(id => {
          const prog = state.wordProgress[id] || getDefaultWordProgress(id)
          return { id, stars: prog.stars }
        })

        const notMasteredInStage = stageProgress.filter(w => w.stars < MAX_STARS).map(w => w.id)
        currentStageQueue.push(...notMasteredInStage)

        const leakingWords: string[] = []
        for (let s = 0; s < currentStage; s++) {
          const prevStageWords = getStageWords(s)
          for (const w of prevStageWords) {
            const prog = state.wordProgress[w.id] || getDefaultWordProgress(w.id)
            if (prog.stars < MAX_STARS) {
              leakingWords.push(w.id)
            }
          }
        }

        for (let i = currentStageQueue.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[currentStageQueue[i], currentStageQueue[j]] = [currentStageQueue[j], currentStageQueue[i]]
        }

        for (let i = leakingWords.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[leakingWords[i], leakingWords[j]] = [leakingWords[j], leakingWords[i]]
        }

        const queue: string[] = []
        let currentIdx = 0
        let leakIdx = 0
        const alternateEvery = 3

        while (currentIdx < currentStageQueue.length || leakIdx < leakingWords.length) {
          for (let i = 0; i < alternateEvery && currentIdx < currentStageQueue.length; i++) {
            queue.push(currentStageQueue[currentIdx++])
          }
          if (leakIdx < leakingWords.length) {
            queue.push(leakingWords[leakIdx++])
          }
        }

        if (queue.length === 0) {
          const nextStage = currentStage + 1
          const nextStageWords = getStageWords(nextStage)
          if (nextStageWords.length === 0) {
            return null
          }
          set(prev => ({
            stats: { ...prev.stats, currentStage: nextStage },
          }))
          return get().getNextWord()
        }

        set({ sessionQueue: queue, sessionIndex: 0, currentWordId: queue[0] })
        return queue[0]
      },

      answerWord: (wordId: string, correct: boolean) => {
        set(prev => {
          const existing = prev.wordProgress[wordId] || getDefaultWordProgress(wordId)
          let newStars = existing.stars
          if (correct) {
            newStars = Math.min(MAX_STARS, newStars + 1)
          } else {
            newStars = Math.max(MIN_STARS, newStars - 1)
          }
          const updated: WordProgress = {
            ...existing,
            stars: newStars,
            totalCorrect: existing.totalCorrect + (correct ? 1 : 0),
            totalWrong: existing.totalWrong + (correct ? 0 : 1),
          }
          return {
            wordProgress: { ...prev.wordProgress, [wordId]: updated },
            stats: {
              ...prev.stats,
              totalCorrect: prev.stats.totalCorrect + (correct ? 1 : 0),
              totalWrong: prev.stats.totalWrong + (correct ? 0 : 1),
              streak: correct ? prev.stats.streak + 1 : 0,
              bestStreak: correct
                ? Math.max(prev.stats.bestStreak, prev.stats.streak + 1)
                : prev.stats.bestStreak,
              wordsMastered: Object.values({ ...prev.wordProgress, [wordId]: updated }).filter(
                p => p.stars >= MAX_STARS
              ).length,
            },
          }
        })
      },

      startSession: () => {
        const next = get().getNextWord()
        if (!next) {
          set({ currentWordId: null })
        }
      },

      resetProgress: () => {
        set({
          wordProgress: {},
          stats: getInitialProgress(),
          currentWordId: null,
          sessionQueue: [],
          sessionIndex: 0,
        })
      },

      resetWord: (wordId: string) => {
        set(prev => ({
          wordProgress: { ...prev.wordProgress, [wordId]: getDefaultWordProgress(wordId) },
        }))
      },

      updateSettings: (settings) => {
        set(prev => ({ settings: { ...prev.settings, ...settings } }))
      },

      getProgressForWord: (wordId: string) => {
        return get().wordProgress[wordId] || getDefaultWordProgress(wordId)
      },

      getOverallProgress: () => {
        const state = get()
        const total = allAccentWords.length
        const mastered = Object.values(state.wordProgress).filter(p => p.stars >= MAX_STARS).length
        const learning = Object.values(state.wordProgress).filter(
          p => p.stars > 0 && p.stars < MAX_STARS
        ).length
        const newWords = total - Object.keys(state.wordProgress).length
        return { total, mastered, learning, newWords }
      },
    }),
    {
      name: 'accent-trainer-v2',
      partialize: (state) => ({
        wordProgress: state.wordProgress,
        stats: state.stats,
        settings: state.settings,
      }),
    }
  )
)

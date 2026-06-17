import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { allAccentWords } from '../data/accentWords'

export interface WordProgress {
  wordId: string
  level: number          // 0-5 spaced repetition level (5 = mastered)
  errors: number         // сколько раз ошиблись
  lastShown: string      // ISO date
  correctStreak: number  // подряд правильных ответов
}

export interface AccentTrainerStats {
  totalCorrect: number
  totalWrong: number
  streak: number
  bestStreak: number
  sessionStarted: string
  wordsMastered: number
}

export interface AccentTrainerSettings {
  sound: boolean
  changeBackground: boolean
  showExplanation: boolean
}

interface AccentTrainerState {
  // Progress
  wordProgress: Record<string, WordProgress>
  stats: AccentTrainerStats
  settings: AccentTrainerSettings

  // Current session
  currentWordId: string | null
  sessionQueue: string[]        // очередь слов для текущей сессии
  sessionIndex: number
  hardWordsMode: boolean       // режим "сложных слов"

  // Actions
  getNextWord: () => string | null
  answerWord: (wordId: string, correct: boolean) => void
  startSession: (hardWordsOnly?: boolean) => void
  resetProgress: () => void
  resetWord: (wordId: string) => void
  updateSettings: (settings: Partial<AccentTrainerSettings>) => void
  getProgressForWord: (wordId: string) => WordProgress
  getHardWords: () => string[]
  getOverallProgress: () => { total: number; mastered: number; learning: number; newWords: number }
}

const MAX_LEVEL = 5
const NEW_WORD_PRIORITY = 10

function getInitialProgress(): AccentTrainerStats {
  return {
    totalCorrect: 0,
    totalWrong: 0,
    streak: 0,
    bestStreak: 0,
    sessionStarted: new Date().toISOString(),
    wordsMastered: 0,
  }
}

function getDefaultSettings(): AccentTrainerSettings {
  return {
    sound: true,
    changeBackground: true,
    showExplanation: true,
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
      hardWordsMode: false,

      getNextWord: () => {
        const state = get()
        const { sessionQueue, sessionIndex, hardWordsMode } = state

        // If we have a pre-built queue, use it
        if (sessionQueue.length > 0 && sessionIndex < sessionQueue.length) {
          const wordId = sessionQueue[sessionIndex]
          set({ currentWordId: wordId, sessionIndex: sessionIndex + 1 })
          return wordId
        }

        // Build new queue
        const pool = hardWordsMode
          ? get().getHardWords()
          : allAccentWords.map(w => w.id)

        if (pool.length === 0) return null

        // Filter out mastered words (unless in hard mode)
        const activePool = pool.filter(id => {
          const prog = state.wordProgress[id]
          if (!prog) return true
          if (hardWordsMode) return prog.errors > 0
          return prog.level < MAX_LEVEL
        })

        if (activePool.length === 0) {
          // All words mastered!
          return null
        }

        // Score each word: lower level = higher priority, errors = boost priority
        const scored = activePool.map(id => {
          const prog = state.wordProgress[id]
          let score = 0
          if (!prog) {
            score = NEW_WORD_PRIORITY + Math.random() * 5
          } else {
            score = (MAX_LEVEL - prog.level) * 2 + prog.errors * 3
            // Boost words that haven't been shown recently
            const hoursSinceLast = prog.lastShown
              ? (Date.now() - new Date(prog.lastShown).getTime()) / (1000 * 60 * 60)
              : 48
            score += Math.min(hoursSinceLast / 4, 5)
            // Randomize to avoid repetition
            score += Math.random() * 2
          }
          return { id, score }
        })

        scored.sort((a, b) => b.score - a.score)

        // Build a session queue of ~20 words
        const queueSize = Math.min(20, scored.length)
        const newQueue = scored.slice(0, queueSize).map(s => s.id)

        set({
          sessionQueue: newQueue,
          sessionIndex: 1,
          currentWordId: newQueue[0],
        })
        return newQueue[0]
      },

      answerWord: (wordId, correct) => {
        set((state) => {
          const existing = state.wordProgress[wordId]
          let newLevel = existing?.level ?? 0
          let newErrors = existing?.errors ?? 0
          let newCorrectStreak = existing?.correctStreak ?? 0

          if (correct) {
            newCorrectStreak += 1
            // Advance level on correct answers (streak-based)
            if (newCorrectStreak >= 2) {
              newLevel = Math.min(MAX_LEVEL, newLevel + 1)
              newCorrectStreak = 0
            }
          } else {
            newErrors += 1
            newCorrectStreak = 0
            // Drop level on error (but not below 0)
            newLevel = Math.max(0, newLevel - 1)
          }

          const newProgress: WordProgress = {
            wordId,
            level: newLevel,
            errors: newErrors,
            lastShown: new Date().toISOString(),
            correctStreak: newCorrectStreak,
          }

          const masteredDelta =
            (!existing || existing.level < MAX_LEVEL) && newLevel === MAX_LEVEL ? 1 : 0

          return {
            wordProgress: {
              ...state.wordProgress,
              [wordId]: newProgress,
            },
            stats: {
              ...state.stats,
              totalCorrect: state.stats.totalCorrect + (correct ? 1 : 0),
              totalWrong: state.stats.totalWrong + (correct ? 0 : 1),
              streak: correct ? state.stats.streak + 1 : 0,
              bestStreak: correct
                ? Math.max(state.stats.bestStreak, state.stats.streak + 1)
                : state.stats.bestStreak,
              wordsMastered: state.stats.wordsMastered + masteredDelta,
            },
          }
        })
      },

      startSession: (hardWordsOnly = false) => {
        set({
          sessionQueue: [],
          sessionIndex: 0,
          hardWordsMode: hardWordsOnly,
          stats: {
            ...get().stats,
            sessionStarted: new Date().toISOString(),
          },
        })
        get().getNextWord()
      },

      resetProgress: () => {
        set({
          wordProgress: {},
          stats: getInitialProgress(),
          sessionQueue: [],
          sessionIndex: 0,
        })
      },

      resetWord: (wordId: string) => {
        set((state) => {
          const { [wordId]: _, ...rest } = state.wordProgress
          return {
            wordProgress: rest,
            stats: {
              ...state.stats,
              wordsMastered: Math.max(0, state.stats.wordsMastered - (state.wordProgress[wordId]?.level === MAX_LEVEL ? 1 : 0)),
            },
          }
        })
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }))
      },

      getProgressForWord: (wordId) => {
        return get().wordProgress[wordId] || {
          wordId,
          level: 0,
          errors: 0,
          lastShown: '',
          correctStreak: 0,
        }
      },

      getHardWords: () => {
        return Object.entries(get().wordProgress)
          .filter(([, prog]) => prog.errors > 0)
          .sort((a, b) => b[1].errors - a[1].errors)
          .map(([id]) => id)
      },

      getOverallProgress: () => {
        const progress = get().wordProgress
        const total = allAccentWords.length
        let mastered = 0
        let learning = 0
        let newWords = 0

        for (const word of allAccentWords) {
          const prog = progress[word.id]
          if (!prog) {
            newWords += 1
          } else if (prog.level >= MAX_LEVEL) {
            mastered += 1
          } else {
            learning += 1
          }
        }

        return { total, mastered, learning, newWords }
      },
    }),
    {
      name: 'accent-trainer-storage',
    }
  )
)

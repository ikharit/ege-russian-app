import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import atomizedWords from '../data/atomization/atomizedWords.json'

export interface Flashcard {
  id: string
  front: string      // Вопрос / слово с пропуском
  back: string       // Правильный ответ
  explanation: string
  taskNumber: number
  atoms: string[]
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface CardState {
  nextReview: string      // ISO date
  interval: number        // days
  ease: number           // SM-2 ease factor
  repetitions: number    // successful reviews count
  lastReviewed: string   // ISO date
}

export interface FlashcardSession {
  cardId: string
  startTime: number
  endTime: number
  quality: 0 | 1 | 2 | 3 | 4 | 5  // SM-2: 0=again, 3=good, 4=easy, 5=perfect
}

interface FlashcardStore {
  cards: Record<string, CardState>
  sessions: FlashcardSession[]
  todayReviewed: number
  todayCorrect: number
  streak: number
  lastStudyDate: string

  // Actions
  getDueCards: (limit?: number) => Flashcard[]
  getAllCards: () => Flashcard[]
  getNewCards: (limit?: number) => Flashcard[]
  reviewCard: (cardId: string, quality: 0 | 1 | 2 | 3 | 4 | 5) => void
  getStats: () => { due: number; new: number; total: number; studiedToday: number }
  resetProgress: () => void
}

// Generate flashcards from atomized words
function generateCards(): Flashcard[] {
  const cards: Flashcard[] = []
  const seen = new Set<string>()

  for (const entry of atomizedWords.words) {
    if (entry.atoms.includes('unknown')) continue
    if (!entry.word || entry.word.length < 3) continue

    const id = `fc-${entry.word}`
    if (seen.has(id)) continue
    seen.add(id)

    // Front: word with hints
    const front = entry.explanation || entry.rawForm || entry.word

    cards.push({
      id,
      front: front.length > 100 ? entry.word : front,
      back: entry.word,
      explanation: entry.rule || entry.explanation || '',
      taskNumber: entry.taskNumber || 9,
      atoms: entry.atoms,
      difficulty: entry.difficulty as 'easy' | 'medium' | 'hard' || 'medium',
    })
  }

  return cards.slice(0, 500) // Limit to 500 for performance
}

export const allFlashcards = generateCards()

// SM-2 algorithm
function sm2(
  interval: number,
  ease: number,
  repetitions: number,
  quality: number
): { interval: number; ease: number; repetitions: number } {
  if (quality < 3) {
    // Failed: reset
    return { interval: 1, ease: Math.max(1.3, ease - 0.2), repetitions: 0 }
  }

  const newEase = Math.max(1.3, ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))

  let newInterval: number
  if (repetitions === 0) {
    newInterval = 1
  } else if (repetitions === 1) {
    newInterval = 6
  } else {
    newInterval = Math.round(interval * newEase)
  }

  return { interval: newInterval, ease: newEase, repetitions: repetitions + 1 }
}

export const useFlashcardStore = create<FlashcardStore>()(
  persist(
    (set, get) => ({
      cards: {},
      sessions: [],
      todayReviewed: 0,
      todayCorrect: 0,
      streak: 0,
      lastStudyDate: '',

      getDueCards: (limit = 20) => {
        const now = new Date()
        const today = now.toISOString().split('T')[0]
        const { cards } = get()

        return allFlashcards
          .filter((card) => {
            const state = cards[card.id]
            if (!state) return true // New card
            return state.nextReview <= today
          })
          .slice(0, limit)
      },

      getNewCards: (limit = 10) => {
        const { cards } = get()
        return allFlashcards
          .filter((card) => !cards[card.id])
          .slice(0, limit)
      },

      getAllCards: () => allFlashcards,

      reviewCard: (cardId: string, quality: 0 | 1 | 2 | 3 | 4 | 5) => {
        const now = new Date()
        const today = now.toISOString().split('T')[0]
        const { cards, sessions, lastStudyDate, streak, todayReviewed, todayCorrect } = get()

        const current = cards[cardId] || { interval: 0, ease: 2.5, repetitions: 0, nextReview: today, lastReviewed: '' }

        const result = sm2(current.interval, current.ease, current.repetitions, quality)

        const nextDate = new Date(now)
        nextDate.setDate(nextDate.getDate() + result.interval)

        const newCards = {
          ...cards,
          [cardId]: {
            interval: result.interval,
            ease: result.ease,
            repetitions: result.repetitions,
            nextReview: nextDate.toISOString().split('T')[0],
            lastReviewed: now.toISOString(),
          },
        }

        const newSessions = [...sessions, { cardId, startTime: Date.now() - 5000, endTime: Date.now(), quality }]

        // Update streak
        const isNewDay = lastStudyDate !== today
        const newStreak = isNewDay ? (lastStudyDate === getYesterday() ? streak + 1 : 1) : streak
        const newTodayReviewed = isNewDay ? 1 : todayReviewed + 1
        const newTodayCorrect = isNewDay
          ? (quality >= 3 ? 1 : 0)
          : todayCorrect + (quality >= 3 ? 1 : 0)

        set({
          cards: newCards,
          sessions: newSessions.slice(-1000), // Keep last 1000
          todayReviewed: newTodayReviewed,
          todayCorrect: newTodayCorrect,
          streak: newStreak,
          lastStudyDate: today,
        })
      },

      getStats: () => {
        const { cards, todayReviewed } = get()
        const today = new Date().toISOString().split('T')[0]

        const due = allFlashcards.filter((c) => {
          const s = cards[c.id]
          if (!s) return false
          return s.nextReview <= today
        }).length

        const newCards = allFlashcards.filter((c) => !cards[c.id]).length

        return { due, new: newCards, total: allFlashcards.length, studiedToday: todayReviewed }
      },

      resetProgress: () => set({ cards: {}, sessions: [], todayReviewed: 0, todayCorrect: 0, streak: 0, lastStudyDate: '' }),
    }),
    { name: 'ege-flashcard-storage' }
  )
)

function getYesterday(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

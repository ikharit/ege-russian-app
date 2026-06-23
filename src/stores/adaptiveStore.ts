import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface IRTItemState {
  questionId: string
  difficulty: number
  total: number
  correct: number
  correctRate: number
}

interface AdaptiveState {
  userAbility: number // theta, -3 to +3
  irtItems: Record<string, IRTItemState>
  bktMirror: Record<string, { pKnown: number; attempts: number; correctCount: number }>
  
  // Actions
  observeIRT: (questionId: string, correct: boolean) => void
  observeBKT: (atomId: string, correct: boolean) => void
  calibrateItem: (questionId: string, correctRate: number) => void
  getUserAbility: () => number
  getItemDifficulty: (questionId: string) => number
  getIRTProbability: (questionId: string) => number
  selectNextQuestion: (pool: string[], targetProbability?: number) => string | null
  getWeakAtoms: (threshold?: number) => { atomId: string; pKnown: number }[]
  getMasteredAtoms: (threshold?: number) => string[]
  getRecommendedAtoms: (limit?: number) => { atomId: string; pKnown: number; reason: string }[]
  reset: () => void
}

const DEFAULT_GUESS = 0.25
const DEFAULT_DISCRIMINATION = 1.0
const LEARNING_RATE = 0.15
const MIN_ABILITY = -3
const MAX_ABILITY = 3

function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z))
}

function probability(theta: number, difficulty: number): number {
  const exponent = -1.7 * DEFAULT_DISCRIMINATION * (theta - difficulty)
  return DEFAULT_GUESS + (1 - DEFAULT_GUESS) * sigmoid(exponent)
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val))
}

// BKT helper
const DEFAULT_P_L0 = 0.3
const DEFAULT_P_T = 0.3
const DEFAULT_P_G = 0.2
const DEFAULT_P_S = 0.1

function updateBKT(state: { pKnown: number; attempts: number; correctCount: number } | undefined, correct: boolean): { pKnown: number; attempts: number; correctCount: number } {
  if (!state) {
    state = { pKnown: DEFAULT_P_L0, attempts: 0, correctCount: 0 }
  }
  
  const { pKnown, pLearn, pGuess, pSlip } = {
    pKnown: state.pKnown,
    pLearn: DEFAULT_P_T,
    pGuess: DEFAULT_P_G,
    pSlip: DEFAULT_P_S,
  }
  
  const pCorrectIfKnown = correct ? (1 - pSlip) : pSlip
  const pCorrectIfUnknown = correct ? pGuess : (1 - pGuess)
  
  const pKnownAndObserved = pKnown * pCorrectIfKnown
  const pUnknownAndObserved = (1 - pKnown) * pCorrectIfUnknown
  const pObserved = pKnownAndObserved + pUnknownAndObserved
  
  let newPKnown = pKnownAndObserved / pObserved
  
  if (correct) {
    newPKnown = newPKnown + (1 - newPKnown) * pLearn
  }
  
  newPKnown = clamp(newPKnown, 0.01, 0.99)
  
  return {
    pKnown: newPKnown,
    attempts: state.attempts + 1,
    correctCount: state.correctCount + (correct ? 1 : 0),
  }
}

export const useAdaptiveStore = create<AdaptiveState>()(
  persist(
    (set, get) => ({
      userAbility: 0,
      irtItems: {},
      bktMirror: {},
      
      observeIRT: (questionId: string, correct: boolean) => {
        const { userAbility, irtItems } = get()
        const item = irtItems[questionId] || { questionId, difficulty: 0, total: 0, correct: 0, correctRate: 0.5 }
        
        // Update IRT item stats
        const newTotal = item.total + 1
        const newCorrect = item.correct + (correct ? 1 : 0)
        const newCorrectRate = newCorrect / newTotal
        
        // Recalibrate difficulty
        const newDifficulty = clamp(-Math.tanh((newCorrectRate - 0.5) * 4) * 3, -3, 3)
        
        // Update user ability (theta) using stochastic gradient ascent
        const p = probability(userAbility, item.difficulty)
        let newAbility = userAbility + LEARNING_RATE * ((correct ? 1 : 0) - p)
        newAbility = clamp(newAbility, MIN_ABILITY, MAX_ABILITY)
        
        set({
          userAbility: newAbility,
          irtItems: {
            ...irtItems,
            [questionId]: {
              ...item,
              total: newTotal,
              correct: newCorrect,
              correctRate: newCorrectRate,
              difficulty: newDifficulty,
            },
          },
        })
      },
      
      observeBKT: (atomId: string, correct: boolean) => {
        const { bktMirror } = get()
        const state = bktMirror[atomId]
        const updated = updateBKT(state, correct)
        
        set({
          bktMirror: {
            ...bktMirror,
            [atomId]: updated,
          },
        })
      },
      
      calibrateItem: (questionId: string, correctRate: number) => {
        const { irtItems } = get()
        const difficulty = clamp(-Math.tanh((correctRate - 0.5) * 4) * 3, -3, 3)
        
        set({
          irtItems: {
            ...irtItems,
            [questionId]: {
              ...(irtItems[questionId] || { questionId, total: 0, correct: 0, correctRate }),
              difficulty,
              correctRate,
            },
          },
        })
      },
      
      getUserAbility: () => get().userAbility,
      
      getItemDifficulty: (questionId: string) => {
        return get().irtItems[questionId]?.difficulty ?? 0
      },
      
      getIRTProbability: (questionId: string) => {
        const { userAbility, irtItems } = get()
        const item = irtItems[questionId]
        if (!item) return 0.5
        return probability(userAbility, item.difficulty)
      },
      
      selectNextQuestion: (pool: string[], targetProbability = 0.7) => {
        const { userAbility, irtItems } = get()
        if (pool.length === 0) return null
        
        let bestId: string | null = null
        let bestDiff = Infinity
        
        for (const qid of pool) {
          const item = irtItems[qid]
          const diff = item ? item.difficulty : 0
          const p = probability(userAbility, diff)
          const diffFromTarget = Math.abs(p - targetProbability)
          
          if (diffFromTarget < bestDiff) {
            bestDiff = diffFromTarget
            bestId = qid
          }
        }
        
        return bestId ?? pool[0]
      },
      
      getWeakAtoms: (threshold = 0.3) => {
        const { bktMirror } = get()
        return Object.entries(bktMirror)
          .filter(([_, state]) => state.pKnown < threshold)
          .map(([id, state]) => ({ atomId: id, pKnown: state.pKnown }))
          .sort((a, b) => a.pKnown - b.pKnown)
      },
      
      getMasteredAtoms: (threshold = 0.9) => {
        const { bktMirror } = get()
        return Object.entries(bktMirror)
          .filter(([_, state]) => state.pKnown >= threshold)
          .map(([id, _]) => id)
      },
      
      getRecommendedAtoms: (limit = 5) => {
        const weak = get().getWeakAtoms(0.3)
        return weak.slice(0, limit).map((w) => ({
          ...w,
          reason: `Вероятность знания: ${Math.round(w.pKnown * 100)}% — нужно повторить`,
        }))
      },
      
      reset: () => set({ userAbility: 0, irtItems: {}, bktMirror: {} }),
    }),
    { name: 'ege-adaptive-storage' }
  )
)

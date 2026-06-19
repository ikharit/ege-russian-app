// ─── Item Response Theory (IRT) 1PL / Rasch Model Engine ───

export interface IRTItem {
  questionId: string
  difficulty: number // -3 (easy) to +3 (hard), 0 = average
  discrimination: number // 1.0 for 1PL, fixed
  guessFactor: number // 0.25 for 4-option multiple choice
}

export interface IRTState {
  items: Record<string, IRTItem>
  userAbility: number // theta, -3 to +3
  updateAbility: (answers: { questionId: string; correct: boolean }[]) => void
  getQuestionProbability: (questionId: string) => number
  selectNextQuestion: (pool: string[], targetProbability?: number) => string | null
  calibrateDifficulty: (questionId: string, correctRate: number) => void
}

const DEFAULT_GUESS = 0.25
const DEFAULT_DISCRIMINATION = 1.0
const LEARNING_RATE = 0.1
const MIN_ABILITY = -3
const MAX_ABILITY = 3

function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z))
}

function probability(
  theta: number,
  difficulty: number,
  discrimination: number = DEFAULT_DISCRIMINATION,
  guess: number = DEFAULT_GUESS
): number {
  // Rasch / 1PL formula with guessing factor
  // P(correct) = guess + (1 - guess) / (1 + exp(-1.7 * a * (theta - b)))
  const exponent = -1.7 * discrimination * (theta - difficulty)
  return guess + (1 - guess) * sigmoid(exponent)
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val))
}

export function createIRTState(): IRTState {
  const items: Record<string, IRTItem> = {}
  let userAbility = 0

  return {
    items,
    get userAbility() {
      return userAbility
    },

    updateAbility(answers: { questionId: string; correct: boolean }[]) {
      for (const { questionId, correct } of answers) {
        const item = items[questionId]
        if (!item) continue
        const p = probability(userAbility, item.difficulty, item.discrimination, item.guessFactor)
        // Stochastic gradient ascent toward maximum likelihood
        userAbility += LEARNING_RATE * ((correct ? 1 : 0) - p)
        userAbility = clamp(userAbility, MIN_ABILITY, MAX_ABILITY)
      }
    },

    getQuestionProbability(questionId: string): number {
      const item = items[questionId]
      if (!item) return 0.5
      return probability(userAbility, item.difficulty, item.discrimination, item.guessFactor)
    },

    selectNextQuestion(pool: string[], targetProbability = 0.7): string | null {
      if (pool.length === 0) return null
      let bestId: string | null = null
      let bestDiff = Infinity
      for (const qid of pool) {
        const item = items[qid]
        if (!item) continue
        const p = probability(userAbility, item.difficulty, item.discrimination, item.guessFactor)
        const diff = Math.abs(p - targetProbability)
        if (diff < bestDiff) {
          bestDiff = diff
          bestId = qid
        }
      }
      // Fallback: if no calibrated items in pool, pick first
      return bestId ?? pool[0]
    },

    calibrateDifficulty(questionId: string, correctRate: number) {
      // correctRate: 0..1 proportion of students who answered correctly
      // If 70% correct => difficulty = -1 (easier than average)
      // If 30% correct => difficulty = +1 (harder than average)
      // Map: difficulty = -tanh((correctRate - 0.5) * 4) * 3, clamped
      const diff = clamp(-Math.tanh((correctRate - 0.5) * 4) * 3, -3, 3)
      items[questionId] = {
        questionId,
        difficulty: diff,
        discrimination: DEFAULT_DISCRIMINATION,
        guessFactor: DEFAULT_GUESS,
      }
    },
  }
}

// Singleton-like default export for adaptive engine usage
let globalIRT: IRTState | null = null
export function getGlobalIRT(): IRTState {
  if (!globalIRT) globalIRT = createIRTState()
  return globalIRT
}

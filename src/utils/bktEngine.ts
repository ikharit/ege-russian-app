// ─── Bayesian Knowledge Tracing (BKT) Engine ───
// Tracks P(knows atom) for each atom, updating after each answer.

export interface BKTAtomState {
  atomId: string
  pKnown: number // P(L) — probability the student knows this atom
  pLearn: number // P(T) — probability of learning it after attempt
  pGuess: number // P(G) — probability of guessing correctly
  pSlip: number // P(S) — probability of slipping (known but wrong)
  attempts: number
  correctCount: number
}

// Default BKT parameters (literature-backed defaults)
const DEFAULT_P_L0 = 0.3   // 30% chance student knows it initially
const DEFAULT_P_T = 0.3    // 30% chance of learning per attempt
const DEFAULT_P_G = 0.2    // 20% chance of guessing
const DEFAULT_P_S = 0.1    // 10% chance of slipping

const BKT_KEY = 'ege-bkt-state'

export class BKTEngine {
  private atoms: Map<string, BKTAtomState> = new Map()

  constructor() {
    this.load()
  }

  // ─── Persistence ───
  private load(): void {
    try {
      const raw = localStorage.getItem(BKT_KEY)
      if (raw) {
        const data = JSON.parse(raw) as Record<string, BKTAtomState>
        for (const [id, state] of Object.entries(data)) {
          this.atoms.set(id, state)
        }
      }
    } catch {}
  }

  private save(): void {
    try {
      const data: Record<string, BKTAtomState> = {}
      for (const [id, state] of this.atoms) {
        data[id] = state
      }
      localStorage.setItem(BKT_KEY, JSON.stringify(data))
    } catch {}
  }

  // ─── Core BKT update ───
  // After observing an answer (correct or wrong), update P(L)
  observe(atomId: string, correct: boolean): void {
    let state = this.atoms.get(atomId)
    if (!state) {
      state = {
        atomId,
        pKnown: DEFAULT_P_L0,
        pLearn: DEFAULT_P_T,
        pGuess: DEFAULT_P_G,
        pSlip: DEFAULT_P_S,
        attempts: 0,
        correctCount: 0,
      }
    }

    const { pKnown, pLearn, pGuess, pSlip } = state

    // 1. P(observed | known) and P(observed | not known)
    const pCorrectIfKnown = correct ? (1 - pSlip) : pSlip
    const pCorrectIfUnknown = correct ? pGuess : (1 - pGuess)

    // 2. Bayesian update: P(known | observed)
    const pKnownAndObserved = pKnown * pCorrectIfKnown
    const pUnknownAndObserved = (1 - pKnown) * pCorrectIfUnknown
    const pObserved = pKnownAndObserved + pUnknownAndObserved

    let newPKnown = pKnownAndObserved / pObserved

    // 3. Learning update: if they got it right, chance they learned it
    if (correct) {
      // P(learned | observed) = P(known | observed) + (1 - P(known | observed)) * P(T)
      newPKnown = newPKnown + (1 - newPKnown) * pLearn
    }

    // Clamp
    newPKnown = Math.max(0.01, Math.min(0.99, newPKnown))

    state.pKnown = newPKnown
    state.attempts += 1
    if (correct) state.correctCount += 1

    // Adapt pLearn and pSlip based on empirical data (simplified)
    if (state.attempts > 5) {
      const empiricalAcc = state.correctCount / state.attempts
      // If empirical accuracy > 0.9 but pKnown < 0.8, increase pLearn
      if (empiricalAcc > 0.9 && state.pKnown < 0.8) {
        state.pLearn = Math.min(0.8, state.pLearn + 0.05)
      }
      // If empirical accuracy < 0.5 but pKnown > 0.5, increase pSlip
      if (empiricalAcc < 0.5 && state.pKnown > 0.5) {
        state.pSlip = Math.min(0.3, state.pSlip + 0.02)
      }
    }

    this.atoms.set(atomId, state)
    this.save()
  }

  // ─── Queries ───
  getKnowledge(atomId: string): number {
    return this.atoms.get(atomId)?.pKnown ?? DEFAULT_P_L0
  }

  getWeakAtoms(threshold = 0.3): { atomId: string; pKnown: number }[] {
    return Array.from(this.atoms.entries())
      .filter(([_, state]) => state.pKnown < threshold)
      .map(([id, state]) => ({ atomId: id, pKnown: state.pKnown }))
      .sort((a, b) => a.pKnown - b.pKnown)
  }

  getAllAtoms(): BKTAtomState[] {
    return Array.from(this.atoms.values())
  }

  getMasteredAtoms(threshold = 0.9): string[] {
    return Array.from(this.atoms.entries())
      .filter(([_, state]) => state.pKnown >= threshold)
      .map(([id, _]) => id)
  }

  // ─── Recommendation ───
  getRecommendedLesson(): { atomId: string; reason: string } | null {
    const weak = this.getWeakAtoms(0.3)
    if (weak.length === 0) return null
    const top = weak[0]
    return {
      atomId: top.atomId,
      reason: `Вероятность знания ${Math.round(top.pKnown * 100)}% — рекомендуется урок по атому «${top.atomId}»`,
    }
  }
}

// Singleton
let globalBKT: BKTEngine | null = null
export function getGlobalBKT(): BKTEngine {
  if (!globalBKT) globalBKT = new BKTEngine()
  return globalBKT
}

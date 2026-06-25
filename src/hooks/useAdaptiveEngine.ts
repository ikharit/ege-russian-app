import { useState, useEffect } from 'react'
import { useAdaptiveStore } from '../stores/adaptiveStore'

interface AdaptiveQuestion {
  id: string
  atoms?: string[]
}

/**
 * Invisible adaptive engine hook.
 * Every trainer/exam/practice that uses this hook gets IRT+BKT automatically,
 * with no UI exposed to the user.
 *
 * Usage:
 *   const { questionOrder, observeAnswer } = useAdaptiveEngine(questions, '5')
 *   const current = questions.find(q => q.id === questionOrder[index])
 *   // on answer:
 *   observeAnswer(question.id, isCorrect, question.atoms)
 */
export function useAdaptiveEngine<T extends AdaptiveQuestion>(
  questions: T[],
  taskNumber: string,
  enabled = true
) {
  const observeIRT = useAdaptiveStore((s) => s.observeIRT)
  const observeBKT = useAdaptiveStore((s) => s.observeBKT)
  const selectNextQuestion = useAdaptiveStore((s) => s.selectNextQuestion)

  const [questionOrder] = useState(() => {
    if (!enabled) return questions.map((q) => q.id)
    const pool = new Set(questions.map((q) => q.id))
    const ordered: string[] = []
    while (pool.size > 0) {
      const next = selectNextQuestion(Array.from(pool), 0.7)
      if (!next) break
      ordered.push(next)
      pool.delete(next)
    }
    return ordered.length > 0 ? ordered : questions.map((q) => q.id)
  })

  // Register all questions with the adaptive store
  useEffect(() => {
    if (!enabled) return
    for (const q of questions) {
      useAdaptiveStore.getState().calibrateItem(q.id, 0.5)
    }
  }, [questions, enabled])

  const observeAnswer = (questionId: string, correct: boolean, atoms?: string[]) => {
    if (!enabled) return
    observeIRT(questionId, correct)
    const effectiveAtoms = atoms || [`task${taskNumber}`]
    for (const atom of effectiveAtoms) {
      observeBKT(atom, correct)
    }
  }

  return {
    questionOrder,
    observeAnswer,
  }
}

export default useAdaptiveEngine

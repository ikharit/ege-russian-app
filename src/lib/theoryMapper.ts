import { TheoryLesson, getTheoryByTaskNumber } from '../data/theoryData'

/**
 * Extracts task number from a lesson ID.
 * Examples:
 *   lesson-orth-9-1     → "9"
 *   lesson-atom-10-1    → "10"
 *   lesson-task22-1     → "22"
 *   lesson-task27-1     → "Сочинение"
 */
export function extractTaskNumber(lessonId: string): string | null {
  // Special case: task 27 maps to essay (Сочинение)
  if (lessonId.includes('task27')) return 'Сочинение'

  // Try to extract the first number after known prefixes
  const match = lessonId.match(/(?:orth|atom|gram|nnn|punct|task|text)-?(\d+)/)
  if (match) return match[1]

  // Fallback: any number in the ID
  const fallback = lessonId.match(/(\d+)/)
  return fallback ? fallback[1] : null
}

export function getTheoryForLesson(lessonId: string): TheoryLesson | undefined {
  const taskNumber = extractTaskNumber(lessonId)
  if (!taskNumber) return undefined
  return getTheoryByTaskNumber(taskNumber)
}

export function hasTheory(lessonId: string): boolean {
  return !!getTheoryForLesson(lessonId)
}

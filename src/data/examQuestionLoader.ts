import { Question } from '../types'
import { getQuestionsForTask } from './fipiVariants'
import { allAccentWords } from './accentWords'
import { task5Questions } from './task5Questions'
import { task6Questions } from './task6Questions'
import { task7Questions } from './task7Questions'
import { task8Questions } from './task8Questions'
import { task9Questions } from './task9Questions'
import { task10Questions } from './task10Questions'
import { task11Questions } from './task11Questions'
import { task12Questions } from './task12Questions'
import { task13Questions } from './task13Questions'
import { task14Questions } from './task14Questions'
import { task15Questions } from './task15Questions'
import { task16Questions } from './task16Questions'

const dataSourceMap: Record<string, unknown[]> = {
  accent: allAccentWords,
  task5: task5Questions,
  task6: task6Questions,
  task7: task7Questions,
  task8: task8Questions,
  task9: task9Questions,
  task10: task10Questions,
  task11: task11Questions,
  task12: task12Questions,
  task13: task13Questions,
  task14: task14Questions,
  task15: task15Questions,
  task16: task16Questions,
}

export function loadQuestionsForTask(
  variantId: string,
  taskNumber: number,
  dataSource: string,
  count: number
): Question[] {
  const allQuestions = dataSourceMap[dataSource] || []
  const raw = getQuestionsForTask(variantId, taskNumber, allQuestions, count)

  if (dataSource === 'accent') {
    return raw.map((q: any) => ({
      id: q.id,
      type: 'text' as const,
      text: `Выберите ударную букву в слове: ${q.word}`,
      correctAnswer: [q.normalized[q.stressIndex]],
      explanation: q.explanation,
      difficulty: q.difficulty,
      xpReward: 5,
      atoms: [`task${taskNumber}`],
    }))
  }

  if (dataSource === 'task5') {
    return raw.map((q: any) => {
      const errorSentence = q.sentences.find((s: any) => s.isError)
      return {
        id: q.id,
        type: 'single' as const,
        text: 'В одном из приведённых ниже предложений неверно употреблено выделенное слово. Найдите это предложение.',
        options: q.sentences.map((s: any) => s.text),
        correctAnswer: errorSentence ? [errorSentence.text] : [],
        explanation: q.explanation,
        difficulty: 'medium' as const,
        xpReward: 5,
        atoms: ['task5'],
      }
    })
  }

  if (dataSource === 'task10') {
    return raw.map((q: any) => {
      const correctRows = q.rows.filter((r: any) => q.correctAnswers.includes(r.id))
      return {
        id: q.id,
        type: 'ege-multiple' as const,
        text: 'Укажите ряды, в которых во всех словах пропущена одна и та же буква.',
        options: q.rows.map((r: any) => r.words.join(', ')),
        correctAnswer: correctRows.map((r: any) => r.words.join(', ')),
        explanation: q.explanation,
        difficulty: 'hard' as const,
        xpReward: 5,
        atoms: ['task10'],
      }
    })
  }

  if (dataSource === 'task16') {
    return raw.map((q: any) => {
      const correctSentence = q.sentences.find((s: any) => s.id === q.correctAnswer)
      return {
        id: q.id,
        type: 'single' as const,
        text: q.instruction,
        options: q.sentences.map((s: any) => s.text),
        correctAnswer: correctSentence ? [correctSentence.text] : [],
        explanation: q.explanation,
        difficulty: 'hard' as const,
        xpReward: 5,
        atoms: ['task16'],
      }
    })
  }

  // Default: SimpleQuestion
  return raw.map((q: any) => ({
    id: q.id,
    type: 'single' as const,
    text: q.text,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    difficulty: 'medium' as const,
    xpReward: 5,
    atoms: [`task${taskNumber}`],
  }))
}

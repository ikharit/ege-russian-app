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
import { task17Questions } from './task17Questions'

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
  task17: task17Questions,
}

interface AccentQuestion {
  id: string
  word: string
  normalized: string
  stressIndex: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

interface Task5Sentence {
  id: number
  text: string
  isError: boolean
}

interface Task5Question {
  id: string
  sentences: Task5Sentence[]
  explanation: string
}

interface Task10Row {
  id: number
  words: string[]
}

interface Task10Question {
  id: string
  rows: Task10Row[]
  correctAnswers: number[]
  explanation: string
}

interface Task16Sentence {
  id: number
  text: string
}

interface Task16Question {
  id: string
  instruction: string
  sentences: Task16Sentence[]
  correctAnswer: number
  explanation: string
}

interface SimpleQuestion {
  id: string
  text: string
  options: string[]
  correctAnswer: string[]
  explanation: string
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
    return (raw as AccentQuestion[]).map((q) => ({
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
    return (raw as Task5Question[]).map((q) => {
      const errorSentence = q.sentences.find((s) => s.isError)
      return {
        id: q.id,
        type: 'single' as const,
        text: 'В одном из приведённых ниже предложений неверно употреблено выделенное слово. Найдите это предложение.',
        options: q.sentences.map((s) => s.text),
        correctAnswer: errorSentence ? [errorSentence.text] : [],
        explanation: q.explanation,
        difficulty: 'medium' as const,
        xpReward: 5,
        atoms: ['task5'],
      }
    })
  }

  if (dataSource === 'task10') {
    return (raw as Task10Question[]).map((q) => {
      const correctRows = q.rows.filter((r) => q.correctAnswers.includes(r.id))
      return {
        id: q.id,
        type: 'ege-multiple' as const,
        text: 'Укажите ряды, в которых во всех словах пропущена одна и та же буква.',
        options: q.rows.map((r) => r.words.join(', ')),
        correctAnswer: correctRows.map((r) => r.words.join(', ')),
        explanation: q.explanation,
        difficulty: 'hard' as const,
        xpReward: 5,
        atoms: ['task10'],
      }
    })
  }

  if (dataSource === 'task16') {
    return (raw as Task16Question[]).map((q) => {
      const correctSentence = q.sentences.find((s) => s.id === q.correctAnswer)
      return {
        id: q.id,
        type: 'single' as const,
        text: q.instruction,
        options: q.sentences.map((s) => s.text),
        correctAnswer: correctSentence ? [correctSentence.text] : [],
        explanation: q.explanation,
        difficulty: 'hard' as const,
        xpReward: 5,
        atoms: ['task16'],
      }
    })
  }

  // Default: SimpleQuestion
  return (raw as SimpleQuestion[]).map((q) => ({
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

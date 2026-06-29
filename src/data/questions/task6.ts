import type { UnifiedQuestion } from './types'
import { task6DooshinQuestions } from './task6_dooshin'

export const task6Questions: UnifiedQuestion[] = [
  ...task6DooshinQuestions,
  {
    id: 'q6-1',
    taskNumber: '6',
//
// 📋 ПРАВИЛО ДЛЯ АГЕНТОВ: Если создашь временные файлы или устаревшие
// адаптеры — УДАЛИ их или перемести в workspace/archive/ege-app/
//
    type: 'single',
    text: 'Какая ошибка в предложении: «Бесплатный подарок»?',
    options: ['плеоназм', 'тавтология', 'лексическая сочетаемость', 'нет ошибки'],
    correctAnswer: ['плеоназм'],
    explanation: '«Бесплатный подарок» — плеоназм (подарок и так бесплатный).',
    difficulty: 'easy',
    xpReward: 10,
    atoms: ['task6', 'pleonasm'],
    tags: ['pleonasm', 'task6'],
  }
]

export const task6QuestionsById = Object.fromEntries(
  task6Questions.map((q) => [q.id, q])
)

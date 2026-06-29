import type { UnifiedQuestion } from './types'

export const task6Questions: UnifiedQuestion[] = [
  {
    id: 'q6-1',
    taskNumber: '6',
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

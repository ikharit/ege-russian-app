import type { UnifiedQuestion } from './types'

export const task8Questions: UnifiedQuestion[] = [
  {
    id: 'q8-1',
    taskNumber: '8',
    type: 'single',
    text: 'Какая ошибка в предложении: «Он купил яблоки, груши и хлеб.»?',
    options: ['нарушение однородности', 'нет ошибки', 'плеоназм', 'тавтология'],
    correctAnswer: ['нет ошибки'],
    explanation: 'Яблоки, груши и хлеб — однородные существительные.',
    difficulty: 'easy',
    xpReward: 10,
    atoms: ['task8'],
    tags: ['task8'],
  }
]

export const task8QuestionsById = Object.fromEntries(
  task8Questions.map((q) => [q.id, q])
)

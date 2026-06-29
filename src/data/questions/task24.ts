import type { UnifiedQuestion } from './types'

export const task24Questions: UnifiedQuestion[] = [
  {
    id: 'q24-1',
    taskNumber: '24',
    type: 'single',
    text: 'Какой тип информации: «Автор считает, что это важно»?',
    options: ['оценочная', 'фактографическая', 'основная', 'дополнительная'],
    correctAnswer: ['оценочная'],
    explanation: '«Считает, что это важно» — оценка, отношение автора.',
    difficulty: 'easy',
    xpReward: 10,
    atoms: ['task24', 'information_types'],
    tags: ['information_types', 'task24'],
  }
]

export const task24QuestionsById = Object.fromEntries(
  task24Questions.map((q) => [q.id, q])
)

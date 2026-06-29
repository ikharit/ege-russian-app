import type { UnifiedQuestion } from './types'

export const task26Questions: UnifiedQuestion[] = [
  {
    id: 'q26-1',
    taskNumber: '26',
    type: 'single',
    text: 'Какой тип связи: «Во-первых... Во-вторых...»?',
    options: ['перечислительная', 'причинно-следственная', 'противопоставительная', 'пояснительная'],
    correctAnswer: ['перечислительная'],
    explanation: '«Во-первых... Во-вторых» — перечислительная связь.',
    difficulty: 'easy',
    xpReward: 10,
    atoms: ['task26', 'text_connections'],
    tags: ['task26', 'text_connections'],
  }
]

export const task26QuestionsById = Object.fromEntries(
  task26Questions.map((q) => [q.id, q])
)

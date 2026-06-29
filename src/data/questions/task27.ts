import type { UnifiedQuestion } from './types'

export const task27Questions: UnifiedQuestion[] = [
  {
    id: 'q27-1',
    taskNumber: '27',
    type: 'single',
    text: 'Какой объём сочинения требуется?',
    options: ['150-250 слов', 'не менее 200 слов', '100-150 слов', 'не менее 300 слов'],
    correctAnswer: ['не менее 200 слов'],
    explanation: 'Согласно критериям, сочинение должно быть не менее 200 слов.',
    difficulty: 'easy',
    xpReward: 10,
    atoms: ['task27', 'essay'],
    tags: ['essay', 'task27'],
  }
]

export const task27QuestionsById = Object.fromEntries(
  task27Questions.map((q) => [q.id, q])
)

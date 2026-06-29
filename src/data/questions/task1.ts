import type { UnifiedQuestion } from './types'

export const task1Questions: UnifiedQuestion[] = [
  {
    id: 'q1-1',
    taskNumber: '1',
    type: 'single',
    text: 'Какой тип связи между предложениями? «Дождь шёл всю ночь. Поэтому утром воздух был свежим.»',
    options: ['причинно-следственная', 'противопоставительная', 'пояснительная', 'перечислительная'],
    correctAnswer: ['причинно-следственная'],
    explanation: 'Союз «поэтому» указывает на причинно-следственную связь.',
    difficulty: 'easy',
    xpReward: 10,
    atoms: ['task1', 'text_connections'],
    tags: ['task1', 'text_connections'],
  }
]

export const task1QuestionsById = Object.fromEntries(
  task1Questions.map((q) => [q.id, q])
)

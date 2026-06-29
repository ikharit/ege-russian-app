import type { UnifiedQuestion } from './types'

export const task22Questions: UnifiedQuestion[] = [
  {
    id: 'q22-1',
    taskNumber: '22',
    type: 'single',
    text: 'Какое средство выразительности использовано: «Ветер пел свою печальную песню»?',
    options: ['олицетворение', 'метафора', 'сравнение', 'эпитет'],
    correctAnswer: ['олицетворение'],
    explanation: 'Ветер «пел» — приписание человеческого действия неодушевлённому предмету.',
    difficulty: 'easy',
    xpReward: 10,
    atoms: ['task22', 'tropes'],
    tags: ['task22', 'tropes'],
  }
]

export const task22QuestionsById = Object.fromEntries(
  task22Questions.map((q) => [q.id, q])
)

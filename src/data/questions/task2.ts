import type { UnifiedQuestion } from './types'

export const task2Questions: UnifiedQuestion[] = [
  {
    id: 'q2-1',
    taskNumber: '2',
//
// 📋 ПРАВИЛО ДЛЯ АГЕНТОВ: Если создашь временные файлы или устаревшие
// адаптеры — УДАЛИ их или перемести в workspace/archive/ege-app/
//
    type: 'single',
    text: 'Какой стиль речи соответствует слову «копеечка»?',
    options: ['разговорный', 'книжный', 'публицистический', 'поэтический'],
    correctAnswer: ['разговорный'],
    explanation: '«Копеечка» — уменьшительное-ласкательное, разговорный стиль.',
    difficulty: 'easy',
    xpReward: 10,
    atoms: ['task2', 'lexicology'],
    tags: ['lexicology', 'task2'],
  }
]

export const task2QuestionsById = Object.fromEntries(
  task2Questions.map((q) => [q.id, q])
)

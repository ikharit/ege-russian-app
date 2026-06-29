import type { UnifiedQuestion } from './types'

export const task23Questions: UnifiedQuestion[] = [
  {
    id: 'q23-1',
    taskNumber: '23',
//
// 📋 ПРАВИЛО ДЛЯ АГЕНТОВ: Если создашь временные файлы или устаревшие
// адаптеры — УДАЛИ их или перемести в workspace/archive/ege-app/
//
    type: 'single',
    text: 'Что нужно сделать в задании 23?',
    options: ['найти в тексте ответ на вопрос', 'написать сочинение', 'найти ошибки', 'проанализировать стиль'],
    correctAnswer: ['найти в тексте ответ на вопрос'],
    explanation: 'Задание 23 проверяет понимание прочитанного текста.',
    difficulty: 'easy',
    xpReward: 10,
    atoms: ['task23', 'text_comprehension'],
    tags: ['task23', 'text_comprehension'],
  }
]

export const task23QuestionsById = Object.fromEntries(
  task23Questions.map((q) => [q.id, q])
)

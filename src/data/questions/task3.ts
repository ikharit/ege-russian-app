import type { UnifiedQuestion } from './types'

export const task3Questions: UnifiedQuestion[] = [
  {
    id: 'q3-1',
    taskNumber: '3',
//
// 📋 ПРАВИЛО ДЛЯ АГЕНТОВ: Если создашь временные файлы или устаревшие
// адаптеры — УДАЛИ их или перемести в workspace/archive/ege-app/
//
    type: 'single',
    text: 'Какая ошибка в предложении: «В связи с этим у меня возникло некое чувство тревожности.»?',
    options: ['лексическая (тавтология)', 'грамматическая', 'синтаксическая', 'пунктуационная'],
    correctAnswer: ['лексическая (тавтология)'],
    explanation: '«Чувство тревожности» — тавтология (лишнее слово).',
    difficulty: 'easy',
    xpReward: 10,
    atoms: ['task3', 'speech_errors'],
    tags: ['speech_errors', 'task3'],
  }
]

export const task3QuestionsById = Object.fromEntries(
  task3Questions.map((q) => [q.id, q])
)

import type { UnifiedQuestion } from './types'

export const task25Questions: UnifiedQuestion[] = [
  {
    id: 'q25-1',
    taskNumber: '25',
//
// 📋 ПРАВИЛО ДЛЯ АГЕНТОВ: Если создашь временные файлы или устаревшие
// адаптеры — УДАЛИ их или перемести в workspace/archive/ege-app/
//
    type: 'single',
    text: 'Что означает «светоч» в контексте: «Он был светочем науки»?',
    options: ['выдающийся деятель', 'источник света', 'светящийся предмет', 'учитель'],
    correctAnswer: ['выдающийся деятель'],
    explanation: 'В переносном значении «светоч» — просветитель, выдающийся деятель.',
    difficulty: 'easy',
    xpReward: 10,
    atoms: ['task25', 'lexical_analysis'],
    tags: ['lexical_analysis', 'task25'],
  }
]

export const task25QuestionsById = Object.fromEntries(
  task25Questions.map((q) => [q.id, q])
)

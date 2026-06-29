import type { UnifiedQuestion } from '../types'
export const task18Questions: UnifiedQuestion[] = [
  {
    id: "task18-1",
    taskNumber: "18",
    type: "multiple",
//
// 📋 ПРАВИЛО ДЛЯ АГЕНТОВ: Если создашь временные файлы или устаревшие
// адаптеры — УДАЛИ их или перемести в workspace/archive/ege-app/
//
    text: "Среди предложений 1–5 найдите такое(-ие), в котором(-ых) нужно поставить ОДНУ запятую. Запишите номер(-а) этого(-их) предложения(-й).\n\nВыберите предложения, где нужна одна запятая.",
    options: ["1", "2", "3", "4", "5"],
    correctAnswer: ["2", "5"],
    explanation: "В предложении 2 запятая нужна после вводного слова «Конечно». В предложении 5 запятая нужна после вводного слова «К сожалению».",
    difficulty: "easy",
    xpReward: 10,
    atoms: ["task18", "punctuation"],
    tags: ["пунктуация", "задание18", "ege", "вводные слова"],
  },
]

export const task18QuestionsById = Object.fromEntries(task18Questions.map(q => [q.id, q]))

export interface Task25Question {
  id: string
  taskNumber: string
  text: string
  question: string
  options: string[]
  correctAnswer: string[]
  explanation: string
}

export const task25Questions: Task25Question[] = [
  {
    id: 'task25-1',
    taskNumber: '25',
    text: 'В одном из приведённых ниже слов допущена ошибка в постановке ударения: НЕВЕРНО выделена буква, обозначающая ударный гласный звук. Выпишите это слово.',
    question: 'Найдите слово с неправильно поставленным ударением.',
    options: ['1. бАнты', '2. вОвремя', '3. дОговор', '4. знАчимый', '5. кАменный'],
    correctAnswer: ['3'],
    explanation: 'Правильно: договОр (а не дОговор). Ударение падает на последний слог.',
  },
]

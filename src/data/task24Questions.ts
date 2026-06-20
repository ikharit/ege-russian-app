export interface Task24Question {
  id: string
  taskNumber: string
  text: string
  question: string
  options: string[]
  correctAnswer: string[]
  explanation: string
}

export const task24Questions: Task24Question[] = [
  {
    id: 'task24-1',
    taskNumber: '24',
    text: 'Прочитайте текст и выполните задание.',
    question: 'Определите, к какому типу речи относится данный текст.',
    options: ['1. Описание', '2. Рассуждение', '3. Повествование', '4. Суждение'],
    correctAnswer: ['2'],
    explanation: 'Текст содержит аргументы, примеры и вывод — признаки рассуждения.',
  },
]

export interface Task3Question {
  id: string
  taskNumber: string
  text: string
  question: string
  options: string[]
  correctAnswer: string[]
  explanation: string
}

export const task3Questions: Task3Question[] = [
  {
    id: 'task3-1',
    taskNumber: '3',
    text: 'Укажите варианты ответов, в которых в обоих словах ряда пропущена одна и та же буква. Запишите номера ответов.',
    question: 'Выберите ряды, где пропущена одна и та же буква.',
    options: ['1. откАзать/откАзаться', '2. плЕсти/плЕтение', '3. вырАсти/вырАщивать', '4. звОнить/звОнкий', '5. клАняться/клАниться'],
    correctAnswer: ['1', '3'],
    explanation: 'В варианте 1 — буква А (откАзать/откАзаться). В варианте 3 — буква А (вырАсти/вырАщивать). В остальных вариантах разные буквы.',
  },
]

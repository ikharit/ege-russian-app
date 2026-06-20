export interface Task22Question {
  id: string
  taskNumber: string
  text: string
  question: string
  options: string[]
  correctAnswer: string[]
  explanation: string
}

export const task22Questions: Task22Question[] = [
  {
    id: 'task22-1',
    taskNumber: '22',
    text: 'Прочитайте отрывок из сказки и выполните задание.',
    question: 'Укажите, какие средства выразительности использованы в предложении «Лес стоял в дымке, застыв в немом ожидании».',
    options: ['1. Эпитет, олицетворение', '2. Метафора, сравнение', '3. Олицетворение, гипербола', '4. Антитеза, эпитет'],
    correctAnswer: ['1'],
    explanation: '«Немое ожидание» — олицетворение (человеческое качество приписано лесу). «Дымка» — эпитет (признак, подчёркивающий атмосферу).',
  },
]

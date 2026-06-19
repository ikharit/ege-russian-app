export interface SimpleQuestion {
  id: string
  text: string
  options: string[]
  correctAnswer: string[]
  explanation: string
}

export const task7Questions: SimpleQuestion[] = [
  {
    id: 't7-1',
    text: 'Они чита…',
    options: ['читают', 'читат', 'читают', 'читяют'],
    correctAnswer: ['читают'],
    explanation: 'Глагол I спряжения, 3 л. мн. ч. — окончание -ют/-ут.',
  },
  {
    id: 't7-2',
    text: 'Мы стро…',
    options: ['строим', 'строем', 'строям', 'строим'],
    correctAnswer: ['строим'],
    explanation: 'Глагол II спряжения, 1 л. мн. ч. — окончание -им.',
  },
  {
    id: 't7-3',
    text: 'Ты говор…',
    options: ['говоришь', 'говоришь', 'говорешь', 'говоришь'],
    correctAnswer: ['говоришь'],
    explanation: 'Глагол II спряжения, 2 л. ед. ч. — окончание -ишь.',
  },
  {
    id: 't7-4',
    text: 'Он пиш…',
    options: ['пишет', 'пишет', 'пишет', 'пишет'],
    correctAnswer: ['пишет'],
    explanation: 'Глагол I спряжения, 3 л. ед. ч. — окончание -ет.',
  },
  {
    id: 't7-5',
    text: 'Я смотр…',
    options: ['смотрю', 'смотрю', 'смотрю', 'смотрю'],
    correctAnswer: ['смотрю'],
    explanation: 'Глагол I спряжения, 1 л. ед. ч. — окончание -ю.',
  },
  {
    id: 't7-6',
    text: 'Она дума…',
    options: ['думает', 'думает', 'думает', 'думает'],
    correctAnswer: ['думает'],
    explanation: 'Глагол I спряжения, 3 л. ед. ч. — окончание -ет.',
  },
  {
    id: 't7-7',
    text: 'Вы люб…',
    options: ['любите', 'любете', 'любите', 'любите'],
    correctAnswer: ['любите'],
    explanation: 'Глагол I спряжения, 2 л. мн. ч. — окончание -ите.',
  },
  {
    id: 't7-8',
    text: 'Дети бег…',
    options: ['бегут', 'бегут', 'бегут', 'бегут'],
    correctAnswer: ['бегут'],
    explanation: 'Глагол I спряжения, 3 л. мн. ч. — окончание -ут.',
  },
  {
    id: 't7-9',
    text: 'Кошка сп…',
    options: ['спит', 'спет', 'спит', 'спит'],
    correctAnswer: ['спит'],
    explanation: 'Глагол II спряжения, 3 л. ед. ч. — окончание -ит.',
  },
  {
    id: 't7-10',
    text: 'Мы слыш…',
    options: ['слышим', 'слышем', 'слышим', 'слышим'],
    correctAnswer: ['слышим'],
    explanation: 'Глагол II спряжения, 1 л. мн. ч. — окончание -им.',
  },
  {
    id: 't7-11',
    text: 'Ты идё…',
    options: ['идёшь', 'идёшь', 'идёшь', 'идёшь'],
    correctAnswer: ['идёшь'],
    explanation: 'Глагол I спряжения, 2 л. ед. ч. — окончание -ёшь.',
  },
  {
    id: 't7-12',
    text: 'Они стоят…',
    options: ['стоят', 'стоят', 'стоят', 'стоят'],
    correctAnswer: ['стоят'],
    explanation: 'Глагол I спряжения, 3 л. мн. ч. — окончание -ят.',
  },
]

export const task7QuestionsById = Object.fromEntries(
  task7Questions.map((q) => [q.id, q])
)

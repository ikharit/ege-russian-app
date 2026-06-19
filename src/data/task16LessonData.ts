export interface Task16LessonQuestion {
  id: string
  type: 'single'
  text: string
  options: string[]
  correctAnswer: string[]
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  xpReward: number
  atoms: string[]
}

export const task16LessonQuestions: Task16LessonQuestion[] = [
  // Урок 1: Однородные члены и сложное предложение
  {
    id: 'q16-1', type: 'single',
    text: 'Сколько запятых нужно поставить в предложении?\n\nКогда начался дождь мы укрылись под крышей старого сарая.',
    options: ['0', '1', '2', '3'],
    correctAnswer: ['1'],
    explanation: 'Одна запятая между придаточным («Когда начался дождь») и главным предложением.',
    difficulty: 'easy', xpReward: 10, atoms: ['punctuation']
  },
  {
    id: 'q16-2', type: 'single',
    text: 'Сколько запятых нужно поставить в предложении?\n\nВ туристическом лагере ребята всё лето купаются ловят рыбу и собирают ягоды да грибы.',
    options: ['0', '1', '2', '3'],
    correctAnswer: ['0'],
    explanation: 'Однородные сказуемые с союзами «и», «да» — запятые не нужны.',
    difficulty: 'easy', xpReward: 10, atoms: ['punctuation']
  },
  {
    id: 'q16-3', type: 'single',
    text: 'Сколько запятых нужно поставить в предложении?\n\nТуча на севере росла с большой скоростью и захватывала западную и восточную части неба.',
    options: ['0', '1', '2', '3'],
    correctAnswer: ['0'],
    explanation: 'Нет однородных членов, требующих запятых. Союз «и» не обособляется.',
    difficulty: 'easy', xpReward: 10, atoms: ['punctuation']
  },
  {
    id: 'q16-4', type: 'single',
    text: 'Сколько запятых нужно поставить в предложении?\n\nДом Обломовых был когда-то богат и знаменит в своей стороне но потом всё беднел мельчал и вскоре незаметно потерялся.',
    options: ['0', '1', '2', '3'],
    correctAnswer: ['1'],
    explanation: 'Одна запятая перед противительным союзом «но». Однородные сказуемые после «но» не обособляются.',
    difficulty: 'medium', xpReward: 12, atoms: ['punctuation']
  },
  {
    id: 'q16-5', type: 'single',
    text: 'Сколько запятых нужно поставить в предложении?\n\nВсё мрачней и ниже тучи опускаются над морем.',
    options: ['0', '1', '2', '3'],
    correctAnswer: ['0'],
    explanation: 'Нет однородных членов, требующих запятых. Сравнительный оборот «всё мрачней» не обособляется.',
    difficulty: 'medium', xpReward: 12, atoms: ['punctuation']
  },
  // Урок 2: Придаточные и вводные
  {
    id: 'q16-6', type: 'single',
    text: 'Сколько запятых нужно поставить в предложении?\n\nЕсли пойдёт дождь мы останемся дома.',
    options: ['0', '1', '2', '3'],
    correctAnswer: ['1'],
    explanation: 'Одна запятая между придаточным условия («Если пойдёт дождь») и главным предложением.',
    difficulty: 'easy', xpReward: 10, atoms: ['punctuation']
  },
  {
    id: 'q16-7', type: 'single',
    text: 'Сколько запятых нужно поставить в предложении?\n\nОднако он не согласился с этим мнением.',
    options: ['0', '1', '2', '3'],
    correctAnswer: ['1'],
    explanation: 'Одна запятая после вводного слова «однако» в начале предложения.',
    difficulty: 'easy', xpReward: 10, atoms: ['punctuation']
  },
  {
    id: 'q16-8', type: 'single',
    text: 'Сколько запятых нужно поставить в предложении?\n\nТак как он опоздал мы начали без него.',
    options: ['0', '1', '2', '3'],
    correctAnswer: ['1'],
    explanation: 'Одна запятая между придаточным причины («Так как он опоздал») и главным предложением.',
    difficulty: 'medium', xpReward: 12, atoms: ['punctuation']
  },
  {
    id: 'q16-9', type: 'single',
    text: 'Сколько запятых нужно поставить в предложении?\n\nХотя он был устал он продолжал работать.',
    options: ['0', '1', '2', '3'],
    correctAnswer: ['1'],
    explanation: 'Одна запятая между придаточным уступки («Хотя он был устал») и главным предложением.',
    difficulty: 'medium', xpReward: 12, atoms: ['punctuation']
  },
  {
    id: 'q16-10', type: 'single',
    text: 'Сколько запятых нужно поставить в предложении?\n\nГде ты был я не знаю.',
    options: ['0', '1', '2', '3'],
    correctAnswer: ['1'],
    explanation: 'Одна запятая между придаточным изъяснительным («Где ты был») и главным предложением.',
    difficulty: 'medium', xpReward: 12, atoms: ['punctuation']
  },
  // Урок 3: Вводные слова и конструкции
  {
    id: 'q16-11', type: 'single',
    text: 'Сколько запятых нужно поставить в предложении?\n\nПоэтому он решил уйти раньше.',
    options: ['0', '1', '2', '3'],
    correctAnswer: ['1'],
    explanation: 'Одна запятая после вводного слова «поэтому» в начале предложения.',
    difficulty: 'easy', xpReward: 10, atoms: ['punctuation']
  },
  {
    id: 'q16-12', type: 'single',
    text: 'Сколько запятых нужно поставить в предложении?\n\nК сожалению он не смог приехать.',
    options: ['0', '1', '2', '3'],
    correctAnswer: ['1'],
    explanation: 'Одна запятая после вводного словосочетания «к сожалению».',
    difficulty: 'easy', xpReward: 10, atoms: ['punctuation']
  },
  {
    id: 'q16-13', type: 'single',
    text: 'Сколько запятых нужно поставить в предложении?\n\nНапример он всегда приходил вовремя.',
    options: ['0', '1', '2', '3'],
    correctAnswer: ['1'],
    explanation: 'Одна запятая после вводного слова «например».',
    difficulty: 'easy', xpReward: 10, atoms: ['punctuation']
  },
  {
    id: 'q16-14', type: 'single',
    text: 'Сколько запятых нужно поставить в предложении?\n\nБез сомнения он был прав.',
    options: ['0', '1', '2', '3'],
    correctAnswer: ['1'],
    explanation: 'Одна запятая после вводного словосочетания «без сомнения».',
    difficulty: 'easy', xpReward: 10, atoms: ['punctuation']
  },
  {
    id: 'q16-15', type: 'single',
    text: 'Сколько запятых нужно поставить в предложении?\n\nВообще я не люблю кофе.',
    options: ['0', '1', '2', '3'],
    correctAnswer: ['1'],
    explanation: 'Одна запятая после вводного слова «вообще».',
    difficulty: 'easy', xpReward: 10, atoms: ['punctuation']
  },
  // Урок 4: Сложные случаи
  {
    id: 'q16-16', type: 'single',
    text: 'Сколько запятых нужно поставить в предложении?\n\nЧтобы успеть на поезд мы вышли раньше обычного.',
    options: ['0', '1', '2', '3'],
    correctAnswer: ['1'],
    explanation: 'Одна запятая между придаточным цели («Чтобы успеть на поезд») и главным предложением.',
    difficulty: 'medium', xpReward: 12, atoms: ['punctuation']
  },
  {
    id: 'q16-17', type: 'single',
    text: 'Сколько запятых нужно поставить в предложении?\n\nМне кажется он прав.',
    options: ['0', '1', '2', '3'],
    correctAnswer: ['1'],
    explanation: 'Одна запятая после вводного словосочетания «мне кажется».',
    difficulty: 'medium', xpReward: 12, atoms: ['punctuation']
  },
  {
    id: 'q16-18', type: 'single',
    text: 'Сколько запятых нужно поставить в предложении?\n\nВо-первых нужно собрать все документы.',
    options: ['0', '1', '2', '3'],
    correctAnswer: ['1'],
    explanation: 'Одна запятая после вводного слова «во-первых».',
    difficulty: 'medium', xpReward: 12, atoms: ['punctuation']
  },
  {
    id: 'q16-19', type: 'single',
    text: 'Сколько запятых нужно поставить в предложении?\n\nОн вошёл сел за стол и начал писать.',
    options: ['0', '1', '2', '3'],
    correctAnswer: ['0'],
    explanation: 'Группа однородных сказуемых с однократным союзом «и» — запятые не нужны.',
    difficulty: 'hard', xpReward: 15, atoms: ['punctuation']
  },
  {
    id: 'q16-20', type: 'single',
    text: 'Сколько запятых нужно поставить в предложении?\n\nОн купил яблоки а она купила груши.',
    options: ['0', '1', '2', '3'],
    correctAnswer: ['1'],
    explanation: 'Одна запятая перед противительным союзом «а».',
    difficulty: 'medium', xpReward: 12, atoms: ['punctuation']
  },
]

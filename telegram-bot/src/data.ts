import { TaskQuestion, MotivationalTemplate, GreetingTemplate } from './types'

export const taskQuestions: Record<string, TaskQuestion[]> = {
  task1: [
    {
      id: 't1-1',
      taskNumber: 'task1',
      text: 'Какая связь выражена в предложении: «Он опоздал, потому что проспал»?',
      options: ['Причинно-следственная', 'Условная', 'Целевая', 'Временная'],
      correctIndex: 0,
      explanation: 'Союз «потому что» выражает причину опоздания — причинно-следственная связь.',
      difficulty: 'easy',
    },
    {
      id: 't1-2',
      taskNumber: 'task1',
      text: 'Какая связь в предложении: «Вследствие дождя дороги были мокрыми»?',
      options: ['Сравнительная', 'Причинно-следственная', 'Противопоставительная', 'Условная'],
      correctIndex: 1,
      explanation: '«Вследствие» указывает на причину — нейтральную причинно-следственную связь.',
      difficulty: 'easy',
    },
    {
      id: 't1-3',
      taskNumber: 'task1',
      text: 'Какая связь: «Несмотря на усталость, он продолжал работать»?',
      options: ['Причинная', 'Уступительная', 'Целевая', 'Следственная'],
      correctIndex: 1,
      explanation: '«Несмотря на» — уступительная связь: усталость должна была помешать, но не помешала.',
      difficulty: 'medium',
    },
    {
      id: 't1-4',
      taskNumber: 'task1',
      text: 'Какая связь: «Если пойдёт дождь, мы останемся дома»?',
      options: ['Условная', 'Временная', 'Причинная', 'Целевая'],
      correctIndex: 0,
      explanation: '«Если» — союз условия.',
      difficulty: 'easy',
    },
    {
      id: 't1-5',
      taskNumber: 'task1',
      text: 'Какая связь: «Он пришёл, чтобы помочь нам»?',
      options: ['Причинная', 'Целевая', 'Временная', 'Условная'],
      correctIndex: 1,
      explanation: '«Чтобы» указывает на цель действия.',
      difficulty: 'easy',
    },
  ],
  task2: [
    {
      id: 't2-1',
      taskNumber: 'task2',
      text: 'Какое предложение построено правильно?',
      options: ['Собрание начались', 'Собрание началось', 'Собрание началась', 'Собрание начались'],
      correctIndex: 1,
      explanation: '«Собрание» — средний род, единственное число. Сказуемое должно быть «началось».',
      difficulty: 'easy',
    },
    {
      id: 't2-2',
      taskNumber: 'task2',
      text: 'Какое сказуемое правильное: «Ни один из учеников не ___»?',
      options: ['пришли', 'пришёл', 'пришла', 'пришло'],
      correctIndex: 1,
      explanation: 'При обобщённом подлежащем («ни один») сказуемое в единственном числе мужского рода.',
      difficulty: 'medium',
    },
    {
      id: 't2-3',
      taskNumber: 'task2',
      text: 'Какое сказуемое правильное: «Книги и тетради лежали на ___»?',
      options: ['столе', 'столах', 'стола', 'столов'],
      correctIndex: 1,
      explanation: 'Однородные подлежащие, соединённые «и», требуют сказуемое во множественном числе.',
      difficulty: 'medium',
    },
    {
      id: 't2-4',
      taskNumber: 'task2',
      text: 'В каком предложении верное согласование?',
      options: ['Толпа кричали', 'Толпа кричала', 'Толпа кричали', 'Толпа кричал'],
      correctIndex: 1,
      explanation: '«Толпа» — собирательное, существительное единственного числа, сказуемое в единственном числе.',
      difficulty: 'medium',
    },
    {
      id: 't2-5',
      taskNumber: 'task2',
      text: 'Какое предложение верное?',
      options: ['Достигнуть к цели', 'Достигнуть цели', 'Достигнуть цель', 'Достигнуть целям'],
      correctIndex: 1,
      explanation: '«Достигнуть» управляет родительным падежом: «достигнуть цели».',
      difficulty: 'easy',
    },
  ],
  task3: [
    {
      id: 't3-1',
      taskNumber: 'task3',
      text: 'Какое словосочетание построено правильно?',
      options: ['Сделать меры', 'Принять меры', 'Взять меры', 'Положить меры'],
      correctIndex: 1,
      explanation: 'Устойчивое словосочетание: «принять меры».',
      difficulty: 'easy',
    },
    {
      id: 't3-2',
      taskNumber: 'task3',
      text: 'Какое словосочетание верное?',
      options: ['Повернуть внимание', 'Обратить внимание', 'Направить внимание', 'Вернуть внимание'],
      correctIndex: 1,
      explanation: 'Устойчивое словосочетание: «обратить внимание».',
      difficulty: 'easy',
    },
    {
      id: 't3-3',
      taskNumber: 'task3',
      text: 'Какое словосочетание правильное?',
      options: ['Вызвать интерес', 'Сделать интерес', 'Построить интерес', 'Произвести интерес'],
      correctIndex: 0,
      explanation: '«Вызвать интерес» — устойчивое словосочетание.',
      difficulty: 'easy',
    },
    {
      id: 't3-4',
      taskNumber: 'task3',
      text: 'Где нет тавтологии?',
      options: ['Предварительная предоплата', 'Предоплата за товар', 'Предварительная оплата', 'Предоплата вперёд'],
      correctIndex: 1,
      explanation: '«Предоплата» уже содержит значение «предварительной оплаты», добавление «предварительная» — тавтология.',
      difficulty: 'medium',
    },
    {
      id: 't3-5',
      taskNumber: 'task3',
      text: 'Какое словосочетание построено правильно?',
      options: ['Сильный вопрос', 'Серьёзный вопрос', 'Тяжёлый вопрос', 'Большой вопрос'],
      correctIndex: 1,
      explanation: '«Серьёзный вопрос» — правильное лексическое сочетание. «Сильный вопрос» — нарушение сочетаемости.',
      difficulty: 'medium',
    },
  ],
  task4: [
    {
      id: 't4-1',
      taskNumber: 'task4',
      text: 'Какое слово правильное: «___ плохую новость»?',
      options: ['Заменить', 'Заменить', 'Сменить', 'Поменять'],
      correctIndex: 0,
      explanation: '«Заменить» (поставить другое) — правильный вариант. «Заменить» (заместить) — другой смысл.',
      difficulty: 'easy',
    },
    {
      id: 't4-2',
      taskNumber: 'task4',
      text: 'Какое слово правильное: «Он ___ меня на собрании»?',
      options: ['Заменил', 'Заменил', 'Сменил', 'Поменял'],
      correctIndex: 1,
      explanation: '«Заменить» (заместить, представить) — правильно в значении «замещать кого-то».',
      difficulty: 'medium',
    },
    {
      id: 't4-3',
      taskNumber: 'task4',
      text: 'Какое слово правильное: «___ воду в аквариуме»?',
      options: ['Заменить', 'Заменить', 'Сменить', 'Поменять'],
      correctIndex: 0,
      explanation: '«Заменить» (поменять одно на другое) — правильно для воды.',
      difficulty: 'easy',
    },
    {
      id: 't4-4',
      taskNumber: 'task4',
      text: 'Какое слово правильное: «___ цену на товар»?',
      options: ['Снизить', 'Унизить', 'Понизить', 'Занизить'],
      correctIndex: 0,
      explanation: '«Снизить» — правильное слово для цены. «Унизить» — унижать человека. «Занизить» — занижать оценку.',
      difficulty: 'medium',
    },
    {
      id: 't4-5',
      taskNumber: 'task4',
      text: 'Какое слово правильное: «___ оценку в дневнике»?',
      options: ['Занизить', 'Снизить', 'Унизить', 'Понизить'],
      correctIndex: 0,
      explanation: '«Занизить» — занижать оценку. «Снизить» — для цен/показателей. «Унизить» — унижать человека.',
      difficulty: 'medium',
    },
  ],
  task5: [
    {
      id: 't5-1',
      taskNumber: 'task5',
      text: 'Где ударение правильное?',
      options: ['КОнфликт', 'конфлИкт', 'конфликТ', 'конфлИкт'],
      correctIndex: 1,
      explanation: 'Правильно: конфлИкт. Ударение на втором слоге.',
      difficulty: 'easy',
    },
    {
      id: 't5-2',
      taskNumber: 'task5',
      text: 'Где ударение правильное?',
      options: ['звонИт', 'звОнит', 'звонИт', 'звонитЬ'],
      correctIndex: 0,
      explanation: 'Правильно: звонИт (звонит). Ударение на последний слог.',
      difficulty: 'easy',
    },
    {
      id: 't5-3',
      taskNumber: 'task5',
      text: 'Где ударение правильное?',
      options: ['клАла', 'клалА', 'клАла', 'клалА'],
      correctIndex: 0,
      explanation: 'Правильно: клАла (клала). Ударение на первый слог.',
      difficulty: 'medium',
    },
    {
      id: 't5-4',
      taskNumber: 'task5',
      text: 'Где ударение правильное?',
      options: ['позвонИт', 'позвОнит', 'позвонИт', 'позвонитЬ'],
      correctIndex: 0,
      explanation: 'Правильно: позвонИт. Ударение на последний слог.',
      difficulty: 'easy',
    },
    {
      id: 't5-5',
      taskNumber: 'task5',
      text: 'Где ударение правильное?',
      options: ['нАчала', 'началА', 'нАчала', 'началА'],
      correctIndex: 1,
      explanation: 'Правильно: началА (она начала). Для женского рода прошедшего времени ударение на последний слог.',
      difficulty: 'medium',
    },
  ],
  task9: [
    {
      id: 't9-1',
      taskNumber: 'task9',
      text: 'Как написать: «(по)морскому обычаю»?',
      options: ['По морскому', 'Поморскому', 'По-морскому', 'По морскому'],
      correctIndex: 2,
      explanation: '«По-морскому» — пишется через дефис: наречие с приставкой по- и суффиксом -ому.',
      difficulty: 'easy',
    },
    {
      id: 't9-2',
      taskNumber: 'task9',
      text: 'Как написать: «(под)боком»?',
      options: ['Подбоком', 'Под боком', 'Под-боком', 'Под боком'],
      correctIndex: 1,
      explanation: '«Под боком» — раздельно: предлог + существительное.',
      difficulty: 'easy',
    },
    {
      id: 't9-3',
      taskNumber: 'task9',
      text: 'Как написать: «(без)ответный»?',
      options: ['Безответный', 'Без ответный', 'Без-ответный', 'Без ответный'],
      correctIndex: 0,
      explanation: '«Безответный» — слитно: прилагательное с приставкой без-.',
      difficulty: 'easy',
    },
    {
      id: 't9-4',
      taskNumber: 'task9',
      text: 'Как написать: «(в)тридорога»?',
      options: ['Втридорога', 'В три дорога', 'В-три-дорога', 'В тридорога'],
      correctIndex: 0,
      explanation: '«Втридорога» — слитно: устойчивое наречие.',
      difficulty: 'medium',
    },
    {
      id: 't9-5',
      taskNumber: 'task9',
      text: 'Как написать: «(в)след за ним»?',
      options: ['Вслед', 'В след', 'В-след', 'Вслед'],
      correctIndex: 0,
      explanation: '«Вслед» — слитно: наречие.',
      difficulty: 'easy',
    },
  ],
  task10: [
    {
      id: 't10-1',
      taskNumber: 'task10',
      text: 'Какие знаки в предложении: «Когда он пришёл, мы начали работу»?',
      options: ['Перед «когда» запятая', 'Запятых нет', 'Запятая после «пришёл»', 'Запятые везде'],
      correctIndex: 0,
      explanation: 'Придаточное предложение «Когда он пришёл» выделяется запятой перед главным.',
      difficulty: 'easy',
    },
    {
      id: 't10-2',
      taskNumber: 'task10',
      text: 'Какие знаки: «Так как был дождь, матч отменили»?',
      options: ['Запятая перед «так как»', 'Запятых нет', 'Запятая после «дождь»', 'Запятые везде'],
      correctIndex: 0,
      explanation: 'Придаточное причины «Так как был дождь» выделяется запятой перед главным.',
      difficulty: 'easy',
    },
    {
      id: 't10-3',
      taskNumber: 'task10',
      text: 'Какие знаки: «Если пойдёт дождь, мы останемся дома»?',
      options: ['Запятая перед «мы»', 'Запятых нет', 'Запятая после «дождь»', 'Запятые везде'],
      correctIndex: 0,
      explanation: 'Придаточное условия выделяется запятой перед главным предложением.',
      difficulty: 'easy',
    },
    {
      id: 't10-4',
      taskNumber: 'task10',
      text: 'Какие знаки: «Я знаю, что он прав»?',
      options: ['Запятая перед «что»', 'Запятых нет', 'Запятая после «знаю»', 'Запятые везде'],
      correctIndex: 2,
      explanation: 'Придаточное изъяснительное «что он прав» выделяется запятой после «знаю».',
      difficulty: 'easy',
    },
    {
      id: 't10-5',
      taskNumber: 'task10',
      text: 'Какие знаки: «Кто не работает, тот не ест»?',
      options: ['Запятая перед «тот»', 'Запятых нет', 'Запятая после «работает»', 'Запятые везде'],
      correctIndex: 0,
      explanation: 'Сложноподчинённое с союзным словом «кто» — запятая перед главным.',
      difficulty: 'medium',
    },
  ],
  task16: [
    {
      id: 't16-1',
      taskNumber: 'task16',
      text: 'Какой стиль речи используется в официальном документе?',
      options: ['Разговорный', 'Официально-деловой', 'Художественный', 'Научный'],
      correctIndex: 1,
      explanation: 'Официальный документ — это официально-деловой стиль речи.',
      difficulty: 'easy',
    },
    {
      id: 't16-2',
      taskNumber: 'task16',
      text: 'Какое слово не подходит в официально-деловой стиль?',
      options: ['Согласно', 'Типа', 'В соответствии с', 'В целях'],
      correctIndex: 1,
      explanation: '«Типа» — разговорное слово, не подходит для официально-делового стиля.',
      difficulty: 'easy',
    },
    {
      id: 't16-3',
      taskNumber: 'task16',
      text: 'Какой стиль в художественном тексте?',
      options: ['Официально-деловой', 'Художественный', 'Научный', 'Публицистический'],
      correctIndex: 1,
      explanation: 'Художественный текст — это художественный стиль речи.',
      difficulty: 'easy',
    },
    {
      id: 't16-4',
      taskNumber: 'task16',
      text: 'Какой стиль в научной статье?',
      options: ['Разговорный', 'Научный', 'Официально-деловой', 'Художественный'],
      correctIndex: 1,
      explanation: 'Научная статья — это научный стиль речи.',
      difficulty: 'easy',
    },
    {
      id: 't16-5',
      taskNumber: 'task16',
      text: 'Какое слово характерно для публицистического стиля?',
      options: ['Типа', 'В связи с этим', 'Современный', 'По мнению автора'],
      correctIndex: 3,
      explanation: '«По мнению автора» — характерная конструкция публицистического стиля.',
      difficulty: 'medium',
    },
  ],
}

export const motivationalTemplates: MotivationalTemplate[] = [
  { text: 'Ты уже прошёл {lessons} уроков! Это топ-{percent}%! 💪', icon: '💪', condition: 'progress' },
  { text: 'Неделя подряд! Ты неостановим 🔥', icon: '🔥', condition: 'streak' },
  { text: 'Поздравляем! Уровень {level} — ты крут! 🎉', icon: '🎉', condition: 'level' },
  { text: 'Ты в ударе! Готов к заданию посложнее? ⚡', icon: '⚡', condition: 'random' },
  { text: 'Каждый вопрос — шаг к 100 баллам! 🚀', icon: '🚀', condition: 'random' },
  { text: 'Скучаем! Вот короткий урок на 5 минут 🌟', icon: '🌟', condition: 'random' },
  { text: 'Бывает! Главное — начать заново. Вот простое задание 💪', icon: '💪', condition: 'random' },
  { text: 'Не расстраивайся! Давай разберём эту тему подробнее 📖', icon: '📖', condition: 'random' },
  { text: 'Проверь свои силы! Вот новый вариант ЕГЭ 📝', icon: '📝', condition: 'random' },
  { text: 'Ты молодец! Продолжай в том же духе! ⭐', icon: '⭐', condition: 'random' },
]

export const greetingTemplates: GreetingTemplate[] = [
  { text: 'Привет! Я твой помощник по подготовке к ЕГЭ по русскому языку. Давай учиться вместе! 📚', icon: '📚' },
  { text: 'Здравствуй! Готов прокачать русский язык? 🚀', icon: '🚀' },
  { text: 'Привет! Сегодня отличный день, чтобы подготовиться к ЕГЭ! 💪', icon: '💪' },
  { text: 'Здравствуй! Давай сделаем ещё один шаг к 100 баллам! 🎯', icon: '🎯' },
  { text: 'Привет! Я помогу тебе подготовиться к ЕГЭ. Выбери, с чего начнём! 🎓', icon: '🎓' },
]

export function getRandomQuestion(taskNumber?: string): TaskQuestion | null {
  const tasks = taskNumber ? [taskNumber] : Object.keys(taskQuestions)
  const availableTasks = tasks.filter(t => taskQuestions[t] && taskQuestions[t].length > 0)
  if (availableTasks.length === 0) return null
  const randomTask = availableTasks[Math.floor(Math.random() * availableTasks.length)]
  const questions = taskQuestions[randomTask]
  return questions[Math.floor(Math.random() * questions.length)]
}

export function getQuestionsByTask(taskNumber: string, count: number = 5): TaskQuestion[] {
  const questions = taskQuestions[taskNumber] || []
  const shuffled = [...questions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

export function getRandomMotivation(progress?: { lessons: number; level: number; streak: number }): string {
  const templates = motivationalTemplates
  const template = templates[Math.floor(Math.random() * templates.length)]
  let text = template.text
  if (progress) {
    text = text.replace('{lessons}', String(progress.lessons || 0))
    text = text.replace('{level}', String(progress.level || 1))
    text = text.replace('{percent}', String(Math.min(90, (progress.lessons || 0) * 2)))
  }
  return `${template.icon} ${text}`
}

export function getRandomGreeting(): string {
  const template = greetingTemplates[Math.floor(Math.random() * greetingTemplates.length)]
  return `${template.icon} ${template.text}`
}

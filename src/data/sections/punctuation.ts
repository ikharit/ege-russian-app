import { Section } from '../../types'

export const punctuationSections: Section[] = [
  {
    id: 'section-punct-1',
    courseId: 'ege-russian-2025',
    title: 'Пунктуация: простое предложение',
    subtitle: 'Однородные члены, обособленные члены, вводные слова',
    order: 3,
    icon: 'Pencil',
    color: '#ce82ff',
    lessons: [
      {
        id: 'lesson-punct-16-1',
        sectionId: 'section-punct-1',
        title: 'Задание 16. Однородные члены',
        type: 'practice',
        description: 'Расставьте знаки препинания',
        xpReward: 60,
        prerequisites: [],
        questions: [
          { id: 'q16-1', type: 'single', text: 'Как расставить запятые? На столе лежали яблоки, груши и сливы.', options: ['яблоки, груши, и сливы', 'яблоки, груши и сливы', 'яблоки груши и сливы'], correctAnswer: ['яблоки, груши и сливы'], explanation: 'Перед союзом «и» в ряде однородных членов запятая не ставится.', difficulty: 'easy', xpReward: 10, atoms: ['punctuation'] },
          { id: 'q16-2', type: 'single', text: 'Как расставить запятые? В саду росли розы, тюльпаны, и лилии.', options: ['розы, тюльпаны, и лилии', 'розы, тюльпаны и лилии', 'розы тюльпаны, и лилии'], correctAnswer: ['розы, тюльпаны и лилии'], explanation: 'Перед одиночным союзом «и» запятая не ставится.', difficulty: 'easy', xpReward: 10, atoms: ['punctuation'] },
        ]
      },
      {
        id: 'lesson-punct-16-2',
        sectionId: 'section-punct-1',
        title: 'Задание 16. Обособленные члены',
        type: 'practice',
        description: 'Определения и обстоятельства, выделенные запятыми',
        xpReward: 70,
        prerequisites: ['lesson-punct-16-1'],
        questions: [
          { id: 'q16-3', type: 'single', text: 'Как расставить запятые? Уставший от дороги путник уселся на траву.', options: ['Уставший, от дороги, путник', 'Уставший от дороги путник', 'Уставший от дороги, путник'], correctAnswer: ['Уставший от дороги, путник'], explanation: 'Причастный оборот «уставший от дороги» обособляется.', difficulty: 'medium', xpReward: 12, atoms: ['punctuation'] },
          { id: 'q16-4', type: 'single', text: 'Как расставить запятые? Деревья покрытые инеем сверкали на солнце.', options: ['Деревья, покрытые, инеем', 'Деревья покрытые инеем', 'Деревья, покрытые инеем,'], correctAnswer: ['Деревья, покрытые инеем,'], explanation: 'Причастный оборот «покрытые инеем» обособляется запятыми.', difficulty: 'medium', xpReward: 12, atoms: ['punctuation'] },
        ]
      }
    ]
  },
  {
    id: 'section-punct-2',
    courseId: 'ege-russian-2025',
    title: 'Пунктуация: сложное предложение',
    subtitle: 'ССП, СПП, бессоюзные',
    order: 4,
    icon: 'Pencil',
    color: '#ce82ff',
    lessons: [
      {
        id: 'lesson-punct-17-1',
        sectionId: 'section-punct-2',
        title: 'Задание 17. Сложносочинённые предложения',
        type: 'practice',
        description: 'Запятые между частями сложного предложения',
        xpReward: 60,
        prerequisites: [],
        questions: [
          { id: 'q17-1', type: 'single', text: 'Как расставить запятые? Ветер усилился и пошёл дождь.', options: ['усилился, и пошёл', 'усилился и пошёл', 'усилился, и, пошёл'], correctAnswer: ['усилился, и пошёл'], explanation: 'Союз «и» между частями ССП выделяется запятой.', difficulty: 'easy', xpReward: 10, atoms: ['punctuation'] },
        ]
      },
      {
        id: 'lesson-punct-19-1',
        sectionId: 'section-punct-2',
        title: 'Задание 19. Прямая речь',
        type: 'practice',
        description: 'Кавычки, тире, запятые в прямой речи',
        xpReward: 70,
        prerequisites: ['lesson-punct-17-1'],
        questions: [
          { id: 'q19-1', type: 'single', text: 'Как правильно? Он сказал:', options: ['«Я приду».', '«Я приду.', 'Я приду».'], correctAnswer: ['«Я приду».'], explanation: 'Точка ставится после закрывающей кавычки.', difficulty: 'medium', xpReward: 12, atoms: ['punctuation'] },
        ]
      }
    ]
  }
]

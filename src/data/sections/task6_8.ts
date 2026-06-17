import { Section } from '../../types'

// Placeholders for tasks 6-8 (ЕГЭ 2026)
// Task 6: Lexical compatibility. Tautology. Pleonasm
// Task 7: Morphological norms
// Task 8: Syntactic norms (2 points)

export const task6_8Sections: Section[] = [
  {
    id: 'section-task6',
    courseId: 'ege-russian-2025',
    title: 'Лексическая сочетаемость',
    subtitle: 'Задание 6: тавтология, плеоназм, лексическая сочетаемость',
    order: 6,
    icon: 'BookOpen',
    color: '#58cc02',
    lessons: [
      {
        id: 'lesson-task6-1',
        sectionId: 'section-task6',
        title: 'Задание 6. Лексические ошибки',
        type: 'practice',
        description: 'Выявление тавтологии и плеоназма',
        xpReward: 30,
        prerequisites: [],
        questions: [
          { id: 'q6-1', type: 'single', text: 'Какая ошибка в предложении: «Бесплатный подарок»?', options: ['плеоназм', 'тавтология', 'лексическая сочетаемость', 'нет ошибки'], correctAnswer: ['плеоназм'], explanation: '«Бесплатный подарок» — плеоназм (подарок и так бесплатный).', difficulty: 'easy', xpReward: 10 },
        ]
      }
    ]
  },
  {
    id: 'section-task7',
    courseId: 'ege-russian-2025',
    title: 'Морфологические нормы',
    subtitle: 'Задание 7: управление, согласование, однородность',
    order: 7,
    icon: 'BookOpen',
    color: '#58cc02',
    lessons: [
      {
        id: 'lesson-task7-1',
        sectionId: 'section-task7',
        title: 'Задание 7. Управление',
        type: 'practice',
        description: 'Правильное управление глаголов и прилагательных',
        xpReward: 30,
        prerequisites: [],
        questions: [
          { id: 'q7-1', type: 'single', text: 'Как правильно?', options: ['гордиться чем', 'гордиться чем-то'], correctAnswer: ['гордиться чем'], explanation: 'Гордиться управляет творительным падежом: гордиться чем.', difficulty: 'easy', xpReward: 10 },
        ]
      }
    ]
  },
  {
    id: 'section-task8',
    courseId: 'ege-russian-2025',
    title: 'Синтаксические нормы',
    subtitle: 'Задание 8: синтаксическая правильность (2 балла)',
    order: 8,
    icon: 'BookOpen',
    color: '#2E75B6',
    lessons: [
      {
        id: 'lesson-task8-1',
        sectionId: 'section-task8',
        title: 'Задание 8. Однородные члены',
        type: 'practice',
        description: 'Нарушение связи в группе однородных членов',
        xpReward: 40,
        prerequisites: [],
        questions: [
          { id: 'q8-1', type: 'single', text: 'Какая ошибка в предложении: «Он купил яблоки, груши и хлеб.»?', options: ['нарушение однородности', 'нет ошибки', 'плеоназм', 'тавтология'], correctAnswer: ['нет ошибки'], explanation: 'Яблоки, груши и хлеб — однородные существительные.', difficulty: 'easy', xpReward: 10 },
        ]
      }
    ]
  }
]

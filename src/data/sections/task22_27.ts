import { Section } from '../../types'

// Placeholders for tasks 22-27 (ЕГЭ 2026)
// Task 22: Imagery and expressive means (2 points, elevated)
// Task 23: Informational processing of text
// Task 24: Informativeness of text. Types of information
// Task 25: Lexicology and phraseology. Lexical analysis
// Task 26: Logic-semantic relations between sentences in a text
// Task 27: Essay (review/response) — 22 points

export const task22_27Sections: Section[] = [
  {
    id: 'section-task22',
    courseId: 'ege-russian-2025',
    title: 'Изобразительно-выразительные средства',
    subtitle: 'Задание 22: стилистические приёмы (2 балла)',
    order: 22,
    icon: 'BookOpen',
    color: '#2E75B6',
    lessons: [
      {
        id: 'lesson-task22-1',
        sectionId: 'section-task22',
        title: 'Задание 22. Тропы и фигуры',
        type: 'theory',
        description: 'Метафора, сравнение, олицетворение, эпитет, синтаксические параллелизмы',
        xpReward: 40,
        prerequisites: [],
        isComingSoon: true,
        questions: [
          { id: 'q22-1', type: 'single', text: 'Какое средство выразительности использовано: «Ветер пел свою печальную песню»?', options: ['олицетворение', 'метафора', 'сравнение', 'эпитет'], correctAnswer: ["олицетворение"], explanation: 'Ветер «пел» — приписание человеческого действия неодушевлённому предмету.', difficulty: 'easy', xpReward: 10 , atoms: ['task22', 'tropes']},
        ]
      }
    ]
  },
  {
    id: 'section-task23',
    courseId: 'ege-russian-2025',
    title: 'Работа с текстом',
    subtitle: 'Задание 23: информационно-смысловая переработка текста',
    order: 23,
    icon: 'BookOpen',
    color: '#58cc02',
    lessons: [
      {
        id: 'lesson-task23-1',
        sectionId: 'section-task23',
        title: 'Задание 23. Понимание текста',
        type: 'practice',
        description: 'Нахождение информации в тексте',
        xpReward: 30,
        prerequisites: [],
        isComingSoon: true,
        questions: [
          { id: 'q23-1', type: 'single', text: 'Что нужно сделать в задании 23?', options: ['найти в тексте ответ на вопрос', 'написать сочинение', 'найти ошибки', 'проанализировать стиль'], correctAnswer: ["найти в тексте ответ на вопрос"], explanation: 'Задание 23 проверяет понимание прочитанного текста.', difficulty: 'easy', xpReward: 10 , atoms: ['task23', 'text_comprehension']},
        ]
      }
    ]
  },
  {
    id: 'section-task24',
    courseId: 'ege-russian-2025',
    title: 'Информативность текста',
    subtitle: 'Задание 24: виды информации в тексте',
    order: 24,
    icon: 'BookOpen',
    color: '#58cc02',
    lessons: [
      {
        id: 'lesson-task24-1',
        sectionId: 'section-task24',
        title: 'Задание 24. Типы информации',
        type: 'theory',
        description: 'Основная, дополнительная, фактографическая, оценочная информация',
        xpReward: 30,
        prerequisites: [],
        isComingSoon: true,
        questions: [
          { id: 'q24-1', type: 'single', text: 'Какой тип информации: «Автор считает, что это важно»?', options: ['оценочная', 'фактографическая', 'основная', 'дополнительная'], correctAnswer: ["оценочная"], explanation: '«Считает, что это важно» — оценка, отношение автора.', difficulty: 'easy', xpReward: 10 , atoms: ['task24', 'information_types']},
        ]
      }
    ]
  },
  {
    id: 'section-task25',
    courseId: 'ege-russian-2025',
    title: 'Лексический анализ',
    subtitle: 'Задание 25: лексикология и фразеология',
    order: 25,
    icon: 'BookOpen',
    color: '#58cc02',
    lessons: [
      {
        id: 'lesson-task25-1',
        sectionId: 'section-task25',
        title: 'Задание 25. Значение слова в контексте',
        type: 'practice',
        description: 'Определение значения слова по контексту',
        xpReward: 30,
        prerequisites: [],
        isComingSoon: true,
        questions: [
          { id: 'q25-1', type: 'single', text: 'Что означает «светоч» в контексте: «Он был светочем науки»?', options: ['выдающийся деятель', 'источник света', 'светящийся предмет', 'учитель'], correctAnswer: ["выдающийся деятель"], explanation: 'В переносном значении «светоч» — просветитель, выдающийся деятель.', difficulty: 'easy', xpReward: 10 , atoms: ['task25', 'lexical_analysis']},
        ]
      }
    ]
  },
  {
    id: 'section-task26',
    courseId: 'ege-russian-2025',
    title: 'Логико-смысловые связи',
    subtitle: 'Задание 26: связи между предложениями в тексте',
    order: 26,
    icon: 'BookOpen',
    color: '#58cc02',
    lessons: [
      {
        id: 'lesson-task26-1',
        sectionId: 'section-task26',
        title: 'Задание 26. Типы связи',
        type: 'practice',
        description: 'Определение типа связи между частями текста',
        xpReward: 30,
        prerequisites: [],
        isComingSoon: true,
        questions: [
          { id: 'q26-1', type: 'single', text: 'Какой тип связи: «Во-первых... Во-вторых...»?', options: ['перечислительная', 'причинно-следственная', 'противопоставительная', 'пояснительная'], correctAnswer: ["перечислительная"], explanation: '«Во-первых... Во-вторых» — перечислительная связь.', difficulty: 'easy', xpReward: 10 , atoms: ['task26', 'text_connections']},
        ]
      }
    ]
  },
  {
    id: 'section-task27',
    courseId: 'ege-russian-2025',
    title: 'Сочинение',
    subtitle: 'Задание 27: отзыв/рецензия (22 балла)',
    order: 27,
    icon: 'BookOpen',
    color: '#e74c3c',
    lessons: [
      {
        id: 'lesson-task27-1',
        sectionId: 'section-task27',
        title: 'Задание 27. Структура отзыва',
        type: 'theory',
        description: 'Как написать сочинение-отзыв по прочитанному тексту',
        xpReward: 50,
        prerequisites: [],
        isComingSoon: true,
        questions: [
          { id: 'q27-1', type: 'single', text: 'Какой объём сочинения требуется?', options: ['150-250 слов', 'не менее 200 слов', '100-150 слов', 'не менее 300 слов'], correctAnswer: ["не менее 200 слов"], explanation: 'Согласно критериям, сочинение должно быть не менее 200 слов.', difficulty: 'easy', xpReward: 10 , atoms: ['task27', 'essay']},
        ]
      }
    ]
  }
]

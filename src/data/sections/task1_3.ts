import { Section } from '../../types'

// Placeholders for tasks 1-3 (ЕГЭ 2026)
// Task 1: Logic-semantic relations between sentences in a text
// Task 2: Lexicology and phraseology. Lexical analysis of a word
// Task 3: Functional stylistics. Speech culture

export const task1_3Sections: Section[] = [
  {
    id: 'section-task1',
    courseId: 'ege-russian-2025',
    title: 'Логико-смысловые отношения',
    subtitle: 'Задание 1: связь между предложениями в тексте',
    order: 1,
    icon: 'BookOpen',
    color: '#58cc02',
    lessons: [
      {
        id: 'lesson-task1-1',
        sectionId: 'section-task1',
        title: 'Задание 1. Типы связи',
        type: 'theory',
        description: 'Причинно-следственная, противопоставительная, пояснительная связь',
        xpReward: 30,
        prerequisites: [],
        isComingSoon: true,
        questions: [
          { id: 'q1-1', type: 'single', text: 'Какой тип связи между предложениями? «Дождь шёл всю ночь. Поэтому утром воздух был свежим.»', options: ['причинно-следственная', 'противопоставительная', 'пояснительная', 'перечислительная'], correctAnswer: ['причинно-следственная'], explanation: 'Союз «поэтому» указывает на причинно-следственную связь.', difficulty: 'easy', xpReward: 10 , atoms: ['task1', 'text_connections']},
        ]
      }
    ]
  },
  {
    id: 'section-task2',
    courseId: 'ege-russian-2025',
    title: 'Лексический анализ слова',
    subtitle: 'Задание 2: лексикология и фразеология',
    order: 2,
    icon: 'BookOpen',
    color: '#58cc02',
    lessons: [
      {
        id: 'lesson-task2-1',
        sectionId: 'section-task2',
        title: 'Задание 2. Стилистика слова',
        type: 'practice',
        description: 'Определение стилистической окраски слова',
        xpReward: 30,
        prerequisites: [],
        isComingSoon: true,
        questions: [
          { id: 'q2-1', type: 'single', text: 'Какой стиль речи соответствует слову «копеечка»?', options: ['разговорный', 'книжный', 'публицистический', 'поэтический'], correctAnswer: ['разговорный'], explanation: '«Копеечка» — уменьшительное-ласкательное, разговорный стиль.', difficulty: 'easy', xpReward: 10 , atoms: ['task2', 'lexicology']},
        ]
      }
    ]
  },
  {
    id: 'section-task3',
    courseId: 'ege-russian-2025',
    title: 'Функциональная стилистика',
    subtitle: 'Задание 3: культура речи (повышенный уровень)',
    order: 3,
    icon: 'BookOpen',
    color: '#2E75B6',
    lessons: [
      {
        id: 'lesson-task3-1',
        sectionId: 'section-task3',
        title: 'Задание 3. Речевые ошибки',
        type: 'practice',
        description: 'Определение типа речевой ошибки',
        xpReward: 40,
        prerequisites: [],
        isComingSoon: true,
        questions: [
          { id: 'q3-1', type: 'single', text: 'Какая ошибка в предложении: «В связи с этим у меня возникло некое чувство тревожности.»?', options: ['лексическая (тавтология)', 'грамматическая', 'синтаксическая', 'пунктуационная'], correctAnswer: ['лексическая (тавтология)'], explanation: '«Чувство тревожности» — тавтология (лишнее слово).', difficulty: 'easy', xpReward: 10 , atoms: ['task3', 'speech_errors']},
        ]
      }
    ]
  }
]

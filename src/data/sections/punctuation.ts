import { Section } from '../../types'
import { task16LessonQuestions } from '../task16LessonData'

export const punctuationSections: Section[] = [
  {
    id: 'section-punct-1',
    courseId: 'ege-russian-2025',
    title: 'Пунктуация: простое предложение',
    subtitle: 'Однородные члены, придаточные и вводные слова',
    order: 16,
    icon: 'Pencil',
    color: '#ce82ff',
    lessons: [
      {
        id: 'lesson-punct-16-1',
        sectionId: 'section-punct-1',
        title: 'Задание 16. Однородные члены и придаточные',
        type: 'practice',
        description: 'Реальные вопросы ЕГЭ (Дощинский-2026)',
        xpReward: 60,
        prerequisites: [],
        questions: task16LessonQuestions.slice(0, 5)
      },
      {
        id: 'lesson-punct-16-2',
        sectionId: 'section-punct-1',
        title: 'Задание 16. Придаточные и вводные',
        type: 'practice',
        description: 'Реальные вопросы ЕГЭ (Дощинский-2026)',
        xpReward: 70,
        prerequisites: ['lesson-punct-16-1'],
        questions: task16LessonQuestions.slice(5, 10)
      },
      {
        id: 'lesson-punct-16-3',
        sectionId: 'section-punct-1',
        title: 'Задание 16. Вводные слова',
        type: 'practice',
        description: 'Реальные вопросы ЕГЭ (Дощинский-2026)',
        xpReward: 70,
        prerequisites: ['lesson-punct-16-2'],
        questions: task16LessonQuestions.slice(10, 15)
      },
      {
        id: 'lesson-punct-16-4',
        sectionId: 'section-punct-1',
        title: 'Задание 16. Сложные случаи',
        type: 'practice',
        description: 'Реальные вопросы ЕГЭ (Дощинский-2026)',
        xpReward: 70,
        prerequisites: ['lesson-punct-16-3'],
        questions: task16LessonQuestions.slice(15, 20)
      }
    ]
  },
  {
    id: 'section-punct-2',
    courseId: 'ege-russian-2025',
    title: 'Пунктуация: сложное предложение',
    subtitle: 'ССП, СПП, бессоюзные',
    order: 16,
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
        isComingSoon: true,
        questions: [
          { id: 'q17-1', type: 'single', text: 'Сколько запятых нужно поставить?\n\nВетер усилился и пошёл дождь.', options: ['0', '1', '2'], correctAnswer: ['1'], explanation: 'Союз «и» между частями ССП выделяется запятой: «Ветер усилился, и пошёл дождь».', difficulty: 'easy', xpReward: 10, atoms: ['task17', 'punctuation'] }
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
          { id: 'q19-1', type: 'single', text: 'Сколько знаков нужно поставить?\n\nОн сказал: "Я приду".', options: ['0', '1', '2'], correctAnswer: ['0'], explanation: 'Точка ставится после закрывающей кавычки. Запятая перед прямой речью (после двоеточия) не нужна.', difficulty: 'medium', xpReward: 12, atoms: ['task19', 'punctuation'] }
        ]
      }
    ]
  }
]
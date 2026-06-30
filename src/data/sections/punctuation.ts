import { Section } from '../../types'
import { task16LessonQuestions } from '../task16LessonData'
import { task17Questions } from '../questions/task17'
import { task18Questions } from '../questions/task18'
import { task19Questions } from '../questions/task19'

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
    subtitle: 'Обособленные члены, вводные слова, ССП, СПП, бессоюзные',
    order: 17,
    icon: 'Pencil',
    color: '#ce82ff',
    lessons: [
      // ─── Задание 17. Обособленные члены (61 вопрос) ───
      {
        id: 'lesson-punct-17-1',
        sectionId: 'section-punct-2',
        title: 'Задание 17. Обособленные члены (1)',
        type: 'practice',
        description: 'Причастные и деепричастные обороты, уточняющие члены',
        xpReward: 60,
        prerequisites: [],
        questions: task17Questions.slice(0, 15)
      },
      {
        id: 'lesson-punct-17-2',
        sectionId: 'section-punct-2',
        title: 'Задание 17. Обособленные члены (2)',
        type: 'practice',
        description: 'Причастные и деепричастные обороты, уточняющие члены',
        xpReward: 60,
        prerequisites: ['lesson-punct-17-1'],
        questions: task17Questions.slice(15, 30)
      },
      {
        id: 'lesson-punct-17-3',
        sectionId: 'section-punct-2',
        title: 'Задание 17. Обособленные члены (3)',
        type: 'practice',
        description: 'Причастные и деепричастные обороты, уточняющие члены',
        xpReward: 60,
        prerequisites: ['lesson-punct-17-2'],
        questions: task17Questions.slice(30, 45)
      },
      {
        id: 'lesson-punct-17-4',
        sectionId: 'section-punct-2',
        title: 'Задание 17. Обособленные члены (4)',
        type: 'practice',
        description: 'Причастные и деепричастные обороты, уточняющие члены',
        xpReward: 60,
        prerequisites: ['lesson-punct-17-3'],
        questions: task17Questions.slice(45, 61)
      },
      // ─── Задание 18. Вводные конструкции и обращения (1 вопрос) ───
      {
        id: 'lesson-punct-18-1',
        sectionId: 'section-punct-2',
        title: 'Задание 18. Вводные конструкции и обращения',
        type: 'practice',
        description: 'Вводные слова, обращения, пояснительные и уточняющие обороты',
        xpReward: 60,
        prerequisites: [],
        questions: task18Questions
      },
      // ─── Задание 19. Сложное предложение (50 вопросов) ───
      {
        id: 'lesson-punct-19-1',
        sectionId: 'section-punct-2',
        title: 'Задание 19. Сложное предложение (1)',
        type: 'practice',
        description: 'ССП, СПП, бессоюзные, прямая речь',
        xpReward: 60,
        prerequisites: [],
        questions: task19Questions.slice(0, 15)
      },
      {
        id: 'lesson-punct-19-2',
        sectionId: 'section-punct-2',
        title: 'Задание 19. Сложное предложение (2)',
        type: 'practice',
        description: 'ССП, СПП, бессоюзные, прямая речь',
        xpReward: 60,
        prerequisites: ['lesson-punct-19-1'],
        questions: task19Questions.slice(15, 30)
      },
      {
        id: 'lesson-punct-19-3',
        sectionId: 'section-punct-2',
        title: 'Задание 19. Сложное предложение (3)',
        type: 'practice',
        description: 'ССП, СПП, бессоюзные, прямая речь',
        xpReward: 60,
        prerequisites: ['lesson-punct-19-2'],
        questions: task19Questions.slice(30, 45)
      },
      {
        id: 'lesson-punct-19-4',
        sectionId: 'section-punct-2',
        title: 'Задание 19. Сложное предложение (4)',
        type: 'practice',
        description: 'ССП, СПП, бессоюзные, прямая речь',
        xpReward: 60,
        prerequisites: ['lesson-punct-19-3'],
        questions: task19Questions.slice(45, 50)
      }
    ]
  }
]

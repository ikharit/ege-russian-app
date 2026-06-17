import { Section } from '../../types'
import { task1_3Sections } from './task1_3'
import { task22_27Sections } from './task22_27'

const textWorkLessons = [
  ...task1_3Sections.flatMap(s => s.lessons.map(l => ({ ...l, sectionId: 'section-text-work' }))),
  ...task22_27Sections.flatMap(s => s.lessons.map(l => ({ ...l, sectionId: 'section-text-work' }))),
]

export const textWorkSections: Section[] = [
  {
    id: 'section-text-work',
    courseId: 'ege-russian-2025',
    title: 'Работа с текстом',
    subtitle: 'Задания 1–3, 22–27',
    order: 1,
    icon: 'BookOpen',
    color: '#58cc02',
    lessons: textWorkLessons,
    groups: [
      {
        id: 'group-task1',
        title: 'Задание 1',
        subtitle: 'Логико-смысловые отношения',
        lessons: textWorkLessons.filter(l => l.id.startsWith('lesson-task1') || l.id.startsWith('q1-')),
      },
      {
        id: 'group-task2',
        title: 'Задание 2',
        subtitle: 'Лексический анализ слова',
        lessons: textWorkLessons.filter(l => l.id.startsWith('lesson-task2') || l.id.startsWith('q2-')),
      },
      {
        id: 'group-task3',
        title: 'Задание 3',
        subtitle: 'Функциональная стилистика',
        lessons: textWorkLessons.filter(l => l.id.startsWith('lesson-task3') || l.id.startsWith('q3-')),
      },
      {
        id: 'group-task22',
        title: 'Задание 22',
        subtitle: 'Изобразительно-выразительные средства',
        lessons: textWorkLessons.filter(l => l.id.startsWith('lesson-task22') || l.id.startsWith('q22-')),
      },
      {
        id: 'group-task23',
        title: 'Задание 23',
        subtitle: 'Информационно-смысловая переработка текста',
        lessons: textWorkLessons.filter(l => l.id.startsWith('lesson-task23') || l.id.startsWith('q23-')),
      },
      {
        id: 'group-task24',
        title: 'Задание 24',
        subtitle: 'Информативность текста',
        lessons: textWorkLessons.filter(l => l.id.startsWith('lesson-task24') || l.id.startsWith('q24-')),
      },
      {
        id: 'group-task25',
        title: 'Задание 25',
        subtitle: 'Лексический анализ',
        lessons: textWorkLessons.filter(l => l.id.startsWith('lesson-task25') || l.id.startsWith('q25-')),
      },
      {
        id: 'group-task26',
        title: 'Задание 26',
        subtitle: 'Логико-смысловые связи',
        lessons: textWorkLessons.filter(l => l.id.startsWith('lesson-task26') || l.id.startsWith('q26-')),
      },
      {
        id: 'group-task27',
        title: 'Задание 27',
        subtitle: 'Сочинение',
        lessons: textWorkLessons.filter(l => l.id.startsWith('lesson-task27') || l.id.startsWith('q27-')),
      },
    ],
  }
]

import { Section } from '../../types'
import { task4Sections } from './task4'
import { task5Sections } from './task5'
import { task6_8Sections } from './task6_8'

const allLessons = [
  ...task4Sections.flatMap(s => s.lessons.map(l => ({ ...l, sectionId: 'section-orthoepy-lex' }))),
  ...task5Sections.flatMap(s => s.lessons.map(l => ({ ...l, sectionId: 'section-orthoepy-lex' }))),
  ...task6_8Sections.flatMap(s => s.lessons.filter(l => l.id.startsWith('lesson-task6') || l.id.startsWith('q6-')).map(l => ({ ...l, sectionId: 'section-orthoepy-lex' }))),
]

export const orthoepyLexicographySections: Section[] = [
  {
    id: 'section-orthoepy-lex',
    courseId: 'ege-russian-2025',
    title: 'Орфоэпия и лексика',
    subtitle: 'Задания 4–6',
    order: 2,
    icon: 'Volume2',
    color: '#e74c3c',
    lessons: allLessons,
    groups: [
      {
        id: 'group-task4',
        title: 'Задание 4',
        subtitle: 'Ударение',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-task4') || l.id.startsWith('q4-')),
      },
      {
        id: 'group-task5',
        title: 'Задание 5',
        subtitle: 'Паронимы',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-task5') || l.id.startsWith('q5-')),
      },
      {
        id: 'group-task6',
        title: 'Задание 6',
        subtitle: 'Лексическая сочетаемость',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-task6') || l.id.startsWith('q6-')),
      },
    ],
  }
]

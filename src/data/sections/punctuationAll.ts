import { Section } from '../../types'
import { punctuationSections } from './punctuation'

const allLessons = punctuationSections.flatMap(s => s.lessons.map(l => ({ ...l, sectionId: 'section-punctuation' })))

export const punctuationAllSections: Section[] = [
  {
    id: 'section-punctuation',
    courseId: 'ege-russian-2025',
    title: 'Пунктуация',
    subtitle: 'Задания 16–21',
    order: 5,
    icon: 'Pencil',
    color: '#ce82ff',
    lessons: allLessons,
    groups: [
      {
        id: 'group-task16',
        title: 'Задание 16',
        subtitle: 'Однородные члены и сложное предложение',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-punct-16') || l.id.startsWith('q16-')),
      },
      {
        id: 'group-task17',
        title: 'Задание 17',
        subtitle: 'Обособленные члены',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-punct-17') || l.id.startsWith('q17-')),
      },
      {
        id: 'group-task18',
        title: 'Задание 18',
        subtitle: 'Вводные конструкции и обращения',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-punct-18') || l.id.startsWith('q18-')),
      },
      {
        id: 'group-task19',
        title: 'Задание 19',
        subtitle: 'Сложное предложение',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-punct-19') || l.id.startsWith('q19-')),
      },
      {
        id: 'group-task20',
        title: 'Задание 20',
        subtitle: 'Сложное предложение с разными видами связи',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-punct-20') || l.id.startsWith('q20-')),
      },
      {
        id: 'group-task21',
        title: 'Задание 21',
        subtitle: 'Пунктуационный анализ (повышенный уровень)',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-punct-21') || l.id.startsWith('q21-')),
      },
    ],
  }
]

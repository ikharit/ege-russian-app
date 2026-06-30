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
        lessons: allLessons.filter(l => l.id.startsWith('lesson-punct-17') || l.id.startsWith('q17-') || l.id.startsWith('lesson-task17') || l.id.startsWith('q17-1-')),
      },
      {
        id: 'group-task18',
        title: 'Задание 18',
        subtitle: 'Вводные конструкции и обращения',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-punct-18') || l.id.startsWith('q18-') || l.id.startsWith('lesson-task18') || l.id.startsWith('q18-1-')),
      },
      {
        id: 'group-task19',
        title: 'Задание 19',
        subtitle: 'Сложное предложение',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-punct-19') || l.id.startsWith('q19-') || l.id.startsWith('lesson-task19') || l.id.startsWith('q19-1-')),
      },
    ],
  }
]

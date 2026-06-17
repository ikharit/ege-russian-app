import { Section } from '../../types'
import { task6_8Sections } from './task6_8'

const allLessons = task6_8Sections.flatMap(s => s.lessons).filter(l => l.id.startsWith('lesson-task7') || l.id.startsWith('q7-') || l.id.startsWith('lesson-task8') || l.id.startsWith('q8-')).map(l => ({ ...l, sectionId: 'section-grammar' }))

export const grammarSections: Section[] = [
  {
    id: 'section-grammar',
    courseId: 'ege-russian-2025',
    title: 'Грамматика',
    subtitle: 'Задания 7–8',
    order: 3,
    icon: 'GraduationCap',
    color: '#ce82ff',
    lessons: allLessons,
    groups: [
      {
        id: 'group-task7',
        title: 'Задание 7',
        subtitle: 'Морфологические нормы',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-task7') || l.id.startsWith('q7-')),
      },
      {
        id: 'group-task8',
        title: 'Задание 8',
        subtitle: 'Синтаксические нормы (2 балла)',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-task8') || l.id.startsWith('q8-')),
      },
    ],
  }
]

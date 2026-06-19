import { Section } from '../../types'
import { punctuationSections } from './punctuation'
import { examTasksSections } from './examTasks'

const punctuationLessons = punctuationSections.flatMap(s => s.lessons.map(l => ({ ...l, sectionId: 'section-punctuation' })))

// Add task 20-21 lessons from examTasks.ts into the punctuation section
const task20Lessons = examTasksSections.find(s => s.id === 'section-task20')?.lessons.map(l => ({ ...l, sectionId: 'section-punctuation' })) || []
const task21Lessons = examTasksSections.find(s => s.id === 'section-task21')?.lessons.map(l => ({ ...l, sectionId: 'section-punctuation' })) || []

const allLessons = [...punctuationLessons, ...task20Lessons, ...task21Lessons]

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
      {
        id: 'group-task20',
        title: 'Задание 20',
        subtitle: 'Сложное предложение с разными видами связи',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-punct-20') || l.id.startsWith('q20-') || l.id.startsWith('lesson-task20') || l.id.startsWith('q20-1-') || l.id.startsWith('q20-2-')),
      },
      {
        id: 'group-task21',
        title: 'Задание 21',
        subtitle: 'Пунктуационный анализ (повышенный уровень)',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-punct-21') || l.id.startsWith('q21-') || l.id.startsWith('lesson-task21') || l.id.startsWith('q21-1-')),
      },
    ],
  }
]

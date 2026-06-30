import { Section } from '../../types'
import { orthographySections } from './orthography'
import { atomizationSections } from './atomization'
import { grammarSections } from './grammar'
import { nnnSections } from './n_nn'
import { shkolkovoSections } from './shkolkovo'
import { task9DooshinSections } from './dooshinSections'
import { task10DooshinSections } from './dooshinSections'
import { task11DooshinSections } from './dooshinSections'
import { task12DooshinSections } from './dooshinSections'
import { task14DooshinSections } from './dooshinSections'
import { task15DooshinSections } from './dooshinSections'

const allLessons = [
  ...orthographySections.flatMap(s => s.lessons.map(l => ({ ...l, sectionId: 'section-orthography' }))),
  ...atomizationSections.flatMap(s => s.lessons.map(l => ({ ...l, sectionId: 'section-orthography' }))),
  ...grammarSections.flatMap(s => s.lessons.map(l => ({ ...l, sectionId: 'section-orthography' }))),
  ...nnnSections.flatMap(s => s.lessons.map(l => ({ ...l, sectionId: 'section-orthography' }))),
  ...shkolkovoSections.flatMap(s => s.lessons.map(l => ({ ...l, sectionId: 'section-orthography' }))),
]

export const orthographyAllSections: Section[] = [
  {
    id: 'section-orthography',
    courseId: 'ege-russian-2025',
    title: 'Орфография',
    subtitle: 'Задания 9–15',
    order: 4,
    icon: 'SpellCheck',
    color: '#2E75B6',
    lessons: allLessons,
    groups: [
      {
        id: 'group-task9',
        title: 'Задание 9',
        subtitle: 'Правописание в корне',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-orth-9') || l.id.startsWith('q9-')),
        subgroups: task9DooshinSections[0]?.lessons.map(l => ({
          id: l.id.replace('lesson-', 'subgroup-'),
          title: l.title,
          subtitle: 'Дощинский',
          lessons: [l],
          isReviewSubgroup: true,
        })) || [],
      },
      {
        id: 'group-task10',
        title: 'Задание 10',
        subtitle: 'Приставки, Ъ и Ь',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-atom') || l.id.startsWith('q10-')),
        subgroups: task10DooshinSections[0]?.lessons.map(l => ({
          id: l.id.replace('lesson-', 'subgroup-'),
          title: l.title,
          subtitle: 'Дощинский',
          lessons: [l],
          isReviewSubgroup: true,
        })) || [],
      },
      {
        id: 'group-task11',
        title: 'Задание 11',
        subtitle: 'Суффиксы',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-orth-11') || l.id.startsWith('q11-')),
        subgroups: task11DooshinSections[0]?.lessons.map(l => ({
          id: l.id.replace('lesson-', 'subgroup-'),
          title: l.title,
          subtitle: 'Дощинский',
          lessons: [l],
          isReviewSubgroup: true,
        })) || [],
      },
      {
        id: 'group-task12',
        title: 'Задание 12',
        subtitle: 'Окончания глаголов и причастий',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-gram-12') || l.id.startsWith('q12-')),
        subgroups: task12DooshinSections[0]?.lessons.map(l => ({
          id: l.id.replace('lesson-', 'subgroup-'),
          title: l.title,
          subtitle: 'Дощинский',
          lessons: [l],
          isReviewSubgroup: true,
        })) || [],
      },
      {
        id: 'group-task13',
        title: 'Задание 13',
        subtitle: 'НЕ / НИ с частями речи',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-gram-13') || l.id.startsWith('q13-') || l.id.startsWith('sh13-')),
      },
      {
        id: 'group-task14',
        title: 'Задание 14',
        subtitle: 'Слитное, раздельное и дефисное написание',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-gram-14') || l.id.startsWith('q14-')),
        subgroups: task14DooshinSections[0]?.lessons.map(l => ({
          id: l.id.replace('lesson-', 'subgroup-'),
          title: l.title,
          subtitle: 'Дощинский',
          lessons: [l],
          isReviewSubgroup: true,
        })) || [],
      },
      {
        id: 'group-task15',
        title: 'Задание 15',
        subtitle: 'Н / НН',
        lessons: allLessons.filter(l => 
          l.id.startsWith('lesson-nnn-15') || 
          l.id.startsWith('q15-') || 
          l.id.startsWith('lesson-dooshin-15') || 
          l.id.startsWith('lesson-shkolkovo-task15')
        ),
        subgroups: task15DooshinSections[0]?.lessons.map(l => ({
          id: l.id.replace('lesson-', 'subgroup-'),
          title: l.title,
          subtitle: 'Дощинский',
          lessons: [l],
          isReviewSubgroup: true,
        })) || [],
      },
    ],
  }
]

import { Section } from '../../types'
import { task4Sections } from './task4'
import { task5Sections } from './task5'
import { task6_8Sections } from './task6_8'
import { orthographySections } from './orthography'
import { atomizationSections } from './atomization'
import { grammarSections } from './grammar'
import { nnnSections } from './n_nn'

const allLessons = [
  ...task4Sections.flatMap(s => s.lessons.map(l => ({ ...l, sectionId: 'section-orth-grammar' }))),
  ...task5Sections.flatMap(s => s.lessons.map(l => ({ ...l, sectionId: 'section-orth-grammar' }))),
  ...task6_8Sections.flatMap(s => s.lessons.map(l => ({ ...l, sectionId: 'section-orth-grammar' }))),
  ...orthographySections.flatMap(s => s.lessons.map(l => ({ ...l, sectionId: 'section-orth-grammar' }))),
  ...atomizationSections.flatMap(s => s.lessons.map(l => ({ ...l, sectionId: 'section-orth-grammar' }))),
  ...grammarSections.flatMap(s => s.lessons.map(l => ({ ...l, sectionId: 'section-orth-grammar' }))),
  ...nnnSections.flatMap(s => s.lessons.map(l => ({ ...l, sectionId: 'section-orth-grammar' }))),
]

export const orthographyGrammarSections: Section[] = [
  {
    id: 'section-orth-grammar',
    courseId: 'ege-russian-2025',
    title: 'Орфография и грамматика',
    subtitle: 'Задания 4–15',
    order: 2,
    icon: 'SpellCheck',
    color: '#2E75B6',
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
      {
        id: 'group-task7',
        title: 'Задание 7',
        subtitle: 'Морфологические нормы',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-task7') || l.id.startsWith('q7-')),
      },
      {
        id: 'group-task8',
        title: 'Задание 8',
        subtitle: 'Синтаксические нормы',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-task8') || l.id.startsWith('q8-')),
      },
      {
        id: 'group-task9',
        title: 'Задание 9',
        subtitle: 'Правописание в корне',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-orth-9') || l.id.startsWith('q9-')),
      },
      {
        id: 'group-task10',
        title: 'Задание 10',
        subtitle: 'Приставки, Ъ и Ь',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-atom') || l.id.startsWith('q10-')),
      },
      {
        id: 'group-task11',
        title: 'Задание 11',
        subtitle: 'Суффиксы',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-orth-11') || l.id.startsWith('q11-')),
      },
      {
        id: 'group-task12',
        title: 'Задание 12',
        subtitle: 'Окончания глаголов и причастий',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-gram-12') || l.id.startsWith('q12-')),
      },
      {
        id: 'group-task13',
        title: 'Задание 13',
        subtitle: 'НЕ с разными частями речи',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-gram-13') || l.id.startsWith('q13-')),
      },
      {
        id: 'group-task14',
        title: 'Задание 14',
        subtitle: 'НИ и НЕ',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-gram-14') || l.id.startsWith('q14-')),
      },
      {
        id: 'group-task15',
        title: 'Задание 15',
        subtitle: 'Н / НН',
        lessons: allLessons.filter(l => l.id.startsWith('lesson-nnn') || l.id.startsWith('q15-')),
      },
    ],
  }
]

import { Section } from '../../types'
import { dooshinSections } from './dooshin'

const allDooshinLessons = dooshinSections.flatMap(s => s.lessons.map(l => ({ ...l, sectionId: 'section-dooshin-all' })))

export const dooshinSection: Section = {
  id: 'section-dooshin-all',
  courseId: 'ege-russian-2025',
  title: 'Отработки из Дощинского',
  subtitle: '50 вариантов ЕГЭ 2026 — задания 9-20',
  order: 100,
  icon: 'BookOpen',
  color: '#58cc02',
  lessons: allDooshinLessons,
  groups: dooshinSections.map(s => ({
    id: s.id,
    title: s.title,
    subtitle: s.subtitle,
    lessons: s.lessons.map(l => ({ ...l, sectionId: 'section-dooshin-all' }))
  }))
}

// Lightweight meta-section for eager loading (questions stripped)
export const dooshinMetaSection: Section = {
  ...dooshinSection,
  lessons: dooshinSection.lessons.map(l => ({ ...l, questions: [] })),
  groups: dooshinSection.groups?.map(g => ({
    ...g,
    lessons: g.lessons.map(l => ({ ...l, questions: [] }))
  }))
}

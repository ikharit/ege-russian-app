import { Course, Section, LessonGroup } from '../types'
import { textWorkSections } from './sections/textWork'
import { orthoepyLexicographySections } from './sections/orthoepyLexicography'
import { grammarSections } from './sections/grammarMorphologySyntax'
import { orthographyAllSections } from './sections/orthographyAll'
import { punctuationAllSections } from './sections/punctuationAll'
import { dooshinSection } from './sections/dooshinUnified'
import { task22_27Sections } from './sections/task22_27'

// Встраиваем отработки Дощинского внутрь соответствующих групп уроков как подгруппы
const dooshinGroups = dooshinSection.groups || []

const mergeDooshinIntoGroups = (sections: Section[], taskNumbers: string[]) => {
  return sections.map((s) => {
    const mergedGroups = (s.groups || []).map(g => {
      const match = g.id.match(/^group-task(\d+)$/)
      if (match && taskNumbers.includes(match[1])) {
        const dooshinGroup = dooshinGroups.find(dg => dg.id === g.id)
        if (dooshinGroup) {
          const reviewSubgroup: LessonGroup = {
            id: `${g.id}-review`,
            title: 'Отработки из Дощинского',
            subtitle: dooshinGroup.subtitle,
            lessons: dooshinGroup.lessons.map(l => ({ ...l, sectionId: s.id })),
            isReviewSubgroup: true,
            prerequisites: g.lessons.map(l => l.id), // все обычные уроки должны быть пройдены
          }
          return { ...g, subgroups: [reviewSubgroup] }
        }
      }
      return g
    })

    // Also add dooshin lessons to flat lessons array (for Lesson.tsx lookup)
    const mergedLessons = [...s.lessons]
    for (const g of mergedGroups) {
      for (const sg of (g.subgroups || [])) {
        for (const l of sg.lessons) {
          if (!mergedLessons.some(ml => ml.id === l.id)) {
            mergedLessons.push(l)
          }
        }
      }
    }

    return { ...s, groups: mergedGroups, lessons: mergedLessons }
  })
}

const grammarWithDooshin = mergeDooshinIntoGroups(grammarSections, ['12', '13', '14'])
const orthographyWithDooshin = mergeDooshinIntoGroups(orthographyAllSections, ['9', '10', '11', '15'])
const punctuationWithDooshin = mergeDooshinIntoGroups(punctuationAllSections, ['16', '17', '18', '19', '20', '21'])

export const course: Course = {
  id: 'ege-russian-2025',
  title: 'ЕГЭ Русский язык 2026',
  description: 'Подготовка к экзамену по русскому языку в формате Duolingo',
  sections: [
    ...textWorkSections,
    ...orthoepyLexicographySections,
    ...grammarWithDooshin,
    ...orthographyWithDooshin,
    ...punctuationWithDooshin,
    ...task22_27Sections,
  ],
}

export { achievements } from './achievements'

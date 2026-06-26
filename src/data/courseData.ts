import { Course, Section } from '../types'
import { textWorkSections } from './sections/textWork'
import { orthoepyLexicographySections } from './sections/orthoepyLexicography'
import { grammarSections } from './sections/grammarMorphologySyntax'
import { orthographyAllSections } from './sections/orthographyAll'
import { punctuationAllSections } from './sections/punctuationAll'
import { dooshinSection } from './sections/dooshinUnified'
import { task22_27Sections } from './sections/task22_27'

// Встраиваем отработки Дощинского внутрь соответствующих групп уроков
const dooshinGroups = dooshinSection.groups || []

const mergeDooshinIntoGroups = (sections: Section[], taskNumbers: string[]) => {
  return sections.map((s) => {
    // Merge dooshin lessons into matching groups
    const mergedGroups = (s.groups || []).map(g => {
      const match = g.id.match(/^group-task(\d+)$/)
      if (match && taskNumbers.includes(match[1])) {
        const dooshinGroup = dooshinGroups.find(dg => dg.id === g.id)
        if (dooshinGroup) {
          return {
            ...g,
            lessons: [
              ...g.lessons,
              ...dooshinGroup.lessons.map(l => ({ ...l, sectionId: s.id }))
            ],
          }
        }
      }
      return g
    })

    // Also add dooshin lessons to flat lessons array (for Lesson.tsx lookup)
    const mergedLessons = [...s.lessons]
    for (const g of mergedGroups) {
      const match = g.id.match(/^group-task(\d+)$/)
      if (match && taskNumbers.includes(match[1])) {
        const dooshinGroup = dooshinGroups.find(dg => dg.id === g.id)
        if (dooshinGroup) {
          for (const l of dooshinGroup.lessons) {
            if (!mergedLessons.some(ml => ml.id === l.id)) {
              mergedLessons.push({ ...l, sectionId: s.id })
            }
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

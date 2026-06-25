import { Course, Section } from '../types'
import { textWorkSections } from './sections/textWork'
import { orthoepyLexicographySections } from './sections/orthoepyLexicography'
import { grammarSections } from './sections/grammarMorphologySyntax'
import { orthographyAllSections } from './sections/orthographyAll'
import { punctuationAllSections } from './sections/punctuationAll'
import { dooshinMetaSection } from './sections/dooshinMeta'
import { task22_27Sections } from './sections/task22_27'

// Встраиваем отработки Дощинского в конец соответствующих секций
const dooshinGroups = dooshinMetaSection.groups || []

const embedDooshin = (sections: Section[], taskNumbers: string[]) => {
  return sections.map((s) => ({
    ...s,
    groups: [
      ...(s.groups || []),
      ...dooshinGroups
        .filter((g) => taskNumbers.includes(g.id.replace('group-task', '')))
        .map((g) => ({
          ...g,
          id: `${g.id}-embedded`,
          title: `Отработки Дощинского: ${g.title}`,
        })),
    ],
  }))
}

const grammarWithDooshin = embedDooshin(grammarSections, ['12', '13', '14'])
const orthographyWithDooshin = embedDooshin(orthographyAllSections, ['9', '10', '11', '15'])
const punctuationWithDooshin = embedDooshin(punctuationAllSections, ['16', '17', '18', '19', '20', '21'])

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

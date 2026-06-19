import { Course } from '../types'
import { textWorkSections } from './sections/textWork'
import { orthoepyLexicographySections } from './sections/orthoepyLexicography'
import { grammarSections } from './sections/grammarMorphologySyntax'
import { orthographyAllSections } from './sections/orthographyAll'
import { punctuationAllSections } from './sections/punctuationAll'
import { dooshinMetaSection } from './sections/dooshinMeta'
import { task22_27Sections } from './sections/task22_27'

export const course: Course = {
  id: 'ege-russian-2025',
  title: 'ЕГЭ Русский язык 2026',
  description: 'Подготовка к экзамену по русскому языку в формате Duolingo',
  sections: [
    ...textWorkSections,
    ...orthoepyLexicographySections,
    ...grammarSections,
    ...orthographyAllSections,
    ...punctuationAllSections,
    ...task22_27Sections,
    dooshinMetaSection,
  ]
}

export { achievements } from './achievements'

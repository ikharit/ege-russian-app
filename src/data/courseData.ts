import { Course } from '../types'
import { textWorkSections } from './sections/textWork'
import { orthographyGrammarSections } from './sections/orthographyGrammar'
import { punctuationAllSections } from './sections/punctuationAll'

export const course: Course = {
  id: 'ege-russian-2025',
  title: 'ЕГЭ Русский язык 2026',
  description: 'Подготовка к экзамену по русскому языку в формате Duolingo',
  sections: [
    ...textWorkSections,
    ...orthographyGrammarSections,
    ...punctuationAllSections,
  ]
}

export { achievements } from './achievements'

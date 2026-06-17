import { Course } from '../types'
import { orthographySections } from './sections/orthography'
import { punctuationSections } from './sections/punctuation'
import { grammarSections } from './sections/grammar'

export const course: Course = {
  id: 'ege-russian-2025',
  title: 'ЕГЭ Русский язык 2025',
  description: 'Подготовка к экзамену по русскому языку в формате Duolingo',
  sections: [
    ...orthographySections,
    ...punctuationSections,
    ...grammarSections,
  ]
}

export { achievements } from './achievements'

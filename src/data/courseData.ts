import { Course } from '../types'
import { textWorkSections } from './sections/textWork'
import { orthoepyLexicographySections } from './sections/orthoepyLexicography'
import { grammarSections } from './sections/grammarMorphologySyntax'
import { orthographyAllSections } from './sections/orthographyAll'
import { punctuationAllSections } from './sections/punctuationAll'
import { task22_27Sections } from './sections/task22_27'
import {
  task5DooshinSections,
  task6DooshinSections,
  task9DooshinSections,
  task10DooshinSections,
  task11DooshinSections,
  task12DooshinSections,
  task14DooshinSections,
  task15DooshinSections,
  task16DooshinSections,
  task19DooshinSections,
  task20DooshinSections,
} from './sections/dooshinSections'

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
    ...task5DooshinSections,
    ...task6DooshinSections,
    ...task9DooshinSections,
    ...task10DooshinSections,
    ...task11DooshinSections,
    ...task12DooshinSections,
    ...task14DooshinSections,
    ...task15DooshinSections,
    ...task16DooshinSections,
    ...task19DooshinSections,
    ...task20DooshinSections,
  ],
}

export { achievements } from './achievements'

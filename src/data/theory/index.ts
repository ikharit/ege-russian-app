// Центральный экспорт теории по заданиям ЕГЭ

import type { TheorySection as TS, TheoryRule as TR } from './task4'
export type TheorySection = TS
export type TheoryRule = TR

import task4Theory from './task4'
import task5Theory from './task5'
import task7Theory from './task7'
import task9Theory from './task9'
import task10Theory from './task10'
import task11Theory from './task11'
import task12Theory from './task12'
import task13Theory from './task13'
import task14Theory from './task14'

export { task4Theory, task5Theory, task7Theory, task9Theory, task10Theory, task11Theory, task12Theory, task13Theory, task14Theory }

const allSections: TS[] = [
  task4Theory,
  task5Theory,
  task7Theory,
  task9Theory,
  task10Theory,
  task11Theory,
  task12Theory,
  task13Theory,
  task14Theory,
]

export function getRulesByTaskNumber(taskNumber: string): TR[] {
  const section = allSections.find(s => s.taskNumber === taskNumber)
  return section?.rules ?? []
}

export function getRelevantRules(taskNumber: string, atoms?: string[]): TR[] {
  const rules = getRulesByTaskNumber(taskNumber)
  if (!atoms || atoms.length === 0 || rules.length === 0) {
    return rules
  }

  // Filter rules that have relatedAtoms intersecting with question atoms
  const relevant = rules.filter(
    rule => rule.relatedAtoms && rule.relatedAtoms.some(ra => atoms.includes(ra))
  )

  if (relevant.length > 0) {
    return relevant
  }

  // Fallback: return all rules if no specific match
  return rules
}

export function getSectionByTaskNumber(taskNumber: string): TS | undefined {
  return allSections.find(s => s.taskNumber === taskNumber)
}

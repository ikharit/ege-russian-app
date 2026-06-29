// ═══════════════════════════════════════════════════════════════════════════════
// ЕДИНАЯ БАЗА ВСЕХ ВОПРОСОВ ЕГЭ — ИНДЕКСЫ
// ═══════════════════════════════════════════════════════════════════════════════
//
// Все вопросы нормализованы. Импортируй отсюда для работы с вопросами.
//
// Агенты: добавляй вопросы в файл questions/taskX.ts, затем они автоматически
// попадают в индексы через этот файл.
//
// Агент: Агент 7 | Дата: 2026-06-29T18:46:51.434Z

import type { UnifiedQuestion } from './types'

import { task1Questions } from './task1'
import { task2Questions } from './task2'
import { task3Questions } from './task3'
import { task4Questions } from './task4'
import { task5Questions } from './task5'
import { task6Questions } from './task6'
import { task7Questions } from './task7'
import { task8Questions } from './task8'
import { task9Questions } from './task9'
import { task10Questions } from './task10'
import { task11Questions } from './task11'
import { task12Questions } from './task12'
import { task13Questions } from './task13'
import { task14Questions } from './task14'
import { task15Questions } from './task15'
import { task16Questions } from './task16'
import { task17Questions } from './task17'
import { task20Questions } from './task20'
import { task21Questions } from './task21'
import { task22Questions } from './task22'
import { task23Questions } from './task23'
import { task24Questions } from './task24'
import { task25Questions } from './task25'
import { task26Questions } from './task26'
import { task27Questions } from './task27'
import { dooshinQuestions } from './dooshin'

// ─── Все вопросы ───
export const allQuestions: UnifiedQuestion[] = [
  ...task1Questions,
  ...task2Questions,
  ...task3Questions,
  ...task4Questions,
  ...task5Questions,
  ...task6Questions,
  ...task7Questions,
  ...task8Questions,
  ...task9Questions,
  ...task10Questions,
  ...task11Questions,
  ...task12Questions,
  ...task13Questions,
  ...task14Questions,
  ...task15Questions,
  ...task16Questions,
  ...task17Questions,
  ...task20Questions,
  ...task21Questions,
  ...task22Questions,
  ...task23Questions,
  ...task24Questions,
  ...task25Questions,
  ...task26Questions,
  ...task27Questions,
  ...dooshinQuestions,
]

// ─── Индекс по ID ───
export const questionById: Record<string, UnifiedQuestion> = Object.fromEntries(
  allQuestions.map(q => [q.id, q])
)

// ─── Индекс по заданию ───
export const questionsByTask: Record<string, UnifiedQuestion[]> = {}
for (const q of allQuestions) {
  const tn = q.taskNumber || 'unknown'
  if (!questionsByTask[tn]) questionsByTask[tn] = []
  questionsByTask[tn].push(q)
}

// ─── Индекс по атому ───
export const questionsByAtom: Record<string, UnifiedQuestion[]> = {}
for (const q of allQuestions) {
  for (const atom of q.atoms) {
    if (!questionsByAtom[atom]) questionsByAtom[atom] = []
    questionsByAtom[atom].push(q)
  }
}

// ─── Индекс по тегу ───
export const questionsByTag: Record<string, UnifiedQuestion[]> = {}
for (const q of allQuestions) {
  for (const tag of q.tags) {
    if (!questionsByTag[tag]) questionsByTag[tag] = []
    questionsByTag[tag].push(q)
  }
}

// ─── Индекс по сложности ───
export const questionsByDifficulty: Record<string, UnifiedQuestion[]> = {}
for (const q of allQuestions) {
  const d = q.difficulty
  if (!questionsByDifficulty[d]) questionsByDifficulty[d] = []
  questionsByDifficulty[d].push(q)
}

// ─── Статистика ───
export const questionStats = {
  total: allQuestions.length,
  byTask: Object.fromEntries(Object.entries(questionsByTask).map(([k, v]) => [k, v.length])),
  byAtom: Object.fromEntries(Object.entries(questionsByAtom).map(([k, v]) => [k, v.length])),
  byTag: Object.fromEntries(Object.entries(questionsByTag).map(([k, v]) => [k, v.length])),
  byDifficulty: Object.fromEntries(Object.entries(questionsByDifficulty).map(([k, v]) => [k, v.length])),
}

console.log('[unified-db] Вопросов загружено:', allQuestions.length)

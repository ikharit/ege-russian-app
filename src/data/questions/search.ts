// ═══════════════════════════════════════════════════════════════════════════════
//
// ⚠️ ВНИМАНИЕ АГЕНТАМ: БАЗА ДАННЫХ ПЕРЕПИСАНА (Агент 7, 2026-06-29)
// Старые файлы `src/data/taskXQuestions.ts` теперь — ТОЛЬКО АДАПТЕРЫ.
// Источник правды: `src/data/questions/taskX.ts`. Не добавляй в старые файлы!
//
//
// 📋 ПРАВИЛО ДЛЯ АГЕНТОВ: Если создашь временные файлы или устаревшие
// адаптеры — УДАЛИ их или перемести в workspace/archive/ege-app/
//
// ПОИСК И ФИЛЬТРАЦИЯ ВОПРОСОВ — API для агентов
// ═══════════════════════════════════════════════════════════════════════════════
//
// Удобные функции для поиска и фильтрации вопросов из единой базы.
// Импортируй отсюда для работы с вопросами.
//
// Агент: Агент 7

import type { UnifiedQuestion } from './types'
import {
  allQuestions,
  questionById,
  questionsByTask,
  questionsByAtom,
  questionsByTag,
  questionsByDifficulty,
} from './index'

// ─── Поиск по ID ───
export function findById(id: string): UnifiedQuestion | undefined {
  return questionById[id]
}

// ─── Поиск по тексту (вопрос или пояснение) ───
export function searchQuestions(query: string): UnifiedQuestion[] {
  const lower = query.toLowerCase()
  return allQuestions.filter(q =>
    q.text.toLowerCase().includes(lower) ||
    q.explanation.toLowerCase().includes(lower)
  )
}

// ─── Поиск по заданию ───
export function getQuestionsByTask(taskNumber: string): UnifiedQuestion[] {
  return questionsByTask[taskNumber] || []
}

// ─── Поиск по атому (навык/тема) ───
export function getQuestionsByAtom(atom: string): UnifiedQuestion[] {
  return questionsByAtom[atom] || []
}

// ─── Поиск по нескольким атомам (AND) ───
export function getQuestionsByAtoms(atoms: string[]): UnifiedQuestion[] {
  return allQuestions.filter(q => atoms.every(a => q.atoms.includes(a)))
}

// ─── Поиск по тегу ───
export function getQuestionsByTag(tag: string): UnifiedQuestion[] {
  return questionsByTag[tag] || []
}

// ─── Поиск по нескольким тегам (AND) ───
export function getQuestionsByTags(tags: string[]): UnifiedQuestion[] {
  return allQuestions.filter(q => tags.every(t => q.tags.includes(t)))
}

// ─── Фильтр по сложности ───
export function getQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): UnifiedQuestion[] {
  return questionsByDifficulty[difficulty] || []
}

// ─── Случайные вопросы по заданию ───
export function getRandomQuestionsByTask(
  taskNumber: string,
  count: number
): UnifiedQuestion[] {
  const pool = questionsByTask[taskNumber] || []
  return shuffleArray(pool).slice(0, count)
}

// ─── Случайные вопросы по атому ───
export function getRandomQuestionsByAtom(
  atom: string,
  count: number
): UnifiedQuestion[] {
  const pool = questionsByAtom[atom] || []
  return shuffleArray(pool).slice(0, count)
}

// ─── Случайные вопросы по тегам ───
export function getRandomQuestionsByTags(
  tags: string[],
  count: number
): UnifiedQuestion[] {
  const pool = getQuestionsByTags(tags)
  return shuffleArray(pool).slice(0, count)
}

// ─── Фильтр: исключить теги ───
export function excludeTags(questions: UnifiedQuestion[], tags: string[]): UnifiedQuestion[] {
  return questions.filter(q => !tags.some(t => q.tags.includes(t)))
}

// ─── Фильтр: только теги ───
export function includeOnlyTags(questions: UnifiedQuestion[], tags: string[]): UnifiedQuestion[] {
  return questions.filter(q => tags.some(t => q.tags.includes(t)))
}

// ─── Статистика по заданию ───
export function getTaskStats(taskNumber: string) {
  const questions = questionsByTask[taskNumber] || []
  return {
    total: questions.length,
    byDifficulty: {
      easy: questions.filter(q => q.difficulty === 'easy').length,
      medium: questions.filter(q => q.difficulty === 'medium').length,
      hard: questions.filter(q => q.difficulty === 'hard').length,
    },
    atoms: [...new Set(questions.flatMap(q => q.atoms))],
    tags: [...new Set(questions.flatMap(q => q.tags))],
  }
}

// ─── Все уникальные атомы ───
export function getAllAtoms(): string[] {
  return [...new Set(allQuestions.flatMap(q => q.atoms))].sort()
}

// ─── Все уникальные теги ───
export function getAllTags(): string[] {
  return [...new Set(allQuestions.flatMap(q => q.tags))].sort()
}

// ─── Хелпер: перемешать массив ───
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

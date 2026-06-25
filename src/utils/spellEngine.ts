/**
 * Локальный движок проверки орфографии
 * Адаптирован из практик Орфограммки: правила + словарь + исключения
 */

import { exceptionWords, isInDictionary, getWordInfo } from '../data/spellDictionary'
import { spellRules, SpellRule } from '../data/spellRules'

export interface SpellCheckResult {
  original: string
  corrected: string
  issues: SpellIssue[]
  isCorrect: boolean
}

export interface SpellIssue {
  type: 'spelling' | 'punctuation' | 'grammar' | 'style' | 'exception'
  message: string
  rule: string
  severity: 'error' | 'warning' | 'info'
  fix?: string
  position?: [number, number]
}

/**
 * Проверить слово по словарю и правилам
 */
export function checkWord(word: string): SpellCheckResult {
  const issues: SpellIssue[] = []
  const lowerWord = word.toLowerCase()

  // 1. Проверка исключений
  if (exceptionWords[lowerWord]) {
    const exc = exceptionWords[lowerWord]
    issues.push({
      type: 'exception',
      message: `${exc.note}`,
      rule: exc.rule,
      severity: 'info',
    })
  }

  // 2. Проверка по словарю
  const dictInfo = getWordInfo(word)
  if (!dictInfo) {
    issues.push({
      type: 'spelling',
      message: `Слово «${word}» не найдено в словаре. Возможно, опечатка или редкое слово.`,
      rule: 'dictionary',
      severity: 'warning',
    })
  }

  // 3. Применение правил
  for (const rule of spellRules) {
    if (rule.test(word)) {
      issues.push({
        type: rule.category,
        message: rule.explanation,
        rule: rule.id,
        severity: rule.severity,
        fix: rule.fix,
      })
    }
  }

  return {
    original: word,
    corrected: issues.length > 0 ? issues[0].fix || word : word,
    issues,
    isCorrect: issues.filter(i => i.severity === 'error').length === 0,
  }
}

/**
 * Проверить текст (предложение или фразу)
 */
export function checkText(text: string): SpellCheckResult {
  const issues: SpellIssue[] = []
  const words = text.split(/[\s.,!?;:\-–—]+/).filter(Boolean)

  for (const word of words) {
    const cleanWord = word.replace(/[^а-яё]/gi, '').toLowerCase()
    if (cleanWord.length < 2) continue
    const result = checkWord(cleanWord)
    issues.push(...result.issues)
  }

  return {
    original: text,
    corrected: text,
    issues,
    isCorrect: issues.filter(i => i.severity === 'error').length === 0,
  }
}

/**
 * Проверить ответ на задание (вариант А, Б, В или вставка буквы)
 */
export function checkAnswer(answer: string, correctAnswer: string, taskType: string): { isCorrect: boolean; explanation: string } {
  const normalizedAnswer = answer.trim().toLowerCase()
  const normalizedCorrect = correctAnswer.trim().toLowerCase()

  // Точное совпадение
  if (normalizedAnswer === normalizedCorrect) {
    return { isCorrect: true, explanation: 'Верно!' }
  }

  // Для заданий на вставку буквы — проверить, что введена правильная буква
  if (taskType === 'insert-letter') {
    const answerLetter = normalizedAnswer.replace(/[^а-яё]/gi, '')
    const correctLetter = normalizedCorrect.replace(/[^а-яё]/gi, '')
    if (answerLetter === correctLetter) {
      return { isCorrect: true, explanation: `Верно! Пропущенная буква: «${correctLetter}».` }
    }
  }

  // Для заданий на ударение — проверить букву ударения
  if (taskType === 'accent') {
    const answerLetter = normalizedAnswer.replace(/[^а-яё]/gi, '')
    const correctLetter = normalizedCorrect.replace(/[^а-яё]/gi, '')
    if (answerLetter === correctLetter) {
      return { isCorrect: true, explanation: `Верно! Ударение падает на букву «${correctLetter}».` }
    }
  }

  // Проверка через исключения
  const wordInfo = getWordInfo(normalizedAnswer)
  if (wordInfo && wordInfo.isException) {
    return { isCorrect: false, explanation: `Неверно. ${wordInfo.note}` }
  }

  // Проверка через правила
  const result = checkWord(normalizedAnswer)
  if (result.issues.length > 0) {
    const error = result.issues.find(i => i.severity === 'error')
    if (error) {
      return { isCorrect: false, explanation: `Неверно. ${error.message}` }
    }
  }

  // Проверка на опечатку (одна буква отличается)
  if (normalizedAnswer.length === normalizedCorrect.length) {
    let diff = 0
    for (let i = 0; i < normalizedAnswer.length; i++) {
      if (normalizedAnswer[i] !== normalizedCorrect[i]) diff++
    }
    if (diff === 1) {
      return { isCorrect: false, explanation: 'Опечатка! В ответе отличается одна буква. Проверьте правописание.' }
    }
  }

  return { isCorrect: false, explanation: 'Неверно. Попробуйте ещё раз.' }
}

/**
 * Получить подсказку по ошибке (для заданий на ударение/орфографию)
 */
export function getHint(word: string, taskType: string): string | null {
  const lower = word.toLowerCase()
  
  if (exceptionWords[lower]) {
    return exceptionWords[lower].note
  }

  const result = checkWord(lower)
  const error = result.issues.find(i => i.severity === 'error')
  if (error) {
    return error.message
  }

  return null
}

/**
 * Проверить, является ли слово исключением (для заданий на ударение)
 */
export function isExceptionWord(word: string): boolean {
  return !!exceptionWords[word.toLowerCase()]
}

/**
 * Получить правило для слова (для объяснений в заданиях)
 */
export function getRuleForWord(word: string): { rule: string; note: string } | null {
  const lower = word.toLowerCase()
  if (exceptionWords[lower]) {
    return { rule: exceptionWords[lower].rule, note: exceptionWords[lower].note }
  }

  const result = checkWord(lower)
  const rule = result.issues.find(i => i.type === 'spelling')
  if (rule) {
    return { rule: rule.rule, note: rule.message }
  }

  return null
}

/**
 * Валидатор вопросов на основе локального движка проверки орфографии
 * Проверяет: правильные ответы, правила, объяснения
 */

import { checkAnswer, checkWord, getRuleForWord, isExceptionWord } from './spellEngine'

export interface ValidationResult {
  questionId: string
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
}

export interface ValidationError {
  field: string
  message: string
  severity: 'error' | 'warning'
  suggestion?: string
}

/**
 * Валидировать один вопрос
 */
export function validateQuestion(question: {
  id: string
  question?: string
  answer?: string
  correct?: string
  explanation?: string
  options?: string[]
  correctAnswer?: string
  rule?: string
  taskType?: string
  word?: string
  letters?: string
}): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []

  const answer = question.answer || question.correct || question.correctAnswer || ''
  const taskType = question.taskType || 'insert-letter'
  const word = question.word || question.question || ''

  // 1. Проверка: есть ли ответ
  if (!answer || answer.trim() === '') {
    errors.push({ field: 'answer', message: 'Ответ не указан', severity: 'error' })
  }

  // 2. Проверка ответа через движок
  if (answer) {
    const result = checkAnswer(answer, answer, taskType)
    if (!result.isCorrect) {
      // Это странно — ответ должен быть верным сам по себе
      errors.push({
        field: 'answer',
        message: `Ответ «${answer}» не проходит валидацию движка: ${result.explanation}`,
        severity: 'error',
        suggestion: 'Проверьте правильность ответа',
      })
    }
  }

  // 3. Проверка слова из вопроса
  if (word) {
    const wordResult = checkWord(word.replace(/[_.]/g, ''))
    if (wordResult.issues.some(i => i.severity === 'error')) {
      errors.push({
        field: 'word',
        message: `Слово в вопросе «${word}» содержит ошибки: ${wordResult.issues.filter(i => i.severity === 'error').map(i => i.message).join(', ')}`,
        severity: 'error',
      })
    }
  }

  // 4. Проверка объяснения
  if (question.explanation) {
    const explanationResult = checkWord(question.explanation)
    if (explanationResult.issues.some(i => i.severity === 'error')) {
      warnings.push({
        field: 'explanation',
        message: 'В объяснении есть ошибки',
        severity: 'warning',
      })
    }
  }

  // 5. Проверка правила
  if (question.rule) {
    const ruleResult = checkWord(question.rule)
    if (ruleResult.issues.some(i => i.severity === 'error')) {
      warnings.push({
        field: 'rule',
        message: 'В правиле есть ошибки',
        severity: 'warning',
      })
    }
  }

  // 6. Специфические проверки по типу задания
  if (taskType === 'accent' && word) {
    const cleanWord = word.replace(/[_.]/g, '').toLowerCase()
    if (!isExceptionWord(cleanWord) && !getRuleForWord(cleanWord)) {
      warnings.push({
        field: 'word',
        message: `Слово «${cleanWord}» не найдено в словаре ударений. Возможно, нужно добавить в исключения.`,
        severity: 'warning',
      })
    }
  }

  return {
    questionId: question.id,
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Валидировать массив вопросов
 */
export function validateQuestions(questions: any[]): { valid: ValidationResult[]; invalid: ValidationResult[] } {
  const results = questions.map(q => validateQuestion(q))
  return {
    valid: results.filter(r => r.isValid),
    invalid: results.filter(r => !r.isValid),
  }
}

/**
 * Проверить, что правильный ответ соответствует правилу
 */
export function validateRuleMatch(question: {
  answer: string
  rule: string
  explanation: string
  word: string
}): boolean {
  const ruleInfo = getRuleForWord(question.word.replace(/[_.]/g, ''))
  if (!ruleInfo) return true // нет правила — не можем проверить

  // Проверяем, что правило из вопроса соответствует правилу из движка
  return question.rule.toLowerCase().includes(ruleInfo.rule.toLowerCase()) ||
         ruleInfo.rule.toLowerCase().includes(question.rule.toLowerCase())
}

/**
 * Быстрая проверка: правильный ли ответ для данного слова
 */
export function quickValidateAnswer(word: string, answer: string, taskType: string): {
  isCorrect: boolean
  explanation: string
  suggestion?: string
} {
  const result = checkAnswer(answer, answer, taskType)

  if (!result.isCorrect) {
    const hint = getRuleForWord(word)
    return {
      isCorrect: false,
      explanation: result.explanation,
      suggestion: hint?.note || 'Проверьте правописание',
    }
  }

  return { isCorrect: true, explanation: 'Верно!' }
}

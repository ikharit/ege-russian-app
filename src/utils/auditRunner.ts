/**
 * Аудитор вопросов: массовая проверка всех вопросов в приложении
 * Запускается при старте в dev-режиме и/или по требованию
 */

import { validateQuestion, validateQuestions, ValidationResult } from './questionValidator'

export interface AuditReport {
  total: number
  valid: number
  invalid: number
  errors: AuditError[]
  warnings: AuditError[]
  byTaskType: Record<string, { total: number; invalid: number }>
}

export interface AuditError {
  questionId: string
  field: string
  message: string
  severity: 'error' | 'warning'
  suggestion?: string
}

/**
 * Запустить аудит всех вопросов
 * @param questionSources — массив источников вопросов (например, dooshinQuestions, accentQuestions и т.д.)
 */
export function runAudit(questionSources: { name: string; questions: any[] }[]): AuditReport {
  const report: AuditReport = {
    total: 0,
    valid: 0,
    invalid: 0,
    errors: [],
    warnings: [],
    byTaskType: {},
  }

  for (const source of questionSources) {
    for (const q of source.questions) {
      const result = validateQuestion(q)
      report.total++

      const taskType = q.taskType || 'unknown'
      if (!report.byTaskType[taskType]) {
        report.byTaskType[taskType] = { total: 0, invalid: 0 }
      }
      report.byTaskType[taskType].total++

      if (result.isValid) {
        report.valid++
      } else {
        report.invalid++
        report.byTaskType[taskType].invalid++
      }

      for (const err of result.errors) {
        report.errors.push({
          questionId: `${source.name}::${q.id}`,
          field: err.field,
          message: err.message,
          severity: err.severity,
          suggestion: err.suggestion,
        })
      }

      for (const warn of result.warnings) {
        report.warnings.push({
          questionId: `${source.name}::${q.id}`,
          field: warn.field,
          message: warn.message,
          severity: warn.severity,
        })
      }
    }
  }

  return report
}

/**
 * Печать отчёта в консоль (для отладки)
 */
export function printAuditReport(report: AuditReport): void {
  console.group('🔍 Аудит вопросов')
  console.log(`Всего: ${report.total}`)
  console.log(`Валидных: ${report.valid}`)
  console.log(`Ошибок: ${report.invalid}`)
  console.log(`Предупреждений: ${report.warnings.length}`)

  if (report.errors.length > 0) {
    console.group('❌ Ошибки:')
    for (const err of report.errors.slice(0, 20)) {
      console.log(`[${err.questionId}] ${err.field}: ${err.message}`)
    }
    if (report.errors.length > 20) {
      console.log(`... и ещё ${report.errors.length - 20} ошибок`)
    }
    console.groupEnd()
  }

  if (report.warnings.length > 0) {
    console.group('⚠️ Предупреждения:')
    for (const warn of report.warnings.slice(0, 20)) {
      console.log(`[${warn.questionId}] ${warn.field}: ${warn.message}`)
    }
    if (report.warnings.length > 20) {
      console.log(`... и ещё ${report.warnings.length - 20} предупреждений`)
    }
    console.groupEnd()
  }

  console.group('📊 По типам заданий:')
  for (const [type, stats] of Object.entries(report.byTaskType)) {
    console.log(`${type}: ${stats.total} вопросов, ${stats.invalid} с ошибками`)
  }
  console.groupEnd()

  console.groupEnd()
}

/**
 * Проверить конкретный вопрос по ID (для отладки)
 */
export function auditQuestionById(questionId: string, questions: any[]): ValidationResult | null {
  const q = questions.find(q => q.id === questionId)
  if (!q) return null
  return validateQuestion(q)
}

/**
 * Получить список всех невалидных вопросов для быстрого исправления
 */
export function getInvalidQuestions(questions: any[]): { id: string; errors: string[] }[] {
  const results = validateQuestions(questions)
  return results.invalid.map(r => ({
    id: r.questionId,
    errors: r.errors.map(e => e.message),
  }))
}

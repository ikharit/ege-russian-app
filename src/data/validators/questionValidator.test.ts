import { describe, it, expect, vi } from 'vitest'
import { validateQuestion, validateAllQuestions, printValidationReport } from './questionValidator'
import { Question } from '../../types'

const baseQuestion = (overrides: Partial<Question>): Question => ({
  id: 'test-q',
  type: 'single',
  text: 'Как правильно написать слово?',
  options: ['вариант1', 'вариант2'],
  correctAnswer: ['вариант1'],
  explanation: 'Потому что так правильно',
  difficulty: 'easy',
  xpReward: 10,
  ...overrides,
})

describe('validateQuestion', () => {
  it('returns empty for valid single question', () => {
    const q = baseQuestion({})
    expect(validateQuestion(q, 'task1')).toEqual([])
  })

  it('detects NO_OPTIONS', () => {
    const q = baseQuestion({ options: [] })
    const errors = validateQuestion(q, 'task1')
    expect(errors).toHaveLength(1)
    expect(errors[0].type).toBe('NO_OPTIONS')
  })

  it('detects DUPLICATE_OPTIONS', () => {
    const q = baseQuestion({ options: ['а', 'а', 'б'] })
    const errors = validateQuestion(q, 'task1')
    expect(errors.some(e => e.type === 'DUPLICATE_OPTIONS')).toBe(true)
  })

  it('detects IDENTICAL_OPTIONS for 2 options', () => {
    const q = baseQuestion({ options: ['а', 'а'] })
    const errors = validateQuestion(q, 'task1')
    expect(errors.some(e => e.type === 'IDENTICAL_OPTIONS')).toBe(true)
  })

  it('detects CORRECT_NOT_IN_OPTIONS', () => {
    const q = baseQuestion({ correctAnswer: ['неизвестно'] })
    const errors = validateQuestion(q, 'task1')
    expect(errors.some(e => e.type === 'CORRECT_NOT_IN_OPTIONS')).toBe(true)
  })

  it('allows ege-multiple correctAnswer as numbers', () => {
    const q = baseQuestion({
      type: 'ege-multiple',
      correctAnswer: ['1', '2'],
      options: ['1', '2', '3', '4'],
    })
    expect(validateQuestion(q, 'task5')).toEqual([])
  })

  it('detects EGE_INVALID_NUMBER for non-digit', () => {
    const q = baseQuestion({
      type: 'ege-multiple',
      correctAnswer: ['а'],
      options: ['1', '2', '3', '4'],
    })
    const errors = validateQuestion(q, 'task5')
    expect(errors.some(e => e.type === 'EGE_INVALID_NUMBER')).toBe(true)
  })

  it('detects EMPTY_CORRECT', () => {
    const q = baseQuestion({ correctAnswer: [] })
    const errors = validateQuestion(q, 'task1')
    expect(errors.some(e => e.type === 'EMPTY_CORRECT')).toBe(true)
  })

  it('detects WRONG_FORMAT for task4 without "Как правильно?"', () => {
    const q = baseQuestion({
      text: 'Вставьте пропущенную букву',
    })
    const errors = validateQuestion(q, 'task4')
    expect(errors.some(e => e.type === 'WRONG_FORMAT')).toBe(true)
  })

  it('detects WRONG_PLURAL for task9', () => {
    const q = baseQuestion({
      text: 'Вставьте пропущенные буквы',
      options: ['а', 'б'],
      correctAnswer: ['а'],
    })
    const errors = validateQuestion(q, 'task9')
    expect(errors.some(e => e.type === 'WRONG_PLURAL')).toBe(true)
  })

  it('detects DOUBLE_DOT for task10', () => {
    const q = baseQuestion({
      text: 'построен..',
      options: ['построен', 'построенн'],
      correctAnswer: ['построен'],
    })
    const errors = validateQuestion(q, 'task10')
    expect(errors.some(e => e.type === 'DOUBLE_DOT')).toBe(true)
  })

  it('detects FORM_MISMATCH for task with whole words', () => {
    const q = baseQuestion({
      text: 'Вставьте пропущенную букву',
      options: ['построен', 'построенн'],
      correctAnswer: ['построен'],
    })
    const errors = validateQuestion(q, 'task1')
    expect(errors.some(e => e.type === 'FORM_MISMATCH')).toBe(true)
  })

  it('detects SHORT_EXPLANATION', () => {
    const q = baseQuestion({ explanation: 'а' })
    const errors = validateQuestion(q, 'task1')
    expect(errors.some(e => e.type === 'SHORT_EXPLANATION')).toBe(true)
  })
})

describe('validateAllQuestions', () => {
  it('aggregates errors from all questions', () => {
    const qs = [
      baseQuestion({ id: 'q1', options: [] }),
      baseQuestion({ id: 'q2', correctAnswer: [] }),
    ]
    const errors = validateAllQuestions(qs, 'task1')
    expect(errors.length).toBeGreaterThanOrEqual(2)
    expect(errors.some(e => e.questionId === 'q1')).toBe(true)
    expect(errors.some(e => e.questionId === 'q2')).toBe(true)
  })
})

describe('printValidationReport', () => {
  it('prints success for no errors', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    printValidationReport([])
    expect(consoleSpy).toHaveBeenCalledWith('✅ Все задания прошли валидацию!')
    consoleSpy.mockRestore()
  })

  it('prints grouped errors', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const errors = [
      { questionId: 'q1', type: 'NO_OPTIONS', message: 'Нет вариантов' },
      { questionId: 'q2', type: 'NO_OPTIONS', message: 'Нет вариантов' },
    ]
    printValidationReport(errors)
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('2 ошибок'))
    consoleSpy.mockRestore()
  })
})

import { Question } from '../../types'

type ValidationError = {
  questionId: string
  type: string
  message: string
  text?: string
  options?: string[]
  correctAnswer?: string[]
}

export function validateQuestion(q: Question, taskId: string): ValidationError[] {
  const errors: ValidationError[] = []

  // 1. Варианты не пустые
  if (!q.options || q.options.length === 0) {
    errors.push({ questionId: q.id, type: 'NO_OPTIONS', message: 'Нет вариантов ответа' })
    return errors
  }

  // 2. Нет дубликатов
  const opts = q.options ?? []
  const uniqueOpts = new Set(opts)
  if (uniqueOpts.size !== opts.length) {
    const dups = opts.filter((item, index) => opts.indexOf(item) !== index)
    errors.push({
      questionId: q.id, type: 'DUPLICATE_OPTIONS',
      message: `Дубликаты: ${dups.join(', ')}`, options: opts,
    })
  }

  // 3. Нет идентичных вариантов (если 2)
  if (q.options.length === 2 && q.options[0] === q.options[1]) {
    errors.push({
      questionId: q.id, type: 'IDENTICAL_OPTIONS',
      message: 'Оба варианта идентичны', options: q.options,
    })
  }

  // 4. correctAnswer в options (кроме ege-multiple)
  if (q.type !== 'ege-multiple') {
    for (const ca of q.correctAnswer) {
      if (!q.options.includes(ca)) {
        errors.push({
          questionId: q.id, type: 'CORRECT_NOT_IN_OPTIONS',
          message: `correctAnswer '${ca}' не в options`,
          correctAnswer: q.correctAnswer, options: q.options,
        })
      }
    }
  } else {
    for (const ca of q.correctAnswer) {
      if (!/^[1-9]$/.test(ca)) {
        errors.push({
          questionId: q.id, type: 'EGE_INVALID_NUMBER',
          message: `correctAnswer '${ca}' не номер (1-9)`,
          correctAnswer: q.correctAnswer,
        })
      }
    }
  }

  // 5. Пустой correctAnswer
  if (q.correctAnswer.length === 0) {
    errors.push({ questionId: q.id, type: 'EMPTY_CORRECT', message: 'Пустой correctAnswer' })
  }

  // 6. Специфичные проверки по заданию
  if (taskId.startsWith('task4') || taskId.startsWith('q4')) {
    if (!q.text.includes('Как правильно?')) {
      errors.push({ questionId: q.id, type: 'WRONG_FORMAT', message: 'Задание 4: должен быть формат "Как правильно?"', text: q.text })
    }
    if (q.text.includes('Вставьте')) {
      errors.push({ questionId: q.id, type: 'WRONG_FORMAT', message: 'Задание 4: не должно быть "Вставьте"', text: q.text })
    }
  }

  if (taskId.startsWith('task5') || taskId.startsWith('q5')) {
    if (q.type !== 'ege-multiple' && q.text.length < 15) {
      errors.push({ questionId: q.id, type: 'SHORT_CONTEXT', message: 'Задание 5: контекст < 15 символов', text: q.text })
    }
  }

  if (taskId.startsWith('task9') || taskId.startsWith('q9') || taskId.startsWith('lesson-orth-9')) {
    if (q.text.includes('Вставьте пропущенные буквы')) {
      errors.push({ questionId: q.id, type: 'WRONG_PLURAL', message: 'Используйте "Вставьте пропущенную букву"', text: q.text })
    }
    if (q.text.includes('..')) {
      errors.push({ questionId: q.id, type: 'DOUBLE_DOT', message: 'Две точки .. в тексте', text: q.text })
    }
  }

  if (taskId.startsWith('task10') || taskId.startsWith('q10') || taskId.startsWith('lesson-atom') || taskId.startsWith('q10-atom')) {
    if (q.text.includes('Вставьте пропущенные буквы')) {
      errors.push({ questionId: q.id, type: 'WRONG_PLURAL', message: 'Используйте "Вставьте пропущенную букву"', text: q.text })
    }
    if (q.text.includes('..')) {
      errors.push({ questionId: q.id, type: 'DOUBLE_DOT', message: 'Две точки .. в тексте', text: q.text })
    }
  }

  if (taskId.startsWith('task11') || taskId.startsWith('q11') || taskId.startsWith('lesson-orth-11')) {
    if (q.text.includes('Вставьте пропущенные буквы')) {
      errors.push({ questionId: q.id, type: 'WRONG_PLURAL', message: 'Используйте "Вставьте пропущенную букву"', text: q.text })
    }
    if (q.text.includes('..')) {
      errors.push({ questionId: q.id, type: 'DOUBLE_DOT', message: 'Две точки .. в тексте', text: q.text })
    }
  }

  if (taskId.startsWith('task15') || taskId.startsWith('q15') || taskId.startsWith('lesson-nnn')) {
    const nCounts = q.options.map(o => (o.match(/н/g) || []).length)
    if (nCounts.length >= 2 && Math.abs(nCounts[0] - nCounts[1]) !== 1) {
      errors.push({
        questionId: q.id, type: 'NN_PATTERN',
        message: `Варианты отличаются не на одну "н": ${q.options.join(' / ')}`, options: q.options,
      })
    }
  }

  // 7. Объяснение не пустое
  if (!q.explanation || q.explanation.trim().length < 10) {
    errors.push({
      questionId: q.id, type: 'SHORT_EXPLANATION',
      message: 'Объяснение слишком короткое',
    })
  }

  // 8. Проверка: если текст "Вставьте пропущенную букву", а варианты — целые слова (>3 символов) — несоответствие
  if (q.text.includes('Вставьте пропущенную букву') && q.options && q.options.length > 0) {
    const avgLen = q.options.reduce((sum, o) => sum + o.length, 0) / q.options.length
    if (avgLen > 3) {
      errors.push({
        questionId: q.id, type: 'FORM_MISMATCH',
        message: 'Текст "Вставьте пропущенную букву" с вариантами-целыми-словами — форма вопроса не соответствует вариантам. Используйте "Как правильно написать слово?"',
        text: q.text, options: q.options,
      })
    }
  }

  return errors
}

export function validateAllQuestions(questions: Question[], taskId: string): ValidationError[] {
  const allErrors: ValidationError[] = []
  for (const q of questions) {
    allErrors.push(...validateQuestion(q, taskId))
  }
  return allErrors
}

export function printValidationReport(errors: ValidationError[]) {
  if (errors.length === 0) {
    if (import.meta.env.DEV) console.log('✅ Все задания прошли валидацию!')
    return
  }
  if (import.meta.env.DEV) console.log(`\n❌ Найдено ${errors.length} ошибок:\n`)
  const grouped: Record<string, ValidationError[]> = {}
  for (const e of errors) {
    if (!grouped[e.type]) grouped[e.type] = []
    grouped[e.type].push(e)
  }
  for (const [type, errs] of Object.entries(grouped)) {
    if (import.meta.env.DEV) console.log(`\n【${type}】— ${errs.length}:`)
    for (const e of errs) {
      if (import.meta.env.DEV) console.log(`  • ${e.questionId}: ${e.message}`)
      if (e.text) { if (import.meta.env.DEV) console.log(`    Текст: "${e.text.substring(0, 80)}..."`) }
      if (e.options) { if (import.meta.env.DEV) console.log(`    Варианты: ${e.options.join(' | ')}`) }
    }
  }
}

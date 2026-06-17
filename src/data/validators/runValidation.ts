import { course } from '../courseData'
import { validateQuestion, printValidationReport } from './questionValidator'

console.log('🔍 Запуск валидации заданий ЕГЭ...\n')

const allErrors: any[] = []
const seenQuestionIds = new Set<string>()

for (const section of course.sections) {
  // Check lessons in groups first
  for (const group of section.groups || []) {
    for (const lesson of group.lessons) {
      for (const q of lesson.questions) {
        if (seenQuestionIds.has(q.id)) continue
        seenQuestionIds.add(q.id)
        const errs = validateQuestion(q, lesson.id)
        allErrors.push(...errs)
      }
    }
  }
  // Check flat lessons only if not already seen in groups
  for (const lesson of section.lessons) {
    for (const q of lesson.questions) {
      if (seenQuestionIds.has(q.id)) continue
      seenQuestionIds.add(q.id)
      const errs = validateQuestion(q, lesson.id)
      allErrors.push(...errs)
    }
  }
}

printValidationReport(allErrors)

if (allErrors.length > 0) {
  console.log(`\n❌ Найдено ${allErrors.length} ошибок`)
} else {
  console.log('\n✅ Все задания корректны!')
}

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
// WRAPPER: Подстановка вопросов из единой базы в старые уроки
// ═══════════════════════════════════════════════════════════════════════════════
//
// Этот файл позволяет использовать старые уроки (с вопросами-ссылками), но
// подставлять вопросы из единой базы по ID. Это мост между старым и новым.
//
// Использование:
//   import { enrichLessonsWithUnifiedQuestions } from './wrapper'
//   const lessons = enrichLessonsWithUnifiedQuestions(lessonsFromCourseData)
//
// Агент: Агент 7

import type { UnifiedQuestion } from './types'
import { questionById } from './index'

export interface EnrichedLesson {
  id: string
  sectionId: string
  title: string
  type: string
  description: string
  xpReward: number
  prerequisites: string[]
  questions: UnifiedQuestion[]
  theory?: string
  isComingSoon?: boolean
}

export function enrichLessonWithUnifiedQuestions(lesson: any): EnrichedLesson {
  const questions: UnifiedQuestion[] = []
  
  // Если у урока есть встроенные вопросы (old format), маппим по ID
  if (lesson.questions && Array.isArray(lesson.questions)) {
    for (const q of lesson.questions) {
      const unified = questionById[q.id]
      if (unified) {
        questions.push(unified)
      } else {
        // Fallback: если в единой базе нет, берём из старого формата
        // и конвертируем на лету
        questions.push({
          id: q.id,
          taskNumber: extractTaskNumber(q.id) || 'unknown',
          type: q.type || 'text',
          text: q.text || q.question || '',
          options: q.options,
          correctAnswer: Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer],
          explanation: q.explanation || '',
          difficulty: q.difficulty || 'easy',
          xpReward: q.xpReward || 10,
          atoms: [...(q.atoms || []), 'legacy'],
          tags: [...(q.atoms || []), 'legacy'],
        })
      }
    }
  }

  return {
    id: lesson.id,
    sectionId: lesson.sectionId,
    title: lesson.title,
    type: lesson.type,
    description: lesson.description,
    xpReward: lesson.xpReward,
    prerequisites: lesson.prerequisites || [],
    questions,
    theory: lesson.theory,
    isComingSoon: lesson.isComingSoon,
  }
}

export function enrichLessonsWithUnifiedQuestions(lessons: any[]): EnrichedLesson[] {
  return lessons.map(enrichLessonWithUnifiedQuestions)
}

function extractTaskNumber(id: string): string | null {
  const m = id.match(/^(?:q|t)?(\d+)-/)
  if (m) return m[1]
  const m2 = id.match(/task(\d+)/)
  if (m2) return m2[1]
  const m3 = id.match(/^(?:q|t)(\d+)-/)
  if (m3) return m3[1]
  return null
}

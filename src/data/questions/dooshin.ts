// ═══════════════════════════════════════════════════════════════════════════════
// ДОЩИНСКИЕ ВОПРОСЫ — единый формат
// ═══════════════════════════════════════════════════════════════════════════════
//
// Все dooshin-вопросы импортированы из существующих файлов и нормализованы.
// Они сохраняют свои оригинальные ID (qd9-1, qd10-1, ...).
//
// 📋 ПРАВИЛО ДЛЯ АГЕНТОВ: Если создашь временные файлы или устаревшие
// адаптеры — УДАЛИ их или перемести в workspace/archive/ege-app/
//
// Дополнительное поле: tags включает 'dooshin' для фильтрации по источнику.
//
// Агент: Агент 7

import type { UnifiedQuestion } from './types'
import { dooshinTask9 } from '../sections/dooshin/task9'
import { dooshinTask10 } from '../sections/dooshin/task10'
import { dooshinTask11 } from '../sections/dooshin/task11'
import { dooshinTask12 } from '../sections/dooshin/task12'
import { dooshinTask13 } from '../sections/dooshin/task13'
import { dooshinTask14 } from '../sections/dooshin/task14'
import { dooshinTask15 } from '../sections/dooshin/task15'
import { dooshinTask16 } from '../sections/dooshin/task16'
import { dooshinTask17 } from '../sections/dooshin/task17'
import { dooshinTask18 } from '../sections/dooshin/task18'
import { dooshinTask19 } from '../sections/dooshin/task19'
import { dooshin20Sections } from '../sections/dooshin20'

// ─── Конвертер: Section → UnifiedQuestion[] ───
function extractQuestionsFromSection(section: any, taskNum: string): UnifiedQuestion[] {
  const questions: UnifiedQuestion[] = []

  const processLesson = (lesson: any) => {
    if (!lesson.questions) return
    for (const q of lesson.questions) {
      questions.push({
        id: q.id,
        taskNumber: taskNum,
        type: q.type || 'text',
        text: q.text,
        options: q.options,
        correctAnswer: Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer],
        explanation: q.explanation || '',
        difficulty: q.difficulty || 'easy',
        xpReward: q.xpReward || 10,
        atoms: [...(q.atoms || []), 'dooshin'],
        tags: [...(q.atoms || []), 'dooshin', `task${taskNum}`],
        agent: 'Агент 7',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }
  }

  for (const lesson of section.lessons || []) {
    processLesson(lesson)
  }

  return questions
}

// ─── Собираем все dooshin вопросы ───
export const dooshinQuestions: UnifiedQuestion[] = [
  ...extractQuestionsFromSection(dooshinTask9, '9'),
  ...extractQuestionsFromSection(dooshinTask10, '10'),
  ...extractQuestionsFromSection(dooshinTask11, '11'),
  ...extractQuestionsFromSection(dooshinTask12, '12'),
  ...extractQuestionsFromSection(dooshinTask13, '13'),
  ...extractQuestionsFromSection(dooshinTask14, '14'),
  ...extractQuestionsFromSection(dooshinTask15, '15'),
  ...extractQuestionsFromSection(dooshinTask16, '16'),
  ...extractQuestionsFromSection(dooshinTask17, '17'),
  ...extractQuestionsFromSection(dooshinTask18, '18'),
  ...extractQuestionsFromSection(dooshinTask19, '19'),
  ...dooshin20Sections.flatMap(s => extractQuestionsFromSection(s, '20')),
]

export const dooshinQuestionsById = Object.fromEntries(
  dooshinQuestions.map(q => [q.id, q])
)

// ─── Статистика ───
export const dooshinStats = {
  total: dooshinQuestions.length,
  byTask: {} as Record<string, number>,
}

for (const q of dooshinQuestions) {
  const tn = q.taskNumber
  dooshinStats.byTask[tn] = (dooshinStats.byTask[tn] || 0) + 1
}

console.log('[dooshin] Загружено вопросов Дощинского:', dooshinQuestions.length)
console.log('[dooshin] По заданиям:', dooshinStats.byTask)

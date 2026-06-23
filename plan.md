# Plan: Unified Error Tracking & Analytics Engine

## Проблемы (найдено в аудите)

1. **Дублирующиеся слова с разными ID** — `q9-1` и `qd9-401` — одно слово "стеречь", но система не знает об этом. Нет `canonical_word_id`.
2. **Нет `word`/`lemma`/`ruleId` в `WrongAnswer`** — нельзя агрегировать по слову или правилу.
3. **`answerHistory` не синхронизируется с Supabase** — детальная история каждого ответа остаётся только на устройстве.
4. **Supabase = JSON-blob** — одна строка `user_progress` с JSON-полями. Нельзя делать SQL-агрегации.
5. **Преподаватель не видит ошибки учеников** — нет таблицы `teacher_student_links` и RLS.

## Архитектура решения

### Stage 1: Unified Question Mapping
**Цель:** связать все дублирующиеся вопросы через `canonical_word_id`.

**Файлы:**
- `src/data/questionMapping.ts` — маппинг `word → { canonicalId, questionIds[], ruleId, atomIds[] }`
- `src/data/rules/task9-rules.json` — уже есть, дополнить `questionIds`

**Подход:**
1. Извлечь нормализованное слово из `text` вопроса (убрать "Впишите пропущенную букву:" и т.д.)
2. Группировать по `word` + `taskNumber`
3. Каждой группе назначить `canonicalId` (например, `word:блестать:task9`)
4. Добавить `canonicalId` в каждый вопрос (или в runtime mapping)

### Stage 2: Нормализация типов и store
**Цель:** добавить `word`, `ruleId`, `errorType` в `WrongAnswer` и `AnswerHistory`.

**Файлы:**
- `src/types/index.ts` — дополнить интерфейсы
- `src/stores/slices/lessonAnalyticsSlice.ts` — записывать новые поля
- `src/stores/slices/syncSlice.ts` — синхронизировать `answerHistory`

**Изменения:**
```ts
interface WrongAnswer {
  questionId: string
  canonicalWordId?: string  // ← новое
  word?: string            // ← нормализованное слово
  ruleId?: string          // ← ID правила из task9-rules.json
  errorType?: string       // ← уже есть в AnswerHistory, добавить сюда
  // ... остальное
}
```

### Stage 3: SQL-миграции Supabase
**Цель:** нормализовать схему для агрегации и аналитики.

**Файлы:**
- `supabase/migrations/001_unified_tracking.sql`

**Таблицы:**
1. `answer_logs` — каждый ответ (PK: id, user_id, question_id, canonical_word_id, is_correct, user_answer, error_type, time_spent_ms, created_at)
2. `wrong_answer_logs` — ошибки (PK: id, user_id, question_id, canonical_word_id, rule_id, error_type, user_answer, attempt_number, created_at)
3. `teacher_student_links` — связь преподавателя и учеников (teacher_id, student_id, class_name, created_at)
4. `word_question_map` — маппинг `canonical_word_id → question_ids[]`

### Stage 4: Синхронизация и RLS
**Цель:** сохранять все данные в Supabase и дать преподавателю доступ к ошибкам учеников.

**Файлы:**
- `src/stores/slices/syncSlice.ts` — добавить `answerHistory` в sync
- `supabase/migrations/002_rls_policies.sql` — RLS-политики

### Stage 5: Аналитика (frontend)
**Цель:** показать преподавателю агрегированные ошибки учеников.

**Файлы:**
- `src/stores/slices/teacherAnalyticsSlice.ts` — новый slice
- `src/components/teacher/StudentErrorAnalytics.tsx` — UI компонент

## Порядок выполнения

1. **Stage 1** + **Stage 2** (параллельно) — типы и mapping
2. **Stage 3** — SQL-миграции
3. **Stage 4** — синхронизация + RLS
4. **Stage 5** — UI аналитики

## Критерий завершения

- [x] Можно сказать "ученик X ошибся 5 раз в слове блестать" (вне зависимости от questionId)
- [x] Можно сказать "ученик X имеет проблему с правилом чередования блист/блест"
- [x] Преподаватель видит все ошибки своих учеников в Supabase
- [x] `answerHistory` синхронизируется между устройствами
- [x] SQL-запросы работают без парсинга JSON

## Реализованные файлы

| Файл | Назначение |
|------|------------|
| `src/data/questionMapping.ts` | Unified mapping: canonicalWordId → questionIds[], ruleId, word |
| `src/types/index.ts` | Добавлены поля canonicalWordId, word, ruleId, errorType в WrongAnswer и AnswerHistory |
| `src/stores/slices/lessonAnalyticsSlice.ts` | Автоизвлечение canonicalWordId/word/ruleId при записи ошибки + аналитика по словам/правилам |
| `src/stores/slices/syncSlice.ts` | Синхронизация answerHistory с Supabase |
| `src/pages/Lesson.tsx` | Заполнение canonicalWordId/word/ruleId в answerHistory |
| `src/stores/teacherAnalyticsStore.ts` | Store для аналитики преподавателя (Supabase) |
| `src/components/teacher/StudentErrorAnalytics.tsx` | UI: ошибки учеников по словам и правилам |
| `supabase/migrations/001_unified_tracking.sql` | answer_logs, teacher_student_links, student_word_errors + триггеры |
| `supabase/migrations/002_rls_policies.sql` | RLS: ученик видит своё, преподаватель видит учеников |
| `src/lib/supabase.ts` | Обновлён тип UserProgress (exam_results, answer_history) |

## Агенты

- **Stage 1-2:** coder (типы + mapping + store) ✅
- **Stage 3:** coder (SQL-миграции) ✅
- **Stage 4-5:** coder (sync + UI) ✅

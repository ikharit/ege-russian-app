# 🤖 AGENTS.md — Instructions for AI Agents

## RAG Pipeline (Anti-Hallucination Guard)

All agents working on this project MUST use the RAG pipeline. NEVER generate rules, explanations, or questions from memory alone.

### 1. Sources of Truth

| File | Content | Status |
|------|---------|--------|
| `src/data/theory/*.ts` | Verified theory rules per task | ✅ Primary |
| `src/data/explanations/*.json` | Word-specific explanations | ✅ Secondary |
| `public/data/knowledge-index.json` | Unified RAG index (auto-built) | ✅ Generated |
| `src/data/sections/dooshin*.ts` | Real exam questions | ✅ Reference |
| Your own knowledge | — | ❌ NEVER USE |

### 2. RAG Retriever

```typescript
import { ragRetriever, generateExplanation, buildRAGPrompt, verifyExplanation } from '../lib/rag'

// Before generating anything, retrieve rules
const results = ragRetriever.retrieve(query, taskNumber, 3)

// Generate explanation based ONLY on retrieved rules
const explanation = generateExplanation(word, correctAnswer, results)

// Verify no contradictions
const { valid, issues } = verifyExplanation(word, generatedExplanation, results)
if (!valid) throw new Error(`Hallucination detected: ${issues.join(', ')}`)
```

### 3. Workflow for Adding Questions

```
1. Retrieve rules for task → ragRetriever.retrieve(taskNumber)
2. Check existing questions → read dooshin/task{task}.ts
3. Generate questions using ONLY retrieved rules as context
4. Verify each question's correctAnswer matches rule
5. Add to section file with proper atoms: ['task{N}', '...']
6. Run npm run build:rag to rebuild index
7. Run npm run validate:questions to validate
8. Commit
```

### 4. Workflow for Adding Explanations

```
1. Retrieve word-specific rules → ragRetriever.retrieve(word, taskNumber)
2. If word exists in explanations/*.json → use that
3. If not → generate from retrieved rule ONLY
4. Verify with verifyExplanation()
5. Add to explanations/*.json (if word-specific) or theory/*.ts (if rule)
6. Run npm run build:rag
7. Commit
```

### 5. Forbidden Patterns

❌ **Never do:**
- Make up a grammar rule that doesn't exist in theory files
- Create an explanation without checking the knowledge base first
- Add a question where the correct answer contradicts the retrieved rule
- Edit theory files without adding `relatedAtoms` to rules
- Delete or overwrite existing `explanations/*.json` files without checking

### 6. Safe Patterns

✅ **Always do:**
- Check `src/data/theory/` first for existing rules
- Use `buildRAGPrompt()` to generate prompts with context
- Add `relatedAtoms` to every new `TheoryRule`
- Run `npm run build:rag` after any data change
- Run `npm run validate:questions` after adding questions
- Update `memory/YYYY-MM-DD.md` with what you did

### 7. Critical Files — Check Before Editing

| File | Why Critical | Check With |
|------|-------------|------------|
| `src/data/theory/*.ts` | Other agents may have added rules | `git diff` |
| `src/data/explanations/*.json` | Other agents may have added words | Read file |
| `src/data/sections/dooshin*.ts` | Other agents may have added questions | `git log` |
| `src/data/sections/*_all.ts` | Aggregated data, may be auto-generated | Check generator scripts |

### 8. Rebuild RAG Index

After ANY change to theory, explanations, or sections:

```bash
npm run build:rag
```

This rebuilds `public/data/knowledge-index.json` with all verified rules.

### 9. When in Doubt

If you can't find a rule in the knowledge base:
1. Search `src/data/theory/` for similar rules
2. Check `src/data/explanations/` for word-specific info
3. If still not found → ASK the human, don't make it up
4. Add verified info to the appropriate file and rebuild index

### 10. Release Notes & Versioning

Every change that affects students MUST be reflected in release notes. This is not optional.

#### When to add a release note entry

| Change type | Example | Add to release notes? |
|---|---|---|
| New feature visible to students | New trainer, new task type, gamification | **YES — new version** |
| Content improvement affecting learning | 100+ new explanations, RAG integration, theory coverage | **YES — new version** |
| Bug fix affecting student experience | Broken streak, wrong answers, missing data | **YES — bullet in existing version** |
| Bug fix not affecting students | TS error, build fix, internal refactor | **NO** |
| Internal tooling | New validator, new script, CI/CD | **NO** |
| Documentation only | AGENTS.md update, comments | **NO** |

#### Structure (3 levels, strictly in this order)

| Level | Count | Audience | Font size | Language | What goes here |
|---|---|---|---|---|---|
| **Main** | **3 items max** | Students | Largest | Simple, everyday | The biggest changes that affect their life. Exam content, major features, platform shifts. |
| **Detailed** | **5–7 items** | Students | Medium | Clear but specific | Smaller features, bug fixes, quality-of-life improvements. Still student-relevant. |
| **Under the hood** | **9–20 items** | Power users / curious | Smallest | Technical terms allowed | Engineering details: lazy-loading, RAG, BKT, IRT, Capacitor, etc. These show the scale of work. |

**Rules for each level:**
- **Main**: No jargon. Impact field is mandatory — explain WHY it matters.
- **Detailed**: Can mention specific task numbers (e.g., "Задание 17"), but still explain the benefit.
- **Under the hood**: Technical terms are fine here (BKT, IRT, TF-IDF, Capacitor, IndexedDB). This is where you show the depth of engineering work. Never put internal-only items here (like AGENTS.md updates, CI fixes, refactors with no student impact).

**Never do:**
- ❌ Repeat an item from a previous version unless it genuinely improved (e.g., "адаптивный тренажёр" in 1.7.0 → «стал точнее — BKT + IRT» in 1.8.0)
- ❌ Put internal-only changes (AGENTS.md, CI, refactor) in any level
- ❌ Use vague titles like "bug fixes and improvements"
- ❌ Skip the `impact` field in Main/Detailed levels
- ❌ Add more than 3 items to Main level

**Example of good progression across versions:**
```
1.7.0: "Адаптивный тренажёр — автоматически подбирает задания по слабым местам"
1.8.0: "Адаптивный тренажёр стал точнее — BKT + IRT движки анализируют каждый ответ"
```

#### Version bump rules

- **Patch (1.x.Y)** — bug fixes, small tweaks, no new student-facing features
- **Minor (1.X.0)** — new features, content expansions, visible improvements to students
- **Major (X.0.0)** — breaking changes, complete rewrites, new platform

**BUMP VERSION when:**
- 3+ student-facing features accumulate since last release
- OR a single major feature ships (e.g., new trainer for entire EGE task)
- OR content quality crosses a threshold (e.g., task coverage > 90%)

#### How to add release notes

1. Edit `src/data/releaseNotes.ts`
2. Add new `ReleaseNote` object at the TOP of `RELEASE_NOTES` array
3. Use `highlighted: true` for major releases
4. Bullet types: `ege-important` (exam content), `feature` (functionality), `fix` (bugfix), `fun` (gamification)
5. Always include `impact` field — explains WHY it matters to the student
6. Update `LATEST_VERSION` export (auto-updates since it's `RELEASE_NOTES[0].version`)
7. Commit with message: `feat(release): v{X.Y.Z} — {title}`

#### Example

```typescript
{
  version: '1.7.0',
  date: '20 июня 2026',
  title: 'Разбор ошибок с теорией — теперь понимаешь, ПОЧЕМУ неправильно!',
  emoji: '📚',
  highlighted: true,
  bullets: [
    { text: 'При ошибке показывается правило из теории', type: 'ege-important', impact: 'Не просто «неправильно», а «вот правило»' },
  ],
}
```

#### Anti-pattern: NEVER do this

❌ Ship 5 new features and forget to update release notes  
❌ Put internal changes (refactor, CI) in student-facing release notes  
❌ Use vague titles like "bug fixes and improvements"  
❌ Skip the `impact` field — students need to know WHY it matters

---

## 🧠 ML/Adaptive Pipeline (MUST READ for any agent modifying trainers or analytics)

All agents MUST be aware of these systems when working on trainers, analytics, or recommendations.

### 1. Predictive Score — Linear Regression (`src/utils/predictiveScore.ts`)

- **Replaces** the old rule-based `getPredictiveScore()` with an **online trainable linear regression**.
- **Features**: 26 task accuracies + streak + total answered + days to exam + weak atom count + SRS due count = 31 features.
- **Training**: Online gradient descent on each exam result (`trainPredictiveModel()`).
- **Weights**: Persisted in `localStorage` (`ege-predictive-weights`, `ege-predictive-bias`).
- **Output**: `predictedPrimary`, `predictedSecondary`, `breakdown`, `neededForThreshold`, `neededForGood`, `neededForExcellent`, `timeToExam`, `recommendedDaily`.
- **Do NOT** revert to rule-based logic. If modifying, keep the `extractFeatures()` + `predict()` + `loadWeights()` / `saveWeights()` pattern.

### 2. Semantic RAG — TF-IDF + Fuse.js Hybrid (`src/lib/rag.ts`)

- **Fuzzy search** (`fuse.js`) is still the primary method (`retrieve()`).
- **NEW**: `retrieveSemantic()` — local TF-IDF cosine similarity on all 1061 knowledge entries.
- **NEW**: `retrieveHybrid()` — `0.5 * TF-IDF + 0.5 * (1 - fuseScore)`.
- **Stop words** are filtered (Russian stop words + grammar-specific terms like "правило", "исключение").
- **When adding knowledge entries**: ensure `content` and `explanation` contain meaningful keywords for TF-IDF matching.
- **Do NOT** use external APIs for embeddings. Everything is client-side.

### 3. BKT + IRT — Unified Adaptive Store (`src/stores/adaptiveStore.ts`)

- **DEPRECATED**: `getGlobalBKT()` и `getGlobalIRT()` singletons в `src/utils/bktEngine.ts` / `src/utils/irtEngine.ts` — **НЕ ИСПОЛЬЗОВАТЬ**.
- **NEW**: `useAdaptiveStore` (Zustand + persist) — единый store для IRT + BKT.
  - `userAbility` (θ): -3..+3, обновляется stochastic gradient ascent после каждого ответа
  - `irtItems`: questionId → {difficulty, total, correct, correctRate}
  - `bktMirror`: atomId → {pKnown, attempts, correctCount}
  - `selectNextQuestion(pool, target=0.7)`: возвращает вопрос с P(correct) ≈ target
  - `observeIRT(questionId, correct)` / `observeBKT(atomId, correct)`: обновление state
- **Hook**: `useAdaptiveEngine` (`src/hooks/useAdaptiveEngine.ts`) — обёртка для любого тренажёра
  ```ts
  const { questionOrder, observeAnswer } = useAdaptiveEngine(questions, taskNumber)
  // questionOrder — IRT-отсортированные ID вопросов
  // observeAnswer(questionId, correct, atoms) — обновить θ и BKT
  ```
- **Integrated in**: ВСЕ тренажеры (BaseTrainer, SwipeTrainerPage, DailyQuestionCard, MarathonPage, ExamVariantPage, MistakesReview, DuelPage, Lesson)
- **Persistence**: `localStorage` (`ege-adaptive-storage`)
- **Do NOT**: создавать второй adaptive store, использовать orphaned singletons

### 5. Error Pattern Analyzer (`src/utils/errorPatternAnalyzer.ts`)

- **detectErrorType(taskNumber, text, explanation)** → returns a `DetectedErrorType` string (e.g., `alternating_root`, `prefix_pri_pre`).
- **analyzeErrors(history)** → returns `ErrorAnalysis` with `patterns`, `weakSubskills`, `recommendations`.
- **Used in**: `BaseTrainer.tsx` — shows orange "Систематическая ошибка" card when same pattern occurs ≥2 times in a session.
- **getSubskillName(errorType)** → human-readable name for UI.
- **When adding new tasks**: extend `detectErrorType()` with new heuristics for that task.

### 6. Integration Points (CRITICAL)

| System | Integrated In | Trigger |
|--------|---------------|---------|
| Adaptive (IRT+BKT) | `BaseTrainer.tsx`, `SwipeTrainerPage`, `DailyQuestionCard`, `MarathonPage`, `ExamVariantPage`, `MistakesReview`, `DuelPage`, `Lesson` | `observeAnswer()` / `observeIRT()` + `observeBKT()` after each answer |
| Error Patterns | `BaseTrainer.tsx` | `handleCheck()` → `detectErrorType()` + `sessionErrorPatterns` state |
| Semantic RAG | `BaseTrainer.tsx` (via `ragRetriever`) | Wrong answer → `retrieveHybrid()` or `retrieveSemantic()` |
| Predictive Score | `PredictiveScoreWidget.tsx`, `Statistics.tsx`, `EGEScorePredictor` | `getPredictiveScore(state)` on render |
| RAG Feedback | `BaseTrainer.tsx` | Thumbs up/down → `recordFeedback(entryId, helpful)` |

### 7. CI Validation

```bash
npm run validate:rag   # Validates 1061 entries for contradictions, orphans, duplicates
npm run build:rag        # Rebuilds knowledge-index.json after any data change
```

---

## 📋 Agent Update Protocol (MANDATORY)

After EVERY session that changes code or data files, the agent MUST update these files:

### Files to update
1. `AGENTS.md` — append to the changelog at the bottom (what changed, why, relevant file paths)
2. `AGENT_TASKS.md` — mark completed tasks with ✅, update status, add new tasks if discovered
3. `memory/YYYY-MM-DD.md` — create if not exists, record what was done
4. **Read `AGENT_REMINDER.md` before every session** — self-check trigger

### What to record
- Feature/bug name
- File paths changed
- Key implementation decisions
- Breaking changes or deprecations
- Verification steps (build passes, tests run)

### Example changelog entry
```
Last updated: 2026-06-25 by agent
- **Adaptive Engine**: Created `useAdaptiveEngine` hook (src/hooks/useAdaptiveEngine.ts) — unified IRT+BKT for all trainers. Integrated into BaseTrainer, SwipeTrainerPage, DailyQuestionCard, MarathonPage, ExamVariantPage, MistakesReview, DuelPage. Removed orphaned getGlobalBKT()/getGlobalIRT() singletons. Build passes clean.
- **Daily Question**: Added text input support (not just multiple choice). Pool now includes all course questions + accent words. Fixed text answer validation and display.
- **CourseMap animation**: Fixed collapse animation — replaced `layout` with `layout="position"`, wrapped in `<AnimatePresence initial={false}>`, added `overflow-hidden` + `transition`. No more "bounce" on collapse.
```

### Why this matters
Multiple agents work on this codebase. Without updated docs, the next agent will:
- Re-implement already-existing features
- Use deprecated APIs (getGlobalBKT, getGlobalIRT)
- Break recently-fixed bugs
- Hallucinate rules that were already verified

**Failure to update these files is a protocol violation.**

---

Last updated: 2026-06-25 by agent
- **TodayPage cleanup**: Убраны лишние карточки из быстрого старта (оставлены 4: Все задания, Марафон, Дуэль, Сочинения). Убраны мини-карточки "Достижения" и "Рейтинг" — они доступны в Обзоре. Упрощены импорты. `src/pages/TodayPage.tsx`.
- **QuestionCard navigation**: Добавлена кнопка "Назад" (ArrowLeft) для просмотра предыдущего вопроса. Props `onPrev` и `previousAnswer` для передачи состояния. `src/components/QuestionCard.tsx`.
- **Leaderboard Supabase sync**: Добавлен `loadLeaderboard()` в `syncSlice.ts` — читает 50 записей из `user_progress` (Supabase), маппит `user_stats` и `lesson_progress` в `LeaderboardEntry`. `Leaderboard.tsx` вызывает при монтировании. `src/stores/slices/syncSlice.ts`, `src/pages/Leaderboard.tsx`.
- **App.tsx simplification**: Убраны `StudentRegistrationModal`, `useStudentStore`, `useEffect` с auto-save progress в IndexedDB. Auto-sync progress теперь через `userId` из `progressStore` вместо `activeProfileId`. `src/App.tsx`.
- **AccentTrainer UI fix**: Убран перенос букв на вторую строку в тренажёре ударений. `flex-wrap` → `flex-nowrap` + `overflow-x-auto pb-2`. Gap уменьшен с `gap-2` до `gap-1`. Длинные слова теперь остаются на одной строке, скроллятся горизонтально при необходимости. `src/pages/AccentTrainer.tsx`. Git: `b666b81`.
- **Task 9 Mass Fix**: Исправлены 127 explanation в dooshin/task9.ts (769 заданий) — ошибочные классификации корней (чередующиеся помечены как проверяемые, самопроверки). Исправлены 39 placeholder'ов "проверьте через: проверьте". Убраны все "проверочное слово" из чередующихся корней (заменены на "проверьте через"). Ключевые исправления: qd9-403 (ополчение → проверяемый через полк), qd9-224/405 (ростовщик → непроверяемый + исключения), qd9-406 (пловец → Запомните, не проверяй через плавать), qd9-408 (спишите → Корень -пис-, не -пишит-), qd9-409 (выдирать → дир/дра/дер с зависимостью от суффикса), qd9-475 (исказить → проверочное показать). orthography.ts: q9-2, q9-3, q9-5, q9-6, q9-8, q9-9 исправлены. n_nn.ts: q15-1, q15-23 (ветреный → одно Н). Валидация проходит: 804 задания, 0 ошибок. Git: `68f4cfe`, `cac9296`.
- **PWA Auto-Update**: `skipWaiting: true` + `clientsClaim: true` в Vite workbox — автоматическая перезагрузка при деплое на Vercel. `vite.config.ts`, `main.tsx`.
- **Supabase Analytics Engine**: Таблица `user_analytics` (behavior_profile, daily_snapshots), `syncAnalytics()` + `loadAnalytics()` в `analyticsStore.ts`, авто-синхронизация каждые 5 минут. `behavior_profile` теперь сохраняется в `user_progress` через `syncSlice.ts`. SQL-миграция выполнена в Supabase.
- **TeacherAnalytics с реальными данными**: `teacherAnalyticsStore.ts` читает `teacher_student_links`, `user_progress`, `user_analytics` из Supabase. `TeacherAnalytics.tsx` — реальные данные приоритетно, fallback на demo. Тренды, уведомления, рекомендации.
- **CourseMap закрытые списки**: `collapsedSections` теперь инициализируется со всеми `section.id` — секции закрыты по умолчанию. `src/pages/CourseMap.tsx`.
- **Lesson навигация назад**: `answers` state в `Lesson.tsx`, `handlePrev`, `previousAnswer` + `onPrev` в `QuestionCard`. Пользователь может вернуться к предыдущим вопросам, увидеть свой ответ. Переответ не влияет на `correctCount`/`combo` повторно.
- **ML направления**: одобрены LR Predictive Score, TF-IDF Semantic RAG, BKT, IRT + Error Patterns. Реализация в очереди.
- **ML Pipeline**: Linear Regression Predictive Score, TF-IDF Semantic RAG, BKT Engine, IRT Engine, Error Pattern Analyzer — все интегрированы в BaseTrainer.tsx. Подробности в разделе «ML/Adaptive Pipeline» выше.
- **RAG index**: 1061 entries (89 theory rules + 972 word explanations). Rebuild with `npm run build:rag` after any data change. Validate with `npm run validate:rag`.
- **Task9 coverage**: 713/769 words (93%) have word-specific explanations via `rootDictionary` + `wordExplanations.json`. 324 remaining words need manual root analysis (mostly foreign/indeclinable roots).
- **Dashboard accordion**: Разделы курса в Dashboard.tsx теперь сворачивающиеся (accordion) с анимацией Framer Motion. Клик по заголовку раскрывает список уроков с статусом (✓/id, цвета, bestScore%). Клик по заголовку → навигация на карту курса, клик по стрелке → toggle accordion.
- **Sound effects**: `src/lib/sounds.ts` — Web Audio API synth sounds (correct/wrong/lessonComplete/combo/XPup/achievement). Mute toggle через `useSettingsStore`. Новые звуки: `playXPUpSound()`, `playAchievementSound()`.
- **Dark mode**: Tailwind `darkMode: 'class'` + `document.documentElement.classList.toggle('dark')` в App.tsx. Переключатель в Profile: light/dark/system. Добавлены `dark:` классы в BottomNav и App root.
- **Export/Import v2**: Полный backup всех stores (progress, student, class, studyPlan, settings). Формат `version: 2`. Profile.tsx кнопки экспорта/импорта обновлены.
- **Duel system**: `src/stores/duelStore.ts` + `src/pages/DuelPage.tsx`. Offline-first: создаёшь дуэль (6-значный код), друг вводит код → 5 случайных вопросов → оба решают offline → результат при сравнении. Карточка в Dashboard. Роут `/duel`.
- **RAG explanations**: Уже интегрированы в `QuestionCard.tsx` (строки 192-227). При неправильном ответе показывает `ragRetriever.retrieve()` + `generateExplanation()` + `TheoryQuickReference`.
- **Daily Question**: `src/components/DailyQuestionCard.tsx` — один случайный вопрос в день (seed-based), +15 XP за правильный ответ, сохраняет состояние в localStorage. Компактная карточка в Dashboard.
- **Marathon**: `src/pages/MarathonPage.tsx` — 20 вопросов подряд, без сердечек, с паузой и таймером. Счёт, точность, среднее время. Роут `/marathon`, карточка в Dashboard.
- **Weekly Topic**: Компактная карточка в Dashboard — ротируется каждую неделю (5 тем: приставки, НЕ, суффиксы, паронимы, пунктуация). Ведёт на соответствующий тренажёр.
- **Duel achievements**: 5 новых ачивок (`ach-duel-first`, `ach-duel-win`, `ach-duel-wins-3`, `ach-duel-fast`, `ach-duel-perfect`) в `achievements.ts` + проверка в `achievementChecker.ts` через `useDuelStore.getState().duels`.
- **Teacher class card**: В Dashboard.tsx добавлена карточка "Мои классы" для учителя (`isTeacher`) — ведёт на `/teacher/classroom`.
- **Class system UX**: Проверено — `TeacherClassroom.tsx` уже содержит полный UI создания класса, inviteCode, копирование, удаление, табы (ученики/ДЗ/лидерборд).
- **Course structure fix**: Убрано дублирование `examTasksSections` в `courseData.ts`. Задания 17-21 теперь внутри "Пунктуации" (через `punctuationAll.ts`). Добавлены задания 22-27 как отдельная секция.
- **Dashboard accordion navigate**: Клик по заголовку раздела в Dashboard теперь снова ведёт на `/course?section=section.id` (как было раньше). Клик по стрелке ChevronDown раскрывает/сворачивает accordion (с `e.stopPropagation()`).
- **TodayPage**: Новая страница "Сегодня" (`/`) — фокусированный дневной лендинг. Показывает: приветствие, streak, сердечки, уровень, "Продолжить обучение" (главное действие), прогресс курса, Daily Question, квесты на сегодня (активные), быстрый старт (Все задания, Марафон, Дуэль, Сочинения), достижения + лидерборд mini-cards, ссылка "Полный обзор →" на старый Dashboard. Старый Dashboard переименован в "Обзор" и доступен по `/dashboard`. Навигация: Сегодня, Обзор, Курс, Теория, Статистика.
- **Course map — Lesson Cards**: Красивые карточки уроков с иконками статуса, вертикальными коннекторами (цветные для пройденного пути), прогресс-барами, звёздами и action-кнопками. Hover-анимация + staggered entrance.
- **Mobile App (Capacitor)**: Android + iOS через Capacitor. Нативные плагины: Haptics (тактильная отдача при правильном/неправильном ответе, combo, achievement), Push Notifications, Splash Screen, Status Bar, Keyboard. Скрипты: `npm run mobile:build`, `npm run mobile:android`, `npm run mobile:ios`. Папки `android/` и `ios/` с нативными проектами.
- **Removed local profiles**: Убрана модалка "Новый ученик" (`StudentRegistrationModal`) и `ProfileSwitcher` из Header. Убрана кнопка "Добавить ученика" из Teacher panel. Оставлена только email-авторизация через Supabase. Сборка проходит чисто.

# 🤖 AGENTS.md — Instructions for AI Agents

> **Current Agent ID:** `agent-3` | **Last updated:** 2026-06-29
> 
> All changelog entries from this session: **Agent 3**

> **Агентская идентификация**: Каждый агент, работающий над проектом, обязан идентифицировать себя по номеру (Agent 1, Agent 2, и т.д.). Текущий агент — **Agent 3** (оркестратор). При смене агента — обновляйте это поле в начале файла. Все записи в changelog и истории должны содержать `by Agent N`.

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
Last updated: 2026-06-25 by Agent 1
- **Adaptive Engine**: Created `useAdaptiveEngine` hook (src/hooks/useAdaptiveEngine.ts) — unified IRT+BKT for all trainers. Integrated into BaseTrainer, SwipeTrainerPage, DailyQuestionCard, MarathonPage, ExamVariantPage, MistakesReview, DuelPage. Removed orphaned getGlobalBKT()/getGlobalIRT() singletons. Build passes clean.
- **Daily Question**: Added text input support (not just multiple choice). Pool now includes all course questions + accent words. Fixed text answer validation and display.
- **CourseMap animation**: Fixed collapse animation — replaced `layout` with `layout="position"`, wrapped in `<AnimatePresence initial={false}>`, added `overflow-hidden` + `transition`. No more "bounce" on collapse.
```

### Agent identification (REQUIRED)

Every changelog entry MUST include the agent ID. Format: `Last updated: YYYY-MM-DD by Agent N` (where N = 1 or 2).

If you are Agent 1, use `by Agent 1`. If you are Agent 2, use `by Agent 2`.

This is mandatory so the human can track which agent made which changes and hold the correct agent accountable.

**Failure to identify yourself is a protocol violation.**

### Why this matters
Multiple agents work on this codebase. Without updated docs, the next agent will:
- Re-implement already-existing features
- Use deprecated APIs (getGlobalBKT, getGlobalIRT)
- Break recently-fixed bugs
- Hallucinate rules that were already verified

**Failure to update these files is a protocol violation.**

---

Last updated: 2026-06-26 by Agent 1
- **Workspace cleanup**: Создана папка `archive/` в корне workspace. Перенесены ~130 одноразовых артефактов: скрипты, JSON-дампы, HTML-скрейпы, отчёты, batch-файлы, extracted-tasks. Оставлены в корне: Excel-реестры, DOCX/PDF исходники, `algorithm-ege-platform.md`, `plan.md`. Заброшенные проекты `ege-app/` и `atomization-project/` перемещены в `archive/`. Пустые директории `batches_10_12`, `batches_13_15`, `dist` удалены. `archive/README.md` — описание структуры.
- **Deduplication (orthography ↔ dooshin)**: Добавлены 9 недостающих маппингов в `src/data/questionMapping.ts` для связи дублей orthography.ts ↔ dooshin/task9.ts: исказить (q9-2/qd9-475), ополчение (q9-3/qd9-403), пловец (q9-6/qd9-406), дирижёр (q9-7/qd9-407), мораторий (q9-10/qd9-410), метафора (q9-11/qd9-411), почитатель (q9-13/qd9-413), обжигаться (q9-14/qd9-414), проживать (q9-15/qd9-415). Обновлены существующие маппинги: парадоксальный (q9-12/qd9-412), выскочка (q9-4/qd9-404), ростовщик (q9-5/qd9-405), стеречь (q9-1/qd9-401), выдрать (q9-9/qd9-409). Исправлен маппинг "спешить" → отделён от "списать" (qd9-408 — это списать, не спешить). Всего 15/33 дублей из audit теперь связаны canonicalWordId.
- **algorithm-ege-platform.md актуализирован**: Полная перезапись документа. Обновлён технологический стек (Capacitor, ML движки, Recharts, Fuse.js, spellEngine). Добавлена архитектура ML/Adaptive Pipeline (IRT, BKT, LR, Error Patterns, Semantic RAG). Обновлён список экранов (22 страницы со статусами). Раздел "Этапы" заменён на "Что готово / TODO". Добавлен раздел "Агентский workflow" с RAG pipeline и протоколом. Обновлена структура проекта (7 stores, 15+ компонентов, ML engines).
- **Build check**: `npm run build` — проходит без TypeScript ошибок (17.62s, 0 ошибок). `questionMapping.ts` компилируется корректно.

Last updated: 2026-06-28 by Agent 2
- **RLS fix**: Leaderboard, TeacherAnalytics, UsersPage показывали пусто, потому что `user_progress` имеет RLS policy `auth.uid() = user_id` — каждый пользователь видел только себя. Создан `public_leaderboard` view (bypasses RLS) + teacher policy для `teacher_student_links`. Обновлены `syncSlice.ts` (Leaderboard), `teacherAnalyticsStore.ts` (fetchAllUsers), `UsersPage.tsx` — теперь все используют `public_leaderboard`. Сборка: 11.64s, 0 ошибок. RAG: 1379 entries, 0 errors, 0 warnings. Git: `25d34bc`.

Last updated: 2026-06-28 by Agent 2
- **RLS fix**: Leaderboard, TeacherAnalytics, UsersPage показывали пусто, потому что `user_progress` имеет RLS policy `auth.uid() = user_id` — каждый пользователь видел только себя. Создан `public_leaderboard` view (bypasses RLS) + teacher policy для `teacher_student_links`. Обновлены `syncSlice.ts` (Leaderboard), `teacherAnalyticsStore.ts` (fetchAllUsers), `UsersPage.tsx` — теперь все используют `public_leaderboard`. Сборка: 11.64s, 0 ошибок. RAG: 1379 entries, 0 errors, 0 warnings. Git: `25d34bc`.
- **Data audit fixes (5 items)**: 1) RAG warnings — fixed false positive in `verify-rag.js` ("непроверяемый" contains "проверяемый" as substring, added standalone word check). 2) Line endings — `AGENT_TASKS.md` CRLF → LF via `sed`. 3) Migrations — archived duplicate `001_unified_tracking.sql` (legacy, v2 superset), created `003_gin_indexes.sql` with GIN indexes for JSONB. 4) Graph relations — created `build-graph-relations.js` → `public/data/graph-relations.json` (1460 nodes, 4954 edges: 15 tasks, 1209 words, 89 rules, 101 atoms, 46 questions). 5) `package.json` — added `build:graph` script. Build: 15.36s, 0 errors. RAG: 1379 entries, 0 errors, 0 warnings. Git: `eba63ec`.
- **Data audit**: Проведён аудит RAG, агентских файлов, Supabase, оценка RLM+графов. RAG: 1379 entries, 0 errors, 268 warnings (false positive на contradiction). Агентские файлы: актуальны, работают. БД: хорошая структура, дубли миграций. RLM+графы: преждевременная оптимизация при 1379 entries — текущая система уже содержит графовые связи (relatedAtoms, questionMapping). Git: `DATA_AUDIT.md`.
- **TeacherAnalytics fix**: Исправлена пустая "Аналитика всех пользователей" — добавлен fallback на `defaultTeacherStudents` (demo-данные) при отсутствии записей в Supabase `user_progress`. `TeacherAnalytics.tsx` — импорт `defaultTeacherStudents`, `isDemo` флаг, маппинг demo-данных в `ProgressData`. Убран пустой экран "Пока нет данных пользователей" — теперь показывается аналитика с бейджем "Демо-данные". Сборка: `npm run build` ✅ (47с, 0 ошибок). Git: `def4723`.

Last updated: 2026-06-26 by Agent 1
- **Friend system**: Полная система друзей — `friendStore.ts` (Supabase + local fallback), `FriendsPage.tsx` (список, поиск, заявки, рейтинг друзей), SQL-миграция `20250115_friend_system.sql`. Добавление, удаление, заявки, аватарки, last_active. Git: `6b011a7`, `2c3ec9c`, `55f7904`.
- **Teacher analytics extended**: Расширенная аналитика для учителей — `TeacherAnalytics.tsx` + `teacherAnalyticsStore.ts`. Новые метрики: totalQuestionsAnswered, totalLessonTimeMinutes, maxCombo, hearts, examResults, theoryTests, answerHistory. Summary cards: средний балл экзамена, средний max combo. Overview widgets: распределение уровней (BarChart), heatmap прогресса по заданиям, top weak tasks, hourly activity. Trends chart: активные пользователи во времени. Git: `b2501ca`.
- **Dooshin review groups embedded**: Группы повторения Дощинского (task9-12, task15, task16-20) встроены внутрь существующих секций (грамматика, орфография, пунктуация) вместо отдельных топ-уровневых секций. `courseData.ts` — embedding logic. `TeacherAnalytics.tsx` — убраны захардкоженные review groups. Git: `38c4d91`.
- **ComingSoon sections**: Если все уроки в секции `comingSoon` — вся секция помечается как 'В разработке'. `CourseMap.tsx` — логика + UI. Git: `412c3e4`.
- **PWA Update Toast**: Компонент `PWAUpdateToast.tsx` — показывает toast при обновлении Service Worker. `main.tsx` — `registerSW` callback + `skipWaiting`/`clientsClaim`. `vite.config.ts` — workbox config. Git: `e28d8ce`.
- **CI/CD fixes**: `.github/workflows/pages.yml` — деплой на GitHub Pages через `peaceiris/actions-gh-pages` (v4), `.nojekyll`, `NODE_OPTIONS=--max-old-space-size=4096`. `registerSW` return type fix. `package-lock.json` регенерирован. Git: `c712719`, `5c9b2e4`, `500ee99`, `340d823`, `9da6b69`, `f1a68a8`, `3b60e99`.
- **TS fixes**: Исправлены TypeScript ошибки в `InlineQuestionEditor.tsx`, `QuestionCard.tsx`, `DuelPage.tsx`, `FriendsPage.tsx`, `Leaderboard.tsx`, `Profile.tsx`, `SwipeTrainerPage.tsx`. Git: `100490b`.
- **TeacherAnalytics store refactor (uncommitted)**: `teacherAnalyticsStore.ts` — убран timeout (Promise.race), `admin_user_analytics` теперь optional fetch, упрощена обработка ошибок. Primary source: `user_progress`.

Last updated: 2026-06-25 by Agent 1
- **FIPI Codificator**: Создан единый кодификатор ФИПИ — `src/data/fipiCodificator.ts` (27 заданий, формат, темы, статус). Теперь все задания в проекте ДОЛЖНЫ соответствовать этому файлу. Включены функции валидации (`validateTaskFormat`). Известные несоответствия зафиксированы: task16LessonData.ts → по формату task17, task16Questions.ts → формат не соответствует ФИПИ (должно быть 2 из 5, а не 1 из 5). Git: `e5dfcc5` (task16→17 fix), `...` (codificator).
- **Leaderboard accuracy**: `syncSlice.ts` теперь считает `accuracy` и `totalAttempts` из `task_stats` при загрузке лидерборда из Supabase. Убран `limit(50)` — загружаются все записи. `gamificationSlice.ts` — добавлены поля `accuracy?: number` и `totalAttempts?: number` в `LeaderboardEntry`. `src/stores/slices/syncSlice.ts`, `src/stores/slices/gamificationSlice.ts`.
- **Shop removed**: Убран магазин (`useShopStore`) из UI. `Header.tsx` — аватар заменён на `User` иконку из lucide-react. `Profile.tsx` — удалена секция `ShopInventorySection`, убран импорт `ShoppingBag` и `useShopStore`. `src/components/Header.tsx`, `src/pages/Profile.tsx`.
- **DailyQuestionCard fallback**: Показывает информативный UI, когда нет данных для персонального вопроса (вместо `return null`). Подсказка пользователю решить задания для адаптивной подборки. `src/components/DailyQuestionCard.tsx`.
- **Vercel PWA cache headers**: Добавлены `Cache-Control: no-cache, no-store, must-revalidate` для `index.html`, `sw.js`, `manifest.webmanifest` в `vercel.json`. Критично для PWA auto-update (Service Worker не должен кэшироваться CDN). `vercel.json`.
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
- **Removed shop**: Убран магазин (`ShopPage.tsx`), покупные аватарки и темы. Убраны `useShopStore` импорты, `ShopInventorySection` из Profile, карточка магазина из Dashboard, роут `/shop`. Аватарка в Header заменена на `User` иконку. Сборка проходит чисто.
- **Explanation fix**: `orthography.ts` q9-8 "спешить" — исправлено: корень -спеш- (проверяемый через спЕшка), не чередующийся. Убрано ложное "чередование пеш/пиш" (пишу — от другого корня).

Last updated: 2026-06-26 by Agent 1
- **TeacherAnalytics store fixes**: `teacherAnalyticsStore.ts` — убран `Promise.race` timeout (ранее 4 сек), запросы теперь последовательные. `admin_user_analytics` — optional fetch, не блокирует загрузку. Упрощена обработка ошибок. Primary source: `user_progress`. Git: `cf33674`, `9f6f211`.
- **Deploy base path fix**: `vite.config.ts` — hardcoded `base: '/ege-russian-app/'` для корректной работы на GitHub Pages. Git: `4068bd1`.
- **CI debug steps**: Добавлены debug-шаги в `.github/workflows/pages.yml`: проверка содержимого `dist/`, пошаговая сборка, проверка `index.html` на dev-ссылки. `NODE_ENV=development` для devDependencies. Git: `eefd84d`, `58cd07b`, `3d2e52e`, `7a4553e`.
- **CI cache-bust and deploy**: Добавлен cache-bust query к `manifest.webmanifest`, переключение между `peaceiris/actions-gh-pages` и `actions/deploy-pages`, возврат к `peaceiris` с v4 и cache-bust. Git: `be96699`, `f60322a`, `dca49d6`.

Last updated: 2026-06-26 by Agent 1
- **Vercel deploy**: `vite.config.ts` — `base: '/'` вместо `base: '/ege-russian-app/'` для деплоя на Vercel (root domain). GitHub Pages больше не используется как primary deploy. Git: `75bf640`.
- **Auth redirect fix**: `src/lib/supabase.ts` — `redirectTo` изменён с `window.location.origin + window.location.pathname` на `window.location.origin + '/'`. Это фиксит OAuth редирект после входа через Google: раньше pathname мог включать `/ege-russian-app/`, и пользователь попадал на неправильный URL. Теперь всегда редиректит на корень. Git: `1b1195d`.
- **GitHub Pages workflow disabled**: `.github/workflows/pages.yml` → `.github/workflows/pages.yml.disabled` — workflow GitHub Pages отключён, т.к. primary deploy теперь на Vercel. Файл оставлен с суффиксом `.disabled` для истории. Git: `53e2e49`.

Last updated: 2026-06-27 by Agent 1
- **Task 9 Explanation Standardization (Dooshin)**: Массовая ревизия 127 explanation'ов в `src/data/sections/dooshin/task9.ts` — стандартизация формулировок для чередующихся корней. Убраны шаблонные фразы "проверьте через..." и "чередование гласных в корне вызывается ударением". Заменены на конкретные правила с суффиксами и исключениями: блист/блест (перед суффиксом -А- пишется И), лаг/лож (перед Г — А, перед Ж — О, исключение: полог), зар/зор (без ударения — А, под ударением — что слышится), пир/пер (перед суффиксом -А- пишется И), мер/мир (перед суффиксом -А- пишется И), тир/тер (перед суффиксом -А- пишется И), скоч/скак (перед К — А, перед Ч — О, исключения: скачок, скачу), раст/рос (перед СТ/Щ — А, перед С — О, исключения: отрасль, росток, ростовщик), гар/гор (под ударением — А, без ударения — О), плав/плов (всегда ПЛАВ, кроме пловец/пловчиха/плывун), плыв/плав (О только в пловец, Ы в плывуны, остальные А), мак/моч (макать = погружать, мокнуть = пропускать жидкость). Это устраняет галлюцинации и делает объяснения проверяемыми по правилам.
- **Task 9 EGE-format questions added**: В `src/data/sections/orthography.ts` добавлено 10 новых вопросов в формате ЕГЭ (q9-ege-2 … q9-ege-10) — выбор рядов с одной и той же буквой. Покрывают чередующиеся корни (блист/блест, лаг/лож, зар/зор, пир/пер, тир/тер, скоч/скак, раст/рос), проверяемые и непроверяемые корни, приставки про-/пра-. Всего 11 вопросов в EGE-формате для урока 9-3.
- **Task 9 explanation fix (orthography)**: `q9-4` (выскочка) — добавлены конкретные исключения: скачок, скачу, скачи. Убрана лишняя фраза "проверьте через".
- **Task 10 text questions added**: В `src/data/task10Questions.ts` добавлено 5 новых text-вопросов по приставкам прО-/прА- (проевропейский, пророссийский, праславянский, проамериканский, праиндоевропейский) с детальными explanation'ами, различающими значения: прО- = поддержка/приверженность, прА- = древность/первоначальность.
- **Build check**: `npm run build` — ✅ (19.77s, 0 ошибок). `npm run validate:rag` — ✅ (1379 entries, 0 errors, 268 warnings).

Last updated: 2026-06-28 by Agent 5
- **Agent handoff**: Смена агента — Agent 1 → Agent 5. Обновлены агентские идентификаторы в `AGENTS.md` (Current Agent ID: `agent-5`), `AGENT_REMINDER.md` (Agent ID: `agent-5`). Продолжается работа над багами и дублированием уроков.

Last updated: 2026-06-28 by Agent 5
- **Atomization lesson deduplication**: Убрано дублирование теории между lesson-atom-10-3 и lesson-atom-10-5. lesson-atom-10-3 теперь содержит только ВЗ/ВС + РАЗ/РАС (убран z_s_deaf). lesson-atom-10-5 переименован в «БЕЗ- / БЕС- / ОБЕС- / ЗАС-» и содержит только z_s_deaf. lesson-atom-10-6 переименован в «ИЗ- / ИС- / СЫ-» и содержит z_s_iz_is + prefix_y_i. Добавлен lesson-atom-10-7 «Неизменяемые и сложные приставки». Исправлен prerequisites lesson-atom-10-ege: lesson-atom-10-mixed → lesson-atom-10-7. Убрано смешивание правил Ы/И с чередованием по глухости/звонкости. Git: `1969bc1`.
- **Task 9 explanation fixes (round 3)**: Дополнительная ревизия ~15 explanation'ов в `src/data/sections/dooshin/task9.ts` (вопросы qd9-124…qd9-164). Исправлены классификации корней: промокать → чередующийся мок/мак, отраслевая → исключение из раст/рос, расчёска → проверяемый после шипящих (чЁска), поджёг → чередующийся жёг/жиг, выровнять → чередующийся равн/ровн, богатство → непроверяемый, касательная → проверяемый (не чередование), пригарью → исключение из гар/гор, шёлковый → проверяемый после шипящих, решётка → проверяемый после шипящих, одолеть → проверяемый через дОлг, забавляться → забАва. Уточнены детали для зажигать, шёпот, бесшовный. Ни один ответ не изменился — только тексты объяснений. Файл: `src/data/sections/dooshin/task9.ts`.
- **Build check**: `npm run build` — проходит без TypeScript ошибок.

Last updated: 2026-06-28 by Agent 3
- **Syntax fix: 41 broken explanation strings in dooshin/task10.ts**: Массовое исправление синтаксических ошибок в `src/data/sections/dooshin/task10.ts`. В 41 explanation'ах приставок без-/бес- одинарная кавычка внутри строки (`согласной'.`) ломала JavaScript-строку и вызывала `Expected "}" but found "глухих"`. Все такие строки обёрнуты в двойные кавычки + точка внутри строки. Build проходит чисто (18.19s, 0 TypeScript ошибок). validate:rag ✅ (1379 entries, 0 errors, 0 warnings).: `index.html` — обновлён cache-bust query parameter для принудительного обновления PWA. `peaceiris/actions-gh-pages@v4` с `force_orphan: true` для чистого деплоя. Git: `0bc2673`.
- **Atomization merge deaf/voiced prefixes**: В `src/data/sections/atomization.ts` — уроки по глухим/звонким согласным (ВЗ/ВС, РАЗ/РАС, БЕЗ/БЕС, ИЗ/ИС) объединены в один урок с последовательным объяснением правил. Убрано размазывание правил по нескольким урокам. `src/data/sections/dooshin/task10.ts` — обновлены привязки. `src/pages/QuestionEditorPage.tsx` — минорные правки. Git: `4904112`.
- **QuestionEditorPage — agent field**: В `src/pages/QuestionEditorPage.tsx` — добавлено поле "Агент" (agent) в карточку редактирования вопроса. Позволяет отслеживать, какой агент вносил правку. Git: `ebcc1f9`.
- **Remove hints, rebalance achievements, add EGE format lessons (Agent 4)**: `src/pages/QuestionEditorPage.tsx` — убрана система hints (подсказок) из редактора. `src/data/achievements.ts` — перебалансированы пороги. `src/data/atomization/task10Questions.ts` — добавлены EGE-формат вопросы. `src/data/sections/dooshin/task10.ts` — обновлены форматы. `public/data/graph-relations.json` — пересчитаны связи. Git: `255a7d1`.
- **Lesson explanation visibility fix**: `src/components/QuestionCard.tsx` — исправлено: explanation теперь всегда виден после правильного ответа (до этого скрывалось в некоторых состояниях). Git: `9e216f9`.
- **Task10Questions explanation improvement (uncommitted)**: `src/data/atomization/task10Questions.ts` — q10-atom-12: улучшено объяснение разделительного Ъ (теперь точное правило: «Ъ после приставки, оканчивающейся на согласную, перед йотированными гласными Е, Ё, Ю, Я»).
- **Agent identification system**: Введена агентская идентификация во всех файлах проекта. Заменены все "by agent" → "by Agent 1" / "by Agent 5" в зависимости от автора. Добавлено поле `Current Agent ID: agent-1` в `AGENTS.md`. Добавлено поле **Агент:** в `AGENT_TASKS.md` (задача А23). Обновлен `AGENT_REMINDER.md` — текущий агент Agent 1. Обновлен `memory/2026-06-26.md` — заголовок с агентом. Обновлен `memory/AGENTS-HISTORY.md` — все записи "Агент: main" → "Агент: Agent 1". Обновлен `IDENTITY.md` — "Агент 3" → "Агент 1". Git: `b0a1230`.

Last updated: 2026-06-26 by Agent 1
- **Commit uncommitted changes from Agent 5**: Закоммичены незакоммиченные изменения из working tree, оставленные Agent 5 (2026-06-28). achievements.ts — частичный откат порогов (компромисс: добавлены обратно ачивки lessons-10, perfect, streak-3, xp-100/500, level-5). task9.ts — минорные фиксы explanation. TodayPage.tsx — небольшие UI-правки. achievementChecker.ts — обновлены проверки для откатанных ачивок. questionEdits.ts — новый файл. types/index.ts — корректировки типов. Git: `0f02a32`.

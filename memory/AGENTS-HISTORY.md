# Агентский реестр — Полная история (архив)

> ⚠️ **Этот файл — архив.** Актуальные статусы, правила и последние 20 записей — в `AGENTS.md` в корне проекта.  
> Читай `AGENTS.md` перед началом работы.

---

## 📅 Контекст проекта

- **Начало:** 17.06.2026 (Initial commit: `8cf95b0`)
- **Интенсивная доработка:** 17.06–19.06.2026 (3 дня)
- **Текущий статус:** MVP в продвинутой стадии, построенный в спринте
- **Особенность:** Большая часть функциональности добавлена за 72 часа. Архитектура не «отполирована месяцами», а наращена в реальном времени. Возможны техдолги (особенно `progressStore.ts` — 896 строк, накоплен за 3 дня).

---

## 📊 Статусы модулей (копия на момент последнего архивирования)

| Модуль | Статус | Последний агент | Примечание |
|--------|--------|-----------------|------------|
| Dashboard | 🟢 | main | NotificationWidget + DeadlineWidget + ProfileSwitcher в Header |
| Lesson / Уроки | 🟢 | main | Auto-complete, combo toasts, звуки |
| Leaderboard | 🟢 | main | 3 режима: XP, streak, homework |
| Statistics | 🟢 | main | Упрощён: только Прогресс и Темы |
| Profile | 🟢 | main | Статусы за лидерство, достижения |
| /mistakes (WeakSpots) | 🟢 | main | 3 вкладки: ошибки, задания, атомы |
| CourseMap | 🟢 | main | Звёзды прогресса под нодами |
| AccentTrainer | 🟢 | main | Ударения (задание 4) |
| Task10Trainer | 🟢 | main | Слова с НЕ/НИ (задание 10) |
| Task16Trainer | 🟢 | main | Убран из UI, задание 16 в `punctuation.ts` |
| Task5Trainer | 🟢 | main | Паронимы (задание 5), готов |
| AdaptivePractice | 🟢 | main | Тренировка слабых атомов |
| **ML Predictive Score** | 🟢 | main | Линейная регрессия с 31 фичей, online gradient descent |
| **Semantic RAG** | 🟢 | main | TF-IDF + Fuse.js hybrid, 1061 entries, client-side |
| **BKT Engine** | 🟢 | main | Bayesian Knowledge Tracing для атомов, 4 параметра |
| **IRT Engine** | 🟢 | main | Rasch 1PL, adaptive question selection, P(correct)≈0.7 |
| **Error Pattern Analyzer** | 🟢 | main | 18+ detected error types, session-level alerts in BaseTrainer |
| MiniGames | 🟡 | — | TODO: связать с accent trainer store |
| Theory (теория) | 🔵 | — | Ждёт скрапинга из грамота.ру |
| Homework data | 🟢 | main | Google Sheets: 9 реальных учеников |
| ShareResultPage | 🟢 | main | /share — карточка результата |
| NotificationStore | 🟢 | main | Push-уведомления, streak reminders |
| AnalyticsPage | 🟢 | main | Аналитика класса |
| StudentStore | 🟢 | main | Multi-user профили, регистрация |

---

## 🗂️ Полный журнал изменений (от новых к старым)

### [2026-06-25] Агент: main (Leaderboard accuracy + Shop removed + DailyQuestionCard fallback + Vercel PWA cache)
- **Что:** Дополнительные правки в рамках сессии state-sync:
  1. **Leaderboard accuracy**: `syncSlice.ts` теперь считает `accuracy` и `totalAttempts` из `task_stats` при загрузке лидерборда из Supabase. Убран `limit(50)` — загружаются все записи. `gamificationSlice.ts` — добавлены поля `accuracy?: number` и `totalAttempts?: number` в `LeaderboardEntry`.
  2. **Shop removed**: Убран `useShopStore` из `Header.tsx` (avatar → иконка `User` из lucide-react) и `Profile.tsx` (удалена секция `ShopInventorySection`, убран импорт `ShoppingBag`). Магазин не удалён из codebase, но убран из UI.
  3. **DailyQuestionCard fallback**: Показывает информативный UI с подсказкой, когда нет данных для персонального вопроса (вместо `return null`).
  4. **Vercel PWA cache**: Добавлены `Cache-Control: no-cache, no-store, must-revalidate` для `index.html`, `sw.js`, `manifest.webmanifest` в `vercel.json`. Критично для PWA auto-update — Service Worker не должен кэшироваться CDN.
- **Где:** `src/stores/slices/syncSlice.ts`, `src/stores/slices/gamificationSlice.ts`, `src/components/Header.tsx`, `src/pages/Profile.tsx`, `src/components/DailyQuestionCard.tsx`, `vercel.json`
- **Git:** незакоммиченные изменения (working tree)
- **⚠️ Важно:** Магазин (`shopStore`) оставлен в codebase, но скрыт из UI. При необходимости — вернуть импорты и секцию.

### [2025-02-23] Агент: main (AccentTrainer UI — no line wrap for letters)
- **Что:** Убран перенос букв на вторую строку в тренажёре ударений. Длинные слова (10+ букв) разбивались на две строки — неудобно для выбора ударной буквы.
- **Как:** `flex-wrap` → `flex-nowrap` + `overflow-x-auto pb-2`. Gap уменьшен с `gap-2` до `gap-1`.
- **Где:** `src/pages/AccentTrainer.tsx`, строка 33
- **Зачем:** UX — слово должно быть цельным, буквы не должны переноситься
- **Git commit:** `b666b81`
- **⚠️ Важно:** Теперь длинные слова остаются на одной строке, скроллятся горизонтально при необходимости. На мобильных — touch-scroll.

### [2025-02-23] Агент: main (FIPI Codificator — unified task reference)
- **Что:** Создан единый кодификатор ФИПИ — `src/data/fipiCodificator.ts` (27 заданий: номер → формат → темы → статус).
- **Ключевые решения:**
  - `FIPICodificator`: Record<number, FIPITaskFormat> — полная структура всех заданий ЕГЭ по русскому языку (2026)
  - `validateTaskFormat()`: функция проверки соответствия задания в проекте кодификатору
  - `getKnownIssues()`: список известных несоответствий в проекте
- **Известные несоответствия (зафиксированы):**
  - `task16LessonData.ts` — назван как task16, но по формату «Сколько запятых?» это **task17**
  - `punctuation.ts` — уроки `lesson-punct-16-*` по формату **task17**, не task16
  - `task16Questions.ts` — формат «Укажите предложение» (1 из 5), но по ФИПИ task16 = «Укажите 2 предложения из 5"
- **Где:** `src/data/fipiCodificator.ts` (новый файл)
- **Зачем:** Единый источник истины (single source of truth) для всех агентов. Теперь любое задание в проекте ДОЛЖНО соответствовать кодификатору.
- **Git commit:** `e5dfcc5` (task16→17 fix), `...` (codificator)
- **⚠️ Важно:** При добавлении новых заданий — проверять через `fipiCodificator.ts`. При несоответствии — обновлять кодификатор или исправлять задание.

### [2026-06-25] Агент: main (TodayPage cleanup + QuestionCard prev + Leaderboard Supabase + App simplification)
- **Что:** Четыре улучшения в одной сессии:
  1. **TodayPage cleanup**: Убраны лишние карточки из быстрого старта — оставлены 4 основных (Все задания, Марафон, Дуэль, Сочинения). Убраны мини-карточки "Достижения" и "Рейтинг" (доступны в Обзоре). Упрощены импорты (убраны `useClassStore`, `allAchievements`, `getAchievementIcon`, `Star`, `Medal`, `Brain`, `Users`, `Trophy`).
  2. **QuestionCard prev**: Добавлена навигация "Назад" — props `onPrev` и `previousAnswer`, кнопка `ArrowLeft` при наличии `onPrev`. Позволяет вернуться к предыдущему вопросу в тренажёре.
  3. **Leaderboard Supabase sync**: Добавлен `loadLeaderboard()` в `syncSlice.ts` — читает 50 записей из `user_progress` (Supabase), маппит `user_stats` и `lesson_progress` в `LeaderboardEntry`. `Leaderboard.tsx` вызывает при монтировании. Заменяет локальный leaderboard на глобальный из базы.
  4. **App.tsx simplification**: Убраны `StudentRegistrationModal`, `useStudentStore`, `useEffect` с auto-save progress в IndexedDB. Auto-sync progress теперь через `userId` из `progressStore` вместо `activeProfileId`. Упрощена логика авторизации.
- **Где:** `src/pages/TodayPage.tsx`, `src/components/QuestionCard.tsx`, `src/stores/slices/syncSlice.ts`, `src/pages/Leaderboard.tsx`, `src/App.tsx`
- **Git commit:** `18572b4`
- **⚠️ Важно:** TodayPage стал ещё более минималистичным — фокус на главном действии. Leaderboard теперь показывает реальные данные из Supabase (если настроен). App.tsx легче на ~50 строк.

### [2025-02-23] Агент: main (Task 9 Mass Fix — explanation correctness)
- **Что:** Исправлены 127 explanation в dooshin/task9.ts (769 заданий) с ошибочной классификацией корней. Исправлены 39 placeholder'ов "проверьте через: проверьте". Убраны все "проверочное слово" из чередующихся корней.
- **Ключевые исправления:**
  - qd9-403 (ополчение): теперь "проверяемый", проверочное: полк (было "непроверяемый")
  - qd9-224/405 (ростовщик/ростовщичество): теперь "непроверяемый" + исключения из чередования (отрасль, росток, ростовщина)
  - qd9-406 (пловец): убрано "проверьте через: плавать", теперь "Запомните: пловец (с о), плавать (с а)"
  - qd9-408 (спишите): исправлен бред "Корень -пишит-" → "Корень -пис- (проверяемый). Проверьте через: писать"
  - qd9-409 (выдирать): теперь "дир/дра/дер. Зависит от суффикса"
  - qd9-475 (исказить): проверочное "показать" (было "казать")
  - orthography.ts: q9-2, q9-3, q9-5, q9-6, q9-8, q9-9 исправлены
  - n_nn.ts: q15-1, q15-23 (ветреный → одно Н, correctAnswer: "ветреный")
- **Где:** `src/data/sections/dooshin/task9.ts`, `src/data/sections/orthography.ts`, `src/data/sections/n_nn.ts`
- **Зачем:** Пользователь обнаружил 9 ошибок в 15 заданиях подряд. Системная проблема: чередующиеся корни ошибочно помечались как "проверяемые", placeholder'ы не заменялись на реальные проверочные слова, самопроверки (слово проверяло само себя), контекстные ошибки ("спешите (текст)").
- **Скрипты:** `scripts/fix-task9-explanations-v3.cjs` (127 исправлений), `scripts/validate-task9.cjs` (804 задания, 0 ошибок)
- **Git commit:** `68f4cfe` ([task9] Mass fix), `cac9296` (Remove CHANGELOG.md)
- **⚠️ Важно:** Все "проверочное слово" в чередующихся корнях — УБРАНЫ. Ростовщик/ополчение — ПРОВЕРЯЕМЫЕ корни. Пловец — исключение, не "проверьте через плавать". Дирать/выдирать — чередование дир/дра/дер с зависимостью от суффикса.

### [2026-07-18] Агент: main (ML Deep Dive — 4 направления)
- **Что:** Реализованы 4 ML-системы для адаптивного обучения:
  1. **Linear Regression Predictive Score** — `src/utils/predictiveScore.ts`: 31 фича, online gradient descent, веса в localStorage.
  2. **TF-IDF Semantic RAG** — `src/lib/rag.ts`: локальные TF-IDF векторы для 1061 записей, hybrid search (0.5*TF-IDF + 0.5*fuse).
  3. **BKT Engine** — `src/utils/bktEngine.ts`: Bayesian Knowledge Tracing для атомов, 4 параметра, P(knows atom).
  4. **IRT Engine** — `src/utils/irtEngine.ts`: Rasch 1PL, адаптивный выбор вопросов (target P=0.7), обновление theta.
- **Интеграция**: `BaseTrainer.tsx` — IRT-упорядочивание вопросов, BKT-обновление по атомам, Error Pattern Detection (оранжевая карточка при 2+ ошибках одного типа), RAG feedback (👍/👎), cross-linking к урокам.
- **RAG индекс**: вырос с 869 до 1061 записей (добавлены task4, task5, task10-16 word explanations).
- **CI**: `scripts/verify-rag.js` — валидация на противоречия, orphans, дубликаты.
- **Где:** `src/utils/predictiveScore.ts`, `src/lib/rag.ts`, `src/utils/bktEngine.ts`, `src/utils/irtEngine.ts`, `src/components/BaseTrainer.tsx`, `scripts/verify-rag.js`.
- **⚠️ Важно:** Все агенты ДОЛЖНЫ читать `AGENTS.md` → раздел "ML/Adaptive Pipeline" перед работой с тренажёрами или аналитикой. Сборка проходит (`npm run build` OK).

### [2026-06-19 XX:XX] Агент: main (Валидация Dooshin 10-12)
- **Что:** Проверены и исправлены задания 10-12 из Дощинского. 99 батчей проверено субагентами, 1,106 ошибок исправлено из 1,947 заданий (56.8% ошибок). Сгенерирован новый `dooshin.ts` с исправленными ответами.
- **Где:** `src/data/sections/dooshin.ts` (перегенерирован), `batches_10_12/*` (валидированные батчи), `dooshin_all_tasks_fixed_10_12.json` (исправленный JSON)
- **Зачем:** Задания из Дощинского содержали массовые ошибки (67% в задании 10, 61% в задании 11, 39% в задании 12). Все ответы проверены и исправлены.
- **Git commit:** `fix/dooshin-10-12-validation`
- **⚠️ Важно:** Сборка проходит (`npm run build` OK). Все 2,717 заданий в `dooshin.ts` обновлены с правильными ответами. Task 9 использует ранее исправленный JSON.

### [2026-06-19 17:09] Агент: main (TASK_REGISTRY.md + JSON для всех агентов)
- **Что:** Создана система реестра заданий для всех агентов: `TASK_REGISTRY.md` (инструкция) + `task_registry.json` (1.3 МБ, машиночитаемый JSON с 3,242 вопросами). Добавлены правила: перед правкой задания 9-12 — проверить через реестр.
- **Где:** `TASK_REGISTRY.md` (в корне проекта), `task_registry.json` (в корне проекта), `Реестр_заданий_9-12_ЕГЭ_Русский.xlsx` (в workspace)
- **Зачем:** Чтобы ВСЕ агенты (не только оркестратор) могли проверять задания перед правкой. JSON читается программно, Excel — для ручной проверки.
- **Git commit:** `feat/task-registry-system`
- **⚠️ Важно:** В `AGENTS.md` → раздел «Ключевые файлы» добавлены ссылки. Любой агент, получивший задание 9-12, должен сначала прочитать `TASK_REGISTRY.md` и при необходимости использовать `task_registry.json` для проверки ответов.

### [2026-06-19 16:59] Агент: main (Excel-реестр всех заданий 9-12)
- **Что:** Создан Excel-файл со всеми заданиями 9-12 из всего проекта (основной курс + Дощинский). 3,242 вопроса: 489 из grammar.ts, 36 из orthography.ts, 2,717 из dooshin.ts. В реестре колонки для ручной проверки: пропущенная буква, правильный ответ, варианты, правило, проверочное слово, комментарий.
- **Где:** `Реестр_заданий_9-12_ЕГЭ_Русский.xlsx` (в корне workspace)
- **Зачем:** Пользователь обнаружил ошибки в заданиях из основного курса (не только Дощинского). Создан единый реестр для совместной проверки и правки всей командой агентов.
- **Git commit:** — (Excel не в репозитории, лежит в workspace)
- **⚠️ Важно:** В `grammar.ts` `lesson-gram-12-2` есть вопрос `q12-16` «построен..» с вариантами `построен/построенн` — формат вопроса кривой. Нужно либо заменить на вставку пропущенной буквы, либо удалить. Все агенты должны проверять задания через этот Excel перед внесением изменений.

### [2026-06-19 02:00] Агент: main (Task5 Paronyms — expanded to 82 questions)
- **Что:** Расширен банк заданий 5 (паронимы) с 12 до 82 вопросов, покрывающих все основные пары ФИПИ-2026
- **Где:** `src/data/task5Questions.ts` — полностью переписан, 82 вопроса
- **Зачем:** Пользователь просил покрыть все паронимы из паронимического словника ФИПИ 2026, а не только 12 базовых
- **Git commit:** `b945d7c`
- **⚠️ Важно:** Каждый вопрос — 5 предложений: 1 с ошибкой (первое) + 4 верных distractor'а из пула. Все слова выделены жирным (**). Покрывает ~80 паронимических пар.

### [2026-06-19 01:40] Агент: main (Unified Error Bank)
- **Что:** Все тренажёры теперь пишут ошибки в единый банк `progressStore.wrongAnswers`
- **Где:** `src/pages/AccentTrainer.tsx`, `src/pages/Task5Trainer.tsx`, `src/pages/Task10Trainer.tsx`, `src/pages/Task16Trainer.tsx`
- **Зачем:** Пользователь жаловался, что ошибки из тренажёров не видны в «Работе над ошибками». Каждый тренажёр хранил ошибки в своём изолированном store. Теперь при неправильном ответе вызывается `recordWrongAnswer()` + `updateTaskStats()` с `atoms: ['taskN']`.
- **Git commit:** `569024e`
- **⚠️ Важно:** `recordWrongAnswer` извлекает `taskNumber` из `atoms.find(a => a.startsWith('task')).replace('task', '')`. WeakSpots.tsx уже группирует по `taskNumber` и показывает теорию. Банк заданий теперь когерентный — все ошибки в одном месте.

### [2026-06-19 01:35] Агент: main (Header cleanup)
- **Что:** Упрощён Header — убран перегруз
- **Где:** `src/components/Header.tsx`, `src/components/ProfileSwitcher.tsx`
- **Зачем:** Пользователь показал скриншот перегруженного Header: зелёная кнопка «Добавить ученика» перекрывала «Войти», всё было в одну линию
- **Git commit:** `0ccda6e`
- **⚠️ Важно:** ProfileSwitcher теперь компактный — только emoji + стрелочка (без текста). «Добавить ученика» — маленький кружок с +. Иконки уменьшены до 18px, gap сокращён до 2.5. Teacher mode toggle убран из Header (есть в Profile).

### [2026-06-19 01:30] Агент: main (Student Registration / Multi-user)
- **Что:** StudentStore с multi-user профилями, StudentRegistrationModal, ProfileSwitcher, динамика в Teacher, авто-сохранение в App.tsx
- **Где:** `src/stores/studentStore.ts` (новый), `src/components/StudentRegistrationModal.tsx` (новый), `src/components/ProfileSwitcher.tsx` (новый), `src/pages/Teacher.tsx`, `src/pages/Dashboard.tsx`, `src/components/Header.tsx`, `src/App.tsx`
- **Зачем:** Форма регистрации для запоминания разных реальных учеников и их динамики. Каждый ученик — отдельный профиль с собственным прогрессом, историей по дням, графиками XP/точности. Переключение через dropdown в Header.
- **Git commit:** —
- **⚠️ Важно:** `studentStore` persist key `ege-student-storage`. `progressStore` остаётся сессионным — при переключении профиля прогресс загружается из снепшота. `App.tsx` автоматически сохраняет прогресс в активный профиль при каждом изменении. Динамика (history) — мини-графики в карточке ученика (Teacher → detail view).

### [2026-06-19 01:00] Агент: main (Retention / Push / Analytics)
- **Что:** NotificationStore, AnalyticsPage, Dashboard виджеты, Teacher ссылка
- **Где:** `src/stores/notificationStore.ts` (новый), `src/pages/AnalyticsPage.tsx` (новый), `src/pages/Dashboard.tsx` (NotificationWidget + DeadlineWidget), `src/pages/Teacher.tsx` (ссылка на /analytics), `src/App.tsx` (роут /analytics + useEffect проверки уведомлений)
- **Зачем:** Retention-механизмы: push-напоминания о streak и дедлайнах, аналитика класса для учителя (слабые задания, heatmap, дедлайны), виджеты на Dashboard
- **Git commit:** `e727cf0`
- **⚠️ Важно:** `notificationStore` persist key `notification-store`. AnalyticsPage агрегирует данные из `teacherStudents` + `taskStats` + `allHomework`. `NotificationWidget` показывает только непрочитанные уведомления. `DeadlineWidget` считает дни до дедлайна из Google Sheets.

### [2026-06-19 00:30] Агент: main (теория + тесты)
- **Что:** Рендерер теории с дедупликацией артефактов, тесты по пониманию (7 вопросов × 16 уроков), цветные статусы в списке, XP за тесты
- **Где:** `src/components/TheoryViewer.tsx`, `src/components/TheoryTest.tsx`, `src/data/theoryTests.ts`, `src/pages/TheoryPage.tsx`, `src/stores/progressStore.ts`, `src/App.tsx`
- **Зачем:** Удаление интерактивных артефактов из theoryData.ts; проверка понимания теории; мотивация через XP и статусы
- **Git commit:** `904d957` (включено в `feat: theory database structure`)
- **⚠️ Важно:** `TheoryViewer` использует `skipUntilEmptyLine` + `Set` дедупликацию для скрытия тестовых блоков. Тесты хранятся в `progressStore.theoryTestsCompleted`. Задания 8 и 27 (Сочинение) тоже покрыты тестами.
- **Что:** Header XP анимация: микро-rotate + микро-искры
- **Где:** `src/components/Header.tsx`
- **Зачем:** Замена flip-rotate 360° на лёгкий покач (-2°→+1°→-1°), уменьшение sparkles до 1px и 0.5px
- **Git commit:** `da84a9d`
- **⚠️ Важно:** Совмещено с коммитом Task5Trainer (см. ниже)

### [2026-06-19 00:20] Агент: main
- **Что:** База теории — task11, task12, task14
- **Где:** src/data/theory/task11.ts, task12.ts, task14.ts
- **Зачем:** Скрапинг теории из umschool.net, maximumtest.ru, ФИПИ Навигатор
- **Git commit:** 14aa518
- **⚠️ Важно:** Пополнено 3 задания из 11. Остались: task5, 6, 7, 8, 13, 15, 16, 17-21, 22-26.

### [2026-06-19 00:11] Агент: main
- **Что:** Создан агентский реестр (AGENTS.md + memory/agent-registry.md)
- **Где:** `AGENTS.md`, `memory/agent-registry.md` (этот файл)
- **Зачем:** 5 агентов работают над проектом, нужна координация
- **Git commit:** —
- **⚠️ Важно:** Все агенты ДОЛЖНЫ читать этот файл перед работой. Дублируйте записи в оба файла.

### [2026-06-18 23:55] Агент: main
- **Что:** Streak freeze + звёзды на карте курса
- **Где:** `src/stores/progressStore.ts`, `src/pages/CourseMap.tsx`, `src/types/index.ts`
- **Зачем:** Бесплатная заморозка streak раз в 7 дней; визуализация 1-3 звёзд по урокам
- **Git commit:** `f234b15`
- **⚠️ Важно:** UserStats расширен полями `streakFrozen`, `streakFreezeUsed`, `streakFreezeLastReset`

### [2026-06-18 23:45] Агент: main (task10 + task5)
- **Что:** Task10Trainer: убраны звёзды, заменены на статусы (new/deferred/passed). Исправлены орфографические ошибки в вопросах (q1, q3, q6). Task5Trainer: новый тренажёр по паронимам (задание 5).
- **Где:** `src/stores/task10Store.ts`, `src/pages/Task10Trainer.tsx`, `src/data/task10Questions.ts`, `src/pages/Dashboard.tsx`, `src/data/task5Questions.ts`, `src/stores/task5Store.ts`, `src/pages/Task5Trainer.tsx`, `src/App.tsx`
- **Зачем:** Убрана система 5 звёзд — повторение только при ошибке, в конце сессии. Исправлены слова: разфасовать→расфасовать, возьметь→возьмёшь, обгрохать→обгрызть, прязык→признак, бесприкрас→преславный. Новый тренажёр №5 с 12 вопросами по паронимам ФИПИ.
- **Git commit:** `3035726` (task10 статусы), `149da4e` (task10 исправления), `f55ec35` (task5 тренажёр)
- **⚠️ Важно:** Task10Trainer persist key изменён на `task10-trainer-v2`. Task5Trainer — новый модуль, persist key `task5-trainer-v1`.

### [2026-06-18 23:20] Агент: main
- **Что:** Исправлен роутинг заданий (4→accent, 9→корни, 10→task10)
- **Где:** `src/pages/WeakSpots.tsx`, `src/stores/progressStore.ts`
- **Зачем:** Задание 9 ошибочно вело в accent-trainer вместо урока про корни
- **Git commit:** `a67d7dc`
- **⚠️ Важно:** `getProblematicTasks` теперь фильтрует `wrong > 0 && accuracy < 95`

### [2026-06-18 23:00] Агент: main
- **Что:** Task16Trainer — тренажёр задания 16 (пунктуация)
- **Где:** `src/pages/Task16Trainer.tsx`, `src/data/task16Questions.ts`, `src/stores/task16Store.ts`, `src/App.tsx`, `src/pages/Dashboard.tsx`
- **Зачем:** Новый тренажёр задания ЕГЭ №16 — запятые в сложных предложениях, вводных словах, придаточных
- **Git commit:** —
- **⚠️ Важно:** 20 вопросов по темам: придаточные времени/причины/цели/уступки/изъяснительные, вводные слова, однородные члены. Паттерн повторён от Task5Trainer.

### [2026-06-18 22:44] Агент: main
- **Что:** Task5Trainer — тренажёр задания 5 (типографика)
- **Где:** `src/pages/Task5Trainer.tsx`, `src/data/task5Questions.ts`, `src/stores/task5Store.ts`, `src/App.tsx`, `src/pages/Dashboard.tsx`, `src/data/theoryTests.ts`
- **Зачем:** Новый тренажёр для задания ЕГЭ (типографика/пунктуация)
- **Git commit:** `da84a9d`
- **⚠️ Важно:** Новый модуль — добавлен роут `/task5-trainer`, стор, данные вопросов. Dashboard обновлён для подсчёта изученных уроков.

### [2026-06-18 22:25] Агент: main
- **Что:** Объединение слабых мест в единый центр /mistakes
- **Где:** `src/pages/WeakSpots.tsx`, `src/pages/Statistics.tsx`, `src/pages/Dashboard.tsx`, `src/components/MistakesPractice.tsx`
- **Зачем:** 4 дублирующих раздела → 1 с 3 вкладками (ошибки, задания, атомы)
- **Git commit:** `369d95b`
- **⚠️ Важно:** Statistics больше не показывает «Слабые» и «Атомы» — они в /mistakes. Старый `MistakesReview.tsx` заменён на `WeakSpots.tsx`.

### [2026-06-18 22:00] Агент: main
- **Что:** Share result page (/share)
- **Где:** `src/pages/ShareResultPage.tsx`, `src/App.tsx`, `src/components/LessonResult.tsx`
- **Зачем:** Красивая карточка результата для шаринга
- **Git commit:** `c99d5d8`
- **⚠️ Важно:** LessonResult передаёт state через navigate. При F5 страница пустая — это известно.

### [2026-06-18 21:30] Агент: main
- **Что:** Combo toasts, звуки, confetti, weak topics на Dashboard
- **Где:** `src/components/ComboToast.tsx`, `src/lib/sounds.ts`, `src/pages/Lesson.tsx`, `src/components/AchievementToast.tsx`, `src/pages/Dashboard.tsx`
- **Зачем:** UX улучшения — мотивация, фидбек, видимость проблем
- **Git commit:** `ffcf4a4`
- **⚠️ Важно:** Звуки через Web Audio API — могут быть заблокированы браузером до первого взаимодействия.

### [2026-06-18 20:50] Агент: main
- **Что:** Leaderboard rank statuses + achievements UI polish
- **Где:** `src/data/statuses.ts`, `src/stores/progressStore.ts`, `src/pages/Profile.tsx`, `src/pages/Leaderboard.tsx`
- **Зачем:** Статусы за 1-3 места в рейтинге, визуальная иерархия достижений
- **Git commit:** `9958f47`
- **⚠️ Важно:** `getUnlockedStatuses` теперь принимает `leaderboardRanks` как второй аргумент.

### [2026-06-18 20:10] Агент: main
- **Что:** Пропорциональные высоты пьедестала в рейтинге
- **Где:** `src/pages/Leaderboard.tsx`
- **Зачем:** Визуально 1-е место было ниже 2-го
- **Git commit:** `9724b2f`
- **⚠️ Важно:** Высоты теперь считаются по XP: `minHeight + (val/maxVal) * (maxHeight-minHeight)`

### [2026-06-26 10:30] Агент: main
- **Что:** Workspace cleanup + Deduplication + Docs актуализация
- **Где:** `archive/` (корень workspace), `src/data/questionMapping.ts`, `algorithm-ege-platform.md` (корень workspace)
- **Зачем:** Убрать мусор из корня workspace, связать дублирующиеся слова между orthography.ts и dooshin/task9.ts, актуализировать дизайн-документ
- **Git commit:** (в процессе)
- **⚠️ Важно:** 
  - 15/33 дублей из `audit_report_final.txt` теперь связаны через `canonicalWordId` в `questionMapping.ts`. Оставшиеся 18 требуют массового аудита.
  - `qd9-408` — это "списать" (корень -пис-), не "спешить". Исправлен маппинг.
  - `algorithm-ege-platform.md` полностью переписан: отражает реальный стек (Capacitor, ML, spellEngine), 22 страницы, ML pipeline, агентский workflow.
  - `archive/` — перенесены ~130 файлов. Оставлены: Excel-реестры, DOCX/PDF, `algorithm-ege-platform.md`, `plan.md`.

### [2026-06-26 13:16] Агент: main
- **Что:** Vercel deploy — switch from GitHub Pages to Vercel root domain
- **Где:** `vite.config.ts`
- **Зачем:** GitHub Pages требует base path `/ege-russian-app/`, Vercel использует root domain — asset'ы загружались с неправильного пути
- **Git commit:** `75bf640`
- **⚠️ Важно:** 
  - `base: '/'` вместо `base: '/ege-russian-app/'`
  - GitHub Pages workflow (`.github/workflows/pages.yml`) остаётся в репозитории, но primary deploy — Vercel
  - Сборка проходит чисто, no TypeScript errors

### [2026-06-26 21:22] Агент: main
- **Что:** Отключение GitHub Pages workflow
- **Где:** `.github/workflows/pages.yml` → `.github/workflows/pages.yml.disabled`
- **Зачем:** Primary deploy теперь Vercel, GitHub Pages workflow больше не нужен и может конфликтовать
- **Git commit:** `53e2e49`
- **⚠️ Важно:** 
  - Файл оставлен с суффиксом `.disabled` для истории (можно восстановить)
  - В разделе Actions репозитория workflow больше не запускается

### [2026-06-26 21:24] Агент: main
- **Что:** Фикс OAuth редиректа для Google входа
- **Где:** `src/lib/supabase.ts` (функция `signInWithGoogle()`)
- **Зачем:** `window.location.pathname` мог включать `/ege-russian-app/` или другой путь, и после OAuth пользователь попадал на неправильный URL (404 или белый экран)
- **Git commit:** `1b1195d`
- **⚠️ Важно:** 
  - `redirectTo` изменён с `window.location.origin + window.location.pathname` на `window.location.origin + '/'`
  - Теперь всегда редиректит на корень — корректно работает на Vercel (root domain) и GitHub Pages
  - Сборка проходит чисто, no TypeScript errors

### [2026-06-27 23:07] Агент: main
- **Что:** Стандартизация explanation'ов в dooshin/task9.ts + добавление EGE-формат вопросов в orthography.ts + text-вопросы по приставкам прО-/прА- в task10Questions.ts
- **Где:** `src/data/sections/dooshin/task9.ts`, `src/data/sections/orthography.ts`, `src/data/task10Questions.ts`
- **Зачем:** Объяснения содержали шаблонные бесполезные фразы ("проверьте через...", "чередование гласных в корне вызывается ударением"), которые не давали студенту конкретного правила. Не хватало EGE-формат вопросов (выбор рядов с одной буквой) в орфографии. Не хватало text-вопросов по различению приставок прО- и прА-.
- **Git commit:** `67c3bb2`
- **⚠️ Важно:**
  - 127 explanation'ов переписаны с конкретными суффиксными правилами и исключениями для чередующихся корней (блист/блест, лаг/лож, зар/зор, пир/пер, мер/мир, тир/тер, скоч/скак, раст/рос, гар/гор, плав/плов, плыв/плав, мак/моч)
  - Добавлено 10 новых EGE-формат вопросов (q9-ege-2..q9-ege-10) в orthography.ts
  - Добавлено 5 text-вопросов по приставкам прО-/прА- в task10Questions.ts (проевропейский, пророссийский, праславянский, проамериканский, праиндоевропейский)
  - Сборка: `npm run build` ✅ (19.77s, 0 ошибок), `npm run validate:rag` ✅ (1379 entries, 0 errors, 268 warnings)
  - Следующие агенты: продолжить ревизию оставшихся explanation'ов по ФИПИ (задача А8 в AGENT_TASKS.md)

### [2026-06-28 02:00] Агент: main
- **Что:** Актуализация агентских файлов после незакоммиченных изменений (task9 explanation fixes, atomization EGE lesson, grammar/orthography additions)
- **Где:** `src/data/sections/dooshin/task9.ts`, `src/data/sections/atomization.ts`, `src/data/sections/grammar.ts`, `src/data/sections/orthography.ts`, `AGENTS.md`, `AGENT_TASKS.md`, `memory/AGENTS-HISTORY.md`
- **Зачем:** В working tree остались незакоммиченные изменения из предыдущих сессий — массовые исправления explanation'ов в dooshin/task9.ts (~40+), новый EGE-формат урок в atomization.ts (10 вопросов), добавлены вопросы в grammar.ts и orthography.ts. Агентские файлы не отражали эти изменения, что могло привести к дублированию работы или поломке данных.
- **Git commit:** [будет сделан после этого обновления]
- **⚠️ Важно:**
  - 40+ explanation'ов в dooshin/task9.ts исправлены: проверочные слова, классификации корней, answers, уточнения в текстах вопросов
  - Ключевые исправления: qd9-54 (цЫпочках, ответ Ы), qd9-59 (загОреть, ответ О), subtitle (чередующийся), "ненепроверяемый" → "непроверяемый"
  - atomization.ts: урок `lesson-atom-10-mixed` → `lesson-atom-10-ege` с 10 ege-multiple вопросами по приставкам
  - RAG rebuild: 1379 entries, 0 errors, 268 warnings (известные contradiction в word-generic)
  - build:rag ✅, validate:rag ✅

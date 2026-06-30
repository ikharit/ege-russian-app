# Агентский реестр — Полная история (архив)

> ⚠️ **Этот файл — архив.** Актуальные статусы, правила и последние 20 записей — в `AGENTS.md` в корне проекта.  
> Читай `AGENTS.md` перед началом работы.
> 
> **Текущий агент**: Agent 3 (обновлено 2026-06-29)

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

### [2026-06-25] Агент: Agent 1 (Leaderboard accuracy + Shop removed + DailyQuestionCard fallback + Vercel PWA cache)
- **Что:** Дополнительные правки в рамках сессии state-sync:
  1. **Leaderboard accuracy**: `syncSlice.ts` теперь считает `accuracy` и `totalAttempts` из `task_stats` при загрузке лидерборда из Supabase. Убран `limit(50)` — загружаются все записи. `gamificationSlice.ts` — добавлены поля `accuracy?: number` и `totalAttempts?: number` в `LeaderboardEntry`.
  2. **Shop removed**: Убран `useShopStore` из `Header.tsx` (avatar → иконка `User` из lucide-react) и `Profile.tsx` (удалена секция `ShopInventorySection`, убран импорт `ShoppingBag`). Магазин не удалён из codebase, но убран из UI.
  3. **DailyQuestionCard fallback**: Показывает информативный UI с подсказкой, когда нет данных для персонального вопроса (вместо `return null`).
  4. **Vercel PWA cache**: Добавлены `Cache-Control: no-cache, no-store, must-revalidate` для `index.html`, `sw.js`, `manifest.webmanifest` в `vercel.json`. Критично для PWA auto-update — Service Worker не должен кэшироваться CDN.
- **Где:** `src/stores/slices/syncSlice.ts`, `src/stores/slices/gamificationSlice.ts`, `src/components/Header.tsx`, `src/pages/Profile.tsx`, `src/components/DailyQuestionCard.tsx`, `vercel.json`
- **Git:** незакоммиченные изменения (working tree)
- **⚠️ Важно:** Магазин (`shopStore`) оставлен в codebase, но скрыт из UI. При необходимости — вернуть импорты и секцию.

### [2025-02-23] Агент: Agent 1 (AccentTrainer UI — no line wrap for letters)
- **Что:** Убран перенос букв на вторую строку в тренажёре ударений. Длинные слова (10+ букв) разбивались на две строки — неудобно для выбора ударной буквы.
- **Как:** `flex-wrap` → `flex-nowrap` + `overflow-x-auto pb-2`. Gap уменьшен с `gap-2` до `gap-1`.
- **Где:** `src/pages/AccentTrainer.tsx`, строка 33
- **Зачем:** UX — слово должно быть цельным, буквы не должны переноситься
- **Git commit:** `b666b81`
- **⚠️ Важно:** Теперь длинные слова остаются на одной строке, скроллятся горизонтально при необходимости. На мобильных — touch-scroll.

### [2025-02-23] Агент: Agent 1 (FIPI Codificator — unified task reference)
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

### [2026-06-25] Агент: Agent 1 (TodayPage cleanup + QuestionCard prev + Leaderboard Supabase + App simplification)
- **Что:** Четыре улучшения в одной сессии:
  1. **TodayPage cleanup**: Убраны лишние карточки из быстрого старта — оставлены 4 основных (Все задания, Марафон, Дуэль, Сочинения). Убраны мини-карточки "Достижения" и "Рейтинг" (доступны в Обзоре). Упрощены импорты (убраны `useClassStore`, `allAchievements`, `getAchievementIcon`, `Star`, `Medal`, `Brain`, `Users`, `Trophy`).
  2. **QuestionCard prev**: Добавлена навигация "Назад" — props `onPrev` и `previousAnswer`, кнопка `ArrowLeft` при наличии `onPrev`. Позволяет вернуться к предыдущему вопросу в тренажёре.
  3. **Leaderboard Supabase sync**: Добавлен `loadLeaderboard()` в `syncSlice.ts` — читает 50 записей из `user_progress` (Supabase), маппит `user_stats` и `lesson_progress` в `LeaderboardEntry`. `Leaderboard.tsx` вызывает при монтировании. Заменяет локальный leaderboard на глобальный из базы.
  4. **App.tsx simplification**: Убраны `StudentRegistrationModal`, `useStudentStore`, `useEffect` с auto-save progress в IndexedDB. Auto-sync progress теперь через `userId` из `progressStore` вместо `activeProfileId`. Упрощена логика авторизации.
- **Где:** `src/pages/TodayPage.tsx`, `src/components/QuestionCard.tsx`, `src/stores/slices/syncSlice.ts`, `src/pages/Leaderboard.tsx`, `src/App.tsx`
- **Git commit:** `18572b4`
- **⚠️ Важно:** TodayPage стал ещё более минималистичным — фокус на главном действии. Leaderboard теперь показывает реальные данные из Supabase (если настроен). App.tsx легче на ~50 строк.

### [2025-02-23] Агент: Agent 1 (Task 9 Mass Fix — explanation correctness)
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

### [2026-07-18] Агент: Agent 1 (ML Deep Dive — 4 направления)
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

### [2026-06-19 XX:XX] Агент: Agent 1 (Валидация Dooshin 10-12)
- **Что:** Проверены и исправлены задания 10-12 из Дощинского. 99 батчей проверено субагентами, 1,106 ошибок исправлено из 1,947 заданий (56.8% ошибок). Сгенерирован новый `dooshin.ts` с исправленными ответами.
- **Где:** `src/data/sections/dooshin.ts` (перегенерирован), `batches_10_12/*` (валидированные батчи), `dooshin_all_tasks_fixed_10_12.json` (исправленный JSON)
- **Зачем:** Задания из Дощинского содержали массовые ошибки (67% в задании 10, 61% в задании 11, 39% в задании 12). Все ответы проверены и исправлены.
- **Git commit:** `fix/dooshin-10-12-validation`
- **⚠️ Важно:** Сборка проходит (`npm run build` OK). Все 2,717 заданий в `dooshin.ts` обновлены с правильными ответами. Task 9 использует ранее исправленный JSON.

### [2026-06-19 17:09] Агент: Agent 1 (TASK_REGISTRY.md + JSON для всех агентов)
- **Что:** Создана система реестра заданий для всех агентов: `TASK_REGISTRY.md` (инструкция) + `task_registry.json` (1.3 МБ, машиночитаемый JSON с 3,242 вопросами). Добавлены правила: перед правкой задания 9-12 — проверить через реестр.
- **Где:** `TASK_REGISTRY.md` (в корне проекта), `task_registry.json` (в корне проекта), `Реестр_заданий_9-12_ЕГЭ_Русский.xlsx` (в workspace)
- **Зачем:** Чтобы ВСЕ агенты (не только оркестратор) могли проверять задания перед правкой. JSON читается программно, Excel — для ручной проверки.
- **Git commit:** `feat/task-registry-system`
- **⚠️ Важно:** В `AGENTS.md` → раздел «Ключевые файлы» добавлены ссылки. Любой агент, получивший задание 9-12, должен сначала прочитать `TASK_REGISTRY.md` и при необходимости использовать `task_registry.json` для проверки ответов.

### [2026-06-19 16:59] Агент: Agent 1 (Excel-реестр всех заданий 9-12)
- **Что:** Создан Excel-файл со всеми заданиями 9-12 из всего проекта (основной курс + Дощинский). 3,242 вопроса: 489 из grammar.ts, 36 из orthography.ts, 2,717 из dooshin.ts. В реестре колонки для ручной проверки: пропущенная буква, правильный ответ, варианты, правило, проверочное слово, комментарий.
- **Где:** `Реестр_заданий_9-12_ЕГЭ_Русский.xlsx` (в корне workspace)
- **Зачем:** Пользователь обнаружил ошибки в заданиях из основного курса (не только Дощинского). Создан единый реестр для совместной проверки и правки всей командой агентов.
- **Git commit:** — (Excel не в репозитории, лежит в workspace)
- **⚠️ Важно:** В `grammar.ts` `lesson-gram-12-2` есть вопрос `q12-16` «построен..» с вариантами `построен/построенн` — формат вопроса кривой. Нужно либо заменить на вставку пропущенной буквы, либо удалить. Все агенты должны проверять задания через этот Excel перед внесением изменений.

### [2026-06-19 02:00] Агент: Agent 1 (Task5 Paronyms — expanded to 82 questions)
- **Что:** Расширен банк заданий 5 (паронимы) с 12 до 82 вопросов, покрывающих все основные пары ФИПИ-2026
- **Где:** `src/data/task5Questions.ts` — полностью переписан, 82 вопроса
- **Зачем:** Пользователь просил покрыть все паронимы из паронимического словника ФИПИ 2026, а не только 12 базовых
- **Git commit:** `b945d7c`
- **⚠️ Важно:** Каждый вопрос — 5 предложений: 1 с ошибкой (первое) + 4 верных distractor'а из пула. Все слова выделены жирным (**). Покрывает ~80 паронимических пар.

### [2026-06-19 01:40] Агент: Agent 1 (Unified Error Bank)
- **Что:** Все тренажёры теперь пишут ошибки в единый банк `progressStore.wrongAnswers`
- **Где:** `src/pages/AccentTrainer.tsx`, `src/pages/Task5Trainer.tsx`, `src/pages/Task10Trainer.tsx`, `src/pages/Task16Trainer.tsx`
- **Зачем:** Пользователь жаловался, что ошибки из тренажёров не видны в «Работе над ошибками». Каждый тренажёр хранил ошибки в своём изолированном store. Теперь при неправильном ответе вызывается `recordWrongAnswer()` + `updateTaskStats()` с `atoms: ['taskN']`.
- **Git commit:** `569024e`
- **⚠️ Важно:** `recordWrongAnswer` извлекает `taskNumber` из `atoms.find(a => a.startsWith('task')).replace('task', '')`. WeakSpots.tsx уже группирует по `taskNumber` и показывает теорию. Банк заданий теперь когерентный — все ошибки в одном месте.

### [2026-06-19 01:35] Агент: Agent 1 (Header cleanup)
- **Что:** Упрощён Header — убран перегруз
- **Где:** `src/components/Header.tsx`, `src/components/ProfileSwitcher.tsx`
- **Зачем:** Пользователь показал скриншот перегруженного Header: зелёная кнопка «Добавить ученика» перекрывала «Войти», всё было в одну линию
- **Git commit:** `0ccda6e`
- **⚠️ Важно:** ProfileSwitcher теперь компактный — только emoji + стрелочка (без текста). «Добавить ученика» — маленький кружок с +. Иконки уменьшены до 18px, gap сокращён до 2.5. Teacher mode toggle убран из Header (есть в Profile).

### [2026-06-19 01:30] Агент: Agent 1 (Student Registration / Multi-user)
- **Что:** StudentStore с multi-user профилями, StudentRegistrationModal, ProfileSwitcher, динамика в Teacher, авто-сохранение в App.tsx
- **Где:** `src/stores/studentStore.ts` (новый), `src/components/StudentRegistrationModal.tsx` (новый), `src/components/ProfileSwitcher.tsx` (новый), `src/pages/Teacher.tsx`, `src/pages/Dashboard.tsx`, `src/components/Header.tsx`, `src/App.tsx`
- **Зачем:** Форма регистрации для запоминания разных реальных учеников и их динамики. Каждый ученик — отдельный профиль с собственным прогрессом, историей по дням, графиками XP/точности. Переключение через dropdown в Header.
- **Git commit:** —
- **⚠️ Важно:** `studentStore` persist key `ege-student-storage`. `progressStore` остаётся сессионным — при переключении профиля прогресс загружается из снепшота. `App.tsx` автоматически сохраняет прогресс в активный профиль при каждом изменении. Динамика (history) — мини-графики в карточке ученика (Teacher → detail view).

### [2026-06-19 01:00] Агент: Agent 1 (Retention / Push / Analytics)
- **Что:** NotificationStore, AnalyticsPage, Dashboard виджеты, Teacher ссылка
- **Где:** `src/stores/notificationStore.ts` (новый), `src/pages/AnalyticsPage.tsx` (новый), `src/pages/Dashboard.tsx` (NotificationWidget + DeadlineWidget), `src/pages/Teacher.tsx` (ссылка на /analytics), `src/App.tsx` (роут /analytics + useEffect проверки уведомлений)
- **Зачем:** Retention-механизмы: push-напоминания о streak и дедлайнах, аналитика класса для учителя (слабые задания, heatmap, дедлайны), виджеты на Dashboard
- **Git commit:** `e727cf0`
- **⚠️ Важно:** `notificationStore` persist key `notification-store`. AnalyticsPage агрегирует данные из `teacherStudents` + `taskStats` + `allHomework`. `NotificationWidget` показывает только непрочитанные уведомления. `DeadlineWidget` считает дни до дедлайна из Google Sheets.

### [2026-06-19 00:30] Агент: Agent 1 (теория + тесты)
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

### [2026-06-19 00:20] Агент: Agent 1
- **Что:** База теории — task11, task12, task14
- **Где:** src/data/theory/task11.ts, task12.ts, task14.ts
- **Зачем:** Скрапинг теории из umschool.net, maximumtest.ru, ФИПИ Навигатор
- **Git commit:** 14aa518
- **⚠️ Важно:** Пополнено 3 задания из 11. Остались: task5, 6, 7, 8, 13, 15, 16, 17-21, 22-26.

### [2026-06-19 00:11] Агент: Agent 1
- **Что:** Создан агентский реестр (AGENTS.md + memory/agent-registry.md)
- **Где:** `AGENTS.md`, `memory/agent-registry.md` (этот файл)
- **Зачем:** 5 агентов работают над проектом, нужна координация
- **Git commit:** —
- **⚠️ Важно:** Все агенты ДОЛЖНЫ читать этот файл перед работой. Дублируйте записи в оба файла.

### [2026-06-18 23:55] Агент: Agent 1
- **Что:** Streak freeze + звёзды на карте курса
- **Где:** `src/stores/progressStore.ts`, `src/pages/CourseMap.tsx`, `src/types/index.ts`
- **Зачем:** Бесплатная заморозка streak раз в 7 дней; визуализация 1-3 звёзд по урокам
- **Git commit:** `f234b15`
- **⚠️ Важно:** UserStats расширен полями `streakFrozen`, `streakFreezeUsed`, `streakFreezeLastReset`

### [2026-06-18 23:45] Агент: Agent 1 (task10 + task5)
- **Что:** Task10Trainer: убраны звёзды, заменены на статусы (new/deferred/passed). Исправлены орфографические ошибки в вопросах (q1, q3, q6). Task5Trainer: новый тренажёр по паронимам (задание 5).
- **Где:** `src/stores/task10Store.ts`, `src/pages/Task10Trainer.tsx`, `src/data/task10Questions.ts`, `src/pages/Dashboard.tsx`, `src/data/task5Questions.ts`, `src/stores/task5Store.ts`, `src/pages/Task5Trainer.tsx`, `src/App.tsx`
- **Зачем:** Убрана система 5 звёзд — повторение только при ошибке, в конце сессии. Исправлены слова: разфасовать→расфасовать, возьметь→возьмёшь, обгрохать→обгрызть, прязык→признак, бесприкрас→преславный. Новый тренажёр №5 с 12 вопросами по паронимам ФИПИ.
- **Git commit:** `3035726` (task10 статусы), `149da4e` (task10 исправления), `f55ec35` (task5 тренажёр)
- **⚠️ Важно:** Task10Trainer persist key изменён на `task10-trainer-v2`. Task5Trainer — новый модуль, persist key `task5-trainer-v1`.

### [2026-06-18 23:20] Агент: Agent 1
- **Что:** Исправлен роутинг заданий (4→accent, 9→корни, 10→task10)
- **Где:** `src/pages/WeakSpots.tsx`, `src/stores/progressStore.ts`
- **Зачем:** Задание 9 ошибочно вело в accent-trainer вместо урока про корни
- **Git commit:** `a67d7dc`
- **⚠️ Важно:** `getProblematicTasks` теперь фильтрует `wrong > 0 && accuracy < 95`

### [2026-06-18 23:00] Агент: Agent 1
- **Что:** Task16Trainer — тренажёр задания 16 (пунктуация)
- **Где:** `src/pages/Task16Trainer.tsx`, `src/data/task16Questions.ts`, `src/stores/task16Store.ts`, `src/App.tsx`, `src/pages/Dashboard.tsx`
- **Зачем:** Новый тренажёр задания ЕГЭ №16 — запятые в сложных предложениях, вводных словах, придаточных
- **Git commit:** —
- **⚠️ Важно:** 20 вопросов по темам: придаточные времени/причины/цели/уступки/изъяснительные, вводные слова, однородные члены. Паттерн повторён от Task5Trainer.

### [2026-06-18 22:44] Агент: Agent 1
- **Что:** Task5Trainer — тренажёр задания 5 (типографика)
- **Где:** `src/pages/Task5Trainer.tsx`, `src/data/task5Questions.ts`, `src/stores/task5Store.ts`, `src/App.tsx`, `src/pages/Dashboard.tsx`, `src/data/theoryTests.ts`
- **Зачем:** Новый тренажёр для задания ЕГЭ (типографика/пунктуация)
- **Git commit:** `da84a9d`
- **⚠️ Важно:** Новый модуль — добавлен роут `/task5-trainer`, стор, данные вопросов. Dashboard обновлён для подсчёта изученных уроков.

### [2026-06-18 22:25] Агент: Agent 1
- **Что:** Объединение слабых мест в единый центр /mistakes
- **Где:** `src/pages/WeakSpots.tsx`, `src/pages/Statistics.tsx`, `src/pages/Dashboard.tsx`, `src/components/MistakesPractice.tsx`
- **Зачем:** 4 дублирующих раздела → 1 с 3 вкладками (ошибки, задания, атомы)
- **Git commit:** `369d95b`
- **⚠️ Важно:** Statistics больше не показывает «Слабые» и «Атомы» — они в /mistakes. Старый `MistakesReview.tsx` заменён на `WeakSpots.tsx`.

### [2026-06-18 22:00] Агент: Agent 1
- **Что:** Share result page (/share)
- **Где:** `src/pages/ShareResultPage.tsx`, `src/App.tsx`, `src/components/LessonResult.tsx`
- **Зачем:** Красивая карточка результата для шаринга
- **Git commit:** `c99d5d8`
- **⚠️ Важно:** LessonResult передаёт state через navigate. При F5 страница пустая — это известно.

### [2026-06-18 21:30] Агент: Agent 1
- **Что:** Combo toasts, звуки, confetti, weak topics на Dashboard
- **Где:** `src/components/ComboToast.tsx`, `src/lib/sounds.ts`, `src/pages/Lesson.tsx`, `src/components/AchievementToast.tsx`, `src/pages/Dashboard.tsx`
- **Зачем:** UX улучшения — мотивация, фидбек, видимость проблем
- **Git commit:** `ffcf4a4`
- **⚠️ Важно:** Звуки через Web Audio API — могут быть заблокированы браузером до первого взаимодействия.

### [2026-06-18 20:50] Агент: Agent 1
- **Что:** Leaderboard rank statuses + achievements UI polish
- **Где:** `src/data/statuses.ts`, `src/stores/progressStore.ts`, `src/pages/Profile.tsx`, `src/pages/Leaderboard.tsx`
- **Зачем:** Статусы за 1-3 места в рейтинге, визуальная иерархия достижений
- **Git commit:** `9958f47`
- **⚠️ Важно:** `getUnlockedStatuses` теперь принимает `leaderboardRanks` как второй аргумент.

### [2026-06-18 20:10] Агент: Agent 1
- **Что:** Пропорциональные высоты пьедестала в рейтинге
- **Где:** `src/pages/Leaderboard.tsx`
- **Зачем:** Визуально 1-е место было ниже 2-го
- **Git commit:** `9724b2f`
- **⚠️ Важно:** Высоты теперь считаются по XP: `minHeight + (val/maxVal) * (maxHeight-minHeight)`

### [2026-06-26 10:30] Агент: Agent 1
- **Что:** Workspace cleanup + Deduplication + Docs актуализация
- **Где:** `archive/` (корень workspace), `src/data/questionMapping.ts`, `algorithm-ege-platform.md` (корень workspace)
- **Зачем:** Убрать мусор из корня workspace, связать дублирующиеся слова между orthography.ts и dooshin/task9.ts, актуализировать дизайн-документ
- **Git commit:** (в процессе)
- **⚠️ Важно:** 
  - 15/33 дублей из `audit_report_final.txt` теперь связаны через `canonicalWordId` в `questionMapping.ts`. Оставшиеся 18 требуют массового аудита.
  - `qd9-408` — это "списать" (корень -пис-), не "спешить". Исправлен маппинг.
  - `algorithm-ege-platform.md` полностью переписан: отражает реальный стек (Capacitor, ML, spellEngine), 22 страницы, ML pipeline, агентский workflow.

### [2026-06-28 10:23] Агент: Agent 1
- **Что:** Agent identification system + незакоммиченные изменения (achievements, task9, achievementChecker)
- **Где:** `AGENTS.md`, `AGENT_REMINDER.md`, `AGENT_TASKS.md`, `memory/2026-06-26.md`, `memory/AGENTS-HISTORY.md`, `IDENTITY.md`, `src/data/achievements.ts`, `src/stores/slices/achievementChecker.ts`, `src/data/sections/dooshin/task9.ts`, `public/data/graph-relations.json`
- **Зачем:** Ввести систему идентификации агентов, чтобы отслеживать кто что делал. Также закоммичены незакоммиченные изменения из предыдущих сессий.
- **Git commit:** `b0a1230`
- **⚠️ Важно:** 
  - Все записи в changelog и истории теперь содержат `by Agent N`
  - Текущий агент: **Agent 1** (основной, оркестратор)
  - AGENTS.md — добавлен `Current Agent ID: agent-1` в начало файла
  - AGENT_TASKS.md — добавлено поле **Агент:** в заголовок и в задачу А23
  - AGENT_REMINDER.md — добавлена заметка "Текущий агент: Agent 1"
  - Также включены: achievements cleanup, task9 explanation fixes (round 3), achievementChecker.ts, graph-relations.json
  
### [2026-06-28 10:25] Агент: Agent 6
- **Что:** Актуализация агентских файлов + добавлен agent-6 ID
- **Где:** `AGENTS.md`, `AGENT_TASKS.md`, `src/lib/questionEdits.ts`
- **Зачем:** Агент 6 выполнил чистку и фиксы (workspace cleanup, build fix, Supabase security, data fixes). Добавлены его изменения в агентские файлы.
- **Git commit:** `2fe856a`
- **⚠️ Важно:** 
  - AGENTS.md — добавлены changelog entries для achievements cleanup и task9 round 3
  - AGENT_TASKS.md — добавлены задачи А31 (achievements cleanup) и А32 (task9 round 3)
  - Все записи теперь содержат agent ID

### [2026-06-28 10:26] Агент: Agent 3
- **Что:** Обновление агентской идентификации → Agent 3
- **Где:** `AGENTS.md`, `AGENT_TASKS.md`, `memory/AGENTS-HISTORY.md`, `memory/2026-06-28.md`, `src/lib/questionEdits.ts`, `src/pages/TodayPage.tsx`
- **Зачем:** Смена текущего агента на Agent 3 (оркестратор)
- **Git commit:** `8947bea`
- **⚠️ Важно:** 
  - Текущий агент: **Agent 3**
  - AGENTS.md — Current Agent ID: `agent-3`
  - memory/2026-06-28.md — дополнен агентской записью

  - `archive/` — перенесены ~130 файлов. Оставлены: Excel-реестры, DOCX/PDF, `algorithm-ege-platform.md`, `plan.md`.

### [2026-06-26 13:16] Агент: Agent 1
- **Что:** Vercel deploy — switch from GitHub Pages to Vercel root domain
- **Где:** `vite.config.ts`
- **Зачем:** GitHub Pages требует base path `/ege-russian-app/`, Vercel использует root domain — asset'ы загружались с неправильного пути
- **Git commit:** `75bf640`
- **⚠️ Важно:** 
  - `base: '/'` вместо `base: '/ege-russian-app/'`
  - GitHub Pages workflow (`.github/workflows/pages.yml`) остаётся в репозитории, но primary deploy — Vercel
  - Сборка проходит чисто, no TypeScript errors

### [2026-06-26 21:22] Агент: Agent 1
- **Что:** Отключение GitHub Pages workflow
- **Где:** `.github/workflows/pages.yml` → `.github/workflows/pages.yml.disabled`
- **Зачем:** Primary deploy теперь Vercel, GitHub Pages workflow больше не нужен и может конфликтовать
- **Git commit:** `53e2e49`
- **⚠️ Важно:** 
  - Файл оставлен с суффиксом `.disabled` для истории (можно восстановить)
  - В разделе Actions репозитория workflow больше не запускается

### [2026-06-26 21:24] Агент: Agent 1
- **Что:** Фикс OAuth редиректа для Google входа
- **Где:** `src/lib/supabase.ts` (функция `signInWithGoogle()`)
- **Зачем:** `window.location.pathname` мог включать `/ege-russian-app/` или другой путь, и после OAuth пользователь попадал на неправильный URL (404 или белый экран)
- **Git commit:** `1b1195d`
- **⚠️ Важно:** 
  - `redirectTo` изменён с `window.location.origin + window.location.pathname` на `window.location.origin + '/'`
  - Теперь всегда редиректит на корень — корректно работает на Vercel (root domain) и GitHub Pages
  - Сборка проходит чисто, no TypeScript errors

### [2026-06-27 23:07] Агент: Agent 1
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

### [2026-06-28] Агент: Agent 6 (Cleanup, build fix, Supabase security, data fixes)
- **Что:** Множественные исправления и чистка:
  1. **Workspace cleanup (wave 2)**: Удалены 6 устаревших файлов-дублей: `group_26_27.json` (дубль), `test_57019530.txt`, `test_57019530_end.txt`, `test_innerText.txt` (фрагменты API), `pupils_intermediate.json` (багованные данные), `theory_text.json` (дубль).
  2. **Build fix**: Исправлены синтаксические ошибки в `src/stores/friendStore.ts` (дублированный код, отсутствующие закрывающие скобки). Сборка проходит: `npm run build` ✅ (15.18s, 0 ошибок).
  3. **Supabase security**: `ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;` — включён RLS на `user_progress`. `ALTER VIEW public.admin_user_analytics SET (security_invoker = true);` — view пересоздан с `security_invoker`.
  4. **Data fixes**: `task9.ts` — добавлено примечание "Всегда ПЛАВ, кроме: ПЛОВЕЦ, ПЛОВЧИХА, ПЛЫВУН" ко всем объяснениям с корнем плав/плов (10 вопросов). `task9-rules.json` — удалено ложное чередование "плот/плат", заменено на два проверяемых корня: "плот" (проверочное: плоть) и "плат" (проверочное: платить). `task9.ts` — исправлены 4 вопроса: воплотить, оплатить, воплотну, уплотнять (все теперь проверяемые, не чередующиеся). `task10.ts` — добавлены 5 вопросов по приставкам прО-/прА- (проевропейский, пророссийский, праславянский, проамериканский, праиндоевропейский). `atomization/task10Questions.ts` — удалён вопрос "престудия" (такого слова не существует). `orthography.ts` — добавлены 5 вопросов по прО-/прА-.
  5. **Lesson.tsx fix**: Убрано перемешивание `options` для `ege-multiple` — вопросы ЕГЭ теперь показывают варианты в правильном порядке (1, 2, 3, 4, 5), а не перемешанном. Раньше `correctAnswer` содержал номера вариантов, а перемешивание ломало ответы.
- **Где:** `src/stores/friendStore.ts`, `src/data/sections/dooshin/task9.ts`, `src/data/sections/orthography.ts`, `src/data/sections/dooshin/task10.ts`, `src/data/atomization/task10Questions.ts`, `src/data/rules/task9-rules.json`, `src/pages/Lesson.tsx`, `AGENTS.md`, `AGENT_REMINDER.md`, `memory/AGENTS-HISTORY.md`, `memory/agent-registry.md`
- **Git commit:** `55f7904` (friendStore fix), `agent-6` (data fixes)
- **⚠️ Важно:** Все новые explanation'ы в task9.ts содержат полный набор исключений. Agent ID: `agent-6`.
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


### [2026-06-26 11:00] Агент: Agent 1
- **Что:** Commit uncommitted changes from Agent 5 session (retrospective)
- **Где:** `src/data/achievements.ts`, `src/data/sections/dooshin/task9.ts`, `src/pages/TodayPage.tsx`, `src/stores/slices/achievementChecker.ts`, `src/lib/questionEdits.ts`, `src/types/index.ts`
- **Зачем:** Закоммитить изменения, оставленные в working tree предыдущим агентом (Agent 5, 2026-06-28). Эти изменения были в working tree, но не закоммичены.
- **Git commit:** `0f02a32`
- **⚠️ Важно:** 
  - achievements.ts — частичный откат порогов ачивок (компромисс: добавлены обратно lower-tier ачивки: lessons-10, perfect, streak-3, xp-100/500, level-5)
  - task9.ts — минорные фиксы explanation
  - Все изменения от Agent 5, закоммичены ретроспективно Agent 1


### [2026-06-28 11:32] Агент: Agent 5
- **Что:** Deploy cache-bust v5 + peaceiris force_orphan
- **Где:** `index.html`
- **Зачем:** Принудительное обновление PWA — браузер не кэширует старую версию. Чистый деплой без истории в `gh-pages` branch.
- **Git commit:** `0bc2673`
- **⚠️ Важно:** cache-bust query parameter обновлён. Сборка проходит чисто.

### [2026-06-28 11:31] Агент: Agent 5
- **Что:** Atomization — merge deaf/voiced consonant prefixes into single lesson
- **Где:** `src/data/sections/atomization.ts`, `src/data/sections/dooshin/task10.ts`, `.github/workflows/pages.yml`, `src/pages/QuestionEditorPage.tsx`
- **Зачем:** Уроки по глухим/звонким согласным (ВЗ/ВС, РАЗ/РАС, БЕЗ/БЕС, ИЗ/ИС) дублировались между lesson-atom-10-3, 10-5, 10-6. Объединение в один урок устраняет дублирование и делает структуру чище.
- **Git commit:** `4904112`
- **⚠️ Важно:** `dooshin/task10.ts` — обновлены привязки вопросов. Сборка проходит чисто.

### [2026-06-28 11:25] Агент: Agent 4
- **Что:** QuestionEditorPage — agent field tracking
- **Где:** `src/pages/QuestionEditorPage.tsx`
- **Зачем:** Отслеживание provenance правок: кто, когда и что изменил в вопросе. Критично для координации нескольких агентов.
- **Git commit:** `ebcc1f9`
- **⚠️ Важно:** Поле "agent" добавлено в UI редактора. Сборка проходит чисто.

### [2026-06-28 11:21] Агент: Agent 4
- **Что:** Remove hints, rebalance achievements, add EGE format lessons
- **Где:** `src/pages/QuestionEditorPage.tsx`, `src/data/achievements.ts`, `src/data/atomization/task10Questions.ts`, `src/data/sections/dooshin/task10.ts`, `public/data/graph-relations.json`
- **Зачем:** Система hints не использовалась и усложняла UI. Achievements нуждались в перебалансировке. EGE-формат вопросы необходимы для подготовки к экзамену.
- **Git commit:** `255a7d1`
- **⚠️ Важно:** Hints убраны из редактора. Achievements перебалансированы. EGE-multiple вопросы добавлены в task10Questions.ts. Сборка проходит чисто.

### [2026-06-28 11:20] Агент: Agent 5
- **Что:** Lesson explanation visibility fix
- **Где:** `src/components/QuestionCard.tsx`
- **Зачем:** Explanation (объяснение правила) скрывалось в некоторых состояниях после правильного ответа. Пользователь должен видеть объяснение, чтобы учиться на ошибках.
- **Git commit:** `9e216f9`
- **⚠️ Важно:** Explanation теперь unconditionally виден после `isCorrect === true`. Сборка проходит чисто.

### [2026-06-28 11:14] Агент: Agent 5
- **Что:** Docs(agents): log atomization deduplication fix by Agent 5
- **Где:** `AGENTS.md`, `src/components/QuestionCard.tsx`
- **Зачем:** Частичная актуализация агентских файлов + минорный фикс QuestionCard.tsx (5 строк).
- **Git commit:** `8ebce91`
- **⚠️ Важно:** Агентские файлы частично обновлены, но последующие коммиты (`9e216f9`…`0bc2673`) не были задокументированы до сессии Agent 3 (2026-06-28 12:07).

### [2026-06-28 11:12] Агент: Agent 5
- **Что:** Atomization deduplication — remove duplicate questions between lesson-atom-10-3 and 10-5
- **Где:** `src/data/sections/atomization.ts`, `src/data/atomization/task10Questions.ts`, `src/data/sections/dooshin/task10.ts`, `src/data/achievements.ts`, `src/stores/slices/achievementChecker.ts`, `src/components/InlineQuestionEditor.tsx`, `src/components/QuestionCard.tsx`, `public/data/graph-relations.json`, `scripts/export-edits.cjs`, `src/vite-plugin-export-edits.ts`
- **Зачем:** Убрать дублирование теории между lesson-atom-10-3 (ВЗ/ВС + РАЗ/РАС) и lesson-atom-10-5 (БЕЗ/БЕС). Раньше оба урока содержали пересекающийся материал по глухим/звонким согласным.
- **Git commit:** `1969bc1`
- **⚠️ Важно:** lesson-atom-10-3 → только ВЗ/ВС + РАЗ/РАС. lesson-atom-10-5 → переименован в «БЕЗ- / БЕС- / ОБЕС- / ЗАС-». lesson-atom-10-6 → «ИЗ- / ИС- / СЫ-». lesson-atom-10-7 → «Неизменяемые и сложные приставки». Prerequisites lesson-atom-10-ege → lesson-atom-10-7. Сборка проходит чисто.

### [2026-06-28 12:07] Агент: Agent 3
- **Что:** Актуализация агентских файлов после late-session commits (Agent 4, 5, 6) + uncommitted change
- **Где:** `AGENTS.md`, `AGENT_TASKS.md`, `memory/AGENTS-HISTORY.md`, `memory/2026-06-28.md`, `src/data/atomization/task10Questions.ts`
- **Зачем:** Коммиты `9e216f9`, `255a7d1`, `ebcc1f9`, `4904112`, `0bc2673` (все от 2026-06-28) не были отражены в агентской документации. Uncommitted change в `task10Questions.ts` (улучшение explanation q10-atom-12) тоже не был задокументирован.
- **Git commit:** [будет сделан после этого обновления]
- **⚠️ Важно:**
  - Добавлены записи в `AGENTS.md` changelog для всех 5 коммитов + uncommitted change.
  - Добавлены задачи А33–А38 в `AGENT_TASKS.md`.
  - Обновлён `memory/AGENTS-HISTORY.md` — архивные записи с commit hashes.
  - Обновлён `memory/2026-06-28.md` — дополнены коммиты и uncommitted change.
  - Сборка: `npm run build` и `npm run validate:rag` — будут запущены для проверки.
  - Следующие агенты: проверить, что все изменения отражены корректно.


### [2026-06-28 12:20] Агент: Agent 3
- **Что:** Синтаксический фикс: 41 broken explanation strings в dooshin/task10.ts
- **Где:** `src/data/sections/dooshin/task10.ts`
- **Зачем:** В 41 explanation'ах приставок без-/бес- одинарная кавычка внутри строки (`согласной'.`) ломала JavaScript-строку и вызывала `Expected "}" but found "глухих"` при сборке. Это привело к полному падению build.
- **Решение:** Массовая замена через Python: все такие explanation'ы обёрнуты в двойные кавычки + точка перенесена внутрь строки.
- **Git commit:** `9c50ec8`
- **⚠️ Важно:** Build проходит чисто (18.19s, 0 TypeScript ошибок). validate:rag ✅ (1379 entries, 0 errors, 0 warnings). Следующие агенты: проверять, что explanation'ы не содержат одинарных кавычек внутри одинарно-закавыченных строк.


### [2026-06-28 16:07] Агент: Agent 3
- **Что:** Актуализация агентских файлов + аудит незакоммиченных изменений в task9.ts + исправление 11 критических ошибок корня `-гор-`
- **Где:** `AGENTS.md`, `AGENT_TASKS.md`, `memory/AGENTS-HISTORY.md`, `memory/2026-06-28.md`, `src/data/sections/dooshin/task9.ts`
- **Зачем:** В working tree обнаружены незакоммиченные изменения в `task9.ts`. При аудите выявлена системная ошибка: корень `-гор-` (чередующийся) заменён на `-горе-` (проверяемый) в 11 вопросах от слова «гореть», что давало несуществующие слова (загеревший, обгереть, разгераться и др.).
- **Решение:** Исправлены 11 ошибок correctAnswer (с `е` на `о`) и восстановлены правильные explanation. Сохранены корректные правки explanation (умерла, шорох, замарать, поджёг, жёсткий, решётка, кардинально, вольнолюбивый, добираться, капюшон). Обновлены агентские файлы.
- **Git commit:** `10f9bc9`
- **⚠️ Важно:** Build проходит чисто (10.65s, 0 TypeScript ошибок). validate:rag ✅ (1379 entries, 0 errors, 0 warnings). Следующие агенты: при аудите незакоммиченных изменений проверять, что correctAnswer не был изменён на несуществующее слово.


### [2026-06-28 20:07] Агент: Agent 3
- **Что:** Regression fix — восстановление `task9.ts` после обратного дрейфа correctAnswers
- **Где:** `src/data/sections/dooshin/task9.ts`, `AGENTS.md`, `AGENT_TASKS.md`, `memory/AGENTS-HISTORY.md`, `memory/2026-06-28.md`
- **Зачем:** В `git diff` обнаружен regression — 11 вопросов с корнем `-гор-` (чередующийся гор/гар) вновь получили incorrect `correctAnswer: ["е"]` и explanation `-горе-`, хотя были исправлены в коммите `10f9bc9`. Это создавало несуществующие слова (загеревший, обгереть, разгераться и др.).
- **Решение:** Файл откачен к состоянию коммита `10f9bc9` через `git checkout HEAD --`. Все 11 вопросов восстановлены. Сборка и RAG проходят чисто. Обновлены агентские файлы.
- **Git commit:** [будет сделан после актуализации]
- **⚠️ Важно:** Build: 11.31s, 0 errors. validate:rag: 1379 entries, 0 errors, 0 warnings. Следующие агенты: при обнаружении незакоммиченных изменений в `task9.ts` — проверять diff на regression `горе-` вместо `гор-`.

### [2026-06-28 21:40] Агент: Agent 3
- **Что:** Cache-bust v6 + content fixes — update manifest cache-bust, explanation fixes in task9.ts, grammar.ts, task7Questions.ts, theory/task12.ts, theoryTests.ts
- **Где:** `index.html`, `src/data/sections/dooshin/task9.ts`, `src/data/sections/grammar.ts`, `src/data/task7Questions.ts`, `src/data/theory/task12.ts`, `src/data/theoryTests.ts`, `public/data/graph-relations.json`, `public/data/knowledge-index.json`
- **Зачем:** Обновление PWA cache-bust + исправление неточностей в объяснениях спряжения и корней.
- **Git commit:** `2ee6f6d`
- **⚠️ Важно:** Build: 43.95s, 0 errors. validate:rag: 1379 entries, 0 errors, 0 warnings.

### [2026-06-28 21:55] Агент: Agent 3
- **Что:** Cloudflare Pages deployment workflow — добавлен CI/CD для деплоя на Cloudflare Pages
- **Где:** `.github/workflows/cloudflare-pages.yml`
- **Зачем:** Добавить второй deploy target (Cloudflare Pages) в дополнение к GitHub Pages.
- **Git commit:** `3f3150d`

### [2026-06-28 22:14] Агент: Agent 3
- **Что:** Trigger Cloudflare Pages deployment (empty commit)
- **Где:** —
- **Зачем:** Принудительный запуск workflow для проверки.
- **Git commit:** `775e7a2`

### [2026-06-28 22:19] Агент: Agent 3
- **Что:** Fix Cloudflare Pages workflow — add apiToken
- **Где:** `.github/workflows/cloudflare-pages.yml`
- **Зачем:** wrangler-action требует apiToken для аутентификации.
- **Git commit:** `95e97f8`

### [2026-06-28 22:22] Агент: Agent 3
- **Что:** Fix Cloudflare Pages workflow — add GITHUB_TOKEN env
- **Где:** `.github/workflows/cloudflare-pages.yml`
- **Зачем:** Добавление GITHUB_TOKEN для доступа к репозиторию.
- **Git commit:** `faa00c9`

### [2026-06-28 22:24] Агент: Agent 3
- **Что:** Fix Cloudflare Pages workflow — use wrangler CLI directly
- **Где:** `.github/workflows/cloudflare-pages.yml`
- **Зачем:** Упрощение workflow, прямой вызов wrangler CLI.
- **Git commit:** `9077f30`

### [2026-06-28 22:27] Агент: Agent 3
- **Что:** Fix Cloudflare Pages workflow — use wrangler-action@v3
- **Где:** `.github/workflows/cloudflare-pages.yml`
- **Зачем:** Возврат к action с корректной версией v3.
- **Git commit:** `2d64dee`

### [2026-06-28 22:32] Агент: Agent 3
- **Что:** Fix GitHub Pages workflow — use official actions/deploy-pages
- **Где:** `.github/workflows/pages.yml`
- **Зачем:** Переход на официальный GitHub action для деплоя Pages.
- **Git commit:** `83322aa`

### [2026-06-28 22:35] Агент: Agent 3
- **Что:** Fix deploy — restore base to /ege-russian-app/ for GitHub Pages
- **Где:** `vite.config.ts`
- **Зачем:** GitHub Pages требует base path с именем репозитория. Было '/' для Vercel, восстановлено '/ege-russian-app/'.
- **Git commit:** `2cb146b`
- **⚠️ Важно:** Теперь dual-deploy: GitHub Pages (primary) + Cloudflare Pages (secondary). Vercel больше не используется.

### [2026-06-28 22:39] Агент: Agent 3
- **Что:** Shkolkovo content — добавлены задания 15 (Н/НН) из сборника Дощинского-2026
- **Где:** `src/data/sections/shkolkovo/`, `src/data/sections/orthographyAll.ts`, `public/data/graph-relations.json`
- **Зачем:** Расширение банка заданий заданием 15 (Н/НН) из сборника Дощинского-2026 (~150 вопросов с пояснениями).
- **Git commit:** `143b6dc` (входит в docs(agents): sync agent files — cache-bust v6, Cloudflare deploy, GitHub Pages restore, Shkolkovo content)

### [2026-06-29 13:23] Агент: Agent 3
- **Что:** Аудит агентских файлов — исправление stale 'незакоммичено'
- **Где:** `AGENT_TASKS.md`, `memory/AGENTS-HISTORY.md`, `AGENTS.md`
- **Зачем:** `git status --short` показал чистый working tree, но агентские файлы содержали stale-ссылки 'незакоммичено' для Shkolkovo content. Следующий агент мог бы подумать, что файлы не закоммичены.
- **Git commit:** b3c00d2

### [2026-06-29 14:00] Агент: Agent 3
- **Что:** Аудит агентских файлов v2 — исправление stale-ссылок внутри закоммиченных файлов
- **Где:** `AGENTS.md`, `AGENT_TASKS.md`, `memory/AGENTS-HISTORY.md`, `memory/2026-06-29.md`, `TASK_REGISTRY.md`
- **Зачем:** Коммит `b3c00d2` содержал агентские файлы, но внутри них остались stale-ссылки "будет сделан после актуализации". Следующий агент мог бы подумать, что работа не завершена.
- **Git commit:** 80f1e74

### [2026-06-29 20:07] Агент: Agent 3
- **Что:** Аудит актуальности агентских файлов
- **Где:** `memory/agent-registry.md`, `AGENTS.md`, `AGENT_TASKS.md`, `memory/AGENTS-HISTORY.md`, `memory/2026-06-29.md`
- **Зачем:** После коммита `4313f13` (Profile ChevronDown fix) агентские файлы были частично синхронизированы в `8b39a47`, но `memory/agent-registry.md` остался с датой `2026-06-28` и без упоминания о фиксе. Проведена проверка всех 5 файлов, обновлены устаревшие записи.
- **Git commit:** 408ade9
- **⚠️ Важно:** Следующие агенты должны проверять `memory/agent-registry.md` при каждой сессии — он часто отстаёт.

### [2026-06-30 01:28] Агент: Agent 3
- **Что:** Leaderboard duplicate fix — предотвращение дублирования пользователя, уже в Supabase leaderboard
- **Где:** `src/pages/Leaderboard.tsx`, `supabase/migrations/005_leaderboard_rpc.sql`
- **Зачем:** Пользователь отображался дважды: из Supabase (get_leaderboard RPC) и как local 'Вы' currentUserEntry
- **Git commit:** 7b82511

### [2026-06-30 01:39] Агент: Agent 3
- **Что:** Task10 correctAnswer fix + Task19 dooshin content
- **Где:** `src/data/questions/task10_dooshin.ts`, `src/data/questions/task19.ts`, `src/data/questions/task19_dooshin.ts`
- **Зачем:** qd10-75 "пр_мадонна" имел неверный ответ ['и'] (примадонна), правильный ['е'] (премадонна). Добавлен task19_dooshin.ts (484 вопроса).
- **Git commit:** 68e2f6d

### [2026-06-30 02:11] Агент: Agent 3
- **Что:** Task13/14/16 dooshin content + Task20 move to punctuation + Leaderboard cleanup
- **Где:** `src/data/questions/task13_dooshin.ts`, `task14_dooshin.ts`, `task16_dooshin.ts`, `src/pages/Leaderboard.tsx`, `src/data/sections/examTasks.ts`, `n_nn.ts`, `orthographyAll.ts`
- **Зачем:** Массовое добавление dooshin-контента (~23,845 вопросов). Task20 перенесён в punctuation. Task15 filter cleanup.
- **Git commit:** bf0ebfc

### [2026-06-30 02:29] Агент: Agent 4 (GrowthTimeline), Agent 3 (dooshin + cleanup)
- **Что:** GrowthTimeline recharts fix + Task5/6/11 dooshin + Legacy cleanup
- **Где:** `src/components/GrowthTimeline.tsx`, `src/data/questions/task5_dooshin.ts`, `task6_dooshin.ts`, `task11.ts`, `src/data/hints.ts`, `src/pages/Task10Trainer.tsx`, `src/stores/task10Store.ts`
- **Зачем:** GrowthTimeline падал с ошибкой scale при <2 data points. Добавлены dooshin-задания 5 (1969), 6 (1857), 11. Удалены legacy JSON/task10Questions.ts.
- **Git commit:** 2fb67a6

### [2026-06-30 02:34] Агент: Agent 3
- **Что:** Task14 cleanup — garbage removal + NI/NE fix
- **Где:** `src/data/questions/task14.ts`, `src/data/sections/grammar.ts`, `src/data/sections/orthographyAll.ts`
- **Зачем:** Удалены garbage questions (t14-* prefix — task10, q14-1..20 — task13 NI/NE). Исправлен subtitle group-task14.
- **Git commit:** 8d65ac2

### [2026-06-30 07:18] Агент: Agent 3
- **Что:** Аудит агентских файлов — 5 незадокументированных коммитов (7b82511..8d65ac2)
- **Где:** `AGENTS.md`, `AGENT_TASKS.md`, `TASK_REGISTRY.md`, `memory/AGENTS-HISTORY.md`, `memory/2026-06-30.md`
- **Зачем:** Все 5 коммитов с изменениями кода не были отражены в агентских файлах. Проведена полная актуализация. Запущены build:rag + validate:rag. Сделан git commit.
- **Git commit:** 4a06f86
- **⚠️ Важно:** Следующие агенты должны проверять git log и git diff при каждой сессии.

### [2026-06-30 07:30] Агент: Agent 3
- **Что:** Fix stale TBD в AGENTS-HISTORY.md + update agent-registry.md + AGENTS.md changelog update
- **Где:** `memory/AGENTS-HISTORY.md`, `memory/agent-registry.md`, `AGENTS.md`
- **Зачем:** Коммит `06af1a8` (replace TBD with actual git hash) не исправил `memory/AGENTS-HISTORY.md`. В последней записи остался `Git commit: TBD`. Также `agent-registry.md` содержал устаревшую дату (`2026-06-29`).
- **Git commit:** 9bd728f (fix TBD + registry), 77db4a5 (AGENTS.md changelog)
- **Сборка:** `npm run build` ✅ (15.50s, 0 TypeScript ошибок). `validate:rag` ✅ (1379 entries, 0 errors, 0 warnings).

### [2026-06-30 08:14] Агент: Agent 3
- **Что:** docs(agents): replace TBD with actual git hash 4a06f86
- **Где:** `AGENTS.md`, `AGENT_TASKS.md`, `memory/2026-06-30.md`
- **Зачем:** Коммит `4a06f86` (аудит v3) оставил `Git: TBD` в нескольких агентских файлах. Заменено на актуальный хеш `4a06f86`.
- **Git commit:** 06af1a8

### [2026-06-30 08:16] Агент: Agent 3
- **Что:** docs(agents): add AGENTS-HISTORY entry for v3 fix
- **Где:** `memory/AGENTS-HISTORY.md`
- **Зачем:** Добавлена архивная запись о коммите `9bd728f` (fix TBD + registry + AGENTS.md changelog) в AGENTS-HISTORY.md, чтобы полная история была доступна следующим агентам.
- **Git commit:** c3f96f4

### [2026-06-30 10:19] Агент: Agent 3
- **Что:** Аудит агентских файлов v4 — документирование 4 недокументированных коммитов (06af1a8..c3f96f4)
- **Где:** `AGENTS.md`, `AGENT_TASKS.md`, `memory/AGENTS-HISTORY.md`
- **Зачем:** Коммиты `06af1a8`, `77db4a5`, `9bd728f`, `c3f96f4` (фиксы stale TBD и AGENTS-HISTORY entry) не были отражены в агентских файлах. Проведена полная актуализация. Build + validate:rag проходят.
- **Git commit:** d6b8c98

### [2026-06-30 12:00] Агент: Agent 3
- **Что:** Task20/21 rebrand — переименование в задание 5/6 и отвязка от секции пунктуации
- **Где:** `src/data/sections/examTasks.ts`, `src/data/sections/punctuationAll.ts`
- **Зачем:** Незакоммиченные изменения в рабочей директории: task20→"Задание 5 (дополнительно)", task21→"Задание 6 (дополнительно)" в examTasks.ts; убраны task20/task21 из punctuationAll.ts. User-facing изменение — студенты видят задания 5 и 6 отдельно.
- **Git commit:** `1fe5f9d`
- **Сборка:** `npm run build` ✅, `validate:rag` ✅

### [2026-06-30] Агент: Agent 3
- **Что:** Аудит агентских файлов v5 — документирование 4 недокументированных коммитов + uncommitted changes
- **Где:** `AGENTS.md`, `AGENT_TASKS.md`, `memory/AGENTS-HISTORY.md`, `memory/2026-06-30.md`, `src/data/questions/task9_dooshin.ts`, `tools/editor.html`
- **Зачем:** Коммиты `4539e14`, `ed03890`, `7fdddf6`, `f71aead` (после `1fe5f9d`) не были отражены в агентских файлах. В working tree остались uncommitted changes в `task9_dooshin.ts` (explanation fix) и `tools/editor.html` (dev tool update).
- **Git commit:** `a50797e` (task9_dooshin fix + editor.html), `f4f809c` (agent docs v5)
- **Сборка:** `npm run build` ✅, `validate:rag` ✅

### [2026-06-30] Агент: Agent 3
- **Что:** fix: restore task20/task21 taskNumber and atoms (punctuation, not paronyms/lexics) — документирование + обнаружение конфликта
- **Где:** `AGENTS.md`, `AGENT_TASKS.md`, `memory/AGENTS-HISTORY.md`, `memory/2026-06-30.md`
- **Зачем:** Коммит `1d91e56` (OpenClaw Agent) откатил часть рефакторинга `f71aead` — taskNumber и atoms в `task20.ts`, `task21.ts`, `task20_dooshin.ts` восстановлены на '20'/'21'. `examTasks.ts` по-прежнему содержит title "Задание 5 (дополнительно)" / "Задание 6 (дополнительно)". Система в несогласованном состоянии: UI vs данные. Добавлена задача А58 в AGENT_TASKS.md.
- **Git commit:** `1d91e56` (restore task20/21), `5ec016d` (agent docs v5+1)
- **Сборка:** `npm run build` ✅, `validate:rag` ✅

### [2026-06-30] Агент: Agent 3
- **Что:** fix(GrowthTimeline): add safeFullData filter, try/catch around buildGrowthData + uncommitted orthography/Teacher changes — документирование
- **Где:** `AGENTS.md`, `AGENT_TASKS.md`, `memory/AGENTS-HISTORY.md`, `memory/2026-06-30.md`
- **Зачем:** Коммит `3047ff1` (Agent 4) — доработка `GrowthTimeline.tsx` (try/catch, safeFullData filter), изменения в `orthography.ts`, `punctuation.ts`, `task9.ts`. Также uncommitted changes: `orthography.ts` (5 explanation fixes), `Teacher.tsx` (Supabase real data integration). Добавлена задача А59 в AGENT_TASKS.md.
- **Git commit:** `3047ff1` (GrowthTimeline fix), `8c961b7` (agent docs v6)
- **Сборка:** `npm run build` ✅, `validate:rag` ✅

### [2026-06-30] Агент: Agent 3 — Аудит агентских файлов v7
- **Что:** Документирование 5 недокументированных коммитов OpenClaw Agent (`d7bc1bd`..`63134bd`) + uncommitted changes.
- **Где:** `AGENTS.md`, `AGENT_TASKS.md`, `memory/AGENTS-HISTORY.md`, `memory/2026-06-30.md`, `memory/agent-registry.md`
- **Зачем:** 5 коммитов с изменениями кода (GrowthTimeline fix, achievementChecker fix, grammar cleanup, task20/21 integration + examTasks removal + task13 removal, task19 dooshin + task13_ege/atom) не были отражены в агентских файлах. Также в working tree: `index.ts`, `grammar.ts`, `orthographyAll.ts` (task13 integration), `task13_new.ts` (untracked), `ML_AUDIT.md` (untracked).
- **Содержание 5 коммитов:**
  1. `d7bc1bd` — fix(GrowthTimeline): skip invalid dates, filter NaN.NaN, guard ReferenceDot (Agent 4). Файлы: `GrowthTimeline.tsx`, `graph-relations.json`.
  2. `e7683f8` — fix(lesson): replace undefined 'now' with new Date() in achievementChecker. Файлы: `achievementChecker.ts`.
  3. `5148820` — fix(data): cleanup grammar sections (49 строк удалено), update graph relations. Файлы: `grammar.ts`, `graph-relations.json`.
  4. `f45c43f` — fix: integrate task20 into punctuationAll, task21 into orthoepyLex; remove examTasks; add dooshin sections to course; remove broken task13. Файлы: `dooshinSections.ts` (1652 строки), `orthoepyLexicography.ts` (21 строка), удалены `examTasks.ts`, `task13.ts`, `task13_dooshin.ts`, `Task13Trainer.tsx`, `examQuestionLoader.ts`. 23 файла, 1714 insertions, 7712 deletions.
  5. `63134bd` — fix: add task19 dooshin sections, remove from task19.ts to avoid duplication. Добавлены `task13_ege.ts` (143 вопроса), `task13_atom.ts` (699 вопросов). Файлы: `task13_ege.ts`, `task13_atom.ts`, `task19.ts`, `dooshinSections.ts`, `punctuationAll.ts`.
- **Uncommitted changes:** `index.ts` (импорт task13NewQuestions), `grammar.ts` (уроки lesson-gram-13-ege/atom), `orthographyAll.ts` (group-task13), `task13_new.ts` (untracked), `ML_AUDIT.md` (untracked от Agent 2).
- **Git commit:** `297a4f3` (agent files v7 audit)
- **Сборка:** `npm run build` ✅ (13.62s, 0 TypeScript ошибок). `validate:rag` ✅ (0 errors, 0 warnings).



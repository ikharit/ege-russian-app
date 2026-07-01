# Агентский реестр — Быстрый доступ (live dashboard)

> ⚠️ **Этот файл — только «живая» сводка: статусы и ключевые файлы.**  
> **Полные правила, журнал изменений и архив:** `AGENTS.md` в корне проекта.  
> **Полная история всех записей:** `memory/AGENTS-HISTORY.md`

---

## 📊 Статусы модулей (live)

| Модуль | Статус | Последний агент | Примечание |
|--------|--------|-----------------|------------|
| Dashboard | 🟢 | main | NotificationWidget + DeadlineWidget + ProfileSwitcher |
| Lesson / Уроки | 🟢 | agent-6 | Auto-complete, combo, звуки, confetti. **Agent 6 (2026-06-28):** убрано перемешивание options для ege-multiple — вопросы ЕГЭ теперь показывают варианты в правильном порядке (1, 2, 3, 4, 5). Раньше correctAnswer содержал номера вариантов, а перемешивание ломало ответы. |
| Leaderboard | 🟢 | main | 3 режима: XP, streak, homework |
| Statistics | 🟢 | main | Упрощён: только Прогресс и Темы |
| Profile | 🟢 | main | Статусы за лидерство, достижения |
| /mistakes (WeakSpots) | 🟢 | main | 3 вкладки: ошибки, задания, атомы |
| CourseMap | 🟢 | main | Звёзды прогресса под нодами |
| AccentTrainer | 🟢 | main | Ударения (задание 4) |
| Task10Trainer | 🟢 | main | Слова с НЕ/НИ (задание 10) |
| Task16Trainer | 🟢 | main | Убран из UI, задание 16 в `punctuation.ts` |
| Task5Trainer | 🟢 | main | **82 вопроса** — покрывает паронимический словник ФИПИ 2026 |
| Dooshin | 🟢 | agent-6 | Объединён в 1 раздел с группами (dooshinUnified.ts). Добавлены задания 15 (61 вопрос) и 20 (150 вопросов, placeholder). **Task 9: mass fix 127 explanations (2026-06-27)** — стандартизированы чередующиеся корни. **Round 2 (2026-06-28):** ~40 дополнительных исправлений — проверочные слова, классификации корней, answers, опечатки. Добавлено 10 EGE-формат вопросов. **Agent 6 (2026-06-28):** добавлено примечание "Всегда ПЛАВ, кроме: ПЛОВЕЦ, ПЛОВЧИХА, ПЛЫВУН" ко всем объяснениям с корнем плав/плов. Исправлено ложное чередование "плот/плат" → два проверяемых корня (плот/плат). Добавлены 5 вопросов по приставкам прО-/прА-. |
| Atomization | 🟢 | main | `lesson-atom-10-ege` — 10 вопросов в формате ЕГЭ (ege-multiple) по приставкам прЕ-/прА-, дО-/дА-, вО-/вА-, нА-/нО- и др. (2026-06-28). |
| Friend system | 🟢 | agent-6 | `friendStore.ts` + `FriendsPage.tsx` — добавление/удаление друзей, поиск, заявки, рейтинг. Supabase + local fallback. **Agent 6 (2026-06-28):** исправлены синтаксические ошибки в friendStore.ts (дублированный код, отсутствующие закрывающие скобки) — билд ломался. |
| Teacher Analytics | 🟢 | main | `TeacherAnalytics.tsx` + `teacherAnalyticsStore.ts` — расширенная аналитика: метрики, графики, тренды. |
| PWA Update Toast | 🟢 | main | `PWAUpdateToast.tsx` — toast при обновлении Service Worker, auto-reload. |
| AdaptivePractice | 🟢 | main | Тренировка слабых атомов |
| MiniGames | 🟡 | — | TODO: связать с accent trainer store |
| Theory (теория) | 🔵 | — | Тесты, рендерер, XP. Ждёт скрапинга оставшихся заданий |
| Homework data | 🟢 | main | Google Sheets: 9 реальных учеников |
| ShareResultPage | 🟢 | main | /share — карточка результата |
| NotificationStore | 🟢 | main | Push-уведомления, streak reminders |
| AnalyticsPage | 🟢 | main | Аналитика класса |
| StudentStore | 🟢 | main | Multi-user профили, регистрация |

### 🎨 Цветовая кодировка

| Статус | Значение |
|--------|----------|
| 🟢 **СТАБИЛЬНО** | Готов, не трогай без согласования |
| 🟡 **В РАБОТЕ** | Кто-то правит, проверь реестр |
| 🔴 **НЕ ТРОГАТЬ** | Критичный файл, изменения — через согласование |
| 🔵 **В РАЗРАБОТКЕ** | Новый модуль, можно дополнять |

---

## 🔗 Ключевые файлы (live)

- **Главный стор:** `src/stores/progressStore.ts`
- **Роутинг:** `src/App.tsx`
- **Типы:** `src/types/index.ts`
- **Данные курса:** `src/data/courseData.ts`
- **Домашки:** `src/data/gsheets/homeworkData.ts`
- **Теория:** `src/data/theory/`, `src/data/theoryTests.ts`, `src/components/TheoryViewer.tsx`
- **Атомы:** `src/data/atomization/atoms.ts`
- **Реестр заданий:** `TASK_REGISTRY.md` (инструкция), `task_registry.json` (3,242 вопроса), `Реестр_заданий_9-12_ЕГЭ_Русский.xlsx` (ручная проверка), `Реестр_заданий_13-20_ЕГЭ_Русский.xlsx` (ручная проверка 13-20)
  - **Кодификатор ФИПИ:** `src/data/fipiCodificator.ts` — единый источник истины: номер задания → формат → темы → статус. ВСЕ задания в проекте ДОЛЖНЫ соответствовать этому файлу.
- **Скрипт верификации 15 (Н/НН):** `scripts/verify_n_nn.py` — проверка Н/НН в dooshin15.ts
- **Скрипт верификации 9-20 (все задания):** `scripts/verify_tasks.py` — проверка всех заданий 9-20 (3,355 вопросов, 0 ошибок)
- **Уведомления:** `src/stores/notificationStore.ts`
- **Аналитика:** `src/pages/AnalyticsPage.tsx`
- **Ученики:** `src/stores/studentStore.ts`
- **Регистрация:** `src/components/StudentRegistrationModal.tsx`
- **Переключение:** `src/components/ProfileSwitcher.tsx`
- **Deploy / Auth**: `vite.config.ts` (base path — `/ege-russian-app/` для GitHub Pages), `src/lib/supabase.ts` (OAuth redirect → `/`), `.github/workflows/pages.yml` (GitHub Pages — `actions/deploy-pages@v4`), `.github/workflows/cloudflare-pages.yml` (Cloudflare Pages — `wrangler-action@v3`)
- **Shkolkovo (Дощинский-2026)**: `src/data/sections/shkolkovo/` — задание 15 (Н/НН), ~150 вопросов в ege-multiple формате с пояснениями
- **Atomization (EGE)**: `src/data/sections/atomization.ts` — `lesson-atom-10-ege` (10 ege-multiple вопросов по приставкам)

---

## 🆘 Быстрые правила

1. **Перед правкой** — открой `AGENTS.md` в корне, прочитай последние 10 записей журнала.
2. **После правки** — добавь запись **только в `AGENTS.md`** (не сюда).
3. **Не уверен** — `git log --oneline -10`, `git diff`, backup, потом спроси.
4. **Git commit обязателен** после каждой сессии.

---

*Этот файл — live dashboard. Не дублируй сюда историю. Всё остальное — в `AGENTS.md`.*

---

*Last updated: 2026-06-30*
*Current Agent: Agent 3*
*Recent changes: CourseMap fix (8d4d1c1 — remove layout=position, add stopPropagation). Lesson fixes (f68b80a — hook order; ce3d116 — restore questions useMemo + rawQuestion). Build: clean, 0 TS errors. validate:rag: 1350 entries, 0 errors.*

*This file was updated by Agent 3.*


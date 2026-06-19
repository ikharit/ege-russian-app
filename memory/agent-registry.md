# Агентский реестр — Быстрый доступ (live dashboard)

> ⚠️ **Этот файл — только «живая» сводка: статусы и ключевые файлы.**  
> **Полные правила, журнал изменений и архив:** `AGENTS.md` в корне проекта.  
> **Полная история всех записей:** `memory/AGENTS-HISTORY.md`

---

## 📊 Статусы модулей (live)

| Модуль | Статус | Последний агент | Примечание |
|--------|--------|-----------------|------------|
| Dashboard | 🟢 | main | NotificationWidget + DeadlineWidget + ProfileSwitcher |
| Lesson / Уроки | 🟢 | main | Auto-complete, combo, звуки, confetti |
| Leaderboard | 🟢 | main | 3 режима: XP, streak, homework |
| Statistics | 🟢 | main | Упрощён: только Прогресс и Темы |
| Profile | 🟢 | main | Статусы за лидерство, достижения |
| /mistakes (WeakSpots) | 🟢 | main | 3 вкладки: ошибки, задания, атомы |
| CourseMap | 🟢 | main | Звёзды прогресса под нодами |
| AccentTrainer | 🟢 | main | Ударения (задание 4) |
| Task10Trainer | 🟢 | main | Слова с НЕ/НИ (задание 10) |
| Task16Trainer | 🟢 | main | Убран из UI, задание 16 в `punctuation.ts` |
| Task5Trainer | 🟢 | main | **82 вопроса** — покрывает паронимический словник ФИПИ 2026 |
| Dooshin | 🟢 | main | Объединён в 1 раздел с группами (dooshinUnified.ts). Добавлено задание 15 (dooshin15.ts, 61 вопрос) |
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
- **Скрипт верификации 15 (Н/НН):** `scripts/verify_n_nn.py` — проверка Н/НН в dooshin15.ts
- **Скрипт верификации 9-20 (все задания):** `scripts/verify_tasks.py` — проверка всех заданий 9-20 (3,355 вопросов, 0 ошибок)
- **Уведомления:** `src/stores/notificationStore.ts`
- **Аналитика:** `src/pages/AnalyticsPage.tsx`
- **Ученики:** `src/stores/studentStore.ts`
- **Регистрация:** `src/components/StudentRegistrationModal.tsx`
- **Переключение:** `src/components/ProfileSwitcher.tsx`

---

## 🆘 Быстрые правила

1. **Перед правкой** — открой `AGENTS.md` в корне, прочитай последние 10 записей журнала.
2. **После правки** — добавь запись **только в `AGENTS.md`** (не сюда).
3. **Не уверен** — `git log --oneline -10`, `git diff`, backup, потом спроси.
4. **Git commit обязателен** после каждой сессии.

---

*Этот файл — live dashboard. Не дублируй сюда историю. Всё остальное — в `AGENTS.md`.*

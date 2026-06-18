# 🏛️ Агентский реестр — центральный журнал изменений

> **Каждый агент ДОЛЖЕН прочитать этот файл перед началом работы.**
> 
> После любых изменений в проекте — запиши сюда: что, где, зачем.

---

## 📋 Правила для всех агентов

1. **Перед правкой** — прочитай последние 10 записей в этом файле
2. **После правки** — добавь запись в формате ниже
3. **Не удаляй и не перезаписывай** чужие записи
4. **Если сомневаешься** — спроси, не перезаписывай
5. **Git commit обязателен** после каждой сессии работы

---

## 📝 Формат записи

```
### [YYYY-MM-DD HH:MM] Агент: <имя/роль>
- **Что:** <краткое описание изменений>
- **Где:** <пути файлов>
- **Зачем:** <причина / контекст>
- **Git commit:** <хеш, если есть>
- **⚠️ Важно:** <предупреждения для других агентов>
```

---

## 📁 Структура проекта (актуальная)

```
ege-russian-app/
├── src/
│   ├── pages/           # Страницы (Dashboard, Lesson, Leaderboard, ...)
│   ├── components/      # Компоненты (QuestionCard, Hearts, ...)
│   ├── stores/          # Zustand stores (progressStore, accentTrainerStore, ...)
│   ├── data/            # Данные курса, теории, вопросов
│   │   ├── sections/    # Разделы курса (grammar, orthography, ...)
│   │   ├── gsheets/     # Данные из Google Sheets (homeworkData.ts + students/)
│   │   ├── atomization/ # Атомы (микро-навыки)
│   │   └── theory/      # ⭐ ТЕОРИЯ — сюда складываем всё новое
│   ├── lib/             # Утилиты (sounds.ts, theoryMapper.ts, ...)
│   └── types/           # TypeScript interfaces
├── memory/              # 🧠 Память агентов (agent-registry.md, daily logs)
└── AGENTS.md            # 📘 Этот файл
```

---

## 🎨 Цветовая кодировка статусов

| Статус | Значение |
|--------|----------|
| 🟢 **СТАБИЛЬНО** | Файл/модуль готов, не трогай без согласования |
| 🟡 **В РАБОТЕ** | Кто-то сейчас правит, проверь реестр |
| 🔴 **НЕ ТРОГАТЬ** | Критичный файл, любые изменения — через согласование |
| 🔵 **В РАЗРАБОТКЕ** | Новый модуль, можно дополнять |

---

## 📊 Статус модулей (обновляется агентами)

| Модуль | Статус | Последний агент | Примечание |
|--------|--------|-----------------|------------|
| Dashboard | 🟢 | main | Карточка «Стоит подтянуть» ведёт в /mistakes |
| Lesson / Уроки | 🟢 | main | Auto-complete, combo toasts, звуки |
| Leaderboard | 🟢 | main | 3 режима: XP, streak, homework |
| Statistics | 🟢 | main | Упрощён: только Прогресс и Темы |
| Profile | 🟢 | main | Статусы за лидерство, достижения |
| /mistakes (WeakSpots) | 🟢 | main | 3 вкладки: ошибки, задания, атомы |
| CourseMap | 🟢 | main | Звёзды прогресса под нодами |
| AccentTrainer | 🟢 | main | Ударения (задание 4) |
| Task10Trainer | 🟢 | main | Слова с НЕ/НИ (задание 10) |
| **Task16Trainer** | **🔵** | **main** | **Пунктуация (задание 16), новый модуль** |
| **Task5Trainer** | **🔵** | **main** | **Типографика (задание 5), новый модуль** |
| AdaptivePractice | 🟢 | main | Тренировка слабых атомов |
| MiniGames | 🟡 | — | TODO: связать с accent trainer store |
| Theory (теория) | 🔵 | — | Ждёт скрапинга из грамота.ру |
| Homework data | 🟢 | main | Google Sheets: 9 реальных учеников |
| ShareResultPage | 🟢 | main | /share — карточка результата |

---

## 🗂️ Журнал изменений (новые сверху)

### [2026-06-19 00:20] Агент: main
- **Что:** База теории — task11, task12, task14
- **Где:** src/data/theory/task11.ts, 	ask12.ts, 	ask14.ts
- **Зачем:** Скрапинг теории из umschool.net, maximumtest.ru, ФИПИ Навигатор
- **Git commit:** 14aa518
- **⚠️ Важно:** Пополнено 3 задания из 11. Остались: task5, 6, 7, 8, 13, 15, 16, 17-21, 22-26.

### [2026-06-18 23:00] Агент: main
- **Что:** Task16Trainer — тренажёр задания 16 (пунктуация)
- **Где:** `src/pages/Task16Trainer.tsx`, `src/data/task16Questions.ts`, `src/stores/task16Store.ts`, `src/App.tsx`, `src/pages/Dashboard.tsx`
- **Зачем:** Новый тренажёр задания ЕГЭ №16 — запятые в сложных предложениях, вводных словах, придаточных
- **Git commit:** —
- **⚠️ Важно:** 20 вопросов по темам: придаточные времени/причины/цели/уступки/изъяснительные, вводные слова, однородные члены. Паттерн повторён от Task5Trainer.
- **Где:** `src/components/Header.tsx`
- **Зачем:** Замена flip-rotate 360° на лёгкий покач (-2°→+1°→-1°), уменьшение sparkles до 1px и 0.5px
- **Git commit:** `da84a9d`
- **⚠️ Важно:** Совмещено с коммитом Task5Trainer (см. ниже)

### [2026-06-18 22:44] Агент: main
- **Что:** Task5Trainer — тренажёр задания 5 (типографика)
- **Где:** `src/pages/Task5Trainer.tsx`, `src/data/task5Questions.ts`, `src/stores/task5Store.ts`, `src/App.tsx`, `src/pages/Dashboard.tsx`, `src/data/theoryTests.ts`
- **Зачем:** Новый тренажёр для задания ЕГЭ (типографика/пунктуация)
- **Git commit:** `da84a9d`
- **⚠️ Важно:** Новый модуль — добавлен роут `/task5-trainer`, стор, данные вопросов. Dashboard обновлён для подсчёта изученных уроков.

### [2026-06-18 23:55] Агент: main
- **Что:** Streak freeze + звёзды на карте курса
- **Где:** `src/stores/progressStore.ts`, `src/pages/CourseMap.tsx`, `src/types/index.ts`
- **Зачем:** Бесплатная заморозка streak раз в 7 дней; визуализация 1-3 звёзд по урокам
- **Git commit:** `f234b15`
- **⚠️ Важно:** UserStats расширен полями `streakFrozen`, `streakFreezeUsed`, `streakFreezeLastReset`

### [2026-06-18 23:20] Агент: main
- **Что:** Исправлен роутинг заданий (4→accent, 9→корни, 10→task10)
- **Где:** `src/pages/WeakSpots.tsx`, `src/stores/progressStore.ts`
- **Зачем:** Задание 9 ошибочно вело в accent-trainer вместо урока про корни
- **Git commit:** `a67d7dc`
- **⚠️ Важно:** `getProblematicTasks` теперь фильтрует `wrong > 0 && accuracy < 95`

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

---

## 🔗 Ключевые файлы (быстрый доступ)

- **Главный стор:** `src/stores/progressStore.ts` — ВСЕ данные пользователя
- **Роутинг:** `src/App.tsx` — все Route
- **Типы:** `src/types/index.ts` — UserStats, LessonProgress, WrongAnswer
- **Данные курса:** `src/data/courseData.ts` — секции и уроки
- **Домашки:** `src/data/gsheets/homeworkData.ts` — 9 реальных учеников
- **Теория:** `src/data/theory/` — структура для новых заданий, `src/data/theoryTests.ts` — тесты по пониманию, `src/components/TheoryViewer.tsx` — рендерер с дедупликацией
- **Атомы:** `src/data/atomization/atoms.ts` — микро-навыки

---

## 🆘 Что делать, если не уверен

1. Прочитай этот файл и `memory/agent-registry.md`
2. Сделай `git log --oneline -10` — увидишь, что менялось
3. Сделай `git diff` — увидишь текущие незакоммиченные изменения
4. **Не перезаписывай файлы сразу** — если не уверен, спроси или сделай backup

### [2026-06-18 23:45] Агент: main (task10 + task5)
- **Что:** Task10Trainer: убраны звёзды, заменены на статусы (new/deferred/passed). Исправлены орфографические ошибки в вопросах (q1, q3, q6). Task5Trainer: новый тренажёр по паронимам (задание 5).
- **Где:** `src/stores/task10Store.ts`, `src/pages/Task10Trainer.tsx`, `src/data/task10Questions.ts`, `src/pages/Dashboard.tsx`, `src/data/task5Questions.ts`, `src/stores/task5Store.ts`, `src/pages/Task5Trainer.tsx`, `src/App.tsx`
- **Зачем:** Убрана система 5 звёзд — повторение только при ошибке, в конце сессии. Исправлены слова: разфасовать→расфасовать, возьметь→возьмёшь, обгрохать→обгрызть, прязык→признак, бесприкрас→преславный. Новый тренажёр №5 с 12 вопросами по паронимам ФИПИ.
- **Git commit:** `3035726` (task10 статусы), `149da4e` (task10 исправления), `f55ec35` (task5 тренажёр)
- **⚠️ Важно:** Task10Trainer persist key изменён на `task10-trainer-v2`. Task5Trainer — новый модуль, persist key `task5-trainer-v1`.

### [2026-06-18 23:00] Агент: main
- **Что:** Task16Trainer — тренажёр задания 16 (пунктуация)
- **Где:** `src/pages/Task16Trainer.tsx`, `src/data/task16Questions.ts`, `src/stores/task16Store.ts`, `src/App.tsx`, `src/pages/Dashboard.tsx`
- **Зачем:** Новый тренажёр задания ЕГЭ №16 — запятые в сложных предложениях, вводных словах, придаточных
- **Git commit:** —
- **⚠️ Важно:** 20 вопросов по темам: придаточные времени/причины/цели/уступки/изъяснительные, вводные слова, однородные члены. Паттерн повторён от Task5Trainer.

### [2026-06-19 00:30] Агент: main (теория + тесты)
- **Что:** Рендерер теории с дедупликацией артефактов, тесты по пониманию (7 вопросов × 16 уроков), цветные статусы в списке, XP за тесты
- **Где:** `src/components/TheoryViewer.tsx`, `src/components/TheoryTest.tsx`, `src/data/theoryTests.ts`, `src/pages/TheoryPage.tsx`, `src/stores/progressStore.ts`, `src/App.tsx`
- **Зачем:** Удаление интерактивных артефактов из theoryData.ts; проверка понимания теории; мотивация через XP и статусы
- **Git commit:** `904d957` (включено в `feat: theory database structure`)
- **⚠️ Важно:** `TheoryViewer` использует `skipUntilEmptyLine` + `Set` дедупликацию для скрытия тестовых блоков. Тесты хранятся в `progressStore.theoryTestsCompleted`. Задания 8 и 27 (Сочинение) тоже покрыты тестами.

### [2026-06-19 00:45] Агент: main (Backend/Auth/Sync план)
- **Что:** Планирование: Auth (email/Google), Firestore sync прогресса, автосинхронизация
- **Где:** `src/lib/supabase.ts`, `src/stores/progressStore.ts`, `src/App.tsx`, `src/components/AuthModal.tsx` (новый)
- **Зачем:** Пользователь просит добавить аутентификацию и синхронизацию прогресса в облако. Текущий `syncProgress` неполный — не синхронизирует `theoryTestsCompleted`, `atomProgress`, `wrongAnswers`, `taskStats`, `dailyQuestProgress`.
- **Git commit:** — (планирование)
- **⚠️ Важно:** `syncProgress` сейчас сохраняет только `userStats` + `lessonProgress` + `achievements`. Нужно расширить до полного состояния. Также нужен UI для входа/регистрации.

---

*Последнее обновление: 2026-06-19 00:45*

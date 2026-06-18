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
| AdaptivePractice | 🟢 | main | Тренировка слабых атомов |
| MiniGames | 🟡 | — | TODO: связать с accent trainer store |
| Theory (теория) | 🔵 | — | Ждёт скрапинга из грамота.ру |
| Homework data | 🟢 | main | Google Sheets: 9 реальных учеников |
| ShareResultPage | 🟢 | main | /share — карточка результата |

---

## 🗂️ Журнал изменений (новые сверху)

### [2026-06-19 00:11] Агент: main
- **Что:** Создан агентский реестр (AGENTS.md + memory/agent-registry.md)
- **Где:** `AGENTS.md`, `memory/agent-registry.md`
- **Зачем:** 5 агентов работают над проектом, нужна координация
- **Git commit:** —
- **⚠️ Важно:** Все агенты ДОЛЖНЫ читать этот файл перед работой. Записывайте изменения в оба файла.

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
- **Теория (пусто):** `src/data/theory/` — ⭐ СЮДА складывать новую теорию
- **Атомы:** `src/data/atomization/atoms.ts` — микро-навыки

---

## 🆘 Что делать, если не уверен

1. Прочитай этот файл и `memory/agent-registry.md`
2. Сделай `git log --oneline -10` — увидишь, что менялось
3. Сделай `git diff` — увидишь текущие незакоммиченные изменения
4. **Не перезаписывай файлы сразу** — если не уверен, спроси или сделай backup

---

*Последнее обновление: 2026-06-19 00:11*

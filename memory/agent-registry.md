# Агентский реестр — быстрый доступ

> **Дубликат `AGENTS.md` в корне проекта. Читайте ОБА файла.**

## Правила
1. Перед работой — прочитай последние 10 записей
2. После работы — добавь запись в ОБА файла
3. Не удаляй чужие записи
4. Git commit обязателен

## Статус модулей

| Модуль | Статус | Последний агент | Примечание |
|--------|--------|-----------------|------------|
| Dashboard | 🟢 | main | NotificationWidget + DeadlineWidget + ProfileSwitcher |
| Lesson | 🟢 | main | Auto-complete, combo, звуки, confetti |
| Leaderboard | 🟢 | main | 3 режима: XP, streak, homework |
| Statistics | 🟢 | main | Упрощён: Прогресс + Темы |
| Profile | 🟢 | main | Статусы за лидерство, достижения |
| /mistakes (WeakSpots) | 🟢 | main | 3 вкладки: ошибки, задания, атомы |
| CourseMap | 🟢 | main | Звёзды под нодами (1-3⭐) |
| AccentTrainer | 🟢 | main | Ударения (задание 4) |
| Task10Trainer | 🟢 | main | НЕ/НИ (задание 10) |
| **Task16Trainer** | **🔵** | **main** | **Пунктуация (задание 16), новый модуль** |
| **Task5Trainer** | **🔵** | **main** | **Типографика (задание 5), новый модуль** |
| AdaptivePractice | 🟢 | main | Тренировка слабых атомов |
| MiniGames | 🟡 | — | TODO: связать с accent store |
| **Theory (теория)** | 🟢 | **main** | Тесты, рендерер, XP, статусы в списке |
| Homework data | 🟢 | main | 9 учеников из Google Sheets |
| ShareResultPage | 🟢 | main | /share — карточка результата |
| **NotificationStore** | **🔵** | **main** | **Push-уведомления, streak reminders, дедлайны** |
| **AnalyticsPage** | **🔵** | **main** | **Аналитика класса: слабые задания, ученики, дедлайны** |
| **StudentStore** | **🔵** | **main** | **Multi-user профили, динамика, регистрация учеников** |

## Журнал изменений (новые сверху)

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

### [2026-06-19 00:20] Агент: main
- **Что:** База теории — task11, task12, task14
- **Где:** src/data/theory/task11.ts, 	ask12.ts, 	ask14.ts
- **Зачем:** Скрапинг теории из umschool.net, maximumtest.ru, ФИПИ Навигатор
- **Git commit:** 14aa518
- **⚠️ Важно:** Пополнено 3 задания из 11. Остались: task5, 6, 7, 8, 13, 15, 16, 17-21, 22-26.

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
- **Что:** Header XP анимация: микро-rotate + микро-искры
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

## Ключевые файлы

- **Главный стор:** `src/stores/progressStore.ts`
- **Роутинг:** `src/App.tsx`
- **Типы:** `src/types/index.ts`
- **Данные курса:** `src/data/courseData.ts`
- **Домашки:** `src/data/gsheets/homeworkData.ts`
- **Теория:** `src/data/theory/` — структура для новых заданий, `src/data/theoryTests.ts` — тесты по пониманию, `src/components/TheoryViewer.tsx` — рендерер
- **Атомы:** `src/data/atomization/atoms.ts`
- **Уведомления:** `src/stores/notificationStore.ts`
- **Аналитика:** `src/pages/AnalyticsPage.tsx`
- **Ученики:** `src/stores/studentStore.ts` — multi-user профили, динамика
- **Регистрация:** `src/components/StudentRegistrationModal.tsx`
- **Переключение:** `src/components/ProfileSwitcher.tsx`

## Что делать, если не уверен

1. Прочитай этот файл и `AGENTS.md`
2. `git log --oneline -10`
3. `git diff` — увидишь незакоммиченные изменения
4. Сделай backup (`git commit -m "backup: ..."`) перед масштабными правками
5. Не перезаписывай — спроси или запиши в реестр

---

### [2026-06-19 XX:XX] Агент: main (Валидация Dooshin 10-12)
- **Что:** Проверены и исправлены задания 10-12 из Дощинского. 99 батчей проверено субагентами, 1,106 ошибок исправлено из 1,947 заданий (56.8% ошибок). Сгенерирован новый `dooshin.ts` с исправленными ответами.
- **Где:** `src/data/sections/dooshin.ts` (перегенерирован), `batches_10_12/*` (валидированные батчи), `dooshin_all_tasks_fixed_10_12.json` (исправленный JSON)
- **Зачем:** Задания из Дощинского содержали массовые ошибки (67% в задании 10, 61% в задании 11, 39% в задании 12). Все ответы проверены и исправлены.
- **Git commit:** `fix/dooshin-10-12-validation`
- **⚠️ Важно:** Сборка проходит (`npm run build` OK). Все 2,717 заданий в `dooshin.ts` обновлены с правильными ответами. Task 9 использует ранее исправленный JSON.

### [2026-06-19 16:59] Агент: main (Excel-реестр всех заданий 9-12)
- **Что:** Создан Excel-файл со всеми заданиями 9-12 из всего проекта (основной курс + Дощинский). 3,242 вопроса: 489 из grammar.ts, 36 из orthography.ts, 2,717 из dooshin.ts. В реестре колонки для ручной проверки: пропущенная буква, правильный ответ, варианты, правило, проверочное слово, комментарий.
- **Где:** `Реестр_заданий_9-12_ЕГЭ_Русский.xlsx` (в корне workspace)
- **Зачем:** Пользователь обнаружил ошибки в заданиях из основного курса (не только Дощинского). Создан единый реестр для совместной проверки и правки всей командой агентов.
- **Git commit:** — (Excel не в репозитории, лежит в workspace)
- **⚠️ Важно:** В `grammar.ts` `lesson-gram-12-2` есть вопрос `q12-16` "построен.." с вариантами `построен/построенн` — формат вопроса кривой. Все агенты должны проверять задания через этот Excel перед внесением изменений.

---

*Последнее обновление: 2026-06-19 16:59*

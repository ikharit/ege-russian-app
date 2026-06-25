# Техзадание для агента-исполнителя

> **Контекст**: React-приложение на Vite для подготовки к ЕГЭ по русскому языку. Стек: React 18 + TypeScript + Tailwind CSS + Zustand + Framer Motion + React Router (HashRouter). Данные хранятся в `localStorage` (Zustand persist). Supabase подключён, но необязателен.
>
> **Рабочая папка**: `src/` внутри проекта. Все пути относительно `src/`.

---

## 🚨 P0 — Баги (исправить в первую очередь)

---

### ✅ БАГ-1: При потере всех сердечек урок мгновенно заканчивается и показывает результат

**Статус:** ✅ Исправлено (2026-06-19)

**Где**: `src/pages/Lesson.tsx` (строки 33, 109-112, 228-245)

**Решение**: Добавлено состояние `gameOverReason: 'hearts' | 'completed' | null`. При `!hasHeart` устанавливается `gameOverReason = 'hearts'`, и рендерится отдельный экран с заголовком «Сердечки закончились! 💔», кнопками «Повторить» и «Вернуться к курсу». При прохождении до конца — `gameOverReason = 'completed'` и показывается `<LessonResult>`.

**Код фикса**: См. `src/pages/Lesson.tsx`, строки 33 (`useState`), 109-112 (`setGameOverReason('hearts')`), 228-245 (JSX экрана).

---

### ✅ БАГ-2: Соединительные линии между уроками на карте курса не отображаются

**Статус:** ✅ Исправлено (2026-06-20)

**Где**: `src/pages/CourseMap.tsx` (строка ~186)

**Решение**: Убран конфликтующий `style={{ position: 'relative' }}` (override'ил `absolute` в className). Родитель `<div className="flex items-center gap-4 relative">` уже имеет `relative`. Линия позиционирована как `absolute left-6 top-12 h-9 w-0.5 bg-gray-200` — точно соединяет центр нижней границы кнопки (48px) с центром верхней границы следующей кнопки (gap 12px + 48px div + 24px центр = 84px = 48px + 36px).

**Код фикса**: `src/pages/CourseMap.tsx`, строка 186: `{!isLast && <div className="absolute left-6 top-12 h-9 w-0.5 bg-gray-200" />}`

**Как проверить**: Открыть `/course` — между уроками должны быть серые вертикальные линии, соединяющие узлы.

---

### ✅ БАГ-3: Supabase падает тихо, если `.env` не настроен

**Статус:** ✅ Исправлено (2026-06-20)

**Где**: `src/stores/progressStore.ts`, `src/lib/supabase.ts`

**Решение**: Добавлен флаг `isSupabaseConfigured` в `supabase.ts` (проверяет `supabaseUrl && supabaseKey`). В `syncProgress()` и `loadProgress()` добавлена проверка `if (!isSupabaseConfigured) return`. Если Supabase не настроен — прогресс сохраняется только в `localStorage`, без ошибок в консоли.

**Код фикса**: `src/lib/supabase.ts` — `export const isSupabaseConfigured`. `src/stores/progressStore.ts` — проверка в `syncProgress()` и `loadProgress()`.

---

### ✅ БАГ-4: Dashboard предлагает "Продолжить" уже пройденный урок

**Статус:** ✅ Исправлено (2026-06-20)

**Где**: `src/pages/Dashboard.tsx`, строки ~63-88

**Решение**: Если все уроки `completed` (`!nextLesson`), логика ищет урок с наихудшим `bestScore` для повторения (`worstLesson`). В JSX карточки добавлена проверка `allCompleted ? 'Все уроки пройдены! 🎉' : lessonProgress[nextLesson.lesson.id]?.status === 'completed' ? 'Повторить' : 'Продолжить обучение'`. Пользователь видит "Все уроки пройдены! 🎉" и "Повторить" для урока с худшим результатом.

**Код фикса**: `src/pages/Dashboard.tsx`, строки 74-88 (`worstLesson` логика) и строка 376 (`allCompleted` в JSX).

**Как проверить**: Пройти все уроки → Dashboard покажет "Все уроки пройдены! 🎉" и предложит повторить урок с наихудшим score.

---

## 🔧 P1 — Улучшения

---

### ЗАДАЧА-1: Создать страницу Profile (профиль пользователя)

**Где**: новый файл `src/pages/Profile.tsx` + изменить `src/App.tsx`

**Сейчас**: в `App.tsx` маршрут `/profile` ведёт на `<ProfilePlaceholder />` — заглушка.

**Что нужно сделать**:

1. Создать `src/pages/Profile.tsx` со следующим содержимым:
   - Заголовок "Профиль"
   - Поле "Имя" — инпут, связанный с `userStats` (сейчас имя захардкожено как "ученик" в Dashboard).
   - Статистика: XP, уровень, streak, сердечки, достижения.
   - Список достижений с иконками (использовать данные из `achievements` в `courseData.ts`).
   - Кнопка "Сбросить прогресс" — с подтверждением (`confirm()`), вызывает `localStorage.clear()` + перезагрузка страницы.
   - Кнопка "Экспорт прогресса" — скачать JSON с `lessonProgress` и `userStats`.

2. В `App.tsx` заменить `ProfilePlaceholder` на импорт `Profile`.

3. В `Dashboard.tsx` заменить захардкоженное "Привет, ученик!" на динамическое имя из `userStats.name` (добавить поле `name` в `UserStats` тип и начальное состояние).

**Типы**: добавить `name: string` в `src/types/index.ts` → `UserStats`.

---

### ЗАДАЧА-2: Добавить PWA-иконки

**Где**: папка `public/` в корне проекта (рядом с `index.html`)

**Сейчас**: `vite.config.ts` ссылается на `/icon-192.png` и `/icon-512.png`, но файлов нет.

**Что нужно сделать**:

1. Создать два простых PNG-файла (можно через placeholder-сервис или SVG→PNG):
   - `public/icon-192.png` — 192×192, зелёный фон (#58cc02), белая буква "Р" или 📚
   - `public/icon-512.png` — 512×512, то же самое

   Если нет инструментов для генерации PNG — создать SVG и положить в `public/`, а в `vite.config.ts` изменить `icons` на SVG (браузеры поддерживают SVG для PWA-иконок):

```ts
icons: [
  {
    src: '/icon.svg',
    sizes: 'any',
    type: 'image/svg+xml'
  }
]
```

2. Создать `public/icon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="64" fill="#58cc02"/>
  <text x="256" y="340" font-size="280" text-anchor="middle" fill="white" font-family="Arial">Р</text>
</svg>
```

3. Обновить `vite.config.ts`, чтобы иконки указывали на реальные файлы.

---

### ЗАДАЧА-3: Разбить `courseData.ts`

**Где**: `src/data/courseData.ts` — 1200+ строк

**Сейчас**: Всё в одном файле: типы `achievements`, константа `course` со всеми 5 секциями.

**Что нужно сделать**:

1. Создать структуру:
   ```
   src/data/
     courseData.ts       — только `export const course` (импортирует секции)
     achievements.ts     — `export const achievements`
     sections/
       orthography.ts    — sections 1-2 (задания 9, 10, 12)
       punctuation.ts    — sections 3-4 (задания 16, 17, 19, 20)
       grammar.ts        — section 5 (задания 13, 14)
   ```

2. В `courseData.ts`:
   ```tsx
   import { orthographySections } from './sections/orthography'
   import { punctuationSections } from './sections/punctuation'
   import { grammarSections } from './sections/grammar'
   import { achievements } from './achievements'
   export { achievements }
   export const course: Course = {
     id: 'ege-russian-2025',
     title: 'ЕГЭ Русский язык 2025',
     description: '...',
     sections: [...orthographySections, ...punctuationSections, ...grammarSections]
   }
   ```

3. Убедиться, что все `import { course, achievements } from '../data/courseData'` продолжают работать (экспорты должны остаться теми же).

---

### ✅ ЗАДАЧА-4: Добавить автоматическое восстановление сердечек

**Статус:** ✅ Реализовано (2026-06-19)

**Где**: `src/stores/slices/userSlice.ts` (метод `checkHeartRestore`), `src/pages/Dashboard.tsx` (вызов в `useEffect`)

**Решение**: Метод `checkHeartRestore()` проверяет `lastHeartRestore` (fallback на `lastActivityDate`), считает `Math.floor(minutesPassed / 240)` — 1 сердце каждые 4 часа, обновляет `hearts` до `min(maxHearts, hearts + restored)` и записывает новый `lastHeartRestore`. В `Dashboard.tsx` вызывается в `useEffect` при монтировании.

**Код**: `userSlice.ts` строки 39–60. `Dashboard.tsx` строки 52–54.

**Как проверить**: Уменьшить сердечки → подождать 4+ часа → открыть Dashboard → сердечки восстановятся.

---

### ✅ ЗАДАЧА-5: Dashboard — accordion для разделов курса

**Статус:** ✅ Выполнено (2026-06-20)

**Где**: `src/pages/Dashboard.tsx`

**Решение**: Блок "Разделы курса" (~строки 700) — accordion:
- Клик по **заголовку** секции (номер, название, прогресс) → переход на `/course?section={id}` (карта курса с фильтром по разделу)
- Клик по **стрелке ChevronDown** → раскрывает/сворачивает список уроков (через `e.stopPropagation()`)
- Внутри: уроки с цветовой индикацией статуса (completed=зелёный ✓, available=синий, locked=серый), bestScore%, кнопка "Открыть раздел →"
- Анимация `AnimatePresence` + `motion.div` с `height: 0 → auto`
- Секции компактны — занимают высоту только заголовка + прогресс

**Как проверить**: Открыть Dashboard → клик по заголовку раздела → переход на карту курса. Клик по стрелке → раскрывается список уроков.

---

### ✅ ЗАДАЧА-6: Dashboard — карточка "Мои классы" для учителя

**Статус:** ✅ Выполнено (2026-06-20)

**Где**: `src/pages/Dashboard.tsx`

**Решение**: Добавлена карточка "Мои классы" (только при `isTeacher`):
- Показывает количество классов и учеников из `classStore`
- Ведёт на `/teacher/classroom` (`TeacherClassroom.tsx`)
- Расположена рядом с карточкой "Кабинет учителя"

**Как проверить**: Войти в режим учителя → Dashboard → видна карточка "Мои классы" с данными.

---

### ✅ ЗАДАЧА-7: Система классов — UX проверен и работает

**Статус:** ✅ Реализовано (изначально, проверено 2026-06-20)

**Где**: `src/pages/TeacherClassroom.tsx`, `src/pages/JoinClass.tsx`, `src/pages/ClassDetail.tsx`, `src/stores/classStore.ts`

**Решение**: Система классов уже полностью реализована:
- `TeacherClassroom.tsx`: создание класса (имя учителя + название), inviteCode (6 символов), копирование кода, удаление класса, табы: ученики / ДЗ / лидерборд
- `JoinClass.tsx`: ученик вводит код приглашения → присоединяется к классу
- `ClassDetail.tsx`: ученик видит свой класс, ДЗ, лидерборд, своё место
- `classStore.ts`: persist в `localStorage`, методы `createClass`, `joinClass`, `assignHomework`, `getLeaderboard`

**Как проверить**: Войти как учитель → Создать класс → Скопировать код → Войти как ученик → Присоединиться к классу по коду → Виден класс и лидерборд.

---

## ✅ Чек-лист для самопроверки агента

Перед сдачей каждой задачи:

- [ ] Код TypeScript компилируется без ошибок (`npm run build`)
- [ ] Нет ошибок в консоли браузера (F12 → Console)
- [ ] Изменения не сломали существующий функционал (проверить: Dashboard, CourseMap, Lesson, Statistics)
- [ ] Git commit сделан с понятным сообщением

## 📍 Главные правила

1. **Не меняй структуру типов без необходимости**. Если добавляешь поле — обнови `src/types/index.ts`.
2. **Не удаляй существующие данные** (вопросы, достижения) — только перемещай/реорганизуй.
3. **Проверяй `npm run build`** после изменений. Если TS ругается — исправь.
4. **CSS классы**: используй только существующие цвета из `tailwind.config.js` (`duo-green`, `duo-blue`, `duo-red`, `duo-yellow`, `duo-purple`, `duo-gray`, `duo-snow`).
5. **Если сомневаешься** — спроси, не делай наугад.

---

## 🔬 СИСТЕМА АТОМИЗАЦИИ (уже создана, нужно доработать)

### Что уже сделано

- **Типы**: `Question` имеет поле `atoms?: string[]`, добавлен `UserAtomProgress` тип.
- **Хранилище**: `progressStore.ts` отслеживает прогресс по атомам (`recordAtomAttempt`, `getAtomProgress`, `getWeakAtoms`).
- **Данные атомов**: `src/data/atomization/atoms.ts` — 35+ атомов с иерархией:
  - Приставки: ПРЕ-/ПРИ-, ВС-/ВЗ-, ЧЕРЕС-/ЧРЕЗ-, РАС-/РАЗ-, БЕЗ-/БЕС-, ИЗ-/ИС-, С-/СО-, ОБ-/ОБЕЗ-, НЕ-/НИ-
  - Корни: чередование гласных (плав/плов, рас/раст), чередование согласных (жиг/жег, дер/дра), проверяемые (жив/жить, чит/читать)
  - Иноязычные слова
- **Парсер**: `scripts/parse-atomization.cjs` парсит `raw_words.txt` → JSON.
- **Первые 20 вопросов** (`q9-1` .. `q9-20`) **УЖЕ имеют `atoms`** — смотри как пример.

### Что нужно сделать

#### ✅ ЗАДАЧА-А1: Добавить `atoms` ко всем оставшимся вопросам

**Статус:** ✅ Выполнено (2026-06-20)

**Где**: `src/data/sections/task1_3.ts`, `task5.ts`, `task6_8.ts`, `task22_27.ts`

**Решение**: 42 вопроса получили `atoms`:
- `task1_3.ts`: q1-1 `['task1', 'text_connections']`, q2-1 `['task2', 'lexicology']`, q3-1 `['task3', 'speech_errors']`
- `task5.ts`: 32 вопроса `['task5', 'paronyms']`
- `task6_8.ts`: q6-1 `['task6', 'pleonasm']`
- `task22_27.ts`: q22-1..q27-1 с `atoms` по номеру задания + теме

Остальные файлы (`grammar.ts`, `orthography.ts`, `task4.ts`, `punctuation.ts`, `n_nn.ts`, `dooshin/task9-12`, `dooshin15`, `dooshin20`) уже были полностью размечены ранее.

**Как проверить**: `npm run build` проходит без ошибок.

#### ЗАДАЧА-А2: Обновить Statistics — добавить вкладку "Атомы"

**Где**: `src/pages/Statistics.tsx`

**Что добавить**:
- Новый таб `"atoms"` рядом с `"progress"`, `"topics"`, `"mistakes"`.
- Во вкладке "Атомы" показать:
  - Радар-график или список атомов с accuracy
  - Слабые атомы (accuracy < 70%) с цветовой индикацией
  - Прогресс по мастерству: new → learning → review → mastered
- Использовать `useProgressStore((s) => s.atomProgress)` для данных.

**Минимальный вариант**: просто список атомов с процентом правильных ответов, отсортированный по accuracy.

#### ЗАДАЧА-А3: Обновить Teacher-панель — детализация по атомам

**Где**: `src/pages/Teacher.tsx`

**Что добавить**:
- В карточке ученика показывать не просто "слабые темы: Задание 9", а конкретные атомы:
  - "ПРЕ-/ПРИ- словарные — 45%"
  - "Чередование в корне — 60%"
- Использовать `getWeakAtoms()` из `progressStore`.

#### ЗАДАЧА-А4: Режим "Адаптивная практика по атомам"

**Где**: новый компонент или новая страница `src/pages/AdaptivePractice.tsx`

**Суть**: Тренажёр, который:
1. Берёт 3 самых слабых атома ученика (`getWeakAtoms(3)`)
2. Подбирает вопросы из `atomizedWords.json`, относящиеся к этим атомам
3. Показывает их в формате урока (QuestionCard)
4. По результатам обновляет `atomProgress`

**Минимальный вариант**: Кнопка на Dashboard "Потренировать слабые места", которая открывает урок с 10 вопросами из слабых атомов.

### Полезные импорты

```tsx
import { getAtomizedWords, getQuestionsForAtom, getWeakAtoms } from '../data/atomization'
import { getAtomById } from '../data/atomization/atoms'
```

---

## ✅ Новые фичи (выполнено 2026-06-20)

### ✅ ЗВУКИ: Звуковые эффекты с mute

**Статус:** ✅ Выполнено
**Где**: `src/lib/sounds.ts`, `src/stores/settingsStore.ts`, `src/pages/Profile.tsx`
**Решение**: Web Audio API synth (sine/sawtooth) — 6 звуков: correct, wrong, lessonComplete, combo, XPup, achievement. `isSoundEnabled()` читает `ege-settings-storage` из localStorage. Toggle в Profile. Добавлены `playXPUpSound()` и `playAchievementSound()`.

---

### ✅ ТЕМНАЯ ТЕМА: Dark mode

**Статус:** ✅ Выполнено
**Где**: `tailwind.config.js`, `src/App.tsx`, `src/pages/Profile.tsx`
**Решение**: `darkMode: 'class'` в Tailwind. `useEffect` в App.tsx применяет/убирает класс `dark` на `document.documentElement`. Переключатель в Profile: light ☀️ / dark 🌙 / system 💻. `dark:` классы добавлены в BottomNav и root div.

---

### ✅ ЭКСПОРТ/ИМПОРТ: Полный backup v2

**Статус:** ✅ Выполнено
**Где**: `src/pages/Profile.tsx`
**Решение**: Формат `version: 2` включает: progress (userStats, lessonProgress, achievements, atomProgress, wrongAnswers, taskStats, dailyQuest, theoryTests, examResults, leaderboard, isTeacher, userId), student (profiles, activeProfileId), classStore (classes, activeClassId), studyPlan (plan, examDate, targetScore), settings (soundEnabled, theme). Import — merge с текущим или полная замена. Legacy v1 тоже поддерживается.

---

### ✅ ДУЭЛЬ: Соревнование offline-first

**Статус:** ✅ Выполнено
**Где**: `src/stores/duelStore.ts`, `src/pages/DuelPage.tsx`, `src/App.tsx`, `src/pages/Dashboard.tsx`
**Решение**: Создатель генерирует 6-значный код (A-Z, 2-9). Соперник вводит код → присоединяется. 5 случайных вопросов из всех заданий. Оба решают offline (на своих устройствах). Результат: score = correct*100 + timeBonus. Победитель определяется по score. Сохраняется в `ege-duel-storage` (24h TTL). Карточка в Dashboard, роут `/duel`.

---

### ✅ RAG ОБЪЯСНЕНИЯ: Умные объяснения ошибок

**Статус:** ✅ Уже было в `src/components/QuestionCard.tsx` (строки 192-227)
**Где**: `QuestionCard.tsx`, `src/lib/rag.ts`
**Решение**: При неправильном ответе вызывается `ragRetriever.retrieve(question.text, taskNumber, 3)` → `generateExplanation()` → показывает правило + `TheoryQuickReference`. Если RAG не нашёл — fallback к `getRelevantRules()`. Не требует LLM, работает полностью offline.

---

## ✅ БАГ-5: Разделы курса дублируются (17-21 вынесены отдельно от Пунктуации)

**Статус:** ✅ Исправлено (2026-06-21)

**Где**: `src/data/courseData.ts`, `src/data/sections/punctuationAll.ts`, `src/data/sections/examTasks.ts`

**Проблема**: `examTasksSections` (задания 17-21) были импортированы напрямую в `courseData.ts` и отображались как отдельные топ-уровневые секции, вместо того чтобы быть внутри "Пунктуации".

**Решение**:
1. Убран `...examTasksSections` из `courseData.ts`
2. Добавлен `...task22_27Sections` для заданий 22-27
3. В `punctuationAll.ts` добавлены уроки из `examTasks.ts` (task20, task21) как группы внутри секции "Пунктуация"
4. Task 17-19 уже были в `punctuation.ts`, task 20-21 добавлены из `examTasks.ts`

**Код фикса**: `src/data/courseData.ts` — строки импортов и `sections` array. `src/data/sections/punctuationAll.ts` — импорт `examTasksSections` и фильтрация уроков в группы.

**Как проверить**: Открыть Dashboard → раздел "Пунктуация" → внутри группы 16-21. Задания 22-27 — отдельная секция. Нет дублирования.

---

## ✅ ЗАДАЧА-8: Страница "Сегодня" — фокусированный дневной лендинг

**Статус:** ✅ Выполнено (2026-06-21)

**Где**: `src/pages/TodayPage.tsx`, `src/App.tsx`, `src/pages/Dashboard.tsx` (переименован в "Обзор")

**Проблема**: Dashboard перегружен информацией — 20+ блоков, пользователь теряет фокус.

**Решение**:
1. Новая страница `TodayPage.tsx` (маршрут `/`) — минималистичный дневной лендинг:
   - Приветствие + streak + сердечки + уровень (компактная плашка)
   - Главное действие: "Продолжить обучение" (большая карточка)
   - Прогресс курса + дней до экзамена
   - Daily Question (компактная)
   - Квесты на сегодня (только активные, 2 шт.)
   - Быстрый старт: 4 карточки (Все задания, Марафон, Дуэль, Сочинения)
   - Ссылка "Полный обзор →" на старый Dashboard
2. Старый Dashboard переименован в "Обзор", маршрут `/dashboard`
3. Навигация обновлена: Сегодня, Обзор, Курс, Теория, Статистика

**Как проверить**: Открыть приложение → страница "Сегодня" с фокусом на главном действии. Клик "Полный обзор →" → старый Dashboard со всеми блоками.

---

## ✅ ЗАДАЧА-9: Карта курса — стильные карточки уроков (LessonCard)

**Статус:** ✅ Выполнено (2026-06-21)

**Где**: `src/pages/CourseMap.tsx`

**Проблема**: Уроки отображались в сыром виде — просто кружки или список без стиля.

**Решение**:
1. Новый компонент `LessonCard` — стильные карточки уроков:
   - Иконка статуса слева (зелёная ✓, жёлтая ⭐, цветная цифра, серая 🔒)
   - Заголовок, подзаголовок со статусом
   - Прогресс-бар для пройденных уроков
   - 3 звезды (бронза/серебро/золото) под пройденными
   - Action-кнопка справа (Повторить/Продолжить/Начать)
2. Вертикальные коннекторы между карточками:
   - Цветные для пройденного пути (цвет секции)
   - Серые для заблокированного
3. Анимации:
   - Hover: scale + сдвиг вправо
   - Staggered entrance (появление с задержкой по индексу)
4. Используется для flat lessons и внутри групп
   - Доступные — цвет секции с номером
   - Название урока полностью под нодой (переносится)
   - Popover при клике/ховере с XP, вопросами, prerequisites
2. Заменены оба использования (groups и flat lessons) на `BoardPath`

**Как проверить**: Открыть /course → раскрыть любую группу → уроки на тропинке с SVG линиями.

---

## ✅ ЗАДАЧА-10: Мобильное приложение (Capacitor)

**Статус:** ✅ Выполнено (2026-06-21)

**Где**: `capacitor.config.json`, `android/`, `ios/`, `src/lib/mobile.ts`, `src/lib/sounds.ts`, `src/App.tsx`, `package.json`

**Проблема**: Только веб-версия (PWA), нет нативного мобильного приложения.

**Решение**:
1. **Capacitor** интегрирован:
   - `@capacitor/core`, `@capacitor/cli`, `@capacitor/android`, `@capacitor/ios` установлены
   - `capacitor.config.json` — конфигурация (appId: com.ege.russian.app, appName: ЕГЭ Русский язык, webDir: dist, splash screen, push notifications)
   - Платформы Android и iOS добавлены (`npx cap add android`, `npx cap add ios`)
2. **Нативные плагины**:
   - `@capacitor/haptics` — тактильная отдача (light/medium/heavy impact, success/warning/error notification)
   - `@capacitor/push-notifications` — push-уведомления (FCM/APNs), регистрация токена, обработка входящих
   - `@capacitor/splash-screen` — splash screen при запуске (цвет #58CC02, 2 сек)
   - `@capacitor/status-bar` — цвет статус-бара под тему (dark/light)
   - `@capacitor/keyboard` — управление клавиатурой
   - `@capacitor/app` — обработка back button (Android), app state changes
3. **Мобильный сервис** (`src/lib/mobile.ts`):
   - `initMobile()` — инициализация при старте (splash, status bar, keyboard, push, app listeners)
   - `hapticsImpact()` / `hapticsNotification()` / `hapticsVibrate()` — обёртки с fallback на Vibration API
   - `setStatusBarColor()` — смена цвета статус-бара
   - `hideKeyboard()` / `showKeyboard()` — управление клавиатурой
   - `getPlatform()` / `isNativePlatform()` — определение платформы
4. **Интеграция в sounds.ts**: все звуковые функции теперь вызывают соответствующий haptics:
   - `playCorrectSound()` → `hapticsImpact('light')`
   - `playWrongSound()` → `hapticsNotification('error')`
   - `playLessonCompleteSound()` → `hapticsNotification('success')`
   - `playComboSound()` → `hapticsImpact()` (light/medium/heavy по combo)
   - `playXPUpSound()` → `hapticsImpact('light')`
   - `playAchievementSound()` → `hapticsNotification('success')`
5. **Build-скрипты** (package.json):
   - `npm run mobile:build` → build + cap sync
   - `npm run mobile:android` → build + sync + open Android Studio
   - `npm run mobile:ios` → build + sync + open Xcode
   - `npm run mobile:sync` → cap sync

**Как проверить**:
1. `npm run mobile:build` → билд + синхронизация
2. `npm run mobile:android` → открывает Android Studio
3. В Android Studio: Build → Build APK → установить на устройство
4. На устройстве: запуск → splash screen → звук + haptics при ответах

**Для iOS**: требуется Mac с Xcode. `npm run mobile:ios` → открывает Xcode → Build & Run на симуляторе/устройстве.

---

## 🔄 АКТУАЛЬНЫЕ ЗАДАЧИ (обновлено 2026-06-25)

### ✅ ЗАДАЧА-А5: Unified Adaptive Engine — `useAdaptiveEngine` hook

**Статус:** ✅ Выполнено (2026-06-25)

**Где**: `src/hooks/useAdaptiveEngine.ts`, `src/components/BaseTrainer.tsx`, `src/pages/SwipeTrainerPage.tsx`, `src/components/DailyQuestionCard.tsx`, `src/pages/MarathonPage.tsx`, `src/pages/ExamVariantPage.tsx`, `src/pages/MistakesReview.tsx`, `src/pages/DuelPage.tsx`

**Решение**:
1. Создан единый hook `useAdaptiveEngine(questions, taskNumber, enabled)` — обёртка для IRT+BKT
2. Автоматическая регистрация вопросов в adaptive store (`calibrateItem`)
3. Возвращает `questionOrder` (IRT-отсортированный) + `observeAnswer(questionId, correct, atoms)`
4. Интегрирован во ВСЕ компоненты с ответами на вопросы
5. Убрана видимая adaptive-панель из BaseTrainer UI — движок невидим для пользователя
6. **Deprecated**: `getGlobalBKT()` / `getGlobalIRT()` — удалены, использовать `useAdaptiveStore`

**Как проверить**: Решить вопрос в любом тренажёре → `localStorage['ege-adaptive-storage']` должен обновиться

---

### ✅ ЗАДАЧА-А6: Daily Question — поддержка text-ввода

**Статус:** ✅ Выполнено (2026-06-25)

**Где**: `src/components/DailyQuestionCard.tsx`

**Решение**:
1. Добавлен `textAnswer` state + `<input>` для вопросов без `options`
2. Кнопка "Проверить" активируется при вводе текста (не только при выборе option)
3. Нормализация ответа: `trim().toLowerCase()` + сравнение с `correctAnswer`
4. Правильный ответ отображается при ошибке
5. Adaptive engine работает и для text-вопросов

---

### ✅ ЗАДАЧА-А7: CourseMap — исправление анимации сворачивания

**Статус:** ✅ Выполнено (2026-06-25)

**Где**: `src/pages/CourseMap.tsx`

**Проблема**: При сворачивании секции контент "подпрыгивал" в размере — странная анимация

**Решение**:
1. `layout` → `layout="position"` (анимирует только позицию, не размер)
2. Обёртка в `<AnimatePresence initial={false}>` для exit-анимации
3. `transition={{ duration: 0.2 }}` + `className="overflow-hidden"`

---

### 📝 ЗАДАЧА-А8: Ревизия объяснений — стандартизация по ФИПИ

**Статус:** 🔄 В процессе

**Где**: `src/data/sections/dooshin/task9.ts`, `src/data/explanation-rules.md`, `src/data/theory/task9.ts`

**Проблема**: В объяснениях встречаются слова, не входящие в стандартные списки ФИПИ (например, "ростовщина" как пример к "ростовщик"). Агенты могут галлюцинировать правила, если не апеллируют к проверенному своду.

**Что нужно сделать**:
1. Создать `src/data/theory/FIPI_STANDARDS.md` — свод правил ЕГЭ по русскому языку, структурированный по заданиям, с официальными списками исключений
2. Проверить все объяснения в `task9.ts` / `dooshin/task9.ts` на соответствие ФИПИ
3. Убрать примеры, которых нет в стандартных справочниках (Русских, Сенина, ФИПИ Навигатор)
4. Обновить `explanation-rules.md` — привести шаблоны в соответствие с ФИПИ

**Критерий завершения**: Все объяснения в задании 9 ссылаются на проверяемые правила, а не на "запомните это слово"

---

### 📝 ЗАДАЧА-А9: Полнота теоретических данных

**Статус:** 🔄 В процессе

**Где**: `src/data/theory/`

**Проблема**: Теория есть для task4-16, 17-21, 22-26. Нет теории для task1, 2, 3, 18, 19, 20 (по отдельности), 25, 27.

**Что нужно сделать**:
1. Создать `src/data/theory/task1.ts` — типы связи (сочинительная, подчинительная, присоединительная)
2. Создать `src/data/theory/task2.ts` — лексические нормы (устаревшие, диалектизмы, жаргон)
3. Создать `src/data/theory/task3.ts` — речевые ошибки (тавтология, плеоназм, лексические/грамматические)
4. Разделить `task17-21.ts` на отдельные файлы (task17, task18, task19, task20, task21)
5. Создать `src/data/theory/task25.ts` — пунктуация в сложных предложениях (без союзов)
6. Создать `src/data/theory/task27.ts` — средства выразительности (эпитеты, сравнения, метафоры, олицетворения)

**Критерий завершения**: Для каждого из 27 заданий есть файл `src/data/theory/task{N}.ts` с правилами

---

### 📝 ЗАДАЧА-А10: Agent Update Protocol — автоматизация

**Статус:** 🔄 В процессе

**Где**: `AGENTS.md`, `AGENT_TASKS.md`

**Проблема**: Агенты не обновляют документацию после изменений. Следующий агент не знает, что уже сделано, и может сломать или дублировать работу.

**Что нужно сделать**:
1. В `AGENTS.md` добавлен раздел "Agent Update Protocol" (уже сделано 2026-06-25)
2. Создать cron-напоминание: после каждой сессии с изменениями — проверить, обновлены ли AGENTS.md и AGENT_TASKS.md
3. В `AGENT_TASKS.md` добавить чек-лист: "Перед сдачей задачи — обновить документацию"

---

## 📌 Чек-лист для самопроверки агента (обновлённый)

Перед сдачей каждой задачи:

- [ ] Код TypeScript компилируется без ошибок (`npm run build`)
- [ ] Нет ошибок в консоли браузера (F12 → Console)
- [ ] Изменения не сломали существующий функционал (проверить: Dashboard, CourseMap, Lesson, Statistics)
- [ ] **AGENTS.md обновлён** — новый раздел в changelog с описанием изменений
- [ ] **AGENT_TASKS.md обновлён** — статусы задач актуальны, новые задачи добавлены
- [ ] Git commit сделан с понятным сообщением


---

### ✅ ЗАДАЧА-А11: Локальный движок проверки орфографии (spellEngine)

**Статус:** ✅ Завершено (2026-06-25)

**Где**: `src/data/spellDictionary.ts`, `src/data/spellRules.ts`, `src/utils/spellEngine.ts`, `src/utils/questionValidator.ts`, `src/utils/auditRunner.ts`

**Что сделано**:
1. Создан `spellDictionary.ts` — словарь с 30+ исключениями (пловец, бесценный, солнце и т.д.)
2. Создан `spellRules.ts` — 32 правила: чередование корней (10), приставки (8), непроизносимые согласные (6), пунктуация (4), паронимы (4)
3. Создан `spellEngine.ts` — движок проверки слов и ответов
4. Создан `questionValidator.ts` — валидатор вопросов на основе движка
5. Создан `auditRunner.ts` — массовый аудит всех вопросов
6. Интегрировано в `QuestionCard.tsx` — проверка текстовых ответов через spellEngine
7. Добавлен dev-аудит в `main.tsx` — автоматический запуск при старте

---

### ✅ ЗАДАЧА-А12: Фикс авторизации для новых пользователей

**Статус:** ✅ Завершено (2026-06-25)

**Где**: `src/components/Header.tsx`, `src/pages/Profile.tsx`, `src/App.tsx`

**Проблема**: Новые пользователи не видели кнопку авторизации, потому что:
- `Header.tsx` принимал `syncIndicator`, но не рендерил его
- `AuthModal.tsx` при `!isSupabaseConfigured` показывал fallback без кнопки входа
- Не было auto-show модалки регистрации для новых пользователей

**Решение**:
1. `Header.tsx` — добавлен рендеринг `syncIndicator` (кнопка "Войти" видна в шапке)
2. `Profile.tsx` — условное отображение: если Supabase настроен → кнопка "Войти через Google", если нет → "Работает в локальном режиме"
3. `App.tsx` — `StudentRegistrationModal` автоматически открывается для новых пользователей (когда `profiles.length === 0`)
4. `App.tsx` — `syncIndicator` скрывается, если `isSupabaseConfigured === false`

**Критерий завершения**: Новый пользователь открывает сайт → видит модалку регистрации → создаёт профиль → пользуется приложением. Кнопка "Войти" видна только если Supabase настроен.


---

### ✅ ЗАДАЧА-А13: Разгрузка главной страницы (TodayPage)

**Статус:** ✅ Завершено (2026-06-25)

**Где**: `src/pages/TodayPage.tsx`, `src/pages/Dashboard.tsx`

**Проблема**: Главная страница (TodayPage) была перегружена — 6 карточек в "Быстром старте" + 2 мини-карточки Достижения/Рейтинг + Teacher Panel + Full Overview button.

**Решение**:
1. **TodayPage** — сокращён "Быстрый старт" с 6 до 4 карточек:
   - Оставлены: Все задания, Марафон, Дуэль, Сочинения
   - Убраны: Карточки, Друзья
2. **TodayPage** — убраны мини-карточки Достижения и Рейтинг
3. **Dashboard** — добавлена секция "Социальное" с 4 карточками:
   - Друзья, Достижения, Рейтинг, Карточки

**Файлы**: `src/pages/TodayPage.tsx` (строки 248-354), `src/pages/Dashboard.tsx` (строки 534-565)

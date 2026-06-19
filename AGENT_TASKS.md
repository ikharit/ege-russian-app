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

### БАГ-3: Supabase падает тихо, если `.env` не настроен

**Где**: `src/stores/progressStore.ts` — методы `syncProgress()` и `loadProgress()`

**Проблема**: Если переменные `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY` пустые (по умолчанию так), `supabase.from(...)` делает запрос к пустому URL. Ошибка есть в консоли, но пользователь ничего не видит. Прогресс не сохраняется.

**Текущий код** `syncProgress()` (строки ~68-79):

```tsx
syncProgress: async () => {
  const { userId, userStats, lessonProgress, achievements } = get()
  if (!userId) return
  await supabase.from('user_progress').upsert(...)
},
```

**Что нужно сделать**:

1. В `src/lib/supabase.ts` экспортировать флаг, настроен ли Supabase:

```tsx
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey)
```

2. В `syncProgress` и `loadProgress` добавить проверку:

```tsx
import { isSupabaseConfigured } from '../lib/supabase'

syncProgress: async () => {
  const { userId, userStats, lessonProgress, achievements } = get()
  if (!userId || !isSupabaseConfigured) return
  // ... остальной код
},

loadProgress: async () => {
  const { userId } = get()
  if (!userId || !isSupabaseConfigured) return
  // ... остальной код
},
```

**Как проверить**: Убрать `.env` файл → открыть приложение → пройти урок → в консоли не должно быть ошибок Supabase. Прогресс должен сохраняться в `localStorage`.

---

### БАГ-4: Dashboard предлагает "Продолжить" уже пройденный урок

**Где**: `src/pages/Dashboard.tsx`, строки ~25-35

**Проблема**: Если все уроки `completed`, логика падает в `if (!nextLesson)` и берёт `course.sections[0].lessons[0]` — который уже пройден. Пользователь видит "Продолжить обучение" на пройденный урок.

**Текущий код**:

```tsx
let nextLesson = null
for (const section of course.sections) {
  for (const lesson of section.lessons) {
    const prog = lessonProgress[lesson.id]
    if (!prog || prog.status === 'available' || prog.status === 'started') {
      nextLesson = { lesson, section }
      break
    }
  }
  if (nextLesson) break
}
if (!nextLesson) {
  nextLesson = { lesson: course.sections[0].lessons[0], section: course.sections[0] }
}
```

**Что нужно сделать**:

1. Если `!nextLesson` (всё пройдено), показать другую карточку:
   - Заголовок: "Все уроки пройдены! 🎉"
   - Текст: "Повторите слабые темы или пройдите пробный экзамен."
   - Кнопка: "К карте курса" → `navigate('/course')`
2. ИЛИ предложить урок с наихудшим `bestScore` для повторения.

**Минимальный фикс**:

```tsx
if (!nextLesson) {
  // Найти урок с наименьшим bestScore для повторения
  let worstLesson = null
  let worstScore = 101
  for (const section of course.sections) {
    for (const lesson of section.lessons) {
      const score = lessonProgress[lesson.id]?.bestScore ?? 0
      if (score < worstScore) {
        worstScore = score
        worstLesson = { lesson, section }
      }
    }
  }
  nextLesson = worstLesson || { lesson: course.sections[0].lessons[0], section: course.sections[0] }
}
```

И добавить в карточку текст: `prog?.status === 'completed' ? 'Повторить' : 'Продолжить обучение'`.

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

**Решение**: Блок "Разделы курса" (~строки 516) заменён на accordion:
- Клик по заголовку секции раскрывает/сворачивает список уроков
- Внутри: уроки с цветовой индикацией статуса (completed=зелёный ✓, available=синий, locked=серый), bestScore%, кнопка "Открыть раздел →"
- Анимация `AnimatePresence` + `motion.div` с `height: 0 → auto`
- Секции компактны — занимают высоту только заголовка + прогресс

**Как проверить**: Открыть Dashboard → клик по любому разделу → список уроков раскрывается с анимацией.

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

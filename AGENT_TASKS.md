# Техзадание для агента-исполнителя

> **Контекст**: React-приложение на Vite для подготовки к ЕГЭ по русскому языку. Стек: React 18 + TypeScript + Tailwind CSS + Zustand + Framer Motion + React Router (HashRouter). Данные хранятся в `localStorage` (Zustand persist). Supabase подключён, но необязателен.
>
> **Рабочая папка**: `src/` внутри проекта. Все пути относительно `src/`.

---

## 🚨 P0 — Баги (исправить в первую очередь)

---

### БАГ-1: При потере всех сердечек урок мгновенно заканчивается и показывает результат

**Где**: `src/pages/Lesson.tsx`

**Проблема**: Когда у ученика заканчиваются сердечки (`hearts === 0`), срабатывает `setIsFinished(true)`. Компонент `<LessonResult>` показывает процент правильных ответов, но ученик не ответил на все вопросы — это выглядит как баг.

**Текущий код** (строки ~45-52):

```tsx
const handleAnswer = useCallback((isCorrect: boolean) => {
  if (isCorrect) {
    setCorrectCount(prev => prev + 1)
  } else {
    const hasHeart = loseHeart()
    if (!hasHeart) {
      setIsFinished(true)  // ← ПРОБЛЕМА
    }
  }
}, [loseHeart])
```

**Что нужно сделать**:

1. Добавить новое состояние `gameOverReason: 'hearts' | 'completed' | null` вместо простого `isFinished`.
2. Когда `!hasHeart` — устанавливать `gameOverReason = 'hearts'`.
3. Когда урок пройден до конца — `gameOverReason = 'completed'`.
4. В JSX вместо `<LessonResult>` при `gameOverReason === 'hearts'` показать отдельный экран:
   - Заголовок: "Сердечки закончились! 💔"
   - Текст: "У вас закончились жизни. Попробуйте пройти урок ещё раз."
   - Кнопка: "Повторить" (вызывает `handleRetry`)
   - Кнопка: "Вернуться к курсу" (вызывает `navigate('/')`)

**Минимальные изменения** (если хочешь быстрый фикс без рефакторинга состояний):

Замени в `handleAnswer`:
```tsx
if (!hasHeart) {
  setIsFinished(true)
}
```

На:
```tsx
if (!hasHeart) {
  // Не вызываем setIsFinished — покажем отдельный UI
  return
}
```

И добавь проверку в начале компонента: если `hearts <= 0` и `!isFinished` — рендери экран "Нет сердечек".

**Как проверить**: Открыть любой урок → ответить неправильно 5 раз подряд → должен появиться экран "Сердечки закончились", а не результат урока.

---

### БАГ-2: Соединительные линии между уроками на карте курса не отображаются

**Где**: `src/pages/CourseMap.tsx`

**Проблема**: Вот этот код (строки ~60-65):

```tsx
{!isLast && (
  <div className="absolute left-8 mt-16 w-0.5 h-4 bg-gray-200" style={{ position: 'relative' }} />
)}
```

`absolute` в className, но inline `style={{ position: 'relative' }}` — они конфликтуют, и `left-8 mt-16` не работают как задумано. Линии либо не видны, либо расположены хаотично.

**Что нужно сделать**:

1. Убрать `style={{ position: 'relative' }}` (он конфликтует с `absolute`).
2. Обёртка `<div className="flex items-center gap-4">` должна иметь `relative`, чтобы `absolute` линия позиционировалась относительно неё.
3. Линия должна быть вертикальной и соединять узлы.

**Исправленный JSX для урока**:

```tsx
<div key={lesson.id} className="flex items-center gap-4 relative">
  {/* Узел */}
  <motion.button ... >...</motion.button>

  {/* Текст */}
  <div className="flex-1">...</div>

  {/* Линия — только если не последний урок в секции */}
  {!isLast && (
    <div className="absolute left-8 top-16 w-0.5 h-6 bg-gray-200" />
  )}
</div>
```

**Как проверить**: Открыть `/course` — между уроками должны быть серые вертикальные линии.

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

### ЗАДАЧА-4: Добавить автоматическое восстановление сердечек

**Где**: `src/stores/progressStore.ts`

**Сейчас**: Сердечки восстанавливаются только при нажатии "Повторить" (`restoreHearts()`). В Duolingo — 1 сердце каждые 4 часа.

**Что нужно сделать**:

1. Добавить в `UserStats` поле `lastHeartRestore: string` (ISO дата).
2. При инициализации store (или при чтении) — проверить, сколько времени прошло с `lastHeartRestore`.
3. Формула: `restoredHearts = Math.floor(minutesPassed / 240)` (4 часа = 240 мин).
4. Обновить `hearts` = `min(maxHearts, hearts + restoredHearts)`.
5. Обновить `lastHeartRestore` на текущее время.

**Минимальный вариант** (без сложной логики): добавить метод `checkHeartRestore()` и вызывать его при открытии приложения (в `Dashboard.tsx` через `useEffect`).

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

#### ЗАДАЧА-А1: Добавить `atoms` ко всем оставшимся вопросам в `courseData.ts`

**Где**: `src/data/courseData.ts`

**Текущее состояние**: Первые 20 вопросов (q9-1..q9-20) уже имеют поле `atoms`. Остальные ~100+ вопросов — нет.

**Паттерн** (смотри на q9-1..q9-20 как пример):
- Вопросы про корни с чередованием гласных → `atoms: ['root_vowel_alternation']` или конкретнее `['root_vowel_alternation', 'root_plav_plov']`
- Вопросы про корни с чередованием согласных → `atoms: ['root_consonant_alternation']` или `['root_consonant_alternation', 'root_zhig_zheg']`
- Вопросы про проверяемые корни → `atoms: ['root_verifiable']` или `['root_verifiable', 'root_zhiv_zhit']`
- Вопросы про иноязычные слова → `atoms: ['foreign_words']`
- Вопросы про приставки (если есть в курсе) → `['prefix_pre_pri', 'pre_pri_dictionary']` и т.д.
- Если не уверен — `atoms: ['roots']` как fallback.

**Как проверить**: `npm run build` должен проходить без ошибок.

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

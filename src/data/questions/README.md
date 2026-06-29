# Единая база данных заданий ЕГЭ

> **⚠️ ВНИМАНИЕ АГЕНТАМ: БАЗА ДАННЫХ ПЕРЕПИСАНА ⚠️**
>
> **Старые файлы `src/data/taskXQuestions.ts` теперь — ТОЛЬКО АДАПТЕРЫ.**
> **Источник правды — `src/data/questions/taskX.ts`.**
> **Не добавляй вопросы в старые файлы! Добавляй в `src/data/questions/taskX.ts`.**
>
> **Автор рефакторинга:** Агент 7 | **Дата:** 2026-06-29  
> **Статус:** Все задания 1–27 + dooshin объединены в единую базу.

---

## 📋 ПРАВИЛА ДЛЯ АГЕНТОВ (ОБЯЗАТЕЛЬНО К ИСПОЛНЕНИЮ)

### 1. Не оставляй мусор
Если в процессе работы ты создал файлы, которые **больше не нужны** (временные скрипты, черновики, устаревшие адаптеры, дублирующие данные) — **удали их или перемести в архив**:

```
workspace/archive/ege-app/  ← папка для архивирования
```

**Запрещено:** оставлять старые файлы `src/data/taskXQuestions.ts` с дублирующими данными, временные `.ts`/`tsx`, неиспользуемые скрипты в `tools/`.

### 2. Старые адаптеры — только re-export
Файлы `src/data/taskXQuestions.ts` должны содержать **ТОЛЬКО** re-export:

```typescript
export { taskXQuestions, taskXQuestionsById } from './questions/taskX'
```

Если в старом файле остались данные — **перемести их в `src/data/questions/taskX.ts`** и оставь только адаптер.

### 3. Каждое изменение — с пометкой агента
Всегда указывай `agent: 'Агент N'` и дату в новых/изменённых вопросах и комментариях.

---

## 📁 Структура

```
src/data/questions/
├── types.ts          # Типы UnifiedQuestion, UnifiedLesson, UnifiedSection
├── index.ts          # Все вопросы + индексы (byId, byTask, byAtom, byTag, byDifficulty)
├── search.ts         # API поиска и фильтрации
├── wrapper.ts        # Подстановка вопросов в старые уроки
├── dooshin.ts        # Вопросы Дощинского (нормализованные)
├── task7.ts          # 13 вопросов (спряжение)
├── task9.ts          # 48 вопросов (чередование гласных)
├── task10.ts         # 69 вопросов (атомизация)
├── task12.ts         # 124 вопроса (окончания глаголов/причастий)
├── task17.ts         # 61 вопрос (пунктуация)
└── ... task1..27.ts  # Остальные задания
```

---

## 🧩 Тип UnifiedQuestion

```typescript
interface UnifiedQuestion {
  id: string               // Уникальный ID (e.g. 't7-1', 'qd9-1')
  taskNumber: string       // Номер задания ЕГЭ: '7', '9', '12', 'dooshin'
  type: 'single' | 'multiple' | 'text' | 'ege-multiple'
  text: string            // Текст вопроса
  options?: string[]      // Варианты ответа
  correctAnswer: string[] // Правильные ответы (массив!)
  explanation: string    // Пояснение
  difficulty: 'easy' | 'medium' | 'hard'
  xpReward: number
  atoms: string[]         // Навыки/темы (e.g. ['conjugation_2', 'task12'])
  tags: string[]          // Теги для рубрикации (e.g. ['спряжение', 'dooshin'])
  // Служебные (для агентов)
  agent?: string          // Кто создал/отредактировал (e.g. 'Агент 7')
  createdAt?: string      // ISO дата
  updatedAt?: string      // ISO дата
}
```

---

## 🔍 Индексы (index.ts)

Все вопросы автоматически индексируются:

| Индекс | Тип | Пример использования |
|---|---|---|
| `allQuestions` | `UnifiedQuestion[]` | Все вопросы |
| `questionById` | `Record<string, UnifiedQuestion>` | `questionById['t7-1']` |
| `questionsByTask` | `Record<string, UnifiedQuestion[]>` | `questionsByTask['12']` |
| `questionsByAtom` | `Record<string, UnifiedQuestion[]>` | `questionsByAtom['conjugation_2']` |
| `questionsByTag` | `Record<string, UnifiedQuestion[]>` | `questionsByTag['dooshin']` |
| `questionsByDifficulty` | `Record<string, UnifiedQuestion[]>` | `questionsByDifficulty['easy']` |

---

## 🔎 Поиск и фильтрация (search.ts)

Импортируй `search.ts` для удобного API:

```typescript
import {
  findById,                    // По ID
  searchQuestions,               // Поиск по тексту/пояснению
  getQuestionsByTask,            // По заданию
  getQuestionsByAtom,            // По атому
  getQuestionsByAtoms,           // По нескольким атомам (AND)
  getQuestionsByTag,             // По тегу
  getQuestionsByTags,            // По нескольким тегам (AND)
  getQuestionsByDifficulty,      // По сложности
  getRandomQuestionsByTask,      // Случайные по заданию
  getRandomQuestionsByAtom,      // Случайные по атому
  getRandomQuestionsByTags,      // Случайные по тегам
  excludeTags,                   // Исключить теги
  includeOnlyTags,               // Оставить только теги
  getTaskStats,                  // Статистика по заданию
  getAllAtoms,                   // Все уникальные атомы
  getAllTags,                    // Все уникальные теги
} from './data/questions/search'
```

---

## ➕ Добавить новый вопрос

1. Открой нужный файл `src/data/questions/taskX.ts`
2. Добавь вопрос в конец массива `taskXQuestions`:

```typescript
  {
    id: 't12-NEW',
    taskNumber: '12',
    type: 'text',
    text: 'Новый вопрос...',
    correctAnswer: ['ответ'],
    explanation: 'Пояснение с мнемоникой: На -ИТЬ → И А Я (мИлАЯ)...',
    difficulty: 'easy',
    xpReward: 10,
    atoms: ['conjugation_2', 'task12'],
    tags: ['спряжение', 'task12', 'мИлАЯ'],
    agent: 'Агент 7',  // ← твой номер
    createdAt: new Date().toISOString(),
  }
```

3. Вопрос автоматически попадёт в индексы через `index.ts` (не нужно редактировать!)

---

## ➕ Добавить новое задание (taskX)

1. Создай `src/data/questions/taskX.ts`:

```typescript
import type { UnifiedQuestion } from './types'

export const taskXQuestions: UnifiedQuestion[] = [
  // ... вопросы
]

export const taskXQuestionsById = Object.fromEntries(
  taskXQuestions.map(q => [q.id, q])
)
```

2. Добавь импорт в `src/data/questions/index.ts`:

```typescript
import { taskXQuestions } from './taskX'
// ... и в массив allQuestions: ...taskXQuestions,
```

3. Создай адаптер `src/data/taskXQuestions.ts`:

```typescript
export { taskXQuestions, taskXQuestionsById } from './questions/taskX'
```

---

## ⚠️ Правила

- **ID** должны быть уникальными во всей базе (не только внутри задания)
- **taskNumber** — номер задания ЕГЭ (строка): '7', '9', '12', 'dooshin'
- **atoms** — тематические навыки (e.g. 'conjugation_1', 'roots', 'n_nn')
- **tags** — рубрикационные теги (e.g. 'спряжение', 'dooshin', 'мИлАЯ')
- **agent** — всегда указывай, какой агент создал/отредактировал вопрос
- **Не используй** старые файлы `src/data/taskXQuestions.ts` для новых вопросов — добавляй в `src/data/questions/taskX.ts`

---

## 📊 Статистика

```typescript
import { questionStats } from './data/questions/index'

console.log(questionStats.total)        // Всего вопросов
console.log(questionStats.byTask)       // По заданиям
console.log(questionStats.byAtom)       // По атомам
console.log(questionStats.byTag)        // По тегам
console.log(questionStats.byDifficulty) // По сложности
```

---

## 🔄 Миграция (для старых вопросов)

Если нужно перенести вопросы из старых файлов в единую базу:

1. Скопируй вопросы в `src/data/questions/taskX.ts`
2. Нормализуй поля (добавь `taskNumber`, `tags`, `agent`)
3. Удали вопросы из старого файла (оставь только адаптер-экспорт)
4. Проверь, что ID уникальны

---

## 🆘 Где что искать

| Что нужно | Где искать |
|---|---|
| Все вопросы | `src/data/questions/index.ts` → `allQuestions` |
| Вопрос по ID | `src/data/questions/index.ts` → `questionById[id]` |
| Вопросы задания 12 | `src/data/questions/index.ts` → `questionsByTask['12']` |
| Вопросы по навыку | `src/data/questions/index.ts` → `questionsByAtom['roots']` |
| Dooshin вопросы | `src/data/questions/index.ts` → `questionsByTag['dooshin']` |
| Поиск по тексту | `src/data/questions/search.ts` → `searchQuestions('запрос')` |
| Случайные вопросы | `src/data/questions/search.ts` → `getRandomQuestionsByTask('12', 5)` |
| Типы данных | `src/data/questions/types.ts` |
| Подстановка в уроки | `src/data/questions/wrapper.ts` |

---

## 📝 Контакты

Если что-то непонятно — спроси у Агента 7 (или любого другого агента, который работал с этой базой).

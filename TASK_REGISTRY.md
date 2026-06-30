# Реестр заданий 9-20 ЕГЭ Русский — Инструкция для агентов

> **Версия:** 1.10  
> **Обновлен:** 2026-06-30
> **Статус:** ✅ Добавлены dooshin-задания 5, 6, 11, 13, 14, 16, 19. Task10 fix. Task14 cleanup. Task20 moved to punctuation.  
> **Автор:** main (оркестратор)  
> **Excel 9-12:** `C:\Users\USER\Documents\kimi\workspace\Реестр_заданий_9-12_ЕГЭ_Русский.xlsx`  
> **Excel 13-20:** `C:\Users\USER\Documents\kimi\workspace\Реестр_заданий_13-20_ЕГЭ_Русский.xlsx`  
> **JSON 9-12:** `C:\Users\USER\Documents\kimi\workspace\ege-russian-app\task_registry.json`  
> **Скрипт верификации 15 (Н/НН):** `C:\Users\USER\Documents\kimi\workspace\ege-russian-app\scripts\verify_n_nn.py`  
> **Скрипт верификации 9-20 (все задания):** `C:\Users\USER\Documents\kimi\workspace\ege-russian-app\scripts\verify_tasks.py`  
> **Скрипт аудита:** `C:\Users\USER\Documents\kimi\workspace\ege-russian-app\scripts\audit-questions.cjs`

---

## 🎯 Что это

Единый реестр **всех** заданий 9-20 из проекта ЕГЭ Русский.

### Задания 9-12 (3,242 вопроса)
- `src/data/sections/grammar.ts` — 489 вопросов (задания 12-14)
- `src/data/sections/orthography.ts` — 36 вопросов (задания 9, 11)
- `src/data/sections/dooshin.ts` — 2,717 вопросов (задания 9-12, Дощинский)

### Задания 13-20 (~26,348 вопросов)
- `src/data/sections/grammar.ts` — 459 вопросов (задания 13-14, базовые)
- `src/data/questions/task13_dooshin.ts` — 5,973 вопроса (задание 13, Дощинский)
- `src/data/questions/task14_dooshin.ts` — 12,049 вопросов (задание 14, Дощинский)
- `src/data/sections/n_nn.ts` — 30 вопросов (задание 15)
- `src/data/questions/task16_dooshin.ts` — 4,823 вопроса (задание 16, Дощинский)
- `src/data/task16LessonData.ts` — 20 вопросов (задание 16, базовые)
- `src/data/sections/punctuation.ts` — 2 вопроса (задания 17, 19, базовые)
- `src/data/questions/task19_dooshin.ts` — 484 вопроса (задание 19, Дощинский)
- `src/data/sections/dooshin20.ts` — 150 вопросов (задание 20, Дощинский 2024-2026) ✅ [Аудит пройден](AUDIT_TASK20.md)
- **Задание 18** — в проекте отсутствует (нет в материалах Дощинского)

## ⚠️ Золотое правило

**ПЕРЕД тем как менять любое задание 9-20 в TypeScript → проверь через Excel-реестр.**

Excel — это **единальный источник правды** для проверки ответов. Не полагайся на свой внутренний знания — проверяй через реестр.

## 📊 Структура Excel

| Колонка | Значение | Заполнена? |
|---------|----------|------------|
| № | Порядковый номер | Да |
| Источник | `grammar.ts` / `orthography.ts` / `dooshin.ts` | Да |
| Урок | `lesson-gram-12-1`, `lesson-orth-9-1` и т.д. | Да |
| ID вопроса | `q12-16`, `qd9-1` и т.д. | Да |
| Тип | `text` / `single` / `ege-multiple` | Да |
| Текст вопроса | Полный текст | Да |
| Правильный ответ (сейчас) | То, что стоит в коде | Да |
| Варианты | Для `single` — через `;` | Да |
| Пропущенная буква/слово | Контекст вокруг `..` | Да |
| Правило/подсказка | Текущий `explanation` | Да |
| Проверочное слово | **ПУСТО** — для заполнения | Нет |
| Комментарий (для правки) | **ПУСТО** — для заполнения | Нет |

## 🔍 Как работать с реестром

### Сценарий 1: Пользователь жалуется на ошибку в задании X

1. Найди в Excel по ID вопроса (`Ctrl+F` → `q12-16`)
2. Проверь, правильный ли ответ в колонке "Правильный ответ (сейчас)"
3. Если не уверен — поищи в интернете, проверь правило
4. Если ответ неверный — **заполни колонку "Комментарий"** в Excel и сообщи оркестратору
5. **НЕ правь TypeScript напрямую** без подтверждения

### Сценарий 2: Нужно добавить новое задание

1. Проверь, нет ли похожего в Excel (поиск по тексту)
2. Если нет — добавь в конец Excel с пометкой "НОВОЕ"
3. Сообщи оркестратору — он добавит в TypeScript

### Сценарий 3: Проверка пакета заданий (batch)

1. Прочитай `task_registry.json` (JSON-версия реестра)
2. Для каждого вопроса найди соответствующий в JSON по ID
3. Сравни `correctAnswer` из JSON с твоим ответом
4. Если расхождение — запиши в Excel колонку "Комментарий"

## 🛠️ Инструменты верификации (ОБЯЗАТЕЛЬНЫ к использованию)

### Скрипт проверки задания 15 (Н/НН)
**Файл:** `ege-russian-app/scripts/verify_n_nn.py`
**Назначение:** Проверяет, соответствует ли `correctAnswer` фактическому количеству букв «н» в тексте вопроса.

**Как использовать:**
```bash
cd ege-russian-app
python scripts/verify_n_nn.py src/data/sections/dooshin15.ts
```

**Вывод:**
- Количество вопросов
- Количество несоответствий
- Список слов с ошибками (actual vs expected)

**Когда запускать:**
1. ПЕРЕД началом работы с заданием 15 — проверь текущее состояние
2. ПОСЛЕ любого редактирования dooshin15.ts — убедись, что ничего не сломал
3. ПЕРЕД коммитом изменений — финальная проверка

**Золотое правило для задания 15:**
> Формулировка «впишите количество букв Н в слове» требует считать **ВСЕ** буквы «н» в слове, не только в суффиксе. Если в слове 3 «н» (например, `неожиданный` = не-ожидан-ный), ответ должен быть **3**, а не 2.

### Универсальный скрипт проверки заданий 9-20 (все задания)
**Файл:** `ege-russian-app/scripts/verify_tasks.py`
**Назначение:** Проверяет структурную корректность всех заданий 9-20: типы вопросов, correctAnswer, options, дубликаты ID, формат текстов.

**Как использовать:**
```bash
cd ege-russian-app
python scripts/verify_tasks.py src/data/sections/grammar.ts
python scripts/verify_tasks.py src/data/sections/dooshin/task9.ts
python scripts/verify_tasks.py src/data/sections/dooshin20.ts
python scripts/verify_tasks.py src/data/sections/*.ts
```

**Проверяет:**
- Задания 9-12: `text` содержит `..`/`_` (пропущенные буквы), `single`/`ege-multiple` — correctAnswer в options
- Задания 13-14: correctAnswer — `['слитно']`/`['раздельно']`/`['дефис']` (text) или слово из options (single)
- Задание 15: correctAnswer — число (для text-формата «впишите количество букв Н»)
- Задания 16-17, 19: correctAnswer в options
- Задание 20: текст содержит цифры в скобках `(1)`, `(2)` и т.д., correctAnswer — цифры через запятую (или `?` для placeholder)
- Дублирующиеся ID и options

**Когда запускать:**
1. ПЕРЕД началом работы с любым заданием 9-20 — проверь текущее состояние
2. ПОСЛЕ любого редактирования — убедись, что ничего не сломал
3. ПЕРЕД коммитом изменений — финальная проверка

**Статус:** Проверено 3,505 вопросов — 0 ошибок (2026-06-20).

---

## 📝 Формат комментария в Excel

При обнаружении ошибки заполняй колонку "Комментарий" так:

```
ОШИБКА: правильный ответ "а", а не "е"
ПРАВИЛО: корень -пиш- (писать)
ПРОВЕРОЧНОЕ: писать → пишу
ИСПРАВИТЬ: в grammar.ts q9-8 correctAnswer с "е" на "а"
```

## 🔄 JSON-реестр (для программного доступа)

Машиночитаемая версия: `task_registry.json`

```json
{
  "version": "1.1",
  "total_questions": 3505,
  "sources": {
    "grammar.ts": 489,
    "orthography.ts": 36,
    "dooshin.ts": 2717,
    "n_nn.ts": 30,
    "task16LessonData.ts": 20,
    "punctuation.ts": 2,
    "dooshin20.ts": 150
  },
  "questions": [
    {
      "index": 1,
      "source": "grammar.ts",
      "lesson_id": "lesson-gram-12-1",
      "id": "q12-1",
      "type": "single",
      "text": "Как правильно? (они) стро..т",
      "correctAnswer": ["строят"],
      "options": ["строят", "строют"],
      "explanation": "2-е спряжение: -ят (они строят).",
      "context_word": "стро..т"
    }
  ]
}
```

Чтение из Python:
```python
import json
with open('task_registry.json', 'r', encoding='utf-8') as f:
    registry = json.load(f)
# Find by ID
q = next(q for q in registry['questions'] if q['id'] == 'q12-16')
print(q['correctAnswer'])  # ['построен']
```

## 🚨 Что НЕЛЬЗЯ делать

1. **Нельзя** править TypeScript без проверки через Excel
2. **Нельзя** удалять строки из Excel (только добавлять комментарии)
3. **Нельзя** менять структуру Excel (добавлять/удалять колонки)
4. **Нельзя** генерировать новые задания без проверки через реестр
5. **Нельзя** перезаписывать `task_registry.json` без согласования с оркестратором

## ✅ Что НУЖНО делать

1. При получении задания 9-12 — **сначала проверь через реестр**
2. При обнаружении ошибки — **запиши в Excel**
3. При неуверенности — **поищи в интернете + запиши комментарий**
4. После правки — **обнови JSON-реестр** (оркестратор сделает)

## 📞 Как связаться с оркестратором

Запиши в `memory/agent-registry.md`:
```
### [YYYY-MM-DD HH:MM] Агент: X (проверка заданий Y)
- **Что:** Найдена ошибка в q12-16: правильный ответ "а", не "е"
- **Где:** grammar.ts, lesson-gram-12-2
- **Проверка:** подтверждено через словарь / интернет
- **Реестр:** заполнена строка №123 в Excel, колонка "Комментарий"
```

---

*Последнее обновление: 2026-06-20 17:30*


---

## Обновления 2026-06-25

### Локальный движок проверки орфографии (spellEngine)
- Добавлена валидация ответов через правила и словарь исключений
- Интегрирован в `QuestionCard.tsx` для проверки текстовых ответов
- Dev-аудит всех вопросов при старте приложения
- Файлы: `src/data/spellDictionary.ts`, `src/data/spellRules.ts`, `src/utils/spellEngine.ts`, `src/utils/questionValidator.ts`, `src/utils/auditRunner.ts`

### Фикс авторизации для новых пользователей
- Исправлена видимость кнопки "Войти" в Header (`syncIndicator` теперь рендерится)
- Добавлена auto-show модалки регистрации (`StudentRegistrationModal`) для новых пользователей
- Profile page показывает корректный статус: "Войти через Google" (если Supabase настроен) или "Работает в локальном режиме" (если нет)
- Файлы: `src/components/Header.tsx`, `src/pages/Profile.tsx`, `src/App.tsx`

### Важное замечание для агентов
- **Авторизация через почту/Google работает только если на Vercel добавлены env-переменные `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY`**
- Без этих переменных приложение работает в локальном режиме (localStorage only)
- Новые пользователи должны создать профиль через `StudentRegistrationModal` перед использованием


---

## Обновления 2026-06-25 (продолжение)

### Разгрузка главной страницы (TodayPage)
- Сокращён "Быстрый старт" с 6 до 4 карточек (убраны Карточки и Друзья)
- Убраны мини-карточки Достижения и Рейтинг с главной
- Добавлена секция "Социальное" в Dashboard с 4 карточками: Друзья, Достижения, Рейтинг, Карточки
- Файлы: `src/pages/TodayPage.tsx`, `src/pages/Dashboard.tsx`


---

## Обновления 2026-06-25 (продолжение)

### Исправить сохранение прогресса (localStorage persistence)
- Восстановлен `useEffect` для auto-save из `progressStore` в `studentStore` (`App.tsx`)
- `StudentRegistrationModal` теперь проверяет `hasProgress` перед сбросом — не сбрасывает, если уроки уже пройдены
- Добавлено `onRehydrateStorage` в `progressStore` и `studentStore` для диагностики загрузки из `localStorage`
- Файлы: `src/App.tsx`, `src/components/StudentRegistrationModal.tsx`, `src/stores/progressStore.ts`, `src/stores/studentStore.ts`

---

## Обновления 2026-06-28

### Task 9 — массовые исправления explanation'ов (dooshin/task9.ts)
- Исправлено ~40+ explanation'ов: проверочные слова, классификации корней, answers, уточнения в текстах вопросов
- Ключевые фиксы: qd9-54 (цЫпочках, ответ Ы), qd9-59 (загОреть, ответ О), subtitle («чередующийся»), «ненепроверяемый» → «непроверяемый»
- Проверочные слова приведены к ближайшим однокоренным: трЕпетный, умЕрший, плОть, глОтка, обИда, обретАть, дешЁво, пАра, возражЕние, апЕллировать, чЁска, жЁчь, слАдкий, молодОй
- Файл: `src/data/sections/dooshin/task9.ts`

### Task 10 — EGE-формат урок в atomization.ts
- Урок `lesson-atom-10-mixed` переименован в `lesson-atom-10-ege` и заменён на 10 ege-multiple вопросов
- Покрывает приставки: прЕ-/прА-, дО-/дА-, вО-/вА-, нА-/нО-, сЫ-/сУ-, черЕ-/чЕ-, рОз-/рАз-, и др.
- Файл: `src/data/sections/atomization.ts`

### RAG rebuild
- `npm run build:rag` → 1379 entries (0 errors, 268 warnings — известные contradiction в word-generic)
- Файл: `public/data/knowledge-index.json`

---

## Обновления 2026-06-28 (поздняя сессия)

### Task 9 — critical bugfix: 11 вопросов с корнем -гор- (чередующийся гор/гар)
- Исправлена системная ошибка: корень `-гор-` (чередующийся гор/гар) был заменён на `-горе-` (проверяемый) в 11 вопросах от слова «гореть»
- Несуществующие слова: «загеревший», «обгереть», «разгераться», «г_релый», «заг_рающий», «пог_рельцы», «разг_рающийся», «заг_раться», «заг_релый», «г_рячий», «возг_рание»
- Все 11 вопросов (qd9-141, qd9-153, qd9-213, qd9-252, qd9-330, qd9-355, qd9-369, qd9-378, qd9-683, qd9-705, qd9-714) восстановлены к `correctAnswer: ["о"]` и explanation с чередующимся корнем `-гор-`
- Сохранены корректные правки: умерла (умЕреть), шорох (непроверяемый), замарать (мАркий), поджёг (жЕчь), жёсткий (жЕсть), решётка (решЕто), кардинально (иноязычный), вольнолюбивый (вОльный), добираться (собИрать), капюшон (иноязычный)
- Файл: `src/data/sections/dooshin/task9.ts`
- Git: `10f9bc9`

### Task 9 — regression fix (обратный дрейф)
- Обнаружен обратный дрейф: 11 вопросов с корнем `-гор-` вновь получили incorrect `correctAnswer: ["е"]` и explanation `-горе-`, хотя были исправлены в коммите `10f9bc9`
- Файл откачен к состоянию коммита `10f9bc9` через `git checkout HEAD --`
- Git: `958c608`

### Task 10 — синтаксический фикс 41 explanation strings
- Build падал с ошибкой `Expected "}" but found "глухих"` в `src/data/sections/dooshin/task10.ts`
- В 41 explanation'ах приставок без-/бес- одинарная кавычка внутри строки (`согласной'.`) ломала JavaScript-строку
- Все строки обёрнуты в двойные кавычки + точка перенесена внутрь строки
- Файл: `src/data/sections/dooshin/task10.ts`
- Git: `9c50ec8`

### Shkolkovo content — задание 15 (Н/НН) из Дощинского-2026
- Создан раздел `src/data/sections/shkolkovo/` с ~150 вопросами в формате ЕГЭ (ege-multiple) по правилам написания Н/НН
- `src/data/sections/orthographyAll.ts` — добавлен `shkolkovoSections` в импорт и фильтрацию группы "Задание 15"
- `public/data/graph-relations.json` — rebuild с обновлённым timestamp
- Файлы: `src/data/sections/shkolkovo/index.ts`, `task1.ts`, `task15.ts`, `src/data/sections/orthographyAll.ts`
- Git: `143b6dc`

### Cache-bust v6 + content fixes
- `index.html` — cache-bust query parameter v=6 для PWA
- `task9.ts` — 6 исправлений explanation: бесшовный/бесшовные (шьЁт), отдалённый (дАль), выберется/выберешь (выбИрать/выбрать), воспалительный (палитра — непроверяемый)
- `grammar.ts` — упрощены объяснения спряжения
- `task7Questions.ts` — исправлены explanation для "спит" и "слышим"
- `theory/task12.ts` — обновлена теория спряжения
- `theoryTests.ts` — обновлены тестовые вопросы
- `graph-relations.json` и `knowledge-index.json` — rebuild
- Git: `2ee6f6d`

---

## Обновления 2026-06-30

### Task10 fix — correctAnswer qd10-75 (премадонна)
- `src/data/questions/task10_dooshin.ts` — qd10-75 correctAnswer ['и'] → ['е'] (премадонна, не примадонна)
- `src/data/questions/task19.ts` — добавлены записи
- `src/data/questions/task19_dooshin.ts` — 484 новых вопроса (задание 19, Дощинский)
- Git: `68e2f6d`

### Task13/14/16 dooshin content + Task20 move + Leaderboard cleanup
- `src/data/questions/task13_dooshin.ts` — 5,973 вопроса (задание 13, Дощинский)
- `src/data/questions/task14_dooshin.ts` — 12,049 вопросов (задание 14, Дощинский)
- `src/data/questions/task16_dooshin.ts` — 4,823 вопроса (задание 16, Дощинский)
- `src/data/sections/examTasks.ts` — добавлены импорты новых dooshin-файлов
- `src/data/sections/n_nn.ts` — task15 filter cleanup
- `src/data/sections/orthographyAll.ts` — task20 moved to punctuation group
- `src/pages/Leaderboard.tsx` — duplicate user fix v2
- Git: `bf0ebfc`

### Task5/6/11 dooshin + GrowthTimeline fix + Legacy cleanup
- `src/data/questions/task5_dooshin.ts` — 1,969 вопросов (задание 5, Дощинский)
- `src/data/questions/task6_dooshin.ts` — 1,857 вопросов (задание 6, Дощинский)
- `src/data/questions/task11.ts` — дополнен вопросами
- `src/components/GrowthTimeline.tsx` — fix recharts scale error (reset progressIndex, guard <2 data points)
- `src/data/hints.ts` — обновлены подсказки
- `src/pages/Task10Trainer.tsx` — обновления для task10
- `src/stores/task10Store.ts` — обновления store
- Удалены legacy: `src/data/atomization/task10Questions.ts`, `src/data/task1Questions.json`, `src/data/task2Questions.json`, `src/data/task3Questions.json`, `src/data/task17Questions.json`
- Git: `2fb67a6`

### Task14 cleanup — garbage removal + NI/NE fix
- `src/data/questions/task14.ts` — удалены garbage questions (t14-* prefix — task10, q14-1..20 — task13 NI/NE)
- `src/data/sections/grammar.ts` — lesson-gram-14-1 переименован в lesson-gram-13-2 (title: "Задание 13. НИ- и НЕ-")
- `src/data/sections/orthographyAll.ts` — subtitle group-task14 исправлен с "НИ и НЕ" на "Слитное, раздельное и дефисное написание"
- Git: `8d65ac2`

### Leaderboard duplicate fix
- `src/pages/Leaderboard.tsx` — предотвращение дублирования пользователя, уже в Supabase leaderboard
- `supabase/migrations/005_leaderboard_rpc.sql` — обновлён get_leaderboard RPC
- Git: `7b82511`

# ЕГЭ Русский — Подготовка к экзамену

Интерактивная платформа для подготовки к ЕГЭ по русскому языку в формате Duolingo.

## 🚀 Запуск

### Для пользователя (production)
Дважды кликни **`Запуск ЕГЭ.bat`** — соберёт приложение и откроет сервер на http://localhost:4173/

### Для разработки
Дважды кликни **`Разработка.bat`** — запустит dev-сервер на http://localhost:5173/ с hot reload

## ✨ Возможности

- 📚 **Карта курса** — визуальная дорожка с уроками и прогрессом
- ❤️ **Система сердечек** — 5 жизней, восстанавливаются каждые 4 часа
- 📊 **Статистика** — графики, слабые места, прогресс по атомам
- 👨‍🏫 **Режим учителя** — отслеживание учеников
- 🔬 **Атомизация** — диагностика ошибок до уровня "ПРЕ-/ПРИ- словарные"
- 🏆 **Рейтинг и достижения** — геймификация обучения
- 💾 **PWA** — работает offline, устанавливается на телефон

## 🛠 Стек

React 18 + Vite + TypeScript + Tailwind CSS + Zustand + Framer Motion + Recharts

## 📋 Git Hooks — Валидация заданий

Перед каждым коммитом автоматически проверяются задания ЕГЭ №9 (чередование гласных в корне):
- корректность `correctAnswer` (одна буква)
- наличие пропущенной буквы (`_` или `..`)
- длина и качество `explanation` (минимум 20 символов, без шаблонных фраз)

### Установка hooks (один раз после клонирования)
```bash
npm run install:hooks
```

### Ручная проверка в любой момент
```bash
npm run validate:task9
```

Если валидация не пройдена — коммит будет отменён с описанием ошибок. Исправь задания и повтори коммит.

## 📊 Unified Error Tracking

Система агрегации ошибок учащихся для персонализации и аналитики:

- **Canonical Word ID** — одно слово из разных источников (курс, банк, тренажёр) имеет один ID
- **Rule ID** — каждая ошибка связана с конкретным правилом (например, `alternation_blist_blest`)
- **answerHistory** синхронизируется с Supabase — данные не теряются при смене устройства
- **Преподаватель** видит агрегированные ошибки учеников: проблемные слова и правила

### Как это работает

Когда ученик ошибается в слове "блестать" (вопрос `q9-1`) и потом в том же слове "блестать" (вопрос `qd9-515`), система знает, что это **одно и то же слово** и агрегирует ошибки:

```
Ученик Иван:
  Слово "блестать" — 3 ошибки
  Правило "alternation_blist_blest" — 5 ошибок (вкл. блистать, блистательный)
```

### SQL-миграции Supabase

Применить миграции в Supabase Dashboard → SQL Editor:

```bash
# 1. Создать таблицы для аналитики
supabase/migrations/001_unified_tracking.sql

# 2. Включить RLS для учителей и учеников
supabase/migrations/002_rls_policies.sql
```

## 📁 Структура


```
src/
  components/     # QuestionCard, LessonResult, Hearts, Header
    teacher/      # StudentErrorAnalytics — аналитика ошибок учеников
  pages/          # Dashboard, CourseMap, Lesson, Statistics, Leaderboard, Teacher, Profile
  stores/         # progressStore.ts (Zustand + persist)
    teacherAnalyticsStore.ts  # Аналитика для преподавателя
  data/
    sections/     # orthography.ts, punctuation.ts, grammar.ts
    atomization/  # atoms.ts, atomizedWords.json
    questionMapping.ts  # Unified mapping слов → questionIds
    rules/        # task9-rules.json — правила с каноническими ID
  types/          # TypeScript интерфейсы
  lib/            # Supabase клиент
supabase/
  migrations/     # SQL-миграции для аналитики и RLS
```
// trigger deploy
// trigger deploy 1781902522

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

## 📁 Структура

```
src/
  components/     # QuestionCard, LessonResult, Hearts, Header
  pages/          # Dashboard, CourseMap, Lesson, Statistics, Leaderboard, Teacher, Profile
  stores/         # progressStore.ts (Zustand + persist)
  data/
    sections/     # orthography.ts, punctuation.ts, grammar.ts
    atomization/  # atoms.ts, atomizedWords.json
  types/          # TypeScript интерфейсы
  lib/            # Supabase клиент
```

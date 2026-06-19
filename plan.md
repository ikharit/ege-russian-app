# План: Полноценное приложение для подготовки к ЕГЭ по русскому языку

## Этап 1: ML-Адаптивность (Smart Learning Engine) — PRIORITY
**Цель:** Персонализированные рекомендации уроков на основе данных о прогрессе
- Создать `adaptiveEngine.ts` — алгоритм оценки слабых тем, learning curve, forgetting curve
- Улучшить `WhatToStudyToday` — smart recommendations вместо random
- Добавить "Smart Path" карточку в Dashboard
- Алгоритм: учитывать accuracy по заданиям, время ответа, частоту ошибок, дни с последней практики
- Скилл: `report-writing` (для алгоритма) + `coder` (для имплементации)

## Этап 2: Система классов (Classroom System) — PRIORITY
**Цель:** Учитель создаёт класс, ученики присоединяются по коду
- Создать `classStore.ts` — Zustand store для классов (localStorage + Firebase-ready)
- Создать `TeacherClassroom.tsx` — управление классом, invite codes, прогресс учеников
- Создать `JoinClass.tsx` — страница для ученика (ввод кода)
- Обновить `ChallengesPage` — классовый лидерборд (не только локальные профили)
- Скилл: `coder` + `plan` (для архитектуры)

## Этап 3: Firebase Backend — Sync & Auth
**Цель:** Облачная синхронизация прогресса между устройствами
- Создать `firebaseStore.ts` — CRUD с localStorage fallback
- Auth: anonymous + Google (optional)
- Cloud Firestore: users, classes, progress, homework
- Offline support: sync when online
- Скилл: `coder` (Firebase SDK integration)

## Этап 4: ФИПИ Варианты (Real Exam Variants)
**Цель:** Структурированные варианты ЕГЭ с реальными вопросами
- Создать `fipiVariants.ts` — 5-10 вариантов ЕГЭ (структура: 26 заданий)
- Создать `ExamVariantPage.tsx` — прохождение варианта под таймер
- Результаты: баллы, primary/secondary, сравнение с порогом
- Скилл: `deep-research-swarm` (для поиска реальных вариантов) + `coder`

## Этап 5: Задания 17-26 + Сочинение
**Цель:** Полное покрытие всех заданий ЕГЭ
- Задания 17-26: речевые ошибки, пунктуация, лексика, грамматика
- Сочинение: 15 тем, критерии оценки, чеклист
- Скилл: `deep-research-swarm` (для контента) + `coder`

---

## Порядок выполнения
1. Этап 1 + Этап 2 параллельно (независимые)
2. Этап 3 (зависит от Этапа 2 — структура классов)
3. Этап 4 + Этап 5 параллельно (независимые, контент-heavy)

## Агенты
- `Адаптивность_Разработчик` — ML-Engine + UI
- `Классы_Разработчик` — Classroom System
- `Контент_Исследователь` — ФИПИ + задания 17-26 (позже)

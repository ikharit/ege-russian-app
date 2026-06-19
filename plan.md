# План: IRT + Error Pattern Analysis

## Этап 1: Типы
- Обновить `src/types/index.ts`: добавить `difficulty?: number`, `errorType?: string` в `Question`, создать `AnswerHistory` и связанные типы.

## Этап 2: Движки
- Создать `src/utils/irtEngine.ts` — Rasch 1PL модель, updateAbility, selectNextQuestion, calibrateDifficulty.
- Создать `src/utils/errorPatternAnalyzer.ts` — detectErrorType для заданий 5, 9, 10, 16, analyzeErrors, confidence scoring.

## Этап 3: Хранилище
- Обновить `src/stores/progressStore.ts` — добавить `answerHistory`, записывать при каждом ответе, добавить `getErrorAnalysis()`.
- Обновить `src/stores/slices/lessonAnalyticsSlice.ts` — записывать `answerHistory` при правильных/неправильных ответах.

## Этап 4: Адаптивный движок
- Обновить `src/utils/adaptiveEngine.ts` — интегрировать `selectNextQuestion` из IRT, добавить error-specific приоритет в рекомендации.

## Этап 5: Страницы
- Создать `src/pages/ErrorAnalysisPage.tsx` — топ-5 паттернов, рекомендации, график accuracy (recharts), кнопка "Тренировать".
- Обновить `src/pages/MistakesReview.tsx` — группировать по `errorType`, показывать инсайты.

## Этап 6: Маршрутизация
- Обновить `src/App.tsx` — добавить `/error-analysis`.

## Этап 7: Проверка сборки
- `npm run build` — проверить отсутствие ошибок TypeScript.

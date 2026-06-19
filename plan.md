# Plan: ФИПИ Exam Variant System

## Stage 1 — Data Layer
1. Create `src/data/fipiVariants.ts`
   - Define types: `FipiVariant`, `FipiTask`, `ExamResult`
   - Create 5 variants with 15 tasks each (tasks 4-16, 26)
   - Map each task to existing data sources
   - Export helper functions to load questions for a task

## Stage 2 — State Layer
2. Update `src/stores/progressStore.ts`
   - Add `examResults: ExamResult[]` to state
   - Add `saveExamResult`, `getExamResults`, `getBestExamResult` actions
   - Update `importProgress` to merge exam results

## Stage 3 — Pages (independent)
3. Create `src/pages/ExamVariantsList.tsx`
   - Card grid showing 5 variants
   - Difficulty badge, time limit, completion status
   - Best result display
   - "Начать" button → `/exam/:variantId`

4. Create `src/pages/ExamVariantPage.tsx`
   - Timer (useEffect + setInterval, MM:SS format)
   - Task navigation with progress bar
   - Generic question renderer supporting all task types
   - Skip button (0 points)
   - "Завершить досрочно" button
   - Auto-submit on timer expiry
   - Navigate to results on completion

5. Create `src/pages/ExamResultsPage.tsx`
   - Primary and test scores
   - Pass threshold analysis (36/60/80)
   - Per-task breakdown with correct/incorrect
   - Weak topics with links to lessons
   - "Пройти ещё раз" / "Следующий вариант" buttons

## Stage 4 — Integration
6. Update `src/App.tsx`
   - Add routes: `/exam`, `/exam/:variantId`, `/exam/:variantId/results`
   - Update `isLesson` check to include exam routes

7. Update `src/pages/Dashboard.tsx`
   - Add "Варианты ЕГЭ" card between Trainers and Games
   - Show next uncompleted variant
   - Progress (X of Y completed)

## Stage 5 — Build Verification
8. Run `cmd //c "npm run build"` and fix any TS errors

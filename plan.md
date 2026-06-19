# ML/RAG Deep Dive Plan

## Overview
Implement 5 ML-adjacent improvements to the EGE Russian app, ordered by impact/effort.

## Stage 1 — Parallel (Independent)

### Worker_1: ML Predictive Score (Linear Regression)
**File:** `src/utils/predictiveScore.ts`
**Goal:** Replace rule-based prediction with online trainable linear regression.
**Features:** per-task accuracy, streak, total answered, SRS due count, weak atom count, days to exam.
**Training:** Online gradient descent on each exam result (compare predicted vs actual, update weights).
**Output:** Updated `predictiveScore.ts` + `ProgressState` integration.

### Worker_2: Semantic RAG (TF-IDF + Fuse Hybrid)
**File:** `src/lib/rag.ts`
**Goal:** Add local TF-IDF semantic search on top of existing fuse.js fuzzy search.
**Implementation:**
- Build TF-IDF vectors for all 1061 entries at load time.
- Vectorize query, compute cosine similarity.
- Hybrid ranking: 0.5 * TF-IDF score + 0.5 * (1 - fuse score).
**Output:** Updated `rag.ts` with `buildTFIDF()` and `retrieveSemantic()`.

### Worker_3: Error Pattern Clustering
**Files:** `src/utils/errorPatternAnalyzer.ts`, `src/components/BaseTrainer.tsx`
**Goal:** Surface systematic error patterns to the user.
**Implementation:**
- Aggregate wrong answers by `errorType` (from `question.errorType` or inferred from `taskNumber` + `atoms`).
- Show a card: «У вас систематическая ошибка: {pattern}. Вот 3 урока на эту тему».
**Output:** Updated `errorPatternAnalyzer.ts` + new UI card in `BaseTrainer` or `Dashboard`.

### Worker_4: IRT Engine (Item Response Theory)
**Files:** `src/utils/irtEngine.ts` (new), `src/components/BaseTrainer.tsx`
**Goal:** Estimate student ability θ and select questions where P(correct) ≈ 0.6.
**Implementation:**
- `IRTEngine` class: maintains θ, updates after each answer (Bayesian or Elo-like).
- `selectQuestion(questions, θ)` → returns question with difficulty closest to θ + 0.4 (for 60% success rate).
- Integrate into `BaseTrainer` shuffling logic.
**Formula:** P(correct) = 1 / (1 + e^(-(θ - b)))
**Output:** New `irtEngine.ts` + `BaseTrainer` integration.

## Stage 2 — Sequential (Depends on Stage 1 progress)

### Worker_5: Bayesian Knowledge Tracing (BKT) for Atoms
**Files:** `src/utils/bktEngine.ts` (new), `src/stores/progressStore.ts`
**Goal:** Track P(knows atom) for each atom and recommend lessons accordingly.
**Implementation:**
- `BKTModel` class: 4 parameters per atom (P(L0), P(T), P(G), P(S)).
- Update after each atom-tagged question.
- Integrate into `getWeakAtoms()` for adaptive recommendations.
**Output:** New `bktEngine.ts` + integration into `progressStore`.

## Validation
- After each stage: `npm run build` must pass.
- After Stage 1: `npm run validate:rag` must still pass (0 errors).
- After all: `npm run test` (if tests exist).

# ML/RAG + New Tasks + UX Plan

## Stage 1 — Parallel (Independent)

### Worker_1: Scrape Школково (tasks 1,2,3,7,8,18,22,24,25,26)
**Goal:** Scrape real EGE tasks from schools.by (or fipi.ru) and convert to JSON question banks.
**Tasks to scrape:** 1, 2, 3, 7, 8 (grammar), 18, 22, 24 (reading), 25, 26 (essay/summary).
**Output:** `src/data/task1Questions.json`, `task2Questions.json`, etc.
**Method:** Kimi WebBridge — navigate, extract text, structure into JSON.

### Worker_2: Web Speech API for Task 4 (Accents)
**File:** `src/components/AccentTrainer.tsx` (or BaseTrainer if unified)
**Goal:** Add TTS button that pronounces the word with correct stress using `speechSynthesis`.
**Implementation:**
- Add `speak(word: string)` function using `window.speechSynthesis` with `ru-RU` voice.
- Add speaker icon next to each word in accent trainer.
- Cache voice list to avoid re-querying.
**Output:** Updated trainer component + new `src/lib/tts.ts` utility.

### Worker_3: Gamification (Combo + League)
**Files:** `src/stores/progressStore.ts`, `src/components/ComboCounter.tsx` (new), `src/components/LeagueWidget.tsx` (new)
**Goal:** 
- Combo streak: XP multiplier (1.0x → 1.5x for 5+ correct in a row). Show floating combo counter.
- League system: Bronze → Silver → Gold → Diamond based on weekly XP. Extend existing "лычки" (badges).
**Output:** Updated stores + new UI components.

### Worker_4: Mobile UX
**Files:** `src/components/BaseTrainer.tsx`, `src/components/BottomSheet.tsx` (new), `src/App.css`
**Goal:**
- Bottom sheet for settings (swipe up from bottom on mobile, instead of modal).
- Swipe left/right on question cards (next/prev).
- Pull-to-refresh on Dashboard for sync.
**Output:** Updated components + new BottomSheet component.

## Stage 2 — Integration
- Integrate scraped questions into existing trainer infrastructure (BaseTrainer or new page components).
- Add reading tasks (18, 22, 24) as new page components with text viewer + question sidebar.
- Add essay constructor (25, 26) as new page component.

## Validation
- After each worker: `npm run build` must pass.
- After all: `npm run validate:rag` must still pass.

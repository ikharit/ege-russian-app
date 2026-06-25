# SpellEngine Development Plan

## Stage 1: Foundation — Types & Dictionary
- Create `src/types/spellEngine.ts` — interfaces for SpellCheckResult, SpellRule, SpellEngine
- Create `src/data/spellDictionary.ts` — build dictionary from existing data files
  - Extract all answer words from task9-16 questions, accentWords, task5, examTasks
  - Add top-200 frequent Russian words
  - Add exception map (пловец, etc.)
  - Export `spellDictionary` Set + `isInDictionary(word)` + `getWordForms(base)`

## Stage 2: Rules Engine
- Create `src/data/spellRules.ts` — 50+ SpellRule objects
  - 10 alternating roots (плав/плов, блист/блест, мир/мер, etc.)
  - 20 prefix rules (без/бес, раз/рас, пре/при, etc.)
  - 10 silent consonants (солнце, чувство, etc.)
  - 10 punctuation rules (introductory words, subordinate clauses, etc.)
  - 10 paronym rules (эффективный/эффектный, etc.)
  - 10 grammar rules (связанный с, etc.)
  - 10 borrowed-word spelling rules (директорский, etc.)
- Create `src/utils/spellEngine.ts` — implementation
  - `checkText(text)` — run all rules, return SpellCheckResult[]
  - `checkWord(word)` — dictionary + rule check
  - `isInDictionary(word)` — O(1) Set lookup
  - `getWordForms(baseWord)` — basic Russian morphology (simple suffixes)

## Stage 3: Question Validator & Audit
- Create `src/utils/questionValidator.ts` — validateAllQuestions()
  - Load all question sources
  - Check: missing explanation, duplicate options, double spaces, cyclic explanation, rule conflicts
- Create `src/utils/auditRunner.ts` — runFullAudit()
  - Calls validator, outputs JSON stats + markdown report

## Stage 4: Integration
- Modify `src/components/QuestionCard.tsx`
  - Add useEffect to run spellEngine.checkText(question.text) on mount
  - Show dev-only warning badge if potential issue detected
- Verify no existing functionality broken

## Stage 5: Build Verification
- Run `cmd //c "npm run build"`
- Fix any TS errors
- Deliver final report

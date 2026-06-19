# 🤖 AGENTS.md — Instructions for AI Agents

## RAG Pipeline (Anti-Hallucination Guard)

All agents working on this project MUST use the RAG pipeline. NEVER generate rules, explanations, or questions from memory alone.

### 1. Sources of Truth

| File | Content | Status |
|------|---------|--------|
| `src/data/theory/*.ts` | Verified theory rules per task | ✅ Primary |
| `src/data/explanations/*.json` | Word-specific explanations | ✅ Secondary |
| `public/data/knowledge-index.json` | Unified RAG index (auto-built) | ✅ Generated |
| `src/data/sections/dooshin*.ts` | Real exam questions | ✅ Reference |
| Your own knowledge | — | ❌ NEVER USE |

### 2. RAG Retriever

```typescript
import { ragRetriever, generateExplanation, buildRAGPrompt, verifyExplanation } from '../lib/rag'

// Before generating anything, retrieve rules
const results = ragRetriever.retrieve(query, taskNumber, 3)

// Generate explanation based ONLY on retrieved rules
const explanation = generateExplanation(word, correctAnswer, results)

// Verify no contradictions
const { valid, issues } = verifyExplanation(word, generatedExplanation, results)
if (!valid) throw new Error(`Hallucination detected: ${issues.join(', ')}`)
```

### 3. Workflow for Adding Questions

```
1. Retrieve rules for task → ragRetriever.retrieve(taskNumber)
2. Check existing questions → read dooshin/task{task}.ts
3. Generate questions using ONLY retrieved rules as context
4. Verify each question's correctAnswer matches rule
5. Add to section file with proper atoms: ['task{N}', '...']
6. Run npm run build:rag to rebuild index
7. Run npm run validate:questions to validate
8. Commit
```

### 4. Workflow for Adding Explanations

```
1. Retrieve word-specific rules → ragRetriever.retrieve(word, taskNumber)
2. If word exists in explanations/*.json → use that
3. If not → generate from retrieved rule ONLY
4. Verify with verifyExplanation()
5. Add to explanations/*.json (if word-specific) or theory/*.ts (if rule)
6. Run npm run build:rag
7. Commit
```

### 5. Forbidden Patterns

❌ **Never do:**
- Make up a grammar rule that doesn't exist in theory files
- Create an explanation without checking the knowledge base first
- Add a question where the correct answer contradicts the retrieved rule
- Edit theory files without adding `relatedAtoms` to rules
- Delete or overwrite existing `explanations/*.json` files without checking

### 6. Safe Patterns

✅ **Always do:**
- Check `src/data/theory/` first for existing rules
- Use `buildRAGPrompt()` to generate prompts with context
- Add `relatedAtoms` to every new `TheoryRule`
- Run `npm run build:rag` after any data change
- Run `npm run validate:questions` after adding questions
- Update `memory/YYYY-MM-DD.md` with what you did

### 7. Critical Files — Check Before Editing

| File | Why Critical | Check With |
|------|-------------|------------|
| `src/data/theory/*.ts` | Other agents may have added rules | `git diff` |
| `src/data/explanations/*.json` | Other agents may have added words | Read file |
| `src/data/sections/dooshin*.ts` | Other agents may have added questions | `git log` |
| `src/data/sections/*_all.ts` | Aggregated data, may be auto-generated | Check generator scripts |

### 8. Rebuild RAG Index

After ANY change to theory, explanations, or sections:

```bash
npm run build:rag
```

This rebuilds `public/data/knowledge-index.json` with all verified rules.

### 9. When in Doubt

If you can't find a rule in the knowledge base:
1. Search `src/data/theory/` for similar rules
2. Check `src/data/explanations/` for word-specific info
3. If still not found → ASK the human, don't make it up
4. Add verified info to the appropriate file and rebuild index

---

Last updated: 2026-06-20 by agent
- **Task9 coverage**: 713/769 words (93%) have word-specific explanations via `rootDictionary` + `wordExplanations.json`. 324 remaining words need manual root analysis (mostly foreign/indeclinable roots).
- **RAG index**: 869 entries (89 theory rules + 780 word explanations). Rebuild with `npm run build:rag` after any data change.
- **Dashboard accordion**: Разделы курса в Dashboard.tsx теперь сворачивающиеся (accordion) с анимацией Framer Motion. Клик по заголовку раскрывает список уроков с статусом (✓/id, цвета, bestScore%).
- **Sound effects**: `src/lib/sounds.ts` — Web Audio API synth sounds (correct/wrong/lessonComplete/combo/XPup/achievement). Mute toggle через `useSettingsStore`. Новые звуки: `playXPUpSound()`, `playAchievementSound()`.
- **Dark mode**: Tailwind `darkMode: 'class'` + `document.documentElement.classList.toggle('dark')` в App.tsx. Переключатель в Profile: light/dark/system. Добавлены `dark:` классы в BottomNav и App root.
- **Export/Import v2**: Полный backup всех stores (progress, student, class, studyPlan, settings). Формат `version: 2`. Profile.tsx кнопки экспорта/импорта обновлены.
- **Duel system**: `src/stores/duelStore.ts` + `src/pages/DuelPage.tsx`. Offline-first: создаёшь дуэль (6-значный код), друг вводит код → 5 случайных вопросов → оба решают offline → результат при сравнении. Карточка в Dashboard. Роут `/duel`.
- **RAG explanations**: Уже интегрированы в `QuestionCard.tsx` (строки 192-227). При неправильном ответе показывает `ragRetriever.retrieve()` + `generateExplanation()` + `TheoryQuickReference`.
- **Teacher class card**: В Dashboard.tsx добавлена карточка "Мои классы" для учителя (`isTeacher`) — ведёт на `/teacher/classroom`.
- **Class system UX**: Проверено — `TeacherClassroom.tsx` уже содержит полный UI создания класса, inviteCode, копирование, удаление, табы (ученики/ДЗ/лидерборд).

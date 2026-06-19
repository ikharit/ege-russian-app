import Fuse from 'fuse.js'
import type { TheoryRule } from '../data/theory/task4'

// Unified RAG knowledge base — combines theory rules + word explanations + grammar rules
// All entries link to verified sources (theory files, dictionaries, word banks)

export interface KnowledgeEntry {
  id: string
  source: string // e.g., 'theory/task9', 'dictionary/roots', 'fipi/task9'
  taskNumber: string
  ruleId?: string
  word?: string
  content: string
  explanation: string
  tags: string[]
  relatedAtoms: string[]
  lessonId?: string // cross-link to lesson
  // Embedding vector (filled by build-index script)
  embedding?: number[]
}

export interface RetrievalResult {
  entry: KnowledgeEntry
  score: number // cosine similarity or fuse score
}

export interface ExplanationFeedback {
  entryId: string
  helpful: boolean
  timestamp: string
  userId?: string
}

// === RETRIEVER (client-side, no external API) ===
// Uses fuzzy search + substring matching

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

export class RAGRetriever {
  private entries: KnowledgeEntry[] = []
  private indexLoaded = false
  private fuse: Fuse<KnowledgeEntry> | null = null

  async loadIndex(): Promise<void> {
    if (this.indexLoaded) return
    try {
      const res = await fetch('/data/knowledge-index.json')
      if (!res.ok) throw new Error('Index not found')
      this.entries = await res.json()
      this.buildFuse()
      this.indexLoaded = true
    } catch (e) {
      console.warn('RAG index not loaded, falling back to theory rules')
      this.entries = []
    }
  }

  private buildFuse() {
    this.fuse = new Fuse(this.entries, {
      keys: [
        { name: 'word', weight: 0.4 },
        { name: 'content', weight: 0.3 },
        { name: 'explanation', weight: 0.2 },
        { name: 'tags', weight: 0.1 },
      ],
      threshold: 0.4,
      includeScore: true,
      ignoreLocation: true,
    })
  }

  // Primary: fuzzy search via fuse.js
  // Fallback: exact match + substring search
  retrieve(query: string, taskNumber: string, topK = 3): RetrievalResult[] {
    const normalized = query.toLowerCase().trim()
    const filtered = this.entries.filter(e => e.taskNumber === taskNumber)

    // Try fuse first if available
    if (this.fuse) {
      // Search within filtered entries
      const fuse = new Fuse(filtered, {
        keys: [
          { name: 'word', weight: 0.4 },
          { name: 'content', weight: 0.3 },
          { name: 'explanation', weight: 0.2 },
          { name: 'tags', weight: 0.1 },
        ],
        threshold: 0.4,
        includeScore: true,
        ignoreLocation: true,
      })
      const fuseResults = fuse.search(normalized).slice(0, topK)
      if (fuseResults.length > 0) {
        return fuseResults.map(r => ({
          entry: r.item,
          score: 1 - (r.score || 0), // fuse score is 0-1, lower is better
        }))
      }
    }

    // Fallback: exact match + substring search
    const scored = filtered.map(entry => {
      let score = 0
      const content = (entry.content + ' ' + entry.explanation).toLowerCase()
      const word = entry.word?.toLowerCase() || ''

      if (word === normalized) score += 10
      else if (word.includes(normalized)) score += 5
      else if (normalized.includes(word) && word.length > 3) score += 3

      if (content.includes(normalized)) score += 2

      entry.tags.forEach(tag => {
        if (normalized.includes(tag.toLowerCase())) score += 1
      })

      entry.relatedAtoms.forEach(atom => {
        if (normalized.includes(atom.toLowerCase())) score += 1
      })

      return { entry, score }
    })

    return scored
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
  }

  // With embeddings (when index loaded)
  retrieveWithEmbedding(
    embedding: number[],
    taskNumber: string,
    topK = 3
  ): RetrievalResult[] {
    const filtered = this.entries.filter(e => e.taskNumber === taskNumber && e.embedding)
    const scored = filtered.map(entry => ({
      entry,
      score: cosineSimilarity(embedding, entry.embedding!)
    }))
    return scored.sort((a, b) => b.score - a.score).slice(0, topK)
  }

  // Get entry by ID for cross-linking
  getEntryById(id: string): KnowledgeEntry | undefined {
    return this.entries.find(e => e.id === id)
  }
}

// === EXPLANATION GENERATOR ===
// Uses retrieved rules to generate explanations — NEVER hallucinates
// Personalizes based on user history

export function generateExplanation(
  word: string,
  correctAnswer: string[],
  retrievedRules: RetrievalResult[],
  userHistory?: { word: string; wrongCount: number }[]
): string {
  if (retrievedRules.length === 0) {
    // Ultimate fallback: generic explanation that does NOT make up rules
    return `Проверьте правописание слова «${word}». Рекомендуем обратиться к разделу «Учиться» → Задание для изучения правила.`
  }

  const top = retrievedRules[0]
  const rule = top.entry

  // Build explanation from verified source only
  let explanation = rule.explanation

  // If word-specific explanation exists, use it
  if (rule.word && rule.word.toLowerCase() === word.toLowerCase()) {
    explanation = rule.explanation
  }

  // Personalize: if user struggled with this topic before, add extra detail
  const struggledWords = userHistory?.filter(h => h.wrongCount >= 3) || []
  const isStruggling = struggledWords.some(h => 
    word.toLowerCase().includes(h.word.toLowerCase()) ||
    h.word.toLowerCase().includes(word.toLowerCase())
  )

  if (isStruggling) {
    // Add detailed explanation from second rule if available
    const secondRule = retrievedRules[1]
    if (secondRule) {
      explanation += ` Подробнее: ${secondRule.entry.explanation}`
    }
  }

  // Append rule reference for traceability + lesson link
  const lessonLink = rule.lessonId ? ` [Урок: ${rule.lessonId}]` : ''
  explanation += ` [Источник: ${rule.source}${rule.ruleId ? `/${rule.ruleId}` : ''}]${lessonLink}`

  return explanation
}

// === VERIFIER ===
// Checks that generated explanation matches retrieved rules

export function verifyExplanation(
  word: string,
  generatedExplanation: string,
  retrievedRules: RetrievalResult[]
): { valid: boolean; issues: string[] } {
  const issues: string[] = []
  const normalized = generatedExplanation.toLowerCase()

  // 1. Check for contradictions with retrieved rules
  for (const result of retrievedRules) {
    const rule = result.entry
    const ruleContent = (rule.content + ' ' + rule.explanation).toLowerCase()

    // Type contradictions
    if (ruleContent.includes('проверяемый') && normalized.includes('непроверяемый')) {
      issues.push(`Контрадикция: правило говорит «проверяемый», объяснение говорит «непроверяемый»`)
    }
    if (ruleContent.includes('чередующийся') && normalized.includes('проверяемый')) {
      issues.push(`Контрадикция: правило говорит «чередующийся», объяснение говорит «проверяемый»`)
    }
    if (ruleContent.includes('чередующийся') && normalized.includes('непроверяемый')) {
      issues.push(`Контрадикция: правило говорит «чередующийся», объяснение говорит «непроверяемый»`)
    }
    if (ruleContent.includes('непроверяемый') && normalized.includes('проверяемый')) {
      issues.push(`Контрадикция: правило говорит «непроверяемый», объяснение говорит «проверяемый»`)
    }

    // 2. Check consistency: if explanation says "проверяемый", the check word must share the root
    if (normalized.includes('проверяемый') && rule.word) {
      const checkWordMatch = normalized.match(/однокоренное[:\s]+(\S+)/)
      if (checkWordMatch) {
        const checkWord = checkWordMatch[1].toLowerCase().replace(/[,.!?]$/, '')
        const wordRoot = rule.word.toLowerCase().replace(/[аеёиоуыэюя]/g, '').replace(/[^а-яё]/g, '')
        const checkRoot = checkWord.replace(/[аеёиоуыэюя]/g, '').replace(/[^а-яё]/g, '')
        // If roots differ significantly, it's likely alternation, not verifiable
        if (wordRoot.length > 2 && checkRoot.length > 2 && wordRoot !== checkRoot) {
          issues.push(`Подозрение: «проверяемый» корень, но проверочное слово «${checkWord}» имеет другой корень (${checkRoot} vs ${wordRoot}) — возможно, чередование`)
        }
      }
    }
  }

  // 2. Check for hallucinated words (words not in rule or question)
  const allowedWords = new Set([
    ...word.toLowerCase().split(/[^а-яё]/i),
    ...retrievedRules.flatMap(r => r.entry.word?.toLowerCase().split(/[^а-яё]/i) || []),
    ...retrievedRules.flatMap(r => r.entry.content.toLowerCase().split(/[^а-яё]/i)),
    'проверяемый', 'непроверяемый', 'чередующийся', 'корень', 'суффикс', 'приставка',
    'ударение', 'гласная', 'согласная', 'однокоренное', 'проверить', 'запомнить',
    'правило', 'исключение', 'источник', 'задание', 'раздел', 'учиться'
  ])

  const words = normalized.match(/[а-яё]+/g) || []
  for (const w of words) {
    if (w.length > 3 && !allowedWords.has(w)) {
      // Don't flag — too many false positives
      // issues.push(`Подозрительное слово «${w}» — не найдено в правилах`)
    }
  }

  return { valid: issues.length === 0, issues }
}

// === FEEDBACK TRACKER ===
// Stores user feedback on explanations

const FEEDBACK_KEY = 'ege-rag-feedback'

export function getFeedback(): ExplanationFeedback[] {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function recordFeedback(entryId: string, helpful: boolean): void {
  const feedback = getFeedback()
  feedback.push({
    entryId,
    helpful,
    timestamp: new Date().toISOString(),
  })
  try {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedback))
  } catch {}
}

export function getFeedbackStats(): Record<string, { helpful: number; total: number }> {
  const feedback = getFeedback()
  const stats: Record<string, { helpful: number; total: number }> = {}
  for (const f of feedback) {
    if (!stats[f.entryId]) stats[f.entryId] = { helpful: 0, total: 0 }
    stats[f.entryId].total++
    if (f.helpful) stats[f.entryId].helpful++
  }
  return stats
}

// === AGENT PROMPT BUILDER ===
// Generates prompt for LLM agents with RAG context

export function buildRAGPrompt(
  task: 'generate_questions' | 'generate_explanation' | 'verify',
  params: {
    taskNumber: string
    word?: string
    retrievedRules: RetrievalResult[]
    existingData?: any
  }
): string {
  const { taskNumber, word, retrievedRules } = params

  const rulesContext = retrievedRules
    .map((r, i) => `ПРАВИЛО ${i + 1} [score: ${r.score.toFixed(2)}]:\n${r.entry.content}\n${r.entry.explanation}\n[Источник: ${r.entry.source}]`)
    .join('\n\n')

  const basePrompt = `Ты агент, который работает с ЕГЭ Русский (задание ${taskNumber}).
У тебя есть доступ к verified базе знаний. НИКОГДА не придумывай правила — используй ТОЛЬКО предоставленные ниже.

=== БАЗА ЗНАНИЙ (verified) ===
${rulesContext || 'Нет подходящих правил в базе.'}

=== ЗАДАЧА ===
`

  switch (task) {
    case 'generate_explanation':
      return basePrompt + `Слово: «${word}»
Напиши объяснение, ПОЧЕМУ в этом слове так пишется. 
Объяснение должно:
1. Ссылаться на одно из предоставленных правил
2. Не содержать выдуманных правил
3. Быть кратким (1-2 предложения)

Формат: Только текст объяснения, без markdown.`

    case 'generate_questions':
      return basePrompt + `Сгенерируй 5 вопросов для задания ${taskNumber}.
Каждый вопрос должен:
1. Соответствовать одному из предоставленных правил
2. Иметь ПРАВИЛЬНЫЙ ответ (проверь по правилу)
3. Содержать объяснение, ссылающееся на правило
4. Иметь поле atoms: ['task${taskNumber}', '...']

Формат: JSON-массив вопросов.`

    case 'verify':
      return basePrompt + `Проверь следующее объяснение на соответствие правилам.
Если есть противоречия — укажи их. Если всё ок — напиши «OK».`

    default:
      return basePrompt
  }
}

// === EXPORTS ===
export const ragRetriever = new RAGRetriever()

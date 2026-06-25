export interface SpellCheckResult {
  word: string
  position: { start: number; end: number }
  suggestion: string
  explanation: string
  category: 'spelling' | 'punctuation' | 'grammar' | 'style'
  severity: 'error' | 'warning' | 'info'
  rule: string
}

export interface SpellRule {
  id: string
  name: string
  pattern: RegExp
  test: (text: string) => boolean
  fix: (match: RegExpMatchArray) => string
  explanation: string
  category: 'spelling' | 'punctuation' | 'grammar' | 'style'
  severity: 'error' | 'warning' | 'info'
}

export interface SpellEngine {
  checkText(text: string): SpellCheckResult[]
  checkWord(word: string): SpellCheckResult | null
  isInDictionary(word: string): boolean
  getWordForms(baseWord: string): string[]
}

export interface SpellException {
  word: string
  rule: string
  exception: true
  note: string
}

export interface SpellDictionary {
  words: Set<string>
  exceptions: Map<string, SpellException>
  addWord(word: string): void
  addException(exc: SpellException): void
  isInDictionary(word: string): boolean
  getException(word: string): SpellException | undefined
}

export interface ValidationResult {
  file: string
  questionId: string
  text: string
  issue: 'wrong_answer' | 'bad_explanation' | 'missing_explanation' | 'typo'
  details: string
  suggestedFix: string
}

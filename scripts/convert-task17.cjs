const fs = require('fs')

const content = fs.readFileSync('src/data/task17Questions.ts', 'utf-8')

const regex = /\{\s*id:\s*'([^']+)'[\s\S]*?\}(?=\s*,|\s*\])/g
const matches = [...content.matchAll(regex)]

const questions = []
for (const match of matches) {
  const objStr = match[0]
  
  const extract = (field) => {
    const m = objStr.match(new RegExp(field + ":\\s*'([^']*)'"))
    return m ? m[1] : undefined
  }
  
  const extractArray = (field) => {
    const pattern = field + ":\\s*\\[([^\\]]*)\\]"
    const m = objStr.match(new RegExp(pattern))
    if (!m) return []
    return m[1].match(/'([^']*)'/g)?.map(s => s.slice(1, -1)) || []
  }
  
  const id = extract('id')
  const type = extract('type') || 'ege-multiple'
  const text = extract('text')
  const options = extractArray('options')
  const correctAnswer = extractArray('correctAnswer')
  const explanation = extract('explanation') || ''
  const atoms = extractArray('atoms')
  
  questions.push({
    id,
    taskNumber: '17',
    type,
    text,
    options,
    correctAnswer,
    explanation,
    difficulty: 'easy',
    xpReward: 10,
    atoms: [...atoms, 'task17'],
    tags: [...atoms, 'dooshin', 'task17'],
  })
}

const questionStrings = questions.map(q => `  {
    id: '${q.id}',
    taskNumber: '${q.taskNumber}',
    type: '${q.type}',
    text: '${q.text.replace(/'/g, "\\'")}',
    options: [${q.options.map(o => `'${o}'`).join(', ')}],
    correctAnswer: [${q.correctAnswer.map(a => `'${a}'`).join(', ')}],
    explanation: '${q.explanation.replace(/'/g, "\\'").replace(/\n/g, '\\n')}',
    difficulty: '${q.difficulty}',
    xpReward: ${q.xpReward},
    atoms: [${q.atoms.map(a => `'${a}'`).join(', ')}],
    tags: [${q.tags.map(t => `'${t}'`).join(', ')}],
  }`).join(',\n\n')

const fileContent = `// Задание 17 — ${questions.length} вопросов
// Сгенерировано из task17Questions.ts

import type { UnifiedQuestion } from './types'

export const task17Questions: UnifiedQuestion[] = [
${questionStrings}
]

export const task17QuestionsById = Object.fromEntries(
  task17Questions.map(q => [q.id, q])
)
`

fs.writeFileSync('src/data/questions/task17.ts', fileContent, 'utf-8')
console.log('✅ task17.ts created with', questions.length, 'questions')
